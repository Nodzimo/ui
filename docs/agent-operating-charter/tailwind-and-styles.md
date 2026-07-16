## Tailwind And Styles

### Tooling Role

- Tailwind is build-time styling tooling. The library uses it to compile component CSS; Tailwind consumers use their
  own compiler to turn the public NUI theme mappings into application utilities. Tailwind is not a runtime dependency
  of the published React package.
- Keep `tailwindcss`, `@tailwindcss/cli`, and `tw-animate-css` in `devDependencies`; consumers receive built CSS from
  `dist/styles.css`.
- Do not rely on consumer Tailwind scanning to style library components. A Next consumer may appear to pick up some
  utility classes from the package, but that is incidental and not the package contract.
- The published stylesheet contains the compiled classes used by Nodzimo UI components. Consumers do not need Tailwind
  to generate those classes, and their application styling stack remains their own decision.
- Tailwind consumers that want to author classes such as `bg-nui-card`, `ring-nui-ring`, or `gap-nui-md` must also
  import the public `@nodzimo/ui/theme.css` compiler input. This is independent of the ready-built component stylesheet.

### Preflight Ownership

- The consumer owns the document-wide reset. Published `dist/styles.css` must not contain Tailwind Preflight or another
  global reset.
- Nodzimo UI is primarily developed and visually verified in current Tailwind applications. In that intended baseline,
  the consumer imports Tailwind and receives exactly one consumer-owned Preflight. A consumer may instead use another
  reset, but Nodzimo UI does not promise normalization for a reset-free document, an arbitrary reset, or conflicting
  host global CSS.
- This ownership boundary does not make the package stylesheet incomplete. Component utilities, NUI tokens,
  animations, and opt-in foundation classes are compiled into `dist/styles.css`; only document normalization is left
  to the application.
- Keep broad NUI foundation behavior opt-in through `nui-boundaries`, `nui-surface`, and `nui-interactive`. These
  classes
  are package features, not a replacement for Preflight, and they must not become global selectors.
- Storybook is a separate application and the visual reference environment for the kit. Its `.storybook/preview.css`
  intentionally imports full Tailwind, including Preflight, while the package artifact does not.

The package entrypoint must express that boundary explicitly:

```text
@layer theme, base, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) source(none);
@import "./library.css";
```

The explicit layer declaration preserves Tailwind's standard layer order. Omitting `tailwindcss/preflight.css` is the
Tailwind-supported way to disable Preflight; `source(none)` remains attached to the utilities import because source
detection controls generated utilities.

For the duplicate-reset audit, measured artifact evidence, rejected alternatives, and reasoning failures to avoid, see
[Tailwind Preflight Ownership Decision](tailwind-preflight-ownership-decision.md).

### Runtime Tokens Vs Theme Mappings

- Separate runtime CSS variables from Tailwind theme mappings. A `:root` variable such as `--nui-background` or
  `--nui-spacing-md` is emitted into the built CSS as part of the package stylesheet contract and can be read at runtime
  with `var(--nui-*)`. An `@theme inline` token such as `--color-nui-background` or `--spacing-nui-md` teaches Tailwind
  how to generate utilities such as `bg-nui-background` or `gap-nui-md`; it is not by itself the public runtime token a
  consumer should read with `var(...)`.
- When a design-system value is a product token that consumers may use directly, define the raw `--nui-*` variable in
  `:root` and map the matching Tailwind utility token in `@theme inline`. Do not define package-facing tokens only in
  `@theme inline`, because that makes them compiler configuration rather than a stable runtime CSS-variable contract.
- Keep raw runtime values in `src/library.css` and Tailwind mappings plus the class-based `dark` variant in
  `src/theme.css`. `src/library.css` imports `src/theme.css` so library and Storybook builds use the same mappings that
  consumers receive through `@nodzimo/ui/theme.css`.

For token naming and semantic roles, see [Theme Token Contract](theme-token-contract.md).

### Consumer Tailwind Theme

- `@nodzimo/ui/styles.css` and `@nodzimo/ui/theme.css` serve different tools:
    - `styles.css` is compiled runtime CSS for browsers: component utilities, runtime `--nui-*` values, animations, and
      opt-in foundation classes.
    - `theme.css` is uncompiled Tailwind compiler input: `@theme inline` mappings and the class-based `dark` variant. It
      intentionally contains no Tailwind import, Preflight, generated utility matrix, or runtime token values.
- Publish `src/theme.css` unchanged through the public `./theme.css` package export. This single source file is an
  intentional exception to the `dist` runtime-artifact convention: compiling it would consume the `@theme` directives,
  while copying it into `dist` would add a build step without changing the artifact.
