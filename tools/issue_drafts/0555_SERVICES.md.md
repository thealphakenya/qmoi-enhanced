---
title: "Issue draft for SERVICES.md"
generated: 2025-11-08T16:06:38.344280Z
---

# Review needed: SERVICES.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "SERVICES.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# SERVICES.md

This file documents all services in the `services/` directory, their usage, and integration for QCity, QMOI AI, and QMOI Space. All services are checked to ensure they are used and served as expected. Unused or duplicate services are marked for removal.

## Directory Structure
```
services/
(latest/)
```

## Usage & Integration
- All services are checked for usage in QCity, QMOI AI, and QMOI Space. Each is integrated into main apps, dashboards, or context providers.
- Unused/duplicate services are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.
- Service features are confirmed to be used and served in all main apps and platforms.

## Automation & Health
- All services are referenced in `ALLMDFILESREFS.md` and planned for further enhancement and integration.
- Automation ensures every service is used, and unused ones are logged for removal.

**Status:** All services are now checked for usage and integration. No unused/duplicate services will remain after next cleanup. All service features are covered for QCity, QMOI AI, and QMOI Space.

<!-- QMOI_VALIDATION_START -->
{
  "file": "SERVICES.md",
  "validated_at": "2025-10-26T20:51:22.632268Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "SERVICES.md"
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
