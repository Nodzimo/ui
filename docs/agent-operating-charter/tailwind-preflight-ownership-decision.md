## Tailwind Preflight Ownership Decision

### Problem

The package stylesheet previously used full `@import "tailwindcss" source(none)`. In Tailwind CSS 4, that import
includes theme, Preflight, and utilities. Tailwind CLI therefore compiled a complete document-wide Preflight into the
published `dist/styles.css` alongside the NUI component classes.

The audited Next consumer also imported full Tailwind in its application stylesheet and separately imported
`@nodzimo/ui/styles.css`. Its production CSS consequently contained two byte-identical Preflight blocks: one owned by
the application and one inherited from the package. Both sides used Tailwind 4.3.2 during the audit, but matching
versions only made the duplication identical; it did not make the ownership correct.

The compressed size cost was secondary. The package reset also targeted unscoped consumer elements, made global output
sensitive to import order, could diverge when package and consumer Tailwind versions differed, and contradicted the
existing opt-in contract for broad NUI foundation behavior.

### Decision

- The consumer owns the document-wide reset and imports it once through Tailwind Preflight or another chosen reset.
- Published `@nodzimo/ui/styles.css` contains compiled NUI component styles, theme mappings, runtime tokens, animations,
  generated utilities, and opt-in foundation classes, but no Preflight.
- Nodzimo UI is primarily developed for and visually verified in current Tailwind applications. This is the intended
  baseline, not a requirement that consumers use Tailwind to compile package components.
- A non-Tailwind consumer may import the same ready-built package stylesheet and choose another reset. Nodzimo UI does
  not guarantee normalization for a reset-free document, an arbitrary reset, or conflicting host global CSS.
- Storybook remains a separate Tailwind application. Its preview stylesheet intentionally includes Preflight so it
  represents the primary consumer baseline without placing that reset in the published package artifact.

The implementation uses Tailwind's explicit imports and omits only `tailwindcss/preflight.css`:

```text
@layer theme, base, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) source(none);
@import "./library.css";
```

This does not remove Tailwind-generated component styling. Tailwind remains the library's build-time compiler, and the
generated utilities still ship in `dist/styles.css`. Build-time style generation and runtime reset ownership are
separate concerns.

### Alternatives Rejected

- **Keep full Tailwind in the package.** Rejected because it preserves duplicate global ownership, unscoped consumer
  mutations, and order/version coupling.
- **Publish default and standalone stylesheets.** Rejected for the current product contract because a library-owned
  reset mode is not required. A second public entrypoint would add an API and documentation branch without serving the
  primary consumer workflow.
- **Scope Preflight to NUI components.** Rejected because Tailwind does not expose Preflight as a component-scoped
  switch. Rewriting its selectors would create library-owned wrapper, portal, inheritance, and specificity semantics
  that upstream Tailwind does not maintain.
- **Handwrite component resets or a mini-Preflight.** Rejected because it would fork upstream normalization behavior and
  create a second reset implementation for Nodzimo UI to maintain.
- **Solve it with `important`, `theme(static)`, `theme(inline)`, or a Tailwind prefix.** Rejected because these features
  control utility specificity, theme emission or aliasing, and namespace collisions. They do not change who owns the
  document reset. Existing targeted `@theme inline` mappings in `src/library.css` remain intentional.

### Verification Evidence

The implementation was checked from the library side before publication:

- The previous built stylesheet contained the Tailwind HTML, universal box-model, form-control, and media reset rules.
- Rebuilding `src/styles.css` reduced `dist/styles.css` from 28,202 to 24,324 bytes: 3,878 raw bytes, 1,077 gzip bytes,
  and 947 Brotli bytes removed.
- The complete class-selector inventory remained 194 before and after the change, with no missing or added classes.
- All 40 NUI variables remained present.
- `nui-surface`, `nui-boundaries`, `nui-interactive`, semantic utilities, focus utilities, and the safe-listed
  `nui-animate-paused` variants remained present.
- Preflight signatures were absent from the rebuilt package stylesheet, and Storybook-only utilities remained absent.
- The Storybook production build retained its own Preflight, NUI classes, and story-only utilities.
- TypeScript, Vite library build, Tailwind CSS build, Biome, dependency-cruiser, package dry-run, and Storybook
  production
  build completed successfully.

A consumer production build is still the final integration check after installing the released package. If the
consumer imports one application-owned Tailwind Preflight and the package artifact contains none, the former duplicate
cannot originate from Nodzimo UI.

### Reasoning Failures To Avoid

- Do not infer stylesheet contents from the source import alone. Inspect the built package artifact and, when a
  duplicate is reported, the consumer production artifact.
- Do not conflate "components are designed and previewed on a Preflight baseline" with "the package must publish that
  Preflight." The first describes the reference environment; the second assigns global runtime ownership.
- Establish the supported consumer contract before proposing universal modes. Nodzimo UI's primary Tailwind workflow
  does not justify standalone reset entrypoints, Shadow DOM, or compatibility machinery for every possible host.
- Do not jump from "Preflight is global" to maintaining a scoped or handwritten substitute. First decide whether the
  package should own a reset at all; here it should not.
- Treat global CSS as an ownership boundary. Component styling belongs to the library, application normalization belongs
  to the consumer, and opt-in NUI foundation classes remain explicitly controlled by the consumer.

For the active stylesheet rules, see [Tailwind And Styles](tailwind-and-styles.md#preflight-ownership). For repeatable
artifact checks, see [Verification](verification.md#css-artifacts).
