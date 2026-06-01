---
name: theme-token-adapter
description: Review, adapt, or validate Tailwind/React component styles against this repository's NUI-prefixed theme-token contract. Use when Codex is asked to add or port UI components from shadcn, Radix, Base UI, examples, or storybook code; prefix semantic classes; adapt radius tokens; preserve RTL spacing, positioning, and animations; inspect CSS variables; or check that component styles use the local design-system tokens correctly.
---

# Theme Token Adapter

## Overview

Use this skill for component style adaptation in this UI kit. The repository exposes a library-safe design-system
namespace: copied or newly written components must use local `nui-*` theme utilities instead of unprefixed app-level
tokens.

## Core Contract

- Treat `src/library.css` as the source of truth for available theme tokens and foundation classes. `src/styles.css` is
  only the publishable package stylesheet entrypoint.
- Distinguish raw runtime CSS variables from Tailwind utility mappings. Public package tokens live as `--nui-*`
  variables in `:root`; Tailwind utility mappings live in `@theme inline` as `--color-nui-*`, `--radius-nui-*`, and
  `--spacing-nui-*`.
- If a token is part of the UI kit product contract, define both sides: the raw `--nui-*` variable for runtime
  consumers and the matching `@theme inline` mapping for Tailwind utilities. Do not leave product tokens only in
  `@theme inline`.
- Read `docs/design-system-doctrine/README.md` and the relevant chapter files before changing color token values,
  button variants, interactive-state styling, or the semantic meaning of `primary`, `secondary`, `outline`, `ghost`,
  `link`, `muted`, `accent`, `border`, `input`, or `ring`.
- Raw CSS variables use `--nui-*`.
- Tailwind theme tokens use `--color-nui-*`, `--radius-nui-*`, and `--spacing-nui-*`.
- Radius is a theme-facing design-system token. Port shadcn radius classes and variables to NUI equivalents, for
  example `rounded-lg` -> `rounded-nui-lg`, `rounded-md` -> `rounded-nui-md`, and `var(--radius-md)` ->
  `var(--radius-nui-md)`. This preserves shadcn's tokenized radius model under the NUI namespace instead of using
  Tailwind's default radius scale.
- Current spacing tokens are product tokens, not Storybook-only data: `--nui-spacing-2xs` through
  `--nui-spacing-2xl` are raw runtime variables, while `--spacing-nui-2xs` through `--spacing-nui-2xl` map those values
  for Tailwind utilities such as `gap-nui-md`.
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
- Directional animation classes should match the side semantics. When a component uses logical placement such as
  `side='inline-start'` or `side='inline-end'`, use logical animation utilities such as `slide-in-from-end-*` or
  `slide-in-from-start-*`. Keep physical animation utilities for explicit physical sides such as `left`, `right`,
  `top`, and `bottom`.
- Directional icon flipping is a usage-site decision, not an icon-generation decision. Add `rtl:rotate-180` only when
  an icon means inline direction such as next/previous, back/forward, or start/end. Do not flip external/open icons such
  as an `ArrowUpRightIcon` used for `Visit`, and do not flip icon gallery inventory.
- If hardcoded LTR demo text with neutral punctuation is shown inside an RTL Storybook preview, isolate the text
  fragment with explicit direction, for example `<span dir={'ltr'}>Processing...</span>`. Do not make components parse
  or rearrange punctuation.
- Component class strings use NUI-prefixed semantic utilities when they refer to design-system colors, radii, or spacing
  tokens.
- Keep ordinary Tailwind layout/typography/state utilities unchanged.
- Keep implementation code readable while adapting classes. Prefer named local constants for preparation, sorting, and
  rendering steps when a chain becomes dense. Use small explicit local types when inferred types become noisy; do not
  add helper functions or abstraction layers unless they simplify repeated logic.
- Keep broad foundation styles opt-in through the foundation utility classes documented in
  `references/token-prefixing.md`; do not silently style the entire consumer app.
- Keep Storybook story-only classes out of the publishable CSS artifact. `src/styles.css` is the package Tailwind
  entrypoint: import Tailwind with `source(none)`, import `./library.css`, scan `./**/*`, and exclude
  `./**/*.stories.*`.
- Do not put Tailwind imports or Storybook source exclusions in `src/library.css`. Storybook uses its own stylesheet
  entrypoint, `.storybook/preview.css`, to import Tailwind with `source(none)`, import `../src/library.css`, and scan
  `../src` plus `.`.
