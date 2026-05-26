---
name: doctrine-writer
description: Write, revise, reorganize, or review Nodzimo UI design-system doctrine. Use when working on docs/design-system-doctrine chapters, Storybook doctrine MDX wrappers, doctrine navigation/order, human-readable design guidance, design-system philosophy, token semantics, component hierarchy, theme principles, product-facing design documentation, or evidence/reference chapters.
---

# Doctrine Writer

## Purpose

Maintain the Nodzimo UI doctrine as a product artifact, not a private note and not an API reference.

The doctrine should read like a practical design-system guide for people who need to make decisions: clear enough for a
beginner, useful enough for a professional, and specific enough to prevent weak architecture or visual guesswork.

## First Read

Before writing or editing doctrine, read:

1. `docs/design-system-doctrine/README.md`
2. The chapters directly related to the request
3. Adjacent chapters when the requested change affects ordering, terminology, tokens, components, hierarchy, theme
   philosophy, references, or Storybook presentation

Use the current doctrine as the strongest style reference. Do not copy its content into this skill.

Especially study these local patterns when relevant:

- `button-action-hierarchy.md` for detailed human explanation, examples, comparisons, and decision frameworks
- `token-role-semantics.md` for role semantics, confusing pairs, scenarios, and practical mappings
- `core-position.md` for the central design-system stance
- `references-and-evidence.md` when adding claims that need outside support

## Writing Standard

Write doctrine, not documentation filler.

The desired voice:

- human, practical, direct
- plain language over academic language
- short sentences when stating rules
- vivid but controlled mental models
- examples from real UI work near any metaphor
- strong distinctions between close concepts
- explicit "what it is / what it is not"
- useful repetition only when it teaches a hard distinction

Avoid:

- generic documentation voice
- academic or corporate language
- API-reference structure as the main teaching device
- tables as a substitute for explanation
- inflated prose that exists only to sound important
- exact color values or temporary implementation details unless the user explicitly asks for project-specific art
  direction
- changing source code, CSS values, component APIs, or token values unless the user explicitly asks for implementation

The doctrine should answer:

```text
What is this?
What job does it do?
What question does it answer?
Where should it be used?
Where should it not be used?
What is it often confused with?
How do I decide in a real interface?
```

## Conceptual Level

Prefer durable principles over volatile project values.

Good doctrine:

```text
primary = main action surface
accent = interaction feedback
border = general structure
input = control boundary
```

Risky doctrine:

```text
primary = this exact green
border = this exact OKLCH value
```

Exact values may belong in art-direction notes or implementation docs. Core doctrine should explain the foundations,
roles, hierarchy, and decision rules that survive palette changes.

Useful distinctions to preserve:

- role meaning vs physical value
- design-system principle vs current implementation detail
- component behavior vs token semantics
- theme authoring vs component authoring
- persistent action mass vs temporary interaction feedback
- passive support vs active response
- general structure vs control structure
- surface ownership vs text placed on an external surface
- framework-agnostic UI-kit provider vs app/framework provider
- RTL inline direction behavior vs raw icon asset direction

## Structure Patterns

Pick the smallest structure that teaches the topic.

For simple topics, use:

1. Core rule
2. Short explanation
3. Practical examples
4. One decision question

For complex or commonly confused topics, use:

1. Mental model
2. Role definitions
3. What to do
4. What not to do
5. Confusing pairs
6. Practical UI scenarios
7. Decision questions
8. Quick reference

Do not add every section by habit. Add the sections the topic needs.

Tables are allowed as summaries after the concept is explained. Do not lead with a table when the reader first needs a
mental model.

## Teaching Devices

Use these devices deliberately:

- `text` code blocks for crisp mental models and rules
- "Wrong / Right" examples for decision correction
- "The question:" before a decision test
- nearby UI examples after any real-world metaphor
- scenario walkthroughs for multi-token or multi-component decisions
- "Common Confusions" for close neighbors
- short final references only after the reader has learned the concept

Good pattern:

```text
muted sits quietly.
accent answers back.
```

Then immediately tie it to UI:

```text
Empty-state panel: muted.
Hovered command item: accent.
```

Metaphors are useful only when they clarify. Do not let them drift away from frontend/design-system practice.

## Length Judgment

Do not optimize for shortness when the topic is genuinely difficult. Do not optimize for length when the topic is
straightforward.

Use repetition when:

- a distinction is subtle
- the same confusion appears in multiple UI scenarios
- the reader must internalize a rule before applying it

Cut repetition when:

- it restates an obvious point
- it does not add a new scenario, decision test, or contrast
- it sounds like generated authority rather than useful guidance

The doctrine can be detailed. It must never become sludge.

## Evidence And References

When adding external claims, prefer primary design-system sources and stable docs.

Use references to support the doctrine, not to outsource the doctrine. Nodzimo can use shadcn, Fluent, Carbon, Material,
MUI, Apple, or other systems as evidence, but the chapter should still explain the local decision clearly.

If adding or changing reference material:

- update `docs/design-system-doctrine/references-and-evidence.md` when the evidence trail changes
- summarize what the reference supports
- avoid long quotations
- keep the doctrine focused on the practical decision being made

## File Workflow

Source-of-truth doctrine chapters live in:

```text
docs/design-system-doctrine/*.md
```

Storybook mirrors chapters with MDX wrappers under:

```text
.storybook/showcase/doctrine/*.mdx
```

When adding a chapter:

1. Add `docs/design-system-doctrine/<chapter-name>.md`
2. Add `.storybook/showcase/doctrine/<chapter-name>.mdx`
3. Update `docs/design-system-doctrine/README.md`
4. Update `.storybook/showcase/doctrine.mdx`
5. Update `.storybook/preview.tsx` `storySort.order` if the sidebar order changes

Use the existing MDX wrapper pattern. Keep the concrete wrapper in the generated `.mdx` file, not as executable code
inside this skill:

```text
import {Markdown, Meta} from '@storybook/addon-docs/blocks'
import doctrine from '../../../docs/design-system-doctrine/<chapter-name>.md?raw'

<Meta title='Design System/Doctrine/<Chapter Title>'/>

<Markdown>{doctrine}</Markdown>
```

When renaming or reordering chapters, check all navigation surfaces:

- GitHub-readable README chapter list
- Storybook doctrine overview links
- Storybook MDX wrapper title
- Storybook `storySort.order`

## Review Checklist

Before finishing, verify:

- The chapter fits the existing doctrine voice
- The text teaches decisions, not just facts
- Complex distinctions have examples
- Simple points are not over-explained
- Metaphors are paired with practical UI examples
- Exact project values are avoided unless intentionally requested
- Existing doctrine terminology remains consistent
- Provider guidance distinguishes UI-kit-owned framework-agnostic providers from app-owned providers when relevant
- RTL guidance distinguishes logical layout, bidi text isolation, and usage-site icon flipping when relevant
- Storybook and Markdown navigation are synchronized
- No implementation files were changed unless requested
