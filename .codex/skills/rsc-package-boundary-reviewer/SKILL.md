---
name: rsc-package-boundary-reviewer
description: Review and document Nodzimo UI package boundaries for React Server Component safety. Use when changing src/core, src/client, public entrypoints, Vite externals, package dependencies, React Compiler scope, generated icons/SVGR config, built dist output, icon/runtime dependency leaks such as lucide-react, or investigating Next/Turbopack consumer build failures involving RSC, SSR, SSG, createContext, use client, bundled dependency internals, or dynamic require.
---

# RSC Package Boundary Reviewer

## Purpose

Protect the package boundary between the RSC-safe root entry and the client entry. Treat this skill as the procedural
review checklist; the architectural source of truth lives in `docs/agent`.

## Required Reading

Read only the files relevant to the touched surface:

- Core/client source boundary: `docs/agent/core-vs-client.md`
- Public package shape: `docs/agent/public-package-shape.md`
- Dependency metadata and externalization: `docs/agent/dependency-concepts.md`
- Vite/Rolldown and declaration build notes: `docs/agent/vite-build-notes.md`
- React Compiler scope: `docs/agent/react-compiler-boundary.md`
- Icon generation and runtime icon safety: `docs/agent/icon-generation.md`
- Known incidents: `docs/agent/rsc-boundary-incident-lucide-spinner.md` and
  `docs/agent/client-bundle-incident-base-ui-select.md`
- Verification commands and artifact checks: `docs/agent/verification.md`

Use `references/rsc-package-boundaries.md` for compact task checklists and common inspection commands.

## Workflow

1. Identify the affected boundary.
    - Core/root: `src/core`, `src/index.ts`, `dist/nodzimo-ui.js`, or `dist/nodzimo-ui.d.ts`.
    - Client: `src/client.ts`, `src/client/**`, `dist/client.js`, or `dist/client.d.ts`.
    - Package contract: `package.json`, `vite.config.ts`, dependency metadata, public exports, declaration output, or
      built package artifacts.
    - Icons: `assets/icons`, `svgr.config.cjs`, `src/core/icons`, or core components importing icons.

2. Inspect source reachability before building.
    - Core changes must not pull browser APIs, state/effect hooks, React Compiler runtime, Base UI, or third-party
      context/hook modules into the root graph.
    - Client changes must flow through `src/client.ts` and preserve the public client boundary.
    - UI-kit providers must be framework-agnostic and exported only through the client entry.

3. Check package metadata and externalization when runtime imports changed.
    - Runtime implementation dependencies used by built entries belong in `dependencies` and should stay externalized.
    - React and React DOM remain peers.
    - Story/docs/test-only packages stay in `devDependencies`.
    - The Vite external matcher must continue to cover package roots and subpath imports.

4. Build only as much as the risk requires.
    - Use `bun run build:all` for source, entrypoint, Vite, declaration, CSS, icon, or boundary changes.
    - Use `bun run project:verify` before publish/tarball-ready decisions.

5. Inspect built artifacts after boundary-affecting changes.
    - Confirm root output stays free of client/runtime leaks.
    - Confirm client output keeps `"use client";` and does not inline third-party internals or CommonJS shims.
    - Confirm declaration topology stays rooted at `dist/nodzimo-ui.d.ts` and `dist/client.d.ts`.

6. Escalate to Next/Turbopack consumer verification when root exports, externals, React Compiler scope, dependency
   metadata, or a consumer failure is involved.
    - Prefer tarball testing before publish and the published package after publish.
    - Treat SSG/static output as useful but not sufficient; artifact inspection still matters.

## Reporting

Report:

- The touched boundary and why it is safe or risky.
- The relevant source files and package metadata inspected.
- The build/artifact checks run or intentionally skipped.
- Any remaining consumer verification needed before publishing.
