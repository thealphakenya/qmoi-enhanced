# QMOI v1.2.5 Release Verification Guide

## Overview
This guide describes how to verify that all QMOI v1.2.5 release artifacts are production-ready, properly signed, and include all expected features.

**Release**: v1.2.5  
**Release ID**: 262642597  
**Release URL**: https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.5  
**Status**: Published with 10 artifacts  

## Release Artifacts

| Platform | File | Size | Purpose |
|----------|------|------|---------|
| Android | `app-release.apk` | 10 MB | Production APK for Android devices |
| Windows | `qmoi-release.exe` | 5.0 MB | Standalone Windows executable |
| iOS | `qmoi-release.ipa` | 12 MB | Production IPA for iOS devices |
| Web (PWA) | `admin.zip`, `deals.zip`, `q-alpha.zip`, `qmoi.zip`, `qmoi-ai.zip`, `qmoi-space.zip` | ~500KB each | Progressive Web Apps |
| Verification | `SHA256SUMS.txt` | 200 bytes | Checksums for all artifacts |

## Verification Checklist

### 1. Verify Checksums

**Purpose**: Ensure artifacts haven't been corrupted or tampered with during download.

**Command**:
```bash
# Download SHA256SUMS.txt from release
curl -L https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.5/SHA256SUMS.txt -o /tmp/SHA256SUMS.txt

# Verify all artifacts
cd v1.2.5_release  # or wherever you downloaded the release
sha256sum -c /tmp/SHA256SUMS.txt

# Expected output:
# app-release.apk: OK
# qmoi-release.exe: OK
# qmoi-release.ipa: OK
# admin.zip: OK
# ... (all files should show OK)
```

**Success Criteria**: All files show `OK`

### 2. Verify Android APK

**Purpose**: Ensure APK is properly signed and contains all required features.

**Prerequisites**:
- Linux/macOS with `unzip`, `strings` commands
- Optional: JDK (for `jarsigner`), Android SDK (for `apksigner`, `aapt`)

**Command**:
```bash
./scripts/verify_apk.sh v1.2.5_release/app-release.apk
```

**Full Verification (Android SDK required)**:
```bash
# Install Android build-tools
sudo apt-get install -y android-sdk-build-tools

# Verify signature
apksigner verify --verbose v1.2.5_release/app-release.apk

# Extract manifest and check features
aapt dump badging v1.2.5_release/app-release.apk

# Or use apktool to decode the entire APK
apktool d v1.2.5_release/app-release.apk -o /tmp/qmoi_decoded
cat /tmp/qmoi_decoded/AndroidManifest.xml  # (will be in binary format; view with Android tools)
```

**Device Installation & Testing**:
```bash
# Connect Android device via USB with ADB enabled
adb install -r v1.2.5_release/app-release.apk

# Check installation
adb shell pm list packages | grep qmoi

# View logs
adb logcat | grep -i qmoi

# Uninstall (if needed)
adb uninstall com.qmoi.ai  # (replace with actual package name)
```

**Success Criteria**:
- ✓ APK signature is valid (jarsigner/apksigner)
- ✓ Archive structure is intact (unzip -t succeeds)
- ✓ Manifest contains expected permissions and features
- ✓ Strings search finds API endpoints, login, auth, license tokens
- ✓ Installation on device/emulator succeeds without errors
- ✓ App launches and shows main UI

**Expected Feature Markers** (should appear in strings output):
- API endpoints (https, api, REST, gRPC)
- Authentication (login, auth, oauth, jwt)
- AI/ML features (model, inference, ai, ml)
- Wallet/Payment integration (wallet, qmoi, balance, transaction)
- License/Licensing (license, key, activation, version)

---

### 3. Verify Windows EXE

**Purpose**: Ensure EXE is properly signed and includes all required features.

**Prerequisites**:
- Windows machine (for full verification) or Linux with `osslsigncode`
- `strings` command available

**Command (Linux)**:
```bash
./scripts/verify_exe.sh v1.2.5_release/qmoi-release.exe
```

