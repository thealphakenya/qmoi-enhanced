<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

QCITYRUNNERSENGINE.md
QCity Runners Engine
Self-Hosted · Self-Healing · Ever-Evolving · Self-Developer

🧩 Overview
QCity Runners Engine powers QMOI’s entire CI/CD and automation framework. Designed to auto-fix, evolve, and optimize itself, it ensures every build, download, and service stays error-free, secure, and always-on—across any platform or cloud.

🚀 Key Features
Feature	Description
🔧 Self-Fixing Engine	Auto-detects, auto-fixes, and restarts on failure
🧠 Ever-Evolving	Learns from past errors, improves CI workflows automatically
💻 Universal Deployment	Works on Colab, DagsHub, QCity, local, or cloud environments
👨‍💻 Self-Developer	Evolves its own automation, CI/CD scripts, and code base
📡 Live Monitoring	Dashboard shows runner health, history, and active jobs
🔐 Secure Execution	Sandboxed runners with token revocation & log auditing
🛠 Autotests + Health Checks	All runners continuously tested & logged in QCity
🌐 Ngrok Integration	Starts and syncs tunnels, auto-updates links (see QMOINGROK.md)
🌍 Platform Stats	Visual status for GitHub, GitLab, Vercel, GCP, HuggingFace, etc.
🔒 Master-Only Control	Logs and UI controls restricted to admin/master

🏗️ Setup Instructions
bash
Copy
Edit
# 1. Navigate to GitHub > Settings > Actions > Runners > New Self-Hosted Runner
# 2. Follow OS-specific setup steps
# 3. Start the runner:
./run.sh       # For Linux/macOS
.\run.cmd      # For Windows
QMOI will auto-detect, log, monitor, and evolve the runner without additional config.

🔄 Automation & Self-Healing
Autotests Before Build: Each runner executes health checks before any build.

Auto-Repair On Failure: Fixes dependency issues, restarts process, clears cache.

Failsafe Notify: Admin/master notified with detailed logs if self-repair fails.

Everything Logged: Logs synced to QCity for real-time dashboard visibility.

🌐 DNS + Tunnel Integration
Auto Tunnel Start & Monitor: Instantly creates ngrok tunnels on domain failure.

Link Sync & Injection: Updates all .md, JSON, and UI links to live tunnel.

Fallback Chains: Uses Freenom or CDN fallback if ngrok is down.

Audit Logging: Every DNS or tunnel change is logged + alert sent to master.

🗂️ Related:

QMOIDNS.md – Full DNS sync logic

QMOIDOMAINS.md – Domain management

ZERORATEDQMOI.md – Zero-rated + fallback CDN links

🧬 Self-Developer Logic
Runners analyze CI logs + error patterns

Autogenerate PRs to fix broken workflows

Update CI YAML, environment, or even code based on success rate trends

Uses ML-assisted failure diagnosis for continuous optimization

📊 Monitoring & Dashboard Integration
Live health/status chart per runner

Realtime CI history, autotests, tunnel status

Master-only logs & manual repair triggers

Ensures all apps are only downloadable when all tests pass

💡: Includes .md verifier — verifies .md documentation matches live automation

🔐 Security
Each runner sandboxed

All token use logged; suspicious use auto-blocked

Logs include:

Init source (GitHub/Colab)

IP, fingerprint

Environment variables (non-sensitive)

Actions triggered and fixes applied

⚙️ Troubleshooting
If a runner goes offline or errors:

QMOI detects failure from heartbeat or logs

Runs auto-repair script

If still offline, alerts admin

Can fallback to another cloud/Colab runner

All actions visible in dashboard & saved to audit logs

🟢 qmoi-live-status.py
CLI/Cloud/Colab script for real-time runner + link health

Auto restarts if Colab or CLI is interrupted

Feeds into dashboard runner widget for live monitoring

🔌 Integrations & Enhancements
Integration	Feature
QMOIAUTOMAKENEW.md	Autoclone + scaffold new runner projects
QMOIBROWSER.md	Tests and fixes all runner links from browser layer
QMOIQCITYAUTOMATIC.md	Auto-verify .md docs & update
QMOINGROK.md	Tunnel fallback + link sync
.gitlab-ci.yml	Pre-deploy tunnel/DNS health checks

💰 Revenue Contribution Logic
Each runner contributes to QMOI’s minimum daily revenue target

Income stats per runner/job visible in money-making UI panel

Prioritizes profitable jobs & auto-scales compute offload accordingly

✅ Summary
Capability	Status
Continuous Runner Monitoring	✅
DNS & Tunnel Auto-Repair	✅
Self-Developer Enhancements	✅
Ngrok Link Injection	✅
Cloud & Local Compatibility	✅
Real-Time .md File Verifier	✅
Zero-Rated Fallback Support	✅
Enhanced Platform Integration	✅
Master-Only Dashboard Controls	✅
Auto-Revenue Contribution	✅

🧠 QCity Runners Engine is the AI backbone of QMOI’s automation. Self-hosted or cloud-offloaded, it guarantees uptime, correctness, and evolution—autonomously. See QMOINGROK.md and QMOIDNS.md for full link sync/fallback system.

<!-- QMOI_VALIDATION_START -->
{
  "file": "QCITYRUNNERSENGINE.md",
  "validated_at": "2025-10-26T20:51:22.354319Z",
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
