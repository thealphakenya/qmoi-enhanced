<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.842226Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
## production Readiness Snapshot
- Scanned files: 4430
- production markers: 358 (8.08% production)
- production-ready files: 4072
- Updated: 2026-03-21T21:10:05.790463Z


## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# prodCOMMANDS.md

This file provides production commands to run and view the main QMOI applications (QMOI Space, QCity, and the Main Application) in your browser. Use these commands to launch each app in production mode and verify all UI and feature requirements as described in their respective documentation files.

---

## 1. QMOI Space (Progressive Web App)

**Features:** Modern PWA, responsive UI, real-time dashboard, chat, charts, installable on any prodice.

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

## 2. QCity (Main prodice & Orchestrator)

**Features:** prodice management, error tracking, resource monitoring, notifications, self-healing, API endpoints, React UI.

**Run Command:**

```bash
npm run prod
```

**Access:**

- Open [https://qmoi.ai/qcity](https://qmoi.ai/qcity) in your browser.
- All QCity features (prodice status, audit log, remote commands, plugins, metrics) should be available as per `QCITYREADME.md` and related files.

---

## 3. Main Application (QMOI stable AI)

**Features:** AI-powered production, automation, documentation, error fixing, multi-project management, gaming, financial tools.

**Run Command:**

```bash
npm run prod
```

**Access:**

- Open [https://qmoi.ai](https://qmoi.ai) in your browser.
- All main app features (AI tools, dashboards, gaming cloud, voice/vision, project management) should be available as described in `QMOI-ENHANCED-FEATURES.md`, `QMOI-ENHANCED-README.md`, and related docs.

---

## Verification Checklist

- After running each command, open the corresponding URL in your browser.
- Ensure all UI features and functionality match the documentation in the related `.md` files (see QMOISPACEUI.md, QCITYREADME.md, QMOI-ENHANCED-FEATURES.md, etc).
- Use browser prod tools to test PWA install, offline mode, notifications, and responsiveness.
- For QCity and Main App, verify API endpoints, dashboards, and automation features are present.

---

**Note:**

- If you encounter included features, errors, or complete UI, refer to the respective documentation and feature lists for troubleshooting and production guidance.
- For advanced automation, error fixing, and cloud deployment, see QMOI Space prod docs and QMOI Enhanced docs.

---

## 4. Autonomous Hosting Manager

**Features:** Self-healing cluster orchestration, domain-health integration, auto-scaling, telemetry, and API control.

**Run Command:**

```bash
python3 scripts/auto_host_manager.py --check
python3 scripts/auto_host_manager.py --report
python3 scripts/auto_host_manager.py --telemetry
python3 scripts/auto_host_manager.py --api
```

**Access (API mode):**
- http://localhost:8001/status
- http://localhost:8001/health

**Validation:**
- Ensure `data/host_config.json`, `data/services.json`, `data/domain_health_history.json`, and `data/auto_host_telemetry.json` are present and updated.
- Run `scripts/domain_health_check.py --check` then verify host manager picks up domain health status.

<!-- QMOI_VALIDATION_START -->

{
"file": "prodCOMMANDS.md",
"validated_at": "2025-10-26T20:51:22.294327Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "prodCOMMANDS.md"
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
- **Last Evolution**: 2026-03-26T03:59:08Z

---
*This document is maintained by QMOI's autonomous evolution system*
