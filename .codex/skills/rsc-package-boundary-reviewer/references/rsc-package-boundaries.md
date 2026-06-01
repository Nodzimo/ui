# RSC Package Boundaries

## Table Of Contents

- Terminology
- Package Boundary Contracts
- App Source Vs Prebuilt Library
- Lucide Spinner Incident
- Base UI Select Client Bundle Incident
- External Mechanics
- Library Externalization Contract
- Core Rules
- Client Bundle Rules
- Generated Icon Rules
- Dist Inspection Checklist
- Consumer Verification

## Terminology

**React Server Components (RSC)** are compiled through React's `react-server` condition. In that graph, React exposes a
restricted server surface. In React 19, `react-server` has `createElement` and `forwardRef`, but it does not expose
`createContext` or `useContext`. Module top-level code that calls `createContext` can fail during module evaluation,
before any component is rendered.

**Server-side rendering (SSR)** is ordinary server rendering with React's normal server renderer. SSR server chunks may
use APIs such as `createContext`, `forwardRef`, `createElement`, and `useContext`. A component can be SSR-safe but not
RSC-pure.

**Client Components** are modules behind a `'use client'` boundary. They can use state, effects, event handlers, browser
APIs, context providers, and interactive libraries. A Server Component may render a Client Component; Next records the
boundary and sends a reference to the client.

**Static Site Generation (SSG)** means the route can be pre-rendered at build time. SSG depends on dynamic data access,
request-time APIs, and cache behavior. SSG does not prove that every dependency in the source tree is RSC-pure.

## Package Boundary Contracts

`@sefo/nodzimo-ui` is the root entry. It is the RSC-safe surface. Code reachable from `src/index.ts`, `src/core`, and
`dist/nodzimo-ui.js` must be safe to import from a Next Server Component.

`@sefo/nodzimo-ui/client` is the client entry. `src/client.ts` must begin with `'use client'`, and `dist/client.js` must
preserve that directive. Client-only components, Base UI primitives, hooks, event-driven behavior, browser APIs, and
React Compiler output belong here.

`core` does not mean server-only. It means no client boundary is needed and the code is suitable for the RSC import
graph. This is stricter than "it can render on the server".

The public declaration topology mirrors the public JavaScript topology. `dist/nodzimo-ui.d.ts` is the root/RSC-safe type
surface, and `dist/client.d.ts` is the client-boundary type surface. Do not publish a mirrored `dist/src` declaration
tree as part of the package contract unless a real tooling need appears.

`unplugin-dts` should keep this topology explicit with plugin-local `compilerOptions.rootDir: 'src'`, alongside
`bundleTypes: true` and `tsconfigPath: 'tsconfig.app.json'`. This is the clean declaration-build contract, not a path
rewrite workaround. If an update emits declarations under `dist/src` or API Extractor cannot find `dist/client.d.ts`,
fix the declaration root first.

## App Source Vs Prebuilt Library

Do not assume an example copied from an app-source component library has the same boundary behavior after this package
bundles it.

In a shadcn-style app-source setup, a component can import `lucide-react` directly and still omit `'use client'` in that
local wrapper. Next sees the app source graph and can continue into `lucide-react` as a separate package. If Lucide
marks
its own modules as client boundaries, Next can classify that dependency at the package/module boundary.

In this UI kit, Vite/Rolldown produces a prebuilt package entry. If a third-party React package is not externalized, its
internals can be copied into `dist/nodzimo-ui.js`. After that, Next no longer sees "a clean root entry that imports a
separate package with its own directives"; it sees `@sefo/nodzimo-ui` itself executing the copied code. If that copied
code calls `createContext` or hooks under the `react-server` condition, the root entry is no longer RSC-safe.

This distinction is why "shadcn does it" and "the dependency is tree-shakable" are not sufficient arguments for putting
the same runtime import in `src/core`. Tree-shaking can reduce the amount of copied code while still copying the exact
client/context helper that breaks the RSC graph.

## Lucide Spinner Incident

The root cause was `Spinner` in `src/core` importing `Loader2Icon` from `lucide-react`.

Before `lucide-react` was externalized in Vite/Rolldown, the library build copied Lucide internals into
`dist/nodzimo-ui.js`. The root entry then contained code equivalent to:

```js
import {createContext, createElement, forwardRef, useContext} from 'react'

const LucideContext = createContext({})
```

The Next consumer imported `Card` from `@sefo/nodzimo-ui`, but `Spinner` was also exported by the same root barrel.
Since
Lucide internals were already inlined into the root entry, the consumer's RSC graph evaluated the module under the
`react-server` condition. `react-server` does not expose `createContext`, so the build failed with:

```text
TypeError: createContext is not a function
```

