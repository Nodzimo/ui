---
name: theme-token-adapter
description: Review, adapt, or validate Tailwind/React component styles against this repository's NUI-prefixed theme-token contract. Use when Codex is asked to add or port UI components from shadcn, Radix, Base UI, examples, or custom code; prefix semantic classes; inspect CSS variables; or check that component styles use the local design-system tokens correctly.
---

# Theme Token Adapter

## Overview

Use this skill for component style adaptation in this UI kit. The repository exposes a library-safe design-system
namespace: copied or newly written components must use local `nui-*` theme utilities instead of unprefixed app-level
tokens.

## Core Contract

- Treat `src/styles.css` as the source of truth for available theme tokens.
- Raw CSS variables use `--nui-*`.
- Tailwind theme tokens use `--color-nui-*`, `--radius-nui-*`, and `--spacing-nui-*`.
- Component class strings use NUI-prefixed semantic utilities when they refer to design-system colors, radii, or spacing
  tokens.
- Keep ordinary Tailwind layout/typography/state utilities unchanged.
- Keep broad foundation styles opt-in through `.nui-root`; do not silently style the entire consumer app.

## Workflow

1. Inspect the new or changed component files and `src/styles.css`.
2. Identify semantic theme classes or variables from the source component.
3. Convert only theme-facing styles to NUI-prefixed equivalents.
4. Preserve modifiers, state variants, opacity suffixes, and arbitrary selectors.
5. Keep local implementation imports relative inside the component folder.
6. Search changed files for unprefixed theme tokens.
7. Run the smallest relevant verification:
    - `bun run build:ts` for component-only TypeScript changes.
    - `bun run build:all` after changing `src/styles.css` or Tailwind theme tokens.

## Prefixing Reference

Read `references/token-prefixing.md` when adapting a component, adding tokens, or reviewing whether a utility should be
prefixed.

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
