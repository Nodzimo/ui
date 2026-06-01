---
name: code-style-reviewer
description: Review and fix project code-style conventions that Biome, TypeScript, and existing focused skills do not fully enforce. Use when Codex is asked for a final project convention pass, cleanup after copied React/Tailwind code, consistency review, JSX literal normalization, rest-prop naming, type-vs-interface review, literal table typing, module constant naming, file extension/import/export style checks, or to orchestrate Tailwind class formatting with the tailwind-class-formatter skill.
---

# Code Style Reviewer

## Overview

Use this skill as the final project convention pass. It covers readability and maintenance rules that are not fully
enforced by Biome or TypeScript.

This skill is a reviewer and safe-fix orchestrator. It should fix mechanical convention drift, call focused skills when
needed, and report semantic decisions instead of rewriting code by taste.

## Scope Boundaries

- Do not duplicate Biome. Let Biome handle formatting, import organization, sorted object keys, sorted JSX attributes,
  sorted interface members, sorted Tailwind classes, and ordinary lint diagnostics.
- Do not replace focused skills. Use `tailwind-class-formatter` for long Tailwind class-list grouping. Use
  `theme-token-adapter` for NUI token adaptation. Use `storybook-story-writer` for story architecture.
- Do not make broad refactors under the label of style review.
- Do not change runtime behavior, public API, package boundaries, rendered markup structure, accessibility semantics, or
  component styling unless the user explicitly asks for that implementation change.
- Treat generated output as generator-owned. Do not hand-normalize generated icon component internals or generated SVG
  component code unless the generator itself is being changed.

## Safe Fixes

These changes are usually safe when the local code shape is clear:

- Rename destructured remainder objects to `restProps`, `restArgs`, or `restParams`.
- Normalize JSX string literal props in TSX source to expression containers.
- Replace widened literal-table annotations with `as const` when downstream code derives unions from values or keys.
- Add `satisfies readonly SomeType[]` to literal option arrays when the array is meant to validate against an external
  finite union without widening its elements.
- Rename intentional module-scope immutable tables, mappings, option arrays, and defaults to `UPPER_SNAKE_CASE`.
- Derive unions from literal tables instead of duplicating string unions by hand.
- Rename hand-authored `.tsx` files to `.ts` when they contain no JSX, and use `.tsx` when JSX is present.
- Remove explicit `.ts` / `.tsx` extensions from local TypeScript imports when the project resolver can resolve the
  module without them.
- Apply `tailwind-class-formatter` to long Tailwind class lists without changing the class tokens.
- Separate multiline declarations from neighboring declarations with blank lines when they would otherwise visually
  stick to single-line constants or functions.

Run verification after safe fixes.

## Review-Only Decisions

Report these unless the correct change is obvious from local context:

- Converting between `type` and `interface`.
- Moving values between module scope and render scope.
- Changing public exported names.
- Changing export style when it affects public API readability or barrel flow.
- Changing raw SVG, HTML, MDX, CSS, or generated file quote style.
- Replacing object maps with arrays because order is semantically important.
- Changing `Object.freeze(...)` usage when runtime immutability is part of the contract.

## JSX Literal Policy

In hand-authored TSX source, prefer expression containers for string literal prop values:

```tsx
<SelectTrigger data-slot={'select-trigger'} size={'default'}/>
```

Do not prefer bare string JSX attributes in TSX source:

```tsx
<SelectTrigger data-slot='select-trigger' size='default'/>
```

Rationale:

- JSX prop values use one consistent expression-container shape.
- Refactoring a literal to a variable, function call, object, or class merge does not require changing the prop shell.
- The string remains visually obvious because the literal still has quotes inside the braces.

Limits:

- Do not apply this rule to raw HTML, raw SVG, MDX, CSS, or generated files.
- Keep boolean shorthand for boolean props when it is the clearest form.
- Keep spread props as spreads.
- Keep attribute values that are already expressions as expressions.

Valid:

```tsx
<Button disabled data-slot={'button'} onClick={handleClick} {...restProps} />
```

Do not rewrite to:

```tsx
<Button disabled={true} data-slot={'button'} onClick={handleClick} {...restProps} />
```

## Quote Policy

- JS, TS, and TSX use single quotes where possible.
- JSX string literals should still be inside expression containers in TSX source, for example `kind={'primary'}`.
- CSS may use single quotes where practical, but double quotes are acceptable when nested quotes make them clearer or
  when tool output requires them.
- Raw HTML and raw SVG may keep double-quoted attributes. Do not churn raw SVG assets only to satisfy JS quote taste.
- Markdown fenced code blocks should use a language tag only when the snippet is syntactically valid as that language
  on its own. Use `text` for partial JSX attributes, JSON fragments, placeholders, or intentionally invalid examples.

## Rest Naming

When destructuring an object and collecting the remaining properties, name the remainder for what it is:

- Component props remainder: `restProps`.
- Function/story arg remainder: `restArgs`.
- Route/query/config parameter remainder: `restParams`.

