# Nodzimo UI Agent Notes

## Project Goal

- Build a modern React UI kit/library for current React and Next projects.
- Target package consumers and bundlers, not direct browser `<script>` usage.
- Keep configuration minimal and explicit. Every package field and build option should have a concrete reason.
- Prefer the smallest working modern setup over legacy fallbacks.

## Stack

- Package/runtime tooling: Bun.
- Build tool: Vite 8 library mode on Rolldown.
- Framework target: React 19.
- Language: TypeScript.
- Styling: Tailwind CSS 4.
- Formatter/linter/assist: Biome.
- React optimization: React Compiler via `@vitejs/plugin-react`, `@rolldown/plugin-babel`, and
  `babel-plugin-react-compiler`.
- Declaration generation: `unplugin-dts`.
- CSS generation: Tailwind CLI via `@tailwindcss/cli`.

## Collaboration

- Keep explanations concise, practical, and human-readable.
- When discussing architecture or config, explain what each setting is responsible for.
- Do not invent compatibility requirements. If a setting is a fallback or legacy convenience, say that clearly.
- For questions, answer first and do not edit files unless asked.
- For implementation requests, keep changes scoped and verify with the smallest relevant command.
- Preserve project style: tabs, single quotes, no semicolons, named exports.

## Biome Policy

- Keep `biome.json` compact and explicit. Prefer Biome defaults unless the project intentionally needs a different
  behavior.
- Do not add explicit defaults such as `formatter.enabled`, `linter.enabled`, `assist.enabled`, or
  `linter.rules.recommended` just for completeness.
- Keep VCS integration enabled with Git ignore support. The project relies on `.gitignore` to keep generated and
  service files such as `dist`, `node_modules`, `.idea`, and package archives out of Biome checks.
- Keep the React lint domain enabled because this is a React UI kit. Do not add the Next domain here; Next-specific
  rules belong in Next applications.
- Keep JavaScript formatter preferences explicit: single quotes, no unnecessary semicolons, single JSX quotes, and
  as-needed arrow parentheses.
- Keep JSON comments disabled. Project JSON files should be strict JSON, not JSONC.
- Do not add `files.includes` globs that duplicate `.gitignore` unless Biome needs a narrower project-specific scope.
- Do not enable global `assist/source/useSortedKeys`; it sorts whole JSON objects such as `package.json`, `scripts`,
  `exports`, and tsconfig sections into an unreadable order.
- Biome does not format Markdown in this setup. Format Markdown files manually or with the editor.

## Repository Text Format

- Keep `.gitattributes` in place to normalize text files to LF across platforms.
- Keep `.bat` and `.cmd` files as CRLF through `.gitattributes`.

## Public Package Shape

- The public npm package name is `@sefo/nodzimo-ui`.
- The package is published publicly under the personal `@sefo` npm scope. Keep this as the package namespace unless the
  project intentionally moves to a different package name with a migration plan.
- The package is ESM-only.
- Do not add CJS, UMD, or IIFE outputs unless a real consumer requires them.
- The public API is split into two entrypoints:
    - `@sefo/nodzimo-ui` for core/RSC-safe exports.
    - `@sefo/nodzimo-ui/client` for client-boundary exports.
- Consumers should import from public package entrypoints, not from `src` or deep internal paths.
- `files: ["dist"]` keeps packed/published contents limited to build output.
- The package export map is intentionally minimal:
    - `exports["."].import` points to `dist/nodzimo-ui.js`.
    - `exports["."].types` points to the generated root declaration file.
    - `exports["./client"].import` points to `dist/client.js`.
    - `exports["./client"].types` points to the generated client declaration file.
    - `exports["./styles.css"]` points to `dist/styles.css`.
- Consumers should import the library stylesheet once at the app root, for example
  `import '@sefo/nodzimo-ui/styles.css'`.
- Avoid adding `main`, `module`, or `default` fallbacks unless a confirmed consumer needs them.
- The package license is MIT. Keep a permissive open-source license unless the project direction explicitly changes.
- Keep `publishConfig.access` set to `public` so scoped publishes do not require passing `--access public` manually.
- Do not set `publishConfig.registry` unless publishing to a non-default registry is intentional.

## Source Layout

- `src/index.ts` is the root package entry and re-exports from `src/core`.
- `src/client.ts` is the client package entry. It must start with `'use client'` and re-export from `src/client/index`.
- `src/styles.css` is the global stylesheet source for the UI kit and builds to `dist/styles.css`.
- `src/lib` contains internal/shared library utilities. Keep utilities small, named clearly, and exported through local
  barrels when they are intended for cross-area source imports.
