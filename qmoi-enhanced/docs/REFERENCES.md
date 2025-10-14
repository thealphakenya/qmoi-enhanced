- [QMOI GitLab Self-Healing CI/CD Automation](./QMOIGITLABDEV.md)
- [QMOI Vercel Self-Healing CI/CD Automation](./QMOIVERCELDEV.md)
- [QMOI GitHub Actions Self-Healing CI/CD Automation](./QMOIGITHUBDEV.md)

## QMOI Gmail Notification Integration

- All self-healing and autotest progress/result notifications are sent to rovicviccy@gmail.com via Gmail.
- Environment variables for Gmail (QMOI_EMAIL_USER, QMOI_EMAIL_PASS, etc.) are managed automatically by scripts/qmoi-environment-setup.js.
- Node.js self-healing: see scripts/ci-self-heal.js (uses qmoi-notification-system.js)
- Python autotest: see scripts/autotest/advanced_autotest_system.py (uses notify_enhancement.py)
- For setup, see the comments in scripts/qmoi-environment-setup.js.

## QMOI Workspace Audit Logging & Notification

- All workspace management actions (start, stop, clone, sync, etc.) are logged to logs/qcity_audit.log.
- Notifications for all workspace events and errors are sent via all configured channels (email, Slack, WhatsApp, Telegram, Discord, etc.).
