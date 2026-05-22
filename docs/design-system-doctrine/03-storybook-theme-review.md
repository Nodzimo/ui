## Current Storybook Decision Trail

The primary exploration is captured in:

```text
src/client/components/button/button.stories.tsx
Client/Components/Button/Recommended emerald pair
```

Important named iterations:

```text
Iteration 6: Night Emerald breakthrough (primary x3)
The point where the dark theme stopped being a compromise and became a real theme.

Iteration 8: bolder supporting roles (primary x3)
The point where secondary/outline/ghost started gaining enough character.

Iteration 10: final role discipline (primary x3)
The current art-director candidate: character retained, hierarchy disciplined.
```

Do not delete this exploration casually. It is useful design history. If it becomes too large later, archive it into a
dedicated story or design-lab story rather than losing the trail.

## Storybook Theme Review Contract

Storybook has separate theme surfaces, and they should not be treated as one switch.

Preview theme is for the component canvas. Use `@storybook/addon-themes` with `withThemeByClassName` so the toolbar
adds the same `light` / `dark` class contract that the library stylesheet expects. This is the source of truth for
reviewing light and dark component behavior, including design-system token documentation.

Manager theme is Storybook's own chrome: sidebar, toolbar, bottom panels, and branding. Configure it through
`storybook/theming` and `.storybook/manager.ts` `addons.setConfig({ theme })`. Storybook's `create({ base })` only
accepts `light` or `dark`; use `getPreferredColorScheme()` when the branded manager should follow the user's system
preference at load time. Use `storybook-dark-mode` for the live manager light/dark toggle. Do not let
`storybook-dark-mode` own the component preview iframe; that collapses the tool theme and product theme into one switch
and conflicts with `@storybook/addon-themes`.

Docs pages have their own rendering surface. Use the custom Docs container in `.storybook/preview.tsx` so Docs chrome
follows `storybook-dark-mode`, while standalone MDX token pages still follow the component theme from
`@storybook/addon-themes`. This is necessary because unattached MDX pages do not reliably re-run story decorators when
the component-theme toolbar changes while the user is already on that MDX page.

The global preview wrapper should include:

```text
nui-surface nui-boundaries nui-interactive
```

`nui-surface` is required in Storybook because the wrapper must receive `bg-nui-background text-nui-foreground` after
the preview theme changes. Without it, transparent stories can show dark-theme tokens on a light Storybook canvas, or
light-theme tokens on a dark canvas. The wrapper-level `wrapperBackground` control remains useful as a preview-only
override, but it does not replace the required themed wrapper classes.

