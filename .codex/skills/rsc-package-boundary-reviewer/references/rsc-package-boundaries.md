# RSC Package Boundaries

## Table Of Contents

- Terminology
- Package Boundary Contracts
- App Source Vs Prebuilt Library
- Lucide Spinner Incident
- External Mechanics
- Core Rules
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

**Static Site Generation (SSG)** means the route can be prerendered at build time. SSG depends on dynamic data access,
request-time APIs, and cache behavior. SSG does not prove that every dependency in the source tree is RSC-pure.

## Package Boundary Contracts

`@sefo/nodzimo-ui` is the root entry. It is the RSC-safe surface. Code reachable from `src/index.ts`, `src/core`, and
`dist/nodzimo-ui.js` must be safe to import from a Next Server Component.

`@sefo/nodzimo-ui/client` is the client entry. `src/client.ts` must begin with `'use client'`, and `dist/client.js` must
preserve that directive. Client-only components, Base UI primitives, hooks, event-driven behavior, browser APIs, and
React Compiler output belong here.

`core` does not mean server-only. It means no client boundary is needed and the code is suitable for the RSC import
graph. This is stricter than "it can render on the server".

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

`external` does not install anything. Installation is controlled by package metadata:

- `dependencies`: installed automatically when a consumer installs `@sefo/nodzimo-ui`.
- `peerDependencies`: required from the consumer; React and React DOM belong here.
- `devDependencies`: used only for local development, tests, stories, and build tooling.

If `dist/nodzimo-ui.js` imports an externalized runtime dependency, that package must be available to the consumer
through `dependencies` or `peerDependencies`. For `lucide-react`, the current runtime contract is `dependencies` while
runtime core/client code imports it. If Lucide becomes story-only, move it to `devDependencies`.

Package managers may dedupe compatible dependency versions. If the consumer already has a compatible `lucide-react`,
there may be one shared copy. If versions conflict, the package manager may install a nested copy under the dependency
tree.

Externalizing `lucide-react` restored its package boundary. The Next consumer can then analyze Lucide as its own npm
package with its own `package.json`, ESM graph, and `sideEffects` metadata instead of seeing Lucide internals as part of
`@sefo/nodzimo-ui`.

This is the current workaround. It is boundary containment, not proof that the component is RSC-pure. If a fundamental
core primitive still renders an externalized third-party Client Component, the consumer may be able to build, but the
root API is carrying a hidden client-boundary dependency. Prefer removing that runtime dependency for high-use static
core primitives such as `Spinner`.

The workaround is also not a guarantee that every future third-party React package is safe in `src/core`.

## Core Rules

- Do not import browser-only modules in `src/core`.
- Do not use React state/effect hooks in `src/core`.
- Do not let React Compiler process `src/core`.
- Do not import `@base-ui/react` from `src/core`.
- Avoid third-party React component packages in `src/core` if they call `createContext`, hooks, providers, or browser
  APIs at module top level.
- Prefer inline SVG or generated project-owned RSC-safe icon components for fundamental core primitives.
- Keep `lucide-react` in `src/client`, stories, or demo-only code unless a core use has been inspected in the built
  output and verified in the Next consumer.
- Do not rely on SSG success alone as proof of root-entry safety.

## Dist Inspection Checklist

Run a build first:

```powershell
bun run build:all
```

Inspect the root entry:

```powershell
rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/nodzimo-ui.js
```

Interpretation:

- `react/compiler-runtime` in `dist/nodzimo-ui.js` is a root-entry failure.
- `@base-ui/react` in `dist/nodzimo-ui.js` is a root-entry failure unless a deliberate RSC compatibility decision has
  been documented and consumer-tested.
- `createContext` or `useContext` in `dist/nodzimo-ui.js` is a likely RSC failure.
- `lucide-react` as an import may be the current workaround.
- Inlined Lucide code is not acceptable in the root entry. Look for `createLucideIcon`, `Icon`, `LucideContext`,
  `forwardRef`, `useContext`, or comments/regions mentioning `node_modules/lucide-react`.

Inspect the client entry:

```powershell
Get-Content dist\client.js -TotalCount 5
rg -n "react/compiler-runtime|@base-ui/react|createContext|useContext" dist/client.js
```

Interpretation:

- `dist/client.js` should start with `"use client";`.
- Client output may contain React Compiler runtime and client libraries.

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
- The consumer build succeeds.
- The Next route table remains static/SSG where expected.
- The package `dist` was inspected for root-entry leaks; SSG success alone is not enough.
