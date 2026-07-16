## Verification

### Command Selection

- Prefer `bun run project:audit` for the regular full check pass.
- Prefer `bun run project:verify` before publishing, tarball consumer testing, or any change that should prove the full
  package artifact still builds, packs, and produces the public static Storybook.
- For GitHub Release workflow changes, validate with a single test version tag when needed and clean up experimental
  tags/releases explicitly. See [GitHub Releases](github-releases.md).
- Use `bun run build:all` after changing Vite config, package exports, type generation, source entrypoints, React
  Compiler scope, Tailwind styles, generated icons, or client/core boundaries.
- Use `bun run storybook:build` after changing `.storybook/main.ts`, `.storybook/vite.config.ts`, Storybook addons,
  `assets/storybook`, or deploy-facing Storybook metadata.

### Storybook Runtime Checks

- For Storybook runtime issues, do not rely on the dev server alone. Run `bun run storybook:preview`, open the static
  build in the browser, and check both story pages and Docs pages. Production-only Docs failures can be hidden by
  `storybook dev`, and `storybook build --test` may omit Docs output, so it is not a substitute for deployed-docs
  verification.
- After changing `.storybook/preview.tsx`, `.storybook/preview-runtime`, `storybook-dark-mode`,
  `.storybook/vite.config.ts`, or the MDX React proxy workaround, confirm the production static Storybook has:
    - a separate `mdx-react-proxy-*.js` chunk or another verified fixed path for `MDXProvider`.
    - working Button Docs and Spinner Docs pages with no React #130 runtime error.
    - working ordinary story pages, because Docs-only fixes should not break canvas stories.
- After changing `.storybook/preview.css`, Storybook Docs theming, `storybook-dark-mode`, or
  `@storybook/addon-docs`, open a raw-Markdown doctrine Docs page such as `Design System/Doctrine/Core Position` in the
  static Storybook build and toggle the manager/Docs light/dark button. Confirm the visible heading text does not shift
  horizontally and the generated heading anchor stays in Storybook's left gutter. See
  [Storybook Docs Heading Anchor Incident](storybook-docs-heading-anchor-incident.md).

### Package Artifacts

- After changing declaration excludes, Tailwind source detection, or package output names, inspect `bun pm pack
  --dry-run` and confirm Storybook-only files are not in the package unless intentionally kept.
- After changing CSS exports or the package whitelist, confirm the pack contains `dist/styles.css` and exactly
  `src/theme.css`, that `package.json#exports` maps their public aliases correctly, and that no broader `src` tree or
  stale `dist/theme.css` is included.
- Before publishing to npmjs, run `bun run publish:dry` after the final build and confirm the package name, version,
  file list, access, and registry are expected.
- After changing declaration bundling or package type exports, confirm `dist` contains `ui.d.ts` and
  `client.d.ts`, does not contain `dist/src`, and that `package.json` `exports.types` points at the bundled files.
- For TypeScript 7 retry attempts, treat `bun run build:js` declaration bundling as the gate, not just
  `bun run build:ts`. The known blocker is documented in
  [TypeScript 7 Native Compiler Incident](typescript-7-native-compiler-incident.md).
- Confirm `dist/styles.css` exists after `bun run build:all` when changing style build scripts or Tailwind setup.

### CSS Artifacts

- After changing Tailwind CSS entrypoints, mappings, or source detection, verify all CSS contracts directly:
    - Run `bun run build:css` and confirm `dist/styles.css` contains library foundation/component classes such as
      `.nui-surface`, `.nui-link`, `.nui-links :where(a:any-link)`, `bg-nui-primary`, and
      `focus-visible:ring-nui-ring`.
    - Confirm `dist/styles.css` does not contain Tailwind Preflight signatures such as the universal
      `box-sizing: border-box` reset, the `html` text-size/tab-size reset, the form-control reset, or the global media
      display reset. See [Tailwind And Styles](tailwind-and-styles.md#preflight-ownership) for reset ownership.
    - When removing or changing a Tailwind import, compare the previous and rebuilt artifacts. The set of NUI/component
      class selectors and `--nui-*` variables should remain unchanged unless the source change intentionally affects
      them; a size reduction alone is not sufficient proof.
    - Confirm `dist/styles.css` does not contain story-only preview utilities from colocated stories or design labs,
      such as `gap-10`, `gap-20`, `rounded-nui-4xl`, `bg-pink-300`, `min-h-screen`, or `items-end`, unless one of those
      classes is intentionally used by production source.
    - Run `bun run storybook:build` and confirm `storybook-static/assets/iframe-*.css` contains its intentional
      Preflight plus needed story and preview utilities such as design-lab gaps, preview padding, and NUI foundation
      classes.
    - Compile an isolated Tailwind input with `source(none)`, import `@nodzimo/ui/theme.css`, and safelist
      representative
      consumer-only classes absent from package component source. Cover at least color, border/ring, radius, spacing,
      opacity, interaction, and class-based dark forms such as `bg-nui-card`, `ring-nui-ring`, `rounded-nui-4xl`,
      `gap-nui-md`, `hover:bg-nui-accent/80`, and `dark:text-nui-sidebar-foreground`.
    - Confirm the consumer compiler accepts `@apply` with a mapped NUI utility. This catches the failure mode where raw
      `--nui-*` values ship but the consumer Tailwind compiler never receives the `@theme` mapping.
    - Confirm the built link contract contains one grouped rest rule plus grouped hover and active rules for
      `.nui-link` and `.nui-links :where(a:any-link)`. Verify Button's built `link` variant references only `nui-link`,
      and confirm `theme.css` does not duplicate the runtime selector contract.

### Built JS Inspection

- Inspect `dist/ui.js` and `dist/client.js` after build changes that affect React Compiler or entrypoints.
- For root/RSC-safe output, inspect `dist/ui.js` for accidental client or third-party leaks:
  `rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/ui.js`.
- Expected root output may import `react/jsx-runtime`, but must not import `react/compiler-runtime` or inline React
  component-library internals that call context/hooks.
- `lucide-react` should not appear anywhere in built package output. If it appears there, a runtime source import leaked
  back into the package or package dependency/external decisions need to be revisited.
- For client output, inspect `dist/client.js` for bundled third-party internals, CommonJS shims, or dynamic require
  support after changing runtime dependencies, Vite externalization, or client component imports:
  `rg -n "Calling .*require|typeof require|new Proxy|node_modules|use-sync-external-store|@base-ui/react" dist/client.js`.
- A large unexpected `dist/client.js` size jump should be treated as a release-blocking signal until the artifact is
  inspected.

### Consumer Checks

- For Next/Turbopack consumer checks, install the published `@nodzimo/ui` package in the Next app. Use tarball
  testing only when validating changes before publication.
- For Tailwind consumers, confirm application globals import `tailwindcss` before `@nodzimo/ui/theme.css`, while the
  application root imports ready-built `@nodzimo/ui/styles.css` before its globals. Verify autocomplete and production
  output with at least one NUI utility not used in UI-kit component source.
- When verifying the NUI link foundation, apply `nui-links` to the consumer root and cover a native link, a fragment
  link, a Next.js `Link`, an individual `nui-link`, a Button `link` variant, and a utility-class override.
- If a client component fails in Next with compiler runtime errors, check whether `"use client";` is present in the
  built client entry.
- If a core component fails in a Server Component context, check whether `react/compiler-runtime`, `createContext`,
  `useContext`, `@base-ui/react`, or inlined third-party React component code leaked into the root bundle.
- When a dependency/config change affects root exports, verify both the library build and a Next/Turbopack consumer
  build
  that imports at least one core component and one affected component from the built package or tarball.