The failure was not caused by two React instances. It was an RSC import-graph violation caused by inlined third-party
React code inside the root entry.

## Base UI Select Client Bundle Incident

The second package-boundary incident happened in the client entry, not in the root/RSC entry.

Before the incident, `vite.config.ts` externalized React-related imports only. Runtime implementation dependencies such
as `@base-ui/react`, `class-variance-authority`, `clsx`, and `tailwind-merge` were listed correctly in
`dependencies`, but they were not externalized in the library build.

The Button component already used Base UI. The published `@sefo/nodzimo-ui@0.0.6` client artifact copied a small Base UI
slice into `dist/client.js`, but it did not copy the dangerous CommonJS shim path. The artifact was roughly 19 KB and
the issue remained hidden.

The Select component changed the shape of the Base UI dependency graph. Select pulled popup positioning, floating UI,
store utilities, list navigation, portal behavior, scroll locking, and `use-sync-external-store` helpers. Because
`@base-ui/react` was still not externalized, Rolldown copied those internals into `dist/client.js`. The published
`@sefo/nodzimo-ui@0.0.7` client artifact grew to roughly 198 KB and contained Rolldown's dynamic CommonJS helper:

```text
typeof require
new Proxy
Calling `require` ...
use-sync-external-store
node_modules/@base-ui
```

A Next/Turbopack consumer then failed in a browser chunk with an error in this family:

```text
Error: dynamic usage of require is not supported
```

This was not an RSC-root leak. The root artifact stayed clean. The failure was a client bundle externalization failure:
the library shipped copied third-party runtime internals instead of leaving them as external package imports for the
consumer bundler to resolve.

The source trigger was the Select component, but the architectural bug was older: runtime dependencies were allowed to
be bundled into library output unless they were manually added to Vite/Rolldown `external`. Button did not prove the
policy was correct; it only failed to exercise the dangerous dependency path.

Types were not the cause. TypeScript declarations and prop typing are erased from runtime output. The copied code came
from runtime imports such as:

```ts
import {Select as SelectPrimitive} from '@base-ui/react/select'
```

The fix is not to move Base UI to `devDependencies` and not to make the consumer manually install Base UI. Base UI is a
runtime implementation dependency, so it belongs in `dependencies`. The fix is to keep runtime dependencies installable
through package metadata while externalizing them from this library's bundled output.

## External Mechanics

`external` in Vite/Rolldown is a bundler instruction: keep a package out of this library's bundled output and leave an
import in `dist`.

Without external:

```js
// dist/nodzimo-ui.js
import {createContext} from 'react'

const LucideContext = createContext({})
// Lucide implementation has been copied into the root entry.
```

With external:

```js
// dist/nodzimo-ui.js
import {Loader2Icon} from 'lucide-react'
```

The same rule applies to the client entry.

Without external:

```js
// dist/client.js
// Nodzimo UI code
// Base UI internals
// Floating UI internals
// use-sync-external-store shim
// Rolldown runtime helper for dynamic require
```

With external:

```js
// dist/client.js
import {Button} from '@base-ui/react/button'
import {Select} from '@base-ui/react/select'
import {cva} from 'class-variance-authority'

// Nodzimo UI code
```

The library bundle contains this package's implementation plus external imports. The consumer package manager installs
dependencies declared by this package, and the consumer bundler resolves those imports while building the final
application.

`external` does not install anything. Installation is controlled by package metadata:

- `dependencies`: installed automatically when a consumer installs `@sefo/nodzimo-ui`.
- `peerDependencies`: required from the consumer; React and React DOM belong here.
- `devDependencies`: used only for local development, tests, stories, and build tooling.

If `dist/nodzimo-ui.js` imports an externalized runtime dependency, that package must be available to the consumer
through `dependencies` or `peerDependencies`. `lucide-react` is no longer a package dependency, including for stories;
use raw SVG inputs plus generated project-owned icons instead of reintroducing the React icon package for convenience.

Package managers may dedupe compatible dependency versions. If a future runtime dependency is added and the consumer
already has a compatible version, there may be one shared copy. If versions conflict, the package manager may install a
nested copy under the dependency tree.

Externalizing `lucide-react` restored its package boundary. The Next consumer can then analyze Lucide as its own npm
package with its own `package.json`, ESM graph, and `sideEffects` metadata instead of seeing Lucide internals as part of
`@sefo/nodzimo-ui`.

This was the temporary workaround. It is boundary containment, not proof that the component is RSC-pure. If a
fundamental core primitive renders an externalized third-party Client Component, the consumer may be able to build, but
the root API is carrying a hidden client-boundary dependency. Prefer removing that runtime dependency for high-use
static
core primitives such as `Spinner`.

The workaround is also not a guarantee that every future third-party React package is safe in `src/core`.

