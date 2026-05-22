# Sefo Nodzimo UI Design System Doctrine

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

