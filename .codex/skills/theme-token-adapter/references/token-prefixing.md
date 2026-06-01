# Token Prefixing Reference

## Source Of Truth

Use `src/library.css` as the token and foundation contract. `src/styles.css` is the package Tailwind entrypoint that
imports `src/library.css` and applies the package source policy. Do not invent token names if no matching `nui-*` token
exists; either map to an existing token or flag the missing token.

Shared CSS-first utility sources belong in `src/library.css` when both the package stylesheet and Storybook need them.
The current animation source is `tw-animate-css`, imported as `@import "tw-animate-css";` before local NUI declarations.
It stays in `devDependencies` because Tailwind compiles its utilities into `dist/styles.css`; consumers do not resolve
that package at runtime.

Use two layers for package-facing design tokens:

```css
:root {
    --nui-spacing-md: --spacing(4);
}

@theme inline {
    --spacing-nui-md: var(--nui-spacing-md);
}
```

- `--nui-*` is the runtime CSS-variable contract shipped in `dist/styles.css`. Consumers and Storybook showcase code can
  read it with `var(--nui-*)`.
- `--color-nui-*`, `--radius-nui-*`, and `--spacing-nui-*` inside `@theme inline` are Tailwind compiler mappings. They
  make utilities such as `bg-nui-background`, `rounded-nui-lg`, and `gap-nui-md` possible.
- A token defined only in `@theme inline` is compiler configuration, not a stable runtime token for consumers to read.
  If the value is part of the UI kit product contract, add the raw `--nui-*` variable too.

## Prefix Semantic Color Utilities

Common mappings:

```text
bg-background -> bg-nui-background
text-foreground -> text-nui-foreground

bg-card -> bg-nui-card
text-card-foreground -> text-nui-card-foreground

bg-popover -> bg-nui-popover
text-popover-foreground -> text-nui-popover-foreground

bg-primary -> bg-nui-primary
text-primary -> text-nui-primary
text-primary-foreground -> text-nui-primary-foreground

bg-secondary -> bg-nui-secondary
text-secondary-foreground -> text-nui-secondary-foreground

bg-muted -> bg-nui-muted
text-muted-foreground -> text-nui-muted-foreground

bg-accent -> bg-nui-accent
text-accent-foreground -> text-nui-accent-foreground

bg-destructive -> bg-nui-destructive
text-destructive -> text-nui-destructive

border-border -> border-nui-border
border-input -> border-nui-input
border-destructive -> border-nui-destructive

ring-ring -> ring-nui-ring
ring-destructive -> ring-nui-destructive
outline-ring -> outline-nui-ring
```

Preserve modifiers and opacity suffixes:

```text
hover:bg-muted -> hover:bg-nui-muted
dark:bg-input/30 -> dark:bg-nui-input/30
aria-expanded:text-foreground -> aria-expanded:text-nui-foreground
aria-invalid:border-destructive -> aria-invalid:border-nui-destructive
focus-visible:ring-destructive/20 -> focus-visible:ring-nui-destructive/20
```

## Theme Token Meanings

Read `docs/design-system-doctrine/README.md` and the relevant chapter files for the full design rationale. The short
Nodzimo hierarchy is:

```text
primary: brand speaks loudly.
secondary: brand speaks quietly.
outline: structure supports the task.
ghost: action stays quiet until touched.
link: brand speaks as underlined text.
destructive: danger overrides brand.
```

Light theme should express Living Emerald, internally nicknamed Liverald: natural, alive, confident, trustworthy. Dark
theme should express Night Emerald, internally nicknamed Nimerald: neon emerald, Tokyo-night, electric,
technical, and intentionally bold. Preserve this duality when adapting component colors.

Respect shadcn structure, but reject shadcn blandness. The default shadcn look is a conservative white-label baseline;
Nodzimo should keep the semantic roles while making active, passive, disabled, and structural surfaces easier to
distinguish.

Expressive color is design cost. Before adding or intensifying a role, identify the exact problem, whether it is
role-level or component-specific, whether the element controls its foreground/background pair, and which future
components will inherit the token. Do not add case-specific workaround roles such as `linkPrimary`, `headingPrimary`,
`sliderPrimary`, or `radioPrimary`; prefer the same semantic token with theme-specific values when full light/dark
quality control is worth the cost.