- Keep shared CSS-first animation utilities in `src/library.css`. `tw-animate-css` is a dev dependency and should be
  imported there with `@import "tw-animate-css";` so shadcn-style animation classes are generated for both
  `dist/styles.css` and Storybook preview CSS. Do not duplicate the import in the two entrypoints.
- Use relative CSS imports for this local stylesheet pipeline: `src/styles.css` imports `./library.css`, and
  `.storybook/preview.css` imports `../src/library.css`.
- Treat the two Tailwind imports as separate compiler entrypoints for separate artifacts, not duplicate runtime Tailwind
  instances. This follows Tailwind v4's documented `source(none)` plus explicit `@source` pattern for stylesheets with
  different source sets.
- Tailwind v4 `@utility` registers a utility with Tailwind; it does not by itself guarantee that the utility or its
  variants are emitted into the publishable `dist/styles.css`. Public NUI utilities should be defined in
  `src/library.css` with `@utility`, and any class forms promised to consumers but not present in package source must be
  safe-listed in `src/styles.css` with Tailwind's official `@source inline(...)` syntax. For example, the public
  animation
  pause utility is defined as `@utility nui-animate-paused { animation-play-state: paused; }` in `src/library.css`,
  while
  `src/styles.css` safelists `@source inline("{hover:,active:,group-hover:,}nui-animate-paused");` so the base, hover,
  active, and group-hover variants ship in the built package CSS.
- Storybook's theme toggle changes the `dark` class and NUI variables, but Storybook does not automatically repaint all
  preview and Docs canvas surfaces. Keep the project workaround in `.storybook/preview.css`: apply
  `background-color: var(--nui-background)` to `html` and `.docs-story`. This is Storybook-only theme surface glue, not
  a library token or consumer stylesheet rule.
- Standalone Storybook MDX token docs need the same component-theme class contract as stories. Keep
  `@storybook/addon-themes` as the owner of component `light` / `dark` classes, and keep `storybook-dark-mode` as the
  owner of Storybook chrome theme only. The custom Docs container in `.storybook/preview.tsx` contains a narrow
  workaround for unattached MDX pages: it reads the current addon-themes global from Storybook's internal Docs context
  store and toggles explicit `light` / `dark` classes on `document.documentElement` so `var(--nui-*)` palette docs read
  the same token values as ordinary stories.

## Workflow

1. Inspect the new or changed component files and `src/library.css`. Inspect `src/styles.css` and
   `.storybook/preview.css` too when Tailwind entrypoints or source policy change.
2. If the work affects color meaning, button variants, or interactive states, inspect
   `docs/design-system-doctrine/README.md` and the relevant chapter files and preserve the Nodzimo hierarchy:
    - primary speaks loudly.
    - secondary speaks quietly.
    - outline is structural.
    - ghost stays quiet until interaction.
    - link is the branded text signal.
3. Identify semantic theme classes or variables from the source component.
4. Convert only theme-facing styles to NUI-prefixed equivalents.
5. Preserve modifiers, state variants, opacity suffixes, and arbitrary selectors.
6. Convert directional physical utilities to logical utilities when they represent inline start/end behavior.
7. Convert directional animation utilities to logical forms when the placement itself is logical. Do not change physical
   `left`, `right`, `top`, or `bottom` animation classes unless the component is actually using inline/block logical
   side names.
8. Review directional icon usages. Flip only usage sites that mean inline direction; leave generated icons, external
   link icons, and icon galleries alone.
9. Keep local implementation imports relative inside the component folder.
10. Keep the component folder `index.ts` as the intentional local public surface. Do not re-export internal helper
    subcomponents only because a copied source exports them.
11. When adding a new package-facing design token, verify it has a raw `--nui-*` runtime variable and an `@theme inline`
    mapping if Tailwind utility generation is needed.
12. When adding a public package-facing Tailwind utility with `@utility`, verify the utility and promised variants are
    emitted into `dist/styles.css`. If the class is not used in package source, safelist the public class forms in
    `src/styles.css` with `@source inline(...)`.
13. Search changed files for unprefixed theme tokens.
14. If changing story files, Storybook-only preview classes, or Tailwind source detection, verify both CSS surfaces:
    package CSS should not contain story-only utilities, while static Storybook CSS should contain the utilities needed
    by
    stories and preview decorators. Check concrete class names in the built CSS artifacts instead of trusting that the
    build passed.
15. Run the smallest relevant verification:
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
