---
name: storybook-story-writer
description: Write, review, or update focused Storybook CSF 3 stories for Nodzimo UI React components. Use when Codex is asked to add stories for a new component, improve existing component stories, align stories with the repository's Storybook conventions, add meaningful controls for CVA-backed variants, or validate Storybook story architecture in this UI kit.
---

# Storybook Story Writer

## Overview

Use this skill for Nodzimo UI component stories. The goal is to document meaningful interface roles, states, and usage
patterns without generating prop-permutation noise. The current strongest reference is
`src/client/components/button/button.stories.tsx`: it favors rich preview stories that show the component's practical
composition patterns in one canvas instead of isolated one-control examples.

## Workflow

- Inspect the component folder before writing stories:
    - implementation file, local `index.ts`, variant files, types, and existing stories if present.
    - aggregate barrels only if export flow is unclear.
- Classify the component before planning stories:
    - Does it have owned semantic variants, sizes, states, or interaction modes?
    - Does it have official composition patterns that are part of how consumers should use it?
    - Are differences only possible through arbitrary `className`, native attributes, or wrapper layout?
- Write a short story plan before editing. For each planned story, be able to answer: "What interface question does this
  story answer about this component's public role?" If the honest answer is only "it shows that CSS/className/native
  props can change the element", do not write that story.
- Confirm whether the component is client or core:
    - client components usually live under `src/client/components/<component>`.
    - core components should keep stories colocated with their component folder if/when story coverage is added there.
- Story-only visual helpers should use project-owned generated icons from `#core/icons`. Do not add third-party icon
  component packages such as `lucide-react` just to demonstrate composition in stories.
- If a core component needs an icon at runtime, remember that stories are not proof of RSC safety. The runtime component
  still needs a core-safe implementation or a documented package-boundary review.
- Create or update a colocated kebab-case `*.stories.tsx` file.
- Import the component from the local folder surface when `index.ts` exports it:

```text
import { Button } from '.'
```

- Define `meta` with `satisfies Meta<typeof Component>` for simple stories. When adding story-only args, define a
  `ComponentStoryArgs` type as `ComponentProps<typeof Component> & { ... }`, then use
  `satisfies Meta<ComponentStoryArgs>`.
- Put shared baseline args in `meta.args`; override only story-specific args in each story.
- Add runtime `argTypes.options` for meaningful variant controls because CVA unions are not runtime values.
- Add explicit baseline `meta.args` for native or passthrough props when Storybook would otherwise omit useful Controls,
  for example `disabled: false`.
- Write focused semantic stories first, then comparison stories for scales, sizes, layouts, or icon-only forms. When a
  component has common composition patterns, prefer a shared `meta.render` that displays the practical set together.
- Keep colocated `.stories.*` imports development-only. They may import Storybook utilities such as `storybook/test`;
  dependency-cruiser's `not-to-dev-dep` rule should exclude story files rather than forcing Storybook packages into
  runtime dependencies.
- Run the smallest relevant verification, normally `bun run build:ts` and `bun run check:lint`. When story layout or
  Storybook CSS imports change, also run `bun run storybook:build` and confirm the static Storybook CSS contains the
  needed story-only utilities while `bun run build:css` keeps `dist/styles.css` free of those story-only classes.
- When changing Storybook preview, Docs, Vite plugins, or theme addons, verify the production static output, not only
  the dev server. Use `bun run storybook:preview` to build and serve `storybook-static`, then open at least one ordinary
  story and one Docs page. Storybook dev mode can hide production-only Docs renderer failures, and
  `storybook:build-test` is not equivalent because it can omit Docs pages.

## Story Selection

- Prefer stories that answer a real interface question: role, intent, state, interaction mode, size scale, icon use,
  disabled/loading/error state, or structural composition.
- Treat the component's own API and design-system contract as the story boundary. A prop passthrough such as
  `className`, native DOM props, or wrapper layout is not a reason to create visual variation stories by itself.
- Do not create stories just to exhaust every prop. If several props are technical plumbing or mirror native HTML
  attributes, let Controls cover them.
- Prefer comparison stories only when the compared values are owned by the component or an explicit design-system
  contract, such as CVA variants, component-defined sizes, icon-only forms, or documented composition forms. Do not use
  comparison stories to demonstrate arbitrary Tailwind classes.
