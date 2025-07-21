# QMOIDNS.md

## QMOI DNS & Tunnel Management & Automation System

QMOI now features a fully automated DNS and tunnel management system for all download and service domains (e.g., downloads.qmoi.app) and ngrok tunnels. This system ensures DNS and tunnels are always correctly set up, monitored, and repaired, guaranteeing maximum uptime and reliability for all QMOI features.

### Core Features
- **Automated DNS & Tunnel Checks:** QMOI continuously checks DNS health for all critical domains and ngrok tunnel health for all endpoints.
- **Auto-Setup & Repair:** If DNS or tunnel is missing or misconfigured, QMOI automatically sets up or repairs DNS records or restarts ngrok tunnels using API integration or automation.
- **DNS & Tunnel Auto-Fix Routine:** On any DNS or tunnel failure, QMOI triggers an auto-fix routine, logs the issue, and notifies master/admin. All actions are auditable.
- **Zero-Rated, Fallback, & Ngrok Links:** If DNS cannot be fixed immediately, QMOI auto-switches to zero-rated, fallback CDN, or ngrok tunnel links (see ZERORATEDQMOI.md and QMOINGROK.md) to ensure downloads and services remain available.
- **Dashboard Integration:** Master can view DNS/tunnel health, trigger manual checks/fixes, and review logs from the QCity dashboard.
- **Full Automation:** All DNS and tunnel management, health checks, fixes, and fallback logic are fully automated and require no manual intervention.
- **Audit Logging:** All DNS and tunnel actions are logged for compliance and troubleshooting.

### API & UI
- `/api/qcity/dns-health` and `/api/qcity/ngrok-health` for real-time DNS and tunnel health status.
- `/api/qcity/dns-fix` and `/api/qcity/ngrok-fix` to trigger manual DNS or tunnel fix (master-only, API key required).
- QCity dashboard panel for DNS and tunnel health, logs, and manual controls (master-only).

### Integration Points
- **.gitlab-ci.yml:** DNS and ngrok tunnel health is checked and auto-fixed in every pipeline run before any download or deployment.
- **QMOIBROWSER.md, QCITYRUNNERSENGINE.md, QMOIQCITYAUTOMATIC.md, QMOINGROK.md, ZERORATEDQMOI.md:** All systems use QMOI DNS and tunnel automation for link health and fallback.

## Ngrok Tunnel Automation & Fallback
- **Auto-Start Ngrok Tunnel:** QMOI can automatically start and monitor ngrok tunnels for all download/service endpoints.
- **Auto-Switch Download Links:** All download links and features are auto-updated to use the new working ngrok URL if the primary domain fails or ngrok is preferred.
- **Tunnel Monitoring & Restart:** QMOI monitors tunnel status and auto-restarts or replaces tunnels as needed.
- **Logging & Notification:** All actions are logged and master/admin is notified of any domain or tunnel switch or change.
- **Full Automation:** All logic is fully automated and requires no manual intervention.

### Example Flow
1. Detect DNS or tunnel failure for downloads.qmoi.app or ngrok URL
2. Check ngrok for available tunnel or start a new one
3. Auto-update all download links to use new ngrok URL
4. Notify master/admin and log all actions
5. Monitor and auto-restart tunnel as needed

---
*QMOI DNS and tunnel automation now includes full fallback and self-healing using ngrok, Freenom, and Cloudflare for maximum reliability. See QMOINGROK.md for ngrok details.* 

## Multi-Provider & Self-Hosted Domain Automation
- **Multi-Provider Support:** QMOI can create, register, and manage domains from any provider (Freenom, Namecheap, GoDaddy, Cloudflare, AWS, self-hosted, etc.) using browser automation or API.
- **Self-Registered Domains:** QMOI can create and manage its own domains and DNS infrastructure for maximum control and privacy.
- **Platform Integration:** QMOI can use any platform for domain management and download links, and can switch between them automatically.
- **Full Automation:** All logic is fully automated and requires no manual intervention.
- **Audit & Logging:** All domain actions are logged and visible to master/admin in QCity. 