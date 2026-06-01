## Client Bundle Incident: Base UI Select

This incident is historical context for the current dependency externalization rule. The active rule is in
[Dependency Concepts](dependency-concepts.md): runtime implementation dependencies stay installable through package
metadata and externalized from the built library artifacts unless the project documents a deliberate bundled-runtime
exception.

- Incident summary: `Select` in `src/client` imported Base UI subpaths such as `@base-ui/react/select`. Before runtime
  dependencies were automatically externalized from `dependencies + peerDependencies`, the library build copied Base UI,
  Floating UI, store helpers, and `use-sync-external-store` internals into `dist/client.js`.
- The earlier Button implementation also copied a small Base UI slice into the client artifact, but it did not pull the
  dangerous CommonJS shim path. Button working was not proof that the bundling policy was correct.
- After Select expanded the Base UI dependency graph, `dist/client.js` grew from the tens of kilobytes range to roughly
  198 KB and contained Rolldown dynamic `require` support such as `typeof require`, `new Proxy`, and
  `Calling \`require\``.
- A Next/Turbopack consumer can fail in this state with a browser error such as
  `Error: dynamic usage of require is not supported`.
- This is not a root/RSC leak when `dist/nodzimo-ui.js` stays clean. It is a client bundle externalization failure.
- The fix is not moving Base UI to `devDependencies` and not making consumers install Base UI manually. Base UI remains
  a runtime implementation dependency in `dependencies`; Vite/Rolldown leaves it as an external import in `dist`, and
  the consumer package manager installs it automatically with this package.
- Treat a sudden `dist/client.js` size jump as a release-blocking signal until the built artifact is inspected.
- Client artifact checks must look for bundled third-party internals and CJS shims, not only for missing
  `"use client";`.
