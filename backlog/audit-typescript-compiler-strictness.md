---
status: ready
---

# Complete the audit of TypeScript compiler safeguards

## Context

The app and Node configs now explicitly enable `strict`. The separate Storybook config inherits the app config, and
the distribution config inherits strict checking while disabling `skipLibCheck` for generated public declarations.
The adopted boundaries and automatic artifact gate are documented in
[Verification](../docs/agent-operating-charter/verification.md#typescript-check-boundaries).

The remaining audit concerns effective configuration coverage and independent safeguards outside the `strict` family,
including whether to enable `noUncheckedSideEffectImports`. Those options have not been decided by adopting strict mode.
Do not reopen the accepted strict baseline or treat the completed declaration repair as evidence for unrelated flags.

The existing TypeScript 7 incident is separate: this audit concerns compiler options on the current supported TypeScript
6 toolchain and must not weaken declaration bundling to make stricter checks pass.

## Outcome

- The effective compiler options for `tsconfig.app.json`, `tsconfig.node.json`, and any separately compiled Storybook
  configuration are understood and intentional.
- Any configuration that does not inherit or explicitly enable the accepted strict baseline is identified and resolved,
  or a narrow documented exception records why it cannot use it.
- Relevant independent safeguards, including `noUncheckedSideEffectImports`, are accepted or rejected with concrete
  repository evidence.
- Any accepted options pass source type-checking, the Vite build, bundled declaration generation, Storybook, and package
  verification.
- Any source errors exposed by stricter checks are resolved without weakening public types or adding blanket
  suppressions.
- The durable TypeScript policy and any justified exceptions are documented in the appropriate agent-operating guidance.

## Next step

Capture the effective app, Node, Storybook, and distribution configurations with `tsc --showConfig --project <config>`.
Identify checks outside `strict` that address an actual repository risk, then trial only those candidates without
persistent configuration changes. Classify diagnostics and propose acceptance or rejection with focused evidence.

## References

- [Application TypeScript configuration](../tsconfig.app.json)
- [Node TypeScript configuration](../tsconfig.node.json)
- [Storybook TypeScript configuration](../.storybook/tsconfig.json)
- [Distribution TypeScript configuration](../tsconfig.dist.json)
- [TypeScript 7 native compiler incident](../docs/agent-operating-charter/typescript-7-native-compiler-incident.md)