**Full Verification (Windows)**:
```powershell
# Check digital signature
Get-AuthenticodeSignature -FilePath "v1.2.5_release/qmoi-release.exe"

# Check file properties
(Get-Item "v1.2.5_release/qmoi-release.exe").VersionInfo
```

**Installation & Testing (Windows)**:
```powershell
# Double-click the EXE to run installer, or:
./qmoi-release.exe

# Check installation directory (typically)
ls "C:\Program Files\QMOI" -ErrorAction SilentlyContinue
ls "C:\Program Files (x86)\QMOI" -ErrorAction SilentlyContinue

# Check event logs for install errors
Get-EventLog -LogName Application -Source "QMOI*" -Newest 10
```

**Success Criteria**:
- ✓ EXE signature is valid (or code-signed certificate is present)
- ✓ File is recognized as a Windows PE executable
- ✓ Installation completes without errors
- ✓ App launches and shows main UI
- ✓ Strings search finds API endpoints, features

---

### 4. Verify iOS IPA

**Purpose**: Ensure IPA is properly code-signed and includes all required features.

**Prerequisites**:
- macOS with Xcode Command Line Tools
- `unzip`, `openssl`, `strings` commands

**Command (macOS)**:
```bash
./scripts/verify_ipa.sh v1.2.5_release/qmoi-release.ipa
```

**Full Verification (macOS)**:
```bash
# Extract IPA
unzip -q v1.2.5_release/qmoi-release.ipa -d /tmp/qmoi_ipa

# Verify code signature
APP_BUNDLE=$(find /tmp/qmoi_ipa -name "*.app" | head -1)
codesign -v "$APP_BUNDLE"

# Check entitlements
codesign -d --entitlements /tmp/entitlements.xml "$APP_BUNDLE"
cat /tmp/entitlements.xml

# Check provisioning profile
PROV=$(find /tmp/qmoi_ipa -name "embedded.mobileprovision")
openssl asn1parse -inform DER -in "$PROV" | head -20
```

**Device Installation & Testing (macOS with Xcode)**:
```bash
# On simulator
xcrun simctl install booted v1.2.5_release/qmoi-release.ipa

# Or on connected device via Xcode
open -a Xcode v1.2.5_release/qmoi-release.ipa

# Via development tools
xcrun devicectl app install --device <device-id> v1.2.5_release/qmoi-release.ipa
```

**Success Criteria**:
- ✓ IPA is a valid ZIP archive
- ✓ Code signature is valid (codesign)
- ✓ Provisioning profile is embedded and valid
- ✓ Entitlements are appropriate for app features
- ✓ Installation on simulator/device succeeds
- ✓ App launches and shows main UI

---

### 5. Verify PWA Apps

**Purpose**: Ensure PWAs are properly packaged and include service workers and manifests.

**Command**:
```bash
# Extract and inspect each PWA
for pwa in admin.zip deals.zip q-alpha.zip qmoi.zip qmoi-ai.zip qmoi-space.zip; do
  echo "Verifying $pwa"
  unzip -l "v1.2.5_release/$pwa" | head -20
  echo "---"
done
```

**Success Criteria** (for each PWA):
- ✓ Contains `package.json` with name, version, description
- ✓ Contains `manifest.webmanifest` with app name, icons, start_url
- ✓ Contains `sw.js` (service worker) for offline support
- ✓ Contains icon assets (192x192, 512x512)
- ✓ Contains HTML entry point (index.html or similar)

**Expected file structure**:
```
pwa-name.zip/
├── index.html
├── package.json
├── manifest.webmanifest
├── sw.js
├── icons/
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── css/
├── js/
└── ... (app files)
```

---

## Feature Verification Matrix

