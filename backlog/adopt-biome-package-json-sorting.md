---
status: ready
type: maintenance
created: 2026-07-18
---

# Adopt Biome package.json sorting

## Context

Biome 2.5 introduced `assist.actions.source.useSortedPackageJson`, which applies the conventional semantic field order
used by `sort-package-json`. The repository already enables `useSortedKeys` as its general JSON sorting baseline.

Enabling both actions for `package.json` makes their safe fixes undo each other: `useSortedKeys` alphabetizes root keys,
while `useSortedPackageJson` restores semantic package-field order. Biome can then enter an endless write cycle. The
Biome maintainers consider overlapping assist actions a configuration responsibility and recommend disabling
`useSortedKeys` for `package.json` through an override.

The desired package-specific rule remains disabled until that scoped configuration is adopted and verified.

## Outcome

- `package.json` uses Biome's semantic package-field order.
- Other JSON objects retain the repository's alphabetical `useSortedKeys` baseline.
- Biome write checks terminate and are idempotent when run repeatedly.
- The resulting `package.json` ordering and `biome.json` override are reviewed as intentional project conventions.

## Next step

Enable `useSortedPackageJson`, add a `package.json` override that disables `useSortedKeys` only for that file, and run
the repository's Biome write check twice to prove that the second pass produces no changes or hang. Then run the normal
lint verification.

## References

- [Biome `useSortedPackageJson` documentation](https://biomejs.dev/assist/actions/use-sorted-package-json/)
- [Biome issue #10628: `useSortedPackageJson` conflicts with
  `useSortedKeys`](https://github.com/biomejs/biome/issues/10628)
- [Biome issue #10783: `check --write` hangs when both actions fix
  `package.json`](https://github.com/biomejs/biome/issues/10783)
- [Current Biome policy](../docs/agent-operating-charter/biome-policy.md)
- [Current Biome configuration](../biome.json)
