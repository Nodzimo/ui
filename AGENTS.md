# Nodzimo UI Agent Notes

## Project Goal

- Build a modern React UI kit/library for current React and Next projects.
- Target package consumers and bundlers, not direct browser `<script>` usage.
- Keep configuration minimal and explicit. Every package field and build option should have a concrete reason.
- Prefer the smallest working modern setup over legacy fallbacks.

## Stack

- Package/runtime tooling: Bun.
- Build tool: Vite 8 library mode on Rolldown.
- Framework target: React 19.
- Language: TypeScript.
- Styling: Tailwind CSS 4.
- Formatter/linter/assist: Biome.
- React optimization: React Compiler via `@vitejs/plugin-react`, `@rolldown/plugin-babel`, and
  `babel-plugin-react-compiler`.
- Declaration generation: `unplugin-dts` with API Extractor declaration bundling.
- CSS generation: Tailwind CLI via `@tailwindcss/cli`.

## Collaboration

- Keep explanations concise, practical, and human-readable.
- When discussing architecture or config, explain what each setting is responsible for.
- Do not invent compatibility requirements. If a setting is a fallback or legacy convenience, say that clearly.
- Keep configs minimal: do not restate explicit defaults. A config option should appear only when it intentionally
  changes default behavior or documents a project decision.
- For questions, answer first and do not edit files unless asked.
- For implementation requests, keep changes scoped and verify with the smallest relevant command.
- For review and design feedback, be direct and rigorous: lead with concrete issues, explain the technical or UX reason
  behind each recommendation, challenge weak naming or architecture, and treat disagreement as a way to clarify the
  better solution rather than as a reason to soften the critique.
- Preserve project style: tabs, single quotes, no semicolons, named exports.
- Name things according to their lifespan and scope. Broad, exported, cross-file, or public-facing entities need precise
  descriptive names. Short-lived local helpers may stay simple and generic when their surrounding context makes their
  purpose obvious.

## Skills

- For pre-update dependency research from `bun outdated`, post-update changelog review, breaking-change triage, or
  deciding whether upgraded packages need local code/config/package metadata changes, use the project-local
  `dependency-update-reviewer` skill at `.codex/skills/dependency-update-reviewer`.
- For repeated token-prefix adaptation and review work, use the project-local `theme-token-adapter` skill at
  `.codex/skills/theme-token-adapter`.
- For writing, reviewing, or updating component stories, use the project-local `storybook-story-writer` skill at
  `.codex/skills/storybook-story-writer`.
- For changes that affect `src/core`, `src/client`, public entrypoints, Vite externals, package dependency metadata,
  build output, or Next/RSC consumer compatibility, use the project-local `rsc-package-boundary-reviewer` skill at
  `.codex/skills/rsc-package-boundary-reviewer`.

## Biome Policy

- Keep `biome.json` compact and explicit. Prefer Biome defaults unless the project intentionally needs a different
  behavior.
- Do not add explicit defaults such as `formatter.enabled`, `linter.enabled`, `assist.enabled`, or
  `linter.rules.recommended` just for completeness.
- Keep VCS integration enabled with Git ignore support. The project relies on `.gitignore` to keep generated and
  service files such as `dist`, `node_modules`, `.idea`, and package archives out of Biome checks.
- Keep the React lint domain enabled because this is a React UI kit. Do not add the Next domain here; Next-specific
  rules belong in Next applications.
- Keep JavaScript formatter preferences explicit: single quotes, no unnecessary semicolons, single JSX quotes, and
  as-needed arrow parentheses.
- Keep the HTML formatter enabled only because Storybook head snippets are real project files. Biome's HTML formatter is
  experimental and does not currently expose an HTML attribute quote-style option, so double-quoted HTML attributes are
  acceptable even though JavaScript and JSX use single quotes.
- Keep JSON comments disabled. Project JSON files should be strict JSON, not JSONC.
- Do not add `files.includes` globs that duplicate `.gitignore` unless Biome needs a narrower project-specific scope.
- Do not enable global `assist/source/useSortedKeys`; it sorts whole JSON objects such as `package.json`, `scripts`,
  `exports`, and tsconfig sections into an unreadable order.
- Biome does not format Markdown in this setup. Format Markdown files manually or with the editor.

## Repository Text Format

- Keep `.gitattributes` in place to normalize text files to LF across platforms.
- Keep `.bat` and `.cmd` files as CRLF through `.gitattributes`.

## WebStorm Project Settings

- The project intentionally shares selected WebStorm settings under `.idea`: dictionaries, inspection profiles, and
  scopes. Keep `.idea` sharing narrow and do not commit workspace state, shelves, local run history, or user-specific
  IDE files.
- Use shared inspection scopes for repeatable WebStorm false positives in generated, tooling, or convention files.
  Prefer disabling a specific inspection for a narrow scope over adding `// noinspection` comments to source files or
  disabling an inspection globally.
- When extending WebStorm inspection exclusions, add the affected files to `.idea/scopes` and adjust the project profile
  in `.idea/inspectionProfiles`. Keep the scope name and profile entry descriptive enough that another developer can see
  which IDE warning is being silenced and where.
- Keep the `Library Stylesheet Contracts` scope for `src/styles.css` with WebStorm's `CssUnusedSymbol` inspection
  disabled. Public stylesheet hooks such as `.dark`, `.nui-surface`, and foundation classes are consumer-facing
  contracts and do not need local source references to be valid.

## Public Package Shape

- The public npm package name is `@sefo/nodzimo-ui`.
- The package is published publicly under the personal `@sefo` npm scope. Keep this as the package namespace unless the
  project intentionally moves to a different package name with a migration plan.
- The package is ESM-only.
- Do not add CJS, UMD, or IIFE outputs unless a real consumer requires them.
- The public API is split into two entrypoints:
    - `@sefo/nodzimo-ui` for core/RSC-safe exports.
    - `@sefo/nodzimo-ui/client` for client-boundary exports.
- Consumers should import from public package entrypoints, not from `src` or deep internal paths.
- `files: ["dist"]` keeps packed/published contents limited to build output.
- The package export map is intentionally minimal:
    - `exports["."].import` points to `dist/nodzimo-ui.js`.
    - `exports["."].types` points to `dist/nodzimo-ui.d.ts`.
    - `exports["./client"].import` points to `dist/client.js`.
    - `exports["./client"].types` points to `dist/client.d.ts`.
    - `exports["./styles.css"]` points to `dist/styles.css`.
- Public declaration files are bundled per public entrypoint. Keep `dist/nodzimo-ui.d.ts` for the root/RSC-safe entry
  and `dist/client.d.ts` for the client-boundary entry. Do not publish a mirrored `dist/src` declaration tree unless a
  real tooling need appears.
