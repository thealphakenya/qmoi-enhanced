---
title: "PRODUCTION RELEASE VALIDATION CHECKLIST"
qmoi_validation_frontmatter: true
last_updated: 2025-11-15
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-11-15T00:00:00.000000Z
- note: Auto-inserted by production release validation workflow
<!-- LION_VALIDATION_END -->

# PRODUCTION RELEASE VALIDATION CHECKLIST

## 📋 Overview

This document provides a comprehensive, step-by-step validation checklist to ensure all QMOI apps and their builds are **production-ready**, **properly distributed**, **securely validated**, and **thoroughly tested** before release to end users.

**Applies to:** QMOI AI (v1.2.3), QCity (v2.0.1), Web Apps (QShare, QStore, QVillage, QMOI Space, Yap), and all PWA applications.

**Release Status:** v1.2.3 - November 15, 2025

---

## 🎯 Executive Summary: Current Status

| Component | Status | Details |
|-----------|--------|---------|
| **QMOI AI** | ⚠️ Requires Validation | 8 platforms built (Windows, macOS, Linux×2, Android, iOS, SmartTV, Chromebook). Needs production verification. |
| **QCity** | ⚠️ Requires Validation | Universal ZIP package (v2.0.1). Needs platform testing. |
| **Web Apps** | 🌐 Web-Only | QShare, QStore, QVillage, Yap (browser-based, no binary download). PWA versions available. |
| **PWA Apps** | ⚠️ Requires Testing | Q Alpha, QMOI Space (GitHub Pages hosted). Need feature validation. |
| **Release v1.2.3** | ✅ Published | 13 assets on GitHub Releases. Need SHA256 verification and testing. |

---

## PHASE 1: PRE-RELEASE BUILD VALIDATION

### 1.1 Binary Compilation & Signing

#### Android (APK/AAB)
- [ ] **Compile with Release Build Configuration**
  - [ ] Use `--release` or `--mode=release` flag in build command
  - [ ] Disable debug mode: `android.debuggable=false`
  - [ ] Strip out debug logs and test instrumentation code
  - [ ] Verify output: `*.apk` or `*.aab` (prefer AAB for Play Store)

- [ ] **Sign with Production Keystore**
  - [ ] Keystore file exists and is backed up securely: `/path/to/qmoi_production.keystore`
  - [ ] Verify keystore alias: `qmoi_ai_release` or equivalent
  - [ ] Check keystore expiration date (must be valid for >1 year)
  - [ ] Sign using: `jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA256 -keystore qmoi_production.keystore qmoi_ai.apk qmoi_ai_release`
  - [ ] Verify signature: `jarsigner -verify -verbose -certs qmoi_ai.apk`
  - [ ] Sign AAB if applicable: Use Play App Signing or internal signing

- [ ] **Code Obfuscation (R8/ProGuard)**
  - [ ] R8/ProGuard configured in build.gradle: `minifyEnabled true`
  - [ ] ProGuard rules file exists: `proguard-rules.pro`
  - [ ] Keep essential classes un-obfuscated (API/SDK compatibility classes)
  - [ ] Test that obfuscated build still functions correctly
  - [ ] Verify obfuscated build size is optimized (10-15% smaller than debug)

#### iOS (IPA)
- [ ] **Archive with Release Configuration**
  - [ ] Build scheme set to "Release"
  - [ ] Code signing identity set to production certificate
  - [ ] Provisioning profile set to production/app-store profile
  - [ ] Archive created in Xcode: `Product → Archive`

- [ ] **Export for Distribution**
  - [ ] Export method: "App Store Connect" or "Ad Hoc"
  - [ ] Export team ID verified
  - [ ] Bundle ID matches release plan: `com.qmoi.qmoiai` or similar
  - [ ] Version number matches release: `1.2.3`
  - [ ] IPA file generated successfully

- [ ] **Code Signing Certificate Validation**
  - [ ] Certificate is valid (check expiration date)
  - [ ] Certificate matches App ID
  - [ ] Provisioning profile is provisioned for production deployment
  - [ ] No "Ad Hoc" or development profiles mixed in

#### Windows (EXE/MSI)
- [ ] **Compile Release Build**
  - [ ] Use `Release` configuration, not `Debug`
  - [ ] Optimization flags enabled: `/O2` or equivalent
  - [ ] Debug symbols stripped (or externalized)
  - [ ] Static linking configured (if applicable)
  - [ ] Output: `.exe` or `.msi` installer

- [ ] **Code Signing**
  - [ ] Code signing certificate obtained (from CA or internal)
  - [ ] Sign executable: `signtool sign /f qmoi_production.pfx /p <password> /t http://timestamp.authority /d "QMOI AI" qmoi_ai.exe`
  - [ ] Verify signature: `signtool verify /pa qmoi_ai.exe`
  - [ ] Timestamp server used (ensures signature valid after certificate expiration)

