# Running QMOI Enhanced Locally (Dev Quick Start)

This document describes how to run the Python services, the dashboard and the demo betting system locally for development.

Requirements
- Python 3.12
- Virtual environment (recommended)
- Node 18+ and npm (optional, for UI dev); or Docker if you prefer containers

Quick start (Python-only)
1. Create and activate venv:
```bash
python3 -m venv .venv
. .venv/bin/activate
```
2. Install server requirements (FastAPI, Flask, FIDO2, etc.) and betting requirements:
```bash
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements/server_requirements.txt
.venv/bin/python -m pip install -r requirements/betting_requirements.txt
```
3. Start the services in separate terminals (or use background processes):
- Start the FastAPI backend (API & docs):
  ```bash
  .venv/bin/python scripts/qmoi-space-backend.py &> /tmp/qmoi_space_backend.log &
  ```
- Start the dashboard (reads status and recent logs):
  ```bash
  .venv/bin/python scripts/serve_dashboard.py &> /tmp/qmoi_dashboard.log &
  ```
- Start the control server (Flask) on port 8100 by default. It is a protected API and requires a token for control commands:
  ```bash
  QMOI_CONTROL_TOKEN=dev-token QMOI_DEV_FORCE_TOKEN=true .venv/bin/python qmoi_control_server.py &> /tmp/qmoi_control_server.log &
  ```
- Start the betting system for a short test run (3s intervals by default in `run_betting_once.py`):
  ```bash
  .venv/bin/python scripts/run_betting_once.py
  ```

Open in browser
- Dashboard quick view: http://localhost:8001/
- FastAPI documentation: http://localhost:8000/api/docs
- Control server API: http://localhost:8100/ (protected endpoints like `/control` require an Authorization header)
 - Logs server (dev): http://localhost:8002/ (serves `logs/` directory)

Control server authentication (dev)
- CONTROL_TOKEN is used for simple control access during development.
  In production use a secure secret store and the secure enablement procedure described in `SECURITY_PRODUCTION_SETUP.md`.

Example to call the control endpoint using the default dev token (`dev-token`):
```bash
curl -X POST http://localhost:8100/control \
  -H "Authorization: Bearer dev-token" \
  -H 'Content-Type: application/json' \
  -d '{"command":"navigate","target":"/apps/qmoi"}'
```

Quick test script for control API (python):
```bash
# After starting the control server, run:
python3 scripts/test_control_endpoint.py
```

Notes
- Port conflicts: the backend defaults to 8000, the dashboard to 8001, and the control server to 8100 (adjust with env var `QMOI_CONTROL_SERVER_PORT` if needed).
- For the full Node/Next.js app, either use your local Node 18+ or Docker Compose:
  ```bash
    # Optional: run pre-checks to find Node/Module compatibility issues
    npm run check-dev || true
    ./scripts/dev_up.sh
  # or
  docker-compose up --build
  ```
 - Quick start (Node replaced by Docker if Node is missing):
 ```bash
 # This script will detect Node/Docker and run the appropriate commands.
 chmod +x ./scripts/dev_prepare_and_run.sh
 ./scripts/dev_prepare_and_run.sh
 ```
- Security: Real funds are disabled by default. See `SECURITY_PRODUCTION_SETUP.md` to enable real funds securely.
 - Note: The dev supervisor exports `QMOI_DEV_FORCE_TOKEN=true` by default so the control server will accept the default `dev-token` during local development. Do NOT enable `QMOI_DEV_FORCE_TOKEN` in production.

Supervisor (recommended)
```bash
chmod +x scripts/dev_supervisor.sh
./scripts/dev_supervisor.sh start
```

To stop everything:
```bash
./scripts/dev_supervisor.sh stop
```

Quick full-stack dev run (node/docker wrapper)
```bash
chmod +x ./scripts/dev_prepare_and_run.sh
./scripts/dev_prepare_and_run.sh
```

Control endpoint tester
```bash
# After starting the control server, use the helper to call /control
python3 scripts/test_control_endpoint.py
```
Open PWAs (convenience)
-----------------------
Use the helper script to open the PWA in a host browser. Defaults to `qmoi-ai`.

```bash
chmod +x scripts/open_pwa.sh
scripts/open_pwa.sh qmoi-ai
# Open a different PWA:
scripts/open_pwa.sh q-alpha
```

If `BROWSER` is defined in the environment, it'll be used to open the URL; otherwise `xdg-open`/`open` will be tried.
