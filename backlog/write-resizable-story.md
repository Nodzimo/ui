---
status: ready
---

# Add the representative Resizable Storybook story

## Context

`Resizable` has completed its source capture, cleanup, NUI token adaptation, RTL pass, style grouping, public API,
dependency, and package verification passes. The component is exported through its local and aggregate client barrels.
The remaining staged adaptation work is a representative Storybook consumer.

The story should document the actual compound surface without becoming an exhaustive gallery. It should cover:

- horizontal panel resizing;
- vertical panel resizing;
- `ResizableHandle` with and without `withHandle`;
- representative panel sizing or disabled behavior where the upstream API exposes it meaningfully;
- RTL rendering once the centered inline-positioning backlog decision is verified.

Controls must use the real public props and must not expose arbitrary children, refs, callbacks, or primitive internals
as fake component options.

## Outcome

This record is complete when:

- a colocated `resizable.stories.tsx` imports the component through `.`;
- one focused interactive story demonstrates the important group, panel, orientation, and handle compositions;
- controls and defaults reflect the public API, including `withHandle`, without inventing wrapper props;
- the story remains focused on Resizable behavior rather than duplicating unrelated layout coverage;
- Biome, TypeScript, Storybook checks, and live resize interaction verification pass;
- RTL coverage reflects the resolved centered-positioning decision rather than encoding an unverified workaround.

## Next step

Read the Storybook story-writing skill and the official Resizable examples, then create the smallest representative
interactive story after the centered inline-positioning RTL backlog item is resolved or explicitly deferred.

## References

- [Resizable implementation](../src/client/components/resizable/resizable.tsx)
- [Resizable barrel](../src/client/components/resizable/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [shadcn Resizable documentation](https://ui.shadcn.com/docs/components/base/resizable)
- [shadcn RTL documentation](https://ui.shadcn.com/docs/rtl)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
