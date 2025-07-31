# QMOI System

![Build](https://img.shields.io/badge/QMOI%20Build-Passing-brightgreen?style=flat-square)
![Version](https://img.shields.io/github/package-json/v/thealphakenya/Alpha-Q-ai?style=flat-square)
![Platforms](https://img.shields.io/badge/platforms-9+_Supported-blueviolet?style=flat-square)

Welcome to the **Quantum Master Orchestrator Intelligence (QMOI)** system — a fully automated build, deployment, test, and update pipeline for **QMOI AI** and all **QCity-powered apps** across every device and OS.

---

## 🚀 Automated Cross-Platform Build

### 📦 Desktop

```bash
npm run electron:build:win     # Windows (x64 & ia32)
npm run electron:build:linux   # Linux (x64, armv7l, arm64)
npm run electron:build:mac     # macOS (only on macOS)
npm run electron:build:all     # All supported desktop targets
```

### 📱 Mobile

```bash
npm run capacitor:build:android  # Android (.apk)
npm run capacitor:build:ios      # iOS (.ipa, macOS required)
```

### 🔁 Full Autonomous Build + Upload + Test

```bash
npm run build:all-platforms
```

Automatically adapts UI, retries failed builds, uploads releases, validates links, and logs everything.

---

## ⚙️ Automation Components

| Tool                              | Description                                                               |
| --------------------------------- | ------------------------------------------------------------------------- |
| `scripts/build-all-platforms.js`  | Orchestrates all builds, logs, retries, UI injection, and triggers upload |
| `scripts/qmoi-log-uploader.js`    | Auto-syncs logs to GitHub + Google Drive                                  |
| `scripts/qmoi-app-builder.py`     | Fallback rebuilds, release sync, QR + metadata updater                    |
| `scripts/download-link-tester.js` | Verifies live download URLs and auto-repairs if down                      |
| `build_qmoi_ai.bat`               | Fast Windows `.exe` + upload shortcut                                     |
| `qmoiexe.py`                      | App launcher (UI + backend + tray + auto-start + update)                  |
| `auto_updater.py`                 | In-app updater (exe/apk/ipa) with fallback mirror                         |

---

## 📁 File Structure

```text
Qmoi_apps/
├── windows/qmoi_ai.exe
├── android/qmoi ai.apk
├── ios/qmoi_ai.ipa
├── mac/qmoi_ai.dmg
├── linux/qmoi_ai.AppImage
├── chromebook/qmoi_ai.zip
├── raspberrypi/qmoi_ai.img
├── smarttv/qmoi_ai.tvapp
└── qcity/qmoi_ai.qcapp
```

📂 Docs:

* `ALLMDFILESREFS.md` – Full system docs
* `BUILDAPPSFORALLPLATFORMS.md` – Platform-specific build automation
* `DOWNLOADQMOIAIAPPALLDEVICES.md` – Installers + CLI + QR

---

## 🌐 Download Management

🔗 Main: [https://downloads.qmoi.app](https://downloads.qmoi.app)

### ✅ Automated Link Testing

* `scripts/download-link-tester.js` checks all links hourly
* If broken: triggers fallback rebuild + uploads new release
* Fallbacks: Ngrok, IPFS, CDN auto-switching

```bash
node scripts/download-link-tester.js --platform=android
```

---

## 🧠 QCity Orchestration

* ✅ Autonomous cross-platform validation
* 🔄 GitHub + IPFS + CDN deploy sync
* 📦 Rebuild and relink automation
* 🧪 Test result reporting
* 📸 Screenshots + QR sync
* ☁️ Powered by QCity + Quantum Cloud

---

## 🧪 Auto-Tested Build Status

<!-- QMOI_BUILD_STATUS_START -->

📦 QMOI Build Status (2025-07-29T16:00:00 UTC)

| Platform        | Build Status | Test Result | Link Verified | File Size |
| --------------- | ------------ | ----------- | ------------- | --------- |
| 📪 Windows      | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 92 MB     |
| 🤖 Android      | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 62 MB     |
| 📱 iOS          | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 89 MB     |
| 🍏 macOS        | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 95 MB     |
| 🐧 Linux        | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 88 MB     |
| 💻 Chromebook   | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 100 MB    |
| 🟧 Raspberry Pi | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 110 MB    |
| 📺 Smart TV     | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 77 MB     |
| 🏙 QCity        | ✅ SUCCESS    | ✅ PASS      | ✅ Online      | 56 MB     |

<!-- QMOI_BUILD_STATUS_END -->

🟢 Auto-synced after every pipeline via `qmoi-app-builder.py`

---

## 📲 QR + Metadata Sync

Auto-generated and injected:

* ✅ QR codes per platform
* ✅ Latest metadata (`version.json`, `release.json`)

Accessible from:

```text
docs/qr/      ← Static QR exports
/app/menu     ← In-app: Menu → QR Installer
```

---

## 🧯 Self-Healing Troubleshooting

Run this anytime to auto-fix builds, downloads, layouts:

```bash
python scripts/qmoi-app-builder.py
# or
npm run build:all-platforms
```

Handles:

* Failed builds
* Missing metadata
* Broken download links
* Layout sync
* QR + release re-generation

---

## ✅ System Overview

| Component                 | Role                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `build-all-platforms.js`  | Master builder, fallback engine, logger, and release manager |
| `platform-ui-adapter.js`  | Detects + injects UI layout into `layout.tsx`                |
| `qmoiexe.py`              | UI + Backend launcher, system tray, shortcuts                |
| `auto_updater.py`         | Background update checker and self-upgrader                  |
| `download-link-tester.js` | Live URL tester + fallback restarter                         |
| `qmoi-app-builder.py`     | Orchestrator for all builds, fallback, push + QR system      |

---

## 🚦 Features Enabled

| Feature                   | Status   |
| ------------------------- | -------- |
| Platform-Aware UI         | ✅ Active |
| Full Auto-Build & Rebuild | ✅ Active |
| Download Mirrors & Sync   | ✅ Active |
| QR & Metadata Management  | ✅ Synced |
| GitHub Releases + IPFS    | ✅ Live   |
| Installer Size Tracking   | ✅ On     |
| Device-Specific Packages  | ✅ Built  |
| 24/7 Link Monitoring      | ✅ Online |

---

## 📬 Contribute or Report

Want to contribute?

* [Open an issue](https://github.com/thealphakenya/Alpha-Q-ai/issues)
* Use the in-app "Feedback" button in any QMOI app

© QMOI System — Powered by QCity ☁️ + Quantum Cloud 🧠 — All rights reserved.
