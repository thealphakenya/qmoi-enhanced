QMOIDOMAINS.md
QMOI Domains Management & Automation
This file documents how QMOI manages domains for downloads, cloud services, platform automation, and fallback recovery. QMOI dynamically integrates domain providers like Freenom, GoDaddy, Namecheap, Cloudflare, and auto-generates fallback tunnels using Ngrok.

🌐 Current Domain Inventory
Type	Domains
✅ Primary Download Domain	downloads.qmoi.app
🚨 Fallback Domain	fallback.qmoi.app
🌍 Freenom Domains	downloads-qmoi.tk, downloads-qmoi.ml, downloads-qmoi.ga, downloads-qmoi.cf, downloads-qmoi.gq
⚡ Ngrok Tunnels	Auto-generated, live, and updated in QMOINGROK.md
🔧 Self-Registered Domains	Dynamically created and managed by QMOI
📱 App/Platform-specific Links	Auto-generated for: WhatsApp, Telegram, QCity bots, Android installs, Colab notebooks

🤖 Automation & Management
Capability	Description
🛠 Domain Creation	Uses browser automation (Selenium) and/or APIs (Freenom, Namecheap, etc.)
🔁 Auto-Rotation	If any domain or tunnel fails, QMOI rotates to the next available
🧠 Smart Prioritization	Always uses the most stable, fastest, and lowest-latency link
🖥️ UI Management	QCity dashboard allows authorized users to manage domains/tunnels
📋 Activity Logging	All domain changes are timestamped and logged
🧩 Integration	Fully integrates with QMOINGROK.md, QMOIDNS.md, and QMOIAUTODEV.md

🧪 Health Monitoring
QMOI runs periodic checks on all domain/tunnel endpoints:

If DNS is misconfigured → triggers fix or fallback

If HTTP ping fails → retries, logs, then rotates

If rate limits hit → auto-waits, or switches to mirror/tunnel

All health checks are logged with:

json
Copy
Edit
{
  "domain": "downloads-qmoi.ga",
  "status": "degraded",
  "timestamp": "2025-07-23T21:55:01Z",
  "recovery_action": "Switched to ngrok fallback"
}
🧪 Example: Freenom Automation
QMOI can:

Register a .tk or .ml domain (via browser automation or pre-authenticated API)

Set DNS records automatically

Map to a current ngrok or backend IP

Log the new domain and notify QCity dashboard

🔐 Domain Security Notes
Domain ownership credentials are stored securely (via .env, GCP Vault, AWS Secrets Manager, etc.)

Subdomain generation is automated, and cleanup occurs on every rotation

QMOI avoids exposing private/public keys directly in code or UI

🧩 API & UI Management
📡 QCity Domain API:
Endpoint	Description
GET /api/qcity/domains	Returns a list of current working domains and tunnels
POST /api/qcity/domains/add	Adds a new custom domain
DELETE /api/qcity/domains/remove	Removes a domain (admin-only)

🔐 Requires master-level authentication

🧭 QCity Dashboard:
Visual domain health

Add/edit/remove domains

Audit logs

Tunnel status (see QMOINGROK.md)

📦 Domain Source Types
Source	Managed By
🧪 Ngrok	QMOI
🌍 Freenom	QMOI
🏢 Namecheap	Manual + QMOI
🧠 Self-hosted DNS	QMOI
📦 Cloudflare API	QMOI (if token provided)

✅ Summary
Feature	Description
🌐 Domain Automation	Auto-register + map domains to tunnels
🔁 Rotation	Instant switch when domains fail
📊 Dashboard Control	QCity panel for domain visibility
🔐 Secure Storage	All keys/tokens managed securely
🛡️ Resilient Fallbacks	Multi-layered: primary → Freenom → ngrok
📜 Audit Trail	All changes are timestamped + logged

📄 This document is maintained by the QMOI master orchestrator. Refer to QMOINGROK.md for tunnel logic and QMOIDNS.md for DNS settings.

