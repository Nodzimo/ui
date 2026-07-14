## Select API

### Base UI Boundary

`Select` is a client-side compound component built on `@base-ui/react/select`. Preserve the Base UI root contract rather
than replacing it with a library-owned data-only API unless the project deliberately introduces a separate high-level
Select component.

Base UI accepts three `items` data shapes: a string-keyed label record, a readonly flat array of `{ label, value }`
objects, or a readonly array of groups. `undefined` comes from the optional `items` prop and is not a fourth data shape.
The upstream flat and grouped shapes use `any` for item values.

`items` is lookup metadata used by `SelectValue` to resolve a selected value to its label. It does not render popup
items. Consumers still compose `SelectItem` children, so the compound API cannot statically connect every child value
to the root value type.

### Flat Option Types

The client entrypoint exports the common flat shape as reusable consumer types:

```ts
type SelectOption<Value> = Readonly<{
    label: ReactNode
    value: Value
}>

type SelectOptions<Value> = readonly SelectOption<Value>[]
```

These types exist to prevent every consumer feature from redeclaring the same `{ label, value }` contract when data
crosses component props. `SelectOption` describes one flat option; `SelectOptions` describes the readonly collection.
The `Option` name is intentional: `SelectItem` already names the rendered compound subcomponent, while `items` also
covers records and groups.

Both immutability levels are intentional. `Readonly<...>` prevents mutation of an option's fields, and the readonly
array prevents mutation of the collection. `Value` has no default: Base UI accepts arbitrary value types, and consumers
should name their domain type explicitly rather than silently fall back to `string`.

Use the same exported collection type for prepared data and receiving props:

```ts
const localeOptions = routing.locales.map((locale) => ({
    label: translateLocale(locale),
    value: locale,
})) satisfies SelectOptions<Locale>

type LocaleSelectProps = {
    items: SelectOptions<Locale>
    value: Locale
}
```

A `SelectOptions<Locale>` value is structurally assignable to Base UI's broader flat-array branch. Passing it to
`Select` does not erase the source variable's `Locale` type. Avoid annotating a concrete flat array as
`SelectProps['items']`: that broad union is appropriate for universal pass-through props but widens flat item values to
the upstream `any`.

`SelectOptions` is exported from `@nodzimo/ui/client` because it belongs to the client-side Select API. A Server
Component may import it with `import type`; the import is erased and does not create a client boundary or prevent SSR or
SSG. Runtime Select parts still come from the client entrypoint and follow the normal Server-to-Client Component
boundary.

### Deliberate Limits

`SelectOption` and `SelectOptions` are convenience types. They do not replace, narrow, or override
`SelectProps['items']`, and the root `SelectProps` remains derived from the Base UI component. This preserves record and
group support without manually mirroring the complete upstream union.

Do not add a manually reconstructed generic union for every Base UI `items` shape merely for symmetry. It would
duplicate an upstream contract, require maintenance after dependency updates, and imply end-to-end type safety that the
compound `SelectItem` children do not provide. Add an owned grouped-data type only with an owned grouped consumer API
that benefits from it.

Do not export `SelectItems` as an alias merely to shorten `SelectProps['items']`. The alias would retain the same `any`
and would not solve strict flat-option typing. Universal wrappers may use the indexed-access type directly.

Do not wire `SelectOptions<Value>` into `SelectProps`. Doing so would incorrectly remove the record and grouped forms
supported by Base UI. If the project later needs a data-driven Select that renders its own items, design it as a
separate high-level API and make its options, value, and change handler share one owned generic contract.

### Change Handlers And Null

Base UI's single-select `onValueChange` value can be `null`; multiple selection and event details also belong to the
upstream callback contract. The library does not currently export a simplified `SelectOnValueChange` or
`SelectValueChangeHandler` alias. A one-argument handwritten alias would omit real behavior, while an exact extracted
alias adds little value over contextual typing.

Prefer an inline callback when contextual inference is convenient, or explicitly type a named single-select value as
the domain value unioned with `null`. Guard `null` before using the selected domain value; do not cast `null` to that
domain type. A general `Nullable<Value>` utility, if adopted, belongs to shared RSC-safe type utilities rather than the
Select component.

### Current Visual And Accessibility Notes

`SelectTrigger` currently uses `bg-transparent` in the light theme and therefore inherits colored parent surfaces. This
is explicit styling inherited from the adapted shadcn-style implementation, not missing consumer CSS. Changing the
default to an opaque NUI surface remains a separate visual-system decision.

Select is a form control even when it is not rendered inside a `<form>`, so it must have an accessible name. A visible
label is optional. When the design has no visible label, provide a localized `aria-label` on `SelectTrigger`; the
selected value describes the current state and is not a substitute for the control's purpose.

The current public `SelectLabel` wraps Base UI's `GroupLabel`. It labels a group of options inside the popup and does
not label the trigger. Do not use it as the control's accessible name. Until the library deliberately exposes Base UI's
root `Label`, use `aria-label` on `SelectTrigger` for visually unlabeled selects. Replacing a native labeled select
without carrying this contract forward is an accessibility regression.
