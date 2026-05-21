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

## Living Interface Principle

The goal is not to color the interface because green is beloved. The goal is to make interaction legible.

Nodzimo should use brand energy to clarify what can be acted on, not to flatten every action into the same level of
importance. The user should be able to scan a screen and understand:

- this is the main action
- this is a secondary action
- this is a quiet local tool
- this is an input
- this is disabled
- this is static content

If a user cannot visually separate an active button, an input, a disabled control, and a plain content block without
hovering around the page, the design is too muddy. Neutrality has failed the product.

This is the practical reason Nodzimo rejects bland shadcn defaults. The problem is not that gray is ugly. The problem is
when gray-on-gray treatment hides affordance and turns interaction into guesswork.

Nodzimo's design should revive the interface, not decorate it. A living interface separates clickable from static,
available from disabled, primary from secondary, and local tool from page-level action. It should feel clear,
predictable, and deliberate before the user touches anything.

This does not mean every interactive element becomes loud. It means every interactive element has an understandable
place in the hierarchy. Primary, secondary, outline, ghost, link, forms, focus rings, inputs, disabled controls, and
static content must each do their actual job.

Use the brand language to make the system readable and memorable. Do not turn the product into a sterile government
form. Do not turn it into a green fireworks show either. The target is elegant clarity: alive enough to be understood,
disciplined enough to be trusted.

Use these lines as review standards:

```text
If the user cannot tell what can be touched, the interface is not elegant. It is unfinished.

Brand color is not a reward for being clickable.
Brand energy is a tool for making interaction legible.
```

The correction is not "make everything green." The correction is:

```text
Make interaction detectable.
Keep hierarchy intact.
Let the brand clarify, not decorate.
```

## Design Economics

Every expressive decision has a maintenance cost.

The cost is not only the color value itself. It is the full support matrix:

```text
theme
surface
state
component
density
contrast
future reuse
```

A color that looks good on one button can fail on a link, a slider track, a radio border, a selected row, a dense
toolbar, or a dark card. A color that works on one surface can become a muddy spot or a weak whisper on another.

This is why shadcn's default restraint is powerful. It is not merely "safe for beginners." It is an economic decision:
fewer expressive tokens create fewer failure points. The result is extremely scalable and hard to ruin, but it accepts
some compromises, especially for thin expressive elements on uncontrolled surfaces.

The Nodzimo decision is not to add complexity for self-expression alone. Complexity must buy something specific.

Use this diagnostic before adding or intensifying any expressive token:

1. What exact problem are we solving?
2. Is the problem role-level or component-specific?
3. Can an existing semantic role solve it?
4. Does the element control its foreground/background pair?
5. Does the value need to work on both light and dark surfaces?
6. What future components will inherit this token?
7. Is the added cost worth the quality gained?

The rule:

```text
Do not pay design complexity unless it buys quality, clarity, or accessibility.
```

## Theme-Specific Values

One physical color cannot always perform the same semantic role equally well in light and dark conditions.

This is most visible when an expressive element does not control its own foreground/background pair. A filled primary
button controls the pair:

```text
background = primary
foreground = primary-foreground
```

That pair can be tuned for contrast.

A link, underline, slider track, radio border, focus mark, or selected indicator often controls only one expressive
stroke or text color while sitting on an external surface:

```text
color = primary
surface = current background, card, popover, muted surface, or something else
```

That is the weak spot of a minimal one-value-per-role system. The same physical color may be rich and readable in the
light theme but too dark in the dark theme, or luminous in the dark theme but too loud or thin in the light theme.

There are two valid strategies:

```text
Acceptable strategy:
Use conservative values that work "well enough" across many contexts.
This keeps the system cheaper, more portable, and harder to break.

Quality-control strategy:
Use the same semantic token with theme-specific values.
This costs more, but gives full control in each lighting condition.
```

Nodzimo prefers the second strategy only when the quality gain is real and worth the cost.

The important distinction:

```text
Wrong:
Add case-specific tokens such as linkPrimary, headingPrimary, sliderPrimary, radioPrimary.

Right:
Keep the semantic token stable and assign theme-specific values to that role.
```

Or:

```text
Same semantic token.
Theme-specific value.
```

This is not a workaround. It is what theme variables are for.

The exact names and story are local art direction:

```text
Living Emerald in the light.
Night Emerald in the dark.
```

