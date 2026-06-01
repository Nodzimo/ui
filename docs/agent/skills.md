## Skills

- For pre-update dependency research from `bun outdated`, post-update changelog review, breaking-change triage, or
  deciding whether upgraded packages need local code/config/package metadata changes, use the project-local
  `dependency-update-reviewer` skill at `.codex/skills/dependency-update-reviewer`.
- For repeated token-prefix adaptation and review work, use the project-local `theme-token-adapter` skill at
  `.codex/skills/theme-token-adapter`.
- For formatting long Tailwind class strings into readable grouped chunks without changing the styles, use the
  project-local `tailwind-class-formatter` skill at `.codex/skills/tailwind-class-formatter`.
- For final project convention review and safe fixes beyond Biome, including JSX literal braces, rest-prop naming,
  type-vs-interface choices, literal table typing, and orchestration of Tailwind class formatting, use the project-local
  `code-style-reviewer` skill at `.codex/skills/code-style-reviewer`.
- For writing, reviewing, or updating component stories, use the project-local `storybook-story-writer` skill at
  `.codex/skills/storybook-story-writer`.
- For changes that affect `src/core`, `src/client`, public entrypoints, Vite externals, package dependency metadata,
  build output, or Next/RSC consumer compatibility, use the project-local `rsc-package-boundary-reviewer` skill at
  `.codex/skills/rsc-package-boundary-reviewer`.

