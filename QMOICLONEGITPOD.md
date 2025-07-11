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