## Dependency Graph Checks

### Tooling

- Dependency graph checks use `dependency-cruiser`; do not replace these deterministic checks with an agent skill.
- `check:deps` cruises `src` and is the regular import/dependency graph check.
- `check:deps-graph` generates `dependency-graph.svg` for manual inspection and requires Graphviz `dot` to be
  installed and available on `PATH`.

### Rules

- The dependency-cruiser config is intentionally project-specific. Keep rules focused on real architectural constraints
  and avoid broad suppressions.
- Colocated `.stories.*` files under `src` are development-only Storybook files. Keep them excluded from the
  `not-to-dev-dep` production rule so imports such as `storybook/test` can remain in `devDependencies`.
- React and React DOM are expected peer dependencies for this UI library. Imports from React in library source are not a
  dependency violation; consumers provide React at runtime, while the project keeps React in dev dependencies for local
  development.
