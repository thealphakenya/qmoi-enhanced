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
0 2 * * * cd /path/to/Alpha-Q-ai && python scripts/qmoi-app-builder.py
```

### CI/CD Build (GitHub Actions)
- See .github/workflows/qmoi-app-build.yml for automated builds on code push.

## 📦 Qmoi_apps Directory Structure
```
Qmoi_apps/
  windows/
    QMOI-App-Setup.exe
    QCity-App-Setup.exe
  mac/
    QMOI-App.dmg
    QCity-App.dmg
  linux/
    QMOI-App.AppImage
    QCity-App.AppImage
  android/
    QMOI-App.apk
    QCity-App.apk
  ios/
    QMOI-App.ipa
    QCity-App.ipa
  qcity/
    QCity-WebApp.zip
    QCity-Desktop.zip
```

## 🔄 Automation & Notification
- All builds, tests, and installs are logged and self-healing
- Notifications sent via Gmail, WhatsApp, Slack, Telegram, Discord, and more
- Download links are always up to date

## 📚 Documentation
- See QI_download_component.html for device-aware download
- See .github/workflows/qmoi-app-build.yml for CI/CD workflow
- See scripts/qmoi-build-api.py for user-triggered build API
- See ALLMDFILESREFS.md for a full index of documentation

---
**QMOI: Universal, always-on, and fully automated for every device and platform.** 