# QMOI Apps & Platforms Inventory (CORRECTED)

**Last Updated:** 2025-11-13  
**Status:** ⚠️ **CORRECTED - Web-only apps now clearly marked**

> **⚠️ CRITICAL CORRECTION:** Previous version made false claims about app availability. This document now correctly distinguishes:
>
> - 📦 **Binary Apps:** QMOI AI, QCity (downloadable standalone executables)
> - 🌐 **Web-Only Apps:** QShare, Yap, QStore, QVillage (accessed via browser, NO downloads)
>
> See [GITHUB_RELEASES_VERIFICATION_REPORT.md](./GITHUB_RELEASES_VERIFICATION_REPORT.md) for detailed findings.

---

## Core Apps - Actual Status

| App Name     | Version | Type            | Actual Platforms                                                     | Status         |
| ------------ | ------- | --------------- | -------------------------------------------------------------------- | -------------- |
| **QMOI AI**  | v1.2.3  | 📦 Binary       | Windows, macOS, Linux (2 flavors), Android, iOS, SmartTV, Chromebook | ✅ 8 platforms |
| **QCity**    | v2.0.1  | 📦 Binary (ZIP) | All platforms (universal)                                            | ✅ Universal   |
| **QShare**   | v1.0.0  | 🌐 Web          | Browser-based only                                                   | 🌐 Web-only    |
| **Yap**      | v1.1.0  | 🌐 Web          | Browser-based only                                                   | 🌐 Web-only    |
| **QStore**   | v1.0.0  | 🌐 Web          | Browser-based only                                                   | 🌐 Web-only    |
| **QVillage** | v1.0.0  | 🌐 Web          | Browser-based only                                                   | 🌐 Web-only    |

---

## QMOI AI v1.2.3 - Actual Binary Releases (8 Platforms)

### Platform-Specific Binaries

#### Windows

- **Binary:** `qmoi_ai.exe`
- **Location:** `Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe`
- **Size:** 5.0 MB (✅ Real binary, NOT [AUTOFIXED by Ollama at 2026-07-26T18:54:39.540942Z])
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.exe)

#### macOS

- **Binary:** `qmoi_ai.dmg`
- **Location:** `Qmoi_downloaded_apps/mac/latest/qmoi_ai.dmg`
- **Size:** 8.0 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.dmg)

#### Linux - AppImage

- **Binary:** `qmoi_ai.AppImage`
- **Location:** `Qmoi_downloaded_apps/linux/latest/qmoi_ai.AppImage`
- **Size:** 6.0 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.AppImage)

#### Linux - DEB (Debian/Ubuntu)

- **Binary:** `qmoi_ai.deb`
- **Location:** `Qmoi_downloaded_apps/linux/latest/qmoi_ai.deb`
- **Size:** 4.0 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.deb)

#### Android

- **Binary:** `qmoi_ai.apk`
- **Location:** `Qmoi_downloaded_apps/android/latest/qmoi_ai.apk`
- **Size:** 10 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.apk)

#### iOS

- **Binary:** `qmoi_ai.ipa`
- **Location:** `Qmoi_downloaded_apps/ios/latest/qmoi_ai.ipa`
- **Size:** 12 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.ipa)

#### Smart TV (Android)

- **Binary:** `qmoi_ai_smarttv.apk`
- **Location:** `Qmoi_downloaded_apps/smarttv/latest/qmoi_ai_smarttv.apk`
- **Size:** 8.0 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai_smarttv.apk)

#### Chromebook (Linux Container)

- **Binary:** `qmoi_ai_chromebook.zip`
- **Location:** `Qmoi_downloaded_apps/chromebook/latest/qmoi_ai_chromebook.zip`
- **Size:** 3.0 MB
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai_chromebook.zip)

### ⚠️ Documented but NOT Available

These platforms were claimed in documentation but actual binaries NOT found:

- ❌ **Raspberry Pi** — Claimed in docs; `.img` file not found
- ❌ **Wear OS** — Claimed in docs; binary not found
- ❌ **Docker** — Claimed in docs; image not found

