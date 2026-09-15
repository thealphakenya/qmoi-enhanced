Title: chore(repo): tidy docs/config, add local QMOI adapter/gateway & remaining-placeholder report

Summary
-------
This draft PR contains the work to make QMOI discoverable and runnable locally in Codespaces (offline-first), reduce large automated edits to dependencies, and produce a reviewable report of remaining placeholder tokens across the repository.

Branches
--------
- Working branch: `auto/placeholders-fixes` (contains cleaned docs/config/QMOI infra and scripts)
- Backup branch: `auto/placeholders-fixes-backup-20251028002407` (preserves the original broad auto-fix commit)

Key changes
-----------
- Local QMOI adapter and gateway: `services/qmoi_adapter/*`, `qmoi-model-manifest.json`, Capilot discovery hints in `.capilot/`
- `.qmoi/config.json` updated to prefer local models and default to `gpt-5-mini` where applicable
- Memory/progress services and snapshotter: `scripts/qmoi_memory_service.py`, `scripts/qmoi_progress_tracker.py`, `scripts/qmoi_workspace_snapshot.py`
- Persistent webhook dispatcher and retry queue: `scripts/webhook_dispatcher.py` and `.qmoi/webhook_queue.json`/`.qmoi/webhook_log.json`
- Watchdog and runner scripts to keep services alive: `scripts/watchdog.sh`, `scripts/qmoi_agent_runner.sh`
- Placeholder scanning & safe auto-fix tooling (docs/config only): `scripts/find_placeholders.py`, `scripts/auto_fix_placeholders_docs.py`, `scripts/generate_placeholders_remaining.py`
- Generated report of remaining placeholders: `reports/placeholders_remaining.json` (389 files remain — code-level placeholders)
- Regenerated `ALLMDFILESREFS.md` and supporting generator scripts.

Why this PR
-----------
- Makes a local QMOI model available to Capilot and Codespaces without remote calls.
- Reduces bandwidth and Codespace churn with Lion settings and offline-first helpers.
- Keeps a safe backup of the aggressive auto-fix commit and reverts vendor/dependency directories to avoid supply-chain and build noise.
- Produces a focused report for human review of remaining code-level placeholders so we can avoid risky automated code edits.

How to review
-------------
1. Start by reviewing the `PULL_REQUEST_DRAFT.md` summary and the `reports/placeholders_remaining.json` (top-level count and sample entries).
2. Verify presence of Capilot discovery files: `.capilot/models/qmoi.json` and `qmoi-model-manifest.json`.
3. Check the docs and scripts in `scripts/` for idempotence and correctness (`scripts/ensure_local_only.sh`, `scripts/register_qmoi_local.sh`).
4. Run the smoke tests locally (see `scripts/qmoi_smoke_test.sh`) to validate adapter/gateway/memory endpoints.

Next steps before merging (recommended)
-------------------------------------
- Human-triage remaining `reports/placeholders_remaining.json` (389 files). For code-level placeholders prefer creating small PRs with conservative stubs (raise NotImplementedError) and targeted tests.
- Add a CI job to vendorize external assets and run the docs auto-fixer only on whitelisted paths.
- Optionally open small PRs to fix the highest-priority placeholder files.

PR creation link
-----------------
You can create a PR for this branch using the GitHub web UI:

https://github.com/thealphakenya/qmoi-enhanced/pull/new/auto/placeholders-fixes

Backup branch PR (if you want to review the original auto-fix):

https://github.com/thealphakenya/qmoi-enhanced/pull/new/auto/placeholders-fixes-backup-20251028002407

Notes
-----
- `gh` (GitHub CLI) is not installed in this Codespace, so the PR is not auto-opened here. The branches are pushed and tracking the remote.
- The `reports/placeholders_remaining.json` is intentionally included to make triage easier for reviewers.

Signed-off-by: automation agent
