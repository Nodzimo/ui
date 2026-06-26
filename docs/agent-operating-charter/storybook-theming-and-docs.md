## Storybook Theming And Docs

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
- Keep the Storybook Docs heading-anchor workaround in `.storybook/preview.css`. Storybook's generated Markdown heading
  anchors use a negative left margin to place the paperclip/link icon in the left gutter without moving the heading
  text. When `storybook-dark-mode` switches the Docs UI theme, Storybook's generic dark Docs link typography can be
  injected later and reset that anchor margin to `0`, shifting headings right. The local override must stay scoped to
  `.sbdocs-content :is(h1, h2, h3, h4, h5, h6) > a[aria-hidden="true"][tabindex="-1"]` and should restore only the
  service-anchor geometry: `float: left`, `line-height: inherit`, `margin-left: -24px`, `padding-right: 10px`,
  `color: inherit`, and `text-decoration: none`. Do not broaden it to ordinary Docs links. See
  [Storybook Docs Heading Anchor Incident](storybook-docs-heading-anchor-incident.md).
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
