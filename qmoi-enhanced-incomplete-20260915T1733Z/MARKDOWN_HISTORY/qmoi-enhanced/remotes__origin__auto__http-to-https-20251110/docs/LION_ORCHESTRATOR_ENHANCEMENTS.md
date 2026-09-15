---
title: "LION Orchestrator Enhancements"
qmoi_validation_frontmatter: true
---

# LION Orchestrator Enhancements

This document describes the enhanced LION orchestrator (`scripts/lion_orchestrator.py`) and how it integrates with the repository's validation and remediation systems.

## Goals

- Make the orchestrator more robust, extensible, and observable.
- Keep a conservative default (dry-run, proposal-only) to avoid unexpected pushes or merges.
- Provide a clear plugin model so new handlers can be added without changing core logic.
- Improve task scheduling, deduplication, retries, and graceful shutdown.

## Key Features (implemented)

1. Config loader: `.qmoi_validation/lion_config.json` with environment overrides.
2. Plugin registry: load Python modules from `scripts/lion_plugins/` (optional).
3. Priority queue scheduling: tasks processed by numeric `priority` then creation time.
4. Concurrency: configurable worker pool via `concurrency` setting or CLI `--concurrency`.
5. Retry/backoff: exponential backoff with jitter for transient failures.
6. Deduplication: tasks are deduped by `id` and by a computed signature stored in history.
7. Persistent history: `.qmoi_validation/lion_history.json` stores processed tasks and signatures.
8. In-flight persistence: `.qmoi_validation/lion_inflight.json` records running tasks to allow safe restarts.
9. Dry-run / execute / simulate modes: default is dry-run (non-destructive).
10. Integration with `scripts/qmoi_todos.py`: handler code creates todos for proposed fixes.
11. Graceful shutdown: SIGINT/SIGTERM handled; stop accepting new tasks and let running workers finish.
12. Conservative handler implementations produce PR proposals under `.qmoi_validation/pr_proposals/`.

## Handlers

Core handlers included in the orchestrator:

- `build_remediation` — re-runs `scripts/validate_builds.py` (if not dry-run) and creates a PR proposal.
- `remediation` — for generic remediation tasks; delegates workflow fixes to `scripts/auto_fix_workflows.py` when appropriate.

Handlers are registered using the `@handler('name')` decorator. Use the plugin directory to register additional handlers.

## Plugin model

Drop Python files into `scripts/lion_plugins/`. Each file should import the `handler` decorator and register handlers. Example:

```py
from scripts.lion_orchestrator import handler

@handler('my_task')
def handle_my_task(task, cfg, metrics, history, dry_run=True):
    # implement
    pass
```

When the orchestrator runs, it will attempt to import all modules under `scripts/lion_plugins/` (best-effort).

## Config schema (example)

Create or edit `.qmoi_validation/lion_config.json` with contents like:

```json
{
  "max_retries": 3,
  "retry_backoff_base": 2.0,
  "retry_jitter": 0.3,
  "default_priority": 50,
  "dry_run": true,
  "concurrency": 2,
  "auto_create_todos": true,
  "enable_plugins": true
}

## Notifications (opt-in)

The orchestrator supports optional outbound notifications for important events (run recorded, proposal created, todo created). Notifications are strictly opt-in and must be enabled in `.qmoi_validation/lion_config.json` or via environment overrides.

Example keys (see `.qmoi_validation/lion_config.example.json`):

- `notify_webhook` — the HTTPS endpoint to POST JSON events to.
- `notify_hmac_secret` — optional HMAC secret used to sign payloads with SHA256. The signature is set in the `X-QMOI-Signature` header as `sha256=<hex>`.
- `allow_outbound_notifications` — must be true to allow outbound HTTP calls.
- `notify_max_attempts` — number of attempts for transient webhook failures.

Important: never commit real secrets into the repository. Use CI/secrets or environment variables to provide `notify_hmac_secret` in production.
```

CLI overrides: `--execute` flips dry-run off, `--concurrency` overrides concurrency.

## Usage

Run in dry-run (default):

```bash
python3 scripts/lion_orchestrator.py
```

Run with execution enabled (will run delegated scripts where handlers call them):

```bash
python3 scripts/lion_orchestrator.py --execute
```

Limit tasks processed:

```bash
python3 scripts/lion_orchestrator.py --limit 10
```

Run with more parallelism:

```bash
python3 scripts/lion_orchestrator.py --execute --concurrency 4
```

## Where outputs are written

- PR proposals and patch proposals: `.qmoi_validation/pr_proposals/`
- History: `.qmoi_validation/lion_history.json`
- In-flight: `.qmoi_validation/lion_inflight.json`
- Metrics: `.qmoi_validation/lion_metrics.json`

## Next recommended improvements (todo)

- Add a small HTTP metrics/health endpoint for scraping/monitoring.
- Add unit tests around task parsing, queue ordering, retry/backoff and signature dedup.
- Add a webhook ingestion CLI to insert tasks from external events.
- Implement conservative auto-approval heuristics and audit trail for auto-approved changes.
- Add a `pr_branches/` local branch creation workflow for proposal testing and batched PRs.

## Notes & Safety

The orchestrator is conservative by default. Avoid adding credentials into the repository. If you need fully autonomous publishing, configure CI secrets and guarded workflows that call `scripts/release_automation.py` with proper safeguards.

---

Document created by the automation improvements in the repository.
