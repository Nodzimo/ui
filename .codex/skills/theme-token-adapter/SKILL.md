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

- Treat `src/styles.css` as the source of truth for available theme tokens.
- Read `docs/design-system-doctrine.md` before changing color token values, button variants, interactive-state styling,
  or the semantic meaning of `primary`, `secondary`, `outline`, `ghost`, `link`, `muted`, `accent`, `border`, `input`,
  or `ring`.
- Raw CSS variables use `--nui-*`.
- Tailwind theme tokens use `--color-nui-*`, `--radius-nui-*`, and `--spacing-nui-*`.
- Reusable alpha intensity tokens use `--nui-alpha-subtle`, `--nui-alpha-half`, and `--nui-alpha-strong`. Treat these as
  color-intensity rhythm values, not hover/active/pressed event tokens.
- Component class strings use NUI-prefixed semantic utilities when they refer to design-system colors, radii, or spacing
  tokens.
- Keep ordinary Tailwind layout/typography/state utilities unchanged.
- Keep broad foundation styles opt-in through the foundation utility classes documented in
  `references/token-prefixing.md`; do not silently style the entire consumer app.
- Keep Storybook story-only classes out of the publishable CSS artifact. `src/styles.css` should use Tailwind v4 source
  exclusion such as `@source not "./**/*.stories.*";` so colocated stories do not inflate `dist/styles.css`.

## Workflow

1. Inspect the new or changed component files and `src/styles.css`.
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
6. Keep local implementation imports relative inside the component folder.
7. Search changed files for unprefixed theme tokens.
8. If changing story files, Storybook-only preview classes, or Tailwind source detection, consider whether
   `dist/styles.css` should change. Story-only classes should not be part of the library CSS contract.
9. Run the smallest relevant verification:
    - `bun run build:ts` for component-only TypeScript changes.
    - `bun run build:all` after changing `src/styles.css` or Tailwind theme tokens.

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
