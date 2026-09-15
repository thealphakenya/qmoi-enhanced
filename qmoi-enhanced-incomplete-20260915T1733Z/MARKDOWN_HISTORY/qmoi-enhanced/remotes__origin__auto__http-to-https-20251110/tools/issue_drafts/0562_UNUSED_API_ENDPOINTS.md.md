---
title: "Issue draft for UNUSED_API_ENDPOINTS.md"
generated: 2025-11-08T16:06:38.351718Z
---

# Review needed: UNUSED_API_ENDPOINTS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI Unused API Endpoints Report"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Unused API Endpoints Report

This file lists all API endpoints discovered in the codebase and documentation that are NOT currently used in backend, UI, or test scripts. These endpoints should be prioritized for integration, testing, or deprecation review.

---

## Unused Endpoints (as of 2025-10-08)

- /api/media
- /api/media/:id
- /api/media/logs
- /api/predictions
- /fix_error
- /list
- /automation/optimize
- /automation/trends
- /automation/history
- /automation/metrics
- /automation/config
- /automation/start
- /automation/stop
- /automation/tasks
- /automation/status
- /automation
- /model/info
- /ping
- /qmessage
- /token

> Note: This list is auto-generated. If any endpoint above is in use but not detected, please update the usage scripts or report a false positive.

---

## Next Steps
- For each endpoint above, generate a minimal integration stub (backend or UI) or add a test in qmoi_test.sh.
- Update API.md and CURLCOMMANDS.md to reflect new usage/tests.
- Rerun endpoint usage checks after integration.

<!-- QMOI_VALIDATION_START -->
{
  "file": "UNUSED_API_ENDPOINTS.md",
  "validated_at": "2025-10-26T20:51:22.654047Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Unused API Endpoints Report"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