- Consumers should import the library stylesheet once at the app root, for example
  `import '@sefo/nodzimo-ui/styles.css'`.
- Vite/Rolldown may emit private shared chunks used by the public entrypoints. Keep those chunks inside `dist/internal`
  with a pattern such as `internal/[name]-[hash].js`; do not add them to `exports` or treat them as public entrypoints.
- Private chunks in `dist/internal` are still required package files because `dist/nodzimo-ui.js` and `dist/client.js`
  may import them through relative ESM imports.
- Avoid adding declaration files under `dist/internal` as part of the public type contract. Shared type shapes may be
  duplicated across bundled entrypoint declarations; that is preferable to exposing internal type topology.
- Avoid adding `main`, `module`, or `default` fallbacks unless a confirmed consumer needs them.
- The package license is MIT. Keep a permissive open-source license unless the project direction explicitly changes.
- Keep `publishConfig.access` set to `public` so scoped publishes do not require passing `--access public` manually.
- Do not set `publishConfig.registry` unless publishing to a non-default registry is intentional.

## Source Layout

- `src/index.ts` is the root package entry and re-exports from `src/core`.
- `src/client.ts` is the client package entry. It must start with `'use client'` and re-export from `src/client/index`.
- `src/styles.css` is the global stylesheet source for the UI kit and builds to `dist/styles.css`.
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
- `src/lib` contains internal/shared library utilities. Keep utilities small, named clearly, and exported through local
  barrels when they are intended for cross-area source imports.
- `src/core` contains exports that are safe to import from React Server Components and ordinary modern React apps.
- `src/client` contains client-only exports such as interactive components and hooks.
- `src/client.ts` and the `src/client/` directory intentionally coexist. In `src/client.ts`, import the directory barrel
  explicitly as `./client/index` to avoid self-resolution back to `src/client.ts`.
- Keep public exports flowing through barrels, but keep the public surface intentional.
- Component folders should own their implementation files, variants, local helpers, and stories. Example:
  `src/client/components/button/button.tsx`, `button-variants.ts`, `button.stories.tsx`, and `index.ts`.
- A component folder's `index.ts` is the local public surface for that component. Export only what other project code or
  consumers should intentionally depend on.
- Aggregate barrels such as `src/client/components/index.ts`, `src/client/index.ts`, and `src/core/index.ts` are for
  public package flow. Avoid using large aggregate barrels as the default internal dependency path when a concrete
  component entrypoint is clearer.

## Internal Package Imports

- Use `package.json#imports` for internal source imports, not Vite-only `@/*` aliases.
- Keep the internal import map aligned with the barrel architecture:
    - `#lib` -> `src/lib/index.ts`
    - `#lib/*` -> `src/lib/*/index.ts`
    - `#core` -> `src/core/index.ts`
    - `#core/*` -> `src/core/*/index.ts`
    - `#client` -> `src/client/index.ts`
    - `#client/*` -> `src/client/*/index.ts`
- Use `#lib` for shared utilities such as the class-name merge helper.
- Use `#client` and `#core` when a story or internal integration should validate the public internal barrel.
- Use specific imports such as `#client/components/button` for focused component work.
- Use `#core/icons` when core components need generated project-owned icons from another core area. Avoid importing
  icons through `#core`, because the aggregate barrel can create dependency cycles.
- Inside one component folder, prefer relative imports such as `./button-variants`; do not route local implementation
  details through `#client` or `#core`.
- Colocated stories and tests that sit beside a component folder `index.ts` may import the component through the local
  folder surface with `import { Button } from '.'`. This validates the component's local public API, avoids importing
  implementation files directly, and prevents IDE "import can be shortened" noise without suppressions.
- Do not import from the public package name (`@sefo/nodzimo-ui`) inside this package's source. Public package imports
  are
  for consumers.

## Core Vs Client

- `core` does not mean server-only. It means no client boundary is required and the root entry must stay safe for
  React Server Component import graphs.
- Treat `@sefo/nodzimo-ui` as the RSC-safe entrypoint. It should be more restrictive than "works during SSR".
- React Server Components (RSC) use React's `react-server` condition. In that graph, React deliberately does not expose
  APIs such as `createContext` or `useContext`; top-level code that calls those APIs can fail before a component is
  even rendered.
- Server-side rendering (SSR) is different from RSC. SSR runs server code with the ordinary React server renderer, where
  APIs such as `createContext`, `forwardRef`, `createElement`, and `useContext` can exist. A component can be SSR-safe
  and still not be RSC-pure.
- `'use client'` marks a client boundary for Next/React. Server Components may render Client Components, and Next can
  keep the route SSG when no dynamic request-time APIs or uncached runtime data are used.
- Static Site Generation (SSG) means the route can be computed at build time. SSG is not proof that a dependency is
  RSC-pure; it only proves the route did not require dynamic runtime rendering in that build.
- `core` code must not depend on browser-only APIs, React state/effect hooks, event-driven behavior, React Compiler
  runtime, or third-party modules that execute RSC-incompatible React APIs at module top level.
- `client` code may use state, effects, refs, browser APIs, interactive behavior, and React Compiler.
- A Server Component may render a Client Component. That does not automatically make a Next route dynamic;
  static/dynamic rendering depends on Next dynamic APIs and data access, not merely on client components.
- Icons and small SVG primitives in `core` should prefer inline SVG or project-owned RSC-safe wrappers when the icon is
  part of a fundamental core component such as `Spinner`.
- Third-party React component libraries that use context, providers, hooks, or `"use client"` belong in `src/client`
  unless their RSC behavior has been inspected in the built package and verified in the Next consumer.

## RSC Boundary Incident: Lucide Spinner

- Incident summary: `Spinner` in `src/core` imported `Loader2Icon` from `lucide-react`. Before `lucide-react` was marked
  external in Vite/Rolldown, the library build inlined Lucide's implementation into `dist/nodzimo-ui.js`.
- The inlined Lucide code included top-level React context setup, including `createContext`, plus icon helpers such as
  `forwardRef`, `createElement`, and `useContext`.
- The Next consumer imported only `Card` from `@sefo/nodzimo-ui`, but the root barrel also exported `Spinner`. Because
  Lucide had been inlined into the same root entry, the RSC graph evaluated code that called `createContext` under
  React's `react-server` condition and the consumer build failed with `TypeError: createContext is not a function`.
- Do not treat shadcn-style app-source examples as proof that the same import is safe after this package prebuilds a
  public entrypoint. Next can inspect client boundaries in an app source graph, while Vite/Rolldown can erase that
  boundary by copying dependency internals into `dist/nodzimo-ui.js`.
