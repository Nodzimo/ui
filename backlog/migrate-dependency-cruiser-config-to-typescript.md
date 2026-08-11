---
status: ready
---

# Migrate the dependency-cruiser configuration to TypeScript

## Context

Dependency-cruiser 18.2.0 can discover and execute `.dependency-cruiser.ts`, `.dependency-cruiser.cts`, and
`.dependency-cruiser.mts` configurations through Node's native TypeScript support. The repository still carries a
generated `.dependency-cruiser.cjs` file with `module.exports` and JSDoc typing even though it is an ESM TypeScript
project running on Node 26.

The migration should preserve every project-specific architecture rule and reporter option. Native Node execution strips
erasable TypeScript syntax but does not type-check the configuration, so the migrated file must also enter the
repository's TypeScript verification scope.

## Outcome

- `.dependency-cruiser.cjs` is replaced by an automatically discovered `.dependency-cruiser.ts` configuration.
- The configuration uses `export default` and is checked against dependency-cruiser's public configuration type without
  runtime TypeScript imports.
- `tsconfig.node.json` includes the configuration so `bun run build:ts` catches type errors.
- No syntax requiring TypeScript runtime transformation is introduced.
- `bun run check:deps` cruises the same source graph and reports no new violations.
- Dependency graph generation continues to use the migrated configuration.
- Durable dependency-cruiser guidance no longer describes the CJS file as the current configuration.

## Next step

Create a temporary `.dependency-cruiser.ts` equivalent using `import type`, `satisfies`, and `export default`; run it
explicitly with dependency-cruiser 18.2.0 and compare its module, dependency, and violation counts with the current CJS
configuration before replacing the file.

## References

- [Current dependency-cruiser configuration](../.dependency-cruiser.cjs)
- [Node TypeScript configuration](../tsconfig.node.json)
- [Dependency graph checks](../docs/agent-operating-charter/dependency-graph-checks.md)
- [dependency-cruiser 18.2.0 release](https://github.com/sverweij/dependency-cruiser/releases/tag/v18.2.0)
- [TypeScript configuration support pull request](https://github.com/sverweij/dependency-cruiser/pull/1077)
