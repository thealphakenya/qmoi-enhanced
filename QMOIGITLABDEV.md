# QMOI GitLab Developer Automation (QMOIGITLABDEV)

## Overview
QMOI now acts as a full developer/operator for GitLab:
- Creates and manages repos, variables, webhooks
- Runs/fixes pipelines, manages secrets, updates docs
- Backs up code, configs, and logs
- Integrates with master-only UI for control and logs

## Features
- **Resource Management:**
  - Auto-creates repos, sets up variables and webhooks
  - Syncs with other platforms (GitHub, DagsHub, etc.)
- **Pipeline Automation:**
  - Runs, monitors, and fixes pipelines
  - Auto-fixes errors and redeploys
- **Secrets Management:**
  - Loads tokens from `.env` and CI/CD variables
  - Warns if missing, never logs secrets
- **Backup & Auto-Evolution:**
  - Backs up all code, configs, and logs
  - Maintains changelog and evolves based on error/fix history
- **UI Integration:**
  - Master-only UI for pipeline/log/resource control
  - Real-time status, logs, and manual/auto triggers

## Usage
- Configure `.env` and GitLab CI/CD variables
- Push code or trigger pipeline
- QMOI will auto-manage resources, run/fix pipeline, and log all actions
- View status/logs in QCity/QI UI (master only)

## Extension Points
- Add new GitLab features or integrations
- Extend error-fixing and backup logic
- Integrate with more UI panels or controls

## Troubleshooting
- All errors, fixes, and actions are logged
- Backups are stored in `qmoi-backups/`
- For issues, check logs and UI panels

## References
- [QMOICLONE.md](./QMOICLONE.md)
- [QMOICLONEGITPOD.md](./QMOICLONEGITPOD.md)
- [QMOIVERCELDEV.md](./QMOIVERCELDEV.md)
- [REFERENCES.md](./REFERENCES.md) 