Use the NUI intensity rhythm for recurring color and opacity modifiers:

```text
subtle = 20
half = 50
strong = 80
```

These are intensity values, not event tokens or CSS variables. Prefer semantic color plus slash opacity over one-off
state colors:

```text
bg-nui-primary/80
bg-nui-input/50
bg-nui-destructive/20
```

Use these meanings when selecting or reviewing semantic tokens:

```text
background / foreground
Default app background and text color. Use for page shells, page sections, and default text.

card / card-foreground
Elevated surfaces and content inside them. Use for cards, dashboard panels, and settings panels.

popover / popover-foreground
Floating surfaces and content inside them. Use for popovers, dropdown menus, context menus, and overlays.

primary / primary-foreground
High-emphasis actions and brand surfaces. Use for default buttons, selected states, badges, and active accents.

secondary / secondary-foreground
Lower-emphasis persistent action surfaces. Use for secondary buttons, secondary badges, and supporting UI that should
still read as active. Secondary should be a softened brand-derived action color, not a passive gray surface.

muted / muted-foreground
Subtle surfaces and lower-emphasis content. Use for descriptions, placeholders, empty states, helper text, and subdued surfaces.

accent / accent-foreground
Interactive hover, selected, active, and highlighted surfaces. Use for ghost hover, outline hover, menu highlights,
select/command option hover, hovered clickable rows, and selected items. Accent is the interaction feedback layer; it
should be stronger than muted but quieter than secondary.

destructive
Destructive actions and error emphasis. Use for destructive buttons, invalid states, and destructive menu items.

border
Default borders and separators. Use for cards, menus, tables, separators, and layout dividers.

input
Form-control borders and input surface treatment. Use for input, textarea, select, and outline-style controls.

ring
Focus rings and outlines. Use for buttons, inputs, checkboxes, menus, and other focusable controls. Ring is a temporary
focus signal, so it may be vivid and brand-derived; components often render it through slash opacity such as
`ring-nui-ring/50`.

chart-1 ... chart-5
Default chart palette.

sidebar / sidebar-foreground
Base sidebar surface and default sidebar text.

sidebar-primary / sidebar-primary-foreground
High-emphasis actions inside the sidebar: active items, icon tiles, badges, and sidebar CTAs.

sidebar-accent / sidebar-accent-foreground
Hover and selected states inside the sidebar: menu hover states, open items, and interactive rows.

sidebar-border
Sidebar-specific borders and separators.

sidebar-ring
Sidebar-specific focus rings.
```

Button token mapping:

```text
primary rest = primary
primary hover = primary/80
secondary rest = secondary
secondary hover = secondary/80
outline rest = background + foreground + border/input
outline hover = accent
ghost rest = transparent + foreground
ghost hover = accent
focus = ring/50 or documented focus intensity
```

Do not use `muted` as the interaction layer. `muted` is passive support; `accent` is interaction feedback.

Button variant selection is about action mass:

```text
primary = main commitment
secondary = important action that participates in the current task and deserves persistent filled surface
outline = available structural/lower-commitment action that needs shape but not filled surface
ghost = local tool action that needs a hit area but no permanent form
```

Ask whether the action deserves surface, shape, or only a quiet hit area before changing colors.

## Prefix Radius And Spacing Tokens

Use NUI radius utilities when the component radius is part of the design-system shape:

```text
--radius -> --nui-radius
var(--radius-md) -> var(--radius-nui-md)
rounded-lg -> rounded-nui-lg
```

The radius scale follows the shadcn model:

- `radius-nui-lg` is the base value from `--nui-radius`.
- Smaller radii scale down from the base.
- Larger radii scale up from the base.
- Changing `--nui-radius` updates the whole radius scale.

Use NUI spacing utilities only when the spacing is intended as reusable design-system rhythm:

```text
p-nui-2xs
p-nui-sm
gap-nui-md
space-y-nui-lg
```

The current spacing scale has both raw runtime variables and Tailwind utility mappings:

