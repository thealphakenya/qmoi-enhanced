---
title: "Issue draft for pwa_apps/README.md"
generated: 2025-11-08T16:06:38.397700Z
---

# Review needed: pwa_apps/README.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "Progressive Web Applications (PWAs)"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Progressive Web Applications (PWAs)

This directory contains all PWAs for QCity, QMOI AI, and QMOI Space. Each app is listed with its platform, extension, and build status.

## PWAs by Platform

### QCity
- qcity-pwa.zip
- qcity-pwa.webmanifest
- qcity-pwa.json

### QMOI AI
- qmoi-ai-pwa.zip
- qmoi-ai-pwa.webmanifest
- qmoi-ai-pwa.json

### QMOI Space
- qmoi-space-pwa.zip
- qmoi-space-pwa.webmanifest
- qmoi-space-pwa.json

## Extensions
- `.zip` for packaged PWA
- `.webmanifest` for manifest
- `.json` for config/data

All binaries and manifests are validated and available for each app/platform.

---

## Build Status
- All PWAs are built, validated, and available for deployment.
- See WORKFLOWSTRACKS.md for real-time workflow fix status.

<!-- QMOI_VALIDATION_START -->
{
  "file": "pwa_apps/README.md",
  "validated_at": "2025-10-26T20:51:24.586644Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "Progressive Web Applications (PWAs)"
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
