---
name: dependency-update-reviewer
description: Review available or already-installed package dependency updates. Use when Codex is asked to run or interpret npm/Bun outdated results, decide whether packages should be updated, inspect package.json/lockfile update diffs, research official release notes, changelogs, GitHub PRs, migrations, or breaking changes, compare them to local React/Vite UI-kit usage, and report whether code/config/peer dependency changes or verification steps are needed.
---

# Dependency Update Reviewer

## Overview

Use this skill to turn dependency update noise into a short engineering decision report. Research what changed upstream,
map the changes to the UI kit's actual usage and published package contract, and say whether the project should update,
can commit an existing update, or needs action.

Do not edit project files unless the user explicitly asks for implementation. A review request should end with a report,
not a patch.

## Mode Selection

Start by deciding which mode applies:

- **Pre-update review**: no dependency diff exists, or the user asks whether available updates are worth taking. Run the
  package manager's outdated command and produce an update recommendation before changing files.
- **Post-update review**: `package.json`, lockfiles, or dependency install artifacts already changed. Inspect exact
  installed/spec changes and decide whether the update is safe to commit or needs follow-up work.
- **Mixed review**: if both outdated candidates and existing diffs are present, review existing diffs first, then
  mention additional available updates separately.

## Pre-Update Workflow

1. Inspect working tree and available candidates.
    - Run `git status --short`.
    - For this project, run `bun run deps:outdated` or `bun outdated`.
    - Treat outdated output as a candidate list, not as a lockfile truth. Confirm exact latest/current versions from npm
      metadata or official release pages when risk matters.

2. Select review scope.
    - Include `dependencies`, `peerDependencies`, and `devDependencies`.
    - Prioritize consumer-facing runtime dependencies, peer dependency ranges, Vite/Rolldown, TypeScript/declaration
      generation, React Compiler, Tailwind CSS, Storybook, Vitest/Playwright, Biome, and dependency graph tooling.
    - For large update sets, group low-risk patch updates and spend research time on high-risk packages first.

3. Research upstream and local usage using the shared research workflow below.

4. Report an update plan.
    - Say which packages are safe to update together.
    - Say which packages should be updated separately.
    - Say which packages should wait or need migration work first.
    - Say whether a peer dependency range change is appropriate or whether only the local dev dependency should move.
    - Recommend checks to run after the update.

## Post-Update Workflow

1. Inspect exact local update scope.
    - Run `git status --short`.
    - Run `git diff -- package.json bun.lock package-lock.json pnpm-lock.yaml yarn.lock`.
    - If useful, run `python .codex/skills/dependency-update-reviewer/scripts/changed_dependencies.py`.
    - Identify each changed direct dependency, peer dependency, and version pair.

2. Research upstream and local usage using the shared research workflow below.

3. Report commit readiness.
    - Say whether the existing dependency diff is reasonable to commit.
    - Name required local code/config/package contract changes, if any.
    - Recommend checks to run before commit, publishing, or consumer testing.
    - For Biome updates, verify whether `biome.json` changed with the dependency update. If it did not, run the local
      migration script when available, or recommend `biome migrate --write` before treating the update as complete.

## Shared Research Workflow

1. Classify each update.
    - Use SemVer terms exactly: `major.minor.patch`.
    - `major`: first number changed.
    - `minor`: middle number changed.
    - `patch`: last number changed.
    - Treat `latest`, prereleases, canaries, date versions, `0.x` packages, and non-SemVer ranges as higher risk until
      verified from official sources.
    - For `peerDependencies`, classify both the installed dev version and the published consumer range.

2. Research official upstream sources.
    - Prefer the package's official GitHub releases, changelog, migration guide, docs, and linked PRs.
    - Read `references/dependency-sources.md` for known official sources and project-specific review focus.
    - If the reference has no entry or looks stale, verify via npm package metadata and official docs before using
      search results.
    - For current release notes, changelogs, dates, and PR contents, browse the web and cite sources in the answer.

3. Check local usage.
    - Search with `rg` for imports, config keys, CLI usage, generated files, package exports, peer ranges, and
      package-specific APIs.
    - Check source and tooling surfaces: `src`, `.storybook`, `scripts`, `vite.config.ts`, `package.json`, TypeScript
      configs, Biome config, Dependency Cruiser config, and Storybook/Vitest config files.
    - For package/build tooling updates, inspect the public package contract: `exports`, `files`, `peerDependencies`,
      Vite externals, declaration output, CSS build, and package tarball behavior.

4. Decide impact.
    - Mark each dependency as one of:
        - `No action`: upstream changes do not touch local usage or published contract.
        - `Watch`: likely safe, but release notes mention nearby behavior or weakly-covered paths.
        - `Action needed`: local code/config/package metadata should change.
        - `Blocked`: cannot decide without a failing check, missing source, or user choice.
    - Name the exact local files or commands involved.

