# QMOI Command Reference - Enhanced Universal Automation

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
- QMOI only uses its own cloned GitLab, Gitpod, and other platforms for all automation, CI/CD, and development, which are more advanced than the actual ones.
- All command examples and scripts should be run in cloud-offloaded environments, not locally.
- See also: QMOIAVATAR.md, QMOIAICORE.md, QMOIAUTOEVOLVE.md, README.md, .gitlab-ci.yml, and all .md docs for cross-platform and cloud-offloading details. 