---

## QCity v2.0.1 - Binary Release (1 Package)

### Universal ZIP Package

- **Binary:** `qcity_package.zip`
- **Location:** `Qmoi_downloaded_apps/qcity/latest/qcity_package.zip`
- **Size:** 2.0 MB
- **Platforms:** All (works on Windows, macOS, Linux, Android, iOS)
- **Status:** ✅ Available
- **Download:** [GitHub Release v1.2.3](https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qcity_package.zip)

---

## Web-Only Apps (NO Binary Downloads)

These applications are **NOT** available as downloadable binaries. They are accessed exclusively via web browsers or as web applications (PWA).

### QShare v1.0.0 - Secure File Sharing

- **Type:** 🌐 Web Application
- **Access:** https://qshare.qmoi.app
- **Platforms:** All (via web browser)
- **Download:** None (web-only)
- **Repository:** https://github.com/thealphakenya/qshare
- **Status:** 🌐 Web-based

### Yap v1.1.0 - Communication Platform

- **Type:** 🌐 Web Application
- **Access:** https://yap.qmoi.app
- **Platforms:** All (via web browser)
- **Download:** None (web-only)
- **Repository:** https://github.com/thealphakenya/yap
- **Status:** 🌐 Web-based

### QStore v1.0.0 - App Store

- **Type:** 🌐 Web Application
- **Access:** https://qstore.qmoi.app
- **Platforms:** All (via web browser)
- **Download:** None (web-only)
- **Repository:** https://github.com/thealphakenya/qstore
- **Status:** 🌐 Web-based

### QVillage v1.0.0 - Community Hub

- **Type:** 🌐 Web Application
- **Access:** https://qvillage.qmoi.app
- **Platforms:** All (via web browser)
- **Download:** None (web-only)
- **Repository:** https://github.com/thealphakenya/qvillage
- **Status:** 🌐 Web-based

---

## Platform Availability Matrix

| Platform     | QMOI AI | QCity  | QShare | Yap    | QStore | QVillage |
| ------------ | ------- | ------ | ------ | ------ | ------ | -------- |
| Windows      | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| macOS        | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| Linux        | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| Android      | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| iOS          | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| SmartTV      | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| Chromebook   | ✅      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| Wear OS      | ❌      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| Raspberry Pi | ❌      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |
| Docker       | ❌      | ✅ ZIP | 🌐 Web | 🌐 Web | 🌐 Web | 🌐 Web   |

**Legend:**

- ✅ = Available as binary
- ✅ ZIP = Available via universal ZIP
- 🌐 Web = Web-only (no download)
- ❌ = Not available

---

## GitHub Release Links

- **Main Release (v1.2.3):** https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3
- **All Releases:** https://github.com/thealphakenya/qmoi-enhanced/releases
- **Latest:** https://github.com/thealphakenya/qmoi-enhanced/releases/latest

---

## Installation Instructions

### QMOI AI - Platform-Specific

**Windows:**

```bash
# Download qmoi_ai.exe (5.0 MB)
qmoi_ai.exe
# Follow installer wizard
```

**macOS:**

```bash
# Download qmoi_ai.dmg (8.0 MB)
# Double-click and drag to Applications
# Or: sudo hdiutil attach qmoi_ai.dmg && open /Volumes/QMOI\ AI/
```

**Linux (AppImage):**

```bash
chmod +x qmoi_ai.AppImage
./qmoi_ai.AppImage
```

**Linux (DEB):**

```bash
sudo dpkg -i qmoi_ai.deb
# Or: sudo apt install ./qmoi_ai.deb
qmoi-ai  # Run application
```

**Android:**

```
1. Download qmoi_ai.apk (10 MB)
2. Enable "Unknown sources" in Settings
3. Tap APK file to install
```

**iOS:**

```
1. App likely distributed via TestFlight (beta)
2. Or manual installation via Xcode for developers
```

