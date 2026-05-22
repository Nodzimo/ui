## Theme Character Guardrails

### Neutral Base Direction

Nodzimo's neutral foundation intentionally mixes shadcn Studio base-color directions:

```text
Light neutral base: Olive
Dark neutral base: Stone
```

The reason is optical, not theoretical purity. Olive gives the light theme a warmer, more organic surface that supports
the Living Emerald direction. In dark mode, the same olive direction becomes too heavy and militarized beside green
brand accents. Stone works better as the dark neutral base: warmer than cold neutral, but less muddy and less military
than dark olive.

Do not assume light and dark must use the same base-color family. This follows the same day/night doctrine as the brand
color: the two themes should preserve Nodzimo's identity while using the base that works best in that lighting
condition.

### Light Theme: Living Emerald

Use this language when evaluating light-theme decisions:

```text
alive
emerald
natural
confident
trustworthy
clean
grown
money, but not bank clone
nature, but not swamp
serious, but not military
```

Reject light-theme greens that feel:

- muddy
- military
- gray and tired
- corporate-bank default
- lime candy
- too teal
- too yellow
- too weak to carry links

### Dark Theme: Night Emerald

Use this language when evaluating dark-theme decisions:

```text
neon
Tokyo night
electric
sharp
technical
young
confident
cyber influence
controlled gamer/crypto energy
```

Reject dark-theme greens that feel:

- pale
- dried out
- sickly
- afraid to be neon
- halfway between enterprise and cyber
- unreadable as link text
- too dark to glow
- so loud that secondary and ghost disappear

The dark theme should look like the night version has a reason to exist.

### Practical Component Review Questions

When reviewing a component against this doctrine, ask:

1. What is the primary action?
2. Are secondary actions visually lower than primary?
3. Are structural actions using outline rather than fake-primary styling?
4. Are dense actions using ghost without stealing attention?
5. Does link look like a branded text signal?
6. Does hover reveal interactivity without changing the component's semantic role?
7. Does dark mode feel like Night Emerald, not merely inverted daylight?
8. Did we solve the problem with existing semantic tokens before inventing a new one?

### Current Theme Anchor Values

These values are the current theme anchors. When changing them later, adapt the complete token set coherently rather
than replacing only `primary`.

```text
:root {
	--nui-background: oklch(0.99 0 0);
	--nui-foreground: oklch(0.14 0.006 150);
	--nui-muted: oklch(0.93 0.035 151);
	--nui-muted-foreground: oklch(0.38 0.065 151);
	--nui-border: oklch(0.82 0.045 151);
	--nui-input: oklch(0.82 0.045 151);
	--nui-secondary: oklch(0.87 0.08 151);
	--nui-secondary-foreground: oklch(0.20 0.095 151);
	--nui-primary: oklch(0.55 0.19 151);
	--nui-primary-foreground: oklch(0.98 0.02 151);
}

.dark {
	--nui-background: oklch(0.075 0.012 148);
	--nui-foreground: oklch(0.96 0.018 148);
	--nui-muted: oklch(0.19 0.05 145);
	--nui-muted-foreground: oklch(0.78 0.10 145);
	--nui-border: oklch(0.38 0.075 145);
	--nui-input: oklch(0.30 0.075 145);
	--nui-secondary: oklch(0.25 0.11 145);
	--nui-secondary-foreground: oklch(0.86 0.19 145);
	--nui-primary: oklch(0.82 0.26 145);
	--nui-primary-foreground: oklch(0.08 0.02 145);
}
```

The real theme also includes `card`, `popover`, `accent`, `ring`, `chart-*`, and `sidebar-*`. These must be adapted with
the same doctrine, not left as unrelated defaults.

