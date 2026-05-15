---
name: storybook-story-writer
description: Write, review, or update focused Storybook CSF 3 stories for Nodzimo UI React components. Use when Codex is asked to add stories for a new component, improve existing component stories, align stories with the repository's Storybook conventions, add meaningful controls for CVA-backed variants, or validate Storybook story architecture in this UI kit.
---

# Storybook Story Writer

## Overview

Use this skill for Nodzimo UI component stories. The goal is to document meaningful interface roles, states, and usage
patterns without generating prop-permutation noise. The current strongest reference is
`src/client/components/button/button.stories.tsx`: it favors rich preview stories that show the component's practical
composition patterns in one canvas instead of isolated one-control examples.

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

- Define `meta` with `satisfies Meta<typeof Component>` for simple stories. When adding story-only args, define a
  `ComponentStoryArgs` type as `ComponentProps<typeof Component> & { ... }`, then use
  `satisfies Meta<ComponentStoryArgs>`.
- Put shared baseline args in `meta.args`; override only story-specific args in each story.
- Add runtime `argTypes.options` for meaningful variant controls because CVA unions are not runtime values.
- Write focused semantic stories first, then comparison stories for scales, sizes, layouts, or icon-only forms. When a
  component has common composition patterns, prefer a shared `meta.render` that displays the practical set together.
- Run the smallest relevant verification, normally `bun run build:ts` and `bun run check:lint`.

## Story Selection

- Prefer stories that answer a real interface question: role, intent, state, interaction mode, size scale, icon use,
  disabled/loading/error state, or structural composition.
- Do not create stories just to exhaust every prop. If several props are technical plumbing or mirror native HTML
  attributes, let Controls cover them.
- Prefer comparison stories when the user needs side-by-side inspection of rhythm, sizing, alignment, or repeated visual
  variants.
- For composable controls such as buttons, prefer high-signal story canvases that show the real usage family together:
  label-only, leading icon, icon-only, and trailing icon. Avoid one-button canvases when they hide important usage
  patterns.
- Keep export names short and stable because they become technical story ids. Use `name` only for human-facing display
  clarification such as `Primary (default)` or `Icon sizes`.
- Use concrete semantic labels when they clarify intent, such as `Like`, `Open`, `Close`, `Login`, `Delete`, or `Visit`.
  Avoid generic `Button` labels in stories where the role or intent should be visible.
- If the component has no meaningful variant/state surface, write one strong default story plus the smallest useful
  usage example.

## Review Standard

- Review stories as executable documentation, not as decorative demos. Prioritize whether the canvas communicates real
  component roles, composition patterns, and states.
- Lead with concrete issues: story-only arg leaks, misleading controls, weak types, noisy canvases, poor semantic
  labels,
  or render patterns that hide important usage.
- Challenge generic or misleading names when a small local helper has grown into a reusable story pattern. Keep names
  short when the local context is enough, but make them precise when they encode a reusable layout or convention.
- Prefer strict, practical feedback over vague encouragement. Explain why a naming, typing, or render choice improves
  future maintenance and Storybook DX.

## Project Conventions

- Use CSF 3 object stories.
- Use tabs, single quotes, no semicolons, and named exports.
- Add `// noinspection JSUnusedGlobalSymbols` at the top of story files when matching the existing story pattern.
- Use `@storybook/react-vite` types and `fn` from `storybook/test` for event handlers in shared args.
- Keep stories colocated beside components.
- Do not import from `@sefo/nodzimo-ui` inside this package.
- For local story-only helpers, keep simple names when they stay local; choose precise names if responsibility grows.
- For story-only preview controls such as selectable icons, use a typed mapping object plus string options:
  `const componentStoryIcons = { ... } as const`, `Object.keys(componentStoryIcons)`, and
  `mapping: componentStoryIcons`.
  The arg may be a component value, but the control options must stay serializable strings.
- Mark story-only controls clearly in `description`, for example:
  `Story-only icon picker (this is not a Button prop!)`.
- When story-only args should not reach the rendered component, destructure and discard them explicitly:
  `render: ({ Icon: _Icon, children: _children, ...restArgs }) => ...`.
- Spread `args` before pinned comparison props:

```text
<Button {...args} size={'xs'} />
```

- For custom render stories, spread the filtered `restArgs` before pinned comparison props:

```text
render: ({ Icon: _Icon, ...restArgs }) => (
    <Button {...restArgs} size={'xs'} />
)
```

## References

Read `references/story-patterns.md` when creating a new story file, updating story controls, deciding which stories are
meaningful, or matching the button reference pattern.