Good:

```tsx
function Button({className, variant, ...restProps}: ButtonProps) {
    return <button className={className} {...restProps} />
}
```

Avoid:

```tsx
function Button({className, variant, ...props}: ButtonProps) {
    return <button className={className} {...props} />
}
```

Use `props`, `args`, or `params` only when the object is not a remainder, for example a whole input object passed into a
helper or component without destructuring in the same binding.

## Type And Interface Policy

Use `type` where TypeScript type composition is the point:

- unions;
- intersections;
- utility types;
- `ComponentProps<...>`;
- `VariantProps<typeof ...>`;
- extracted callback signatures;
- type aliases derived from literal tables.

Use `interface` where an object contract is intentionally open, extendable, or naturally implemented/augmented:

- public object shapes expected to be extended;
- declaration-merge-friendly contracts;
- class implementation contracts;
- external-facing object contracts where extension is part of the model.

Do not convert between `type` and `interface` only for taste or only because one form sorts better. If the best choice
is
not clear, report the candidate and reason instead of editing.

## File Extension Policy

Use file extensions to communicate whether a source file contains JSX:

- Use `.ts` for TypeScript files without JSX.
- Use `.tsx` for files that contain JSX.
- Do not keep a `.tsx` extension only because the file is part of a React component folder.
- Do not rename generated files manually unless the generator contract is being updated.

When renaming `.tsx` to `.ts` or `.ts` to `.tsx`, update local imports as needed and run TypeScript verification.

## Import Path Policy

Do not include explicit `.ts` or `.tsx` extensions in TypeScript source imports:

```ts
import {Button} from './button'
import {SelectContent} from './select-content'
```

Avoid:

```ts
import {Button} from './button.tsx'
import {SelectContent} from './select-content.tsx'
```

Rationale:

- The project resolver and bundler already resolve TypeScript source modules.
- Extensionless imports survive `.ts` / `.tsx` renames better.
- Explicit source extensions create unnecessary churn in a library build setup.

Do not apply this rule to non-TypeScript asset imports where the extension is the contract, such as CSS, raw Markdown,
or query-suffixed imports.

## Export Style Policy

Choose export style by file shape, not personal preference.

Use direct named exports for small leaf files with one primary runtime export and maybe its local type:

```tsx
export type SpinnerProps = ComponentProps<'svg'>

export function Spinner({className, ...restProps}: SpinnerProps) {
    return <svg className={className} {...restProps} />
}
```

Use a grouped export block at the end for compound or multipart files where many local declarations are intentionally
public:

```ts
export {
    SELECT_CONTENT_ALIGNS,
    SELECT_CONTENT_SIDES,
    SelectContent,
    type SelectContentAlign,
    type SelectContentProps,
    type SelectContentSide,
}
```

This keeps compound component files readable: first inspect the local implementation, then review the intentional public
surface in one place.

Do not churn export style in files where the current shape is already clear. Prefer grouped exports when a file exposes
several related components, constants, and types from one module.

When a helper has a short project-facing name, expose that name at the helper module boundary rather than aliasing it
only from a distant barrel:

```ts
function mergeClassNames(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export {mergeClassNames as mcn}
```

Then the local barrel should re-export the already-intentional name:

```ts
export {mcn} from './merge-class-names'
```

This keeps imports, editor hovers, generated output, and the module's own public surface aligned. A barrel-only alias
is acceptable for external compatibility shims, but avoid it for the primary local name used throughout the project.

## Literal Table Policy

Use module-scope `UPPER_SNAKE_CASE` for intentional immutable tables, mappings, defaults, and finite option lists:

```ts
const BUTTON_VARIANT_OPTIONS = ['default', 'outline', 'secondary'] as const
type ButtonVariantOption = (typeof BUTTON_VARIANT_OPTIONS)[number]
```

When validating against an external finite union, preserve literal inference and validate shape:

```ts
const SELECT_CONTENT_SIDES = Object.freeze([
    'top',
    'bottom',
    'inline-start',
    'inline-end',
] as const satisfies readonly SelectContentSide[])
```

Avoid widened annotations when downstream code needs literal values:

```ts
const BUTTON_VARIANT_OPTIONS: readonly string[] = ['default', 'outline']
```

Do not duplicate unions by hand when they can be derived from the table. For object mappings, derive key and value types
from the mapping:

```ts
const BUTTON_STORY_ICONS = {
    HeartIcon,
    Trash2Icon,
} as const

type ButtonStoryIconName = keyof typeof BUTTON_STORY_ICONS
type ButtonStoryIcon = (typeof BUTTON_STORY_ICONS)[ButtonStoryIconName]
```

For runtime APIs that widen keys, cast narrowly after the literal object is declared:

```ts
const BUTTON_STORY_ICON_OPTIONS = Object.keys(
    BUTTON_STORY_ICONS,
) as ButtonStoryIconName[]
```

