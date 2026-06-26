# Tailwind Class Grouping

## Modifier Order

Group first by visible Tailwind modifier or selector prefix. Inside unmodified base classes, group by obvious utility
families.

Use this order:

1. Base utilities without modifiers.
2. Pseudo and user states: `hover:*`, `focus:*`, `focus-visible:*`, `active:*`, `disabled:*`.
3. ARIA states: `aria-*:*`.
4. Data-family states: `data-*:*`, `has-data-*:*`, `in-data-*:*`, `not-data-*:*`.
5. Theme, media, and context modifiers: `dark:*`, `rtl:*`, `motion-*:*`, responsive modifiers such as `sm:*` and
   `md:*`.
6. Descendant relation selectors: `*:data-*:*`, `group-*:*`, `peer-*:*`.
7. Arbitrary descendant selectors: `[&_svg]:*`, `[&>span]:*`, `[&_[data-slot=x]]:*`, and similar bracket selectors.
8. External override input such as `className`.

If one modifier family grows too large, split it by the same visible prefix: one line for `focus-visible:*`, one line
for `disabled:*`, one line for `dark:hover:*`, etc.

## Base Utility Families

For base utilities without modifiers, use these recognizable families:

- Layout and sizing: `flex`, `grid`, `block`, `inline-*`, `relative`, `absolute`, `items-*`, `justify-*`, `overflow-*`,
  `w-*`, `h-*`, `size-*`, `min-*`, `max-*`.
- Spacing: `p-*`, `px-*`, `py-*`, `ps-*`, `pe-*`, `m-*`, `mx-*`, `my-*`, `ms-*`, `me-*`, `gap-*`, `space-*`.
- Text and content behavior: `text-*`, `font-*`, `leading-*`, `tracking-*`, `whitespace-*`, `line-clamp-*`,
  `truncate`, `select-*`.
- Shape and boundary: `rounded-*`, `border-*`, `outline-*`, `ring-*`, `divide-*`.
- Surface and motion: `bg-*`, `shadow-*`, `opacity-*`, `transition-*`, `duration-*`, `ease-*`, `animate-*`.
- Miscellaneous: classes that do not clearly fit another base family.

When a base family is tiny, it can share a line with a nearby family. Prefer obvious scanning to rigid taxonomy.

## Formatting Pattern

For long inline `className` values, wrap them in the existing merge helper if one is already used nearby. In this
project, prefer `mcn` from `#lib` for class merging.

Good:

```ts
const triggerClassName = mcn(
    'flex w-fit items-center justify-between',
    'gap-1.5 py-2 ps-2.5 pe-2',
    'select-none whitespace-nowrap text-sm',
    'rounded-nui-lg border border-nui-input outline-none',
    'bg-transparent transition-colors',
    'focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20',
    'data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-nui-md),10px)] data-placeholder:text-nui-muted-foreground',
    'dark:bg-nui-input/30 dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40 dark:hover:bg-nui-input/50',
    '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    className,
)
```

Avoid:

```ts
const triggerClassName =
    'flex w-fit select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-nui-lg border border-nui-input bg-transparent py-2 ps-2.5 pe-2 text-sm outline-none transition-colors focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50 disabled:cursor-not-allowed disabled:opacity-50'
```

Also avoid using CVA only as a line-break mechanism:

```ts
const triggerStyles = cva('...')
```

Use CVA only when the component has real variant inputs.
