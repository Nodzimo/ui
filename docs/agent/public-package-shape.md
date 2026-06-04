## Public Package Shape

### Package Identity

- The public package name is `@nodzimo/nodzimo-ui`.
- The package is published publicly under the `@nodzimo` scope on npmjs.
- GitHub Packages also publishes `@nodzimo/nodzimo-ui` through a separate GitHub Packages registry flow; it is not an
  automatic mirror of npmjs.
- The package is ESM-only.
- Do not add CJS, UMD, or IIFE outputs unless a real consumer requires them.

### Public Entrypoints

- The public API is split into two entrypoints:
    - `@nodzimo/nodzimo-ui` for core/RSC-safe exports.
    - `@nodzimo/nodzimo-ui/client` for client-boundary exports.
- Consumers should import from public package entrypoints, not from `src` or deep internal paths.
- `files: ["dist"]` keeps packed/published contents limited to build output.
- The package export map is intentionally minimal:
    - `exports["."].import` points to `dist/nodzimo-ui.js`.
    - `exports["."].types` points to `dist/nodzimo-ui.d.ts`.
    - `exports["./client"].import` points to `dist/client.js`.
    - `exports["./client"].types` points to `dist/client.d.ts`.
    - `exports["./styles.css"]` points to `dist/styles.css`.
- Public declaration files are bundled per public entrypoint. Keep `dist/nodzimo-ui.d.ts` for the root/RSC-safe entry
  and `dist/client.d.ts` for the client-boundary entry. Do not publish a mirrored `dist/src` declaration tree unless a
  real tooling need appears.
- Consumers should import the library stylesheet once at the app root, for example
  `import '@nodzimo/nodzimo-ui/styles.css'`.

For source boundary rules, see [Core Vs Client](core-vs-client.md). For dependency and externalization rules, see
[Dependency Concepts](dependency-concepts.md).

### Private Build Chunks

- Vite/Rolldown may emit private shared chunks used by the public entrypoints. Keep those chunks inside `dist/internal`
  with a pattern such as `internal/[name]-[hash].js`; do not add them to `exports` or treat them as public entrypoints.
- Private chunks in `dist/internal` are still required package files because `dist/nodzimo-ui.js` and `dist/client.js`
  may import them through relative ESM imports.
- Avoid adding declaration files under `dist/internal` as part of the public type contract. Shared type shapes may be
  duplicated across bundled entrypoint declarations; that is preferable to exposing internal type topology.

### Package Metadata

- Avoid adding `main`, `module`, or `default` fallbacks unless a confirmed consumer needs them.
- The package license is MIT. Keep a permissive open-source license unless the project direction explicitly changes.
- Keep `publishConfig.access` set to `public` so scoped publishes do not require passing `--access public` manually.
- Do not set `publishConfig.registry` unless publishing to a non-default registry is intentional.