The underlying reason is practical:

```text
The cost is not paid for self-expression.
The cost is paid for quality control.
Self-expression is the upside of paying that cost.
```

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

Storybook has separate theme surfaces, and they should not be treated as one switch.

Preview theme is for the component canvas. Use `@storybook/addon-themes` with `withThemeByClassName` so the toolbar
adds the same `light` / `dark` class contract that the library stylesheet expects. This is the source of truth for
reviewing light and dark component behavior, including design-system token documentation.

Manager theme is Storybook's own chrome: sidebar, toolbar, bottom panels, and branding. Configure it through
`storybook/theming` and `.storybook/manager.ts` `addons.setConfig({ theme })`. Storybook's `create({ base })` only
accepts `light` or `dark`; use `getPreferredColorScheme()` when the branded manager should follow the user's system
preference at load time. Use `storybook-dark-mode` for the live manager light/dark toggle. Do not let
`storybook-dark-mode` own the component preview iframe; that collapses the tool theme and product theme into one switch
and conflicts with `@storybook/addon-themes`.

Docs pages have their own rendering surface. Use the custom Docs container in `.storybook/preview.tsx` so Docs chrome
follows `storybook-dark-mode`, while standalone MDX token pages still follow the component theme from
`@storybook/addon-themes`. This is necessary because unattached MDX pages do not reliably re-run story decorators when
the component-theme toolbar changes while the user is already on that MDX page.

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

Use these two hard review lines when the hierarchy gets blurry:

```text
If the user cannot tell where the action is, the design has failed.
Hierarchy is more important than love for the brand color.
```

Use this implementation line when adapting shadcn-style components:

```text
Do not paint the component by hand. Tune the tokens until the existing semantic classes become alive.
```

If a button needs private color classes to look clickable, first suspect the theme tokens. The preferred fix is to make
`secondary`, `accent`, `border`, `input`, `ring`, and related semantic tokens carry enough Nodzimo character that
standard shadcn-like component classes become readable without breaking their roles.

## Token Action Hierarchy

The hardest lesson in this design system is that "interactive" is not one color. Interaction has hierarchy.

Nodzimo uses four brand-derived semantic levels:

```text
primary
Main action. Permanent on the screen. Highest emphasis.

secondary
Secondary action. Permanent on the screen. Lower than primary, still clearly active.

accent
Interaction feedback layer. Usually temporary or contextual: hover, selected, highlighted, active item.

ring
Focus signal. Temporary accessibility and location signal. It can be close to primary because it appears only while
focus needs to be communicated.
```

And three neutral/structural levels:

```text
muted
Passive support. Descriptions, placeholders, empty states, subdued panels, quiet content.

border
Structure. Separators, card edges, layout dividers, menu boundaries.

input
Form/control structure. Input borders and control surfaces.
```

Do not collapse these roles.

### Permanent Action Colors

`primary` and `secondary` are persistent action surfaces. They can sit on the screen before the user touches anything.

`primary` is the main action:

- Buy
- Pay
- Create
- Publish
- Continue
- Confirm

`secondary` is the second meaningful action:

- Buy in installments
- Save draft
- Export
- Duplicate
- Add another
- Apply optional setting

`secondary` is not muted, disabled, or decorative. It must look clickable. It should feel like a softened relative of
`primary`, not like a random gray chip. But it must never become a second primary.

Mental emphasis scale:

```text
primary   = 100%
secondary = 55-70%
```

### Interaction Feedback Color

`accent` is not another CTA color. It is the interaction layer.

Use `accent` for:

- `ghost:hover`
- `outline:hover`
- menu item hover
- select option hover
- command item hover
- active navigation item
- selected item
- hovered clickable row

`ghost:hover` and `outline:hover` may share the same `accent` background. That is correct because both are local
interaction feedback. They must not share `secondary` as their hover background. If ghost hover becomes visually equal
to secondary rest, the hierarchy is compressed and the interface starts lying about action importance.

Mental emphasis scale:

```text
accent = 20-40%
```

`accent` should be stronger than passive `muted`, but quieter than `secondary`.

### Focus Signal Color

`ring` is not an action surface. It is a signal:

```text
You are here.
```

Because focus is temporary, `ring` can be much closer to `primary` than a permanent surface would be. A strong focus
ring does not compete with primary because it appears only when the interface needs to communicate keyboard/focus
location. This is especially important for accessibility.

