# QMOI Cross-Platform Cloning & Optimization (QMOICLONE)

## Overview
QMOI now supports fully automated, cross-platform cloning, deployment, error fixing, backup, and optimization for all supported platforms (Vercel, GitLab, GitHub, Colab, DagsHub, Gitpod, etc.).

## Features
- **Automated Cloning & Sync:**
  - Clones and syncs all configured repos from GitLab, GitHub, DagsHub, etc.
  - Keeps all directories in sync with local and cloud changes
- **Auto-Fix & Self-Healing:**
  - Detects and fixes errors in code, config, or deployment
  - Retries deploys and logs all actions
- **Cloud Optimization:**
  - Prefers free/ephemeral resources
  - Cleans up unused assets and optimizes for cost/performance
- **Backup & Auto-Evolution:**
  - Regularly backs up code, configs, and logs
  - Maintains changelog and evolves based on error/fix history
- **UI Integration:**
  - Master-only UI in QCity/QI for pipeline/log/resource control
  - Real-time status, logs, and manual/auto triggers

## Usage
- Run QMOI clone/optimize script:
  ```sh
  node scripts/qmoi-clone-optimize.cjs
  ```
- Or trigger via QCity/QI UI (master only)

## Extension Points
- Add new platforms or cloud targets
- Extend error-fixing and optimization logic
- Integrate with more UI panels or controls

## Troubleshooting
- All errors, fixes, and actions are logged in `qmoi-clone-optimize.log`
- Backups are stored in `qmoi-backups/`
- For issues, check logs and UI panels
- All cloning, mirroring, and backup operations are now handled exclusively by GitLab CI/CD automation.
- Email notifications are sent for all major events in GitLab/QMOI GitLab.

## References
- [QMOICLONEGITPOD.md](./QMOICLONEGITPOD.md)
- [QMOIGITLABDEV.md](./QMOIGITLABDEV.md)
- [QMOIVERCELDEV.md](./QMOIVERCELDEV.md)
- [REFERENCES.md](./REFERENCES.md) 