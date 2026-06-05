## WebStorm Project Settings

### Shared Settings

- The project intentionally shares selected WebStorm settings under `.idea`: dictionaries, inspection profiles, and
  scopes. Keep `.idea` sharing narrow and do not commit workspace state, shelves, local run history, or user-specific
  IDE files.

### Inspection Scopes

- Use shared inspection scopes for repeatable WebStorm false positives in generated, tooling, or convention files.
  Prefer disabling a specific inspection for a narrow scope over adding `// noinspection` comments to source files or
  disabling an inspection globally.
- When extending WebStorm inspection exclusions, add the affected files to `.idea/scopes` and adjust the project profile
  in `.idea/inspectionProfiles`. Keep the scope name and profile entry descriptive enough that another developer can see
  which IDE warning is being silenced and where.
- Keep the `Library Stylesheet Contracts` scope for `src/styles.css`, `src/library.css`, and `.storybook/preview.css`
  with WebStorm's `CssUnusedSymbol` inspection disabled. Public stylesheet hooks such as `.dark`, `.nui-surface`,
  foundation classes, and Storybook-owned selectors such as `.docs-story` are external contracts and do not need local
  source references to be valid.
