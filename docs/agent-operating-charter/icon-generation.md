## Icon Generation

### Generator Contract

- Generate project-owned icon components with SVGR CLI. SVGR is a dev-only generator here, not a runtime dependency and
  not a Vite plugin.
- Keep `svgr.config.cjs` compact. Do not add explicit SVGR defaults; keep only options that change this project's
  output, such as `outDir`, `filenameCase`, `jsxRuntime`, `icon`, `typescript`, `prettier`, and the project template.
- `bun run build:icons` reads raw SVG files from `assets/icons`, writes generated TSX under
  `src/core/icons/generated`, and then runs the project's Biome fix flow so generated output follows local formatting.
- Keep the custom SVGR component template while this project uses SVGR 8 with Babel 8. SVGR 8 has no newer stable,
  beta, or alpha line for Babel 8 support, and its default TypeScript output can lose the generic in
  `SVGProps<SVGSVGElement>` when generated through the mixed Babel 7/8 toolchain. The template is the narrow fix: it
  changes only the generated component props type to `JSX.IntrinsicElements['svg']`, which React types define as the
  intrinsic `<svg>` props shape. This preserves strict SVG prop typing without a post-generation string rewrite,
  patching `node_modules`, downgrading Babel, or changing runtime output.

### SVG Source Rules

- Third-party icon sets such as Lucide should be consumed as raw SVG source only, then generated into project-owned
  components. Remove source `class` attributes such as `lucide` before generation; they are HTML/CSS hooks for raw SVG
  usage and become noisy generated `className` values.
- Treat raw SVG files as the source of truth for SVG accessibility. Decorative icon sources should carry
  `aria-hidden="true"` directly on the root `<svg>` so the raw asset and generated component stay in sync. Do not add
  decorative accessibility props through `svgr.config.cjs`; generation should preserve what the source declares.
- Preserve raw SVG `viewBox`, `stroke='currentColor'`, and `fill='none'` for outline icons. `icon: true` changes
  generated `width` and `height` to `1em`, while `viewBox` keeps scaling correct.
- Do not create separate filled variants when the same outline SVG can be filled by the consumer. For fillable icons
  such as hearts or stars, keep the outline source and let usage pass `fill='currentColor'` and, when needed,
  `strokeWidth={0}` or equivalent classes.
- Keep brand or multicolor SVG colors intact when those colors are part of the asset. Use `currentColor` for themeable
  monochrome icons.
- For custom symbols that need independent color control per shape, keep a hand-authored component with separate SVG
  paths and explicit props. Do not rely on SVGR/SVGO to preserve same-colored sibling paths; optimization may merge
  them.

### Runtime And Usage Rules

- Generated icon components belong in `src/core` and are RSC-safe only when they remain plain SVG components: no hooks,
  no `'use client'`, no `memo`, no `forwardRef`, and no runtime icon package imports.
- Generated icons are decorative by default when their raw source carries `aria-hidden="true"`. If a usage needs an
  accessible name, put that name on the containing control or write a focused custom icon component instead of enabling
  SVGR `titleProp` globally.
- Generated icon components are raw assets, not semantic usage decisions. Do not edit generated output to add
  `rtl:rotate-180` or other usage-specific behavior; apply those classes where a component uses an icon to mean
  inline-start or inline-end movement.
- Public icon names should use the `SomethingIcon` suffix, such as `HeartIcon` or `GithubIcon`. Keep source grouping in
  folders, not in public component names.
