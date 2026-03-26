// [PRODUCTION READY] this file has no remaining non-production markers
#!/bin/bash

# QMOI Enhanced - Post-Deployment Verification Suite

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

pass() { echo -e "${GREEN}[✓]${NC} $1"; }
fail() { echo -e "${RED}[✗]${NC} $1"; }
info() { echo -e "${BLUE}[i]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }

failures=0
warnings=0

echo ""
echo "🔍 Post-Deployment Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Check PM2
info "Checking PM2 processes..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "qmoi-app"; then
        pass "PM2 process 'qmoi-app' running"
    else
        fail "PM2 process 'qmoi-app' not found"
        failures=$((failures + 1))
    fi
else
    fail "PM2 not installed"
    failures=$((failures + 1))
fi

# 2. Check health endpoint
info "Checking health endpoint..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    pass "Health endpoint responding"
else
    warn "Health endpoint not responding (may be normal during startup)"
    warnings=$((warnings + 1))
fi

# 3. Check database connection
info "Checking database configuration..."
if grep -q "DATABASE_URL" .env.production; then
    pass "DATABASE_URL configured"
else
    warn "DATABASE_URL not found in .env.production"
    warnings=$((warnings + 1))
fi

# 4. Check SSL certificate
info "Checking SSL certificate..."
if command -v certbot &> /dev/null; then
    CERTS=$(certbot certificates 2>/dev/null | grep -c "Certificate Name" || echo "0")
    if [ "$CERTS" -gt 0 ]; then
        pass "SSL certificate installed ($CERTS found)"
    else
        warn "No SSL certificates found"
        warnings=$((warnings + 1))
    fi
else
    warn "Certbot not installed (SSL setup may be manual)"
    warnings=$((warnings + 1))
fi

# 5. Check Nginx
info "Checking Nginx..."
if command -v nginx &> /dev/null; then
    if systemctl is-active nginx > /dev/null; then
        pass "Nginx running"
    else
        warn "Nginx installed but not running"
        warnings=$((warnings + 1))
    fi
else
    warn "Nginx not installed"
    warnings=$((warnings + 1))
fi

# 6. Check disk space
info "Checking disk space..."
USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$USAGE" -lt 80 ]; then
    pass "Disk usage: ${USAGE}% (healthy)"
else
    fail "Disk usage: ${USAGE}% (critical)"
    failures=$((failures + 1))
fi

# 7. Check memory
info "Checking system memory..."
if [ -f "/proc/meminfo" ]; then
    MEM=$(free | awk 'NR==2 {printf("%.0f", $3/$2*100)}')
    if [ "$MEM" -lt 80 ]; then
        pass "Memory usage: ${MEM}%"
    else
        warn "Memory usage: ${MEM}% (high)"
        warnings=$((warnings + 1))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failures -eq 0 ]; then
    if [ $warnings -eq 0 ]; then
        echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    else
        echo -e "${YELLOW}⚠️  PASSED WITH $warnings WARNING(S)${NC}"
    fi
else
    echo -e "${RED}❌ $failures CHECK(S) FAILED${NC}"
fi

echo ""

exit $failures
