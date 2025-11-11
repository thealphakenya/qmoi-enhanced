---
title: "Issue draft for SPONSORED.md"
generated: 2025-11-08T16:06:38.345787Z
---

# Review needed: SPONSORED.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI Sponsored Users"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Sponsored Users

This file lists users that QMOI should treat as "sponsored" — they should not be charged for services and should receive master-level exemptions where appropriate.

Format: one username per line. The `qmoi_control_server.py` exposes endpoints to add/view sponsored users (`/sponsored/add`, `/sponsored/list`).

Master and immediate family (example):
- master
- sister

# How to modify
- Use the `POST /sponsored/add` endpoint as the master user or using the `QMOI_CONTROL_TOKEN`.

***
Generated on 2025-10-23 by automation.

<!-- QMOI_VALIDATION_START -->
{
  "file": "SPONSORED.md",
  "validated_at": "2025-10-26T20:51:22.637574Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Sponsored Users"
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

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
