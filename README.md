# QMOI System

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
├── chromebook/qmoi_ai.deb
├── raspberrypi/qmoi_ai.img
├── qcity/qmoi_ai.zip
```

---

## 📚 Documentation

* [`ALLMDFILESREFS.md`](ALLMDFILESREFS.md) → Full index of docs, features, build scripts
* [`DOWNLOADQMOIAIAPPALLDEVICES.md`](DOWNLOADQMOIAIAPPALLDEVICES.md) → CLI installers, troubleshooting, QR downloads

---

## 🌐 Download Links

All finalized apps are automatically published to:

👉 [https://downloads.qmoi.app](https://downloads.qmoi.app)

If a download fails, **QCity automation** will auto-rebuild, fix, and restore the correct link.

---

## 🧠 QCity Automation Features

QCity runners orchestrate and manage:

* ✅ Build validation across 8 platforms
* 🔀 Auto-update push to GitHub releases
* 🔧 Rebuilds for broken links or errors
* 🧪 Autotest monitoring and recovery
* ☁ Sync with `qmoiexe.py` and `auto_updater.py` to reflect latest status

Everything is coordinated end-to-end between cloud + local `.exe` behavior.

---

## 🛠 Autotest Build Status

| Platform         | Build Status | Test Result |
| ---------------- | ------------ | ----------- |
| 💽 Windows       | ❌ FAIL       | ❌ FAIL      |
| 🤖 Android       | ❌ FAIL       | ❌ FAIL      |
| 🍏 macOS         | ❌ FAIL       | ❌ FAIL      |
| 🐧 Linux         | ❌ FAIL       | ❌ FAIL      |
| 📱 iOS           | ❌ FAIL       | ❌ FAIL      |
| 💻 Chromebook    | ❌ FAIL       | ❌ FAIL      |
| 🡧 Raspberry Pi  | ❌ FAIL       | ❌ FAIL      |
| 🏙 QCity Package | ❌ FAIL       | ❌ FAIL      |

> These are updated dynamically after each build by the QMOI automation and QCity runner sync.

---

## 🧬 Troubleshooting

If any issue arises:

* ❌ Build fails
* 🔗 Download breaks
* 🖥 App won’t open or autoupdate

→ Just run:

```bash
python scripts/qmoi-app-builder.py
```

QCity will auto-analyze the failure, rebuild the faulty target, and re-publish it to GitHub and [downloads.qmoi.app](https://downloads.qmoi.app).

---

### 🔁 Auto-enhanced by:

* `qmoiexe.py`
* `auto_updater.py`
* `build_qmoi_ai.bat`
* `qmoi-app-builder.py`
* and QCity automation orchestration ☁️