- [ ] **Binary Optimization**
  - [ ] No debug information included (or stripped post-build)
  - [ ] EXE/MSI size is reasonable (5-100 MB depending on features)
  - [ ] UPX or similar compressor NOT used (can break signature verification)

#### macOS (DMG)
- [ ] **Compile Release Build**
  - [ ] Xcode build scheme set to Release
  - [ ] Optimization enabled
  - [ ] Notarization enabled in build settings

- [ ] **Create DMG Installer**
  - [ ] DMG created from release binary
  - [ ] Code signing applied: `codesign -s "Developer ID Application" qmoi_ai.app`
  - [ ] Verify signature: `codesign -v qmoi_ai.app`

- [ ] **Notarize for Gatekeeper**
  - [ ] Notarization request submitted to Apple
  - [ ] Notarization successful (check status)
  - [ ] DMG stapled with notarization ticket
  - [ ] Gatekeeper validation passed on test macOS system

#### Linux (AppImage, DEB)
- [ ] **AppImage Build**
  - [ ] linuxdeploy tool used to generate AppImage
  - [ ] Executable bit set: `chmod +x qmoi_ai.AppImage`
  - [ ] Dependencies bundled correctly
  - [ ] AppImage runs on supported distros (Ubuntu 18.04+, Debian 10+, etc.)

- [ ] **DEB Package**
  - [ ] `debian/control` file configured with correct metadata
  - [ ] Depends and conflicts correctly specified
  - [ ] Digital signature (optional but recommended): `dpkg-sig -k <key> -s builder qmoi_ai.deb`
  - [ ] Installation tested: `sudo dpkg -i qmoi_ai.deb`

### 1.2 Remove Debug & Test Artifacts

- [ ] **No Hardcoded Secrets**
  - [ ] Source code scanned for API keys, tokens, passwords
  - [ ] Use grep or secret scanning tool: `grep -r "password\|secret\|token\|api.key" src/`
  - [ ] All secrets externalized to environment variables or config files
  - [ ] Config files with secrets NOT included in release binary

- [ ] **No Debug Logs**
  - [ ] Debug log statements removed or gated behind debug flag
  - [ ] Verbose/trace logs disabled in production build
  - [ ] Console output minimal (no internal state dumps)

- [ ] **No Test Files**
  - [ ] Test suites and test data excluded from binary
  - [ ] Mock data and test fixtures removed
  - [ ] Development-only dependencies not included

- [ ] **No Build Artifacts**
  - [ ] Temporary build files cleaned up
  - [ ] Cache files not included
  - [ ] Node modules (if bundled) are production-only

### 1.3 Verify Versioning & Metadata

- [ ] **Version Numbers Match Across All Platforms**
  - [ ] Windows: File properties → Product Version = `1.2.3`
  - [ ] macOS: `CFBundleShortVersionString` = `1.2.3`
  - [ ] Android: `versionName="1.2.3"` in `AndroidManifest.xml` or `build.gradle`
  - [ ] iOS: `CFBundleShortVersionString` = `1.2.3` in `Info.plist`
  - [ ] Linux: Version in package metadata
  - [ ] PWA: Version in `manifest.json` or `package.json`

- [ ] **Build Numbers / Internal Versions**
  - [ ] Windows: File Version = `1.2.3.0` or similar
  - [ ] Android: `versionCode = 123` (incrementing integer)
  - [ ] iOS: CFBundleVersion = matching build number
  - [ ] Consistency across related platforms

- [ ] **Icons & Branding**
  - [ ] App icons are production ones (not placeholders/test icons)
  - [ ] Splash screen images are final
  - [ ] Logo/branding assets use correct colors and dimensions
  - [ ] Icons meet platform requirements (sizes, formats, transparency)

### 1.4 Binary Size & Optimization

- [ ] **Size Within Acceptable Range**
  - [ ] QMOI AI: Expected ~5-12 MB per platform (after optimization)
  - [ ] QCity: ~2-5 MB
  - [ ] PWA apps: ~1-5 MB (gzipped)
  - [ ] Unusually large builds flagged for investigation

- [ ] **No Unnecessary Dependencies**
  - [ ] Unused libraries removed from final build
  - [ ] Tree-shaking enabled for JavaScript builds
  - [ ] Dead code elimination applied
  - [ ] File size breakdown reviewed (largest files identified and justified)

- [ ] **Compression Applied**
  - [ ] Assets (images, fonts) compressed
  - [ ] JavaScript/CSS minified and bundled
  - [ ] No uncompressed duplicate resources

---

## PHASE 2: FUNCTIONAL & REGRESSION TESTING

### 2.1 Automated Testing

- [ ] **Unit Tests**
  - [ ] All unit tests pass: `npm test` or `pytest -v` or equivalent
  - [ ] Code coverage ≥ 70% for critical paths
  - [ ] No pending or skipped tests in production build

- [ ] **Integration Tests**
  - [ ] API integration tests pass
  - [ ] Database connectivity verified
  - [ ] External service integrations validated (if any)

