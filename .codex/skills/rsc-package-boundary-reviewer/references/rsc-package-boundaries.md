# RSC Package Boundary Checklists

This reference is a compact checklist for the `rsc-package-boundary-reviewer` skill. Do not duplicate the full boundary
model here; use `docs/agent` as the canonical source.

## Canonical Docs

- Root/client source rules: `docs/agent/core-vs-client.md`
- Public package shape: `docs/agent/public-package-shape.md`
- Dependency and externalization policy: `docs/agent/dependency-concepts.md`
- Vite and declaration build notes: `docs/agent/vite-build-notes.md`
- React Compiler boundary: `docs/agent/react-compiler-boundary.md`
- Icon generation: `docs/agent/icon-generation.md`
- Verification: `docs/agent/verification.md`
- Historical incidents:
    - `docs/agent/rsc-boundary-incident-lucide-spinner.md`
    - `docs/agent/client-bundle-incident-base-ui-select.md`

## Core Change Checklist

- Trace imports from the changed file through local barrels to `src/index.ts`.
- Confirm no Base UI, browser-only APIs, state/effect hooks, React Compiler runtime, `lucide-react`, or other runtime
  icon packages enter the root graph.
- Prefer inline SVG or generated project-owned icons for core primitives.
- Build when the change affects source boundaries or public artifacts.
- Inspect `dist/nodzimo-ui.js` and root declarations after the build.

## Client Change Checklist

- Confirm the code is reachable through `src/client.ts` and not through `src/index.ts`.
- Confirm `src/client.ts` and `dist/client.js` preserve the client boundary.
- For Base UI or other runtime dependency changes, inspect the client artifact for bundled internals, CommonJS shims,
  and suspicious size jumps.
- Keep framework-agnostic UI-kit providers under the client entry. App-owned providers stay in consumer apps.

## Dependency Or Vite Change Checklist

- Compare runtime imports with `dependencies`, `peerDependencies`, and `devDependencies`.
- Confirm runtime implementation dependencies remain installable through `dependencies` and externalized from library
  output.
- Confirm React and React DOM remain peers.
- Confirm the external matcher still covers exact package roots and subpath imports with the package-name-plus-slash
  rule.
- Do not replace derived runtime externalization with a handwritten complete package list unless the exception is
  deliberately documented and consumer-tested.

## Icon Change Checklist

- Raw SVG inputs belong under `assets/icons`.
- Generated output under `src/core/icons/generated` is generator-owned.
- Generated core icons must stay plain SVG components: no hooks, no `'use client'`, no `memo`, no `forwardRef`, and no
  runtime icon package imports.
- Do not add usage-specific behavior such as RTL flipping to generated icons; apply it at the usage site.

## Built Artifact Commands

Build:

```powershell
bun run build:all
```

Inspect root output:

```powershell
rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/nodzimo-ui.js
```

Inspect client output:

```powershell
Get-Content dist\client.js -TotalCount 5
rg -n "Calling .*require|typeof require|new Proxy|node_modules|use-sync-external-store|@base-ui/react" dist/client.js
```

Inspect external import sanity:

```powershell
rg -n 'from "(@base-ui/react|class-variance-authority|clsx|tailwind-merge|react|react-dom|react/jsx-runtime|react/compiler-runtime)' dist/client.js dist/nodzimo-ui.js
```

For provider changes, also inspect root and client artifacts for provider leakage:

```powershell
rg -n "DirectionProvider|useDirection|direction-provider|@base-ui/react" dist/nodzimo-ui.js dist/nodzimo-ui.d.ts
rg -n "DirectionProvider|useDirection|direction-provider|@base-ui/react" dist/client.js dist/client.d.ts
```

Inspect declarations:

```powershell
Get-ChildItem dist -Recurse -Filter *.d.ts
```

Expected declaration topology:

- `dist/nodzimo-ui.d.ts`
- `dist/client.d.ts`
- no public `dist/src` declaration tree

## Consumer Verification

Use tarball testing before publish and the npm package after publish when root exports, dependency metadata, externals,
React Compiler scope, or a Next/Turbopack failure is involved.

The consumer should import at least:

- one normal root/core component;
- any affected root/core component;
- any affected client component or provider from `@nodzimo/nodzimo-ui/client`.
- the consumer dev server when the incident was a dev-only browser chunk failure.

SSG/static route output is useful, but it does not replace built artifact inspection.
