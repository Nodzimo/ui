---
status: ready
---

# Add the Drawer Storybook story and revisit its decomposition

## Context

`Drawer` has completed its source capture, base cleanup, NUI token adaptation, RTL audit, Tailwind class grouping,
marker audit, lint fixes, and public API pass. The component is intentionally kept in one implementation module after
reviewing a possible split.

`DrawerContent` cannot be moved to an independent sibling module while `DrawerContext` and `useDrawer` remain owned by
`drawer.tsx`: the content needs that context, while `Drawer` creates and provides it. Moving only the content would
therefore require a dependency back to the main module, or moving the shared context into a third module. Duplicating
the context is not acceptable because the provider and consumer would no longer share state.

The stateless wrappers (`Trigger`, `Close`, `Header`, `Footer`, `Title`, and `Description`) can be moved without
cross-imports. That split saves approximately 100 lines from the main file, but does not reduce the complexity of the
contextual `DrawerContent` implementation. It should be reconsidered deliberately rather than treated as an automatic
improvement.

The same focused backlog item also tracks the missing Storybook consumer, so the component's public surface and the
decomposition decision are reviewed together when Drawer work resumes.

## Outcome

This record is complete when:

- a colocated `drawer.stories.tsx` imports the public Drawer surface through `.`;
- focused stories cover the standard drawer composition, directions, modal behavior, snap points, and swipe handle;
- the story exposes only real public props and component-owned runtime options, without invented controls or internal
  context details;
- the decomposition decision is recorded as either keeping the module monolithic or splitting only genuinely independent
  stateless wrappers;
- if `DrawerContent` is split, the solution uses one shared context with an acyclic import graph and preserves the
  public exports;
- no duplicate context, avoidable cross-imports, behavior changes, or lost class tokens are introduced;
- Biome, TypeScript, Storybook checks, declaration generation, and rendered LTR/RTL verification pass;
- the durable decomposition conclusion is moved to the appropriate project documentation and this backlog record is
  deleted with the completing change.

## Next step

Read the Storybook story-writing skill and the official Drawer examples, then make the decomposition decision from the
current module boundaries before creating the smallest representative Storybook story.

## References

- [Drawer implementation](../src/client/components/drawer/drawer.tsx)
- [Drawer barrel](../src/client/components/drawer/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [Compound component adapter](../.agents/skills/compound-component-adapter/SKILL.md)
- [shadcn Drawer documentation](https://ui.shadcn.com/docs/components/base/drawer)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
