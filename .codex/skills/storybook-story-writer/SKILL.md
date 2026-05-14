---
name: storybook-story-writer
description: Write, review, or update focused Storybook CSF 3 stories for Nodzimo UI React components. Use when Codex is asked to add stories for a new component, improve existing component stories, align stories with the repository's Storybook conventions, add meaningful controls for CVA-backed variants, or validate Storybook story architecture in this UI kit.
---

# Storybook Story Writer

## Overview

Use this skill for Nodzimo UI component stories. The goal is to document meaningful interface roles, states, and usage
patterns without generating prop-permutation noise.

## Workflow

- Inspect the component folder before writing stories:
    - implementation file, local `index.ts`, variant files, types, and existing stories if present.
    - aggregate barrels only if export flow is unclear.
- Confirm whether the component is client or core:
    - client components usually live under `src/client/components/<component>`.
    - core components should keep stories colocated with their component folder if/when story coverage is added there.
- Create or update a colocated kebab-case `*.stories.tsx` file.
- Import the component from the local folder surface when `index.ts` exports it:

```text
import { Button } from '.'
```

- Define `meta` with `satisfies Meta<typeof Component>` and `type Story = StoryObj<typeof meta>`.
- Put shared baseline args in `meta.args`; override only story-specific args in each story.
- Add runtime `argTypes.options` for meaningful variant controls because CVA unions are not runtime values.
- Write focused semantic stories first, then comparison stories for scales, sizes, layouts, or icon-only forms.
- Run the smallest relevant verification, normally `bun run build:ts` and `bun run check:lint`.

## Story Selection

- Prefer stories that answer a real interface question: role, intent, state, interaction mode, size scale, icon use,
  disabled/loading/error state, or structural composition.
- Do not create stories just to exhaust every prop. If several props are technical plumbing or mirror native HTML
  attributes, let Controls cover them.
- Prefer comparison stories when the user needs side-by-side inspection of rhythm, sizing, alignment, or repeated visual
  variants.
- Keep export names short and stable because they become technical story ids. Use `name` only for human-facing display
  clarification such as `Primary (default)` or `Icon sizes`.
- If the component has no meaningful variant/state surface, write one strong default story plus the smallest useful
  usage example.

## Project Conventions

- Use CSF 3 object stories.
- Use tabs, single quotes, no semicolons, and named exports.
- Add `// noinspection JSUnusedGlobalSymbols` at the top of story files when matching the existing story pattern.
- Use `@storybook/react-vite` types and `fn` from `storybook/test` for event handlers in shared args.
- Keep stories colocated beside components.
- Do not import from `@sefo/nodzimo-ui` inside this package.
- For local story-only helpers, keep simple names when they stay local; choose precise names if responsibility grows.
- Spread `args` before pinned comparison props:

```text
<Button {...args} size={'xs'} />
```

## References

Read `references/story-patterns.md` when creating a new story file, updating story controls, deciding which stories are
meaningful, or matching the button reference pattern.
