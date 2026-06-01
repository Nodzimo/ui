## Cleanup Scripts

- Keep generated distribution artifacts under `clean:dist`, including `dist`, generated package archives, and the
  Dependency Cruiser SVG graph. Treat small generated project files as part of this target unless they clearly belong to
  a more specific cleanup target.
- Keep dependency installs under `clean:modules`.
- Keep generated Storybook output under `clean:storybook`; `clean:all` should include Storybook output along with the
  distribution artifacts and dependency install.
- Keep `clean:ports` as the local development port cleanup helper. It uses `fkill-cli` from `devDependencies` and must
  passports with the `:port` syntax, for example `:6006`; a bare number is treated as a process id by `fkill`.
  Explicitly list known project ports instead of trying to kill arbitrary ranges. The current project ports are Vite dev
  `5173`, Vite preview `4173`, Storybook dev `6006`, and static Storybook preview `6007`.

