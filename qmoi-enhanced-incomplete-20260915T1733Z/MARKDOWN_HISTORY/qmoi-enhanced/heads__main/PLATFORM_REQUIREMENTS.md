# Platform Requirements & App Distribution Matrix

**Last Updated:** 2026-08-13  
**Status:** Comprehensive Platform Support System  
**Owner:** QMOI Autonomous Development System  

---

## Overview

This document defines all platform-specific requirements for QMOI apps (QMOIAIUI, QMOI Space, QCity, QALPHA) across all target platforms, enabling the ollama autonomous agent to validate, build, and distribute apps correctly for each platform—even before physical devices are available.

---

## Part 1: Windows (Desktop)

### Platform Specifications
- **OS Versions:** Windows 10 (v1909+), Windows 11
- **Architecture:** x64 (primary), ARM64 (preview support)
- **Runtime:** .NET 8.0+ or VC++ Redistributable 2022
- **.NET Framework:** Windows Forms, WPF, or Electron-based web wrapper
- **APIs:** Win32, UWP (Universal Windows Platform), Projected system APIs

### Minimum System Requirements
- **CPU:** Intel Core i5 / AMD Ryzen 5 (or equivalent)
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 1GB free space per app
- **Display:** 1024x768 minimum, 1920x1080 recommended
- **Network:** Optional (for cloud features)

### Distribution Methods
1. **Installer (.MSI):** Windows Installer package via Microsoft Store deployment pipeline
2. **Standalone .EXE:** Direct download, self-extracting installer
3. **Windows Store (UWP):** Microsoft Store listing with auto-update capability
4. **Chocolatey/Winget:** Community package managers for CLI installation

### Required Permissions & Manifests
- **App Manifest:** Windows 10+ app manifest with required capabilities
- **File Association:** Registry entries for file type handlers (.md, .txt, .mp3, .mp4, etc.)
- **Shortcut Creation:** Start Menu group, Desktop shortcut
- **Firewall Exception:** Network apps need Windows Firewall rules
- **Admin Rights:** Not required for user-space installation
- **Code Signing:** Authenticode signing certificate for installation trust
- **Security:** Smart Screen compatibility, no warnings

### Platform-Specific Features to Implement
- **Windows Notifications API:** Toast notifications for file operations, media playback
- **Windows Codec Support:** Hardware video decode (H.264, HEVC, AV1 via Windows)
- **Media Keys:** Capture ⏯ ⏭ ⏮ 🔊 buttons globally
- **Taskbar Integration:** Thumbnail previews, progress bar, media controls
- **Context Menu Integration:** "Open with QMOI" in file explorer
- **Windows Hello:** Biometric support via WinRT
- **Mica/Acrylic Effects:** Fluent Design elements (transparency, blur)
- **Virtual Desktops:** Support Alt+Tab/Win+Tab switching
- **Game Bar Integration:** Optional performance overlay

### Build & Testing Pipeline
```
Build Stage:
  1. Compile source (C#, C++, or Node.js depending on runtime)
  2. Run unit tests (MSTest or NUnit)
  3. Package .MSI via WiX Toolset
  4. Sign binary with Authenticode certificate
  5. Run smoke tests (install, open, basic features)
  6. Upload to Microsoft Store (if applicable)
  7. Generate Windows Store app bundle (.MSIXBUNDLE)

Test Stage:
  - Test on Windows 10 22H2, Windows 11 23H2
  - Test on x64 and ARM64 (Surface devices)
  - Verify file associations work
  - Verify context menu appears
  - Test Ctrl+Alt+Delete / lock behavior
  - Test from restricted user account
  - Test with antivirus enabled (Windows Defender)
```

### Validation Checklist (Automated by Ollama Agent)
- [ ] App installer executes without errors
- [ ] Files installed to correct locations (%ProgramFiles%, %AppData%, etc.)
- [ ] Shortcuts created on Desktop and Start Menu
- [ ] File associations registered in Registry (query HKEY_CLASSES_ROOT)
- [ ] Firewall rules applied (if needed)
- [ ] Code signature valid (signtool verify)
- [ ] App launches without .NET/.VC++ prerequisites missing
- [ ] File handlers work (double-click .mp3 opens media player, etc.)
- [ ] Uninstaller removes all files and Registry entries
- [ ] Notification API works (trigger test notification)
- [ ] Media key capture works (play/pause)
- [ ] Taskbar integration works (thumbnail preview)

