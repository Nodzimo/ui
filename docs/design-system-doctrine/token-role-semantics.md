## Token Role Semantics

Tokens are not colors with fancy names.

Tokens are jobs.

The physical value can change:

```text
oklch(0.55 0.19 151)
oklch(0.967 0.001 286.375)
oklch(1 0 0 / 10%)
```

The role should not change:

```text
primary = main action surface
muted = passive support
accent = interaction feedback
border = structural boundary
input = control boundary
ring = focus signal
```

This is the rule:

```text
Physical values may change.
Role meaning should not.
```

Changing the value is theme work. Changing the meaning is design-system work. Treat those as different levels of
responsibility.

If `accent` is used as hover feedback in one component, a selected row in another component, and a decorative hero
background in a third component, the token has stopped being a role. It has become a bucket for "color I wanted here".
That is how a design system slowly turns into a pile of private exceptions.

The goal is not to memorize token names. The goal is to look at an interface and ask:

```text
What job is this piece of UI doing?
```

Then use the token that owns that job.

### Base Color Is Raw Material

shadcn themes often start from a base color family such as `neutral`, `stone`, `zinc`, `gray`, `slate`, or another
palette direction. Nodzimo also talks about base directions such as Olive for the light theme and Stone for the dark
theme.

That does not mean components should reach for raw palette colors directly.

Base color is raw material:

```text
stone
olive
neutral
emerald
```

Semantic token is interface meaning:

```text
background
foreground
card
primary
muted
accent
border
input
ring
```

Use base colors when designing or tuning the theme. Use semantic tokens when building components.

The difference:

```text
Base color asks:
What family of physical colors does this theme live in?

Semantic token asks:
What is this UI element doing?
```

Example:

```text
Wrong component thinking:
This helper text should be stone-500.

Right component thinking:
This helper text is supporting content, so it should use muted-foreground.
```

Another example:

```text
Wrong component thinking:
This divider should be a slightly darker olive.

Right component thinking:
This divider is structure, so it should use border.
```

Base colors belong to theme authors. Semantic tokens belong to component authors.

When the theme changes from daylight emerald to night emerald, components should not need to be repainted. The token
roles stay still while the physical values move underneath them.

That is the whole point.

### Surface And Foreground Pairs

Many shadcn-style tokens come in pairs:

```text
background / foreground
card / card-foreground
popover / popover-foreground
primary / primary-foreground
secondary / secondary-foreground
muted / muted-foreground
accent / accent-foreground
sidebar / sidebar-foreground
```

The simple rule:

```text
The first token paints the surface.
The -foreground token paints content that lives on that surface.
```

Examples:

```text
bg-nui-primary text-nui-primary-foreground
bg-nui-card text-nui-card-foreground
bg-nui-popover text-nui-popover-foreground
bg-nui-accent text-nui-accent-foreground
```

This pairing matters because a surface and its text are a contrast contract. If a component controls the background, it
can also choose the right foreground for that background.

Primary button:

```text
surface = primary
text = primary-foreground
```

Card:

```text
surface = card
text = card-foreground
```

Popover:

```text
surface = popover
text = popover-foreground
```

The mistake is using a foreground token without the surface it belongs to.

```text
Risky:
text-nui-primary-foreground on an ordinary page background

Why:
primary-foreground is designed to live on primary, not on the page.
```

Use `foreground` for ordinary text on the ordinary page surface. Use `muted-foreground` for supporting text. Use paired
`*-foreground` tokens when the matching `*` surface is actually present.

The question:

```text
Does this element own its surface?
```

If yes, use the pair.

```text
bg-nui-secondary text-nui-secondary-foreground
```

If no, use a text token that belongs to the surrounding surface.

```text
text-nui-foreground
text-nui-muted-foreground
text-nui-primary
```

This is why links may use `primary` as text. A link usually does not own a filled `primary` surface. It is a text signal
on the current surface. `primary-foreground` would be the wrong mental model.

### The World Tokens

#### Background

`background` is the world.

It is the default page or application surface: the place where everything else lives.

Use `background` for:

- app shells
- page backgrounds
- ordinary full-screen sections
- the root `.nui-surface` foundation
- an outline button's resting background when it should blend into the page

Do not use `background` just because something is white or dark. Use it when the element represents the base world of
the interface.

Mental model:

```text
background = the room
```

Cards, popovers, buttons, inputs, and menus are objects inside the room. They may share a similar physical color, but
they do not have the same role.

#### Foreground

`foreground` is the default voice.

It is the normal readable text and icon color on the default surface.

Use `foreground` for:

