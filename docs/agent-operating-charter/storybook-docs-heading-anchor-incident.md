## Storybook Docs Heading Anchor Incident

This incident records the local Storybook Docs heading shift that appeared when switching the Storybook manager/Docs UI
to dark mode. The active workaround is intentionally small and lives in `.storybook/preview.css`.

### Symptom

- Standalone Storybook Docs pages rendered from raw Markdown through `@storybook/addon-docs/blocks` `Markdown` looked
  aligned in the light manager/Docs theme.
- Switching the Storybook manager/Docs UI with the `storybook-dark-mode` toolbar button made Markdown headings shift
  right by one heading-anchor icon width.
- The problem affected Docs pages such as `Design System/Doctrine/Core Position`. It did not affect the public package
  CSS, component source, or package consumers.
- The related paperclip/link icon still sits in Storybook's left heading gutter. That gutter placement is Storybook's
  own heading-anchor design. The bug was not that the icon sits left of the text; the bug was that the text moved when
  the manager/Docs theme changed.

### Confirmed Cause

The affected doctrine pages use MDX wrappers such as `.storybook/showcase/doctrine/core-position.mdx`:

```mdx
import {Markdown, Meta} from '@storybook/addon-docs/blocks'
import doctrine from '../../../docs/design-system-doctrine/core-position.md?raw'

<Meta title='Design System/Doctrine/Core Position'/>

<Markdown>{doctrine}</Markdown>
```

Storybook Docs turns Markdown headings into heading elements with an injected, hidden-from-accessibility anchor link:

```html
<h2 id="core-position" class="css-wzniqs">
    <a aria-hidden="true" href="#core-position" tabindex="-1" target="_self" class="css-1ofkq6d">...</a>
    Core Position
</h2>
```

In the healthy state, Storybook's generated anchor rule keeps the link icon in the left gutter without moving the
heading text:

```css
.css-1ofkq6d {
    float: left;
    line-height: inherit;
    padding-right: 10px;
    margin-left: -24px;
    color: inherit;
}
```

The local browser investigation confirmed this geometry:

- Healthy light Docs state: the heading text started at `x=20`, the anchor occupied `x=-4..20`, and the anchor computed
  `margin-left` was `-24px`.
- Broken dark Docs state before the workaround: the anchor occupied `x=20..44`, the heading text started at `x=44`,
  and the anchor computed `margin-left` became `0px`.

The dark Docs state still contained Storybook's anchor rule. The rule was not missing. It lost in the cascade because
switching `storybook-dark-mode` caused Storybook's dark Docs typography styles to be injected later:

```css
.css-4kloxd :where(a:not(.sb-anchor, .sb-unstyled, .sb-unstyled a)) {
    margin: 0px;
    line-height: 24px;
    color: rgb(71, 157, 255);
    text-decoration: underline 0.03125rem;
}
```

That generic Docs link selector applies to the generated heading anchor and, because it is injected later, overrides the
heading-anchor-specific `margin-left`, `line-height`, `color`, and text-decoration. The anchor then participates in the
heading flow and pushes the visible heading text right.

### Upstream Context

The exact local cascade failure is a Storybook Docs styling issue rather than a Nodzimo UI component or token issue.
There is adjacent upstream Storybook context around heading anchors:

- https://github.com/storybookjs/storybook/issues/31505 tracks a Storybook Docs heading-anchor visual issue. It is not a
  perfect one-to-one match for this dark-theme cascade failure, but it involves the same generated heading-anchor
  styling and the same negative `margin-left` placement model.
- https://github.com/storybookjs/storybook/pull/34945 fixed a related heading-anchor clipping/spacing issue upstream.
  That PR supports treating the behavior as Storybook Docs internals, not as a project component styling contract.

The local project still reproduced the dark-mode heading shift on Storybook `10.4.6`, including static
`storybook build` output. Because `10.4.6` was the current installed and npm-resolved version during the investigation,
waiting for a normal patch update was not an available fix at that point.

### Options Considered

- Do nothing. This was acceptable only if the team wanted to live with a Storybook-only visual glitch. It was rejected
  because the defect was repeatable, distracting in product-facing doctrine pages, and had a very small local fix.
- Disable heading anchors or replace Storybook's Markdown rendering. This was rejected because anchors are useful Docs
  behavior and replacing the renderer would be higher risk than the bug.
- Add broad Docs padding or redesign the heading gutter. This was rejected because the remaining left-gutter paperclip
  placement is Storybook's own design, and changing the whole Docs layout would be a larger customization.
- Add a narrow `.storybook/preview.css` override for only Storybook-generated heading anchors. This was accepted because
  it restores Storybook's own intended anchor geometry, affects only Storybook Docs, and avoids touching package
  component styles or published CSS.

### Active Workaround

Keep this rule in `.storybook/preview.css`:

```css
.sbdocs-content :is(h1, h2, h3, h4, h5, h6) > a[aria-hidden="true"][tabindex="-1"] {
    float: left;
    line-height: inherit;
    margin-left: -24px;
    padding-right: 10px;
    color: inherit;
    text-decoration: none;
}
```

The selector is intentionally constrained:

- `.sbdocs-content` keeps the rule inside Storybook Docs content.
- `:is(h1, h2, h3, h4, h5, h6) > a` targets heading anchors only.
- `[aria-hidden="true"][tabindex="-1"]` matches Storybook's generated non-focusable heading anchors rather than normal
  authored Markdown links.

The declarations intentionally mirror Storybook's healthy heading-anchor behavior instead of creating a new visual
system. `margin-left: -24px` keeps the icon in the left gutter and prevents heading text movement. The inherited line
height, inherited color, and removed text decoration prevent generic Docs link styles from making the service icon look
or measure like an ordinary inline link.

Do not broaden this workaround to all `.sbdocs-content a` links. The bug is the generated heading anchor losing its
special positioning, not normal Docs link styling.

### Verification

After applying the workaround, the static Storybook build was checked in a browser:

- `bun run storybook:build` completed successfully.
- Serving `storybook-static` and opening `Design System/Doctrine/Core Position` showed the visible heading text stayed
  at `x=20` before and after toggling the manager/Docs theme.
- The heading anchor stayed in the left gutter at `x=-4..20`, and its computed `margin-left` remained `-24px`.

For future Storybook, Docs, or theme-addon updates, re-check at least one raw-Markdown doctrine Docs page in both
manager/Docs themes. If Storybook later fixes the cascade ordering or excludes generated heading anchors from generic
link typography, remove this workaround after verifying the heading text no longer shifts without it.