- The old workaround was to keep `lucide-react` external in Vite/Rolldown, which kept an external `lucide-react` import
  in the root entry instead of copying Lucide internals into `dist/nodzimo-ui.js`.
- The long-term fix is now preferred: `Spinner` uses a generated project-owned SVG icon from `#core/icons`, so the root
  entry no longer imports `lucide-react` at runtime.
- Keep `lucide-react` in `devDependencies` while it is used only by stories or development examples. Do not add it back
  to `dependencies` or Vite externals unless publishable runtime code imports it again.
- `lucide-react` remains acceptable in stories and demos because Storybook files are excluded from the published
  entrypoints.

## React Compiler Boundary

- React Compiler must not process `src/core`.
- React Compiler is scoped to:
    - `src/client.ts`
    - everything under `src/client/`
- This is configured with `clientCompilerIncludes` in `vite.config.ts`.
- The expected build output:
    - `dist/nodzimo-ui.js` imports `react/jsx-runtime` and must not import `react/compiler-runtime`.
    - `dist/client.js` starts with `"use client";` and may import `react/compiler-runtime`.
- If `react/compiler-runtime` appears in `dist/nodzimo-ui.js`, the root entry is no longer RSC-safe.
- If `"use client";` disappears from `dist/client.js`, Next will not see the client boundary.

## Dependency Concepts

- `exports` defines the package public entrypoints and the files consumers are allowed to import.
- `external` in Vite/Rolldown keeps dependencies such as React out of the bundled library output. It does not remove the
  dependency from runtime; it leaves an import in `dist` for the consumer's bundler/package manager to resolve.
- `external` is a bundler contract. `dependencies` and `peerDependencies` are package-manager contracts.
- Runtime dependencies listed in `dependencies` are installed automatically when a consumer installs this package. If a
  compatible copy already exists in the consumer dependency tree, the package manager may dedupe it; if not, it may
  install a nested copy.
- Runtime dependencies listed in `peerDependencies` are required from the consumer. React and React DOM must be peers so
  the consumer app owns the React instance.
- `peerDependencies` declare dependencies that must be provided by the consuming app. React and React DOM are peer
  dependencies for consumers and dev dependencies for local library development.
- Keep React peer ranges intentionally scoped to React 19 with `19.x` until compatibility with later React majors is
  confirmed.
- This project intentionally tracks current bleeding-edge tooling. Keep `engines.node` as `25.x` and `engines.bun` as
  `1.3.x` unless the project deliberately moves to a new line. Use exact versions in dev dependencies and lockfiles for
  reproducible local installs; use `x` ranges for public engine/peer lines when the supported contract is the current
  major or minor line.
- Runtime implementation dependencies used by built components belong in `dependencies`, not `devDependencies`. This
  currently includes `@base-ui/react`, `class-variance-authority`, `clsx`, and `tailwind-merge`.
- Do not make implementation helpers such as `clsx`, `tailwind-merge`, or `class-variance-authority` peer dependencies
  unless they become an intentional consumer-facing contract.
- Do not move a runtime import from `dependencies` to `devDependencies` merely because it is externalized. Externalized
  runtime imports still need to be installable by consumers.
- Packages used only in Storybook stories, examples, tests, or docs belong in `devDependencies`.
- `'use client'` is a Next/React client boundary. It must be present on the built public client entry that consumers
  import.
- Multiple entrypoints separate the RSC-safe API from the client API.
- React Compiler scope controls which source files get compiler runtime output.

## Dependency Graph Checks

- Dependency graph checks use `dependency-cruiser`; do not replace these deterministic checks with an agent skill.
- `check:deps` cruises `src` and is the regular import/dependency graph check.
- `check:deps-graph` generates `dependency-graph.svg` for manual inspection and requires Graphviz `dot` to be
  installed and available on `PATH`.
- The dependency-cruiser config is intentionally project-specific. Keep rules focused on real architectural constraints
  and avoid broad suppressions.
- Colocated `.stories.*` files under `src` are development-only Storybook files. Keep them excluded from the
  `not-to-dev-dep` production rule so imports such as `storybook/test` can remain in `devDependencies`.
- React and React DOM are expected peer dependencies for this UI library. Imports from React in library source are not a
  dependency violation; consumers provide React at runtime, while the project keeps React in dev dependencies for local
  development.

## Tailwind And Styles

- Tailwind is used as build-time styling tooling for the library, not as a runtime dependency for consumers.
- Keep `tailwindcss` and `@tailwindcss/cli` in `devDependencies`; consumers receive built CSS from `dist/styles.css`.
- Do not rely on consumer Tailwind scanning to style library components. A Next consumer may appear to pick up some
  utility classes from the package, but that is incidental and not the package contract.
- Do not import `src/styles.css` from `src/index.ts` or `src/client.ts` just to pull CSS into the JS graph. The library
  has separate core and client JS entrypoints, and global styles should remain an explicit stylesheet import.
- Do not add a CSS entry to Vite library entries for the current setup. CSS is generated directly with Tailwind CLI:
  `src/styles.css -> dist/styles.css`.
- Do not treat `@tailwindcss/vite`, if present, as the production CSS artifact pipeline; the publishable stylesheet is
  still generated by `build:css`.
- `build:css` should use `--minify` for the publishable CSS artifact. Use the CSS watch script for iterative rebuilds.
- `src/styles.css` should exclude Storybook story files from Tailwind v4 source detection with
  `@source not "./**/*.stories.*";` so story-only preview classes do not inflate `dist/styles.css`.
- Do not restore Storybook's generated `src/stories` onboarding folder. The colocated story-file exclusion is the
  intended long-term source filter.
- Vite cleans `dist` during `vite build`, so full builds must run JS/type build first and CSS build afterward.
- Design direction: components should be styled and usable by default, but themeable through CSS variables/tokens rather
  than hard-coded project-specific colors long term.

## Theme Token Contract

- Use the shadcn theme architecture as the baseline model, adapted for a publishable library.
- All library-owned semantic tokens must use the `nui` namespace. Raw variables use `--nui-*`, Tailwind color mappings
  use `--color-nui-*`, radius mappings use `--radius-nui-*`, and spacing mappings use `--spacing-nui-*`.
- Components must use NUI-prefixed semantic utilities such as `bg-nui-primary`, `text-nui-foreground`,
  `border-nui-border`, `ring-nui-ring`, and `rounded-nui-lg`.
- Do not introduce unprefixed shadcn app-level tokens such as `--primary`, `bg-primary`, `border-border`, `ring-ring`,
  `bg-background`, or `text-foreground` in library source.
