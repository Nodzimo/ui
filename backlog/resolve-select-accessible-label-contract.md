---
status: ready
---

# Resolve the Select accessible label contract

## Context

NUI Select is adapted from the shadcn Base UI implementation and preserves its compound structure. The current public
`SelectLabel` is correctly derived from `SelectPrimitive.GroupLabel.Props` and renders
`SelectPrimitive.GroupLabel`. It labels an option group inside the popup, as demonstrated by the regional group headings
in the Select story. It does not label the Select trigger.

Base UI 1.6.0 has two distinct parts:

- `Select.Label` is the accessible label for the whole control. Base UI automatically associates it with the trigger;
  clicking it focuses the trigger without opening the popup.
- `Select.GroupLabel` labels one group of options inside the popup.

Base UI explicitly requires every Select to have an accessible name and recommends either its root `Select.Label` or a
localized `aria-label` on `Select.Trigger` when no visible label is rendered. The current NUI barrel does not expose the
root Label part, and the representative Select story neither renders one nor passes an explicit `aria-label` to
`SelectTrigger`. The selected value communicates state, not the stable purpose of the control.

This is not a defect in the copied shadcn component. shadcn deliberately names its popup group wrapper `SelectLabel`,
places it under `SelectGroup`, and demonstrates an external `FieldLabel` for a visible form label. That is coherent
within the complete shadcn component suite. NUI does not currently provide a `Field` component, so copying that API
leaves no NUI-owned visible-label path and creates a naming collision if the Base UI root Label is added later.

The unresolved concern is therefore the public NUI labeling contract, not the implementation of the existing
`SelectLabel`.

## Current workaround

For a visually unlabeled Select, pass a localized `aria-label` directly to `SelectTrigger`. This is already documented
in the Select API chapter and should remain valid regardless of the eventual visible-label API.

Consumers can compose their own visible field label, but NUI currently provides no documented component that preserves
Base UI root Label's automatic association and focus behavior.

## Options

### Add a distinct root-label part

Add a non-breaking wrapper such as `SelectControlLabel` around `SelectPrimitive.Label`, while preserving
`SelectLabel` as the shadcn-compatible group label.

Advantages:

- exposes the upstream Base UI accessibility behavior directly;
- works for a standalone Select without waiting for a broader Field component;
- preserves the existing public API and consumer code;
- makes control-label and group-label ownership explicit.

Disadvantages:

- adds an NUI-specific public name not used by shadcn;
- leaves two label components that require clear documentation;
- the final name must remain useful if NUI later adds Field.

### Add Field and keep the shadcn naming model

Port the shadcn Field family and use `FieldLabel` for the visible control label while retaining `SelectLabel` for popup
groups.

Advantages:

- follows the official shadcn composition and naming;
- solves labels, descriptions, errors, invalid state, and field layout consistently across form controls;
- avoids a Select-specific visible-label abstraction.

Disadvantages:

- is a materially larger task than fixing the Select contract;
- leaves standalone Select without an NUI-owned visible-label path until Field is available;
- must prove that the Field composition supplies the same accessible association and keyboard behavior required here.

### Rename the existing group label

Rename the current `SelectLabel` to `SelectGroupLabel` and use `SelectLabel` for the Base UI root Label.

Advantages:

- produces the clearest semantic names in isolation;
- mirrors Base UI's distinction between Label and GroupLabel.

Disadvantages:

- is a breaking public API change;
- diverges from the familiar shadcn Select API;
- requires migration even though the current `SelectLabel` implementation is correct.

The package is pre-1.0, but that alone is not a reason to introduce avoidable churn.

### Keep only the `aria-label` workaround

Leave the component API unchanged and add `aria-label` to the representative story and usage guidance.

Advantages:

- is the smallest change;
- gives visually unlabeled controls an accessible name.

Disadvantages:

- does not provide a first-class visible-label composition;
- leaves an intentional Base UI part unavailable through NUI;
- does not resolve the future naming collision.

## Recommendation

Prefer the non-breaking distinct root-label part. `SelectControlLabel` is the current clearest candidate: it describes
the label's semantic owner without changing the established shadcn-compatible `SelectLabel`. Derive its props directly
from `SelectPrimitive.Label.Props`, export the part and type through the Select and client barrels, and use it in the
representative story.

This solution is self-contained, preserves upstream behavior, and remains compatible with a future Field component.
Field can later compose around Select without becoming a prerequisite for the Select's own accessible contract.

Do not rename the existing `SelectLabel` unless a separate pre-1.0 API review explicitly accepts the breaking migration.
Regardless of the chosen visible-label API, keep `aria-label` as the documented path when no visible label is rendered.

## Outcome

This record is complete when:

- NUI has an intentional, documented distinction between a Select control label and an option-group label;
- the chosen public API derives from the appropriate Base UI part without reconstructing its contract;
- the representative Select story has a stable accessible name;
- a visible label focuses the trigger without opening the popup;
- the visually hidden/no-visible-label path remains documented through localized `aria-label`;
- Storybook accessibility checks, TypeScript, lint, public barrels, and the relevant interaction test pass;
- durable conclusions are reflected in the Select API documentation and this backlog record is deleted.

## Next step

Prepare a focused API proposal for the recommended `SelectControlLabel` wrapper and verify its rendered association,
focus behavior, naming, styling, barrel exports, and compatibility with a future Field component before changing the
public Select API.

## References

- [NUI Select implementation](../src/client/components/select/select.tsx)
- [NUI Select public barrel](../src/client/components/select/index.ts)
- [NUI Select story](../src/client/components/select/select.stories.tsx)
- [NUI Select API notes](../docs/agent-operating-charter/select-api.md)
- [Base UI Select usage guidelines and anatomy](https://base-ui.com/react/components/select#usage-guidelines)
- [Base UI Select labeling example](https://base-ui.com/react/components/select#labeling-a-select)
- [Base UI Select Label API](https://base-ui.com/react/components/select#label)
- [Base UI 1.6.0 Select Label source](https://github.com/mui/base-ui/blob/v1.6.0/packages/react/src/select/label/SelectLabel.tsx)
- [Base UI 1.6.0 Select GroupLabel source](https://github.com/mui/base-ui/blob/v1.6.0/packages/react/src/select/group-label/SelectGroupLabel.tsx)
- [shadcn Base Select composition and examples](https://ui.shadcn.com/docs/components/base/select)
