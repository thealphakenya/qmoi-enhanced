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

# SERVEQCITYQMOIAIQMOISPACE.md

This document describes how to serve QCity, QMOI AI, and QMOI Space for all apps, app types, and platforms, including automation and autofix features.

## QCity Serving
- Main entry: `QCITYREADME.md`, `QCITYMAINDEVICE.md`, and related scripts in `qcity-artifacts/`
- Serve via Python/Node.js web server (search for main server script or use FastAPI/Flask/Express)
- UI features: Referenced in `QCITYRESOURCES.md`, `QCITYRUNNERSENGINE.md`, and `QCITYQMOIAUTOSTART.md`
- All endpoints and UI features are autotested and autofixed by QMOI

## QMOI AI Serving
- Main entry: `qmoi_ai.py`, `qmoi_ai_launcher.py`, `main.py` (if present)
- Serve via Python backend (FastAPI/Flask)
- UI features: Referenced in `QMOI-ENHANCED-FEATURES.md`, `QMOI-ENHANCED-AUTOTESTS.md`, and `QMOI_MEMORY.md`
- All endpoints and UI features are autotested and autofixed by QMOI

## QMOI Space Serving
- Main entry: `qmoi-space/`, `QMOISPACEDEV.md`, `QMOISPACEUI.md`
- Serve via Python/Node.js backend or Gradio/Streamlit for AI features
- UI features: Referenced in `QMOISPACEUI.md`, `QMOISPACEDEV.md`, and `QMOIHUGGINGFACESPACES.md`
- All endpoints and UI features are autotested and autofixed by QMOI

## Automation & Enhancement
- QMOI runs background scripts to autotest, serve, and autofix all features for all apps and platforms
- Errors detected in any app or browser are autofixed automatically
- All serving and autofix features are referenced and documented for permanent operation

## Error Handling & Debugging
- All serving errors and issues are logged in SERVINGERRORSISSUES.md in real time
- Terminal output and debugging information are referenced for autofix and enhancement
- QMOI uses this log to locate, fix, and enhance all serving issues

<!-- QMOI_VALIDATION_START -->
{
  "file": "SERVEQCITYQMOIAIQMOISPACE.md",
  "validated_at": "2025-10-26T20:51:22.630809Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "SERVEQCITYQMOIAIQMOISPACE.md"
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