- body text
- headings
- ordinary labels
- default icons
- ghost button rest text
- outline button rest text
- table cell text

Do not use `foreground` for every piece of text. Some text has a different voice:

- use `muted-foreground` for helper text and lower-emphasis content
- use `primary` for branded links or text signals
- use `destructive` for dangerous action text
- use a paired `*-foreground` when text sits on a matching filled surface

Mental model:

```text
foreground = the normal speaking voice
muted-foreground = the quieter supporting voice
primary = the branded signal voice
```

If everything uses `foreground`, the interface can become loud in a different way: not colorful, but verbally flat.
Descriptions, hints, metadata, and disabled-adjacent explanations should not compete with labels and values.

### Surface Tokens

Surfaces are objects placed inside the world.

They create layers.

The common mistake is treating all pale or dark surfaces as `background`. That flattens the interface. The user loses
the difference between the page, a card, a menu, and a floating panel.

#### Card

`card` is a contained surface in the page.

Use `card` for:

- dashboard panels
- product cards
- settings sections
- pricing cards
- content blocks
- grouped form sections
- list item panels when they read as objects

Use `card-foreground` for normal content inside that card.

Mental model:

```text
background = the room
card = the table in the room
```

A card can be subtle. It does not need to look like a floating billboard. But it should read as an object with its own
boundary, spacing, and content area.

Do not use `card` for:

- the entire app shell
- hover feedback
- input borders
- popover menus
- selected rows unless the row is intentionally card-like

#### Popover

`popover` is a floating surface.

Use `popover` for:

- dropdown menus
- popovers
- command menus
- select content
- context menus
- tooltips when they need the same surface family
- floating panels that appear above the current layout

Use `popover-foreground` for ordinary content inside that floating surface.

Mental model:

```text
popover = a temporary layer above the room
```

The difference between `card` and `popover` is not only color. It is behavior and depth.

```text
Card:
I am part of the page layout.

Popover:
I am above the page layout.
```

A settings panel that is always on the page is probably `card`. A dropdown opened from a button is probably `popover`.

### Action Tokens

Action tokens are for persistent action meaning.

Persistent means the signal is visible before the user interacts with it.

#### Primary

`primary` is the main action surface.

It is where the brand speaks loudly.

Use `primary` for:

- the main button in a flow
- the most important call to action in a local decision context
- a compact text or icon signal only when the brand emphasis is intentional

Use `primary-foreground` for content on a `primary` filled surface.

Examples:

```text
Publish
Save
Continue
Create project
Pay now
Confirm
```

Do not use `primary` for every clickable thing. Clickability is not enough. `primary` means highest action emphasis.
Do not use it for ordinary selected, active, or highlighted local state either. That is usually `accent`.

The question:

```text
Is this the action the interface is asking the user to take?
```

If yes, `primary` may be right. If not, consider `secondary`, `outline`, `ghost`, `link`, or ordinary `accent` feedback.

#### Secondary

`secondary` is a lower-emphasis filled action.

It still has action mass. It is not passive. It is not muted. It is not disabled.

Use `secondary` for:

- important actions beside a primary action
- filled but lower-priority commands
- actions that participate in the task without becoming the task's main commitment

Examples:

```text
Save draft beside Publish
Export selected beside Create item
Pay in installments beside Pay now
Add another after Create
Apply filters in a filter panel
```

Use `secondary-foreground` for content on a `secondary` filled surface.

The difference:

```text
primary = the main commitment
secondary = an important supporting commitment
```

If the action does not deserve a filled surface, it is probably not `secondary`. It may be `outline` or `ghost`.

#### Destructive

`destructive` is danger.

Use it for:

- delete
- remove
- revoke
- reset
- disconnect
- irreversible or risky actions

Do not make destructive actions brand-colored. Danger is not a brand moment.

Destructive can appear as a filled action, text action, icon, border, or soft warning surface depending on component
design. The important part is that the role remains danger, not primary action.

### Interaction Tokens

Interaction tokens are not ordinary decoration.

They explain what is happening now.

#### Accent

`accent` is the interaction feedback surface.

It is one of the most commonly misunderstood tokens because the word sounds decorative. In this system, it is not
decoration.

`accent` means:

```text
This thing is being touched, hovered, selected, highlighted, or locally activated.
```

Use `accent` for:

- ghost button hover
- outline button hover
- menu item hover
- command item hover
- select option hover
- selected navigation item
- active sidebar item
- highlighted row
- active local tool background
- selected chip or item when the selected state is local and lower than primary

Use `accent-foreground` when content sits on an `accent` surface and needs the paired foreground.

