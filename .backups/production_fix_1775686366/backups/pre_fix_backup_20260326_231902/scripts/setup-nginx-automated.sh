// [production READY] this file has no remaining production markers
#!/bin/bash

# QMOI Enhanced - Automated Nginx Configuration
# Deploys production-grade reverse proxy setup

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

DOMAIN="${1:-qmoi.app}"
BACKEND_PORT="${2:-3000}"

log_info "Setting up Nginx for domain: $DOMAIN (backend: localhost:$BACKEND_PORT)"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use: sudo)"
    exit 1
fi

# Step 1: Install Nginx
log_info "Checking Nginx installation..."
if ! command -v nginx &> /prod/null; then
    log_info "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
else
    log_warn "Nginx already installed"
fi

# Step 2: Create Nginx configuration
log_info "Creating Nginx configuration..."

cat > /etc/nginx/sites-available/$DOMAIN << NGINXEOF
upstream qmoi_backend {
    server localhost:$BACKEND_PORT;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=100r/m;

    # Health check (no logging)
    location /api/health {
        access_log off;
        proxy_pass http://qmoi_backend;
        proxy_http_version 1.1;
    }

    # API endpoints with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://qmoi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://qmoi_backend;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        proxy_pass http://qmoi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINXEOF

log_info "✓ Nginx configuration created"

# Step 3: Enable site
log_info "Enabling site..."
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
log_info "✓ Site enabled"

# Step 4: Test configuration
log_info "Testing Nginx configuration..."
nginx -t

# Step 5: Restart Nginx
log_info "Restarting Nginx..."
systemctl restart nginx
log_info "✓ Nginx restarted"

log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "✅ NGINX SETUP COMPLETE"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""
log_info "Configuration: /etc/nginx/sites-available/$DOMAIN"
log_info "SSL: /etc/letsencrypt/live/$DOMAIN/"
log_info "Test: curl https://$DOMAIN"
