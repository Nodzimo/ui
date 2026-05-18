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
- Classify the component before planning stories:
    - Does it have owned semantic variants, sizes, states, or interaction modes?
    - Does it have official composition patterns that are part of how consumers should use it?
    - Are differences only possible through arbitrary `className`, native attributes, or wrapper layout?
- Write a short story plan before editing. For each planned story, be able to answer: "What interface question does this
  story answer about this component's public role?" If the honest answer is only "it shows that CSS/className/native
  props can change the element", do not write that story.
- Confirm whether the component is client or core:
    - client components usually live under `src/client/components/<component>`.
    - core components should keep stories colocated with their component folder if/when story coverage is added there.
- Story-only visual helpers may import packages such as `lucide-react` when they help demonstrate composition. Keep
  those imports inside `*.stories.*` files and do not copy them into a core component implementation only because the
  story uses them.
- If a core component needs an icon at runtime, remember that stories are not proof of RSC safety. The runtime component
  still needs a core-safe implementation or a documented package-boundary review.
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
- Add explicit baseline `meta.args` for native or passthrough props when Storybook would otherwise omit useful Controls,
  for example `disabled: false`.
- Write focused semantic stories first, then comparison stories for scales, sizes, layouts, or icon-only forms. When a
  component has common composition patterns, prefer a shared `meta.render` that displays the practical set together.
- Keep colocated `.stories.*` imports development-only. They may import Storybook utilities such as `storybook/test`;
  dependency-cruiser's `not-to-dev-dep` rule should exclude story files rather than forcing Storybook packages into
  runtime dependencies.
- Run the smallest relevant verification, normally `bun run build:ts` and `bun run check:lint`.

## Story Selection

- Prefer stories that answer a real interface question: role, intent, state, interaction mode, size scale, icon use,
  disabled/loading/error state, or structural composition.
- Treat the component's own API and design-system contract as the story boundary. A prop passthrough such as
  `className`, native DOM props, or wrapper layout is not a reason to create visual variation stories by itself.
- Do not create stories just to exhaust every prop. If several props are technical plumbing or mirror native HTML
  attributes, let Controls cover them.
- Prefer comparison stories only when the compared values are owned by the component or an explicit design-system
  contract, such as CVA variants, component-defined sizes, icon-only forms, or documented composition forms. Do not use
  comparison stories to demonstrate arbitrary Tailwind classes.
- For composable controls such as buttons, prefer high-signal story canvases that show the real usage family together:
  label-only, leading icon, icon-only, and trailing icon. Avoid one-button canvases when they hide important usage
  patterns.
- Keep export names short and stable because they become technical story ids. Use `name` only for human-facing display
  clarification such as `Primary (default)` or `Icon sizes`.
- Use concrete semantic labels when they clarify intent, such as `Like`, `Open`, `Close`, `Login`, `Delete`, or `Visit`.
  Avoid generic `Button` labels in stories where the role or intent should be visible.
- If the component has no meaningful variant/state surface, write one strong default story. Add at most one usage or
  composition story only when it documents a real interface role consumers should copy.
- For leaf primitives with one behavior, a very short story file is a correct outcome. Do not compensate for a small API
  by inventing visual matrices.

## Story Budget Gate

Use this gate before writing or reviewing a story file:

- Owned variants or states exist: stories may cover those meaningful roles, keeping repetitive cases grouped.
- Official composition patterns exist: one compact composition canvas may document the expected usage family.
- Only arbitrary styling differs: do not add size, tone, color, spacing, or layout stories.
- Component has one role and no owned variants: prefer `Default`; optionally add one honest composition story.

Spinner is the project anti-example for this gate: a spinner can be restyled with Tailwind classes, but that does not
give it owned tones, sizes, or visual variants. Stories such as `Sizes` or `Tones` for a plain spinner document CSS
capability rather than component behavior and should not be written unless those scales become part of the component
contract.

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
- Do not restore Storybook onboarding/demo files or `@storybook/addon-onboarding`. Generated examples are not part of
  the project documentation model.
- Keep Storybook's Vite config separate from the library package build config. If story or preview work needs Vite
  changes, use `.storybook/vite.config.ts` for Storybook preview plugins such as Tailwind, and use `.storybook/main.ts`
  `viteFinal` only for final Storybook-specific Vite overrides.
- Keep the global `.storybook/preview.tsx` decorator aligned with the project preview contract:
  `nui-boundaries nui-interactive` around all stories, without `nui-surface` by default. Storybook controls the preview
  surface/theme; `nui-surface` remains part of the consumer foundation recommendation, not the Storybook wrapper.
- Preserve the global preview-only `wrapperBackground` arg when editing Storybook preview configuration. It belongs in
  the `Story canvas` controls category, uses the display name `Wrapper background`, defaults to `transparent`, and is
  filtered out before rendering `<Story />`. It colors the decorator wrapper only, so do not call it
  `Canvas background`.
- Do not add Storybook background/color-picker addons only to get a free full-canvas color picker unless they are
  verified compatible with the current Storybook version. The official backgrounds addon is preset-based, and stale
  third-party addons are not a project convention. A real full-canvas picker should be a deliberate local toolbar/global
  addon, not layout hacks or `document.body` effects in preview.
- Use `storybook-addon-pseudo-states` for fixed CSS pseudo-class previews such as `hover` and `active`; do not use it
  for real component states such as `disabled`, `checked`, `selected`, `open`, or `loading`.
- Put shared pseudo-state defaults in `meta.parameters.pseudo` when a story file uses the same preview targets across
  stories. Use story-level `parameters.pseudo` only for exceptions.
- Target forced pseudo states with story-only `data-*` selectors such as `[data-preview="hover"]`, not repeated `id`
  selectors. Storybook Docs can render multiple canvases on one page, so repeated IDs are brittle.
- Inline simple pseudo-state selectors when they are used once. Extract selector constants only for reuse or when the
  name adds real clarity.
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
