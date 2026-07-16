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

### Hyperlinks And Scoped Typography

References:

```text
https://www.w3.org/WAI/WCAG22/Techniques/general/G182
https://ui.shadcn.com/docs/components
https://ui.shadcn.com/docs/typeset
https://chakra-ui.com/docs/components/link
https://mui.com/material-ui/react-link/
```

Why they matter:

- WAI technique G182 identifies underlining as an additional cue that distinguishes links without relying on color
  alone.
- shadcn's component inventory contains no standalone general-purpose Link. Its Typeset system instead establishes an
  opt-in container with low-specificity `:where()` descendant rules for ordinary rendered HTML.
- Chakra UI and Material UI show the component-wrapper alternative through `asChild`, polymorphic component props, and
  router adapters. That model is useful when the design system owns behavior or a routing API, but it adds no semantics
  to Nodzimo's presentation-only requirement.

How they map to Nodzimo:

```text
underline = durable hyperlink cue
nui-links = opt-in low-specificity descendant scope
nui-link = the same recipe on one element
React Link wrapper = deferred until Nodzimo owns real behavior
```

The full architecture and trade-off record lives in
[NUI Link Foundation Decision](../agent-operating-charter/nui-link-foundation-decision.md).

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

That is a product-specific synthesis of established design-system principles, not an isolated preference.

