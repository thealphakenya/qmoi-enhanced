# QMOI GitLab Self-Healing CI/CD Automation

## Overview

QMOI now includes a self-healing automation script for GitLab CI/CD. This script automatically detects and fixes common errors in `.gitlab-ci.yml` (such as typos in script paths), commits the fix, pushes it, and triggers a new pipeline. All actions are logged for audit and debugging.

## How It Works

- On pipeline failure, the script fetches the latest failed job log using the GitLab API.
- It scans for common errors (e.g., `No such file or directory`, `command not found`).
- If a typo in a file path is detected, it uses fuzzy matching to suggest and apply the correct path.
- The script patches `.gitlab-ci.yml`, commits, pushes, and triggers a new pipeline.
- All actions are logged to `logs/ci-self-heal.log`.

## Requirements

- Node.js environment in CI/CD
- Environment variables:
  - `GITLAB_TOKEN`: Personal access token with API access
  - `GITLAB_PROJECT_ID`: Numeric project ID
  - `GITLAB_TRIGGER_TOKEN`: (optional) Pipeline trigger token

## Integration Steps

1. Add `scripts/ci-self-heal.js` to your repository.
2. Ensure `node-fetch` and `js-yaml` are available (see `requirements/ai_automation.txt`).
3. Add a job to `.gitlab-ci.yml` to run the script on failure (see below).
4. Set the required environment variables in your GitLab CI/CD settings.

## Example `.gitlab-ci.yml` Addition

```yaml
ci_self_heal:
  stage: fix
  image: node:18
  script:
    - node scripts/ci-self-heal.js
  only:
    - main
  when: on_failure
```

## Logs

- All actions and fixes are logged in `logs/ci-self-heal.log` for review.

## Persistent Failure Notifications

If the same error persists for multiple runs (default: 2), QMOI will send notifications to Slack and/or email if configured.

### Slack
- Set `SLACK_WEBHOOK_URL` as a CI/CD variable or in your `.env` file.

### Email
- Set the following env vars:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`, `EMAIL_FROM`
- QMOI will send an email when persistent failures are detected.

You can adjust the notification threshold with `PERSISTENT_FAIL_THRESHOLD` (default: 2).

All notifications are logged in `logs/ci-self-heal.log`.

## Gmail Notification Integration

- All progress and result notifications for GitLab CI self-healing and autotest are sent to rovicviccy@gmail.com via Gmail.
- Environment variables are managed by scripts/qmoi-environment-setup.js.
- See scripts/ci-self-heal.js and scripts/autotest/advanced_autotest_system.py for implementation details.

## Security

- Tokens are loaded from environment variables and never logged or committed.

## Cross-Platform Support

QMOI self-healing automation is designed to work with GitLab, GitHub Actions, and Vercel. Platform detection is automatic based on environment variables, or you can set `QMOI_CI_PLATFORM` to `gitlab`, `github`, or `vercel` to force a platform.

- **GitLab:** Full support (API, auto-fix, notifications)
- **GitHub Actions:** Coming soon (API integration in progress)
- **Vercel:** Coming soon (API integration in progress)

See the script for details and future updates.

## See Also
- [REFERENCES.md](./REFERENCES.md) 

> **Note:** QMOI now supports GitHub Actions self-healing automation. See [QMOIGITHUBDEV.md](./QMOIGITHUBDEV.md) for details. 