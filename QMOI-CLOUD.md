# QMOI Cloud Features

## Overview
QCity supports advanced cloud integration for offloading, artifact sync, multi-device, and failover.

## Key Cloud Features
- **Cloud Offloading:** All installs, builds, and tests can be run in the cloud/Colab, with results/artifacts synced back to your device.
- **Cloud Storage:** node_modules, build files, and caches are stored in cloud storage (S3, GCS, etc.) for fast recovery and multi-device use.
- **Multi-Device/Failover:** Multiple QCity cloud devices can work together, with automatic failover and load balancing.
- **Cloud-First Mode:** Option to run everything in the cloud, syncing only UI and results to your device.
- **Cloud Artifact Sync:** Syncs all important files between local and cloud for reliability and speed.

## How to Use
- Configure cloud options in `config/qcity-device-config.json`.
- Use dashboard to monitor cloud status and trigger offloading/sync.
- See `API.md` for cloud endpoints.

--- 