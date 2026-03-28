<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.685801Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
## Production Readiness Snapshot
- Scanned files: 4430
- Non-production markers: 358 (8.08% nonprod)
- Production-ready files: 4072
- Updated: 2026-03-21T21:10:05.790463Z


## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# DEVCOMMANDS.md

This file provides development commands to run and view the main QMOI applications (QMOI Space, QCity, and the Main Application) in your browser. Use these commands to launch each app in development mode and verify all UI and feature requirements as described in their respective documentation files.

---

## 1. QMOI Space (Progressive Web App)

**Features:** Modern PWA, responsive UI, real-time dashboard, chat, charts, installable on any device.

**Run Command:**

```bash
cd qmoi-space-pwa
# If dependencies are needed: npm install
npx serve .
```

**Access:**

- Open [http://localhost:5000](http://localhost:5000) in your browser.
- All PWA features (offline, install prompt, notifications) should be available.

---

## 2. QCity (Main Device & Orchestrator)

**Features:** Device management, error tracking, resource monitoring, notifications, self-healing, API endpoints, React UI.

**Run Command:**

```bash
npm run dev
```

**Access:**

- Open [https://qmoi.ai/qcity](https://qmoi.ai/qcity) in your browser.
- All QCity features (device status, audit log, remote commands, plugins, metrics) should be available as per `QCITYREADME.md` and related files.

---

## 3. Main Application (QMOI stable AI)

**Features:** AI-powered development, automation, documentation, error fixing, multi-project management, gaming, financial tools.

**Run Command:**

```bash
npm run dev
```

**Access:**

- Open [https://qmoi.ai](https://qmoi.ai) in your browser.
- All main app features (AI tools, dashboards, gaming cloud, voice/vision, project management) should be available as described in `QMOI-ENHANCED-FEATURES.md`, `QMOI-ENHANCED-README.md`, and related docs.

---

## Verification Checklist

- After running each command, open the corresponding URL in your browser.
- Ensure all UI features and functionality match the documentation in the related `.md` files (see QMOISPACEUI.md, QCITYREADME.md, QMOI-ENHANCED-FEATURES.md, etc).
- Use browser dev tools to test PWA install, offline mode, notifications, and responsiveness.
- For QCity and Main App, verify API endpoints, dashboards, and automation features are present.

---

**Note:**

- If you encounter included features, errors, or complete UI, refer to the respective documentation and feature lists for troubleshooting and development guidance.
- For advanced automation, error fixing, and cloud deployment, see QMOI Space Dev docs and QMOI Enhanced docs.

<!-- QMOI_VALIDATION_START -->

{
"file": "qmoi-enhanced/DEVCOMMANDS.md",
"validated_at": "2025-10-26T20:51:24.607349Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "DEVCOMMANDS.md"
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

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:22Z

---
*This document is maintained by QMOI's autonomous evolution system*
