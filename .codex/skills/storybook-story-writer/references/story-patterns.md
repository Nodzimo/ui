# Nodzimo UI Story Patterns

## Reference Shape

Use `src/client/components/button/button.stories.tsx` as the current reference pattern:

- top `// noinspection JSUnusedGlobalSymbols`
- type imports from `@storybook/react-vite`
- `fn` from `storybook/test`
- local folder import such as `import { Button } from '.'`
- typed local option constants for control values and table metadata
- `meta` object with `title`, `component`, `parameters.layout`, `argTypes`, shared `args`, and a high-signal shared
  `render` when the component has common composition patterns
- focused semantic stories first
- comparison render stories after semantic stories

## Storybook As Consumer

Treat Storybook as the first demanding consumer of the component API. It is where the UI kit discovers early whether a
consumer can understand the public contract. Do not write private one-off option arrays inside stories when the values
are part of the component API. Expose real component constants and types, then let Storybook consume them.

This is a workaround for a concrete auto-controls failure, not a preference for verbose stories.

### Incident: Auto Controls Failure

The Button and Select work exposed a failure in the `docgen -> Storybook Controls` pipeline.

The failure was not "TypeScript cannot type this." TypeScript understands the component contracts. The failure was that
Storybook did not turn those contracts into usable runtime Controls.

For a shadcn/Radix-style Button, the usual shape is simple for docgen:

```text
export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)
```

That shape gives docgen a named props interface and a direct `forwardRef<HTMLButtonElement, ButtonProps>` component
signature. The base props are ordinary React DOM props. Even then, CVA variant values are not truly runtime metadata;
Storybook may appear to handle them better in some setups, but the mechanism is still docgen heuristics, story args, and
framework behavior, not a stable CVA introspection contract.

The current Button intentionally has a different contract because it wraps Base UI:

```ts
export type ButtonProps = ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants>
```

This is a valid consumer contract, but it is harder for docgen:

- `ButtonPrimitive.Props` is a Base UI namespace type, not plain `ButtonHTMLAttributes`.
- Base UI props include `render`, state-aware `className` / `style`, Base UI event wrappers, `nativeButton`, and
  accessibility behavior.
- `variant` and `size` are computed through `VariantProps<typeof buttonVariants>`, not declared as local fields.
- The component is a wrapper function over a Base UI primitive, so the readable API is a TypeScript intersection rather
  than a small explicit interface.

`react-docgen` can notice destructured defaults such as `variant = 'default'` and `size = 'default'`, but it does not
recover the full CVA union values as runtime select options. In practice this produced weak Autodocs output such as
unknown or object-like controls instead of clean select controls.

`react-docgen-typescript` can sometimes resolve the TypeScript union in isolation, but switching Storybook to it was
tested in this project and did not produce reliable usable Controls in the real Storybook setup. It also made other prop
extraction worse. Therefore, "flip the docgen switch" is not the accepted solution for this codebase.

The mature conclusion:

- Keep the Base UI contract. Do not replace Base UI props with simpler React DOM props only to satisfy Storybook.
- Keep CVA for styling variants.
- Promote owned finite values to component-level runtime constants and derived public types.
- Feed those same constants to Storybook `argTypes.options`.

This makes Storybook a consumer of the same public metadata that package consumers can use.

### Type Vs Interface In Stories And Components

Do not rewrite every props contract to `interface` only for docgen.

Use `type` when the contract is naturally a composition of external or computed types:

```ts
export type SelectContentProps = SelectPrimitive.Popup.Props &
    Pick<SelectPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset'>
```

Use `interface` when the component owns a mostly explicit props surface:

```ts
export interface ButtonProps extends ButtonPrimitive.Props {
    variant?: ButtonVariant
    size?: ButtonSize
}
```

The second shape may be more docgen-friendly because `variant` and `size` are direct fields, but it is not a replacement
for runtime constants. Controls still need runtime `options`; TypeScript types alone disappear at runtime.

### Compound Components

