## NUI Link Foundation Decision

### Problem

Nodzimo UI already defined the intended text-link appearance in Button's `link` variant: foreground text, a
primary-colored underline at rest, primary text on hover, and a thinner underline while active. Ordinary anchors and
framework links did not receive that treatment, so consumers had to repeat the same classes in application globals or at
every call site.

The missing contract was presentation, not behavior. Native `<a href>` already provides hyperlink semantics, keyboard
behavior, browser navigation, context menus, and open-in-new-tab behavior. Next.js `Link` renders an anchor and forwards
anchor attributes such as `className`. A Nodzimo React wrapper would not improve either surface unless it also assumed
ownership of additional behavior.

### Research

shadcn/ui does not list a standalone general-purpose `Link` component. Its link-related APIs solve narrower jobs:

- Button composition makes a router link look like a button.
- Breadcrumb and Navigation Menu expose links within those components' own structure and interaction model.
- The current Typeset system styles ordinary rendered HTML through an opt-in container. It explicitly uses `:where()`
  for low-specificity descendant selectors so local utilities can override the preset.

The Typeset model is the closest shadcn precedent for Nodzimo's requirement: style native elements inside an explicit
scope instead of wrapping every element in React. Nodzimo uses a narrow link foundation rather than adopting an entire
article/Markdown typography system.

Chakra UI and Material UI demonstrate the other common architecture. They expose `Link` components and compose or adapt
framework routers through `asChild`, `component`, or routing adapters. Those are valid choices when a component owns a
component API, polymorphism, routing defaults, or additional behavior. They do not create new hyperlink semantics, and
they would add an unnecessary wrapper contract for Nodzimo's current presentation-only requirement.

### Decision

Nodzimo UI provides one CSS-owned link recipe with two application modes:

- `.nui-link` applies the canonical appearance to one element.
- `.nui-links` is an opt-in foundation scope that applies the same appearance to descendant hyperlinks.

Button `variant='link'` uses `.nui-link` on top of the existing Button base. The grouped CSS selector is the only source
of the link-specific rest, hover, and active styles. Button geometry, hit area, focus treatment, disabled behavior, and
other action-component concerns remain in the Button base.

There is no public Nodzimo React `Link` component and no unscoped global `a` rule.

### Visual Contract

```text
Rest:
text = foreground
underline = primary, 2px
underline offset = 4px

Hover:
text = primary

Active:
underline = 1px
```

Text links stay underlined at rest. Color alone is not the interaction cue. Contextual components may intentionally
override the recipe when their structure already makes navigation unmistakable, but the default hyperlink language
remains visible and consistent.

### Consumer Contract

Apply the complete opt-in NUI foundation at the application root when the product wants the default link language
everywhere:

```text
<body className="nui-surface nui-boundaries nui-interactive nui-links">
```

Native, fragment, external, and Next.js links then need no NUI wrapper or repeated visual classes:

```text
<a href="/about">About</a>
<a href="#details">Details</a>
<a href="https://example.com">External resource</a>
<NextLink href="/dashboard">Dashboard</NextLink>
```

Use the singular class for one link outside a foundation scope:

```text
<a className="nui-link" href="/about">About</a>
<NextLink className="nui-link" href="/dashboard">Dashboard</NextLink>
```

An `<a>` without `href` is an anchor target, not an interactive hyperlink, and is intentionally not selected by
`.nui-links`.

### Selector And Cascade

The implementation lives in `src/library.css` inside Tailwind's `base` layer:

```text
.nui-link,
.nui-links :where(a:any-link) {
    ...
}
```

- `a:any-link` matches anchors with an `href`, including fragment and framework-rendered anchors.
- `:where()` contributes zero specificity for its contents. The scope class remains the only selector weight before
  state pseudo-classes are applied.
- Tailwind utilities live in the later `utilities` layer, so component- or consumer-authored classes can override the
  foundation without `!important` or selector escalation.
- Grouping `.nui-link` with the scoped anchor selector emits one shared declaration block rather than maintaining two
  copies of the visual recipe.

The selectors are authored CSS, not a Tailwind `@utility`. They are therefore emitted directly into the compiled package
stylesheet and do not require `@source inline(...)` safelisting.

### Artifact Ownership

- `src/library.css` owns the recipe and foundation selector.
- `src/styles.css` compiles them into published `dist/styles.css` without Preflight.
- Storybook imports `src/library.css` and compiles the same source into its independent application stylesheet.
- `src/theme.css` does not contain these selectors. It remains consumer compiler metadata for token-derived Tailwind
  utilities, while `nui-link` and `nui-links` are ready-built runtime CSS classes.

