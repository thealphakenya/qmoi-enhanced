---
title: "Issue draft for ALLDEVICESSETTINGS.md"
generated: 2025-11-08T16:06:38.258694Z
---

# Review needed: ALLDEVICESSETTINGS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI All Devices Settings & Features Reference"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI All Devices Settings & Features Reference

This file documents the features, settings, and UI capabilities for each QMOI app/device type. It ensures every app is fully set up for its target device, with device-specific enhancements and access to all UI/app features.

## Android
- App: `Qmoi_apps/android/qmoi ai.apk`
- Features: Touch UI, notifications, background tasks, device sensors, file access, Google Play integration, offline install, USB transfer.

## Windows
- App: `Qmoi_apps/windows/qmoi ai.exe`
- Features: Mouse and pointer support, keyboard shortcuts, system tray, notifications, file explorer integration, offline install, USB transfer.

## Mac (Apple Laptop)
- App: `Qmoi_apps/mac/qmoi ai.dmg`
- Features: Mouse and pointer support, trackpad gestures, keyboard shortcuts, dock integration, notifications, file access, offline install, USB transfer.

## Linux
- App: `Qmoi_apps/linux/qmoi ai.appimage` / `Qmoi_apps/linux/qmoi ai.deb`
- Features: Mouse and pointer support, keyboard shortcuts, notifications, file manager integration, offline install, USB transfer.

## iOS
- App: `Qmoi_apps/ios/qmoi ai.ipa`
- Features: Touch UI, notifications, device sensors, offline install, USB transfer, App Store integration.

## Smart TV
- App: `Qmoi_apps/smarttv/qmoi ai.apk`
- Features: Remote control support, large screen UI, notifications, offline install, USB transfer.

## Raspberry Pi
- App: `Qmoi_apps/raspberrypi/qmoi ai.img`
- Features: GPIO integration, mouse/pointer, keyboard, notifications, offline install, USB transfer.

## Chromebook
- App: `Qmoi_apps/chromebook/qmoi ai.zip`
- Features: Touch UI, keyboard, notifications, file manager integration, offline inst
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