Select adds a separate problem: it is compound. `Select` root props, `SelectTrigger` props, and `SelectContent`
positioner props live on different components. Storybook cannot infer from `component: Select` that the story should
also expose controls for `SelectTrigger.size`, `SelectTrigger.aria-invalid`, `SelectContent.side`,
`SelectContent.align`, or offset props.

For compound components, model the story args as the documented composition surface:

- `triggerSize`
- `triggerAriaInvalid`
- `contentSide`
- `contentAlign`
- `contentSideOffset`
- `contentAlignItemWithTrigger`

These are not fake Select root props. They are controls for the public compound parts used by the story composition.

### Accepted Model

- Owned finite values belong at the component layer as runtime constants and derived types.
- Stories import those constants and types instead of duplicating option arrays.
- Storybook-specific table language belongs in `src/storybook/constants.ts`, not in every story file.
- Story-only controls are allowed, but they must be named and described as story-only.
- Do not describe this as a simple `forwardRef` failure. `forwardRef` can make a component signature easier for docgen,
  but it does not solve CVA runtime options, Base UI namespace props, or compound child-part props.

## Titles

Use Storybook titles that mirror source ownership:

```text
const title = 'Client/Components/Button'
```

For new client components, use `Client/Components/<ComponentName>` unless the repository has already established a
more specific grouping for that component category.

Use `.storybook/showcase` for Storybook-only design-system pages and tools that are not package components. These pages
may use titles such as `Design System/Colors`, `Design System/Icons`, or `Design System/Spacing`. Do not put those
showcase-only helpers under `src/core` or `src/client`; `src` remains the publishable library source plus colocated
stories for real components.

Keep top-level sidebar order in `.storybook/preview.tsx` through `parameters.options.storySort`, not by prefixing
titles with numbers. Preferred order:

```text
Design System
Core
Client
*
```

Use `method: 'alphabetical'` when children inside those roots should sort alphabetically.

## Args

Put generic defaults in `meta.args`:

```ts
import {fn} from 'storybook/test'

const meta = {
    args: {
        children: 'Button',
        onClick: fn(),
    },
}
```

Override labels only when the label clarifies semantics:

```ts
const destructiveStory = {
    args: {
        children: 'Delete',
        variant: 'destructive',
    },
}
```

Use `fn()` for callback props that users may inspect in Storybook Actions. Do not add fake handlers for callbacks that
are not relevant to the story or component.

When a story-only arg is needed, extend the component props instead of pretending the component owns the prop:

```ts
type ButtonStoryArgs = ComponentProps<typeof Button> & {
    Icon?: ButtonStoryIcon
}
```

Story-only args must be filtered before spreading props onto the real component unless that story intentionally consumes
them:

```tsx
render: ({Icon: _Icon, children: _children, ...restArgs}) => {
    return <Button {...restArgs}>Ready</Button>
}
```

## Controls

Storybook Controls need runtime options arrays. For public component variants, prefer importing component-owned
constants instead of duplicating story-only option arrays. Button variants and sizes are the reference pattern:

```ts
import {STRING_UNION_SUMMARY, UNION_SEPARATOR} from '../../../storybook/constants'
import {BUTTON_VARIANTS} from '.'

const meta = {
    argTypes: {
        variant: {
            table: {
                type: {
                    summary: STRING_UNION_SUMMARY,
                    detail: BUTTON_VARIANTS.join(UNION_SEPARATOR),
                },
            },
            control: 'select',
            options: BUTTON_VARIANTS,
        },
    },
}
```

Use `select` when the set is larger or when the row should stay visually quiet in Docs. Do not add a custom CVA metadata
layer only for Storybook controls, but do expose component-owned runtime constants when those values are part of the
public UI-kit contract.

For Base UI finite string unions that are public through a wrapper, TypeScript can validate the list but cannot create
the runtime list. Mirror the values in a constant and validate them with `satisfies` against the Base UI-derived type:

