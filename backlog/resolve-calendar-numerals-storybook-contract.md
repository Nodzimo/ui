---
status: ready
---

# Decide the Calendar numerals and Storybook contract

## Context

`CalendarProps` inherits `numerals` from `react-day-picker@10.0.1`. The upstream prop accepts a finite `Numerals`
union of 18 numbering systems, but Calendar does not currently declare an NUI-owned numerals contract or expose it in
its representative Storybook Controls.

The removed story control used only `latn`, `arab`, and `arabext`. That was a curated subset presented as though it were
the full prop surface, so it could not honestly document the upstream contract. Conversely, creating an NUI-exported
runtime list merely because Storybook needs options would turn an unreviewed upstream passthrough into a public NUI
feature.

The Calendar DayPicker decision record intentionally keeps `numerals` out of ordinary Controls until this distinction is
resolved.

## Outcome

- Decide whether `numerals` is an intentionally supported Calendar feature or an advanced DayPicker passthrough that NUI
  does not document in its representative story.
- If supported, define the smallest truthful public API and Storybook treatment: exact upstream values when a full
  selector is useful, or a clearly labeled focused demonstration when that is more usable.
- Verify that the accepted approach renders and behaves correctly with the supported locale and numeral combinations,
  including RTL-relevant Arabic and Persian cases.
- Keep no ambiguous curated subset under the real prop name.

## Next step

Inspect the installed DayPicker numeral formatting path and its official localization guidance, then compare it with
Calendar's locale and custom formatter behavior before choosing the public and Storybook contract.

## References

- `src/client/components/calendar/calendar.tsx`
- `src/client/components/calendar/calendar.stories.tsx`
- `node_modules/react-day-picker/dist/esm/types/shared.d.ts` (`Numerals`)
- `node_modules/react-day-picker/dist/esm/types/props.d.ts` (`numerals`)
- `docs/agent-operating-charter/calendar-day-picker-contract-decision.md`
