## Code Style Conventions

### JSX Literal Props

- In hand-authored TSX source, prefer expression containers for string literal prop values, for example
  `data-slot={'button'}` or `size={'default'}`.
- Keep boolean shorthand when it is the clearest form. Do not rewrite `disabled` to `disabled={true}` only for shape
  consistency.
- Do not apply this rule to raw HTML, raw SVG, MDX, CSS, or generated files.

### Rest Naming

- When destructuring an object and collecting the remaining properties, name the remainder by role:
    - component props: `restProps`.
    - function or story args: `restArgs`.
    - route, query, or config params: `restParams`.
- Use `props`, `args`, or `params` only when the value is a whole input object, not a destructured remainder.

### Type And Interface

- Use `type` when TypeScript composition is the point: unions, intersections, utility types,
  `ComponentProps<...>`, `VariantProps<typeof ...>`, extracted callback signatures, and aliases derived from literal
  tables.
- Use `interface` when an object contract is intentionally open, extendable, declaration-merge-friendly, implemented by
  classes, or external-facing in a way where extension is part of the model.
- Do not convert between `type` and `interface` only for taste, sorting, or Storybook/docgen hope. If the best choice is
  not obvious, report the tradeoff instead of editing.

### File Extensions And Imports

- Use `.ts` for TypeScript source files without JSX, and `.tsx` for files that contain JSX. Do not keep `.tsx` only
  because the file lives in a React component folder.
- Do not manually rename generated files unless the generator contract is being updated.
- Omit explicit `.ts` and `.tsx` extensions from TypeScript source imports when the project resolver can resolve the
  module. Extensionless imports survive `.ts` / `.tsx` renames better.
- Keep extensions for non-TypeScript asset imports where the extension is the contract, such as CSS, raw Markdown, or
  query-suffixed imports.

### Export Style

- Use direct named exports for small leaf files with one primary runtime export and maybe its local type.
- Use a grouped export block at the end for compound or multipart files where several local declarations are
  intentionally public. This lets readers inspect implementation first, then review the public surface in one place.
- Do not churn export style where the current shape is already clear.
- When a helper has a short project-facing name, expose that name at the helper module boundary rather than aliasing it
  only from a distant barrel. For example, export `mergeClassNames as mcn` from the helper module, then let the local
  barrel re-export `mcn`.

### Literal Tables

- Use module-scope `UPPER_SNAKE_CASE` for intentional immutable tables, mappings, defaults, and finite option lists.
  Framework convention objects such as `meta`, `config`, and `preview`, plus render-scope values and computed local
  bindings, stay `camelCase`.
- Use `as const` for literal option arrays and mapping objects when downstream code derives unions from their values or
  keys.
- Use `satisfies readonly SomeType[]` when a literal option array should validate against an external finite union
  without widening its elements.
- Avoid stacking `as const`, `satisfies`, `Readonly`, `NonNullable`, and uppercase naming only to make a normal config
  fragment feel more immutable. Add that ceremony only when it preserves a useful literal union, validates an external
  finite contract, prevents real mutation risk, or makes the exported contract clearer.

### Text And Quote Boundaries

- JS, TS, and TSX use single quotes where possible.
- CSS may use single quotes where practical, but double quotes are acceptable when nested quotes make them clearer or
  when tool output requires them.
- Raw HTML and raw SVG may keep double-quoted attributes. Do not churn raw SVG assets only to satisfy JS quote taste.
- Markdown fenced code blocks should use a language tag only when the snippet is syntactically valid as that language on
  its own. Use `text` for partial JSX attributes, JSON fragments, placeholders, or intentionally invalid examples.
