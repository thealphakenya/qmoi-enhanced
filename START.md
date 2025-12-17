---
title: "QMOI Start Guide"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Start Guide

## 🚀 How to Start or Resume QMOI (QCity & Cloud)

To ensure QMOI is always running (even in the cloud or when your device is offline), use the following command:

```bash
python scripts/qmoi-start.py
```

- This script will:
  - Check if QMOI is already running (locally or in the cloud)
  - Show the status of the running system
  - If not running, it will start/resume all QMOI automation, error fixing, and cloud features (QCity, Colab, Dagshub, etc.)
  - Ensure all features are always-on and self-healing

## 📊 Status

- The script will display the current status and health of QMOI, including error fixing, cloud sync, and notifications.

## 🧪 Developer Quick Start

- Run dev server: `npm run dev` (local: http://localhost:3000)
- Check dev server health: `npm run dev:health` (returns non-zero exit code if unreachable)
- Run tests: `npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`
- Build (CI style): `npm run ci:build`

### MSW & Testing Notes

- MSW is initialized at test-time via `src/setupTests.ts` and provides a global promise `globalThis.__MSW_READY__` that tests can await.
- If you see unhandled network requests during tests, set `SHOW_MSW_UNHANDLED=1` to see them; use `TEST_VERBOSE=1` for extra handler debug output.

- See `CONTRIBUTING.md` for more developer testing notes and troubleshooting steps (MSW handler shapes, env flags, and common fixes).

## 🛡️ Always-On

- QMOI is designed to keep running in the cloud, so you never miss an event or fix—even if your device is offline.

---

**QMOI: Always-on, self-healing, and fully automated.**

<!-- QMOI_VALIDATION_START -->

{
"file": "START.md",
"validated_at": "2025-10-26T20:51:22.641823Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Start Guide"
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
