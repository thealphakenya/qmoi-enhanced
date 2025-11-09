---
title: "QMOI Vercel Self-Healing CI/CD Automation"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Vercel Self-Healing CI/CD Automation

## Overview

QMOI now supports self-healing automation for Vercel deployments. The system can:
- Fetch the latest failed deployment and logs via the Vercel API
- Detect and auto-fix common errors (e.g., typos, missing dependencies)
- Commit, push, and trigger a redeploy via the Vercel API
- Notify via Slack/email if persistent failures occur

## Requirements

- Environment variables (set in Vercel dashboard or CI/CD):
  - `VERCEL_TOKEN`: Vercel personal/team API token
  - `VERCEL_PROJECT_ID`: Vercel project ID
  - `VERCEL_TEAM_ID`: (optional) Vercel team ID
  - `SLACK_WEBHOOK_URL`: (optional) for Slack notifications
  - SMTP/email vars for email notifications (see QMOIGITLABDEV.md)

## How It Works

- On deployment failure, QMOI fetches the latest failed deployment log
- Scans for common errors and attempts auto-fix
- Commits and pushes fixes, then triggers a redeploy
- If the same error persists, sends notifications

## Integration Steps

1. Add `scripts/ci-self-heal.js` to your repo
2. Set the required environment variables in Vercel or your CI/CD system
3. Optionally, schedule or trigger the script after failed deployments

## Logs

- All actions and fixes are logged in `logs/ci-self-heal.log`

## See Also
- [QMOIGITLABDEV.md](QMOIGITLABDEV.md)
- [REFERENCES.md](REFERENCES.md) 

## Gmail Notification Integration

- All progress and result notifications for Vercel self-healing and autotest are sent to rovicviccy@gmail.com via Gmail.
- Environment variables are managed by scripts/qmoi-environment-setup.js.
- See scripts/ci-self-heal.js and scripts/autotest/advanced_autotest_system.py for implementation details.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/QMOIVERCELDEV.md",
  "validated_at": "2025-10-26T20:51:22.714029Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Vercel Self-Healing CI/CD Automation"
    },
    {
      "name": "links",
      "ok": true,
      "detail": [
        {
          "label": "QMOIGITLABDEV.md",
          "target": "./QMOIGITLABDEV.md",
          "ok": true
        },
        {
          "label": "REFERENCES.md",
          "target": "./REFERENCES.md",
          "ok": true
        }
      ]
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