---

## Part 2: macOS (Desktop)

### Platform Specifications
- **OS Versions:** macOS 12 Monterey+, macOS 13 Ventura+, macOS 14 Sonoma+
- **Architecture:** Intel x64, Apple Silicon (ARM64)
- **Runtime:** Swift/Objective-C (native) or Electron wrapper
- **APIs:** Cocoa, AppKit, AVFoundation, CoreServices
- **Notarization:** Required for Gatekeeper security

### Minimum System Requirements
- **CPU:** Intel Core i5 / Apple Silicon M1 (or equivalent)
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 1GB free space per app
- **Display:** 1024x768 minimum, 1440x900 recommended
- **Network:** Optional

### Distribution Methods
1. **DMG (Disk Image):** macOS standard installation method
2. **App Store:** Mac App Store listing with auto-update via App Store Connect
3. **Homebrew:** Community package manager (brew install qmoi-ai, etc.)
4. **Direct Download:** ZIP with signed .app bundle
5. **MacPorts/Fink:** Alternative package managers

### Required Permissions & Manifests
- **Code Signing:** Developer ID Application certificate (Apple Developer account)
- **Notarization:** Notarize with Apple's servers (required for Gatekeeper)
- **Entitlements:** Define required capabilities (camera, microphone, files)
- **Info.plist:** App metadata, supported file types, icons
- **Launch Agents:** ~/.LaunchAgents for background services
- **AppleScript:** Support for automation and scripting
- **Gatekeeper:** Bypass with developer ID signing

### Platform-Specific Features to Implement
- **Notification Center:** NSUserNotificationCenter for alerts
- **Spotlight Indexing:** MDImporter plugin for search integration
- **Launch Services:** UTType registration for file types
- **Services Menu:** Provide services for other apps
- **Dock Integration:** App icon with menu and badge support
- **Finder Integration:** Quick Look preview plugin, Finder toolbar button
- **Control Center:** Custom control (toggle settings from menu bar)
- **AirDrop:** Send files between Macs
- **Handoff:** Continue activity on another device
- **Metal/GPU:** Hardware acceleration for media playback
- **Gesture Recognition:** Magic Mouse / trackpad swipe support
- **Dark Mode:** Automatic theme switching

### Build & Testing Pipeline
```
Build Stage:
  1. Compile Swift/Objective-C source
  2. Run unit tests (XCTest)
  3. Create .app bundle with correct structure
  4. Generate .dmg (mounted disk image)
  5. Sign .app with developer ID certificate
  6. Notarize via altool (Apple's notarization service)
  7. Staple ticket to .app (offline verification)
  8. Create App Store ipa version (if distributing via App Store)
  9. Generate SBOM (Software Bill of Materials) for compliance

Test Stage:
  - Test on macOS 12, 13, 14 (Intel)
  - Test on Apple Silicon M1/M2/M3
  - Verify Gatekeeper accepts app
  - Verify Spotlight indexing works
  - Test Finder integration
  - Test Dock menu
  - Test AirDrop between devices
  - Test with Rosetta 2 translation (Intel binary on Apple Silicon)
```

### Validation Checklist (Automated by Ollama Agent)
- [ ] .app bundle has correct Info.plist
- [ ] App signed with developer ID (codesign -v)
- [ ] Notarization ticket is valid (spctl assess -v)
- [ ] App launches without Gatekeeper warnings
- [ ] File associations work (double-click .mp3, etc.)
- [ ] Spotlight can index app files
- [ ] Notifications appear in Notification Center
- [ ] Dock icon shows and responds to clicks
- [ ] Menu bar integration works (if implemented)
- [ ] Dark mode toggle works
- [ ] AirDrop feature functional (if implemented)
- [ ] Handoff works between devices (if implemented)
- [ ] App correctly reports as unsigned/notarized: codesign -v /path/to/app.app
- [ ] Crash logs are empty (check ~/Library/Logs/DiagnosticMessages/)

---

## Part 3: Linux (Desktop & Server)

### Platform Specifications
- **Distributions:** Ubuntu 22.04 LTS, Ubuntu 24.04 LTS, Fedora 39+, Debian 12+, Arch Linux
- **Architecture:** x64 (primary), ARM64 (Raspberry Pi)
- **Runtime:** GTK4 (GNOME), Qt6 (KDE), or Electron wrapper
- **APIs:** freedesktop.org standards, D-Bus, systemd
- **Desktop Environments:** GNOME, KDE Plasma, XFCE, LXDE

