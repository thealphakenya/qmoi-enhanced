# QMOIAUTODEV.md

## QMOI Auto-Dev: Always-On, Self-Healing, Auto-Deploying System

QMOI Auto-Dev is the core automation engine for Alpha-Q, now featuring:

- **Continuous Daemon:** Runs in the background, scanning for errors, auto-fixing, running tests, and triggering CI/CD (commit, push, deploy, monitor) every minute.
- **Unified CI/CD:** Automated commit, push, PR, and Vercel deployment after every successful fix and test. Monitors deployment health and retries/fixes as needed.
- **Dashboard Controls:** Master users can view real-time status, logs, and results, and control the daemon (start/stop/refresh) from the UI.
- **Audit Logging:** Every action (fix, commit, deploy, error) is logged and viewable in the dashboard for compliance and transparency.
- **Obsolete File/Log Cleanup:** Old logs and obsolete files are now auto-cleaned to keep the system lean and auditable.

## Usage
- Auto-Dev runs in the background and requires no manual intervention.
- Master/admin can view and control Auto-Dev via the dashboard.
- All actions are logged and auditable.
- **Continuous auto-fix runs every minute by default.**
- **GitHub and Vercel operations are fully automated.**

## Features

### Core Automation
- Self-healing, auto-enhance, and auto-update
- Project automation and resource management
- Secure file editing and audit logging
- Master-only UI controls
- Automated log and obsolete file cleanup

### Unified CI/CD
- **Auto-Commit & Push:** All fixes are auto-committed and pushed to GitHub.
- **Pull Request Automation:** PRs are created if pushing to protected branches.
- **Vercel Deployment:** Deploys after every successful push, with health monitoring and auto-redeploy.
- **Audit Logging:** All git and deploy actions are logged.

### Dashboard & API
- **/api/qmoi/autodev**: Exposes all automation, fix, and deployment status, logs, and controls.
- **UI Panel:** Shows last run, errors, test results, commit/push/deploy status, and daemon running status. Master controls for start/stop/refresh.

### Advanced Monitoring & Notifications
- Health checks, error analytics, and notifications (email, WhatsApp, Slack) for critical events (future enhancement).

### File & Log Management
- Old/large logs and obsolete files are auto-deleted or rotated.
- Documentation and changelogs are auto-updated after each automation cycle.

## Auto-Optimization & Cloud Integration
- QMOI AutoDev now uses Data Saver mode and adaptive quality to minimize data usage.
- Heavy development and automation tasks are offloaded to Colab/Dagshub when needed.
- Device management and auto-offloading are part of the unified dashboard.
- For full optimization strategies, see `AUTOOPTIMIZEALPHAQMOIENGINE.md`.

## API Endpoints
- `POST /api/qmoi/autodev` with `{ action: 'full_status' }` - Get full automation, fix, and deployment status.
- `POST /api/qmoi/autodev` with `{ action: 'continuous_autofix_start' }` - Start the daemon.
- `POST /api/qmoi/autodev` with `{ action: 'continuous_autofix_stop' }` - Stop the daemon.
- `POST /api/qmoi/autodev` with `{ action: 'lint_fix' | 'dependency_fix' | ... }` - Trigger specific automation actions.

## Future Enhancements
- Multi-platform deployment (Heroku, AWS, Azure, GCP)
- Advanced health checks and error analytics
- More notification channels
- Force run, view history, and detailed log viewer in dashboard

---
*This file is managed by the AI and documents all QMOI Auto-Dev logic and enhancements.* 