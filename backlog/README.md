# Repository Backlog

Backlog convention: 1

This directory is the versioned source of truth for accepted, unresolved work that belongs to this repository and must
remain discoverable across work sessions. It keeps actionable project state close to the code without mixing temporary
work with shipped documentation, durable project rules, or agent procedures.

The backlog is intentionally flat: one logical work item per Markdown file. Read only the contract and the records
needed for the current task. Do not load the entire directory by default.

## Boundaries

Create a backlog item when all of the following are true:

- the work belongs to this repository;
- the problem, opportunity, or dependency is understood well enough to preserve useful context;
- a future action, decision, or verification remains;
- losing the record would create a realistic risk of forgotten work or a permanent temporary workaround.

Do not use the backlog for:

- durable product, architecture, operating, or design-system documentation;
- rules that agents must follow on every task;
- procedures reusable across multiple tasks;
- current implementation notes that will be resolved in the same work session;
- chat transcripts, activity journals, release notes, or completed-work archives;
- vague aspirations without repository-specific context or a plausible next step.

Route durable knowledge to the appropriate documentation, recurring agent guidance to `AGENTS.md`, and reusable
procedures to `.agents/skills`.

## File Structure

Keep records directly under `backlog/` until genuine scale requires another level. Use a short, stable, descriptive
kebab-case filename such as `recheck-tailwind-css-conflict-diagnostics.md`.

Do not encode status, type, priority, dates, or numeric IDs in filenames. These values change independently of the work
item, while the filename should remain a stable link target.

Each record starts with YAML front matter:

```markdown
---
status: ready
type: improvement
created: 2026-07-18
---

# Describe the desired outcome

## Context

Explain the current state, why it matters, and any temporary behavior that must be preserved.

## Outcome

Describe the observable conditions that make the work complete.

## Next step

State the smallest concrete action that moves the item forward.

## References

- Link primary upstream sources and relevant repository files.
```

The title, `Context`, `Outcome`, and `Next step` sections are required. Keep records concise and factual. Add focused
sections such as `Current workaround`, `Resume when`, `Unblock when`, or `Affected repositories` only when they carry
information needed to resume the work correctly.

## Status

Use exactly one status:

- `ready`: the next action can be taken with the information currently available;
- `waiting`: progress depends on an external release, issue, date, or other observable event;
- `blocked`: progress requires a project decision, internal prerequisite, access, or information that is unavailable.

A `waiting` record must include `review_after: YYYY-MM-DD` in its front matter and a `Resume when` section naming the
external trigger. During backlog triage, review waiting records whose date has arrived; either resume the work or set a
new evidence-based review date. The date is a review cue, not a promise that an agent will run automatically.

A `blocked` record must include an `Unblock when` section that identifies the missing decision or prerequisite. Do not
use `blocked` merely because work is difficult or low priority.

There is no `active` status. Current work is represented by the active branch, working tree, issue, or conversation. If
work stops before completion, update the record's context and next step so another session can resume it.

## Type

Use the narrowest applicable type:

- `bug`: incorrect repository behavior that can be fixed here;
- `improvement`: an accepted enhancement to existing behavior or developer experience;
- `research`: investigation needed before a responsible implementation decision;
- `upstream`: progress primarily depends on an external project or integration;
- `maintenance`: repository tooling, dependencies, cleanup, or operational upkeep;
- `idea`: a repository-specific opportunity accepted for later exploration.

Type describes the nature of the work, not its urgency. The backlog does not encode priority by default: priority is a
triage decision and should not become stale metadata. When ordering matters, select the next work explicitly from the
`ready` records.

## Lifecycle

1. Capture one independently resolvable concern in one file.
2. Confirm the context, outcome, next step, status, and type before treating the item as accepted backlog work.
3. Update the existing record when evidence, a workaround, or the next step changes; do not append a chronological
   diary.
4. When the work is complete, move durable conclusions into code, tests, permanent documentation, or a decision record.
5. Delete the backlog file in the same change that completes or deliberately abandons the work. Git history is the audit
   trail; do not create a completed backlog archive.

An item may be deleted as obsolete, duplicated, or intentionally rejected. Use the commit or pull-request description to
preserve a reason when it would not otherwise be obvious.

## Cross-Repository Work

Give shared concerns one canonical owner: the repository where the contract, dependency, or primary fix belongs. Name
other affected repositories in the record instead of copying the same item into each backlog.

Create linked records in multiple repositories only when each repository requires an independently verifiable change.
Each record must describe its own outcome and link to the canonical concern or companion records.

## Maintenance

Keep the convention self-contained so a person or agent can use the backlog from this repository alone. If the same
convention is adopted across the Nodzimo ecosystem, preserve the convention version and update repository copies as one
coordinated change.

Backlog review should remove stale records, validate waiting triggers, repair unclear next steps, and split items that
have grown into multiple independently resolvable concerns. Add automation, indexes, or additional directory levels only
after observed scale or recurring friction justifies them.
