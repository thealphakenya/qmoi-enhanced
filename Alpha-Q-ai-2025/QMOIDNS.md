QMOIDNS.md
QMOI DNS & Tunnel Management Automation System
The QMOI DNS system manages and automates the full lifecycle of DNS and ngrok tunnel configurations to ensure high availability, instant failover, and secure delivery of all QMOI downloads and services.

🌐 Core Features
Feature	Description
🔁 Automated DNS & Tunnel Checks	QMOI continuously monitors all critical DNS records and ngrok tunnel endpoints.
🛠 Auto-Setup & Repair	Automatically sets or repairs A, CNAME, TXT, and other records when missing/misconfigured.
🚨 Auto-Fix Routine	On failure, QMOI triggers a self-healing routine and logs all diagnostics.
🌍 Fallback Switching	Seamless failover to zero-rated CDN or ngrok (see ZERORATEDQMOI.md & QMOINGROK.md) when primary DNS fails.
📊 Dashboard Integration	Master/admins can view real-time DNS/tunnel health, trigger manual repairs, and view logs via the QCity dashboard.
🤖 Fully Automated	No manual steps required — all checks, repairs, updates, and fallbacks are hands-free.
🪵 Audit Logging	Every DNS/tunnel event (check, fix, failover) is logged for traceability.

🔌 API & UI Integration
Endpoint	Purpose
GET /api/qcity/dns-health	Returns DNS status for all configured domains
GET /api/qcity/ngrok-health	Returns ngrok tunnel status
POST /api/qcity/dns-fix	Manually triggers DNS reconfiguration (master-only)
POST /api/qcity/ngrok-fix	Manually restarts ngrok tunnels (master-only)

✅ All endpoints require API key authentication.

📍 QCity Panel includes a visual dashboard for:

Real-time health metrics

Manual override buttons

Activity & diagnostic logs

🔄 GitLab/CI Integration
DNS/tunnel checks and auto-fixes are run before deployments or builds in .gitlab-ci.yml or CI runners:

yaml
Copy
Edit
before_script:
  - python scripts/check_dns_and_ngrok.py
If a failure is detected:

Tunnel is restarted

DNS is re-provisioned

Links are updated before continuing

⚡ Ngrok Tunnel Automation
Feature	Description
🟢 Auto-Start	QMOI starts tunnels as needed for any service
🔁 Auto-Rotation	If a tunnel fails, a new one is spun up and all links are updated
🔄 Download Link Injection	UI, API, Markdown, and config files get updated dynamically
🧪 Health Monitoring	Tunnel health is checked every minute
📢 Notification	Admins are notified of changes/failovers
🪵 Logging	All tunnel lifecycle events are fully logged

🔁 Tunnel Failover Flow
text
Copy
Edit
1. Detect tunnel or domain failure
2. Restart ngrok tunnel or fix DNS via API
3. Update all affected links (UI, .md, JSON)
4. Notify admins via QCity dashboard
5. Monitor tunnel every 60 seconds
🔗 Integration Points
This DNS and tunnel automation system integrates with:

QMOIBROWSER.md

QCITYRUNNERSENGINE.md

QMOIQCITYAUTOMATIC.md

QMOINGROK.md

ZERORATEDQMOI.md

🌍 Multi-Provider & Self-Hosted Domain Support
QMOI supports automated DNS across:

Provider	Method
🆓 Freenom	Browser automation
🌐 Cloudflare	API
🏢 Namecheap	API or Selenium
☁️ AWS Route 53	Boto3-based automation
🔐 Self-Hosted BIND	CLI + Python wrapper
🔄 Ngrok	pyngrok integration
🧠 QMOI Internal Domains	Dynamically generated and self-managed

All actions are:

Logged in dns-tunnel-activity.log

Viewable in QCity dashboard

Recoverable (automated backup of records)

✅ Summary
Feature	Description
🌐 DNS Automation	Auto-check, auto-fix for A/CNAME/TXT records
⚙ Tunnel Management	Start/stop/reconnect ngrok tunnels dynamically
🔁 Fallback Switching	Seamless switch to working domain or tunnel
📊 CI Integration	Ensures working DNS before deployment
📋 UI Controls	Admins manage everything from QCity
🪵 Full Audit Logging	Every step logged with timestamp & status
🔐 Multi-Provider Support	Freenom, Cloudflare, AWS, GoDaddy, etc.
☁️ Zero-downtime Updates	Real-time link rewriting and propagation

📄 This file is maintained by QMOI Orchestrator Engine and reflects the current DNS and tunnel management state of all QMOI services. For more info, see QMOIDOMAINS.md and QMOINGROK.md.

