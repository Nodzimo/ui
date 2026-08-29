---
status: ready
---

# Add the representative Badge Storybook story

## Context

`Badge` has completed its source capture, mechanical cleanup, NUI token adaptation, RTL audit, style grouping, public
API, and export verification passes. The component is exported from the client package. The remaining staged work is a
focused Storybook consumer.

The story should document the owned public surface from the official shadcn reference:

- the semantic `default`, `secondary`, `destructive`, `outline`, `ghost`, and `link` variants;
- a compact comparison of the variants rather than one noisy story per value;
- representative inline usage, including the native `render` composition when it adds real value.

Controls must use `BADGE_VARIANTS` and real `BadgeProps`. Do not expose arbitrary `className`, callbacks, refs,
children, or implementation details as controls, and do not invent additional Badge props.

## Outcome

This record is complete when:

- a colocated `badge.stories.tsx` imports `Badge` and `BADGE_VARIANTS` through `.`;
- focused stories demonstrate the semantic variants and one useful composition;
- the variant control uses the component-owned runtime options and documents the API default correctly;
- the story does not duplicate Button coverage or turn native passthrough props into a control gallery;
- Biome, TypeScript, Storybook checks, and rendered LTR/RTL verification pass.

## Next step

Read the Storybook story-writing skill and the official Badge examples, then create and verify the smallest useful
representative story when Storybook work is selected.

## References

- [Badge implementation](../src/client/components/badge/badge.tsx)
- [Badge barrel](../src/client/components/badge/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [shadcn Badge documentation](https://ui.shadcn.com/docs/components/base/badge)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
