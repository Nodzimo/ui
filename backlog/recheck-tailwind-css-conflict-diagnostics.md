---
status: waiting
type: upstream
created: 2026-07-18
review_after: 2026-08-01
---

# Restore the current Tailwind CSS release without false conflict diagnostics

## Context

After the direct `tailwindcss` dependency was updated from 4.3.2 to 4.3.3, WebStorm began reporting many false
`cssConflict` warnings for utilities that target different selectors or mutually exclusive variants. Downgrading the
direct dependency to 4.3.2 removes the warnings, so it is temporarily pinned there. The related `@tailwindcss/cli` and
`@tailwindcss/vite` packages remain on 4.3.3.

Tailwind CSS 4.3.3 changed selector and nesting handling. Tailwind's IntelliSense language server had assumed the old
AST shape and consequently compared declarations without preserving their selector differences. The upstream fix was
merged into Tailwind CSS IntelliSense and released in version 0.16.0, but updating the currently available tooling has
not yet removed the warnings in this WebStorm project.

## Current workaround

Keep the direct `tailwindcss` development dependency pinned to 4.3.2. Do not rewrite valid component classes merely to
satisfy these false diagnostics, and do not disable the shared `cssConflict` inspection globally.

## Resume when

WebStorm or its Tailwind CSS integration exposes a language-server build containing the IntelliSense 0.16.0 fix, or a
newer integration explicitly documents the same correction.

## Outcome

- `tailwindcss`, `@tailwindcss/cli`, and `@tailwindcss/vite` use the same current compatible release.
- WebStorm no longer reports the known false `cssConflict` warnings in existing Select and Dropdown Menu class lists.
- Genuine same-selector utility conflicts are still reported.
- The focused project checks and Tailwind CSS build pass after the version alignment.

## Next step

On or after the review date, inspect the Tailwind integration or bundled language-server version available to WebStorm.
If it contains the fix, align the three Tailwind packages, reinstall dependencies, restart the Tailwind language server
or IDE, and recheck representative conflict diagnostics before running focused project verification.

## References

- [Tailwind CSS issue #20345: false conflicts after 4.3.3](https://github.com/tailwindlabs/tailwindcss/issues/20345)
- [Tailwind CSS IntelliSense issue #1600: incorrect backdrop conflict](https://github.com/tailwindlabs/tailwindcss-intellisense/issues/1600)
- [Tailwind CSS IntelliSense pull request #1601: conflict fix](https://github.com/tailwindlabs/tailwindcss-intellisense/pull/1601)
- [Tailwind CSS IntelliSense 0.16.0 release](https://github.com/tailwindlabs/tailwindcss-intellisense/releases/tag/v0.16.0)
- [Tailwind CSS 4.3.3 release](https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.3.3)
- [Current dependency versions](../package.json)
