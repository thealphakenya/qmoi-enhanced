---
title: "Issue draft for RELEASETRACKS.md"
generated: 2025-11-08T16:06:38.339881Z
---

# Review needed: RELEASETRACKS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "RELEASETRACKS.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# RELEASETRACKS.md

QMOI Release Tracks Log

This file tracks all releases, automation, and workflow status for every app, platform, and device in the QMOI system. It is auto-updated by QMOI automation and referenced by TRACKS.md and README.md.

## Release Log Format
- [YYYY-MM-DD HH:mm:ss] [PLATFORM/APP] [STATUS] [DETAILS]
- Example:
  - [2025-10-12 22:30:00] [Windows] [Release] QMOI AI v2.5.1 released and validated
  - [2025-10-12 22:31:00] [Android] [Release] QMOI AI v2.5.1 released and validated
  - [2025-10-12 22:32:00] [macOS] [Release] QMOI AI v2.5.1 released and validated

## Latest Releases
- [2025-10-12 22:30:00] [Windows] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/windows/qmoi_ai.exe)
- [2025-10-12 22:31:00] [Android] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/android/qmoi_ai.apk)
- [2025-10-12 22:32:00] [macOS] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/mac/qmoi_ai.dmg)
- [2025-10-12 22:33:00] [Linux] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/linux/qmoi_ai.AppImage)
- [2025-10-12 22:34:00] [iOS] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/ios/qmoi_ai.ipa)
- [2025-10-12 22:35:00] [Raspberry Pi] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/raspberrypi/qmoi_ai.img)
- [2025-10-12 22:36:00] [QCity] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/qcity/qmoi_ai.zip)
- [2025-10-12 22:37:00] [Smart TV] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/smarttv/qmoi_ai.apk)
- [2025-10-12 22:38:00] [Chromebook] [Release] QMOI AI v2.5.1 released and validated (binary: Qmoi_apps/chromebook/qmoi_ai.deb)

## QMOI Automation
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
