---
status: ready
---

# Add the representative Popover Storybook story

## Context

`Popover` has completed its source capture, mechanical cleanup, NUI token adaptation, RTL motion pass, style grouping,
public API, and decomposition passes. The component is exported through its local barrel and the aggregate client
barrel. The remaining staged adaptation work is a representative Storybook consumer.

The story should document the real composition from the official shadcn reference:

- `Popover` with `PopoverTrigger` and `PopoverContent`;
- `PopoverHeader`, `PopoverTitle`, and `PopoverDescription`;
- content alignment and side positioning;
- the meaningful `modal` modes;
- RTL rendering with logical and physical sides.

Controls must use the exported Popover option constants and real public prop names. Do not expose arbitrary children,
callbacks, refs, class names, or Base UI implementation parts as story controls.

## Outcome

This record is complete when:

- a colocated `popover.stories.tsx` imports the component through `.`;
- one focused interactive story demonstrates the representative Popover composition;
- controls use `POPOVER_CONTENT_ALIGNS`, `POPOVER_CONTENT_SIDES`, and `POPOVER_MODAL_MODES`;
- Storybook descriptions and defaults reflect the actual public API rather than story-only props;
- the story covers the Popover content surface without duplicating Calendar or Date Picker coverage;
- Biome, TypeScript, Storybook checks, and LTR/RTL interaction verification pass.

## Next step

Read the Storybook story-writing skill and the official Popover examples, then create and verify the smallest
representative interactive story when Storybook work is selected.

## References

- [Popover implementation](../src/client/components/popover/popover.tsx)
- [Popover content implementation](../src/client/components/popover/popover-content.tsx)
- [Popover barrel](../src/client/components/popover/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [shadcn Popover documentation](https://ui.shadcn.com/docs/components/base/popover)
- [Base UI Popover documentation](https://base-ui.com/react/components/popover)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
