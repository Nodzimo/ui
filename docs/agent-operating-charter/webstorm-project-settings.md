## WebStorm Project Settings

### Shared Settings

- The project intentionally shares selected WebStorm settings under `.idea`: dictionaries, inspection profiles,
  scopes, two project code-style files, and the Tailwind language-server exclusion. Keep sharing narrow; do not commit
  workspace state, shelves, local run history, or user-specific IDE files.

### Project Import Preferences

- `.idea/codeStyles/Project.xml` sets TypeScript `USE_PATH_MAPPING` to `DIFFERENT_PATHS`, shown in the IDE as **Use path
  mappings from tsconfig.json -> Only in files outside specified paths**. This covers TypeScript and TSX;
  it does not introduce a second source import map or alter compiler/build resolution.
- `.idea/codeStyles/codeStyleConfig.xml` sets `USE_PER_PROJECT_SETTINGS: true`. The project scheme applies to this
  repository independently of an IDE-level scheme that may retain **Always**. The stored preferred IDE scheme is a
  fallback, not the active scheme when project settings are enabled.
- `.gitignore` allows only `Project.xml` and `codeStyleConfig.xml` within `codeStyles`; other generated style files
  remain ignored. Share the import preference rather than exporting unrelated personal formatting settings.
- Keep `ES6PreferShortImport` enabled. It suggests shorter imports but does not establish that a barrel dependency is
  architecturally appropriate. Direct imports inside an implementation area must not be replaced by imports through
  that area's own aggregate barrel merely to shorten the path.
- The project preference resolves repeated suggestions to replace generated icons' direct `IconProps` imports with
  `#core/icons`. A full project inspection confirmed that those warnings disappear without source changes, per-file
  comments, or disabling the inspection for implementation scopes.
- Validate both diagnostics and auto-import behavior after changing this setting: direct local part/type imports,
  imports from another component's public folder surface, and Storybook imports. A clean inspection is not proof of an
  acyclic graph or a safe core/client boundary; keep dependency and package checks.
- If an existing IDE session does not pick up shared settings, confirm the **Project** scheme is selected and reopen
  the project before adding suppressions. New or regenerated icons should need no manual settings changes.

References: [JetBrains import-style configuration](https://blog.jetbrains.com/webstorm/2020/07/configuring-the-style-of-imports-in-javascript-and-typescript/),
[project code-style schemes](https://www.jetbrains.com/help/webstorm/configuring-code-style.html),
[inspection definition](https://www.jetbrains.com/help/inspectopedia/ES6PreferShortImport.html), and
[WEB-38719](https://youtrack.jetbrains.com/projects/WEB/issues/WEB-38719/Irritating-Import-can-be-shortened-inspection).
The issue's later comment identifies the accepted mode. Scoped inspection exclusions remain a fallback for
demonstrated false positives when supported import preferences do not resolve the mismatch.

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

### Vendored Tailwind Extensions

- Keep the `Tailwind Extensions Stylesheet` scope restricted to `src/tailwind-extensions.css`. In the project inspection
  profile, disable `CssInvalidAtRule`, `CssInvalidFunction`, `CssInvalidPropertyValue`, `CssOverwrittenProperties`,
  `CssUnresolvedCustomProperty`, and `DuplicatedCode` only for that scope.
- Exclude the same file from the WebStorm Tailwind language server through `.idea/tailwindcss.xml`. This prevents its
  separate diagnostic stream from reporting the vendored CSS-first directives and selectors after IDE inspections are
  scoped correctly.
- These exclusions cover false positives caused by upstream Tailwind directives, nested functions, fallback
  declarations, custom properties, and intentionally repeated selector forms. Keep the inspections enabled elsewhere;
  validate this file by comparison with its pinned upstream source and by the Tailwind package and Storybook builds
  instead of adding source comments or weakening project-wide CSS analysis.

For provenance, update procedure, compiler behavior, and artifact verification, see
[Tailwind shadcn Extensions Decision](tailwind-shadcn-extensions-decision.md).