## Library Externalization Contract

For this package, runtime dependencies used by built entries are both package-manager contracts and bundler-boundary
contracts:

- `dependencies` contains runtime implementation dependencies that consumers receive automatically.
- `peerDependencies` contains runtime dependencies the consuming app must provide, especially React and React DOM.
- `devDependencies` contains local-only tooling, stories, tests, docs, generators, and build-time packages.
- Vite/Rolldown `external` is derived from `dependencies + peerDependencies`.

Do not hand-maintain a separate external list for runtime packages. A manual list can drift from `package.json`; that is
how a new runtime dependency can silently flow into `dist`.

The current config intentionally uses an `external` callback rather than a plain package-name array:

```ts
const {dependencies, peerDependencies} = packageJson

const runtimePackageNames = [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
]

function isExternalRuntimeImport(importId: string) {
    return runtimePackageNames.some((packageName) => {
        return importId === packageName || importId.startsWith(`${packageName}/`)
    })
}
```

Rolldown calls this function for each discovered import id. The project does not call it manually. For example, when
Rolldown sees:

```ts
import {Select} from '@base-ui/react/select'
```

it can evaluate the external callback with:

```ts
isExternalRuntimeImport('@base-ui/react/select')
```

The function returns `true` because `@base-ui/react/select` starts with `@base-ui/react/`, so Rolldown leaves the import
external instead of copying Base UI internals into `dist/client.js`.

Root-only package-name arrays are not enough for subpath imports. A string such as `@base-ui/react` does not reliably
match `@base-ui/react/select`, `@base-ui/react/button`, or `@base-ui/react/direction-provider`. The callback must check
both:

- exact package root: `importId === packageName`
- package subpath: the import id starts with the package name followed by `/`

The slash matters. It prevents `react` from accidentally matching `react-dom`, while still matching `react/jsx-runtime`
and `react/compiler-runtime`. `react-dom` is matched separately because it is its own peer dependency.

This contract does not mean consumers manually install implementation dependencies. Consumers install
`@sefo/nodzimo-ui`; their package manager installs this package's `dependencies`, and their bundler resolves the
external imports in the final app graph. React and React DOM remain peer dependencies because the consuming app must own
the React instance.

## Core Rules

- Do not import browser-only modules in `src/core`.
- Do not use React state/effect hooks in `src/core`.
- Do not let React Compiler process `src/core`.
- Do not import `@base-ui/react` from `src/core`.
- Avoid third-party React component packages in `src/core` if they call `createContext`, hooks, providers, or browser
  APIs at module top level.
- Keep framework-agnostic UI-kit providers under `src/client/providers` and export them only from
  `@sefo/nodzimo-ui/client`. Providers required by Base UI component behavior, such as direction context, belong there.
- Do not move app-owned providers into the UI kit. Locale routing, framework theme adapters, auth, data, cookies,
  `next-intl`, `next-themes`, and other framework/business providers belong in consumer apps unless the UI kit itself
  requires a framework-agnostic provider for its own components.
- Prefer inline SVG or generated project-owned RSC-safe icon components for fundamental core primitives.
- Keep `lucide-react` out of stories, demos, and runtime source. Use generated project-owned icons from raw SVG inputs.
  If the package is deliberately reintroduced, inspect the built output and verify a Next consumer before accepting it.
- Do not rely on SSG success alone as proof of root-entry safety.

## Client Bundle Rules

- `dist/client.js` must start with `"use client";`.
- `react/compiler-runtime` is allowed in `dist/client.js` and must not appear in `dist/nodzimo-ui.js`.
- External runtime imports such as `@base-ui/react/select` are expected in `dist/client.js`.
- Large `node_modules/...` regions inside `dist/client.js` are package-boundary signals. They mean the library has
  copied dependency internals into its own artifact.
- A sudden client artifact size jump is a signal. It must trigger built-output inspection before publish.
- `require(`, `Calling \`require\``, `new Proxy`, `use-sync-external-store`, and copied `node_modules/@base-ui` regions
  in `dist/client.js` are unacceptable unless a deliberate exception has been documented and verified in a
  Next/Turbopack consumer.
- Do not treat "it works in Storybook" or "it works in library dev mode" as proof that the published client entry is
  clean. Inspect `dist/client.js`.
- Do not move runtime implementation dependencies to `devDependencies` to hide them from the external callback. If
  built output imports a package at runtime, it must be available to consumers through `dependencies` or
  `peerDependencies`.
- Do not make implementation helpers such as `clsx`, `tailwind-merge`, or `class-variance-authority` peer dependencies
  unless they become an intentional consumer-facing contract.
- Do not replace the derived external callback with a handwritten list unless the project deliberately changes the
  package-boundary contract and documents the exception.

