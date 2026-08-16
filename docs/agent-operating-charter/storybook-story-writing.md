## Storybook Story Writing

- Prefer colocated stories beside real components, for example `src/client/components/button/button.stories.tsx`.
- In colocated stories, prefer importing the component from the local folder surface with `import { Button } from '.'`
  when `index.ts` exports the component. Implementation files inside the same folder should still use direct relative
  imports for local details such as `./button-variants`.
- Use kebab-case filenames for stories when that matches the component folder style; the important Storybook convention
  is the `.stories` segment, not PascalCase.
- Do not write stories for the sake of exhausting every prop permutation. A story should answer a meaningful interface
  question: what role, intent, state, or usage pattern does this component have?
- Before writing stories, classify the component's owned surface area: semantic variants, sizes, states, interaction
  modes, and official composition patterns. If differences are only possible through arbitrary `className`, native DOM
  props, or wrapper layout, they are not story-worthy by themselves.
- Keep a story budget. Components with one behavior and no owned variants usually need only `Default`, plus at most one
  usage or composition story. A composition-only primitive such as Skeleton is the narrow exception: several distinct
  official loading layouts may be separate stories because composition is its documented purpose, not an arbitrary
  visual mutation. Preserve the upstream layouts and omit examples that require unavailable components.
- Do not create comparison stories for visual mutations that are not part of the component or design-system contract.
  Showing that an SVG or element can be recolored, resized, or rearranged with Tailwind documents CSS, not component
  behavior.
- Treat `Spinner` as the anti-example for story bloat: unless the component gains explicit variants, stories such as
  `Sizes`, `Tones`, or `Colors` are noise. Reasonable coverage is usually `Default`, plus optionally one honest
  `Inline`/`WithLabel` composition if that pattern is worth documenting.
- Prefer separate focused stories for semantic roles and materially different behavior, such as a button's primary,
  outline, secondary, ghost, destructive, link, disabled, icon-only, or loading states. Do not include the component
  name in each story name when the Storybook title already scopes the file to that component.
- Prefer comparison stories for visual scales and repetitive styling variations, such as component sizes or icon sizes.
  Show comparable variants side by side so rhythm, spacing, and scale can be inspected in one canvas instead of clicking
  through many near-identical sidebar entries.
- Treat `src/client/components/button/button.stories.tsx` as the current reference pattern for client component stories:
  typed control option constants, story-only icon mapping controls, a shared high-signal `meta.render` for common button
  compositions, focused semantic stories first, then comparison stories such as `Sizes` and `Icon sizes`.
- Treat `src/client/components/input/input.stories.tsx` as the reference for a simple native passthrough component:
  one `Default` story, `Meta<typeof Input>`, baseline args that materialize useful controls, explicit API defaults, and
  no custom render.
- Use `meta.args` for shared baseline args such as generic `children` and `onClick: fn()`. Focused stories should only
  override the args that make that story meaningful. Use specific children only when the label clarifies semantics, such
  as `Delete` for destructive actions or `Visit` for link-style actions.
- Put each interactive story's primary callback in `meta.args` with `fn()` so Controls exposes the main interaction
  boundary and Actions records real use. Current examples are Button `onClick`, Checkbox `onCheckedChange`, Input and
  Textarea `onChange`, Select `onValueChange`, and Dropdown Menu `onOpenChange`. Do not enumerate every secondary event.
- Use `Meta<typeof Component>` when story args are exactly the component props. Introduce a separate story-args type
  only when the story owns additional controls or composition data that the component does not accept.
- For story-only args such as preview icons, extend the story args type with `ComponentProps<typeof Component>`. Expose
  a clearly described control such as `Story-only icon picker (this is not a Button prop!)`, and destructure unused
  story-only args out of custom renders so they do not leak into the rendered component or DOM. For icon-like story-only
  controls, keep control options as serializable string keys plus Storybook `mapping`; do not put React components
  directly in `options`. It is acceptable if Storybook cannot reverse-map a React component default back to the selected
  string option in the Controls UI; do not rewrite the arg to an `iconName` string only for that cosmetic control-state
  improvement.
