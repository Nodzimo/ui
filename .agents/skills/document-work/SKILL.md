---
name: document-work
description: Document completed session work and reconcile durable repository knowledge before handoff or clearing the chat. Use when asked to document the work done in a session or preserve its important decisions.
---

# Document Work

## Outcome

Preserve the useful results of the requested session in repository documentation so a new reader can understand the
current contract, its reasons, supporting evidence, and remaining work without the conversation. Complete the writing
and the coverage review in one invocation; do not wait for a separate request to check for omissions.

This skill is portable. Discover the current repository's instructions, documentation owners, language, naming, and
verification tools. Do not assume a stack, a `docs/` layout, a particular Git host, another checkout, or a global tool.

## Scope And Authority

- For an analysis-only request, report findings without edits. A request to document the session authorizes relevant
  local documentation edits and their checks; follow any narrower user constraints.
- Cover the requested session, including accepted work already committed. The current diff is evidence, not the full
  inventory. Do not treat the entire branch or Git history as session work without establishing that boundary.
- Preserve unrelated changes. Do not change implementation, create commits, publish, or edit another repository unless
  authorized. Do not rewrite general agent policy as an incidental documentation cleanup.
- Use available conversation context, summaries, affected files, and targeted history together. When important context
  is missing, identify the specific gap rather than reconstructing a decision or claiming exhaustive coverage.

## Workflow

### 1. Establish The Inventory

Read the repository instructions and relevant documentation policy and indexes. Reuse material already read in this
session. Inspect the current changes and the implemented state; use targeted history to recover relevant committed
work when needed.

Build a temporary coverage inventory of meaningful topics: implemented behavior and public contracts, accepted
decisions and their reasons, confirmed incident causes, consequential alternatives, verification evidence, and open
questions. For each topic, track its evidence, owning document, and disposition: update, create, already covered,
exclude, or unresolved. Keep this working inventory out of permanent documentation unless it is itself useful there.

Distinguish implemented decisions from proposals, superseded approaches, unverified explanations, and deferred work.
Preserve unresolved consequential questions in the repository's existing tracking mechanism when in scope, or report
them explicitly at handoff; do not present them as accepted guidance.

### 2. Select Durable Knowledge

Include information that helps a future reader use, maintain, verify, or change the project correctly:

- the current behavior, constraints, ownership, and supported workflow;
- why the accepted decision fits those constraints;
- confirmed causes and prevention mechanisms for meaningful incidents;
- rejected alternatives when their tradeoffs prevent repeating a plausible mistake;
- reproducible checks, meaningful results, limitations, and relevant primary sources.

Exclude routine investigation logs, fruitless searches, conversational admonitions, personal details, private consumer
identities, machine-specific paths, and transient dependency reviews that produced no adopted decision. Retain dates,
versions, timelines, or negative results only when they materially explain a decision, failure, compatibility boundary,
or reproducible evidence. Use portable repository-relative paths and neutral examples.

Do not create prose for information already adequately represented by discoverable code or existing documentation.
An empty useful delta is a valid result; explain it briefly instead of inventing a document.

### 3. Update The Owning Documents

Map each retained topic to the existing documentation structure. Prefer the smallest existing owner. Create a focused
document for a distinct decision or incident when appending it would obscure the existing topic. Keep the structure
flat and navigable within local conventions; do not impose a new hierarchy or a universal template.

Give each fact one authoritative home. Link from other relevant surfaces instead of repeating its explanation. Write
compact, concrete prose with enough reasoning to guide future decisions; avoid both redundant narrative and unexplained
conclusions. Add navigation at the entrypoints readers actually use, following existing routing conventions.

Ground statements in the current implementation and available evidence. Inspect the primary sources used to justify
recommendations, including relevant discussion outcomes, later corrections, and linked fixes. Keep documented behavior,
local verification, and inference distinct. Preserve useful evidence without copying raw logs or claiming checks that
were not run. If a source cannot be inspected, qualify the claim and record a consequential uncertainty at handoff.

Edit the source of generated documentation, following local policy. Do not hand-edit generated output or create parallel
copies of the same contract. Update obsolete guidance wherever the affected concept is referenced, using targeted
searches for old names, commands, paths, assumptions, and prior workarounds.

### 4. Verify In Both Directions

Perform a separate review after writing:

- **Work to docs:** revisit the session inventory. Every retained topic has an accurate, discoverable owner; every
  exclusion has a defensible reason; important unresolved questions remain visible.
- **Docs to reality:** compare changed guidance with the implementation, configuration, public API, and actual check
  results. Search related documents for contradictions and stale references. Confirm that the text distinguishes the
  current state from historical symptoms and proposed work.
- **Navigation and hygiene:** check local links and anchors, indexes, renamed/deleted paths, duplicated explanations,
  private identifiers, and unnecessary chronology across the affected documentation surface.

Use existing documentation checks or available tools for mechanical validation. Run only checks relevant to the edits;
do not rerun a broad implementation build solely because prose changed. Separate checks performed now from prior
verification evidence. If a mechanical check is unavailable, inspect the affected references directly and state the
limit. Correct findings and repeat the affected checks before handoff.

## Completion And Report

Finish when useful session results are covered, updated guidance matches the current state, affected navigation is
valid, obsolete contradictions are removed, and consequential unresolved items are explicit.

Report briefly:

- what knowledge was preserved and where;
- what consistency and navigation checks were performed;
- any remaining gap or unresolved decision.

State that the chat can be cleared only when the coverage review found no remaining dependency on the available
conversation for important project knowledge. Bound that conclusion to the reviewed session and disclose missing
context. Do not promise perfect recall, universal correctness, or completeness beyond what was inspected.
