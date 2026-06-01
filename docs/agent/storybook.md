## Storybook

- Storybook is used for component documentation, visual review, and optional testing. It is not part of the library's
  published JS entrypoints.
- Keep `.storybook/main.ts` focused on maintained project addons. Do not add `@storybook/addon-onboarding` or restore
  generated onboarding demo files; component docs should be real colocated stories or intentional project MDX.
- Keep Storybook addon entries in `.storybook/main.ts` mirrored by direct `devDependencies` and by
  `.codex/skills/dependency-update-reviewer/references/dependency-sources.md`. Current intentional third-party
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
  entrypoint imports Tailwind with `source(none)`, imports `../src/library.css`, and explicitly scans `../src` plus
  `.storybook` so stories render with the same NUI tokens and foundation classes as consumers while allowing Tailwind to
  generate Storybook-only preview utilities. Do not import built `dist/styles.css` in local Storybook; Storybook should
  exercise source CSS during development.
- Do not import `src/styles.css` in Storybook preview. That file is the package CSS entrypoint and intentionally
  excludes `*.stories.*` from Tailwind source detection. Importing it can make story-only utilities such as `gap-10`,
  `items-end`, `min-h-screen`, or comparison-grid classes silently disappear from the Storybook canvas.
- Use `@storybook/addon-themes` with `withThemeByClassName` for the component-preview theme toggle. This is the source
  of truth for component tokens and canvases. Keep the light and dark class names explicit (`light` and `dark`) even
  though the light class currently has no CSS rules. The explicit light marker keeps standalone MDX Docs theme
  synchronization debuggable and aligned with the same class contract as the preview canvas. The decorator
  implementation belongs in `.storybook/preview-runtime`; `.storybook/preview.tsx` should only import and register it.
- Keep global Storybook story layout on `parameters.layout = 'centered'` unless a specific story needs a different
  layout. This is Storybook's native centering path; do not replace it with wrapper `min-height` or full-screen flex
  hacks just to center a normal component story.
- Use a global decorator to wrap all stories in the preview foundation classes
  `nui-surface nui-boundaries nui-interactive`. `nui-surface` is required here so the wrapper itself receives
  `bg-nui-background text-nui-foreground` after the addon toggles `.dark`; otherwise transparent stories can show dark
  tokens on a light Storybook canvas or vice versa. Keep the decorator implementation in
  `.storybook/preview-runtime`, and keep `.storybook/preview.tsx` as the config entrypoint that registers it.
- Use the same NUI foundation wrapper around the custom Storybook Docs container so standalone MDX showcase pages
  inherit `nui-surface nui-boundaries nui-interactive` instead of each MDX page adding local wrappers. This applies the
  active NUI token values to Docs content; it does not replace the separate unattached-MDX theme bridge that toggles
  `light` / `dark` classes on `document.documentElement`.
- Storybook does not currently provide a clean built-in bridge between `@storybook/addon-themes` and the full preview
  canvas background. The project workaround belongs in `.storybook/preview.css`, after the Tailwind imports and
  `@source` directives: set `background-color: var(--nui-background)` on `html` for single-story centered canvas mode
  and on `.docs-story` for Storybook Docs story canvases. Use `background-color`, not the `background` shorthand, so the
  override changes only the surface color. This follows the practical workaround discussed in
  https://github.com/storybookjs/storybook/discussions/25183 and is intentionally local to Storybook.
- Keep the global Storybook preview `wrapperBackground` arg as a preview-only design aid. It should live under the
  `Story canvas` controls category, use the display name `Wrapper background`, default to `transparent`, and apply only
  to the decorator wrapper. Filter it out before rendering the story so it never leaks into component props or DOM.
- Treat `wrapperBackground` as an honest wrapper background, not a full Storybook canvas background. Do not rename it to
  `Canvas background` unless the implementation really controls the whole Storybook canvas. Keep the default arg value
  explicit so Storybook exposes a useful control; do not over-engineer the arg extraction with heavy generic typing
  unless Storybook's own types make it straightforward.
- Storybook manager UI theming is separate from component preview theming. Use `storybook/theming` and
  `.storybook/manager.ts` `addons.setConfig({ theme })` for manager branding. `create({ base })` only accepts
  `'light' | 'dark'`; use `getPreferredColorScheme()` when the branded manager theme should follow the user's system
  preference at load time. Use `storybook-dark-mode` for the live manager light/dark toggle.
