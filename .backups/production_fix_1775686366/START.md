---
title: "QMOI Start Guide"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Start Guide

## 🚀 How to Start or Resume QMOI (QCity & Cloud)

To ensure QMOI is always running (even in the cloud or when your prodice is offline), use the following command:

```bash
python scripts/qmoi-start.py
```

- This script will:
  - Check if QMOI is already running (locally or in the cloud)
  - Show the status of the running system
  - If not running, it will start/resume all QMOI automation, error fixing, and cloud features (QCity, Colab, Dagshub, etc.)
  - Ensure all features are always-on and self-healing

## 📊 Status

- The script will display the current status and health of QMOI, including error fixing, cloud sync, and notifications.

## 🧪 prodeloper Quick Start

- Run prod server: `npm run prod` (local: https://qmoi.ai)
- Check prod server health: `npm run prod:health` (returns non-zero exit code if unreachable)
- Run tests: `npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`
- Build (CI style): `npm run ci:build`

Local QM OI helper server (for quick persona and memory tests):

- Start the local helper server (Python):

  ```bash
  python3 scripts/qmoi_local_server.py
  ```

- data: send a chat in "master" persona (curl):

  ```bash
  curl -sS -X POST http://127.0.0.1:8080/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"system","content":"master"},{"role":"user","content":"How are you doing today?"}]}'
  ```

  Expected snippet of reply:

  ```text
  [Master Mode] At your command. You said: How are you doing today?
  I will respond according to master-level persona with direct, authoritative guidance.
  ```

- Inspect memory saved by helper server:

  ```bash
  curl -sS http://127.0.0.1:8080/memory | jq .
  ```

- Trigger a sync push (no backends configured by default):

  ```bash
  curl -sS -X POST http://127.0.0.1:8080/sync/push
  # Expected: {"ok": true, "details": ["no_backends_configured"] }
  ```

## 🚀 production

- Build and start (sophisticated):
  - `npm run ci:build`
  - `NODE_ENV=production npm start`
- Daemonize with systemd (data):
  - Copy the repo to the target host (e.g. `/opt/qmoi`)
  - Run `sudo ./scripts/install-systemd-service.sh /opt/qmoi` (this will create `/etc/systemd/system/qmoi.service`, enable and start it)
- PM2: `npm run start:prod:pm2` (uses `ecosystem.config.js`)
- Docker (multi-stage):
  - `docker build -t qmoi-enhanced:latest .`
  - `docker run -p3000:3000 qmoi-enhanced:latest`
- Docker Compose (production):
  - `docker compose -f deploy/docker-compose.prod.yml up -d`

**CI/CD & Deploy:**

- A GitHub Actions workflow `/.github/workflows/ci-cd.yml` now builds and (when configured) pushes a Docker image to GHCR and can optionally deploy it to a host via SSH.
- To enable automated deploys, set the repository secrets `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_SSH_KEY`. For GHCR pushes ensure `packages: write` permission (GITHUB_TOKEN or a PAT).
- Use `scripts/host-provision.sh` on the host to copy systemd units, enable PM2 startup, or pull a new image and restart the PM2 process (see `docs/DEPLOY.md`).

### MSW & Testing Notes

- MSW is initialized at test-time via `src/setupTests.ts` and provides a global promise `globalThis.__MSW_READY__` that tests can await.
- If you see unhandled network requests during tests, set `SHOW_MSW_UNHANDLED=1` to see them; use `TEST_VERBOSE=1` for extra handler debug output.

- See `CONTRIBUTING.md` for more prodeloper testing notes and troubleshooting steps (MSW handler shapes, env flags, and common fixes).

## 🛡️ Always-On

- QMOI is designed to keep running in the cloud, so you never miss an event or fix—even if your prodice is offline.

### 🔒 Model policy

- QMOI now enforces a canonical model name `qmoi` (the QMOI aggregator) across the system; runtime overrides are ignored for safety and determinism.
- The local helper server no longer accepts environment or query-based model overrides and reports its health with `model: "qmoi"`.
- The model backup worker's interval configuration had a path bug that has been fixed to respect `ai.model.backup_interval` with a safe default.
- QMOI now exposes an aggregator that combines local and (optionally) cloud model outputs into a single response; a backup is performed after aggregation events to persist metrics and state.

---

**QMOI: Always-on, self-healing, and fully automated.**

<!-- QMOI_VALIDATION_START -->

{
"file": "START.md",
"validated_at": "2025-10-26T20:51:22.641823Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Start Guide"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:28Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