5. Recommend verification.
    - Prefer the smallest relevant checks.
    - Common checks here are `bun run build:ts`, `bun run check:lint`, `bun run check:deps`, `bun run project:audit`,
      `bun run build:all`, `bun run storybook:build`, and `bun run project:verify`.
    - Recommend `bun run project:verify` before publishing, tarball consumer testing, or broad build/package updates.

## Report Format

For pre-update review:

```text
Dependency: vite 8.0.12 -> 8.x.x available
Update type: patch/minor/major
Risk: Low/Medium/High
Upstream changes: ...
Local usage: ...
Peer/package contract impact: ...
Recommendation: Safe to update / update separately / wait / migration needed
After-update checks: ...
Sources: ...
```

For post-update review:

```text
Dependency: @base-ui/react 1.4.1 -> 1.4.2
Update type: patch
Risk: Low
Upstream changes: ...
Local usage: ...
Peer/package contract impact: ...
Decision: Commit-ready / action needed / blocked
Verification: ...
Sources: ...
```

For multiple packages, group by risk: action needed first, watch second, no action last. Include a short final
recommendation about whether to update now or whether an existing dependency diff is reasonable to commit.

## Research Standards

- Use official sources first. Do not rely on blog posts, issue comments, or generated summaries unless official sources
  are missing.
- Distinguish facts from inference. Say "This appears safe because..." when mapping upstream changes to local usage.
- Prefer release ranges over single PRs when possible. If the user gives a PR, read it, but still check whether the
  installed version includes related follow-up fixes.
- Never assume a minor update is safe for frameworks, compilers, bundlers, linters, type systems, CSS tooling,
  Storybook, test runners, or package-publishing tooling.
- In pre-update mode, do not mutate dependencies unless the user explicitly asks to update after reading the review.
- Do not remove package metadata, generated declarations, lockfile entries, IDE settings, Storybook files, package
  archives, or dependency graph artifacts during review.

## Project-Specific Notes

This repository is a Bun-powered React UI library built with Vite library mode, Rolldown, React Compiler, TypeScript,
Tailwind CSS, Storybook, Vitest, and Dependency Cruiser. Read root `AGENTS.md` before interpreting build, package, peer
dependency, styling, or publishing changes.

When `@biomejs/biome` is updated, treat `biome.json` as part of the dependency update surface, even for patch updates.
Check that the `$schema` version matches the installed Biome version when the schema URL is versioned. Prefer the local
project script `bun run biome:migrate` when present; otherwise use `biome migrate --write`. Do not recommend `bunx` for
this project when `@biomejs/biome` is already installed locally.

Post-update triage should pay special attention to Vite/Vitest/Storybook package alignment:

- If Vite config typings reject a `test` key after an update, check whether root `vite` and Vitest's resolved/nested
  `vite` copy differ. In a shared config, `defineConfig` from `vitest/config` may be needed for the test config type
  augmentation, but this project should keep publish build config and Storybook/Vitest config separated.
- For the publishable `vite.config.ts`, `defineConfig` should come from `vite` and the file should not contain the
  Vitest `test` section.
- Storybook uses its own `.storybook/vite.config.ts` through `@storybook/react-vite` framework builder options. Keep it
  separate from the publishable library `vite.config.ts`; Storybook builds should not inherit `unplugin-dts`,
  `build.lib`, package externals, or declaration bundling.
- For Storybook build warnings that need final Vite build overrides, prefer `.storybook/main.ts` `viteFinal`.
  Storybook's Vite builder may ignore most `build` options loaded from `viteConfigPath` except selected fields such as
  `build.target`.
- For Storybook browser tests, verify the separate `vitest.config.ts`, Playwright browser installation, and the Vitest
  browser API host. On this Windows setup, `api.host: '127.0.0.1'` avoids `localhost` connection-refused failures in
  Playwright-driven Storybook tests.
- If Storybook test UI logs `vitest.init()` deprecation warnings, first check whether the warning originates inside
  `@storybook/addon-vitest` before recommending local config rewrites.
- For `unplugin-dts` updates, verify that `vite.config.ts` keeps `bundleTypes: true`, `tsconfigPath:
  'tsconfig.app.json'`, story exclusions, and plugin-local `compilerOptions.rootDir: 'src'`. `unplugin-dts@1.0.2`
  exposed the declaration-root assumption: without the explicit root, declarations may emit under `dist/src`, and API
  Extractor can fail because `dist/client.d.ts` or `dist/nodzimo-ui.d.ts` is missing. Prefer the explicit `rootDir`
  config over `beforeWriteFile` path rewrites.
- After build-tool or Storybook updates, include package artifact inspection in the recommendation when declarations,
  CSS output, or private chunks might have changed: `bun run build:all` followed by `bun pm pack --dry-run`.

Keep the skill portable: put reusable workflow rules here, and keep this repo's current dependency source map in
`references/dependency-sources.md`.
