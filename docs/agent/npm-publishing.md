## npm Publishing

### Release Flow

- Manual npm publishing is the current release flow.
- GitHub Releases are automated separately from npm publishing. Use `bun run release:bump` and `bun run release:push`
  to create and push the version tag that triggers the GitHub Release workflow, then publish to npm manually when the
  package artifact is ready.
- Use the `sefo` npm account for the `@sefo/nodzimo-ui` package.
- Use interactive npm authentication with 2FA for manual publishing; do not store npm access tokens in the repository.
- For future CI/CD publishing, prefer npm Trusted Publishing/OIDC over long-lived npm tokens.
- Do not treat GitHub Packages as an automatic mirror of npmjs. Publishing there requires a separate registry flow and
  an explicit package namespace decision.

### Publish Checks

- Before publishing, run `bun run project:verify` and inspect the package with `npm pack --dry-run` or
  `bun pm pack --dry-run`.
- Use `npm publish` through `bun run publish:npm` after confirming the package contents.
- Version `0.x` is acceptable while the library is early and primarily used by the author's own projects.

See [GitHub Releases](github-releases.md) for the release workflow, version-tag push, and cleanup commands.
