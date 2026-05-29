# Dependency Sources

Use this reference as a starting map for official upstream sources in this project. Verify source URLs against npm
metadata when a package changes ownership, homepage, or repository.

## Runtime Dependencies

| Package                    | Official sources                                    | Review focus                                                                                                                              |
|----------------------------|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `@base-ui/react`           | https://github.com/mui/base-ui, https://base-ui.com | Component API changes, accessibility behavior, interaction primitives, slot/prop contracts, CSS/data attributes used by local components. |
| `class-variance-authority` | https://github.com/joe-bell/cva                     | Variant composition API, TypeScript helper types, class output behavior.                                                                  |
| `clsx`                     | https://github.com/lukeed/clsx                      | Runtime class composition API. Usually low risk; check import/export format changes.                                                      |
| `tailwind-merge`           | https://github.com/dcastil/tailwind-merge           | Tailwind v4 class conflict rules, merge behavior used by `mergeClassNames`, support for custom utility patterns.                          |

## Peer Dependencies

| Package     | Official sources                                          | Review focus                                                                                                                                                                                                            |
|-------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `react`     | https://github.com/facebook/react, https://react.dev/blog | Peer range compatibility, React 19 support, compiler/runtime behavior, RSC-safe root exports, hooks/client component boundaries. Keep peer range intentionally scoped to `19.x` until later React majors are confirmed. |
| `react-dom` | https://github.com/facebook/react, https://react.dev/blog | Peer range compatibility, DOM rendering/hydration behavior, Storybook/Vitest browser behavior, consumer app compatibility. Keep peer range aligned with `react`.                                                        |

## Development Dependencies