- [ ] **UI/Component Tests**
  - [ ] Component rendering tests pass
  - [ ] Interaction tests (click, input) verified
  - [ ] Layout/responsive tests pass

### 2.2 Manual Testing on Real Devices

#### Android Testing
- [ ] **Test on Real Devices (not emulator only)**
  - [ ] Low-end device (Android 8.0+): App launches, no crashes, performance acceptable
  - [ ] Mid-range device (Android 10): All features work, UI responsive
  - [ ] High-end device (Android 12+): Optimal performance, all features polished
  - [ ] Test on different screen sizes (small, normal, large, xlarge)

- [ ] **Core Features**
  - [ ] App launches without crashing
  - [ ] Main UI loads and renders correctly
  - [ ] Navigation between screens works smoothly
  - [ ] All buttons/inputs respond to user action
  - [ ] Data persists across app restarts (if applicable)

#### iOS Testing
- [ ] **Test on Real Devices (not simulator only)**
  - [ ] iPhone SE (small screen): UI readable, no overflow
  - [ ] iPhone 12/13 (standard): All features accessible
  - [ ] iPhone 14+ / iPad: Full-screen features optimized
  - [ ] iOS 14+, iOS 15+, iOS 16+ (latest versions)

- [ ] **Core Features**
  - [ ] App launches without crashing
  - [ ] Main UI renders correctly on all screen sizes
  - [ ] Navigation smooth (no lag)
  - [ ] All interactive elements respond
  - [ ] App badge/notification features (if used) work

#### Windows Testing
- [ ] **Test on Real Windows Systems**
  - [ ] Windows 10 (latest version): App installs, launches, runs
  - [ ] Windows 11: Compatibility verified, modern features used (if applicable)
  - [ ] Test on older hardware (low disk space, limited RAM)

- [ ] **Installation & Uninstallation**
  - [ ] EXE installer runs without admin prompt (if not needed)
  - [ ] Or: Admin prompt appears correctly if required
  - [ ] Installation completes without errors
  - [ ] Uninstallation works cleanly (no leftover files/registry)
  - [ ] Reinstallation after uninstall works

#### macOS Testing
- [ ] **Test on Real Mac Hardware**
  - [ ] macOS 11 (Big Sur): App runs
  - [ ] macOS 12 (Monterey), macOS 13 (Ventura), macOS 14 (Sonoma): App runs
  - [ ] Intel Mac and Apple Silicon Mac tested

- [ ] **Installation**
  - [ ] DMG mounts correctly
  - [ ] App can be dragged to Applications
  - [ ] Or: Installer script runs without errors
  - [ ] App launches from Applications folder

#### Linux Testing
- [ ] **Test on Real Linux Systems**
  - [ ] Ubuntu 20.04 LTS: AppImage runs / DEB installs
  - [ ] Ubuntu 22.04 LTS: Works
  - [ ] Debian 11: Works
  - [ ] Other distros (Fedora, Arch, etc.): Tested if possible

- [ ] **AppImage Testing**
  - [ ] Executable bit set: `ls -la qmoi_ai.AppImage` shows `x`
  - [ ] Runs without dependencies: `./qmoi_ai.AppImage` works
  - [ ] FUSE library availability checked (if using FUSE-based AppImage)

#### Web/PWA Testing
- [ ] **Browser Compatibility**
  - [ ] Chrome/Chromium (latest): Works
  - [ ] Firefox (latest): Works
  - [ ] Safari (latest): Works
  - [ ] Edge (latest): Works

- [ ] **Responsive Design**
  - [ ] Desktop (1920x1080): Full layout, all features visible
  - [ ] Tablet (iPad size): Layout adapts, touch-friendly
  - [ ] Mobile (iPhone 12 size): Vertical layout, readable text, tappable buttons

- [ ] **PWA Features (if applicable)**
  - [ ] Can be installed to home screen
  - [ ] Offline functionality works (cached content loads)
  - [ ] Service worker registered and active
  - [ ] Web app manifest valid

### 2.3 Network Conditions Testing

- [ ] **Slow Network (3G Simulation)**
  - [ ] App loads (may take longer, but no timeout)
  - [ ] Images load progressively or show TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md)
  - [ ] No "network error" crashes, graceful fallback
  - [ ] User feedback provided (loading spinner, progress indicator)

- [ ] **Intermittent Network**
  - [ ] App handles network interruption without crashing
  - [ ] Retry logic works (if applicable)
  - [ ] User informed of connectivity issues

- [ ] **Offline Mode** (if applicable)
  - [ ] App provides useful offline functionality
  - [ ] Cached content accessible
  - [ ] Syncs when connection restored

### 2.4 Performance Testing

- [ ] **Launch Time**
  - [ ] Cold start: < 5 seconds (target)
  - [ ] Warm start: < 2 seconds
  - [ ] No frozen/unresponsive UI during launch

