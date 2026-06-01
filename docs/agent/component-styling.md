## Component Styling

- Base interactive primitives are built on `@base-ui/react` where appropriate.
- Use `class-variance-authority` for component variant class composition when a component has meaningful variants or
  sizes.
- Use the internal class-name merge helper from `#lib` for combining generated variant classes with caller `className`.
  Keep the exported helper name at the implementation module boundary, for example `export { mergeClassNames as mcn }`
  from the helper module itself, and let the barrel re-export `mcn` directly. Avoid hiding public local aliases only in
  a distant barrel, because imports, editor hovers, and generated bundles should reflect the name consumers actually
  use.
- When porting components from shadcn, Radix examples, or other Tailwind sources, preserve behavior and structure but
  adapt theme-facing classes to the NUI token namespace.
- Keep component public surfaces intentional. Do not export internal composition helpers merely because a copied source
  exports them; export subcomponents through a folder `index.ts` only when consumers should intentionally depend on
  them.
- Use the repo skill `.codex/skills/theme-token-adapter` for repeated token-prefix adaptation and review work.

