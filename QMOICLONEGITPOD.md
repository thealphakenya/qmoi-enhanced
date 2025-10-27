<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Gitpod/QMOI Workspace Management (2024 Update)

## QCity UI Integration
- Master-only panel in QCity Device Panel for managing Gitpod and QMOI-local workspaces.
- Real-time status, logs, and advanced controls (start, stop, clone, sync, logs) for each workspace.
- Fallback to QMOI-local (Docker) if Gitpod is unavailable. All changes sync back to Gitpod when available.
- All actions are logged and auditable. Only master users can access this panel.

## Backend Automation
- Gitpod API integration: list, start, stop, clone, and sync workspaces using the Gitpod REST API.
- Docker-based QMOI-local workspace management: start, stop, and list local containers as workspaces.
- Secure API token usage and error handling.

## Usage
- Use the QCity UI to manage all workspaces. Actions are available only to master users.
- If Gitpod is down, QMOI-local workspaces are used automatically.
- Logs and status are shown in real time.

## Troubleshooting
- Ensure all dependencies are installed: express, node-fetch, dockerode, and their types.
- Check API token and Docker daemon status if workspaces do not appear.

## Compliance & Audit
- All workspace actions are logged for compliance and traceability.

---

_Last updated: 2024-06-09_

<!-- QMOI_VALIDATION_START -->
{
  "file": "QMOICLONEGITPOD.md",
  "validated_at": "2025-10-26T20:51:22.478713Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Gitpod/QMOI Workspace Management (2024 Update)"
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
