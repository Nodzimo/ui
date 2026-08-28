---
status: ready
---

# Add the representative Kbd Storybook story

## Context

`Kbd` and `KbdGroup` have completed their source capture, mechanical cleanup, NUI token adaptation, RTL audit, style
grouping, public API, and export verification passes. The component is available from the core package entrypoint. The
remaining staged adaptation work is a representative Storybook consumer.

The story should document the official composition:

- standalone `Kbd` keys;
- `KbdGroup` containing multiple `Kbd` components;
- representative usage inside Button, Tooltip, and Input Group compositions where useful.

Controls must use real public props and avoid exposing arbitrary children, callbacks, refs, or implementation details as
story controls.

## Outcome

This record is complete when:

- a colocated `kbd.stories.tsx` imports `Kbd` and `KbdGroup` through `.`;
- focused stories demonstrate standalone keys and grouped shortcuts;
- the story reflects the public native `kbd` prop contracts without inventing component variants;
- Biome, TypeScript, Storybook checks, and rendered composition verification pass.

## Next step

Read the Storybook story-writing skill and the official Kbd examples, then create and verify the smallest useful story
when Storybook work is selected.

## References

- [Kbd implementation](../src/core/components/kbd/kbd.tsx)
- [Kbd barrel](../src/core/components/kbd/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [shadcn Kbd documentation](https://ui.shadcn.com/docs/components/base/kbd)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
