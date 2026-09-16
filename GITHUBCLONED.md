# GITHUBCLONED.md - GitHub Clone and History Inventory

## Purpose
This file records the canonical inventory of cloned repository state, snapshot coverage, history awareness, and repository provenance for QMOI automation. It is used by the autonomous agent to ensure all tracked repos, branches, snapshots, and histories are represented in the operational and validation pipeline.

## Tracked Repositories
- thealphakenya/qmoi-enhanced
- thealphakenya/Alpha-Q-ai
- historical snapshot: qmoi-enhanced-history-14
- local archive snapshots under qmoi-enhanced-history-14 and related backup directories

## Required Inventory Scope
- all reachable refs and branches
- all tracked files and directories
- all Markdown inventory docs
- all API, endpoint, route, port, and workflow docs
- all historical snapshots and clone derivatives
- all automatic sync and recovery artifacts

## Required Branch Coverage
- main
- autosync-backup
- origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp
- any additional reachable refs retained in the repo metadata

## Required History Coverage
- current repo state
- repo backup state
- archived snapshot state
- all historical branches and prior versions
- all file inventories and audited merge records

## Operational Requirements
- treat clone and archive state as read-only evidence
- preserve all recovered snapshots for audit
- keep API, route, endpoint, and port docs synchronized with actual inventory sets
- include historical repo coverage when validating automation, linking, or branch sync

## Notes
This file is an operational contract for the self-healing autonomous agent. It must remain aligned with the repository audit, branch-synchronization strategy, and archived history inventory produced by QMOI automation.

## Autonomous Clone and Reconciliation Cycle

QMOI treats cloned repositories and historical directories as evidence, not as
an implicit merge source. Each cycle records the remote URL, default branch,
fetch timestamp, source ref, commit SHA, tracked-file count, Markdown count,
dependency-manifest count, and working-tree status for both `qmoi-enhanced` and
`Alpha-Q-ai` when access is available.

The cycle then compares live trees, reachable refs, and preserved histories by
path and content hash. It classifies additions, updates, deletions, and
conflicts before applying changes. Missing or inaccessible repository history is
reported as a blocker; it is never silently represented as complete coverage.

Autoclone updates are idempotent and restartable. A failed fetch, build,
workflow, Vercel deployment, or dependency audit retains its logs and resumes
from the last checkpoint. Publication occurs through a dedicated branch and PR,
with default-branch checks re-queried after merge. This keeps clone, GitHub Dev,
AutoDev, merge, model-card, and validation evidence synchronized without
claiming that an unavailable remote was fully merged.
