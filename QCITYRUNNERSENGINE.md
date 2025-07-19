# QCITYRUNNERSENGINE.md

## QCity Runners Engine: Self-Hosted, Self-Healing, Ever-Evolving, Self-Developer

### Overview
QCity Runners Engine is QMOI’s universal, self-hosted runner system for CI/CD, automation, and self-development. It powers all QMOI builds, tests, and deployments with advanced automation, error-fixing, and continuous evolution.

### Key Features
- **Self-Error-Fixing:** Auto-detects, auto-fixes, and auto-restarts on failure (health checks, dependency repair, log analysis)
- **Ever-Evolving:** Auto-updates runner software, optimizes performance, and adapts to new environments
- **Self-Developer:** Can auto-improve CI scripts, workflows, and even code based on build/test results
- **Universal Deployment:** Works on any OS, cloud (Colab, DagsHub, QCity), or local device
- **Live Monitoring:** Dashboard integration for runner health, build history, and error trends
- **Audit Logging:** All actions are logged and visualized for compliance
- **Secure & Isolated:** Sandboxed execution, auto-revoked tokens on suspicious activity
- **Automated Health Checks & Autotests:** All health checks and autotests run continuously, are logged to QCity, and are visible in real time on the dashboard (master-only access to logs and controls).
- **Self-Healing & Error-Free Downloads:** App downloads are only enabled if all health checks and autotests pass. Apps are always up to date, error-free, and auto-updating after install.
- **Expanded Platform Stats:** Dashboard now shows status for GitLab, GitHub, Vercel, Gitpod, Netlify, HuggingFace, Quantum, Village, Azure, AWS, GCP, DigitalOcean, and more, each with icons and names.
- **Master-Only Controls:** Advanced dashboard features, logs, and controls are only visible to master/admin users.

### Setup
1. Go to GitHub → Settings → Actions → Runners → New self-hosted runner
2. Follow the instructions for your OS/cloud (Linux, Windows, QCity, Colab, DagsHub)
3. Start the runner: `./run.sh` (Linux) or equivalent
4. QMOI will auto-detect, monitor, and manage the runner

### Automation & Self-Healing
- Runners run health checks before every build
- If a problem is detected, QMOI auto-fixes (restart, dependency install, cache clear, update)
- If auto-fix fails, master/admin is notified with diagnostics
- **All health checks, autotests, and error fixing are logged to QCity and visible in the dashboard (master-only).**

### Self-Developer & Evolution
- Runners analyze build/test failures and evolve error-fixing strategies
- Can auto-update CI scripts, optimize build steps, and document changes
- Uses AI/ML to learn from past errors and improve over time

### Monitoring & Dashboard
- QMOI dashboard shows live runner status, health, and build history
- All actions are logged and visualized for compliance and audit
- **App downloads are only possible if all health checks and autotests pass (apps are always error-free and up to date).**
- **QI download is device-aware, feature-selectable, and always provides the correct, up-to-date installer.**
- **All .md docs are always up to date and reflect the latest automation and monitoring enhancements.**

### Security
- Each runner is sandboxed and isolated
- Tokens auto-revoked on suspicious activity
- Full audit trail for all runner actions

### Troubleshooting
- If a runner goes offline, QMOI auto-restarts and attempts repair
- All errors and fixes are logged and visualized
- Master/admin can trigger manual fixes or updates

## 🟢 Live Status & Runner Monitoring

- The `qmoi-live-status.py` script streams runner logs and automation reports in real time.
- Always running in Colab, DagsHub, or cloud, auto-restarting if cancelled or device is offline.
- Integrates with dashboard for live runner health and build status.

## New Integrations & Enhancements

- **QMOIAUTOMAKENEW.md Integration:** QCity Runners Engine can now autoclone/automake-new runners, devices, and platforms from QCity, with master-only controls and audit logging.
- **QMOIBROWSER.md Integration:** QCity Runners Engine uses the QMOI Browser to autotest and fix all runner-related links and features, ensuring all enhancements are always working and up to date.
- **Always-On Cloud Operation:** QCity Runners Engine is always running in QCity/cloud/Colab/Dagshub, never relying on local device for critical tasks.
- **Enhanced QCity Runners & Devices:** All runners, devices, clones, and browsers are fully automated, parallelized, and offloaded to QCity/cloud for maximum reliability and speed.
- **Auto-Updating Documentation:** All .md files are auto-updated after every runner engine update, ensuring documentation is always current.
- **Increased Minimum Daily Revenue:** QCity Runners Engine now contributes to a higher, dynamically increasing minimum daily revenue, with advanced statistics and UI for all money-making features.

### DNS & Download Link Auto-Resolution
- **DNS Auto-Check & Fix:** QCity Runners Engine now automatically checks and fixes DNS for all download links (downloads.qmoi.app). If DNS fails, it triggers an auto-fix routine, notifies master/admin, and logs all actions.
- **Zero-Rated & Fallback Links:** If DNS cannot be fixed immediately, QCity Runners Engine auto-switches to zero-rated or fallback CDN links (see ZERORATEDQMOI.md) to ensure downloads always work.
- **Dashboard Integration:** Master can view DNS/link health and trigger manual checks from the dashboard.
- **Full Automation:** All DNS and link health checks, fixes, and fallback logic are fully automated and require no manual intervention.

---
*QCity Runners Engine: The backbone of QMOI’s self-developing, ever-evolving automation. All automation, monitoring, and error fixing are always up to date and visible in the dashboard.* 