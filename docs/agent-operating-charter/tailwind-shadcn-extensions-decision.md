## Tailwind shadcn Extensions Decision

### Problem

Current shadcn components do not contain every Tailwind construct needed to compile their class strings. Shared compiler
definitions live in `shadcn/tailwind.css`. In particular, classes such as `data-open:animate-in`,
`data-closed:animate-out`, `data-checked:bg-*`, `data-disabled:opacity-50`, `data-horizontal:h-px`, and
`data-vertical:w-px` depend on named `@custom-variant` definitions.

Without those definitions, Tailwind can still compile explicit arbitrary variants such as
`data-[side=bottom]:slide-in-from-top-2`, but it cannot resolve shadcn's named variants. The class remains valid source
text while the expected CSS selector is missing from the artifact. This affected Base UI-backed components such as
Checkbox, Switch, Select, Dropdown Menu, and Separator.

The missing layer was initially easy to misdiagnose because three mechanisms appear together in generated shadcn source:

- `data-open:`, `data-checked:`, and similar names are runtime Tailwind variants defined by `shadcn/tailwind.css`.
- `cn-rtl-flip`, `cn-menu-target`, and other `cn-*` names are shadcn CLI transformation markers. They must be resolved
  while adapting source and are not implemented by this stylesheet.
- `animate-in`, `fade-in-*`, `zoom-in-*`, and `slide-in-*` are supplied separately by `tw-animate-css`. State selection
  and animation implementation are different compiler responsibilities.

### Registry Marker Transformation Pipeline

Registry component files are templates consumed by the shadcn CLI, not necessarily the final source produced by
`add`. The CLI applies its transformers in a defined order and runs generic cleanup last:

```text
import -> RSC -> CSS variables -> Tailwind prefix -> icons -> menu -> as-child -> RTL -> font -> cleanup
```

The final cleanup removes every `cn-*` token except `cn-font-heading`. Therefore, a residual `cn-*` class in manually
ported NUI source is a defect until it has been classified; it is never evidence that `tailwind-extensions.css` needs a
new runtime rule.

| Registry marker                                                                                                                      | Upstream transform result                                                        | NUI porting action                                                                    |
|--------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| `cn-rtl-flip`                                                                                                                        | `rtl:rotate-180`                                                                 | Replace at an inline-directional icon usage site.                                     |
| `cn-font-heading`                                                                                                                    | `font-heading` only when the target supports `--font-heading`; otherwise removed | Replace with `font-nui-heading` under NUI's optional heading-font contract.           |
| `cn-menu-target`                                                                                                                     | Removed, or `dark` for the CLI's inverted menu modes                             | Resolve only while porting the affected menu configuration; do not define CSS for it. |
| `cn-menu-translucent`                                                                                                                | Removed, or expanded to the CLI's configured translucent-menu utility set        | Resolve only when that menu mode is deliberately supported and tested.                |
| Any other `cn-*` token, including `cn-calendar`, `cn-calendar-caption`, `cn-calendar-caption-label`, and `cn-calendar-dropdown-root` | Removed by generic cleanup                                                       | Remove it. Do not create a NUI utility, selector, token, or extension for it.         |

The Calendar template makes the distinction concrete: its caption and dropdown `cn-calendar-*` labels are inert cleanup
markers, while its chevron `cn-rtl-flip` has a specific RTL replacement. NUI retains neither type verbatim. The latter
becomes a real Tailwind utility; the former disappears.

`src/tailwind-extensions.css` remains limited to upstream Tailwind compiler extensions such as `@custom-variant` and
`@utility`. It does not and must not emulate CLI source transformations. Adding `.cn-*` definitions there would hide a
bad port, publish template debris into compiled CSS, and diverge from shadcn's installed output.

#### Required Marker Audit For Every Port