- [ ] **Memory Usage**
  - [ ] Baseline memory: Acceptable for platform (e.g., < 200 MB for Android)
  - [ ] No memory leaks over extended use (1+ hour)
  - [ ] Memory stays stable across multiple app restarts

- [ ] **CPU Usage**
  - [ ] Idle CPU minimal (< 5%)
  - [ ] Active CPU reasonable (no excessive spinning)
  - [ ] No throttling or overheating

- [ ] **Storage Usage**
  - [ ] App data + cache doesn't exceed reasonable limit
  - [ ] Cache clearing option works (if user-facing)

---

## PHASE 3: SECURITY & COMPLIANCE

### 3.1 Code Security Review

- [ ] **Secrets Scanning**
  - [ ] No hardcoded API keys in source: `grep -r "api.key\|SECRET\|PASSWORD" src/`
  - [ ] No database credentials in code
  - [ ] Environment variables used for all sensitive config
  - [ ] `.env` files excluded from Git and release build

- [ ] **Dependency Audit**
  - [ ] `npm audit` / `pip audit` / equivalent run and reviewed
  - [ ] No known vulnerabilities in direct dependencies
  - [ ] Transitive dependencies reviewed for high-severity issues
  - [ ] Locked dependency versions (package-lock.json, poetry.lock, etc.)

- [ ] **Input Validation**
  - [ ] User input sanitized (prevent injection attacks)
  - [ ] Form validation applied (client + server)
  - [ ] File uploads restricted to safe types/sizes

- [ ] **Encryption**
  - [ ] Sensitive data encrypted in transit (HTTPS/TLS)
  - [ ] Sensitive data encrypted at rest (if stored locally)
  - [ ] Encryption keys handled securely (not hardcoded)

### 3.2 Platform Security Requirements

#### Android
- [ ] **Android-Specific Security**
  - [ ] Target API level ≥ 31 (Android 12)
  - [ ] Permissions clearly justified and documented
  - [ ] Uses `android:usesCleartextTraffic="false"` (HTTPS only)
  - [ ] Network security config enforced
  - [ ] No `android:debuggable="true"` in manifest

#### iOS
- [ ] **iOS-Specific Security**
  - [ ] App Transport Security enforced (HTTPS only)
  - [ ] No insecure random number generation
  - [ ] Keychain used for sensitive data (not UserDefaults)
  - [ ] Code signing certificate valid
  - [ ] Provisioning profile appropriate (not ad-hoc for production)

#### Windows
- [ ] **Windows-Specific Security**
  - [ ] Binary signed with valid certificate
  - [ ] No Visual Basic 6 or deprecated technologies (if possible)
  - [ ] User Account Control (UAC) handled appropriately
  - [ ] No registry hacks or unsafe operations

#### Web/PWA
- [ ] **Web Security**
  - [ ] Content Security Policy (CSP) headers configured
  - [ ] CORS policy restrictive (not `*`)
  - [ ] HTTPS enforced
  - [ ] No mixed content warnings
  - [ ] Security headers: X-Frame-Options, X-Content-Type-Options, etc.

### 3.3 Privacy & Data Handling

- [ ] **Privacy Policy**
  - [ ] Privacy policy published and accessible
  - [ ] Policy describes data collection and usage
  - [ ] GDPR/CCPA compliance considered (if applicable)

- [ ] **User Consent**
  - [ ] Permissions requested at runtime (not silently)
  - [ ] Purpose of permissions explained to user
  - [ ] Users can revoke permissions (if applicable)

- [ ] **Data Retention**
  - [ ] Data not retained longer than necessary
  - [ ] User data deletion supported (if applicable)
  - [ ] Logs don't contain sensitive user information

---

## PHASE 4: ARTIFACT & CHECKSUM VALIDATION

### 4.1 Generate Checksums

- [ ] **SHA256 Checksums for All Binaries**
  - [ ] Windows: `sha256sum qmoi_ai.exe > qmoi_ai.exe.sha256`
  - [ ] macOS: `shasum -a 256 qmoi_ai.dmg > qmoi_ai.dmg.sha256`
  - [ ] Linux: `sha256sum qmoi_ai.AppImage > qmoi_ai.AppImage.sha256`
  - [ ] Android: `sha256sum qmoi_ai.apk > qmoi_ai.apk.sha256`
  - [ ] iOS: `shasum -a 256 qmoi_ai.ipa > qmoi_ai.ipa.sha256`
  - [ ] All stored in `release_assets_manifest.json`

### 4.2 Verify Checksums

- [ ] **Pre-Upload Verification**
  - [ ] Compute local SHA256: `sha256sum qmoi_ai.exe`
  - [ ] Matches expected value: ✓

- [ ] **Post-Download Verification** (User-facing)
  - [ ] Checksum provided in release notes
  - [ ] User can verify: `sha256sum -c qmoi_ai.exe.sha256`
  - [ ] Or Windows: `(Get-FileHash qmoi_ai.exe).Hash` matches manifest

- [ ] **Automated Verification in CI**
  - [ ] CI pipeline verifies checksums after upload to GitHub
  - [ ] Manifest updated automatically

