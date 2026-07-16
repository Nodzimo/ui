## Public Package Shape

### Package Identity

- The public package name is `@nodzimo/ui`.
- The package is published publicly under the `@nodzimo` scope on npmjs.
- GitHub Packages also publishes `@nodzimo/ui` through a separate GitHub Packages registry flow; it is not an
  automatic mirror of npmjs.
- Publishing is Bun-first. Use `bun publish` for npmjs and `bun publish --registry https://npm.pkg.github.com` for
  GitHub Packages.
- The package is ESM-only.
- Do not add CJS, UMD, or IIFE outputs unless a real consumer requires them.

### Public Entrypoints

- The public JavaScript API is split into two entrypoints:
    - `@nodzimo/ui` for core/RSC-safe exports.
    - `@nodzimo/ui/client` for client-boundary exports.
- The public CSS API is split by tool:
    - `@nodzimo/ui/styles.css` is compiled runtime CSS for browsers.
    - `@nodzimo/ui/theme.css` is uncompiled theme metadata for a consumer Tailwind compiler.
- Consumers should import from public package entrypoints, not from `src` or deep internal paths.
- `files` intentionally publishes runtime build output, the exact Tailwind compiler theme, and the AI-readable
  documentation corpus:
    - `dist` contains the JS, declaration, CSS, and private chunk artifacts.
    - `src/theme.css` is the one intentionally published compiler-source file. Do not publish the rest of `src`.
    - `docs` contains versioned project doctrine and agent-operating documentation for local IDE and agent workflows.
    - `AGENTS.md` is the root entrypoint for the Agent Operating Charter.
- `README.md`, `LICENSE`, and `package.json` are included by package tooling automatically. Do not add duplicate
  entries for them unless a concrete pack inspection proves a tooling change.
- The package export map is intentionally minimal:
    - `exports["."].import` points to `dist/ui.js`.
    - `exports["."].types` points to `dist/ui.d.ts`.
    - `exports["./client"].import` points to `dist/client.js`.
    - `exports["./client"].types` points to `dist/client.d.ts`.
    - `exports["./styles.css"]` points to `dist/styles.css`.
    - `exports["./theme.css"]` points to `src/theme.css` while exposing only the stable public alias.
- Do not add documentation paths to `exports`. Markdown files are shipped as local package documentation, not as
  importable runtime API.
- Public declaration files are bundled per public entrypoint. Keep `dist/ui.d.ts` for the root/RSC-safe entry
  and `dist/client.d.ts` for the client-boundary entry. Do not publish a mirrored `dist/src` declaration tree unless a
  real tooling need appears.
- Consumers should import the library runtime stylesheet once at the app root, for example
  `import '@nodzimo/ui/styles.css'`. Tailwind consumers should additionally import `@nodzimo/ui/theme.css` immediately
  after `tailwindcss` in their global Tailwind input; see
  [Tailwind And Styles](tailwind-and-styles.md#consumer-tailwind-theme).

For source boundary rules, see [Core Vs Client](core-vs-client.md). For dependency and externalization rules, see
[Dependency Concepts](dependency-concepts.md).

### Private Build Chunks

- Vite/Rolldown may emit private shared chunks used by the public entrypoints. Keep those chunks inside `dist/internal`
  with a pattern such as `internal/[name]-[hash].js`; do not add them to `exports` or treat them as public entrypoints.
- Private chunks in `dist/internal` are still required package files because `dist/ui.js` and `dist/client.js`
  may import them through relative ESM imports.
- Avoid adding declaration files under `dist/internal` as part of the public type contract. Shared type shapes may be
  duplicated across bundled entrypoint declarations; that is preferable to exposing internal type topology.

### Package Metadata

- Avoid adding `main`, `module`, or `default` fallbacks unless a confirmed consumer needs them.
- The package license is MIT. Keep a permissive open-source license unless the project direction explicitly changes.
- Keep `publishConfig.access` set to `public` so scoped publishes do not require passing `--access public` manually.
- Do not set `publishConfig.registry` for the regular dual-registry flow. Keep npmjs as the default manual target and
  pass the GitHub Packages registry explicitly in the GitHub Actions publish command.
