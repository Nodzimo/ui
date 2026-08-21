---
status: ready
---

# Add the representative Button Group Storybook story

## Context

The `ButtonGroup` runtime component has completed its source, token, RTL/registry-marker, public API, and focused
formatting passes. It is exported through the local component barrel and the aggregate client barrel, and can be used by
consumers. The remaining staged adaptation work is a representative Storybook consumer.

The story should document the real compound surface without becoming an exhaustive gallery. It should use the local
component surface for `ButtonGroup` and exercise the important compositions from the official shadcn Base UI reference:

- horizontal and vertical orientation;
- ordinary grouped `Button` actions;
- `ButtonGroupText` with an input or label-style render target;
- `ButtonGroupSeparator` and a split-button composition;
- nested groups where spacing behavior is part of the component contract;
- a representative input composition if it can be shown without turning the story into an Input or Input Group story.

Controls must remain honest: expose `orientation` and other finite public options through
`BUTTON_GROUP_ORIENTATIONS`, keep supporting children/compositions fixed where a story-wide control would be ambiguous,
and do not add controls for arbitrary `children`, refs, callbacks, or implementation helpers.

## Outcome

This record is complete when:

- a colocated `button-group.stories.tsx` imports the component through `.` and supporting public components through the
  intentional `#client` or `#core` barrel where appropriate;
- one representative interactive story demonstrates the important Button Group compositions and both orientations;
- controls use the real public prop names and the runtime `BUTTON_GROUP_ORIENTATIONS` constant;
- Storybook docs and controls describe the actual defaults without inventing story-only component props;
- the story remains focused on Button Group behavior rather than duplicating Button, Input, or Input Group coverage;
- Biome, TypeScript, Storybook test/build checks appropriate to the story, and live interaction verification pass.

## Next step

Read the Storybook story-writing skill and the official Button Group examples, then create one focused interactive story
after the variant-decomposition backlog item is either resolved or explicitly left monolithic.

## References

- [Button Group implementation](../src/client/components/button-group/button-group.tsx)
- [Button Group barrel](../src/client/components/button-group/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [shadcn Button Group documentation](https://ui.shadcn.com/docs/components/base/button-group)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
- [Button story](../src/client/components/button/button.stories.tsx)
- [Input Group component](../src/client/components/input-group/input-group.tsx)