### 4.3 Release Notes & Documentation

- [ ] **Release Notes Completeness**
  - [ ] Title: "QMOI v1.2.3 - Release Date"
  - [ ] Highlights new features (if any)
  - [ ] Lists critical bug fixes
  - [ ] Documents breaking changes (if any)
  - [ ] Includes platform-specific notes

- [ ] **Installation Instructions**
  - [ ] Clear download links for each platform
  - [ ] Step-by-step installation guide
  - [ ] Troubleshooting section for common issues

- [ ] **Changelog**
  - [ ] Link to detailed changelog: `CHANGELOG.md`
  - [ ] Or inline changelog in release notes
  - [ ] Shows commits/PRs merged in this release

---

## PHASE 5: PRE-RELEASE DISTRIBUTION TO TESTERS

### 5.1 Android Distribution

- [ ] **Google Play Console - Internal Testing Track**
  - [ ] App uploaded to Play Console
  - [ ] Target testers added to closed/internal testing track
  - [ ] Testers can download via test link: `https://play.google.com/apps/testing/com.qmoi.qmoiai`
  - [ ] Allow 24-48 hours for Play Console processing

- [ ] **Firebase App Distribution**
  - [ ] Firebase project configured: `qmoi-ai`
  - [ ] Testers added via email addresses
  - [ ] APK/AAB uploaded to Firebase
  - [ ] Testers receive email with install link
  - [ ] Testers install via Firebase app

- [ ] **Direct APK Distribution**
  - [ ] APK uploaded to internal file share or link
  - [ ] Testers download and install: `adb install qmoi_ai.apk`
  - [ ] Track feedback and crash reports

### 5.2 iOS Distribution

- [ ] **TestFlight**
  - [ ] App uploaded to TestFlight in App Store Connect
  - [ ] Internal testers added (your team)
  - [ ] External testers added (beta testers, partners)
  - [ ] Test link sent via email: `https://testflight.apple.com/join/...`
  - [ ] Testers install via TestFlight app
  - [ ] Allow 24-48 hours for review

- [ ] **Ad-Hoc Distribution**
  - [ ] IPA created with ad-hoc provisioning profile
  - [ ] Tester UDIDs registered with Apple Dev Account
  - [ ] IPA signed and distributed
  - [ ] Tester installs via Xcode or direct transfer

### 5.3 Windows Distribution

- [ ] **Windows Installer Distribution**
  - [ ] EXE or MSI uploaded to internal file share
  - [ ] Testers download and run installer
  - [ ] Installation tested on Windows 10 and 11

- [ ] **Portable EXE**
  - [ ] Portable version (if applicable) created and distributed
  - [ ] No installation required—run directly
  - [ ] All dependencies bundled (or documented)

### 5.4 macOS Distribution

- [ ] **Direct DMG Distribution**
  - [ ] DMG uploaded to file share or Dropbox
  - [ ] Testers download and mount
  - [ ] Installation tested

- [ ] **Homebrew Tap (if applicable)**
  - [ ] Formula created in Homebrew tap
  - [ ] Testers install: `brew install --tap thealphakenya/qmoi qmoi-ai`

### 5.5 Linux Distribution

- [ ] **AppImage Distribution**
  - [ ] AppImage uploaded and shared
  - [ ] Testers download and run: `chmod +x qmoi_ai.AppImage && ./qmoi_ai.AppImage`

- [ ] **DEB Repository**
  - [ ] DEB added to apt repository (if internal)
  - [ ] Testers add repo and install: `sudo apt install qmoi-ai`

### 5.6 Web/PWA Distribution

- [ ] **GitHub Pages Deployment**
  - [ ] PWA apps deployed to GitHub Pages
  - [ ] Accessible at: `https://thealphakenya.github.io/qmoi-enhanced/pwa_apps/...`
  - [ ] Test link shared with testers

- [ ] **Staging Environment**
  - [ ] Staging website deployed to separate domain
  - [ ] Testers access and test: `https://staging.qmoi.app`

---

## PHASE 6: TESTER FEEDBACK & CRASH MONITORING

### 6.1 Crash Reporting Setup

- [ ] **Firebase Crashlytics (or equivalent)**
  - [ ] Crashlytics integrated in all native builds
  - [ ] Crash reports automatically sent to Firebase console
  - [ ] Team members have access to console
  - [ ] Critical crashes trigger alerts

- [ ] **Error Logging**
  - [ ] Errors logged with context (OS, device model, app version)
  - [ ] Logs aggregated in central location
  - [ ] Daily/weekly crash reports reviewed

### 6.2 User Feedback Collection

- [ ] **In-App Feedback Mechanism**
  - [ ] Feedback button present (if user-facing)
  - [ ] Testers can submit feedback with app state
  - [ ] Feedback routed to team inbox

- [ ] **Bug Report Form**
  - [ ] Link to bug report form in release notes
  - [ ] Form captures: OS, device, app version, reproduction steps, screenshot

