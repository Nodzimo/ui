# Nodzimo UI Agent Notes

## Project Goal

- Build a modern React UI kit/library for current React and Next projects.
- Target package consumers and bundlers, not direct browser `<script>` usage.
- Keep configuration minimal and explicit. Every package field and build option should have a concrete reason.
- Prefer the smallest working modern setup over legacy fallbacks.

## Stack

- Package/runtime tooling: Bun.
- Build tool: Vite 8 library mode on Rolldown.
- Framework target: React 19.
- Language: TypeScript.
- Formatter/linter/assist: Biome.
- React optimization: React Compiler via `@vitejs/plugin-react`, `@rolldown/plugin-babel`, and
  `babel-plugin-react-compiler`.
- Declaration generation: `unplugin-dts`.

## Collaboration

- Keep explanations concise, practical, and human-readable.
- When discussing architecture or config, explain what each setting is responsible for.
- Do not invent compatibility requirements. If a setting is a fallback or legacy convenience, say that clearly.
- For questions, answer first and do not edit files unless asked.
- For implementation requests, keep changes scoped and verify with the smallest relevant command.
- Preserve project style: tabs, single quotes, no semicolons, named exports.

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
- Keep JSON comments disabled. Project JSON files should be strict JSON, not JSONC.
- Do not add `files.includes` globs that duplicate `.gitignore` unless Biome needs a narrower project-specific scope.
- Do not enable global `assist/source/useSortedKeys`; it sorts whole JSON objects such as `package.json`, `scripts`,
  `exports`, and tsconfig sections into an unreadable order.
- Biome does not format Markdown in this setup. Format Markdown files manually or with the editor.

## Repository Text Format

- Keep `.gitattributes` in place to normalize text files to LF across platforms.
- Keep `.bat` and `.cmd` files as CRLF through `.gitattributes`.

## Public Package Shape

- The package is ESM-only.
- Do not add CJS, UMD, or IIFE outputs unless a real consumer requires them.
- The public API is split into two entrypoints:
    - `nodzimo-ui` for core/RSC-safe exports.
    - `nodzimo-ui/client` for client-boundary exports.
- Consumers should import from public package entrypoints, not from `src` or deep internal paths.
- `files: ["dist"]` keeps packed/published contents limited to build output.
- The package export map is intentionally minimal:
    - `exports["."].import` points to `dist/nodzimo-ui.js`.
    - `exports["."].types` points to the generated root declaration file.
    - `exports["./client"].import` points to `dist/client.js`.
    - `exports["./client"].types` points to the generated client declaration file.
- Avoid adding `main`, `module`, or `default` fallbacks unless a confirmed consumer needs them.

## Source Layout

- `src/index.ts` is the root package entry and re-exports from `src/core`.
- `src/client.ts` is the client package entry. It must start with `'use client'` and re-export from `src/client/index`.
- `src/core` contains exports that are safe to import from React Server Components and ordinary modern React apps.
- `src/client` contains client-only exports such as interactive components and hooks.
- `src/client.ts` and the `src/client/` directory intentionally coexist. In `src/client.ts`, import the directory barrel
  explicitly as `./client/index` to avoid self-resolution back to `src/client.ts`.
- Keep public exports flowing through barrels, but keep the public surface intentional.

## Core Vs Client

- `core` does not mean server-only. It means no client boundary is required.
- `core` code must not depend on browser-only APIs, React state/effect hooks, event-driven behavior, or React Compiler
  runtime.
- `client` code may use state, effects, refs, browser APIs, interactive behavior, and React Compiler.
- A Server Component may render a Client Component. That does not automatically make a Next route dynamic;
  static/dynamic rendering depends on Next dynamic APIs and data access, not merely on client components.

## React Compiler Boundary

- React Compiler must not process `src/core`.
- React Compiler is scoped to:
    - `src/client.ts`
    - everything under `src/client/`
- This is configured with `clientCompilerIncludes` in `vite.config.ts`.
- The expected build output:
    - `dist/nodzimo-ui.js` imports `react/jsx-runtime` and must not import `react/compiler-runtime`.
    - `dist/client.js` starts with `"use client";` and may import `react/compiler-runtime`.
- If `react/compiler-runtime` appears in `dist/nodzimo-ui.js`, the root entry is no longer RSC-safe.
- If `"use client";` disappears from `dist/client.js`, Next will not see the client boundary.

## Dependency Concepts

- `exports` defines the package public entrypoints and the files consumers are allowed to import.
- `external` in Vite/Rolldown keeps dependencies such as React out of the bundled library output.
- `peerDependencies` declare dependencies that must be provided by the consuming app. React and React DOM should become
  peer dependencies before publishing, while staying in dev dependencies for local development.
- `'use client'` is a Next/React client boundary. It must be present on the built public client entry that consumers
  import.
- Multiple entrypoints separate the RSC-safe API from the client API.
- React Compiler scope controls which source files get compiler runtime output.

## Vite Build Notes

- Library mode uses two entries:
    - `nodzimo-ui: 'src/index'`
    - `client: 'src/client'`
- Only `formats: ['es']` is needed for the modern target.
- Keep these externals:
    - `react`
    - `react-dom`
    - `react/jsx-runtime`
    - `react/compiler-runtime`
- `react/compiler-runtime` is required because client output compiled by React Compiler imports it.
- `unplugin-dts` must use `tsconfigPath: 'tsconfig.app.json'`; the root `tsconfig.json` only contains project references
  from the Vite template.

## Local Consumer Testing

- `bun link` works in simple Vite/React consumers, but it is not reliable with Next 16 Turbopack.
- Next 16 Turbopack can fail to resolve linked/junction packages even when Node, Bun, and IDE resolution work.
- Avoid using `turbopack.root` as a workaround unless the parent folder is a real monorepo root with its own
  `package.json` and `node_modules`. Setting the root to the sibling parent can break Tailwind/PostCSS dependency
  resolution in the Next app.
- Avoid `file:../nodzimo-ui` as a folder dependency with Bun on Windows. Bun can try to copy the whole working
  directory, including `.git`, and fail with `EPERM`.
- Preferred local Next/Turbopack flow:
    1. Run `bun run lib:pack` in this project.
    2. Install the generated `nodzimo-ui.tgz` in the Next consumer.
    3. Reinstall the tarball in the consumer after each library rebuild.
- Keep generated `.tgz` archives out of git.

## Scripts

- `bun run build` runs TypeScript project checks and Vite library build.
- `bun run build:watch` runs the build in watch mode.
- `bun run lib:pack` builds and packs the package as `nodzimo-ui.tgz`.
- `bun run check:lint` runs Biome checks.
- `bun run check:format` runs only Biome formatting.
- `bun run check:fix` applies safe Biome fixes, formatting, and import organization.
- `bun run check:fix-unsafe` applies unsafe Biome fixes intentionally.
- `bun run deps:outdated` checks dependency updates.

## Verification

- Use `bun run build` after changing Vite config, package exports, type generation, source entrypoints, React Compiler
  scope, or client/core boundaries.
- Inspect `dist/nodzimo-ui.js` and `dist/client.js` after build changes that affect React Compiler or entrypoints.
- For Next/Turbopack consumer checks, pack the library and reinstall the tarball in the Next app.
- If a client component fails in Next with compiler runtime errors, check whether `"use client";` is present in the
  built client entry.
- If a core component fails in a Server Component context, check whether `react/compiler-runtime` leaked into the root
  bundle.
