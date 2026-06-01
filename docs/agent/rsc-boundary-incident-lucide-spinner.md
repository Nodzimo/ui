## RSC Boundary Incident: Lucide Spinner

This incident is historical context for the current core/client boundary rules. The active rule is still in
[Core Vs Client](core-vs-client.md): root exports must stay safe for React Server Component import graphs.

- Incident summary: `Spinner` in `src/core` imported `Loader2Icon` from `lucide-react`. Before `lucide-react` was marked
  external in Vite/Rolldown, the library build inlined Lucide's implementation into `dist/nodzimo-ui.js`.
- The inlined Lucide code included top-level React context setup, including `createContext`, plus icon helpers such as
  `forwardRef`, `createElement`, and `useContext`.
- The Next consumer imported only `Card` from `@sefo/nodzimo-ui`, but the root barrel also exported `Spinner`. Because
  Lucide had been inlined into the same root entry, the RSC graph evaluated code that called `createContext` under
  React's `react-server` condition and the consumer build failed with `TypeError: createContext is not a function`.
- Do not treat shadcn-style app-source examples as proof that the same import is safe after this package prebuilds a
  public entrypoint. Next can inspect client boundaries in an app source graph, while Vite/Rolldown can erase that
  boundary by copying dependency internals into `dist/nodzimo-ui.js`.
- The old workaround was to keep `lucide-react` external in Vite/Rolldown, which kept an external `lucide-react` import
  in the root entry instead of copying Lucide internals into `dist/nodzimo-ui.js`.
- The long-term fix is now preferred: `Spinner` uses a generated project-owned SVG icon from `#core/icons`, so the root
  entry no longer imports `lucide-react` at runtime.
- `lucide-react` has been removed from package dependencies entirely. Stories and demos should use project-owned
  generated icons from `#core/icons`, not reintroduce `lucide-react` as a convenience dependency.
- Do not add `lucide-react` back to `dependencies`, `devDependencies`, or Vite externals unless the project deliberately
  accepts a runtime or tooling dependency again and documents why generated project-owned icons are not enough.
