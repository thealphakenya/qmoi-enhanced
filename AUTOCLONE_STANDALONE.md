<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.786697Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
## CI/CD Workflow Status

![Docker Build & Push](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/docker-build-push.yml/badge.svg)

## Troubleshooting & Validation

1. Check the health endpoint:

```bash
curl https://qvillage.com/health
# Should return: OK
```

2. Check GitHub Actions workflow status:

- Go to the Actions tab in your GitHub repo and confirm all jobs are green.

3. If the container fails to start, check logs:

```bash
docker logs <container_id>
```

4. For QCity auto-update, confirm systemd timer and service are enabled and running:

```bash
systemctl status qvillage-update.timer
systemctl status qvillage-update.service
```

## Health Check Endpoint

The standalone runner exposes a health check endpoint at `https://qvillage.com/health` (configurable via `HEALTH_PORT` env var).

data:

```bash
curl https://qvillage.com/health
# Returns: OK
```

## Usage: Docker

```bash
docker build -f Dockerfile.qvillage -t qvillage-standalone:latest .
docker run -d --restart=always -e HF_API_TOKEN=... -e SLACK_WEBHOOK_URL=... -e HEALTH_PORT=8080 qvillage-standalone:latest
```

## Usage: Docker

```bash
docker build -f Dockerfile.qvillage -t qvillage-standalone:latest .
docker run -d --restart=always -e HF_API_TOKEN=... -e SLACK_WEBHOOK_URL=... -e HEALTH_PORT=8080 qvillage-standalone:latest
```

# Autoclone & Standalone Mode — QMOI / QVillage

This short guide explains the autoclone + standalone runner mode so QMOI/QVillage can run independently of any external hosting platform.

Files added to repo (ready-to-use):

- `tools/autoclone_and_run.sh` — entrypoint that clones/updates the repository into `REPO_DIR` (default: `/opt/qvillage`), installs optional requirements, then launches the standalone runner.
- `tools/standalone_runner.py` — attempts to import `QVillageSyncEngine` from `tools/qvillage_memory_sync.py` and run its `run_full_sync()` loop; falls back to executing the script as a subprocess.
- `Dockerfile.qvillage` — container image optimized to run the autoclone entrypoint and runner.

Principles:

- Platform-agnostic: works with Docker, systemd, Kubernetes, or bare metal.
- Safe defaults: `RUN_INTERVAL_SECONDS=3600` (hourly), set `RUN_INTERVAL_SECONDS=0` to run once and exit.
- Configurable: pass `REPO_URL`, `REPO_BRANCH`, `REPO_DIR`, `HF_API_TOKEN`, and other env vars at runtime.
- Skips: set `SKIP_AUTOCLONE=1` to avoid cloning (useful when mounting your repo into container), `SKIP_DEP_INSTALL=1` to skip pip installs at startup.

Quick Docker run (now):

```bash
# Build the image
docker build -f Dockerfile.qvillage -t qvillage-standalone:latest .

# Run container (auto-clones the repo into /opt/qvillage inside the container)
docker run -d --restart=always \
  -e REPO_URL=https://github.com/thealphakenya/qmoi-enhanced.git \
  -e REPO_BRANCH=main \
  -e REPO_DIR=/opt/qvillage \
  -e RUN_INTERVAL_SECONDS=3600 \
  -e HF_API_TOKEN=$HF_API_TOKEN \
  -e SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL \
  qvillage-standalone:latest
```

One-shot run (no loop):

```bash
docker run --rm \
  -e RUN_INTERVAL_SECONDS=0 \
  -e SKIP_DEP_INSTALL=1 \
  qvillage-standalone:latest
```

systemd data (if you don't use Docker):

```ini
[Unit]
Description=QVillage Autoclone + Sync
After=network-online.target

[Service]
Type=simple
User=qvillage
ExecStart=/usr/bin/env bash /opt/qvillage/tools/autoclone_and_run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Notes & required env vars:

- `REPO_URL` — URL of this repository (default: `https://github.com/thealphakenya/qmoi-enhanced.git`)
- `REPO_BRANCH` — branch to clone (default: `main`)
- `REPO_DIR` — destination directory (default: `/opt/qvillage`)
- `RUN_INTERVAL_SECONDS` — loop interval; `0` runs once and exits; default is `3600` (1 hour)
- `HF_API_TOKEN` — hugging face token used by the sync engine (optional if running with local fallbacks)
- `SLACK_WEBHOOK_URL` — optional for notifications

Security:

- Keep secrets out of the image — pass them at runtime as environment variables or use your cloud provider's secret manager.
- If you mount the repo into `REPO_DIR`, set `SKIP_AUTOCLONE=1` to avoid accidental overwrites.

Support:

If you see errors during autoclone or execution, check container logs (`docker logs <container>`), then inspect `/opt/qvillage/tools/` for the cloned source and run `python tools/standalone_runner.py --dry-run` locally to reproduce errors.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
