QMOINGROK.md
QMOI Ngrok Integration & Automation
This document describes how QMOI integrates ngrok to provide secure, always-on, cloud-accessible download and service links. It serves as an alternative or complement to Freenom and traditional domain providers.

✅ Key Features
Ngrok Tunnel Automation: QMOI can automatically start, monitor, and restart ngrok tunnels for all download and service endpoints (e.g., QStore, QCity, app downloads).

Secure Credential Storage: Ngrok auth tokens are securely stored using encrypted, persistent methods (details below).

Auto-Update Download Links: All links in .md files, configs, and UIs are automatically updated with the live ngrok URL.

Autotest & Health Check: If any link fails a health check, QMOI restarts the tunnel and updates all links.

Fallback Logic: If ngrok is down, QMOI falls back to Freenom or custom domain mappings (see QMOIDOMAINS.md and QMOIDNS.md).

Cloud/Colab Support: Ngrok runs in environments like Colab, DagsHub, and any CLI/server with Python.

Audit & Logging: All tunnel lifecycle events and token accesses are logged and visible to the QCity admin panel.

🔐 Secure Credential Storage
NEVER store the ngrok token directly in .py, .ipynb, or .md files.

QMOI supports:

os.environ["NGROK_AUTH_TOKEN"] (Colab/CLI)

Google Colab secrets (via colab_secret)

.env files + python-dotenv

Cloud secret managers (AWS, GCP, Azure)

Only the automation engine and authorized admin accounts can access the token.

All access attempts are logged.

⚠️ Important: Tokens must be treated as secrets. Accidental exposure can allow external access to your tunnels.

📎 Link Format Convention
All links follow this pattern for consistency and auto-parsing:

php-template
Copy
Edit
https://<ngrok_subdomain>.ngrok.io/downloads/<app>/<platform>
Examples:
https://qmoitunnel.ngrok.io/downloads/qbrowser/windows.exe

https://abc123.ngrok.io/qcity/app/latest

Dynamic public links will be auto-injected into:

UI download buttons

API config files (JSON, YAML)

Markdown documentation

💻 Example Ngrok Setup (Colab / Cloud / CLI)
python
Copy
Edit
import os
os.system('pip install --quiet pyngrok')
from pyngrok import ngrok

ngrok.set_auth_token(os.environ["NGROK_AUTH_TOKEN"])  # Securely loaded
tunnel = ngrok.connect(7860)
print("Public URL:", tunnel.public_url)

# QMOI script continues here to update download links using tunnel.public_url
If running in CLI:

bash
Copy
Edit
ngrok config add-authtoken $NGROK_AUTH_TOKEN
ngrok http 7860 --log=stdout > ngrok.log &
🔄 Ngrok Lifecycle Monitoring (Sample)
QMOI continuously checks tunnel health and auto-recovers if issues arise:

python
Copy
Edit
from pyngrok import ngrok
import os, time, requests

def start_tunnel():
    ngrok.set_auth_token(os.getenv("NGROK_AUTH_TOKEN"))
    return ngrok.connect(7860)

def health_check(url):
    try:
        r = requests.get(url + "/health", timeout=5)
        return r.status_code == 200
    except:
        return False

tunnel = start_tunnel()

while True:
    if not health_check(tunnel.public_url):
        ngrok.disconnect(tunnel.public_url)
        tunnel = start_tunnel()
        update_all_links(tunnel.public_url)  # Update .md, UI, config, etc.
    time.sleep(60)  # Check every minute
🔁 Download Link Management
QMOI updates all download links in:

Markdown files

JSON config files

Web UI buttons

If ngrok becomes unhealthy:

Tunnel is restarted

All links are auto-updated

UIs refresh in real time (if live-bound)

🧪 Health Check & Autotest Logic
QMOI performs regular ping checks to every ngrok-served endpoint.

If a URL becomes unreachable:

The tunnel is force-restarted

All linked files and configs are rewritten

Failures are logged, and alerts sent to the admin/master account

📜 Audit & Logging
Every start, stop, reconnect, token usage, and link update is logged with:

Timestamp

Initiator (auto/manual)

Status/result

Admins can view all logs in the QCity dashboard

🔗 Cross-Module Integrations
Refer to the following documents for domain and DNS management:

QMOIDOMAINS.md — Freenom & custom domain fallback logic

QMOIDNS.md — DNS sync, caching, and refresh

QMOIAUTODEV.md — Developer automation features

📦 Additional Notes
CLI Mode Tip: For headless operation, run ngrok as a subprocess using subprocess.Popen or shell background mode.

Persistent Tunnels: If persistent subdomains are used, ensure ngrok Pro or Teams plan is configured correctly and authorized in the token.

✅ Summary
QMOI’s ngrok system enables:

Feature	Description
🔄 Auto tunnel lifecycle	Start, restart, reconnect dynamically
🧪 Health monitoring	Periodic testing of all endpoints
🔗 Link injection	Live update to .md, UI, JSON, config files
🔐 Token security	Uses environment-secure methods only
☁️ Cloud support	Works in Colab, DagsHub, CLI, or headless
🪵 Audit trails	All actions logged and visible to admin
🛡 Fallback handling	Uses Freenom/alt-domains if ngrok is down

