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

### Source Evidence

- Inspect the primary source behind a recommendation, including later issue comments, linked fixes, and applicable
  release details. Do not treat a search excerpt or the opening issue description as the complete answer.
- State what was actually verified and distinguish it from inference. If a source or part of a discussion cannot be
  inspected, disclose that limit rather than claiming that no solution exists.
- Prefer a supported setting or API over custom processing or suppression when it satisfies the project contract.
  Verify the chosen integration instead of presenting a documented option as proof that it works locally.

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

- Preserve durable contracts, confirmed causes, decisions, necessary alternatives, and meaningful verification
  evidence. Do not record fruitless searches, routine investigation chronology, personal details, named private
  consumers, machine-specific paths, or transient dependency reviews without an adopted decision.
- Keep versioned provenance or incident timelines only when they are necessary to reproduce a failure, identify
  vendored source, or explain the accepted decision. Routine work history belongs in Git, not permanent guidance.
- Keep technical decisions in their owning document and agent conduct rules in the operating charter. Do not add
  admonitions about a particular conversation to component, build, or IDE documentation.
- When writing Markdown documentation, use a language-tagged fenced code block only for snippets that are syntactically
  valid as that language on their own. Use `text` for partial JSX attributes, JSON fragments, placeholder syntax, or
  other illustrative snippets that IDE inspections would parse as broken code.
