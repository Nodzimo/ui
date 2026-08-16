---
status: ready
---

# Resolve the Calendar DayPicker package, layout, and Storybook contract

## Context

`Calendar` is a styled wrapper over `react-day-picker@10.0.1`. Its inherited surface includes `numerals`, navigation
layouts, and locale behavior that need explicit decisions before they become ordinary Storybook controls or package
dependencies.

`numerals` accepts an upstream union of 18 numbering systems. The removed control exposed only `latn`, `arab`, and
`arabext`, a curated subset presented as though it were the full prop surface. Creating an NUI runtime list merely for
Storybook would turn an unreviewed upstream passthrough into an NUI feature.

`date-fns@4.4.0` is a direct NUI dependency but has no NUI source import. It was added with the original shadcn Calendar
template. `react-day-picker@10.0.1` already declares `date-fns` as its own runtime dependency, while shadcn's composed
Date Picker examples import `date-fns` to format the selected value. NUI does not currently ship that Date Picker
composition, so the direct dependency may be unnecessary.

The Docs Canvas can overflow when Calendar displays multiple months. The current `numberOfMonths` control has no upper
bound, while the Calendar's month layout switches to a horizontal row at `md`; the affected Canvas/Docs container must
be measured rather than treated as a Calendar API defect by default.

`navLayout='around'` is visibly broken by the current styling: DayPicker renders its previous and next buttons as direct
siblings of the month caption, but Calendar's vertical `Month` layout gives those buttons no side positioning. They can
therefore stack above and below the caption. The legacy layout and `after` instead render a `Nav` container, which the
Calendar explicitly positions at the top. DayPicker provides the two explicit layouts for navigation placement and
accessibility; `after` preserves visual and keyboard order, whereas the legacy undefined layout is retained for
compatibility.

## Outcome

- Decide whether `numerals` is an intentionally supported Calendar feature or an advanced DayPicker passthrough that NUI
  does not document in its representative story. If supported, use a truthful full contract or an explicitly scoped
  demonstration; do not keep an ambiguous curated subset under the real prop name.
- Decide whether NUI should remove its direct `date-fns` dependency. Keep it only if an NUI-owned component, public
  example, or documented utility imports it; DayPicker's own dependency must remain its responsibility.
- Make the Canvas and Docs rendering usable at every documented `numberOfMonths` value. Decide, based on reproduced
  layouts, whether the remedy belongs in the story control bounds, a scrollable story wrapper, responsive Calendar
  layout, or another documented constraint. Preserve ordinary consumer composition rather than forcing global width
  rules into Calendar without evidence.
- Make `navLayout='around'` render arrows beside the caption and verify `after`, legacy `undefined`, LTR, RTL,
  one-month, and multi-month behavior. Decide whether to support both explicit upstream layouts with dedicated
  positioning styles, set an NUI wrapper default, or remove an option from the representative controls while preserving
  the DayPicker prop.
- Verify keyboard order and visual order with dropdown captions before finalizing the navigation decision.

## Next step

Reproduce the Canvas overflow and all three navigation layouts in the static Storybook build, then inspect the upstream
DayPicker DOM/CSS contract and shadcn source. In the same pass, audit direct `date-fns` imports, its DayPicker
dependency edge, and shadcn Date Picker examples before proposing the smallest compatible change.

## References

- `src/client/components/calendar/calendar.tsx`
- `src/client/components/calendar/calendar.stories.tsx`
- `package.json`
- `node_modules/react-day-picker/package.json`
- `node_modules/react-day-picker/dist/esm/DayPicker.js`
- `node_modules/react-day-picker/dist/esm/types/shared.d.ts` (`Numerals`)
- `node_modules/react-day-picker/dist/esm/types/props.d.ts` (`numerals`, `navLayout`)
- `docs/agent-operating-charter/calendar-day-picker-contract-decision.md`
- [React DayPicker navigation layouts](https://daypicker.dev/docs/caption-and-nav-layouts)
- [React DayPicker anatomy](https://daypicker.dev/v9/docs/anatomy)
- [shadcn Calendar](https://ui.shadcn.com/docs/components/base/calendar)
- [shadcn Date Picker](https://ui.shadcn.com/docs/components/base/date-picker)
