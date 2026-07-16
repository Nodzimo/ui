## Theme Token Contract

### Namespace

- Use the shadcn theme architecture as the baseline model, adapted for a publishable library.
- All library-owned semantic tokens must use the `nui` namespace. Raw variables use `--nui-*`, Tailwind color mappings
  use `--color-nui-*`, radius mappings use `--radius-nui-*`, and spacing mappings use `--spacing-nui-*`.
- Components must use NUI-prefixed semantic utilities such as `bg-nui-primary`, `text-nui-foreground`,
  `border-nui-border`, `ring-nui-ring`, and `rounded-nui-lg`.
- Do not introduce unprefixed shadcn app-level tokens such as `--primary`, `bg-primary`, `border-border`, `ring-ring`,
  `bg-background`, or `text-foreground` in library source.
- Preserve normal Tailwind structural utilities such as `flex`, `inline-flex`, `items-center`, `gap-2`, `px-2.5`,
  `text-sm`, `size-8`, `transition-all`, and `disabled:opacity-50`; prefix only theme-facing design-system utilities.
- Treat radius as a theme-facing design-system utility, not a generic structural utility. When porting shadcn classes
  such as `rounded-lg`, `rounded-md`, or `var(--radius-md)`, map them to the matching NUI radius contract such as
  `rounded-nui-lg`, `rounded-nui-md`, or `var(--radius-nui-md)`. This preserves shadcn's tokenized radius model under
  the NUI namespace instead of falling back to Tailwind's default radius scale.

For CSS entrypoint and source-detection rules, see [Tailwind And Styles](tailwind-and-styles.md).

### Theme Variants And Foundation Utilities

- Keep `@custom-variant dark (&:is(.dark *));` because components may use Tailwind `dark:` variants.
- Dark mode overrides should redefine the same `--nui-*` raw variables under `.dark`; do not create separate
  `*-dark` token names.
- The library's broad foundation styles are opt-in utility classes, not global `body` or global `*` selectors:
    - `.nui-boundaries *` applies `border-nui-border` and `outline-nui-ring/50` to descendant element boundaries.
    - `.nui-surface` applies `bg-nui-background` and `text-nui-foreground` to the element it is placed on.
    - `.nui-interactive` restores pointer cursors for enabled `button` and `[role="button"]` descendants.
- Consumers that want the full NUI foundation can add all three classes at the app root. Consumers can also apply only
  the specific foundation utilities they want, or scope them to a subtree.
- Use `src/library.css` as the source of truth for raw runtime token values and `src/theme.css` as the source of truth
  for Tailwind mappings before adapting a copied component. Every public mapped token must preserve both sides.

### Semantic Roles

- Theme token meanings follow the shadcn semantic token convention:
    - `background` / `foreground`: default app background and text, page shell, sections, and default text.
    - `card` / `card-foreground`: elevated surfaces such as cards, dashboard panels, and settings panels.
    - `popover` / `popover-foreground`: floating surfaces such as popovers, dropdown menus, context menus, and overlays.
    - `primary` / `primary-foreground`: high-emphasis actions and brand surfaces such as default buttons, selected
      states, badges, and active accents.
    - `secondary` / `secondary-foreground`: lower-emphasis filled actions and supporting surfaces.
    - `muted` / `muted-foreground`: subtle surfaces and lower-emphasis content such as descriptions, placeholders, empty
      states, helper text, and subdued surfaces.
    - `accent` / `accent-foreground`: interactive hover, focus, active, selected, and highlighted surfaces such as ghost
      buttons, menu highlights, hovered rows, and selected items.
    - `destructive`: destructive actions and error emphasis such as destructive buttons, invalid states, and destructive
      menu items.
    - `border`: default borders, separators, table dividers, card borders, menus, and layout dividers.
    - `input`: form-control borders and input surface treatment for input, textarea, select, and outline-style controls.
    - `ring`: focus rings and outlines for buttons, inputs, checkboxes, menus, and focusable controls.
    - `chart-1` through `chart-5`: default chart palette.
    - `sidebar` tokens: sidebar-specific surfaces, foregrounds, active/high-emphasis items, hover/selected states,
      borders, and rings.
    - `radius`: the base corner-radius scale for cards, inputs, buttons, popovers, and derived `radius-nui-*` tokens.
- The radius scale follows shadcn's model: `radius-nui-lg` is the base value from `--nui-radius`, smaller radii scale
  down from it, larger radii scale up from it, and changing `--nui-radius` updates the whole radius scale.

### RTL And Logical Motion

- For directional inline-axis layout, use logical Tailwind utilities such as `ps-*`, `pe-*`, `ms-*`, `me-*`,
  `start-*`, `end-*`, `inset-s-*`, `inset-e-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, and `rounded-e-*` instead
  of physical utilities such as `pl-*`, `pr-*`, `left-*`, `right-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, and
  `rounded-r-*` unless the design intentionally targets a physical side.
- Symmetric utilities such as `px-*`, `mx-*`, `inset-x-*`, `border-x-*`, and `rounded-*` are already direction-neutral.
- For RTL-sensitive components, convert inline-axis physical animation utilities to logical equivalents when the side or
  placement is logical. For example, a popup using `side='inline-start'` or `side='inline-end'` should use logical
  animation classes such as `slide-in-from-end-*` or `slide-in-from-start-*`, while explicit physical sides such as
  `left` and `right` may keep physical animation classes.

### Spacing

- The spacing scale is a public NUI rhythm layer, not Storybook-only display data. Define raw runtime variables
  `--nui-spacing-2xs` through `--nui-spacing-2xl` in `src/library.css`, then map Tailwind utilities through
  `--spacing-nui-2xs` through `--spacing-nui-2xl` inside the `@theme inline` block in `src/theme.css`.
- Current NUI spacing tokens map to Tailwind spacing values `0.5`, `1`, `2`, `4`, `6`, `8`, and `12` respectively.
  Use `--spacing()` in `src/library.css`, not handwritten `calc(var(--spacing) * n)`, because `--spacing()` is
  Tailwind's native source function and compiles to the calc form. Keep comments beside the raw `--nui-spacing-*`
  variables documenting the current pixel values.
- Use NUI spacing utilities for reusable design-system rhythm such as standard gaps between sections, headings, cards,
  and repeated UI groups. Do not replace incidental component tuning such as `px-2.5`, `gap-1.5`, `size-8`, or
  one-off layout nudges unless the spacing is intentionally part of the shared rhythm contract.
