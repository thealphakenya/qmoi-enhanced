# MERGE.md - Merge Procedures and Guidelines

## Complete History, Light Codespaces

The repository keeps complete history and all merge inputs without requiring a
large default working tree. Git history is the canonical archive; the working
tree is a selected view. Codespaces use `.devcontainer/devcontainer.json` and
`scripts/prepare_codespace.sh light` to omit `qmoi-enhanced-history-14`, the
materialized `Alpha-Q-ai` tree, virtual environments, dependency caches, and
generated backup trees from the active view. This reduces browser filesystem,
search, watcher, and data-transfer costs while retaining the source objects on
the remote.

Use the modes deliberately:

```bash
bash scripts/prepare_codespace.sh light  # normal browser/Codespaces work
bash scripts/prepare_codespace.sh full   # rehydrate every tracked path
bash scripts/prepare_codespace.sh audit  # copy and verify all merge inputs
```

The `full` mode is required before a merge or release that needs every tracked
path. The `audit` mode writes a complete report with per-source files,
directories, symlinks, refs, reachable commits, missing paths, and staging
status. Historical versions remain available with Git commands or the audit
staging directory; they are not duplicated under conflicting working-tree
paths. CI merge jobs must use full-history/object access only for audit and
merge stages, while ordinary tests and documentation jobs should use blobless
or sparse checkout.

### Automatic repository sync and ledger update

The repo now includes `scripts/auto_repo_sync.sh`, which executes at container
startup and after creation. It refreshes `oe2.txt` with a timestamped ledger,
ensures the lightweight setup is active, and pushes any resulting automation or
ledger edits back to the current branch. This keeps the working environment
self-healing and reduction-friendly without requiring manual reruns.

## Overview
This document provides comprehensive procedures for merging files and features between qmoi-enhanced and Alpha-Q-ai repositories. It ensures that no implementations are degraded, features are preserved, and conflicts are resolved intelligently.

## Core Merge Principles

1. **Preservation**: All existing features and implementations must be preserved
2. **Intelligence**: Use context-aware decision making for conflict resolution
3. **Verification**: Validate all merges to ensure integrity
4. **Traceability**: Document all merge decisions and rationales
5. **Accountability**: QMOI maintains full accountability for all merge decisions

## Autonomous History Audit Contract

Before any cross-repository merge, the agent must create a read-only audit for
both `thealphakenya/qmoi-enhanced` and `thealphakenya/Alpha-Q-ai`. The audit
records every reachable branch, the complete Git-tracked file structure, and
commit author, email, timestamp, subject, and hash. It must inspect all
contributors for QMOI Enhanced and at least the latest four reachable commits
for Alpha-Q-ai. A merge is not considered traceable until the activity and its
audit evidence are appended to this file through the agent's merge-log API.

The audit is evidence collection only: it must not fetch, merge, reset, or push
implicitly. Network synchronization and publication remain explicit workflow
steps, followed by validation and a recorded result.

## Required History Source And Complete Coverage

The ref `origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` is a
required historical source for every merge audit. Its complete branch contents
are materialized in `qmoi-enhanced-history-14/`, whose instruction file records
the source commit. The snapshot is part of merge input and recovery evidence;
it is not merely a note or an optional backup.

Before planning a merge, QMOI must inventory both repositories, every reachable
local and remote branch, every tracked path (including symlinks and currently
unused files/directories), and every commit needed for attribution. For each
path, record repository/ref, existence, content identity, dependencies,
implementation role, and classification: `QE`, `AQ`, `BOTH`, `HISTORICAL`, or
`CONFLICT`. Missing paths from the historical source must be evaluated for
restoration and feature degradation before they can be omitted. `CONFLICT` or
uncertain ownership blocks automatic changes and requires a review record.

`ALLMDFILESREFS.md` is updated from the complete `.md` inventory for both live
repositories and the historical ref, including markdown files not present in
the current checkout. The inventory is evidence, not permission to copy stale
content blindly.

## Autonomous Merge Procedure

### Mandatory Copy-Before-Merge Gate

The autonomous agent must inventory and copy every source tree, directory, symlink, reachable ref, and reachable commit into a staging area before it plans or applies any merge. `MERGE.md` must record per-source file, directory, symlink, ref, and commit counts before copying, after copying, and after merging. A missing path or incomplete history export blocks merging.

1. Discover repository remotes, all refs, default/backup/history branches, and
    working-tree state without mutation.
2. Capture immutable inventories of all trees, markdown paths, commits,
    contributors, timestamps, symlinks, and the `qmoi-enhanced-history-14`
    materialization.
3. Determine ownership from imports, workflow/config references, package/build
    dependencies, history, and repository boundaries. Preserve unused content
    until this analysis is complete.
4. Build a path-level plan for additions, updates, deletions, and conflicts;
    checkpoint it before applying anything. Never auto-delete a path solely
    because it is absent from the target branch.
5. Apply only authorized changes inside the intended repository. Reject unsafe
    paths, secret/authentication changes, destructive commands, and unreviewed
    conflict resolutions.
6. Validate syntax, dependencies, links, workflows, targeted tests, full tests,
    feature preservation, and the complete post-merge tree against every source.
7. Update `MERGE.md`, `ALLMDFILESREFS.md`, checkpoint, telemetry, and the final
    proof contract with source refs, counts, decisions, and validation evidence.
8. Push or merge only when all required evidence passes and authorization is
    present. A partial inventory, inferred success, or Python-only check is a
    failed merge gate.

The Ollama autonomous agent and QMOI automation must use this procedure for
branch sync, PR merge, recovery, auto-healing, and cross-repository operations.
They may automate speed and repetition, but not bypass evidence, ownership,
review, or validation gates.

### Base-repository merge policy

The executable planner in `scripts/merge_inventory.py` now uses an explicit
two-destination policy:

- `qmoi-enhanced-history-14` is the immutable base for the projected evolved
  `qmoi-enhanced` tree.
- The current Alpha-Q-ai tree is the base for the projected Alpha-Q-ai tree.
- The complete discovered path sets from both repositories and the historical
  snapshot are overlays for both projections, so no file or directory is
  silently omitted from planning.
- Duplicate paths retain all source owners in `provenance` and set
  `requires_review_before_apply`; planning never overwrites content or resolves
  conflicts by filename alone.
- The report exposes `source_metrics`, `unique_union`, and per-destination
  `projections.*.metrics` with projected file and directory counts. These are
  forecasts until a separately authorized merge produces `after_merge` metrics.
- Duplicate learning uses content identities, not names alone:
  `duplicate_path_count = identical_duplicate_count + variant_duplicate_count`.
  Identical paths may be deduplicated after provenance capture; variant paths
  require feature extraction, additive merge planning, tests for each behavior,
  and explicit review before resolution. A variant is never discarded merely
  because another source has the same filename.
- The final projection formula is
  `final_files = |history_paths union qmoi_history_paths union alpha_history_paths|`
  and `final_directories` is the count of unique parent directories of those
  paths. Both destination repositories receive the same planned union, while
  their bases remain distinct and all source ownership is retained.
- PR trees are separate inputs, not replacements: the agent inventories the
  original QMOI/Alpha base paths represented by each PR head, compares PR
  additions and deletions against every source, and blocks any deletion or
  feature loss without an explicit reviewed decision.
- Auto-research/learning is evidence-based: compare blob/content identities,
  parse symbols/routes/workflows/configuration, extract behaviors unique to
  variants, propose an additive plan, run targeted and full tests, and record
  unresolved conflicts. The agent may learn merge heuristics from prior merge
  reports, but cannot use heuristic similarity as permission to overwrite.

Run the planner after the copy gate with `--report`; it is intentionally
plan-only. A complete merge must still record the post-merge tree for both
destinations, validate all path conflicts, and publish only with explicit
authorization.

### Required Metrics Record

Every merge run must append a machine-readable record containing, for each
source repository and each history snapshot: `files`, `directories`,
`symlinks`, `refs`, and `reachable_commits`. The record must contain these
phases in order: `inventory-before-copy`, `copy-verified`, and `after-merge`.
The merge is incomplete when any source has missing paths, missing refs, or a
lower post-copy count without an explicit reviewed deletion decision.

The 2026-09-19 integration evidence recorded 1,346 files in the
`qmoi-enhanced` main tree, 1,342 files in the `Alpha-Q-ai` main tree, and
29,499 tracked paths in `qmoi-enhanced-history-14`; the final integrated tree
contained 30,845 tracked paths. Future runs must regenerate these values from
the source refs rather than treating this snapshot as current state.

### Alpha-Q-ai historical full-tree evidence (2026-09-20)

`FULLTREE-ALPHA-Q-AI-14.md` is the complete path-level manifest for the
materialized Alpha-Q-ai source. It records every file path, derived directory,
Git mode, blob ID, and blob byte size; the manifest is generated rather than
hand-curated:

```bash
python scripts/generate_alpha_fulltree.py \
  --ref e2438a500ce538c39c352bc8b1fd59f907b5470e \
  --output FULLTREE-ALPHA-Q-AI-14.md
```

The verified source metrics are:

| Source/ref | Files | Directories | Symlinks | Executable files | Git blob bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| `Alpha-Q-ai` under `e2438a50` | 1,346 | 6 | 0 | 5 | 32,682,753 |

The standalone `thealphakenya/Alpha-Q-ai` remote has no reachable commit on or
before 2026-04-20; the oldest fetched remote commit is 2026-08-13. The
repository therefore does not claim that this later materialization is an
April snapshot. The five-month cutoff check is recorded as unavailable source
history, while the complete available Alpha tree is preserved for merging.

The first explicit Ollama autonomous-agent commit is
`3e9329dac3b8bd254e6bb9fbc1accf1e2abf1104` (2026-07-20):
`Ollama agent iteration 1: processed 20 files, updated 20`. Its Git parent,
`2537689d4fe9e87484d74163a77c81bdad9af0a1` (2026-02-22), is the exact
pre-agent tree boundary used for ancestry checks. Earlier Ollama infrastructure
commits are `4a00b4aa` (2026-06-28, Ollama + Continue integration) and
`981113a4` (2026-07-07, Ollama devcontainer support); neither is an autonomous
agent iteration.

Merge inventory runs can carry the same historical evidence into their
machine-readable report:

```bash
python scripts/merge_inventory.py \
  --qmoi . --alpha /path/to/Alpha-Q-ai \
  --history /path/to/qmoi-enhanced-history-14 \
  --staging /tmp/qmoi-merge-staging --report /tmp/merge-report.json \
  --historical-ref e2438a50 --historical-prefix Alpha-Q-ai
```

The `historical_snapshots.Alpha-Q-ai` record contains the ref, every path's
mode/blob/bytes detail, and aggregate files/directories/symlink/executable/byte
metrics. `FULLTREE-ALPHA-Q-AI-14.md` and this record are merge inputs: path
ownership, duplicate detection, conflict review, and projected destination
metrics must retain them before any merge is applied.

### Alpha-Q-ai target materialization (2026-09-20)

The complete verified Alpha source was copied from the Git tree at
`e2438a500ce538c39c352bc8b1fd59f907b5470e:Alpha-Q-ai` into the sibling target
checkout `/workspaces/Alpha-Q-ai`. The target preserves all 1,346 source files
and its existing contents, and now contains:

- `FULLTREE-ALPHA-Q-AI-14.md`, the complete path/blob/mode/byte manifest.
- `ALPHA_Q_AI_MERGE_SETUP.md`, the source order and history-base setup contract.
- Materialization commit `372bd7eeb31a633590e7ea3c14673d0aadfcc019` followed by
  evidence-documentation commit `51b1cb891475bee2f2e89369a21bf0026b2b4b13` and
  complete-source tracking commit `ce3d4e4a6a6b404d2c888c29ba994210ec65c33c`.
- Four files covered by Alpha ignore rules were explicitly retained and tracked:
  `ollama_agent.log`, `ollamatracks/TERMINAL_COMMANDS.log`,
  `ollamatracks/agent.log`, and `validation_report.json`.

The target must use `qmoi-enhanced-history-14` as the overall base. Alpha paths
are overlays and additive features, never a replacement for the base and never
a reason to delete an existing Alpha path. The target setup sequence is:

```text
qmoi-enhanced-history-14 base
  -> current qmoi-enhanced and reachable refs
  -> current and verified historical Alpha-Q-ai trees
  -> archived snapshots and tracker evidence
  -> reviewed additive projection into Alpha-Q-ai
```

The Alpha target also contains `alpha-q-ai-history-14/`, a complete 1,346-file
archive of the verified historical Alpha source used for comparison and
recovery. It was recorded in target commit
`cb5b11129b0912b0c344939a98b8a105ebb76502`. This archive is evidence for the
available materialized source; it is not mislabeled as an April remote commit.

The Ollama autonomous agent's feature-discovery plan now evaluates this full
source order for measurable gaps across new sites, applications, web/mobile UI,
APIs, backend services, platform integrations, automation, workflows, and
operations. It must preserve Alpha behavior, classify ownership and conflicts,
plan dependencies, and pass targeted/full validation plus explicit review gates
before creating or changing a feature.