- For composable controls such as buttons, prefer high-signal story canvases that show the real usage family together:
  label-only, leading icon, icon-only, and trailing icon. Avoid one-button canvases when they hide important usage
  patterns.
- Keep export names short and stable because they become technical story ids. Use `name` only for human-facing display
  clarification such as `Primary (default)` or `Icon sizes`.
- Use concrete semantic labels when they clarify intent, such as `Like`, `Open`, `Close`, `Login`, `Delete`, or `Visit`.
  Avoid generic `Button` labels in stories where the role or intent should be visible.
- If the component has no meaningful variant/state surface, write one strong default story. Add at most one usage or
  composition story only when it documents a real interface role consumers should copy.
- For leaf primitives with one behavior, a very short story file is a correct outcome. Do not compensate for a small API
  by inventing visual matrices.

## Story Budget Gate

Use this gate before writing or reviewing a story file:

- Owned variants or states exist: stories may cover those meaningful roles, keeping repetitive cases grouped.
- Official composition patterns exist: one compact composition canvas may document the expected usage family.
- Only arbitrary styling differs: do not add size, tone, color, spacing, or layout stories.
- Component has one role and no owned variants: prefer `Default`; optionally add one honest composition story.

Spinner is the project anti-example for this gate: a spinner can be restyled with Tailwind classes, but that does not
give it owned tones, sizes, or visual variants. Stories such as `Sizes` or `Tones` for a plain spinner document CSS
capability rather than component behavior and should not be written unless those scales become part of the component
contract.

## Review Standard

- Review stories as executable documentation, not as decorative demos. Prioritize whether the canvas communicates real
  component roles, composition patterns, and states.
- Lead with concrete issues: story-only arg leaks, misleading controls, weak types, noisy canvases, poor semantic
  labels,
  or render patterns that hide important usage.
- Challenge generic or misleading names when a small local helper has grown into a reusable story pattern. Keep names
  short when the local context is enough, but make them precise when they encode a reusable layout or convention.
- Prefer strict, practical feedback over vague encouragement. Explain why a naming, typing, or render choice improves
  future maintenance and Storybook DX.

## Project Conventions

- Use CSF 3 object stories.
- Use tabs, single quotes, no semicolons, and named exports.
- Add `// noinspection JSUnusedGlobalSymbols` at the top of story files when matching the existing story pattern.
- Use `@storybook/react-vite` types and `fn` from `storybook/test` for event handlers in shared args.
- Use `UPPER_SNAKE_CASE` for intentional module-scope immutable story tables, mappings, options, and literal constants,
  such as variant option arrays, story-only icon maps, and string union separators. Keep Storybook convention objects
  such as `meta` in `camelCase`.
- Use `as const` for literal Storybook option arrays and mapping objects when deriving unions from them. Do not annotate
  those tables as `readonly string[]` unless a widened `string` element type is intentional. `as const` keeps values
  narrow enough for types such as `(typeof BUTTON_SIZE_OPTIONS)[number]` and `keyof typeof BUTTON_STORY_ICONS`. Reuse
  the derived key union when indexing the mapping, for example
  `(typeof BUTTON_STORY_ICONS)[ButtonStoryIconName]`, instead of repeating `keyof typeof BUTTON_STORY_ICONS`.
- Keep stories colocated beside components.
- Do not import from `@sefo/nodzimo-ui` inside this package.
- Do not restore Storybook onboarding/demo files or `@storybook/addon-onboarding`. Generated examples are not part of
  the project documentation model.
- Keep Storybook's Vite config separate from the library package build config. If story or preview work needs Vite
  changes, use `.storybook/vite.config.ts` for Storybook preview plugins such as Tailwind, and use `.storybook/main.ts`
  `viteFinal` only for final Storybook-specific Vite overrides.
- Put Storybook-only showcase pages and tools under `.storybook/showcase`. Use that area for design-system pages such
  as colors, tokens, spacing, icons, and other documentation UI that exists only inside Storybook. Keep actual component
  stories colocated in `src` beside the component they document.
- Treat spacing as a design-system showcase page named in the singular: `Design System/Spacing`. The page documents the
  spacing scale, not many independent "spacings". Use a typed helper such as `SpacingScale` under
  `.storybook/showcase/spacing` when the MDX page needs TSX rendering logic.