A Tailwind consumer does not regenerate the link recipe, so this decision does not introduce consumer/package CSS
duplication. Runtime availability comes from `@nodzimo/ui/styles.css`; Tailwind-specific autocomplete for these two
plain CSS classes is not part of the `@nodzimo/ui/theme.css` contract.

### Naming

The singular/plural pair follows the existing compact NUI foundation language:

```text
nui-link = one styled element
nui-links = descendant-link scope
```

`hyperlink` was rejected as needless verbosity, `anchor` as HTML-mechanism terminology that also includes non-link
anchors, and `link-scope` or `link-foundation` as implementation terminology inconsistent with `nui-surface`,
`nui-boundaries`, and `nui-interactive`.

### Alternatives Rejected

- **Unscoped global `a` styling.** Rejected because importing the library stylesheet would silently restyle every
  consumer link. Broad NUI behavior remains opt-in.
- **A Nodzimo React `Link` wrapper.** Rejected because it would add an API and wrapper without adding semantics or
  behavior. Native anchors and framework links already own navigation.
- **Polymorphic `as`, `asChild`, Slot, or Base UI `render` composition.** Rejected for this feature because the
  composition machinery would exist only to place CSS on an element that already accepts `className`.
- **A Next.js-specific adapter.** Rejected because Nodzimo UI is framework-agnostic and Next.js already forwards the
  required anchor surface.
- **Consumer-local global styles.** Rejected because every product would have to reproduce and maintain the NUI link
  language independently.
- **Only `.nui-link`, with no scope.** Rejected because products choosing the standard NUI hyperlink language would
  still repeat a class at every call site.
- **A broad `nui-typography` or `nui-prose` system.** Rejected because the current requirement covers links only. Such a
  name would promise headings, paragraphs, lists, tables, and reading rhythm that Nodzimo does not yet provide.

### When A Component Becomes Justified

Revisit a React `Link` only when Nodzimo must own behavior that CSS and native anchors cannot provide consistently, such
as analytics instrumentation, external-link disclosure, security defaults, pending navigation state, active-route
semantics, or a real cross-router API. Do not introduce the wrapper in anticipation of those requirements.

### Evidence

The library build emitted one grouped rest rule plus grouped hover and active rules into `dist/styles.css`. Button's
built variant table referenced only `nui-link`, and the package stylesheet remained free of Preflight. Storybook built
the same source contract into its own iframe stylesheet.

Published version 0.0.15 was installed in the Next.js consumer. Root-scoped ordinary links, fragment links, Next.js
links, individual `nui-link` usage, and Button `variant='link'` worked without consumer-local copies of the visual
classes.

### External References

- shadcn's component inventory contains no standalone general-purpose Link:
  <https://ui.shadcn.com/docs/components>.
- shadcn Typeset uses an opt-in container and low-specificity `:where()` descendant selectors:
  <https://ui.shadcn.com/docs/typeset>.
- shadcn Button, Breadcrumb, and Navigation Menu document component-specific link composition:
  <https://ui.shadcn.com/docs/components/base/button>,
  <https://ui.shadcn.com/docs/components/base/breadcrumb> and
  <https://ui.shadcn.com/docs/components/base/navigation-menu>.
- Next.js documents that `Link` extends the anchor surface and forwards anchor attributes such as `className`:
  <https://nextjs.org/docs/app/api-reference/components/link>.
- [Chakra UI's Link documentation](https://chakra-ui.com/docs/components/link) demonstrates a component plus `asChild`
  router composition.
- [Material UI's Link documentation](https://mui.com/material-ui/react-link/) demonstrates a component plus routing
  adapters and a polymorphic `component` prop.
- WAI technique G182 identifies underlining as an additional visual cue that keeps links distinguishable without relying
  on color alone: <https://www.w3.org/WAI/WCAG22/Techniques/general/G182>.

### Reasoning Failures To Avoid

- Do not create a React component merely because a visual role has a name. First identify behavior, semantics, or
  structure that native HTML and CSS do not already provide.
- Do not confuse Button's `link` appearance with hyperlink semantics. They share a visual recipe; the rendered element
  and component base still own behavior.
- Do not copy the recipe between TypeScript variants and global CSS. `.nui-link` is the visual source of truth.
- Do not make broad package styling unconditional. A one-time root class is minimal setup while preserving consumer
  ownership.
- Do not replace `:where(a:any-link)` with a stronger descendant selector without checking override behavior and
  non-link anchors.
- Do not put ready-built foundation selectors into `theme.css`. Compiler mappings and runtime CSS classes are different
  package contracts.

For active implementation rules, see
[Theme Token Contract](theme-token-contract.md#theme-variants-and-foundation-utilities),
[Component Styling](component-styling.md), and [Tailwind And Styles](tailwind-and-styles.md).
