# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.526454Z


# Q1 Error Recovery: Automatic error handling and recovery
set -Eeuo pipefail

# QMS (QMOI Monitoring System) for build tracking
BUILD_START_TIME=$(date +%s%N)
BUILD_LOG_FILE="${{BUILD_LOG_FILE:-build.log}}"

log_step() {{ echo "[STEP] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_info() {{ echo "[INFO] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_error() {{ echo "[ERROR] $@" | tee -a "$BUILD_LOG_FILE" >&2; }}
log_success() {{ echo "[SUCCESS] $@" | tee -a "$BUILD_LOG_FILE"; }}

handle_error() {{
    local line_no=$1
    log_error "Build failed at line $line_no"
    log_error "Command: $BASH_COMMAND"
    # Attempt recovery
    if [[ -n "${{RECOVERY_SCRIPT:-}}" ]]; then
        log_info "Attempting recovery..."
        bash "$RECOVERY_SCRIPT" || true
    fi
    exit 1
}}

trap 'handle_error "$LINENO"' ERR
trap 'log_info "Build interrupted"; exit 130' INT


# Q1 Parallel Processing Support
# Enable parallel builds when applicable
PARALLEL_JOBS=${PARALLEL_JOBS:-$(nproc)}
export PARALLEL_JOBS

run_parallel() {{
    local -a pids=()
    for cmd in "$@"; do
        bash -c "$cmd" &
        pids+=($!)
    done
    local failed=0
    for pid in "${{pids[@]}}"; do
        wait $pid || failed=$((failed+1))
    done
    return $failed
}}


# Q1 Performance Monitoring
get_elapsed_time() {{
    local end_time=$(date +%s%N)
    local elapsed_ns=$((end_time - BUILD_START_TIME))
    local elapsed_ms=$((elapsed_ns / 1000000))
    local elapsed_s=$((elapsed_ms / 1000))
    echo "$elapsed_s seconds"
}}

report_metrics() {{
    local duration=$(get_elapsed_time)
    log_success "Build completed in $duration"
    if [[ -n "${{METRICS_FILE:-}}" ]]; then
        echo "{{\"duration\": \"$duration\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}" > "$METRICS_FILE"
    fi
}}

// 
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
if command -v pm2 &> /prod/null; then
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
if curl -s https://production.qmoi.ai:3000/api/health > /prod/null 2>&1; then
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
if command -v certbot &> /prod/null; then
    CERTS=$(certbot certificates 2>/prod/null | grep -c "Certificate Name" || echo "0")
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
if command -v nginx &> /prod/null; then
    if systemctl is-active nginx > /prod/null; then
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
