# QMOI - Quantum Master Orchestrator Intelligence

## 🚀 Overview
QMOI is a fully automated, always-on, cross-platform automation engine. It runs in the cloud (Colab, Dagshub, etc.) for 24/7 operation, even when your device is offline. QMOI features real-time Gmail notifications, parallel error fixing, instant deployment/download for all devices, and universal app delivery.

## ✨ Key Features
- **Always-On Cloud Automation:** Runs in Colab/Dagshub for 24/7 operation
- **Automated Gmail & Multi-Channel Notifications:** Real-time alerts for all events (fixes, deployments, health checks, downloads) via Gmail, WhatsApp, Slack, Telegram, Discord
- **Parallel Engine:** Fast, lightweight, and resource-efficient automation across all platforms
- **Universal App Builder:** Automated builds for Windows, Mac, Linux, Android, iOS, QCity/Web, and more
- **Device-Aware Download:** QI/first page detects device and offers the correct installer
- **User-Triggered & Scheduled Builds:** Trigger builds via API, dashboard, or on a schedule
- **CI/CD Integration:** Automated builds and artifact uploads on code push
- **Real-Time Info Script:** Instantly view errors fixed, code/file changes, health checks, and more
- **App Download Link:** Receive a working download link for the full QMOI app via Gmail and all channels as soon as everything is fixed
- **Automated Health Checks & Autotests:** All health checks and autotests run continuously, are logged to QCity, and are visible in real time on the dashboard (master-only access to logs and controls).
- **Self-Healing & Error-Free Downloads:** App downloads are only enabled if all health checks and autotests pass. Apps are always up to date, error-free, and auto-updating after install.
- **Advanced QI Download:** Device-aware, feature-selectable, and always provides the correct, up-to-date installer.
- **Expanded Platform Stats:** Dashboard now shows status for GitLab, GitHub, Vercel, Gitpod, Netlify, HuggingFace, Quantum, Village, Azure, AWS, GCP, DigitalOcean, and more, each with icons and names.
- **Master-Only Controls:** Advanced dashboard features, logs, and controls are only visible to master/admin users.

## 📦 App Delivery & Qmoi_apps Structure
- All apps are built and organized in `Qmoi_apps/<device>/` (e.g., windows, mac, linux, android, ios, qcity, ...)
- Each device subdirectory contains the latest installer for QMOI and QCity
- Download links are always up to date and device-aware
- **Download is only enabled if all health checks and autotests pass.**

## 🚀 Quickstart (Cloud/Colab/Dagshub)
1. Clone the repo to Colab or Dagshub
2. Set environment variables: `GMAIL_USER`, `GMAIL_PASS`, `GMAIL_RECIPIENT`, and any notification/channel credentials
3. Run: `python scripts/qmoi-qcity-automatic.py`
4. Check your email and other channels for notifications and download links

## 📚 Documentation
- See `QIAUTOGMAIL.md` for notification setup
- See `COLAB_DAGSHUB_DEPLOY_CHECKLIST.md` for cloud deployment
- See `QMOIALWAYSPARALLEL.md` for parallel engine details
- See `QI_download_component.html` for device-aware download integration
- See `.github/workflows/qmoi-app-build.yml` for CI/CD workflow
- See `scripts/qmoi-build-api.py` for user-triggered build API
- **All .md docs are always up to date and reflect the latest automation and monitoring enhancements.**

## 🛠️ Real-Time Info
- Run `python scripts/qmoi-info.py` to see all QMOI stats and health in real time
- **Dashboard shows live health checks, autotest results, and platform status. Master-only controls for logs and advanced features.**

## 📦 Download
- Use the QI/first page download button for the correct installer for your device
- **Download is only possible if all health checks and autotests pass.**
- After all fixes, you’ll receive a Gmail and multi-channel notification with a download link for the full app (all devices)

## 🔄 Build Automation
- Builds are triggered automatically on code push (see CI/CD), by user request (API), or on a schedule
- All build/test/install actions are logged and self-healing
- **All automation, error fixing, and updates are cloud-offloaded and self-healing, with full audit logging and dashboard visibility.**

## 🏃 QCity Runners Engine (Self-Hosted, Self-Healing, Ever-Evolving)
QMOI now features the QCity Runners Engine:
- **Self-Error-Fixing:** Runners auto-detect, auto-fix, and auto-restart on failure
- **Ever-Evolving:** Runners auto-update, optimize, and learn from build/test failures
- **Self-Developer:** Runners can auto-improve CI scripts, workflows, and even code
- **Universal Deployment:** Deploy runners on any OS, cloud (Colab, DagsHub, QCity), or local device
- **Live Monitoring:** Dashboard shows runner health, build history, and error trends
- **Full Automation:** All builds are self-fixing, self-documenting, and always up to date
- **All health checks, autotests, and error fixing are logged to QCity and visible in the dashboard (master-only).**

See `QCITYRUNNERSENGINE.md` for full details.

## 🖥️ Real-Time Dashboard & Cloud Deployment

- Run the QMOI dashboard for real-time logs, reports, and health:
  ```bash
  python scripts/qmoi-dashboard.py
  # Access at http://localhost:5055
  ```
- Use the cloud deploy script to keep all automation, live status, and dashboard running in Colab, DagsHub, or any cloud:
  ```bash
  bash scripts/qmoi-cloud-deploy.sh
  # All services are always-on, auto-restarting, and cloud-offloaded
  ```
- See also: DEPLOYMENT-README.md for advanced deployment and monitoring.

---
**QMOI: Always-on, secure, and fully automated for the future of cross-platform orchestration.**

[ENHANCEMENT] All QCity and QMOI activities (automation, error fixing, AI/ML, dashboard, etc.) are now offloaded to Colab, Dagshub, and cloud environments. Local device resources are never used for heavy or critical tasks; only UI and user interactions run locally. QMOI exclusively uses its own cloned GitLab and Gitpod platforms, which are more advanced and optimized than the actual ones. Actual GitLab/Gitpod are never used for automation, CI/CD, or development. See also: QMOIAVATAR.md, QMOIAICORE.md, QMOIAUTOEVOLVE.md, CMDCOMMANDS.md, .gitlab-ci.yml, and all .md docs for cross-platform and cloud-offloading details.

## Cloud Offloading & Cloned Platform Usage (2025 Enhancement)

- All QCity and QMOI activities (automation, error fixing, AI/ML, dashboard, etc.) are now offloaded to Colab, Dagshub, and cloud environments. Local device resources are never used for heavy or critical tasks; only UI and user interactions run locally.
- QMOI exclusively uses its own cloned GitLab and Gitpod platforms, which are more advanced and optimized than the actual ones. Actual GitLab/Gitpod are never used for automation, CI/CD, or development.
- All jobs, runners, and pipelines are managed by QMOI's cloud/Colab/Dagshub infrastructure for maximum scalability, reliability, and speed.
- See also: QMOIAVATAR.md, QMOIAICORE.md, QMOIAUTOEVOLVE.md, CMDCOMMANDS.md, .gitlab-ci.yml, and all .md docs for cross-platform and cloud-offloading details.