---
name: theme-token-adapter
description: Review, adapt, or validate Tailwind/React component styles against this repository's NUI-prefixed theme-token contract. Use when Codex is asked to add or port UI components from shadcn, Radix, Base UI, examples, or storybook code; prefix semantic classes; inspect CSS variables; or check that component styles use the local design-system tokens correctly.
---

# Theme Token Adapter

## Overview

Use this skill for component style adaptation in this UI kit. The repository exposes a library-safe design-system
namespace: copied or newly written components must use local `nui-*` theme utilities instead of unprefixed app-level
tokens.

## Core Contract

- Treat `src/library.css` as the source of truth for available theme tokens and foundation classes. `src/styles.css` is
  only the publishable package stylesheet entrypoint.
- Read `docs/design-system-doctrine.md` before changing color token values, button variants, interactive-state styling,
  or the semantic meaning of `primary`, `secondary`, `outline`, `ghost`, `link`, `muted`, `accent`, `border`, `input`,
  or `ring`.
- Raw CSS variables use `--nui-*`.
- Tailwind theme tokens use `--color-nui-*`, `--radius-nui-*`, and `--spacing-nui-*`.
- Reusable color-intensity rhythm uses Tailwind slash opacity values `/20`, `/50`, and `/80`, described as `subtle`,
  `half`, and `strong`. Treat these as naming/review conventions, not CSS variables or hover/active/pressed event
  tokens.
- Treat expressive color as design cost. Before adding or intensifying a color role, identify the exact problem,
  whether it is role-level or component-specific, whether the element controls its foreground/background pair, and which
  future components will inherit the token.
- Prefer stable semantic tokens with theme-specific values over case-specific workaround tokens. Do not add
  `linkPrimary`, `headingPrimary`, `sliderPrimary`, or similar private roles to patch one weak surface.
- Directional spacing, positioning, borders, and radii should use logical utilities for RTL support: `ps-*`, `pe-*`,
  `ms-*`, `me-*`, `start-*`, `end-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, and `rounded-e-*`. Avoid physical
  `pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`, `border-l-*`, and `border-r-*` unless the design truly means a
  physical side.
- Component class strings use NUI-prefixed semantic utilities when they refer to design-system colors, radii, or spacing
  tokens.
- Keep ordinary Tailwind layout/typography/state utilities unchanged.
- Keep broad foundation styles opt-in through the foundation utility classes documented in
  `references/token-prefixing.md`; do not silently style the entire consumer app.
- Keep Storybook story-only classes out of the publishable CSS artifact. `src/styles.css` is the package Tailwind
  entrypoint: import Tailwind with `source(none)`, import `./library.css`, scan `./**/*`, and exclude
  `./**/*.stories.*`.
- Do not put Tailwind imports or Storybook source exclusions in `src/library.css`. Storybook uses its own stylesheet
  entrypoint, `.storybook/preview.css`, to import Tailwind with `source(none)`, import `../src/library.css`, and scan
  `../src` plus `.`.
- Use relative CSS imports for this local stylesheet pipeline: `src/styles.css` imports `./library.css`, and
  `.storybook/preview.css` imports `../src/library.css`.
- Treat the two Tailwind imports as separate compiler entrypoints for separate artifacts, not duplicate runtime Tailwind
  instances. This follows Tailwind v4's documented `source(none)` plus explicit `@source` pattern for stylesheets with
  different source sets.
- Storybook's theme toggle changes the `dark` class and NUI variables, but Storybook does not automatically repaint all
  preview and Docs canvas surfaces. Keep the project workaround in `.storybook/preview.css`: apply
  `background-color: var(--nui-background)` to `html` and `.docs-story`. This is Storybook-only theme surface glue, not
  a library token or consumer stylesheet rule.

## Workflow

1. Inspect the new or changed component files and `src/library.css`. Inspect `src/styles.css` and
   `.storybook/preview.css` too when Tailwind entrypoints or source policy change.
2. If the work affects color meaning, button variants, or interactive states, inspect `docs/design-system-doctrine.md`
   and preserve the Nodzimo hierarchy:
    - primary speaks loudly.
    - secondary speaks quietly.
    - outline is structural.
    - ghost stays quiet until interaction.
    - link is the branded text signal.
3. Identify semantic theme classes or variables from the source component.
4. Convert only theme-facing styles to NUI-prefixed equivalents.
5. Preserve modifiers, state variants, opacity suffixes, and arbitrary selectors.
6. Convert directional physical utilities to logical utilities when they represent inline start/end behavior.
7. Keep local implementation imports relative inside the component folder.
8. Search changed files for unprefixed theme tokens.
9. If changing story files, Storybook-only preview classes, or Tailwind source detection, verify both CSS surfaces:
   package CSS should not contain story-only utilities, while static Storybook CSS should contain the utilities needed
   by
   stories and preview decorators. Check concrete class names in the built CSS artifacts instead of trusting that the
   build passed.
10. Run the smallest relevant verification:
    - `bun run build:ts` for component-only TypeScript changes.
    - `bun run build:css` after changing `src/library.css`, `src/styles.css`, or Tailwind theme tokens.
    - `bun run storybook:build` after changing Storybook CSS imports, `.storybook` configuration, or story-only layout
      utilities.

## Prefixing Reference

Read `references/token-prefixing.md` when adapting a component, adding tokens, reviewing whether a utility should be
prefixed, or checking the intended meaning of a theme token.

## Import Rules

Use project package imports for cross-area imports:

```ts
import {mcn} from '#lib'
import {Button} from '#client'
import {Button} from '#client/components/button'
```

Use relative imports inside one component folder:

```ts
import {buttonVariants} from './button-variants'
```

Do not use consumer package entrypoints inside source files.
