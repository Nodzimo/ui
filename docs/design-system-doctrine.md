# Nodzimo UI Design System Doctrine

This document records the current Nodzimo UI design direction. It is not a generic color note. It is the design brief,
the decision log, and the guardrail for future component work.

The point is simple: future work should not rediscover these decisions from scratch, flatten the palette back into
default shadcn neutrality, or add a pile of one-off tokens because one state looked awkward in one component.

## Core Position

Nodzimo UI uses the shadcn semantic token architecture as its baseline, adapted into the `nui` namespace for a
publishable library.

The project does not follow shadcn because a particular person is sacred. It follows this architecture because it is a
small, mature semantic system that encodes years of practical interface design:

- `primary` is not "the color I like"; it is the high-emphasis action surface.
- `secondary` is not "another random button style"; it is the lower-emphasis filled action.
- `accent` is the interactive hover, active, selected, and highlighted surface.
- `muted` is quiet supporting surface and low-emphasis content.
- `border` and `input` are structural boundaries, not decorative brand strips.
- `foreground` is the default text authority.

Do not replace this with token sprawl.

Avoid custom role explosions such as:

```text
primaryText
primaryTextHover
primaryTextActive
primaryBackground
primaryBackgroundHover
primaryLink
primaryLinkHover
primarySoftActive
```

That path looks flexible at first and becomes unmaintainable fast. It turns a design system into a private spreadsheet
of exceptions.

The rule is:

```text
Use the existing semantic roles harder before adding new semantic roles.
```

Adding a new token can still be valid, but it requires proof that the existing shadcn-like roles cannot express the
decision cleanly.

The current design stance is:

```text
Respect shadcn structure.
Reject shadcn blandness.
```

shadcn's default and generated styles are valuable because they are conservative, predictable, and hard to ruin. They
are a white-label foundation that can look acceptable in many projects, including projects built by engineers with
little design judgment. That is a strength.

It is also a limitation. Nodzimo UI is not trying to stay white-label. It should keep the semantic architecture, but it
does not need to inherit the most cautious visual choices when they reduce clarity or character. If `secondary`,
`accent`, `input`, disabled states, and ordinary surfaces all collapse into the same gray mass, the user experience
suffers: active actions, passive fields, and disabled controls become harder to distinguish.

Use shadcn as the structural baseline, not as a ceiling for personality.

## Day And Night Are Not A Technical Toggle

The important Nodzimo discovery is that light and dark themes should not be treated as a reluctant technical duty.

The weak approach is:

```text
Pick one brand color.
Torture its lightness until it barely works on white.
Torture it again until it barely works on black.
Call that theming.
```

Nodzimo rejects that.

Light and dark are two self-contained expressions of the same brand. They share the green DNA, but they do not need to
pretend they are the same emotional scene.

```text
Light theme: Living Emerald
Dark theme: Night Emerald
```

The light theme is the brand in daylight:

- emerald
- natural
- alive
- confident
- trustworthy
- mature
- growth-oriented
- money without looking like a bank clone
- nature without looking muddy or military
- serious without becoming dead

The dark theme is the other side of the moon:

- Tokyo night
- neon signage
- electric emerald
- electronics
- cyberpunk influence
- gamer and crypto energy, but controlled
- young, sharp, technical, and awake
- not timid, not half-neon, not a sickly compromise

This is intentional duality. The dark theme is not the light theme with a black coat. It is the brand under night
lighting. When the sun goes down, the emerald does not get dragged through mud until it technically passes contrast.
It turns into a luminous signal.

The design should feel like:

```text
Day: emerald life, nature, confidence.
Night: neon energy cutting through the dark.
```

Do not be afraid of this contrast. The mistake would be doing it halfway.

## Brand Green Direction

The light-theme brand green emerged around:

```text
oklch(0.55 0.19 151)
```

This is the light-theme primary color. Its formal name is `Living Emerald`; its internal Nodzimo nickname is
`Liverald`.

`Liverald` means living, blooming emerald: green as nature, growth, and energy, not green as a dead corporate swatch.
Use this name when discussing the light-theme brand color so future work remembers that the color is supposed to feel
alive.

