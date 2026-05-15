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
const buttonVariantOptions: readonly string[] = [
    'default',
    'outline',
    'secondary',
]

const stringUnionSummary = 'string union'
const unionSeparator = ' | '

const meta = {
    argTypes: {
        variant: {
            table: {
                type: {
                    summary: stringUnionSummary,
                    detail: buttonVariantOptions.join(unionSeparator),
                },
            },
            control: 'select',
            options: buttonVariantOptions,
        },
    },
}
```

Use `select` when the set is larger or when the row should stay visually quiet in Docs. Do not add a custom CVA metadata
layer only for Storybook controls.

For icon-like story controls, never put React components directly in `options`. Use serializable string options plus
Storybook `mapping`:

```ts
const buttonStoryIcons = {
    Heart,
    Trash2,
    X,
} as const

const buttonStoryIconOptions: readonly string[] = Object.keys(buttonStoryIcons)

type ButtonStoryIcon = (typeof buttonStoryIcons)[keyof typeof buttonStoryIcons]

const meta = {
    argTypes: {
        Icon: {
            description: 'Story-only icon picker (this is not a Button prop!)',
            table: {
                type: {
                    summary: 'component union',
                    detail: buttonStoryIconOptions.join(unionSeparator),
                },
            },
            control: 'select',
            options: buttonStoryIconOptions,
            mapping: buttonStoryIcons,
        },
    },
}
```

## Story Order

Use this order unless the component suggests a clearer domain-specific sequence:

1. default/highest-emphasis story
2. semantic intent variants
3. important states such as disabled, loading, invalid, checked, open, selected, or destructive
4. structural usage patterns such as with icon, icon-only, nested content, or as child/slot behavior
5. comparison stories for sizes, densities, alignments, or grouped variants

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
- Do not add onboarding/demo Storybook files or unrelated MDX while adding component stories.
