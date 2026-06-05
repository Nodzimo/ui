## Vite Build Notes

- Library mode uses two entries:
    - `ui: 'src/index'`
    - `client: 'src/client'`
- Only `formats: ['es']` is needed for the modern target.
- The package intentionally targets the latest JavaScript surface: TypeScript app and Node configs use `target`, `lib`,
  and `module` set to `ESNext`, and Vite uses `build.target: 'esnext'` to keep library output modern with minimal
  transpilation. Keep this modern-only contract unless a real consumer needs a lower target.
- Keep React package ids external because React is a peer dependency and the client output may import React Compiler
  runtime:
    - `react`
    - `react-dom`
    - `react/jsx-runtime`
    - `react/compiler-runtime`
- The rest of the runtime externalization contract is derived from `package.json` `dependencies + peerDependencies`.
  Do not replace that derived matcher with a handwritten complete package list. See
  [Dependency Concepts](dependency-concepts.md).
- `react/compiler-runtime` is required because client output compiled by React Compiler imports it.
- Adding a package to externals is not enough by itself. If built runtime code still imports that package, keep it in
  `dependencies` or `peerDependencies` according to the package contract.
- Before adding any third-party React package to `src/core`, inspect whether it calls `createContext`, hooks, providers,
  browser APIs, or `"use client"` at module top level. Prefer `src/client` or a local RSC-safe wrapper if it does.
- `unplugin-dts` must use `tsconfigPath: 'tsconfig.app.json'`; the root `tsconfig.json` only contains project references
  from the Vite template.
- `unplugin-dts` must set plugin-local `compilerOptions.rootDir: 'src'`. This is the explicit declaration emit root for
  the library source tree and keeps bundled public declarations at `dist/ui.d.ts` and `dist/client.d.ts` instead
  of allowing root inference to emit a `dist/src` declaration tree. This became important after the
  `unplugin-dts@1.0.2` root-inference fix/behavior change exposed the previous implicit assumption.
- `unplugin-dts` should exclude Storybook story files from public declarations, for example
  `exclude: ['**/*.stories.*']`.
- `unplugin-dts` should keep `bundleTypes: true` so API Extractor emits declaration rollups for the public package
  entrypoints instead of a `dist/src` tree.
- Keep `rootDir` in the `dts(...)` plugin config, not in `tsconfig.app.json` only for declarations. The app tsconfig is
  shared by typechecking and has `noEmit`; the declaration emit root is a build-pipeline decision.
- The intended declaration config shape is:

```ts
dts({
    bundleTypes: true,
    compilerOptions: {
        rootDir: 'src',
    },
    exclude: '**/*.stories.*',
    tsconfigPath: 'tsconfig.app.json',
})
```

- If API Extractor reports that `dist/client.d.ts` or `dist/ui.d.ts` does not exist, or if generated
  declarations appear under `dist/src`, inspect `unplugin-dts` root-dir inference before adding path rewrite hooks.
- Keep `@microsoft/api-extractor` in `devDependencies`; it is build-time tooling for bundled declarations, not a
  runtime or peer dependency.
- API Extractor may warn when its bundled TypeScript compiler is older than this project's TypeScript version. Treat
  that as a tooling-version warning, not a package blocker, when declaration output is correct and the latest API
  Extractor still bundles the older compiler.
- Keep Storybook/Vitest test configuration out of `vite.config.ts`. Use `vite.config.ts` for the publishable library
  build and a separate `vitest.config.ts` for Storybook browser tests.
- In `vite.config.ts`, import `defineConfig` from `vite`. In `vitest.config.ts`, import Vitest test config helpers from
  `vitest/config`.
- If Vitest and root Vite resolve to different installed Vite copies after dependency updates, Vite config typings may
  stop accepting the `test` key. Separating `vitest.config.ts` from `vite.config.ts` avoids that coupling for the
  library build config.
- Keep non-entry build chunks visually private by setting Vite/Rolldown output names to
  `chunkFileNames: 'internal/[name]-[hash].js'`. Use `.js` explicitly; `[format]` produces format labels such as `es`
  instead of the expected JavaScript extension.
