## Button Action Hierarchy

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

### Token Action Hierarchy

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

### Action Mass Decision Framework

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

### The Button Hierarchy In One Line

Use this as the quick mental model:

```text
Primary: brand speaks loudly.
Secondary: brand speaks quietly.
Outline: structure supports the task.
Ghost: action stays quiet until touched.
Link: brand speaks as text.
Destructive: danger overrides brand.
```