### Minimum System Requirements
- **CPU:** Intel Core i5 / AMD Ryzen 5 or equivalent
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 500MB free space per app
- **Display:** 1024x768 minimum
- **Network:** Optional

### Distribution Methods
1. **AppImage:** Self-contained executable, works on all Linux distros
2. **Snap:** Ubuntu/Linux universal package format
3. **Flatpak:** Cross-distro containerized apps
4. **System Packages:** .deb (Debian), .rpm (RedHat), AUR (Arch)
5. **Direct Download:** Compiled binary or source tarball
6. **Repository PPA/COPR:** Ubuntu Personal Package Archive, Fedora COPR

### Required Permissions & Manifests
- **Desktop Entry File (.desktop):** Application metadata for system menus
- **AppStream Metadata:** app.xml describing the application
- **Icon Files:** .png files for multiple sizes (48x48, 64x64, 128x128, 256x256)
- **D-Bus Service File:** .service for system integration
- **systemd User Service:** ~/.config/systemd/user/ for background services
- **MIME Type Registration:** /usr/share/mime/packages/ for file associations
- **Security Policy:** AppArmor or SELinux profile (if strict confinement)

### Platform-Specific Features to Implement
- **D-Bus Integration:** Communicate with system services
- **MPRIS (Media Player Interface):** Standard media player controls
- **Notifications:** org.freedesktop.Notifications D-Bus API
- **File Manager Integration:** Nautilus/Dolphin context menu extensions
- **Keyboard Media Keys:** Capture via X11/Wayland events
- **XDG Standards:** Follow XDG Base Directory specification
- **Wayland Support:** Modern display server (not just X11)
- **Portals:** Use xdg-desktop-portal for secure file access
- **Input Methods:** IBus/Fcitx for international keyboard input
- **Accessibility:** AT-SPI for screen reader support
- **Hardware Rendering:** Vulkan/OpenGL acceleration

### Build & Testing Pipeline
```
Build Stage:
  1. Compile C/C++/Rust/Go source
  2. Run unit tests
  3. Package as AppImage:
     - Create .AppDir structure
     - Copy binary + dependencies
     - linuxdeploy to bundle libraries
     - appimagetool to create .AppImage
  4. Package as Flatpak:
     - Create flatpak manifest.json
     - flatpak build-finish --export-type=repo
  5. Package as Snap:
     - snapcraft.yaml configuration
     - snapcraft pack -> .snap file
  6. Package as .deb:
     - dpkg-deb to create .deb package
  7. Sign packages with GPG key
  8. Generate package repository metadata

Test Stage:
  - Test on Ubuntu 22.04, 24.04 (container)
  - Test on Fedora 39+ (container)
  - Test on Debian 12 (container)
  - Test on Arch Linux (container)
  - Test AppImage on clean Ubuntu
  - Test Snap installation and confinement
  - Test Flatpak sandboxing
  - Test file associations (.mp3 → media player)
  - Test D-Bus integration
  - Test on both X11 and Wayland
  - Test ARM64 on Raspberry Pi (if target)
```

### Validation Checklist (Automated by Ollama Agent)
- [ ] Binary compiles without warnings
- [ ] All dependencies are listed (ldd binary)
- [ ] AppImage runs on clean Ubuntu container
- [ ] Desktop entry file is valid (desktop-file-validate)
- [ ] AppStream metadata is valid (appstreamcli validate)
- [ ] File associations work (xdg-mime query default audio/mpeg)
- [ ] D-Bus service starts (systemctl --user start qmoi-app)
- [ ] Notifications appear (org.freedesktop.Notifications available)
- [ ] MPRIS interface works for media player (mpris-ctl)
- [ ] App appears in GNOME/KDE application menus
- [ ] Context menu appears in file manager
- [ ] Media keys work (systemd-monitor /dev/input/event*)
- [ ] Snap confinement allows necessary access (snap connections)
- [ ] Flatpak sandbox allows necessary access (flatpak override)
- [ ] All GPG signatures verify (gpg --verify .sig file)
- [ ] App handles missing libraries gracefully

---

## Part 4: iOS (Mobile)