| Feature | Android (APK) | Windows (EXE) | iOS (IPA) | PWA |
|---------|---------------|---------------|-----------|-----|
| Authentication (login/auth) | ✓ | ✓ | ✓ | ✓ |
| API connectivity (https/endpoints) | ✓ | ✓ | ✓ | ✓ |
| Wallet integration (qmoi balance) | ✓ | ✓ | ✓ | ✓ |
| AI/ML features (models, inference) | ✓ | ✓ | ✓ | ✓ |
| Offline support (cache/service worker) | ✓ | ✗ | ✓ | ✓ |
| Digital signature | ✓ | ✓ | ✓ | N/A |
| Code obfuscation | ✓ | ✓ | ✓ | N/A |
| License validation | ✓ | ✓ | ✓ | ✓ |
| Data encryption | ✓ | ✓ | ✓ | ✓ |

---

## Automated Verification Scripts

All verification scripts are located in `scripts/` directory:

| Script | Purpose | Requires |
|--------|---------|----------|
| `scripts/verify_apk.sh` | Android APK verification | jarsigner, apksigner (optional), unzip |
| `scripts/verify_exe.sh` | Windows EXE verification | signtool or osslsigncode (optional) |
| `scripts/verify_ipa.sh` | iOS IPA verification | unzip, plutil (macOS) |
| `scripts/verify_artifacts.sh` | All artifacts + checksums | all above |

**Usage**:
```bash
# Individual verification
./scripts/verify_apk.sh
./scripts/verify_exe.sh
./scripts/verify_ipa.sh

# Or run all
./scripts/verify_artifacts.sh
```

---

## CI/CD Integration

The verification scripts are automatically run in GitHub Actions during releases.

See: `.github/workflows/build-and-release.yml` for automated build and verification jobs.

**Current pipeline**:
1. **build-android**: Builds signed APK with Gradle
2. **build-windows**: Packages Windows EXE with PyInstaller
3. **build-ios**: Builds iOS IPA with Xcode (macOS runner)
4. **build-pwas**: Packages all PWA apps
5. **verify-and-manifest**: Runs checksums and verifies artifacts
6. **publish-release**: Creates GitHub Release and uploads artifacts

---

## Troubleshooting

### APK Installation Failed
- **Cause**: APK not signed or signature invalid
- **Fix**: Rebuild with `./scripts/build-android-production.sh`
- **Verify**: Run `apksigner verify --verbose app-release.apk`

### EXE Signature Invalid
- **Cause**: Code signing certificate expired or not present
- **Fix**: Sign with `signtool sign /f cert.pfx /p password qmoi-release.exe` (Windows)
- **Verify**: Run `Get-AuthenticodeSignature qmoi-release.exe` (PowerShell)

### IPA Not Installing on Device
- **Cause**: Provisioning profile mismatch or expired certificate
- **Fix**: Rebuild with `./scripts/build-apple-production.sh` on macOS
- **Verify**: Check entitlements with `codesign -d --entitlements - app.app`

### ZIP Archive Corrupted
- **Cause**: Partial download or transfer error
- **Fix**: Re-download and verify SHA256 checksum
- **Verify**: Run `unzip -t` to test archive integrity

### Missing Feature Strings
- **Cause**: App may have been obfuscated or strings removed
- **Fix**: Check source code and manifest files
- **Verify**: Run app and check logs for expected features

---

## Reporting Issues

If verification fails, please:
1. Run the appropriate verification script and save output
2. Note the platform (Android/Windows/iOS)
3. Check the build logs in GitHub Actions
4. File an issue: https://github.com/thealphakenya/qmoi-enhanced/issues

Include:
- Verification script output
- Device/OS details
- Exact error message
- Steps to reproduce

---

## Release Sign-Off

- [x] Release v1.2.5 created
- [x] All 10 artifacts uploaded
- [x] SHA256 checksums verified
- [x] Android APK integrity verified
- [x] Windows EXE integrity verified
- [x] iOS IPA integrity verified
- [x] PWA apps packaged correctly
- [ ] End-to-end device testing (in progress)
- [ ] Production deployment approval (pending)

---

**Last Updated**: 2025-11-15  
**Verification Status**: In Progress  
**Maintainer**: QMOI Release Team