- Treat iconography as a design-system showcase, not as colocated stories for individual icon components. An icon set
  gallery answers "which icons exist in the design system?", not "how does this one icon component behave?". Keep icon
  galleries and typed display helpers under `.storybook/showcase`, import real icon surfaces from `#core/icons/*`, and
  do not move display-name formatting or gallery mapping helpers into `src/lib` or `src/core`.
- Use Storybook's official `IconGallery` / `IconItem` doc blocks for simple icon set pages. Keep generated icon
  component names as stable technical keys, but format user-facing labels for readability, for example by removing an
  `Icon` postfix and splitting PascalCase into words. If this formatting needs TypeScript, move it to a local
  `.storybook/showcase/**.tsx` helper instead of writing untyped functions inside MDX.
- Keep long project doctrine content source-of-truth under `docs`, not embedded directly in Storybook. The current
  design-system doctrine lives in `docs/design-system-doctrine/README.md` plus identity-named chapter files. Storybook
  should mirror those chapters through `.storybook/showcase` MDX wrappers that import the chapter Markdown with `?raw`.
  Do not prefix doctrine chapter files with numeric order; order belongs in the README, Storybook overview, and
  `storySort`.
- When a Storybook-only MDX overview links to other Storybook Docs pages, use ordinary Markdown links with
  `./?path=/docs/<id>--docs`. A bare `?path=/docs/...` can resolve inside the preview iframe as
  `iframe.html?path=...`; `./?path=...` targets the Storybook manager entrypoint while keeping the page readable as
  simple MDX. Do not switch to JSX `<a target>` links unless Markdown links fail for a confirmed deployment case.
- For Storybook showcase MDX and raw-imported Markdown chapters, use `###` for section headings that should appear in
  the right-side Docs table of contents. In the current Storybook Docs renderer, `##` headings can render as page
  structure without appearing in that TOC, while `###` gives the expected chapter-section navigation.
- When adding showcase content, make sure `.storybook/main.ts` includes `.storybook/showcase` MDX/stories globs and
  `.storybook/tsconfig.json` includes `.storybook` recursively. Do not add a third Tailwind entrypoint; `.storybook`
  preview CSS already scans showcase through `@source "."`.
- Use `parameters.options.storySort` in `.storybook/preview.tsx` for top-level sidebar ordering. Prefer explicit
  top-level order such as `Design System`, `Core`, `Client`, `*` and `method: 'alphabetical'` for child ordering. Do
  not rely on numeric title prefixes for permanent ordering.
- Storybook preview imports `./preview.css`, not `../src/styles.css`. `.storybook/preview.css` is the Storybook
  Tailwind entrypoint: it imports Tailwind with `source(none)`, imports `../src/library.css`, and explicitly scans
  `../src` plus `.` so story-only preview utilities can be generated. `src/styles.css` is the package CSS entrypoint and
  excludes `*.stories.*` from Tailwind source detection.
- If a Tailwind utility works in component source but disappears in Storybook, or a story-only class such as `gap-10`,
  `items-end`, or `min-h-screen` has no effect, first inspect the Storybook CSS import and Tailwind source policy. The
  usual failure mode is importing the package entrypoint instead of `.storybook/preview.css`, or forgetting to include
  the relevant Storybook/source directory in `.storybook/preview.css` `@source` directives.
- Keep the global `.storybook/preview.tsx` decorator aligned with the project preview contract:
  `nui-surface nui-boundaries nui-interactive` around all stories. `nui-surface` is intentional in Storybook because
  the theme addon toggles `.dark`, and the wrapper must receive `bg-nui-background text-nui-foreground` for transparent
  story canvases to stay readable in both themes.
- Keep the custom Docs container wrapped in the same NUI foundation contract. Docs/MDX content is not a normal story
  canvas, so it needs the Docs container wrapper to apply `nui-surface nui-boundaries nui-interactive` globally instead
  of repeating local wrappers in every showcase MDX page.
- Use global `parameters.layout = 'centered'` for normal centered component stories. Storybook already centers the
  single-story canvas; do not add wrapper `min-height`, `viewMode`, or full-screen flex decorators only for centering.
- Keep the Storybook theme-canvas background workaround in `.storybook/preview.css`, after Tailwind imports and
  `@source` directives:

```css
html,
.docs-story {
    background-color: var(--nui-background);
}
```