```ts
type SelectContentSide = NonNullable<SelectPrimitive.Positioner.Props['side']>

const SELECT_CONTENT_SIDES = Object.freeze([
    'top',
    'bottom',
    'left',
    'right',
    'inline-end',
    'inline-start',
] as const satisfies readonly SelectContentSide[])
```

Keep `undefined` in the prop type when the upstream prop is optional, but do not include `undefined` in control option
arrays. Storybook options represent explicit selectable values, not the absence of a prop.

Numeric Base UI offsets such as `sideOffset` and `alignOffset` may accept functions upstream. Stories may still use
`control: 'number'` for the documented numeric case; do not over-engineer a function editor for Controls.

Global preview-only controls belong in `.storybook/preview.tsx`, not individual component stories. The current global
preview control is `wrapperBackground`:

- display name: `Wrapper background`
- controls category: `Story canvas`
- default arg value: `transparent`
- purpose: color the decorator wrapper around the rendered story

Keep this arg out of component props by destructuring it from `storyContext.args` before rendering `<Story />`. It is
intentionally not called `Canvas background` because it does not control the entire Storybook canvas.

The global Storybook preview wrapper should carry `nui-surface nui-boundaries nui-interactive`. `nui-surface` is not a
decorative extra here: it applies the theme-aware preview background and foreground after `@storybook/addon-themes`
switches the root `dark` class. Without it, transparent stories can inherit mismatched Storybook canvas colors.

Use `@storybook/addon-themes` with `withThemeByClassName` for component-preview theme switching. This is separate from
the Storybook manager UI. Manager branding/theme should use `storybook/theming` plus `.storybook/manager.ts`
`addons.setConfig({ theme })`; `create({ base })` only accepts `'light' | 'dark'`, so use
`getPreferredColorScheme()` when the branded manager theme should follow the user's system preference at load time.
Use `storybook-dark-mode` when the Storybook manager itself needs a live light/dark toggle.

Do not collapse those two addons into one control. `storybook-dark-mode` is for Storybook chrome and Docs UI theme;
`@storybook/addon-themes` is for component tokens, story canvases, and design-system MDX pages. The
`storybook-dark-mode` `stylePreview` option can make one toggle affect the preview iframe, but that gives the manager
theme addon ownership over the same `light` / `dark` classes that `@storybook/addon-themes` already owns. In this
project that produced confusing double-toggle behavior and DOMTokenList failures when empty class names were passed.

Docs pages are a separate Storybook surface. Do not pin `parameters.docs.theme = themes.normal` when
`storybook-dark-mode` is enabled, because that leaves the Docs renderer light while the manager is dark. Bridge the
manager dark-mode state into Docs through a typed custom container:

```tsx
function ThemedDocsContainer(props: DocsContainerProps) {
    const isDark = useDarkMode()

    return (
        <DocsContainer {...props} theme={isDark ? themes.dark : themes.normal}/>
    )
}
```

Set `parameters.docs.container = ThemedDocsContainer`. Keep `theme` after `{...props}` so the hook-derived theme wins.
This uses Storybook's public Docs container API plus `storybook-dark-mode`'s public `useDarkMode()` hook; avoid the
lower-level dark-mode channel events unless a custom docs-only toggle is deliberately needed.

Standalone MDX docs need one extra bridge. Storybook issue/discussion history shows that unattached MDX pages do not
always re-render or re-run story decorators when the `@storybook/addon-themes` toolbar changes. The project hit this
with the color palette: switching the component theme on a normal story updated `html.dark`, and returning to the MDX
page showed the right token colors; switching directly on the MDX page changed the toolbar state but left the MDX token
values stale. The matching upstream discussion is
https://github.com/storybookjs/storybook/discussions/28495.

Keep the workaround inside the custom Docs container:

- read the component theme from `props.context.store?.userGlobals?.globals?.theme`.
- treat that `store` path as Storybook internal shape, not a public `DocsContainerProps` field.
- cast locally with a narrow optional type.
- toggle explicit `light` and `dark` classes on `document.documentElement`.
- do not call `useGlobals()` there; Storybook preview hooks are valid only inside decorators and story functions.

