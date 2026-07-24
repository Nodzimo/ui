# Compound Component Patterns

Use `Select` and `Dropdown Menu` as quality references, not copy templates.

## Upstream-Derived Props

```ts
type PartProps = Primitive.Part.Props

type ContentProps = Primitive.Popup.Props &
    Pick<Primitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>
```

Preserve the primitive contract. Add only wrapper-owned props.

## Runtime Finite Values

```ts
type ContentSide = NonNullable<Primitive.Positioner.Props['side']>

const CONTENT_SIDES = Object.freeze([
    'top',
    'bottom',
    'left',
    'right',
    'inline-end',
    'inline-start',
] as const satisfies readonly ContentSide[])
```

Export the constant and type when both consumers and Storybook benefit. Do not add `undefined` to runtime options.

## Presence Boolean

```text
data-inset={inset || undefined}
```

Use only for wrapper-owned presence-based `data-*` markers. Pass primitive props such as `disabled` unchanged.

## Decomposition Test

A proposed module should:

- own one semantic group;
- compile without importing a sibling implementation module;
- avoid duplicated helpers, types, defaults, or class recipes;
- preserve the existing public names and runtime behavior.

If a sibling import is necessary, keep the coupled parts together or extract one neutral local helper.

## Public Barrel Test

- Export every intentionally public runtime part and matching consumer-useful type.
- Export finite runtime option constants with their derived types.
- Keep private indicators and implementation helpers private.
- Group re-exports by owning module.
