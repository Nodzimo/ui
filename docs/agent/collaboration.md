## Collaboration

### Communication

- Keep explanations concise, practical, and human-readable.
- When discussing architecture or config, explain what each setting is responsible for.
- Do not invent compatibility requirements. If a setting is a fallback or legacy convenience, say that clearly.
- Keep configs minimal: do not restate explicit defaults. A config option should appear only when it intentionally
  changes default behavior or documents a project decision.
- For questions, answer first and do not edit files unless asked.
- For implementation requests, keep changes scoped and verify with the smallest relevant command.
- For review and design feedback, be direct and rigorous: lead with concrete issues, explain the technical or UX reason
  behind each recommendation, challenge weak naming or architecture, and treat disagreement as a way to clarify the
  better solution rather than as a reason to soften the critique.

### Project Code Style

- Preserve project style: tabs, single quotes, no semicolons, named exports.
- Keep implementation code direct and readable. Prefer a few named local constants over dense chains when a chain mixes
  data preparation, sorting, and rendering. Introduce small explicit local types when inferred types become noisy or
  leak implementation detail into editor hovers; do not add helper functions, wrapper types, or advanced APIs unless
  they remove real complexity.
- Separate multiline declarations from neighboring declarations with blank lines when they would otherwise stick to
  single-line constants, functions, or other visual blocks. Closely related one-line constants may stay grouped.
- Name things according to their lifespan and scope. Broad, exported, cross-file, or public-facing entities need precise
  descriptive names. Short-lived local helpers may stay simple and generic when their surrounding context makes their
  purpose obvious.

### Literal Tables And Storybook Values

- Keep literal-table typing, naming, and finite-value conventions aligned with
  [Code Style Conventions](code-style-conventions.md).
- Treat Storybook as a real consumer of the UI-kit contract. If a component has owned finite values such as variants,
  sizes, placement sides, or alignments, expose runtime constants and derived types from the component layer so
  Storybook and package consumers share one source of truth. Storybook Controls cannot use erased TypeScript unions by
  themselves.

For story-specific controls guidance, see [Storybook Story Writing](storybook-story-writing.md).

### Markdown Documentation

- When writing Markdown documentation, use a language-tagged fenced code block only for snippets that are syntactically
  valid as that language on their own. Use `text` for partial JSX attributes, JSON fragments, placeholder syntax, or
  other illustrative snippets that IDE inspections would parse as broken code.