- Keep story export names short and stable because they form technical story ids. Use `name` only when the display name
  needs human-facing clarification or sentence casing, such as `Primary (default)` or `Icon sizes`.
- Write human-readable multiword title segments, for example `Client/Components/Dropdown Menu`, instead of collapsing
  the component name into `DropdownMenu`.
- In comparison, story render functions, spread `args` before pinned props that define the comparison item, for example
  `<Button {...args} size='xs' />`. This lets controls adjust shared args while preventing controls from collapsing the
  whole comparison into one size or variant.
- Local story-only helpers may use simple names when the surrounding story file makes their purpose obvious. Give them
  more precise names when they become broader, exported, reused across files, or responsible for more than local layout.
- Storybook Controls need runtime `options` arrays for select/radio controls. TypeScript may know CVA-derived unions in
  the editor, but those type unions are not available as runtime values for Storybook controls.
- Storybook is the first demanding consumer of component metadata. For public finite values, define runtime constants at
  the component layer and derive/export types from them. Button variants/sizes should come from the button variant
  module; Input's guaranteed styled types should come from `INPUT_SUPPORTED_TYPES`; Select trigger sizes and content
  placement values should come from the Select component files. Stories should import those constants instead of
  duplicating option arrays. A curated control list may document a supported subset without narrowing a broader
  component prop. This is a response to a real Storybook auto-controls failure, not a preference for verbose stories.
- Do not assume docgen will infer usable Controls for wrapped Base UI or CVA-backed components. The project hit this
  with Button: the public contract `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>` is valid TypeScript and
  preserves the Base UI contract, but Storybook did not turn it into clean runtime select options. A simpler
  shadcn/Radix-style `forwardRef<HTMLButtonElement, ButtonProps>` with an explicit `interface ButtonProps extends
  ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<...>` is more docgen-friendly because the component signature
  points directly at a named props interface and ordinary DOM props. That does not mean this project should abandon Base
  UI props or rewrite everything for docgen.
- Do not treat `forwardRef` as the root cause. It can help component detection, but it does not create runtime option
  arrays for CVA, does not simplify Base UI namespace props, and does not make root compound components expose child
  part props. Use explicit `argTypes.options`, `table.type`, and `table.defaultValue` for meaningful documented
  controls.
- For compound components, story args may represent the documented composition surface, not only the root component's
  direct props. Prefix child-part controls with the part name, such as `triggerSize`, `triggerAriaInvalid`,
  `contentSide`, `contentAlign`, `contentSideOffset`, and `contentAlignItemWithTrigger`.
- Treat `Select` and `Dropdown Menu` as reference stories for complex compound components with one primary behavior:
  prefer one realistic, highly interactive `Default` composition over separate stories for every internal part.
- Keep root props under their real public names. Prefix only child-part story args by owner. If root, trigger, and item
  expose same-named states such as `disabled`, document each selected scope explicitly instead of hiding a real contract
  or implying that the scopes are interchangeable. For Base UI Menu, Root disables the menu system, Trigger disables
  only one trigger, and Item disables only one action; the distinction remains useful because one menu may have multiple
  or detached triggers.
- When a story-only arg deliberately fans one real item prop out to several rendered items, keep the singular
  prop-derived name and explain the fan-out briefly, for example `Applies to all items in this story`. Do not imply that
  one item prop controls its siblings in production.
- Storybook's generic/wrapped Base UI docgen may omit even basic props such as `disabled`. A valid exported TypeScript
  type and `satisfies Meta<...>` validate the story at compile time but do not create runtime control metadata. Add
  explicit `control`, defaults, descriptions, and runtime options for important states; do not distort the component API
  merely to improve docgen.
- When a boolean baseline is present in `meta.args` and Storybook already infers its boolean control, do not repeat
  `control: 'boolean'` in `argTypes`. Keep an explicit control only when inference fails.
- Derive control defaults from the component or upstream primitive, not from whichever value makes the demo look best.
  Treat `table.defaultValue` as API documentation and `meta.args` as the initial demo state. Keep fixed story exceptions
  visible and describe them briefly when a story-wide control otherwise suggests uniform behavior.