It is not random green. It sits in the intended zone:

- not lime
- not teal
- not swamp
- not military
- not dead enterprise green
- not childish neon
- close enough to nature to feel alive
- saturated enough to have confidence
- dark enough to carry white text on primary buttons
- rich enough to carry links on a light surface

The dark-theme brand green emerged around:

```text
oklch(0.82 0.26 145)
```

This is the dark-theme primary color. Its formal name is `Night Emerald`; its internal Nodzimo nickname is `Nimerald`.

`Nimerald` means night emerald: the same living green impulse under city-night lighting. It is intentionally not a timid
dark-mode emerald. It is neon. It is allowed to use dark text on the primary surface because that is how high-luminance
neon surfaces work.

Use this paired brand line:

```text
Living Emerald
The brand in daylight.

Night Emerald
The brand after dark.
```

And the design mantra:

```text
In the day, it feels alive.
At night, it glows.
```

This is the current primary pairing concept:

```text
:root {
	--nui-primary: oklch(0.55 0.19 151);
	--nui-primary-foreground: oklch(0.98 0.02 151);
}

.dark {
	--nui-primary: oklch(0.82 0.26 145);
	--nui-primary-foreground: oklch(0.08 0.02 145);
}
```

The inversion is not an accident:

```text
Light primary: white text on Living Emerald / Liverald.
Dark primary: near-black text on Night Emerald / Nimerald.
```

This is one brand with two lighting conditions.

## Current Storybook Decision Trail

The primary exploration is captured in:

```text
src/client/components/button/button.stories.tsx
Client/Components/Button/Recommended emerald pair
```

Important named iterations:

```text
Iteration 6: Night Emerald breakthrough (primary x3)
The point where the dark theme stopped being a compromise and became a real theme.

Iteration 8: bolder supporting roles (primary x3)
The point where secondary/outline/ghost started gaining enough character.

Iteration 10: final role discipline (primary x3)
The current art-director candidate: character retained, hierarchy disciplined.
```

Do not delete this exploration casually. It is useful design history. If it becomes too large later, archive it into a
dedicated story or design-lab story rather than losing the trail.

## Storybook Theme Review Contract

Storybook has two separate theme surfaces, and they should not be treated as one switch.

Preview theme is for the component canvas. Use `@storybook/addon-themes` with `withThemeByClassName` so the toolbar
adds the same `dark` class that the library stylesheet expects. This is the source of truth for reviewing light and dark
component behavior.

Manager theme is Storybook's own chrome: sidebar, toolbar, bottom panels, and branding. Configure it through
`storybook/theming` and `.storybook/manager.ts` `addons.setConfig({ theme })`. Storybook's `create({ base })` only
accepts `light` or `dark`; use `getPreferredColorScheme()` when the branded manager should follow the user's system
preference at load time.

Docs pages have their own rendering surface. Use `parameters.docs.theme = themes.normal` so Docs follow the preferred
Storybook theme instead of leaving documentation pages visually disconnected from the manager.

The global preview wrapper should include:

```text
nui-surface nui-boundaries nui-interactive
```

`nui-surface` is required in Storybook because the wrapper must receive `bg-nui-background text-nui-foreground` after
the preview theme changes. Without it, transparent stories can show dark-theme tokens on a light Storybook canvas, or
light-theme tokens on a dark canvas. The wrapper-level `wrapperBackground` control remains useful as a preview-only
override, but it does not replace the required themed wrapper classes.

## Button Variant Semantics

Button variants are not random costumes. They encode action hierarchy.

The designer mistake to avoid:

```text
"Every interactive thing should be green because green is the brand."
```

That sounds branded and produces noise. Brand color is not a reward for being clickable. Color is a hierarchy tool.

### Primary

Primary is where the brand speaks loudly.

Use it for the main action the interface wants the user to take:

- Save
- Publish
- Continue
- Checkout
- Create project
- Buy
- Invest
- Confirm the main flow

Primary is allowed to be visually dominant. It is the flagship action.

