---
name: theme-token-adapter
description: Review, adapt, or validate Tailwind/React component styles against this repository's NUI-prefixed theme-token contract. Use when Codex is asked to add or port UI components from shadcn, Radix, Base UI, examples, or storybook code; prefix semantic classes; adapt radius or spacing tokens; preserve RTL spacing, positioning, radii, icons, and animations; inspect CSS variables; update Tailwind CSS entrypoints; safelist public utilities; or check that component styles use the local design-system tokens correctly.
---

# Theme Token Adapter

## Purpose

Adapt component and stylesheet code to the NUI theme-token contract. Treat this skill as the procedural checklist; the
architectural source of truth lives in `docs/agent-operating-charter`.

## Required Reading

Read only the files relevant to the touched surface:

- Token namespace, semantic roles, radius, spacing, foundation utilities, and RTL rules:
  `docs/agent-operating-charter/theme-token-contract.md`
- Tailwind CSS entrypoints, source detection, `tw-animate-css`, `@utility`, and safelisting:
  `docs/agent-operating-charter/tailwind-and-styles.md`
- Product/design doctrine for color values, button hierarchy, interaction legibility, and expressive color:
  `docs/agent-operating-charter/design-system-doctrine.md`
- Component composition and public surface rules: `docs/agent-operating-charter/component-styling.md`
- Storybook theme surface and Docs canvas behavior: `docs/agent-operating-charter/storybook-theming-and-docs.md`
- Verification commands and CSS artifact checks: `docs/agent-operating-charter/verification.md`

Use `references/token-prefixing.md` for the compact mapping cheat sheet, RTL conversion examples, and useful searches.

## Workflow

1. Identify the touched surface.
    - Component classes or CVA variants.
    - `src/theme.css`, `src/library.css`, `src/styles.css`, or `.storybook/preview.css`.
    - Storybook preview/docs/theme styles.
    - Token values, token meanings, or public utility classes.

2. Preserve behavior and structure before changing visual tokens.
    - Port copied components by adapting theme-facing classes, not by redesigning behavior.
    - Keep ordinary Tailwind layout, typography, sizing, and state utilities unchanged unless they encode a
      design-system token decision.

3. Convert theme-facing styles to the NUI contract.
    - Prefix semantic color, radius, and design-system spacing utilities.
    - Keep raw runtime variables as `--nui-*`.
    - Keep Tailwind mappings as `--color-nui-*`, `--radius-nui-*`, and `--spacing-nui-*`.
    - For package-facing tokens, define the raw runtime variable in `src/library.css` and the matching `@theme inline`
      mapping in `src/theme.css` when Tailwind utilities are needed.

4. Apply design doctrine when meaning changes.
    - Read doctrine before changing color values, button variants, interactive-state styling, or semantic token meaning.
    - Prefer existing semantic roles before adding a new role.
    - Treat slash opacity values such as `/20`, `/50`, and `/80` as intensity conventions, not event-token names.

5. Preserve RTL behavior.
    - Convert physical inline-axis spacing, positioning, borders, and radii to logical utilities when the behavior is
      inline-directional.
    - Convert animation direction to logical forms when placement is logical.
    - Flip icons only at usage sites where the icon means inline direction.
    - Resolve shadcn registry markers before shipping copied source. Replace `cn-rtl-flip` with the official generated
      form `rtl:rotate-180`; do not create a runtime `.cn-rtl-flip` utility.
    - For portaled overlays with logical slide utilities, verify the rendered popup receives the effective LTR/RTL
      direction. Forward `dir` through content/popup props only when Portal inheritance loses it; never hardcode RTL.

6. Respect stylesheet artifact boundaries.
    - Keep public Tailwind mappings and the class-based dark variant in `src/theme.css`.
    - Keep raw runtime tokens, foundation classes, and shared CSS-first utility sources in `src/library.css`; import
      `./theme.css` there so library and Storybook builds use the public mapping source.
    - Keep `nui-link` and the `nui-links` descendant scope in one grouped CSS rule. Button's `link` variant should
      reference `nui-link` instead of copying the shared rest, hover, and active styles.
    - Keep package source detection and story exclusions in `src/styles.css`.
    - Keep Storybook source detection in `.storybook/preview.css`.
    - Safelist promised public utility variants in `src/styles.css` with `@source inline(...)` when package source does
      not otherwise emit them.
    - Do not safelist the token utility matrix. Tailwind consumers import `@nodzimo/ui/theme.css` and generate their
      used color, radius, spacing, and variant forms through their own compiler.

7. Check for unprefixed theme tokens and artifact regressions.
    - Search changed source for unprefixed shadcn semantic utilities and raw variables.
    - Search manually copied shadcn source for unresolved registry markers such as `cn-rtl-flip` and for physical slide
      directions under logical `inline-start`/`inline-end` variants.
    - Run `bun run build:css` after token or stylesheet entrypoint changes.
    - Run `bun run storybook:build` after Storybook CSS, preview, docs, or story-only utility changes.
    - Inspect `dist/styles.css` and Storybook iframe CSS for the expected package/story utility split when source
      detection changed.
    - After changing public mappings or CSS exports, inspect `bun pm pack --dry-run` and compile an isolated consumer
      Tailwind input through `@nodzimo/ui/theme.css` using representative classes not present in package component
      source.

## Reporting

Report:

- Which runtime tokens, Tailwind mappings, utilities, or CSS entrypoints changed.
- Which doctrine or token contract files were used.
- Which searches/builds were run or intentionally skipped.
- Any new public token or utility that needs follow-up verification.
