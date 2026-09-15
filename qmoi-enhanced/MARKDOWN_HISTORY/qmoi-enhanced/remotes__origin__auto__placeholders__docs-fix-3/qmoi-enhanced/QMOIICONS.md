---
title: "QMOIICONS"
qmoi_validation_frontmatter: true
---

# QMOIICONS

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

QMOIICONS.md

QMOI Icons, locations, and auto-update process

Overview
QMOI uses a consistent icon set across platforms (desktop, mobile, web, TV) to ensure a unified UX. Icons are stored in the repository, installed with each platform build, and can be auto-updated by QMOI's automation engine.

Repository locations (convention)
- /assets/icons/ : master icon set (SVG, PNG, ICO)
- /mobile/assets/icons/ : mobile-specific sizes and adaptive icons
- /desktop/installer/icons/ : installer and shortcut icons
- /qmoi-space/public/icons/ : web icons and favicons

Naming conventions
- qmoi-{name}-{platform}.{ext}
  - Examples: qmoi-logo.svg, qmoi-notification-windows.ico, qmoi-shortcut-linux.png

Auto-update & distribution
QMOI provides a small icon manager that:
- checks a central icon manifest (.qmoi/icons.json)
- downloads any updated icons from the QMOI CDN or mirror
- replaces local icons atomically and regenerates favicons and platform-specific variants
- notifies platform services to reload icons (desktop tray, mobile assets cache)

Basic icon manifest format (.qmoi/icons.json)
{
  "icons": [
    {"name": "qmoi-logo", "versions": "1.2.0", "paths": {"svg": "assets/icons/qmoi-logo.svg"}},
    {"name": "qmoi-notification", "versions": "1.0.1", "paths": {"ico": "desktop/installer/icons/qmoi-notification.ico"}}
  ],
  "timestamp": 0
}

Auto-creation of shortcuts & system integration
- Desktop installers will create shortcuts during installation using platform-native installers (NSIS for Windows, .desktop for Linux, dmg pkg scripts for macOS).
- QMOI automation includes small helper scripts to register notification icons and tray menu entries.

Security & signing
- Icons that are downloaded during auto-update are checksummed (sha256) and signed by QMOI signing key. The icon manager verifies checksum before replacing local files.

Where icons are used
- App launcher and installer
- Notification/Tray icons
- Website favicons and PWA manifests
- Mobile adaptive icons and home screen shortcuts

How QMOI updates icons
1. Automation agent checks remote manifest
2. Downloads new icons to a staging area
3. Verifies signature and checksum
4. Atomically swaps files and updates platform caches
5. Logs the update and alerts admin if any step fails

See also
- ALLDEVICESSETTINGS.md (device-specific icon settings)
- BUILDAPPSFORALLPLATFORMS.md (integration into build pipelines)
- QMOINGROK.md (icon downloads via tunnel/CDN if needed)

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/QMOIICONS.md",
  "validated_at": "2025-10-26T20:51:24.783458Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
