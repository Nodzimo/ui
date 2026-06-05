## Source Layout

### Entrypoints

- `src/index.ts` is the root package entry and re-exports from `src/core`.
- `src/client.ts` is the client package entry. It must start with `'use client'` and re-export from `src/client/index`.
- `src/styles.css` is the global stylesheet source for the UI kit and builds to `dist/styles.css`.

### Documentation

- `AGENTS.md` is the root Agent Operating Charter entrypoint and table of contents. Detailed agent-operating chapters
  live under `docs/agent-operating-charter`.
- `docs/design-system-doctrine/README.md` is the GitHub-readable doctrine overview, and that directory's Markdown
  chapter files are the source-of-truth doctrine chapters. Storybook mirrors those chapters through MDX wrappers under
  `.storybook/showcase`; do not collapse the doctrine back into one giant Markdown file.

### Icons

- Raw icon SVG inputs live under `assets/icons`, grouped by source or category such as `lucide`, `brand`, or `custom`.
- Generated icon components live under `src/core/icons/generated`. Treat this directory as generator-owned output:
  delete and regenerate it instead of hand-editing component implementation details. Small IDE-only suppressions in
  generated barrels are an accepted workaround when WebStorm cannot understand generated re-export usage.
- Hand-authored special icons that need a custom React API, such as the two-color `NodzimoSymbolIcon`, belong outside
  `src/core/icons/generated` and should not keep their source SVG under `assets/icons`, because `build:icons` treats
  that
  folder as SVGR input.
- `src/core/icons/index.ts` is the hand-authored icon public surface inside core and should re-export generated icon
  groups intentionally.
- Storybook iconography pages are design-system showcase inventory, not colocated stories for individual icon
  components. Put icon set galleries and their typed display helpers under `.storybook/showcase`, import real icon
  surfaces from `#core/icons/*`, and keep generated/runtime icon code under `src/core/icons`.

For generation details, see [Icon Generation](icon-generation.md).

### Source Areas

- `src/lib` contains internal/shared library utilities. Keep utilities small, named clearly, and exported through local
  barrels when they are intended for cross-area source imports.
- `src/core` contains exports that are safe to import from React Server Components and ordinary modern React apps.
- `src/client` contains client-only exports such as interactive components and hooks.
- `src/client.ts` and the `src/client/` directory intentionally coexist. In `src/client.ts`, import the directory barrel
  explicitly as `./client/index` to avoid self-resolution back to `src/client.ts`.

For import path rules, see [Internal Package Imports](internal-package-imports.md).

### Components And Barrels

- Keep public exports flowing through barrels, but keep the public surface intentional.
- Component folders should own their implementation files, variants, local helpers, and stories. Example:
  `src/client/components/button/button.tsx`, `button-variants.ts`, `button.stories.tsx`, and `index.ts`.
- A component folder's `index.ts` is the local public surface for that component. Export only what other project code or
  consumers should intentionally depend on.
- Aggregate barrels such as `src/client/components/index.ts`, `src/client/index.ts`, and `src/core/index.ts` are for
  public package flow. Avoid using large aggregate barrels as the default internal dependency path when a concrete
  component entrypoint is clearer.
