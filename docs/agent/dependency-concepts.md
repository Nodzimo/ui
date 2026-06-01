## Dependency Concepts

### Public Entrypoints

- `exports` defines the package public entrypoints and the files consumers are allowed to import.
- Multiple entrypoints separate the RSC-safe API from the client API.
- `'use client'` is a Next/React client boundary. It must be present on the built public client entry that consumers
  import.
- React Compiler scope controls which source files get compiler runtime output.

### Externalization

- `external` in Vite/Rolldown keeps dependencies such as React out of the bundled library output. It does not remove the
  dependency from runtime; it leaves an import in `dist` for the consumer's bundler/package manager to resolve.
- `external` is a bundler contract. `dependencies` and `peerDependencies` are package-manager contracts.
- Runtime implementation dependencies used by built entrypoints should stay externalized unless the project documents a
  deliberate reason to bundle them. This keeps dependency internals and CommonJS shims out of package artifacts while
  `dependencies` ensures consumers install them.
- The Vite/Rolldown external contract is derived from `package.json` `dependencies + peerDependencies`. Do not maintain
  a separate handwritten external package list for runtime dependencies.
- The external matcher must handle both package roots and subpath imports. A package root such as `@base-ui/react` does
  not by itself cover imports such as `@base-ui/react/select`; the matcher must also accept import ids that start with
  the package name plus `/`.
- Vite/Rolldown calls the external callback for each discovered import id. This is why the helper takes an `importId`
  and returns whether that import should remain external.

### Package Metadata

- Runtime dependencies listed in `dependencies` are installed automatically when a consumer installs this package. If a
  compatible copy already exists in the consumer dependency tree, the package manager may dedupe it; if not, it may
  install a nested copy.
- `peerDependencies` declare dependencies that must be provided by the consuming app. React and React DOM are peer
  dependencies for consumers and dev dependencies for local library development.
- Keep React peer ranges intentionally scoped to React 19 with `19.x` until compatibility with later React majors is
  confirmed.
- This project intentionally tracks current bleeding-edge tooling. Keep `engines.node` as `25.x` and `engines.bun` as
  `1.3.x` unless the project deliberately moves to a new line. Use exact versions in dev dependencies and lockfiles for
  reproducible local installs; use `x` ranges for public engine/peer lines when the supported contract is the current
  major or minor line.
- Runtime implementation dependencies used by built components belong in `dependencies`, not `devDependencies`. This
  currently includes `@base-ui/react`, `class-variance-authority`, `clsx`, and `tailwind-merge`.
- Keep those runtime implementation dependencies in Vite/Rolldown `external` as well. Inlining `@base-ui/react` can copy
  `use-sync-external-store` CommonJS shims into `dist/client.js`, which can fail in Next/Turbopack browser chunks with
  dynamic `require` errors.
- Do not make implementation helpers such as `clsx`, `tailwind-merge`, or `class-variance-authority` peer dependencies
  unless they become an intentional consumer-facing contract.
- Do not move a runtime import from `dependencies` to `devDependencies` merely because it is externalized. Externalized
  runtime imports still need to be installable by consumers.
- Packages used only in Storybook stories, examples, tests, or docs belong in `devDependencies`.
- CSS utility sources that are consumed only by the Tailwind build also belong in `devDependencies`. This includes
  `tw-animate-css`: it is imported while compiling `src/styles.css` and Storybook preview CSS, then emitted into the
  built stylesheet. Consumers receive `dist/styles.css`; they do not resolve `tw-animate-css` at runtime.
