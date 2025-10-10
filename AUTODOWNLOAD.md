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
3. **Directory Organization:** All files are saved in `Qmoi_downloaded_apps/<platform>/latest/` and `Qmoi_downloaded_apps/<platform>/v<version>/`.
4. **Verification:** After download, the system verifies file size and integrity. If a file is missing or invalid, it retries or logs the error.
5. **Audit & Notification:** All actions are logged. Master/admin is notified of any persistent issues.

### Example Directory Structure
```
Qmoi_downloaded_apps/
  windows/
    latest/
      qbrowser.exe
      qfilemanager.exe
      ...
    v1.2.0/
      qbrowser.exe
    v2.0.1/
      qfilemanager.exe
  mac/
    latest/
      qbrowser.dmg
      ...
  android/
    latest/
      qbrowser.apk
      ...
  ...
```

### Automation Script
- The main script is `downloadqmoiai.py`, which can be extended to loop over all apps and platforms.
- Platform-specific scripts (e.g., `downloadqmoiaiapk.py`, `downloadqmoiaiexe.py`) are also supported.

### Billing-Safe Design
- **No Paid GitHub Actions:** All automation is run on self-hosted or cloud runners (Colab, DagsHub, QCity, etc.).
- **No External Billing:** No step in the autodownload process requires a paid plan or incurs costs on GitHub.
- **Fallback Logic:** If a runner or service fails due to quota or billing, the system auto-switches to another free/cloud runner.

### See Also
- QMOIAPPS.md (app list and links)
- README.md (platforms and download structure)
- QMOINGROK.md (ngrok tunnel automation)
- QMOIQCITYAUTOMATIC.md (cloud automation)
- QCITYRUNNERSENGINE.md (self-hosted runners) 