---
status: ready
---

# Unify public component prop contracts and wrapper type extraction

## Context

Nodzimo UI currently uses several valid but insufficiently documented ways to expose public component props. The
differences are easy to miss during shadcn/Base UI ports and can make equivalent components look inconsistent:

- `Button` derives `ButtonProps` from `VariantProps<typeof buttonVariants>` because its CVA variants and sizes are the
  intentional public styling API.
- `Field` also uses `VariantProps<typeof fieldVariants>` for its public orientation contract.
- `InputGroupAddon` and `InputGroupButton` expose explicit wrapper-owned props such as `align` and `size`, derived from
  local class-map keys rather than from `VariantProps`.
- `ButtonGroup` currently uses an explicit `orientation?: ButtonGroupOrientation` contract backed by a local CVA class
  map, while its earlier implementation used `VariantProps<typeof buttonGroupVariants>`. The choice is deliberate but
  not yet a repository-wide rule.
- `Separator` exposes a named `SeparatorProps` contract derived from the Base UI primitive. Wrappers such as
  `ButtonGroupSeparator` may use that named public type, `ComponentProps<typeof Separator>`, or a primitive part type;
  these choices are currently not compared systematically.
- Compound components such as `Select`, `Dropdown Menu`, `Toast`, and `Field` derive some parts directly from installed
  primitive namespaces, while native or NUI-wrapper parts may use React `ComponentProps` or an existing NUI public type.
- Public props types are not consistently positioned immediately before their owning component, making the contract
  harder to review in multipart implementation files.

These approaches are not automatically interchangeable. The correct choice depends on who owns the contract:
the upstream primitive, an existing NUI wrapper, a component-owned finite option map, or a deliberately public CVA
styling API. The repository needs one explicit decision framework before more components are ported and more local
exceptions become accidental conventions.

This record is broader than, and must be coordinated with, `audit-finite-option-contracts.md`. That existing record
defines how finite values, class maps, `as const`, `satisfies`, `Object.freeze`, and runtime option lists establish a
source of truth. This record applies that decision to public props and wrapper boundaries, and additionally audits
whether a public type should come from a primitive, an NUI wrapper, React component props, or an explicit owned field.

## Scope to audit

Inventory every public component and part under `src/core` and `src/client`, including at least:

- variant-heavy simple components: `Button`, `Field`, `Slider`, `Switch`, `Card`, and `SelectTrigger`;
- compound components: `InputGroup`, `ButtonGroup`, `Select`, `Dropdown Menu`, `Field`, and `Toast`;
- primitive wrappers with existing named contracts: `Input`, `Separator`, `Label`, `Textarea`, and related separator or
  label parts;
- every local `index.ts`, aggregate barrel, and Storybook story that consumes a public prop type or runtime option list.

For each component or part, record:

1. the runtime owner of each prop and default;
2. whether the prop is upstream, NUI-wrapper-owned, CVA-owned, or a curated styled subset;
3. whether the public type should be a primitive namespace alias, an existing NUI named type,
   `ComponentProps<'element'>`, `ComponentProps<typeof Wrapper>`, `VariantProps<typeof recipe>`, or an explicit
   intersection/object field;
4. whether the corresponding finite type and runtime options have one source of truth;
5. whether variant recipes, class maps, helper types, and constants are intentionally public or implementation-private;
6. whether each public props type is placed immediately before its owning component and exported through the intended
   local and aggregate barrels;
7. whether a wrapper adds, narrows, defaults, or merely forwards props and therefore needs an explicit composed type;
8. whether `ComponentProps<typeof NUIWrapper>` and the wrapper's named public type are equivalent, and which one better
   communicates the package contract;
9. whether Storybook controls require runtime metadata that ordinary consumers also benefit from.

## Decision questions

The audit must answer and document these questions with repository examples rather than applying a mechanical rewrite:

- When should a public component use `VariantProps<typeof recipe>`? Candidate rule: when all CVA variants are
  intentionally public styling options and coupling the props to the recipe protects a meaningful public contract.
