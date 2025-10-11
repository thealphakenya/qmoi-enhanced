QMOINGROK.md
QMOI Ngrok Integration & Automation
This document describes how QMOI integrates ngrok to provide secure, always-on, cloud-accessible download and service links. It serves as an alternative or complement to Freenom and traditional domain providers.

✅ Key Features
Feature	Description
🔁 Ngrok Tunnel Automation	Automatically start, monitor, and restart ngrok tunnels for all QMOI endpoints (e.g., QStore, QCity, app downloads).
🔐 Secure Credential Storage	Ngrok auth tokens are stored securely using encrypted, persistent methods.
🌐 Auto-Update Download Links	All links in .md files, configs, and UIs are automatically updated with the live ngrok URL.
🧪 Autotest & Health Check	If any link fails a health check, QMOI restarts the tunnel and updates all links.
🛡 Fallback Logic	Falls back to Freenom or custom domain mappings (see QMOIDOMAINS.md, QMOIDNS.md).
☁️ Cloud/Colab Support	Works in Google Colab, DagsHub, and any CLI/server with Python.
🪵 Audit & Logging	Tunnel lifecycle events and token accesses are logged and visible in the QCity admin panel.

🔐 Secure Credential Storage
NEVER hardcode ngrok tokens in .py, .ipynb, or .md files.

QMOI supports secure methods like:

os.environ["NGROK_AUTH_TOKEN"] (CLI / Colab)

Google Colab secrets (colab_secret)

.env files + python-dotenv

Cloud Secret Managers (AWS Secrets Manager, GCP Secret Manager, Azure Vault)

✅ Only the automation engine and authorized admin accounts can access the token
🪵 All access attempts are logged.

⚠️ Important: Treat tokens as secrets — exposure can allow external access to your tunnels.

📎 Link Format Convention
All ngrok links follow this format:

php-template
Copy
Edit
https://<ngrok-subdomain>.ngrok.io/downloads/<app>/<platform>
Examples
https://qmoitunnel.ngrok.io/downloads/qbrowser/windows.exe

https://abc123.ngrok.io/qcity/app/latest

These links are dynamically injected into:

UI download buttons

API config files (.json, .yaml)

Markdown documentation

💻 Example Ngrok Setup (Colab / Cloud / CLI)
python
Copy
Edit
import os
os.system('pip install --quiet pyngrok')
from pyngrok import ngrok

ngrok.set_auth_token(os.environ["NGROK_AUTH_TOKEN"])
tunnel = ngrok.connect(7860)
print("Public URL:", tunnel.public_url)

# QMOI script continues to update download links with tunnel.public_url
CLI Equivalent
bash
Copy
Edit
ngrok config add-authtoken $NGROK_AUTH_TOKEN
ngrok http 7860 --log=stdout > ngrok.log &
🔄 Ngrok Lifecycle Monitoring ([PRODUCTION IMPLEMENTATION REQUIRED])
QMOI continuously checks tunnel health and auto-recovers:

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
        return requests.get(url + "/health", timeout=5).status_code == 200
    except:
        return False

tunnel = start_tunnel()

while True:
    if not health_check(tunnel.public_url):
        ngrok.disconnect(tunnel.public_url)
        tunnel = start_tunnel()
        update_all_links(tunnel.public_url)  # Update .md, UI, JSON, etc.
    time.sleep(60)
🔁 Download Link Management
QMOI updates all dynamic links in:

Markdown files (README.md, etc.)

JSON config files (e.g. apps.json)

Web UIs / Dashboards

If ngrok becomes unhealthy:

Tunnel is restarted

All links are rewritten

UIs refresh in real time (if live-bound)

🧪 Health Check & Autotest Logic
QMOI performs regular pings to ngrok endpoints:

If any link fails:

The tunnel is force-restarted

All linked files/configs are regenerated

Admins are notified via QCity dashboard

📜 Audit & Logging
QMOI logs:

Tunnel start/stop/reconnect events

Token usage

Health check failures

Admin actions

🔍 Admins can view this from the QCity Dashboard or automation logs.

🔗 Cross-Module Integrations
Refer to:

QMOIDOMAINS.md — Freenom & custom fallback domains

QMOIDNS.md — DNS sync, caching, refresh logic

QMOIAUTODEV.md — Developer automation capabilities

📦 Additional Notes
CLI Mode Tip
Run ngrok as a subprocess for headless/server mode:

python
Copy
Edit
import subprocess
subprocess.Popen(["ngrok", "http", "7860"])
Persistent Tunnels
Use ngrok Pro/Teams for subdomain persistence:

Ensure auth_token is upgraded

Bind tunnels to subdomains (qmoitunnel.ngrok.io)

✅ Summary
Feature	Description
🔄 Auto tunnel lifecycle	Start, restart, reconnect
🧪 Health monitoring	Ping + failover recovery
🔗 Live link injection	Update .md, UI, config
🔐 Token security	Uses secure methods only
☁️ Cloud support	Colab, DagsHub, CLI
🪵 Full audit trail	Logs everything
🛡 Domain fallback	Freenom + custom DNS