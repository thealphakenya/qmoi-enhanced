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
- Mobile automation: Use `node scripts/qmoi-mobile-auto-selfheal.js` to ensure mobile is always running, self-healing, and offloading to the cloud as needed.

## Automation Autotest

A new autotest script is available to verify that all QMOI automation scripts run successfully:

```sh
npm run qmoi:automation:autotest
```

- This will run all automation scripts in sequence and report any errors.
- If you see a missing script error, ensure you are running from the project root, not a subdirectory.

---
