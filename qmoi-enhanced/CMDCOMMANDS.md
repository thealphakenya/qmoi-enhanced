# QMOI Command Reference - Enhanced Universal Automation

python qmoi-app-builder.py # Full build (APK + EXE)
python qmoi-app-builder.py --no-apk # Build only Windows EXE
python qmoi-app-builder.py --upload # Full build + upload to GitHub

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

a

### Auto-Fix and Auto-Test All Download Links

```bash
python3 ai_self_update.py --autofix-download-links --auto-test-links --log-errors
```

- Runs auto-fix and auto-test for all download links, logs any errors to the appropriate error log files for each device.

### Check All Error Logs (Manual Diagnostic)

```bash
python3 ai_self_update.py --check-error-logs
```

- Scans all device error logs and reports any remaining errors. Use after automation cycles for manual verification.

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
python3 downloadqmoiaiap
k.py        # Android
python3 downloadqmoiaiexe.py        # Windows
python3 downloadqmoiaidmg.py        # Mac
python3 downloadqmoiaideb.py        # Linux DEB
python3 downloadqmoiaiappimage.py   # Linux AppImage
python3 downloadqmoiaiipa.py        # iOS
python3 downloadqmoiaismarttvapk.py # Smart TV
python3 downloadqmoiaiimg.py        # Raspberry Pi
python3 downloadqmoiaizip.py        # Chromebook
python3 downloadqmoiaiiphone.py     # Apple iPhone (uses iOS build)
python3 downloadqmoiaiipad.py       # Apple iPad (uses iOS build)
python3 downloadqmoiaipod.py        # Apple iPod (uses iOS build)
python3 downloadqmoiaapplelaptop.py # Apple Laptop (uses macOS build)
```

## Device Mapping Notes

See QMOIBINARIES.md for the latest canonical binary mapping, build status, and QCity automation integration for all device types.
All device types are mapped to their canonical universal builds for automation, with real-time status and troubleshooting auto-updated in QMOIBINARIES.md.

## Automation & Autoset Features

QMOI autoset features run all tests, autotest download links, fix errors, and update documentation automatically after every automation cycle.
All binary statuses and troubleshooting info are auto-updated in QMOIBINARIES.md and referenced by QCity runners.
No manual intervention is required for normal operation; all features are self-healing and cloud-offloaded.
For troubleshooting, see QMOIBINARIES.md, DOWNLOADQMOIAIAPPALLDEVICES.md, and QMOIBROWSER.md.

## Enhanced Automation Features (2025+)

- All download links are auto-fixed and auto-tested after every build/install cycle.
- Any errors found during link testing or install are logged to the appropriate error log file for each device.
- Error logs are checked automatically and can be manually checked using the command above.
- All enhancements are cloud-offloaded and self-healing.

## Future-Proof Universal Automation

- All new device types will be mapped to canonical builds unless a unique binary is required.
- Automation scripts and CI/CD will auto-detect and update device mappings as new platforms are added.
- All device logs, error stats, and download links are auto-updated in real time (every 2 min or less).

---

_Last updated: 2025-07-22_
