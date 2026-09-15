---
title: "Issue draft for qmoi-enhanced/QMOI-CLOUD.md"
generated: 2025-11-08T16:06:38.745643Z
---

# Review needed: qmoi-enhanced/QMOI-CLOUD.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOI Cloud Features"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Cloud Features

## Overview
QCity and QMOI now support advanced, automated cloud integration for offloading, artifact sync, multi-device, and failover. All mobile builds, tests, and error-fixing can be offloaded to the cloud for maximum reliability and minimal device resource usage.

_Last updated: 2024-06-09_

## Key Cloud Features
- **Cloud Offloading:** All installs, builds, tests, and error-fixing (including mobile) can be run in the cloud/Colab, with results/artifacts synced back to your device.
- **Cloud Storage:** node_modules, build files, and caches are stored in cloud storage (S3, GCS, etc.) for fast recovery and multi-device use.
- **Multi-Device/Failover:** Multiple QCity cloud devices can work together, with automatic failover and load balancing.
- **Cloud-First Mode:** Option to run everything in the cloud, syncing only UI and results to your device.
- **Cloud Artifact Sync:** Syncs all important files between local and cloud for reliability and speed.
- **Mobile Cloud Builds:** Mobile app builds and tests are offloaded to the cloud when local resources are low, ensuring lightweight operation on all devices.
- **Continuous Self-Healing:** All errors (including in mobile, cloud, and CI/CD) are auto-fixed in the cloud, with master-only access to error/fix logs and controls.
- **Automated Last-Updated Dates:** Documentation and system UIs always show the real last update date.

## How to Use
- Configure cloud options in `config/qcity-device-config.json` and `config/qmoi_cloud_config.json`.
- Use dashboard to monitor cloud status, trigger offloading/sync, and view master-only error/fix logs.
- See `API.md` for cloud endpoints.
- Mobile automation: Use `node scripts/qmoi-mobi
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