```text
--nui-spacing-2xs -> --spacing(0.5) -> 2px  -> --spacing-nui-2xs
--nui-spacing-xs  -> --spacing(1)   -> 4px  -> --spacing-nui-xs
--nui-spacing-sm  -> --spacing(2)   -> 8px  -> --spacing-nui-sm
--nui-spacing-md  -> --spacing(4)   -> 16px -> --spacing-nui-md
--nui-spacing-lg  -> --spacing(6)   -> 24px -> --spacing-nui-lg
--nui-spacing-xl  -> --spacing(8)   -> 32px -> --spacing-nui-xl
--nui-spacing-2xl -> --spacing(12)  -> 48px -> --spacing-nui-2xl
```

Use `--spacing()` in `src/library.css`, not handwritten `calc(var(--spacing) * n)`. Tailwind compiles `--spacing()` to
the calc form.

Use NUI spacing for standard rhythm between sections, headings, cards, repeated groups, and shared layout patterns. Do
not replace incidental Tailwind spacing such as `px-2.5`, `gap-1.5`, or `size-8` unless the component contract
specifically calls for tokenized rhythm.

## Prefer Logical Direction Utilities

Nodzimo UI supports RTL consumers. When adapting components, use logical direction utilities for inline-axis behavior:

```text
pl-* -> ps-*
pr-* -> pe-*
ml-* -> ms-*
mr-* -> me-*
left-* -> start-*
right-* -> end-*
border-l-* -> border-s-*
border-r-* -> border-e-*
rounded-l-* -> rounded-s-*
rounded-r-* -> rounded-e-*
```

Only keep physical left/right utilities when the design intentionally targets a physical side regardless of document
direction. Symmetric utilities such as `px-*`, `mx-*`, `inset-x-*`, `border-x-*`, and `rounded-*` are already
direction-neutral.

For positioned elements, prefer Tailwind's canonical logical inset utilities when available:

```text
right-2 -> inset-e-2
left-2 -> inset-s-2
```

Match animation direction to placement semantics. Logical placements should use logical animation utilities; physical
placements can keep physical animation utilities:

```text
data-[side=inline-end]:slide-in-from-start-*
data-[side=inline-start]:slide-in-from-end-*
data-[side=right]:slide-in-from-left-*
data-[side=left]:slide-in-from-right-*
```

## Flip Directional Icons At Usage Sites

Generated icons are raw assets. Do not edit generated icon components to add RTL behavior.

Flip an icon with `rtl:rotate-180` only where the usage means inline direction:

```text
next / previous
back / forward
collapse start / collapse end
chevron start / chevron end
arrow to inline-start / arrow to inline-end
```

Do not flip icons just because their shape points left or right. External/open icons such as `ArrowUpRightIcon` used
for `Visit`, brand icons, decorative icons, spinners, hearts, trash, folders, and close icons should keep their asset
direction unless the component usage gives them directional meaning.

Storybook icon galleries show the raw icon inventory. Do not apply RTL flip classes in icon showcase pages; component
usage decides direction behavior.

## Do Not Prefix Ordinary Tailwind Utilities

Leave these alone unless they contain a semantic token:

```text
flex
inline-flex
items-center
justify-center
gap-2
px-4
text-sm
font-medium
transition-all
disabled:opacity-50
size-4
rounded-full
```

## Foundation Utilities

The library must not silently apply app-level shadcn-style globals. Keep broad defaults opt-in and split by purpose:

```css
@layer base {
    .nui-boundaries * {
        @apply border-nui-border outline-nui-ring/50;
    }

    .nui-surface {
        @apply bg-nui-background text-nui-foreground;
    }

    .nui-interactive button:not(:disabled),
    .nui-interactive [role="button"]:not(:disabled) {
        cursor: pointer;
    }
}
```

Consumers can apply all three classes at an app root for a shadcn-like app foundation, or apply any subset to a subtree.

Storybook's global preview decorator intentionally applies all three foundation classes. The `@storybook/addon-themes`
preview toggle adds or removes the `dark` class, while `.nui-surface` makes the wrapper itself consume
`bg-nui-background text-nui-foreground`. Do not remove `.nui-surface` from the Storybook wrapper only to let Storybook's
canvas background show through; transparent stories then become unreadable when preview theme tokens and canvas colors
disagree.

## Checks

Useful searches:

```powershell
rg --pcre2 -n "(?<!nui-)(bg|text|border|ring|outline)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar)" src
rg -n -- "--(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|radius|chart|sidebar)([^a-zA-Z0-9_-]|$)" src
```

Inspect matches before editing; documentation, examples, or comments can be false positives.