- When should a component declare an explicit field such as `orientation?: ButtonGroupOrientation` or
  `align?: InputGroupAddonAlign`? Candidate rule: when the prop is wrapper-owned and the public surface should remain
  stable if the internal recipe changes.
- When should a finite union derive from a local class map, and when should a manually maintained runtime list validate
  against an upstream or pre-existing contract? Defer the finite-value mechanics to `audit-finite-option-contracts.md`
  and verify that the public prop type follows the same source of truth.
- When should a wrapper reuse an existing NUI type such as `SeparatorProps` or `LabelProps` instead of extracting
  `ComponentProps<typeof Separator>` or reconstructing the primitive props? Prefer the named NUI type when the wrapper
  forwards that exact public contract; use `ComponentProps<typeof Wrapper>` only when the wrapper value itself is the
  intentional contract; use the primitive namespace when the wrapper directly exposes an upstream part and no NUI
  wrapper contract exists.
- When should a wrapper use `ComponentProps<'div'>` or another native element contract? Preserve the native contract for
  native wrappers and add only owned props or state markers consumed by the component.
- Which public CVA helpers and class maps should remain exported? Keep them public only when consumers or established
  package conventions use them for composition; do not export copied helpers merely because upstream exported them.
- What declaration and export ordering makes a multipart file reviewable? Place each public props type immediately above
  its owning component, keep related finite types/constants near the recipe they describe, and group the final exports
  consistently.
- Which differences are intentional exceptions, and where should those exceptions be documented so future ports do not
  recreate the same debate?

## Outcome

This record is complete when:

- every public component and renderable compound part is inventoried and classified by prop ownership;
- the repository documents one decision matrix for primitive aliases, NUI aliases, native `ComponentProps`, explicit
  wrapper-owned fields, `VariantProps`, and CVA class-map-derived types;
- `InputGroup`, `ButtonGroup`, `Button`, `Field`, `Separator`, `Select`, `Dropdown Menu`, and `Toast` are used as
  explicit comparison examples, with intentional differences recorded;
- finite option source-of-truth decisions agree with `audit-finite-option-contracts.md`;
- public props types, runtime option constants, variant helpers, and barrels are corrected only where the audit proves
  drift, ambiguity, or an unnecessary public surface;
- each multipart component places its public props types next to the owning part and follows the agreed export order;
- Storybook can consume the same public types and runtime option metadata without handwritten duplicate unions;
- generated declarations, TypeScript, Biome, dependency graph, aggregate exports, and affected Storybook stories verify
  the resulting public contract;
- durable conclusions are moved into the relevant agent-operating-charter or component decision documentation, and this
  backlog record is deleted with the completing change.

## Current workaround

For new component ports, follow the staged public API pass and document the chosen source of truth in the component
change. Do not broaden a wrapper to every upstream prop merely for symmetry, and do not mechanically replace all
`VariantProps` or `ComponentProps` usages until this audit establishes the decision matrix.

## Next step

Build an inventory table from the listed components and their local barrels. Compare each public type against the
installed primitive declarations, the component implementation, Storybook usage, and the finite-option audit. Produce a
focused decision matrix and correction list before editing component code.

## References

- [Finite option contracts audit](audit-finite-option-contracts.md)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
- [Compound component adapter](../.agents/skills/compound-component-adapter/SKILL.md)
- [Component styling conventions](../docs/agent-operating-charter/component-styling.md)
- [Code style conventions](../docs/agent-operating-charter/code-style-conventions.md)
- [Input component](../src/client/components/input/input.tsx)
- [Input Group component](../src/client/components/input-group/input-group.tsx)
- [Input Group variants](../src/client/components/input-group/input-group-variants.ts)
- [Button component](../src/client/components/button/button.tsx)
- [Button variants](../src/client/components/button/button-variants.ts)
- [Button Group component](../src/client/components/button-group/button-group.tsx)
- [Separator component](../src/client/components/separator/separator.tsx)
- [Select API notes](../docs/agent-operating-charter/select-api.md)
- [Field adaptation decision](../docs/agent-operating-charter/field-component-adaptation-decision.md)
- [Toast adaptation decision](../docs/agent-operating-charter/toast-component-adaptation-decision.md)
