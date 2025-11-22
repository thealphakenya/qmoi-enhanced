QCity Runners: bootstrap and capabilities

This document describes how to bootstrap QCity runners and how to declare capabilities for the orchestrator.

Runner bootstrap
----------------
1. Provision VM/container with Python 3.11 and system packages.
2. Run `deploy_orchestrator_qcity.sh /opt/qmoi` as root (or via your provisioning tool).
3. On first run, configure the runner to fetch secrets from the secret manager and write `QMOI_MASTER_KEY` to the OS keyring or environment.

Runner manifest
---------------
Create `.qmoi/runner_manifest.json` with content like:

```
{
  "runner_id": "qcity-001",
  "capabilities": ["build-linux","build-windows","build-electron"],
  "tags": ["edge","gpu"]
}
```

The orchestrator reads this file and uses capabilities to decide which tasks to run locally.

Syncing and updates
-------------------
- Runners should pull updates from a central repo or registry. The orchestrator can trigger a self-update by checking git and restarting.
- For security, only accept manifests signed by the central controller.