Use explicit class names in `withThemeByClassName`:

```tsx
const LIGHT_THEME = 'light'
const DARK_THEME = 'dark'

withThemeByClassName({
    defaultTheme: LIGHT_THEME,
    themes: {
        light: LIGHT_THEME,
        dark: DARK_THEME,
    },
})
```

The light class is a marker for docs synchronization. The light token values still come from `:root`; `.light` does not
need CSS rules unless the design later chooses explicit light overrides.

Enable `parameters.docs.toc` when Autodocs pages are long enough to benefit from a table of contents.

For simple token showcase pages, official MDX doc blocks are acceptable. The colors page uses `ColorPalette` /
`ColorItem` with CSS variable values such as `var(--nui-primary)`, which keeps swatches theme-aware without copying
literal light/dark values. The tradeoff is explicit: Storybook's built-in `ColorPalette` displays the variable string,
not the computed `oklch(...)` value, and it does not provide copy buttons. Do not add a custom TSX token explorer until
the project intentionally accepts that extra runtime/tooling complexity.

Spacing belongs to the same design-system showcase level as colors and icons. Use `Design System/Spacing` in the
singular because the page documents one spacing scale. A small TSX helper such as `SpacingScale` is appropriate when
the MDX page needs typed rendering logic. The helper should read public runtime variables such as
`var(--nui-spacing-md)`, not Tailwind utility mapping names such as `--spacing-nui-md`.

Biome does not process MDX in this project. Format `.storybook/showcase/**/*.mdx` manually. WebStorm inspection false
positives for Storybook MDX should be handled through the shared `Storybook MDX Documentation` inspection scope.

Production Docs must be tested as production Docs. The project has a known Storybook 10.4 / React 19 / Vite-Rolldown
incident where the dev server worked, ordinary story pages worked, but static Docs pages failed with React minified
error #130. The local diagnosis was:

- a custom Docs container activates the Storybook Docs renderer path.
- Storybook addon-docs dynamically imports `@mdx-js/react` and expects a named `MDXProvider` export.
- the production build rewrote that dynamic import to a chunk that did not expose `MDXProvider` as expected.
- React then tried to render `undefined` as a component inside `DocsRenderer`.

The current fix is intentionally isolated in Storybook build plumbing:

- `.storybook/mdx-react-proxy.ts` re-exports `MDXProvider` and `useMDXComponents` from `@mdx-js/react`.
- `.storybook/mdx-react-proxy-plugin.ts` rewrites the dynamic `import("@mdx-js/react")` from addon-docs to that proxy
  module.
- `.storybook/vite.config.ts` registers the plugin next to the Tailwind Vite plugin.

This is the narrowest accepted workaround found so far: it keeps Docs, keeps the typed dark-mode Docs container, avoids
runtime monkey patches, avoids patching `node_modules`, and stays out of the published library bundle. Treat it as
temporary. After Storybook, Vite, or Rolldown upgrades, try removing the proxy plugin and verify the production static
Docs pages. Related but not exact upstream signals: Storybook issue
https://github.com/storybookjs/storybook/issues/32604 and addon-docs/MDX export issue
https://github.com/storybookjs/storybook/issues/24792.

Use Storybook's native `layout: 'centered'` for ordinary centered component stories. If the theme toggle changes tokens
but the full canvas remains on the wrong background, fix the Storybook preview surface in `.storybook/preview.css`, not
with story wrappers:

```css
html,
.docs-story {
    background-color: var(--nui-background);
}
```

The `html` selector covers the full centered single-story preview iframe; `.docs-story` covers the separate Docs story
surface. This is a Storybook-specific workaround for the missing bridge between `@storybook/addon-themes` and canvas
backgrounds, discussed at https://github.com/storybookjs/storybook/discussions/25183. Keep the rule after Tailwind
imports and `@source` directives, use `background-color`, and do not add a separate `.storybook/preview-head.html` style
block while `preview.css` is already the active CSS entrypoint.

