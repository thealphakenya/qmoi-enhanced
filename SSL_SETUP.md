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
sudo cp nginx.conf.template /etc/nginx/sites-available/qmoi.app
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