- `src/core` contains exports that are safe to import from React Server Components and ordinary modern React apps.
- `src/client` contains client-only exports such as interactive components and hooks.
- `src/client.ts` and the `src/client/` directory intentionally coexist. In `src/client.ts`, import the directory barrel
  explicitly as `./client/index` to avoid self-resolution back to `src/client.ts`.
- Keep public exports flowing through barrels, but keep the public surface intentional.
- Component folders should own their implementation files, variants, local helpers, and stories. Example:
  `src/client/components/button/button.tsx`, `button-variants.ts`, `button.stories.tsx`, and `index.ts`.
- A component folder's `index.ts` is the local public surface for that component. Export only what other project code or
  consumers should intentionally depend on.
- Aggregate barrels such as `src/client/components/index.ts`, `src/client/index.ts`, and `src/core/index.ts` are for
  public package flow. Avoid using large aggregate barrels as the default internal dependency path when a concrete
  component entrypoint is clearer.

## Internal Package Imports

- Use `package.json#imports` for internal source imports, not Vite-only `@/*` aliases.
- Keep the internal import map aligned with the barrel architecture:
    - `#lib` -> `src/lib/index.ts`
    - `#lib/*` -> `src/lib/*/index.ts`
    - `#core` -> `src/core/index.ts`
    - `#core/*` -> `src/core/*/index.ts`
    - `#client` -> `src/client/index.ts`
    - `#client/*` -> `src/client/*/index.ts`
- Use `#lib` for shared utilities such as the class-name merge helper.
- Use `#client` and `#core` when a story or internal integration should validate the public internal barrel.
- Use specific imports such as `#client/components/button` for focused component work.
- Inside one component folder, prefer relative imports such as `./button-variants`; do not route local implementation
  details through `#client` or `#core`.
- Do not import from the public package name (`@sefo/nodzimo-ui`) inside this package's source. Public package imports
  are
  for consumers.

## Core Vs Client

- `core` does not mean server-only. It means no client boundary is required.
- `core` code must not depend on browser-only APIs, React state/effect hooks, event-driven behavior, or React Compiler
  runtime.
- `client` code may use state, effects, refs, browser APIs, interactive behavior, and React Compiler.
- A Server Component may render a Client Component. That does not automatically make a Next route dynamic;
  static/dynamic rendering depends on Next dynamic APIs and data access, not merely on client components.

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

## Dependency Concepts

- `exports` defines the package public entrypoints and the files consumers are allowed to import.
- `external` in Vite/Rolldown keeps dependencies such as React out of the bundled library output.
- `peerDependencies` declare dependencies that must be provided by the consuming app. React and React DOM are peer
  dependencies for consumers and dev dependencies for local library development.
- Keep React peer ranges intentionally scoped to React 19 with `19.x` until compatibility with later React majors is
  confirmed.
- Runtime implementation dependencies used by built components belong in `dependencies`, not `devDependencies`. This
  currently includes `@base-ui/react`, `class-variance-authority`, `clsx`, and `tailwind-merge`.
- Do not make implementation helpers such as `clsx`, `tailwind-merge`, or `class-variance-authority` peer dependencies
  unless they become an intentional consumer-facing contract.
- `'use client'` is a Next/React client boundary. It must be present on the built public client entry that consumers
  import.
- Multiple entrypoints separate the RSC-safe API from the client API.
- React Compiler scope controls which source files get compiler runtime output.

## Tailwind And Styles

- Tailwind is used as build-time styling tooling for the library, not as a runtime dependency for consumers.
- Keep `tailwindcss` and `@tailwindcss/cli` in `devDependencies`; consumers receive built CSS from `dist/styles.css`.
- Do not rely on consumer Tailwind scanning to style library components. A Next consumer may appear to pick up some
  utility classes from the package, but that is incidental and not the package contract.
- Do not import `src/styles.css` from `src/index.ts` or `src/client.ts` just to pull CSS into the JS graph. The library
  has separate core and client JS entrypoints, and global styles should remain an explicit stylesheet import.
- Do not add a CSS entry to Vite library entries for the current setup. CSS is generated directly with Tailwind CLI:
  `src/styles.css -> dist/styles.css`.