- Preserve normal Tailwind structural utilities such as `flex`, `inline-flex`, `items-center`, `gap-2`, `px-2.5`,
  `text-sm`, `size-8`, `transition-all`, and `disabled:opacity-50`; prefix only theme-facing design-system utilities.
- Keep `@custom-variant dark (&:is(.dark *));` because components may use Tailwind `dark:` variants.
- Dark mode overrides should redefine the same `--nui-*` raw variables under `.dark`; do not create separate
  `*-dark` token names.
- The library's broad foundation styles are opt-in utility classes, not global `body` or global `*` selectors:
    - `.nui-boundaries *` applies `border-nui-border` and `outline-nui-ring/50` to descendant element boundaries.
    - `.nui-surface` applies `bg-nui-background` and `text-nui-foreground` to the element it is placed on.
    - `.nui-interactive` restores pointer cursors for enabled `button` and `[role="button"]` descendants.
- Consumers that want the full NUI foundation can add all three classes at the app root. Consumers can also apply only
  the specific foundation utilities they want, or scope them to a subtree.
- Use `src/styles.css` as the source of truth for available theme tokens before adapting a copied component.
- Theme token meanings follow the shadcn semantic token convention:
    - `background` / `foreground`: default app background and text, page shell, sections, and default text.
    - `card` / `card-foreground`: elevated surfaces such as cards, dashboard panels, and settings panels.
    - `popover` / `popover-foreground`: floating surfaces such as popovers, dropdown menus, context menus, and overlays.
    - `primary` / `primary-foreground`: high-emphasis actions and brand surfaces such as default buttons, selected
      states, badges, and active accents.
    - `secondary` / `secondary-foreground`: lower-emphasis filled actions and supporting surfaces.
    - `muted` / `muted-foreground`: subtle surfaces and lower-emphasis content such as descriptions, placeholders, empty
      states, helper text, and subdued surfaces.
    - `accent` / `accent-foreground`: interactive hover, focus, active, selected, and highlighted surfaces such as ghost
      buttons, menu highlights, hovered rows, and selected items.
    - `destructive`: destructive actions and error emphasis such as destructive buttons, invalid states, and destructive
      menu items.
    - `border`: default borders, separators, table dividers, card borders, menus, and layout dividers.
    - `input`: form-control borders and input surface treatment for input, textarea, select, and outline-style controls.
    - `ring`: focus rings and outlines for buttons, inputs, checkboxes, menus, and focusable controls.
    - `chart-1` through `chart-5`: default chart palette.
    - `sidebar` tokens: sidebar-specific surfaces, foregrounds, active/high-emphasis items, hover/selected states,
      borders, and rings.
    - `radius`: the base corner-radius scale for cards, inputs, buttons, popovers, and derived `radius-nui-*` tokens.
- The radius scale follows shadcn's model: `radius-nui-lg` is the base value from `--nui-radius`, smaller radii scale
  down from it, larger radii scale up from it, and changing `--nui-radius` updates the whole radius scale.
- The spacing scale is the NUI rhythm layer over Tailwind spacing. Use `--spacing()` in source, not handwritten
  `calc(var(--spacing) * n)`, because `--spacing()` is Tailwind's native source function and compiles to the calc form.
- Current NUI spacing tokens are `spacing-nui-2xs` through `spacing-nui-2xl`, mapped to Tailwind spacing values
  `0.5`, `1`, `2`, `4`, `6`, `8`, and `12` respectively. Comments in `src/styles.css` should document their current
  pixel values.
- Use NUI spacing utilities for reusable design-system rhythm such as standard gaps between sections, headings, cards,
  and repeated UI groups. Do not replace incidental component tuning such as `px-2.5`, `gap-1.5`, `size-8`, or
  one-off layout nudges unless the spacing is intentionally part of the shared rhythm contract.

## Design System Doctrine

- Read `docs/design-system-doctrine.md` before changing theme colors, button variants, interactive-state styling, or the
  meaning of theme tokens. It records the current Nodzimo design direction and the reasoning behind it.
- Preserve the shadcn-style semantic token architecture. Do not add one-off state tokens such as `primaryTextHover`,
  `primaryLinkActive`, or `primaryBackgroundPressed` unless the existing semantic roles have clearly failed across
  multiple components.
- Treat light and dark themes as two intentional expressions of the same brand, not as a technical inversion:
    - Light theme: `Living Emerald`, internally nicknamed `Liverald`, with natural, confident, trustworthy,
      growth-oriented emerald energy.
    - Dark theme: `Night Emerald`, internally nicknamed `Nimerald`, with neon emerald, Tokyo-night, electric,
      technical, youthfully sharp energy.
- Neutral base colors also follow this split: use an Olive-derived neutral base for light theme and a Stone-derived
  neutral base for dark theme. Olive supports the organic light direction; Stone avoids the heavy/military feel olive
  can take on in dark mode.
- Do not timidly torture one color until it barely works in both themes. Keep the green brand DNA, but allow each theme
  to express it differently when that produces a stronger and more readable system.
- Respect the shadcn semantic structure, but do not inherit shadcn blandness as a design goal. shadcn is a conservative
  white-label baseline that is hard to ruin; Nodzimo should keep its architecture while adding deliberate character and
  clearer active/passive/disabled distinction.
- Current primary direction:
    - Light primary: `Living Emerald`, internally nicknamed `Liverald`, `oklch(0.55 0.19 151)` with light foreground.
    - Dark primary: `Night Emerald`, internally nicknamed `Nimerald`, `oklch(0.82 0.26 145)` with dark
      foreground.
- Use the paired brand line: `Living Emerald` is the brand in daylight; `Night Emerald` is the brand after dark. Design
  mantra: "In the day, it feels alive. At night, it glows."
- Use the NUI intensity rhythm as a naming/review convention for recurring color and opacity modifiers:
    - `subtle = 20`, written as Tailwind slash opacity such as `bg-nui-destructive/20`.
    - `half = 50`, written as slash opacity such as `hover:bg-nui-input/50`.
    - `strong = 80`, written as slash opacity such as `hover:bg-nui-primary/80`.
- Intensity rhythm names describe strength, not events. Do not introduce `hover`, `active`, or `pressed` tokens when a
  semantic color plus `/20`, `/50`, or `/80` expresses the treatment. Do not create CSS variables for these values
  unless
  Tailwind gains a clean named opacity API or repeated real usage proves a better implementation.
- Button variants are semantic hierarchy, not random visual costumes:
    - `primary`: brand speaks loudly; main action.
    - `secondary`: brand speaks quietly; lower-emphasis filled action.
    - `outline`: structural action; ordinary text, visible system border, subtle branded hover.
    - `ghost`: quiet dense-UI action; ordinary text at rest, subtle hover surface.
    - `link`: branded text signal; underlined by default.
    - `destructive`: dangerous action; danger overrides brand.
