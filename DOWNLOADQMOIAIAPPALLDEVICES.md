# QMOI AI App Downloads (All Devices)

## Unified Auto-Detect Download Script

You can use the unified script to auto-detect your platform and download the correct binary:

```bash
python downloadqmoiai.py
```

- The script will detect your OS and download the correct app to:
  - `Qmoi_downloaded_apps/<platform>/latest/`
  - `Qmoi_downloaded_apps/<platform>/v<version>/`
- You can also specify a platform manually:
  - `python downloadqmoiai.py windows`
  - `python downloadqmoiai.py mac`
  - `python downloadqmoiai.py linux` (choose deb or appimage)
  - etc.

## Per-Platform Download Scripts

You can also use the dedicated script for your platform:

- `python downloadqmoiaiapk.py` (Android)
- `python downloadqmoiaiexe.py` (Windows)
- `python downloadqmoiaidmg.py` (Mac)
- `python downloadqmoiaideb.py` (Linux DEB)
- `python downloadqmoiaiappimage.py` (Linux AppImage)
- `python downloadqmoiaiipa.py` (iOS)
- `python downloadqmoiaismarttvapk.py` (Smart TV)
- `python downloadqmoiaiimg.py` (Raspberry Pi)
- `python downloadqmoiaizip.py` (Chromebook)

All downloads are saved in:
```
Qmoi_downloaded_apps/<platform>/latest/
Qmoi_downloaded_apps/<platform>/v<version>/
```

## Direct Download Links (QMOI Official)

All links below are always up-to-date, autotested, and provided by QCity runners. If a download ever fails, it is automatically fixed and re-uploaded.

| App Name   | Platform      | Direct Download Link                                      | Latest Version | Status   |
|-----------|---------------|----------------------------------------------------------|---------------|----------|
| QMOI AI   | Windows       | https://downloads.qmoi.app/qmoi/windows.exe              | v1.2.3        | ✅       |
| QMOI AI   | Mac           | https://downloads.qmoi.app/qmoi/mac.dmg                  | v1.2.3        | ✅       |
| QMOI AI   | Linux (DEB)   | https://downloads.qmoi.app/qmoi/linux.deb                | v1.2.3        | ✅       |
| QMOI AI   | Linux (AppImage) | https://downloads.qmoi.app/qmoi/linux.appimage         | v1.2.3        | ✅       |
| QMOI AI   | Android       | https://downloads.qmoi.app/qmoi/android.apk              | v1.2.3        | ✅       |
| QMOI AI   | iOS           | https://downloads.qmoi.app/qmoi/ios.ipa                  | v1.2.3        | ✅       |
| QMOI AI   | Smart TV      | https://downloads.qmoi.app/qmoi/smarttv.apk              | v1.2.3        | ✅       |
| QMOI AI   | Raspberry Pi  | https://downloads.qmoi.app/qmoi/raspberrypi.img          | v1.2.3        | ✅       |
| QMOI AI   | Chromebook    | https://downloads.qmoi.app/qmoi/chromebook.zip           | v1.2.3        | ✅       |
| QCity     | Windows       | https://downloads.qmoi.app/qcity/windows.exe             | v2.0.1        | ✅       |
| QCity     | Mac           | https://downloads.qmoi.app/qcity/mac.dmg                 | v2.0.1        | ✅       |
| QCity     | Linux         | https://downloads.qmoi.app/qcity/linux.appimage          | v2.0.1        | ✅       |
| QCity     | Android       | https://downloads.qmoi.app/qcity/android.apk             | v2.0.1        | ✅       |
| QCity     | iOS           | https://downloads.qmoi.app/qcity/ios.ipa                 | v2.0.1        | ✅       |
| Qshare    | All           | https://downloads.qmoi.app/qshare/qshare-universal.apk   | v1.0.0        | ✅       |
| Yap       | All           | https://downloads.qmoi.app/yap/yap-universal.apk         | v1.1.0        | ✅       |
| Qstore    | All           | https://downloads.qmoi.app/qstore/qstore-universal.apk   | v1.0.0        | ✅       |

> **Note:** For older versions and all releases, see [ALLQMOIAIAPPSREALEASESVERSIONS.md](./ALLQMOIAIAPPSREALEASESVERSIONS.md)

## Autotesting & Always-Up-to-Date

- Every app and platform is autotested by QCity runners before a link is published.
- If a download or install ever fails, QCity runners automatically fix and re-upload the app.
- All links are always up-to-date and verified.
- Notifications are sent to all channels (email, WhatsApp, etc.) for every new release or update.

## Sharing & Automation

- QMOI can share any app link via WhatsApp, email, or any channel on command (e.g., "send link qmoi ai app to leah whatsapp no").
- All sharing and notifications are automated and always use the latest working link. 

## Troubleshooting & Help

- **All download links are autotested and auto-fixed by QCity runners.**
- If a download ever fails, QMOI will automatically fix and re-upload the binary, update the link, and notify Qteam Customer Care and master/admin.
- If you encounter a download issue:
  1. Retry the download (the system may already be autofixing it).
  2. Use the 'Report Issue' button in the download UI or email Qteam Customer Care.
  3. All issues are logged in real time and prioritized for immediate fix.
- **Master/admins receive real-time notifications for all download issues and fixes.**
- For persistent issues, contact Qteam Customer Care via the app or email. 

## New Integrations & Enhancements

- **QMOIAUTOMAKENEW.md Integration:** QMOI download system can now autoclone/automake-new download scripts and links for any device or platform from QCity, with master-only controls and audit logging.
- **QMOIBROWSER.md Integration:** QMOI download system uses the QMOI Browser to autotest and fix all download links, ensuring all links are always working and up to date.
- **Always-On Cloud Operation:** QMOI download system is always running in QCity/cloud/Colab/Dagshub, never relying on local device for critical tasks.
- **Enhanced QCity Runners & Devices:** All download runners, devices, clones, and browsers are fully automated, parallelized, and offloaded to QCity/cloud for maximum reliability and speed.
- **Auto-Updating Documentation:** All .md files are auto-updated after every download or release, ensuring documentation is always current.
- **Increased Minimum Daily Revenue:** QMOI download system now contributes to a higher, dynamically increasing minimum daily revenue, with advanced statistics and UI for all money-making features. 