- Reuse one story default constant only when the API default and initial story arg are the same. When they differ, keep
  the representative value in `meta.args` and write the real default directly in `argTypes`; for example, Input may
  demonstrate a placeholder while documenting its API default as `undefined`.
- Do not add `value` or `defaultValue` to a native Input story merely to create another control. The Canvas already
  demonstrates uncontrolled typing, while a value control makes the story controlled and can produce invalid
  combinations such as assigning a non-empty value to `type="file"`. Add controlled state only when that behavior is
  itself the subject of the story.
- Apply the same rule to toggle primitives. A `checked` control freezes ordinary Canvas interaction unless the story
  deliberately synchronizes args, while `defaultChecked` is initial-only and becomes a misleading live control. Prefer
  an uncontrolled clickable Canvas with an `onCheckedChange` spy; add a controlled story only when controlled behavior
  itself is being documented.
- Keep control descriptions as short interface fragments without terminal punctuation.
- Do not copy `decorators`, `layout: 'padded'`, `h-full`, or preview sizing from a reference story without reproducing
  the layout need. Storybook's default Canvas already centers ordinary stories. Prefer minimal fixed preview geometry,
  such as a standalone Select trigger with `w-64`, over an application-style `w-full max-w-64` plus wrappers that only
  compensate for the missing parent width.
- Keep `undefined` in the prop type when an upstream prop is optional, but do not include `undefined` in Storybook
  control option arrays. Options represent explicit selectable values, not the absence of a prop. Numeric Base UI
  offsets such as `sideOffset` and `alignOffset` may accept functions upstream, but stories may use `control: 'number'`
  for the documented numeric case instead of inventing a function editor.
- Shared Storybook arg-table labels and separators belong in `src/storybook/constants.ts`. Keep that folder out of
  public barrels and runtime entrypoints; it is for colocated `*.stories.*` files and story-only helpers.
- `class-variance-authority` currently does not expose a stable runtime introspection API for variant keys. CVA
  discussion https://github.com/joe-bell/cva/discussions/146 tracks requests for exposing variants; until CVA provides
  this, do not introduce a custom CVA fork, wrapper, or large metadata layer only to satisfy Storybook controls.
- For CVA-backed component variants, do not duplicate public variant arrays in every story. Define component-owned
  runtime constants beside the variant implementation, derive/export the matching types from those constants, and import
  the constants into `argTypes.options`. Use explicit Storybook table summaries such as `string union` or
  `component union` when Autodocs would otherwise show unclear types such as `unknown`, and put the concrete option list
  in `table.type.detail`. Revisit this only if CVA or Storybook gains reliable variant introspection.
- A broad inherited prop type is not a mandate to create a normal control for every upstream or DOM property. Expose
  only the meaningful documented surface; use component-owned runtime constants only for finite values that are useful
  to ordinary consumers as well as Storybook. Calendar's DayPicker decisions are recorded in
  [Calendar DayPicker Contract And Storybook Decision](calendar-day-picker-contract-decision.md).
- Do not rely on `react-docgen-typescript` configuration as the primary solution for CVA variant controls. In this
  project, attempts to switch Storybook to `react-docgen-typescript` did not produce reliable controls and made prop
  extraction worse in the running Storybook.
- Do not keep Storybook onboarding/demo components, CSS, MDX, assets, or addon dependencies as part of the long-term
  component architecture. The generated `src/stories` folder should stay deleted unless the project explicitly creates
  real documentation there.
- Top-level MDX documentation may live separately from component folders, but it should be project documentation, not
  generated onboarding content.
- CSF 3 is the stable default story format. CSF Next is not related to Next.js; it is an experimental next Component
  Story Format. Do not switch to CSF Next unless the project explicitly accepts preview API churn.
- Use this default story order unless a component suggests a clearer domain sequence: default/highest-emphasis story,
  semantic intent variants, important states, structural usage patterns, then comparison stories for owned scales,
  densities, alignments, or grouped variants. Do not stretch a small component to fill the whole sequence.
