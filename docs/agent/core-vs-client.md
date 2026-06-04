## Core Vs Client

### Boundary Meaning

- `core` does not mean server-only. It means no client boundary is required and the root entry must stay safe for
  React Server Component import graphs.
- Treat `@nodzimo/nodzimo-ui` as the RSC-safe entrypoint. It should be more restrictive than "works during SSR".
- React Server Components (RSC) use React's `react-server` condition. In that graph, React deliberately does not expose
  APIs such as `createContext` or `useContext`; top-level code that calls those APIs can fail before a component is
  even rendered.
- Server-side rendering (SSR) is different from RSC. SSR runs server code with the ordinary React server renderer, where
  APIs such as `createContext`, `forwardRef`, `createElement`, and `useContext` can exist. A component can be SSR-safe
  and still not be RSC-pure.
- `'use client'` marks a client boundary for Next/React. Server Components may render Client Components, and Next can
  keep the route SSG when no dynamic request-time APIs or uncached runtime data are used.
- Static Site Generation (SSG) means the route can be computed at build time. SSG is not proof that a dependency is
  RSC-pure; it only proves the route did not require dynamic runtime rendering in that build.

### Source Rules

- `core` code must not depend on browser-only APIs, React state/effect hooks, event-driven behavior, React Compiler
  runtime, or third-party modules that execute RSC-incompatible React APIs at module top level.
- `client` code may use state, effects, refs, browser APIs, interactive behavior, and React Compiler.
- A Server Component may render a Client Component. That does not automatically make a Next route dynamic;
  static/dynamic rendering depends on Next dynamic APIs and data access, not merely on client components.
- Icons and small SVG primitives in `core` should prefer inline SVG or project-owned RSC-safe wrappers when the icon is
  part of a fundamental core component such as `Spinner`.
- Third-party React component libraries that use context, providers, hooks, or `"use client"` belong in `src/client`
  unless their RSC behavior has been inspected in the built package and verified in the Next consumer.
- Framework-agnostic providers that are required for UI-kit component behavior, such as Base UI direction context, may
  be exported from `@nodzimo/nodzimo-ui/client` through `src/client/providers`. Do not export them from the
  root/RSC-safe
  entrypoint.
- Do not move app-owned providers into the UI kit merely because a consumer app uses them. Framework, routing, locale,
  auth, data, cookie, or Next-specific providers such as `next-intl` or `next-themes` belong in the consumer app unless
  the UI kit itself requires a framework-agnostic runtime provider for its own components.

### Related Incidents

- The Lucide Spinner incident explains why app-source examples are not enough to prove a root export remains RSC-safe
  after this package prebuilds the entrypoint. See
  [RSC Boundary Incident: Lucide Spinner](rsc-boundary-incident-lucide-spinner.md).
