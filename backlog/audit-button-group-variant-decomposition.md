---
status: ready
---

# Resolve Button Group variant decomposition and import inspection mismatch

## Context

`ButtonGroup` is currently kept in one implementation module. Its orientation class map and `buttonGroupVariants` are
local to `button-group.tsx`, which is valid and keeps the small compound component self-contained.

During an attempted decomposition, the variant recipe was moved to `button-group-variants.ts` and imported into
`button-group.tsx` through a relative sibling path:

```ts
import {
    type ButtonGroupOrientation,
    buttonGroupVariants,
} from './button-group-variants'
```

The IDE reported an `Import can be shortened` warning for this Button Group import, while the equivalent
`InputGroup` import from `./input-group-variants` did not report a warning. The exact inspection owner and resolver
reason were not established. The warning may be an IDE inspection rather than Biome, but that must be proven rather than
assumed.

The attempted split was reverted. No decomposition should be reintroduced until the warning and the repository import
contract are understood. The investigation must compare the two components' files, local barrels, aggregate barrels,
package `imports` mappings, IDE resolver behavior, and Biome/TypeScript diagnostics from a clean reproducible state.

## Outcome

This record is complete when:

- the exact diagnostic source, inspection/rule name, and trigger are identified;
- `ButtonGroup` and `InputGroup` decomposition attempts are compared with their local barrels and package import map;
- the correct import form is decided using the repository internal-import contract, not an IDE suggestion alone;
- the decision states whether the variant recipe should remain inline or move to `button-group-variants.ts`;
- any accepted IDE-only warning has a narrow documented reason or an appropriate scoped suppression, while Biome,
  TypeScript, dependency-cruiser, and declaration generation remain clean;
- the final structure has no avoidable sibling implementation cross-imports and preserves the intended public exports;
- the decision and any durable rule are moved into the relevant project documentation, and this backlog record is
  deleted with the completing change.

## Current workaround

Keep `ButtonGroup` variants inline in `button-group.tsx`. Do not change the relative import to an aggregate `#client`
barrel merely to satisfy an unexplained IDE inspection; project guidance prefers relative imports for implementation
details inside one component folder.

## Next step

Reproduce the warning after a clean indexing cycle, capture the exact inspection identifier and suggested replacement,
then compare it with `InputGroup` using the same IDE, Biome, TypeScript, and dependency-graph commands. Only after that
comparison propose the smallest correct decomposition or a documented decision to keep the file monolithic.

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