| Package                         | Official sources                                                                                                                  | Review focus                                                                                                                   |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `@babel/core`                   | https://github.com/babel/babel, https://babel.dev/docs/babel-core                                                                 | React Compiler pipeline compatibility through Rolldown Babel plugin.                                                           |
| `@biomejs/biome`                | https://github.com/biomejs/biome, https://biomejs.dev                                                                             | Formatter/linter rule changes, Tailwind class sorting, JSON strictness, config schema changes, `biome migrate --write` output. |
| `@chromatic-com/storybook`      | https://github.com/chromaui/addon-visual-tests                                                                                    | Storybook visual testing addon compatibility and Storybook major alignment.                                                    |
| `@microsoft/api-extractor`      | https://github.com/microsoft/rushstack/tree/main/apps/api-extractor, https://api-extractor.com                                    | Bundled declaration rollups, TypeScript compiler support, API report/rollup behavior used through `unplugin-dts`.              |
| `@rolldown/plugin-babel`        | https://github.com/rolldown/plugins                                                                                               | Babel plugin integration with Rolldown/Vite, React Compiler include rules, build output changes.                               |
| `@storybook/addon-a11y`         | https://github.com/storybookjs/storybook, https://storybook.js.org/docs                                                           | Storybook addon compatibility, accessibility checks, Storybook 10 alignment.                                                   |
| `@storybook/addon-docs`         | https://github.com/storybookjs/storybook, https://storybook.js.org/docs                                                           | Docs addon behavior, MDX/docs config, Storybook 10 alignment.                                                                  |
| `@storybook/addon-themes`       | https://github.com/storybookjs/storybook, https://storybook.js.org/docs                                                           | Component-preview theme globals, `withThemeByClassName`, preview class synchronization, Storybook 10 alignment.                |
| `@storybook/addon-vitest`       | https://github.com/storybookjs/storybook, https://storybook.js.org/docs/writing-tests                                             | Vitest addon API, browser testing integration, Storybook test project config.                                                  |
| `@storybook/react-vite`         | https://github.com/storybookjs/storybook, https://storybook.js.org/docs/get-started/frameworks/react-vite                         | React/Vite framework integration, Vite 8 compatibility, Storybook config changes.                                              |
| `@svgr/cli`                     | https://github.com/gregberge/svgr, https://react-svgr.com/docs/cli/                                                               | Raw SVG to project-owned React icon generation, output shape, TypeScript support, SVGO behavior.                               |
| `storybook`                     | https://github.com/storybookjs/storybook, https://storybook.js.org/docs                                                           | Storybook CLI, builder, config migrations, addon compatibility across the Storybook package family.                            |
| `storybook-addon-pseudo-states` | https://github.com/chromaui/storybook-addon-pseudo-states, https://storybook.js.org/addons/storybook-addon-pseudo-states          | Pseudo-state preview addon compatibility, selector behavior, Storybook version support, hover/active story previews.           |
| `storybook-addon-rtl`           | https://github.com/literalpie/storybook-addon-rtl, https://storybook.js.org/addons/storybook-addon-rtl                            | RTL/LTR toolbar toggle compatibility, Storybook global direction behavior, logical-layout regression review.                   |
| `storybook-dark-mode`           | https://github.com/hipstersmoothie/storybook-dark-mode, https://storybook.js.org/addons/storybook-dark-mode                       | Manager and Docs dark-mode toggle compatibility, `useDarkMode` bridge behavior, separation from component themes.              |
| `@tailwindcss/cli`              | https://github.com/tailwindlabs/tailwindcss, https://tailwindcss.com/docs                                                         | CSS artifact generation from `src/styles.css` to `dist/styles.css`, CLI flags, minification behavior.                          |
| `@tailwindcss/vite`             | https://github.com/tailwindlabs/tailwindcss, https://tailwindcss.com/docs/installation/using-vite                                 | Vite plugin behavior for dev/storybook; not the publishable CSS artifact pipeline.                                             |
| `tailwindcss`                   | https://github.com/tailwindlabs/tailwindcss, https://tailwindcss.com/docs                                                         | Tailwind v4 directives, `@theme`, `@custom-variant`, utility output, token syntax, class names, CSS compilation.               |
| `@types/babel__core`            | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/babel__core                                                  | Babel config/plugin typings.                                                                                                   |
| `@types/node`                   | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node                                                         | Node API typings for configs and scripts, engine alignment.                                                                    |
| `@types/react`                  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react                                                        | React component and JSX typings, React 19 compatibility, public declaration output.                                            |
| `@types/react-dom`              | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom                                                    | React DOM typings for local dev and Storybook/testing.                                                                         |
| `@vitejs/plugin-react`          | https://github.com/vitejs/vite-plugin-react                                                                                       | React plugin behavior, React Compiler preset integration, Fast Refresh, Vite compatibility.                                    |
| `@vitest/browser-playwright`    | https://github.com/vitest-dev/vitest, https://vitest.dev/config/browser/playwright                                                | Browser provider config, Playwright integration, Storybook test project behavior.                                              |
| `@vitest/coverage-v8`           | https://github.com/vitest-dev/vitest, https://vitest.dev/guide/coverage                                                           | Coverage provider behavior and Vitest version alignment.                                                                       |
| `vitest`                        | https://github.com/vitest-dev/vitest, https://vitest.dev                                                                          | Test config schema, browser testing, Storybook addon compatibility, Vite compatibility.                                        |
| `babel-plugin-react-compiler`   | https://github.com/facebook/react/tree/main/compiler/packages/babel-plugin-react-compiler, https://react.dev/learn/react-compiler | Compiler diagnostics, generated `react/compiler-runtime` imports, client-only compiler scope.                                  |
| `dependency-cruiser`            | https://github.com/sverweij/dependency-cruiser                                                                                    | Config schema, ESM/TS parser support, peer dependency handling, dependency graph output.                                       |
| `fkill-cli`                     | https://github.com/sindresorhus/fkill-cli, https://github.com/sindresorhus/fkill                                                  | Local dev port cleanup CLI behavior, `:port` syntax, Windows process termination behavior, transitive `fkill` API.             |
| `playwright`                    | https://github.com/microsoft/playwright, https://playwright.dev                                                                   | Browser installation/runtime compatibility for Vitest browser tests and Storybook test integration.                            |
| `typescript`                    | https://github.com/microsoft/TypeScript, https://devblogs.microsoft.com/typescript/                                               | Strict type changes, project references, declaration emit, module resolution, public `.d.ts` output.                           |
| `unplugin-dts`                  | https://github.com/qmhc/unplugin-dts                                                                                              | Declaration generation, `bundleTypes`, `tsconfigPath`, package export type paths, Vite library build integration.              |
| `vite`                          | https://github.com/vitejs/vite, https://vite.dev                                                                                  | Vite 8/Rolldown library mode, config schema, plugin compatibility, `build.lib`, externals, output cleanup.                     |

## Local Review Commands

- Use `bun run deps:outdated` or `bun outdated` to see available updates.
- Use `bun run deps:update` when the user asks to update interactively.
- Use `bun run project:audit` for the regular non-package full check.
- Use `bun run build:all` after build, entrypoint, declaration, React Compiler, or CSS pipeline changes.
- Use `bun run project:verify` before publishing, tarball consumer testing, or treating dependency changes as
  package-ready.

## Source Maintenance

When a new direct dependency, peer dependency, or dev dependency is added, add an entry with:

- package name
- official repository/docs/changelog URL
- local review focus

Do not pin current installed versions in this file. Version state belongs to `package.json` and the lockfile.
