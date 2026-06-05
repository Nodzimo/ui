## Storybook Testing

- Keep Storybook TypeScript context separate from the library source TypeScript context. A `.storybook/tsconfig.json`
  may extend the app tsconfig so Storybook config files understand Vite CSS imports without adding `.storybook` to the
  library `tsconfig.app.json` include list. Include both `./*.ts` and `./*.tsx` so `main.ts` and JSX-bearing preview
  files are checked together.
- Storybook Vitest/browser testing config belongs in `vitest.config.ts`, merged with the base Vite config when needed.
  The Storybook test plugin may launch Storybook with a command such as `bun storybook -- --no-open`; this launches the
  Storybook dev server for the test run, it is not a separate user-facing test script by itself.
- Do not add `setupFiles` for Storybook/Vitest unless the referenced setup file actually exists and contains real
  project setup such as mocks or custom matchers. Storybook preview annotations are handled by the addon path.
- On Windows/local browser testing, keep Vitest browser API host explicit as `127.0.0.1` if `localhost` causes
  Playwright `ERR_CONNECTION_REFUSED` against the internal Vitest browser URL.
- Playwright browser binaries are installed outside the repo in the user cache. If browser tests ask for browsers after
  dependency updates, run `bunx playwright install chromium` from the project terminal.
- A `vitest.init()` deprecation warning seen while running Storybook visual/interaction tests can come from
  `@storybook/addon-vitest` internals. Do not rewrite local config only for that warning unless Storybook documents a
