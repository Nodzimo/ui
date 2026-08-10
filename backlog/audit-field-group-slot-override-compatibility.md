---
status: ready
---

# Decide FieldGroup data-slot override compatibility

## Context

`FieldGroup` fixes `data-slot="field-group"` after spreading `restProps`, so consumers cannot override the slot through
its public native-div prop contract:

```tsx
<div {...restProps} data-slot={'field-group'}/>
```

The class recipe nevertheless retains `data-[slot=checkbox-group]:gap-3`. With the current implementation, the
component's own slot is always `field-group`, so that selector cannot activate through ordinary `FieldGroup` usage.

The selected shadcn upstream source spreads props after its default `data-slot`. A consumer can therefore explicitly
render `FieldGroup` with `data-slot="checkbox-group"`, which makes the selector meaningful. NUI intentionally fixes
`data-slot` after consumer props across the Field family to keep internal selectors stable; that may be the intended
library policy rather than a defect. The current code has not shown a broken standard Field composition or accessibility
failure.

The unresolved point is whether NUI should retain the upstream slot-override extension or explicitly remove the now dead
compatibility selector.

## Outcome

One intentional contract is selected and reflected in the implementation:

- If `data-slot` is a fixed internal marker, remove `data-[slot=checkbox-group]:gap-3` from `FieldGroup` and preserve
  fixed-slot behavior.
- If the upstream composition extension is part of NUI's public Field contract, allow an explicit `data-slot` override
  and add a focused consumer or Storybook case proving the compact checkbox-group spacing.

The chosen behavior must not weaken the existing FieldGroup container name, orientation styles, or semantic Field API.

## Next step

Inspect the Field introduction history and intended NUI data-slot policy, then decide whether the upstream
`checkbox-group` spacing extension is supported consumer behavior or stale source residue. Make the smallest matching
code and coverage change only after that decision.

## References

- `src/client/components/field/field.tsx`: current `FieldGroup` slot order and selector
- [Pinned shadcn Field source](https://github.com/shadcn-ui/ui/blob/f31ed81983653919dd4fe77aee4b4859f610f1dc/apps/v4/registry/new-york-v4/ui/field.tsx):
  upstream prop order and selector
- `docs/agent-operating-charter/field-component-adaptation-decision.md`: accepted Field responsibilities, fixed-slot
  usage, and public API rationale