- Do not treat `@tailwindcss/vite`, if present, as the production CSS artifact pipeline; the publishable stylesheet is
  still generated by `build:css`.
- `build:css` should use `--minify` for the publishable CSS artifact. Use the CSS watch script for iterative rebuilds.
- Vite cleans `dist` during `vite build`, so full builds must run JS/type build first and CSS build afterward.
- Design direction: components should be styled and usable by default, but themeable through CSS variables/tokens rather
  than hard-coded project-specific colors long term.

## Theme Token Contract

- Use the shadcn theme architecture as the baseline model, adapted for a publishable library.
- All library-owned semantic tokens must use the `nui` namespace. Raw variables use `--nui-*`, Tailwind color mappings
  use `--color-nui-*`, radius mappings use `--radius-nui-*`, and spacing mappings use `--spacing-nui-*`.
- Components must use NUI-prefixed semantic utilities such as `bg-nui-primary`, `text-nui-foreground`,
  `border-nui-border`, `ring-nui-ring`, and `rounded-nui-lg`.
- Do not introduce unprefixed shadcn app-level tokens such as `--primary`, `bg-primary`, `border-border`, `ring-ring`,
  `bg-background`, or `text-foreground` in library source.
- Preserve normal Tailwind structural utilities such as `flex`, `inline-flex`, `items-center`, `gap-2`, `px-2.5`,
  `text-sm`, `size-8`, `transition-all`, and `disabled:opacity-50`; prefix only theme-facing design-system utilities.
- Keep `@custom-variant dark (&:is(.dark *));` because components may use Tailwind `dark:` variants.
- Dark mode overrides should redefine the same `--nui-*` raw variables under `.dark`; do not create separate
  `*-dark` token names.
- The library's broad foundation styles are opt-in through `.nui-root`, not global `body` or global `*` selectors:
    - `.nui-root *` applies `border-nui-border` and `outline-nui-ring/50`.
    - `.nui-root` applies `bg-nui-background` and `text-nui-foreground`.
    - Any global-feeling restoration such as pointer cursors for buttons must also be scoped under `.nui-root`.
- Consumers that want the full NUI foundation should add `nui-root` at the app root or a subtree root. Consumers that
  only
  want individual components can import the stylesheet without opting into app-wide foundation styling.
- Use `src/styles.css` as the source of truth for available theme tokens before adapting a copied component.

## Component Styling

- Base interactive primitives are built on `@base-ui/react` where appropriate.
- Use `class-variance-authority` for component variant class composition when a component has meaningful variants or
  sizes.
- Use the internal class-name merge helper from `#lib` for combining generated variant classes with caller `className`.
  The helper implementation is intentionally descriptive (`mergeClassNames`) and may be re-exported as a short internal
  alias such as `mcn`.
- When porting components from shadcn, Radix examples, or other Tailwind sources, preserve behavior and structure but
  adapt theme-facing classes to the NUI token namespace.
- Use the repo skill `.codex/skills/theme-token-adapter` for repeated token-prefix adaptation and review work.

## Vite Build Notes

- Library mode uses two entries:
    - `nodzimo-ui: 'src/index'`
    - `client: 'src/client'`
- Only `formats: ['es']` is needed for the modern target.
- Keep these externals:
    - `react`
    - `react-dom`
    - `react/jsx-runtime`
    - `react/compiler-runtime`
- `react/compiler-runtime` is required because client output compiled by React Compiler imports it.
- `unplugin-dts` must use `tsconfigPath: 'tsconfig.app.json'`; the root `tsconfig.json` only contains project references
  from the Vite template.

## Storybook

- Storybook is used for component documentation, visual review, and optional testing. It is not part of the library's
  published JS entrypoints.
- Import the library stylesheet in `.storybook/preview.ts` with `import '../src/styles.css'` so stories render with the
  same CSS contract consumers receive.
- Keep Storybook TypeScript context separate from the library source TypeScript context. A `.storybook/tsconfig.json`
  may extend the app tsconfig so Storybook config files understand Vite CSS imports without adding `.storybook` to the
  library `tsconfig.app.json` include list.
- Prefer colocated stories beside real components, for example `src/client/components/button/button.stories.tsx`.
- Use kebab-case filenames for stories when that matches the component folder style; the important Storybook convention
  is the `.stories` segment, not PascalCase.
- Do not keep Storybook onboarding/demo components, CSS, MDX, or assets as part of the long-term component architecture.
  The generated `src/stories` folder is disposable onboarding material unless intentionally repurposed for docs.
