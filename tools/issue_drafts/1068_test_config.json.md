---
title: "Issue draft for test_config.json"
generated: 2025-11-08T16:06:39.006442Z
---

# Review needed: test_config.json

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
{
    "test_dir": "tests",
    "report_dir": "test_reports",
    "coverage": {
        "enabled": true,
        "source": ".",
        "omit": [
            "tests/*",
            "venv/*",
            "*/__pycache__/*"
        ],
        "branch": true
    },
    "parallel": {
        "enabled": true,
        "max_workers": 4
    },
    "notifications": {
        "slack": {
            "enabled": true,
            "webhook_url": "<YOUR_SLACK_WEBHOOK_URL>"
        },
        "email": {
            "enabled": true,
            "smtp_server": "<YOUR_SMTP_SERVER>",
            "smtp_port": 587,
            "sender_email": "<YOUR_EMAIL>",
            "sender_password": "<YOUR_PASSWORD>",
            "recipient_emails": ["<RECIPIENT_EMAIL>"]
        }
    },
    "test_categories": {
        "unit": "tests/unit",
        "integration": "tests/integration",
        "e2e": "tests/e2e"
    },
    "last_validated": ""
} 
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
