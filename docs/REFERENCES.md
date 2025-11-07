---
title: "REFERENCES"
qmoi_validation_frontmatter: true
---

# REFERENCES

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

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

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/REFERENCES.md",
  "validated_at": "2025-10-26T20:51:22.721284Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": [
        {
          "label": "QMOI GitLab Self-Healing CI/CD Automation",
          "target": "./QMOIGITLABDEV.md",
          "ok": true
        },
        {
          "label": "QMOI Vercel Self-Healing CI/CD Automation",
          "target": "./QMOIVERCELDEV.md",
          "ok": true
        },
        {
          "label": "QMOI GitHub Actions Self-Healing CI/CD Automation",
          "target": "./QMOIGITHUBDEV.md",
          "ok": true
        }
      ]
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
