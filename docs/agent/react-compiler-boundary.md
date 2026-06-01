## React Compiler Boundary

- React Compiler must not process `src/core`.
- React Compiler is scoped to:
    - `src/client.ts`
    - everything under `src/client/`
- This is configured with `clientCompilerIncludes` in `vite.config.ts`.
- The expected build output:
    - `dist/nodzimo-ui.js` imports `react/jsx-runtime` and must not import `react/compiler-runtime`.
    - `dist/client.js` starts with `"use client";` and may import `react/compiler-runtime`.
- If `react/compiler-runtime` appears in `dist/nodzimo-ui.js`, the root entry is no longer RSC-safe.
- If `"use client";` disappears from `dist/client.js`, Next will not see the client boundary.

For the broader source boundary rules, see [Core Vs Client](core-vs-client.md). For build-output checks, see
[Verification](verification.md).
