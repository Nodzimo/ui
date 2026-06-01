## Storybook Addons And QA

- Storybook's official backgrounds addon supports preset backgrounds, not a free global color picker. Avoid adding
  stale third-party background/color-picker addons only for this feature; many are not maintained for current Storybook
  versions. If a real full-canvas color picker is needed later, prefer a small project-owned Storybook toolbar/global
  addon over layout hacks, `document.body` effects, or unsupported addons.
- Use `storybook-addon-pseudo-states` for fixed CSS pseudo-class previews such as `hover` and `active`. Real component
  states such as `disabled`, `checked`, `selected`, `open`, or `loading` should stay real args/props, not pseudo-state
  addon configuration.
- Use `storybook-addon-rtl` as the Storybook toolbar check for left-to-right and right-to-left rendering. Treat it as a
  preview QA surface, not a substitute for component code using logical spacing, positioning, borders, and radii.
- Treat Storybook RTL as a layout and bidi QA surface. Hardcoded English examples that contain neutral punctuation may
  need `dir={'ltr'}` on the text span; this is a story/demo fix, not component punctuation logic.
- Icon showcase pages should not mirror directional-looking assets in RTL. They document the icon set. Mirror icons only
  inside component stories or examples where the icon specifically means inline-start or inline-end movement.
- Put shared pseudo-state defaults in `meta.parameters.pseudo` when every story in the file follows the same preview
  convention. Use story-level `parameters.pseudo` only for stories that need different pseudo-state targets.
- When targeting one element for a pseudo state inside a story canvas, prefer story-only `data-*` selectors such as
  `[data-preview="hover"]` over `id` selectors. Storybook Docs can render several canvases on one page, so repeated IDs
  are fragile and invalid HTML.
- Inline simple single-use pseudo-state selectors directly in `parameters.pseudo`. Extract selector constants only when
  they are reused or need a meaningful shared name.
- Add explicit baseline `meta.args` for native or passthrough props when that makes Storybook Controls expose the prop
  correctly, for example `disabled: false`. CVA-derived variant unions still need explicit `argTypes.options` arrays
  because those unions are not available as runtime values.
