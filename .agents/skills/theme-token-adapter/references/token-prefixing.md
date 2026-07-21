# Token Prefixing Checklists

This reference is the compact working aid for `theme-token-adapter`. Do not duplicate the full token doctrine here; use
`docs/agent-operating-charter` as the canonical source.

## Contents

- [Canonical Docs](#canonical-docs)
- [Semantic Utility Prefixes](#semantic-utility-prefixes)
- [Radius And Spacing](#radius-and-spacing)
- [Logical Direction Utilities](#logical-direction-utilities)
- [shadcn Registry Markers And Portal Motion](#shadcn-registry-markers-and-portal-motion)
- [Directional Icon Use](#directional-icon-use)
- [Ordinary Tailwind Utilities](#ordinary-tailwind-utilities)
- [Useful Searches](#useful-searches)

## Canonical Docs

- Token contract: `docs/agent-operating-charter/theme-token-contract.md`
- Tailwind entrypoints and source policy: `docs/agent-operating-charter/tailwind-and-styles.md`
- Design doctrine routing: `docs/agent-operating-charter/design-system-doctrine.md`
- Component styling: `docs/agent-operating-charter/component-styling.md`
- Storybook theming and Docs surfaces: `docs/agent-operating-charter/storybook-theming-and-docs.md`
- Verification: `docs/agent-operating-charter/verification.md`

## Semantic Utility Prefixes

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

## Radius And Spacing

Use NUI radius utilities when the radius is part of the design-system shape:

```text
--radius -> --nui-radius
var(--radius-md) -> var(--radius-nui-md)
rounded-lg -> rounded-nui-lg
```

Use NUI spacing utilities only for shared design-system rhythm:

```text
p-nui-2xs
p-nui-sm
gap-nui-md
space-y-nui-lg
```

Leave incidental tuning alone unless the component contract calls for tokenized rhythm:

```text
px-2.5
gap-1.5
size-8
```

## Logical Direction Utilities

Use logical utilities for inline-axis behavior:

```text
pl-* -> ps-*
pr-* -> pe-*
ml-* -> ms-*
mr-* -> me-*
left-* -> start-*
right-* -> end-*
right-2 -> inset-e-2
left-2 -> inset-s-2
border-l-* -> border-s-*
border-r-* -> border-e-*
rounded-l-* -> rounded-s-*
rounded-r-* -> rounded-e-*
```

Keep physical left/right utilities only when the design intentionally targets a physical side. Symmetric utilities such
as `px-*`, `mx-*`, `inset-x-*`, `border-x-*`, and `rounded-*` are direction-neutral.

Match animation direction to placement semantics:

```text
data-[side=inline-end]:slide-in-from-start-*
data-[side=inline-start]:slide-in-from-end-*
data-[side=right]:slide-in-from-left-*
data-[side=left]:slide-in-from-right-*
```

## shadcn Registry Markers And Portal Motion

Treat `cn-rtl-flip` as an upstream registry/CLI marker, not a runtime class or animation:

```text
cn-rtl-flip -> rtl:rotate-180
```

The shadcn registry template contains the marker, and its RTL transformer explicitly replaces it:

- Registry usage:
  <https://github.com/shadcn-ui/ui/blob/20442886c5cfb440441c35030462fbdf64838655/apps/v4/registry/bases/base/ui/dropdown-menu.tsx#L103-L129>
- Marker declaration and logical slide mappings:
  <https://github.com/shadcn-ui/ui/blob/20442886c5cfb440441c35030462fbdf64838655/packages/shadcn/src/utils/transformers/transform-rtl.ts#L71-L80>
- Marker replacement:
  <https://github.com/shadcn-ui/ui/blob/20442886c5cfb440441c35030462fbdf64838655/packages/shadcn/src/utils/transformers/transform-rtl.ts#L139-L151>
- Logical `DropdownMenuSubContent` side mapping:
  <https://github.com/shadcn-ui/ui/blob/20442886c5cfb440441c35030462fbdf64838655/packages/shadcn/src/utils/transformers/transform-rtl.ts#L82-L92>
- Logical slide transformation:
  <https://github.com/shadcn-ui/ui/blob/20442886c5cfb440441c35030462fbdf64838655/packages/shadcn/src/utils/transformers/transform-rtl.ts#L189-L201>

Do not copy or define `.cn-rtl-flip`. Apply `rtl:rotate-180` only at a directional icon usage site. Keep popup
`animate-in/out`, `fade-*`, `zoom-*`, and `slide-*` utilities backed by the existing `tw-animate-css` import.

For a portaled popup using logical slide utilities, inspect the rendered element's computed `direction` in LTR and RTL.
The current shadcn guide records a `tw-animate-css` caveat and recommends passing `dir` to portaled content when the
direction is lost: <https://ui.shadcn.com/docs/rtl#animations>. Forward the effective direction only when needed; do not
hardcode `dir='rtl'` or assume every Portal loses document direction.

## Directional Icon Use

Generated icons are raw assets. Do not edit generated icon components to add RTL behavior.

Use `rtl:rotate-180` only where the usage means inline direction:

```text
next / previous
back / forward
collapse start / collapse end
chevron start / chevron end
arrow to inline-start / arrow to inline-end
```

Do not flip external/open icons, brand icons, decorative icons, spinners, hearts, trash, folders, close icons, or icon
gallery inventory unless the specific usage gives the asset inline-direction meaning.

## Ordinary Tailwind Utilities

Do not prefix ordinary structural utilities:

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

## Useful Searches

Search for unprefixed semantic utilities:

```powershell
rg --pcre2 -n "(?<!nui-)(bg|text|border|ring|outline)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar)" src
```

Search for unprefixed raw shadcn variables:

```powershell
rg -n -- "--(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|radius|chart|sidebar)([^a-zA-Z0-9_-]|$)" src
```

Search for unresolved shadcn RTL markers and physical motion under logical side variants:

```powershell
rg -n "cn-rtl-flip|data-\[side=inline-(start|end)\]:slide-(in-from|out-to)-(left|right)" src
```

Inspect matches before editing; documentation, examples, or comments can be false positives.
