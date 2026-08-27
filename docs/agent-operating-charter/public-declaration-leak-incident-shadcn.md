# Public Declaration Leak Incident: shadcn Component Type Queries

This incident records a library-boundary failure found after a Vite TypeScript consumer imported the published client
declarations. It is distinct from the runtime React/RSC incidents: JavaScript bundles remained valid, while the bundled
TypeScript declaration artifact became invalid source code.

## Summary

The official shadcn Calendar source uses this application-oriented pattern:

```text
buttonVariant?: React.ComponentProps<typeof Button>['variant']
```

The pattern is valid in a shadcn application, where `Button` and `Calendar` remain application source and no public
declaration rollup is emitted. It is unsafe as an unreviewed pattern at a publishable NUI declaration boundary. The NUI
declaration bundler resolved a local component value and emitted part of its implementation into `dist/client.d.ts`,
including JSX. A consuming TypeScript project then failed to parse the `.d.ts` file with syntax errors.

The official source evidence is the [shadcn Base UI Calendar page](https://ui.shadcn.com/docs/components/base/calendar),
which documents the `ComponentProps<typeof Button>` form in its source and changelog examples. This is not evidence that
shadcn's application code is defective; it is evidence that source capture must be followed by a library declaration
adaptation pass.

## NUI Timeline

The pattern entered this repository with the Calendar source capture:

```text
f1bd637 feat(calendar): add base component       2026-08-15
```

It was retained while the public contract was extracted in:

```text
ba5e106 feat(calendar): expose public API        2026-08-15
```

The same class of pattern entered later through Input Group:

```text
ad0c430 feat(client): add input group component  2026-08-17
9bb3d73 feat(client): expose input group part types
```

The public API commits did not invent a new runtime behavior. They made copied implementation types visible to the
declaration bundler by placing them in exported prop aliases. The defect was latent until an external consumer parsed
the published `dist/client.d.ts`.

## Failure Mechanism

`ComponentProps<typeof Button>` is not the same kind of dependency as `ButtonProps`:

```text
ComponentProps<typeof Button>
        ↓
resolve the value symbol and call signature of local Button
        ↓
declaration bundler serializes the value-linked type
        ↓
private implementation can be copied into the declaration rollup
```

The failure does not pull `Button` into `dist/client.js`. It occurs only while producing the type artifact. The bad
output looked conceptually like this:

```text
declare function Button_3(props: ButtonProps) {
    return <ButtonPrimitive />
}

export type InputGroupButtonProps = Omit<
    ComponentProps<typeof Button_3>,
    'size' | 'type'
>
```

JSX and function bodies are illegal in a `.d.ts` file. A library's own `tsc --build` can still pass because it checks
the source project rather than asking an independent consumer to parse the generated declaration rollup.

An explicit public type alias has a different boundary:

```ts
import {Button, type ButtonProps} from '#client/components/button'

type InputGroupButtonProps = Omit<ButtonProps, 'size' | 'type'> & {
    size?: InputGroupButtonSize
    type?: 'button' | 'submit' | 'reset'
}
```

`ButtonProps` is a type contract. The `import type` is erased from JavaScript, and declaration bundling can serialize
the contract without traversing the local React function implementation. The public prop meaning is unchanged.

## Correct Library Rule

At a public type boundary, do not derive a NUI component's props through the value of another local NUI React component:

```ts
// Do not use for local NUI components in exported or declaration-reachable types.
type Props = ComponentProps<typeof Button>
```

Use the component's explicit public prop contract instead:

```ts
type Props = ButtonProps
```

This is not a ban on every `typeof` type query. Queries against native elements, external primitives, and external
library declarations can remain appropriate when their contract is intentionally inherited. Review local component value
queries specifically because the library owns and bundles those implementations.

## Affected NUI Examples

Calendar now uses:

```ts
type CalendarProps = ComponentProps<typeof DayPicker> & {
    buttonVariant?: ButtonProps['variant']
}
```

`DayPicker` is an external primitive contract; `ButtonProps` is the local NUI contract.

Input Group now uses:

```ts
type InputGroupButtonProps = Omit<ButtonProps, 'size' | 'type'> & {
    size?: InputGroupButtonSize
    type?: 'button' | 'submit' | 'reset'
}
```

Dropdown Menu has a different, valid reuse case:

```ts
type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
    Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

type DropdownMenuSubContentProps = DropdownMenuContentProps
```

This is a type-to-type alias, not a value-to-type query and not a duplicated object definition. It keeps one canonical
structural contract while giving the separately exported `SubContent` part a semantic public name. Its defaults differ
at runtime, but its accepted prop shape is intentionally shared. If a future `SubContent`-only prop appears, the alias
can be extended without duplicating the base contract.

## Why Existing Checks Missed It

- Source `tsc --build` validated the authoring project, not the generated public declaration text.
- Vite validated JavaScript and did not parse `.d.ts` files as a consumer would.
- Storybook compiled stories and runtime bundles, but Storybook is not a substitute for package declaration consumption.
- Bundle scans correctly looked for React/RSC and CommonJS runtime leaks, but this incident was a type-artifact leak.
- The original shadcn source was treated as an application implementation reference without a separate
  publishable-library declaration review.

The missing proof was an actual external TypeScript consumer check against the built package or tarball. A declaration
file existing, being emitted, or being referenced by `exports.types` is not proof that it is valid consumer input.

## Required Review Procedure

For every new or adapted component, especially a component that reuses another NUI component:

1. Search production source (excluding stories) for `ComponentProps<typeof`, `ComponentPropsWithRef<typeof`,
   `ComponentRef<typeof`, `ReturnType<typeof`, and `Parameters<typeof`.
2. Classify each target as native element, external primitive, local NUI component, or local helper.
3. Replace local component value queries at exported/declaration-reachable boundaries with explicit exported `XxxProps`
   contracts. Use `import type` for the contract.
4. Build the library declarations through the real Vite/Rolldown declaration pipeline.
5. Inspect `dist/ui.d.ts` and `dist/client.d.ts` as a real external consumer, preferably by running the current Vite
   consumer's typecheck against a fresh package build or tarball.
6. Reject any declaration containing implementation syntax: JSX, function bodies, executable statements, or private
   local component implementations.
7. Repeat the check after public API extraction, decomposition, barrel changes, and dependency or declaration-tooling
   updates.

The package-boundary audit must report this separately from JavaScript runtime leak checks. A clean `dist/ui.js` or
`dist/client.js` does not prove that the corresponding declaration artifact is consumable.

## Decision

The NUI best practice is explicit public type contracts for local component reuse, with type-only imports where
possible, plus external consumer verification of the generated declaration entrypoints. Do not patch generated `.d.ts`
output, do not disable declaration bundling, and do not widen the rule into a blanket prohibition on all TypeScript
`typeof` queries.