### Platform Specifications
- **iOS Versions:** iOS 14+, iOS 15+, iOS 16+, iOS 17+ (current)
- **Architecture:** ARM64 (required), ARM64e (preferred)
- **Runtime:** Swift + UIKit/SwiftUI
- **APIs:** Foundation, AVFoundation, FileProvider, DocumentPickerViewController
- **App Signing:** Apple Developer account (paid, $99/year)
- **Distribution:** Apple App Store (required)

### Minimum System Requirements
- **Device:** iPhone XS or newer, iPad (5th gen or newer)
- **RAM:** 2GB minimum, 4GB+ for HD media
- **Storage:** 500MB free space per app
- **iOS Version:** iOS 14+ (or as defined)
- **Internet:** Optional (for cloud features)

### Distribution Methods
1. **Apple App Store:** Only official method for iOS (required)
2. **TestFlight:** Beta testing via Apple's service
3. **Enterprise Distribution:** For internal corporate apps only
4. **Ad Hoc Distribution:** For testing on up to 100 devices

### Required Permissions & Manifests
- **Developer Account:** Apple Developer Program membership
- **Certificates:** iOS Development, iOS Distribution certificates
- **Provisioning Profiles:** Development, Ad Hoc, App Store profiles
- **Bundle ID:** Unique app identifier (com.qmoi.aiapp)
- **Info.plist:** App configuration, capabilities, supported types
- **Entitlements File:** Define app capabilities (camera, microphone, files)
- **Privacy Policy:** Required for App Store submission
- **Screenshots:** 5+ screenshots for App Store listing
- **App Icons:** Set of icons for all sizes and contexts

### Platform-Specific Features to Implement
- **FileProvider:** Access files from iCloud Drive, on-device storage
- **DocumentPickerViewController:** File selection dialog
- **AVPlayer:** Hardware-accelerated video playback
- **MediaPlayer:** iPod library access for music
- **Photo Library:** Access user photos and videos
- **VoiceOver:** Built-in screen reader accessibility
- **Dynamic Type:** Scalable text sizes
- **Dark Mode:** Light/dark theme support
- **Gesture Recognition:** Swipe, pinch, long-press
- **Haptic Feedback:** Vibration feedback for actions
- **NotificationCenter:** Push notifications (local + remote)
- **Handoff:** Continuity between iPhone and iPad/Mac
- **Universal Links:** Deep linking to app content
- **Spotlight Search:** Indexable app content

### Build & Testing Pipeline
```
Build Stage:
  1. Compile Swift source (Xcode)
  2. Run unit tests (XCTest)
  3. Run UI tests (XCUITest)
  4. Run static analysis (SwiftLint, Xcode analyzer)
  5. Code sign with iOS Distribution certificate
  6. Create .ipa bundle
  7. Submit to App Store Connect
  8. Wait for Apple review (24-48 hours)
  9. Release to App Store

Test Stage (Before Submission):
  - Test on iPhone 14, iPhone 15 (simulator)
  - Test on iPad Pro (simulator)
  - Test on iOS 14, 15, 16, 17 (multiple simulators)
  - Test file access (iCloud Drive, Documents folder)
  - Test media playback
  - Test VoiceOver (screen reader)
  - Test with Dynamic Type (largest/smallest text)
  - Test landscape orientation
  - Test network interruption handling
  - Run memory leak detection (Instruments)
  - Run performance profiling
  - Verify privacy compliance (no tracking without consent)
  - Test with Screen Time restrictions
  - Test on actual iPhone/iPad via TestFlight
```

### Validation Checklist (Automated by Ollama Agent)
- [ ] Source code compiles without errors (xcodebuild)
- [ ] No compiler warnings (treat warnings as errors)
- [ ] Unit tests pass (XCTest)
- [ ] UI tests pass (XCUITest)
- [ ] Code coverage >80% (optional)
- [ ] Bundle ID is valid (com.company.appname format)
- [ ] All required app icons provided
- [ ] Privacy policy URL is valid
- [ ] Screenshots are correct size and content
- [ ] App Description and keywords are descriptive
- [ ] No private API usage (scan for known private APIs)
- [ ] Crash logs are empty (run on simulator)
- [ ] Memory profile shows no leaks (Instruments/Allocations)
- [ ] FileProvider entitlement correctly configured
- [ ] Notifications permission requested correctly
- [ ] App runs offline (with graceful degradation)
- [ ] Supported orientations are correct
- [ ] Minimum iOS version is achievable
- [ ] Icon appears correctly on home screen

