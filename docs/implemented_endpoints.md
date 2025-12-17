---
title: "implemented endpoints"
qmoi_validation_frontmatter: true
---

# implemented endpoints

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

Implemented endpoints discovered in repository (auto-generated)

Date: 2025-10-22

This file lists HTTP endpoints found by scanning the codebase. For each endpoint include method, path, source file, and observed notes.

-- qmoi_control_server.py (Flask)

- POST /webauthn/register/options — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /webauthn/register/complete — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /webauthn/authenticate/options — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /webauthn/authenticate/complete — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /control — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /ai — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /signup — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /login — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /logout — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /sync-memory — /workspaces/qmoi-enhanced/qmoi_control_server.py
- GET /memories — /workspaces/qmoi-enhanced/qmoi_control_server.py
- GET /health — /workspaces/qmoi-enhanced/qmoi_control_server.py
- GET /mirror/app/<appname>/... — /workspaces/qmoi-enhanced/qmoi_control_server.py
- GET /mirror/raw/<path> — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /admin/backup-db — /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST /admin/update-ngrok — /workspaces/qmoi-enhanced/qmoi_control_server.py

-- ai-anomaly-service.py (Flask)

- POST /detect-anomaly — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- GET /parse-log — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- GET /analytics — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- GET /export-analytics — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- POST /alert — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- POST /monitor — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- GET /monitor/status — /workspaces/qmoi-enhanced/ai-anomaly-service.py
- GET /analytics/hourly — /workspaces/qmoi-enhanced/ai-anomaly-service.py

-- downloadqmoiaiexe.py (FastAPI)

- POST /api/qmoi/download-exe — /workspaces/qmoi-enhanced/downloadqmoiaiexe.py

-- api/qcity.ts (Express/TS)

- GET /status
- GET /config
- POST /start
- POST /stop
- POST /configure-platforms
- POST /enable-features
- POST /monitor-resources
- GET /notifications
- GET /tasks
- GET /resources
- GET /logs
- GET /workspace-logs
  (source: /workspaces/qmoi-enhanced/api/qcity.ts)

-- huggingface_space/server.js

- GET /health — /workspaces/qmoi-enhanced/huggingface_space/server.js

-- webhook endpoints

- POST /api/github/webhook — /workspaces/qmoi-enhanced/QMOIGITHUBAPP.md (example)

Notes:

- Some endpoints are implemented as examples or placeholders; test or confirm each in a staging environment before assuming production readiness.
- The control server contains admin endpoints which may require `QMOI_CONTROL_TOKEN` or other env vars.

Next steps:

1. Update `API.md` to include the above endpoints and mark verified ones (from prior integration run) with a ✅.
2. Add an attachments endpoint to `qmoi_control_server.py` to accept attachment metadata (id, name, size, mime, dataUrlPreview) and persist to `qmoi.db`.
3. Add a supervisor script to start and health-check core servers locally.
4. Run integration tests for `qmoi_control_server.py` and other server test suites.

<!-- QMOI_VALIDATION_START -->

{
"file": "docs/implemented_endpoints.md",
"validated_at": "2025-10-26T20:51:24.582040Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": false,
"detail": "No H1 title found"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": false,
"summary": {
"total_checks": 2,
"passed": false
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
