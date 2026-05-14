# Nodzimo UI Story Patterns

## Reference Shape

Use `src/client/components/button/button.stories.tsx` as the current reference pattern:

- top `// noinspection JSUnusedGlobalSymbols`
- type imports from `@storybook/react-vite`
- `fn` from `storybook/test`
- local folder import such as `import { Button } from '.'`
- `meta` object with `title`, `component`, `parameters.layout`, optional `argTypes`, and shared `args`
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

## Controls

Storybook Controls need runtime options arrays. For CVA-backed variants, duplicate small option arrays in `argTypes`:

```ts
const meta = {
    argTypes: {
        variant: {
            table: {
                type: {summary: 'union'},
            },
            control: 'inline-radio',
            options: ['default', 'outline', 'secondary'],
        },
    },
}
```

Use `inline-radio` for short mutually exclusive sets. Use `select` when the set is larger or less scannable. Do not add
a custom CVA metadata layer only for Storybook controls.

## Story Order

Use this order unless the component suggests a clearer domain-specific sequence:

1. default/highest-emphasis story
2. semantic intent variants
3. important states such as disabled, loading, invalid, checked, open, selected, or destructive
4. structural usage patterns such as with icon, icon-only, nested content, or as child/slot behavior
5. comparison stories for sizes, densities, alignments, or grouped variants

## Comparison Stories

Use comparison render functions for visual scales and repeated styling variations. Keep the preview layout modest and
token-aware:

```tsx
import type {PropsWithChildren} from 'react'

function ButtonScalePreview({children}: PropsWithChildren) {
    return (
        <div className={'flex flex-col items-center gap-5'}>
            <p className={'text-nui-muted-foreground'}>
                Extra small, Small, Default, Large
            </p>
            <div className={'flex items-center gap-5'}>{children}</div>
        </div>
    )
}
```

Use NUI-prefixed semantic utilities for story helper styling when styling touches theme colors, radii, or shared rhythm.
Ordinary Tailwind layout utilities remain unprefixed.

## What To Avoid

- Do not write one story for every prop value if the result is repetitive or not useful.
- Do not include the component name in every story name when the Storybook title already scopes it.
- Do not import implementation files directly when the local folder `index.ts` exposes the component.
- Do not rely on TypeScript-only unions for controls.
- Do not switch to CSF Next unless the project intentionally accepts preview API churn.
- Do not add onboarding/demo Storybook files or unrelated MDX while adding component stories.
