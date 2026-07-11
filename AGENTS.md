# Nodzimo UI Agent Operating Charter

## Context Economy

Use [Agent Context Economy](docs/agent-operating-charter/context-economy.md) as the default Codex working contract:
scope first, read in layers, use broad context deliberately, verify narrowly, and report concisely.

## Project Goal

Nodzimo UI is a modern React UI kit for package consumers, with minimal explicit configuration and no legacy
browser-script target.

See [docs/agent-operating-charter/project-goal.md](docs/agent-operating-charter/project-goal.md).

## Stack

The project uses Bun, Vite 8 library mode on Rolldown, React 19, TypeScript, Tailwind CSS 4, Biome, React Compiler,
unplugin-dts, and Tailwind CLI.

See [docs/agent-operating-charter/stack.md](docs/agent-operating-charter/stack.md).

## Collaboration

Project work should stay concise, explicit, scoped, and aligned with the established code style and documentation
conventions.

See [docs/agent-operating-charter/collaboration.md](docs/agent-operating-charter/collaboration.md).

## Code Style Conventions

Code-style review should preserve local readability conventions around JSX literals, rest names, literal tables,
file extensions, imports, exports, and text/quote boundaries.

See [docs/agent-operating-charter/code-style-conventions.md](docs/agent-operating-charter/code-style-conventions.md).

## Skills

Use the project-local skills for dependency review, token adaptation, Tailwind class formatting, style review, Storybook
stories, design-system doctrine, and RSC/package-boundary work.

See [docs/agent-operating-charter/skills.md](docs/agent-operating-charter/skills.md).

## Biome Policy

Biome configuration should stay compact and intentional, with project-specific formatter, linter, assist, HTML, JSON,
and VCS expectations preserved.

See [docs/agent-operating-charter/biome-policy.md](docs/agent-operating-charter/biome-policy.md).

## Repository Text Format

Repository text normalization is controlled through `.gitattributes`, including LF defaults and CRLF Windows command
files.

See [docs/agent-operating-charter/repository-text-format.md](docs/agent-operating-charter/repository-text-format.md).

## Community Health Files

GitHub community health files live under `.github`, with README links used to make less-prominent files discoverable
across GitHub, package, and IDE surfaces.

See [docs/agent-operating-charter/community-health-files.md](docs/agent-operating-charter/community-health-files.md).

## WebStorm Project Settings

Shared WebStorm settings are intentionally narrow and should use scoped inspection exclusions instead of broad IDE
suppressions.

See [docs/agent-operating-charter/webstorm-project-settings.md](docs/agent-operating-charter/webstorm-project-settings.md).

## Public Package Shape

The public package is ESM-only, published as `@nodzimo/ui`, and exposes only the root, client, and stylesheet
entrypoints.

See [docs/agent-operating-charter/public-package-shape.md](docs/agent-operating-charter/public-package-shape.md).

## Source Layout

Source files are organized around root/client entrypoints, core/client areas, generated icons, internal utilities, and
component-owned folders.

See [docs/agent-operating-charter/source-layout.md](docs/agent-operating-charter/source-layout.md).

## Internal Package Imports

Internal imports should use the `package.json#imports` map and the established barrel architecture instead of public
package imports or Vite-only aliases.

See [docs/agent-operating-charter/internal-package-imports.md](docs/agent-operating-charter/internal-package-imports.md).

## Core Vs Client

Core is the RSC-safe root package surface; client contains interactive exports, hooks, providers, browser APIs, and
React Compiler output.

See [docs/agent-operating-charter/core-vs-client.md](docs/agent-operating-charter/core-vs-client.md).

## RSC Boundary Incident: Lucide Spinner

The Lucide Spinner incident records why core must avoid third-party icon/runtime code that can leak RSC-incompatible
React APIs into the root build.

See [docs/agent-operating-charter/rsc-boundary-incident-lucide-spinner.md](docs/agent-operating-charter/rsc-boundary-incident-lucide-spinner.md).

## React Compiler Boundary

React Compiler must stay scoped to the client entrypoint and `src/client`, with root output kept free of compiler
runtime imports.

See [docs/agent-operating-charter/react-compiler-boundary.md](docs/agent-operating-charter/react-compiler-boundary.md).

## Dependency Concepts

Dependency metadata and Vite externalization have separate responsibilities and must keep runtime implementation
dependencies installable but unbundled.

See [docs/agent-operating-charter/dependency-concepts.md](docs/agent-operating-charter/dependency-concepts.md).

