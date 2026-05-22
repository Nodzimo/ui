### Theme-Specific Values

One physical color cannot always perform the same semantic role equally well in light and dark conditions.

This is most visible when an expressive element does not control its own foreground/background pair. A filled primary
button controls the pair:

```text
background = primary
foreground = primary-foreground
```

That pair can be tuned for contrast.

A link, underline, slider track, radio border, focus mark, or selected indicator often controls only one expressive
stroke or text color while sitting on an external surface:

```text
color = primary
surface = current background, card, popover, muted surface, or something else
```

That is the weak spot of a minimal one-value-per-role system. The same physical color may be rich and readable in the
light theme but too dark in the dark theme, or luminous in the dark theme but too loud or thin in the light theme.

There are two valid strategies:

```text
Acceptable strategy:
Use conservative values that work "well enough" across many contexts.
This keeps the system cheaper, more portable, and harder to break.

Quality-control strategy:
Use the same semantic token with theme-specific values.
This costs more, but gives full control in each lighting condition.
```

Nodzimo prefers the second strategy only when the quality gain is real and worth the cost.

The important distinction:

```text
Wrong:
Add case-specific tokens such as linkPrimary, headingPrimary, sliderPrimary, radioPrimary.

Right:
Keep the semantic token stable and assign theme-specific values to that role.
```

Or:

```text
Same semantic token.
Theme-specific value.
```

This is not a workaround. It is what theme variables are for.

The exact names and story are local art direction:

```text
Living Emerald in the light.
Night Emerald in the dark.
```

The underlying reason is practical:

```text
The cost is not paid for self-expression.
The cost is paid for quality control.
Self-expression is the upside of paying that cost.
```

### Day And Night Are Not A Technical Toggle

The important Nodzimo discovery is that light and dark themes should not be treated as a reluctant technical duty.

The weak approach is:

```text
Pick one brand color.
Torture its lightness until it barely works on white.
Torture it again until it barely works on black.
Call that theming.
```

Nodzimo rejects that.

Light and dark are two self-contained expressions of the same brand. They share the green DNA, but they do not need to
pretend they are the same emotional scene.

```text
Light theme: Living Emerald
Dark theme: Night Emerald
```

The light theme is the brand in daylight:

- emerald
- natural
- alive
- confident
- trustworthy
- mature
- growth-oriented
- money without looking like a bank clone
- nature without looking muddy or military
- serious without becoming dead

The dark theme is the other side of the moon:

- Tokyo night
- neon signage
- electric emerald
- electronics
- cyberpunk influence
- gamer and crypto energy, but controlled
- young, sharp, technical, and awake
- not timid, not half-neon, not a sickly compromise

This is intentional duality. The dark theme is not the light theme with a black coat. It is the brand under night
lighting. When the sun goes down, the emerald does not get dragged through mud until it technically passes contrast.
It turns into a luminous signal.

The design should feel like:

```text
Day: emerald life, nature, confidence.
Night: neon energy cutting through the dark.
```

Do not be afraid of this contrast. The mistake would be doing it halfway.

### Brand Green Direction

The light-theme brand green emerged around:

```text
oklch(0.55 0.19 151)
```

This is the light-theme primary color. Its formal name is `Living Emerald`; its internal Nodzimo nickname is
`Liverald`.

`Liverald` means living, blooming emerald: green as nature, growth, and energy, not green as a dead corporate swatch.
Use this name when discussing the light-theme brand color so future work remembers that the color is supposed to feel
alive.

It is not random green. It sits in the intended zone:

- not lime
- not teal
- not swamp
- not military
- not dead enterprise green
- not childish neon
- close enough to nature to feel alive
- saturated enough to have confidence
- dark enough to carry white text on primary buttons
- rich enough to carry links on a light surface

The dark-theme brand green emerged around:

```text
oklch(0.82 0.26 145)
```

This is the dark-theme primary color. Its formal name is `Night Emerald`; its internal Nodzimo nickname is `Nimerald`.

`Nimerald` means night emerald: the same living green impulse under city-night lighting. It is intentionally not a timid
dark-mode emerald. It is neon. It is allowed to use dark text on the primary surface because that is how high-luminance
neon surfaces work.

Use this paired brand line:

```text
Living Emerald
The brand in daylight.

Night Emerald
The brand after dark.
```

And the design mantra:

```text
In the day, it feels alive.
At night, it glows.
```

This is the current primary pairing concept:

```text
:root {
	--nui-primary: oklch(0.55 0.19 151);
	--nui-primary-foreground: oklch(0.98 0.02 151);
}

.dark {
	--nui-primary: oklch(0.82 0.26 145);
	--nui-primary-foreground: oklch(0.08 0.02 145);
}
```

The inversion is not an accident:

```text
Light primary: white text on Living Emerald / Liverald.
Dark primary: near-black text on Night Emerald / Nimerald.
```

This is one brand with two lighting conditions.

