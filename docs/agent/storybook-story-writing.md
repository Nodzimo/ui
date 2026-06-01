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
- Keep a story budget. Components with one behavior and no owned variants may need only `Default`; add at most one usage
  or composition story when it documents a real interface pattern consumers should copy.
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
- Use `meta.args` for shared baseline args such as generic `children` and `onClick: fn()`. Focused stories should only
  override the args that make that story meaningful. Use specific children only when the label clarifies semantics, such
  as `Delete` for destructive actions or `Visit` for link-style actions.
- For story-only args such as preview icons, extend the story args type with `ComponentProps<typeof Component>`. Expose
  a clearly described control such as `Story-only icon picker (this is not a Button prop!)`, and destructure unused
  story-only args out of custom renders so they do not leak into the rendered component or DOM.
  For icon-like story-only controls, keep control options as serializable string keys plus Storybook `mapping`; do not
  put React components directly in `options`. It is acceptable if Storybook cannot reverse-map a React component default
  back to the selected string option in the Controls UI; do not rewrite the arg to an `iconName` string only for that
  cosmetic control-state improvement.
- Keep story export names short and stable because they form technical story ids. Use `name` only when the display name
  needs human-facing clarification or sentence casing, such as `Primary (default)` or `Icon sizes`.
- In comparison, story render functions, spread `args` before pinned props that define the comparison item, for example
  `<Button {...args} size='xs' />`. This lets controls adjust shared args while preventing controls from collapsing the
  whole comparison into one size or variant.
- Local story-only helpers may use simple names when the surrounding story file makes their purpose obvious. Give them
  more precise names when they become broader, exported, reused across files, or responsible for more than local layout.
- Storybook Controls need runtime `options` arrays for select/radio controls. TypeScript may know CVA-derived unions in
  the editor, but those type unions are not available as runtime values for Storybook controls.
- Storybook is the first demanding consumer of component metadata. For public finite values, define runtime constants at
  the component layer and derive/export types from them. Button variants/sizes should come from the button variant
  module; Select trigger sizes and content placement values should come from the Select component files. Stories should
  import those constants instead of duplicating option arrays. This is a response to a real Storybook auto-controls
  failure, not a preference for verbose stories.
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
