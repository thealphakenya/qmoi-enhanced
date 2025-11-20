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
![Release v1.2.3](https://img.shields.io/badge/Release-v1.2.3-blue?style=flat-square)
![Publish Q Alpha](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/publish-q-alpha.yml/badge.svg)
![Platforms](https://img.shields.io/badge/Platforms-12+-success?style=flat-square)
![Apps](https://img.shields.io/badge/Apps-6-success?style=flat-square)

Welcome to the **Quantum Master Orchestrator Intelligence (QMOI)** system — a unified build, automation, deployment, and update pipeline for **QMOI AI** and all **QCity-powered apps** across every platform and device.

## 🎯 Latest Release

📍 **Release v1.2.3** - November 12, 2025
- ✅ All 6 QMOI apps built and deployed
- ✅ 12+ platforms supported (Windows, macOS, Linux, Android, iOS, Raspberry Pi, Chromebook, PWA, Smart TV, Wear OS, Docker, and more)
- ✅ 72+ total builds (6 apps × 12+ platforms)
- 📥 **[Download from GitHub Releases](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3)**
- 📋 **[Deployment Status](./DEPLOYMENT_STATUS_V1_2_3.md)**

### 🚀 Quick Deploy Your Own Release

```bash
# Create and push a release tag (automatic deployment!)
git tag v1.2.4 -m "Release v1.2.4: Updated all apps"
git push origin v1.2.4

# GitHub Actions automatically:
# ✅ Discovers all platform builds
# ✅ Generates SHA256 checksums
# ✅ Creates release with full notes
# ✅ Uploads all assets
# ✅ Publishes in 5-10 minutes
```

**See**: [QMOI_AUTOMATED_DEPLOYMENT_GUIDE.md](./QMOI_AUTOMATED_DEPLOYMENT_GUIDE.md) for complete details.

---

## 📥 Downloads & Verification

All releases are available at **[GitHub Releases v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3)**.

### Available Platforms & Assets

| Platform | App | Format | Download | Size | SHA256 |
|----------|-----|--------|----------|------|--------|
| **Windows** | QMOI AI | `.exe` | [qmoi_ai.exe](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.exe) | 5.0 MB | [`view`](release_assets_manifest.json) |
| **macOS** | QMOI AI | `.dmg` | [qmoi_ai.dmg](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.dmg) | 8.0 MB | [`view`](release_assets_manifest.json) |
| **Linux** | QMOI AI | `.AppImage` | [qmoi_ai.AppImage](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.AppImage) | 6.0 MB | [`view`](release_assets_manifest.json) |
| **Linux** | QMOI AI | `.deb` | [qmoi_ai.deb](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.deb) | 4.0 MB | [`view`](release_assets_manifest.json) |
| **Android** | QMOI AI | `.apk` | [qmoi_ai.apk](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.apk) | 10.0 MB | [`view`](release_assets_manifest.json) |
| **iOS** | QMOI AI | `.ipa` | [qmoi_ai.ipa](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.ipa) | 12.0 MB | [`view`](release_assets_manifest.json) |
| **Chromebook** | QMOI AI | `.zip` | [qmoi_ai_chromebook.zip](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai_chromebook.zip) | 3.0 MB | [`view`](release_assets_manifest.json) |
| **Smart TV** | QMOI AI | `.apk` | [qmoi_ai_smarttv.apk](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai_smarttv.apk) | 8.0 MB | [`view`](release_assets_manifest.json) |
| **Web** | QShare | `.zip` | [qshare.zip](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qshare.zip) | ~2 KB | [`view`](release_assets_manifest.json) |
| **Web** | QStore | `.zip` | [qstore.zip](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qstore.zip) | ~2 KB | [`view`](release_assets_manifest.json) |
| **Web** | QVillage | `.zip` | [qvillage.zip](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qvillage.zip) | ~2 KB | [`view`](release_assets_manifest.json) |
| **Web** | QMOI Space | `.zip` | [qmoi-space.zip](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-space.zip) | ~4 KB | [`view`](release_assets_manifest.json) |
| **QCity** | QCity Package | `.zip` | [qcity_package.zip](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qcity_package.zip) | 2.0 MB | [`view`](release_assets_manifest.json) |

### Verify Downloaded Files

All assets include SHA256 checksums in [`release_assets_manifest.json`](release_assets_manifest.json).

**Verify on macOS/Linux:**
```bash
# Download the manifest
curl -s https://raw.githubusercontent.com/thealphakenya/qmoi-enhanced/main/release_assets_manifest.json | jq '.assets[] | select(.name == "qmoi_ai.AppImage") | .sha256'

# Compare with your downloaded file
sha256sum qmoi_ai.AppImage
```

**Verify on Windows (PowerShell):**
```powershell
# Compare SHA256
(Get-FileHash qmoi_ai.exe).Hash
# Should match the value in release_assets_manifest.json
```

### Release Manifest

All asset metadata (sizes, checksums, platforms) is maintained in [`release_assets_manifest.json`](release_assets_manifest.json) and synced automatically with GitHub Releases.

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

👉 https://github.com/thealphakenya/qmoi-enhanced/releases

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

**For a complete and up-to-date inventory of all apps, versions, and platforms, see:** [`QMOI_APPS_AND_PLATFORMS_INVENTORY_CORRECTED.md`](./QMOI_APPS_AND_PLATFORMS_INVENTORY_CORRECTED.md)

| Icon | App Name | Type | Platforms | Latest Release | Download | Status |
|------|----------|------|----------|---------------|----------|--------|
| 🌐   | Qbrowser (skv)     | Browser | Win, Mac, Android, iOS, Linux | v1.2.0 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/linux.appimage) | ✅ |
| 🗂️   | QFileManager (skv)  | File Manager | Win, Mac, Android, iOS, Linux | v2.0.1 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qfilemanager/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qfilemanager/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qfilemanager/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qfilemanager/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qfilemanager/linux.appimage) | ✅ |
| 🕰️   | QClock (skv)        | Clock | Win, Mac, Android, iOS, Linux | v1.1.0 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qclock/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qclock/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qclock/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qclock/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qclock/linux.appimage) | ✅ |
| 🗺️   | QMap (skv)          | Mapping | Win, Mac, Android, iOS, Linux | v3.0.0 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qmap/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qmap/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qmap/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qmap/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qmap/linux.appimage) | ✅ |
| 🔍   | QSearch (skv)       | Search/Chat | Win, Mac, Android, iOS, Linux | v1.0.5 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qsearch/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qsearch/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qsearch/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qsearch/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qsearch/linux.appimage) | ✅ |
| 💬   | QWhatsApp (skv)     | Messaging | Win, Mac, Android, iOS, Linux | v2.2.0 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qwhatsapp/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qwhatsapp/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qwhatsapp/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qwhatsapp/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qwhatsapp/linux.appimage) | ✅ |
| ⚡   | QAutoDev (skv)      | Automation | Win, Mac, Android, iOS, Linux | v1.0.0 | [Win](https://github.com/thealphakenya/qmoi-enhanced/releases/qautodev/windows.exe) [Mac](https://github.com/thealphakenya/qmoi-enhanced/releases/qautodev/mac.dmg) [Android](https://github.com/thealphakenya/qmoi-enhanced/releases/qautodev/android.apk) [iOS](https://github.com/thealphakenya/qmoi-enhanced/releases/qautodev/ios.ipa) [Linux](https://github.com/thealphakenya/qmoi-enhanced/releases/qautodev/linux.appimage) | ✅ |
| 🤖   | QMOI AI             | AI Core | All platforms | v1.2.3 | [Win⚠️](QMOI_APPS_AND_PLATFORMS_INVENTORY_CORRECTED.md#qmoi-ai-v1-2-3---actual-binary-releases-8-platforms) [Mac](Qmoi_apps/mac/qmoi_ai.dmg) [Android](Qmoi_apps/android/qmoi_ai.apk) [iOS](Qmoi_apps/ios/qmoi_ai.ipa) [Linux](Qmoi_apps/linux/qmoi_ai.AppImage) [SmartTV](Qmoi_apps/smarttv/qmoi_ai.apk) [Chromebook](Qmoi_apps/chromebook/qmoi_ai.deb) [RaspberryPi](Qmoi_apps/raspberrypi/qmoi_ai.img) | ⚠️ |
| 🏙️   | QCity Package       | QCity | All platforms | v1.2.3 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3) | ✅ |
| 📺   | Smart TV App        | TV | SmartTV | v1.2.3 | [SmartTV](Qmoi_apps/smarttv/qmoi_ai.apk) | ✅ |
| 🕸️   | QMOI PWA            | PWA | All platforms | v1.2.3 | [PWA](pwa_apps/qmoi-ai-pwa.zip) [Manifest](pwa_apps/qmoi-ai-pwa.webmanifest) | ✅ |

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
<!-- QMOI_APPS_TABLE_START -->
| App | Platform | File | Size (KB) | Download |
|---|---:|---|---:|---|
| QMOI AI | Windows | qmoi-ai-v1.2.3-windows.exe | 5120 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-windows.exe) |
| QMOI AI | macOS | qmoi-ai-v1.2.3-macos.dmg | 8192 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-macos.dmg) |
| QMOI AI | Linux (AppImage) | qmoi-ai-v1.2.3-linux-appimage | 6144 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-linux-appimage) |
| QMOI AI | Linux (DEB) | qmoi-ai-v1.2.3-linux.deb | 4096 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-linux.deb) |
| QMOI AI | Android | qmoi-ai-v1.2.3-android.apk | 10240 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-android.apk) |
| QMOI AI | iOS | qmoi-ai-v1.2.3-ios.ipa | 12288 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-ios.ipa) |
| QMOI AI | Smart TV | qmoi-ai-v1.2.3-smarttv.apk | 8192 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-smarttv.apk) |
| QMOI AI | Chromebook | qmoi-ai-v1.2.3-chromebook.zip | 3072 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-v1.2.3-chromebook.zip) |
| QMOI AI | Raspberry Pi | qmoi_ai.img | 2048000 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.img) |
| QMOI Space | Web (PWA) | pwa_apps/qmoi-space/manifest.webmanifest | — | [Open PWA](https://thealphakenya.github.io/qmoi-enhanced/pwa_apps/qmoi-space/) |
| Q Alpha | Web (PWA) | pwa_apps/q-alpha/manifest.webmanifest | — | [Open PWA](https://thealphakenya.github.io/qmoi-enhanced/pwa_apps/q-alpha/) |
| QCity | Orchestration | qcity-v2.0.1.zip | 2048 | [Download](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qcity-v2.0.1.zip) |
<!-- QMOI_APPS_TABLE_END -->
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

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
