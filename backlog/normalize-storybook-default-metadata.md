---
status: ready
---

# Normalize repeated Storybook default metadata

## Context

Component stories should keep a repeated API default in one `*_DEFAULTS` constant and derive both `meta.args` and
`table.defaultValue.summary` from it. This prevents the live Canvas default and the generated Docs table from drifting.

`src/client/components/calendar/calendar.stories.tsx` is the confirmed gap: its repeated booleans and numeric defaults
are duplicated as literals across `args` and `argTypes`. Several other stories already use the intended pattern, such as
Input, Checkbox, Radio Group, Switch, Field, Select, and Dropdown Menu.

Not every `meta.args` value is an API default. A story may deliberately demonstrate a value while its table documents
`undefined` or another upstream default, so this work must not mechanically extract every story arg into a defaults
object.

## Outcome

Every colocated component story uses one local `*_DEFAULTS` source for each API default repeated by its Canvas args and
Docs-table summary. Intentional differences between a representative story arg and the real API default remain explicit
and documented correctly.

## Next step

Audit every `src/**/*.stories.tsx` file. Normalize Calendar first, then update only the stories with the same repeated
default-literal pattern; verify each story with Biome and TypeScript.

## References

- `src/client/components/calendar/calendar.stories.tsx`
- `src/client/components/input/input.stories.tsx`
- `src/client/components/checkbox/checkbox.stories.tsx`
- `docs/agent-operating-charter/storybook-story-writing.md`
