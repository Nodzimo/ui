## Tailwind Consumer Theme Integration Decision

### Problem

Nodzimo UI originally kept raw runtime tokens and Tailwind `@theme inline` mappings together in `src/library.css`.
Library and Storybook development worked because their Tailwind compilers read that source file directly. The published
package exposed only the compiled `dist/styles.css`, however, and compilation consumed the `@theme` directives.

The package therefore shipped values such as `--nui-card` but not the compiler metadata that makes `nui-card` a
Tailwind color. `dist/styles.css` contained only utility classes detected in the UI-kit source. `bg-nui-background`
worked because the library used it; `bg-nui-card`, `ring-nui-ring`, `gap-nui-md`, and other valid token-derived classes
were absent when no package component happened to use them.

In the Next consumer this produced three related symptoms:

- WebStorm autocomplete suggested only NUI utilities already present in the compiled package CSS.
- Consumer-authored classes such as `bg-nui-card` produced no CSS.
- Tailwind failed on `@apply` for an unknown NUI utility, including application base styles that attempted to use NUI
  colors.

The consumer import order was correct, and raw `--nui-*` variables were present. The missing contract was compiler
metadata, not runtime values, Next.js behavior, CSS cascade, or package installation.

### Root Cause

Tailwind generates utilities from detected class names and the theme variables known to the compiler performing that
build. A compiled stylesheet can preserve generated rules and ordinary CSS variables, but it cannot teach a different
Tailwind compiler about `@theme` directives that have already been consumed.

The earlier verification checked that runtime variables and already-generated component classes survived the package
build. It did not compile a consumer-only NUI class that was absent from UI-kit source. That acceptance gap allowed the
runtime token contract to pass while the consumer Tailwind contract remained incomplete.

### Decision

Nodzimo UI publishes two explicit CSS surfaces:

- `@nodzimo/ui/styles.css` points to compiled `dist/styles.css`. Browsers receive ready-built component styles,
  runtime `--nui-*` values, animations, and opt-in foundation classes. It contains no Preflight.
- `@nodzimo/ui/theme.css` points to uncompiled `src/theme.css`. Tailwind consumers receive `@theme inline` mappings and
  the class-based `dark` variant needed to generate application-owned NUI utilities.

`src/library.css` imports `src/theme.css`, so library CSS, Storybook, and consumers share one mapping source rather than
maintaining copies. Raw light/dark values remain in `src/library.css` and therefore in compiled `styles.css` at runtime.

The compiler input is intentionally published from `src` instead of being copied into `dist`:

- It is a source artifact by contract, not unfinished runtime output.
- Running it through Tailwind would remove the directives the consumer needs.
- Copying identical bytes into `dist/theme.css` would add a script and a stale-copy failure mode only to make the path
  resemble runtime artifacts.
- `package.json#files` includes exactly `src/theme.css`, while `package.json#exports` exposes only the stable public
  alias `@nodzimo/ui/theme.css`. The remaining source tree stays unpublished and inaccessible through package exports.

### Consumer Contract

Import ready-built component CSS once at the Next application root, before application globals:

```text
import '@nodzimo/ui/styles.css'
import './globals.css'
```

Import Tailwind and then the NUI compiler theme at the top of the application global stylesheet:

```text
@import "tailwindcss";
@import "@nodzimo/ui/theme.css";
```

Application `@theme`, `@layer base`, and other global rules follow those imports. This order gives the consumer one
consumer-owned Preflight, registers NUI mappings with the same Tailwind compilation, and leaves application overrides
after the library runtime stylesheet.

Non-Tailwind consumers import only `@nodzimo/ui/styles.css`. They receive ready-built components and raw runtime tokens
without loading compiler-only `@theme` metadata.

After integration, consumer markup and CSS may use the full token-driven Tailwind API on demand:

```text
bg-nui-card
bg-nui-border
text-nui-card-foreground
ring-nui-ring
rounded-nui-4xl
gap-nui-md
hover:bg-nui-accent/80
focus-visible:ring-nui-ring/50
dark:text-nui-sidebar-foreground
```

`@apply decoration-nui-primary` and other valid token-derived utilities also work because the consumer compiler now
knows the NUI theme namespace.

### What Each Artifact Contains

| Surface                                     | Read by                    | Contains                                                                              | Does not contain                                                  |
|---------------------------------------------|----------------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `dist/styles.css`                           | Browser                    | Compiled component utilities, raw token values, animations, opt-in foundation classes | Preflight, every possible token utility                           |
| `src/theme.css` via `@nodzimo/ui/theme.css` | Consumer Tailwind compiler | `@theme inline` mappings, class-based `dark` variant                                  | Tailwind import, Preflight, raw token values, generated utilities |
| Storybook iframe CSS                        | Storybook browser          | Story/component utilities, raw token values, Storybook-owned Preflight                | Consumer package runtime contract                                 |

