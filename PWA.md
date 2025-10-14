# QMOI & QCity Progressive Web Applications (PWA)

This document describes the production setup, build, and release process for the QMOI Space and QCity PWAs.

## PWAs Available
- **QMOI Space PWA**: `/Qmoi_apps/qmoi-space/qmoi_space_pwa.zip` (ready for direct install/use)
- **QCity PWA**: `/Qmoi_apps/qcity/qmoi_ai.qcapp` (ready for direct install/use)
- **Chromebook PWA**: `/Qmoi_apps/chromebook/qmoi_ai.zip` (ready for direct install/use)

## Production Build & Release
- All PWAs are compiled, packaged, and included in every release.
- No placeholders or mocks: all files are production-ready and tested.
- Download and install directly from the release assets or `/Qmoi_apps/` directory.

## Auto-Dev & Release Automation
- PWAs are built and published automatically with every build pipeline run.
- Releases always include the latest production PWA builds for QMOI Space and QCity.

## Usage
- Download the relevant `.zip` or `.qcapp` file from the release or `/Qmoi_apps/`.
- Unzip/install on your device or platform.
- Follow the included `README` or in-app instructions for setup.

---

_Last updated: 2025-10-12_