- Keep the two Storybook theme addons separated by responsibility:
    - `storybook-dark-mode` owns Storybook chrome and Docs UI theme.
    - `@storybook/addon-themes` owns component-preview theme, NUI token values, story canvases, and design-system MDX
      token documentation.
      Do not enable `storybook-dark-mode` `stylePreview` for this project. It can make one toolbar button appear to
      theme
      everything, but it gives `storybook-dark-mode` a second ownership role over the preview iframe and can conflict
      with
      `@storybook/addon-themes`, including manager runtime failures such as
      `Failed to execute 'add'/'remove' on 'DOMTokenList': The token provided must not be empty` when an empty class
      token
      is supplied. This project intentionally keeps two controls because they describe two different surfaces: the tool
      UI
      and the product/component theme inside the tool.
- Storybook Docs theming is a third surface, separate from both manager UI and component canvas theming. Do not pin
  `parameters.docs.theme = themes.normal` once `storybook-dark-mode` is enabled; that leaves Docs white while the
  manager is dark. Instead, keep a typed custom Docs container in `.storybook/preview-runtime`: import `DocsContainer`
  and `DocsContainerProps` from `@storybook/addon-docs/blocks`, read `useDarkMode()` from `storybook-dark-mode`, and
  render `<DocsContainer {...props} theme={isDark ? themes.dark : themes.normal} />`. Keep `theme` after `{...props}`
  so the dark-mode state intentionally wins over any theme carried in the props. This uses public APIs from Storybook
  Docs and `storybook-dark-mode`; avoid channel-event plumbing unless a future docs-only toggle is intentionally needed.
- Standalone MDX Docs pages are not ordinary story canvases, so `@storybook/addon-themes` does not reliably re-run the
  story decorator when the theme toolbar changes while the user is already on an unattached MDX page such as a token
  palette. The observed behavior is that switching the component theme on a normal story updates the root class, and
  returning to MDX then shows the right token values; switching directly on the MDX page changes the toolbar state but
  does not update the MDX surface. Keep the local Docs-container bridge that reads
  `props.context.store?.userGlobals?.globals?.theme` and toggles the explicit `light` / `dark` classes on
  `document.documentElement`. This relies on Storybook internal Docs context shape, so keep it small, optional-chained,
  and isolated in `.storybook/preview-runtime`.
- Keep the Docs wrapper and the unattached-MDX theme bridge because they solve different problems: the bridge selects
  which token values are active, while the wrapper applies the NUI surface/foreground/boundary/interactive contract to
  Docs and MDX content.
- Do not use Storybook preview hooks such as `useGlobals()` inside `DocsContainer`. Storybook throws
  `Storybook preview hooks can only be called inside decorators and story functions`; Docs containers are not that hook
  zone. The accepted workaround is based on the public `DocsContainer` hook for Docs UI theme plus the narrow internal
  `context.store.userGlobals.globals.theme` read for unattached MDX component-theme synchronization. Track the upstream
  discussion at https://github.com/storybookjs/storybook/discussions/28495. It matches this project failure mode:
  unattached MDX docs do not render/update theme until a regular story has applied the theme decorator.
- Do not use Storybook preview hooks such as `useGlobals()` inside standalone MDX-rendered helper components either.
  For MDX Docs blocks that need the active Docs/component theme, expose ordinary React context from the custom Docs
  container in `.storybook/preview-runtime` and consume that context from `.storybook/blocks`.
- Storybook's official `Source` Docs block accepts a static `dark` boolean. It does not automatically follow
  `storybook-dark-mode` or `@storybook/addon-themes`. Use the local themed Source adapter from `.storybook/blocks`
  instead of sprinkling hard-coded `dark={true}` or custom code block implementations through MDX pages.
- Keep Storybook Docs table of contents enabled through `parameters.docs.toc` when it helps longer Autodocs pages. This
  is a Docs feature, not a story layout workaround.
- The `Design System/Colors` page currently uses Storybook's official MDX `ColorPalette` / `ColorItem` doc blocks.
  Pass CSS variables such as `var(--nui-primary)`, not copied color literals, so swatches follow the component theme.
  Storybook's built-in `ColorPalette` does not resolve or display computed CSS variable values and does not provide copy
  buttons; accept that limitation for the simple MDX palette until the project intentionally builds a custom token
  explorer.