Mental model:

```text
accent = the interface responding
```

This is the key distinction:

```text
secondary is visible before interaction.
accent appears because interaction happened or because local state is active.
```

Examples:

```text
Secondary:
Export selected button sitting in a toolbar before the user touches it.

Accent:
The row background while the user hovers that row.
```

Another example:

```text
Secondary:
Apply filters button.

Accent:
The highlighted option inside the open filter dropdown.
```

Do not use `accent` as a generic pretty surface. If it is always present and carries action mass, ask whether it is
actually `secondary`. If it is passive support, ask whether it is actually `muted`.

#### Ring

`ring` is the focus signal.

It says:

```text
You are here.
```

Use `ring` for:

- focus-visible outlines
- keyboard focus indicators
- active input focus halos
- focused buttons
- focused menu items when the component uses a ring treatment

`ring` is allowed to be stronger or more brand-derived than a permanent surface because it is temporary and
accessibility-critical. It appears only when the interface needs to communicate location.

The difference:

```text
border/input = what this thing is at rest
ring = where focus is right now
```

Input example:

```text
Rest:
border = input

Focused:
border = input
ring = ring/50
```

Button example:

```text
Rest:
background = primary

Focused:
ring = ring/50
```

Do not use `ring` as a decorative outline for ordinary surfaces. If the user is not being shown focus or active
location, `ring` is probably the wrong token.

### Support Tokens

#### Muted

`muted` is passive support.

It is quiet by design.

Use `muted` for:

- subdued panels
- empty-state surfaces
- low-emphasis background areas
- skeleton-like or placeholder-adjacent surfaces
- supporting blocks that should not read as action

Use `muted-foreground` for:

- descriptions
- helper text
- placeholders
- metadata
- timestamps
- empty-state explanations
- secondary labels
- keyboard shortcut hints
- less important table text

Mental model:

```text
muted = supporting surface
muted-foreground = supporting voice
```

Examples:

```text
Form label:
foreground

Form helper text:
muted-foreground

Empty-state explanation:
muted-foreground

Subtle empty-state panel:
muted
```

Do not use `muted` for interaction feedback.

```text
Wrong:
ghost hover = muted

Right:
ghost hover = accent
```

Why:

```text
muted is passive.
accent is responsive.
```

If `muted` becomes the hover color, passive support and active feedback start looking the same. The interface loses one
of its most important distinctions.

Do not use `muted-foreground` for disabled text by reflex either. Disabled treatment may involve opacity, cursor,
aria-disabled behavior, and component-specific state rules. `muted-foreground` means low-emphasis content, not
automatically unavailable content.

### Structure Tokens

Structure tokens define boundaries and controls. They should be readable, but they should not shout.

#### Border

`border` is general structure.

Use `border` for:

- card edges
- separators
- table dividers
- menu boundaries
- popover boundaries
- layout dividers
- section lines
- outline button borders when the component means general structure

Mental model:

```text
border = this object has an edge
```

`border` should not become an action color. A border can be warm, tinted, and harmonious with the theme, but if every
divider starts looking like a brand signal, the page becomes noisy.

Examples:

```text
Card edge:
border-nui-border

Dropdown edge:
border-nui-border

Table row divider:
border-nui-border

Section separator:
border-nui-border
```

Do not use `border` when the thing is specifically a form/control boundary and the system has a reason to distinguish
controls from ordinary layout. That is what `input` is for.

#### Input

`input` is control structure.

It belongs to fields and field-like controls.

Use `input` for:

- text input borders
- textarea borders
- select trigger borders
- checkbox/radio control boundaries when appropriate
- switch or segmented-control boundaries when they behave like controls
- outline button borders if the component intentionally follows shadcn's input-border pattern

Mental model:

```text
input = this boundary belongs to something the user can operate or edit
```

The difference:

```text
border = general object edge
input = control edge
```

Examples:

```text
Settings card:
border

Text field inside the settings card:
input

Table row divider:
border

Filter select trigger:
input
```

`input` and `border` may be physically similar, especially in a minimal theme. That is acceptable. They still represent
different jobs.

Keeping the roles separate gives the theme room to improve later:

```text
If forms feel too weak, tune input.
If layout feels too faint, tune border.
```

If everything uses `border`, the theme cannot strengthen controls without also strengthening every divider. If
everything uses `input`, the page starts treating all structure as control chrome.

That is why both tokens exist.

### Specialized Domains

#### Chart Tokens

`chart-*` tokens are for data visualization.

Use them for:

- chart series
- visualization categories
- graph colors
- dashboard data marks

