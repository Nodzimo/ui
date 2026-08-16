---
status: ready
---

# Make disabled cursor feedback consistent across interactive controls

## Context

NUI currently inherits inconsistent disabled cursor behavior from the selected shadcn sources:

- Checkbox, Textarea, and Select Trigger use `cursor-not-allowed` without disabling pointer targeting, so the cursor is
  visible.
- Radio Group had the same Base UI state-selector mismatch as Checkbox: its default visible Root is a `span` beside a
  hidden input. `RadioGroup disabled` correctly blocks every item and adds `data-disabled`, but copied
  `disabled:opacity-50` and `disabled:cursor-not-allowed` cannot match that `span`. The Radio Item now supports both
  `disabled:*` and `data-disabled:*`; retain this as a regression case rather than treating it as unresolved work.
- Input declares both `disabled:pointer-events-none` and `disabled:cursor-not-allowed`. The first rule removes the input
  from pointer hit testing, so the cursor declared on that same element cannot appear.
- Button declares `disabled:pointer-events-none disabled:opacity-50` and no prohibited cursor.
- The Dropdown Menu story composes the Trigger with NUI Button, so root-disabled and trigger-disabled previews inherit
  the Button behavior.

This is a CSS interaction, not evidence that the disabled prop failed. According to MDN, `pointer-events: none` makes
the element itself cease to be the pointer event target. MUI documents the same practical limitation: a disabled element
using `pointer-events: none` cannot display `cursor: not-allowed`.

The current shadcn Base UI Button and Input sources contain the same split. No authoritative shadcn rationale or merged
unifying fix was found. shadcn issue #1022 also records another consequence: hover-triggered overlays cannot target a
disabled Button while pointer events are removed.

shadcn's component source is evidence of a styling recipe, not proof that a recipe activates for Base UI's default
rendered element or that its cursor is an accessibility requirement. The audit must inspect each primitive's official
DOM/state-attribute contract before carrying `disabled:*` variants forward. In particular, distinguish native controls
from Base UI controls that expose `data-disabled` on a non-native visible Root.

## Outcome

- NUI has one documented disabled-cursor policy for public interactive controls.
- Every public control with a disabled state is classified by its actual rendered Root and state contract: native
  `:disabled`, Base UI `data-disabled`, or a deliberate composite/list-item exception.
- Hovering any visibly disabled form control or trigger shows the intended prohibited cursor.
- Disabled controls remain non-interactive through their native or Base UI behavior.
- Rest, hover, active, focus, light-theme, and dark-theme styles do not make a disabled control look enabled.
- Button composition is verified for its default native element and supported Base UI `render` cases.
- Dropdown Menu root-disabled and trigger-disabled compositions inherit the correct trigger feedback.

## Recommended solution

Prefer keeping disabled controls as pointer targets for cursor and explanatory hover feedback:

1. Remove `disabled:pointer-events-none` from Input; retain its existing prohibited cursor, opacity, and background.
2. Remove `disabled:pointer-events-none` from Button and add prohibited-cursor styling.
3. Guard Button hover and pressed transforms so disabled controls cannot acquire enabled feedback after pointer
   targeting is restored. Account for both native `:disabled` and Base UI's supported state/data contract where custom
   rendering requires it.
4. Let the Dropdown Menu trigger inherit the Button correction; do not add menu-specific trigger duplication.
5. Keep the already working Checkbox, Textarea, and Select Trigger rules.
6. Audit Checkbox, Radio Group, Switch, Select Trigger, Input, Textarea, Button, Dropdown Menu Item, Select Item, and
   Calendar against their local implementation plus the corresponding primary upstream documentation/source. Record
   whether disabled opacity and a prohibited cursor are both intended, whether `data-disabled` is required, and whether
   pointer-event suppression is a deliberate composite/list-item exception.
7. Keep Radio Group's `disabled:* + data-disabled:*` support and Checkbox's matching Root/Label support. Do not change
   those components while deciding the remaining policy unless the audit finds contradictory upstream behavior.

Do not replace Base UI controls with native wrappers and do not require every standalone control to be inside Field.

## Next step

Create the disabled-state matrix for the listed public controls. Start with Base UI Button's native and custom `render`
output, then Input, Select Trigger, and Switch; compare each with its upstream disabled example and DOM/state contract.
After the matrix confirms the policy, apply the smallest focused corrections and verify the Outcome matrix in Storybook.

## References

- [MDN `pointer-events`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/pointer-events)
- [MUI disabled Button cursor limitation](https://mui.com/material-ui/react-button/#cursor-not-allowed)
- [shadcn issue #1022: disabled Button blocks hover-triggered overlays](https://github.com/shadcn-ui/ui/issues/1022)
- [shadcn Base UI Button source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/button.tsx)
- [shadcn Base UI Input source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/input.tsx)
- [Base UI Radio](https://base-ui.com/react/components/radio)
- [Base UI Radio Root source](https://github.com/mui/base-ui/blob/master/packages/react/src/radio/root/RadioRoot.tsx)
- [shadcn Base UI Radio Group documentation](https://ui.shadcn.com/docs/components/base/radio-group)
- [shadcn Base UI Radio Group source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/radio-group.tsx)
- `docs/agent-operating-charter/checkbox-base-ui-state-and-disabled-decision.md`
- `src/client/components/button/button-variants.ts`
- `src/client/components/input/input.tsx`
- `src/client/components/dropdown-menu/dropdown-menu.stories.tsx`
- `src/client/components/checkbox/checkbox.tsx`
- `src/client/components/radio-group/radio-group.tsx`
- `src/core/components/textarea/textarea.tsx`
- `src/client/components/select/select-trigger.tsx`