- Text links should be underlined in their resting state. Preferred inline-link pattern: foreground text with a
  primary-colored underline at rest, then primary text plus primary underline on hover. Do not rely on color alone to
  communicate that text is a hyperlink.
- Do not make default `outline` or `ghost` primary-colored text just to make them look branded. Let them carry Nodzimo
  through border tone, hover tint, focus ring, spacing, radius, and context.
- Keep `ghost` hover softer than `secondary` rest. If ghost hover becomes visually identical to secondary, the action
  hierarchy is too compressed.
- Nodzimo UI supports RTL consumers. For directional inline-axis layout, use logical Tailwind utilities such as `ps-*`,
  `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `border-s-*`, and `border-e-*` instead of physical `pl-*`, `pr-*`,
  `ml-*`, `mr-*`, `left-*`, `right-*`, `border-l-*`, or `border-r-*`. Symmetric utilities such as `px-*`, `mx-*`,
  `inset-x-*`, and `border-x-*` are fine.

## Component Styling

- Base interactive primitives are built on `@base-ui/react` where appropriate.
- Use `class-variance-authority` for component variant class composition when a component has meaningful variants or
  sizes.
- Use the internal class-name merge helper from `#lib` for combining generated variant classes with caller `className`.
  The helper implementation is intentionally descriptive (`mergeClassNames`) and may be re-exported as a short internal
  alias such as `mcn`.
- When porting components from shadcn, Radix examples, or other Tailwind sources, preserve behavior and structure but
  adapt theme-facing classes to the NUI token namespace.
- Use the repo skill `.codex/skills/theme-token-adapter` for repeated token-prefix adaptation and review work.

## Icon Generation

- Generate project-owned icon components with SVGR CLI. SVGR is a dev-only generator here, not a runtime dependency and
  not a Vite plugin.
- Keep `svgr.config.cjs` compact. Do not add explicit SVGR defaults; keep only options that change this project's
  output, such as `outDir`, `filenameCase`, `jsxRuntime`, `icon`, `typescript`, `prettier`, and decorative
  `aria-hidden` SVG props.
- `bun run build:icons` reads raw SVG files from `assets/icons`, writes generated TSX under
  `src/core/icons/generated`, and then runs the project's Biome fix flow so generated output follows local formatting.
- Raw Lucide SVG files should be downloaded as SVG source only. Remove source `class` attributes such as `lucide` before
  generation; they are HTML/CSS hooks for raw SVG usage and become noisy generated `className` values.
- Preserve raw SVG `viewBox`, `stroke='currentColor'`, and `fill='none'` for Lucide outline icons. `icon: true` changes
  generated `width` and `height` to `1em`, while `viewBox` keeps scaling correct.
- Do not create separate filled variants when the same outline SVG can be filled by the consumer. For fillable icons
  such as hearts or stars, keep the outline source and let usage pass `fill='currentColor'` and, when needed,
  `strokeWidth={0}` or equivalent classes.
- Keep brand or multicolor SVG colors intact when those colors are part of the asset. Use `currentColor` for themeable
  monochrome icons.
- For custom symbols that need independent color control per shape, keep a hand-authored component with separate SVG
  paths and explicit props. Do not rely on SVGR/SVGO to preserve same-colored sibling paths; optimization may merge
  them.
- Generated icon components belong in `src/core` and are RSC-safe only when they remain plain SVG components: no hooks,
  no `'use client'`, no `memo`, no `forwardRef`, and no runtime icon package imports.
- Public icon names should use the `SomethingIcon` suffix, such as `HeartIcon` or `GithubIcon`. Keep source grouping in
  folders, not in public component names.

## Vite Build Notes

- Library mode uses two entries:
    - `nodzimo-ui: 'src/index'`
    - `client: 'src/client'`
- Only `formats: ['es']` is needed for the modern target.
- The package intentionally targets the latest JavaScript surface: TypeScript app and Node configs use `target`, `lib`,
  and `module` set to `ESNext`, and Vite uses `build.target: 'esnext'` to keep library output modern with minimal
  transpilation. Keep this modern-only contract unless a real consumer needs a lower target.
- Keep these externals:
    - `react`
    - `react-dom`
    - `react/jsx-runtime`
    - `react/compiler-runtime`
- `react/compiler-runtime` is required because client output compiled by React Compiler imports it.
- Adding a package to externals is not enough by itself. If built runtime code still imports that package, keep it in
  `dependencies` or `peerDependencies` according to the package contract.
- Before adding any third-party React package to `src/core`, inspect whether it calls `createContext`, hooks, providers,
  browser APIs, or `"use client"` at module top level. Prefer `src/client` or a local RSC-safe wrapper if it does.
- `unplugin-dts` must use `tsconfigPath: 'tsconfig.app.json'`; the root `tsconfig.json` only contains project references
  from the Vite template.
- `unplugin-dts` should exclude Storybook story files from public declarations, for example
  `exclude: ['**/*.stories.*']`.
- `unplugin-dts` should keep `bundleTypes: true` so API Extractor emits declaration rollups for the public package
  entrypoints instead of a `dist/src` tree.
- Keep `@microsoft/api-extractor` in `devDependencies`; it is build-time tooling for bundled declarations, not a
  runtime or peer dependency.
- API Extractor may warn when its bundled TypeScript compiler is older than this project's TypeScript version. Treat
  that as a tooling-version warning, not a package blocker, when declaration output is correct and the latest API
  Extractor still bundles the older compiler.
- Keep Storybook/Vitest test configuration out of `vite.config.ts`. Use `vite.config.ts` for the publishable library
  build and a separate `vitest.config.ts` for Storybook browser tests.
- In `vite.config.ts`, import `defineConfig` from `vite`. In `vitest.config.ts`, import Vitest test config helpers from
  `vitest/config`.
- If Vitest and root Vite resolve to different installed Vite copies after dependency updates, Vite config typings may
  stop accepting the `test` key. Separating `vitest.config.ts` from `vite.config.ts` avoids that coupling for the
  library build config.
- Keep non-entry build chunks visually private by setting Vite/Rolldown output names to
  `chunkFileNames: 'internal/[name]-[hash].js'`. Use `.js` explicitly; `[format]` produces format labels such as `es`
  instead of the expected JavaScript extension.

## Storybook

- Storybook is used for component documentation, visual review, and optional testing. It is not part of the library's
  published JS entrypoints.
- Keep `.storybook/main.ts` focused on maintained project addons. Do not add `@storybook/addon-onboarding` or restore
  generated onboarding demo files; component docs should be real colocated stories or intentional project MDX.
