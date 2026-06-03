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

### Package Artifacts

- After changing declaration excludes, Tailwind source detection, or package output names, inspect `bun pm pack
  --dry-run` and confirm Storybook-only files are not in the package unless intentionally kept.
- After changing declaration bundling or package type exports, confirm `dist` contains `nodzimo-ui.d.ts` and
  `client.d.ts`, does not contain `dist/src`, and that `package.json` `exports.types` points at the bundled files.
- Confirm `dist/styles.css` exists after `bun run build:all` when changing style build scripts or Tailwind setup.

### CSS Artifacts

- After changing Tailwind CSS entrypoints or source detection, verify both CSS artifacts directly:
    - Run `bun run build:css` and confirm `dist/styles.css` contains library foundation/component classes such as
      `.nui-surface`, `bg-nui-primary`, and `focus-visible:ring-nui-ring`.
    - Confirm `dist/styles.css` does not contain story-only preview utilities from colocated stories or design labs,
      such as `gap-10`, `gap-20`, `rounded-nui-4xl`, `bg-pink-300`, `min-h-screen`, or `items-end`, unless one of those
      classes is intentionally used by production source.
    - Run `bun run storybook:build` and confirm `storybook-static/assets/iframe-*.css` does contain needed story and
      preview utilities such as design-lab gaps, preview padding, and NUI foundation classes.

### Built JS Inspection

- Inspect `dist/nodzimo-ui.js` and `dist/client.js` after build changes that affect React Compiler or entrypoints.
- For root/RSC-safe output, inspect `dist/nodzimo-ui.js` for accidental client or third-party leaks:
  `rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/nodzimo-ui.js`.
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

- For Next/Turbopack consumer checks, install the published `@sefo/nodzimo-ui` package in the Next app. Use tarball
  testing only when validating changes before publication.
- If a client component fails in Next with compiler runtime errors, check whether `"use client";` is present in the
  built client entry.
- If a core component fails in a Server Component context, check whether `react/compiler-runtime`, `createContext`,
  `useContext`, `@base-ui/react`, or inlined third-party React component code leaked into the root bundle.
- When a dependency/config change affects root exports, verify both the library build and a Next/Turbopack consumer
  build
  that imports at least one core component and one affected component from the built package or tarball.
