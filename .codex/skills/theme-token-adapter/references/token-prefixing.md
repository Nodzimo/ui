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

## Prefix Radius And Spacing Tokens

Use NUI radius utilities when the component radius is part of the design-system shape:

```text
--radius -> --nui-radius
var(--radius-md) -> var(--radius-nui-md)
rounded-lg -> rounded-nui-lg
```

Use NUI spacing utilities only when the spacing is intended as a reusable design-system rhythm:

```text
p-nui-sm
gap-nui-md
space-y-nui-lg
```

Do not replace incidental Tailwind spacing such as `px-2.5`, `gap-1.5`, or `size-8` unless the component contract
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

## Global CSS

The library must not silently apply app-level shadcn-style globals. Keep broad defaults scoped:

```css
@layer base {
    .nui-root * {
        @apply border-nui-border outline-nui-ring/50;
    }

    .nui-root {
        @apply bg-nui-background text-nui-foreground;
    }
}
```

If restoring pointer cursors for buttons, scope it:

```css
.nui-root button:not(:disabled),
.nui-root [role="button"]:not(:disabled) {
    cursor: pointer;
}
```

## Checks

Useful searches:

```powershell
rg --pcre2 -n "(?<!nui-)(bg|text|border|ring|outline)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar)" src
rg -n -- "--(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|radius|chart|sidebar)([^a-zA-Z0-9_-]|$)" src
```

Inspect matches before editing; documentation, examples, or comments can be false positives.