---

## Part 5: Android (Mobile)

### Platform Specifications
- **Android Versions:** Android 11 (API 30)+, Android 12, 13, 14 (current)
- **Architecture:** ARM64 (primary), ARMv7, x86_64
- **Runtime:** Kotlin + Jetpack Compose or Android Framework (Java)
- **APIs:** AndroidX, Material Design 3, Jetpack libraries
- **App Signing:** Google Play Console account
- **Distribution:** Google Play Store (required)

### Minimum System Requirements
- **Device:** Any Android device with API 30+
- **RAM:** 2GB minimum, 4GB+ recommended
- **Storage:** 500MB free space per app
- **Android Version:** Android 11+ (or as defined)
- **Internet:** Optional

### Distribution Methods
1. **Google Play Store:** Official Android app distribution
2. **Google Play Beta:** Beta testing program
3. **Internal Testing Track:** Closed testing group
4. **Sideload (.APK/.AAB):** Manual installation via adb (not recommended for users)

### Required Permissions & Manifests
- **Android Manifest:** AndroidManifest.xml with app configuration
- **Package Name:** Unique identifier (com.qmoi.aiapp)
- **Keystore:** Private key for app signing
- **Permission Declarations:** Required permissions (READ_EXTERNAL_STORAGE, etc.)
- **App Icons:** ic_launcher set for all densities
- **Strings.xml:** Localized app name and strings
- **Styles.xml:** App theme and Material Design 3 colors
- **Privacy Policy:** Required for Play Store listing
- **Screenshots:** 4+ screenshots for Play Store
- **Google Developer Account:** $25 one-time registration fee

### Platform-Specific Features to Implement
- **ContentProvider:** Access files and data securely
- **FileProvider:** Share files between apps
- **DocumentsProvider:** Browse device storage files
- **MediaStore:** Access photos, videos, audio
- **AudioAttributes:** Proper audio routing and focus
- **ExoPlayer:** Advanced video playback
- **Notifications:** Push notifications, material design notifications
- **Haptic Feedback:** Vibration for button press
- **MediaSession:** System media controls integration
- **AudioFocus:** Play/pause on incoming calls
- **Adaptive Icons:** Dynamic app icon that adapts to device shape
- **Predictive Back Gesture:** Support Android 13+ back animation
- **Per-App Language:** Allow users to set app language independently
- **Material You:** Dynamic theming based on wallpaper (Android 12+)
- **Scoped Storage:** Compliant file access (Android 11+)

### Build & Testing Pipeline
```
Build Stage:
  1. Compile Kotlin source (Gradle)
  2. Run unit tests (JUnit)
  3. Run instrumented tests (AndroidX Test)
  4. Run static analysis (Android Lint, FindBugs)
  5. Build release .apk and .aab (App Bundle)
  6. Sign with release keystore
  7. Zipalign for optimization
  8. Generate ProGuard/R8 obfuscation mapping
  9. Upload to Google Play Console
  10. Wait for Google review (24-48 hours)
  11. Release to Play Store

Test Stage (Before Submission):
  - Test on Android 11, 12, 13, 14 (emulator)
  - Test on multiple screen sizes (phone, tablet)
  - Test on ARM64, ARMv7, x86_64 architectures
  - Test file access (DocumentsProvider)
  - Test media playback
  - Test notifications
  - Test with TalkBack (screen reader)
  - Test dynamic theming (Material You)
  - Test battery usage (Battery Historian)
  - Test network conditions (throttle)
  - Test with Play Services disabled
  - Run memory profiler (Android Studio Profiler)
  - Run CPU profiler
  - Run frame rate profiler (Jank)
  - Test actual devices via Firebase Test Lab
```

### Validation Checklist (Automated by Ollama Agent)
- [ ] Project compiles without errors (./gradlew build)
- [ ] No compiler warnings (treat warnings as errors)
- [ ] Unit tests pass (./gradlew test)
- [ ] Instrumented tests pass (./gradlew connectedAndroidTest)
- [ ] Lint warnings <100 (./gradlew lint)
- [ ] No critical security issues
- [ ] Package name is valid (reverse domain format)
- [ ] All required app icons provided (all densities)
- [ ] Adaptive icon provided (Android 8+)
- [ ] Privacy policy URL is valid
- [ ] Screenshots are correct size and content
- [ ] App Description and keywords are descriptive
- [ ] Target API level is current (API 34 for Android 14)
- [ ] Minimum API level is justified (API 30+)
- [ ] No unused permissions declared
- [ ] Crash logs are empty (run on emulator)
- [ ] Memory profile shows no leaks (Android Profiler)
- [ ] App runs offline (with graceful degradation)
- [ ] Screen rotations handled correctly
- [ ] All screen sizes supported (phone, tablet)
- [ ] Material Design 3 components used
- [ ] Dark mode works correctly
- [ ] Notifications use correct channels
- [ ] TalkBack screen reader works