## Client Bundle Incident: Base UI Select

The Base UI Select incident records why runtime dependencies must stay externalized to avoid bundled third-party
internals and dynamic require shims.

See [docs/agent-operating-charter/client-bundle-incident-base-ui-select.md](docs/agent-operating-charter/client-bundle-incident-base-ui-select.md).

## Dependency Graph Checks

Dependency-cruiser provides deterministic source import graph checks and the optional SVG dependency graph.

See [docs/agent-operating-charter/dependency-graph-checks.md](docs/agent-operating-charter/dependency-graph-checks.md).

## Tailwind And Styles

Tailwind is build-time styling tooling for the library, while the published stylesheet is an explicit package artifact
for consumers.

See [docs/agent-operating-charter/tailwind-and-styles.md](docs/agent-operating-charter/tailwind-and-styles.md).

## Theme Token Contract

NUI theme tokens define the public semantic styling contract and must preserve runtime CSS variables, Tailwind mappings,
and token roles.

See [docs/agent-operating-charter/theme-token-contract.md](docs/agent-operating-charter/theme-token-contract.md).

## Design System Doctrine

The design-system doctrine is product-facing source material mirrored into Storybook and should remain separate from
agent implementation notes.

See [docs/agent-operating-charter/design-system-doctrine.md](docs/agent-operating-charter/design-system-doctrine.md).

## Component Styling

Component styles should use NUI-prefixed semantic tokens, CVA/class naming conventions, RTL-aware utilities, and focused
class formatting.

See [docs/agent-operating-charter/component-styling.md](docs/agent-operating-charter/component-styling.md).

## Icon Generation

Icon sources, generated components, naming, barrels, and Storybook galleries follow the project-owned SVG generation
pipeline.

See [docs/agent-operating-charter/icon-generation.md](docs/agent-operating-charter/icon-generation.md).

## Vite Build Notes

Vite and Rolldown build configuration should stay minimal, preserve package-boundary decisions, and keep declaration/CSS
output expectations intact.

See [docs/agent-operating-charter/vite-build-notes.md](docs/agent-operating-charter/vite-build-notes.md).

## TypeScript 7 Native Compiler Incident

TypeScript 7 is the intended bleeding-edge direction, but the root `typescript` package is currently blocked by
`unplugin-dts` and API Extractor declaration bundling compatibility.

See [docs/agent-operating-charter/typescript-7-native-compiler-incident.md](docs/agent-operating-charter/typescript-7-native-compiler-incident.md).

## Storybook

Storybook is a real UI-kit consumer and documentation surface. Its focused story-writing, theming, Docs, QA, testing,
and workaround notes are routed through the Storybook agent index.

See [docs/agent-operating-charter/storybook.md](docs/agent-operating-charter/storybook.md).

## Storybook Deployment

The public Storybook deploys as a static Coolify/Nixpacks site at `ui.nodzimo.com` with generated output outside git.

See [docs/agent-operating-charter/storybook-deployment.md](docs/agent-operating-charter/storybook-deployment.md).

## Local Consumer Testing

Consumer testing should prefer published packages or tarballs, with known limitations around Bun links, Windows folder
dependencies, and Next Turbopack.

See [docs/agent-operating-charter/local-consumer-testing.md](docs/agent-operating-charter/local-consumer-testing.md).

## Cleanup Scripts

Cleanup scripts separate distribution artifacts, dependency installs, Storybook output, and known local development
ports.

See [docs/agent-operating-charter/cleanup-scripts.md](docs/agent-operating-charter/cleanup-scripts.md).

## npm Publishing

Publishing is currently manual through the `nodzimo` npm account, with verification, package inspection, and interactive
2FA authentication.

See [docs/agent-operating-charter/npm-publishing.md](docs/agent-operating-charter/npm-publishing.md).

## GitHub Releases

GitHub Releases and GitHub Packages publishing are automated from pushed version tags, while npmjs publishing remains a
separate manual Bun publish step.

See [docs/agent-operating-charter/github-releases.md](docs/agent-operating-charter/github-releases.md).

## Scripts

Project scripts define the regular audit, verification, build, Storybook, check, clean, dependency, and publishing
commands.

See [docs/agent-operating-charter/scripts.md](docs/agent-operating-charter/scripts.md).

## Verification

Use the smallest relevant verification command, escalating to full build/package/Storybook/consumer checks when
boundaries or artifacts are affected.

See [docs/agent-operating-charter/verification.md](docs/agent-operating-charter/verification.md).