## Generated Icon Rules

Generated project-owned icons are the preferred solution for RSC-safe core icons.

- Raw SVG inputs live under `assets/icons`, grouped by source or category such as `lucide`, `brand`, or `custom`.
- SVGR CLI is the generator. It is a dev-only build tool, not a Vite plugin and not a runtime dependency.
- Generated TSX output lives under `src/core/icons/generated`; treat it as generator-owned. Delete and regenerate it
  instead of editing component implementation details by hand.
- Keep `svgr.config.cjs` compact. Do not restate explicit defaults; each option should change project output.
- Raw third-party SVG files, including Lucide-sourced files, should be cleaned before generation. Remove source `class`
  attributes because they are raw SVG styling hooks and become noisy generated `className` values.
- Preserve `viewBox`, `stroke='currentColor'`, and outline `fill='none'` unless the asset is intentionally solid,
  brand-colored, or multicolor.
- For fillable outline icons such as hearts or stars, keep one outline source and let usage pass `fill='currentColor'`
  plus `strokeWidth={0}` or equivalent classes when the active state should be filled.
- Generated icon output should contain only plain SVG components and type-only React imports. It must not contain hooks,
  `'use client'`, `memo`, `forwardRef`, `lucide-react`, `@iconify/react`, or other icon runtime imports.

## Dist Inspection Checklist

Run a build first:

```powershell
bun run build:all
```

Inspect the root entry:

```powershell
rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/nodzimo-ui.js
```

Inspect declaration topology:

```powershell
Get-ChildItem dist -Recurse -Filter *.d.ts
```

Expected result: root public declarations are `dist/nodzimo-ui.d.ts` and `dist/client.d.ts`; there should be no public
`dist/src` declaration tree.

For provider changes, also search root declarations and the client artifact:

```powershell
rg -n "DirectionProvider|useDirection|direction-provider|@base-ui/react" dist/nodzimo-ui.js dist/nodzimo-ui.d.ts
rg -n "DirectionProvider|useDirection|direction-provider|@base-ui/react" dist/client.js dist/client.d.ts
```

Expected result: no provider or Base UI hits in the root entry or root declaration file; provider hits may appear in the
client entry and client declarations.

Interpretation:

- `react/compiler-runtime` in `dist/nodzimo-ui.js` is a root-entry failure.
- `@base-ui/react` in `dist/nodzimo-ui.js` is a root-entry failure unless a deliberate RSC compatibility decision has
  been documented and consumer-tested.
- `createContext` or `useContext` in `dist/nodzimo-ui.js` is a likely RSC failure.
- `lucide-react` in `dist/nodzimo-ui.js` is a package-boundary regression.
- Inlined Lucide code is not acceptable in the root entry. Look for `createLucideIcon`, `Icon`, `LucideContext`,
  `forwardRef`, `useContext`, or comments/regions mentioning `node_modules/lucide-react`.

Inspect the client entry:

```powershell
Get-Content dist\client.js -TotalCount 5
rg -n "react/compiler-runtime|@base-ui/react" dist/client.js
rg -n "require\\(|Calling .require|new Proxy|use-sync-external-store|node_modules/@base-ui|node_modules/use-sync" dist/client.js
rg -n 'from "(@base-ui/react|class-variance-authority|clsx|tailwind-merge|react|react-dom|react/jsx-runtime|react/compiler-runtime)' dist/client.js dist/nodzimo-ui.js
```

Interpretation:

- `dist/client.js` should start with `"use client";`.
- Client output may import React Compiler runtime and client libraries.
- The CommonJS shim scan should return no hits.
- The external import sanity scan should show package imports, not copied `node_modules` regions.
- `dist/nodzimo-ui.js` may import `react/jsx-runtime`, but it must not import `react/compiler-runtime`.
- Compare the emitted file sizes shown by Vite. A client bundle that jumps from tens of kilobytes to hundreds of
  kilobytes needs explanation before publish.

## Consumer Verification

Use tarball testing before publish:

```powershell
# in nodzimo-ui
bun run project:verify

# in the Next consumer
bun run ui:reinstall
bun run build
```

Use the npm package after publish:

```powershell
bun update @sefo/nodzimo-ui --latest
bun run build
```

Verify at least:

- A page imports a normal core component such as `Card`.
- A page imports any affected core component, such as `Spinner`.
- A page imports any affected client component from `@sefo/nodzimo-ui/client`, such as `Button`, `Select`, or a
  provider.
- The consumer build succeeds.
- The consumer dev server starts when the incident was a dev-only browser chunk failure.
- The Next route table remains static/SSG where expected.
- The package `dist` was inspected for both root-entry leaks and client bundle leaks; SSG success alone is not enough.
