# QMOI Monitoring & Analytics Guide

## Dashboard
- **URL:** http://localhost:4000/
- **Login:** Username/password or Google OAuth
- **Features:**
  - View error/fix analytics (auto + manual)
  - Progress bar for percent fixed
  - List of manual errors with instructions
  - Table of recent error/fix runs
  - Trigger auto-fix manually
  - Send test notifications
  - See live GitHub Actions status
  - API endpoints for logs and analytics

## Endpoints
- `/` - Main dashboard
- `/api/error-fix-log` - Error/fix log (JSON)
- `/api/logs` - Orchestrator logs
- `/api/trigger-fix` - Trigger a fix run
- `/health` - Health check

## GitHub Actions Integration
- Progress bar and manual error reporting in workflow summary
- Downloadable error/fix log artifact
- Auto-triggers local fix if remote workflow fails

## Manual Error Handling
- Manual errors are detected and logged with instructions
- View and address manual errors in dashboard and GitHub Actions
- Progress reflects both auto and manual fixes

## Troubleshooting
- If manual errors persist, follow instructions in dashboard or logs
- Use `/api/trigger-fix` to retry fixes
- Check orchestrator logs for details

## Usage
- Start dashboard: `node scripts/qmoi_dashboard.js` or with PM2
- Start orchestrator: `node scripts/qmoi_media_orchestrator.js` or with PM2

---
For a full list of documentation, see [REFERENCES.md](./REFERENCES.md)

For questions or issues, contact the QMOI admin team. 