---
status: ready
---

# Expand Slider Storybook coverage

## Context

The current Slider `Default` story uses three values so its Controls can demonstrate a multi-thumb slider. That is a
useful interactive baseline, but it does not make the one-thumb and two-thumb compositions immediately discoverable or
easy to compare.

The Slider story surface should be reviewed as a whole before adding examples. Additional stories must demonstrate
distinct Slider behavior or documented composition, rather than arbitrary visual variations.

## Outcome

Slider Storybook clearly documents single-thumb, two-thumb, and three-thumb usage with focused examples. Any further
stories have a specific documented behavior or composition to demonstrate, and the story set remains concise.

## Next step

Review the current Slider story, Base UI Slider documentation, and comparable compound-component stories. Define the
smallest focused set of Slider stories, then implement and verify it.

## References

- `src/client/components/slider/slider.stories.tsx`
- `node_modules/@base-ui/react/docs/react/components/slider.md`
- `docs/agent-operating-charter/storybook-story-writing.md`
