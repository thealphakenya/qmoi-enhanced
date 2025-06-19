# AUTOGIT.md

## AutoGit Overview

AutoGit is the AI-driven system for managing all code changes, commits, and pushes to GitHub.

### Features
- Detects and stages all changes
- Auto-commits with descriptive messages
- Pushes to main branch and handles merge conflicts
- Triggers error fixing and redeployment if needed
- Notifies master of all actions

### Error Handling
- If push fails, AI logs the error, attempts auto-fix, and retries
- All actions are logged in QMOISYSTEMAUTO.md

## Automated Git, Vercel, Heroku, AWS, and Fallback Deployment

The Alpha-Q AI system now includes a fully autonomous deployment pipeline:

- **Vercel, Heroku, AWS Auto-Deploy:** Uses `scripts/deploy/vercel_auto_deploy.js` to deploy to Vercel, Heroku, or AWS via CLI.
- **AI Error Fixing:** If deployment fails, the script analyzes errors, auto-fixes code/config, and retries.
- **Fallback Modes:**
  - If all cloud credentials are missing, attempts Docker deployment or static export.
  - Notifies master by WhatsApp and email.
- **Auto-Commit & Push:** All fixes are auto-committed and pushed to GitHub.
- **Health Monitoring:** After deployment, the system pings a health endpoint and notifies the master if unhealthy.
- **Notifications:** Master is notified of all actions and errors via WhatsApp and email (if enabled).
- **Resilience:** The system never crashes; it always reports status and next steps.

See `scripts/deploy/vercel_auto_deploy.js` for implementation details.

---

*This file is managed by the AI and documents all auto-git logic and enhancements.* 