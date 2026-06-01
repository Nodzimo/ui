## Design System Doctrine

- Read `docs/design-system-doctrine/README.md` and the relevant chapter files before changing theme colors, button
  variants, interactive-state styling, or the meaning of theme tokens. They record the current Nodzimo design direction
  and the reasoning behind it.
- The doctrine is intentionally split for two surfaces: GitHub reads the Markdown `README.md` and chapter files, while
  Storybook uses `.storybook/showcase/doctrine.mdx` plus chapter MDX wrappers. Keep GitHub links as relative `.md`
  links, but use Storybook `./?path=/docs/...` links inside Storybook-only MDX overviews so navigation targets the
  Storybook manager instead of `iframe.html`.
- Keep doctrine chapter file names based on chapter identity, not position. Do not prefix chapter files with `01-`,
  `02-`, and so on; order belongs in `README.md`, Storybook overview links, and `storySort`.
- Preserve the shadcn-style semantic token architecture. Do not add one-off state tokens such as `primaryTextHover`,
  `primaryLinkActive`, or `primaryBackgroundPressed` unless the existing semantic roles have clearly failed across
  multiple components.
- Treat light and dark themes as two intentional expressions of the same brand, not as a technical inversion:
    - Light theme: `Living Emerald`, internally nicknamed `Liverald`, with natural, confident, trustworthy,
      growth-oriented emerald energy.
    - Dark theme: `Night Emerald`, internally nicknamed `Nimerald`, with neon emerald, Tokyo-night, electric,
      technical, youthfully sharp energy.
- Neutral base colors also follow this split: use an Olive-derived neutral base for light theme and a Stone-derived
  neutral base for dark theme. Olive supports the organic light direction; Stone avoids the heavy/military feel olive
  can take on in dark mode.
- Do not timidly torture one color until it barely works in both themes. Keep the green brand DNA, but allow each theme
  to express it differently when that produces a stronger and more readable system.
- Respect the shadcn semantic structure, but do not inherit shadcn blandness as a design goal. shadcn is a conservative
  white-label baseline that is hard to ruin; Nodzimo should keep its architecture while adding deliberate character and
  clearer active/passive/disabled distinction.
- Use brand energy to make interaction legible, not to decorate everything. A user should be able to visually separate
  active actions, secondary actions, quiet local tools, inputs, disabled controls, and static content without hovering
  around the page. If those roles collapse into the same gray mass, neutrality has failed the product.
- Treat Nodzimo's design direction as a living interface principle: clickable vs. static, enabled vs. disabled, primary
  vs. secondary, and local tool vs. page action must be visually predictable before interaction. Brand color is not a
  reward for being clickable; brand energy is a tool for making interaction legible.
- Use this review line when judging affordance: if the user cannot tell what can be touched, the interface is not
  elegant; it is unfinished.
- Treat expressive color as design cost. Before adding or intensifying a color role, identify the exact problem, whether
  it is role-level or component-specific, whether the element controls its foreground/background pair, and which future
  components will inherit the token. Do not pay design complexity unless it buys quality, clarity, or accessibility.
- Prefer stable semantic tokens with theme-specific values over case-specific workaround tokens. Do not add
  `linkPrimary`, `headingPrimary`, `sliderPrimary`, or similar private roles to patch one weak surface. Use the same
  semantic token and assign values appropriate to each theme when full light/dark quality control is worth the cost.
- When adapting shadcn-style components, do not paint the component by hand. Tune the semantic tokens until the existing
  semantic classes become alive. If private button-only color classes are needed just to make a standard variant
  readable, first suspect `secondary`, `accent`, `border`, `input`, `ring`, or related theme tokens.
- Current primary direction:
    - Light primary: `Living Emerald`, internally nicknamed `Liverald`, `oklch(0.55 0.19 151)` with light foreground.
    - Dark primary: `Night Emerald`, internally nicknamed `Nimerald`, `oklch(0.82 0.26 145)` with dark
      foreground.
- Use the paired brand line: `Living Emerald` is the brand in daylight; `Night Emerald` is the brand after dark. Design
  mantra: "In the day, it feels alive. At night, it glows."
- Use the NUI intensity rhythm as a naming/review convention for recurring color and opacity modifiers:
    - `subtle = 20`, written as Tailwind slash opacity such as `bg-nui-destructive/20`.
    - `half = 50`, written as slash opacity such as `hover:bg-nui-input/50`.
    - `strong = 80`, written as slash opacity such as `hover:bg-nui-primary/80`.
