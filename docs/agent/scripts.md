## Scripts

### Project-Level Scripts

- `bun run project:audit` is the main audit button. It runs TypeScript checks, Biome checks, dependency graph checks,
  and dependency update visibility checks.
- `bun run project:verify` is the main full verification button. It installs dependencies, runs `project:audit`, builds
  icons, builds JS/types, builds CSS, packs `nodzimo-ui.tgz`, and builds the public static Storybook.

### Build Scripts

- `bun run dev` starts the regular Vite dev server.
- `bun run preview` starts Vite preview for the built Vite app output.
- `bun run build:icons` regenerates icon components from `assets/icons` through SVGR and applies the project's Biome
  fix flow to the generated output.
- `bun run build` runs TypeScript project checks and Vite library build.
- `bun run build:ts` runs TypeScript project checks via `tsc --build`.
- `bun run build:ts-watch` watches TypeScript project checks.
- `bun run build:js` runs the Vite library build.
- `bun run build:js-watch` watches the Vite library build.
- `bun run build:css` builds `src/styles.css` to minified `dist/styles.css`.
- `bun run build:css-watch` watches and rebuilds the CSS output.
- `bun run build:all` regenerates icons, runs the JS/type build, and then builds CSS. Keep CSS after Vite because Vite
  clears `dist`.

### Storybook Scripts

- `bun run storybook` starts the regular Storybook dev server.
- `bun run storybook:docs` starts Storybook in docs-focused dev mode.
- `bun run storybook:build` builds the full public static Storybook into `storybook-static`.
- `bun run storybook:build-test` is a test-optimized Storybook build script. Do not use it for the public deployment
  unless the project intentionally switches the deployed Storybook to test-mode output.
- `bun run storybook:build-docs` builds the docs-focused static Storybook output.
- `bun run storybook:serve` serves the already-built `storybook-static` directory through `bunx http-server` for
  production-like local runtime checks. `http-server` is intentionally invoked through `bunx` instead of being pinned in
  `devDependencies` while the published package is stale; revisit this if the package is actively maintained again.
  Keep `-c-1` because `http-server` does not support a long `--cache -1` flag in the tested version.
- `bun run storybook:preview` runs the public static Storybook build and then serves `storybook-static`. Use this when a
  bug appears only after deployment or production build; the dev server is not enough for those incidents.
- `bun run storybook:test` runs the Storybook Vitest browser test project.
- `bun run storybook:upgrade` runs Storybook's upgrade command through `bunx`.

### Package Scripts

- `bun run lib:pack` only packs the current build output as `nodzimo-ui.tgz`; it intentionally does not build. Use it
  after `build:all` or through `project:verify`.
- `bun run lib:link` and `bun run lib:unlink` run Bun's local package link helpers. Prefer published package or tarball
  testing for Next/Turbopack consumers; see [Local Consumer Testing](local-consumer-testing.md).

### Check Scripts

- `bun run check:lint` runs Biome checks.
- `bun run check:deps` runs dependency-cruiser against `src`.
- `bun run check:deps-graph` generates `dependency-graph.svg` from dependency-cruiser output and requires Graphviz
  `dot`.
- `bun run check:format` runs only Biome formatting.
- `bun run check:fix` applies safe Biome fixes, formatting, and import organization.
- `bun run check:fix-unsafe` applies unsafe Biome fixes intentionally.
- `bun run biome:migrate` runs Biome's local migration command after a Biome dependency update.

### Cleanup Scripts

- `bun run clean:dist` removes generated distribution artifacts and small generated project files.
- `bun run clean:modules` removes dependency installs.
- `bun run clean:storybook` removes generated Storybook output.
- `bun run clean:all` removes distribution artifacts, generated Storybook output, and dependency installs.
- `bun run clean:ports` uses `fkill-cli` to free the known local development ports: `5173`, `4173`, `6006`, and `6007`.
  Ports must stay prefixed with `:` in the script because bare numbers are process ids for `fkill`.

### Dependency And Publishing Scripts

- `bun run deps:install` installs dependencies.
- `bun run deps:outdated` checks dependency updates.
- `bun run deps:update` starts Bun's interactive dependency update flow.
- `bun run publish:npm` publishes the package to npm using the package's `publishConfig`.
- `bun run publish:who` checks the active npm account.
- `bun run publish:login` starts npm login.
- `bun run publish:bump` bumps the package patch version with npm.
- `bun run publish:fund` checks package funding metadata.
- `bun run publish:fix` asks npm to normalize package metadata.

### Git Helper Scripts

- `bun run git:status`, `bun run git:pull`, `bun run git:stash`, `bun run git:stash-pop`, `bun run git:reset`, and
  `bun run git:normalize` are lightweight local git helpers.