Nodzimo primary behavior:

```text
Light: filled Living Emerald, white foreground.
Dark: filled Night Emerald, near-black foreground.
```

Primary should not appear many times in a dense area. If everything is primary, nothing is primary.

### Secondary

Secondary is where the brand speaks quietly.

Use it for important supporting actions that are still button-like and filled, but should not beat primary:

- Save draft
- Add another
- Invite later
- Duplicate
- Export
- Apply optional setting
- Choose a secondary path

Secondary is not "primary but weaker by accident". It is intentionally lower-emphasis.

Nodzimo secondary may carry brand character through a soft emerald or neon-tinted fill. This is acceptable and part of
the current direction. The guardrail is that secondary must not become a second primary.

If primary is a neon sign, secondary is a backlit panel. It belongs to the same city, but it is not the headline sign.

### Outline

Outline is structural.

Use it for actions that need button shape without a filled surface:

- Cancel
- Back
- Details
- View report
- Learn more
- Add later
- Open settings
- Choose an alternate path beside primary

Outline should not carry primary text by default. That makes it compete with links and primary actions.

Nodzimo outline direction:

```text
Rest:
text = foreground
border = neutral system border/input with a slight Nodzimo tint

Hover:
background = subtle emerald/neon-tinted muted or accent surface
text = foreground
border = same or slightly stronger system boundary
```

The key phrase:

```text
Outline does not carry the brand by becoming green text.
Outline carries the brand through the system: border tone, radius, hover tint, focus ring, and context.
```

The border may be slightly emerald-tinted, especially in Night Emerald, but it should still read as a structural border,
not as a primary-colored mini CTA.

### Ghost

Ghost is the quietest button.

Use it for dense UI and low-weight actions:

- toolbar actions
- row actions
- card actions
- menu-like controls
- icon buttons
- "More"
- "Edit" in a dense list
- "Sort" or "Filter" controls where the surrounding UI already provides structure

Ghost in rest state should be almost just text with button spacing and hit area.

Nodzimo ghost direction:

```text
Rest:
text = foreground
background = transparent
border = none

Hover:
background = subtle muted/accent surface
text = foreground
```

Ghost hover should be softer than secondary rest. It may use related token families, but if ghost hover becomes visually
identical to secondary, the hierarchy is too compressed.

Do not make default ghost text primary-colored unless a separate, intentional brand-ghost variant is added later. For
the default variant, neutral rest is correct.

### Link

Link is the branded text signal.

Use it for text-like actions and navigation where a button surface would be too heavy:

- Visit
- Read more
- Open documentation
- Terms
- Inline action
- A compact navigation action

Text links must be underlined by default. This is not a nostalgic web habit; it is a clarity and accessibility rule.
Color can mean brand, heading emphasis, status, or decoration. Underline is the durable signal that text is
interactive.

Preferred Nodzimo inline-link pattern:

```text
Rest:
text = foreground
underline = primary

Hover:
text = primary
underline = primary
```

This gives links permanent recognizability without turning long-form content into a field of bright green words. The
brand appears first through the underline, then the full link lights up on interaction.

Button `variant='link'` is related but not identical. It is a command/action button styled like a link, not the global
typographic rule for every hyperlink. It may use primary text when the command needs stronger action emphasis, but it
should still be underlined by default unless a specific navigation context makes the link role obvious without it.

Do not confuse link and ghost:

```text
Link = text/navigation signal, underlined by default.
Ghost = button action with hit area and hover surface.
```

### Destructive

Destructive is for dangerous or irreversible actions:

- Delete
- Remove
- Revoke
- Reset
- Destroy
- Disconnect

It should not be green. It has its own semantic color because danger is not a brand moment.

## The Button Hierarchy In One Line

Use this as the quick mental model:

```text
Primary: brand speaks loudly.
Secondary: brand speaks quietly.
Outline: structure supports the task.
Ghost: action stays quiet until touched.
Link: brand speaks as text.
Destructive: danger overrides brand.
```

## Do Not Break Hierarchy For Flavor

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

## Token Discipline

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

## Directionality And RTL

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

