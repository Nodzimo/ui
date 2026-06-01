---
name: rsc-package-boundary-reviewer
description: Review and document Nodzimo UI package boundaries for React Server Component safety. Use when changing src/core, src/client, public entrypoints, Vite externals, package dependencies, React Compiler scope, generated icons/SVGR config, built dist output, icon/runtime dependency leaks such as lucide-react, or investigating Next/Turbopack consumer build failures involving RSC, SSR, SSG, createContext, use client, or bundled dependency leaks.
---

# RSC Package Boundary Reviewer

## Overview

Use this skill to protect the UI kit's public package shape for Next/RSC consumers. The root entry
`@sefo/nodzimo-ui` is expected to be RSC-safe. The client entry `@sefo/nodzimo-ui/client` owns client-boundary exports
and must stay a clean library client bundle, not a copy of third-party runtime internals.

Read `references/rsc-package-boundaries.md` when the task needs the detailed model, the Lucide/Spinner postmortem, or
the full review checklist. Read it before changing package externals, dependency metadata, public entrypoints, or any
large client component built on third-party primitives.

## Boundary Model

- `src/core` and `dist/nodzimo-ui.js` are the root/RSC-safe surface.
- `src/client.ts` and `src/client/**` are the client-boundary surface. `src/client.ts` must keep `'use client'`.
- Client-safe is not the same thing as "bundle everything into the client artifact". Client code may use Base UI and
  other runtime dependencies, but the library build should normally leave those dependencies as external imports.
- `src/client/providers/**` owns framework-agnostic UI-kit providers required by client component behavior, such as
  Base UI direction context. These providers must flow only through `src/client.ts` and `@sefo/nodzimo-ui/client`.
- RSC-safe is stricter than SSR-safe. A dependency can render on the server during SSR and still be unsafe for the RSC
  import graph if it calls `createContext`, hooks, providers, or browser-only code at module top level.
- SSG output in a Next consumer proves build-time pre-rendering, not RSC purity.

## Review Workflow

1. Inspect the source boundary touched by the change.
    - For core changes, inspect imports from the component file through local barrels up to `src/index.ts`.
    - For client changes, confirm the code is reachable through `src/client.ts` and not accidentally through
      `src/index.ts`.
    - For provider changes, confirm the provider is framework-agnostic and required by UI-kit component behavior. App
      providers for locale routing, auth, data, cookies, `next-intl`, or `next-themes` belong in consumer apps, not in
      this package.
    - For dependency changes, inspect both `package.json` and `vite.config.ts`.
    - For generated icon changes, inspect `assets/icons`, `svgr.config.cjs`, `src/core/icons`, and any core component
      importing icons.

2. Build before judging the package artifact.
    - Use `bun run build:all` for source, Vite, CSS, or entrypoint changes.
    - Use `bun run project:verify` before treating a publishing/tarball as production-ready.

3. Inspect built output.
    - Root entry:
      `rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/nodzimo-ui.js`
    - Client entry:
      confirm `dist/client.js` starts with `"use client";` and may import `react/compiler-runtime`.
    - Client size sanity:
      compare the reported `dist/client.js` size to the previous build or package. A sudden large jump is a bundle
      boundary signal, not just a harmless implementation detail.
    - Client bundle safety:
      `rg -n "require\\(|Calling .require|new Proxy|use-sync-external-store|node_modules/@base-ui|node_modules/use-sync" dist/client.js`
      should not report bundled CommonJS shims or inlined dependency internals. External client imports such as
      `@base-ui/react/select` are expected when the package dependency is externalized.
    - External import sanity:
      `rg -n 'from "(@base-ui/react|class-variance-authority|clsx|tailwind-merge|react|react-dom|react/jsx-runtime|react/compiler-runtime)' dist/client.js dist/nodzimo-ui.js`
      should show runtime dependency imports as imports, not copied `node_modules` regions.
    - Declaration shape:
      confirm `dist/nodzimo-ui.d.ts` and `dist/client.d.ts` exist at the `dist` root, and that no public `dist/src`
      declaration tree is being produced. When this changes after `unplugin-dts` updates, inspect plugin-local
      `compilerOptions.rootDir: 'src'` before accepting path rewrites or exported internal type topology.
    - `lucide-react` should not appear in built package output.

4. Check dependency contracts.
    - Externalized runtime imports must still be installable through `dependencies` or required through
      `peerDependencies`.
    - React and React DOM are peers.
    - Story-only packages belong in `devDependencies`.
    - Runtime implementation dependencies used by built entries must stay listed in `dependencies` and externalized in
      Vite/Rolldown unless a deliberate exception is documented and consumer-tested.
    - The current Vite config derives externals from `dependencies + peerDependencies` and matches both package roots
      and subpath imports. Do not replace this with a handwritten list or a root-only package-name array.
    - Do not inline Base UI or its transitive CJS shims into `dist/client.js`.

5. Verify with a Next/Turbopack consumer when the root entry, externals, React Compiler, or dependency metadata changed.
    - Prefer the packed tarball before publish and the npm package after publish.
    - The consumer page should import a normal core component and any affected component.
    - Watch the route table: SSG/static output is good, but still inspect the dist artifact for RSC leaks.

## Decisions

- Keep `lucide-react` out of dependencies and source imports. Use raw SVG inputs plus generated project-owned icons
  instead. If it becomes a deliberate dependency again, revisit package metadata, Vite externals, and Next consumer
  verification before building.
- For fundamental core primitives such as `Spinner`, prefer inline SVG or generated project-owned RSC-safe icon
  components over third-party React icon packages.
- Generated icons in `src/core/icons/generated` must stay plain SVG components: no hooks, no `'use client'`, no `memo`,
  no `forwardRef`, and no runtime icon package imports.
- Hand-authored core icon wrappers, such as custom brand symbols with per-path color props, must follow the same
  RSC-safe
  SVG-only constraints and stay outside generator-owned `src/core/icons/generated`.
- When comparing against shadcn-style examples, distinguish source-in-app usage from this package's prebuilt library
  output. Next can analyze client boundaries in an app source graph, while Vite/Rolldown can erase that boundary by
  inlining dependency internals into `dist/nodzimo-ui.js`.
- Put interactive primitives, Base UI components, hooks, browser APIs, and React Compiler output in the client entry.
- Export UI-kit-owned providers only from the client entry. After adding a provider, build and verify the root artifact
  does not contain `@base-ui/react`, provider names, `createContext`, `useContext`, state/effect hooks, or
  `react/compiler-runtime`.
- Keep client-entry runtime dependencies externalized. If `dist/client.js` contains Rolldown's dynamic `require`
  helper, `use-sync-external-store` shim code, or large `node_modules/@base-ui` regions, the library has copied
  dependency internals into the browser-facing bundle and can fail under Next/Turbopack.
- Treat a Next/Turbopack browser error such as `Error: dynamic usage of require is not supported` as a likely client
  bundle externalization failure. Inspect `dist/client.js` before looking for RSC root leaks.