The current component pattern often applies ring with opacity:

```text
ring-nui-ring/50
```

That means the raw `ring` token may be vivid and brand-derived while the rendered ring remains controlled.

### Passive And Structural Tokens

`muted`, `border`, and `input` are not action tokens.

Do not make `muted` green just to make a ghost hover look alive. That poisons passive descriptions, helper text,
placeholders, empty states, and quiet panels.

Do not make `border` or `input` brand-colored just to make outline buttons look exciting. That turns structural edges
and form controls into fake actions.

These tokens may be warm, readable, and harmonious with the theme base. They should not carry the brand action signal.

### Button Token Mapping

Use this mapping when implementing or reviewing button variants:

```text
Primary rest:
background = primary
foreground = primary-foreground

Primary hover:
background = primary/80

Secondary rest:
background = secondary
foreground = secondary-foreground

Secondary hover:
background = secondary/80

Outline rest:
background = background
foreground = foreground
border = border or input

Outline hover / expanded:
background = accent
foreground = accent-foreground or foreground

Ghost rest:
background = transparent
foreground = foreground
border = none

Ghost hover / expanded:
background = accent
foreground = accent-foreground or foreground

Focus:
ring = ring/50 or the component's documented focus intensity
```

The important sharing rule:

```text
ghost:hover and outline:hover may share accent.
secondary rest must not share accent if it makes secondary and local hover feedback equal.
muted must not be used as the interaction layer.
```

Base semantic tokens should be resolved colors. State treatment may use slash opacity.

```text
Resolved token:
--nui-secondary
--nui-accent
--nui-ring

State modifier:
bg-nui-primary/80
bg-nui-secondary/80
ring-nui-ring/50
```

Do not invent independent colors for every state. Invent relationships:

```text
primary   -> main brand action
secondary -> softened brand action
accent    -> softer brand-derived interaction feedback
ring      -> brand-derived focus signal
```

## Action Mass Decision Framework

The most reliable way to choose a button variant is not to ask "which one looks nice?" It is to ask:

```text
Does this action deserve mass?
```

Mass means persistent visual weight: a filled surface, a visible boundary, or a permanent hit-area signal. The more an
action participates in the current task, the more mass it can justify. The more it merely supports, exits, configures,
or decorates the task, the less mass it should carry.

This resolves the common confusion between `secondary`, `outline`, and `ghost`.

### Primary: The Task's Main Commitment

Primary answers:

```text
What is the main thing the user is expected to do here?
```

Use primary for the principal action of the current screen, section, dialog, or flow:

- Pay now
- Buy
- Create
- Publish
- Save
- Continue
- Confirm
- Play / pause when the player is the whole interface

Primary deserves the strongest filled surface because it is the interface's main commitment. It should usually be rare:
one per screen, one per section, or one per local decision context. If several actions all look primary, the interface
has stopped making a decision.

### Secondary: Important Action With Surface

Secondary answers:

```text
What important action also participates in the current task, but is not the main commitment?
```

Secondary is not merely "the gray button". It is an important action that deserves a persistent filled surface, but not
the primary spotlight.

Use secondary for actions such as:

- Pay in installments beside `Pay now`
- Save draft beside `Publish`
- Export selected beside `Create item`
- Add another after `Create`
- Duplicate when duplication is a core workflow action
- Apply filters when filtering is a main task in the current panel
- Previous / next / fullscreen in a media player when playback control is the current task

Secondary does not have to "sell" something. It has to matter operationally. It participates in the task.

The key phrase:

```text
Secondary = important action, not the main action.
```

Or:

```text
Secondary participates in the task.
```

This is why Nodzimo lets `secondary` speak with a softened brand-derived surface. If secondary is important enough to
be a filled button, it must not look like disabled chrome, a passive field, or random gray furniture.

### Outline: Available Structural Action

Outline answers:

```text
What action should be available and recognizable, but should not carry filled-surface weight?
```

Outline has form, but not mass. It is a real button shape without a persistent filled surface.

Use outline for actions such as:

- Back
- Cancel
- Learn more
- View details
- Preview
- Reset filters
- Open settings
- Open queue
- Choose an alternate path beside a stronger action

Outline is not "unimportant". It is lower-commitment. It supports navigation, structure, alternatives, inspection, and
reversibility around the task.

