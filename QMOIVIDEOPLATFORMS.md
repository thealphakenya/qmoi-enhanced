<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Video Platforms & App Build Automation

## App Build Automation (2025-06-13)

- The QMOI app builder now automates real builds for:
  - **Windows**: Electron app
  - **Android**: React Native APK
  - **iOS**: React Native IPA (if on macOS)
- All output files are named `qmoi ai` and placed in the correct Qmoi_apps/<device> directory.
- Robust logging and error handling are implemented for all build steps.
- [PRODUCTION IMPLEMENTATION REQUIRED]s remain for mac, linux, chromebook, raspberrypi, smarttv, qcity.

<!-- QMOI_VALIDATION_START -->
{
  "file": "QMOIVIDEOPLATFORMS.md",
  "validated_at": "2025-10-26T20:51:22.571418Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Video Platforms & App Build Automation"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