- [ ] **Monitoring & Response**
  - [ ] Critical bugs: Fix within 1-2 days
  - [ ] High bugs: Fix within 3-5 days
  - [ ] Testers notified of fixes in test builds

### 6.3 Tester Sign-Off

- [ ] **Required Sign-Off Criteria**
  - [ ] App launches without crashing: ✓
  - [ ] Core features work on each platform: ✓
  - [ ] No critical bugs: ✓
  - [ ] Performance acceptable: ✓
  - [ ] UI/UX meets requirements: ✓

- [ ] **Sign-Off Documentation**
  - [ ] Testers document OS/device tested
  - [ ] Sign-off date recorded
  - [ ] Any reservations noted

---

## PHASE 7: GITHUB RELEASE PUBLICATION

### 7.1 Pre-Publication Checklist

- [ ] **Release Tag Created**
  - [ ] Tag name: `v1.2.3`
  - [ ] Tag annotation (release notes) prepared
  - [ ] Tag pushed to GitHub: `git push origin v1.2.3`

- [ ] **All Artifacts Staged**
  - [ ] Windows binary: `qmoi_ai.exe` (5.0 MB) + `.sha256`
  - [ ] macOS binary: `qmoi_ai.dmg` (8.0 MB) + `.sha256`
  - [ ] Linux binaries: `qmoi_ai.AppImage` (6.0 MB) + `qmoi_ai.deb` (4.0 MB) + checksums
  - [ ] Android binary: `qmoi_ai.apk` (10 MB) + `.sha256`
  - [ ] iOS binary: `qmoi_ai.ipa` (12 MB) + `.sha256`
  - [ ] SmartTV binary: `qmoi_ai_smarttv.apk` (8 MB) + `.sha256`
  - [ ] Chromebook binary: `qmoi_ai_chromebook.zip` (3 MB) + `.sha256`
  - [ ] QCity package: `qcity_package.zip` (2 MB) + `.sha256`
  - [ ] PWA apps (if releasing new): `.zip` or `.webmanifest` files

### 7.2 Release Publication

- [ ] **Create Release on GitHub**
  - [ ] Go to Releases → Draft New Release
  - [ ] Tag version: `v1.2.3`
  - [ ] Release title: "QMOI v1.2.3 - November 15, 2025"
  - [ ] Release notes formatted clearly (use template below)
  - [ ] Upload all artifacts (drag-and-drop or browse)
  - [ ] Set as "Pre-release" (if not final) or uncheck for production release
  - [ ] Publish

- [ ] **Release Notes Template**
  ```
  # QMOI v1.2.3 - Production Release
  
  **Release Date:** November 15, 2025
  
  ## What's New
  - Feature A added
  - Feature B improved
  - ...
  
  ## Bug Fixes
  - Fixed crash on app launch (Issue #XXX)
  - Fixed performance issue (Issue #YYY)
  - ...
  
  ## Breaking Changes
  - API endpoint changed (migrate code)
  - ...
  
  ## Downloads
  All downloads are verified with SHA256 checksums.
  
  | Platform | File | Size | Checksum |
  |----------|------|------|----------|
  | Windows | [qmoi_ai.exe](https://...) | 5.0 MB | `SHA256` |
  | macOS | [qmoi_ai.dmg](https://...) | 8.0 MB | `SHA256` |
  | ... | ... | ... | ... |
  
  **Verify downloads:** `sha256sum -c qmoi_ai.exe.sha256`
  
  ## Platform-Specific Notes
  
  ### Windows
  - Requires Windows 10 or later
  - Installation: Double-click installer
  
  ### macOS
  - Requires macOS 11 or later
  - Installation: Mount DMG and drag to Applications
  
  ### Android
  - Requires Android 8.0 or later
  - Installation: Download from Play Store or use APK
  
  ... (other platforms)
  
  ## Installation Troubleshooting
  - If installation fails, see: [INSTALLATION_GUIDE.md](link)
  - Report bugs: [GitHub Issues](link)
  ```

### 7.3 Post-Publication Verification

- [ ] **Verify Release on GitHub**
  - [ ] Release visible on Releases page
  - [ ] All artifacts uploaded successfully
  - [ ] Download links working
  - [ ] SHA256 checksums visible/downloadable

- [ ] **Verify Download Links**
  - [ ] Download one file from each platform
  - [ ] Verify checksum matches release manifest: `sha256sum -c qmoi_ai.exe.sha256`
  - [ ] No download errors

- [ ] **Update Documentation**
  - [ ] README.md updated with latest version: `v1.2.3`
  - [ ] Downloads page updated
  - [ ] CHANGELOG.md updated
  - [ ] Any affected docs (INSTALLATION_GUIDE, etc.) updated

---

## PHASE 8: STAGED ROLLOUT & MONITORING

### 8.1 Gradual Rollout Strategy