`html` covers the full single-story preview iframe when `layout: 'centered'` is active. `.docs-story` covers the
separate Docs story canvas surface. This is a targeted workaround for Storybook's long-running gap where
`@storybook/addon-themes` toggles classes but does not automatically repaint all preview/Docs canvas backgrounds.
Track the discussion at https://github.com/storybookjs/storybook/discussions/25183. Use `background-color`, not the
`background` shorthand, and do not move this to `.storybook/preview-head.html` while `.storybook/preview.css` is the
active Storybook CSS entrypoint.

- Preserve the global preview-only `wrapperBackground` arg when editing Storybook preview configuration. It belongs in
  the `Story canvas` controls category, uses the display name `Wrapper background`, defaults to `transparent`, and is
  filtered out before rendering `<Story />`. It colors the decorator wrapper only, so do not call it
  `Canvas background`.
- Use `@storybook/addon-themes` and `withThemeByClassName` for the component preview light/dark toggle. Manager UI
  theming is a separate Storybook surface: use `storybook/theming`, `.storybook/manager.ts`, and
  `addons.setConfig({ theme })`. `create({ base })` only accepts `'light' | 'dark'`; use
  `getPreferredColorScheme()` for branded manager themes that follow the user's system preference at load time. Use
  `storybook-dark-mode` when the manager itself needs a live light/dark toggle.
- Keep the two Storybook theme addons separated by responsibility. `@storybook/addon-themes` owns component tokens,
  story canvases, and design-system MDX token docs. `storybook-dark-mode` owns the Storybook manager/Docs chrome. Do
  not enable `storybook-dark-mode` `stylePreview` in this project; it makes the manager dark-mode addon also mutate the
  preview iframe and conflicts with the component-theme addon.
- Storybook Docs theming must be wired separately from both the manager and the component preview canvas. With
  `storybook-dark-mode`, do not hard-code `parameters.docs.theme = themes.normal`; it freezes Docs in light mode. Use a
  typed custom Docs container in `.storybook/preview.tsx`:

```tsx
function ThemedDocsContainer(props: DocsContainerProps) {
    const isDark = useDarkMode()

    return (
        <DocsContainer {...props} theme={isDark ? themes.dark : themes.normal}/>
    )
}
```

Then set `parameters.docs.container = ThemedDocsContainer`. Import `DocsContainer` and `DocsContainerProps` from
`@storybook/addon-docs/blocks`, and `useDarkMode` from `storybook-dark-mode`. Keep `theme` after `{...props}` so the
dark-mode state wins intentionally. Prefer this hook-based bridge over manual `DARK_MODE_EVENT_NAME` channel plumbing
unless the project needs a custom docs-only toggle.

- Keep the local unattached-MDX theme bridge in `.storybook/preview.tsx`. Standalone MDX pages such as design-system
  color/token docs do not behave like ordinary story canvases: when the `@storybook/addon-themes` toolbar is toggled
  while already on the MDX page, the story decorator does not re-run, so the root `light` / `dark` class can stay stale.
  The accepted workaround reads `props.context.store?.userGlobals?.globals?.theme` inside the custom Docs container and
  toggles the explicit `light` and `dark` classes on `document.documentElement`. This uses a private Storybook Docs
  context shape, so keep it narrow, optional-chained, and documented. Do not replace it with `useGlobals()` inside the
  Docs container; Storybook preview hooks are only valid inside decorators and story functions. Track the upstream
  discussion at https://github.com/storybookjs/storybook/discussions/28495.
- Do not remove that bridge just because the Docs container has an NUI wrapper. The wrapper applies NUI classes to the
  Docs surface; the bridge keeps the active `light` / `dark` token values synchronized for unattached MDX pages.
- Keep `withThemeByClassName` configured with explicit class names:

```tsx
withThemeByClassName({
    defaultTheme: LIGHT_THEME,
    themes: {
        light: LIGHT_THEME,
        dark: DARK_THEME,
    },
})
```

The light class is currently a state marker, not a CSS override. It exists so unattached MDX theme synchronization can
toggle two explicit states instead of treating light as an invisible absence of class.

- Keep `parameters.docs.toc` enabled when component Autodocs pages benefit from a table of contents.
- Use official MDX doc blocks for simple showcase docs when they are enough. The current color palette intentionally
  uses `ColorPalette` / `ColorItem` with `var(--nui-*)` values so swatches react to theme changes without duplicating
  light/dark color literals. Do not expect this block to display computed values or provide copy buttons; that requires
  a deliberate custom token explorer.
