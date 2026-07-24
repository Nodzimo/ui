---
name: code-style-reviewer
description: Review and fix project code-style conventions that Biome, TypeScript, and existing focused skills do not fully enforce. Use when Codex is asked for a final project convention pass, cleanup after copied React/Tailwind code, consistency review, JSX literal normalization, rest-prop naming, type-vs-interface review, literal table typing, module constant naming, file extension/import/export style checks, or to orchestrate Tailwind class formatting with the tailwind-class-formatter skill.
---

# Code Style Reviewer

## Purpose

Run the final local convention pass after Biome, TypeScript, and focused skills. Treat this skill as the procedural
review checklist; durable code-style rules live in `docs/agent-operating-charter`.

## Required Reading

Read only the files relevant to the touched surface:

- Local JSX literal, rest naming, type/interface, extension/import/export, literal-table, and quote boundaries:
  `docs/agent-operating-charter/code-style-conventions.md`
- General readability and collaboration expectations: `docs/agent-operating-charter/collaboration.md`
- Internal package imports and local folder import rules: `docs/agent-operating-charter/internal-package-imports.md`
- Component composition, `mcn`, token adaptation, and class formatting boundaries:
  `docs/agent-operating-charter/component-styling.md`
- Tailwind class naming and WebStorm class regex conventions: `docs/agent-operating-charter/tailwind-and-styles.md`
- Verification command selection: `docs/agent-operating-charter/verification.md`

Use focused skills when their surface is primary:

- `tailwind-class-formatter` for long Tailwind class-list grouping.
- `theme-token-adapter` for NUI token adaptation.
- `compound-component-adapter` for public compound APIs and decomposition.
- `storybook-story-writer` for Storybook architecture and controls.

## Boundaries

- Do not duplicate Biome. Let Biome handle formatting, import organization, sorted object keys, sorted JSX attributes,
  sorted interface members, sorted Tailwind classes, and ordinary lint diagnostics.
- Do not make broad refactors under a style-review label.
- Do not change runtime behavior, public API, package boundaries, rendered markup, accessibility semantics, or component
  styling unless the user asked for that implementation change.
- Treat generated output as generator-owned.
- Leave raw SVG, raw HTML, MDX, CSS, and generated quote style alone unless the task explicitly targets those files.

## Safe Fixes

Apply these only when local intent is clear:

- Rename destructured remainders to `restProps`, `restArgs`, or `restParams`.
- Normalize JSX string literal props in hand-authored TSX source to expression containers.
- Replace widened literal-table annotations with `as const` when downstream code derives unions from values or keys.
- Add `satisfies readonly SomeType[]` when a literal option array validates against an external finite union.
- Rename intentional module-scope immutable tables, mappings, option arrays, and defaults to `UPPER_SNAKE_CASE`.
- Derive unions from literal tables instead of duplicating string unions by hand.
- Rename hand-authored `.tsx` files to `.ts` when they contain no JSX, and use `.tsx` when JSX is present.
- Remove explicit `.ts` / `.tsx` extensions from local TypeScript imports when the resolver can resolve the module.
- Mark partial Markdown snippets as `text` instead of `ts`, `tsx`, or another language when the snippet is not valid
  standalone code.
- Apply `tailwind-class-formatter` to long Tailwind class lists without changing class tokens.
- Separate multiline declarations from neighboring declarations when they visually stick to one-line bindings.

## Review-Only Decisions

Report these unless the correct change is obvious from local context:

- Converting between `type` and `interface`.
- Moving values between module scope and render scope.
- Changing public exported names.
- Changing export style when it affects public API readability or barrel flow.
- Replacing object maps with arrays when order or lookup semantics matter.
- Changing `Object.freeze(...)` usage when runtime immutability is part of the contract.

## Workflow

1. Inspect changed files and identify which conventions apply.
2. Run or rely on Biome for its owned checks before spending review time on local conventions.
3. Apply safe fixes only when intent is clear.
4. Delegate Tailwind class grouping, token adaptation, compound API/decomposition, and Storybook architecture to the
   focused skills when needed.
5. For type/interface and export-style questions, fix obvious mismatches and report ambiguous candidates.
6. Run the smallest relevant verification:
    - `bunx biome check <changed-files>` for style-only changes.
    - `bun run build:ts` after TypeScript type-shape, extension, import, or exported-type changes.
    - Tailwind class-token comparison when class-list formatting changed.
7. Summarize changed conventions and any review-only findings.

## Review Checklist

- JSX string literal props in hand-authored TSX use `{...}` expression containers.
- Boolean shorthand remains shorthand when appropriate.
- Destructured remainder names use `restProps`, `restArgs`, or `restParams`.
- Module-scope literal tables use `UPPER_SNAKE_CASE`.
- Literal option arrays and mappings preserve useful narrow types.
- `satisfies` validates external contracts without widening literal values.
- `type` and `interface` choices reflect TypeScript semantics, not preference.
- Long Tailwind class lists were delegated to `tailwind-class-formatter`.
- `.ts` files do not contain JSX, and `.tsx` files are used when JSX is present.
- TypeScript source imports omit `.ts` and `.tsx` extensions.
- Markdown fence language tags describe valid standalone syntax; partial attributes and fragments use `text`.
- Export style matches file shape.
- Multiline declarations are visually separated when needed for scanning.
- Raw SVG/HTML/MDX/CSS quote churn was not introduced.
- Biome and TypeScript verification passed where relevant.