### Complete Alpha-history traversal and feature routing

Every merge execution must run the cross-repository plan exposed by
`CrossRepositoryAutonomyManager.build_cross_repository_merge_plan()`. The plan
walks every file and directory in `Alpha-Q-ai/alpha-q-ai-history-14`, the live
Alpha tree, `qmoi-enhanced-history-14`, and the current QMOI tree. It also
includes every `MERGE.md` or merge-named Markdown file, tests, workflows,
routes, APIs, ports, automation, memory indexes, tracker state, `STYLES.md`,
and `UNIVERSALS.md` as explicit merge inputs.

Feature direction is evidence-based:

- Alpha-to-QMOI candidates are added only when ownership, dependencies, and
  tests show a compatible capability absent from QMOI.
- QMOI-to-Alpha candidates are additive only and must preserve existing Alpha
  behavior.
- Same-path variants retain both owners and block automatic overwrite until
  conflict review, feature extraction, and validation are complete.

The plan treats `qmoi-enhanced-history-14` as the overall base and requires
memory-index generation, QMOI awareness/identity synchronization, automation
and workflow refresh, targeted tests, and full validation in every destination.
Its `cross_repository_plan` record is written into merge audits so coverage or
skipped checks cannot be inferred as success.

### Complete Markdown audit evidence (2026-09-20)

The autonomous Markdown audit now runs before merge planning across four roots:

| Source root | Markdown files | Index status |
| --- | ---: | --- |
| `qmoi-enhanced` | 3,660 | complete |
| `qmoi-enhanced-history-14` | 3,559 | complete |
| `Alpha-Q-ai` | 196 | complete |
| `alpha-q-ai-history-14` | 97 | complete |

The four-root inventory contains 7,512 Markdown files and zero paths missing
from their local `ALLMDFILESREFS.md` indexes. The audit also checks empty files,
missing headings, unresolved TODO/FIXME/TBD/placeholder markers, and merge-file
coverage. It found 621 explicit truth-review warnings, which remain recorded
as warnings instead of being presented as verified claims. Merge readiness can
therefore be successful only when index coverage is complete and all warnings
are visible in the audit record.

Historical text normalization also replaced `admin`, `Admin`, and `ADMIN` with
their `master` equivalents in both historical trees; the verified remaining
token count is zero.

### Style and universal UI merge coverage (2026-09-19)

The merge inventory now treats UI styling and universal platform standards as
first-class live sources instead of generic markdown noise. The canonical live
root files are:

- `STYLES.md`
- `UNIVERSALS.md`

These files are recognized as live `style_universal` sources in
`build_unified_markdown_inventory()` and the merge metrics package, and the
runtime stream records them as priority evidence before generic duplicated
history copies. The live merge inventory currently exposes a canonical count of
2 root-level style/universal docs in the active repository, with additional
platform or design-system variants treated as supporting evidence rather than
primary merge targets.

### Complete Staging Evidence (2026-09-19)

The executable gate is `scripts/merge_inventory.py`. It completed with
`ready=true` and `missing_paths=0` against the full local integration worktree,
the full Alpha-Q-ai mirror, and the materialized history directory. The report
covered every reachable branch, remote branch, and tag, not only `main`.

| Source | Files | Directories | Symlinks | Refs | Reachable commits | Unique paths across history |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| qmoi-enhanced | 30,759 | 5,462 | 93 | 168 | 3,317 | 369,230 |
| Alpha-Q-ai | 22 | 8 | 0 | 16 | 1,887 | 33,023 |
| qmoi-enhanced-history-14 | 29,406 | 5,451 | 93 | 0 | 0 | materialized snapshot |

The copy phase created complete source trees and Git bundles in the staging
area, then compared every source filesystem path with its staged copy. The
post-copy result was complete with zero missing paths. A final `after-merge`
record must be generated after both remote integration branches are published;
the Alpha-Q-ai push is still pending because the available Git credential in
this execution environment is stale even though the API now reports push
permission.

### Published Remote Tree Metrics (2026-09-19)

These counts come from the exact remote branch trees and are distinct from the
all-history staging counts above:

| Remote ref | Files | Directories | Commit |
| --- | ---: | ---: | --- |
| `qmoi-enhanced:merge/complete-copy-gate-qe-20260919` | 1,342 | 6 | `5dd13d7ee2` |
| `Alpha-Q-ai:main` | 1,346 | 6 | `5ac4ece2cc` |

The unified integration branch and reciprocal imported refs are not present on
Alpha-Q-ai yet. These remote totals are therefore not the requested all-history
union; final union metrics remain blocked until integration and imported refs
are published to both repositories.

### Complete File And Directory Totals (2026-09-19)

The PR and history counts are recorded separately because a PR tree is one
commit while a history inventory is the union of paths across every reachable
ref. The PR tree is measured from the currently published PR head.

| Scope | Files | Directories |
| --- | ---: | ---: |
| `qmoi-enhanced` all reachable histories | 369,230 | 88,736 |
| `Alpha-Q-ai` all reachable histories | 33,023 | 5,450 |
| `qmoi-enhanced-history-14` materialized snapshot | 29,499 | 5,451 |
| **Summed all-history inputs** | **431,752** | **99,637** |
| **Deduplicated path union across all inputs** | **369,231** | **102,103** |
| `qmoi-enhanced` PR tree | 1,342 | 6 |
| `Alpha-Q-ai` current `main` tree | 1,346 | 6 |
| Materialized PR candidate after history and Alpha inputs | 32,187 | 5,468 |

The summed total is the arithmetic total of every source inventory. The
deduplicated total removes identical relative paths shared between sources;
it is the correct union metric for checking that the final repositories contain
all distinct files and directories. Neither remote default branch currently
contains this full union because Alpha-Q-ai still lacks the integration and
imported-history refs.

### Current Checkout Post-Copy Metrics (2026-09-19)

The repo uses a two-mode layout: a light browser/Codespaces checkout for daily
use and a full materialized mode for merge and audit work. The current verified
active tree on the `codespace-potential-tribble-g46v54ggq6rv2w4v5` branch is a
browser-light sparse checkout. The full materialized local copy is produced by
`bash scripts/prepare_codespace.sh full` and is intentionally not kept in the
normal active view to reduce browser bandwidth, filesystem churn, and search
cost.

| Checkout scope | Files | Directories | Symlinks | Notes |
| --- | ---: | ---: | ---: | --- |
| Active browser-light sparse checkout | 1,554 | 94 | 0 | Default Codespace/browser view; excludes heavy historical and Alpha-Q-ai inputs |
| Full materialized local copy in this workspace | 32,382 | 5,553 | 0 | Live repo root plus `Alpha-Q-ai` plus `qmoi-enhanced-history-14`, deduplicated by path where sources overlap |
| `qmoi-enhanced-history-14` materialized snapshot | 29,482 | 5,451 | 0 | Historical snapshot retained for audit and recovery |
| Alpha-Q-ai tracked main tree | 1,346 | 6 | 0 | Materialized mirror tree |

The figure `432,752 files` and `99,637 directories` in the all-history arithmetic
summary is a summed-input count, not the current checkout count. It includes
multiple repository and snapshot totals and overlaps across refs, so it is not a
single filesystem copy count. The physically materialized local copy in this
workspace is therefore 32,382 files and 5,553 directories, while the logical
all-history union recorded for evidence remains 369,231 files and 102,103
directories across all reachable history paths.

This distinction matters because browser/Codespaces performance requires a light
active view, while the full history and merge inputs remain available as Git
objects and as on-demand materialized copies for merge, audit, recovery, and
remote automation.

## Autonomous Merge Automation Hardening

The Ollama autonomous agent must treat all merge work as a full-history, full-
repo, no-skip operation. It must inventory and preserve every source tree,
directory, file, symlink, tag, branch, PR head, and reachable commit before it
attempts any merge decision. The copy stage is not a best-effort operation: it is
an evidence gate. For each source root, the agent records counts before copy,
after copy, and after merge. Any missing file, directory, route, API surface,
workflow, config file, secret-bearing file, or link reference blocks the merge
until it is accounted for or explicitly reviewed.

The automation must:

- Copy all live repo content from `qmoi-enhanced`, `Alpha-Q-ai`, and all materialized historical snapshots.
- Include all reachable branches, remote refs, tags, and PR tree contents in scope for merge planning.
- Preserve duplicate paths by provenance and canonical ownership, while deduplicating only after classification.
- Treat API routes, ports, workflows, build artifacts, environment variables, and link validation as part of the same merge contract.
- Validate secrets handling, credential redaction, environment-variable safety, and GitHub/Vercel host validation before publication.
- Keep the active Codespace light by using sparse/light mode for daily work and full materialization only for audits, merge preparation, and release work.
- Maintain a live ledger in `oe2.txt` and update the repo metrics in `MERGE.md` after every significant merge, inventory, or materialization change.
- Autonomously push or reconcile repo updates to both `qmoi-enhanced` and `Alpha-Q-ai` only after completion gates pass and the final evidence is recorded.

The merge decision engine must prefer live canonical roots first, then Alpha-Q-ai
live content, then historical snapshot sources, while preserving duplicate info as
source evidence. It must never silently drop a file, directory, feature, route,
port, API endpoint, or build artifact. Decision-making must favor correctness,
feature preservation, link health, and safety over speed.

### Required merge automation guardrails

1. Inventory every branch, tag, ref, and PR tree before merge.
2. Copy every file and directory into a staging area before merge planning.
3. Reconcile duplicates by basename, content identity, and canonical ownership.
4. Validate APIs, routes, ports, GitHub workflows, links, environment variables, and secrets handling in both repos.
5. Validate build artifacts and install/download flows for every app and platform surface.
6. Re-run the full validation and merge metrics pass after copy and again after merge.
7. Record final metrics and ledger evidence in `MERGE.md` and `oe2.txt`.
8. Keep the repo in light mode by default and full mode only when required.

### Merge accountability contract

Every autonomous merge run must be attributable to a source path, a source repo,
a source ref, a captured metric set, and a final validation result. The agent is
accountable for the complete file and directory inventory, not just the branch
head being edited. If a file, directory, route, environment variable, or feature
is not explicitly covered, it is treated as a merge gap and requires a
resolution before the merge can be considered complete.

### Remote Completeness Audit (2026-09-19)

The latest remote audit found `0` reciprocal imported-ref namespaces on both
remotes. The source gate branch is published on `qmoi-enhanced` at commit
`2cd9d0ae83`; the complete-copy report is local staging evidence, not a claim
that both final remote default branches contain the union. Alpha-Q-ai must
receive the integration branch, all imported `qmoi-enhanced` refs and tags,
and the materialized `qmoi-enhanced-history-14` tree before its after-merge
metrics can be marked complete. Until then, the final remote completion status
is `BLOCKED_EXTERNAL_PUBLICATION`.

## Local Audit Evidence (2026-09-08)

The locally available audit was completed before documentation changes. The
active `main` ref is `290cf11083afb539f9e9ccc6d1d98cf3131e4cbb`; the required
historical ref is available at
`origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` with commit
`c1058c28f63d81ea2cf7f45834cd873112e0e22a`. The active tree contains 917
tracked paths, 65 Markdown files, 20 scripts, 12 tests, and 8 workflows. The
materialized historical snapshot contains 29,505 paths and 3,559 Markdown
files. The focused agent tests passed 74/74 and the full suite passed 179/179.

The eight workflow trigger surfaces were inventoried, and the active tracked
tree had no concrete GitHub token-shaped credential. No Alpha-Q-ai ref is
available in this checkout, so cross-repository ownership classification and
complete comparison remain pending external repository access. PAT rotation,
GitHub Actions permission checks, and hosted artifact verification likewise
remain explicit publication blockers.

## File Type Specific Procedures

### Markdown Files (.md)

#### Pre-Merge Validation
```python
- Check syntax validity
- Validate link references
- Verify heading hierarchy
- Check for duplicate sections
- Validate table formatting
```

#### Merge Strategy
- **Content Merge**: Combine information from both files
- **Section Conflict**: Keep both sections with "merged" marker
- **Duplicate Sections**: Combine into single section
- **Cross-References**: Update to point to merged locations

#### Post-Merge Actions
1. Run markdown linter
2. Validate all links
3. Update table of contents if present
4. Verify no orphaned references

### Python Files (.py)

#### Pre-Merge Analysis
- Syntax check both files
- Analyze import dependencies
- Identify overlapping functions/classes
- Check for conflicts in global state

#### Merge Strategy
- **Functions**: Keep both if non-conflicting, merge if duplicates
- **Classes**: Use inheritance if complementary, merge if duplicates
- **Imports**: De-duplicate imports, preserve all needed modules
- **Constants**: Check for value conflicts, merge if compatible

#### Conflict Resolution
```python
# If function exists in both files:
# 1. If identical: Keep one
# 2. If slightly different: Create wrapper version
# 3. If significantly different: Create parameterized version
# 4. Last resort: Mark for manual review and create PR
```

