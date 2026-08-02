# Branch strategy for qmoi-enhanced

## Default branch

- The primary default branch for normal development and production-safe changes is `main`.
- `main` should be the branch that repository automation, release workflows, and default pull requests target.

## Backup autosync branch

- The branch `autosync-backup-20250926-232440` remains the backup autosync branch for automated sync and recovery workflows.
- It is intended to receive autonomous agent updates, backup snapshots, and recovery-oriented sync work when `main` is not the active target.
- The auto-agent should prefer `main` for routine operations, but can still push to the autosync branch when explicitly requested or when the workflow is running from that branch.

## How the branches work together

1. `main` is the default branch for human-led and production-facing work.
2. `autosync-backup-20250926-232440` is the recovery/sync branch that mirrors automation state and preserves autonomous-agent progress.
3. GitHub Actions should trigger on pushes to both branches, but the autonomous agent should default to `main` unless the workflow is explicitly targeting the autosync branch.
4. Pull requests should normally target `main`; autosync branch updates should be reviewed separately or merged into `main` once validated.

## Alpha Q AI repository alignment

- The `alpha q ai` repository under the same GitHub owner should follow the same branch model: `main` as the primary default branch and an autosync backup branch for recovery and sync work.
- Shared automation should keep both repositories aligned on the same branch naming convention and default-branch intent.