#### Android (Google Play)
- [ ] **1% Rollout (Day 1-2)**
  - [ ] Promote app from closed testing to production with 1% rollout
  - [ ] Monitor crash rate, ANR rate, 1-star reviews
  - [ ] If crash rate < 0.5%, proceed

- [ ] **10% Rollout (Day 3-5)**
  - [ ] Increase rollout to 10%
  - [ ] Monitor metrics

- [ ] **50% Rollout (Day 6-10)**
  - [ ] Increase to 50%
  - [ ] Monitor metrics

- [ ] **100% Rollout (Day 11+)**
  - [ ] Full rollout if no critical issues
  - [ ] Continue monitoring

#### iOS (App Store)
- [ ] **Phased Release (if supported)**
  - [ ] Set phased release: 1 day → 7 days
  - [ ] App automatically rolls out over week
  - [ ] Monitor crash rates and user feedback

- [ ] **Manual Approval**
  - [ ] If phased release not available, deploy immediately after App Review approval
  - [ ] Monitor first 24 hours closely

#### Web/PWA
- [ ] **Blue-Green Deployment**
  - [ ] Deploy to staging first
  - [ ] Test thoroughly
  - [ ] Switch traffic to new version (instant rollback possible)
  - [ ] If issues found, immediate rollback to previous version

### 8.2 Real-Time Monitoring

- [ ] **Crash Monitoring**
  - [ ] Firebase Crashlytics dashboard active
  - [ ] Crash rate trending down or stable
  - [ ] No new spike in crashes post-release
  - [ ] Team reviews crashes daily first week

- [ ] **Performance Monitoring**
  - [ ] App startup time: Acceptable range
  - [ ] HTTP request latency: Acceptable range
  - [ ] Memory usage: Stable, no growth over time
  - [ ] Battery usage (mobile): Not excessive

- [ ] **User Metrics**
  - [ ] DAU (Daily Active Users) stable or growing
  - [ ] Session duration: Normal or improved
  - [ ] Feature usage: Expected patterns
  - [ ] Retention: No sudden drop

- [ ] **Error & Exception Rates**
  - [ ] Backend API errors < 1%
  - [ ] Network timeout errors < 0.5%
  - [ ] Validation errors minimal

### 8.3 User Feedback Monitoring

- [ ] **App Store Reviews**
  - [ ] Monitor Play Store, App Store ratings
  - [ ] 4+ star rating target (or maintain)
  - [ ] Respond to critical negative reviews

- [ ] **Support Channels**
  - [ ] Monitor email, chat, bug report form
  - [ ] Critical issues escalated and fixed quickly
  - [ ] User questions answered

- [ ] **Social Media**
  - [ ] Monitor Twitter, Reddit, forums for mentions
  - [ ] Respond to issues reported publicly

### 8.4 Hotfix Protocol (if needed)

- [ ] **Critical Bug Found During Rollout**
  - [ ] Bug severity assessed
  - [ ] If critical (data loss, security, total crash): Pause rollout immediately
  - [ ] Fix implemented and tested
  - [ ] New build (v1.2.3.1 or v1.2.4) created
  - [ ] Retest on staging
  - [ ] Resume rollout or release immediately

- [ ] **Communication**
  - [ ] Users informed of issue and fix
  - [ ] Apology if applicable
  - [ ] New version released with release notes

---

## PHASE 9: POST-RELEASE VALIDATION

### 9.1 Production Environment Verification

- [ ] **Real User Testing**
  - [ ] Production app used by real users for 1-2 weeks
  - [ ] Real-world usage patterns monitored
  - [ ] Edge cases and bugs found and fixed

- [ ] **Long-Term Stability**
  - [ ] App stable over 30+ days post-release
  - [ ] No memory leaks or degradation
  - [ ] Performance maintains after 1 month

### 9.2 Release Success Criteria

- [ ] **Release Considered Successful if:**
  - ✅ App installs without errors (all platforms)
  - ✅ App launches without crashing
  - ✅ Core features work as documented
  - ✅ No critical bugs reported in first week
  - ✅ Crash rate < 0.5%
  - ✅ User rating ≥ 4.0 stars (if applicable)
  - ✅ Performance meets or exceeds targets
  - ✅ No security vulnerabilities discovered
  - ✅ Staged rollout reaches 100% with no major issues

### 9.3 Post-Release Documentation

- [ ] **Release Report Generated**
  - [ ] Release date, version, platforms
  - [ ] Testing summary: # of test cases, results
  - [ ] Tester sign-offs and feedback
  - [ ] Crash/error rate during rollout
  - [ ] User feedback highlights
  - [ ] Performance metrics vs. targets

- [ ] **Lessons Learned**
  - [ ] What went well
  - [ ] What could be improved
  - [ ] Process improvements for next release

---

## APPENDIX A: APP-SPECIFIC FEATURE REQUIREMENTS

### QMOI AI (v1.2.3)

**Core Features to Validate:**

