# ALL MD Files References - Enhanced Comprehensive Edition

## Overview

This comprehensive reference document catalogs and categorizes all .md files in the QMOI system with advanced categorization, automation features, and health checks. The system ensures QMOI can automatically reference, fix, and enhance all documentation.

- **All app download links are now provided via https://downloads.qmoi.app/**
- **All links are autotested and always up-to-date, managed by QCity runners.**
- **See [ALLQMOIAIAPPSREALEASESVERSIONS.md](./ALLQMOIAIAPPSREALEASESVERSIONS.md) for all app releases and versions.**
- **See [DOWNLOADQMOIAIAPPALLDEVICES.md](./DOWNLOADQMOIAIAPPALLDEVICES.md) for all device/platform download instructions.**

## Download Autofix & Customer Care (2025+)
- All download links are autotested, auto-fixed, and always up-to-date.
- Download UI and scripts feature robust error handling, retry logic, and real-time status.
- Users can report issues directly from the download UI; all issues are logged and prioritized for immediate fix.
- Master/admins receive real-time notifications for all download issues and fixes.
- See [ALLQMOIAIAPPSREALEASESVERSIONS.md](./ALLQMOIAIAPPSREALEASESVERSIONS.md) and [DOWNLOADQMOIAIAPPALLDEVICES.md](./DOWNLOADQMOIAIAPPALLDEVICES.md) for all links and troubleshooting.

> **Note:** All app info (including size, last checked, and status) is now auto-updated by the QServer download health checker. All documentation and app info is always up-to-date and precise.

# QMOI App Build Automation (2025-06-13)

- The QMOI app builder script (`scripts/qmoi-app-builder.py`) now performs real builds for:
  - **Windows**: Electron app, built after Next.js build and server start, output as `Qmoi_apps/windows/qmoi ai.exe`.
  - **Android**: React Native APK, built and output as `Qmoi_apps/android/qmoi ai.apk`.
  - **iOS**: React Native IPA (if on macOS), output as `Qmoi_apps/ios/qmoi ai.ipa`.
- All actions and errors are robustly logged via `qmoi_activity_logger`.
- Placeholders remain for mac, linux, chromebook, raspberrypi, smarttv, qcity.
- All output files are named `qmoi ai` and placed in the correct subdirectory.
- Download links and notifications are updated automatically after each build. 