- Intensity rhythm names describe strength, not events. Do not introduce `hover`, `active`, or `pressed` tokens when a
  semantic color plus `/20`, `/50`, or `/80` expresses the treatment. Do not create CSS variables for these values
  unless
  Tailwind gains a clean named opacity API or repeated real usage proves a better implementation.
- Button variants are semantic hierarchy, not random visual costumes:
    - `primary`: brand speaks loudly; main action.
    - `secondary`: brand speaks quietly; lower-emphasis filled action.
    - `outline`: structural action; ordinary text, visible system border, subtle branded hover.
    - `ghost`: quiet dense-UI action; ordinary text at rest, subtle hover surface.
    - `link`: branded text signal; underlined by default.
    - `destructive`: dangerous action; danger overrides brand.
- Preserve the token action hierarchy:
    - `primary` is the persistent main action surface.
    - `secondary` is the persistent secondary action surface and should be a softened brand-derived action color.
    - `accent` is the interaction feedback layer for hover, selected, highlighted, active local items, and may be shared
      by `ghost:hover` and `outline:hover`.
    - `ring` is a temporary focus signal and may be vivid/brand-derived because it appears only to communicate focus.
    - `muted`, `border`, and `input` are passive/structural tokens, not brand action tokens.
- Do not use `muted` as an interaction layer. If `ghost` or `outline` needs hover feedback, prefer `accent`; if a
  variant needs a persistent secondary action surface, use `secondary`.
- Choose button variants by action mass:
    - `primary` is the task's main commitment.
    - `secondary` is an important action that participates in the current task and deserves a persistent filled surface.
    - `outline` is an available structural/lower-commitment action that needs button shape but not filled-surface
      weight.
    - `ghost` is a local tool action that needs a hit area but no permanent form.
      Ask whether the action deserves surface, shape, or only a quiet hit area.
- Use these hierarchy review lines when judging button color and emphasis: if the user cannot tell where the action is,
  the design has failed; hierarchy is more important than love for the brand color.
- Use `ghost` for dense local tools such as table row actions, card header controls, dialog/sheet close `X` buttons,
  editor/data-grid toolbars, and menu-like controls where the surrounding layout already proves interactivity and a full
  button surface would add noise.
- Text links should be underlined in their resting state. Preferred inline-link pattern: foreground text with a
  primary-colored underline at rest, then primary text plus primary underline on hover. Do not rely on color alone to
  communicate that text is a hyperlink.
- Do not make default `outline` or `ghost` primary-colored text just to make them look branded. Let them carry Nodzimo
  through border tone, hover tint, focus ring, spacing, radius, and context.
- Keep `ghost` hover softer than `secondary` rest. If ghost hover becomes visually identical to secondary, the action
  hierarchy is too compressed.
- Nodzimo UI supports RTL consumers. For directional inline-axis layout, use logical Tailwind utilities such as `ps-*`,
  `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `border-s-*`, and `border-e-*` instead of physical `pl-*`, `pr-*`,
  `ml-*`, `mr-*`, `left-*`, `right-*`, `border-l-*`, or `border-r-*`. Symmetric utilities such as `px-*`, `mx-*`,
  `inset-x-*`, and `border-x-*` are fine.
- Directional icons are flipped at the usage site only when the icon means inline direction, such as next/previous,
  back/forward, collapse start/end, or chevron start/end. Use a local class such as `rtl:rotate-180` for that usage.
  Do not add RTL flipping to generated icon components.
- Do not flip icons that are not expressing inline flow. External/open icons such as `ArrowUpRightIcon` in a `Visit`
  story, brand icons, decorative icons, spinners, hearts, trash, folders, and close icons should keep their asset
  direction unless the specific component usage gives them directional meaning.
- Storybook icon galleries show raw icon inventory. Do not add RTL flip classes in icon showcase pages; the usage
  context decides directional behavior.
- When hardcoded LTR demo text appears inside an RTL Storybook preview and neutral punctuation moves incorrectly, wrap
  only that text fragment in a neutral inline element with explicit direction, for example
  `<span dir={'ltr'}>Processing...</span>`. Use real localized text for real RTL examples.

