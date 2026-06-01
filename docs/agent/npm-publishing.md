## npm Publishing

- Manual npm publishing is the current release flow.
- Use the `sefo` npm account for the `@sefo/nodzimo-ui` package.
- Use interactive npm authentication with 2FA for manual publishing; do not store npm access tokens in the repository.
- For future CI/CD publishing, prefer npm Trusted Publishing/OIDC over long-lived npm tokens.
- Before publishing, run `bun run project:verify` and inspect the package with `npm pack --dry-run` or
  `bun pm pack --dry-run`.
- Use `npm publish` through `bun run publish:npm` after confirming the package contents.
- Version `0.x` is acceptable while the library is early and primarily used by the author's own projects.

