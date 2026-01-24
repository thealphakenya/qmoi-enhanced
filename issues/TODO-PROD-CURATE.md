Title: TODO-PROD-CURATE

Summary:
Manually review ambiguous TODO_PROD occurrences left by the automated batch sweep and decide per-occurrence whether to replace with 'REVIEWED' or to perform a context-specific fix.

Objectives:

- Inspect `TODO_PROD_BATCH_PENDING.md` and curated list of ambiguous occurrences.
- For each ambiguous occurrence, determine if it's safe to convert, needs rewording, or should remain for product decision.
- Create a PR per group of edits categorized by area (links, marketing copy, reports).

Acceptance Criteria:

- Ambiguous list entries are resolved with a commit/PR or moved to `issues/` with an owner and timeline.
- No further accidental changes to external link titles in `link_report.md`.

Notes:

- This task is well-suited for parallel teams (docs, legal, product) to triage and fix.
