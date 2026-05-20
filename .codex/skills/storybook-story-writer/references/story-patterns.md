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

## Titles

Use Storybook titles that mirror source ownership:

```text
const title = 'Client/Components/Button'
```

For new client components, use `Client/Components/<ComponentName>` unless the repository has already established a
more specific grouping for that component category.

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
    return <Button {...restArgs}>Processing...</Button>
}
```

## Controls

Storybook Controls need runtime options arrays. For CVA-backed variants, duplicate small option arrays or local option
constants in `argTypes`:

```ts
const BUTTON_VARIANT_OPTIONS: readonly string[] = [
    'default',
    'outline',
    'secondary',
]

const STRING_UNION_SUMMARY = 'string union'
const UNION_SEPARATOR = ' | '

const meta = {
    argTypes: {
        variant: {
            table: {
                type: {
                    summary: STRING_UNION_SUMMARY,
                    detail: BUTTON_VARIANT_OPTIONS.join(UNION_SEPARATOR),
                },
            },
            control: 'select',
            options: BUTTON_VARIANT_OPTIONS,
        },
    },
}
```

Use `select` when the set is larger or when the row should stay visually quiet in Docs. Do not add a custom CVA metadata
layer only for Storybook controls.

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

For icon-like story controls, never put React components directly in `options`. Use serializable string options plus
Storybook `mapping`:

```ts
const BUTTON_STORY_ICONS = {
    Heart,
    Trash2,
    X,
} as const

const BUTTON_STORY_ICON_OPTIONS: readonly string[] = Object.keys(BUTTON_STORY_ICONS)
const UNION_SEPARATOR = ' | '

type ButtonStoryIcon =
    (typeof BUTTON_STORY_ICONS)[keyof typeof BUTTON_STORY_ICONS]

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

Intentional module-scope immutable story tables, mappings, options, and literal constants use `UPPER_SNAKE_CASE`.
Storybook convention objects such as `meta`, plus render-scope values and computed local bindings, stay `camelCase`.

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
- Do not let story-only args such as `Icon` leak into rendered DOM or primitive components through `{...args}`.
- Do not add canvas text that explains obvious visual matrices; it adds noise and duplicates story/control context.
- Do not switch to CSF Next unless the project intentionally accepts preview API churn.
- Do not add onboarding/demo Storybook files, `@storybook/addon-onboarding`, or unrelated MDX while adding component
  stories.
