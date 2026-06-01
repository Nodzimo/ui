---
name: storybook-story-writer
description: Write, review, or update focused Storybook CSF 3 stories for Nodzimo UI React components. Use when Codex is asked to add stories for a new component, improve existing component stories, align stories with the repository's Storybook conventions, add meaningful controls for CVA-backed variants, or validate Storybook story architecture in this UI kit.
---

# Storybook Story Writer

## Purpose

Write component stories as executable UI-kit documentation. Treat this skill as the procedural checklist; the full
Storybook source of truth lives in `docs/agent`.

## Required Reading

Read only the files relevant to the touched surface:

- Component story budgets, controls, CVA/docgen limits, story-only args, and CSF guidance:
  `docs/agent/storybook-story-writing.md`
- Storybook folders, addons, source globs, story sorting, and preview CSS entrypoint:
  `docs/agent/storybook-configuration.md`
- Theme decorators, `wrapperBackground`, Docs theming, MDX theme bridge, and preview surface rules:
  `docs/agent/storybook-theming-and-docs.md`
- Pseudo states, RTL checks, bidi demo text, icon mirroring, and addon boundaries:
  `docs/agent/storybook-addons-and-qa.md`
- Production Docs proxy incident and workaround paths: `docs/agent/storybook-mdx-react-proxy-incident.md`
- Verification commands and static Storybook checks: `docs/agent/verification.md`

Use `references/story-patterns.md` for compact story shape examples and control snippets.

## Workflow

1. Inspect the component surface.
    - Read the component implementation, local `index.ts`, variant files, types, and existing stories.
    - Confirm whether the component is core or client, and keep stories colocated with the component folder.
    - Import from the local folder surface, such as `import {Button} from '.'`, when `index.ts` exports the component.

2. Classify the story-worthy API.
    - Identify owned semantic variants, sizes, states, interaction modes, and official composition patterns.
    - Ignore differences that only demonstrate arbitrary `className`, native props, wrapper layout, or Tailwind
      mutation.
    - Write a short plan where each story answers a concrete interface question.

3. Build focused CSF 3 stories.
    - Define `meta` with `satisfies Meta<typeof Component>` for simple stories.
    - For story-only args, extend `ComponentProps<typeof Component>` and filter those args before rendering real
      component props.
    - Put shared baseline args in `meta.args`; override only story-specific args.
    - Write semantic stories first, then important states, usage compositions, and comparison stories only for owned
      scales or documented patterns.

4. Make controls explicit when runtime metadata is needed.
    - Use component-owned runtime constants for public finite values instead of private story option arrays.
    - Add `argTypes.options`, `table.type`, and `table.defaultValue` for meaningful CVA, Base UI, or compound-part
      controls that docgen cannot infer reliably.
    - Put shared Storybook table labels and separators in `src/storybook/constants.ts`.
    - Mark story-only controls clearly and keep their options serializable.

5. Keep story-only code inside Storybook boundaries.
    - Use project-owned generated icons from `#core/icons` for story composition; do not add third-party icon packages
      only for stories.
    - Story-only imports may use Storybook utilities such as `storybook/test`; dependency graph rules should exclude
      `*.stories.*` from production dependency checks.
    - Do not use stories as proof that a core runtime component is RSC-safe.

6. Verify the smallest relevant surface.
    - Usually run `bun run build:ts` and `bun run check:lint` for story files.
    - Run `bun run storybook:build` after Storybook layout, preview, Docs, CSS source, addon, or MDX/showcase changes.
    - For preview, Docs, Vite plugin, or theme-addon changes, serve the static build with `bun run storybook:preview`
      and check at least one ordinary story plus one Docs page.
    - When Tailwind source detection changes, inspect both `dist/styles.css` and Storybook iframe CSS for the expected
      package/story utility split.

## Review Standard

- Review stories as executable documentation, not decorative demos.
- Lead with concrete issues: story-only arg leaks, misleading controls, weak types, noisy canvases, poor labels, or
  render patterns that hide important usage.
- Challenge story bloat when a component has no owned variant/state surface.
- Report which Storybook docs were used and which verification was run or intentionally skipped.
