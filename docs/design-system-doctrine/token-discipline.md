### Do Not Break Hierarchy For Flavor

Nodzimo can have character without coloring every object.

Do:

- make primary unmistakable
- let secondary carry a soft brand tint
- let outline have a visible but structural border
- let ghost reveal interaction on hover
- let link use primary as text
- make focus rings feel like Nodzimo
- keep the dark theme brave and neon

Do not:

- make outline text primary by default
- make ghost text primary by default
- make ghost hover as strong as secondary rest
- make secondary as loud as primary
- use black text on colored surfaces unless the color is truly luminous enough to justify it
- add private state tokens for every awkward component state
- flatten Night Emerald back into timid dark emerald

### Token Discipline

Nodzimo uses the existing shadcn-style roles:

```text
background
foreground
card
popover
primary
primary-foreground
secondary
secondary-foreground
muted
muted-foreground
accent
accent-foreground
destructive
border
input
ring
chart-*
sidebar-*
```

The NUI implementation prefixes these as raw variables and utilities:

```text
--nui-primary
bg-nui-primary
text-nui-primary
border-nui-border
ring-nui-ring
```

Before adding a new token, ask:

1. Is this a reusable semantic role or a one-component exception?
2. Can `secondary`, `muted`, `accent`, `border`, `input`, or `ring` express it?
3. Will this token still make sense across light and dark?
4. Will future components understand it without reading one component's implementation?

If the answer is no, do not add the token.

### Directionality And RTL

Nodzimo UI supports right-to-left consumers. Components must be written with logical direction in mind, not as
left-to-right-only layouts.

Use logical Tailwind utilities for inline-axis spacing and positioning:

```text
ps-* instead of pl-*
pe-* instead of pr-*
ms-* instead of ml-*
me-* instead of mr-*
start-* instead of left-*
end-* instead of right-*
border-s-* instead of border-l-*
border-e-* instead of border-r-*
rounded-s-* / rounded-e-* instead of rounded-l-* / rounded-r-*
```

Use physical `left`, `right`, `pl`, `pr`, `ml`, or `mr` only when the design truly means a physical side regardless of
text direction. That should be rare and deliberate.

Symmetric utilities such as `px-*`, `mx-*`, `inset-x-*`, `rounded-*`, and `border-x-*` are fine because they do not
encode a directional preference.

This matters for button icon compensation, navigation, menus, form adornments, and any component where "leading" and
"trailing" content should mirror between LTR and RTL. Prefer naming component slots as `start`/`end` or
`leading`/`trailing`, not `left`/`right`, unless the side is physically fixed.

### NUI Intensity Rhythm

Nodzimo uses a tiny intensity rhythm for recurring color and opacity modifiers.

This is not a replacement for semantic colors. It is a controlled way to modify an existing semantic role without
inventing a separate one-off color. The rhythm is intentionally event-agnostic: the names do not mention hover, active,
disabled, pressed, or mobile interaction because these values describe intensity, not a specific browser event.

Current intensity rhythm:

```text
subtle = 20
half = 50
strong = 80
```

Meaning:

```text
subtle
Light presence. Useful for subtle surfaces, destructive soft fills, quiet highlights, and low-weight state layers.

half
Middle presence. Useful when a color should visibly tint a surface without becoming the main filled action.

strong
High presence. Useful when a color should remain almost itself while giving room for hover/active/state treatment.
```

Preferred mental model:

```text
semantic color + intensity suffix = state or surface treatment
```

Examples:

```text
primary/80 = primary + strong
input/50 = input + half
destructive/20 = destructive + subtle
ring/50 = ring + half
```

This layer exists as a naming and review convention, not as CSS variables. Tailwind's slash opacity syntax is the clean
authoring API here. Do not replace readable classes such as `bg-nui-primary/80` with noisy arbitrary values such as
`bg-nui-primary/[var(--nui-alpha-strong)]`.

Preferred Tailwind forms:

```text
hover:bg-nui-primary/80
hover:bg-nui-input/50
bg-nui-destructive/20
ring-nui-ring/50
```

Whole-element opacity is different from color alpha. `bg-nui-primary/80` only changes the background color alpha;
`opacity-80` fades the entire element, including text, icons, borders, and children. Use whole-element opacity only when
the whole element should fade, such as disabled treatment. Use color slash opacity when only a surface, border, ring, or
text color should be softened.

Do not add `primary-hover`, `ghost-hover`, or `link-active` when a semantic color plus `20`, `50`, or `80` expresses the
treatment.