- [ ] **AI Chat Interface**
  - [ ] Chat window renders without UI artifacts
  - [ ] User can type and send messages
  - [ ] Messages appear with correct timestamp
  - [ ] AI responses load and display
  - [ ] Conversation history persists

- [ ] **Voice Input (if applicable)**
  - [ ] Microphone permission requested correctly
  - [ ] Voice input recorded and transcribed
  - [ ] Error handling for mic permission denied

- [ ] **Settings**
  - [ ] Settings page accessible
  - [ ] Theme (light/dark) toggles work
  - [ ] Preferences saved across restarts

- [ ] **About / Help**
  - [ ] About section shows app version and build info
  - [ ] Help/FAQ accessible
  - [ ] Support contact information provided

### QCity (v2.0.1)

**Core Features to Validate:**

- [ ] **Dashboard**
  - [ ] Dashboard loads and displays stats
  - [ ] Widgets are interactive
  - [ ] Data refreshes on command

- [ ] **App Management**
  - [ ] Can list installed apps
  - [ ] Can install new apps (if supported)
  - [ ] Can uninstall apps

- [ ] **System Monitoring**
  - [ ] CPU/Memory usage displayed
  - [ ] Disk space shown
  - [ ] Network status visible

### Web Apps (QShare, QStore, QVillage, Yap)

**Core Features to Validate:**

- [ ] **Landing Page**
  - [ ] Loads without errors
  - [ ] Responsive design (desktop, mobile, tablet)
  - [ ] Navigation menu visible and functional

- [ ] **Core Functionality**
  - [ ] Primary user flow works (e.g., file sharing for QShare)
  - [ ] Upload/download (if applicable) works
  - [ ] Search/filtering (if applicable) responsive

- [ ] **Authentication** (if applicable)
  - [ ] Login page accessible
  - [ ] Login successful with valid credentials
  - [ ] Session persists across page reloads

---

## APPENDIX B: TESTING TEMPLATE FOR TESTERS

**Use this template when testing each app on each platform:**

```
**Tester Name:** ________________
**Platform:** Android / iOS / Windows / macOS / Linux / Web
**Device/Browser:** ________________ (e.g., "Samsung Galaxy S21, Android 12")
**App Version:** v1.2.3
**Test Date:** ________________

## Installation
- [ ] App installed successfully
- [ ] No installation errors
- [ ] App icon visible on home screen / apps menu

## Launch & Basic UI
- [ ] App launches without crashing
- [ ] Splash screen (if any) displays correctly
- [ ] Main screen loads and renders
- [ ] No UI glitches or artifacts
- [ ] Text is readable (font size, contrast)

## Core Features
- [ ] Feature #1 works as described
- [ ] Feature #2 works as described
- [ ] Feature #3 works as described
(Add more as applicable)

## Performance
- [ ] App responsive to user input (no lag)
- [ ] Transitions smooth (no jank)
- [ ] Scrolling smooth

## Crashes / Errors
- [ ] No crashes encountered
- [ ] No error messages seen
- [ ] Any unexpected behavior: ________________

## Overall Feedback
**Would you use this app?** Yes / No / Maybe
**Main issues (if any):** ________________
**Suggestions for improvement:** ________________
**Sign-Off:** ✓ Approved for release / ✗ Not approved (explain)

Tester Signature: ________________ Date: ________________
```

---

## APPENDIX C: RELEASE CHECKLIST SIGN-OFF

**Print or digital signature required before releasing to production:**

```
Release Version: v1.2.3
Release Date: November 15, 2025

APPROVAL SIGN-OFFS:

[ ] Product Manager: ________________ Date: ________
    (Confirms feature completeness and business readiness)

[ ] QA Lead: ________________ Date: ________
    (Confirms testing complete, no blockers)

[ ] Security Lead: ________________ Date: ________
    (Confirms security review passed, no vulnerabilities)

[ ] Engineering Lead: ________________ Date: ________
    (Confirms builds production-ready, no known issues)

[ ] Release Manager: ________________ Date: ________
    (Confirms all phases complete, ready for production)

FINAL APPROVAL:

[ ] Release authorized to production
    Approved By: ________________ Date: ________
```

---

## References

- [QMOI_APPS_AND_PLATFORMS_INVENTORY_CORRECTED.md](./QMOI_APPS_AND_PLATFORMS_INVENTORY_CORRECTED.md)
- [README.md](./README.md) — System overview and quick deploy guide
- [DEPLOYMENT_STATUS_V1_2_3.md](./DEPLOYMENT_STATUS_V1_2_3.md) — Current deployment status
- [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) (if exists) — User-facing installation help
- [CHANGELOG.md](./CHANGELOG.md) (if exists) — Detailed change history
- Firebase Crashlytics: https://firebase.google.com/docs/crashlytics
- Google Play Console Testing: https://developer.android.com/distribute/console/setup
- TestFlight: https://developer.apple.com/testflight/
- GitHub Releases: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository

---

**Last Updated:** November 15, 2025  
**Next Review:** After v1.2.4 release or monthly (whichever is first)
