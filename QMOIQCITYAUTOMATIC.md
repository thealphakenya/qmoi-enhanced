# QMOI QCity Automatic System

## 🚀 Overview

The QMOI QCity Automatic System is a comprehensive automation platform that provides continuous monitoring, automatic GitLab CI/CD triggering, real-time visualization, and self-healing capabilities. The system runs continuously and automatically manages all aspects of the QMOI QCity platform.

## 🎯 Key Features

### 🔄 Continuous Automation
- **Always Running:** The system runs continuously in the background
- **Auto-Triggering:** Automatically triggers GitLab CI/CD when files change
- **Scheduled Tasks:** Runs automation at regular intervals
- **File Monitoring:** Watches for file changes and triggers automation
- **Automated Health Checks & Autotests:** All health checks and autotests run continuously, are logged to QCity, and are visible in real time on the dashboard (master-only access to logs and controls).
- **Self-Healing & Error-Free Downloads:** App downloads are only enabled if all health checks and autotests pass. Apps are always up to date, error-free, and auto-updating after install.

### 📊 Real-Time Monitoring
- **Live Dashboard:** Real-time visualization at http://localhost:3010
- **WebSocket Updates:** Live updates via WebSocket connections
- **Performance Charts:** Visual charts showing automation performance
- **Status Indicators:** Real-time status of all platforms
- **Master-Only Controls:** Advanced dashboard features, logs, and controls are only visible to master/admin users.

### 🔧 GitLab CI/CD Integration
- **Automatic Triggers:** Triggers GitLab CI/CD automatically
- **Pipeline Monitoring:** Monitors GitLab pipeline status
- **Deployment Tracking:** Tracks successful and failed deployments
- **Error Recovery:** Automatic error recovery and retry mechanisms

### 🌐 Multi-Platform Support
- **GitLab, GitHub, Vercel, Gitpod, Netlify, HuggingFace, Quantum, Village, Azure, AWS, GCP, DigitalOcean:** All platform stats are shown in the dashboard with icons and names.
- **Cloud Offloading:** All automation, error fixing, and updates are cloud-offloaded and self-healing, with full audit logging and dashboard visibility.

### 🧬 Self-Healing & Evolution
- **Auto-Evolution:** Continuous improvement suggestions
- **Error Recovery:** Automatic error fixing
- **Health Monitoring:** Comprehensive health checks
- **Performance Optimization:** Continuous performance monitoring

## 📦 App Download & QI Integration
- **Device-Aware Download:** QI download is device-aware, feature-selectable, and always provides the correct, up-to-date installer.
- **Download is only possible if all health checks and autotests pass.**
- **Apps are always up to date, error-free, and auto-updating after install.**

### DNS & Download Link Auto-Resolution
- **DNS Auto-Check & Fix:** QMOI QCity Automatic now automatically checks and fixes DNS for all download links (downloads.qmoi.app). If DNS fails, it triggers an auto-fix routine, notifies master/admin, and logs all actions.
- **Zero-Rated & Fallback Links:** If DNS cannot be fixed immediately, QMOI QCity Automatic auto-switches to zero-rated or fallback CDN links (see ZERORATEDQMOI.md) to ensure downloads always work.
- **Freenom Fallback:** If DNS cannot be fixed, QMOI QCity Automatic auto-registers a free fallback domain via Freenom, updates all download links, and ensures downloads remain available. All actions are logged and master/admin is notified.
- **Integrated Pipeline Automation:** All Freenom fallback, DNS automation, and link update logic is integrated into the QCity Automatic pipeline (.gitlab-ci.yml), so every automation cycle includes DNS health checks, fallback domain creation, and link updates as needed. All actions are logged and visible in the QCity dashboard.
- **Dashboard Integration:** Master can view DNS/link health and trigger manual checks from the dashboard.
- **Full Automation:** All DNS and link health checks, fixes, and fallback logic are fully automated and require no manual intervention.

