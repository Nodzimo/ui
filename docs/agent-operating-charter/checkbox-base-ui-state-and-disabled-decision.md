## Base UI Checkbox State And Disabled Decision

### Scope

This record owns the non-obvious decisions discovered while completing the NUI Checkbox. It exists to prevent a future
port or review from repeating the same Base UI, shadcn, styling, and Storybook investigation.

The implementation lives in:

- `src/client/components/checkbox/checkbox.tsx`
- `src/client/components/checkbox/checkbox.stories.tsx`
- `src/core/components/label/label.tsx`
- `assets/icons/lucide/minus-icon.svg` and its generated icon output

### Indeterminate Is A Real Checkbox State

`indeterminate` is part of the public Base UI Checkbox contract. Base UI defines it as the mixed state in which the
checkbox is neither fully checked nor unchecked. The normal use case is a parent checkbox whose children are only
partially selected.

NUI exposes this upstream state unchanged. It is not a story-only invention and must not be rebuilt as a second checked
value.

The accepted visual language is:

```text
unchecked     = empty control
checked       = primary-filled control + check
indeterminate = primary-filled control + minus
```

Checked and indeterminate both communicate active selection, so both use the selected primary surface and foreground.
The symbol distinguishes complete selection from partial selection. Keeping the mixed state unfilled, as in the reviewed
ShadCN Studio tree variant, is a valid custom visual style but weakens NUI's selected-state consistency and was not
adopted. Invalid checked and invalid indeterminate controls retain the primary selected border while the destructive
ring communicates validation; the mixed state should not fall back to unchecked styling.

The minus comes from the project-owned Lucide SVG generation pipeline. The component consumes `MinusIcon`; it does not
draw a one-off SVG. The source SVG is decorative and uses `aria-hidden="true"` consistently with the icon inventory.

### Indicator Rendering

The original Indicator implementation followed the official Base UI Checkbox Group parent-checkbox example:

```text
render={(props, state) => (
    <span {...props}>
        {state.indeterminate ? <MinusIcon /> : <CheckIcon />}
    </span>
)}
```

This remains a valid Base UI render callback contract. The first argument contains the merged Indicator props; the
second contains `Checkbox.Indicator.State`, including `indeterminate`. The original choice preferred rendering one icon
at a time over mounting two decorative icons. It was revised after investigating the built-package warning below.

### Indicator Render Warning Incident

The NUI library build transformed the inline callback into a standalone function named `Re` and passed it as
`render: Re` in `dist/client.js`. Base UI's development diagnostic examines the function name to catch React components
incorrectly passed as plain render callbacks. The generated name matched its component-name heuristic and produced:

```text
The `render` prop received a function named `Re` that starts with an uppercase letter.
```

The warning-producing callback was present in NUI's own built output. The verification gap was failure to inspect the
development console while rendering that output: reviewing the source and checking the unbundled story did not establish
that the packaged component was free of warnings.

The emitted `Re` function only returned a `span` with the selected icon; it contained no hooks. This was a false
positive
from the name-based diagnostic, not evidence of a Rules of Hooks violation or a memory leak. The source followed the
official example correctly, but the example did not guarantee stable function names through NUI's React Compiler and
Vite/Rolldown build pipeline. The final artifact established the generated name; the investigation did not isolate which
build stage assigned that exact name.

