# RSC Package Boundary Checklists

This reference is a compact checklist for the `rsc-package-boundary-reviewer` skill. Do not duplicate the full boundary
model here; use `docs/agent-operating-charter` as the canonical source.

## Canonical Docs

- Root/client source rules: `docs/agent-operating-charter/core-vs-client.md`
- Public package shape: `docs/agent-operating-charter/public-package-shape.md`
- Dependency and externalization policy: `docs/agent-operating-charter/dependency-concepts.md`
- Vite and declaration build notes: `docs/agent-operating-charter/vite-build-notes.md`
- React Compiler boundary: `docs/agent-operating-charter/react-compiler-boundary.md`
- Icon generation: `docs/agent-operating-charter/icon-generation.md`
- Verification: `docs/agent-operating-charter/verification.md`
- Historical incidents:
    - `docs/agent-operating-charter/rsc-boundary-incident-lucide-spinner.md`
    - `docs/agent-operating-charter/client-bundle-incident-base-ui-select.md`
    - `docs/agent-operating-charter/public-declaration-leak-incident-shadcn.md`

## Core Change Checklist

- Trace imports from the changed file through local barrels to `src/index.ts`.
- Confirm no Base UI, browser-only APIs, state/effect hooks, React Compiler runtime, `lucide-react`, or other runtime
  icon packages enter the root graph.
- Prefer inline SVG or generated project-owned icons for core primitives.
- Build when the change affects source boundaries or public artifacts.
- Inspect `dist/ui.js`, every relative internal chunk reachable from it, and root declarations after the build.

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
rg -n "createContext|useContext|useState|useEffect|react/compiler-runtime|@base-ui/react|lucide-react|node_modules/lucide" dist/ui.js
```

If `dist/ui.js` imports relative chunks from `dist/internal`, apply the same scan to those chunks transitively. A direct
entry-file scan is not sufficient when Rolldown has extracted shared code.

Inspect client output:

```powershell
Get-Content dist\client.js -TotalCount 5
rg -n "Calling .*require|typeof require|new Proxy|node_modules|use-sync-external-store|@base-ui/react" dist/client.js
```

Inspect external import sanity:

```powershell
rg -n 'from "(@base-ui/react|class-variance-authority|clsx|tailwind-merge|react|react-dom|react/jsx-runtime|react/compiler-runtime)' dist/client.js dist/ui.js
```

For provider changes, also inspect root and client artifacts for provider leakage:

```powershell
rg -n "DirectionProvider|useDirection|direction-provider|@base-ui/react" dist/ui.js dist/ui.d.ts
rg -n "DirectionProvider|useDirection|direction-provider|@base-ui/react" dist/client.js dist/client.d.ts
```

Inspect declarations:

```powershell
Get-ChildItem dist -Recurse -Filter *.d.ts
```

Expected declaration topology:

- `dist/ui.d.ts`
- `dist/client.d.ts`
- no public `dist/src` declaration tree

Run `bun run check:dist-types` after generation. Source `bun run build:ts` alone does not validate the artifacts.
When duplication or implementation leakage appears, inspect whether intermediate internal imports resolve back into
`src`; do not assume that a valid `ComponentProps` or `VariantProps` query is inherently unsafe. Reject leaked JSX,
function bodies, executable calls, and source-only paths. Verify packed public entrypoints in an external consumer
when exports or consumer integration change. See `public-declaration-leak-incident-shadcn.md` for the mechanism,
evidence, and procedure.

## Consumer Verification

Use tarball testing before publish and the published package after publish when root exports, dependency metadata,
externals, React Compiler scope, declaration output, or a consumer failure is involved. For declaration changes, a Vite
TypeScript consumer is required in addition to any Next/Turbopack check because a Vite JavaScript build may succeed
without parsing package `.d.ts` files.

The consumer should import at least:

- one normal root/core component;
- any affected root/core component;
- any affected client component or provider from `@nodzimo/ui/client`.
- the consumer dev server when the incident was a dev-only browser chunk failure.

SSG/static route output is useful, but it does not replace built artifact inspection.