## NUI Intensity Rhythm

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

## Theme Character Guardrails

## Neutral Base Direction

Nodzimo's neutral foundation intentionally mixes shadcn Studio base-color directions:

```text
Light neutral base: Olive
Dark neutral base: Stone
```

The reason is optical, not theoretical purity. Olive gives the light theme a warmer, more organic surface that supports
the Living Emerald direction. In dark mode, the same olive direction becomes too heavy and militarized beside green
brand accents. Stone works better as the dark neutral base: warmer than cold neutral, but less muddy and less military
than dark olive.

Do not assume light and dark must use the same base-color family. This follows the same day/night doctrine as the brand
color: the two themes should preserve Nodzimo's identity while using the base that works best in that lighting
condition.

### Light Theme: Living Emerald

Use this language when evaluating light-theme decisions:

```text
alive
emerald
natural
confident
trustworthy
clean
grown
money, but not bank clone
nature, but not swamp
serious, but not military
```

Reject light-theme greens that feel:

- muddy
- military
- gray and tired
- corporate-bank default
- lime candy
- too teal
- too yellow
- too weak to carry links

### Dark Theme: Night Emerald

Use this language when evaluating dark-theme decisions:

```text
neon
Tokyo night
electric
sharp
technical
young
confident
cyber influence
controlled gamer/crypto energy
```

Reject dark-theme greens that feel:

- pale
- dried out
- sickly
- afraid to be neon
- halfway between enterprise and cyber
- unreadable as link text
- too dark to glow
- so loud that secondary and ghost disappear

The dark theme should look like the night version has a reason to exist.

## Practical Component Review Questions

When reviewing a component against this doctrine, ask:

1. What is the primary action?
2. Are secondary actions visually lower than primary?
3. Are structural actions using outline rather than fake-primary styling?
4. Are dense actions using ghost without stealing attention?
5. Does link look like a branded text signal?
6. Does hover reveal interactivity without changing the component's semantic role?
7. Does dark mode feel like Night Emerald, not merely inverted daylight?
8. Did we solve the problem with existing semantic tokens before inventing a new one?

## Current Theme Anchor Values

These values are the current theme anchors. When changing them later, adapt the complete token set coherently rather
than replacing only `primary`.

```text
:root {
	--nui-background: oklch(0.99 0 0);
	--nui-foreground: oklch(0.14 0.006 150);
	--nui-muted: oklch(0.93 0.035 151);
	--nui-muted-foreground: oklch(0.38 0.065 151);
	--nui-border: oklch(0.82 0.045 151);
	--nui-input: oklch(0.82 0.045 151);
	--nui-secondary: oklch(0.87 0.08 151);
	--nui-secondary-foreground: oklch(0.20 0.095 151);
	--nui-primary: oklch(0.55 0.19 151);
	--nui-primary-foreground: oklch(0.98 0.02 151);
}

.dark {
	--nui-background: oklch(0.075 0.012 148);
	--nui-foreground: oklch(0.96 0.018 148);
	--nui-muted: oklch(0.19 0.05 145);
	--nui-muted-foreground: oklch(0.78 0.10 145);
	--nui-border: oklch(0.38 0.075 145);
	--nui-input: oklch(0.30 0.075 145);
	--nui-secondary: oklch(0.25 0.11 145);
	--nui-secondary-foreground: oklch(0.86 0.19 145);
	--nui-primary: oklch(0.82 0.26 145);
	--nui-primary-foreground: oklch(0.08 0.02 145);
}
```

The real theme also includes `card`, `popover`, `accent`, `ring`, `chart-*`, and `sidebar-*`. These must be adapted with
the same doctrine, not left as unrelated defaults.

## Final Reminder

The final design should not feel like a child poured green paint over every interactive element.

It should feel like a disciplined interface where:

- the light theme has living emerald confidence
- the dark theme has Night Emerald electricity
- primary is unmistakable
- secondary has character without shouting
- outline gives structure
- ghost stays quiet until interaction
- link carries the brand as text
- tokens stay small, semantic, and maintainable

This is the standard future work should preserve.
