---
name: tailwind-class-formatter
description: Format long Tailwind class lists in Nodzimo UI React/TSX components into readable grouped chunks without changing visual behavior. Use when Codex is asked to clean up horizontal Tailwind className strings, split long mcn/cn/className/CVA class lists, make copied shadcn/Tailwind component styles readable, or apply the project's class grouping convention in a dedicated pass before or after token adaptation.
---

# Tailwind Class Formatter

## Purpose

Use this skill to turn unreadable Tailwind class strings into maintainable grouped class chunks. The skill fills the gap
left by Biome and Tailwind: they can sort classes, but they do not split long class lists into readable project groups.

This is a formatting and grouping skill only. It must preserve the exact style contract.

## Required Reading

- Read `docs/agent-operating-charter/component-styling.md` for the canonical project convention before changing
  component classes.
- Use `references/class-grouping.md` for the detailed grouping order, utility families, and example formatting pattern.
- If a class looks like it needs token adaptation, use `theme-token-adapter` instead of fixing it inside this skill.
- If broader code-style cleanup is requested, use `code-style-reviewer` to orchestrate this skill with the other style
  checks.

## Non-Negotiable Safety Contract

- Do not add, remove, rename, replace, or "improve" Tailwind classes.
- Do not change arbitrary values, opacity suffixes, variants, modifiers, selectors, token prefixes, or class spelling.
- Do not change component behavior, state handling, variants, DOM structure, or public API.
- Do not move styles into CVA only to shorten a class string. Use CVA only for real component variants such as `size`,
  `variant`, `tone`, `side`, or `orientation`.
- Do not move styles into CSS files unless the selector is already a public/reused stylesheet contract.
- Preserve external override order. Caller `className` must remain the last merge input when it was already last.
- If a class appears unsafe or suspicious, report it separately instead of editing it during formatting.

Before editing, treat the original class list as source-of-truth data. After editing, verify that every original class
still exists exactly once unless the original intentionally contained duplicates.

## When To Split

- Keep short readable class values inline.
- Split when a class list causes horizontal scrolling, contains several modifier families, or is hard to review in a
  diff.
- Prefer multiple static string arguments inside `mcn(...)` / `cn(...)` over one huge string.
- Do not split into one utility per line. A line should represent a recognizable group.
- Do not chase equal line lengths. Optimize for quick scanning and cheap maintenance.

## Grouping Rule

Group first by visible Tailwind modifier or selector prefix. Inside unmodified base classes, group by obvious utility
families. For the full order, family list, and examples, read `references/class-grouping.md`.

## Workflow

1. Identify long Tailwind class lists in `className`, `mcn`, `cn`, `cva`, or similar class composition calls.
2. Treat the original classes as an immutable set. Do not reinterpret the design.
3. Split classes into the modifier groups and base utility families above.
4. Keep static class chunks as literal strings so Tailwind source scanning still sees them.
5. Keep caller `className` or override values last.
6. Run the smallest relevant verification, usually `bunx biome check <changed-file>` or `bun run check:lint`.
7. If the file already has automated class sorting, let Biome sort inside each string, then review that no class moved
   across a grouping boundary in a way that hurts readability.

## Review Checklist

- Every original class is still present with the same spelling.
- No new class was added.
- No class was silently "fixed" or token-adapted by this skill.
- Static Tailwind classes remain statically discoverable in string literals.
- Group boundaries follow visible prefixes first, then obvious base utility families.
- `className` remains last in merge calls.
- The result reduces horizontal scrolling and improves diff review.
