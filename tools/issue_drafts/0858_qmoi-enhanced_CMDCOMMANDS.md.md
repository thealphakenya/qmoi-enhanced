---
title: "Issue draft for qmoi-enhanced/CMDCOMMANDS.md"
generated: 2025-11-08T16:06:38.730402Z
---

# Review needed: qmoi-enhanced/CMDCOMMANDS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI Command Reference - Enhanced Universal Automation"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Command Reference - Enhanced Universal Automation
python qmoi-app-builder.py                     # Full build (APK + EXE)
python qmoi-app-builder.py --no-apk           # Build only Windows EXE
python qmoi-app-builder.py --upload           # Full build + upload to GitHub

## 🚀 Quick Start Commands

### Master Automation (Recommended)
```bash
python scripts/qmoi-master-automation.py
```

### Universal App Builder
```bash
# Build, test, and organize all QMOI and QCity apps for all device types
python scripts/qmoi-app-builder.py

# Apps are placed in Qmoi_apps/<device>/
# Download links are updated and notifications sent to all channels
```

### Device-Aware Download (QI/First Page)
- Use the download button (see QI_download_component.html) to get the correct installer for your device.

### User-Triggered Build (API)
```bash
# Start the build API server
python scripts/qmoi-build-api.py

# Trigger a build from the dashboard or via API
curl -X POST http://localhost:5050/api/build-apps
```

### Scheduled Build (Cron Example)
```cron
0 2 * * * cd /path/to/QMOI && python scripts/qmoi-app-builder.py
``` 

## Live Status & Real-Time Reporting
```bash
python scripts/qmoi-live-status.py
```
- Streams and summarizes QMOI automation logs and reports in real time.
- Always running in Colab, DagsHub, or cloud (auto-restarts if cancelled or device is offline).

## Cloud Offloading & Cloned Platform Usage (2025 Enhancement)

- All commands and scripts are now run in QCity, Colab, or cloud environments, never on the local device.
- QMOI only uses its own cloned GitLab, Gitpod, and other platforms for all automation, CI/CD, and development, which are more advanced than t
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
