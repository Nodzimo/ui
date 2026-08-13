---
status: ready
---

# Decide and adopt TypeScript strict mode across the package

## Context

The package uses TypeScript 6 with modern `ESNext` and bundler-oriented settings, but its current app and Node configs
do not enable the `strict` family of checks. The effective app configuration therefore leaves checks such as
`noImplicitAny` and `strictNullChecks` disabled. It also does not enable `noUncheckedSideEffectImports`.

This may be an intentional compatibility choice or an inherited scaffold default, but the repository does not record the
reason. Because the package publishes reusable React components and bundled public declarations, `strict: true` should
be the expected baseline: it prevents unsound public props and nullable states from escaping through the package's
declarations to consumers. The decision must still be evidenced against the complete build rather than copied from a
template or enabled speculatively.

The existing TypeScript 7 incident is separate: this audit concerns compiler options on the current supported TypeScript
6 toolchain and must not weaken declaration bundling to make stricter checks pass.

## Outcome

- The effective compiler options for `tsconfig.app.json`, `tsconfig.node.json`, and any separately compiled Storybook
  configuration are understood and intentional.
- `strict: true` is enabled in every applicable configuration, or a narrow documented exception records why a specific
  configuration cannot use it.
- Relevant independent safeguards, including `noUncheckedSideEffectImports`, are accepted or rejected with concrete
  repository evidence.
- Any accepted options pass source type-checking, the Vite build, bundled declaration generation, Storybook, and package
  verification.
- Any source errors exposed by stricter checks are resolved without weakening public types or adding blanket
  suppressions.
- The durable TypeScript policy and any justified exceptions are documented in the appropriate agent-operating guidance.

## Next step

Capture each effective compiler configuration with `tsc --showConfig`, then run non-persistent `strict: true` trials.
Classify every resulting diagnostic by compiler option and source area; resolve valid findings and propose only narrow,
documented exceptions where strict mode is demonstrably incompatible.

## References

- [Application TypeScript configuration](../tsconfig.app.json)
- [Node TypeScript configuration](../tsconfig.node.json)
- [Storybook TypeScript configuration](../.storybook/tsconfig.json)
- [TypeScript 7 native compiler incident](../docs/agent-operating-charter/typescript-7-native-compiler-incident.md)