- Biome 2.4 does not parse or format MDX files in this project. Format `.mdx` manually, and keep WebStorm MDX false
  positives scoped through project inspection settings rather than adding suppression comments inside MDX. The shared
  `Storybook MDX Documentation` scope covers `.storybook/showcase/**/*.mdx` for WebStorm inspections that cannot parse
  Storybook MDX correctly.
- Storybook 10.4 with React 19, Vite/Rolldown, `@storybook/addon-docs`, and the custom dark-mode Docs container has a
  production-only Docs bundling incident in this project. The development Storybook can work while the static
  `storybook build` output fails only on Docs pages with React minified error #130. The confirmed local failure mode was
  Storybook's `DocsRenderer` dynamically importing `@mdx-js/react`, Vite/Rolldown rewriting that dynamic import to the
  main iframe chunk, and the expected named `MDXProvider` export not being available from that chunk. Story pages kept
  working because the crash was inside the Docs renderer path.
- Keep the workaround isolated in `.storybook/build-plugins/mdx-react-proxy-plugin.ts` plus
  `.storybook/build-plugins/mdx-react-proxy.ts`, and register it from `.storybook/vite.config.ts` as a normal Vite
  plugin next to `tailwindcss()`. The plugin narrowly rewrites the dynamic `import("@mdx-js/react")` from Storybook
  addon-docs to a local proxy module that re-exports `MDXProvider` and `useMDXComponents` from `@mdx-js/react`. This is
  intentionally Storybook-only, should not affect the publishable library build, and is preferable to patching
  `node_modules`, disabling Docs, removing the custom Docs container, or adding runtime monkey patches.
- Keep the MDX React proxy split into two files. The plugin file is Node/Vite build-time code; the proxy file is the
  browser-runtime module dynamically imported by Storybook Docs. Do not point the rewrite at the plugin module or merge
  the files just to reduce count, because that mixes build-time imports such as `node:url` and `vite` with the browser
  Docs runtime.
- In `.storybook/build-plugins/mdx-react-proxy.ts`, re-export from the package import `@mdx-js/react`. Do not deep-link
  or relatively import `../node_modules/@mdx-js/react/index.js`; the normal package import resolves correctly in the
  Storybook Vite build and keeps the workaround smaller and less coupled to package internals.
- Treat the MDX React proxy plugin as a temporary production-build workaround. Re-check it after Storybook, Vite, or
  Rolldown upgrades: build the public Storybook, serve the static output, open at least one Button Docs page and one
  Spinner Docs page, and confirm there are no runtime console errors. If Storybook later fixes the `@mdx-js/react`
  dynamic import path, remove the plugin and proxy together. Related public signals are Storybook issue
  https://github.com/storybookjs/storybook/issues/32604 and older addon-docs/MDX export issues such as
  https://github.com/storybookjs/storybook/issues/24792; neither is a perfect one-to-one match, so keep the local
  diagnosis documented.
- Storybook's official backgrounds addon supports preset backgrounds, not a free global color picker. Avoid adding
  stale third-party background/color-picker addons only for this feature; many are not maintained for current Storybook
  versions. If a real full-canvas color picker is needed later, prefer a small project-owned Storybook toolbar/global
  addon over layout hacks, `document.body` effects, or unsupported addons.
- Use `storybook-addon-pseudo-states` for fixed CSS pseudo-class previews such as `hover` and `active`. Real component
  states such as `disabled`, `checked`, `selected`, `open`, or `loading` should stay real args/props, not pseudo-state
  addon configuration.
- Use `storybook-addon-rtl` as the Storybook toolbar check for left-to-right and right-to-left rendering. Treat it as a
  preview QA surface, not a substitute for component code using logical spacing, positioning, borders, and radii.
- Treat Storybook RTL as a layout and bidi QA surface. Hardcoded English examples that contain neutral punctuation may
  need `dir={'ltr'}` on the text span; this is a story/demo fix, not component punctuation logic.
- Icon showcase pages should not mirror directional-looking assets in RTL. They document the icon set. Mirror icons only
  inside component stories or examples where the icon specifically means inline-start or inline-end movement.
- Put shared pseudo-state defaults in `meta.parameters.pseudo` when every story in the file follows the same preview
  convention. Use story-level `parameters.pseudo` only for stories that need different pseudo-state targets.
- When targeting one element for a pseudo state inside a story canvas, prefer story-only `data-*` selectors such as
  `[data-preview="hover"]` over `id` selectors. Storybook Docs can render several canvases on one page, so repeated IDs
  are fragile and invalid HTML.
