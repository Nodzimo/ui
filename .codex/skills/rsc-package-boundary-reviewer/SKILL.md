---
name: rsc-package-boundary-reviewer
description: Review and document Nodzimo UI package boundaries for React Server Component safety. Use when changing src/core, src/client, public entrypoints, Vite externals, package dependencies, React Compiler scope, generated icons/SVGR config, built dist output, icon/runtime dependencies such as lucide-react, or investigating Next/Turbopack consumer build failures involving RSC, SSR, SSG, createContext, use client, or bundled dependency leaks.
---

# RSC Package Boundary Reviewer

## Overview

Use this skill to protect the UI kit's public package shape for Next/RSC consumers. The root entry
`@sefo/nodzimo-ui` is expected to be RSC-safe. The client entry `@sefo/nodzimo-ui/client` owns client-boundary exports.

Read `references/rsc-package-boundaries.md` when the task needs the detailed model, the Lucide/Spinner postmortem, or
the full review checklist.

## Boundary Model

- `src/core` and `dist/nodzimo-ui.js` are the root/RSC-safe surface.
- `src/client.ts` and `src/client/**` are the client-boundary surface. `src/client.ts` must keep `'use client'`.
- RSC-safe is stricter than SSR-safe. A dependency can render on the server during SSR and still be unsafe for the RSC
  import graph if it calls `createContext`, hooks, providers, or browser-only code at module top level.
- SSG output in a Next consumer proves build-time pre-rendering, not RSC purity.

## Review Workflow

1. Inspect the source boundary touched by the change.
    - For core changes, inspect imports from the component file through local barrels up to `src/index.ts`.
    - For client changes, confirm the code is reachable through `src/client.ts` and not accidentally through
      `src/index.ts`.
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
    - `lucide-react` should not appear in the root entry while it is story-only.

4. Check dependency contracts.
    - Externalized runtime imports must still be installable through `dependencies` or required through
      `peerDependencies`.
    - React and React DOM are peers.
    - Story-only packages belong in `devDependencies`.

5. Verify with a Next/Turbopack consumer when the root entry, externals, React Compiler, or dependency metadata changed.
    - Prefer the packed tarball before publish and the npm package after publish.
    - The consumer page should import a normal core component and any affected component.
    - Watch the route table: SSG/static output is good, but still inspect the dist artifact for RSC leaks.

## Decisions

- Keep `lucide-react` story-only unless publishable runtime source imports it again. If it becomes runtime code again,
  revisit both `dependencies` and Vite externals before building.
- For fundamental core primitives such as `Spinner`, prefer inline SVG or generated project-owned RSC-safe icon
  components over third-party React icon packages.
- Generated icons in `src/core/icons/generated` must stay plain SVG components: no hooks, no `'use client'`, no `memo`,
  no `forwardRef`, and no runtime icon package imports.
- When comparing against shadcn-style examples, distinguish source-in-app usage from this package's prebuilt library
  output. Next can analyze client boundaries in an app source graph, while Vite/Rolldown can erase that boundary by
  inlining dependency internals into `dist/nodzimo-ui.js`.
- Put interactive primitives, Base UI components, hooks, browser APIs, and React Compiler output in the client entry.
