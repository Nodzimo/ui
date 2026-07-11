## TypeScript 7 Native Compiler Incident

### Summary

TypeScript 7 is the intended bleeding-edge destination for this project, but it is not currently safe to use as the
root `typescript` package for the publishable UI kit build.

The blocker is not source compatibility or `tsconfig` shape. `bun run build:ts` can type-check with TypeScript 7, but
`bun run build:js` fails while `unplugin-dts` and API Extractor bundle public declaration files. Until the declaration
tooling path is ready, keep the project on the latest TypeScript 6 line for the root `typescript` dependency.

### What Changed Upstream

TypeScript 7 moves the compiler to a native Go implementation. Microsoft describes TypeScript 7 as a native port of
TypeScript intended to deliver much faster compile and editor workflows:

- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- https://github.com/microsoft/typescript-go

The important package-contract change is that the TypeScript 7 npm package is not a drop-in replacement for the
JavaScript Compiler API that existing ecosystem tools commonly load through `require('typescript')` or
`import 'typescript'`. That API surface is still required by declaration bundlers, docgen tools, framework checks, and
other TypeScript-integrated build tooling.

### Local Failure

The attempted upgrade path was:

1. Update the project root `typescript` dev dependency from TypeScript 6 to `typescript@7.0.2`.
2. Run `bun run project:verify`.
3. Observe `bun run build:js` failure while Vite loads `unplugin-dts`.

The first failure was:

```text
[unplugin-dts] The installed "typescript" package does not provide the JavaScript Compiler API
(this happens with TypeScript 7+), and the fallback "@typescript/typescript6" was not found.
```

Installing `@typescript/typescript6` as an additional dev dependency moved the build past the missing-API failure, but
the declaration bundle still failed:

```text
[unplugin-dts] Failed to bundle declaration files due to an API Extractor limitation when analyzing the symbol "Pick".
Original error: Internal Error: Unable to follow symbol for "Pick"
```

That second failure is release-blocking for this package because `bundleTypes: true` is part of the public package
contract. The package must emit `dist/ui.d.ts` and `dist/client.d.ts` declaration rollups for consumers.

### Why The Workaround Is Not Accepted

`unplugin-dts` documents an automatic fallback to `@typescript/typescript6` for TypeScript 7 compatibility:

- https://github.com/qmhc/unplugin-dts/releases

That fallback addresses the missing JavaScript Compiler API, but it did not make this project's declaration rollup pass.
API Extractor also documents that it uses its own TypeScript compiler engine and can be sensitive to compiler API
version compatibility:

- https://api-extractor.com/pages/setup/invoking/

Do not replace the root `typescript` dependency with `typescript@7` plus a compatibility shim just to keep the audit
green. That produces a mixed compiler/tooling state and still failed in this project during declaration bundling.

### Current Decision

- Keep `typescript` on the latest working TypeScript 6 release.
- Do not add `@typescript/typescript6` unless the root package is deliberately moved to TypeScript 7 during a new
  controlled retest.
- Do not disable `bundleTypes`, remove API Extractor, or emit unbundled `dist/src` declarations to force the upgrade.
- Do not change `tsconfig.app.json`, `tsconfig.node.json`, or `vite.config.ts` for this incident; the blocker is tooling
  compatibility, not local configuration.

### Retest Criteria

Reconsider TypeScript 7 only when upstream tooling has visibly moved forward. Check these sources before retrying:

- TypeScript release notes and native compiler status:
  https://devblogs.microsoft.com/typescript/ and https://github.com/microsoft/typescript-go
- `unplugin-dts` releases and issues:
  https://github.com/qmhc/unplugin-dts/releases
- API Extractor TypeScript support:
  https://github.com/microsoft/rushstack/tree/main/apps/api-extractor and https://api-extractor.com
- Framework ecosystem readiness for consumer testing, especially Next.js:
  https://github.com/vercel/next.js

A TypeScript 7 retry is acceptable only if all of these pass:

```bash
bun run build:ts
bun run build:js
bun run build:all
bun run project:verify
```

After a successful retry, inspect package artifacts and confirm:

- `dist/ui.d.ts` exists.
- `dist/client.d.ts` exists.
- `dist/src` does not exist.
- `package.json` still points `exports.types` at the bundled declaration files.
