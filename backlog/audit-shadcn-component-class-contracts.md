---
status: ready
---

# Audit adapted component class contracts against shadcn

## Context

The Alert Dialog grouping pass exposed that manual class-list refactoring can silently drop a real Tailwind class while
TypeScript and Biome still pass. The adapted library components were copied from shadcn/Base UI sources and then changed
through token, RTL, marker, and formatting passes. Those intentional transformations must not hide accidental class or
token loss.

Audit every shadcn-derived component currently under `src/core/components` and `src/client/components`, including Alert
Dialog, Badge, Button, Button Group, Calendar, Card, Checkbox, Dialog, Dropdown Menu, Field, Input, Input Group, Kbd,
Label, Popover, Radio Group, Resizable, Select, Separator, Skeleton, Slider, Spinner, Switch, Textarea, and Toast. Use
the matching official shadcn component page/source as the upstream reference, pinned to the revision used for the port.

The comparison must inspect every static class token in `className`, `mcn`, CVA maps, and related style constants—not
only semantic color tokens. Compare the adapted source with a normalized upstream snapshot and classify each difference
as intentional or accidental. The normalization allowlist is limited to documented NUI token prefixes, approved RTL
logical transformations, resolved shadcn registry markers, and explicitly recorded NUI-specific behavior. Formatting,
grouping, decomposition, and file placement must not change the token multiset.

## Outcome

The audit is complete when it provides a per-component report of:

- missing, added, renamed, duplicated, or reordered class and token values;
- intentional NUI, RTL, registry-marker, and project-specific transformations;
- the exact source reference and revision used for each comparison;
- fixes for every accidental difference, with no unreviewed visual or behavioral redesign.

For every grouping or class refactor, use a deterministic before/after token-multiset check, including named `group/*`
and `peer/*` markers, `data-*` selectors, arbitrary selectors, animation utilities, and CSS variable references. A
passing formatter or TypeScript check is not evidence that the style contract was preserved.

After corrections, run the focused source checks, CSS build, dependency graph check, and relevant public build/artifact
verification. Keep the audit report or durable conclusions linked from the resulting changes so this failure mode is not
re-investigated from memory.

## Next step

Create normalized upstream snapshots or an equivalent reproducible extraction for the listed components, compare every
class/token multiset, report the differences first, and then apply only confirmed corrective changes component by
component.

## References

- [shadcn components](https://ui.shadcn.com/docs/components)
- [shadcn Base UI Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog)
- [shadcn Base UI Badge](https://ui.shadcn.com/docs/components/base/badge)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
- [NUI theme token contract](../docs/agent-operating-charter/theme-token-contract.md)
- [Tailwind class formatter](../.agents/skills/tailwind-class-formatter/SKILL.md)
- [Theme token adapter](../.agents/skills/theme-token-adapter/SKILL.md)
