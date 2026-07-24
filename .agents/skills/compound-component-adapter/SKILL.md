---
name: compound-component-adapter
description: Harden and decompose Nodzimo UI compound React components while preserving their upstream Base UI contract. Use after source, formatting, token, and RTL passes when porting complex shadcn/Base UI components; exporting public part props and finite runtime option constants; normalizing wrapper-owned boolean data attributes; designing folder barrels; or splitting large component modules into self-contained semantic files without behavior changes, duplication, or avoidable sibling cross-imports.
---

# Compound Component Adapter

## Purpose

Own the public-API and decomposition passes of the staged shadcn adaptation workflow. Do not absorb token conversion,
class formatting, or Storybook implementation into this skill.

## Required Reading

- Read `docs/agent-operating-charter/shadcn-component-adaptation.md` completely.
- Read `docs/agent-operating-charter/source-layout.md` and
  `docs/agent-operating-charter/internal-package-imports.md` when changing files or barrels.
- Read `docs/agent-operating-charter/code-style-conventions.md` before adding documentation snippets or changing
  hand-authored TypeScript/TSX conventions.
- Read the affected primitive declarations in the installed `@base-ui/react` package and the official component examples
  before deciding prop ownership or defaults.
- Use `references/compound-patterns.md` for compact implementation patterns.
- Use `docs/agent-operating-charter/select-api.md` only when Select data shapes or reusable option types are in scope.

## Preconditions

- Confirm source capture, mechanical cleanup, theme adaptation, and RTL/registry-marker passes are complete.
- If they are not complete, stop this pass or route the missing work to `code-style-reviewer`,
  `tailwind-class-formatter`, or `theme-token-adapter`.
- Record the intended public surface before editing. Do not infer authorization for unrelated API redesign.

## Public API Workflow

1. Inventory every root and part wrapper, its upstream primitive props, wrapper-owned props, defaults, and exported
   names.
2. When the same prop name exists at several scopes, trace each owner and any upstream state propagation in the
   installed implementation. Do not infer equivalence from a simple closed demo.
3. Derive props from upstream primitive namespaces. Compose only the extra contracts the wrapper really owns.
4. Identify finite public values that consumers and Storybook need at runtime.
5. Export one immutable runtime option constant and a derived or upstream-validated type for each meaningful finite
   contract.
6. Keep upstream `undefined` in optional prop types but exclude it from explicit runtime option arrays.
7. Normalize wrapper-owned presence-based boolean data attributes so `false` omits the attribute.
8. Export intentional parts, types, and constants through the folder `index.ts`; keep indicators and helpers private.
9. Run TypeScript verification before starting decomposition.

Do not introduce shared one-field prop helpers merely to remove repeated intersections. Do not reconstruct broad
upstream unions or generics unless a real consumer boundary needs an owned narrower contract.

## Decomposition Workflow

1. Map declarations into self-contained semantic groups.
2. Keep parts together when one is implemented through another, or when they share local defaults/helpers.
3. Target zero sibling implementation cross-imports.
4. If a cross-import appears, reconsider the boundary before extracting a neutral helper.
5. Never duplicate components, types, constants, defaults, or class recipes to remove an import.
6. Move code without changing behavior, public names, defaults, JSX, data attributes, or class tokens.
7. Update the local barrel in the same pass and group exports by owning module.
8. Compare the before/after declarations and run TypeScript plus dependency-graph checks when warranted.

## Handoff

After the API and modules are stable, hand the component to `storybook-story-writer`. Storybook may expose missing
consumer metadata, but any follow-up component API change must be justified for real consumers and committed separately
from the story.

## Reporting

Report:

- public props, types, constants, and exports added or deliberately left upstream-only;
- boolean presence markers normalized;
- module boundaries chosen and any justified sibling dependency;
- verification run;
- the next staged pass and a Conventional Commit message for the completed pass.
