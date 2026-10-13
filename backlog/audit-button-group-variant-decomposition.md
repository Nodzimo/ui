---
status: ready
---

# Decide whether to extract Button Group variants

## Context

`ButtonGroup` is currently kept in one implementation module. Its orientation class map and `buttonGroupVariants` are
local to `button-group.tsx`, which is valid and keeps the small compound component self-contained.

The import-shortening diagnostic is resolved through the shared
[WebStorm import preference](../docs/agent-operating-charter/webstorm-project-settings.md#project-import-preferences).
It no longer blocks decomposition and does not require another IDE investigation or suppression.

The remaining decision is whether extracting the orientation contract and variant recipe into
`button-group-variants.ts` improves ownership and readability enough to justify another module. Compare the current
inline structure with Input Group's extracted recipe using the existing component and import conventions. Keeping the
recipe inline is a valid outcome when extraction has no concrete benefit.

## Outcome

This record is complete when:

- the decision states whether the variant recipe should remain inline or move to `button-group-variants.ts`;
- any extraction uses direct relative imports inside the component folder, avoids unnecessary implementation
  cross-imports, and preserves the intended public exports;
- any implementation change passes Biome, TypeScript, dependency-cruiser, and generated declaration checks;
- any new durable rule is moved into its owning documentation, and this record is deleted when the structural decision
  is completed. If the current structure is retained, record the reason in the completing commit or pull request.

## Next step

Compare the size, ownership, and reuse of the Button Group orientation map, runtime options, and CVA recipe with
Input Group's extracted variant module. Propose extraction only if it removes concrete complexity without introducing
unnecessary cross-imports or changing public contracts.

## References

- [Button Group implementation](../src/client/components/button-group/button-group.tsx)
- [Button Group barrel](../src/client/components/button-group/index.ts)
- [Input Group implementation](../src/client/components/input-group/input-group.tsx)
- [Input Group variants](../src/client/components/input-group/input-group-variants.ts)
- [Input Group barrel](../src/client/components/input-group/index.ts)
- [Internal package imports](../docs/agent-operating-charter/internal-package-imports.md)
- [Source layout and component barrels](../docs/agent-operating-charter/source-layout.md)
- [Compound component adaptation](../docs/agent-operating-charter/shadcn-component-adaptation.md)
- [Compound component adapter](../.agents/skills/compound-component-adapter/SKILL.md)
