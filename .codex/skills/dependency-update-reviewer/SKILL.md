---
name: dependency-update-reviewer
description: Review available or already-installed package dependency updates. Use when Codex is asked to run or interpret npm/Bun outdated results, decide whether packages should be updated, inspect package.json/lockfile update diffs, research official release notes, changelogs, GitHub PRs, migrations, or breaking changes, compare them to local React/Vite UI-kit usage, and report whether code/config/peer dependency changes or verification steps are needed.
---

# Dependency Update Reviewer

## Purpose

Use this skill to turn dependency update noise into a short engineering decision report. Research what changed upstream,
map the changes to the UI kit's actual usage and published package contract, and say whether the project should update,
can commit an existing update, or needs action.

Do not edit project files unless the user explicitly asks for implementation. A review request should end with a report,
not a patch.

## Required Reading

Read only the files relevant to the update surface:

- Always read `docs/agent-operating-charter/dependency-concepts.md` and
  `docs/agent-operating-charter/verification.md`.
- Read `docs/agent-operating-charter/vite-build-notes.md` only when Vite, Rolldown, declarations, React Compiler,
  package exports, externalization, CSS output, or build tooling is involved.
- Read `docs/agent-operating-charter/storybook-configuration.md` and
  `docs/agent-operating-charter/storybook-testing.md` only when Storybook, addon, Docs, Vitest, browser testing, or
  preview behavior is involved.
- Read `docs/agent-operating-charter/biome-policy.md` only when Biome is involved.
- Read `references/dependency-sources.md` only when official upstream source routing is needed for the selected
  packages.

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

## Project Routing

Read root `AGENTS.md` before interpreting build, package, peer dependency, styling, Storybook, or publishing changes.
Keep reusable review workflow in this skill, durable project rules in `docs/agent-operating-charter`, and the current
package source map
in `references/dependency-sources.md`.

When a dependency change touches build output, Storybook, Biome, declarations, CSS artifacts, package metadata, or test
configuration, route the review through the relevant `docs/agent-operating-charter` files above instead of relying only
on release notes.
