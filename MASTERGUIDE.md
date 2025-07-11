# QMOI Master Guide

## 1. Initial Setup
- **Clone the QMOI repository** to your preferred environment (Gitpod, Vercel, HuggingFace, GitLab).
- **Set all required environment variables** in each platform (see `.env.example` or platform docs).
- **Install dependencies** using `npm install` or the platform’s UI.

## 2. Platform Instructions

### Gitpod
- Open the project in Gitpod (via GitLab or GitHub integration).
- Use the QCity UI panel for workspace management (start, stop, clone, sync, logs).
- If Gitpod is unavailable, QMOI automatically falls back to local Docker workspaces.
- All actions are logged and visible in the QCity dashboard.

### Vercel
- Deploy using the provided `vercel.json` (ensure `framework` is set to `null` or the correct value).
- Set environment variables in the Vercel dashboard.
- QMOI auto-redeploys and fixes errors using WATCHDEBUG.
- Monitor deployment status and logs in the Vercel UI and QCity dashboard.

### HuggingFace Spaces
- Deploy using the provided `Dockerfile` (Node/Express app should listen on port 7860).
- Set environment variables in the HuggingFace UI.
- QMOI auto-redeploys and monitors errors.
- Logs and status are visible in the QCity dashboard.

### GitLab
- Use the provided `.gitlab-ci.yml` for CI/CD automation.
- Pipelines are monitored and auto-fixed by QMOI.
- All actions are logged and master-notified.
- Use the QCity UI for real-time status and manual controls.

## 3. Automation & Monitoring
- **WATCHDEBUG** runs 24/7, monitoring all platforms and auto-fixing errors.
- QMOI auto-updates all documentation and code across platforms.
- Master receives notifications for all critical events and errors.

## 4. Troubleshooting
- **All errors are auto-fixed** by QMOI automation.
- For manual intervention, use the QCity UI or WhatsApp commands (if enabled).
- Check logs in the QCity dashboard and platform UIs.
- Ensure all environment variables are set and dependencies installed.

## 5. Best Practices
- Keep all documentation (.md files) up to date; QMOI auto-updates ALLMDFILESREFS.md.
- Use master-only controls for sensitive actions and approvals.
- Review logs and notifications regularly for optimal system health.
- Customize automation scripts and pipelines as needed for your workflow.

## 6. Advanced Features
- **QCity UI**: Master-only controls for all automation, deployments, and logs.
- **Self-Healing**: QMOI auto-fixes and redeploys on any error across all platforms.
- **Audit & Compliance**: All actions are logged and auditable in the QCity dashboard.
- **Friendship & Revenue Systems**: Integrate with QMOI’s advanced features for user engagement and financial automation.

## Command Reference

See [CMDCOMMANDS.md](./CMDCOMMANDS.md) for all automation, testing, and troubleshooting commands for QMOI across all platforms (PowerShell, Bash, etc.).

### Troubleshooting
- If you see `Missing script: "qmoi:autodev:full"`, add it to your `package.json` under `"scripts"`.
- For PowerShell, use `;` to separate commands. For Bash, use `&&`.
- If you see `{ was unexpected at this time.`, you may be using CMD instead of PowerShell. Use PowerShell or run commands one by one in CMD.

---

*QMOI: Master-controlled, fully automated, and self-healing system for universal deployment, monitoring, and developer productivity.* 