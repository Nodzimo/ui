---
status: ready
---

# Audit overlay component layer priorities

## Context

Overlay components currently inherit layer values from their upstream shadcn or Base UI recipes without one Nodzimo wide
priority contract. Several components may therefore share the same `z-index` even though their surfaces have different
ownership and interaction priority. Toast currently uses `z-60` so feedback remains readable above a Dialog backdrop;
this is a focused workaround until the complete overlay hierarchy is reviewed.

## Outcome

- Every Nodzimo component that creates an overlay or portaled surface is inventoried.
- The audit defines a deliberate layer hierarchy for backdrops, Dialogs, popovers, menus, selects, comboboxes, tooltips,
  Toasts, and other portaled surfaces.
- The hierarchy distinguishes visual priority, interaction priority, focus behavior, and stacking-context boundaries.
- Components use the agreed values or semantic layer contract consistently.
- The resulting rules are recorded in durable public or agent documentation, and representative combinations are tested
  together rather than in isolation.

## Next step

Inventory all portaled and positioned surfaces under `src/core` and `src/client`, then compare their current stacking
contexts and `z-index` values in representative combinations such as Dialog with Toast, Dialog with Select, and Popover
with Tooltip.

## Current workaround

Toast uses `z-60` so a Toast emitted while a Dialog is open stays above the Dialog backdrop blur.

## References

- [Feedback Semantics](../docs/design-system-doctrine/feedback-semantics.md)
- [NUI Toast implementation](../src/client/components/toast/toast.tsx)
- [NUI Dialog implementation](../src/client/components/dialog/dialog-content.tsx)
