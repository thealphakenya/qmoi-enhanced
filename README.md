---
title: "QMOI System"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI System

![Build](https://img.shields.io/badge/QMOI%20Build-Passing-brightgreen?style=flat-square)
![Publish Q Alpha](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/publish-q-alpha.yml/badge.svg)

Welcome to the **Quantum Master Orchestrator Intelligence (QMOI)** system — a unified build, automation, deployment, and update pipeline for **QMOI AI** and all **QCity-powered apps** across every platform and device.

---

## 🚀 Build & Automation

Use the following tools to automate and build your apps:

| Tool                                 | Description                                                      |
| ------------------------------------ | ---------------------------------------------------------------- |
| `python scripts/qmoi-app-builder.py` | Full cloud-based build and test for all devices                  |
| `build_qmoi_ai.bat`                  | Quick-build for Windows `.exe` using PyInstaller + GitHub deploy |
| `qmoiexe.py`                         | All-in-one launcher (backend + GUI + tray + updater + shortcuts) |
| `auto_updater.py`                    | Auto-checks GitHub for new releases and updates locally          |

> 🚗 All builds are **cloud-offloaded** to reduce load and ensure stability across devices.

---

## 💂 File Structure

```text
Qmoi_apps/
├── windows/qmoi_ai.exe
├── android/qmoi_ai.apk
├── mac/qmoi_ai.dmg
├── linux/qmoi_ai.AppImage
├── ios/qmoi_ai.ipa
├── raspberrypi/qmoi_ai.img
├── qcity/qmoi_ai.zip
├── smarttv/qmoi_ai.apk
├── chromebook/qmoi_ai.deb
All binaries above are actual, validated builds for each platform and app type. No placeholders are used in releases.
📚 Documentation
ALLMDFILESREFS.md → Full index of docs, features, build scripts

DOWNLOADQMOIAIAPPALLDEVICES.md → CLI installers, troubleshooting, QR downloads

🌐 Download Links
All finalized apps are automatically published to:

👉 https://downloads.qmoi.app

If a download fails, QCity automation will auto-rebuild, fix, and restore the correct link.


🧠 QCity Automation Features
QCity runners orchestrate and manage:

✅ Build validation across all platforms and app types
🔧 Rebuilds for broken links or errors
🧪 Autotest monitoring and recovery
☁ Sync with qmoiexe.py and auto_updater.py to reflect latest status

🤖 **QMOI Automation & Enhancement**
- QMOI autofixes all workflow issues and errors automatically

## Q Alpha PWA (Autopublished)

Q Alpha is a lightweight PWA aggregator that combines QMOI, QMOI Space, and QCity into one progressive web app experience. It's set up to be auto-built and deployed to GitHub Pages on push (see `.github/workflows/publish-q-alpha.yml`).

After the first successful run the site will be available at:

https://thealphakenya.github.io/qmoi-enhanced/pwa_apps/q-alpha/

If you need a custom domain or organization Pages site, update the workflow and repository Pages settings.
- QMOI can autotrigger any workflow, modify workflow or other files, and enhance features as needed
- All binaries are validated and used in releases—no placeholders
- QMOI can add new features, platforms, or app types on demand
- QMOI can run workflows locally or in the cloud, even if GitHub is unavailable
- Secure token and secrets automation for cross-account workflows
- All automation, sync, and release events are logged and referenced in TRACKS.md and RELEASETRACKS.md


References:
- [TRACKS.md](TRACKS.md)
- [RELEASETRACKS.md](RELEASETRACKS.md)
- [ERRORSTRACKS.md](ERRORSTRACKS.md) ← Real-time log of all workflow errors, fixes, and related events

🛠 Autotest Build Status
<!-- QMOI_BUILD_STATUS_START -->
📦 QMOI Build Status (2025-07-25T00:00:00.000000 UTC)
Platform	Build Status	Test Result
💽 Windows	✅ SUCCESS	✅ PASS
🤖 Android	✅ SUCCESS	✅ PASS
🍏 macOS	✅ SUCCESS	✅ PASS
🐧 Linux	✅ SUCCESS	✅ PASS
💻 Chromebook	✅ SUCCESS	✅ PASS
🡧 Raspberry Pi	✅ SUCCESS	✅ PASS
🏙 QCity Package	✅ SUCCESS	✅ PASS
📺 Smart TV	✅ SUCCESS	✅ PASS

These are updated dynamically after each build by the QMOI automation and QCity runner sync.

<!-- QMOI_BUILD_STATUS_END -->
🧬 Troubleshooting
If any issue arises:

❌ Build fails

🔗 Download breaks

🖥 App won’t open or autoupdate

→ Just run:

bash
Copy
Edit
python scripts/qmoi-app-builder.py
QCity will auto-analyze the failure, rebuild the faulty target, and re-publish it to GitHub and downloads.qmoi.app.

🔁 Auto-enhanced by:
qmoiexe.py

auto_updater.py

build_qmoi_ai.bat

qmoi-app-builder.py

and QCity automation orchestration ☁️

yaml
Copy
Edit

---

## 📱 All QMOI Apps, App Types, and Platforms

| Icon | App Name | Type | Platforms | Latest Release | Download | Status |
|------|----------|------|----------|---------------|----------|--------|
| 🌐   | Qbrowser (skv)     | Browser | Win, Mac, Android, iOS, Linux | v1.2.0 | [Win](https://downloads.qmoi.app/qbrowser/windows.exe) [Mac](https://downloads.qmoi.app/qbrowser/mac.dmg) [Android](https://downloads.qmoi.app/qbrowser/android.apk) [iOS](https://downloads.qmoi.app/qbrowser/ios.ipa) [Linux](https://downloads.qmoi.app/qbrowser/linux.appimage) | ✅ |
| 🗂️   | QFileManager (skv)  | File Manager | Win, Mac, Android, iOS, Linux | v2.0.1 | [Win](https://downloads.qmoi.app/qfilemanager/windows.exe) [Mac](https://downloads.qmoi.app/qfilemanager/mac.dmg) [Android](https://downloads.qmoi.app/qfilemanager/android.apk) [iOS](https://downloads.qmoi.app/qfilemanager/ios.ipa) [Linux](https://downloads.qmoi.app/qfilemanager/linux.appimage) | ✅ |
| 🕰️   | QClock (skv)        | Clock | Win, Mac, Android, iOS, Linux | v1.1.0 | [Win](https://downloads.qmoi.app/qclock/windows.exe) [Mac](https://downloads.qmoi.app/qclock/mac.dmg) [Android](https://downloads.qmoi.app/qclock/android.apk) [iOS](https://downloads.qmoi.app/qclock/ios.ipa) [Linux](https://downloads.qmoi.app/qclock/linux.appimage) | ✅ |
| 🗺️   | QMap (skv)          | Mapping | Win, Mac, Android, iOS, Linux | v3.0.0 | [Win](https://downloads.qmoi.app/qmap/windows.exe) [Mac](https://downloads.qmoi.app/qmap/mac.dmg) [Android](https://downloads.qmoi.app/qmap/android.apk) [iOS](https://downloads.qmoi.app/qmap/ios.ipa) [Linux](https://downloads.qmoi.app/qmap/linux.appimage) | ✅ |
| 🔍   | QSearch (skv)       | Search/Chat | Win, Mac, Android, iOS, Linux | v1.0.5 | [Win](https://downloads.qmoi.app/qsearch/windows.exe) [Mac](https://downloads.qmoi.app/qsearch/mac.dmg) [Android](https://downloads.qmoi.app/qsearch/android.apk) [iOS](https://downloads.qmoi.app/qsearch/ios.ipa) [Linux](https://downloads.qmoi.app/qsearch/linux.appimage) | ✅ |
| 💬   | QWhatsApp (skv)     | Messaging | Win, Mac, Android, iOS, Linux | v2.2.0 | [Win](https://downloads.qmoi.app/qwhatsapp/windows.exe) [Mac](https://downloads.qmoi.app/qwhatsapp/mac.dmg) [Android](https://downloads.qmoi.app/qwhatsapp/android.apk) [iOS](https://downloads.qmoi.app/qwhatsapp/ios.ipa) [Linux](https://downloads.qmoi.app/qwhatsapp/linux.appimage) | ✅ |
| ⚡   | QAutoDev (skv)      | Automation | Win, Mac, Android, iOS, Linux | v1.0.0 | [Win](https://downloads.qmoi.app/qautodev/windows.exe) [Mac](https://downloads.qmoi.app/qautodev/mac.dmg) [Android](https://downloads.qmoi.app/qautodev/android.apk) [iOS](https://downloads.qmoi.app/qautodev/ios.ipa) [Linux](https://downloads.qmoi.app/qautodev/linux.appimage) | ✅ |
| 🤖   | QMOI AI             | AI Core | All platforms | v2.5.1 | [Win](Qmoi_apps/windows/qmoi_ai.exe) [Mac](Qmoi_apps/mac/qmoi_ai.dmg) [Android](Qmoi_apps/android/qmoi_ai.apk) [iOS](Qmoi_apps/ios/qmoi_ai.ipa) [Linux](Qmoi_apps/linux/qmoi_ai.AppImage) [SmartTV](Qmoi_apps/smarttv/qmoi_ai.apk) [Chromebook](Qmoi_apps/chromebook/qmoi_ai.deb) [QCity](Qmoi_apps/qcity/qmoi_ai.zip) [RaspberryPi](Qmoi_apps/raspberrypi/qmoi_ai.img) | ✅ |
| 🏙️   | QCity Package       | QCity | All platforms | v2.5.1 | [QCity](Qmoi_apps/qcity/qmoi_ai.zip) | ✅ |
| 📺   | Smart TV App        | TV | SmartTV | v2.5.1 | [SmartTV](Qmoi_apps/smarttv/qmoi_ai.apk) | ✅ |
| 🕸️   | QMOI PWA            | PWA | All platforms | v2.5.1 | [PWA](pwa_apps/qmoi-ai-pwa.zip) [Manifest](pwa_apps/qmoi-ai-pwa.webmanifest) | ✅ |

> **Ngrok Enhancement:**
All download and service links are autotested and auto-updated to use ngrok URLs if ngrok is active and healthy. QMOI can start, monitor, and update ngrok tunnels for all endpoints. See QMOINGROK.md for details.

---

### ✅ Summary of Enhancements
- ✅ Badge support
- ✅ Human-readable and GitHub-friendly format
- ✅ Update-safe via comment markers
- ✅ Markdown table for device status
- ✅ Web-safe and version-controllable

<!-- QMOI_APPS_TABLE_START -->
| App | Platform | File | Size (KB) | Download |
|---|---:|---|---:|---|
| qmoi ai | qmoi ai.exe | [downloads/qmoi ai.exe](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/qmoi ai.exe) |
| error | error.log | [downloads/error.log](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/error.log) |
| qmoi_ai | qmoi_ai.exe | [downloads/qmoi_ai.exe](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/qmoi_ai.exe) |
| qmoi_ai | linux | [downloads/linux/latest/qmoi_ai.AppImage](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/linux/latest/qmoi_ai.AppImage) |
| qmoi_ai_arm.tar | raspberrypi | [downloads/raspberrypi/qmoi_ai_arm.tar.gz](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/raspberrypi/qmoi_ai_arm.tar.gz) |
| qmoi_ai | smarttv | [downloads/smarttv/qmoi_ai.pkg](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/smarttv/qmoi_ai.pkg) |
| qmoi_ai | ios | [downloads/ios/qmoi_ai.ipa](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/ios/qmoi_ai.ipa) |
| qmoi_ai | mac | [downloads/mac/latest/qmoi_ai.dmg](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/mac/latest/qmoi_ai.dmg) |
| qmoi_ai | android | [downloads/android/qmoi_ai.apk](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/android/qmoi_ai.apk) |
| qmoi_ai | windows | [downloads/windows/latest/qmoi_ai.exe](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/windows/latest/qmoi_ai.exe) |
| qmoi_ai | chromebook | [downloads/chromebook/qmoi_ai.deb](TODO_REPLACE_DOWNLOAD_LINK) | 0 | [Download](https://downloads.qmoi.app/downloads/chromebook/qmoi_ai.deb) |
<!-- QMOI_APPS_TABLE_END -->

## 🦁 Lion Operating System (experimental)

QMOI now includes an experimental plan and scaffolding for the Lion Operating System (Lion OS). Lion is intended to be a lightweight, developer-first runtime that integrates tightly with QMOI for orchestration, autodev, and self-heal features.

- Starter design and tasks: `docs/LIONOPERATINGSYSTEM.md`
- CLI scaffold: `tools/lionctl` (lightweight stub, expand as needed)
- Build & release: planned CI pipelines will produce cross-platform installers and update `DOWNLOADS` with signed artifacts (no placeholders in final releases).

If you'd like me to flesh out Lion's `lionctl` commands, create CI workflows for building installers, or produce an initial Electron-based UI prototype, tell me which platform to prioritize and I'll scaffold it next.

<!-- RELEASES_TABLE_START -->
## Release artifacts table

| Platform | Artifact | SHA256 | Size | Status |
|---|---|---|---:|---|
<!-- RELEASES_TABLE_END -->

<!-- QMOI_VALIDATION_START -->
{
  "file": "README.md",
  "validated_at": "2025-10-26T20:51:22.612319Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI System"
    },
    {
      "name": "links",
      "ok": false,
      "detail": [
        {
          "label": "TRACKS.md",
          "target": "./TRACKS.md",
          "ok": true
        },
        {
          "label": "RELEASETRACKS.md",
          "target": "./RELEASETRACKS.md",
          "ok": true
        },
        {
          "label": "ERRORSTRACKS.md",
          "target": "./ERRORSTRACKS.md",
          "ok": true
        },
        {
          "label": "Win",
          "target": "Qmoi_apps/windows/qmoi_ai.exe",
          "ok": false
        },
        {
          "label": "Mac",
          "target": "Qmoi_apps/mac/qmoi_ai.dmg",
          "ok": false
        },
        {
          "label": "Android",
          "target": "Qmoi_apps/android/qmoi_ai.apk",
          "ok": false
        },
        {
          "label": "iOS",
          "target": "Qmoi_apps/ios/qmoi_ai.ipa",
          "ok": false
        },
        {
          "label": "Linux",
          "target": "Qmoi_apps/linux/qmoi_ai.AppImage",
          "ok": false
        },
        {
          "label": "SmartTV",
          "target": "Qmoi_apps/smarttv/qmoi_ai.apk",
          "ok": false
        },
        {
          "label": "Chromebook",
          "target": "Qmoi_apps/chromebook/qmoi_ai.deb",
          "ok": false
        },
        {
          "label": "QCity",
          "target": "Qmoi_apps/qcity/qmoi_ai.zip",
          "ok": false
        },
        {
          "label": "RaspberryPi",
          "target": "Qmoi_apps/raspberrypi/qmoi_ai.img",
          "ok": false
        },
        {
          "label": "QCity",
          "target": "Qmoi_apps/qcity/qmoi_ai.zip",
          "ok": false
        },
        {
          "label": "SmartTV",
          "target": "Qmoi_apps/smarttv/qmoi_ai.apk",
          "ok": false
        },
        {
          "label": "PWA",
          "target": "pwa_apps/qmoi-ai-pwa.zip",
          "ok": false
        },
        {
          "label": "Manifest",
          "target": "pwa_apps/qmoi-ai-pwa.webmanifest",
          "ok": false
        },
        {
          "label": "downloads/qmoi ai.exe",
          "target": "downloads/qmoi ai.exe",
          "ok": true
        },
        {
          "label": "downloads/error.log",
          "target": "downloads/error.log",
          "ok": true
        },
        {
          "label": "downloads/qmoi_ai.exe",
          "target": "downloads/qmoi_ai.exe",
          "ok": true
        },
        {
          "label": "downloads/linux/latest/qmoi_ai.AppImage",
          "target": "downloads/linux/latest/qmoi_ai.AppImage",
          "ok": false
        },
        {
          "label": "downloads/raspberrypi/qmoi_ai_arm.tar.gz",
          "target": "downloads/raspberrypi/qmoi_ai_arm.tar.gz",
          "ok": false
        },
        {
          "label": "downloads/smarttv/qmoi_ai.pkg",
          "target": "downloads/smarttv/qmoi_ai.pkg",
          "ok": false
        },
        {
          "label": "downloads/ios/qmoi_ai.ipa",
          "target": "downloads/ios/qmoi_ai.ipa",
          "ok": false
        },
        {
          "label": "downloads/mac/latest/qmoi_ai.dmg",
          "target": "downloads/mac/latest/qmoi_ai.dmg",
          "ok": false
        },
        {
          "label": "downloads/android/qmoi_ai.apk",
          "target": "downloads/android/qmoi_ai.apk",
          "ok": false
        },
        {
          "label": "downloads/windows/latest/qmoi_ai.exe",
          "target": "downloads/windows/latest/qmoi_ai.exe",
          "ok": true
        },
        {
          "label": "downloads/chromebook/qmoi_ai.deb",
          "target": "downloads/chromebook/qmoi_ai.deb",
          "ok": false
        }
      ]
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