- Keep the package whitelist narrow: include exactly `src/theme.css`, not the whole `src` tree. Consumers must import
  the
  public alias and must not deep-import `@nodzimo/ui/src/theme.css`.
- In a Tailwind consumer, import the NUI compiler theme immediately after Tailwind in the application's global CSS:

```text
@import "tailwindcss";
@import "@nodzimo/ui/theme.css";
```

- Import ready-built `@nodzimo/ui/styles.css` once at the application root before the application global stylesheet so
  application globals and overrides keep the final cascade position.
- Non-Tailwind consumers import only `@nodzimo/ui/styles.css`. They may use raw `--nui-*` variables directly and should
  not load the compiler-only theme file in the browser.
- Do not combine the two public files. A browser artifact and compiler input have different lifecycles: publishing both
  raw would force consumers to compile library components, while compiling both would erase the mappings needed for
  consumer-authored utilities.
- The consumer compiler generates only utilities used by the consumer, including variants and opacity forms. Do not
  safelist the combinatorial color/radius/spacing utility matrix in the library package.

For the production failure, verified consumer behavior, external references, rejected alternatives, and accepted
trade-offs, see [Tailwind Consumer Theme Integration Decision](tailwind-consumer-theme-integration-decision.md).

### CSS Entrypoints

- Do not import `src/styles.css` from `src/index.ts` or `src/client.ts` just to pull CSS into the JS graph. The library
  has separate core and client JS entrypoints, and global styles should remain an explicit stylesheet import.
- Do not add a CSS entry to Vite library entries for the current setup. CSS is generated directly with Tailwind CLI:
  `src/styles.css -> dist/styles.css`.
- Do not treat `@tailwindcss/vite`, if present, as the production CSS artifact pipeline; the publishable stylesheet is
  still generated by `build:css`.
- `build:css` should use `--minify` for the publishable CSS artifact. Use the CSS watch script for iterative rebuilds.
- Keep the stylesheet architecture split by role:
    - `src/theme.css` is the public Tailwind compiler contract: NUI theme mappings and the class-based `dark` variant.
      It is imported by `src/library.css` and published unchanged as `@nodzimo/ui/theme.css`.
    - `src/library.css` is the shared library style contract: raw light/dark NUI values, CSS variables, and
      foundation classes. It imports `./theme.css` and shared CSS-first utility sources, but does not import Tailwind
      itself.
    - `src/styles.css` is the publishable package stylesheet entrypoint. It imports Tailwind theme and utilities without
      Preflight, imports `./library.css`, scans `src`, and excludes colocated stories.
    - `.storybook/preview.css` is the Storybook application stylesheet entrypoint. It imports full Tailwind with
      `source(none)`, including Preflight, imports `../src/library.css`, and explicitly scans `src` plus `.storybook` so
      story and preview utilities can be generated.
- Keep `@import "tw-animate-css";` and `@import "./theme.css";` at the start of `src/library.css`, before local token,
  foundation, and utility declarations. This makes the
  shadcn-style animation utilities such as `animate-in`, `animate-out`, `fade-in-*`, `zoom-in-*`, and `slide-in-*`
  available to both CSS entrypoints: the publishable `dist/styles.css` and Storybook's preview stylesheet. Do not
  duplicate this import in `src/styles.css` and `.storybook/preview.css`.
- Multiple Tailwind CSS imports here are compiler entrypoints for different artifacts, not duplicate runtime Tailwind
  instances in one consumer bundle. The package build emits reset-free `dist/styles.css`; Storybook emits its own
  Preflight-backed iframe CSS under `storybook-static/assets`.

### Source Detection

- Use Tailwind's documented multiple-stylesheet pattern for these entrypoints: disable automatic source detection with
  `source(none)` and add explicit `@source` directives. This is the official Tailwind v4 mechanism for stylesheets that
  must scan different source sets, not a local workaround.
- `src/styles.css` should exclude Storybook story files from Tailwind v4 source detection with
  `@source not "./**/*.stories.*";` so story-only preview classes do not inflate `dist/styles.css`. Keep this exclusion
  in the package entrypoint, not in `src/library.css`, because Storybook needs Tailwind to see story-only preview
  utilities such as layout gaps, grid helpers, and comparison-canvas classes.
