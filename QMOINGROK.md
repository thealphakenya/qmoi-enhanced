# QMOINGROK.md

## QMOI Ngrok Integration & Automation

This document describes how QMOI integrates ngrok for secure, always-on, cloud-accessible download and service links, as an alternative or complement to Freenom and traditional domain providers.

### Key Features
- **Ngrok Tunnel Automation:** QMOI can automatically start, monitor, and restart ngrok tunnels for all download and service endpoints (e.g., Qstore, QCity, app downloads).
- **Secure Credential Storage:** The ngrok auth token is stored securely using encrypted, persistent storage (see below for best practices).
- **Auto-Update Download Links:** All download links in .md files and UIs are auto-updated to use the current ngrok URL if ngrok is active and healthy.
- **Autotest & Health Check:** QMOI autotests all ngrok links for availability and correctness. If a link fails, QMOI auto-restarts the tunnel and updates all links.
- **Fallback Logic:** If ngrok is unavailable, QMOI falls back to Freenom or other domain providers as documented in QMOIDOMAINS.md and QMOIDNS.md.
- **Cloud/Colab Integration:** QMOI can run ngrok in Colab, DagsHub, or any cloud environment, ensuring public access to all services and downloads.
- **Audit & Logging:** All ngrok actions (start, stop, update, error) are logged and visible to master/admin in QCity.

### Secure Credential Storage
- The ngrok auth token is never stored in plaintext in code or .md files.
- QMOI uses encrypted environment variables, secret managers (e.g., Colab secrets, cloud secret stores), or OS keyring for storing the token.
- Only the automation engine and master/admin have access to the token.
- All access to the token is logged and auditable.

### Example Ngrok Setup (Colab)
```python
import os
os.system('pip install --quiet pyngrok')
from pyngrok import ngrok
ngrok.set_auth_token(os.environ["NGROK_AUTH_TOKEN"])
tunnel = ngrok.connect(7860)
print("Public URL:", tunnel.public_url)
```
- The NGROK_AUTH_TOKEN is set as an environment variable or loaded from a secure secret store.
- QMOI automation scripts manage tunnel lifecycle and update all download links in real time.

### Download Link Management
- All download and service links are auto-updated to use the current ngrok URL if ngrok is active and healthy.
- If ngrok is not available, QMOI falls back to Freenom or other domains.
- All .md files and UIs are auto-updated after every tunnel or domain change.

### Health Check & Autotest
- QMOI autotests all ngrok links for reachability and correctness.
- If a link fails, QMOI auto-restarts the tunnel and updates all links.
- Master/admin is notified of any persistent issues.

### Audit & Logging
- All ngrok actions are logged and visible in the QCity dashboard.
- All credential access is logged for compliance.

---
*QMOI Ngrok integration ensures always-on, secure, and public access to all downloads and services, with full automation, fallback, and auditability.* 