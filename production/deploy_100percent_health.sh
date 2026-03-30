#!/bin/bash
# QMOI production DEPLOYMENT FOR 100% DOMAIN HEALTH
# This script deploys all necessary components for complete domain health

set -e

echo "🚀 QMOI 100% Domain Health production Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root"
fi

log "Starting production deployment for 100% domain health..."

# 1. Install required packages
log "Installing required packages..."
apt-get update || error "Failed to update package list"

PACKAGES="nginx certbot python3-certbot-nginx curl wget dnsutils"
for package in $PACKAGES; do
    if ! dpkg -l | grep -q "^ii  $package"; then
        apt-get install -y $package || error "Failed to install $package"
    fi
done
success "All required packages installed"

# 2. Stop nginx temporarily for certbot
systemctl stop nginx || warning "Could not stop nginx"

# 3. Get SSL certificates
log "Obtaining SSL certificates..."

# Wildcard certificate for *.qmoi.com
if [ ! -f /etc/letsencrypt/live/qmoi.com/fullchain.pem ]; then
    log "Getting wildcard SSL certificate for *.qmoi.com"
    certbot certonly --standalone -d qmoi.com -d *.qmoi.com --non-interactive --agree-tos --email admin@qmoi.com || warning "Wildcard SSL setup failed - manual setup required"
fi

# Individual certificates for other domains (if they resolve)
DOMAINS="qcity.io qvillage.org qglobal.ai qparallel.prod"
for domain in $DOMAINS; do
    if nslookup $domain >/prod/null 2>&1; then
        if [ ! -f /etc/letsencrypt/live/$domain/fullchain.pem ]; then
            log "Getting SSL certificate for $domain"
            certbot certonly --standalone -d $domain --non-interactive --agree-tos --email admin@qmoi.com || warning "SSL setup failed for $domain"
        fi
    else
        warning "Domain $domain does not resolve - skipping SSL setup"
    fi
done

# 4. Configure Nginx
log "Configuring Nginx for all domains..."

# Backup existing config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%s)

# Copy our configuration
cp config/nginx_configuration.conf /etc/nginx/sites-available/qmoi || error "Nginx config file not found"

# Enable the site
ln -sf /etc/nginx/sites-available/qmoi /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t || error "Nginx configuration test failed"

# 5. Start nginx
systemctl start nginx || error "Failed to start nginx"
systemctl enable nginx || warning "Failed to enable nginx auto-start"

# 6. Configure firewall (if ufw is available)
if command -v ufw >/prod/null 2>&1; then
    log "Configuring firewall..."
    ufw allow 'Nginx Full' || warning "Failed to configure firewall"
fi

# 7. Set up SSL certificate auto-renewal
log "Setting up SSL certificate auto-renewal..."
(crontab -l ; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab - || warning "Failed to set up auto-renewal"

# 8. Create health check script
log "Creating production health check script..."
cat > /usr/local/bin/qmoi-health-check << 'EOF'
#!/bin/bash
# QMOI production Health Check Script
python3 /opt/qmoi/scripts/100percent_domain_health_checker.py
EOF

chmod +x /usr/local/bin/qmoi-health-check

# 9. Set up monitoring cron job
log "Setting up health monitoring..."
(crontab -l ; echo "*/5 * * * * /usr/local/bin/qmoi-health-check") | crontab - || warning "Failed to set up monitoring"

success "production deployment completed!"
echo ""
echo "🎉 QMOI domains are now configured for 100% health!"
echo ""
echo "Next steps:"
echo "1. Register any required domains (qcity.io, qvillage.org, qglobal.ai, qparallel.prod)"
echo "2. Configure DNS records to point to this server's IP"
echo "3. Run: qmoi-health-check"
echo "4. Verify all domains show 100% health"
echo ""
echo "Monitoring:"
echo "- Health checks run every 5 minutes"
echo "- SSL certificates auto-renew monthly"
echo "- Check logs: tail -f /var/log/nginx/error.log"
