# QMOIDOMAINS.md

## QMOI Domains Management & Automation

This file lists and documents all domains QMOI uses for downloads, services, automation, and fallback. QMOI can automatically create, register, and manage domains from any provider (Freenom, Namecheap, GoDaddy, Cloudflare, ngrok, self-hosted, etc.), and rotate or update domains as needed for reliability and privacy.

### Current Domains
- **Primary Download Domain:** downloads.qmoi.app
- **Fallback Domain:** fallback.qmoi.app
- **Freenom Domains:** downloads-qmoi.tk, downloads-qmoi.ml, downloads-qmoi.ga, downloads-qmoi.cf, downloads-qmoi.gq
- **Ngrok Tunnels:** (auto-generated, always up to date; see QMOINGROK.md)
- **Custom/Self-Registered Domains:** (auto-added by QMOI as needed)
- **Other Platforms:** (auto-added by QMOI for WhatsApp, Telegram, etc.)

### Automation & Management
- QMOI can auto-create and register domains from any provider using browser automation, API, or ngrok tunnel automation (see QMOINGROK.md).
- Domains and ngrok tunnels are rotated and updated automatically if any issue is detected.
- All download links and features are auto-updated to use the best working domain or tunnel.
- Master-only UI in QCity allows viewing, adding, removing, and auditing all domains and tunnels.
- All actions are logged and auditable.

### API & UI
- `/api/qcity/domains` for listing and managing domains and tunnels (master-only).
- QCity dashboard panel for domains and ngrok tunnel management (master-only).

---
*This file is managed by QMOI and documents all domain and ngrok automation and management logic. See QMOINGROK.md for ngrok details.* 