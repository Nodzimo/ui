# Public Declaration Leak Incident: Internal Import Resolution

This record owns the declaration-only failure mechanism, its repair, and the distinction between public prop
contracts and declaration bundling. The filename is retained for existing links. JavaScript behavior and the
root/client runtime boundary did not change.

## Symptoms And Earlier Adaptation

The earlier Calendar and Input Group investigation found a private Button implementation, including JSX, in
`dist/client.d.ts`. The affected source reused the local component through `ComponentProps<typeof Button>`.
The recorded source captures were `f1bd637` and `ba5e106` for Calendar on August 15, 2026, followed by `ad0c430`
and `9bb3d73` for Input Group. Replacing those queries with exported `ButtonProps` removed that observed
manifestation and established a useful named public contract.

The later strict declaration check still found an invalid CVA implementation:

```text
export declare type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;
declare type ButtonProps_2 = ButtonPrimitive.Props & VariantProps<typeof buttonVariants_2>;
declare const buttonVariants_2 = cva(...);
```

The real output included the full call, not the illustrative ellipsis. TypeScript reported `TS2304` for missing
`cva` and `TS1254` for an executable initializer in an ambient declaration. Calendar, Input Group, and Alert Dialog
reached the private duplicate contract.

Both `ComponentProps<typeof Button>` and `VariantProps<typeof buttonVariants>` are valid TypeScript. CVA documents
the latter and the official shadcn Base UI Button uses it. Neither construct is inherently incompatible with a
library. The earlier explanation that a component type query necessarily causes leakage was too broad. The old
build was not replayed, so identical root causes for both historical manifestations are not independently proven.

## Confirmed Failure Mechanism

The source import map deliberately points to source barrels:

```text
#client/components/button -> src/client/components/button/index.ts
```

TypeScript emitted correct intermediate Button declarations. However, an intermediate Input Group declaration
retained `import { type ButtonProps } from '#client/components/button'`. Resolving that specifier from the emitted
directory consulted `package.json#imports` and returned the original source barrel.

```text
source components -> correct intermediate declarations
    -> unchanged #client import resolves back to src
    -> API Extractor sees declarations and implementations together
    -> duplicate symbols and executable implementation in client.d.ts
```

The missing integration was internal import conversion before declaration rollup. Source barrels, relative imports
within an implementation area, component reuse, and separate core/client entrypoints did not need replacement.
Declaration analysis must consume emitted declarations rather than re-enter `src`.

## Accepted Build Configuration

`vite.config.ts` derives `declarationPaths` from the existing `package.json#imports` map. Each string target becomes
the single-element array expected by TypeScript `paths`. The full snippet belongs in
[Vite Build Notes](vite-build-notes.md).

Pass this as `dts.compilerOptions.paths`, beside `rootDir: 'src'`. The plugin's default `pathsToAliases: true`
performs the declaration import transformation; do not restate that default. These options are local to declaration
generation. Source resolution and runtime imports remain unchanged.

This is supported plugin path processing, not a hand-maintained second map or custom rewrite algorithm.
`<string[]>` checks converted values and avoids `Object.fromEntries`' default `any` value type. The plugin checks the
resulting compiler option, so an extra `CompilerOptions` import and `satisfies` layer are unnecessary.

Git history records declaration generation in `4aedc1a` on May 10, 2026, the source import map in `65ebfe1` on
May 12, and `bundleTypes` in `6148ad4` on May 15. The reviewed configuration history did not show a previously
implemented alias conversion being removed. These dates establish integration order, not the first failing build.

## Verification Evidence

The controlled investigation emitted declarations and invoked the installed API Extractor in memory. Source
components and types were identical; only internal declaration import specifiers changed.

| Observation                                  | Unconverted internal imports | Relative declaration references |
|----------------------------------------------|------------------------------|---------------------------------|
| Project source files in declaration analysis | 10                           | 0                               |
| Private duplicate ButtonProps                | Present                      | Absent                          |
| Executable cva call                          | Present                      | Absent                          |
| Strict declaration diagnostics               | TS2304, TS1254               | None                            |