### Alternatives Rejected

- **Safelist every token utility and variant in `styles.css`.** Rejected because color, radius, and spacing namespaces
  combine with many utility families, opacity forms, and variants. The result would be a manually maintained partial
  Tailwind compiler with unnecessary CSS growth.
- **Ship only compiled `styles.css`.** Rejected because consumer Tailwind cannot derive utilities that were not already
  generated by the library build.
- **Ship the entire library CSS as Tailwind source.** Rejected because consumers would have to compile package
  components, scan dependency code, resolve library-only CSS sources, and remain coupled to the library build toolchain.
- **Compile `theme.css`.** Rejected because compilation consumes the `@theme` metadata that gives the consumer its NUI
  utility namespace.
- **Mix compiler directives into compiled `styles.css`.** Rejected because it combines browser output and compiler
  input, makes non-Tailwind behavior ambiguous, and requires the runtime artifact to be processed again.
- **Copy unchanged `theme.css` into `dist`.** Rejected because it adds build/watch synchronization for identical bytes
  without improving the public API; package exports already hide the internal source location.
- **Create a JavaScript Tailwind plugin.** Rejected because CSS-first `@theme` is sufficient for mappings and variants.
  A plugin would add executable configuration and version surface without a capability needed by the current contract.
- **Publish a standalone reset variant.** Rejected independently by the
  [Preflight ownership decision](tailwind-preflight-ownership-decision.md); the consumer owns global normalization.

### Accepted Trade-Off

A consumer may generate a utility that also exists in ready-built component CSS, producing a small identical-rule
overlap. Eliminating every overlap would require a separate Tailwind-native mode in which the consumer compiles all
library component styles and omits `styles.css`. That would materially increase setup and version coupling, so the
current minimal-integration contract accepts limited utility overlap while keeping component rendering independent of
consumer source scanning.

This overlap is not equivalent to the former duplicated Preflight: it is local to utilities the application actually
uses, does not introduce a second global reset, and does not change unscoped document elements.

### Reasoning Failures To Avoid

- Do not equate presence of `--nui-card` with availability of `bg-nui-card`. A raw runtime variable, a Tailwind theme
  mapping, and a generated utility class are three different artifacts.
- Do not validate public theme completeness only with classes already used by package components. Compile at least one
  consumer-only class through the published theme entrypoint.
- Do not assume compiled CSS can configure a later Tailwind build. Once the library compiler consumes `@theme`, another
  compiler cannot recover those mappings from the generated rules.
- Do not treat one deliberately published CSS source file as publication of the source tree. Check the package whitelist
  and public export map instead of inferring the boundary from the physical target path.
- Do not force compiler input into `dist` merely for path uniformity. Add a build/copy artifact only when a real
  transformation or packaging constraint requires it.
- Establish which tool reads each file before combining or compiling it: browsers consume `styles.css`; consumer
  Tailwind consumes `theme.css`.

### Evidence

The library-side integration test compiled an isolated Tailwind input with automatic source detection disabled and the
public `@nodzimo/ui/theme.css` export. It generated previously absent colors, borders, rings, fills, strokes, radius,
spacing, opacity forms, hover, focus-visible, and class-based dark variants.

Package inspection confirmed that the npm artifact contains compiled `dist/styles.css` and exactly
`src/theme.css`; no copied `dist/theme.css` or broader `src` tree is required.

Published version 0.0.14 was then installed in the Next consumer. The consumer confirmed working autocomplete,
consumer-authored NUI classes, generated styles, and `@apply` for NUI utilities in application global CSS.

### External References

- Tailwind documents `@theme` as the mechanism that defines which utility APIs exist:
  <https://tailwindcss.com/docs/theme>.
- Tailwind's shared-theme guidance publishes a CSS theme file and imports it into each consumer project:
  <https://tailwindcss.com/docs/theme#sharing-across-projects>.
- Tailwind documents that utilities are generated from detected class names and that ignored dependencies require an
  explicit source contract when their source must be
  scanned: <https://tailwindcss.com/docs/detecting-classes-in-source-files>.
- daisyUI demonstrates the broader industry pattern of registering a library with the consumer Tailwind compiler via a
  plugin rather than assuming compiled CSS teaches Tailwind new APIs: <https://daisyui.com/docs/install/>.
- Flowbite's Tailwind 4 setup separately registers theme variables, its plugin, and dependency source:
  <https://flowbite.com/docs/getting-started/quickstart/>.

For the active rules, see [Tailwind And Styles](tailwind-and-styles.md#consumer-tailwind-theme). For repeatable checks,
see [Verification](verification.md#css-artifacts).
