Auto Sync (auto_sync.sh)
=========================

Purpose
-------
`scripts/auto_sync.sh` is a safe, best-effort script to keep your local branch synchronized with the remote. It:

- Fetches the latest `TARGET_BRANCH` from `REMOTE`.
- Stashes local changes, rebases onto remote, or falls back to merge if necessary.
- Runs formatters/linters and tests (best-effort) and commits any auto-fix changes when `AUTO_COMMIT=true`.
- Pushes the branch back to the remote using `--force-with-lease` where required.

Usage
-----
Run from the repository root:

```bash
bash scripts/auto_sync.sh
```

Environment variables
---------------------
- `TARGET_BRANCH` (default: `main`) — branch to sync against
- `REMOTE` (default: `origin`) — remote name
- `AUTO_COMMIT` (default: `true`) — whether to commit auto-fix changes
- `GITHUB_TOKEN` — optional token used by scripts that interact with GitHub API

Examples
--------
Sync with an alternative branch:

```bash
TARGET_BRANCH=develop bash scripts/auto_sync.sh
```

Notes & Limitations
-------------------
- The script is best-effort and cannot resolve complex merge conflicts automatically.
- For production repos with branch protection, automatic pushes/merges may be blocked.
- Review backup branches created in case of diverged histories.