- Biome does not process MDX in this setup. Format Storybook MDX manually and keep IDE parser false positives scoped
  through the shared WebStorm inspection settings, not inline MDX suppression comments.
- Be aware of the current Storybook 10.4 production Docs workaround. In this project, a custom Docs container plus
  addon-docs triggered a production-only React #130 crash because Storybook's `DocsRenderer` dynamically imported
  `@mdx-js/react`, but the static Vite/Rolldown output resolved that import to a chunk without a usable named
  `MDXProvider` export. The local fix is `.storybook/mdx-react-proxy-plugin.ts`, registered in
  `.storybook/vite.config.ts`, which rewrites the dynamic `import("@mdx-js/react")` from addon-docs to
  `.storybook/mdx-react-proxy.ts`. That proxy re-exports `MDXProvider` and `useMDXComponents` from the real
  `@mdx-js/react` package.
- Treat the MDX React proxy as Storybook-only build plumbing. Do not copy it into component stories, do not add MDX
  files only to "force" the provider, do not patch `node_modules`, and do not remove Docs or the custom Docs container
  to make the build smaller. Revisit and remove the workaround only after a Storybook/Vite/Rolldown upgrade proves the
  production static Docs pages work without it.
- If Docs crash only after deploy or `storybook:build`, debug the static output first: serve `storybook-static`, inspect
  the console, and check whether `MDXProvider` is undefined in the built `DocsRenderer` path. Related but not exact
  upstream signals include https://github.com/storybookjs/storybook/issues/32604 and
  https://github.com/storybookjs/storybook/issues/24792.

- Do not add Storybook background/color-picker addons only to get a free full-canvas color picker unless they are
  verified compatible with the current Storybook version. The official backgrounds addon is preset-based, and stale
  third-party addons are not a project convention. A real full-canvas picker should be a deliberate local toolbar/global
  addon, not layout hacks or `document.body` effects in preview.
- Use `storybook-addon-pseudo-states` for fixed CSS pseudo-class previews such as `hover` and `active`; do not use it
  for real component states such as `disabled`, `checked`, `selected`, `open`, or `loading`.
- Use `storybook-addon-rtl` for Storybook's global LTR/RTL toolbar check when reviewing layout-sensitive stories. It is
  a preview verification tool; component and story class names should still prefer logical utilities for inline-axis
  spacing, positioning, borders, and radii.
- Put shared pseudo-state defaults in `meta.parameters.pseudo` when a story file uses the same preview targets across
  stories. Use story-level `parameters.pseudo` only for exceptions.
- Target forced pseudo states with story-only `data-*` selectors such as `[data-preview="hover"]`, not repeated `id`
  selectors. Storybook Docs can render multiple canvases on one page, so repeated IDs are brittle.
- Inline simple pseudo-state selectors when they are used once. Extract selector constants only for reuse or when the
  name adds real clarity.
- For local story-only helpers, keep simple names when they stay local; choose precise names if responsibility grows.
- For story-only preview controls such as selectable icons, use a typed mapping object plus string options:
  `const BUTTON_STORY_ICONS = { ... } as const`, `type ButtonStoryIconName = keyof typeof BUTTON_STORY_ICONS`,
  `Object.keys(BUTTON_STORY_ICONS) as ButtonStoryIconName[]`,
  `type ButtonStoryIcon = (typeof BUTTON_STORY_ICONS)[ButtonStoryIconName]`, and `mapping: BUTTON_STORY_ICONS`.
  The arg may be a component value, but the control options must stay serializable strings.
- Mark story-only controls clearly in `description`, for example:
  `Story-only icon picker (this is not a Button prop!)`.
- When story-only args should not reach the rendered component, destructure and discard them explicitly:
  `render: ({ Icon: _Icon, children: _children, ...restArgs }) => ...`.
- Spread `args` before pinned comparison props:

```text
<Button {...args} size={'xs'} />
```

- For custom render stories, spread the filtered `restArgs` before pinned comparison props:

```text
render: ({ Icon: _Icon, ...restArgs }) => (
    <Button {...restArgs} size={'xs'} />
)
```

## References

Read `references/story-patterns.md` when creating a new story file, updating story controls, deciding which stories are
meaningful, or matching the button reference pattern.
