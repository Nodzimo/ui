## Stack

- Package/runtime tooling: Bun.
- Package publishing: Bun. Use npm CLI only through `bunx npm` for registry commands that Bun does not provide
  directly, such as login and funding inspection.
- Build tool: Vite 8 library mode on Rolldown.
- Framework target: React 19.
- Language: TypeScript.
- Styling: Tailwind CSS 4.
- Formatter/linter/assist: Biome.
- React optimization: React Compiler via `@vitejs/plugin-react`, `@rolldown/plugin-babel`, and
  `babel-plugin-react-compiler`.
- Declaration generation: `unplugin-dts` with API Extractor declaration bundling.
- CSS generation: Tailwind CLI via `@tailwindcss/cli`.