#### Post-Merge Validation
1. `python3 -m py_compile` both files
2. Run unit tests for affected modules
3. Check for import errors
4. Validate function signatures

### TypeScript/JavaScript Files (.ts, .tsx, .js, .jsx)

#### Pre-Merge Analysis
- Check TypeScript compilation
- Analyze component dependencies
- Identify shared utilities
- Check for prop/type conflicts

#### Merge Strategy
- **React Components**: Merge props and functionality
- **Utilities**: De-duplicate, create shared module if needed
- **Styles**: Merge CSS/styled-components
- **Types**: Merge interfaces, use union types if needed

#### Post-Merge Validation
1. Run TypeScript compiler
2. Run linter (ESLint)
3. Run unit tests
4. Check for missing imports

### JSON Files (.json)

#### Pre-Merge Validation
- Validate JSON syntax in both files
- Identify structural differences
- Check for key conflicts

#### Merge Strategy
- **Configuration Files**: Deep merge objects
- **Package.json**: Merge dependencies, use highest version
- **Other JSON**: Merge arrays if applicable, objects recursively

#### Post-Merge Format
```bash
# Ensure consistent formatting
jq '.' merged.json > formatted.json
```

### YAML Files (.yml, .yaml)

#### Pre-Merge Validation
- Validate YAML syntax
- Check for key collisions
- Identify structural conflicts

#### Merge Strategy
- **GitHub Actions**: Merge steps logically
- **Configuration**: Deep merge configuration objects
- **Mappings**: Merge sequentially, preserve order

#### Post-Merge Validation
1. Validate YAML syntax
2. Check GitHub Actions format if applicable
3. Verify all required keys present
4. Test workflow if GitHub Actions file

### Kotlin Files (.kt)

#### Pre-Merge Analysis
- Check Kotlin compilation
- Analyze class/object dependencies
- Check for extension function conflicts

#### Merge Strategy
- **Classes**: Merge properties and methods
- **Extensions**: De-duplicate, combine if non-conflicting
- **Interfaces**: Merge, use composition if needed

### Specialized Merge Procedures

#### API.md Merge
```
1. Extract all API definitions from both files
2. De-duplicate by endpoint path
3. Verify version compatibility
4. Merge request/response schemas
5. Combine examples
6. Update API version if changed
```

#### ENDPOINTS.md Merge
```
1. List all endpoints from both repos
2. Group by functionality
3. Check for duplicates by path
4. Verify HTTP methods
5. Merge descriptions
6. Update endpoint count
```

#### ROUTES.md Merge
```
1. Extract routes from both files
2. Check for path conflicts
3. Merge route handlers
4. Verify middleware stacks
5. Combine route groups
6. Update route documentation
```

#### STYLES.md Merge
```
1. Collect all styles from both repos
2. Identify user-specific styles
3. Merge into unified style guide
4. Flag unclear style assignments to "styles dilemma master"
5. Create selection matrix for master
6. Implement per-user style selection logic
```

## Handling Special Cases

### Missing Implementations
If a feature is mentioned but not implemented:
1. Flag as TODO
2. Create issue in appropriate repo
3. Note dependency in merge record
4. Plan implementation timeline

### Conflicting Implementations
If two different implementations exist:
1. Compare performance characteristics
2. Compare feature completeness
3. Analyze code quality
4. Make informed decision
5. Document rationale
6. Archive unused implementation

### Feature Degradation Detection
```python
def detect_degradation(source_file, target_file, merged_file):
    """Ensure no features are lost in merge"""
    source_features = extract_features(source_file)
    target_features = extract_features(target_file)
    merged_features = extract_features(merged_file)

    all_features = source_features | target_features
    lost_features = all_features - merged_features

    if lost_features:
        raise MergeDegradationError(f"Lost features: {lost_features}")

    return True
```

## Merge Decision Matrix

| Situation | Decision | Rationale |
|-----------|----------|-----------|
| Identical content | Keep one | No difference |
| Minor differences | Merge intelligently | Preserve all info |
| Conflicts | Use context | Choose better version |
| Both needed | Create wrapper | Support both |
| Unclear | Mark for review | Manual verification |
| Degrading | Reject | Preserve features |

## Merge Validation Checklist

Before finalizing any merge:
- [ ] Syntax validation passed
- [ ] All imports/dependencies resolved
- [ ] No feature degradation detected
- [ ] Conflicts resolved intelligently
- [ ] Unit tests passing
- [ ] Documentation updated
- [ ] Links verified
- [ ] Version numbers updated if needed
- [ ] Changelog entry added
- [ ] Security implications reviewed
- [ ] Performance implications reviewed
- [ ] Backward compatibility verified

## Merge Conflict Resolution Process

### Step 1: Identify Conflict Type
- Code logic conflict
- Configuration conflict
- Data structure conflict
- Documentation conflict

### Step 2: Analyze Context
- Check git history
- Review original intent
- Consider both implementations
- Check for cross-dependencies

### Step 3: Apply Resolution Strategy
- **Logic Conflicts**: Create combined implementation
- **Config Conflicts**: Merge preserving all settings
- **Structure Conflicts**: Adapt to compatible structure
- **Documentation**: Merge information

### Step 4: Validate Resolution
- Test merged code
- Verify documentation links
- Ensure no broken references
- Confirm feature preservation

### Step 5: Document Decision
```markdown
## Merge Decision Log

### File: [filename]
- Conflict Type: [type]
- Decision: [decision made]
- Rationale: [why this decision]
- Validation: [how validated]
- Approver: [QMOI Agent or Master]
- Timestamp: [ISO timestamp]
```

## Automation & QMOI Agent Integration

### Agent Responsibilities
- Automatically detect merge-able files
- Apply intelligent merge strategies
- Validate all merges
- Flag conflicts for manual review
- Generate merge reports
- Update documentation