- Keep Storybook's manager branding on supported APIs: `storybook/theming` for title/link/theme and
  `.storybook/manager-head.html` for head tags such as favicon. Avoid CSS or DOM hacks against Storybook's internal
  sidebar markup for simple branding.
- Keep `.storybook/manager-head.html` as plain HTML. SEO metadata such as `<meta name="description" ...>` is valid
  there, but React-only attributes such as `key` are not useful in this static head snippet and should be omitted.
- Static Storybook-only assets live under `assets/storybook` and are exposed with
  `staticDirs: ['../assets/storybook']`. This copies the directory contents to the root of `storybook-static`, so
  favicon links should use a relative path such as `href="nodzimo-symbol-icon.svg"` for subpath-friendly deploys.
- Storybook uses `@storybook/react-vite`, but it should not inherit the root `vite.config.ts`. The root Vite config is
  for the publishable library build and includes library mode, declaration bundling, externals, and React Compiler
  boundaries. Storybook should point its framework builder options at `.storybook/vite.config.ts` instead.
- Keep `.storybook/vite.config.ts` minimal and Storybook-specific. It should include the Tailwind Vite plugin so
  `src/styles.css` compiles in the preview, but should not include `unplugin-dts`, `build.lib`, package externals, or
  declaration bundling.
- Storybook builder may ignore most `build` options loaded from `viteConfigPath`. Use `.storybook/main.ts` `viteFinal`
  for final Storybook-only Vite overrides such as `build.chunkSizeWarningLimit`.
- Use `storybook build` for the public Storybook static site. Keep `storybook build --test` only as an optional testing
  or diagnostics build; do not use it for the deployed docs site unless the project intentionally accepts its
  test-optimized output.
- Import the library stylesheet in `.storybook/preview.tsx` with `import '../src/styles.css'` so stories render with the
  same CSS contract consumers receive.
- Use `@storybook/addon-themes` with `withThemeByClassName` in `.storybook/preview.tsx` for the component-preview theme
  toggle. The light option should apply no extra class, and the dark option should apply `dark`, matching the
  `@custom-variant dark (&:is(.dark *))` contract in `src/styles.css`.
- Use a global decorator in `.storybook/preview.tsx` to wrap all stories in the preview foundation classes
  `nui-surface nui-boundaries nui-interactive`. `nui-surface` is required here so the wrapper itself receives
  `bg-nui-background text-nui-foreground` after the addon toggles `.dark`; otherwise transparent stories can show dark
  tokens on a light Storybook canvas or vice versa.
- Keep the global Storybook preview `wrapperBackground` arg as a preview-only design aid. It should live under the
  `Story canvas` controls category, use the display name `Wrapper background`, default to `transparent`, and apply only
  to the decorator wrapper. Filter it out before rendering the story so it never leaks into component props or DOM.
- Treat `wrapperBackground` as an honest wrapper background, not a full Storybook canvas background. Do not rename it to
  `Canvas background` unless the implementation really controls the whole Storybook canvas. Keep the default arg value
  explicit so Storybook exposes a useful control; do not over-engineer the arg extraction with heavy generic typing
  unless Storybook's own types make it straightforward.
- Storybook manager UI theming is separate from component preview theming. Use `storybook/theming` and
  `.storybook/manager.ts` `addons.setConfig({ theme })` for manager branding. `create({ base })` only accepts
  `'light' | 'dark'`; use `getPreferredColorScheme()` when the branded manager theme should follow the user's system
  preference at load time. Use `parameters.docs.theme = themes.normal` in `.storybook/preview.tsx` so Storybook Docs
  also follow the preferred color scheme. This is not a live manager-theme toggle.
- Storybook's official backgrounds addon supports preset backgrounds, not a free global color picker. Avoid adding
  stale third-party background/color-picker addons only for this feature; many are not maintained for current Storybook
  versions. If a real full-canvas color picker is needed later, prefer a small project-owned Storybook toolbar/global
  addon over layout hacks, `document.body` effects, or unsupported addons.
- Use `storybook-addon-pseudo-states` for fixed CSS pseudo-class previews such as `hover` and `active`. Real component
  states such as `disabled`, `checked`, `selected`, `open`, or `loading` should stay real args/props, not pseudo-state
  addon configuration.
- Put shared pseudo-state defaults in `meta.parameters.pseudo` when every story in the file follows the same preview
  convention. Use story-level `parameters.pseudo` only for stories that need different pseudo-state targets.
- When targeting one element for a pseudo state inside a story canvas, prefer story-only `data-*` selectors such as
  `[data-preview="hover"]` over `id` selectors. Storybook Docs can render several canvases on one page, so repeated IDs
  are fragile and invalid HTML.
- Inline simple single-use pseudo-state selectors directly in `parameters.pseudo`. Extract selector constants only when
  they are reused or need a meaningful shared name.
- Add explicit baseline `meta.args` for native or passthrough props when that makes Storybook Controls expose the prop
  correctly, for example `disabled: false`. CVA-derived variant unions still need explicit `argTypes.options` arrays
  because those unions are not available as runtime values.
- Keep `tags: ['autodocs']` in the global Storybook preview unless the project intentionally changes its documentation
  strategy.
- Keep Storybook TypeScript context separate from the library source TypeScript context. A `.storybook/tsconfig.json`
  may extend the app tsconfig so Storybook config files understand Vite CSS imports without adding `.storybook` to the
  library `tsconfig.app.json` include list. Include both `./*.ts` and `./*.tsx` so `main.ts` and JSX-bearing preview
  files are checked together.
- Storybook Vitest/browser testing config belongs in `vitest.config.ts`, merged with the base Vite config when needed.
  The Storybook test plugin may launch Storybook with a command such as `bun storybook -- --no-open`; this launches the
  Storybook dev server for the test run, it is not a separate user-facing test script by itself.
- Do not add `setupFiles` for Storybook/Vitest unless the referenced setup file actually exists and contains real
  project setup such as mocks or custom matchers. Storybook preview annotations are handled by the addon path.
- On Windows/local browser testing, keep Vitest browser API host explicit as `127.0.0.1` if `localhost` causes
  Playwright `ERR_CONNECTION_REFUSED` against the internal Vitest browser URL.
- Playwright browser binaries are installed outside the repo in the user cache. If browser tests ask for browsers after
  dependency updates, run `bunx playwright install chromium` from the project terminal.
- A `vitest.init()` deprecation warning seen while running Storybook visual/interaction tests can come from
  `@storybook/addon-vitest` internals. Do not rewrite local config only for that warning unless Storybook documents a
  migration that applies to this project.
