# QMOI Agent — Features & Setup

This document explains the QMOI local agent, its endpoints, enhancements (30+), and how to use it in Capilot chat or VS Code/Lion-enhanced Codespaces.

Quick start

1. Register the model manifest:

```bash
./scripts/register_qmoi_local.sh
```

2. Start core services (adapter, memory, progress):

```bash
./scripts/qmoi_agent_runner.sh
```

3. Optionally start the gateway (aggregates endpoints):

```bash
python3 services/qmoi_adapter/gateway.py &
```

Core endpoints

- Adapter (chat/todos/manifest): http://127.0.0.1:8765
- Memory service: http://127.0.0.1:8766
- Progress tracker: http://127.0.0.1:8767
- Gateway (aggregated): http://127.0.0.1:8770

Recommended Capilot integration

- Point Capilot model discovery to `http://localhost:8770/v1/models` or `http://localhost:8765/manifest`.
- When the model is selected, Capilot can call `POST http://localhost:8770/v1/chat` to chat and `GET http://localhost:8770/v1/memory` to access persistent memory.

30+ enhancements (what was added)

1. Lightweight local adapter (stdlib only) to avoid external bundles.
2. /v1/chat endpoint (adapter) with deterministic echo behavior for low-bandwidth.
3. /v1/todos support for storing and modifying TODO items.
4. Local model manifest (`qmoi-model-manifest.json`) for discovery.
5. Capilot local discovery config (`.capilot/models/qmoi.json`).
6. Register script (`scripts/register_qmoi_local.sh`) to copy manifest.
7. Start helper (`scripts/start_qmoi_adapter.sh`) to run adapter in background.
8. Memory service (`scripts/qmoi_memory_service.py`) with checkpoints and export.
9. Progress tracker (`scripts/qmoi_progress_tracker.py`) to track task progress.
10. Workspace snapshotter (`scripts/qmoi_workspace_snapshot.py`) to create lightweight project index.
11. Gateway aggregator (`services/qmoi_adapter/gateway.py`) to present unified endpoints for Capilot.
12. Agent runner (`scripts/qmoi_agent_runner.sh`) to keep services always-on.
13. Low-bandwidth optimizer (`scripts/optimize_qvs.sh`) to set environment limits in Codespaces.
14. `docs/QMOI_ADAPTER.md` and `docs/QMOI_AGENT.md` for usage and integration.
15. Webhook registration endpoint on gateway to let Capilot register event hooks.
16. Aggregated /v1/models to surface both local and configured remote models.
17. /v1/sync action to checkpoint memory on demand.
18. Simple local backup strategy for memory checkpoints (.qmoi/memory.checkpoint.*).
19. Declarative `.qmoi/config.json` wiring for discovery and model toggles.
20. `vendor/placeholder.svg` and docs cache support for low-bandwidth docs.
21. Smoke-test script (added separately) to validate endpoints.
22. Safe auto-fixer for docs and config (existing) to reduce placeholders.
23. Local webhooks persistence under `.qmoi/webhooks.json`.
24. Settings endpoint in gateway to expose local config to Capilot.
25. Snapshot endpoint to let Capilot get workspace overview (file counts, top files).
26. Progress endpoints to let the model record and report long-running task state.
27. Memory merge semantics (shallow merge) to reduce conflicts in low-bandwidth scenarios.
28. Checkpoint export endpoint to allow Capilot to request backups.
29. Minimal logs under `logs/` and `qmoi-data/` for offline debugging.
30. Clear instructions to register and use the QMOI model in Capilot and Codespaces.

Additional ideas implemented as light features

- Simple webhook support so Capilot UI can register callbacks when memory or progress changes.
- Gateway health that aggregates underlying services.
- Proxy chat endpoint so Capilot needs only one place to call (`/v1/chat`).

Notes and next steps

- These are intentionally small, dependency-free building blocks. For production-grade behavior (large memory, reliable conflict resolution, secure auth, real model hosting), deploy server-side services with proper persistence and authentication.
- If you want, I can now: (A) push this branch and open a PR, (B) prune the large earlier auto-fix commit to remove node_modules edits, or (C) add Capilot extension bits to automatically detect and show QMOI in the UI.