---

## Part 6: Web PWA (Progressive Web App)

### Platform Specifications
- **Browsers:** Chrome 90+, Firefox 88+, Safari 15+, Edge 90+
- **Runtime:** JavaScript (ES2020+), WebAssembly (optional)
- **APIs:** Service Worker, IndexedDB, Fetch API, Web Audio API
- **Security:** HTTPS only, CSP headers
- **Manifest:** web.manifest.json with PWA metadata

### Minimum System Requirements
- **Network:** HTTPS connection (offline capable via Service Worker)
- **Storage:** 50MB+ quota via IndexedDB
- **Browser:** Modern browser (2023 or newer release)
- **RAM:** 512MB minimum

### Distribution Methods
1. **Web Hosting:** Deploy to web server (qmoi.com, etc.)
2. **App Store Installation:** iOS via "Add to Home Screen", Android via Google Play (wrapper)
3. **Direct URL:** Users visit URL, install via browser menu

### Required Manifests & Configuration
- **manifest.webmanifest:** PWA metadata, icons, theme colors
- **Service Worker:** Handle offline, caching, updates
- **index.html:** HTML5 with proper head metadata
- **Styles & Icons:** favicon.ico, apple-touch-icon.png, screenshot PNGs
- **Content Security Policy (CSP):** Restrict resource loading
- **HTTPS Certificate:** Let's Encrypt or commercial CA
- **Robots.txt & Sitemap:** SEO and crawlability

### Platform-Specific Features to Implement
- **Service Worker:** Offline support, background sync
- **IndexedDB:** Local data storage (conversation history, playback position)
- **Web Storage API:** Session and persistent settings
- **Fetch API:** Network requests with caching
- **Web Workers:** Offload heavy computation
- **MediaSession API:** Media player controls integration
- **Notification API:** Browser notifications (with permission)
- **Geolocation API:** Location-based features (with permission)
- **Camera/Microphone:** WebRTC for video/audio (with permission)
- **Responsive Design:** Works on all screen sizes
- **Accessibility:** WCAG 2.1 AA compliance
- **Performance:** <3 second first paint, <5 second first interactive

### Build & Testing Pipeline
```
Build Stage:
  1. Transpile TypeScript/JSX to ES5 (Babel)
  2. Bundle with Webpack/Vite
  3. Minify CSS, JavaScript
  4. Optimize images (WebP format)
  5. Generate Service Worker
  6. Create manifest.webmanifest
  7. Generate CSP headers
  8. Deploy to CDN (CloudFlare, AWS CloudFront)
  9. Configure SSL certificate

Test Stage (Before Deployment):
  - Test on Chrome, Firefox, Safari, Edge
  - Test on mobile browsers (Chrome Mobile, Safari iOS)
  - Test offline mode (disable network in DevTools)
  - Test Service Worker update (force update)
  - Test IndexedDB quota handling
  - Run Lighthouse audit (Performance, Accessibility, SEO, PWA)
  - Test installability (add to home screen)
  - Test responsive breakpoints (320px, 768px, 1024px)
  - Test keyboard navigation
  - Test with screen reader (NVDA, JAWS, VoiceOver)
  - Performance test (WebPageTest, GTmetrix)
  - Load test (simulate 1000+ concurrent users)
  - Security scan (no hardcoded secrets, vulnerable dependencies)
```

