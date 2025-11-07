---
title: "PWA.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# PWA.md

## Progressive Web Applications (PWAs) for QCity, QMOI AI, and QMOI Space

This file documents all PWAs available for each platform and app type. Each PWA is validated, built, and referenced in the release and build reports.

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

## Build & Validation
- All PWAs are built and validated for each platform and app type.
- See WORKFLOWSTRACKS.md for workflow fix status and automation progress.

---

## References
- [pwa_apps/README.md](./pwa_apps/README.md)
- [WORKFLOWSTRACKS.md](./WORKFLOWSTRACKS.md)
- [RELEASETRACKS.md](./RELEASETRACKS.md)

<!-- QMOI_VALIDATION_START -->
{
  "file": "PWA.md",
  "validated_at": "2025-10-26T20:51:22.337895Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "PWA.md"
    },
    {
      "name": "links",
      "ok": false,
      "detail": [
        {
          "label": "pwa_apps/README.md",
          "target": "./pwa_apps/README.md",
          "ok": true
        },
        {
          "label": "WORKFLOWSTRACKS.md",
          "target": "./WORKFLOWSTRACKS.md",
          "ok": false
        },
        {
          "label": "RELEASETRACKS.md",
          "target": "./RELEASETRACKS.md",
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