- Prefer colocated stories beside real components, for example `src/client/components/button/button.stories.tsx`.
- In colocated stories, prefer importing the component from the local folder surface with `import { Button } from '.'`
  when `index.ts` exports the component. Implementation files inside the same folder should still use direct relative
  imports for local details such as `./button-variants`.
- Use kebab-case filenames for stories when that matches the component folder style; the important Storybook convention
  is the `.stories` segment, not PascalCase.
- Do not write stories for the sake of exhausting every prop permutation. A story should answer a meaningful interface
  question: what role, intent, state, or usage pattern does this component have?
- Before writing stories, classify the component's owned surface area: semantic variants, sizes, states, interaction
  modes, and official composition patterns. If differences are only possible through arbitrary `className`, native DOM
  props, or wrapper layout, they are not story-worthy by themselves.
- Keep a story budget. Components with one behavior and no owned variants may need only `Default`; add at most one usage
  or composition story when it documents a real interface pattern consumers should copy.
- Do not create comparison stories for visual mutations that are not part of the component or design-system contract.
  Showing that an SVG or element can be recolored, resized, or rearranged with Tailwind documents CSS, not component
  behavior.
- Treat `Spinner` as the anti-example for story bloat: unless the component gains explicit variants, stories such as
  `Sizes`, `Tones`, or `Colors` are noise. Reasonable coverage is usually `Default`, plus optionally one honest
  `Inline`/`WithLabel` composition if that pattern is worth documenting.
- Prefer separate focused stories for semantic roles and materially different behavior, such as a button's primary,
  outline, secondary, ghost, destructive, link, disabled, icon-only, or loading states. Do not include the component
  name
  in each story name when the Storybook title already scopes the file to that component.
- Prefer comparison stories for visual scales and repetitive styling variations, such as component sizes or icon sizes.
  Show comparable variants side by side so rhythm, spacing, and scale can be inspected in one canvas instead of clicking
  through many near-identical sidebar entries.
- Treat `src/client/components/button/button.stories.tsx` as the current reference pattern for client component stories:
  typed control option constants, story-only icon mapping controls, a shared high-signal `meta.render` for common button
  compositions, focused semantic stories first, then comparison stories such as `Sizes` and `Icon sizes`.
- Use `meta.args` for shared baseline args such as generic `children` and `onClick: fn()`. Focused stories should only
  override the args that make that story meaningful. Use specific children only when the label clarifies semantics, such
  as `Delete` for destructive actions or `Visit` for link-style actions.
- For story-only args such as preview icons, extend the story args type with `ComponentProps<typeof Component>`. Expose
  a
  clearly described control such as `Story-only icon picker (this is not a Button prop!)`, and destructure unused
  story-only args out of custom renders so they do not leak into the rendered component or DOM.
- Keep story export names short and stable because they form technical story ids. Use `name` only when the display name
  needs human-facing clarification or sentence casing, such as `Primary (default)` or `Icon sizes`.
- In comparison, story render functions, spread `args` before pinned props that define the comparison item, for example
  `<Button {...args} size='xs' />`. This lets controls adjust shared args while preventing controls from collapsing the
  whole comparison into one size or variant.
- Local story-only helpers may use simple names when the surrounding story file makes their purpose obvious. Give them
  more precise names when they become broader, exported, reused across files, or responsible for more than local layout.
- Storybook Controls need runtime `options` arrays for select/radio controls. TypeScript may know CVA-derived unions in
  the editor, but those type unions are not available as runtime values for Storybook controls.
- `class-variance-authority` currently does not expose a stable runtime introspection API for variant keys. CVA
  discussion https://github.com/joe-bell/cva/discussions/146 tracks requests for exposing variants; until CVA provides
  this, do not introduce a custom CVA fork, wrapper, or large metadata layer only to satisfy Storybook controls.
- For CVA-backed component variants, it is acceptable to duplicate small `argTypes.options` arrays in stories as the
  lowest-cost workaround for working controls. Use explicit Storybook table summaries such as `string union` or
  `component union` when Autodocs would otherwise show unclear types such as `unknown`, and put the concrete option list
  in `table.type.detail`. Revisit this only if CVA or Storybook gains reliable variant introspection.
- Do not rely on `react-docgen-typescript` configuration as the primary solution for CVA variant controls. In this
  project, attempts to switch Storybook to `react-docgen-typescript` did not produce reliable controls and made prop
  extraction worse in the running Storybook.
- Do not keep Storybook onboarding/demo components, CSS, MDX, assets, or addon dependencies as part of the long-term
  component architecture. The generated `src/stories` folder should stay deleted unless the project explicitly creates
  real documentation there.
- Top-level MDX documentation may live separately from component folders, but it should be project documentation, not
  generated onboarding content.
- CSF 3 is the stable default story format. CSF Next is not related to Next.js; it is an experimental next Component
  Story
  Format. Do not switch to CSF Next unless the project explicitly accepts preview API churn.

## Storybook Deployment

- The public Storybook is deployed as a static site at `https://ui.nodzimo.com`.
- Coolify should treat this resource as a static site built from the repository with Nixpacks and should publish
  `/storybook-static`. Do not commit `storybook-static`; it is generated by `storybook build`.
- Keep `nixpacks.toml` for the Coolify deployment. It installs Bun's Linux x64 baseline binary because the regular Bun
  binary can fail in the build container with `exit code 132` / illegal CPU instruction.
- `nixpacks.toml` should keep an exact `BUN_VERSION` because it is interpolated into a GitHub release asset URL such as
  `bun-v${BUN_VERSION}/bun-linux-x64-baseline.zip`. This is separate from `package.json` `engines.bun`, which declares
  the supported Bun line for the project.
- Keep `NODE_VERSION = '25'` in `nixpacks.toml` aligned with the Node 25 project line unless the project intentionally
  moves to a new Node line.
- Coolify deploy settings should leave install/build/start commands empty when `nixpacks.toml` owns those phases. The
  static-site `Publish Directory` cannot be moved into `nixpacks.toml`; set it manually in Coolify to
  `/storybook-static` with the leading slash, because Coolify rejects the value without it.

## Local Consumer Testing

- `bun link` works in simple Vite/React consumers, but it is not reliable with Next 16 Turbopack.
- Next 16 Turbopack can fail to resolve linked/junction packages even when Node, Bun, and IDE resolution work.
- Avoid using `turbopack.root` as a workaround unless the parent folder is a real monorepo root with its own
  `package.json` and `node_modules`. Setting the root to the sibling parent can break Tailwind/PostCSS dependency
  resolution in the Next app.
- Avoid `file:../nodzimo-ui` as a folder dependency with Bun on Windows. Bun can try to copy the whole working
  directory, including `.git`, and fail with `EPERM`.