The final plugin configuration passed the real `bun run build`, including `check:dist-types`, with `unplugin-dts`
1.0.3, API Extractor 7.58.12, and TypeScript 6.0.3. JavaScript artifacts were byte-identical before and after the fix.
A separate TypeScript check compared source and bundled `ButtonProps`, `CalendarProps`, `InputGroupButtonProps`,
`AlertDialogActionProps`, and `AlertDialogCancelProps`; all matched. Nullable Button variants remained accepted and
an unknown variant remained rejected.

Review of published `unplugin-dts` 1.1.2 did not establish automatic conversion of this import map. Nearby alias and
declaration-graph fixes were not proof that upgrading alone repairs this case. The fix works on installed versions;
dependency updates remain a separate review.

## Public Type Contract Decision

Retain exported `ButtonProps` and reuse it in local components. Calendar uses `ButtonProps['variant']`; Input Group
uses `Omit<ButtonProps, 'size' | 'type'>` with its additional options. This is intentional public API design, not a
workaround to revert after fixing the build.

External primitives may use `ComponentProps<typeof Primitive>`, and local CVA helpers may use
`VariantProps<typeof variants>`. Native element props, external contracts, and story-only argument extraction remain
valid utility-type uses. Do not replace inferred variants with handwritten unions to hide resolution failures.
Named props improve component reuse but cannot substitute for a correct declaration graph and artifact validation.

## Automatic Gate And Its Limits

Source TypeScript, JavaScript, and Storybook checks passed without an obligatory check of generated declarations.
Consumer `skipLibCheck: true` could also hide these ambient errors. Skill instructions and emitted `.d.ts` files
were not an automatic build gate.
The source configs also did not previously enable `strict`; enabling it now improves source verification but cannot
check an artifact that is not an input to that source project.

`check:dist-types` now runs `tsc --project tsconfig.dist.json` on both ready-built declaration entries with
`skipLibCheck: false`. `build`, `build:all`, and `project:verify` invoke it after generation. Source checks retain
`strict: true` with `skipLibCheck: true` so development tools' internal declarations do not block source verification.
See [Verification](verification.md) for config responsibilities and [Scripts](scripts.md) for command ordering.

The gate checks declarations and reachable dependencies in the bundler/React environment. It does not prove tarball
contents, export-map resolution in every consumer environment, runtime/RSC behavior, or unreachable files. Keep
focused consumer and package checks. Standalone `build:js`, packing, and publishing do not acquire this guarantee.

## Review Rules

1. Preserve one source of truth for internal paths and follow [Internal Package Imports](internal-package-imports.md).
2. Prefer named public props for local component reuse; do not blame valid utilities for resolver failures.
3. Build declarations and run `check:dist-types` before accepting declaration or public type changes.
4. Reject implementation bodies, JSX, executable calls, and source-only paths in public `.d.ts` output.
5. When duplication returns, inspect intermediate declarations and resolved targets before changing components,
   suppressing errors, patching generated output, or replacing the bundler.
6. Compare public contracts and runtime artifacts after declaration-config changes; validate packed public imports
   when exports or consumer integration are affected.

## References

- [TypeScript imports and self-name resolution](https://www.typescriptlang.org/docs/handbook/modules/reference.html#packagejson-imports-and-self-name-imports)
- [unplugin-dts options](https://github.com/qmhc/unplugin-dts/blob/main/docs/en/options.md): compiler options and path
  aliases
- [unplugin-dts changelog](https://github.com/qmhc/unplugin-dts/blob/main/packages/unplugin-dts/CHANGELOG.md): the
  reviewed
  1.1.2 release includes nearby fixes, not an established automatic repair for this project's import map
- [API Extractor declaration rollup](https://api-extractor.com/pages/setup/configure_rollup/)
- [CVA TypeScript contracts](https://cva.style/getting-started/typescript/)
- [shadcn Base UI Button source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/button.tsx)
- [shadcn Base UI Calendar](https://ui.shadcn.com/docs/components/base/calendar)
- [unplugin-dts issue #404](https://github.com/qmhc/unplugin-dts/issues/404): related duplicate-type/import symptoms,
  not a verified reproduction of this project's import-map failure
