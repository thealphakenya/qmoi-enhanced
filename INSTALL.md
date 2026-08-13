# Installation Guide: QMOI Apps

**Last Updated:** 2026-08-13  
**Status:** Complete Cross-Platform Installation Guide  
**Scope:** Windows, macOS, Linux, iOS, Android, Web

---

## Table of Contents
1. [Windows Installation](#windows-installation)
2. [macOS Installation](#macos-installation)
3. [Linux Installation](#linux-installation)
4. [iOS Installation](#ios-installation)
5. [Android Installation](#android-installation)
6. [Web PWA Installation](#web-pwa-installation)
7. [First Run Setup](#first-run-setup)
8. [Uninstallation](#uninstallation)
9. [Troubleshooting](#troubleshooting)

---

## Windows Installation

### Method 1: Microsoft Store (Recommended)
Easiest and most seamless installation with automatic updates.

**QMOIAIUI:**
1. Open Microsoft Store (search "Microsoft Store" in Start Menu)
2. Search for "QMOIAIUI"
3. Click "Get" button
4. Sign in with Microsoft account (if prompted)
5. Wait for download and installation to complete
6. Click "Launch" to start the app

**Same process for:** QMOI Space, QCity, QALPHA

**Advantages:**
✓ Automatic updates
✓ One-click uninstall
✓ Malware scanning before installation
✓ Integrated with Windows Update

### Method 2: Windows Package Manager (Winget)
Fast command-line installation.

```bash
# Install QMOIAIUI
winget install qmoiaiui

# Install all QMOI apps
winget install qmoiaiui qmoi-space qcity qalpha

# Verify installation
winget list qmoi
```

**Advantages:**
✓ Scriptable for automation
✓ Works on Windows 10/11
✓ Automatic updates via Winget

### Method 3: Direct Download (.MSI Installer)
Manual installation with full control.

1. Download QMOIAIUI-1.2.3.msi from https://downloads.qmoi.com
2. Double-click the .MSI file
3. Click "Next" through installation wizard
4. Choose installation location (default: C:\Program Files\QMOI\)
5. Click "Install"
6. Wait for installation to complete
7. Check "Launch the application" checkbox
8. Click "Finish"

**Advantages:**
✓ No Store account required
✓ Full control over installation folder
✓ Can be scripted via msiexec

### Method 4: Portable .EXE (No Installation)
Use without installing to Program Files.

1. Download QMOIAIUI-1.2.3-portable.exe
2. Extract to desired folder
3. Double-click .EXE to run
4. (Optional) Create desktop shortcut

**Advantages:**
✓ No installation required
✓ Can run from USB drive
✓ No registry modifications

**Windows Installation Verification:**
```bash
# Check if installed in Program Files
dir "%ProgramFiles%\QMOI\QMOIAIUI"

# Check Windows Registry
reg query HKEY_LOCAL_MACHINE\SOFTWARE\QMOI\QMOIAIUI

# Launch from command line
cd "%ProgramFiles%\QMOI\QMOIAIUI"
qmoiaiui.exe

# Check file associations
assoc .md=QMOIDocument
```

---

## macOS Installation

### Method 1: Mac App Store (Recommended)
Seamless installation with automatic updates.

1. Open App Store (press ⌘ + Space, type "App Store")
2. Search for "QMOIAIUI"
3. Click "Get" button
4. Sign in with Apple ID (if prompted)
5. Wait for download and installation
6. Click "Open" to launch

**Advantages:**
✓ Automatic updates
✓ Integrated with macOS
✓ One-click uninstall
✓ Parental controls available

### Method 2: Homebrew (Command Line)
Fast package management installation.

```bash
# Add QMOI tap
brew tap qmoi/tap

# Install QMOIAIUI
brew install qmoiaiui

# Install all QMOI apps
brew install qmoiaiui qmoi-space qcity qalpha

# Verify installation
brew list | grep qmoi
```

**Advantages:**
✓ Easy management (brew update, brew upgrade)
✓ Works across macOS versions
✓ Developer-friendly

### Method 3: Direct Download (.DMG)
Manual installation from disk image.

1. Download QMOIAIUI-1.2.3.dmg from https://downloads.qmoi.com
2. Double-click the .DMG file (mounts as virtual disk)
3. In the Finder window that opens, drag QMOIAIUI.app to Applications folder
4. Wait for copy to complete
5. Eject the .DMG (drag to Trash or use Finder)
6. Open Applications folder and double-click QMOIAIUI.app
7. (First launch) Click "Open" to bypass security warning

**Advantages:**
✓ No App Store account required
✓ Full control over installation
✓ Traditional macOS installation method

**Notarization Verification:**
```bash
# Check notarization status
spctl -a -v /Applications/QMOIAIUI.app

# Expected output: "valid on disk"

# Check code signature
codesign -v /Applications/QMOIAIUI.app

# Expected output: valid on disk
```

### Method 4: MacPorts (Alternative)
For users who prefer MacPorts package management.

```bash
# Install via MacPorts
sudo port install qmoiaiui

# Verify installation
port list installed | grep qmoi
```

---

## Linux Installation

### Method 1: System Package Manager (Recommended for your distro)

**Ubuntu (Recommended):**
```bash
# Add QMOI repository
sudo add-apt-repository ppa:qmoi/stable

# Update package list
sudo apt-get update

# Install QMOIAIUI
sudo apt-get install qmoiaiui

# Install all QMOI apps
sudo apt-get install qmoiaiui qmoi-space qcity qalpha

# Verify installation
dpkg -l | grep qmoi
qmoiaiui --version
```

**Fedora (Alternative):**
```bash
# Add QMOI COPR repository
sudo dnf copr enable qmoi/stable

# Install QMOIAIUI
sudo dnf install qmoiaiui

# Install all QMOI apps
sudo dnf install qmoiaiui qmoi-space qcity qalpha

# Verify installation
rpm -qa | grep qmoi
qmoiaiui --version
```

**Arch Linux (Community):**
```bash
# Install yay (AUR helper)
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Install QMOIAIUI from AUR
yay -S qmoiaiui

# Verify installation
pacman -Q | grep qmoi
qmoiaiui --version
```

**Advantages:**
✓ Automatic updates via system package manager
✓ Dependency management
✓ Easy uninstall

### Method 2: Snap (Cross-distro)
Works on any Linux distribution with snapd.

```bash
# Install snapd (if not installed)
# Ubuntu/Fedora: already installed
# Arch: sudo pacman -S snapd
# Debian: sudo apt-get install snapd

# Install QMOIAIUI as snap
snap install qmoiaiui

# Install all QMOI apps
snap install qmoiaiui qmoi-space qcity qalpha

# Verify installation
snap list | grep qmoi

# Launch app
qmoiaiui

# Update snaps
snap refresh qmoiaiui
```

**Advantages:**
✓ Works on all Linux distros
✓ Automatic updates
✓ Sandboxed for security
✓ No dependency conflicts

### Method 3: Flatpak (Cross-distro)
Universal Linux application distribution.

```bash
# Install flatpak (if not installed)
sudo apt-get install flatpak  # Ubuntu
sudo dnf install flatpak      # Fedora
sudo pacman -S flatpak        # Arch

# Add Flathub repository
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Install QMOIAIUI
flatpak install flathub com.qmoi.aiapp

# Install all QMOI apps
flatpak install flathub com.qmoi.aiapp com.qmoi.space com.qcity.filemanager com.qalpha.ide

# Verify installation
flatpak list --app | grep qmoi

# Launch app
flatpak run com.qmoi.aiapp

# Update apps
flatpak update
```

**Advantages:**
✓ Works on all Linux distros
✓ Automatic updates
✓ Sandboxed permissions
✓ Easy permission management

### Method 4: AppImage (Portable)
No installation required, runs directly.

```bash
# Download AppImage
wget https://downloads.qmoi.com/qmoiaiui-1.2.3.AppImage

# Make executable
chmod +x qmoiaiui-1.2.3.AppImage

# Run directly
./qmoiaiui-1.2.3.AppImage

# (Optional) Create desktop shortcut
# Copy file to ~/.local/share/applications/
# Manually edit .desktop file to point to AppImage
```

**Advantages:**
✓ No installation needed
✓ No dependencies required
✓ Portable (USB, etc.)
✓ Single file format

### Desktop Integration (All Methods)
After installation, verify desktop integration:

```bash
# Check if app appears in application menu
ls ~/.local/share/applications/qmoiaiui.desktop

# Launch from menu (should work)
gtk-launch qmoiaiui

# Check MIME associations
xdg-mime query default audio/mpeg
# Expected: qmoi-space.desktop

# Verify file handler registration
xdg-mime query filetype song.mp3
# Expected: audio/mpeg
```

---

## iOS Installation

### App Store Installation

1. **Open App Store**
   - Press home button (or swipe up from bottom)
   - Tap App Store icon (blue icon with white)

2. **Search for QMOIAIUI**
   - Tap Search tab (magnifying glass icon, bottom right)
   - Type "QMOIAIUI" in search field
   - Tap search result

3. **Install Application**
   - Tap "Get" button (cloud icon)
   - Use Face ID, Touch ID, or Apple ID password
   - Tap confirmation message

4. **Wait for Installation**
   - Progress indicator appears
   - "Get" button changes to "Open" when ready

5. **Launch App**
   - Tap "Open" button immediately
   - Or find QMOIAIUI on home screen and tap later

### TestFlight Beta Installation

For testing pre-release versions:

1. **Download TestFlight**
   - Open App Store
   - Search "TestFlight"
   - Tap "Get" and install

2. **Join QMOI Beta**
   - Visit: https://testflight.apple.com/join/qmoi
   - Tap "Open in TestFlight"
   - Tap "Install" for desired app

3. **Launch Beta Version**
   - Open TestFlight app
   - Find QMOIAIUI under "Testing" tab
   - Tap "Install" to get latest beta

### Verification (iOS)

```
Settings → Apps → [Name of App] → App Version
Should show: 1.2.3
```

---

## Android Installation

### Google Play Store Installation

1. **Open Google Play Store**
   - Tap Play Store icon (colorful triangle)
   - Or search "Google Play" in apps

2. **Search for App**
   - Tap search icon (magnifying glass)
   - Type "QMOIAIUI"
   - Tap search result

3. **Install Application**
   - Tap "Install" button
   - (If first time) Review app permissions → tap "Install"
   - Sign in with Google Account (if prompted)

4. **Wait for Installation**
   - Progress bar shows download/installation status
   - "Install" button changes to "Uninstall" when done

5. **Launch App**
   - Tap "Open" button immediately
   - Or find QMOIAIUI in app drawer and tap later

### Internal Testing (Beta)

For testing pre-release versions:

1. **Open Google Play Store**
   - Find app (e.g., QMOIAIUI)

2. **Join Beta Program**
   - Scroll to "Join the beta" section
   - Tap "Join"
   - Confirm by tapping "Join" again

3. **Get Beta Updates**
   - Beta version installs immediately
   - Updates appear before general release
   - Can leave beta anytime

### Verification (Android)

```
Settings → Apps → App management → [App Name]
App info should show: Version 1.2.3
```

---

## Web PWA Installation

### Chrome Desktop / Mobile

1. **Visit App URL**
   - Open: https://qmoi.com/ai (for QMOIAIUI)

2. **Install Prompt (may appear automatically)**
   - Click "Install" button in address bar
   - Or use menu: ⋮ → "Install app"

3. **Confirm Installation**
   - Click "Install" in dialog
   - App appears on desktop/home screen

4. **Launch App**
   - Click app icon on desktop (Windows)
   - Click app in taskbar (Windows)
   - Tap app on home screen (Android)

### Firefox

1. **Visit App URL**
   - Open: https://qmoi.com/ai

2. **Install via Menu**
   - Click menu (☰)
   - Select "Install" option (if available)

3. **Confirm Installation**
   - Accept request
   - App appears in applications

### Safari (macOS & iOS)

1. **Visit App URL**
   - Open: https://qmoi.com/ai

2. **Share Menu**
   - Click Share button (⬆️)
   - Select "Add to Home Screen" (iOS)
   - Select "Add to Dock" (macOS)

3. **Confirm**
   - Tap "Add" to confirm
   - Enter app name if desired
   - Tap "Add"

### Edge

1. **Visit App URL**
   - Open: https://qmoi.com/ai

2. **Install from Menu**
   - Click menu (⋯)
   - Select "Apps" → "Install this site as an app"

3. **Confirm**
   - Click "Install" in dialog

### Web PWA Features After Installation

✓ Offline access (via Service Worker)
✓ Push notifications
✓ Home screen shortcut
✓ App-like experience (full screen, no address bar)
✓ Automatic updates

---

## First Run Setup

All QMOI apps require initial configuration on first launch.

### Step 1: Accept Permissions

**Windows/macOS/Linux:**
- App will request necessary permissions
- Click "Allow" for file access, notifications, microphone, camera as needed

**iOS:**
- System will prompt for permissions one-by-one
- Tap "Allow" for each permission

**Android:**
- Grant permissions at first use or in Settings
- Go to Settings → Apps → [App Name] → Permissions

### Step 2: Sign In (Optional but Recommended)

- Create QMOI account or sign in with existing account
- Enables cloud sync across devices
- Enables offline file access

**Steps:**
1. Tap/Click "Sign In" button
2. Enter email and password (or use OAuth providers)
3. Verify email (if new account)
4. Wait for sync to complete

### Step 3: Configure Default Handlers (QCity, QMOI Space, QALPHA)

**QCity (File Manager):**
- Choose whether to set as default file manager
- Set file associations (.mp3 → QMOI Space, .pdf → Document Viewer, etc.)

**QMOI Space (Media Player):**
- Choose default audio/video formats
- Enable hardware acceleration (if available)

**QALPHA (IDE):**
- Choose default editor for code files (.py, .js, .ts, etc.)
- Configure terminal shell (bash, zsh, powershell)

### Step 4: Customize Settings

- Open Settings/Preferences
- Configure theme (light, dark, auto)
- Enable accessibility features
- Set handsfree controls (voice, gestures, eye tracking)
- Configure notifications

---

## Uninstallation

### Windows

**Method 1: Microsoft Store**
1. Open Microsoft Store
2. Click your profile icon (top right)
3. Select "My library"
4. Find app → Click "..." → "Uninstall"
5. Confirm uninstall

**Method 2: Control Panel**
1. Open Control Panel
2. Go to "Programs" → "Programs and Features"
3. Find app in list
4. Click app → "Uninstall"
5. Follow uninstaller wizard

**Method 3: Winget**
```bash
winget uninstall qmoiaiui
```

**Verification:**
```bash
# Check if completely removed
dir "%ProgramFiles%\QMOI\QMOIAIUI"  # Should not exist
reg query HKEY_LOCAL_MACHINE\SOFTWARE\QMOI  # Should not exist
```

### macOS

**Method 1: App Store**
1. Open App Store
2. Click your profile (top right)
3. Select "Manage" → Find app
4. Click "..." → "Remove from Library"

**Method 2: Finder**
1. Open Finder
2. Go to Applications folder
3. Find app → Right-click → "Move to Trash"
4. Empty Trash

**Method 3: Homebrew**
```bash
brew uninstall qmoiaiui
```

**Verification:**
```bash
ls /Applications/QMOIAIUI.app  # Should not exist
```

### Linux

**Ubuntu/Debian (APT):**
```bash
sudo apt-get remove qmoiaiui
sudo apt-get purge qmoiaiui  # Also remove config files
```

**Fedora (DNF):**
```bash
sudo dnf remove qmoiaiui
```

**Snap:**
```bash
snap remove qmoiaiui
```

**Flatpak:**
```bash
flatpak remove com.qmoi.aiapp
```

**Verification:**
```bash
which qmoiaiui  # Should not be found
dpkg -l | grep qmoi  # Should be empty
```

### iOS

1. Long-press app icon
2. Select "Remove App"
3. Select "Remove from Home Screen" or "Delete App"
4. Confirm "Delete"

### Android

1. Long-press app icon
2. Select "Uninstall"
3. Confirm uninstall

### Web PWA

**Chrome/Edge:**
1. Right-click app in taskbar/shelf
2. Select "Uninstall" or "Remove from…"

**Safari (iOS):**
1. Long-press app icon
2. Select "Remove App"
3. Confirm

---

## Troubleshooting

### "Application won't launch"

**Windows:**
```bash
# Check if .NET is installed
dotnet --version

# If not, install .NET 8.0 Runtime
# Download from: https://dotnet.microsoft.com/download/dotnet
```

**macOS:**
```bash
# Check system requirements
system_profiler SPSoftwareDataType | grep "System Version"

# Check if app is signed and notarized
spctl -a -v /Applications/QMOIAIUI.app
```

**Linux:**
```bash
# Check if dependencies are installed
ldd qmoiaiui
# Look for missing libraries (marked as "not found")

# Install missing dependencies
sudo apt-get install [missing-lib]
```

**iOS/Android:**
- Restart device
- Clear app cache (Settings → Apps → [App] → Storage → Clear Cache)
- Reinstall app

### "Out of disk space"

- Free up disk space:
  - Windows: Disk Cleanup (cleanmgr)
  - macOS: Disk Utility, empty Trash
  - Linux: `sudo apt-get clean`, `sudo dnf clean all`
- Reduce app data cache (Settings → Storage)

### "Permission denied" errors

**Windows:**
- Run as Administrator: Right-click → "Run as administrator"

**macOS:**
- Ensure app is notarized (see verification steps above)

**Linux:**
- Check file permissions: `ls -la ~/.qmoi/`
- Fix permissions: `chmod -R 755 ~/.qmoi/`

### "Application crashes on startup"

- Check system logs:
  - Windows: Event Viewer
  - macOS: Console.app
  - Linux: `journalctl -xe`
- Try safe mode (if available)
- Reinstall from scratch

---

**Last Updated:** 2026-08-13  
**Support:** support@qmoi.com
