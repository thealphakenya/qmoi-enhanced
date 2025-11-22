PRODUCTION CHECKLIST for QMOI
=================================

This document contains a minimal, safe production readiness checklist and commands to bring the QMOI system into a production-like state.

Important: this repository contains many placeholder files and incomplete scripts. The changes below are conservative scaffolding and do not modify application logic across the repo.

1) Secrets and keys
  - Use a secure secret manager (recommend: GitHub Secrets for CI, and AWS/GCP/Azure Secret Manager or HashiCorp Vault for servers).
  - Create a master key for local encryption and store it in a secure store, or use the OS keyring.

2) Install runtime dependencies on servers
  - Example (Ubuntu):

```bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip git
python3 -m venv .venv
source .venv/bin/activate
pip install -r qmoi-enhanced/qmoi-enhanced/scripts/requirements-secrets.txt
pip install pyngrok fastapi uvicorn
```

3) Bootstrap secrets locally (run on a secure host only)

```bash
export QMOI_MASTER_KEY="$(python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())')"
PY_GH_TOKEN="(set from your secret store or environment)"
PYTHONPATH=qmoi-enhanced/qmoi-enhanced python qmoi-enhanced/qmoi-enhanced/scripts/qmoi_bootstrap_secrets.py --github-token "$PY_GH_TOKEN" --confirm-write --create-git-helper
```

4) Orchestrator / service
  - Use the systemd unit template in `deploy/qmoi-orchestrator.service` and point it at the orchestrator entrypoint (this repo includes a lightweight orchestrator scaffold).

5) CI / release
  - The repository includes a conservative CI workflow `/.github/workflows/production_ci.yml` that runs smoke checks only. For full builds/releases, extend the workflow to call `qmoi_build_all.py` with platform-specific runners and secrets (registry credentials, signing keys).

6) Backups and monitoring
  - Ensure `.qmoi/backups/` is backed up to an external store (S3/Blob) and rotated.
  - Integrate logs with a central logging system (CloudWatch/Stackdriver/Elasticsearch) and metrics with Prometheus/Grafana.

7) Final validation
  - Run smoke tests, then staged integration on a non-production branch, then promote to production only once passing.

If you want, I can continue and implement the full CI release pipelines, per-platform packaging and signing, and an automated provisioning flow for Codespaces / runners. Confirm which platforms you want prioritized (Linux/deb/AppImage, macOS .dmg, Windows NSIS, Android APK, iOS IPA, Electron builds) and I'll implement the top-priority pipelines next.
