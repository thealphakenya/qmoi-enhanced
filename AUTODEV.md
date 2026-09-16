# AUTODEV.md - Autonomous Development Framework

## Overview
This document formalizes how the QMOI automation stack should behave while operating autonomously across repositories and validation workflows.

## Autonomous Capabilities
- read and apply instructions from repo docs
- monitor workflow health
- repair broken scripts and YAML
- self-resume after interruption
- validate app and platform matrix
- maintain documentation inventory
- synchronize repo state across branches and repos
- audit tracked dependency manifests and apply package-manager security fixes
- validate JSON, Python, YAML, JavaScript, TypeScript/TSX, Markdown, and workflow files
- open or update a remediation PR against the repository default branch with evidence
- retry transient CI and deployment failures with bounded attempts and preserve diagnostics

## Autonomous Safety Contract

AutoDev is deterministic first. It may apply package-manager fixes, formatting,
syntax repairs, generated documentation updates, and other changes with a
reproducible command and passing validation. It must never invent credentials,
claim a Vercel or GitHub check passed without querying that check, merge an
ambiguous conflict, or rewrite arbitrary application code merely to make a
status green. Unresolved issues are recorded with the failing command, commit,
workflow URL, and next safe action.

Every autonomous cycle operates from the trusted repository default branch,
uses a dedicated branch or pull request for mutations, runs the complete
validation matrix, and only enables auto-merge after required checks pass.
Scheduled cycles are idempotent, bounded, concurrency-protected, and restartable.

## Continuous Remediation Loop

1. Discover the default branch, remotes, open remediation PRs, workflow runs, Vercel checks, and security alerts.
2. Snapshot tracked manifests and source inventories before mutation.
3. Apply only package-manager or deterministic file repairs; preserve failed artifacts.
4. Validate dependency audits, syntax, tests, links, workflows, build/deploy checks, and merge provenance.
5. Update the report, `oe2.txt`, checkpoints, and model-card evidence.
6. Push a remediation branch or update an existing PR; request auto-merge only when policy permits.
7. Re-query the remote default branch and repeat until no actionable alert remains or an explicit permission/provider blocker is recorded.

"Forever" means restartable scheduled operation with bounded work per cycle,
not an unbounded process or a guarantee against outages, revoked permissions,
incompatible upstream releases, or ambiguous defects.

## Execution Model
1. Detect repository state
2. Validate core contracts
3. Repair missing or corrupted files
4. Run validation suite
5. Record checkpoints
6. Update docs and progress markers
7. Push or prepare PR state when appropriate

## Success Criteria
The autonomous development process is considered successful when:
- tests pass
- doc inventory is complete
- workflows are valid
- recovery logic remains active
- repo state remains accessible and consistent
