## shadcn Component Adaptation

### Goal

Port shadcn/Base UI components through reviewable passes until they are native Nodzimo UI components: token-safe,
library-safe, strongly typed, intentionally exported, maintainable, and documented by a useful Storybook consumer.

`src/client/components/select` and `src/client/components/dropdown-menu` are the current reference implementations. Use
their component folders, public barrels, and stories as patterns, but re-derive every decision from the new component's
upstream contract. Reference means matching quality and reasoning, not copying every type, file, control, or decorator.

### Staged Workflow

Keep the passes separate by default. Each pass should have one review question and a diff that answers it.

| Pass                         | Question                                                                   | Primary skill                                     | Behavior change              |
|------------------------------|----------------------------------------------------------------------------|---------------------------------------------------|------------------------------|
| 1. Source capture            | Is the upstream component present with its original contract?              | `nodzimo-ui-shadcn-adapter`                       | Upstream parity only         |
| 2. Mechanical cleanup        | Is the copied source readable and convention-safe?                         | `code-style-reviewer`, `tailwind-class-formatter` | None                         |
| 3. Theme adaptation          | Does styling use NUI tokens without redesigning the component?             | `theme-token-adapter`                             | Visual token mapping only    |
| 4. RTL and generated markers | Are registry markers, logical layout, icons, and motion resolved?          | `theme-token-adapter`                             | Directional correctness only |
| 5. Public API hardening      | Can real consumers use and inspect the intended compound contract?         | `compound-component-adapter`                      | Intentional API only         |
| 6. Decomposition             | Are large semantic parts self-contained and easy to navigate?              | `compound-component-adapter`                      | None                         |
| 7. Storybook                 | Does one representative consumer expose the important interactive surface? | `storybook-story-writer`                          | Story-only                   |
| 8. Final verification        | Do types, lint, styles, exports, and the rendered story agree?             | Relevant focused skills                           | None                         |

Do not collapse token changes, formatting, public API work, decomposition, and stories into one pass merely because the
final code is known. Small components may combine adjacent passes only when the diff remains unambiguous.

### Source Capture And Cleanup

- Start from the official source matching the installed primitive family and component base.
- Place interactive primitives under `src/client` and preserve the package boundary. Do not copy a file-level
  `'use client'` directive into every module when the client entrypoint already owns that boundary.
- Preserve upstream behavior, DOM structure, defaults, accessibility, and composition before adapting project details.
- Record the source version or link when upstream behavior is ambiguous.
- Run formatting and local syntax cleanup as a mechanical pass. Do not silently rename classes, change defaults, or
  redesign the API while making copied code readable.
- Prefer a canonical Tailwind scale utility such as `min-w-24` over an exactly equivalent arbitrary value when project
  tooling recognizes it. Do not convert incidental dimensions into NUI spacing tokens without a shared semantic role.
- Keep component-local imports relative. Use internal package imports for cross-area dependencies and intentional
  barrels.
- Audit new runtime dependencies and core/client placement with `rsc-package-boundary-reviewer` when the port changes
  package or build boundaries.

### Theme And RTL Adaptation

- Adapt semantic colors, radii, and intentional design-system spacing to NUI tokens.
- Leave structural Tailwind utilities and incidental component geometry unchanged unless a separate design decision owns
  the change.
- Resolve install-time registry markers. `cn-rtl-flip` becomes `rtl:rotate-180` only at inline-directional icon usage
  sites.
- Convert inline-axis spacing, positioning, radii, and logical-side motion deliberately. Verify portaled overlays in
  both directions instead of assuming inherited `dir`.
- Keep class regrouping separate from token replacement so reviewers can distinguish formatting from styling changes.

### Public Compound API

Treat Storybook as the first demanding consumer, not the owner of the component API. If Storybook reveals that an
important state or finite option is impossible to document cleanly, improve the public contract only when the same
metadata is useful to ordinary TypeScript consumers.

- Derive part props from the upstream primitive:

```ts
type DropdownMenuTriggerProps = MenuPrimitive.Trigger.Props
```

- Compose wrapper-owned props with upstream parts instead of reconstructing the upstream contract:

```ts
type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
    Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>
```

- Export public part props when consumers can render that part directly.
- For meaningful finite public values, export one runtime constant and derive or validate its type from the upstream
  contract. Runtime constants serve consumers and Storybook controls; TypeScript unions alone do not exist at runtime.
- Use `NonNullable` when a runtime option list represents explicit selectable values and must exclude an upstream
  optional `undefined`.
- Do not manufacture runtime constants for booleans, callbacks, arbitrary strings, or unions that are not useful control
  options.
- Do not reconstruct broad upstream generics or unions for cosmetic symmetry. Add focused owned types only when they
  improve a real consumer boundary, as `SelectOption<Value>` and `SelectOptions<Value>` do.
