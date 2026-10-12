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
- A named aggregate-barrel import in a colocated story does not change the published runtime artifact because
  `*.stories.*` files are excluded from production entrypoints. It does make Storybook traverse that public barrel,
  which is useful for integration coverage but can expose cycles or boundary leaks; choose it deliberately rather than
  for path brevity.
- Use `#core/icons` when runtime component implementations need generated project-owned icons. Avoid importing icons
  through `#core` there, because the aggregate barrel can create dependency cycles.
- A Storybook inventory helper that must enumerate every export in one generated icon category may import that focused
  category as a namespace, for example `#core/icons/generated/flags`. This is gallery infrastructure, not a colocated
  consumer story: Button and Select stories should continue to exercise icons through `#core`.
- Inside one component folder, prefer relative imports such as `./button-variants`; do not route local implementation
  details through `#client` or `#core`.
- Icons import their shared props directly from `icon-types.ts`, not from the barrel that re-exports the icons.
  Use paths relative to the importing file, including generated files. A shorter alias is not a reason to add a reverse
  dependency through an owning barrel.
- Colocated stories and tests that sit beside a component folder `index.ts` may import the component through the local
  folder surface with `import { Button } from '.'`. This validates the component's local public API, avoids importing
  implementation files directly, and prevents IDE "import can be shortened" noise without suppressions.
- Do not import from the public package name (`@nodzimo/ui`) inside this package's source. Public package imports are
  for consumers.

### Declaration And IDE Integration

- `vite.config.ts` derives declaration-only TypeScript `paths` from this import map so `unplugin-dts` can transform
  internal specifiers before API Extractor rollup. Do not copy the map into a second maintained list or point
  declaration analysis back at source implementations. See
  [the declaration incident](public-declaration-leak-incident-shadcn.md).
- Shared WebStorm import preferences preserve direct imports inside mapped areas while retaining alias use outside
  them. Import-shortening diagnostics do not override these architecture rules or prevent component decomposition.
  See [WebStorm Project Settings](webstorm-project-settings.md).
