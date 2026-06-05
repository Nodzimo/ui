# Story Patterns

This reference is a compact working aid for `storybook-story-writer`. Keep architectural rules in
`docs/agent-operating-charter`.

## Reference Shape

Use `src/client/components/button/button.stories.tsx` as the current reference pattern:

- `// noinspection JSUnusedGlobalSymbols`
- type imports from `@storybook/react-vite`
- `fn` from `storybook/test`
- local folder import such as `import {Button} from '.'`
- typed option constants for control values and table metadata
- shared `meta.args`
- focused semantic stories first
- comparison stories after semantic stories when they document owned scales or compositions

## Story Plan Gate

For each planned story, answer the interface question it documents.

Good questions:

```text
How does this destructive action read?
How does icon-only affordance scale?
How does the loading state compose with label and icon?
```

Bad questions:

```text
Can this SVG be red?
Can className make it bigger?
Can wrapper layout move it?
```

## Control Snippets

Story-only args extend the real component props:

```ts
type ButtonStoryArgs = ComponentProps<typeof Button> & {
    Icon?: ButtonStoryIcon
}
```

Filter story-only args before rendering real component props:

```tsx
render: ({Icon: _Icon, children: _children, ...restArgs}) => {
    return <Button {...restArgs}>Ready</Button>
}
```

Use component-owned constants for public finite values:

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

For Base UI finite string unions, mirror runtime values and validate them against the upstream-derived type:

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

Use serializable string options plus `mapping` for story-only icon controls:

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

## Comparison Stories

Spread shared args before pinned comparison props:

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

Keep story helper styling modest and token-aware:

```tsx
function ButtonPreviewRow({className, ...restProps}: ComponentProps<'div'>) {
    return <div className={mcn('flex gap-5', className)} {...restProps} />
}
```

## Avoid

- Story per prop value.
- Component name repeated in every story name.
- Direct implementation imports when local `index.ts` exposes the component.
- TypeScript-only unions as Storybook control options.
- React component values directly in `options`.
- Story-only args leaking through `{...args}`.
- Canvas text that explains obvious visual matrices.
- Storybook onboarding/demo files or `@storybook/addon-onboarding`.
- CSF Next unless the project intentionally accepts preview API churn.
