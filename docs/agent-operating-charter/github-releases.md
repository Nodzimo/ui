## GitHub Releases

### Purpose

- GitHub Releases are the repository release record: tag, generated notes, full changelog link, and GitHub's automatic
  `Source code (zip)` and `Source code (tar.gz)` archives.
- GitHub Releases are separate from npmjs publishing. npmjs publishing remains a manual local Bun step.
- GitHub Packages publishing is automated from the pushed version tag and uses the same package name,
  `@nodzimo/ui`.
- The GitHub Packages package page is `https://github.com/Nodzimo/ui/pkgs/npm/ui`.
- The release workflow publishes the GitHub Package first, then creates the GitHub Release. A release should record a
  completed GitHub-side package publication, not precede it.

### Workflow Contract

- The release workflow is `.github/workflows/release.yml`.
- It runs only when a tag matching `v*.*.*` is pushed.
- The workflow has two jobs:
    - `publish-package` builds the package and publishes it to GitHub Packages with Bun.
    - `create-release` creates the GitHub Release only after `publish-package` succeeds.
- Keep job permissions scoped to the job that needs them:
    - `publish-package` needs `contents: read` and `packages: write`.
    - `create-release` needs `contents: write`.
- Do not install Node merely for publishing. The workflow is Bun-based and authenticates registry publishing with
  `NPM_CONFIG_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.

```yaml
name: Release

on:
  push:
    tags:
      - v*.*.*

jobs:
  publish-package:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Install Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun ci

      - name: Build package
        run: bun run build:all

      - name: Publish package
        run: bun publish --registry https://npm.pkg.github.com
        env:
          NPM_CONFIG_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  create-release:
    needs: publish-package
    runs-on: ubuntu-latest
    permissions:
      contents: write
    env:
      GH_TOKEN: ${{ github.token }}
    steps:
      - name: Create release
        run: gh release create ${{ github.ref_name }} --repo ${{ github.repository }} --generate-notes
```

### Required Pieces

- `publish-package` runs first so GitHub Release creation is blocked when GitHub Packages publishing fails.
- `bun ci` keeps the GitHub Packages workflow lockfile-strict and aligned with other CI/Nixpacks install phases.
- `bun run build:all` regenerates icons, builds JS/types, and builds the published stylesheet before packaging.
- `bun publish --registry https://npm.pkg.github.com` sends the package to GitHub Packages without changing
  `publishConfig.registry`, keeping npmjs as the default local publish target.
- `NPM_CONFIG_TOKEN: ${{ secrets.GITHUB_TOKEN }}` is the token shape Bun expects for automated registry publishing.
- `GH_TOKEN: ${{ github.token }}` authenticates GitHub CLI inside GitHub Actions. This is not a manually created PAT
  and should not be stored in repository secrets.
- `github.ref_name` is the short tag name that triggered the workflow, such as `v0.0.14`.
- `github.repository` is the repository id in `owner/name` form, such as `Nodzimo/ui`.
- `--repo ${{ github.repository }}` lets `gh` create the release without a local git checkout. Without checkout and
  without `--repo`, `gh` can fail with `fatal: not a git repository`.
- `--generate-notes` lets GitHub generate release notes and the full changelog link from the previous release/tag to
  the current tag.

### Release Commands

- `bun run release:patch` runs `bun pm version patch`. In a git repository, Bun updates `package.json`, creates a
  version commit, and creates a version tag such as `v0.0.14`.
- `bun run release:push` runs `git push --follow-tags`. It pushes the branch update and any missing annotated tags
  reachable from the pushed commits.
- Prefer `git push --follow-tags` over `git push --tags` for regular releases because `--tags` pushes every local tag,
  including old or experimental tags.
- If many historical tags were missing on GitHub, the first `--follow-tags` push can send them all. GitHub Actions does
  not create `push` events when more than three tags are pushed at once, so that batch may create tags without running
  the release workflow. Later single-tag releases should trigger normally.

Regular package release flow:

```powershell
bun run release:patch
bun run project:verify
bun run publish:dry
bun run publish:npmjs
bun run release:push
```

This order is intentional:

- `release:patch` creates the version commit and tag locally.
- `project:verify` proves the package, Storybook, lint, dependency graph, and pack output before publishing.
- `publish:dry` confirms package name, version, files, access, and npmjs registry target.
- `publish:npmjs` publishes manually to npmjs while the active npm account and 2FA remain under local control.
- `release:push` pushes the version tag only after npmjs publication succeeds. The pushed tag then triggers the GitHub
  workflow that publishes GitHub Packages and creates the GitHub Release.

### Cleanup And Rollback Commands

Inspect the current state before destructive cleanup:

```powershell
git status
git log --oneline --decorate -8
git tag --points-at HEAD
```

Undo the last commit but keep its changes in the working tree:

```powershell
git reset --mixed HEAD~1
```

Undo the last commit but keep its changes staged:

```powershell
git reset --soft HEAD~1
```

Drop the last commit locally and discard its file changes:

```powershell
git reset --hard HEAD~1
```

Drop the last three local commits, for example after experimental version bumps:

```powershell
git reset --hard HEAD~3
```

Rewrite the remote branch to match the local branch after a reset:

```powershell
git push --force-with-lease origin main
```

Use `--force-with-lease`, not plain `--force`, because it refuses to overwrite the remote branch if new remote commits
appeared that are not present locally.

Delete local version tags:

```powershell
git tag -d v0.0.13 v0.0.12 v0.0.11
```

Delete remote version tags:

```powershell
git push origin --delete v0.0.13 v0.0.12 v0.0.11
```

Delete a GitHub Release and its tag through GitHub CLI when needed:

```powershell
gh release delete v0.0.13 --cleanup-tag
```

If GitHub CLI authentication is not configured or the wrong account is active, delete the release/tag from the GitHub
web UI instead of changing local credential-manager state blindly.

### Notes And Limits

- Tags are independent refs. Resetting or force-pushing `main` does not delete local or remote tags. Delete tags
  explicitly when cleaning up experimental releases.
- A GitHub tag page can show source archives, but that is not the same as a GitHub Release. The release workflow creates
  the Release object.
- GitHub Packages uses the canonical package name `@nodzimo/ui`, published under the repository owner namespace.
