---
status: ready
---

# Audit Biome rule adoption

## Context

Biome 2.5.8 introduced the nursery rules `noInvalidPropertyInitValue`, `noSvelteLegacyConst`, and
`useReactCompiler`. The first two relevant candidates need different treatment in this repository:
`noInvalidPropertyInitValue` can validate the registered custom properties in `src/tailwind-extensions.css`, while
`useReactCompiler` must respect the existing boundary that compiles only `src/client`. The Svelte rule is not relevant
to Nodzimo UI today.

The review should also inspect other currently available Biome rules rather than treating the 2.5.8 additions as an
exhaustive list. Conclusions should distinguish repository-specific rules from reusable recommendations that may be
appropriate for other Nodzimo projects; changes outside this repository remain separate, explicitly requested work.

## Outcome

- New and otherwise relevant Biome rules are evaluated against actual repository code and conventions.
- Every candidate is accepted, rejected, deferred, or scoped with a concrete reason and representative diagnostics.
- `useReactCompiler` does not expand React Compiler policy beyond `src/client` unintentionally.
- Rules specific to unused frameworks or application-only CSS class graphs are not enabled without evidence.
- Accepted rules pass two consecutive Biome write checks without configuration-fix loops.
- Reusable conclusions are summarized so other Nodzimo repositories can evaluate the same rules independently.

## Next step

Inventory the rules added since the last explicit Biome-rule review, then run each plausible candidate non-persistently
against the repository. Start with `noInvalidPropertyInitValue` on `src/tailwind-extensions.css` and a client-scoped
`useReactCompiler` trial before proposing configuration changes.

## References

- [Biome configuration](../biome.json)
- [Biome policy](../docs/agent-operating-charter/biome-policy.md)
- [React Compiler boundary](../docs/agent-operating-charter/react-compiler-boundary.md)
- [Biome 2.5.8 release](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.5.8)