- The package CSS entrypoint should declare Tailwind's layer order, import `tailwindcss/theme.css`, import
  `tailwindcss/utilities.css` with `source(none)`, and import `./library.css` before `@source` directives. Do not
  restore
  the full `@import "tailwindcss"` or add `tailwindcss/preflight.css`; either would put the reset back into
  `dist/styles.css`.
- Tailwind v4 `@utility` registers a utility with Tailwind, but does not by itself guarantee that the utility or its
  variants are emitted into `dist/styles.css`. Public NUI utilities belong in `src/library.css`; class forms promised to
  consumers but not used in package source must be safe-listed in `src/styles.css` with Tailwind's official
  `@source inline(...)` syntax. Example: define `@utility nui-animate-paused { animation-play-state: paused; }` in
  `src/library.css`, then safelist `@source inline("{hover:,active:,group-hover:,}nui-animate-paused");` in
  `src/styles.css` so the base, hover, active, and group-hover forms ship in the built package CSS.
- This safelist rule applies to custom package utilities that must exist in ready-built `styles.css`. Do not safelist
  every token-derived Tailwind utility: `src/theme.css` teaches the consumer compiler to generate the exact
  color/radius/spacing utilities and variants used by that application.
- Use relative CSS imports for local stylesheet entrypoints. `src/styles.css` should import `./library.css`, and
  `.storybook/preview.css` should import `../src/library.css`. Do not route these CSS imports through package/import-map
  aliases unless the CSS toolchain explicitly supports and needs that contract.
- Do not restore Storybook's generated `src/stories` onboarding folder. The colocated story-file exclusion is the
  intended long-term source filter.
- Vite cleans `dist` during `vite build`, so full builds must run JS/type build first and CSS build afterward.
- Design direction: components should be styled and usable by default, but themeable through CSS variables/tokens rather
  than hard-coded project-specific colors long term.

### Class Naming And WebStorm Autocomplete

- Use `class`, `className`, `classNames`, `classes`, and `*_CLASSES` naming for values that contain Tailwind class
  strings, including string constants, arrays, and object tables such as CVA variant class maps. Reserve `style` and
  `styles` naming for inline style objects, `CSSProperties`, or other non-Tailwind style declarations.
- Keep WebStorm Tailwind autocomplete for non-JSX class tables scoped through the project Tailwind language-server
  `experimental.classRegex` setting. The regex should target variable declarations whose names contain class/className/
  classNames/classes/CLASSES, and should not include `styles`; JSX `className` attributes are already covered by the
  standard Tailwind class-attribute support. The project regex convention is adapted from the practical examples in
  <https://github.com/codewithhridoy/tailwind-autosuggestion-for-custom-classes>.
- WebStorm stores Tailwind language-server settings as escaped JSON inside `.idea/tailwindcss.xml`, which is not
  readable enough to reconstruct the regex later. Keep this human-readable minimal JSON block as the source reference
  for the shared class regex convention:

```json
{
  "experimental": {
    "classRegex": [
      [
        "(?:export\\s+)?(?:const|let|var)\\s+[\\w$]*(?:[Cc]lass(?:Name)?s?|[Cc]lasses|CLASSES|CLASS_NAME|CLASS_NAMES|CLASSNAME)[\\w$]*\\s*(?::[^=]+)?=\\s*([\\s\\S]*?)(?=\\n\\s*(?:export\\s+)?(?:const|let|var|function|type|interface|enum)\\b|$)",
        "(?:^|[:,\\[?]\\s*)'([^']*)'(?!\\s*:)"
      ],
      [
        "(?:export\\s+)?(?:const|let|var)\\s+[\\w$]*(?:[Cc]lass(?:Name)?s?|[Cc]lasses|CLASSES|CLASS_NAME|CLASS_NAMES|CLASSNAME)[\\w$]*\\s*(?::[^=]+)?=\\s*([\\s\\S]*?)(?=\\n\\s*(?:export\\s+)?(?:const|let|var|function|type|interface|enum)\\b|$)",
        "(?:^|[:,\\[?]\\s*)\"([^\"]*)\"(?!\\s*:)"
      ],
      [
        "(?:export\\s+)?(?:const|let|var)\\s+[\\w$]*(?:[Cc]lass(?:Name)?s?|[Cc]lasses|CLASSES|CLASS_NAME|CLASS_NAMES|CLASSNAME)[\\w$]*\\s*(?::[^=]+)?=\\s*([\\s\\S]*?)(?=\\n\\s*(?:export\\s+)?(?:const|let|var|function|type|interface|enum)\\b|$)",
        "(?:^|[:,\\[?]\\s*)`([^`]*)`(?!\\s*:)"
      ]
    ]
  }
}
```