1. Pin and record the selected upstream registry source and CLI revision when behavior is ambiguous.
2. Inventory every marker before adaptation: `rg -o '\bcn-[a-z-]+\b' <copied-source>`.
3. Apply the exact documented transform for `cn-rtl-flip`, `cn-font-heading`, or an applicable menu configuration.
4. Remove all remaining `cn-*` tokens; do not infer behavior from their names or implement custom CSS for them.
5. Before completing the pass, search the shipped component source for `\bcn-[a-z-]+\b`; it must have no matches.
6. Run the focused source checks and CSS build. Treat a compiled stylesheet as verification of real Tailwind utilities,
   not as a place to preserve template markers.

The authoritative implementation is deliberately linked rather than copied into this record, because the CLI may change
it. This audit references the current researched revision
[`d4fc45b`](https://github.com/shadcn-ui/ui/tree/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9):

- [transformer order in
  `dry-run.ts`](https://github.com/shadcn-ui/ui/blob/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9/packages/shadcn/src/utils/dry-run.ts)
- [generic marker cleanup](https://github.com/shadcn-ui/ui/blob/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9/packages/shadcn/src/utils/transformers/transform-cleanup.ts)
- [RTL marker and logical-layout transform](https://github.com/shadcn-ui/ui/blob/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9/packages/shadcn/src/utils/transformers/transform-rtl.ts)
- [conditional heading-font transform](https://github.com/shadcn-ui/ui/blob/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9/packages/shadcn/src/utils/transformers/transform-font.ts)
- [menu-mode transform](https://github.com/shadcn-ui/ui/blob/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9/packages/shadcn/src/utils/transformers/transform-menu.ts)
- [Calendar registry template](https://github.com/shadcn-ui/ui/blob/d4fc45b1fbabfccb7a6a4333d8004cf19481caa9/apps/v4/registry/bases/base/ui/calendar.tsx)

### Upstream Contract

Since shadcn 4, `init` adds `@import "shadcn/tailwind.css"` to the configured global Tailwind stylesheet. The official
`eject` command reads the same package file, replaces that import with its complete contents, annotates the installed
shadcn version, and removes the `shadcn` dependency. This establishes two supported upstream modes: retain the package
import or own a vendored snapshot.

The shared variants normalize state conventions used by both shadcn primitive families:

| Variant           | Selector contract                                                                     |
|-------------------|---------------------------------------------------------------------------------------|
| `data-open`       | Radix-style `[data-state="open"]` or truthy/present Base UI `[data-open]`             |
| `data-closed`     | Radix-style `[data-state="closed"]` or truthy/present Base UI `[data-closed]`         |
| `data-checked`    | Radix-style `[data-state="checked"]` or truthy/present Base UI `[data-checked]`       |
| `data-unchecked`  | Radix-style `[data-state="unchecked"]` or truthy/present Base UI `[data-unchecked]`   |
| `data-disabled`   | `[data-disabled="true"]` or present `[data-disabled]`, explicitly excluding `"false"` |
| `data-selected`   | `[data-selected="true"]`                                                              |
| `data-active`     | `[data-state="active"]` or truthy/present `[data-active]`                             |
| `data-horizontal` | `[data-orientation="horizontal"]`                                                     |
| `data-vertical`   | `[data-orientation="vertical"]`                                                       |

Base UI deliberately exposes presence-based state attributes such as `data-open`, `data-closed`, `data-checked`,
`data-unchecked`, and `data-disabled`. The shared variants are therefore not decorative aliases; they connect shadcn
class strings to the primitive's actual DOM contract. They do not replace every data selector. Ordinary Tailwind forms
such as `data-[side=bottom]:*`, `data-[variant=destructive]:*`, and the presence form `data-indeterminate:*` remain
valid where no shared alias exists.

### Decision

- Vendor the complete upstream `packages/shadcn/src/tailwind.css` as `src/tailwind-extensions.css`.
- Keep the vendored CSS free of local provenance comments so it remains directly comparable with upstream.
- Record its pinned provenance here: shadcn `4.16.0`, commit
  `3150ac35a62e767eba39cc90730e9daeaa5be76f`, and the
  [corresponding upstream source](https://github.com/shadcn-ui/ui/blob/3150ac35a62e767eba39cc90730e9daeaa5be76f/packages/shadcn/src/tailwind.css).
- Preserve it as one upstream-owned source unit. Project formatting and declaration ordering may differ, but utilities,
  variants, keyframes, properties, selectors, and behavior must remain complete.
- Import it once from `src/library.css`, between `tw-animate-css` and `theme.css`.
- Treat it as private build input, not as a public NUI stylesheet or consumer Tailwind contract.
- Update it deliberately by comparing a new pinned upstream snapshot; no automatic shadcn dependency update owns it.

The vendored source is licensed under the MIT License: Copyright © 2023 shadcn. The
[pinned upstream license](https://github.com/shadcn-ui/ui/blob/3150ac35a62e767eba39cc90730e9daeaa5be76f/LICENSE.md)
contains its complete terms; the repository root `LICENSE` contains the same MIT permission and warranty terms. This
notice lives in the shipped decision record instead of being duplicated in the CSS snapshot.

### Build And Publication Boundaries

The shared import graph is:

```text
src/tailwind-extensions.css
          |
          v
   src/library.css
      /         \
     v           v
src/styles.css   .storybook/preview.css
     |                    |
     v                    v
dist/styles.css  storybook-static/assets/iframe-*.css
```

`src/styles.css` scans production source and excludes stories, so the package artifact emits component classes and their
used state variants without story-only utilities or Preflight. Storybook imports the same `library.css` but scans
stories and preview source and intentionally includes its application-owned Preflight.

Tailwind handles the vendored constructs by kind:

- `@custom-variant` registers a compiler transformation. It emits no standalone runtime rule; a concrete selector is
  generated only when scanned source uses that variant.
- `@utility` registers CSS-first utilities. Unused utilities such as `no-scrollbar` and `scroll-fade` are not emitted.
- Plain rules and registration at-rules can remain even without a matching class. The current full source retains a
  small set of `@property` declarations and the reduced-motion `.shimmer` fallback.
- The minified artifact contains concrete selectors, not the raw import, `@custom-variant`, or `@utility` directives.

The raw file is excluded from npm by the package whitelist. Consumers receive `dist/styles.css`, which already contains
the selectors required by NUI components, and the separate public `src/theme.css` compiler mapping. They do not install
shadcn, import this file, or ask their Tailwind compiler to scan NUI component source. The extension is intentionally
absent from `@nodzimo/ui/theme.css`; using shadcn's named variants in consumer-authored classes is not part of the NUI
theme-token API.

### Alternatives Rejected

- **Depend on `shadcn` and import `shadcn/tailwind.css`.** This is the simplest application setup, but it adds a CLI,
  registry, transformation, project-scaffolding, and dependency tree to a UI-kit build for one CSS export. It also
  couples package installation to upstream updates that can silently change compiled NUI output.
- **Run `shadcn init` and then `shadcn eject`.** The command is designed around a consumer project with
  `components.json` and one configured global stylesheet. Its effective CSS result is still a full copy. Running that
  application workflow would add transient dependency and configuration churn without improving the vendored result.
- **Copy only the variants used today.** This reduces source lines but makes each new shadcn component responsible for
  rediscovering shared compiler dependencies. The likely component coverage is broad, and partial ownership creates
  drift precisely where Radix and Base UI normalization is valuable.
- **Replace named variants with arbitrary selectors per component.** This duplicates selector semantics, lengthens class
  lists, loses the shared Radix/Base UI compatibility contract, and makes false/presence handling inconsistent.
- **Rewrite the file as NUI-owned helpers.** The file is declarative upstream CSS, not a runtime framework. A forked
  abstraction would create more maintenance surface than preserving the complete source and reviewing upstream diffs.
- **Publish the raw extension for consumers.** Consumers need compiled component CSS, not NUI's private shadcn
  compatibility layer. Publishing it would create a second Tailwind compiler API and versioning obligation unrelated to
  `theme.css`.

### Verification Evidence

The decision was verified against shadcn `4.16.0`, Tailwind CSS CLI `4.3.3`, and the installed Base UI `1.7.0`:

- Official shadcn source, package export metadata, CLI documentation, and `eject` implementation agree on the same
  `tailwind.css` contract.
- Base UI source and API declarations confirm the state and orientation data attributes used by current components.
- The complete local file was compared with the pinned upstream source after project formatting; only formatting and
  declaration ordering differ.
- `dist/styles.css` contains concrete `data-open`, `data-closed`, `data-checked`, `data-unchecked`, `data-disabled`,
  `data-horizontal`, and `data-vertical` selectors.
- It contains no raw `tailwind-extensions.css` import, `@custom-variant`, `@utility`, `no-scrollbar`, or `scroll-fade`
  utility selector. One reduced-motion `.shimmer` rule and the upstream registration properties remain.
- With the audited component source, production CSS measured 34,530 bytes minified and 6,075 bytes gzip without the
  extension, 38,010 bytes and 6,298 bytes with variants only, and 38,910 bytes and 6,454 bytes with the full file. The
  complete-source overhead beyond the necessary shared-variant layer is 900 minified bytes or 156 gzip bytes.
- Storybook's built iframe CSS contains the same state/orientation selectors plus its intentional story utilities and
  Preflight.
- `bun pm pack --dry-run` includes `dist/styles.css` and `src/theme.css` but excludes
  `src/tailwind-extensions.css` and the rest of the private `src` tree.
- TypeScript, Biome, dependency-cruiser, Vite library build, package CSS build, Storybook production build, built-JS
  boundary scans, and package dry-run completed successfully.

### Update Procedure

1. Read the current version from upstream `packages/shadcn/package.json` and select an exact commit.
2. Replace `src/tailwind-extensions.css` from the matching upstream `packages/shadcn/src/tailwind.css` without adding
   local comments.
3. Update the pinned version, commit, source, and license links in this decision record.
4. Format the file with project tooling. Compare all declarations and nested rules with upstream; do not review only a
   line diff because property sorting is expected.
5. Review new or removed `@custom-variant`, `@utility`, `@theme`, `@property`, plain selector, media, and RTL behavior.
6. Run `bun run build:css`, `bun run storybook:build`, and `bun pm pack --dry-run`.
7. Inspect both CSS artifacts for expected selectors, raw directives/import leakage, Preflight ownership, story-only
   leakage, and material size changes.
8. Audit existing and newly ported components for unresolved `cn-*` CLI markers separately; this file does not resolve
   them.

### External References

- [Official shadcn CLI `eject` documentation](https://ui.shadcn.com/docs/cli#eject)
- [Pinned upstream
  `tailwind.css`](https://github.com/shadcn-ui/ui/blob/3150ac35a62e767eba39cc90730e9daeaa5be76f/packages/shadcn/src/tailwind.css)
- [Pinned shadcn package export](https://github.com/shadcn-ui/ui/blob/3150ac35a62e767eba39cc90730e9daeaa5be76f/packages/shadcn/package.json)
- [Pinned
  `eject` implementation](https://github.com/shadcn-ui/ui/blob/3150ac35a62e767eba39cc90730e9daeaa5be76f/packages/shadcn/src/commands/eject.ts)
- [Pinned upstream MIT license](https://github.com/shadcn-ui/ui/blob/3150ac35a62e767eba39cc90730e9daeaa5be76f/LICENSE.md)
- [Tailwind functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Base UI styling and data attributes](https://base-ui.com/react/handbook/styling)
- [Base UI animation states](https://base-ui.com/react/handbook/animation)

For the active CSS entrypoint contract, see [Tailwind And Styles](tailwind-and-styles.md). For repeatable artifact
checks, see [Verification](verification.md#css-artifacts).
