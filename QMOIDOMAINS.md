# QMOIDOMAINS.md

## QMOI Domains Management & Automation

This file lists and documents all domains QMOI uses for downloads, services, automation, and fallback. QMOI can automatically create, register, and manage domains from any provider (Freenom, Namecheap, GoDaddy, Cloudflare, self-hosted, etc.), and rotate or update domains as needed for reliability and privacy.

### Current Domains
- **Primary Download Domain:** downloads.qmoi.app
- **Fallback Domain:** fallback.qmoi.app
- **Freenom Domains:** downloads-qmoi.tk, downloads-qmoi.ml, downloads-qmoi.ga, downloads-qmoi.cf, downloads-qmoi.gq
- **Custom/Self-Registered Domains:** (auto-added by QMOI as needed)
- **Other Platforms:** (auto-added by QMOI for WhatsApp, Telegram, etc.)

### Automation & Management
- QMOI can auto-create and register domains from any provider using browser automation or API.
- Domains are rotated and updated automatically if any issue is detected.
- All download links and features are auto-updated to use the best working domain.
- Master-only UI in QCity allows viewing, adding, removing, and auditing all domains.
- All actions are logged and auditable.

### API & UI
- `/api/qcity/domains` for listing and managing domains (master-only).
- QCity dashboard panel for domains management (master-only).

---
*This file is managed by QMOI and documents all domain automation and management logic.* 