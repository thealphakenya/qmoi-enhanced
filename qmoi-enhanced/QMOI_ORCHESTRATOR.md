# QMOI Orchestrator

This document explains the orchestrator scaffold included in the repository.

Key features:
- `qmoi_orchestrator.py`: supervises `start_qmoi_ngrok.py`, periodic autotests, auto-fixers, backups and build driver.
- `qmoi_build_all.py`: basic driver that scans the repo for known build markers and reports/builds.
- `deploy/qmoi-orchestrator.service`: systemd template (place in `/etc/systemd/system/` and adjust `WorkingDirectory`/`User`).

Important safety notes:
- This is a conservative scaffold: many repo files still contain placeholders and partial scripts. Review build steps before enabling `--apply` or deploying to production.
- Secrets must be provisioned securely to runners (use keyring, GitHub Secrets, or a cloud KMS). Do not store raw secrets in the repository.

Quick start (development):
```bash
# dry-run orchestrator
python qmoi-enhanced/qmoi-enhanced/qmoi_orchestrator.py --dry-run

# install as systemd service (example)
# copy repository to /opt/qmoi, edit deploy/qmoi-orchestrator.service to set User and WorkingDirectory
# sudo cp deploy/qmoi-orchestrator.service /etc/systemd/system/qmoi-orchestrator.service
# sudo systemctl daemon-reload
# sudo systemctl enable --now qmoi-orchestrator.service
```

Next steps to make this production-ready:
- Replace placeholder auto-fixer script references with concrete fixers.
- Integrate with managed secret stores and add transient token fetchers for CI/runners.
- Replace the passive build driver with per-platform build pipelines and signing workflows.

QCity Deployment and Runners
----------------------------

This repository includes a pattern for deploying the Orchestrator into QCity (our runner fleet). QCity runners are treated as disposable, identity-managed execution nodes. The orchestrator should be deployed to each QCity runner with the following properties:

- Minimal local state: keep `.qmoi/` for encrypted artifacts and logs; push backups to external store (S3/GCS) regularly.
- Secure secrets: use repo/organization secrets for CI; for QCity runners use ephemeral credentials or node identity to fetch secrets from a central secrets manager.
- Self-healing service: configure a supervisor (systemd, Docker restart policy, or a process manager) to restart the orchestrator on failure.

Recommended flow for QCity deployment:

1. Provision runner base image with Python 3.11, virtualenv, and OS packages.
2. Use the included `deploy/qcity/deploy_orchestrator_qcity.sh` script to bootstrap the orchestrator and systemd unit.
3. Configure the runner to fetch `QMOI_MASTER_KEY` from a secure store (or use the OS keyring) on startup.
4. Configure the runner to register with the centrally-managed runner registry (if you use one) so workflows can target it.

Runner sync strategy
--------------------

To keep workflows and runners in sync:

- Use a central 'runner manifest' (e.g. `.qmoi/runner_manifest.json`) describing runner roles and available capabilities (build-mac, build-win, etc.). The orchestrator will read this manifest and only execute tasks that match the runner's capabilities.
- Update manifest centrally and propagate to runners via a secure channel (e.g., signed manifest or pull from S3/registry).
- Workflows should reference runner capabilities, and fallback to other runners if a capability is missing.

Workflow resilience
-------------------

Workflows should be designed to be idempotent and retry-friendly. The orchestrator provides a retry wrapper for critical tasks and logs results into `.qmoi/reports/` so that if a runner fails, another runner can pick up the task.

Example: When a build job runs, the orchestrator will:

1. Lock the build manifest entry locally.
2. Run the build script (dry-run first), then apply.
3. Publish artifacts to a remote registry and record the artifact checksum in `.qmoi/reports/builds.json`.
4. If push fails, the orchestrator will retry with exponential backoff and escalate if it exhausts retries.

See `deploy/qcity/qcity_runners.md` for detailed runner bootstrap steps and `deploy/qcity/deploy_orchestrator_qcity.sh` for a bootstrap script.