Do not use stale third-party Storybook color/background addons as the default answer for a free full-canvas color
picker. The official backgrounds addon is useful for presets only. If the project later needs a real global color
picker for the whole canvas, build or adopt a maintained toolbar/global addon deliberately instead of changing every
story layout or using preview `document.body` effects.

Use `storybook-addon-rtl` for the global Storybook LTR/RTL toolbar toggle. When a component has directional layout,
review it with the toggle, but keep the underlying component/story classes logical: use `ps-*`, `pe-*`, `ms-*`,
`me-*`, `start-*`, `end-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, and `rounded-e-*` for inline-axis behavior
instead of physical left/right utilities.

If hardcoded LTR story text contains neutral punctuation and looks wrong under the RTL toolbar, isolate only that text
fragment with explicit direction:

```tsx
<span dir={'ltr'}>Processing...</span>
```

Use real localized RTL text for real RTL examples. Do not make the component parse or rearrange punctuation.

Flip directional icons only at usage sites where the icon means inline direction, such as next/previous, back/forward,
or collapse start/end:

```tsx
<ArrowRightIcon className={'rtl:rotate-180'}/>
```

Do not flip external/open icons such as `ArrowUpRightIcon` used for `Visit`; that icon means external/open, not
inline-end movement. Do not flip icons in icon showcase pages, because the gallery documents raw icon assets.

For icon-like story controls, never put React components directly in `options`. Use serializable string options plus
Storybook `mapping`:

```ts
const BUTTON_STORY_ICONS = {
    Heart,
    Trash2,
    X,
} as const

type ButtonStoryIconName = keyof typeof BUTTON_STORY_ICONS

const BUTTON_STORY_ICON_OPTIONS = Object.keys(
    BUTTON_STORY_ICONS,
) as ButtonStoryIconName[]

const UNION_SEPARATOR = ' | '

type ButtonStoryIcon =
    (typeof BUTTON_STORY_ICONS)[ButtonStoryIconName]