- Keep each part's props transparent. Do not extract a shared one-field helper such as `InsetProps` merely because
  `inset?: boolean` repeats across parts; introduce shared contracts only when consumers benefit from the shared name.
- Export the intended surface through the component folder `index.ts`, then verify aggregate client/core barrel flow.

Inspect the installed primitive declarations and official examples before assigning defaults or state ownership.
Compound components may expose the same prop name at multiple scopes. For example, root, trigger, and item `disabled`
states are separate contracts and must not be conflated.

### Presence-Based Boolean Attributes

HTML `data-*` values are strings, and Tailwind presence selectors such as `data-inset:*` match whenever the attribute
exists. Passing `false` directly can therefore still activate the style.

For wrapper-owned optional boolean markers where `false` means absence, omit the attribute:

```text
data-inset={inset || undefined}
```

Apply this normalization at the component boundary, not only in Storybook. Any consumer can pass `false`. Do not apply
the rule to primitive boolean props such as `disabled`; pass those to the primitive and let it own their semantics.

### Decomposition

Decompose after behavior, tokens, RTL, and public API are stable so the move-only diff stays reviewable.

- Split by self-contained semantic responsibility, not line-count targets.
- Keep tightly coupled helpers and parts in the same module.
- Target zero cross-imports between sibling implementation modules. A sibling cross-import is a signal to reconsider the
  boundary, not an absolute prohibition.
- If two parts genuinely share implementation, keep them together or extract one neutral local helper; never duplicate
  components, types, defaults, or class recipes to eliminate an import.
- Preserve runtime behavior, declaration order within each semantic group, public names, defaults, data attributes, and
  styles.
- Update the folder barrel in the same pass and keep exports grouped by their owning module.

`Select` demonstrates trigger, item, content, and root groups. `Dropdown Menu` demonstrates a different valid split:
root/simple parts, content/submenu parts, and item-selection parts. Do not force every compound component into the same
file count.

### Storybook As First Consumer

For a complex compound component with one primary behavior, prefer one representative interactive `Default` story over
many stories that merely repeat internal parts.

Use Button as the reference for explicit simple-component args and control metadata. Use Select and Dropdown Menu for
compound story architecture.

- Build a realistic composition that exercises labels, groups, items, nested parts, important states, and positioning
  when those parts belong to the component.
- Keep root props under their real names. Prefix child-part story args by owner, such as `triggerDisabled`,
  `itemDisabled`, `contentSide`, or `contentAlign`.
- Do not rename real props into invented plurals. Explain story-wide fan-out in a short description such as
  `Applies to all items in this story`.
- Distinguish scope when names overlap, for example `Disables the whole menu` and `Disables only the trigger`.
- Keep deliberate fixed exceptions explicit, such as a destructive logout item, and mention them briefly when a
  story-wide control otherwise suggests uniform behavior.
- Derive defaults from component code or upstream documentation. Do not confuse the story's initial args with the API
  default.
- Do not expect docgen to recover clean controls from generic or wrapped Base UI compound components. TypeScript types
  validate the story but disappear at runtime. Add explicit boolean controls, runtime options, table types, and default
  summaries for the important documented surface.
- Do not add controls for every upstream prop. Controlled state callbacks, refs, arbitrary render props, and advanced
  behavior belong only when the story can explain and demonstrate them honestly.
- Keep story layout minimal. Do not copy decorators or `layout: 'padded'` from another component unless the current
  canvas requires them. Prefer fixed preview geometry over `h-full` workarounds when the component should center
  naturally.
- Import the component under test from its colocated `.` surface. Import supporting public components through the
  intentional `#client` or `#core` barrel when the story is meant to exercise that public surface.
- Keep control descriptions as short UI fragments without terminal punctuation.

### Commit Boundaries

Use Conventional Commits that name the pass. The Dropdown Menu history provides representative boundaries:

```text
feat(dropdown-menu): add base component
style(dropdown-menu): format imported source
fix(dropdown-menu): adapt styles to NUI theme tokens
fix(dropdown-menu): complete RTL adaptation
feat(dropdown-menu): expose typed public API
refactor(dropdown-menu): split into self-contained modules
feat(dropdown-menu): add interactive Storybook story
```

Choose the type that matches the actual change; do not copy these messages mechanically. A pass is ready to commit when
its diff can be reviewed without mentally separating unrelated concerns.

### Verification

- After every pass, run the smallest relevant Biome and TypeScript checks.
- After token or RTL changes, search for unprefixed semantic utilities, unresolved registry markers, and physical motion
  under logical placement.
- After public API or barrel changes, run the TypeScript build and inspect the local/aggregate export path.
- When a port adds runtime imports or changes client/core exports, run the relevant package-boundary and build-output
  checks.
- After decomposition, compare moved declarations and verify that sibling modules do not duplicate or cross-import
  avoidably.
- After Storybook work, verify both the controls table and live interaction. Build Storybook when story architecture,
  preview CSS, Docs, or configuration changes justify the cost.