Do not use chart tokens as a convenient extra palette for buttons, badges, or random decoration. Chart colors have a
different job: they separate data, not interface hierarchy.

#### Sidebar Tokens

`sidebar-*` tokens are a scoped system for sidebar surfaces and sidebar interactions.

Use them inside sidebar components when the sidebar needs its own surface, foreground, primary action, accent, border,
or ring treatment.

The reason sidebar tokens exist is that sidebars often behave like a small app shell:

- they have their own background
- they contain navigation
- they need active items
- they need separators
- they need focus states

Do not use sidebar tokens outside sidebar-like navigation areas just because their values look useful. That leaks a
domain-specific token into the general system.

### Common Confusions

#### Background Vs Card

Use `background` for the page world.

Use `card` for an object placed in that world.

```text
Dashboard page:
background

Dashboard metric panel:
card
```

If a whole page section uses `card`, the page can start looking like cards inside cards. If every panel uses
`background`, the layout can become flat and hard to scan.

#### Card Vs Popover

Use `card` for layout surfaces.

Use `popover` for floating surfaces.

```text
Settings group in the page:
card

Dropdown opened from a settings button:
popover
```

The difference is not "which one is prettier". The difference is whether the surface lives in the layout or appears
above it.

#### Foreground Vs Muted-Foreground

Use `foreground` for normal content.

Use `muted-foreground` for supporting content.

```text
Field label:
foreground

Field description:
muted-foreground

Card title:
foreground

Card metadata:
muted-foreground
```

The question:

```text
Should the user read this as primary information or supporting information?
```

If primary information, use `foreground`. If supporting information, use `muted-foreground`.

#### Primary Vs Foreground

Use `foreground` for ordinary text.

Use `primary` for brand or high-emphasis text signals.

```text
Paragraph text:
foreground

Inline link underline:
primary

Strong command-style link:
primary
```

Do not make every important word `primary`. Importance in text is often hierarchy, typography, spacing, or position.
`primary` is a brand/action signal, not a highlighter pen.

#### Primary-Foreground Vs Primary

Use `primary` for the primary surface or primary-colored text signal.

Use `primary-foreground` for content on a primary surface.

```text
Primary button background:
primary

Primary button label:
primary-foreground

Text link on page:
primary
```

Do not use `primary-foreground` for a link on the page. It is not "primary text". It is text that belongs on a primary
surface.

#### Secondary Vs Accent

Use `secondary` for a persistent filled action.

Use `accent` for interaction feedback or local active state.

```text
Toolbar button that matters before hover:
secondary

Toolbar item background on hover:
accent
```

The question:

```text
Is this visible because the action matters, or because the user is interacting with it?
```

If it matters before interaction, consider `secondary`.

If it appears because of hover, focus, selection, highlight, or local active state, consider `accent`.

#### Muted Vs Accent

Use `muted` for passive support.

Use `accent` for responsive feedback.

```text
Empty-state panel:
muted

Hovered command item:
accent
```

The difference:

```text
muted sits quietly.
accent answers back.
```

If a hover state uses `muted`, users can confuse passive background with active feedback. If a passive panel uses
`accent`, it can look selected or interactive when it is not.

#### Border Vs Input

Use `border` for general edges.

Use `input` for control edges.

```text
Card edge:
border

Text field edge:
input

Menu separator:
border

Select trigger edge:
input
```

The question:

```text
Is this boundary describing layout, or a thing the user can operate?
```

Layout boundary: `border`.

Control boundary: `input`.

#### Input Vs Ring

Use `input` for the control at rest.

Use `ring` for focus location.

```text
Input resting border:
input

Input focused outline:
ring
```

The difference:

```text
input says: this is a control.
ring says: this control is focused right now.
```

Do not make `input` do the job of `ring`. A stronger input border can make controls clearer, but it does not replace a
real focus signal.

#### Border Vs Ring

Use `border` for ordinary object edges.

Use `ring` for focus.

```text
Card edge:
border

Focused card action:
ring
```

If a permanent border is as loud as a focus ring, the user loses the focus signal. Focus should be easy to find because
it is temporary and important.

### Scenario: Settings Form

A settings screen uses many token roles at once:

```text
Page background:
background

Page title:
foreground

Settings section:
card

Section title:
card-foreground if the section owns a card surface; foreground if it reads as ordinary page text

Description under section title:
muted-foreground

Text input border:
input

Focused input:
ring

Divider between groups:
border

Save button:
primary

Save button text:
primary-foreground

Reset button:
outline structure, not muted

Hovered reset button:
accent
```

The important lesson:

