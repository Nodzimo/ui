## Storybook Configuration

- Storybook is used for component documentation, visual review, and optional testing. It is not part of the library's
  published JS entrypoints.
- Keep `.storybook/main.ts` focused on maintained project addons. Do not add `@storybook/addon-onboarding` or restore
  generated onboarding demo files; component docs should be real colocated stories or intentional project MDX.
- Keep Storybook addon entries in `.storybook/main.ts` mirrored by direct `devDependencies` and by
  `.agents/skills/dependency-update-reviewer/references/dependency-sources.md`. Current intentional third-party
  preview/manager addons include `storybook-dark-mode`, `storybook-addon-pseudo-states`, and `storybook-addon-rtl`.
- Keep Storybook's manager branding on supported APIs: `storybook/theming` for title/link/theme and
  `.storybook/manager-head.html` for head tags such as favicon. Avoid CSS or DOM hacks against Storybook's internal
  sidebar markup for simple branding.
- Keep `.storybook/manager-head.html` as plain HTML. SEO metadata such as `<meta name="description" ...>` is valid
  there, but React-only attributes such as `key` are not useful in this static head snippet and should be omitted.
- Static Storybook-only assets live under `assets/storybook` and are exposed with
  `staticDirs: ['../assets/storybook']`. This copies the directory contents to the root of `storybook-static`, so
  favicon links should use a relative path such as `href="nodzimo-symbol-icon.svg"` for subpath-friendly deploys.
- Storybook uses `@storybook/react-vite`, but it should not inherit the root `vite.config.ts`. The root Vite config is
  for the publishable library build and includes library mode, declaration bundling, externals, and React Compiler
  boundaries. Storybook should point its framework builder options at `.storybook/vite.config.ts` instead.
- Keep `.storybook/vite.config.ts` minimal and Storybook-specific. It should include the Tailwind Vite plugin so
  `.storybook/preview.css` compiles in the preview, but should not include `unplugin-dts`, `build.lib`, package
  externals, or declaration bundling.
- Storybook builder may ignore most `build` options loaded from `viteConfigPath`. Use `.storybook/main.ts` `viteFinal`
  for final Storybook-only Vite overrides such as `build.chunkSizeWarningLimit`.
- Storybook-only display pages and tools that are not package components belong under `.storybook/showcase`. Use this
  for design-system pages such as color palettes, token previews, spacing previews, icon galleries, or other
  Storybook-only UI. Keep colocated component stories beside their components in `src`, but do not put Storybook-only
  showcase components under `src/core` or `src/client`; they are not part of the publishable library source.
- Storybook-only reusable Docs blocks belong under `.storybook/blocks`. These are MDX/Docs presentation adapters, not
  package components.
- Storybook preview infrastructure that powers `.storybook/preview.tsx` belongs under `.storybook/preview-runtime`.
  Keep theme context, Docs containers, preview decorators, and preview wrappers there so `preview.tsx` stays a readable
  configuration entrypoint. Do not name that directory `.storybook/preview`, because it collides with
  `.storybook/preview.tsx` and forces awkward trailing-slash imports.
- Storybook-only Vite build workarounds belong under `.storybook/build-plugins`. Keep those separate from MDX content
  directories: a name such as `.storybook/mdx` suggests documentation pages, while the current MDX React proxy is build
  plumbing.
- Keep `.storybook/showcase/**/*.mdx` and `.storybook/showcase/**/*.stories.*` in Storybook's story globs when showcase
  content exists. `.storybook/preview.css` already scans `.storybook` through `@source "."`, so no separate Tailwind
  entrypoint or extra `@source` is needed for showcase files. `.storybook/tsconfig.json` should include `.storybook`
  recursively so showcase TS/TSX helpers are visible to the IDE and Storybook type checks.
- Sort top-level Storybook sections explicitly with `parameters.options.storySort` in `.storybook/preview.tsx`; do not
  encode sidebar order with `01-` / `02-` prefixes in titles. The preferred top-level order is
  `Design System`, `Core`, `Client`, then `*`, with `method: 'alphabetical'` when children should sort
  alphabetically.
- Use `storybook build` for the public Storybook static site. Keep `storybook build --test` only as an optional testing
  or diagnostics build; do not use it for the deployed docs site unless the project intentionally accepts its
  test-optimized output.
- Import the Storybook stylesheet entrypoint in `.storybook/preview.tsx` with `import './preview.css'`. That CSS
  entrypoint imports full Tailwind with `source(none)`, including its application-owned Preflight, imports
  `../src/library.css`, and explicitly scans `../src` plus `.storybook` so stories render with the same NUI tokens and
  foundation classes as consumers while allowing Tailwind to generate Storybook-only preview utilities. The published
  package stylesheet intentionally omits Preflight;
  see [Tailwind And Styles](tailwind-and-styles.md#preflight-ownership).
  Do not import built `dist/styles.css` in local Storybook; Storybook should exercise source CSS during development.
- Do not import `src/styles.css` in Storybook preview. That file is the package CSS entrypoint and intentionally
  excludes `*.stories.*` from Tailwind source detection. Importing it can make story-only utilities such as `gap-10`,
  `items-end`, `min-h-screen`, or comparison-grid classes silently disappear from the Storybook canvas.
