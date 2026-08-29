---
status: ready
---

# Add the representative Alert Dialog Storybook story

## Context

`Alert Dialog` has completed its source capture, mechanical cleanup, NUI token adaptation, RTL audit, style grouping,
public API, and two-file decomposition passes. The component and its content infrastructure are exported through the
client package. The remaining staged work is a focused Storybook consumer.

The story should document the official composition from shadcn:

- `AlertDialog` with `AlertDialogTrigger` and `AlertDialogContent`;
- header, title, description, footer, cancel, and action parts;
- the `default` and `sm` content sizes using `ALERT_DIALOG_CONTENT_SIZES`;
- a representative media composition and destructive action;
- the LTR/RTL behavior of the portaled dialog.

Controls must use real public props and component-owned runtime options. Do not expose arbitrary children, callbacks,
refs, class names, implementation parts, or invented story-only component props as controls.

## Outcome

This record is complete when:

- a colocated `alert-dialog.stories.tsx` imports the public surface through `.`;
- one focused interactive story demonstrates the standard confirmation composition;
- focused examples or controls cover size, media, and destructive action semantics without duplicating Button or Dialog
  coverage;
- `ALERT_DIALOG_CONTENT_SIZES` drives the size control and its documented default is accurate;
- the story verifies the real public content surface in LTR and RTL;
- Biome, TypeScript, Storybook checks, and rendered interaction verification pass.

## Next step

Read the Storybook story-writing skill and the official Alert Dialog examples, then create and verify the smallest
useful representative story when Storybook work is selected.

## References

- [Alert Dialog implementation](../src/client/components/alert-dialog/alert-dialog.tsx)
- [Alert Dialog content implementation](../src/client/components/alert-dialog/alert-dialog-content.tsx)
- [Alert Dialog barrel](../src/client/components/alert-dialog/index.ts)
- [Storybook story writer](../.agents/skills/storybook-story-writer/SKILL.md)
- [shadcn Alert Dialog documentation](https://ui.shadcn.com/docs/components/base/alert-dialog)
- [shadcn component adaptation workflow](../docs/agent-operating-charter/shadcn-component-adaptation.md)