```text
The form is not one color problem.
It is a set of jobs.
```

The input does not use `border` just because it has a line. It uses `input` because it is a control. The helper text
does not use `foreground` just because it is text. It uses `muted-foreground` because it is supporting information. The
hovered outline button does not use `secondary` just because it is clickable. It uses `accent` because the surface is
interaction feedback.

### Scenario: Command Menu

A command menu is a floating interface layer:

```text
Menu surface:
popover

Menu text:
popover-foreground

Search input boundary:
input

Focused search input:
ring

Group label:
muted-foreground

Item hover:
accent

Item hover text:
accent-foreground

Shortcut hint:
muted-foreground

Separator:
border

Dangerous command:
destructive
```

The command menu is a good test because many tokens are close together. If `muted`, `accent`, `border`, and `input`
collapse into the same visual treatment, the menu becomes harder to scan. If they all become too colorful, it becomes
noisy.

The goal is not maximum contrast between every token. The goal is clear role separation.

### Scenario: Data Table

A data table needs dense hierarchy:

```text
Table container:
card or background, depending on whether it reads as a panel

Header text:
muted-foreground or foreground, depending on emphasis

Row text:
foreground

Secondary cell metadata:
muted-foreground

Row dividers:
border

Hovered row:
accent

Selected row:
accent, or a documented selected-state treatment

Primary table action:
primary

Secondary table action:
secondary

Row action buttons:
ghost at rest, accent on hover
```

The common mistake is making every row action a visible filled button. That gives each row too much mass and makes the
table harder to scan.

Token roles solve this:

```text
The row is content.
The divider is structure.
The hover is accent feedback.
The row action is ghost until touched.
The page-level create action is primary.
```

### Scenario: Navigation Sidebar

A sidebar can use its scoped token family:

```text
Sidebar surface:
sidebar

Sidebar text:
sidebar-foreground

Primary sidebar action:
sidebar-primary

Primary sidebar action text:
sidebar-primary-foreground

Active or hovered sidebar item:
sidebar-accent

Active or hovered sidebar item text:
sidebar-accent-foreground

Sidebar divider:
sidebar-border

Focused sidebar control:
sidebar-ring
```

The sidebar tokens mirror the global token logic, but inside a sidebar domain. This lets the sidebar have its own
surface and interaction rhythm without stealing the general `background`, `accent`, or `border` values from the rest of
the app.

Do not use sidebar tokens as extra colors for ordinary cards or buttons. They are scoped roles, not bonus palette
slots.

### Decision Questions

When choosing a token, ask these questions in order:

1. Is this the page/world surface?
2. Is this an object on the page?
3. Is this a floating layer?
4. Is this ordinary text, supporting text, or text on a known surface?
5. Is this a persistent action?
6. Is this temporary interaction feedback?
7. Is this passive support?
8. Is this general structure?
9. Is this a control boundary?
10. Is this focus location?
11. Is this a specialized domain such as chart or sidebar?

That gives the practical mapping:

```text
world surface -> background
ordinary text -> foreground
contained object -> card
floating layer -> popover
main action -> primary
supporting filled action -> secondary
danger -> destructive
passive support -> muted
supporting text -> muted-foreground
interaction feedback -> accent
general edge -> border
control edge -> input
focus location -> ring
data series -> chart-*
sidebar domain -> sidebar-*
```

### Quick Reference

Use this as the final check, not as the whole lesson.

```text
background
The world surface. Page shell, app root, default surface.

foreground
The normal voice. Body text, labels, ordinary icons.

card
Contained layout surface. Panels, cards, grouped sections.

card-foreground
Normal content on card.

popover
Floating layer surface. Menus, dropdowns, popovers, command panels.

popover-foreground
Normal content on popover.

primary
Highest-emphasis action or brand signal.

primary-foreground
Content on primary surface.

secondary
Lower-emphasis filled action. Important, persistent, not primary.

secondary-foreground
Content on secondary surface.

muted
Passive supporting surface.

muted-foreground
Supporting voice. Descriptions, helper text, metadata, placeholders.

accent
Interaction feedback surface. Hover, selected, highlighted, active local item.

accent-foreground
Content on accent surface.

destructive
Danger and irreversible action.

border
General structural edge. Dividers, card edges, layout boundaries.

input
Control boundary. Inputs, textareas, selects, field-like controls.

ring
Focus and location signal.

chart-*
Data visualization series.

sidebar-*
Sidebar-scoped surfaces, actions, accents, boundaries, and focus.
```

The shortest version:

```text
Do not ask "what color should this be?"
Ask "what role is this playing?"
```
