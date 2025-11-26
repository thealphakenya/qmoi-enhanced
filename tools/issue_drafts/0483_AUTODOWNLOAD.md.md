---
title: "Issue draft for AUTODOWNLOAD.md"
generated: 2025-11-08T16:06:38.260868Z
---

# Review needed: AUTODOWNLOAD.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "AUTODOWNLOAD.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# AUTODOWNLOAD.md

## QMOI App Autodownload System

### Overview
This document describes the fully automated system for downloading and organizing all QMOI apps for every supported device and platform. The system ensures all apps are always available, up to date, and saved in their required directories, with no manual intervention required.

### Features
- **Autodownload All Apps:** Automatically downloads every app listed in QMOIAPPS.md and README.md for all platforms/devices.
- **Directory Structure:** All downloads are saved in `Qmoi_downloaded_apps/<platform>/latest/` and `Qmoi_downloaded_apps/<platform>/v<version>/`.
- **Device Coverage:** Supports Windows, Mac, Linux (DEB/AppImage), Android, iOS, Smart TV, Raspberry Pi, Chromebook, and more.
- **Billing-Safe:** No paid GitHub Actions, runners, or features are used. All automation runs on self-hosted/cloud runners (Colab, DagsHub, QCity, etc.) to avoid billing issues.
- **Auto-Update:** All download links are autotested and auto-updated (ngrok, fallback, etc.) before download. See QMOINGROK.md for details.
- **Error Handling:** If a download fails, the system retries, logs the error, and notifies master/admin. All actions are auditable.
- **No Billing Issues:** All automation is designed to run on free or self-hosted infrastructure. No paid GitHub features are required or used.

### How It Works
1. **App List Extraction:** The automation reads QMOIAPPS.md and README.md to extract all app names and download links for every device/platform.
2. **Download Execution:** For each app and device, the system downloads the latest version using the provided link, saving it in the correct directory.
3. **Directory Organization:** All files are saved i
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