- Inline simple single-use pseudo-state selectors directly in `parameters.pseudo`. Extract selector constants only when
  they are reused or need a meaningful shared name.
- Add explicit baseline `meta.args` for native or passthrough props when that makes Storybook Controls expose the prop
  correctly, for example `disabled: false`. CVA-derived variant unions still need explicit `argTypes.options` arrays
  because those unions are not available as runtime values.
- Keep `tags: ['autodocs']` in the global Storybook preview unless the project intentionally changes its documentation
  strategy.
- Keep Storybook TypeScript context separate from the library source TypeScript context. A `.storybook/tsconfig.json`
  may extend the app tsconfig so Storybook config files understand Vite CSS imports without adding `.storybook` to the
  library `tsconfig.app.json` include list. Include both `./*.ts` and `./*.tsx` so `main.ts` and JSX-bearing preview
  files are checked together.
- Storybook Vitest/browser testing config belongs in `vitest.config.ts`, merged with the base Vite config when needed.
  The Storybook test plugin may launch Storybook with a command such as `bun storybook -- --no-open`; this launches the
  Storybook dev server for the test run, it is not a separate user-facing test script by itself.
- Do not add `setupFiles` for Storybook/Vitest unless the referenced setup file actually exists and contains real
  project setup such as mocks or custom matchers. Storybook preview annotations are handled by the addon path.
- On Windows/local browser testing, keep Vitest browser API host explicit as `127.0.0.1` if `localhost` causes
  Playwright `ERR_CONNECTION_REFUSED` against the internal Vitest browser URL.
- Playwright browser binaries are installed outside the repo in the user cache. If browser tests ask for browsers after
  dependency updates, run `bunx playwright install chromium` from the project terminal.
- A `vitest.init()` deprecation warning seen while running Storybook visual/interaction tests can come from
  `@storybook/addon-vitest` internals. Do not rewrite local config only for that warning unless Storybook documents a
  migration that applies to this project.
- Prefer colocated stories beside real components, for example `src/client/components/button/button.stories.tsx`.
- In colocated stories, prefer importing the component from the local folder surface with `import { Button } from '.'`
  when `index.ts` exports the component. Implementation files inside the same folder should still use direct relative
  imports for local details such as `./button-variants`.
- Use kebab-case filenames for stories when that matches the component folder style; the important Storybook convention
  is the `.stories` segment, not PascalCase.
- Do not write stories for the sake of exhausting every prop permutation. A story should answer a meaningful interface
  question: what role, intent, state, or usage pattern does this component have?
- Before writing stories, classify the component's owned surface area: semantic variants, sizes, states, interaction
  modes, and official composition patterns. If differences are only possible through arbitrary `className`, native DOM
  props, or wrapper layout, they are not story-worthy by themselves.
- Keep a story budget. Components with one behavior and no owned variants may need only `Default`; add at most one usage
  or composition story when it documents a real interface pattern consumers should copy.
- Do not create comparison stories for visual mutations that are not part of the component or design-system contract.
  Showing that an SVG or element can be recolored, resized, or rearranged with Tailwind documents CSS, not component
  behavior.
- Treat `Spinner` as the anti-example for story bloat: unless the component gains explicit variants, stories such as
  `Sizes`, `Tones`, or `Colors` are noise. Reasonable coverage is usually `Default`, plus optionally one honest
  `Inline`/`WithLabel` composition if that pattern is worth documenting.
- Prefer separate focused stories for semantic roles and materially different behavior, such as a button's primary,
  outline, secondary, ghost, destructive, link, disabled, icon-only, or loading states. Do not include the component
  name
  in each story name when the Storybook title already scopes the file to that component.
- Prefer comparison stories for visual scales and repetitive styling variations, such as component sizes or icon sizes.
  Show comparable variants side by side so rhythm, spacing, and scale can be inspected in one canvas instead of clicking
  through many near-identical sidebar entries.
- Treat `src/client/components/button/button.stories.tsx` as the current reference pattern for client component stories:
  typed control option constants, story-only icon mapping controls, a shared high-signal `meta.render` for common button
  compositions, focused semantic stories first, then comparison stories such as `Sizes` and `Icon sizes`.
