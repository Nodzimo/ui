## Local Consumer Testing

- `bun link` works in simple Vite/React consumers, but it is not reliable with Next 16 Turbopack.
- Next 16 Turbopack can fail to resolve linked/junction packages even when Node, Bun, and IDE resolution work.
- Avoid using `turbopack.root` as a workaround unless the parent folder is a real monorepo root with its own
  `package.json` and `node_modules`. Setting the root to the sibling parent can break Tailwind/PostCSS dependency
  resolution in the Next app.
- Avoid `file:../nodzimo-ui` as a folder dependency with Bun on Windows. Bun can try to copy the whole working
  directory, including `.git`, and fail with `EPERM`.
- Preferred Next/Turbopack consumer flow after publication:
    1. Publish a new package version from this project.
    2. Install or update the package in the consumer with `bun add "@sefo/nodzimo-ui"` or `bun update @sefo/nodzimo-ui`.
    3. Import from `@sefo/nodzimo-ui`, `@sefo/nodzimo-ui/client`, and `@sefo/nodzimo-ui/styles.css`.
- Tarball testing remains useful before publishing a version:
    1. Run `bun run project:verify` in this project, or run `bun run lib:pack` after a fresh library build.
    2. Install the generated `nodzimo-ui.tgz` in the Next consumer.
    3. Reinstall the tarball in the consumer after each library rebuild.
- Keep generated `.tgz` archives out of git.