Do not turn every module-scope value into an immutable literal table. `as const`, `satisfies`, `Object.freeze`, and
`UPPER_SNAKE_CASE` are useful when the value is intentionally a reusable constant, mapping, finite option list, or
source for derived unions. They are usually noise for ordinary configuration fragments whose main job is to satisfy a
framework type.

For config fragments, prefer light explicit typing when that is enough:

```ts
const previewWrapperArgs: Preview['args'] = {
    wrapperBackground: 'transparent',
}
```

Use `satisfies` when a framework type is too broad, optional, or inference-sensitive and a direct annotation widens or
breaks assignability:

```ts
const previewDecorators = [
    withThemeByClassName({...}),
    previewWrapperDecorator,
] satisfies Preview['decorators']
```

Avoid stacking `as const`, `satisfies`, `Readonly`, `NonNullable`, and uppercase naming only to make a normal config
piece feel more immutable. Add that ceremony only when it preserves a useful literal union, validates an external finite
contract, prevents real mutation risk, or makes the exported contract clearer.

## Declaration Spacing Policy

Use blank lines to separate multiline declarations from neighboring declarations. Single-line declarations that are
closely related may be grouped together, but a multiline array, object, function, or expression should not visually
stick to a one-line constant above or below it.

Good:

```ts
const clientCompilerIncludes = [/src[\\/]client\.ts$/, /src[\\/]client[\\/]/]
const {dependencies, peerDependencies} = packageJson

const runtimePackageNames = [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
]

function isExternalRuntimeImport(importId: string) {
    return runtimePackageNames.some((packageName) => {
        return importId === packageName || importId.startsWith(`${packageName}/`)
    })
}
```

Avoid:

```ts
const clientCompilerIncludes = [/src[\\/]client\.ts$/, /src[\\/]client[\\/]/]
const {dependencies, peerDependencies} = packageJson
const runtimePackageNames = [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
]

function isExternalRuntimeImport(importId: string) {
    return runtimePackageNames.some((packageName) => {
        return importId === packageName || importId.startsWith(`${packageName}/`)
    })
}
```

This is a readability convention, not a request for decorative spacing everywhere. Do not add blank lines between every
small local binding. Use the rule when a multiline declaration creates a visual block that should be scanned as its own
unit.

## Tailwind Class Lists

Use `class`, `className`, `classNames`, `classes`, and `*_CLASSES` naming for values that contain Tailwind class
strings, including string constants, arrays, and object tables such as CVA variant class maps. Reserve `style` and
`styles` naming for inline style objects, `CSSProperties`, and other non-Tailwind style declarations.

The shared WebStorm Tailwind `experimental.classRegex` convention should stay scoped to variable declarations whose
names contain class/className/classNames/classes/CLASSES. Do not broaden it to `styles`; JSX `className` attributes are
already handled by Tailwind's normal class-attribute support. The project regex convention is adapted from the
practical examples in <https://github.com/codewithhridoy/tailwind-autosuggestion-for-custom-classes>.

When long Tailwind class strings hurt scanning or diffs, use the `tailwind-class-formatter` skill. Do not duplicate that
skill's grouping rules here.

After applying it, verify that class tokens match before and after formatting when practical. Formatting must not add,
remove, rename, or "fix" classes.

## Workflow

1. Inspect the changed files and identify which conventions apply.
2. Run or rely on Biome for its owned mechanical checks before spending review time on local conventions.
3. Apply safe fixes only when the local intent is clear.
4. For long Tailwind class lists, invoke `tailwind-class-formatter` and preserve class tokens exactly.
5. For type/interface decisions, fix only obvious mismatches; otherwise report the candidate with the tradeoff.
6. Leave raw SVG, raw HTML, MDX, CSS, and generated output alone unless the task explicitly targets those files.
7. Run the smallest relevant verification:
    - `bunx biome check <changed-files>` for style-only changes.
    - `bun run build:ts` after TypeScript type-shape or exported type changes.
    - Tailwind class-token comparison when class-list formatting changed.
8. Summarize changed conventions and any review-only findings.

## Review Checklist

- JSX string literal props in hand-authored TSX use `{...}` expression containers.
- Boolean shorthand remains shorthand when appropriate.
- Destructured remainder names use `restProps`, `restArgs`, or `restParams`.
- Module-scope literal tables use `UPPER_SNAKE_CASE`.
- Literal option arrays and mappings use `as const` when deriving unions.
- `satisfies` validates external contracts without widening literal values.
- `type` and `interface` choices reflect TypeScript semantics, not preference.
- Long Tailwind class lists have been delegated to `tailwind-class-formatter`.
- `.ts` files do not contain JSX, and `.tsx` files are used when JSX is present.
- TypeScript source imports omit `.ts` and `.tsx` extensions.
- Export style matches file shape: direct exports for small leaf modules, grouped export blocks for compound modules.
- Multiline declarations are visually separated from adjacent single-line declarations when needed for scanning.
- Raw SVG/HTML quote churn was not introduced.
- Biome and TypeScript verification passed where relevant.
