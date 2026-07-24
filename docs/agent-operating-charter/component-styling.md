## Component Styling

### Composition

- Base interactive primitives are built on `@base-ui/react` where appropriate.
- Use `class-variance-authority` for component variant class composition when a component has meaningful variants or
  sizes.
- Use the internal class-name merge helper from `#lib` for combining generated variant classes with caller `className`.
  Keep the exported helper name at the implementation module boundary, for example `export { mergeClassNames as mcn }`
  from the helper module itself, and let the barrel re-export `mcn` directly. Avoid hiding public local aliases only in
  a distant barrel, because imports, editor hovers, and generated bundles should reflect the name consumers actually
  use.

### Token Adaptation

- When porting components from shadcn, Radix examples, or other Tailwind sources, preserve behavior and structure but
  adapt theme-facing classes to the NUI token namespace.
- Resolve shadcn registry/build markers before treating copied code as runtime source. In particular,
  `cn-rtl-flip` must become the official generated form `rtl:rotate-180` at a directional icon usage site; see
  [Theme Token Contract](theme-token-contract.md#rtl-and-logical-motion) for the source evidence and Portal-direction
  caveat.
- Read [Theme Token Contract](theme-token-contract.md) before adapting copied component styles, and use
  [Tailwind And Styles](tailwind-and-styles.md) for class naming, CSS entrypoint, and source-detection rules.

### Shared Link Styling

- Use `.nui-link` as the single visual recipe for NUI text links. Do not repeat its foreground, underline, hover, or
  active classes in React variants or consumer examples.
- Button `variant='link'` composes `.nui-link` with the Button base. The class shares presentation; it does not turn a
  button into a hyperlink or move button geometry and behavior into the link recipe.
- Use `.nui-links` when native and framework-rendered anchors in a subtree should receive the recipe automatically. Do
  not add a framework-agnostic React `Link` wrapper until the library owns real behavior beyond styling.

See [NUI Link Foundation Decision](nui-link-foundation-decision.md) for the ownership and composition rationale.

### Class Formatting

- Long Tailwind class lists should be split into readable static chunks without changing visual behavior. Prefer
  recognizable groups to equal line lengths, keep caller `className` last in merge calls, and do not use CVA only as a
  line-break mechanism.
- Treat copied class lists as source-of-truth data during formatting: do not add, remove, rename, token-adapt, or
  silently fix classes while doing a formatting-only pass.

### Public Surface

- Keep component public surfaces intentional. Do not export internal composition helpers merely because a copied source
  exports them; export subcomponents through a folder `index.ts` only when consumers should intentionally depend on
  them.
- For complex shadcn/Base UI ports, follow the staged
  [shadcn Component Adaptation](shadcn-component-adaptation.md) workflow. Keep token conversion, public API hardening,
  decomposition, and Storybook work reviewable as separate concerns.

### Related Skills

- Use the repo skill `.agents/skills/theme-token-adapter` for repeated token-prefix adaptation and review work.
- Use `.agents/skills/compound-component-adapter` for public compound APIs and self-contained decomposition after
  styling and RTL are stable.