- Preferred Next/Turbopack consumer flow after publication:
    1. Publish a new package version from this project.
    2. Install or update the package in the consumer with `bun add "@sefo/nodzimo-ui"` or `bun update @sefo/nodzimo-ui`.
    3. Import from `@sefo/nodzimo-ui`, `@sefo/nodzimo-ui/client`, and `@sefo/nodzimo-ui/styles.css`.
- Tarball testing remains useful before publishing a version:
    1. Run `bun run project:verify` in this project, or run `bun run lib:pack` after a fresh library build.
    2. Install the generated `nodzimo-ui.tgz` in the Next consumer.
    3. Reinstall the tarball in the consumer after each library rebuild.
- Keep generated `.tgz` archives out of git.

## Cleanup Scripts

- Keep generated distribution artifacts under `clean:dist`, including `dist`, generated package archives, and the
  Dependency Cruiser SVG graph. Treat small generated project files as part of this target unless they clearly belong to
  a more specific cleanup target.
- Keep dependency installs under `clean:modules`.
- Keep generated Storybook output under `clean:storybook`; `clean:all` should include Storybook output along with the
  distribution artifacts and dependency install.

## npm Publishing

- Manual npm publishing is the current release flow.
- Use the `sefo` npm account for the `@sefo/nodzimo-ui` package.
- Use interactive npm authentication with 2FA for manual publishing; do not store npm access tokens in the repository.
- For future CI/CD publishing, prefer npm Trusted Publishing/OIDC over long-lived npm tokens.
- Before publishing, run `bun run project:verify` and inspect the package with `npm pack --dry-run` or
  `bun pm pack --dry-run`.
- Use `npm publish` through `bun run publish:npm` after confirming the package contents.
- Version `0.x` is acceptable while the library is early and primarily used by the author's own projects.

## Scripts

- `bun run project:audit` is the main audit button. It runs TypeScript checks, Biome checks, dependency graph checks,
  and dependency update visibility checks.
- `bun run project:verify` is the main full verification button. It installs dependencies, runs `project:audit`, builds
  icons, builds JS/types, builds CSS, and packs `nodzimo-ui.tgz`.
- `bun run build:icons` regenerates icon components from `assets/icons` through SVGR and applies the project's Biome
  fix flow to the generated output.
- `bun run build` runs TypeScript project checks and Vite library build.
- `bun run build:ts` runs TypeScript project checks via `tsc --build`.
- `bun run build:ts-watch` watches TypeScript project checks.
- `bun run build:js` runs the Vite library build.
- `bun run build:js-watch` watches the Vite library build.
- `bun run build:css` builds `src/styles.css` to minified `dist/styles.css`.
- `bun run build:css-watch` watches and rebuilds the CSS output.
- `bun run build:all` regenerates icons, runs the JS/type build, and then builds CSS. Keep CSS after Vite because Vite
  clears `dist`.
- `bun run storybook:build` builds the full public static Storybook into `storybook-static`.
- `bun run storybook:build-test` is a test-optimized Storybook build script. Do not use it for the public deployment
  unless the project intentionally switches the deployed Storybook to test-mode output.
- `bun run lib:pack` only packs the current build output as `nodzimo-ui.tgz`; it intentionally does not build. Use it
  after `build:all` or through `project:verify`.
- `bun run check:lint` runs Biome checks.
- `bun run check:deps` runs dependency-cruiser against `src`.
- `bun run check:deps-graph` generates `dependency-graph.svg` from dependency-cruiser output and requires Graphviz
  `dot`.
- `bun run check:format` runs only Biome formatting.
- `bun run check:fix` applies safe Biome fixes, formatting, and import organization.
- `bun run check:fix-unsafe` applies unsafe Biome fixes intentionally.
- `bun run clean:dist` removes generated distribution artifacts and small generated project files.
- `bun run clean:modules` removes dependency installs.
- `bun run clean:storybook` removes generated Storybook output.
- `bun run clean:all` removes distribution artifacts, generated Storybook output, and dependency installs.
- `bun run deps:outdated` checks dependency updates.
- `bun run publish:npm` publishes the package to npm using the package's `publishConfig`.
- `bun run publish:who` checks the active npm account.
- `bun run publish:login` starts npm login.
- `bun run publish:bump` bumps the package patch version with npm.
- `bun run publish:fund` checks package funding metadata.
- `bun run publish:fix` asks npm to normalize package metadata.

## Verification

- Prefer `bun run project:audit` for the regular full check pass.
- Prefer `bun run project:verify` before publishing, tarball consumer testing, or any change that should prove the full
  package artifact still builds and packs.
- Use `bun run build:all` after changing Vite config, package exports, type generation, source entrypoints, React
  Compiler scope, Tailwind styles, generated icons, or client/core boundaries.
- Use `bun run storybook:build` after changing `.storybook/main.ts`, `.storybook/vite.config.ts`, Storybook addons,
  `assets/storybook`, or deploy-facing Storybook metadata.
- After changing declaration excludes, Tailwind source detection, or package output names, inspect `bun pm pack
  --dry-run` and confirm Storybook-only files are not in the package unless intentionally kept.
- After changing declaration bundling or package type exports, confirm `dist` contains `nodzimo-ui.d.ts` and
  `client.d.ts`, does not contain `dist/src`, and that `package.json` `exports.types` points at the bundled files.
- Confirm `dist/styles.css` exists after `bun run build:all` when changing style build scripts or Tailwind setup.
- Inspect `dist/nodzimo-ui.js` and `dist/client.js` after build changes that affect React Compiler or entrypoints.
- For root/RSC-safe output, inspect `dist/nodzimo-ui.js` for accidental client or third-party leaks:
  `rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/nodzimo-ui.js`.
- Expected root output may import `react/jsx-runtime`, but must not import `react/compiler-runtime` or inline React
  component-library internals that call context/hooks.
- `lucide-react` should not appear in `dist/nodzimo-ui.js` while it is story-only. If it appears there, either a runtime
  source import leaked back into the root entry or package dependency/external decisions need to be revisited.
- For Next/Turbopack consumer checks, install the published `@sefo/nodzimo-ui` package in the Next app. Use tarball
  testing only when validating changes before publication.
- If a client component fails in Next with compiler runtime errors, check whether `"use client";` is present in the
  built client entry.
- If a core component fails in a Server Component context, check whether `react/compiler-runtime`, `createContext`,
  `useContext`, `@base-ui/react`, or inlined third-party React component code leaked into the root bundle.
- When a dependency/config change affects root exports, verify both the library build and a Next/Turbopack consumer
  build
  that imports at least one core component and one affected component from the built package or tarball.