const meta = {
    argTypes: {
        Icon: {
            description: 'Story-only icon picker (this is not a Button prop!)',
            table: {
                type: {
                    summary: 'component union',
                    detail: BUTTON_STORY_ICON_OPTIONS.join(UNION_SEPARATOR),
                },
            },
            control: 'select',
            options: BUTTON_STORY_ICON_OPTIONS,
            mapping: BUTTON_STORY_ICONS,
        },
    },
}
```

The story arg may remain the component value when that keeps stories simple. Storybook may not show the mapped default
as the selected string option because it cannot reliably reverse-map a React component value back to the option key.
Do not rewrite every story to an `iconName` arg only for that cosmetic control-state improvement unless the story file
benefits from string keys in several places.

Intentional module-scope immutable story tables, mappings, options, and literal constants use `UPPER_SNAKE_CASE`.
Storybook convention objects such as `meta`, plus render-scope values and computed local bindings, stay `camelCase`.

For several related defaults in one story composition, group them into one immutable object instead of scattering many
single constants:

```ts
const SELECT_DEFAULTS = {
    contentAlign: SELECT_CONTENT_ALIGNS[1],
    contentAlignItemWithTrigger: true,
    contentAlignOffset: 0,
    contentSide: SELECT_CONTENT_SIDES[1],
    contentSideOffset: 4,
    triggerAriaInvalid: false,
    triggerSize: SELECT_TRIGGER_SIZES[0],
} as const
```

Use the object both in `args` and `table.defaultValue.summary` so docs and canvas defaults do not drift. Use `STORY` in
the name only for values invented for the canvas; real component defaults can be named `SELECT_DEFAULTS`.

## Story Order

Use this order unless the component suggests a clearer domain-specific sequence:

1. default/highest-emphasis story
2. semantic intent variants
3. important states such as disabled, loading, invalid, checked, open, selected, or destructive
4. structural usage patterns such as with icon, icon-only, nested content, or as child/slot behavior
5. comparison stories for sizes, densities, alignments, or grouped variants

Before applying this order, decide whether the component has enough owned surface area to justify it. Do not stretch a
small component to fill the whole sequence.

## Story Budget

Plan stories by public role, not by visual possibility:

- `Default` is enough when the component has one behavior and no owned variants or states.
- Add a usage/composition story only when the composition is a pattern consumers should recognize or copy.
- Add comparison stories only for values owned by the component or design-system contract.
- Do not create stories for arbitrary `className`, native props, wrapper layout, or Tailwind mutations.

For each planned story, write the interface question it answers. Good answers sound like "How does this destructive
action read?", "How does icon-only affordance scale?", or "How does the loading state compose with label and icon?" Bad
answers sound like "Can this SVG be red?", "Can this element be bigger?", or "Can className change the look?"

### Spinner Anti-Example

A plain spinner is a leaf primitive with one owned role: indicate loading/status. It may accept `className`, but that is
a styling escape hatch, not a component variant API. Do not write `Sizes`, `Tones`, `Colors`, or visual matrix stories
for a spinner unless the spinner component explicitly defines those variants.

Reasonable spinner coverage is usually:

- `Default`, showing the canonical loading indicator and accessibility role.
- Optionally one composition story such as `Inline` or `WithLabel` if the project wants to document spinner plus loading
  text as a reusable interface pattern.

## Comparison Stories

Use comparison render functions for visual scales and repeated styling variations. Keep the preview layout modest,
token-aware, and visually quiet. Do not add explanatory text labels when the story name, controls, and visual matrix
already communicate the comparison.

```tsx
function ButtonPreviewRow({className, ...restProps}: ComponentProps<'div'>) {
    return <div className={mcn('flex gap-5', className)} {...restProps} />
}
```

Use NUI-prefixed semantic utilities for story helper styling when styling touches theme colors, radii, or shared rhythm.
Ordinary Tailwind layout utilities remain unprefixed.

For components with important composition forms, use a shared `meta.render` to show a compact usage family in every
semantic variant:

```tsx
render: ({children, Icon = Heart, ...restArgs}) => {
    return (
        <ButtonPreviewRow>
            <Button {...restArgs}>
                <Icon data-icon={'inline-start'}/> {children}
            </Button>
            <Button {...restArgs}>{children}</Button>
            <Button {...restArgs} size={'icon'}>
                <Icon/>
            </Button>
            <Button {...restArgs}>
                {children} <Icon data-icon={'inline-end'}/>
            </Button>
        </ButtonPreviewRow>
    )
}
```

For comparison stories that pin sizes or states, spread filtered args before pinned props:

```tsx
render: ({Icon: _Icon, ...restArgs}) => {
    return (
        <ButtonPreviewRow className={'items-center'}>
            <Button {...restArgs} size={'xs'}/>
            <Button {...restArgs} size={'sm'}/>
            <Button {...restArgs} size={'default'}/>
            <Button {...restArgs} size={'lg'}/>
        </ButtonPreviewRow>
    )
}
```

## What To Avoid

- Do not write one story for every prop value if the result is repetitive or not useful.
- Do not include the component name in every story name when the Storybook title already scopes it.
- Do not import implementation files directly when the local folder `index.ts` exposes the component.
- Do not rely on TypeScript-only unions for controls.
- Do not expect `react-docgen` or `react-docgen-typescript` to infer usable controls for CVA-backed wrappers or Base UI
  compound compositions. Verify, then write explicit `argTypes` when the control is part of the documentation contract.
- Do not put Storybook arg-table constants in component files. Shared labels and separators belong in
  `src/storybook/constants.ts`; component-owned variant values belong beside the component.
- Do not let story-only args such as `Icon` leak into rendered DOM or primitive components through `{...args}`.
- Do not add canvas text that explains obvious visual matrices; it adds noise and duplicates story/control context.
- Do not switch to CSF Next unless the project intentionally accepts preview API churn.
- Do not add onboarding/demo Storybook files, `@storybook/addon-onboarding`, or unrelated MDX while adding component
  stories.
