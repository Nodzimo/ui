## Calendar DayPicker Contract And Storybook Decision

### Scope

This record owns the non-obvious Calendar and Storybook decisions discovered while adapting the shadcn Calendar template
over `react-day-picker@10.0.1`. It prevents future component work from turning Storybook convenience values into a
fictional NUI API, documenting an upstream default incorrectly, or overlooking the two meanings of `disabled`.

The implementation and its representative consumer live in:

- `src/client/components/calendar/calendar.tsx`
- `src/client/components/calendar/calendar.stories.tsx`

### Calendar Is A DayPicker Wrapper

`CalendarProps` preserves the `DayPicker` contract and adds the NUI-owned `buttonVariant`. The wrapper also owns the
styled defaults for `showOutsideDays`, `captionLayout`, and `buttonVariant`.

Do not treat every inherited DayPicker prop as an NUI variant just because it appears in `CalendarProps`. A control
belongs in the representative story only when it demonstrates a meaningful Calendar behavior without inventing a
story-only API or requiring misleading input editing.

The component-owned finite values are runtime metadata:

```text
CALENDAR_MODES
CALENDAR_CAPTION_LAYOUTS
CALENDAR_NAV_LAYOUTS
```

They are exported from the component layer and imported by Storybook. TypeScript unions do not exist at runtime, so the
story must not recreate their option arrays.

Do not create component constants for broad upstream passthrough values merely to fill Controls. In particular,
`dir` is a global DOM property and `numerals` is an advanced DayPicker localization setting. Neither is an NUI-designed
Calendar variant. Do not expose either as a normal control in the representative story.

### Defaults And Initial Story State Are Different Contracts

`table.defaultValue` describes the real component or upstream API default. `meta.args` describes the useful initial
Canvas state. They may differ only when the distinction is deliberate and documented.

For Calendar:

- DayPicker defaults `mode` to `undefined`. With no mode it is a display calendar, not a date-selection control.
- The representative Canvas starts with `mode='single'` so its primary interaction can be exercised. Its arg table must
  still document the actual default as `undefined`.
- DayPicker defaults `navLayout` to `undefined`. This is its legacy navigation layout: it renders the normal `Nav`
  container, which NUI positions around the caption. `around` and `after` are explicit alternative layouts, not
  defaults. Do not set `navLayout` in the story just to obtain working arrows.
- `captionLayout='label'`, `showOutsideDays=true`, and `buttonVariant='ghost'` are wrapper defaults and may be used as
  the story baseline.

Do not introduce a single-use `*_STORY_DEFAULTS` object. It is useful only when one shared value genuinely serves
several declarations. One-off values belong directly in `args` or the arg table.

`pagedNavigation` matters only with more than one visible month. When enabled, previous and next navigation move by the
complete visible month count instead of one month. Its control description is:

```text
Moves by all visible months at once
```

### Disabled Has Two Useful Scopes

DayPicker's `disabled` prop is a `Matcher | Matcher[]`, and `Matcher` deliberately includes `boolean`.
`disabled={true}` therefore disables every day button: dates cannot be selected and Calendar's existing disabled-day
styling applies. This is a real Calendar prop and is appropriate as the representative boolean control.

It does not disable month navigation. `disableNavigation` is the separate upstream prop for previous/next buttons and
caption dropdowns. A consumer that needs a visually and behaviorally inert standalone calendar uses both:

```tsx
<Calendar disabled disableNavigation/>
```

This is different from a composed date-picker form control. shadcn builds that control from a trigger, popover, and
Calendar; the form-level disabled state normally disables the trigger so the popup cannot open. Calendar itself remains
the selectable date-grid primitive.

### Locale Is A Real Prop With Curated Story Examples

`locale` is a real DayPicker and Calendar prop of type `Partial<DayPickerLocale> | undefined`. Calendar forwards it to
DayPicker and uses its code while formatting calendar content. If it is omitted, DayPicker uses `enUS`.

The wrapper's custom `formatMonthDropdown` calls `Intl.DateTimeFormat` through `toLocaleString(locale?.code, ...)`. When
`locale` is omitted, that particular dropdown label follows the browser locale while DayPicker itself remains
`enUS`. Treat this as an implementation detail to check whenever locale formatting changes; do not invent a Storybook
locale arg merely to mask it.

Storybook cannot usefully enumerate every `date-fns` locale object. Its `CALENDAR_STORY_LOCALES` mapping is therefore a
curated set of meaningful examples, not a second locale API. The control options are serializable labels and the mapping
supplies the real locale object to Calendar.

Keep the short description:

```text
Locale examples for this story
```

It says exactly what the list is without calling the real `locale` prop story-only. Do not put `enUS` in `meta.args`
only to make the select display English: Storybook cannot reverse-map that object to its label and will show `Choose
option`. Leaving the prop absent both exercises the true default and documents it as `enUS`.

### Representative Story Checklist

- Import finite Calendar option constants from the local public surface.
- Keep `mode='single'` as the interactive demo state while documenting its API default accurately.
- Leave `navLayout` and `locale` absent from initial args when exercising their actual defaults.
- Use the locale mapping only for focused locale examples.
- Expose `disabled` as the real all-days-disabled boolean case; distinguish it from `disableNavigation`.
- Do not add controls for global DOM props, arbitrary strings, callbacks beyond the main useful action, or advanced
  upstream passthroughs merely because the broad inherited type permits them.

### References

- Installed `react-day-picker@10.0.1` source: `dist/esm/types/props.d.ts`, `dist/esm/types/shared.d.ts`,
  `dist/esm/DayPicker.js`, and `dist/esm/helpers/createGetModifiers.js`; these establish the local `DayPickerProps`,
  `Matcher`, default legacy navigation, and disabled day-button behavior
- [shadcn Calendar](https://ui.shadcn.com/docs/components/base/calendar): selected upstream Calendar architecture
- [shadcn Date Picker](https://ui.shadcn.com/docs/components/base/date-picker): trigger, popover, and Calendar
  composition
