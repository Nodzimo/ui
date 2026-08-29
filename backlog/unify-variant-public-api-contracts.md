---
status: ready
---

# Unify variant public API contracts

## Context

Finite component options currently use several valid API shapes, but their responsibilities are not documented
consistently. The canonical pattern for CVA-backed variants is the one used by Button, Badge, Input Group, and Button
Group:

- keep variant class bundles in one map;
- derive the variant type from that map;
- derive frozen runtime options from the same keys;
- make CVA consume that map;
- type component props with the upstream/native props plus `VariantProps<typeof variants>`;
- export the intended types, runtime options, and variant function through the component and aggregate barrels.

This keeps styling, TypeScript, Storybook controls, and consumer metadata synchronized. It also avoids accidental
generics, `unknown` payloads, duplicated value lists, and types inferred from local component implementation details.

Not every finite option is a CVA variant. Data-attribute-only options, such as Dropdown Menu item variants and Field
Legend variants, should retain a derived type, frozen runtime options, and explicit public props without inventing a
class map. Primitive passthrough options should preserve their upstream contract and expose metadata only when it has
real consumer value.

The concrete inconsistent case is the `orientation` variant of Field. `fieldVariants` owns an inline orientation map,
while `FIELD_ORIENTATIONS` is maintained separately and `FieldOrientation` is derived backwards through
`NonNullable<FieldProps['orientation']>`. This reverses the intended dependency direction and leaves the styling map,
the public type, and runtime options without one authoritative source. The fix is to extract
`FIELD_ORIENTATION_CLASSES`, derive `FieldOrientation` and `FIELD_ORIENTATIONS` from its keys, make
`fieldVariants` consume that map, and type `FieldProps` with `VariantProps<typeof fieldVariants>` alongside its
Field-specific data attributes.

This is the only confirmed public-variant contract that needs migration. Field Legend and Dropdown Menu item are
data-attribute variants, not CVA class-bundle variants; Card, Switch, and Select Trigger expose finite size options
through data attributes. Those are intentional, valid contracts and must not be forced into a CVA map.

## Outcome

Audit and align the public finite-option contracts using this classification:

- CVA class-bundle variant: one class map, derived type, frozen options, CVA wired to the map, `VariantProps` in the
  component props, and complete barrel exports.
- Data-attribute-only option: derived type, frozen options, and explicit props; no artificial CVA map.
- Primitive passthrough option: preserve the upstream type and behavior; add public metadata only when justified.

The concrete migration target is `src/client/components/field/field.tsx` and its barrels. The canonical references are
`Button`, `Badge`, `Input Group`, and `Button Group`, which already use the map-first CVA contract. The audit should
also confirm that `FieldLegend`, `Dropdown Menu item`, `Card`, `Switch`, and `Select Trigger` remain unchanged because
their data-attribute or finite-size contracts are appropriate.

The repository-wide inventory also includes upstream primitive options in Dialog, Popover, Dropdown Menu Content, Select
Content, Separator, Slider, Calendar, Toast, and Input. Their options describe behavior, positioning, native input
support, or upstream metadata rather than owned CVA class bundles. They are not additional migration targets.

For Field, verify that every intended public symbol flows from the implementation through the component barrel,
aggregate barrel, generated declarations, and runtime entrypoint. Do not introduce generic payload types, `unknown`, or
a CVA map for components whose variants are not class bundles.

## Next step

Migrate Field orientation to the Button/Badge/Input Group/Button Group map-first contract, then verify the remaining
components and preserve data-attribute-only and primitive passthrough designs where they are the correct abstraction.

## References

- `src/client/components/button/button-variants.ts`
- `src/client/components/badge/badge.tsx`
- `src/client/components/input-group/input-group-variants.ts`
- `src/client/components/button-group/button-group.tsx`
- `src/client/components/field/field.tsx`
- `src/client/components/dropdown-menu/dropdown-menu-item.tsx`
- `src/core/components/card/card.tsx`
- `src/client/components/switch/switch.tsx`
- `src/client/components/select/select-trigger.tsx`
- `.agents/skills/compound-component-adapter/SKILL.md`
- `docs/agent-operating-charter/shadcn-component-adaptation.md`