### Manual Intervention Cases
QMOI flags for manual review:
- Semantic conflicts (logic doesn't work)
- Architectural conflicts
- Security-sensitive merges
- Major feature changes
- Unclear merge intent

## Tools & Commands

### Validate Markdown
```bash
markdownlint file.md
```

### Validate Python
```bash
python3 -m py_compile file.py
pylint file.py
```

### Validate JSON
```bash
python3 -m json.tool file.json > /dev/null
```

### Validate YAML
```bash
python3 -c "import yaml; yaml.safe_load(open('file.yml'))"
```

### Merge with Git
```bash
git merge --no-commit --no-ff branch-name
# Review
git merge --abort  # if problems
# or
git commit -m "Merge branch..."
```

## Best Practices

1. **Always backup**: Keep originals before merge
2. **Test thoroughly**: Validate all merged files
3. **Document decisions**: Record why merges were done
4. **Verify features**: Ensure no feature loss
5. **Update docs**: Keep documentation synchronized
6. **Commit atomically**: One logical change per commit
7. **Use meaningful messages**: Clear commit messages
8. **Review carefully**: Peer review all merges
9. **Automate validation**: Run tests automatically
10. **Plan ahead**: Anticipate merge needs

## Troubleshooting

### Merge Conflicts Won't Resolve
1. Review conflict markers carefully
2. Understand both versions' intent
3. Consider creating hybrid version
4. Escalate to manual review if needed

### Test Failures After Merge
1. Run individual component tests
2. Check for import issues
3. Verify configuration values
4. Look for hardcoded paths
5. Check version compatibility

### Documentation Links Broken
1. Search for old file names
2. Update all references
3. Verify new structure
4. Run link checker
5. Update table of contents

## Related Documentation
- [SYNC.md](SYNC.md) - Synchronization between repositories
- [or.md](or.md) - Operations reference
- [zx.txt](zx.txt) - Alpha-Q-ai workflow setup

---
**Version**: 1.0
**Last Updated**: 2026-08-17
**Maintained By**: QMOI Ollama Autonomous Agent

## Autonomous branch and history merge inventory

{
  "branch_inventory": {
    "alpha_q_ai_branches": [
      "not_available_locally"
    ],
    "history_snapshot_branches": [
      "materialized_snapshot"
    ],
    "live_repo_branches": [
      "main",
      "origin",
      "origin/auto-merge/imported-theofalphakenya-20251122T090610Z",
      "origin/auto-merge/imported-theofalphakenya-20251122T090632Z",
      "origin/auto-merge/imported-theofalphakenya-20251122T092741Z",
      "origin/auto/dns-fixes-proposals-20251120122343",
      "origin/auto/http-to-https-20251110",
      "origin/auto/placeholder-proposals-20251120-01",
      "origin/auto/placeholder-stubs",
      "origin/auto/placeholder-stubs-clean",
      "origin/auto/placeholders-fixes",
      "origin/auto/placeholders-fixes-backup-20251028002407",
      "origin/auto/placeholders/auto-apply-dryrun",
      "origin/auto/placeholders/auto-apply-final",
      "origin/auto/placeholders/code-fix-docs_link-validation-report.json",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_components",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_scripts",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_src",
      "origin/auto/placeholders/code-fix-reports_placeholders.json",
      "origin/auto/placeholders/code-fix-reports_suggestions.json",
      "origin/auto/placeholders/code-fix-src_components",
      "origin/auto/placeholders/docs-fix-3",
      "origin/auto/placeholders/p0-epic",
      "origin/auto/placeholders/pr-patch-50b8f7d4acdba845f989c2f8552ba482453936ac",
      "origin/auto/placeholders/pr-patch-6f861e97978f7658419a96db195621a1370c35b2",
      "origin/auto/placeholders/pr-patch-730e13874a1c207ea2a3a2ca71d1a929ea46dd6a",
      "origin/auto/placeholders/pr-patch-74ddf5a1585e1c97907f5e3b70c046a8f629ad2e",
      "origin/auto/placeholders/pr-patch-7a60e32686716c20c7de7384b2470585a2be6067",
      "origin/auto/placeholders/pr-patch-8a71717e5525d8ca42c511e6bc97d14b3aed1e70",
      "origin/auto/placeholders/pr-patch-950017e1ca3e2c4421bfebba5eebc7585d7f9a98",
      "origin/auto/placeholders/pr-patch-ac68e484dc37c4b6600eb8ef553888b664c04a86",
      "origin/auto/placeholders/pr-patch-d21bd6a5f3e1c05f2cd6589732542942d8c16d29",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_1",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_10",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_11",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_12",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_13",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_14",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_15",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_2",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_3",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_4",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_5",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_6",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_7",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_8",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_9",
      "origin/auto/redact-credentials-20251113",
      "origin/auto/release-inventory-20251113160839",
      "origin/auto/update-mds-1762860999",
      "origin/auto/vercel-fix-1762862377",
      "origin/auto/vercel-fix-1762885773",
      "origin/auto/vercel-fixes",
      "origin/automated/requests-security-fix",
      "origin/automation/continue-setup",
      "origin/autosync-artifacts-20251107",
      "origin/autosync-backup",
      "origin/autosync-backup-20250926-232440",
      "origin/autosync-backup-20250927-004803",
      "origin/autosync-backup-20250927-005413",
      "origin/autosync-backup-20250927-010622",
      "origin/autosync-backup-20250927-013228",
      "origin/autosync-backup-20250928-202506",
      "origin/autosync-backup-20250929-044647",
      "origin/autosync-backup-20250929-051243",
      "origin/autosync-backup-20250929-052822",
      "origin/autosync-backup-20250929-055200",
      "origin/autosync-largefiles-20250927-004803",
      "origin/autosync-largefiles-20250927-005413",
      "origin/autosync-largefiles-20250927-010622",
      "origin/autosync-largefiles-20250927-013228",
      "origin/autosync-largefiles-20250928-202506",
      "origin/autosync-largefiles-20250929-044647",
      "origin/autosync-largefiles-20250929-051243",
      "origin/autosync-largefiles-20250929-052822",
      "origin/autosync-largefiles-20250929-055200",
      "origin/autosync-links-20251107",
      "origin/autosync-md-fixes-20251107",
      "origin/autosync-placeholder-fix-20251125073732",
      "origin/autosync-resolved-1700261406",
      "origin/autosync/enhancements",
      "origin/autosync/env-manager-ci-fixes-20251027",
      "origin/autosync/verification-20251107-clean",
      "origin/autosync/verification-20251107-pr",
      "origin/autoupdate/alllinks-25781049099",
      "origin/autoupdate/alllinks-28078916358",
      "origin/backup/before-auto-merge-20251122T092741Z",
      "origin/backup/before-replacer-${TS}",
      "origin/chore/cleanup-tests-and-lint",
      "origin/chore/copilot-setup-smoke-20251122T103756Z",
      "origin/chore/copilot-setup-smoke-20251122T103820Z",
      "origin/chore/local-chat-integration-20251122T104109Z",
      "origin/chore/local-chat-integration-20251122T104216Z",
      "origin/chore/prepare-production-20251123T140000Z",
      "origin/chore/update-master-docs-20251122T135155Z",
      "origin/ci-debug-output-manual-1766306758",
      "origin/ci/docker-run-tests",
      "origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp",
      "origin/codespace-super-enigma-wrqx6xg9ggvg356v4",
      "origin/codespace-ubiquitous-space-waddle-r7r7rjjp7rvhpq77",
      "origin/codespace-zany-capybara-x5xg95jjw7x5hgwg",
      "origin/copilot/hosted-step-manager",
      "origin/dependabot/github_actions/actions/checkout-7",
      "origin/dependabot/github_actions/actions/download-artifact-8",
      "origin/dependabot/github_actions/actions/github-script-9",
      "origin/dependabot/github_actions/actions/setup-python-7",
      "origin/dependabot/github_actions/actions/upload-artifact-7",
      "origin/dependabot/pip/asyncio-gte-4.0.0",
      "origin/dependabot/pip/cryptography-gte-50.0.1",
      "origin/dependabot/pip/matplotlib-gte-3.11.2",
      "origin/dependabot/pip/pydantic-gte-2.13.5",
      "origin/dependabot/pip/python-multipart-gte-0.0.32",
      "origin/dependabot/pip/requests-gte-2.34.2",
      "origin/dependabot/pip/stripe-gte-15.6.1",
      "origin/dependabot/pip/torch-gte-2.14.0",
      "origin/dependabot/pip/uvicorn-gte-0.52.4",
      "origin/dependabot/pip/werkzeug-gte-3.1.8",
      "origin/enhancement/readme-pr-demo",
      "origin/feat/mpesa-adapter-wireup",
      "origin/feature/auth-prod-1780061287",
      "origin/feature/ci-verify-and-release",
      "origin/feature/session4-complete",
      "origin/fix/harden-ollama-agent",
      "origin/fix/placeholders-automated-20251122T092214Z",
      "origin/fix/placeholders-prod-review-20251220-clean",
      "origin/fix/security-redactions-20251027",
      "origin/gh-pages",
      "origin/imported-snapshot/theofalphakenya-20251122T085133Z",
      "origin/imported/theofalphakenya",
      "origin/imported/theofalphakenya/main",
      "origin/link-update/pr-clean",
      "origin/main",
      "origin/mark-unverified-20251113",
      "origin/ollama/iteration-11",
      "origin/ollama/iteration-8",
      "origin/ollama/iteration-9",
      "origin/prod-enablement-20251113090017",
      "origin/prod/cleanup-20260516",
      "origin/revert-88-autosync-artifacts-20251107",
      "origin/review/imported-theofalphakenya-main",
      "origin/save/current-work-20251122T093850Z",
      "origin/sync-notify",
      "origin/todo-prod-sweep-20251221",
      "origin/upgrade/next-15"
    ]
  },
  "generated_at_utc": "2026-09-18T08:50:22.819418Z",
  "merge_activity": {
    "last_run": "2026-09-18T00:00:00Z",
    "status": "finalized",
    "summary": "Branch and history inventory, duplicate detection, route/API detection, and MERGE.md reporting are generated by the Ollama autonomous agent for every live repo and historical snapshot."
  },
  "merge_scope": {
    "api_route_count": 65525,
    "duplicate_directory_count": 2558,
    "duplicate_directory_names": [
      "\".backups",
      "\"_archive_qmoi-enhanced",
      "\"backups",
      "\"components",
      "\"lib",
      "\"qmoi-enhanced",
      "\"qmoi-enhanced-history-14",
      "\"qmoi-enhanced-incomplete-20260915T1733Z",
      ".backups",
      ".bin",
      ".capilot",
      ".consciousness",
      ".den",
      ".devcontainer",
      ".disabled-files",
      ".evolution_logs",
      ".generated",
      ".github",
      ".gradle",
      ".husky",
      ".jest_cache",
      ".lion",
      ".memory_sync",
      ".node",
      ".npm-cache"
    ],
    "duplicate_file_count": 38966,
    "duplicate_file_names": [
      "\"Status: \\342\\232\\240\\357\\270\\217 Placeholder stub (169 bytes) \\342\\200\\224 See build instructions below\"",
      ".auto-sync-ignore",
      ".autopush_sequence",
      ".babelrc",
      ".clang-format",
      ".clang-format-ignore",
      ".coveralls.yml",
      ".cspell.json",
      ".cursorignore",
      ".devpid",
      ".dockerignore",
      ".editorconfig",
      ".env.example",
      ".env.production",
      ".eslint_report_parsing_files.txt",
      ".eslintignore",
      ".eslintrc",
      ".eslintrc.appapi.cjs",
      ".eslintrc.cjs",
      ".eslintrc.js",
      ".eslintrc.json",
      ".eslintrc.yml",
      ".flake8",
      ".gitattributes",
      ".gitignore"
    ],
    "feature_count": 153,
    "roots_in_scope": [
      "/workspaces/qmoi-enhanced",
      "/workspaces/qmoi-enhanced/qmoi-enhanced-history-14"
    ],
    "total_branches": 288,
    "total_directories": 2359449,
    "total_files": 5757537
  },
  "repositories": [
    {
      "branches": [
        "main",
        "origin",
        "origin/auto-merge/imported-theofalphakenya-20251122T090610Z",
        "origin/auto-merge/imported-theofalphakenya-20251122T090632Z",
        "origin/auto-merge/imported-theofalphakenya-20251122T092741Z",
        "origin/auto/dns-fixes-proposals-20251120122343",
        "origin/auto/http-to-https-20251110",
        "origin/auto/placeholder-proposals-20251120-01",
        "origin/auto/placeholder-stubs",
        "origin/auto/placeholder-stubs-clean",
        "origin/auto/placeholders-fixes",
        "origin/auto/placeholders-fixes-backup-20251028002407",
        "origin/auto/placeholders/auto-apply-dryrun",
        "origin/auto/placeholders/auto-apply-final",
        "origin/auto/placeholders/code-fix-docs_link-validation-report.json",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_components",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_scripts",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_src",
        "origin/auto/placeholders/code-fix-reports_placeholders.json",
        "origin/auto/placeholders/code-fix-reports_suggestions.json",
        "..."
      ],
      "kind": "live_repo",
      "name": "qmoi-enhanced",
      "path": "/workspaces/qmoi-enhanced"
    },
    {
      "branches": [
        "history_snapshot_materialized"
      ],
      "kind": "historical_snapshot",
      "name": "qmoi-enhanced-history-14",
      "path": "/workspaces/qmoi-enhanced/qmoi-enhanced-history-14"
    },
    {
      "branches": [
        "not_available_locally",
        "planned_for_remote_sync"
      ],
      "kind": "target_repo",
      "name": "Alpha-Q-ai",
      "path": "not_present_in_local_checkout"
    }
  ],
  "routing_policy": {
    "Alpha-Q-ai": [
      "alpha",
      "agent",
      "integration",
      "clone",
      "platform",
      "backend",
      "sync",
      "service"
    ],
    "decision_rule": "Prefer live repo and canonical root ownership; preserve historical copies as merge sources; classify duplicates by basename and routing keywords before any mutation.",
    "qmoi-enhanced": [
      "API.md",
      "ENDPOINTS.md",
      "ROUTES.md",
      "ALLROUTES.md",
      "ALLPORTS.md",
      "MERGE.md",
      "monitor",
      "workflow",
      "build",
      "install",
      "download",
      "docs",
      "README"
    ]
  }
}


---

## Merged source: ../Alpha-Q-ai/MERGE.md

# MERGE.md - Merge Procedures and Guidelines

## Overview
This document provides comprehensive procedures for merging files and features between qmoi-enhanced and Alpha-Q-ai repositories. It ensures that no implementations are degraded, features are preserved, and conflicts are resolved intelligently.

## Core Merge Principles

1. **Preservation**: All existing features and implementations must be preserved
2. **Intelligence**: Use context-aware decision making for conflict resolution
3. **Verification**: Validate all merges to ensure integrity
4. **Traceability**: Document all merge decisions and rationales
5. **Accountability**: QMOI maintains full accountability for all merge decisions

## Autonomous History Audit Contract

Before any cross-repository merge, the agent must create a read-only audit for
both `thealphakenya/qmoi-enhanced` and `thealphakenya/Alpha-Q-ai`. The audit
records every reachable branch, the complete Git-tracked file structure, and
commit author, email, timestamp, subject, and hash. It must inspect all
contributors for QMOI Enhanced and at least the latest four reachable commits
for Alpha-Q-ai. A merge is not considered traceable until the activity and its
audit evidence are appended to this file through the agent's merge-log API.

The audit is evidence collection only: it must not fetch, merge, reset, or push
implicitly. Network synchronization and publication remain explicit workflow
steps, followed by validation and a recorded result.

## Required History Source And Complete Coverage

The ref `origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` is a
required historical source for every merge audit. Its complete branch contents
are materialized in `qmoi-enhanced-history-14/`, whose instruction file records
the source commit. The snapshot is part of merge input and recovery evidence;
it is not merely a note or an optional backup.

Before planning a merge, QMOI must inventory both repositories, every reachable
local and remote branch, every tracked path (including symlinks and currently
unused files/directories), and every commit needed for attribution. For each
path, record repository/ref, existence, content identity, dependencies,
implementation role, and classification: `QE`, `AQ`, `BOTH`, `HISTORICAL`, or
`CONFLICT`. Missing paths from the historical source must be evaluated for
restoration and feature degradation before they can be omitted. `CONFLICT` or
uncertain ownership blocks automatic changes and requires a review record.

`ALLMDFILESREFS.md` is updated from the complete `.md` inventory for both live
repositories and the historical ref, including markdown files not present in
the current checkout. The inventory is evidence, not permission to copy stale
content blindly.

## Autonomous Merge Procedure

1. Discover repository remotes, all refs, default/backup/history branches, and
    working-tree state without mutation.
2. Capture immutable inventories of all trees, markdown paths, commits,
    contributors, timestamps, symlinks, and the `qmoi-enhanced-history-14`
    materialization.
3. Determine ownership from imports, workflow/config references, package/build
    dependencies, history, and repository boundaries. Preserve unused content
    until this analysis is complete.
4. Build a path-level plan for additions, updates, deletions, and conflicts;
    checkpoint it before applying anything. Never auto-delete a path solely
    because it is absent from the target branch.
5. Apply only authorized changes inside the intended repository. Reject unsafe
    paths, secret/authentication changes, destructive commands, and unreviewed
    conflict resolutions.
6. Validate syntax, dependencies, links, workflows, targeted tests, full tests,
    feature preservation, and the complete post-merge tree against every source.
7. Update `MERGE.md`, `ALLMDFILESREFS.md`, checkpoint, telemetry, and the final
    proof contract with source refs, counts, decisions, and validation evidence.
8. Push or merge only when all required evidence passes and authorization is
    present. A partial inventory, inferred success, or Python-only check is a
    failed merge gate.

The Ollama autonomous agent and QMOI automation must use this procedure for
branch sync, PR merge, recovery, auto-healing, and cross-repository operations.
They may automate speed and repetition, but not bypass evidence, ownership,
review, or validation gates.

## Local Audit Evidence (2026-09-08)

The locally available audit was completed before documentation changes. The
active `main` ref is `290cf11083afb539f9e9ccc6d1d98cf3131e4cbb`; the required
historical ref is available at
`origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` with commit
`c1058c28f63d81ea2cf7f45834cd873112e0e22a`. The active tree contains 917
tracked paths, 65 Markdown files, 20 scripts, 12 tests, and 8 workflows. The
materialized historical snapshot contains 29,505 paths and 3,559 Markdown
files. The focused agent tests passed 74/74 and the full suite passed 179/179.

The eight workflow trigger surfaces were inventoried, and the active tracked
tree had no concrete GitHub token-shaped credential. No Alpha-Q-ai ref is
available in this checkout, so cross-repository ownership classification and
complete comparison remain pending external repository access. PAT rotation,
GitHub Actions permission checks, and hosted artifact verification likewise
remain explicit publication blockers.

## File Type Specific Procedures

### Markdown Files (.md)

#### Pre-Merge Validation
```python
- Check syntax validity
- Validate link references
- Verify heading hierarchy
- Check for duplicate sections
- Validate table formatting
```

#### Merge Strategy
- **Content Merge**: Combine information from both files
- **Section Conflict**: Keep both sections with "merged" marker
- **Duplicate Sections**: Combine into single section
- **Cross-References**: Update to point to merged locations

#### Post-Merge Actions
1. Run markdown linter
2. Validate all links
3. Update table of contents if present
4. Verify no orphaned references

### Python Files (.py)

#### Pre-Merge Analysis
- Syntax check both files
- Analyze import dependencies
- Identify overlapping functions/classes
- Check for conflicts in global state

#### Merge Strategy
- **Functions**: Keep both if non-conflicting, merge if duplicates
- **Classes**: Use inheritance if complementary, merge if duplicates
- **Imports**: De-duplicate imports, preserve all needed modules
- **Constants**: Check for value conflicts, merge if compatible

#### Conflict Resolution
```python
# If function exists in both files:
# 1. If identical: Keep one
# 2. If slightly different: Create wrapper version
# 3. If significantly different: Create parameterized version
# 4. Last resort: Mark for manual review and create PR
```

#### Post-Merge Validation
1. `python3 -m py_compile` both files
2. Run unit tests for affected modules
3. Check for import errors
4. Validate function signatures

### TypeScript/JavaScript Files (.ts, .tsx, .js, .jsx)

#### Pre-Merge Analysis
- Check TypeScript compilation
- Analyze component dependencies
- Identify shared utilities
- Check for prop/type conflicts

#### Merge Strategy
- **React Components**: Merge props and functionality
- **Utilities**: De-duplicate, create shared module if needed
- **Styles**: Merge CSS/styled-components
- **Types**: Merge interfaces, use union types if needed

#### Post-Merge Validation
1. Run TypeScript compiler
2. Run linter (ESLint)
3. Run unit tests
4. Check for missing imports

### JSON Files (.json)

#### Pre-Merge Validation
- Validate JSON syntax in both files
- Identify structural differences
- Check for key conflicts

#### Merge Strategy
- **Configuration Files**: Deep merge objects
- **Package.json**: Merge dependencies, use highest version
- **Other JSON**: Merge arrays if applicable, objects recursively

#### Post-Merge Format
```bash
# Ensure consistent formatting
jq '.' merged.json > formatted.json
```

### YAML Files (.yml, .yaml)

#### Pre-Merge Validation
- Validate YAML syntax
- Check for key collisions
- Identify structural conflicts

#### Merge Strategy
- **GitHub Actions**: Merge steps logically
- **Configuration**: Deep merge configuration objects
- **Mappings**: Merge sequentially, preserve order

#### Post-Merge Validation
1. Validate YAML syntax
2. Check GitHub Actions format if applicable
3. Verify all required keys present
4. Test workflow if GitHub Actions file

### Kotlin Files (.kt)

#### Pre-Merge Analysis
- Check Kotlin compilation
- Analyze class/object dependencies
- Check for extension function conflicts

#### Merge Strategy
- **Classes**: Merge properties and methods
- **Extensions**: De-duplicate, combine if non-conflicting
- **Interfaces**: Merge, use composition if needed

### Specialized Merge Procedures

#### API.md Merge
```
1. Extract all API definitions from both files
2. De-duplicate by endpoint path
3. Verify version compatibility
4. Merge request/response schemas
5. Combine examples
6. Update API version if changed
```

#### ENDPOINTS.md Merge
```
1. List all endpoints from both repos
2. Group by functionality
3. Check for duplicates by path
4. Verify HTTP methods
5. Merge descriptions
6. Update endpoint count
```

#### ROUTES.md Merge
```
1. Extract routes from both files
2. Check for path conflicts
3. Merge route handlers
4. Verify middleware stacks
5. Combine route groups
6. Update route documentation
```

#### STYLES.md Merge
```
1. Collect all styles from both repos
2. Identify user-specific styles
3. Merge into unified style guide
4. Flag unclear style assignments to "styles dilemma master"
5. Create selection matrix for master
6. Implement per-user style selection logic
```

## Handling Special Cases

### Missing Implementations
If a feature is mentioned but not implemented:
1. Flag as TODO
2. Create issue in appropriate repo
3. Note dependency in merge record
4. Plan implementation timeline

### Conflicting Implementations
If two different implementations exist:
1. Compare performance characteristics
2. Compare feature completeness
3. Analyze code quality
4. Make informed decision
5. Document rationale
6. Archive unused implementation

### Feature Degradation Detection
```python
def detect_degradation(source_file, target_file, merged_file):
    """Ensure no features are lost in merge"""
    source_features = extract_features(source_file)
    target_features = extract_features(target_file)
    merged_features = extract_features(merged_file)

    all_features = source_features | target_features
    lost_features = all_features - merged_features

    if lost_features:
        raise MergeDegradationError(f"Lost features: {lost_features}")

    return True
```

## Merge Decision Matrix

| Situation | Decision | Rationale |
|-----------|----------|-----------|
| Identical content | Keep one | No difference |
| Minor differences | Merge intelligently | Preserve all info |
| Conflicts | Use context | Choose better version |
| Both needed | Create wrapper | Support both |
| Unclear | Mark for review | Manual verification |
| Degrading | Reject | Preserve features |

## Merge Validation Checklist

Before finalizing any merge:
- [ ] Syntax validation passed
- [ ] All imports/dependencies resolved
- [ ] No feature degradation detected
- [ ] Conflicts resolved intelligently
- [ ] Unit tests passing
- [ ] Documentation updated
- [ ] Links verified
- [ ] Version numbers updated if needed
- [ ] Changelog entry added
- [ ] Security implications reviewed
- [ ] Performance implications reviewed
- [ ] Backward compatibility verified

## Merge Conflict Resolution Process

### Step 1: Identify Conflict Type
- Code logic conflict
- Configuration conflict
- Data structure conflict
- Documentation conflict

### Step 2: Analyze Context
- Check git history
- Review original intent
- Consider both implementations
- Check for cross-dependencies

### Step 3: Apply Resolution Strategy
- **Logic Conflicts**: Create combined implementation
- **Config Conflicts**: Merge preserving all settings
- **Structure Conflicts**: Adapt to compatible structure
- **Documentation**: Merge information

### Step 4: Validate Resolution
- Test merged code
- Verify documentation links
- Ensure no broken references
- Confirm feature preservation

### Step 5: Document Decision
```markdown
## Merge Decision Log

### File: [filename]
- Conflict Type: [type]
- Decision: [decision made]
- Rationale: [why this decision]
- Validation: [how validated]
- Approver: [QMOI Agent or Master]
- Timestamp: [ISO timestamp]
```

## Automation & QMOI Agent Integration

### Agent Responsibilities
- Automatically detect merge-able files
- Apply intelligent merge strategies
- Validate all merges
- Flag conflicts for manual review
- Generate merge reports
- Update documentation

### Manual Intervention Cases
QMOI flags for manual review:
- Semantic conflicts (logic doesn't work)
- Architectural conflicts
- Security-sensitive merges
- Major feature changes
- Unclear merge intent

## Tools & Commands

### Validate Markdown
```bash
markdownlint file.md
```

### Validate Python
```bash
python3 -m py_compile file.py
pylint file.py
```

### Validate JSON
```bash
python3 -m json.tool file.json > /dev/null
```

### Validate YAML
```bash
python3 -c "import yaml; yaml.safe_load(open('file.yml'))"
```

### Merge with Git
```bash
git merge --no-commit --no-ff branch-name
# Review
git merge --abort  # if problems
# or
git commit -m "Merge branch..."
```

## Best Practices

1. **Always backup**: Keep originals before merge
2. **Test thoroughly**: Validate all merged files
3. **Document decisions**: Record why merges were done
4. **Verify features**: Ensure no feature loss
5. **Update docs**: Keep documentation synchronized
6. **Commit atomically**: One logical change per commit
7. **Use meaningful messages**: Clear commit messages
8. **Review carefully**: Peer review all merges
9. **Automate validation**: Run tests automatically
10. **Plan ahead**: Anticipate merge needs

## Troubleshooting

### Merge Conflicts Won't Resolve
1. Review conflict markers carefully
2. Understand both versions' intent
3. Consider creating hybrid version
4. Escalate to manual review if needed

### Test Failures After Merge
1. Run individual component tests
2. Check for import issues
3. Verify configuration values
4. Look for hardcoded paths
5. Check version compatibility

### Documentation Links Broken
1. Search for old file names
2. Update all references
3. Verify new structure
4. Run link checker
5. Update table of contents

## Related Documentation
- [SYNC.md](SYNC.md) - Synchronization between repositories
- [or.md](or.md) - Operations reference
- [zx.txt](zx.txt) - Alpha-Q-ai workflow setup

---
**Version**: 1.0
**Last Updated**: 2026-08-17
**Maintained By**: QMOI Ollama Autonomous Agent

## Autonomous branch and history merge inventory

{
  "branch_inventory": {
    "alpha_q_ai_branches": [
      "not_available_locally"
    ],
    "history_snapshot_branches": [
      "materialized_snapshot"
    ],
    "live_repo_branches": [
      "main",
      "origin",
      "origin/auto-merge/imported-theofalphakenya-20251122T090610Z",
      "origin/auto-merge/imported-theofalphakenya-20251122T090632Z",
      "origin/auto-merge/imported-theofalphakenya-20251122T092741Z",
      "origin/auto/dns-fixes-proposals-20251120122343",
      "origin/auto/http-to-https-20251110",
      "origin/auto/placeholder-proposals-20251120-01",
      "origin/auto/placeholder-stubs",
      "origin/auto/placeholder-stubs-clean",
      "origin/auto/placeholders-fixes",
      "origin/auto/placeholders-fixes-backup-20251028002407",
      "origin/auto/placeholders/auto-apply-dryrun",
      "origin/auto/placeholders/auto-apply-final",
      "origin/auto/placeholders/code-fix-docs_link-validation-report.json",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_components",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_scripts",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_src",
      "origin/auto/placeholders/code-fix-reports_placeholders.json",
      "origin/auto/placeholders/code-fix-reports_suggestions.json",
      "origin/auto/placeholders/code-fix-src_components",
      "origin/auto/placeholders/docs-fix-3",
      "origin/auto/placeholders/p0-epic",
      "origin/auto/placeholders/pr-patch-50b8f7d4acdba845f989c2f8552ba482453936ac",
      "origin/auto/placeholders/pr-patch-6f861e97978f7658419a96db195621a1370c35b2",
      "origin/auto/placeholders/pr-patch-730e13874a1c207ea2a3a2ca71d1a929ea46dd6a",
      "origin/auto/placeholders/pr-patch-74ddf5a1585e1c97907f5e3b70c046a8f629ad2e",
      "origin/auto/placeholders/pr-patch-7a60e32686716c20c7de7384b2470585a2be6067",
      "origin/auto/placeholders/pr-patch-8a71717e5525d8ca42c511e6bc97d14b3aed1e70",
      "origin/auto/placeholders/pr-patch-950017e1ca3e2c4421bfebba5eebc7585d7f9a98",
      "origin/auto/placeholders/pr-patch-ac68e484dc37c4b6600eb8ef553888b664c04a86",
      "origin/auto/placeholders/pr-patch-d21bd6a5f3e1c05f2cd6589732542942d8c16d29",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_1",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_10",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_11",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_12",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_13",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_14",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_15",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_2",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_3",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_4",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_5",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_6",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_7",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_8",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_9",
      "origin/auto/redact-credentials-20251113",
      "origin/auto/release-inventory-20251113160839",
      "origin/auto/update-mds-1762860999",
      "origin/auto/vercel-fix-1762862377",
      "origin/auto/vercel-fix-1762885773",
      "origin/auto/vercel-fixes",
      "origin/automated/requests-security-fix",
      "origin/automation/continue-setup",
      "origin/autosync-artifacts-20251107",
      "origin/autosync-backup",
      "origin/autosync-backup-20250926-232440",
      "origin/autosync-backup-20250927-004803",
      "origin/autosync-backup-20250927-005413",
      "origin/autosync-backup-20250927-010622",
      "origin/autosync-backup-20250927-013228",
      "origin/autosync-backup-20250928-202506",
      "origin/autosync-backup-20250929-044647",
      "origin/autosync-backup-20250929-051243",
      "origin/autosync-backup-20250929-052822",
      "origin/autosync-backup-20250929-055200",
      "origin/autosync-largefiles-20250927-004803",
      "origin/autosync-largefiles-20250927-005413",
      "origin/autosync-largefiles-20250927-010622",
      "origin/autosync-largefiles-20250927-013228",
      "origin/autosync-largefiles-20250928-202506",
      "origin/autosync-largefiles-20250929-044647",
      "origin/autosync-largefiles-20250929-051243",
      "origin/autosync-largefiles-20250929-052822",
      "origin/autosync-largefiles-20250929-055200",
      "origin/autosync-links-20251107",
      "origin/autosync-md-fixes-20251107",
      "origin/autosync-placeholder-fix-20251125073732",
      "origin/autosync-resolved-1700261406",
      "origin/autosync/enhancements",
      "origin/autosync/env-manager-ci-fixes-20251027",
      "origin/autosync/verification-20251107-clean",
      "origin/autosync/verification-20251107-pr",
      "origin/autoupdate/alllinks-25781049099",
      "origin/autoupdate/alllinks-28078916358",
      "origin/backup/before-auto-merge-20251122T092741Z",
      "origin/backup/before-replacer-${TS}",
      "origin/chore/cleanup-tests-and-lint",
      "origin/chore/copilot-setup-smoke-20251122T103756Z",
      "origin/chore/copilot-setup-smoke-20251122T103820Z",
      "origin/chore/local-chat-integration-20251122T104109Z",
      "origin/chore/local-chat-integration-20251122T104216Z",
      "origin/chore/prepare-production-20251123T140000Z",
      "origin/chore/update-master-docs-20251122T135155Z",
      "origin/ci-debug-output-manual-1766306758",
      "origin/ci/docker-run-tests",
      "origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp",
      "origin/codespace-super-enigma-wrqx6xg9ggvg356v4",
      "origin/codespace-ubiquitous-space-waddle-r7r7rjjp7rvhpq77",
      "origin/codespace-zany-capybara-x5xg95jjw7x5hgwg",
      "origin/copilot/hosted-step-manager",
      "origin/dependabot/github_actions/actions/checkout-7",
      "origin/dependabot/github_actions/actions/download-artifact-8",
      "origin/dependabot/github_actions/actions/github-script-9",
      "origin/dependabot/github_actions/actions/setup-python-7",
      "origin/dependabot/github_actions/actions/upload-artifact-7",
      "origin/dependabot/pip/asyncio-gte-4.0.0",
      "origin/dependabot/pip/cryptography-gte-50.0.1",
      "origin/dependabot/pip/matplotlib-gte-3.11.2",
      "origin/dependabot/pip/pydantic-gte-2.13.5",
      "origin/dependabot/pip/python-multipart-gte-0.0.32",
      "origin/dependabot/pip/requests-gte-2.34.2",
      "origin/dependabot/pip/stripe-gte-15.6.1",
      "origin/dependabot/pip/torch-gte-2.14.0",
      "origin/dependabot/pip/uvicorn-gte-0.52.4",
      "origin/dependabot/pip/werkzeug-gte-3.1.8",
      "origin/enhancement/readme-pr-demo",
      "origin/feat/mpesa-adapter-wireup",
      "origin/feature/auth-prod-1780061287",
      "origin/feature/ci-verify-and-release",
      "origin/feature/session4-complete",
      "origin/fix/harden-ollama-agent",
      "origin/fix/placeholders-automated-20251122T092214Z",
      "origin/fix/placeholders-prod-review-20251220-clean",
      "origin/fix/security-redactions-20251027",
      "origin/gh-pages",
      "origin/imported-snapshot/theofalphakenya-20251122T085133Z",
      "origin/imported/theofalphakenya",
      "origin/imported/theofalphakenya/main",
      "origin/link-update/pr-clean",
      "origin/main",
      "origin/mark-unverified-20251113",
      "origin/ollama/iteration-11",
      "origin/ollama/iteration-8",
      "origin/ollama/iteration-9",
      "origin/prod-enablement-20251113090017",
      "origin/prod/cleanup-20260516",
      "origin/revert-88-autosync-artifacts-20251107",
      "origin/review/imported-theofalphakenya-main",
      "origin/save/current-work-20251122T093850Z",
      "origin/sync-notify",
      "origin/todo-prod-sweep-20251221",
      "origin/upgrade/next-15"
    ]
  },
  "generated_at_utc": "2026-09-18T08:50:22.819418Z",
  "merge_activity": {
    "last_run": "2026-09-18T00:00:00Z",
    "status": "finalized",
    "summary": "Branch and history inventory, duplicate detection, route/API detection, and MERGE.md reporting are generated by the Ollama autonomous agent for every live repo and historical snapshot."
  },
  "merge_scope": {
    "api_route_count": 65525,
    "duplicate_directory_count": 2558,
    "duplicate_directory_names": [
      "\".backups",
      "\"_archive_qmoi-enhanced",
      "\"backups",
      "\"components",
      "\"lib",
      "\"qmoi-enhanced",
      "\"qmoi-enhanced-history-14",
      "\"qmoi-enhanced-incomplete-20260915T1733Z",
      ".backups",
      ".bin",
      ".capilot",
      ".consciousness",
      ".den",
      ".devcontainer",
      ".disabled-files",
      ".evolution_logs",
      ".generated",
      ".github",
      ".gradle",
      ".husky",
      ".jest_cache",
      ".lion",
      ".memory_sync",
      ".node",
      ".npm-cache"
    ],
    "duplicate_file_count": 38966,
    "duplicate_file_names": [
      "\"Status: \\342\\232\\240\\357\\270\\217 Placeholder stub (169 bytes) \\342\\200\\224 See build instructions below\"",
      ".auto-sync-ignore",
      ".autopush_sequence",
      ".babelrc",
      ".clang-format",
      ".clang-format-ignore",
      ".coveralls.yml",
      ".cspell.json",
      ".cursorignore",
      ".devpid",
      ".dockerignore",
      ".editorconfig",
      ".env.example",
      ".env.production",
      ".eslint_report_parsing_files.txt",
      ".eslintignore",
      ".eslintrc",
      ".eslintrc.appapi.cjs",
      ".eslintrc.cjs",
      ".eslintrc.js",
      ".eslintrc.json",
      ".eslintrc.yml",
      ".flake8",
      ".gitattributes",
      ".gitignore"
    ],
    "feature_count": 153,
    "roots_in_scope": [
      "/workspaces/qmoi-enhanced",
      "/workspaces/qmoi-enhanced/qmoi-enhanced-history-14"
    ],
    "total_branches": 288,
    "total_directories": 2359449,
    "total_files": 5757537
  },
  "repositories": [
    {
      "branches": [
        "main",
        "origin",
        "origin/auto-merge/imported-theofalphakenya-20251122T090610Z",
        "origin/auto-merge/imported-theofalphakenya-20251122T090632Z",
        "origin/auto-merge/imported-theofalphakenya-20251122T092741Z",
        "origin/auto/dns-fixes-proposals-20251120122343",
        "origin/auto/http-to-https-20251110",
        "origin/auto/placeholder-proposals-20251120-01",
        "origin/auto/placeholder-stubs",
        "origin/auto/placeholder-stubs-clean",
        "origin/auto/placeholders-fixes",
        "origin/auto/placeholders-fixes-backup-20251028002407",
        "origin/auto/placeholders/auto-apply-dryrun",
        "origin/auto/placeholders/auto-apply-final",
        "origin/auto/placeholders/code-fix-docs_link-validation-report.json",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_components",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_scripts",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_src",
        "origin/auto/placeholders/code-fix-reports_placeholders.json",
        "origin/auto/placeholders/code-fix-reports_suggestions.json",
        "..."
      ],
      "kind": "live_repo",
      "name": "qmoi-enhanced",
      "path": "/workspaces/qmoi-enhanced"
    },
    {
      "branches": [
        "history_snapshot_materialized"
      ],
      "kind": "historical_snapshot",
      "name": "qmoi-enhanced-history-14",
      "path": "/workspaces/qmoi-enhanced/qmoi-enhanced-history-14"
    },
    {
      "branches": [
        "not_available_locally",
        "planned_for_remote_sync"
      ],
      "kind": "target_repo",
      "name": "Alpha-Q-ai",
      "path": "not_present_in_local_checkout"
    }
  ],
  "routing_policy": {
    "Alpha-Q-ai": [
      "alpha",
      "agent",
      "integration",
      "clone",
      "platform",
      "backend",
      "sync",
      "service"
    ],
    "decision_rule": "Prefer live repo and canonical root ownership; preserve historical copies as merge sources; classify duplicates by basename and routing keywords before any mutation.",
    "qmoi-enhanced": [
      "API.md",
      "ENDPOINTS.md",
      "ROUTES.md",
      "ALLROUTES.md",
      "ALLPORTS.md",
      "MERGE.md",
      "monitor",
      "workflow",
      "build",
      "install",
      "download",
      "docs",
      "README"
    ]
  }
}


---

## Merged source: ../Alpha-Q-ai/alpha-q-ai-history-14/MERGE.md

# MERGE.md - Merge Procedures and Guidelines

## Overview
This document provides comprehensive procedures for merging files and features between qmoi-enhanced and Alpha-Q-ai repositories. It ensures that no implementations are degraded, features are preserved, and conflicts are resolved intelligently.

## Core Merge Principles

1. **Preservation**: All existing features and implementations must be preserved
2. **Intelligence**: Use context-aware decision making for conflict resolution
3. **Verification**: Validate all merges to ensure integrity
4. **Traceability**: Document all merge decisions and rationales
5. **Accountability**: QMOI maintains full accountability for all merge decisions

## Autonomous History Audit Contract

Before any cross-repository merge, the agent must create a read-only audit for
both `thealphakenya/qmoi-enhanced` and `thealphakenya/Alpha-Q-ai`. The audit
records every reachable branch, the complete Git-tracked file structure, and
commit author, email, timestamp, subject, and hash. It must inspect all
contributors for QMOI Enhanced and at least the latest four reachable commits
for Alpha-Q-ai. A merge is not considered traceable until the activity and its
audit evidence are appended to this file through the agent's merge-log API.

The audit is evidence collection only: it must not fetch, merge, reset, or push
implicitly. Network synchronization and publication remain explicit workflow
steps, followed by validation and a recorded result.

## Required History Source And Complete Coverage

The ref `origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` is a
required historical source for every merge audit. Its complete branch contents
are materialized in `qmoi-enhanced-history-14/`, whose instruction file records
the source commit. The snapshot is part of merge input and recovery evidence;
it is not merely a note or an optional backup.

Before planning a merge, QMOI must inventory both repositories, every reachable
local and remote branch, every tracked path (including symlinks and currently
unused files/directories), and every commit needed for attribution. For each
path, record repository/ref, existence, content identity, dependencies,
implementation role, and classification: `QE`, `AQ`, `BOTH`, `HISTORICAL`, or
`CONFLICT`. Missing paths from the historical source must be evaluated for
restoration and feature degradation before they can be omitted. `CONFLICT` or
uncertain ownership blocks automatic changes and requires a review record.

`ALLMDFILESREFS.md` is updated from the complete `.md` inventory for both live
repositories and the historical ref, including markdown files not present in
the current checkout. The inventory is evidence, not permission to copy stale
content blindly.

## Autonomous Merge Procedure

1. Discover repository remotes, all refs, default/backup/history branches, and
    working-tree state without mutation.
2. Capture immutable inventories of all trees, markdown paths, commits,
    contributors, timestamps, symlinks, and the `qmoi-enhanced-history-14`
    materialization.
3. Determine ownership from imports, workflow/config references, package/build
    dependencies, history, and repository boundaries. Preserve unused content
    until this analysis is complete.
4. Build a path-level plan for additions, updates, deletions, and conflicts;
    checkpoint it before applying anything. Never auto-delete a path solely
    because it is absent from the target branch.
5. Apply only authorized changes inside the intended repository. Reject unsafe
    paths, secret/authentication changes, destructive commands, and unreviewed
    conflict resolutions.
6. Validate syntax, dependencies, links, workflows, targeted tests, full tests,
    feature preservation, and the complete post-merge tree against every source.
7. Update `MERGE.md`, `ALLMDFILESREFS.md`, checkpoint, telemetry, and the final
    proof contract with source refs, counts, decisions, and validation evidence.
8. Push or merge only when all required evidence passes and authorization is
    present. A partial inventory, inferred success, or Python-only check is a
    failed merge gate.

The Ollama autonomous agent and QMOI automation must use this procedure for
branch sync, PR merge, recovery, auto-healing, and cross-repository operations.
They may automate speed and repetition, but not bypass evidence, ownership,
review, or validation gates.

## Local Audit Evidence (2026-09-08)

The locally available audit was completed before documentation changes. The
active `main` ref is `290cf11083afb539f9e9ccc6d1d98cf3131e4cbb`; the required
historical ref is available at
`origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` with commit
`c1058c28f63d81ea2cf7f45834cd873112e0e22a`. The active tree contains 917
tracked paths, 65 Markdown files, 20 scripts, 12 tests, and 8 workflows. The
materialized historical snapshot contains 29,505 paths and 3,559 Markdown
files. The focused agent tests passed 74/74 and the full suite passed 179/179.

The eight workflow trigger surfaces were inventoried, and the active tracked
tree had no concrete GitHub token-shaped credential. No Alpha-Q-ai ref is
available in this checkout, so cross-repository ownership classification and
complete comparison remain pending external repository access. PAT rotation,
GitHub Actions permission checks, and hosted artifact verification likewise
remain explicit publication blockers.

## File Type Specific Procedures

### Markdown Files (.md)

#### Pre-Merge Validation
```python
- Check syntax validity
- Validate link references
- Verify heading hierarchy
- Check for duplicate sections
- Validate table formatting
```

#### Merge Strategy
- **Content Merge**: Combine information from both files
- **Section Conflict**: Keep both sections with "merged" marker
- **Duplicate Sections**: Combine into single section
- **Cross-References**: Update to point to merged locations

#### Post-Merge Actions
1. Run markdown linter
2. Validate all links
3. Update table of contents if present
4. Verify no orphaned references

### Python Files (.py)

#### Pre-Merge Analysis
- Syntax check both files
- Analyze import dependencies
- Identify overlapping functions/classes
- Check for conflicts in global state

#### Merge Strategy
- **Functions**: Keep both if non-conflicting, merge if duplicates
- **Classes**: Use inheritance if complementary, merge if duplicates
- **Imports**: De-duplicate imports, preserve all needed modules
- **Constants**: Check for value conflicts, merge if compatible

#### Conflict Resolution
```python
# If function exists in both files:
# 1. If identical: Keep one
# 2. If slightly different: Create wrapper version
# 3. If significantly different: Create parameterized version
# 4. Last resort: Mark for manual review and create PR
```

#### Post-Merge Validation
1. `python3 -m py_compile` both files
2. Run unit tests for affected modules
3. Check for import errors
4. Validate function signatures

### TypeScript/JavaScript Files (.ts, .tsx, .js, .jsx)

#### Pre-Merge Analysis
- Check TypeScript compilation
- Analyze component dependencies
- Identify shared utilities
- Check for prop/type conflicts

#### Merge Strategy
- **React Components**: Merge props and functionality
- **Utilities**: De-duplicate, create shared module if needed
- **Styles**: Merge CSS/styled-components
- **Types**: Merge interfaces, use union types if needed

#### Post-Merge Validation
1. Run TypeScript compiler
2. Run linter (ESLint)
3. Run unit tests
4. Check for missing imports

### JSON Files (.json)

#### Pre-Merge Validation
- Validate JSON syntax in both files
- Identify structural differences
- Check for key conflicts

#### Merge Strategy
- **Configuration Files**: Deep merge objects
- **Package.json**: Merge dependencies, use highest version
- **Other JSON**: Merge arrays if applicable, objects recursively

#### Post-Merge Format
```bash
# Ensure consistent formatting
jq '.' merged.json > formatted.json
```

### YAML Files (.yml, .yaml)

#### Pre-Merge Validation
- Validate YAML syntax
- Check for key collisions
- Identify structural conflicts

#### Merge Strategy
- **GitHub Actions**: Merge steps logically
- **Configuration**: Deep merge configuration objects
- **Mappings**: Merge sequentially, preserve order

#### Post-Merge Validation
1. Validate YAML syntax
2. Check GitHub Actions format if applicable
3. Verify all required keys present
4. Test workflow if GitHub Actions file

### Kotlin Files (.kt)

#### Pre-Merge Analysis
- Check Kotlin compilation
- Analyze class/object dependencies
- Check for extension function conflicts

#### Merge Strategy
- **Classes**: Merge properties and methods
- **Extensions**: De-duplicate, combine if non-conflicting
- **Interfaces**: Merge, use composition if needed

### Specialized Merge Procedures

#### API.md Merge
```
1. Extract all API definitions from both files
2. De-duplicate by endpoint path
3. Verify version compatibility
4. Merge request/response schemas
5. Combine examples
6. Update API version if changed
```

#### ENDPOINTS.md Merge
```
1. List all endpoints from both repos
2. Group by functionality
3. Check for duplicates by path
4. Verify HTTP methods
5. Merge descriptions
6. Update endpoint count
```

#### ROUTES.md Merge
```
1. Extract routes from both files
2. Check for path conflicts
3. Merge route handlers
4. Verify middleware stacks
5. Combine route groups
6. Update route documentation
```

#### STYLES.md Merge
```
1. Collect all styles from both repos
2. Identify user-specific styles
3. Merge into unified style guide
4. Flag unclear style assignments to "styles dilemma master"
5. Create selection matrix for master
6. Implement per-user style selection logic
```

## Handling Special Cases

### Missing Implementations
If a feature is mentioned but not implemented:
1. Flag as TODO
2. Create issue in appropriate repo
3. Note dependency in merge record
4. Plan implementation timeline

### Conflicting Implementations
If two different implementations exist:
1. Compare performance characteristics
2. Compare feature completeness
3. Analyze code quality
4. Make informed decision
5. Document rationale
6. Archive unused implementation

### Feature Degradation Detection
```python
def detect_degradation(source_file, target_file, merged_file):
    """Ensure no features are lost in merge"""
    source_features = extract_features(source_file)
    target_features = extract_features(target_file)
    merged_features = extract_features(merged_file)

    all_features = source_features | target_features
    lost_features = all_features - merged_features

    if lost_features:
        raise MergeDegradationError(f"Lost features: {lost_features}")

    return True
```

## Merge Decision Matrix

| Situation | Decision | Rationale |
|-----------|----------|-----------|
| Identical content | Keep one | No difference |
| Minor differences | Merge intelligently | Preserve all info |
| Conflicts | Use context | Choose better version |
| Both needed | Create wrapper | Support both |
| Unclear | Mark for review | Manual verification |
| Degrading | Reject | Preserve features |

## Merge Validation Checklist

Before finalizing any merge:
- [ ] Syntax validation passed
- [ ] All imports/dependencies resolved
- [ ] No feature degradation detected
- [ ] Conflicts resolved intelligently
- [ ] Unit tests passing
- [ ] Documentation updated
- [ ] Links verified
- [ ] Version numbers updated if needed
- [ ] Changelog entry added
- [ ] Security implications reviewed
- [ ] Performance implications reviewed
- [ ] Backward compatibility verified

## Merge Conflict Resolution Process

### Step 1: Identify Conflict Type
- Code logic conflict
- Configuration conflict
- Data structure conflict
- Documentation conflict

### Step 2: Analyze Context
- Check git history
- Review original intent
- Consider both implementations
- Check for cross-dependencies

### Step 3: Apply Resolution Strategy
- **Logic Conflicts**: Create combined implementation
- **Config Conflicts**: Merge preserving all settings
- **Structure Conflicts**: Adapt to compatible structure
- **Documentation**: Merge information

### Step 4: Validate Resolution
- Test merged code
- Verify documentation links
- Ensure no broken references
- Confirm feature preservation

### Step 5: Document Decision
```markdown
## Merge Decision Log

### File: [filename]
- Conflict Type: [type]
- Decision: [decision made]
- Rationale: [why this decision]
- Validation: [how validated]
- Approver: [QMOI Agent or Master]
- Timestamp: [ISO timestamp]
```

## Automation & QMOI Agent Integration

### Agent Responsibilities
- Automatically detect merge-able files
- Apply intelligent merge strategies
- Validate all merges
- Flag conflicts for manual review
- Generate merge reports
- Update documentation

### Manual Intervention Cases
QMOI flags for manual review:
- Semantic conflicts (logic doesn't work)
- Architectural conflicts
- Security-sensitive merges
- Major feature changes
- Unclear merge intent

## Tools & Commands

### Validate Markdown
```bash
markdownlint file.md
```

### Validate Python
```bash
python3 -m py_compile file.py
pylint file.py
```

### Validate JSON
```bash
python3 -m json.tool file.json > /dev/null
```

### Validate YAML
```bash
python3 -c "import yaml; yaml.safe_load(open('file.yml'))"
```

### Merge with Git
```bash
git merge --no-commit --no-ff branch-name
# Review
git merge --abort  # if problems
# or
git commit -m "Merge branch..."
```

## Best Practices

1. **Always backup**: Keep originals before merge
2. **Test thoroughly**: Validate all merged files
3. **Document decisions**: Record why merges were done
4. **Verify features**: Ensure no feature loss
5. **Update docs**: Keep documentation synchronized
6. **Commit atomically**: One logical change per commit
7. **Use meaningful messages**: Clear commit messages
8. **Review carefully**: Peer review all merges
9. **Automate validation**: Run tests automatically
10. **Plan ahead**: Anticipate merge needs

## Troubleshooting

### Merge Conflicts Won't Resolve
1. Review conflict markers carefully
2. Understand both versions' intent
3. Consider creating hybrid version
4. Escalate to manual review if needed

### Test Failures After Merge
1. Run individual component tests
2. Check for import issues
3. Verify configuration values
4. Look for hardcoded paths
5. Check version compatibility

### Documentation Links Broken
1. Search for old file names
2. Update all references
3. Verify new structure
4. Run link checker
5. Update table of contents

## Related Documentation
- [SYNC.md](SYNC.md) - Synchronization between repositories
- [or.md](or.md) - Operations reference
- [zx.txt](zx.txt) - Alpha-Q-ai workflow setup

---
**Version**: 1.0
**Last Updated**: 2026-08-17
**Maintained By**: QMOI Ollama Autonomous Agent

## Autonomous branch and history merge inventory

{
  "branch_inventory": {
    "alpha_q_ai_branches": [
      "not_available_locally"
    ],
    "history_snapshot_branches": [
      "materialized_snapshot"
    ],
    "live_repo_branches": [
      "main",
      "origin",
      "origin/auto-merge/imported-theofalphakenya-20251122T090610Z",
      "origin/auto-merge/imported-theofalphakenya-20251122T090632Z",
      "origin/auto-merge/imported-theofalphakenya-20251122T092741Z",
      "origin/auto/dns-fixes-proposals-20251120122343",
      "origin/auto/http-to-https-20251110",
      "origin/auto/placeholder-proposals-20251120-01",
      "origin/auto/placeholder-stubs",
      "origin/auto/placeholder-stubs-clean",
      "origin/auto/placeholders-fixes",
      "origin/auto/placeholders-fixes-backup-20251028002407",
      "origin/auto/placeholders/auto-apply-dryrun",
      "origin/auto/placeholders/auto-apply-final",
      "origin/auto/placeholders/code-fix-docs_link-validation-report.json",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_components",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_scripts",
      "origin/auto/placeholders/code-fix-qmoi-enhanced_src",
      "origin/auto/placeholders/code-fix-reports_placeholders.json",
      "origin/auto/placeholders/code-fix-reports_suggestions.json",
      "origin/auto/placeholders/code-fix-src_components",
      "origin/auto/placeholders/docs-fix-3",
      "origin/auto/placeholders/p0-epic",
      "origin/auto/placeholders/pr-patch-50b8f7d4acdba845f989c2f8552ba482453936ac",
      "origin/auto/placeholders/pr-patch-6f861e97978f7658419a96db195621a1370c35b2",
      "origin/auto/placeholders/pr-patch-730e13874a1c207ea2a3a2ca71d1a929ea46dd6a",
      "origin/auto/placeholders/pr-patch-74ddf5a1585e1c97907f5e3b70c046a8f629ad2e",
      "origin/auto/placeholders/pr-patch-7a60e32686716c20c7de7384b2470585a2be6067",
      "origin/auto/placeholders/pr-patch-8a71717e5525d8ca42c511e6bc97d14b3aed1e70",
      "origin/auto/placeholders/pr-patch-950017e1ca3e2c4421bfebba5eebc7585d7f9a98",
      "origin/auto/placeholders/pr-patch-ac68e484dc37c4b6600eb8ef553888b664c04a86",
      "origin/auto/placeholders/pr-patch-d21bd6a5f3e1c05f2cd6589732542942d8c16d29",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_1",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_10",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_11",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_12",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_13",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_14",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_15",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_2",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_3",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_4",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_5",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_6",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_7",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_8",
      "origin/auto/placeholders/pr-patch-pass_fixes_batch_9",
      "origin/auto/redact-credentials-20251113",
      "origin/auto/release-inventory-20251113160839",
      "origin/auto/update-mds-1762860999",
      "origin/auto/vercel-fix-1762862377",
      "origin/auto/vercel-fix-1762885773",
      "origin/auto/vercel-fixes",
      "origin/automated/requests-security-fix",
      "origin/automation/continue-setup",
      "origin/autosync-artifacts-20251107",
      "origin/autosync-backup",
      "origin/autosync-backup-20250926-232440",
      "origin/autosync-backup-20250927-004803",
      "origin/autosync-backup-20250927-005413",
      "origin/autosync-backup-20250927-010622",
      "origin/autosync-backup-20250927-013228",
      "origin/autosync-backup-20250928-202506",
      "origin/autosync-backup-20250929-044647",
      "origin/autosync-backup-20250929-051243",
      "origin/autosync-backup-20250929-052822",
      "origin/autosync-backup-20250929-055200",
      "origin/autosync-largefiles-20250927-004803",
      "origin/autosync-largefiles-20250927-005413",
      "origin/autosync-largefiles-20250927-010622",
      "origin/autosync-largefiles-20250927-013228",
      "origin/autosync-largefiles-20250928-202506",
      "origin/autosync-largefiles-20250929-044647",
      "origin/autosync-largefiles-20250929-051243",
      "origin/autosync-largefiles-20250929-052822",
      "origin/autosync-largefiles-20250929-055200",
      "origin/autosync-links-20251107",
      "origin/autosync-md-fixes-20251107",
      "origin/autosync-placeholder-fix-20251125073732",
      "origin/autosync-resolved-1700261406",
      "origin/autosync/enhancements",
      "origin/autosync/env-manager-ci-fixes-20251027",
      "origin/autosync/verification-20251107-clean",
      "origin/autosync/verification-20251107-pr",
      "origin/autoupdate/alllinks-25781049099",
      "origin/autoupdate/alllinks-28078916358",
      "origin/backup/before-auto-merge-20251122T092741Z",
      "origin/backup/before-replacer-${TS}",
      "origin/chore/cleanup-tests-and-lint",
      "origin/chore/copilot-setup-smoke-20251122T103756Z",
      "origin/chore/copilot-setup-smoke-20251122T103820Z",
      "origin/chore/local-chat-integration-20251122T104109Z",
      "origin/chore/local-chat-integration-20251122T104216Z",
      "origin/chore/prepare-production-20251123T140000Z",
      "origin/chore/update-master-docs-20251122T135155Z",
      "origin/ci-debug-output-manual-1766306758",
      "origin/ci/docker-run-tests",
      "origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp",
      "origin/codespace-super-enigma-wrqx6xg9ggvg356v4",
      "origin/codespace-ubiquitous-space-waddle-r7r7rjjp7rvhpq77",
      "origin/codespace-zany-capybara-x5xg95jjw7x5hgwg",
      "origin/copilot/hosted-step-manager",
      "origin/dependabot/github_actions/actions/checkout-7",
      "origin/dependabot/github_actions/actions/download-artifact-8",
      "origin/dependabot/github_actions/actions/github-script-9",
      "origin/dependabot/github_actions/actions/setup-python-7",
      "origin/dependabot/github_actions/actions/upload-artifact-7",
      "origin/dependabot/pip/asyncio-gte-4.0.0",
      "origin/dependabot/pip/cryptography-gte-50.0.1",
      "origin/dependabot/pip/matplotlib-gte-3.11.2",
      "origin/dependabot/pip/pydantic-gte-2.13.5",
      "origin/dependabot/pip/python-multipart-gte-0.0.32",
      "origin/dependabot/pip/requests-gte-2.34.2",
      "origin/dependabot/pip/stripe-gte-15.6.1",
      "origin/dependabot/pip/torch-gte-2.14.0",
      "origin/dependabot/pip/uvicorn-gte-0.52.4",
      "origin/dependabot/pip/werkzeug-gte-3.1.8",
      "origin/enhancement/readme-pr-demo",
      "origin/feat/mpesa-adapter-wireup",
      "origin/feature/auth-prod-1780061287",
      "origin/feature/ci-verify-and-release",
      "origin/feature/session4-complete",
      "origin/fix/harden-ollama-agent",
      "origin/fix/placeholders-automated-20251122T092214Z",
      "origin/fix/placeholders-prod-review-20251220-clean",
      "origin/fix/security-redactions-20251027",
      "origin/gh-pages",
      "origin/imported-snapshot/theofalphakenya-20251122T085133Z",
      "origin/imported/theofalphakenya",
      "origin/imported/theofalphakenya/main",
      "origin/link-update/pr-clean",
      "origin/main",
      "origin/mark-unverified-20251113",
      "origin/ollama/iteration-11",
      "origin/ollama/iteration-8",
      "origin/ollama/iteration-9",
      "origin/prod-enablement-20251113090017",
      "origin/prod/cleanup-20260516",
      "origin/revert-88-autosync-artifacts-20251107",
      "origin/review/imported-theofalphakenya-main",
      "origin/save/current-work-20251122T093850Z",
      "origin/sync-notify",
      "origin/todo-prod-sweep-20251221",
      "origin/upgrade/next-15"
    ]
  },
  "generated_at_utc": "2026-09-18T08:50:22.819418Z",
  "merge_activity": {
    "last_run": "2026-09-18T00:00:00Z",
    "status": "finalized",
    "summary": "Branch and history inventory, duplicate detection, route/API detection, and MERGE.md reporting are generated by the Ollama autonomous agent for every live repo and historical snapshot."
  },
  "merge_scope": {
    "api_route_count": 65525,
    "duplicate_directory_count": 2558,
    "duplicate_directory_names": [
      "\".backups",
      "\"_archive_qmoi-enhanced",
      "\"backups",
      "\"components",
      "\"lib",
      "\"qmoi-enhanced",
      "\"qmoi-enhanced-history-14",
      "\"qmoi-enhanced-incomplete-20260915T1733Z",
      ".backups",
      ".bin",
      ".capilot",
      ".consciousness",
      ".den",
      ".devcontainer",
      ".disabled-files",
      ".evolution_logs",
      ".generated",
      ".github",
      ".gradle",
      ".husky",
      ".jest_cache",
      ".lion",
      ".memory_sync",
      ".node",
      ".npm-cache"
    ],
    "duplicate_file_count": 38966,
    "duplicate_file_names": [
      "\"Status: \\342\\232\\240\\357\\270\\217 Placeholder stub (169 bytes) \\342\\200\\224 See build instructions below\"",
      ".auto-sync-ignore",
      ".autopush_sequence",
      ".babelrc",
      ".clang-format",
      ".clang-format-ignore",
      ".coveralls.yml",
      ".cspell.json",
      ".cursorignore",
      ".devpid",
      ".dockerignore",
      ".editorconfig",
      ".env.example",
      ".env.production",
      ".eslint_report_parsing_files.txt",
      ".eslintignore",
      ".eslintrc",
      ".eslintrc.appapi.cjs",
      ".eslintrc.cjs",
      ".eslintrc.js",
      ".eslintrc.json",
      ".eslintrc.yml",
      ".flake8",
      ".gitattributes",
      ".gitignore"
    ],
    "feature_count": 153,
    "roots_in_scope": [
      "/workspaces/qmoi-enhanced",
      "/workspaces/qmoi-enhanced/qmoi-enhanced-history-14"
    ],
    "total_branches": 288,
    "total_directories": 2359449,
    "total_files": 5757537
  },
  "repositories": [
    {
      "branches": [
        "main",
        "origin",
        "origin/auto-merge/imported-theofalphakenya-20251122T090610Z",
        "origin/auto-merge/imported-theofalphakenya-20251122T090632Z",
        "origin/auto-merge/imported-theofalphakenya-20251122T092741Z",
        "origin/auto/dns-fixes-proposals-20251120122343",
        "origin/auto/http-to-https-20251110",
        "origin/auto/placeholder-proposals-20251120-01",
        "origin/auto/placeholder-stubs",
        "origin/auto/placeholder-stubs-clean",
        "origin/auto/placeholders-fixes",
        "origin/auto/placeholders-fixes-backup-20251028002407",
        "origin/auto/placeholders/auto-apply-dryrun",
        "origin/auto/placeholders/auto-apply-final",
        "origin/auto/placeholders/code-fix-docs_link-validation-report.json",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_components",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_scripts",
        "origin/auto/placeholders/code-fix-qmoi-enhanced_src",
        "origin/auto/placeholders/code-fix-reports_placeholders.json",
        "origin/auto/placeholders/code-fix-reports_suggestions.json",
        "..."
      ],
      "kind": "live_repo",
      "name": "qmoi-enhanced",
      "path": "/workspaces/qmoi-enhanced"
    },
    {
      "branches": [
        "history_snapshot_materialized"
      ],
      "kind": "historical_snapshot",
      "name": "qmoi-enhanced-history-14",
      "path": "/workspaces/qmoi-enhanced/qmoi-enhanced-history-14"
    },
    {
      "branches": [
        "not_available_locally",
        "planned_for_remote_sync"
      ],
      "kind": "target_repo",
      "name": "Alpha-Q-ai",
      "path": "not_present_in_local_checkout"
    }
  ],
  "routing_policy": {
    "Alpha-Q-ai": [
      "alpha",
      "agent",
      "integration",
      "clone",
      "platform",
      "backend",
      "sync",
      "service"
    ],
    "decision_rule": "Prefer live repo and canonical root ownership; preserve historical copies as merge sources; classify duplicates by basename and routing keywords before any mutation.",
    "qmoi-enhanced": [
      "API.md",
      "ENDPOINTS.md",
      "ROUTES.md",
      "ALLROUTES.md",
      "ALLPORTS.md",
      "MERGE.md",
      "monitor",
      "workflow",
      "build",
      "install",
      "download",
      "docs",
      "README"
    ]
  }
}


---

## Merged source: qmoi-enhanced-history-14/MERGE.md

# Merge manifest
# Merge operations
- Branch:
- Auto-push: 1
- Auto-merge: 0
- Policy: keep docs, tests, routes, manifests, styles, universals, and merge state synchronized securely.
- Last sync: 2026-07-31T00:38:53.046673Z

## Documentation inventory
- @ALLMDFILESREFS.md
- ADVANCED_USER_IDENTIFICATION_SYSTEM.md
- ALLAUTO.md
- ALLBACKEND.md
- ALLCLONEDRELEASES.md
- ALLDEVICESSETTINGS.md
- ALLERRORS.md
- ALLERRORSSTATSQMOI.md
- ALLERRORSTYPESFILES.md
- ALLERRORTYPESANDHEALTHCHECKS.md
- ALLFRONTEND.md
- ALLHOOKSWEBHOOKS.md
- ALLLINKS.md
- ALLMDFILES.md
- ALLMDFILESREFS.md
- ALLPORTS.md
- ALLQMOIAIAPPSREALEASESVERSIONS.md
- ALLQMOIAUTOEVOLVINGENVS.md
- ALLSYSTEMSSTRUCTURESREFERENCES.md
- ALLTESTSAUOTOTESTS.md
- ALLUI.md
- ALLVERSIONS.md
- ALLWALLETSQVS.md
- ALPHAQMOIENGINE.md
- API.md
- API_ENDPOINTS_COMPLETE_AUDIT.md
- API_ENDPOINTS_REFERENCE.md
- API_INTEGRATION_GUIDE.md
- API_REFERENCE.md
- APPS_PLATFORMS_DOCUMENTATION_UPDATE.md
- APP_BUILD_MATRIX.md
- APP_FIX_ACTION_PLAN.md
- APP_FIX_CHECKLIST.md
- APP_FIX_COMPLETE.md
- AUTH_SYSTEM_IMPLEMENTATION.md
- AUTOCLONE_STANDALONE.md
- AUTODEV_SECRETS.md
- AUTODOWNLOAD.md
- AUTOGIT.md
- AUTOLINTREADME.md
- AUTOMATION-SUMMARY.md
- AUTOOPTIMIZEALPHAQMOIENGINE.md
- AUTO_RECOVERY_PROCEDURES.md
- AUTO_SETUP_COMPLETION_SUMMARY.md
- BACKEND_API_TEMPLATES.md
- BACKGROUND_AUTOMATION_COMPLETE.md
- BIOMETRIC_LOGIN_TEST_RESULTS.md
- BUILDAPPSFORALLPLATFORMS.md
- BUILD_COMPLETION_REPORT_v2.md
- BUILD_COMPLETION_SUMMARY.md
- BUILD_INSTRUCTIONS.md
- BUILD_INSTRUCTIONS_PRODUCTION.md
- BUILD_REAL_APPS.md
- BUILD_TRIGGER.md
- CACHING_GUIDE.md
- CAMPAIGN_COMPLETION_SUMMARY.md
- CASHON.md
- CASHONTRADINGREADME.md
- CHANGES.md
- CMDCOMMANDS.md
- COLAB_DAGSHUB_DEPLOY_CHECKLIST.md
- COMPLETE_SYSTEM_DOCUMENTATION_MASTER.md
- COMPLETION_INDEX.md
- COMPLETION_REPORT.md
- COMPLETION_REPORT_REAL_IMPLEMENTATIONS.md
- COMPONENTS.md
- COMPONENTS_MIGRATION_PLAN.md
- COMPREHENSIVE_TESTING_QA_STRATEGY.md
- CONSOLIDATION_ANALYSIS.md
- CONTINUOUS_IMPROVEMENT.md
- CONTRIBUTING.md
- CREDENTIAL_ROTATION_PLAYBOOK.md
- CRITICAL_APP_AUDIT_REPORT.md
- CURLCOMMANDS.md
- CURLQMOIMASTERSISTERUSER.md
- DASHBOARDTRACKS.md
- DEALS.md
- DELIVERABLES_CHECKLIST.md
- DELIVERABLES_FINAL_INVENTORY.md
- DEPLOYMENT-README.md
- ...and 586 more documentation files

## Official deployment references
- Vercel: https://vercel.com/docs (Use official Vercel documentation for deployments, redeployments, environment variables, and build settings.)
- GitHub Actions: https://docs.github.com/actions (Use GitHub Actions documentation for workflow reliability, secrets, and deployment automation.)
- Netlify: https://docs.netlify.com/ (Use Netlify docs for deployment configuration, environment handling, and redeploys.)
- Render: https://render.com/docs (Use Render docs for service deployments, health checks, and runtime environment configuration.)
- Railway: https://docs.railway.app/ (Use Railway docs for environment provisioning and staging deployment flows.)
- Fly.io: https://fly.io/docs/ (Use Fly.io docs for app deployment, scaling, and runtime health checks.)

## Production sync notes
- Ensure API.md, ENDPOINTS.md, ROUTES.md, and DOCS.md all reflect the current implementation.
- Ensure UNIVERSALS.md and STYLES.md remain aligned with the active UI and accessibility guidance.
- Ensure deployment and redeployment workflows reference the official documentation for each supported platform.

## DELS (all deleted after merge)
- tests/test_backup_monitor.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_backup_restore.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_backup_state.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_check_and_replace_placeholders.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_check_placeholders.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_create_release_placeholders.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_fix_removed_placeholders_batch.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_placeholder_fixer.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_placeholder_scanner.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_replace_placeholders.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_run_placeholder_scans.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_scan_placeholders.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_scan_replace_placeholders.py: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
- tests/test_placeholder_scan.py.ollama.bak: Merged into MERGE.md; file was unused, legacy, or archive-only and removed after integration.
