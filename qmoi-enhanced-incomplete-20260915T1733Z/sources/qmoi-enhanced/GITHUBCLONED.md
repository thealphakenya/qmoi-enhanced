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
- authenticate both live repositories with the same owner-scoped GitHub credential, supplied only through `GH_TOKEN`, `GITHUB_TOKEN`, `MY_CUSTOM_TOKEN`, or `gh auth token`
- record clone/fetch/audit/sync commands without recording credential values

## Alpha-Q-ai Sync Setup

Alpha-Q-ai is synchronized with qmoi-enhanced through the explicit contract in
`SYNC.md` and `MERGE.md`. The setup sequence is:

1. Authenticate once with the owner-scoped credential and verify access to both repositories.
2. Fetch all refs without mutating either working tree.
3. Capture branches, commits, authors, timestamps, tracked paths, symlinks, and Markdown provenance for both repositories.
4. Classify each path as `QE`, `AQ`, `BOTH`, `HISTORICAL`, or `CONFLICT`.
5. Publish synchronization changes to `autosync-backup` first and validate the result.
6. Create a reviewable merge or pull request before updating `main`.
7. Run the complete validation and link gates, then materialize the merged workspace only after the audit is complete.

Credentials are never copied into Alpha-Q-ai, `qmoi-enhanced`, history
snapshots, `MERGE.md`, `ALLMDFILESREFS.md`, `oe2.txt`, or tracker artifacts.

## Notes
This file is an operational contract for the self-healing autonomous agent. It must remain aligned with the repository audit, branch-synchronization strategy, and archived history inventory produced by QMOI automation.
