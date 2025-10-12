# QMOIBROWSER.md

## QMOI Browser: Automated Testing & Error-Fixing Engine

QMOI Browser is a fully automated, AI-powered browser used by QMOI to autotest, validate, and fix all links, downloads, and web-based features across all platforms and devices. It is deeply integrated into all QMOI automation, deployment, and monitoring systems.

### Features
- **Automated Link Testing:** QMOI Browser continuously tests all download links, websites, and APIs for availability, correctness, and performance.
- **Error Detection & Auto-Fix:** Any broken or slow link is automatically fixed, re-uploaded, or replaced. QMOI logs and notifies all issues and fixes.
- **Parallel Testing:** All links and web features are tested in parallel for maximum speed and coverage.
- **Integration:** QMOI Browser is used in all automation cycles (AutoDev, AutoEvolve, Clone, WatchDebug, etc.) to ensure all web features are always working.
- **Cloud/Colab/Dagshub Offloading:** All browser-based testing is offloaded to QCity/cloud for speed and reliability.
- **Master-Only Controls:** Master can view browser test logs, trigger manual tests, and review fixes in QCity dashboard.
- **Audit Logging:** All browser actions are logged for compliance and transparency.

### DNS & Link Auto-Resolution Enhancements
- **DNS Auto-Check & Fix:** QMOI Browser now automatically checks DNS for all download links (e.g., downloads.qmoi.app). If DNS is misconfigured or fails, QMOI triggers an auto-fix routine to set up or repair DNS records, notifies master/admin, and logs all actions.
- **Zero-Rated & Fallback Links:** If DNS cannot be fixed immediately, QMOI Browser auto-switches to zero-rated or fallback CDN links (see ZERORATEDQMOI.md) to ensure downloads always work, even in restricted or offline environments.
- **Freenom Fallback:** If DNS cannot be fixed, QMOI Browser auto-registers a free fallback domain via Freenom, updates all download links, and ensures downloads remain available. All actions are logged and master/admin is notified.
- **Master/Admin Controls:** Master can view DNS/link health, trigger manual DNS checks, and review logs in the QCity dashboard.
- **Full Automation:** All DNS and link health checks, fixes, and fallback logic are fully automated and require no manual intervention.

### Usage
- QMOI Browser runs automatically in every automation cycle.
- Master can trigger manual browser tests from QCity UI (master-only panel).
- All issues are auto-fixed and logged, with notifications sent to master/admin.

### API & UI
- `/api/qcity/browser-test` endpoint for triggering and monitoring browser tests (master-only, API key required).
- QCity dashboard panel for viewing browser test results, logs, and fixes.

### Integration Points
- QMOIAUTODEV.md: Browser is used in every automation/fix cycle.
- QMOIAUTOEVOLVE.md: Auto-evolution uses browser to validate new features.
- QMOICLONE.md: All cloned sites/devices are autotested with browser.
- WATCHDEBUG.md: Browser logs and fixes are visible in WatchDebug panel.

---
*This file is managed by QMOI and documents all browser automation and autotesting logic.* 