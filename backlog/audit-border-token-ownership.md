---
status: ready
---

# Audit component border token ownership

## Context

Nodzimo components currently use two valid-looking border patterns: a structural `border` or `border-t` that relies on
the opt-in `.nui-boundaries` foundation, and an explicit `border-nui-border` or semantic border token owned by the
component. The upstream shadcn/Base UI sources commonly use the structural form with a global app-level border rule.
During the Toast token pass, an explicit `border-nui-border` was briefly added and then removed to preserve the
component's structural behavior. The repository needs one deliberate rule instead of component-by-component guesses.

### Current reference: Toast

`src/client/components/toast/toast.tsx` is the concrete example that prompted this record. Its upstream Base UI/shadcn
source used `border`; the NUI token pass initially changed that to `border border-nui-border`, then removed the added
color utility while retaining the structural `border`. The token pass was committed as
`c065ac4 fix(toast): adapt styles to NUI theme tokens`. Use this component and its upstream source as the first case
study when deciding whether the border color belongs to the component or to the opt-in `.nui-boundaries` foundation.

## Outcome

- Every component with a border is compared with its upstream shadcn/Base UI source and its intended Nodzimo surface
  role.
- The audit distinguishes structural borders, input/control borders, semantic borders, and decorative separators.
- The repository decides when components may rely on `.nui-boundaries` and when they must provide an explicit NUI border
  token to remain self-contained.
- Existing components are normalized consistently without changing intended visual hierarchy or consumer override
  behavior.
- The decision is recorded in durable project documentation if it applies beyond the audited components.

## Next step

Inventory border utilities across `src/core` and `src/client`, compare representative implementations with the upstream
shadcn sources, then document and apply the agreed border-ownership rule in a focused pass.

## References

- [Nodzimo library foundation styles](../src/library.css)
- [Current Toast implementation](../src/client/components/toast/toast.tsx)
- [Nodzimo theme token contract](../docs/agent-operating-charter/theme-token-contract.md)
- [shadcn Base UI Toast source](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/toast.tsx)
- [shadcn Base UI Dialog source](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/dialog.tsx)
