---
status: ready
---

# Audit TypeScript compiler strictness and safeguards

## Context

The package uses TypeScript 6 with modern `ESNext` and bundler-oriented settings, but its current app and Node configs
do not enable the `strict` family of checks. The effective app configuration therefore leaves checks such as
`noImplicitAny` and `strictNullChecks` disabled. It also does not enable `noUncheckedSideEffectImports`.

This may be an intentional compatibility choice or an inherited scaffold default, but the repository does not record the
reason. Because the package publishes reusable React components and bundled public declarations, compiler strictness
should be selected deliberately and verified against the complete build rather than copied from a template or enabled
speculatively.

The existing TypeScript 7 incident is separate: this audit concerns compiler options on the current supported TypeScript
6 toolchain and must not weaken declaration bundling to make stricter checks pass.

## Outcome

- The effective compiler options for `tsconfig.app.json` and `tsconfig.node.json` are understood and intentional.
- `strict` and relevant independent safeguards, including `noUncheckedSideEffectImports`, are accepted or rejected with
  concrete repository evidence.
- Any accepted options pass source type-checking, the Vite build, bundled declaration generation, Storybook, and package
  verification.
- Any source errors exposed by stricter checks are resolved without weakening public types or adding blanket
  suppressions.
- The durable TypeScript policy and any justified exceptions are documented in the appropriate agent-operating guidance.

## Next step

Capture the effective app and Node compiler settings with `tsc --showConfig`, then run non-persistent strictness trials
against both configs. Classify every resulting diagnostic by compiler option and source area before proposing a focused
configuration change.

## References

- [Application TypeScript configuration](../tsconfig.app.json)
- [Node TypeScript configuration](../tsconfig.node.json)
- [TypeScript 7 native compiler incident](../docs/agent-operating-charter/typescript-7-native-compiler-incident.md)
