## Icon Generation

### Generator Contract

- Generate project-owned icon components with SVGR CLI. SVGR is a dev-only generator here, not a runtime dependency and
  not a Vite plugin.
- Keep `svgr.config.cjs` as the compact shared configuration and component-template source. It owns only behavior shared
  by every generated SVG component: kebab-case filenames, automatic JSX runtime, TypeScript output, disabled SVGR
  Prettier, and the project template.
- Keep focused profiles under `config/svgr` instead of duplicating the shared config:
    - `icons.cjs` adds `icon: true` and writes interface icons to `src/core/icons/generated`.
    - `flags.cjs` leaves SVGR's default `icon: false` implicit and writes flag icons to
      `src/core/icons/generated/flags`.
- Keep the shared config and its profiles as `.cjs` while they compose plain objects with `module.exports` and
  synchronous relative `require`. The package is ESM through `"type": "module"`, so `.cjs` is the explicit CommonJS
  boundary rather than an SVGR requirement. Keep the full `.cjs` extension in
  `require('../../svgr.config.cjs')`: Node only adds `.js`, `.json`, and `.node` while resolving an extensionless
  CommonJS file. See the
  [Node.js package module rules](https://nodejs.org/api/packages.html#determining-module-system),
  [CommonJS file-module resolution](https://nodejs.org/api/modules.html#file-modules), and
  [SVGR configuration-file contract](https://react-svgr.com/docs/configuration-files/).
- Keep source directories as positional SVGR CLI inputs. `outDir` belongs to each profile, but SVGR does not provide an
  equivalent config property for the input directory. `--config-file` is a real named CLI option and requires its
  hyphens; the following source directory is positional and does not need a `--` separator.
- Keep reusable project brand artwork that is not an input to the generated icon profiles under `assets/brand`. Do not
  place it under `assets/icons`, because that directory is consumed wholesale by the interface-icon SVGR profile, and do
  not give it a consumer-specific owner such as Storybook.
- Set the flag profile's `outDir` directly to `src/core/icons/generated/flags`. SVGR preserves directories nested inside
  the source tree, but it does not reproduce the positional source root itself: an `assets/flags` input with
  `src/core/icons/generated` as its output would write the flag files directly into `generated`, not create the desired
  `generated/flags` category.
- `bun run build:icons` runs the interface-icon profile over `assets/icons` and the flag-icon profile over
  `assets/flags`, writes both sets under `src/core/icons/generated`, and then runs the repository-wide unsafe Biome fix
  flow. That final command is not scoped to generated files; inspect the complete worktree after running it.
- SVGR overwrites and creates output but does not prune components whose source SVG was removed or renamed. Delete the
  corresponding stale generated file, or the affected generated category, before regeneration and verify its generated
  `index.ts`. Never hand-edit generated component content.
- Keep the custom SVGR component template while this project uses the inspected SVGR 8/Babel 8 toolchain. Its default
  TypeScript output was observed to lose the generic in
  `SVGProps<SVGSVGElement>` when generated through the mixed Babel 7/8 toolchain. The template is the narrow fix: it
  uses the shared `IconProps` contract, based on React's `JSX.IntrinsicElements['svg']`, instead of emitting that
  generic form. This preserves strict SVG prop typing without a post-generation string rewrite,
  patching `node_modules`, downgrading Babel, or changing runtime output.

### Public Icon Type Contract

- `src/core/icons/icon-types.ts` owns `IconProps = JSX.IntrinsicElements['svg']` and
  `Icon = (props: IconProps) => JSX.Element`. Export both with `export type` through the icon barrel and root
  `@nodzimo/ui` entrypoint. Keep this contract beside its icon domain, not in a general-purpose type collection.
- `IconProps` describes ordinary SVG props, including React 19's SVG ref prop. `Icon` describes the current plain
  function-component shape shared by generated and compatible custom icons. It intentionally does not promise every
  possible React component representation; revisit it if the library changes that shape.
- Use public `Icon` for icon maps and component-valued props. Do not derive a general icon type from an arbitrary
  concrete component such as `typeof FilmIcon`, or substitute an upstream Lucide runtime component type for these
  project-owned SVG functions.
- SVGR's shared template emits `import type { IconProps } from '../../icon-types'` and annotates the component props
  with `IconProps`. The import is relative to each generated output file, not to the root config file. Current
  `generated/lucide` and `generated/flags` folders have the same depth; adding a category at another depth requires
  adapting and verifying its template import.
- Keep that type import direct. Routing an icon through the barrel that re-exports it adds an unnecessary reverse
  dependency in the source type graph. The import is erased from JavaScript and does not bundle React or the type file.
- Custom icons do not participate in regeneration. Extend `IconProps` in their own modules and export named public
  props through their folder barrel. `NodzimoSymbolIconProps` adds optional `leftColor` and `rightColor`; callers can
  use the component or its specific props independently. A separate props alias for each generated icon is unnecessary
  because their contract is identical.
- Import-only type changes must leave generated JavaScript unchanged. Verification covered the generated icon set,
  compatibility of the custom symbol with `Icon`, SVG ref props, rejection of invalid SVG props, and strict checking
  of the bundled root declaration. Re-run focused checks when the contract or generator changes; public types must
  not depend on unpublished source paths.

The template owns component generation, while `icon-types.ts` owns the SVG contract. This avoids independently
maintained definitions without introducing runtime wrappers or dependencies. See the
[SVGR custom template API](https://react-svgr.com/docs/custom-templates/),
[React SVG components](https://react.dev/reference/react-dom/components/common#svg-components), and
[declaration boundary decision](public-declaration-leak-incident-shadcn.md).

### Flag Source Decision

- The flag source of truth is the MIT-licensed
  [`lipis/flag-icons`](https://github.com/lipis/flag-icons) repository. The current project snapshot was copied from
  [`v7.5.0/flags/4x3`](https://github.com/lipis/flag-icons/tree/v7.5.0/flags/4x3); record a new tagged snapshot here
  before importing future flags.
- Vendor only the SVG files required by supported product locales. Do not install the complete `flag-icons` runtime
  package or its CSS, and do not make consumers depend on FlagCDN, Shadcn Studio assets, or another HTTP service. The
  fixed locale set is small, while local components remain offline, versioned, reviewable, and independent of network
  availability.
- Use the upstream 4:3 SVG variants rather than square crops, PNG files, CSS backgrounds, or emoji. The shared
  `viewBox="0 0 640 480"` preserves one rectangular source format, scales without raster loss, and matches the selected
  repository's standard inline flag shape.
- Treat language-to-flag mapping as product metadata rather than a universal language standard. The current language
  story uses the United States flag for the product's English locale and the Arab League flag for Arabic to represent
  the broader Arabic-speaking world instead of one country.
- Raw SVG files remain repository source inputs for generated React components, while the deployed Storybook also
  exposes the complete source tree at stable `/assets/...` paths for downloads and non-React consumers. This static
  Storybook surface does not change the component-first runtime contract: package components must not depend on the
  Storybook host or network availability, and raw assets are not included in the npm package by this decision.

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
- Keep raw 4:3 flag icons under `assets/flags`. Normalize a newly copied source before generation:
    - preserve `viewBox`, `xmlns`, geometry, transforms, paint, and referenced `defs`;
    - preserve IDs that are targets of `href`, clipping, markers, gradients, or other internal references;
    - replace legacy `xlink:href` with `href`, then remove the unused `xmlns:xlink` declaration;
    - remove editor/export metadata, root IDs, unused classes, `version`, and `xml:space` when no text-whitespace
      semantics require it;
    - add `aria-hidden="true"` because the flag is decorative beside a visible language or country label.
- Do not flatten `defs`, delete referenced IDs, rewrite paths, recolor flags, or otherwise simplify geometry by hand.
  Cleanup removes obsolete metadata and syntax without changing the rendered flag. SVGR may prefix retained IDs in the
  generated component to prevent document collisions.
- Name raw files descriptively in kebab case as
  `country-or-organization-flag-icon.svg`, for example `united-states-flag-icon.svg` and
  `arab-league-flag-icon.svg`. Do not expose ISO-code filenames as the project API. The generated public component name
  follows mechanically as `UnitedStatesFlagIcon` or `ArabLeagueFlagIcon`.
- Leave flag-source `width` and `height` unset. The flag profile deliberately omits `icon: true`, so SVGR does not
  impose square `1em` dimensions. Each usage owns the outer SVG size through props or CSS, while the 4:3 `viewBox` owns
  the artwork's aspect ratio. When a usage gives the SVG a square layout box, the browser's default
  [`preserveAspectRatio="xMidYMid meet"`](https://www.w3.org/TR/SVG2/coords.html#PreserveAspectRatioAttribute) scales
  the flag uniformly and centers it without stretching or cropping; the remaining vertical space belongs to the viewport
  and is not part of the flag artwork.
- For custom symbols that need independent color control per shape, keep a hand-authored component with separate SVG
  paths and explicit props. Do not rely on SVGR/SVGO to preserve same-colored sibling paths; optimization may merge
  them.

### Runtime And Usage Rules

- Generated icon components belong in `src/core` and are RSC-safe only when they remain plain SVG components: no hooks,
  no `'use client'`, no `memo`, no `forwardRef`, and no runtime icon package imports.
- A flag becomes a React component for package delivery and composition, not because its finished artwork needs
  component state or recoloring. The wrapper gives consumers one typed JSX import from the existing RSC-safe icon
  surface, accepts ordinary SVG props, and renders offline inline markup without a URL request. Keep the flag's authored
  colors and geometry intact.
- Generated icons are decorative by default when their raw source carries `aria-hidden="true"`. If a usage needs an
  accessible name, put that name on the containing control or write a focused custom icon component instead of enabling
  SVGR `titleProp` globally.
- Generated icon components are raw assets, not semantic usage decisions. Do not edit generated output to add
  `rtl:rotate-180` or other usage-specific behavior; apply those classes where a component uses an icon to mean
  inline-start or inline-end movement.
- Public icon names should use the `SomethingIcon` suffix, such as `HeartIcon` or `GithubIcon`. Keep source grouping in
  folders, not in public component names.
- Flag icons are a generated icon category, not a separate top-level component family. Keep their generated files under
  `src/core/icons/generated/flags`, re-export them through `src/core/icons`, and include them in the common Storybook
  iconography gallery.

### Iconography Gallery

- Import each generated category as a focused namespace when the gallery must discover every member automatically. This
  is the deliberate Storybook-inventory exception described in
  [Internal Package Imports](internal-package-imports.md); component stories should still consume icons through the
  aggregate `#core` surface.
- Keep flag previews in the gallery's shared square icon layout. A 4:3 flag remains centered and undistorted inside that
  box, while the common footprint aligns it consistently with square interface icons. Do not add flag-only dimensions
  merely to remove the expected vertical space.
- Derive human-readable labels from component names instead of maintaining a parallel label table. Check the ordered
  postfixes `FlagIcon` and `Icon` from most specific to least specific, so `UnitedStatesFlagIcon` becomes
  `United States` rather than `United States Flag`.
- Strip a postfix only when the component name contains text before it. A component literally named `FlagIcon`
  therefore keeps the useful label `Flag` instead of becoming empty.
- Split PascalCase boundaries and the boundary between a letter and a following digit. This preserves established labels
  such as `Trash2Icon` -> `Trash 2` while also handling generated flag names consistently.
