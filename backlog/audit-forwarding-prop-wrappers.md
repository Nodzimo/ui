---
status: ready
---

# Audit forwarding prop wrappers

## Context

Several shadcn/Base UI wrappers use `function Component({ ...props }: Props)` even when no named property is
destructured. This is an upstream generated-source pattern that documents prop forwarding, but it creates an unnecessary
shallow object copy before spreading the same properties into the primitive. Nodzimo should preserve real rest
destructuring when component-owned props such as `className` or `children` are extracted, while using a plain `props`
parameter for pure passthrough wrappers.

## Outcome

- Every hand-authored React component is classified as either a real rest-destructuring wrapper or a pure passthrough
  wrapper.
- Pure passthrough wrappers use a whole `props` parameter and do not create an unnecessary rest-object copy.
- Wrappers that extract component-owned properties keep a correctly named `restProps` remainder and preserve prop
  precedence and runtime behavior.
- The audit covers the full component and provider surfaces, not only the current Toast port.
- The final code remains aligned with the upstream public contracts without retaining generated-source ceremony that has
  no purpose in the Nodzimo UI kit.

## Next step

Search all hand-authored `src/**/*.tsx` wrappers for object-rest destructuring, classify each occurrence, then update
only pure passthrough wrappers and run the focused Biome and TypeScript checks.

## References

- [shadcn Base UI Toast source](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/toast.tsx)
- [shadcn Base UI Dialog source](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/dialog.tsx)
- [Nodzimo code-style conventions](../docs/agent-operating-charter/code-style-conventions.md)
- [Nodzimo component styling conventions](../docs/agent-operating-charter/component-styling.md)
