---
status: ready
---

# Audit finite option contracts and literal-table validation

## Context

Nodzimo UI uses several legitimate patterns for finite option tables, but the rule for choosing between them is not
currently documented. Some components use `Object.freeze([... ] as const)` and derive a union from the table itself;
others use `Object.freeze([... ] as const satisfies readonly SomeContract[])` to validate values against an upstream or
existing component contract. Button also derives runtime options from the keys of a class map.

These patterns are not automatically contradictory. They represent different sources of truth:

- `Object.freeze` provides runtime immutability.
- `as const` preserves readonly literal values and can define a component-owned union.
- `satisfies` validates a manually maintained table against an external or pre-existing contract without widening the
  literals.
- CVA class maps can own their variants, with unions derived from map keys and runtime options derived from those keys.

The distinction is currently implicit. Examples that should be compared include `Input`, `Select`, `Slider`, `Calendar`,
`Toast`, and `Separator`, which validate values against native or upstream contracts; `Card`, `Switch`,
`SelectTrigger`, `FieldLegend`, and `DropdownMenuItem`, which define local component-owned subsets; and `Button`, which
uses class maps as its variant source of truth. `InputGroup` exposed the risk: its public `align` and `size` tables are
finite contracts tied to CVA definitions, so an unvalidated `as const` table could drift from the styled variant keys.

The repository needs one documented decision that explains when each pattern is correct, when a table is a curated
subset of a broader consumer prop, and when a manually maintained runtime list must be checked with `satisfies`. The
decision must also distinguish compile-time validation from runtime freezing and must not turn this into a blanket
rewrite of every `Object.freeze` declaration.

### Decision framework to verify and formalize

The audit should test and then record this three-way rule:

1. **External or pre-existing contract: validate the table.** When values come from native props, Base UI, DayPicker,
   another dependency, or an existing local variant contract, declare the contract type first and use
   `as const satisfies readonly Contract[]`. This preserves literal inference while catching stale or misspelled values.
   `Input`, `Select`, `Slider`, `Calendar`, `Toast`, and `Separator` are representative examples.
2. **Component-owned contract: derive the type from the table.** When Nodzimo owns the finite subset and there is no
   independent contract to validate, use `Object.freeze([... ] as const)` and derive `(typeof TABLE)[number]`. This
   keeps one source of truth without adding a redundant validation type. `Card`, `Switch`, `SelectTrigger`,
   `FieldLegend`, and `DropdownMenuItem` are representative examples.
3. **Map-owned contract: derive from the map and derive runtime keys from the map.** When a CVA class map defines the
   variants, use an `as const` class map, derive the union with `keyof typeof MAP`, and derive runtime options from the
   same map keys. `Button` is the representative example. Do not maintain a second handwritten option list when the map
   already owns the values.

`Object.freeze` is a shared runtime immutability layer, not one of the three ownership decisions. `as const` supplies
literal inference; `satisfies` supplies compile-time validation. They are complementary and should not be applied by
mechanical style preference. `InputGroup` is the important hybrid case: its public `align` and `size` lists are manually
maintained runtime metadata for CVA variants, so the lists should use the first rule to validate against the CVA-derived
contracts while the CVA recipes remain private.

The audit must also document the failure modes: using an unvalidated handwritten list for an external/CVA contract can
silently drift from the implementation; using `satisfies` when the type is derived from the same table adds no useful
independent check; and duplicating a CVA map's keys in a second list creates two sources of truth.

## Outcome

- Every `Object.freeze` finite option table and comparable literal option map under `src` is inventoried and classified
  by its actual source of truth.
- The audit distinguishes upstream/external contracts, local component-owned contracts, CVA/class-map contracts, and
  runtime lists derived from an existing map.
- The repository documents a clear rule for choosing `as const`, `satisfies`, derived unions, `Object.keys`, and
  `Object.freeze`, including why each tool exists and what it does not guarantee.
- Tables tied to native, Base UI, DayPicker, CVA, or other existing contracts validate against those contracts where
  manual drift is possible.
- Tables that intentionally own their local contract remain simple and are not decorated with `satisfies` merely for
  visual uniformity.
- CVA-owned maps do not acquire a second manually maintained variant list when their keys can provide the runtime
  options.
- Curated public subsets preserve any intentional broader consumer escape hatch and do not reconstruct unrelated
  upstream unions.
- Public runtime option constants and derived types remain aligned with component props and Storybook controls.
- The final decision is recorded in the appropriate durable repository documentation, and any necessary code fixes are
  limited to proven contract or validation gaps.
- Verification covers TypeScript, Biome, dependency graph checks, generated declarations, and affected Storybook
  metadata without introducing a formatter-only churn across unrelated components.

## Next step

Inventory all finite option tables and literal maps under `src`, beginning with the representative components listed in
the context. For each occurrence, record the source of truth, public/private status, whether the values are a curated
subset, and whether a manual runtime list can drift. Compare every occurrence with the three-way decision framework,
then propose the durable documentation location and a focused correction list before editing unrelated components.

## References

- [Code style conventions](../docs/agent-operating-charter/code-style-conventions.md)
- [Compound component adapter](../.agents/skills/compound-component-adapter/SKILL.md)
- [Input component](../src/client/components/input/input.tsx)
- [Input Group component](../src/client/components/input-group/input-group.tsx)
- [Select content](../src/client/components/select/select-content.tsx)
- [Slider component](../src/client/components/slider/slider.tsx)
- [Calendar component](../src/client/components/calendar/calendar.tsx)
- [Toast component](../src/client/components/toast/toast.tsx)
- [Button variants](../src/client/components/button/button-variants.ts)
- [Card component](../src/core/components/card/card.tsx)
- [Switch component](../src/client/components/switch/switch.tsx)
- [Field component](../src/client/components/field/field.tsx)
