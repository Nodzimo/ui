## Internal Package Imports

### Import Map

- Use `package.json#imports` for internal source imports, not Vite-only `@/*` aliases.
- Keep the internal import map aligned with the barrel architecture:
    - `#lib` -> `src/lib/index.ts`
    - `#lib/*` -> `src/lib/*/index.ts`
    - `#core` -> `src/core/index.ts`
    - `#core/*` -> `src/core/*/index.ts`
    - `#client` -> `src/client/index.ts`
    - `#client/*` -> `src/client/*/index.ts`

### Preferred Paths

- Use `#lib` for shared utilities such as the class-name merge helper.
- Use `#client` and `#core` when a story or internal integration should validate the public internal barrel.
- Use specific imports such as `#client/components/button` for focused component work.
- Use `#core/icons` when core components need generated project-owned icons from another core area. Avoid importing
  icons through `#core`, because the aggregate barrel can create dependency cycles.
- Inside one component folder, prefer relative imports such as `./button-variants`; do not route local implementation
  details through `#client` or `#core`.
- Colocated stories and tests that sit beside a component folder `index.ts` may import the component through the local
  folder surface with `import { Button } from '.'`. This validates the component's local public API, avoids importing
  implementation files directly, and prevents IDE "import can be shortened" noise without suppressions.
- Do not import from the public package name (`@sefo/nodzimo-ui`) inside this package's source. Public package imports
  are
  for consumers.
