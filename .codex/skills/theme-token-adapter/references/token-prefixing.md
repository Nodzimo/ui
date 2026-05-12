# Token Prefixing Reference

## Source Of Truth

Use `src/styles.css` as the contract. Do not invent token names if no matching `nui-*` token exists; either map to an
existing token or flag the missing token.

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
Lower-emphasis filled actions and supporting surfaces. Use for secondary buttons, secondary badges, and supporting UI.

muted / muted-foreground
Subtle surfaces and lower-emphasis content. Use for descriptions, placeholders, empty states, helper text, and subdued surfaces.

accent / accent-foreground
Interactive hover, focus, active, selected, and highlighted surfaces. Use for ghost buttons, menu highlights, hovered rows, and selected items.

destructive
Destructive actions and error emphasis. Use for destructive buttons, invalid states, and destructive menu items.

border
Default borders and separators. Use for cards, menus, tables, separators, and layout dividers.

input
Form-control borders and input surface treatment. Use for input, textarea, select, and outline-style controls.

ring
Focus rings and outlines. Use for buttons, inputs, checkboxes, menus, and other focusable controls.

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

The current spacing scale is:

```text
spacing-nui-2xs -> --spacing(0.5) -> 2px
spacing-nui-xs  -> --spacing(1)   -> 4px
spacing-nui-sm  -> --spacing(2)   -> 8px
spacing-nui-md  -> --spacing(4)   -> 16px
spacing-nui-lg  -> --spacing(6)   -> 24px
spacing-nui-xl  -> --spacing(8)   -> 32px
spacing-nui-2xl -> --spacing(12)  -> 48px
```

Use `--spacing()` in `src/styles.css`, not handwritten `calc(var(--spacing) * n)`. Tailwind compiles `--spacing()` to
the calc form.

Use NUI spacing for standard rhythm between sections, headings, cards, repeated groups, and shared layout patterns. Do
not replace incidental Tailwind spacing such as `px-2.5`, `gap-1.5`, or `size-8` unless the component contract
specifically calls for tokenized rhythm.

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

## Checks

Useful searches:

```powershell
rg --pcre2 -n "(?<!nui-)(bg|text|border|ring|outline)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar)" src
rg -n -- "--(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|radius|chart|sidebar)([^a-zA-Z0-9_-]|$)" src
```

Inspect matches before editing; documentation, examples, or comments can be false positives.
