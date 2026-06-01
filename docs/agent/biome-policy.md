## Biome Policy

- Keep `biome.json` compact and explicit. Prefer Biome defaults unless the project intentionally needs a different
  behavior.
- Do not add explicit defaults such as `formatter.enabled`, `linter.enabled`, `assist.enabled`, or
  `linter.rules.recommended` just for completeness.
- Keep VCS integration enabled with Git ignore support. The project relies on `.gitignore` to keep generated and
  service files such as `dist`, `node_modules`, `.idea`, and package archives out of Biome checks.
- Keep the React lint domain enabled because this is a React UI kit. Do not add the Next domain here; Next-specific
  rules belong in Next applications.
- Keep JavaScript formatter preferences explicit: single quotes, no unnecessary semicolons, single JSX quotes, and
  as-needed arrow parentheses.
- Keep the HTML formatter enabled only because Storybook head snippets are real project files. Biome's HTML formatter is
  experimental and does not currently expose an HTML attribute quote-style option, so double-quoted HTML attributes are
  acceptable even though JavaScript and JSX use single quotes.
- Keep JSON comments disabled. Project JSON files should be strict JSON, not JSONC.
- After updating `@biomejs/biome`, run the local migration script `bun run biome:migrate` and review any
  `biome.json` changes before treating the dependency update as complete. Keep the `$schema` version aligned with the
  installed Biome version when the schema URL is versioned.
- Do not add `files.includes` globs that duplicate `.gitignore` unless Biome needs a narrower project-specific scope.
- Do not enable global `assist/source/useSortedKeys`; it sorts whole JSON objects such as `package.json`, `scripts`,
  `exports`, and tsconfig sections into an unreadable order.
- Biome does not format Markdown in this setup. Format Markdown files manually or with the editor.