On October 1, 2026, NUI had Base UI 1.7.0 installed and the latest stable release was 1.8.0. Comparing the published
packages showed that the warning function was unchanged and would still flag `Re`. Related upstream fixes
[#4324](https://github.com/mui/base-ui/pull/4324) and [#4363](https://github.com/mui/base-ui/pull/4363) addressed
inferred
`useCallback` names and uppercase constant names, respectively. Those fixes were already reflected in the installed
diagnostic and did not cover this generated name. Updating Base UI alone was therefore not a fix for this incident.

### Accepted Indicator Implementation

Indicator now uses its default `span` and ordinary `CheckIcon` and `MinusIcon` children. Base UI owns the state and
exposes its documented `data-indeterminate` attribute on Indicator. A named Tailwind group limits the icon visibility
rules to that Indicator:

```text
Indicator: group/checkbox-indicator
CheckIcon: group-data-indeterminate/checkbox-indicator:hidden
MinusIcon: hidden group-data-indeterminate/checkbox-indicator:block
```

Without `data-indeterminate`, the check icon is visible and the minus icon is hidden. When the attribute is present,
those display rules reverse. `hidden` uses `display: none`, so the inactive icon occupies no layout space. The named
group is a selector marker and adds no layout behavior. Indicator retains its existing grid alignment and icon size.
Base UI continues to own Indicator mounting and transitions; no `keepMounted` override was introduced.

This is a local application of Base UI's official state-styling API, not a verbatim copy of an official two-icon
example.
Both icons remain decorative with `aria-hidden="true"`. The tradeoff is one additional SVG while Indicator is mounted.
No new icon asset, component-owned state, effect, DOM inspection, or manually synchronized state attribute is needed.

The public `CheckboxProps = CheckboxPrimitive.Root.Props` contract and Root prop forwarding remain unchanged.
Callers still control `checked` and `indeterminate` through the same props. Base UI retains responsibility for input
semantics, accessibility, focus, disabled/read-only behavior, and `onCheckedChange`.

Removing this internal render callback eliminates dependence on its generated function name. Merely extracting a
lowercase named callback would not guarantee its name survives bundling or minification. Global Compiler exceptions,
function-name preservation settings, and console suppression were not needed for this two-icon presentation change.

### Incident Verification

The implementation passed TypeScript build, focused Biome checking, JavaScript/declaration build, CSS build, and
`git diff --check`. The emitted Checkbox Indicator had ordinary children and no `render` callback; its public
declaration
still used Base UI Root props.

Rendering the built component in development mode produced no warnings for unchecked, checked, and indeterminate props.
A Chromium check of that rendered markup with the compiled package CSS confirmed the correct icon visibility in light
and dark themes, decorative SVG attributes, and hidden input names. This check covered rendering and CSS; it did not
verify hydration, keyboard interaction, disabled/read-only interaction, or the complete visual regression matrix below.

### Disabled Styling Incident

The copied shadcn Base UI Checkbox used native `disabled:` variants. Base UI's default Checkbox Root, however, renders a
`span` beside a hidden input and exposes its disabled state on the Root as `data-disabled`. A `span` cannot match the
CSS `:disabled` pseudo-class, so interaction was correctly blocked while the visible opacity and cursor styles did not
activate.

The NUI fix deliberately supports both contracts:

```text
Checkbox Root: disabled:* + data-disabled:*
Label peer:    peer-disabled:* + peer-data-disabled:*
```

`data-disabled:*` handles the default Base UI Root. Native `disabled:*` remains useful for compatible native/custom
rendering. The Label needs the matching peer data variant because `peer-disabled:*` has the same native pseudo-class
limitation. Checkbox must remain usable without a Field, so Field-only opacity is not an acceptable substitute.

This matches the technical diagnosis and proposed fix in shadcn issue
[#9726](https://github.com/shadcn-ui/ui/issues/9726) and pull request
[#9497](https://github.com/shadcn-ui/ui/pull/9497), including the follow-up Label change. PR #9497 was closed without
merge; it is evidence for the approach, not proof of an accepted upstream release. As of July 27, 2026, issue #9726 and
follow-up pull requests [#9729](https://github.com/shadcn-ui/ui/pull/9729) and
[#9893](https://github.com/shadcn-ui/ui/pull/9893) remain open. NUI keeps the fix because Base UI's documented
`data-disabled` contract independently confirms it.

### Read-Only Is Not Disabled

`readOnly` is also a real Base UI Checkbox prop and produces `data-readonly`. It prevents the user from changing the
value while keeping the control as available information. `disabled` communicates that the control is unavailable.

NUI intentionally does not apply disabled opacity or a prohibited cursor to read-only checkboxes. A product may explain
why a value is immutable through nearby copy or context, but the base component should not make read-only and disabled
visually or semantically identical.

### Storybook Decisions

- `Shows the mixed selection state` is the accepted short description for `indeterminate`; it matches Base UI's mixed
  state terminology.
- A boolean value present in `meta.args` already produces the correct boolean control. Do not repeat
  `control: 'boolean'` in `argTypes` unless inference actually fails.
- Keep Checkbox uncontrolled in the default Canvas. A live `checked` control would freeze ordinary interaction unless
  the story also synchronized Storybook args.
- Use `onCheckedChange: fn()` as the primary interaction spy. It exposes the callback in Controls and records real user
  changes in Actions without owning component state.

The same primary-callback rule applies to the existing interactive stories: Button `onClick`, Input and Textarea
`onChange`, Select `onValueChange`, and Dropdown Menu `onOpenChange`. Document the component's main interaction
boundary; do not add every secondary callback.

### Regression Checks

When Checkbox behavior or styling changes, verify this focused matrix:

- unchecked, checked, and indeterminate; indeterminate must use the primary fill and Minus icon
- invalid combined with checked and indeterminate
- disabled combined with each selection state; the Root and wrapping Label must dim and show the prohibited cursor
- read-only combined with checked and indeterminate; interaction must be blocked without disabled styling
- uncontrolled clicking and the `onCheckedChange` Storybook Action
- keyboard focus and light/dark theme appearance

Run `bun run build:ts` and `bun run check:lint` after implementation changes. Use the rendered Storybook matrix for
visual and interaction claims that static checks cannot prove.

For Indicator changes, also build the JavaScript and CSS artifacts and render the built Checkbox with Base UI's
development diagnostics enabled. Inspect the console and icon visibility across all three states. Source checks alone
do not catch warning heuristics triggered by generated callback names.

### References

- [Base UI Checkbox](https://base-ui.com/react/components/checkbox): `indeterminate`, `readOnly`, state data attributes,
  Root/Indicator element contracts, and Indicator state
- [Base UI Checkbox Group](https://base-ui.com/react/components/checkbox-group): official parent-checkbox example using
  the Indicator render callback with a horizontal rule or check
- [Base UI `useRender`](https://base-ui.com/react/utils/use-render): merged props and internal state passed to render
  callbacks
- [Base UI Styling](https://base-ui.com/react/handbook/styling#data-attributes): official state styling through data
  attributes
- [Base UI 1.8.0 render diagnostic source](https://github.com/mui/base-ui/blob/v1.8.0/packages/react/src/internals/useRenderElement.tsx):
  name-based development warning
- [Base UI issue #4314](https://github.com/mui/base-ui/issues/4314): related false positive for valid render callbacks;
  distinct from NUI's generated `Re` name
- [shadcn Base UI Checkbox](https://ui.shadcn.com/docs/components/base/checkbox): the selected upstream component family
  and its Field-oriented disabled example
- [ShadCN Studio Checkbox collection](https://shadcnstudio.com/docs/components/checkbox): reviewed alternative
  indeterminate styling; useful as a custom example, not the NUI source of truth