- Top-level MDX documentation may live separately from component folders, but it should be project documentation, not
  generated onboarding content.
- CSF 3 is the stable default story format. CSF Next is not related to Next.js; it is an experimental next Component
  Story
  Format. Do not switch to CSF Next unless the project explicitly accepts preview API churn.

## Local Consumer Testing

- `bun link` works in simple Vite/React consumers, but it is not reliable with Next 16 Turbopack.
- Next 16 Turbopack can fail to resolve linked/junction packages even when Node, Bun, and IDE resolution work.
- Avoid using `turbopack.root` as a workaround unless the parent folder is a real monorepo root with its own
  `package.json` and `node_modules`. Setting the root to the sibling parent can break Tailwind/PostCSS dependency
  resolution in the Next app.
- Avoid `file:../nodzimo-ui` as a folder dependency with Bun on Windows. Bun can try to copy the whole working
  directory, including `.git`, and fail with `EPERM`.
- Preferred Next/Turbopack consumer flow after publication:
    1. Publish a new package version from this project.
    2. Install or update the package in the consumer with `bun add "@sefo/nodzimo-ui"` or `bun update @sefo/nodzimo-ui`.
    3. Import from `@sefo/nodzimo-ui`, `@sefo/nodzimo-ui/client`, and `@sefo/nodzimo-ui/styles.css`.
- Tarball testing remains useful before publishing a version:
    1. Run `bun run lib:pack` in this project.
    2. Install the generated `nodzimo-ui.tgz` in the Next consumer.
    3. Reinstall the tarball in the consumer after each library rebuild.
- Keep generated `.tgz` archives out of git.

## npm Publishing

- Manual npm publishing is the current release flow.
- Use the `sefo` npm account for the `@sefo/nodzimo-ui` package.
- Use interactive npm authentication with 2FA for manual publishing; do not store npm access tokens in the repository.
- For future CI/CD publishing, prefer npm Trusted Publishing/OIDC over long-lived npm tokens.
- Before publishing, run `bun run build:all` and inspect the package with `npm pack --dry-run` or
  `bun pm pack --dry-run`.
- Use `npm publish` through `bun run publish:npm` after confirming the package contents.
- Version `0.x` is acceptable while the library is early and primarily used by the author's own projects.

## Scripts

- `bun run build` runs TypeScript project checks and Vite library build.
- `bun run build:ts` runs TypeScript project checks via `tsc --build`.
- `bun run build:ts-watch` watches TypeScript project checks.
- `bun run build:js` runs the Vite library build.
- `bun run build:js-watch` watches the Vite library build.
- `bun run build:css` builds `src/styles.css` to minified `dist/styles.css`.
- `bun run build:css-watch` watches and rebuilds the CSS output.
- `bun run build:all` runs the JS/type build and then the CSS build. Keep this order because Vite clears `dist`.
- `bun run lib:pack` runs `build:all` and packs the package as `nodzimo-ui.tgz`.
- `bun run check:lint` runs Biome checks.
- `bun run check:format` runs only Biome formatting.
- `bun run check:fix` applies safe Biome fixes, formatting, and import organization.
- `bun run check:fix-unsafe` applies unsafe Biome fixes intentionally.
- `bun run deps:outdated` checks dependency updates.
- `bun run publish:npm` publishes the package to npm using the package's `publishConfig`.
- `bun run publish:who` checks the active npm account.
- `bun run publish:login` starts npm login.
- `bun run publish:bump` bumps the package patch version with npm.
- `bun run publish:fund` checks package funding metadata.
- `bun run publish:fix` asks npm to normalize package metadata.

## Verification

- Use `bun run build:all` after changing Vite config, package exports, type generation, source entrypoints, React
  Compiler scope, Tailwind styles, or client/core boundaries.
- Confirm `dist/styles.css` exists after `bun run build:all` when changing style build scripts or Tailwind setup.
- Inspect `dist/nodzimo-ui.js` and `dist/client.js` after build changes that affect React Compiler or entrypoints.
- For Next/Turbopack consumer checks, install the published `@sefo/nodzimo-ui` package in the Next app. Use tarball
  testing only when validating changes before publication.
- If a client component fails in Next with compiler runtime errors, check whether `"use client";` is present in the
  built client entry.
- If a core component fails in a Server Component context, check whether `react/compiler-runtime` leaked into the root
  bundle.
