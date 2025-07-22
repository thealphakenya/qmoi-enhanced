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

# QMOI Command Reference - Test & Automation

This file lists all key commands for testing QMOI features, download links, ngrok integration, and automation. Note: QMOI autoset features run all tests and fixes automatically in the background, so manual intervention is rarely needed. These commands are provided for manual testing, diagnostics, and verification.

## Test & Diagnostic Commands

### Test Ngrok Integration
```bash
python3 ai_self_update.py --test-ngrok
```

### Test All Download Links
```bash
python3 ai_self_update.py --test-download-links
```

### Test All QMOI Features (Full Diagnostic)
```bash
python3 ai_self_update.py --test-all
```

### Test Unified Download Script (Auto-Detect Platform)
```bash
python3 downloadqmoiai.py
```

### Test Per-Platform Download Scripts
```bash
python3 downloadqmoiaiapk.py        # Android
python3 downloadqmoiaiexe.py        # Windows
python3 downloadqmoiaidmg.py        # Mac
python3 downloadqmoiaideb.py        # Linux DEB
python3 downloadqmoiaiappimage.py   # Linux AppImage
python3 downloadqmoiaiipa.py        # iOS
python3 downloadqmoiaismarttvapk.py # Smart TV
python3 downloadqmoiaiimg.py        # Raspberry Pi
python3 downloadqmoiaizip.py        # Chromebook
```

## Automation & Autoset Features
- QMOI autoset features run all tests, autotest download links, fix errors, and update documentation automatically after every automation cycle.
- No manual intervention is required for normal operation; all features are self-healing and cloud-offloaded.
- For troubleshooting, see DOWNLOADQMOIAIAPPALLDEVICES.md and QMOIBROWSER.md.

---

*Last updated: 2025-07-22*