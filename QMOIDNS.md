# QMOIDNS.md

## QMOI DNS Management & Automation System

QMOI now features a fully automated DNS management system for all download and service domains (e.g., downloads.qmoi.app). This system ensures DNS is always correctly set up, monitored, and repaired, guaranteeing maximum uptime and reliability for all QMOI features.

### Core Features
- **Automated DNS Checks:** QMOI continuously checks DNS health for all critical domains and subdomains.
- **Auto-Setup & Repair:** If DNS is missing or misconfigured, QMOI automatically sets up or repairs DNS records (A, CNAME, TXT, etc.) using API integration with DNS providers (Cloudflare, AWS Route53, etc.).
- **DNS Auto-Fix Routine:** On any DNS failure, QMOI triggers an auto-fix routine, logs the issue, and notifies master/admin. All actions are auditable.
- **Zero-Rated & Fallback Links:** If DNS cannot be fixed immediately, QMOI auto-switches to zero-rated or fallback CDN links (see ZERORATEDQMOI.md) to ensure all downloads and services remain available.
- **Dashboard Integration:** Master can view DNS health, trigger manual checks/fixes, and review logs from the QCity dashboard.
- **Full Automation:** All DNS management, health checks, fixes, and fallback logic are fully automated and require no manual intervention.
- **Audit Logging:** All DNS actions are logged for compliance and troubleshooting.

### API & UI
- `/api/qcity/dns-health` for real-time DNS health status.
- `/api/qcity/dns-fix` to trigger manual DNS fix (master-only, API key required).
- QCity dashboard panel for DNS health, logs, and manual controls (master-only).

### Integration Points
- **.gitlab-ci.yml:** DNS health is checked and auto-fixed in every pipeline run before any download or deployment.
- **QMOIBROWSER.md, QCITYRUNNERSENGINE.md, QMOIQCITYAUTOMATIC.md, ZERORATEDQMOI.md:** All systems use QMOI DNS automation for link health and fallback.

## Freenom Auto-Domain Creation & Fallback
- **Auto-Create Freenom Account:** QMOI can automatically create a Freenom account for domain management.
- **Register Free Fallback Domains:** If the primary domain fails, QMOI auto-registers a free fallback domain (e.g., .tk, .ml, .ga, .cf, .gq) using browser automation (Selenium) and assigns it to all download/service links.
- **DNS Record Management:** QMOI can set A/CNAME records for new domains using Cloudflare API (if nameservers are pointed to Cloudflare) or via Freenom's UI automation.
- **Auto-Switch Download Links:** All download links and features are auto-updated to use the new working domain if the primary fails.
- **Domain Monitoring & Renewal:** QMOI monitors domain status and auto-renews or replaces domains as needed.
- **Logging & Notification:** All actions are logged and master/admin is notified of any domain switch or DNS change.
- **Full Automation:** All logic is fully automated and requires no manual intervention.

### Example Flow
1. Detect DNS failure for downloads.qmoi.app
2. Check Freenom for available fallback domain (e.g., downloads-qmoi.tk)
3. Auto-register domain and set DNS records (A/CNAME)
4. Update all download links to use new domain
5. Notify master/admin and log all actions
6. Monitor and auto-renew domain as needed

---
*QMOI DNS automation now includes full fallback and self-healing using Freenom and Cloudflare for maximum reliability.* 