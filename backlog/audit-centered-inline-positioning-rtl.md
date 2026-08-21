---
status: ready
---

# Establish the RTL rule for centered inline positioning

## Context

The Resizable handle was adapted from shadcn with a centered pseudo-element. The upstream source uses the physical
pattern `after:left-1/2 after:-translate-x-1/2`. During NUI RTL adaptation, `left-1/2` was changed to
`inset-s-1/2`, but it is unresolved whether the existing negative translation should remain, be mirrored with an
`rtl:after:translate-x-1/2` override, or whether a centered element should intentionally keep physical positioning.

This is not settled by the generic logical-utility lint suggestion. The repository currently contains contrasting
patterns:

- `RadioGroup` centers a dot with `left-1/2 -translate-x-1/2` and has no RTL override;
- `Switch` uses RTL translation overrides for directional thumb movement between checked and unchecked positions;
- the theme-token contract requires logical utilities for directional inline-axis behavior, but does not define this
  centered-pseudo-element case.

The current question must be resolved from geometry, project references, Tailwind behavior, and verified LTR/RTL
rendering rather than by adding an RTL class speculatively.

## Outcome

This record is complete when:

- centered inline positioning is classified as direction-neutral or direction-sensitive in the NUI styling contract;
- Resizable, Radio Group, Switch, and other centered or translated components are compared using their actual DOM
  geometry and computed styles in both LTR and RTL;
- the correct rule is documented: physical centering, logical positioning with a mirrored translation, or another
  repository-supported pattern;
- the decision distinguishes generic IDE/Tailwind normalization suggestions from behaviorally required RTL changes;
- affected components are corrected only where the evidence proves a visual or interaction defect;
- the conclusion is moved into the theme-token/RTL documentation, and this backlog record is deleted with the completing
  change.

## Current workaround

Do not add `rtl:after:translate-x-1/2` to Resizable solely for symmetry. Preserve the current behavior until the
centered-positioning rule is verified. Treat the `inset-s-1/2` conversion as requiring explicit LTR/RTL visual review.

## Next step

Create a small comparison matrix for Resizable, Radio Group, Switch, and any other components matching
`left-1/2.*translate-x`. Inspect the generated CSS and rendered bounding boxes under `dir="ltr"` and `dir="rtl"`, then
record and apply the smallest evidence-backed rule.

## References

- [Resizable implementation](../src/client/components/resizable/resizable.tsx)
- [Radio Group implementation](../src/client/components/radio-group/radio-group.tsx)
- [Switch implementation](../src/client/components/switch/switch.tsx)
- [Theme token contract](../docs/agent-operating-charter/theme-token-contract.md)
- [shadcn Resizable documentation](https://ui.shadcn.com/docs/components/base/resizable)
- [shadcn RTL documentation](https://ui.shadcn.com/docs/rtl)
