## Storybook MDX React Proxy Incident

- Storybook 10.4 with React 19, Vite/Rolldown, `@storybook/addon-docs`, and the custom dark-mode Docs container has a
  production-only Docs bundling incident in this project. The development Storybook can work while the static
  `storybook build` output fails only on Docs pages with React minified error #130. The confirmed local failure mode was
  Storybook's `DocsRenderer` dynamically importing `@mdx-js/react`, Vite/Rolldown rewriting that dynamic import to the
  main iframe chunk, and the expected named `MDXProvider` export not being available from that chunk. Story pages kept
  working because the crash was inside the Docs renderer path.
- Keep the workaround isolated in `.storybook/build-plugins/mdx-react-proxy-plugin.ts` plus
  `.storybook/build-plugins/mdx-react-proxy.ts`, and register it from `.storybook/vite.config.ts` as a normal Vite
  plugin next to `tailwindcss()`. The plugin narrowly rewrites the dynamic `import("@mdx-js/react")` from Storybook
  addon-docs to a local proxy module that re-exports `MDXProvider` and `useMDXComponents` from `@mdx-js/react`. This is
  intentionally Storybook-only, should not affect the publishable library build, and is preferable to patching
  `node_modules`, disabling Docs, removing the custom Docs container, or adding runtime monkey patches.
- Keep the MDX React proxy split into two files. The plugin file is Node/Vite build-time code; the proxy file is the
  browser-runtime module dynamically imported by Storybook Docs. Do not point the rewrite at the plugin module or merge
  the files just to reduce count, because that mixes build-time imports such as `node:url` and `vite` with the browser
  Docs runtime.
- In `.storybook/build-plugins/mdx-react-proxy.ts`, re-export from the package import `@mdx-js/react`. Do not deep-link
  or relatively import `../node_modules/@mdx-js/react/index.js`; the normal package import resolves correctly in the
  Storybook Vite build and keeps the workaround smaller and less coupled to package internals.
- Treat the MDX React proxy plugin as a temporary production-build workaround. Re-check it after Storybook, Vite, or
  Rolldown upgrades: build the public Storybook, serve the static output, open at least one Button Docs page and one
  Spinner Docs page, and confirm there are no runtime console errors. If Storybook later fixes the `@mdx-js/react`
  dynamic import path, remove the plugin and proxy together. Related public signals are Storybook issue
  https://github.com/storybookjs/storybook/issues/32604 and older addon-docs/MDX export issues such as
  https://github.com/storybookjs/storybook/issues/24792; neither is a perfect one-to-one match, so keep the local
