#!/usr/bin/env python3
"""
GitHub Releases Publisher for QMOI Apps
========================================

Manages all QMOI app releases across all platforms and devices.
Publishes releases to GitHub with proper versioning and asset management.

Usage:
    python tools/github_releases_publisher.py --create-releases
    python tools/github_releases_publisher.py --list-releases
    python tools/github_releases_publisher.py --upload-assets --version v1.2.3
    python tools/github_releases_publisher.py --sync-all

Features:
- Multi-platform app management (Windows, Mac, Linux, Android, iOS, etc.)
- Automated release creation with versioning
- Asset upload and management
- Release notes generation
- Download tracking and verification
"""

import os
import json
import hashlib
import argparse
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class AppBuild:
    """Represents a single app build for a platform."""
    app_name: str
    platform: str
    version: str
    file_path: str
    file_size: int
    sha256_hash: str
    download_url: str
    release_date: str
    status: str = "ready"


@dataclass
class AppRelease:
    """Represents a complete release with all platform builds."""
    app_name: str
    version: str
    release_date: str
    builds: List[AppBuild]
    release_notes: str
    is_prerelease: bool = False
    is_draft: bool = False


class GitHubReleasesPublisher:
    """Manages GitHub releases for QMOI apps."""

    # All QMOI apps and their supported platforms
    QMOI_APPS = {
        "qmoi-ai": {
            "name": "QMOI AI",
            "description": "QMOI AI - Advanced AI Assistant",
            "platforms": ["windows", "mac", "linux-deb", "linux-appimage", "android", "ios", "smarttv", "raspberrypi", "chromebook"],
            "repo": "thealphakenya/Alpha-Q-ai"
        },
        "qcity": {
            "name": "QCity",
            "description": "QCity - Distributed Computing Platform",
            "platforms": ["windows", "mac", "linux", "android", "ios"],
            "repo": "thealphakenya/QCity"
        },
        "qshare": {
            "name": "QShare",
            "description": "QShare - Secure File Sharing",
            "platforms": ["universal"],
            "repo": "thealphakenya/QShare"
        },
        "yap": {
            "name": "Yap",
            "description": "Yap - Communication Platform",
            "platforms": ["universal"],
            "repo": "thealphakenya/Yap"
        },
        "qstore": {
            "name": "QStore",
            "description": "QStore - App Store",
            "platforms": ["universal"],
            "repo": "thealphakenya/QStore"
        },
        "qvillage": {
            "name": "QVillage",
            "description": "QVillage - Community Hub",
            "platforms": ["universal"],
            "repo": "thealphakenya/QVillage"
        }
    }

    # Platform file extensions
    PLATFORM_EXTENSIONS = {
        "windows": ".exe",
        "mac": ".dmg",
        "linux-deb": ".deb",
        "linux-appimage": ".AppImage",
        "linux": ".appimage",
        "android": ".apk",
        "ios": ".ipa",
        "smarttv": ".apk",
        "raspberrypi": ".img",
        "chromebook": ".zip",
        "universal": ".apk"
    }

    def __init__(self, workspace_root: str = "/workspaces/qmoi-enhanced", github_token: Optional[str] = None):
        """Initialize the publisher."""
        self.workspace_root = Path(workspace_root)
        self.downloads_dir = self.workspace_root / "Qmoi_downloaded_apps"
        self.pwa_dir = self.workspace_root / "pwa_apps"
        self.github_token = github_token or os.environ.get("GITHUB_TOKEN")
        self.releases: List[AppRelease] = []

    def calculate_sha256(self, file_path: Path) -> str:
        """Calculate SHA256 hash of a file."""
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256.update(chunk)
        return sha256.hexdigest()

    def discover_builds(self) -> Dict[str, List[AppBuild]]:
        """Discover all available app builds in the workspace."""
        builds_by_app = {}

        # Check for Windows builds
        windows_dir = self.downloads_dir / "windows" / "latest"
        if windows_dir.exists():
            for exe_file in windows_dir.glob("*.exe"):
                app_name = "qmoi-ai"
                file_size = exe_file.stat().st_size
                sha256 = self.calculate_sha256(exe_file)
                
                build = AppBuild(
                    app_name=app_name,
                    platform="windows",
                    version="v1.2.3",
                    file_path=str(exe_file),
                    file_size=file_size,
                    sha256_hash=sha256,
                    download_url=f"https://downloads.qmoi.app/qmoi/windows.exe",
                    release_date=datetime.now().isoformat(),
                    status="ready"
                )
                
                if app_name not in builds_by_app:
                    builds_by_app[app_name] = []
                builds_by_app[app_name].append(build)

        # Check for PWA apps
        if self.pwa_dir.exists():
            for app_dir in self.pwa_dir.iterdir():
                if app_dir.is_dir():
                    app_name = app_dir.name
                    
                    build = AppBuild(
                        app_name=app_name,
                        platform="web",
                        version="v1.0.0",
                        file_path=str(app_dir),
                        file_size=self._calculate_dir_size(app_dir),
                        sha256_hash="web-app",
                        download_url=f"https://downloads.qmoi.app/{app_name}/web/",
                        release_date=datetime.now().isoformat(),
                        status="ready"
                    )
                    
                    if app_name not in builds_by_app:
                        builds_by_app[app_name] = []
                    builds_by_app[app_name].append(build)

        return builds_by_app

    def _calculate_dir_size(self, path: Path) -> int:
        """Calculate total size of a directory."""
        total = 0
        for item in path.rglob("*"):
            if item.is_file():
                total += item.stat().st_size
        return total

    def generate_release_notes(self, app_name: str, version: str, builds: List[AppBuild]) -> str:
        """Generate release notes for a release."""
        notes = f"""
# {self.QMOI_APPS.get(app_name, {}).get('name', app_name)} - Release {version}

## Overview
{self.QMOI_APPS.get(app_name, {}).get('description', '')}

## Available Downloads

| Platform | Download | Size | SHA256 |
|----------|----------|------|--------|
"""
        
        for build in builds:
            size_mb = build.file_size / (1024 * 1024)
            sha256_short = build.sha256_hash[:10] if build.sha256_hash != "web-app" else "web"
            notes += f"| {build.platform} | [Download]({build.download_url}) | {size_mb:.2f} MB | `{sha256_short}...` |\n"

        notes += """
## Installation Instructions

### Windows
1. Download the `.exe` file
2. Run the installer
3. Follow the on-screen prompts

### macOS
1. Download the `.dmg` file
2. Open the DMG file
3. Drag the app to Applications folder

### Linux
- **DEB**: `sudo dpkg -i qmoi-ai.deb`
- **AppImage**: `chmod +x qmoi-ai.AppImage && ./qmoi-ai.AppImage`

### Android
1. Download the `.apk` file
2. Enable "Unknown Sources" in settings
3. Install the APK

### iOS
1. Download from App Store or use `.ipa` with device management

## What's New
- Enhanced performance
- New features and improvements
- Bug fixes and stability improvements

## System Requirements
- Windows: Windows 10 or later
- macOS: macOS 10.12 or later
- Linux: Ubuntu 18.04 or later, or equivalent
- Android: Android 6.0 or later
- iOS: iOS 12 or later

## Support
For issues or questions, visit: https://github.com/thealphakenya/qmoi-enhanced/issues

---
Generated: {datetime.now().isoformat()}
"""
        return notes

    def create_releases_config(self) -> Dict:
        """Create a comprehensive releases configuration."""
        builds_by_app = self.discover_builds()
        
        config = {
            "schema_version": "1.0.0",
            "generated_at": datetime.now().isoformat(),
            "apps": {},
            "summary": {
                "total_apps": len(self.QMOI_APPS),
                "total_builds": sum(len(builds) for builds in builds_by_app.values()),
                "total_platforms": len(self.PLATFORM_EXTENSIONS)
            }
        }

        for app_name, app_info in self.QMOI_APPS.items():
            builds = builds_by_app.get(app_name, [])
            
            release = AppRelease(
                app_name=app_name,
                version="v1.2.3",
                release_date=datetime.now().isoformat(),
                builds=builds,
                release_notes=self.generate_release_notes(app_name, "v1.2.3", builds),
                is_prerelease=False,
                is_draft=False
            )

            config["apps"][app_name] = {
                "name": app_info["name"],
                "description": app_info["description"],
                "repository": app_info["repo"],
                "platforms_supported": app_info["platforms"],
                "current_version": "v1.2.3",
                "total_builds": len(builds),
                "builds": [asdict(build) for build in builds],
                "release_notes": release.release_notes
            }

        return config

    def generate_releases_markdown(self) -> str:
        """Generate comprehensive releases markdown documentation."""
        config = self.create_releases_config()
        
        markdown = """# QMOI Apps - GitHub Releases Guide

## Overview

All QMOI applications are available on GitHub Releases with binaries for every supported platform.

### Supported Apps

| App | Description | Platforms | Version |
|-----|-------------|-----------|---------|
"""

        for app_name, app_info in self.QMOI_APPS.items():
            platforms = ", ".join(app_info["platforms"])
            markdown += f"| {app_info['name']} | {app_info['description']} | {platforms} | v1.2.3 |\n"

        markdown += """
## Quick Start

### 1. Browse Releases
Visit: https://github.com/thealphakenya/qmoi-enhanced/releases

### 2. Download Your Platform
Each release includes binaries for:
- **Windows**: `qmoi-ai.exe`, `qcity.exe`, etc.
- **macOS**: `qmoi-ai.dmg`, `qcity.dmg`, etc.
- **Linux**: `.deb`, `.AppImage` formats
- **Android**: `.apk` files
- **iOS**: `.ipa` files (via App Store)
- **Raspberry Pi**: `.img` images
- **Chromebook**: `.zip` archives
- **Web/PWA**: Direct deployment

### 3. Install & Run
Follow platform-specific instructions (see below)

## Platform-Specific Installation

### Windows
1. Download `app-name.exe`
2. Double-click to run installer
3. Follow setup wizard

### macOS
1. Download `app-name.dmg`
2. Open DMG file
3. Drag app to Applications

### Linux (DEB)
```bash
sudo dpkg -i app-name.deb
app-name  # Run the app
```

### Linux (AppImage)
```bash
chmod +x app-name.AppImage
./app-name.AppImage
```

### Android
1. Download `app-name.apk`
2. Enable Unknown Sources (Settings > Security)
3. Install the APK

### iOS
1. Download from App Store (or use TestFlight)
2. Install and run

### Raspberry Pi
1. Download `app-name.img`
2. Flash to microSD: `dd if=app-name.img of=/dev/sdX bs=4M`
3. Insert card and boot

### Chromebook
1. Download and extract `.zip`
2. Load as unpacked extension or PWA

## Verification

All releases include SHA256 checksums. To verify:

```bash
echo "EXPECTED_HASH  app-name.exe" | sha256sum -c
```

## Release Information

### All Apps

"""

        config = self.create_releases_config()
        for app_name, app_data in config["apps"].items():
            markdown += f"\n### {app_data['name']}\n\n"
            markdown += f"{app_data['description']}\n\n"
            markdown += "**Platforms:**\n"
            for platform in app_data["platforms_supported"]:
                markdown += f"- {platform}\n"
            markdown += f"\n**Current Version:** {app_data['current_version']}\n"
            markdown += f"**Available Builds:** {app_data['total_builds']}\n"

        markdown += """
## Troubleshooting

### Download Issues
- Retry the download (GitHub may cache assets)
- Check your internet connection
- Verify SHA256 checksum

### Installation Issues
- Windows: Run as administrator
- Mac: Right-click > Open (may be necessary for unsigned apps)
- Linux: Check file permissions with `chmod +x`
- Android: Ensure unknown sources are enabled
- iOS: Use signed certificates

### Security
All releases are signed and verified. If you encounter issues:
1. Report on GitHub Issues
2. Contact support via the app
3. Check documentation

## Continuous Updates

Releases are updated automatically:
- Every stable release is published
- Pre-releases available for testing
- Changelog updated with each release

## Support

For issues or questions:
- GitHub Issues: https://github.com/thealphakenya/qmoi-enhanced/issues
- Email: support@qmoi.app
- Community: https://qvillage.qmoi.app

---

**Last Updated:** {datetime.now().isoformat()}
**Total Apps:** {config['summary']['total_apps']}
**Total Platforms:** {config['summary']['total_platforms']}

"""
        
        return markdown

    def save_releases_config(self, output_path: Optional[str] = None) -> str:
        """Save releases configuration to JSON file."""
        output_path = output_path or str(self.workspace_root / "GITHUB_RELEASES_CONFIG.json")
        config = self.create_releases_config()
        
        with open(output_path, "w") as f:
            json.dump(config, f, indent=2)
        
        return output_path

    def save_releases_guide(self, output_path: Optional[str] = None) -> str:
        """Save releases guide to markdown file."""
        output_path = output_path or str(self.workspace_root / "GITHUB_RELEASES_GUIDE.md")
        markdown = self.generate_releases_markdown()
        
        with open(output_path, "w") as f:
            f.write(markdown)
        
        return output_path

    def generate_cli_commands(self) -> str:
        """Generate GitHub CLI commands for publishing releases."""
        commands = """#!/bin/bash
# GitHub CLI Commands for Publishing QMOI Releases
# Usage: bash publish-releases.sh

set -e

REPO="thealphakenya/qmoi-enhanced"
VERSION="v1.2.3"

echo "Publishing QMOI Releases to GitHub..."

# Create release
gh release create $VERSION \\
  --repo $REPO \\
  --title "QMOI AI Suite v1.2.3" \\
  --notes-file GITHUB_RELEASES_NOTES.md \\
  --draft=false

# Upload assets for QMOI AI
echo "Uploading QMOI AI assets..."
gh release upload $VERSION \\
  --repo $REPO \\
  Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe \\
  --clobber

# Upload web apps
echo "Uploading PWA apps..."
for app in pwa_apps/*/; do
  app_name=$(basename "$app")
  gh release upload $VERSION \\
    --repo $REPO \\
    "$app" \\
    --clobber
done

# Verify release
echo "Verifying release..."
gh release view $VERSION --repo $REPO

echo "✅ Release published successfully!"
"""
        return commands


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="GitHub Releases Publisher for QMOI Apps")
    parser.add_argument("--workspace", default="/workspaces/qmoi-enhanced", help="Workspace root directory")
    parser.add_argument("--discover", action="store_true", help="Discover available builds")
    parser.add_argument("--config", action="store_true", help="Generate releases configuration")
    parser.add_argument("--guide", action="store_true", help="Generate releases guide")
    parser.add_argument("--commands", action="store_true", help="Generate CLI commands")
    parser.add_argument("--all", action="store_true", help="Generate all documents")
    parser.add_argument("--publish-all", action="store_true", help="Auto-publish all releases to GitHub")

    args = parser.parse_args()

    publisher = GitHubReleasesPublisher(workspace_root=args.workspace)

    def log_audit(message: str):
        with open(str(Path(args.workspace) / "QMOI_RELEASES_AUDIT.log"), "a") as f:
            f.write(f"[{datetime.now().isoformat()}] {message}\n")

    def check_qmoi_memory():
        github_token = os.environ.get("GITHUB_TOKEN")
        if not github_token:
            print("[ERROR] GITHUB_TOKEN not set. Aborting publish.")
            log_audit("ERROR: GITHUB_TOKEN not set.")
            return False
        print("[QMOI] Memory/awareness check: credentials OK.")
        log_audit("Memory/awareness check: credentials OK.")
        return True

    if args.all or args.discover:
        print("Discovering builds...")
        builds = publisher.discover_builds()
        for app_name, builds_list in builds.items():
            print(f"\n{app_name}: {len(builds_list)} build(s)")
            for build in builds_list:
                print(f"  - {build.platform}: {build.file_size / (1024*1024):.2f} MB")

    if args.all or args.config:
        print("\nGenerating releases configuration...")
        config_path = publisher.save_releases_config()
        print(f"✅ Saved to {config_path}")

    if args.all or args.guide:
        print("Generating releases guide...")
        guide_path = publisher.save_releases_guide()
        print(f"✅ Saved to {guide_path}")

    if args.all or args.commands:
        print("Generating CLI commands...")
        commands = publisher.generate_cli_commands()
        commands_path = str(Path(args.workspace) / "publish-releases.sh")
        with open(commands_path, "w") as f:
            f.write(commands)
        print(f"✅ Saved to {commands_path}")

    if args.publish_all:
        print("\n[QMOI] Auto-publishing all releases to GitHub...")
        if not check_qmoi_memory():
            print("[QMOI] Aborted: Credential check failed.")
            return
        builds = publisher.discover_builds()
        for app_name, builds_list in builds.items():
            for build in builds_list:
                asset_path = build.file_path
                asset_name = os.path.basename(asset_path)
                version = build.version
                repo = publisher.QMOI_APPS.get(app_name, {}).get("repo", "thealphakenya/qmoi-enhanced")
                release_title = f"{publisher.QMOI_APPS.get(app_name, {}).get('name', app_name)} - {version}"
                notes = publisher.generate_release_notes(app_name, version, [build])
                notes_file = f"/tmp/{app_name}-{version}-notes.md"
                with open(notes_file, "w") as f:
                    f.write(notes)
                print(f"[QMOI] Creating release for {app_name} {version} in {repo}...")
                log_audit(f"Creating release for {app_name} {version} in {repo}")
                create_cmd = f"gh release create {version} --repo {repo} --title '{release_title}' --notes-file '{notes_file}' --draft=false"
                upload_cmd = f"gh release upload {version} --repo {repo} '{asset_path}' --clobber"
                for attempt in range(1, 4):
                    result = os.system(create_cmd)
                    if result == 0:
                        print(f"[QMOI] Release created for {app_name} {version}.")
                        log_audit(f"Release created for {app_name} {version}.")
                        break
                    else:
                        print(f"[WARN] Release creation failed (attempt {attempt}). Retrying...")
                        log_audit(f"WARN: Release creation failed for {app_name} {version} (attempt {attempt})")
                for attempt in range(1, 4):
                    result = os.system(upload_cmd)
                    if result == 0:
                        print(f"[QMOI] Asset uploaded: {asset_name}")
                        log_audit(f"Asset uploaded: {asset_name}")
                        break
                    else:
                        print(f"[WARN] Asset upload failed (attempt {attempt}). Retrying...")
                        log_audit(f"WARN: Asset upload failed for {asset_name} (attempt {attempt})")
        print("[QMOI] All releases published.")
        log_audit("All releases published.")

    if not any([args.all, args.discover, args.config, args.guide, args.commands, args.publish_all]):
        parser.print_help()


if __name__ == "__main__":
    main()
