## Toast Component Adaptation Decision

### Scope

This record captures the non-obvious decisions made while adapting Base UI Toast to Nodzimo UI. The implementation lives
under `src/client/components/toast`; the representative consumer is `toast.stories.tsx`.

Primary references:

- [Base UI Toast documentation](https://base-ui.com/react/components/toast)
- [shadcn Base UI Toast source](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/toast.tsx)

### Provider And Root Responsibilities

`Toaster` is the NUI high-level composition. It owns the Provider, Portal, Viewport, and internal toast list. Consumers
use it for the ready-to-render stacked toast experience.

`Toast` is the low-level Root part. It requires a toast object from a manager and is intended for consumers that need to
compose or replace the rendering structure.

The exported `toast` manager is the default manager passed by `Toaster`. Consumers can call `toast.add(...)` from event
handlers or create a separate manager with `createToastManager` and pass it to `Toaster`.

### Public API Contract

Every public NUI Toast part exposes a named props alias derived from the matching Base UI primitive:

```text
ToastProps            = ToastPrimitive.Root.Props
ToastProviderProps    = ToastPrimitive.Provider.Props
ToastPortalProps      = ToastPrimitive.Portal.Props
ToastViewportProps    = ToastPrimitive.Viewport.Props
ToastContentProps     = ToastPrimitive.Content.Props
ToastTitleProps       = ToastPrimitive.Title.Props
ToastDescriptionProps = ToastPrimitive.Description.Props
ToastActionProps      = ToastPrimitive.Action.Props
ToastCloseProps       = ToastPrimitive.Close.Props
ToasterProps          = ToastPrimitive.Provider.Props
```

`ToastType` and `ToastPriority` are extracted from `ToastProps['toast']`. `ToastType` is intentionally `string`, because
Base UI permits custom types. `TOAST_TYPES` is only the finite set handled by the built-in NUI icon renderer. The real
Toast `type` default is `undefined`; `success` is not the component default.

`ToastPriority` is the upstream `'low' | 'high'` contract. It controls announcement urgency for screen readers, not
visual styling. `low` is polite and `high` is urgent. `TOAST_PRIORITIES` is exported for runtime consumers and Storybook
controls.

### Storybook Contract

Toast has one interactive `Default` story. It renders a real `Button` inside `Toaster` and calls the exported `toast`
manager with the manager fields `title`, `description`, `type`, and `priority`.

The story combines two real API layers:

- `limit` and `timeout` are actual `Toaster` Provider props;
- `title`, `description`, `type`, and `priority` are actual `toast.add` fields.

`onShowToast` is the only story-only argument. It is a Storybook Actions spy and does not belong to the NUI Toast API.
The story omits `type` initially so the documented API default remains `undefined`; explicit `TOAST_TYPES` values can be
selected through Controls.

Story args for `title` and `description` use the public Toast object field types. Storybook supplies strings for the
interactive text controls, while the runtime Base UI contract remains broader (`ReactNode`).

### Decomposition Decision

The implementation remains in one module. The public parts are small passthrough wrappers, while `ToastList` and
`ToastIcon` form one private composition owned by `Toaster`. Splitting the wrappers would create sibling imports or
duplicate the composition without establishing independent semantic responsibilities. Revisit decomposition only if
anchored toasts, alternate renderers, or additional private behavior are added.

### Verification Gate

Toast changes should verify:

- Biome and TypeScript accept the implementation, public barrel, and story;
- Storybook builds successfully and `Show toast` renders a real toast;
- `limit` and `timeout` remain Provider controls, while manager fields remain manager controls;
- `type` documents `undefined` as the API default and `TOAST_TYPES` as the built-in renderer subset;
- `priority` is documented as a screen-reader announcement setting, not a visual variant;
- RTL and logical positioning remain intact;
- the public barrel exports the intended parts, props, manager, and finite option constants.
