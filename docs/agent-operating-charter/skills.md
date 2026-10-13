## Skills

Keep skills procedural. Durable project rules belong in `docs/agent-operating-charter`, detailed skill-specific
references belong in skill
`references`, and repeatable checks belong in skill `scripts`. Do not duplicate large project rules inside `SKILL.md`;
when removing duplicated skill text, first verify that any unique project fact is preserved in the proper source of
truth.

### Session Documentation

- To document completed session work before handoff or clearing the chat, use
  [document-work](../../.agents/skills/document-work/SKILL.md). Invoke it with:

```text
Use $document-work to document the work completed in this session.
```

- The skill owns the repeatable procedure, including coverage of committed work and review from work to documentation
  and from documentation to implementation. The
  repository's [documentation policy](collaboration.md#markdown-documentation)
  owns local editorial requirements; do not maintain a second procedure here.
- Keep the skill portable: it discovers the repository's documentation owners, conventions, and relevant checks rather
  than depending on this project's stack or directory layout. Its completion report states whether important knowledge
  still depends on the conversation and identifies any missing context or unresolved decisions.

### Dependency And Package Boundary

- For pre-update dependency research from `bun outdated`, post-update changelog review, breaking-change triage, or
  deciding whether upgraded packages need local code/config/package metadata changes, use the project-local
  `dependency-update-reviewer` skill at `.agents/skills/dependency-update-reviewer`.
- For changes that affect `src/core`, `src/client`, public entrypoints, Vite externals, package dependency metadata,
  build output, or Next/RSC consumer compatibility, use the project-local `rsc-package-boundary-reviewer` skill at
  `.agents/skills/rsc-package-boundary-reviewer`.

### Component Porting, Styling, And Stories

- For an end-to-end shadcn/Base UI component port, follow
  [shadcn Component Adaptation](shadcn-component-adaptation.md) and keep its passes reviewable.
- For repeated token-prefix adaptation, shadcn registry-marker resolution, RTL/logical-motion conversion, and review
  work, use the project-local `theme-token-adapter` skill at `.agents/skills/theme-token-adapter`.
- For public compound-part props, finite runtime option constants, wrapper-owned boolean data attributes, component
  folder barrels, and self-contained semantic decomposition, use the project-local `compound-component-adapter` skill at
  `.agents/skills/compound-component-adapter`.
- For formatting long Tailwind class strings into readable grouped chunks without changing the styles, use the
  project-local `tailwind-class-formatter` skill at `.agents/skills/tailwind-class-formatter`.
- For final project convention review and safe fixes beyond Biome, including JSX literal braces, rest-prop naming,
  type-vs-interface choices, literal table typing, and orchestration of Tailwind class formatting, use the project-local
  `code-style-reviewer` skill at `.agents/skills/code-style-reviewer`.
- For writing, reviewing, or updating component stories, use the project-local `storybook-story-writer` skill at
  `.agents/skills/storybook-story-writer`.
- For writing, revising, reorganizing, or reviewing product-facing design-system doctrine and its Storybook MDX mirrors,
  use the project-local `doctrine-writer` skill at `.agents/skills/doctrine-writer`.