The key phrase:

```text
Outline = available structural action, lower commitment.
```

Or:

```text
Outline supports the task.
```

Outline should not carry primary-colored text at rest. It already has form. Its interaction feedback should arrive on
hover/focus through `accent` and `ring`, not by pretending to be a primary or secondary action.

### Ghost: Local Tool Without Permanent Form

Ghost answers:

```text
What action should exist as a hit area, but permanent form would create noise?
```

Ghost has a hit area and accessible behavior, but no persistent surface and no persistent border. It becomes visually
button-like when touched, hovered, focused, selected, or otherwise activated.

Use ghost for:

- close `X` in dialogs, sheets, popovers, and panels
- row actions in a data table
- card header tools
- toolbar icon buttons
- collapse / expand controls
- more menus
- edit actions inside dense lists
- local sort/filter/toggle controls inside a dense control strip

The key phrase:

```text
Ghost = local tool action, quiet until touched.
```

Or:

```text
Ghost supports the interface around the task.
```

Ghost does not deserve a filled surface at rest because the surrounding layout already provides context. Adding a
permanent button surface would make the interface busier without making the task clearer.

### Secondary Vs Outline

This is the most important distinction:

```text
Secondary:
I am important enough to deserve a persistent filled surface.

Outline:
I should be available and shaped like a button, but I do not deserve filled-surface weight.
```

Another way to say it:

```text
Secondary participates in the task.
Outline supports navigation, structure, inspection, alternatives, or reversal around the task.
```

Examples:

```text
Checkout:
Primary   = Pay now
Secondary = Pay in installments
Outline   = Back to cart
Ghost     = Close promo banner

Editor:
Primary   = Publish
Secondary = Save draft
Outline   = Preview
Ghost     = More formatting tools / close panel

Data table:
Primary   = Create item
Secondary = Export selected
Outline   = Reset filters
Ghost     = Row actions such as Edit, Duplicate, More

Media player:
Primary   = Play / pause
Secondary = Previous, Next, Fullscreen, Shuffle when playback control is central
Outline   = Open queue, Settings, Lyrics when supporting the playback task
Ghost     = Close player, collapse player, more menu
```

Use this question when uncertain:

```text
Does this action deserve surface, shape, or only a quiet hit area?
```

Answer it as:

```text
Surface = secondary or primary.
Shape without surface = outline.
Quiet hit area = ghost.
```

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
background = accent
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

Concrete examples:

- A table row with `Edit`, `Duplicate`, and `More` actions at the end of each row. If every row action has a filled
  button surface, the table stops being scannable.
- A card header with small `Refresh`, `Collapse`, or `Open menu` actions. The card content is the object; the actions
  are tools around it.
- A dialog, sheet, popover, or panel close control: the `X` in the corner is still a real button with a hit area and
  accessible label, but it should not look like a filled or outlined call to action. It becomes visibly button-like on
  hover/focus.
- A toolbar inside an editor, filter bar, data grid, or settings panel. The user needs many controls nearby, but none
  of them should look like the page's main call to action.
- A navigation or menu item where the surrounding layout already proves the element is interactive. Adding a full
  button shape would be visual noise.

Ghost in rest state should be almost just text with button spacing and hit area.

The mental model:

```text
Ghost says: I am an action, but I will not interrupt dense UI until you touch me.
```

Nodzimo ghost direction:

