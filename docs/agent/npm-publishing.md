## npm Publishing

### Release Flow

- Manual npmjs publishing is the current public npm registry release flow.
- GitHub Releases are automated separately from npmjs publishing. Use `bun run release:patch` and `bun run release:push`
  to create and push the version tag that triggers the GitHub Release workflow, then publish to npmjs manually when the
  package artifact is ready.
- Use the `nodzimo` npm account for the `@nodzimo/nodzimo-ui` package on npmjs.
- Use Bun for publishing and package-manager operations. Use `bunx npm` only for npm CLI commands that Bun does not
  provide directly, such as login and funding inspection.
- Use interactive npm authentication with 2FA for manual publishing; do not store npm access tokens in the repository.
- For future CI/CD publishing, prefer npm Trusted Publishing/OIDC over long-lived npm tokens.
- GitHub Packages publishing is a separate Bun publish flow for the same `@nodzimo/nodzimo-ui` package name.

### Publish Checks

- Before publishing, run `bun run project:verify` and inspect the package with `bun run publish:dry` or
  `bun pm pack --dry-run`.
- Use `bun publish` through `bun run publish:npmjs` after confirming the package contents and active npm account.
- Version `0.x` is acceptable while the library is early and primarily used by the author's own projects.

See [GitHub Releases](github-releases.md) for the release workflow, version-tag push, and cleanup commands.
