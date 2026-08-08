---
status: ready
---

# Verify the Tailwind plugin in the publishable Vite build

## Context

The root `vite.config.ts` includes `@tailwindcss/vite`, but the package does not import its stylesheet entrypoint from
either JavaScript entrypoint. The publishable `dist/styles.css` artifact is built separately by Tailwind CLI from
`src/styles.css`, and Storybook has its own Vite configuration with its own Tailwind plugin instance.

The root plugin currently appears to have no package artifact responsibility. It may be a harmless development
convenience or an obsolete configuration remnant, but its purpose is not documented. Keeping an unnecessary plugin in
the publishable build adds configuration surface and couples JavaScript/declaration builds to Tailwind without an
observable output requirement.

## Outcome

- The root Tailwind Vite plugin has an explicit, evidence-backed responsibility or is removed.
- Removing it does not change `dist/ui.js`, `dist/client.js`, bundled declarations, or the CLI-built stylesheet.
- Storybook continues to compile its preview CSS through its dedicated Vite configuration.
- Development, complete package verification, and package inspection continue to pass.
- Durable Vite and Tailwind guidance reflects the resulting ownership boundary.

## Next step

Temporarily remove `tailwindcss()` and its import from the root `vite.config.ts`, then compare clean build artifacts and
run `build:all`, Storybook build, and complete package verification. If no root-build responsibility is found, prepare a
focused removal change; otherwise document the concrete behavior that requires the plugin.

## References

- [Publishable Vite configuration](../vite.config.ts)
- [Storybook Vite configuration](../.storybook/vite.config.ts)
- [Tailwind and styles contract](../docs/agent-operating-charter/tailwind-and-styles.md)
- [Vite build notes](../docs/agent-operating-charter/vite-build-notes.md)
- [Package scripts](../package.json)