### Validation Checklist (Automated by Ollama Agent)
- [ ] Lighthouse score: Performance >90, Accessibility >90, Best Practices >90, SEO >90
- [ ] PWA checklist: manifest.webmanifest valid, Service Worker registered, HTTPS enabled
- [ ] Service Worker: Can go offline, serves cached assets, handles update
- [ ] manifest.webmanifest: Valid JSON, all required icons provided
- [ ] All icons: Different sizes (72x72, 96x96, 128x128, 192x192, 256x256, 384x384, 512x512)
- [ ] SSL Certificate: Valid, not expired, no warnings
- [ ] Security Headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options
- [ ] Accessibility: ARIA labels, keyboard navigation, color contrast >4.5:1
- [ ] Mobile: Responsive on 320px, 768px, 1024px widths
- [ ] Performance: First Contentful Paint <1.5s, Largest Contentful Paint <2.5s
- [ ] API: All features work without breaking on newer browser versions
- [ ] Content: No broken links, all media loads, spelling/grammar correct
- [ ] Analytics: Tracking code present (Google Analytics, etc.)
- [ ] Privacy: Privacy policy linked, no tracking without consent

---

## Part 7: Distribution Pipeline for All Platforms

### Multi-Platform Build Matrix

```
┌─────────────────────────────────────────────────────────────────────┐
│                    QMOI Apps Distribution Matrix                     │
├─────────────────────────────────────────────────────────────────────┤
│ Platform     │ Formats         │ Requires         │ Auto-Update     │
├─────────────────────────────────────────────────────────────────────┤
│ Windows      │ .MSI, .EXE      │ Code signing     │ WinGet/Store    │
│ macOS        │ .DMG, .APP      │ Developer ID     │ Sparkle/Store   │
│ Linux        │ .AppImage       │ GPG signature    │ Manual/System   │
│ iOS          │ .IPA            │ Apple ID (paid)  │ App Store auto  │
│ Android      │ .APK/.AAB       │ Google account   │ Play Store auto │
│ Web PWA      │ HTML/JS/CSS     │ HTTPS/CDN        │ Service Worker  │
├─────────────────────────────────────────────────────────────────────┤
│ Build Time   │ Parallel x6     │ CI/CD job queue  │ 30-60 min total │
└─────────────────────────────────────────────────────────────────────┘
```

### Ollama Agent Responsibilities

**Phase 1: Pre-Build Validation** (2-3 minutes)
```
✓ Verify source code compiles for all targets
✓ Run all unit tests (platform-independent)
✓ Check for hardcoded secrets, credentials
✓ Verify all dependencies are pinned to versions
✓ Validate all required metadata files exist
✓ Check version number is incremented correctly
```

**Phase 2: Parallel Building** (30-45 minutes)
```
✓ Build Windows: .MSI, .EXE (on Windows runner)
✓ Build macOS: .DMG, .APP, notarize (on macOS runner)
✓ Build Linux: .AppImage, snap, flatpak, .deb (on Linux runner)
✓ Build iOS: .IPA, submit to App Store Connect (on macOS runner)
✓ Build Android: .APK, .AAB, submit to Play Console (on Linux runner)
✓ Build Web: Optimize, deploy to CDN (on any runner)
```

**Phase 3: Post-Build Validation** (5-10 minutes per platform)
```
✓ Verify signatures (Windows/macOS/Linux)
✓ Run smoke tests on each generated package
✓ Verify file size is reasonable
✓ Generate checksums (SHA256)
✓ Upload artifacts to storage
✓ Tag release with build metadata
```

**Phase 4: Distribution** (Varies by platform)
```
✓ Submit to Microsoft Store (awaits review, ~2-4 hours)
✓ Submit to Mac App Store (awaits review, ~24-48 hours)
✓ Push to Ubuntu PPA, Fedora COPR, AUR
✓ Publish to App Store (awaits review, ~24-48 hours)
✓ Publish to Google Play Store (awaits review, ~24-48 hours)
✓ Deploy web PWA to CDN (immediate)
```

---

## Part 8: Testing Strategy Without Physical Devices

### Emulation & Containerization

**Windows Testing (Without Windows Machine)**
```bash
# Use Docker with Wine/Proton
docker run --rm -v $(pwd):/work mcr.microsoft.com/windows/servercore:ltsc2022 \
  powershell -Command ".\build-windows.ps1"

# Or use Windows Docker on CI
# GitHub Actions: windows-latest runner
```

**macOS Testing (Without Mac Machine)**
```bash
# Use macOS runner on CI (GitHub Actions, CircleCI, Buildkite)
# GitHub Actions: macos-latest, macos-13, macos-12

# Or use Docker with Hackintosh container (complex setup)
docker run --rm ghcr.io/sickcodes/docker-osx:latest
```