```text
Rest:
text = foreground
background = transparent
border = none

Hover:
background = accent
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

## References And Evidence

This doctrine is not built on "we like green." The Nodzimo names, day/night story, and exact OKLCH values are local art
direction. The underlying principles are standard design-system practice: action hierarchy, semantic color roles,
interaction states, focus visibility, disabled/passive distinction, and tokenized theming.

Use these references as the evidence trail when reviewing or challenging this doctrine.

### Microsoft Fluent 2

Reference:

```text
https://fluent2.microsoft.design/components/web/react/core/button/usage
https://fluent2.microsoft.design/color-tokens/
```

Why it matters:

- Fluent treats buttons as actions and explicitly separates button types, layout priority, behavior, and accessibility.
- Fluent recommends one primary button in a layout for the most important action.
- Fluent recommends outline, subtle, or transparent appearances for many minor actions to avoid a busy layout.
- Fluent warns against giving secondary actions the same visual weight as primary actions.
- Fluent color tokens separate neutral, brand, status, and generic groups. Brand tokens reinforce identity; neutral
  tokens support base surfaces and text.

How it maps to Nodzimo:

```text
primary = main action
secondary / outline / ghost = lower emphasis actions
accent = interaction feedback layer
neutral tokens = passive and structural base
brand tokens = identity and action energy
```

### IBM Carbon

Reference:

```text
https://carbondesignsystem.com/components/button/usage/
https://carbondesignsystem.com/components/button/style/
https://carbondesignsystem.com/elements/color/overview/
```

Why it matters:

- Carbon says each page should have only one primary button, with remaining calls to action represented as lower
  emphasis buttons.
- Carbon describes primary as the principal call to action and ghost as the least pronounced action.
- Carbon gives concrete ghost use cases: data table actions, productive cards, side panels, and cancel actions in
  progressive flows.
- Carbon's button style documentation assigns distinct tokens to primary, secondary, tertiary, ghost, hover, active,
  focus, disabled, and danger states.
- Carbon's color documentation frames tokens as reusable, scalable abstractions that allow design-language changes at
  scale and support theming.

How it maps to Nodzimo:

```text
primary = principal CTA
secondary = lower-emphasis persistent action
ghost = least pronounced local/supplementary action
focus = separate tokenized signal
tokens = semantic abstraction, not hard-coded component paint
```

Carbon is stricter than Nodzimo in some examples, especially around secondary as a negative paired action. That does
not invalidate Nodzimo's secondary direction; it shows that button hierarchy is a serious system-level topic, not a
random styling preference.

### Google Material / Material Web

Reference:

```text
https://material-web.dev/components/button/
```

Why it matters:

- Material Web documents multiple button types: elevated, filled, filled tonal, outlined, and text.
- This supports the core idea that buttons are not just one component with random styles. Button treatment encodes
  visual emphasis and role.

How it maps to Nodzimo:

```text
primary filled action = primary
tonal/lower-emphasis filled action = secondary
outlined/text-like action = outline / ghost / link family
```

### Material UI Palette

Reference:

```text
https://mui.com/material-ui/customization/palette/
```

Why it matters:

- MUI's palette customization exists specifically so component colors can be modified to suit a brand.
- MUI exposes `primary` and `secondary` palette roles instead of limiting brand expression to one button color.

How it maps to Nodzimo:

```text
brand theming is expected
secondary can be a real palette role
component color should be systematic, not hard-coded per component
```

### Apple Human Interface Guidelines

Reference:

```text
https://developer.apple.com/design/human-interface-guidelines/buttons
```

Why it matters:

- Apple treats button styling, content, and role as part of communicating what an action does and how important it is.
- Apple is useful here as a role-and-hierarchy reference, not as a direct token model for Nodzimo's Tailwind/shadcn
  implementation.

How it maps to Nodzimo:

```text
button role matters
visual treatment should communicate action importance
danger/destructive roles are separate from ordinary brand actions
```

### W3C WCAG / WAI

Reference:

```text
https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
```

Why it matters:

- WCAG 2.2 highlights focus visibility through focus-related criteria, including Focus Appearance.
- WAI describes focus indicators as needing sufficient size and contrast because many users cannot perceive small
  visual changes.

How it maps to Nodzimo:

```text
ring = focus signal
focus must be visible
ring may be vivid and brand-derived because it is temporary and accessibility-critical
```

### Final Evidence Summary

The exact Nodzimo palette is local. The doctrine behind it is not.

Supported by the references above:

```text
Actions need hierarchy.
Primary should be rare and prominent.
Secondary actions need lower emphasis, not equal weight.
Ghost/subtle/transparent actions are valid for dense or supplementary UI.
Interaction states need visible feedback.
Focus needs an explicit visible signal.
Danger/destructive states need separate semantics.
Tokens should encode roles so values can change without repainting components by hand.
Brand theming is expected, but it must not erase role distinctions.
```

Nodzimo's contribution is the art direction and the exact mapping:

```text
Living Emerald / Night Emerald
primary = main brand action
secondary = softened brand action
accent = brand-derived interaction feedback
ring = brand-derived focus signal
muted / border / input = passive and structural
```

That is a product-specific synthesis of established design-system principles, not a private fantasy.

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
