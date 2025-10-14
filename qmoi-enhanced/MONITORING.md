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

## Hugging Face Automation Monitoring

- **Deployment & Model Sync:**
  - All Hugging Face Space deployments and model syncs are logged and visible in GitLab CI/CD.
- **UI Feature Test:**
  - Automated UI tests run after each deployment, with results logged and uploaded as artifacts.
- **Log Access:**
  - Review `logs/hf_model_sync.log`, `logs/huggingface_spaces.log`, and `logs/test_hf_space_ui.log` in the GitLab CI/CD artifacts.
- **Health & Status:**
  - QMOI health and status are always visible in the Hugging Face Space dashboard and model card.

---

## Always Fix All Automation Monitoring

- All runs of `npm run qmoi:always-fix-all` are logged to `logs/qmoi-always-fix-all-attempts.json`
- Success and failure notifications are sent via the QMOI notification system
- Persistent failures are highlighted in the dashboard and require manual intervention
- See [QMOIAUTOFIXREADME.md](./QMOIAUTOFIXREADME.md) for details

---

## AI Error Prediction & Notification Monitoring

- Error predictions are available at `/api/predictions` (port 4100)
- Notification preferences and history are available at `/api/notification-prefs` and `/api/notification-history` (port 4200)
- Dashboard displays predictions, notification preferences, and history

---

For a full list of documentation, see [REFERENCES.md](./REFERENCES.md)

For questions or issues, contact the QMOI admin team.