**Linux Testing (Without Linux Machine)**
```bash
# Use Docker containers for each distro
docker run --rm ubuntu:22.04 bash -c "apt-get update && ./test.sh"
docker run --rm fedora:39 bash -c "dnf install -y ... && ./test.sh"
docker run --rm debian:12 bash -c "apt-get update && ./test.sh"
docker run --rm archlinux:latest bash -c "pacman -Syu && ./test.sh"
```

**iOS/Android Testing (Without Physical Devices)**
```bash
# iOS Simulator (macOS runner)
xcodebuild test -scheme QMOIApp -destination "generic/platform=iOS Simulator" -configuration Release

# Android Emulator (Linux runner, Firebase Test Lab)
firebase test android run --app build/app-release.apk --device model=Pixel5,version=31,locale=en,orientation=portrait

# Or use local emulator with CI
docker run --rm -v $(pwd):/workspace \
  androidcli/android-emulator:latest \
  ./gradlew connectedAndroidTest
```

**Web PWA Testing (All Platforms)**
```bash
# Lighthouse CI
lhci autorun --config=lighthouserc.json

# Multiple browser testing (Selenium)
pytest tests/test_web_pwa.py --headless --browsers=chrome,firefox,safari

# Accessibility testing (axe-core)
npm run test:a11y
```

---

## Part 9: Ollama Autonomous Agent Enhancements

### New Agent Commands

```python
# ollama_autonomous_agent.py enhancements

def validate_app_for_platform(app_name: str, platform: str) -> Dict[str, bool]:
    """
    Validate app is correctly built and packaged for target platform.
    Returns compliance matrix.
    """
    checks = {
        "code_compiles": compile_check(app_name, platform),
        "dependencies_resolve": dependency_check(app_name, platform),
        "signatures_valid": signature_check(app_name, platform),
        "manifests_present": manifest_check(app_name, platform),
        "smoke_test_passes": smoke_test(app_name, platform),
        "file_handlers_work": handler_test(app_name, platform),
        "accessibility_compliant": a11y_test(app_name, platform),
        "memory_leaks_absent": memory_test(app_name, platform),
        "security_scan_passes": security_scan(app_name, platform),
    }
    return checks

def build_all_platforms(app_name: str, version: str) -> Dict[str, Path]:
    """
    Build app for all 6 platforms in parallel.
    Returns artifact paths.
    """
    results = {
        "windows": build_windows(app_name, version),
        "macos": build_macos(app_name, version),
        "linux": build_linux(app_name, version),
        "ios": build_ios(app_name, version),
        "android": build_android(app_name, version),
        "web_pwa": build_web_pwa(app_name, version),
    }
    return results

def generate_platform_resources() -> None:
    """
    Auto-generate platform-specific resources from templates.
    - Windows: Registry entries, shortcuts, manifests
    - macOS: Launch agents, plist files, notarization
    - Linux: Desktop files, AppStream metadata, systemd units
    - iOS: App icons, screenshots, localized strings
    - Android: Gradle buildTypes, signing configs
    - Web: manifest.webmanifest, favicon, PWA metadata
    """
    pass

def validate_all_features_for_all_apps() -> Dict[str, Dict[str, bool]]:
    """
    For each app (QMOIAIUI, QMOI Space, QCity, QALPHA):
      For each platform (Windows, macOS, Linux, iOS, Android, Web):
        Run all feature tests
    Returns 4x6=24 validation matrices.
    """
    pass
```

---

## Summary & Checklist

### Before Each Release
- [ ] Run `ollama_autonomous_agent.py validate-all-platforms`
- [ ] All 6 platforms build successfully
- [ ] All 4 apps tested on each platform
- [ ] All file type handlers work
- [ ] All accessibility features functional
- [ ] Memory leaks absent
- [ ] Security scan passes
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Version numbers incremented
- [ ] Git tags created

### During Each Release
- [ ] Submit to app stores (wait for review)
- [ ] Deploy web PWA
- [ ] Announce release notes
- [ ] Monitor crash reports

### After Each Release
- [ ] Collect user feedback
- [ ] Monitor metrics (usage, crashes, ratings)
- [ ] Plan next iteration based on feedback

---

**Next Steps:**
1. Implement platform validation tests in ollama_autonomous_agent.py
2. Create platform-specific GitHub Actions workflows
3. Set up emulators/containers for CI/CD
4. Generate platform resource templates
5. Update distribution documentation
