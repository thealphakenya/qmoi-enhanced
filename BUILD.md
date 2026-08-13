# Building QMOI Apps: Comprehensive Guide

**Last Updated:** 2026-08-13  
**Status:** Multi-Platform Build System  
**Scope:** Windows, macOS, Linux, iOS, Android, Web PWA

---

## Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Windows Build](#windows-build)
3. [macOS Build](#macos-build)
4. [Linux Build](#linux-build)
5. [iOS Build](#ios-build)
6. [Android Build](#android-build)
7. [Web PWA Build](#web-pwa-build)
8. [Parallel Multi-Platform Build](#parallel-multi-platform-build)
9. [Signing & Notarization](#signing--notarization)
10. [Distribution & Release](#distribution--release)

---

## Prerequisites & Setup

### Global Requirements

**All Platforms:**
```bash
# Clone repository
git clone https://github.com/qmoi/qmoi-enhanced.git
cd qmoi-enhanced

# Install Node.js & npm
# Download from: https://nodejs.org/ (LTS version)
node --version  # v18+ required
npm --version   # v9+ required

# Install Python
# Download from: https://www.python.org/ (3.11+)
python --version  # 3.11+ required

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Install build dependencies
npm ci  # Install exact versions from package-lock.json
pip install -r requirements.txt
pip install -r scripts/requirements.txt
```

### Platform-Specific Setup

**Windows:**
```bash
# Install Visual Studio Build Tools (required for native modules)
# Download: https://visualstudio.microsoft.com/downloads/
# Select: Desktop development with C++

# Install .NET SDK (required for Windows apps)
# Download: https://dotnet.microsoft.com/download/dotnet
dotnet --version  # 8.0 or newer

# Install Node.js tools
npm install -g windows-build-tools

# Install signing certificate tools
npm install -g signtool
```

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Xcode (full IDE, required for iOS builds)
# Download from App Store (large ~12GB)
xcode-select --print-path  # Verify installation

# Install signing tools
brew install create-dmg
```

**Linux:**
```bash
# Build essentials
sudo apt-get install build-essential  # Ubuntu/Debian
sudo dnf groupinstall "Development Tools"  # Fedora

# Desktop file tools
sudo apt-get install desktop-file-utils appstream  # Ubuntu

# AppImage tools
sudo apt-get install libfuse2 pkg-config  # Ubuntu
```

**iOS:**
```bash
# Requires macOS + Xcode
sudo xcode-select --switch /Applications/Xcode.app

# Install Xcode components
sudo xcode-select --install

# Set deployment target
defaults write com.apple.dt.Xcode IDESourceTreeDisplayNames -dict-add SDKROOT "iOS Latest"
```

**Android:**
```bash
# Install Android Studio
# Download: https://developer.android.com/studio
# Or install command-line tools only

# Set ANDROID_HOME environment variable
export ANDROID_HOME=~/Library/Android/sdk  # macOS
export ANDROID_HOME=~/Android/Sdk          # Linux
export ANDROID_HOME=%LOCALAPPDATA%\Android\sdk  # Windows

# Install Android SDK
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools"
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "build-tools;34.0.0"
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-34"
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;25.1.8937393"

# Create keystore for signing
keytool -genkey -v -keystore ~/.android/release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias qmoi_release
```

---

## Windows Build

### Build QMOIAIUI (Windows)

```bash
# Navigate to app directory
cd apps/qmoiaiui-windows

# Install dependencies
npm install
pip install -r requirements.txt

# Build for production
npm run build:windows

# Output location: dist/windows/qmoiaiui-1.2.3.msi
# File size: ~45 MB

# Build portable .EXE
npm run build:windows:portable

# Output location: dist/windows/qmoiaiui-1.2.3-portable.exe
```

### Build QMOI Space (Windows)

```bash
cd apps/qmoi-space-windows
npm install

# Build
npm run build:windows

# Output location: dist/windows/qmoi-space-1.2.3.msi
```

### Build QCity (Windows)

```bash
cd apps/qcity-windows
npm install

# Build
npm run build:windows

# Output location: dist/windows/qcity-1.2.3.msi
```

### Build QALPHA (Windows)

```bash
cd apps/qalpha-windows
npm install

# Build
npm run build:windows

# Output location: dist/windows/qalpha-1.2.3.msi
```

### Windows Build Verification

```bash
# Verify .MSI integrity
msiexec /a dist/windows/qmoiaiui-1.2.3.msi /qb

# Check for malware via Windows Defender
"%ProgramFiles%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 3 -File dist/windows/qmoiaiui-1.2.3.msi

# Generate checksums
certutil -hashfile dist/windows/qmoiaiui-1.2.3.msi SHA256
```

---

## macOS Build

### Build QMOIAIUI (macOS)

```bash
# Navigate to app directory
cd apps/qmoiaiui-macos

# Install dependencies
npm install
pod install  # CocoaPods for native dependencies

# Build for production
npm run build:macos

# Output location: dist/macos/QMOIAIUI.app
# Or as DMG: dist/macos/qmoiaiui-1.2.3.dmg
```

### Build Verification

```bash
# Check code signature
codesign -v dist/macos/QMOIAIUI.app
# Expected: valid on disk

# Check app structure
ls -la dist/macos/QMOIAIUI.app/Contents/
# Expected: Info.plist, MacOS/, Resources/, Frameworks/

# Test on M1/M2 (Apple Silicon)
file dist/macos/QMOIAIUI.app/Contents/MacOS/QMOIAIUI
# Expected: Mach-O 64-bit executable arm64 (or x86_64 for Intel)

# Verify notarization
spctl -a -v dist/macos/QMOIAIUI.app
# Before notarization: notarized dev id
# After notarization: accepted
```

### Create DMG Installer

```bash
# Install DMG creation tool
brew install create-dmg

# Create DMG
create-dmg \
  --volname "QMOIAIUI Installer" \
  --background "assets/installer-background.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "QMOIAIUI.app" 200 190 \
  --hide-extension "QMOIAIUI.app" \
  --app-drop-link 600 185 \
  dist/macos/qmoiaiui-1.2.3.dmg \
  dist/macos/QMOIAIUI.app
```

---

## Linux Build

### Build QMOIAIUI (Linux)

```bash
# Navigate to app directory
cd apps/qmoiaiui-linux

# Install dependencies
npm install
sudo apt-get install libgtk-4-dev libadwaita-dev  # Ubuntu

# Build for production
npm run build:linux

# Output location: dist/linux/qmoiaiui-1.2.3.AppImage
# File size: ~55 MB
```

### Create .AppImage Package

```bash
# Install AppImage tools
sudo apt-get install appimage-builder

# Build AppImage
appimage-builder --recipe AppImageBuilder.yml --skip-test

# Output: qmoiaiui-1.2.3.AppImage
# Make executable
chmod +x qmoiaiui-1.2.3.AppImage
```

### Create .DEB Package (Ubuntu/Debian)

```bash
# Install deb creation tools
sudo apt-get install debhelper dh-make

# Build .deb
cd dist/linux
fakeroot dh_make -f ../qmoiaiui-1.2.3.tar.gz -s -e
fakeroot dpkg-deb --build debian qmoiaiui-1.2.3.deb

# Sign .deb
dpkg-sig -k [KEY_ID] -s builder qmoiaiui-1.2.3.deb
```

### Create .RPM Package (Fedora/RHEL)

```bash
# Install RPM build tools
sudo dnf install rpm-build spectool

# Build RPM
rpmbuild -ba qmoiaiui.spec

# Output location: ~/rpmbuild/RPMS/x86_64/qmoiaiui-1.2.3-1.fc39.x86_64.rpm
```

### Create Snap Package

```bash
# Install snapcraft
sudo apt-get install snapcraft

# Build snap
snapcraft

# Output: qmoiaiui_1.2.3_amd64.snap

# Publish to Snap Store
snapcraft upload qmoiaiui_1.2.3_amd64.snap --release=stable
```

### Create Flatpak Package

```bash
# Install Flatpak SDK
flatpak remote-add flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.gnome.Platform org.gnome.Sdk

# Build Flatpak
flatpak-builder build-dir com.qmoi.aiapp.yml

# Create repository
flatpak build-update-repo repo

# Publish to Flathub
flatpak-builder upload-repo repo --token=[GITHUB_TOKEN]
```

---

## iOS Build

### Prerequisites

```bash
# Must be on macOS with Xcode installed
xcode-select --install

# Install signing certificate in Keychain
# 1. Apple Developer Account: https://developer.apple.com/account
# 2. Certificates, Identifiers & Profiles → Certificates
# 3. Download certificate (.cer)
# 4. Double-click to install in Keychain

# Set developer team in Xcode
# Xcode → Preferences → Accounts → Add Apple ID
```

### Build QMOIAIUI (iOS)

```bash
# Navigate to iOS app directory
cd apps/qmoiaiui-ios

# Install dependencies
pod install

# Open Xcode workspace
open QMOIAIUI.xcworkspace

# In Xcode:
# 1. Select target "QMOIAIUI"
# 2. General tab → Team → Select your team
# 3. Signing & Capabilities → Enable automatic signing

# Build via command line
xcodebuild -workspace QMOIAIUI.xcworkspace \
  -scheme QMOIAIUI \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath build/QMOIAIUI.xcarchive \
  archive

# Export to .IPA
xcodebuild -exportArchive \
  -archivePath build/QMOIAIUI.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/
```

### Upload to App Store

```bash
# Install App Store Connect tools
npm install -g app-store-connect

# Upload via Xcode
# In Xcode: Product → Upload to App Store
# Or command line: xcodebuild -exportArchive ... (as above)

# Or use altool
xcrun altool --upload-app \
  --file build/QMOIAIUI.ipa \
  --username [APPLE_ID] \
  --password [APP_PASSWORD] \
  --type ios
```

---

## Android Build

### Prerequisites

```bash
# Android SDK installed (see Prerequisites section)
# Android emulator created or physical device connected

# Verify setup
flutter doctor
# All items should have checkmarks
```

### Build QMOIAIUI (Android)

```bash
# Navigate to Android app directory
cd apps/qmoiaiui-android

# Install dependencies
flutter pub get

# Build release .APK
flutter build apk --release

# Output location: build/app/outputs/apk/release/app-release.apk

# Build release .AAB (App Bundle for Play Store)
flutter build appbundle --release

# Output location: build/app/outputs/bundle/release/app-release.aab
```

### Sign APK/AAB

```bash
# Using keystore created earlier (~/.android/release-key.keystore)
jarsigner -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore ~/.android/release-key.keystore \
  build/app/outputs/apk/release/app-release-unsigned.apk \
  qmoi_release

# Zipalign for optimization
zipalign -v 4 app-release-unsigned.apk app-release.apk

# Verify signature
jarsigner -verify -verbose -certs build/app/outputs/apk/release/app-release.apk
```

### Upload to Google Play Store

```bash
# Install Google Play Console CLI
npm install -g google-play

# Or upload via web console:
# 1. Go to Google Play Console
# 2. Select app (QMOIAIUI)
# 3. Release → Production
# 4. Upload .AAB file
# 5. Fill in release notes
# 6. Submit for review
```

---

## Web PWA Build

### Build QMOIAIUI Web

```bash
# Navigate to web app directory
cd apps/qmoiaiui-web

# Install dependencies
npm install

# Build for production
npm run build

# Output location: dist/
# Contents: index.html, manifest.webmanifest, service-worker.js, assets/

# Verify PWA structure
ls -la dist/
# Expected files:
# - index.html
# - manifest.webmanifest
# - service-worker.js (or sw.js)
# - favicon.ico
# - assets/ (images, CSS, JS)
```

### Validate PWA Configuration

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli@

# Run Lighthouse audit
lhci autorun --config=lighthouserc.json

# Expected scores:
# - Performance: >90
# - Accessibility: >90
# - Best Practices: >90
# - SEO: >90
# - PWA: All checks pass

# Validate manifest
npm install -g pwa-asset-generator

pwa-asset-generator ./assets/icon-512x512.png ./dist/pwa-assets \
  --splash-only \
  --type png
```

### Deploy Web PWA

```bash
# Option 1: Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Option 2: Deploy to Vercel
npm install -g vercel
vercel --prod

# Option 3: Deploy to AWS S3 + CloudFront
aws s3 sync dist/ s3://qmoi-web-pwa/
aws cloudfront create-invalidation --distribution-id [ID] --paths "/*"

# Option 4: Deploy to custom server
rsync -avz dist/ deploy@qmoi.com:/var/www/qmoi-web-pwa/
```

---

## Parallel Multi-Platform Build

### GitHub Actions Workflow

The easiest way to build for all platforms simultaneously:

```yaml
# .github/workflows/multi-platform-build.yml
name: Multi-Platform Build
on:
  push:
    tags:
      - "v*"  # Build when version tag is pushed

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      # Build Windows apps here

  build-macos:
    runs-on: macos-latest
    steps:
      # Build macOS apps here

  build-linux:
    runs-on: ubuntu-latest
    steps:
      # Build Linux apps here

  build-ios:
    runs-on: macos-latest
    steps:
      # Build iOS apps here

  build-android:
    runs-on: ubuntu-latest
    steps:
      # Build Android apps here

  build-web:
    runs-on: ubuntu-latest
    steps:
      # Build Web apps here
```

### Local Parallel Build (if you have all platforms available)

```bash
# Build all platforms in parallel
bash scripts/build-all-platforms.sh

# Or individually in background:
npm run build:windows &
npm run build:macos &
npm run build:linux &
npm run build:ios &
npm run build:android &
npm run build:web &

# Wait for all to complete
wait
```

---

## Signing & Notarization

### Windows Code Signing

```bash
# Obtain code signing certificate from Sectigo, DigiCert, or GlobalSign
# Import certificate into Windows certificate store

# Sign binary
signtool sign /f certificate.pfx /p password /t http://timestamp.sectigo.com \
  qmoiaiui.exe

# Verify signature
signtool verify /pa qmoiaiui.exe
```

### macOS Code Signing & Notarization

```bash
# Sign app
codesign -s "[Developer ID]" \
  --deep \
  --force \
  --timestamp \
  dist/macos/QMOIAIUI.app

# Package for notarization
ditto -c -k --sequesterRsrc dist/macos/QMOIAIUI.app qmoiaiui-1.2.3.zip

# Notarize with Apple
xcrun altool --notarize-app \
  -f qmoiaiui-1.2.3.zip \
  -t osx \
  --file qmoiaiui-1.2.3.zip \
  --primary-bundle-id com.qmoi.aiapp \
  -u [APPLE_ID] \
  -p [APP_PASSWORD]

# Wait for approval (typically 5-10 minutes)
# Then staple ticket to app
xcrun altool --staple-notarization app.zip
xcrun stapler staple dist/macos/QMOIAIUI.app

# Verify
spctl -a -v dist/macos/QMOIAIUI.app
```

### Linux GPG Signing

```bash
# Generate GPG key (if not already created)
gpg --full-generate-key

# List keys to get key ID
gpg --list-keys

# Sign AppImage
gpg --detach-sign --armor qmoiaiui-1.2.3.AppImage

# Creates: qmoiaiui-1.2.3.AppImage.asc

# Upload public key to key server
gpg --send-keys [KEY_ID]

# Verify signature (others)
gpg --verify qmoiaiui-1.2.3.AppImage.asc qmoiaiui-1.2.3.AppImage
```

---

## Distribution & Release

### Create Release on GitHub

```bash
# Create git tag
git tag v1.2.3
git push origin v1.2.3

# Create release on GitHub
gh release create v1.2.3 \
  ./dist/windows/qmoiaiui-1.2.3.msi \
  ./dist/macos/qmoiaiui-1.2.3.dmg \
  ./dist/linux/qmoiaiui-1.2.3.AppImage \
  ./build/app-release.apk \
  ./build/app-release.aab \
  dist/qmoiaiui-web.zip \
  --title "QMOIAIUI v1.2.3 Release" \
  --notes-file RELEASE_NOTES.md
```

### Submit to App Stores

**Windows Store:**
```bash
# Upload .MSIXBUNDLE to Microsoft Store
# via Partner Center: https://partner.microsoft.com/dashboard
```

**Mac App Store:**
```bash
# Via Xcode: Product → Upload to App Store
# Or via altool (see iOS Build section)
```

**iOS App Store:**
```bash
# Via App Store Connect: https://appstoreconnect.apple.com
# Upload .IPA file
# Fill in metadata and screenshots
# Submit for review
```

**Google Play Store:**
```bash
# Via Google Play Console: https://play.google.com/console
# Upload .AAB file
# Fill in release notes
# Submit for review
```

### Publish Linux Packages

**Ubuntu PPA:**
```bash
# dput to PPA
dput ppa:qmoi/stable qmoiaiui_1.2.3-1ubuntu1_source.changes
```

**Fedora COPR:**
```bash
# Upload to COPR
copr-cli build qmoi/stable qmoiaiui.src.rpm
```

**AUR (Arch Linux):**
```bash
# Push to AUR git
git push aur master:master
```

**Snap Store:**
```bash
# snapcraft upload
snapcraft upload qmoiaiui_1.2.3_amd64.snap --release=stable
```

**Flathub:**
```bash
# Submit pull request to Flathub repo
git clone https://github.com/flathub/com.qmoi.aiapp
# Update manifest and submit PR
```

### Deploy Web PWA

```bash
# Already covered in Web PWA Build section
# Push to your hosting service (Netlify, Vercel, AWS, etc.)
```

---

## Build Troubleshooting

### "Missing dependencies" error

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Reinstall
npm ci
```

### "Compilation failed" error

```bash
# Check Node.js version (must be v18+)
node --version

# Check Python version (must be 3.11+)
python --version

# Update dependencies
npm update
pip install --upgrade -r requirements.txt
```

### "Signing failed" error (macOS/Windows)

- Verify certificate is installed in certificate store
- Check certificate has not expired
- Verify certificate has code signing capability

### "Out of disk space"

```bash
# Clean build artifacts
npm run clean
rm -rf dist/ build/ node_modules/

# Or increase available disk space
```

---

**Next Steps:**
1. Run build for your target platform
2. Test the built application
3. Sign and notarize (if distributing)
4. Upload to app store
5. Monitor user feedback

**Support:** build-support@qmoi.com
