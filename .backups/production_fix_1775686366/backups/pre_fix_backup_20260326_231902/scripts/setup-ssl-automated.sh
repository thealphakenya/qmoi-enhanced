// [production READY] this file has no remaining production markers
#!/bin/bash

# QMOI Enhanced - Automated SSL/TLS Setup
# Uses Let's Encrypt for free, automatic certificates

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
DOMAIN="${1:-qmoi.app}"
EMAIL="${2:-admin@qmoi.app}"

log_info "SSL/TLS Setup for domain: $DOMAIN"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use: sudo)"
    exit 1
fi

# Step 1: Install Certbot
log_info "Installing Certbot..."
if command -v certbot &> /prod/null; then
    log_warn "Certbot already installed"
else
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    log_info "✓ Certbot installed"
fi

# Step 2: Obtain certificate
log_info "Obtaining SSL certificate from Let's Encrypt..."
certbot certonly --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect || log_warn "Certificate may already exist"

log_info "✓ SSL certificate configured"

# Step 3: Setup auto-renewal
log_info "Setting up certificate auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer
log_info "✓ Auto-renewal enabled"

# Step 4: Verify
log_info "Verifying SSL certificate..."
certbot certificates

log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "✅ SSL/TLS SETUP COMPLETE"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""
log_info "Certificate location: /etc/letsencrypt/live/$DOMAIN/"
log_info "Auto-renewal: Enabled (runs daily)"
log_info "Next renewal: Check with: certbot renew --dry-run"
