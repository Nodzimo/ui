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

For compound components, keep root props real and prefix only child-part story args:

```ts
type MenuStoryArgs = MenuProps & {
    itemDisabled: MenuItemProps['disabled']
    triggerDisabled: MenuTriggerProps['disabled']
}

const meta = {
    args: {
        disabled: false,
        itemDisabled: false,
        triggerDisabled: false,
    },
    argTypes: {
        disabled: {
            control: 'boolean',
            description: 'Disables the whole menu',
            table: {defaultValue: {summary: 'false'}},
        },
        itemDisabled: {
            control: 'boolean',
            description: 'Applies to all items in this story',
            table: {defaultValue: {summary: 'false'}},
        },
        triggerDisabled: {
            control: 'boolean',
            description: 'Disables only the trigger',
            table: {defaultValue: {summary: 'false'}},
        },
    },
}
```

The `in this story` qualifier is mandatory when one story arg fans a real per-part prop out to several rendered parts.
Do not rename the prop into an invented plural.

The three disabled controls above are intentional Base UI Menu scopes. Root state propagates through the menu system,
Trigger state belongs to one trigger, and Item state belongs to one action. They only appear equivalent in a closed
single-trigger demo.

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
- Hiding a meaningful root prop because a child-part prop looks similar in one composition.
- Presenting story-wide fan-out as the production behavior of one item prop.
- Copying reference-story defaults, decorators, layout, or descriptions without checking the current component.
- Treating initial `meta.args` as proof of the component's API defaults.
- Component name repeated in every story name.
- Direct implementation imports when local `index.ts` exposes the component.
- TypeScript-only unions as Storybook control options.
- React component values directly in `options`.
- Story-only args leaking through `{...args}`.
- Canvas text that explains obvious visual matrices.
- Storybook onboarding/demo files or `@storybook/addon-onboarding`.
- CSF Next unless the project intentionally accepts preview API churn.