**SmartTV:**

```
1. Download qmoi_ai_smarttv.apk to USB drive
2. Connect to SmartTV and install from file
```

**Chromebook:**

```
1. Download qmoi_ai_chromebook.zip
2. Extract to Linux files (or GDrive)
3. Enable Linux container in Chromebook settings
4. Install via unzipped package
```

### QCity - Universal Installation

```bash
# Extract ZIP on any platform
unzip qcity_package.zip
cd qcity

# Run based on your OS:
# Windows: qcity.exe
# macOS/Linux: ./qcity
# Android/iOS: Deploy via browser or app container
```

### QShare, Yap, QStore, QVillage - Web Access

```
1. Open web browser
2. Navigate to:
   - QShare: https://qshare.qmoi.app
   - Yap: https://yap.qmoi.app
   - QStore: https://qstore.qmoi.app
   - QVillage: https://qvillage.qmoi.app
3. No installation needed
```

---

## Troubleshooting

### Common Issues

**"File is corrupted" or "Not a valid executable"**

- Download the correct binary for your platform
- Verify file size matches this document
- Clear browser cache and re-download

**"Permission denied" on Linux/macOS**

```bash
chmod +x ./application_binary
./application_binary
```

**"Unrecognized developer" on macOS**

- Right-click app → Open → Click Open
- Or: `xattr -d com.apple.quarantine ./app`

**"App won't start" on Android**

- Check Android version compatibility
- Uninstall and reinstall
- Clear app cache: Settings → Apps → QMOI AI → Storage → Clear Cache

### Platform-Specific Help

- **macOS issues:** See docs/README_macOS.md
- **Linux issues:** See docs/README_Linux.md
- **Android issues:** See docs/README_Android.md
- **iOS issues:** See docs/README_iOS.md

---

## Directory Locations (Internal Reference)

**Actual Binaries:**

```
/workspaces/qmoi-enhanced/Qmoi_downloaded_apps/
├── windows/latest/qmoi_ai.exe
├── mac/latest/qmoi_ai.dmg
├── linux/latest/qmoi_ai.AppImage
├── linux/latest/qmoi_ai.deb
├── android/latest/qmoi_ai.apk
├── ios/latest/qmoi_ai.ipa
├── smarttv/latest/qmoi_ai_smarttv.apk
├── chromebook/latest/qmoi_ai_chromebook.zip
└── qcity/latest/qcity_package.zip
```

**⚠️ WARNING:** Do NOT use `/downloads/windows/latest/qmoi_ai.exe` (contains 169-byte [AUTOFIXED by Ollama at 2026-07-26T18:54:39.540942Z] stub)

---

## Summary of Changes from Previous Version

### Corrections Made

- ✅ Clarified that QShare, Yap, QStore, QVillage are web-only (NOT multi-platform binaries)
- ✅ Corrected Windows executable status: it's a real 5MB binary, NOT a [AUTOFIXED by Ollama at 2026-07-26T18:54:39.540942Z]
- ✅ Removed false claims about "72+ platform-specific builds"
- ✅ Listed actual 8 platforms with binaries (not 12+)
- ✅ Added directory path clarification (Qmoi_downloaded_apps vs downloads)
- ✅ Marked missing platforms (Raspberry Pi, Wear OS, Docker) as "not found"

### Previous False Claims

- ❌ "All 6 apps available for all platforms" → Only 2 apps have binaries
- ❌ "QShare, Yap, QStore, QVillage on 12+ platforms" → Web-only, no binaries
- ❌ "Windows exe is [AUTOFIXED by Ollama at 2026-07-26T18:54:39.540942Z] stub" → Actually a real 5MB binary
- ❌ "72+ total builds" → Actually 9 builds (8 QMOI AI + 1 QCity ZIP)

---

**For detailed verification findings, see:** [GITHUB_RELEASES_VERIFICATION_REPORT.md](./GITHUB_RELEASES_VERIFICATION_REPORT.md)
