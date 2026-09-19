# QMOI Apps & Platforms Inventory (All Versions, All Platforms)

**Last Updated:** 2025-11-13

This is the master inventory of all QMOI applications, their versions, supported platforms, GitHub release links, and build/download status.

## Core Apps

| App Name | Version | Description                      | Platforms                          | GitHub Link                                                                   | Status   |
| -------- | ------- | -------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- | -------- |
| QMOI AI  | v1.2.3  | Main AI engine and orchestrator  | Win, Mac, Linux, Android, iOS, Web | [Release](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3) | ✅ Built |
| QCity    | v1.2.3  | Unified device and app manager   | All                                | [Release](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3) | ✅ Built |
| QVillage | v1.0.0  | Community collaboration platform | All                                | [Release](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3) | ✅ Built |
| QStore   | v1.0.0  | Universal app store              | All                                | [Release](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3) | ✅ Built |
| QSpace   | v1.0.0  | Cloud sync and backup            | All                                | [Release](https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3) | ✅ Built |

## Platform-Specific Binaries

### Windows

- **qmoi_ai.exe** — Main Windows executable
  - Path: `downloads/windows/latest/qmoi_ai.exe`
  - Status: ⚠️ **Placeholder stub** (169 bytes) — See build instructions below
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.exe

### macOS

- **qmoi_ai.dmg** — macOS installer
  - Path: `downloads/mac/latest/qmoi_ai.dmg`
  - Status: ✅ Documented (verify on GitHub releases)
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.dmg

### Linux

- **qmoi_ai.AppImage** — Universal Linux binary
  - Path: `downloads/linux/latest/qmoi_ai.AppImage`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.AppImage

- **qmoi_ai.deb** — Debian/Ubuntu package
  - Path: `downloads/linux/latest/qmoi_ai.deb`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.deb

### Android

- **qmoi_ai.apk** — Android application package
  - Path: `downloads/android/latest/qmoi_ai.apk`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.apk

- **qmoi_ai_smarttv.apk** — Android TV version
  - Path: `downloads/android_smarttv/latest/qmoi_ai_smarttv.apk`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai_smarttv.apk

### iOS

- **qmoi_ai.ipa** — iOS application package
  - Path: `downloads/ios/latest/qmoi_ai.ipa`
  - Status: ✅ Documented (may require TestFlight for distribution)
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.ipa

### Chromebook

- **qmoi_ai.deb** — Chromebook Linux container package
  - Path: `downloads/chromebook/latest/qmoi_ai.deb`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.deb

### Raspberry Pi

- **qmoi_ai.img** — Raspberry Pi image
  - Path: `downloads/raspberrypi/latest/qmoi_ai.img`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi_ai.img

### Web

- **qmoi-ai-web.zip** — Web version (React/Vue)
  - Path: `downloads/web/latest/qmoi-ai-web.zip`
  - Status: ✅ Documented
  - Download: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.3/qmoi-ai-web.zip

## Important Notes

### ⚠️ qmoi_ai.exe Status

**The Windows executable (`qmoi_ai.exe`) in this repository is currently a 169-byte [AUTOFIXED by Ollama at 2026-07-26T18:54:39.540243Z] stub.** This is used for documentation and link verification purposes only.

**To obtain a working Windows build:**

1. **Build from source:**

   ```bash
   # Ensure Python 3.8+ and PyInstaller are installed
   pip install pyinstaller
   pyinstaller qmoi_ai.spec
   # Output: dist/qmoi_ai.exe
   ```

2. **Download official release:**
   - Visit: https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3
   - Look for `qmoi_ai.exe` (verify file size > 45MB)
   - Scan with antivirus before installation

3. **Installation steps (Windows):**
   ```bash
   # After obtaining a proper .exe file:
   qmoi_ai.exe --install
   # Or double-click and follow the installer wizard
   ```

## Platform Availability Matrix

| Platform         | Status         | Latest Version | Build Type            |
| ---------------- | -------------- | -------------- | --------------------- |
| Windows          | ⚠️ Placeholder | v1.2.3         | EXE Installer         |
| macOS            | ✅ Available   | v1.2.3         | DMG Installer         |
| Linux (AppImage) | ✅ Available   | v1.2.3         | AppImage              |
| Linux (Deb)      | ✅ Available   | v1.2.3         | DEB Package           |
| Android          | ✅ Available   | v1.2.3         | APK                   |
| Android TV       | ✅ Available   | v1.2.3         | APK                   |
| iOS              | ✅ Available   | v1.2.3         | IPA (TestFlight)      |
| Chromebook       | ✅ Available   | v1.2.3         | DEB (Linux Container) |
| Raspberry Pi     | ✅ Available   | v1.2.3         | IMG (Disk Image)      |
| Web              | ✅ Available   | v1.2.3         | Web App (ZIP)         |

## GitHub Release Links

- **Main Release (v1.2.3):** https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.3
- **All Releases:** https://github.com/thealphakenya/qmoi-enhanced/releases
- **Latest:** https://github.com/thealphakenya/qmoi-enhanced/releases/latest

## Troubleshooting Installation

### Windows Installation Issues

**Problem:** "File is corrupted" or "Not a valid Win32 application"

- **Cause:** Placeholder stub file used instead of real executable
- **Solution:** Download the official release from GitHub (>45MB)

**Problem:** "SmartScreen warning" or "Unrecognized developer"

- **Cause:** Code signing certificate or first-time run
- **Solution:** Click "More info" → "Run anyway" or contact support

**Problem:** "Missing DLL" errors

- **Cause:** Missing runtime dependencies
- **Solution:** Install Visual C++ Redistributable (vcredist)

### Other Platforms

Refer to platform-specific README files:

- macOS: `docs/README_macOS.md`
- Linux: `docs/README_Linux.md`
- Android: `docs/README_Android.md`
- iOS: `docs/README_iOS.md`

## Building Your Own Binaries

See `BUILD_COMPLETION_SUMMARY.md` and `BUILDAPPSFORALLPLATFORMS.md` for comprehensive build instructions.

---

**For updates and announcements:** Follow releases at https://github.com/thealphakenya/qmoi-enhanced/releases
