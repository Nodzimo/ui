---
status: ready
---

# Audit the current Vite scaffold configuration

## Context

The current official Vite React and TypeScript scaffold has evolved since this library was created. For example, a newly
generated project now enables `allowArbitraryExtensions` in its application TypeScript config, while this repository
does not. The repository has since become a mature publishable library with separate JavaScript, declaration, and CSS
build contracts, so scaffold differences cannot be accepted or rejected solely because they are newer.

The absence of `allowArbitraryExtensions` currently fits the package design: TypeScript source does not own the
stylesheet build, and runtime CSS is published through an explicit package entrypoint. However, the repository does not
record whether that absence was deliberate or simply inherited from an older scaffold. Other scaffold defaults may have
changed for similarly relevant reasons.

This concern is distinct from the TypeScript strictness audit. It covers upstream scaffold drift and the suitability of
new defaults for a library, not the desired strict type-checking policy.

## Outcome

- The current official Vite React and TypeScript scaffold is reproduced with pinned tool versions and compared against
  the repository's Vite and TypeScript configuration.
- Each meaningful difference is classified as application-only, already superseded by the library build, beneficial to
  adopt, or intentionally excluded.
- `allowArbitraryExtensions` has an explicit decision based on the package's actual CSS and asset import model.
- Accepted changes pass type-checking, the Vite build, bundled declaration generation, Storybook, and package
  verification.
- Durable conclusions are recorded in the appropriate configuration guidance without treating the generated scaffold as
  an architectural source of truth.

## Next step

Generate the current official Vite React and TypeScript scaffold in a temporary directory using the repository's Bun
workflow. Record the exact generator and dependency versions, then compare only its package, Vite, and TypeScript
configuration with this repository before proposing changes.

## References

- [Application TypeScript configuration](../tsconfig.app.json)
- [Node TypeScript configuration](../tsconfig.node.json)
- [Vite build configuration](../vite.config.ts)
- [TypeScript strictness audit](audit-typescript-compiler-strictness.md)
- [TypeScript `allowArbitraryExtensions`](https://www.typescriptlang.org/tsconfig/allowArbitraryExtensions.html)
- [Vite TypeScript and client type guidance](https://vite.dev/guide/features.html#typescript)
