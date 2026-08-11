---
status: ready
---

# Align Biome arrow-parentheses documentation

## Context

Nodzimo UI and Nodzimo Web intentionally rely on Biome's default `arrowParentheses: "always"` behavior, so their
`biome.json` files correctly omit the explicit default. Both Biome policy documents currently describe the convention as
`as-needed arrow parentheses`, which contradicts the configured formatter behavior and the intended standard that
arrow-function parameters always use parentheses.

## Outcome

- The Nodzimo UI and Nodzimo Web Biome policies state that arrow-function parameters always use parentheses.
- The policies explain that `arrowParentheses` remains omitted because `"always"` is the Biome default.
- No project adds an explicit formatter option solely to restate that default.
- No contradictory `as-needed arrow parentheses` guidance remains in either repository documentation.

## Next step

Update the Biome policy sentence in both repositories, then search their maintained documentation for contradictory
arrow-parentheses guidance.

## References

- [Nodzimo UI Biome policy](../docs/agent-operating-charter/biome-policy.md)
- [Nodzimo UI Biome configuration](../biome.json)
- [Nodzimo Web Biome policy](../../web/docs/agent-operating-charter/biome-policy.md)
- [Nodzimo Web Biome configuration](../../web/biome.json)