## 🛠️ Configuration & Logging
- All health checks, autotests, and error fixing are logged to QCity and visible in the dashboard (master-only).
- All .md docs are always up to date and reflect the latest automation and monitoring enhancements.

## 🏃 QCity Runners Engine
- See `QCITYRUNNERSENGINE.md` for full details on self-hosted, self-healing, ever-evolving runners.

## 🤖 Self-Healing & Auto-Fix Enhancements (2025+)

- **Unicode-Safe Logging:** All logs are now UTF-8 safe and auto-sanitize messages to prevent Unicode errors, even on Windows.
- **Subprocess Command Checks:** Before running any automation or fix command, QMOI checks if the command exists and auto-installs or repairs as needed.
- **Config Auto-Repair:** If any required config key (like 'platforms') is missing, QMOI auto-initializes it and repairs the config file on the fly.
- **General Auto-Fix Routine:** QMOI scans for missing files, keys, or dependencies and auto-creates, installs, or initializes them as needed, logging all actions.
- **Robust Subprocess Error Handling:** All automation and fix routines now check for failed or None subprocesses before accessing results, preventing 'NoneType' errors and providing clear diagnostics for failed commands.
- **Next.js & Dependency Auto-Upgrade:** QMOI automatically checks for outdated Next.js and upgrades to the latest version, ensuring the platform is always up to date.
- **All enhancements are fully automated and require no manual intervention.**

## 🟢 Live Status & Real-Time Monitoring

- Use `python scripts/qmoi-live-status.py` to view live logs and automation reports.
- This script is always running in Colab, DagsHub, or cloud, auto-restarting if cancelled or device is offline.
- Provides real-time summary and final report on exit.

## 🖥️ Advanced Dashboard & Notification Integration (2025+)

- The QMOI dashboard now includes:
  - Log search/filter and error/event highlighting
  - Real-time charts for errors, events, and health
  - Documentation update history visualization
  - Integrated Gmail and multi-channel notification status, delivery logs, and test notification controls
- All .md docs are always updated to reflect dashboard and notification enhancements.

## New Integrations & Enhancements

- **QMOIAUTOMAKENEW.md Integration:** QMOI QCity Automatic can now autoclone/automake-new devices, platforms, and features from QCity, with master-only controls and audit logging.
- **QMOIBROWSER.md Integration:** QMOI QCity Automatic uses the QMOI Browser to autotest and fix all QCity automation-related links and features, ensuring all enhancements are always working and up to date.
- **Always-On Cloud Operation:** QMOI QCity Automatic is always running in QCity/cloud/Colab/Dagshub, never relying on local device for critical tasks.
- **Enhanced QCity Runners & Devices:** All QCity automation runners, devices, clones, and browsers are fully automated, parallelized, and offloaded to QCity/cloud for maximum reliability and speed.
- **Auto-Updating Documentation:** All .md files are auto-updated after every QCity automation update, ensuring documentation is always current.
- **Increased Minimum Daily Revenue:** QMOI QCity Automatic now contributes to a higher, dynamically increasing minimum daily revenue, with advanced statistics and UI for all money-making features.
- **Multi-Provider Domain Automation:** QMOI QCity Automatic can create, register, and use domains from any provider (Freenom, Namecheap, GoDaddy, Cloudflare, AWS, self-hosted, etc.), and can switch between them automatically for downloads and services. See QMOIDOMAINS.md and QMOIDNS.md for details.

---
## 🛠️ Troubleshooting: No Billing Account, Quota, or Hosted Runner Issues

**QMOI's self-hosted runners and independent automation system fully bypass all billing, quota, and hosted runner restrictions.**

- No external CI/CD billing or quota issues will ever block your automation, builds, or deployments.
- All actions are performed on your own infrastructure, with no dependency on external platform billing or quotas.
- For full details, see: QCITYRUNNERSENGINE.md, INDEPENDENTQMOI.md, QMOICLONE.md.
---
**QMOI QCity Automatic System: Always-on, secure, and fully automated for the future of cross-platform orchestration.** 