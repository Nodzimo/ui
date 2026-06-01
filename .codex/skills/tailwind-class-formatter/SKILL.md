---
name: tailwind-class-formatter
description: Format long Tailwind class lists in Nodzimo UI React/TSX components into readable grouped chunks without changing visual behavior. Use when Codex is asked to clean up horizontal Tailwind className strings, split long mcn/cn/className/CVA class lists, make copied shadcn/Tailwind component styles readable, or apply the project's class grouping convention after token adaptation.
---

# Tailwind Class Formatter

## Purpose

Use this skill to turn unreadable Tailwind class strings into maintainable grouped class chunks. The skill fills the
gap left by Biome and Tailwind: they can sort classes, but they do not split long class lists into readable project
groups.

This is a formatting and grouping skill only. It must preserve the exact style contract.

## Required Reading

- Read `docs/agent/component-styling.md` for the canonical project convention before changing component classes.
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
families.

Use this order:

1. Base utilities without modifiers.
2. Pseudo and user states: `hover:*`, `focus:*`, `focus-visible:*`, `active:*`, `disabled:*`.
3. ARIA states: `aria-*:*`.
4. Data-family states: `data-*:*`, `has-data-*:*`, `in-data-*:*`, `not-data-*:*`.
5. Theme, media, and context modifiers: `dark:*`, `rtl:*`, `motion-*:*`, responsive modifiers such as `sm:*` and
   `md:*`.
6. Descendant relation selectors: `*:data-*:*`, `group-*:*`, `peer-*:*`.
7. Arbitrary descendant selectors: `[&_svg]:*`, `[&>span]:*`, `[&_[data-slot=x]]:*`, and similar bracket selectors.
8. External override input such as `className`.

If one modifier family grows too large, split it by the same visible prefix: one line for `focus-visible:*`, one line
for `disabled:*`, one line for `dark:hover:*`, etc.

## Base Utility Families

For base utilities without modifiers, use these recognizable families:

- Layout and sizing: `flex`, `grid`, `block`, `inline-*`, `relative`, `absolute`, `items-*`, `justify-*`, `overflow-*`,
  `w-*`, `h-*`, `size-*`, `min-*`, `max-*`.
- Spacing: `p-*`, `px-*`, `py-*`, `ps-*`, `pe-*`, `m-*`, `mx-*`, `my-*`, `ms-*`, `me-*`, `gap-*`, `space-*`.
- Text and content behavior: `text-*`, `font-*`, `leading-*`, `tracking-*`, `whitespace-*`, `line-clamp-*`,
  `truncate`, `select-*`.
- Shape and boundary: `rounded-*`, `border-*`, `outline-*`, `ring-*`, `divide-*`.
- Surface and motion: `bg-*`, `shadow-*`, `opacity-*`, `transition-*`, `duration-*`, `ease-*`, `animate-*`.
- Miscellaneous: classes that do not clearly fit another base family.

When a base family is tiny, it can share a line with a nearby family. Prefer obvious scanning to rigid taxonomy.

## Formatting Pattern

For long inline `className` values, wrap them in the existing merge helper if one is already used nearby. In this
project, prefer `mcn` from `#lib` for class merging.

Good:

```ts
const triggerClassName = mcn(
    'flex w-fit items-center justify-between',
    'gap-1.5 py-2 ps-2.5 pe-2',
    'select-none whitespace-nowrap text-sm',
    'rounded-nui-lg border border-nui-input outline-none',
    'bg-transparent transition-colors',
    'focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20',
    'data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-nui-md),10px)] data-placeholder:text-nui-muted-foreground',
    'dark:bg-nui-input/30 dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40 dark:hover:bg-nui-input/50',
    '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    className,
)
```

Avoid:

```ts
const triggerClassName =
    'flex w-fit select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-nui-lg border border-nui-input bg-transparent py-2 ps-2.5 pe-2 text-sm outline-none transition-colors focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50 disabled:cursor-not-allowed disabled:opacity-50'
```

Also avoid using CVA only as a line-break mechanism:

```ts
const triggerStyles = cva('...')
```

Use CVA only when the component has real variant inputs.

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
