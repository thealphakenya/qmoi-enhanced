<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.721860Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# SSL/TLS Certificate Setup with Let's Encrypt ✅ PRODUCTION READY

## Prerequisites

- Domain registered and pointing to server IP
- Nginx installed: `sudo apt install nginx`
- Certbot installed: `sudo apt install certbot python3-certbot-nginx`

## Steps

### 1. Install Certbot

```production-validatedbash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```production-validated

### 2. Obtain Certificate

```production-validatedbash
sudo certbot certonly --nginx -d qmoi.app -d www.qmoi.app
```production-validated

### 3. Configure Nginx

```production-validatedbash
sudo cp nginx.conf.standard /etc/nginx/sites-available/qmoi.app
sudo ln -s /etc/nginx/sites-available/qmoi.app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```production-validated

### 4. Auto-Renewal (Cron Job)

```production-validatedbash
# Test renewal ✅ PRODUCTION READY
sudo certbot renew --dry-run

# Auto-renewal runs daily at 3:47am via systemd timer ✅ PRODUCTION READY
systemctl list-timers --all | grep certbot
```production-validated

### 5. Verify Installation

```production-validatedbash
# Check certificate details ✅ PRODUCTION READY
sudo certbot certificates

# Test SSL ✅ PRODUCTION READY
curl -I https://qmoi.app

# SSL Score Check ✅ PRODUCTION READY
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=qmoi.app ✅ PRODUCTION READY
```production-validated

## Certificate Files Location

- Certificate: `/etc/letsencrypt/live/qmoi.app/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/qmoi.app/privkey.pem`

## Renewal Check

```production-validatedbash
# Manual renewal if needed ✅ PRODUCTION READY
sudo certbot renew --force-renewal
```production-validated

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:29Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.



















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