- Use `meta.args` for shared baseline args such as generic `children` and `onClick: fn()`. Focused stories should only
  override the args that make that story meaningful. Use specific children only when the label clarifies semantics, such
  as `Delete` for destructive actions or `Visit` for link-style actions.
- For story-only args such as preview icons, extend the story args type with `ComponentProps<typeof Component>`. Expose
  a
  clearly described control such as `Story-only icon picker (this is not a Button prop!)`, and destructure unused
  story-only args out of custom renders so they do not leak into the rendered component or DOM.
- Keep story export names short and stable because they form technical story ids. Use `name` only when the display name
  needs human-facing clarification or sentence casing, such as `Primary (default)` or `Icon sizes`.
- In comparison, story render functions, spread `args` before pinned props that define the comparison item, for example
  `<Button {...args} size='xs' />`. This lets controls adjust shared args while preventing controls from collapsing the
  whole comparison into one size or variant.
- Local story-only helpers may use simple names when the surrounding story file makes their purpose obvious. Give them
  more precise names when they become broader, exported, reused across files, or responsible for more than local layout.
- Storybook Controls need runtime `options` arrays for select/radio controls. TypeScript may know CVA-derived unions in
  the editor, but those type unions are not available as runtime values for Storybook controls.
- Storybook is the first demanding consumer of component metadata. For public finite values, define runtime constants at
  the component layer and derive/export types from them. Button variants/sizes should come from the button variant
  module; Select trigger sizes and content placement values should come from the Select component files. Stories should
  import those constants instead of duplicating option arrays. This is a response to a real Storybook auto-controls
  failure, not a preference for verbose stories.
- Do not assume docgen will infer usable Controls for wrapped Base UI or CVA-backed components. The project hit this
  with Button: the public contract `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>` is valid TypeScript and
  preserves the Base UI contract, but Storybook did not turn it into clean runtime select options. A simpler
  shadcn/Radix-style `forwardRef<HTMLButtonElement, ButtonProps>` with an explicit `interface ButtonProps extends
  ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<...>` is more docgen-friendly because the component signature
  points directly at a named props interface and ordinary DOM props. That does not mean this project should abandon Base
  UI props or rewrite everything for docgen.
- Do not treat `forwardRef` as the root cause. It can help component detection, but it does not create runtime option
  arrays for CVA, does not simplify Base UI namespace props, and does not make root compound components expose child
  part props. Use explicit `argTypes.options`, `table.type`, and `table.defaultValue` for meaningful documented
  controls.
- For compound components, story args may represent the documented composition surface, not only the root component's
  direct props. Prefix child-part controls with the part name, such as `triggerSize`, `triggerAriaInvalid`,
  `contentSide`, `contentAlign`, `contentSideOffset`, and `contentAlignItemWithTrigger`.
- Shared Storybook arg-table labels and separators belong in `src/storybook/constants.ts`. Keep that folder out of
  public barrels and runtime entrypoints; it is for colocated `*.stories.*` files and story-only helpers.
- `class-variance-authority` currently does not expose a stable runtime introspection API for variant keys. CVA
  discussion https://github.com/joe-bell/cva/discussions/146 tracks requests for exposing variants; until CVA provides
  this, do not introduce a custom CVA fork, wrapper, or large metadata layer only to satisfy Storybook controls.
- For CVA-backed component variants, do not duplicate public variant arrays in every story. Define component-owned
  runtime constants beside the variant implementation, derive/export the matching types from those constants, and import
  the constants into `argTypes.options`. Use explicit Storybook table summaries such as `string union` or
  `component union` when Autodocs would otherwise show unclear types such as `unknown`, and put the concrete option list
  in `table.type.detail`. Revisit this only if CVA or Storybook gains reliable variant introspection.
- Do not rely on `react-docgen-typescript` configuration as the primary solution for CVA variant controls. In this
  project, attempts to switch Storybook to `react-docgen-typescript` did not produce reliable controls and made prop
  extraction worse in the running Storybook.
- Do not keep Storybook onboarding/demo components, CSS, MDX, assets, or addon dependencies as part of the long-term
  component architecture. The generated `src/stories` folder should stay deleted unless the project explicitly creates
  real documentation there.
- Top-level MDX documentation may live separately from component folders, but it should be project documentation, not
  generated onboarding content.
- CSF 3 is the stable default story format. CSF Next is not related to Next.js; it is an experimental next Component
  Story
  Format. Do not switch to CSF Next unless the project explicitly accepts preview API churn.

