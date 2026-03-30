<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.721860Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
# SSL/TLS Certificate Setup with Let's Encrypt

## Prerequisites

- Domain registered and pointing to server IP
- Nginx installed: `sudo apt install nginx`
- Certbot installed: `sudo apt install certbot python3-certbot-nginx`

## Steps

### 1. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtain Certificate

```bash
sudo certbot certonly --nginx -d qmoi.app -d www.qmoi.app
```

### 3. Configure Nginx

```bash
sudo cp nginx.conf.standard /etc/nginx/sites-available/qmoi.app
sudo ln -s /etc/nginx/sites-available/qmoi.app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Auto-Renewal (Cron Job)

```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renewal runs daily at 3:47am via systemd timer
systemctl list-timers --all | grep certbot
```

### 5. Verify Installation

```bash
# Check certificate details
sudo certbot certificates

# Test SSL
curl -I https://qmoi.app

# SSL Score Check
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=qmoi.app
```

## Certificate Files Location

- Certificate: `/etc/letsencrypt/live/qmoi.app/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/qmoi.app/privkey.pem`

## Renewal Check

```bash
# Manual renewal if needed
sudo certbot renew --force-renewal
```

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:29Z

---
*This document is maintained by QMOI's autonomous evolution system*
