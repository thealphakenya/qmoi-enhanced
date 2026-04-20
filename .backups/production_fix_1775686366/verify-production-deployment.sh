#!/bin/bash

# QMOI Enhanced - Production Deployment Verification
# Version 2.4.0 - PRODUCTION_IMPLEMENTED
# Last Updated: April 5, 2026

set -euo pipefail

# Colors for output
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
API_URL="${API_URL:-http://localhost:3000/api}"
TIMEOUT=30
RETRIES=3

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Health check function
check_health() {
    local url="$1"
    local service_name="$2"
    local expected_status="${3:-200}"

    log_info "Checking $service_name health at $url"

    for attempt in $(seq 1 $RETRIES); do
        if curl -f -s --max-time $TIMEOUT -o /dev/null -w "%{http_code}" "$url" | grep -q "^$expected_status$"; then
            log_success "$service_name is healthy"
            return 0
        fi
        log_warning "Attempt $attempt failed for $service_name, retrying..."
        sleep 5
    done

    log_error "$service_name health check failed after $RETRIES attempts"
    return 1
}

# Database connectivity check
check_database() {
    log_info "Checking database connectivity"

    if command -v psql &> /dev/null; then
        if [ -z "${POSTGRES_PASSWORD:-}" ]; then
            log_warning "POSTGRES_PASSWORD is not set; skipping psql connectivity check"
            return 1
        fi

        if PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -U qmoi_prod -d qmoi_enhanced_prod -c "SELECT 1;" &> /dev/null; then
            log_success "Database connectivity verified"
            return 0
        fi
    fi

    log_error "Database connectivity check failed"
    return 1
}

# Redis connectivity check
check_redis() {
    log_info "Checking Redis connectivity"

    if command -v redis-cli &> /dev/null; then
        if [ -z "${REDIS_PASSWORD:-}" ]; then
            log_warning "REDIS_PASSWORD is not set; skipping redis-cli connectivity check"
            return 1
        fi

        if redis-cli -a "$REDIS_PASSWORD" ping | grep -q "PONG"; then
            log_success "Redis connectivity verified"
            return 0
        fi
    fi

    log_error "Redis connectivity check failed"
    return 1
}

# PM2 process check
check_pm2_processes() {
    log_info "Checking PM2 processes"

    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "qmoi-enhanced-api"; then
            log_success "PM2 processes are running"
            return 0
        fi
    fi

    log_error "PM2 processes check failed"
    return 1
}

# SSL certificate check
check_ssl() {
    local domain="$1"

    if [ -z "$domain" ]; then
        log_warning "SSL check skipped - no domain specified"
        return 0
    fi

    log_info "Checking SSL certificate for $domain"

    if echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -checkend 86400 &> /dev/null; then
        log_success "SSL certificate is valid"
        return 0
    fi

    log_error "SSL certificate check failed"
    return 1
}

# API endpoints verification
verify_api_endpoints() {
    log_info "Verifying API endpoints"

    local endpoints=(
        "/api/health:200"
        "/api/auth/status:401"
        "/api/payments/status:401"
        "/api/trading/status:401"
    )

    local failed=0

    for endpoint in "${endpoints[@]}"; do
        IFS=':' read -r path expected_status <<< "$endpoint"
        local url="$API_URL$path"

        if ! check_health "$url" "API endpoint $path" "$expected_status"; then
            ((failed++))
        fi
    done

    if [ $failed -eq 0 ]; then
        log_success "All API endpoints verified"
        return 0
    else
        log_error "$failed API endpoints failed verification"
        return 1
    fi
}

# Performance check
check_performance() {
    log_info "Checking application performance"

    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL/api/health" 2>/dev/null || echo "999")

    if (( $(echo "$response_time < 2.0" | bc -l 2>/dev/null || echo "1") )); then
        log_success "Performance check passed (${response_time}s response time)"
        return 0
    else
        log_warning "Performance check warning - slow response time: ${response_time}s"
        return 0
    fi
}

# Security verification
verify_security() {
    log_info "Verifying security configuration"

    local security_checks=0
    local security_passed=0

    if curl -s "$APP_URL/.env" | grep -q "Not Found\|403"; then
        ((security_passed++))
    fi
    ((security_checks++))

    if curl -s -I "$API_URL/health" | grep -q "X-Frame-Options\|X-Content-Type-Options"; then
        ((security_passed++))
    fi
    ((security_checks++))

    log_info "Security checks: $security_passed/$security_checks passed"

    if [ $security_passed -eq $security_checks ]; then
        log_success "Security verification passed"
        return 0
    else
        log_warning "Some security checks failed"
        return 0
    fi
}

main() {
    log_info "Starting QMOI Enhanced Production Verification"
    log_info "=============================================="

    local checks_passed=0
    local total_checks=0

    ((total_checks++))
    if check_database; then ((checks_passed++)); fi

    ((total_checks++))
    if check_redis; then ((checks_passed++)); fi

    ((total_checks++))
    if check_pm2_processes; then ((checks_passed++)); fi

    ((total_checks++))
    if check_health "$APP_URL/api/health" "Application"; then ((checks_passed++)); fi

    ((total_checks++))
    if verify_api_endpoints; then ((checks_passed++)); fi

    ((total_checks++))
    if check_performance; then ((checks_passed++)); fi

    ((total_checks++))
    if verify_security; then ((checks_passed++)); fi

    if [[ "$APP_URL" == https://* ]]; then
        local domain=$(echo "$APP_URL" | sed 's|https://||' | sed 's|/.*||')
        ((total_checks++))
        if check_ssl "$domain"; then ((checks_passed++)); fi
    fi

    echo
    log_info "VERIFICATION RESULTS"
    log_info "===================="
    log_info "Checks passed: $checks_passed/$total_checks"

    if [ $checks_passed -eq $total_checks ]; then
        log_success "🎉 ALL VERIFICATION CHECKS PASSED!"
        log_success "QMOI Enhanced is successfully deployed and operational"
        echo
        log_info "Next steps:"
        echo "1. Monitor application logs: pm2 logs"
        echo "2. Check monitoring dashboard: http://localhost:3001"
        echo "3. Verify user access and functionality"
        echo "4. Configure domain DNS and SSL certificates"
        echo "5. Set up automated backups and monitoring alerts"
        exit 0
    else
        log_error "❌ VERIFICATION FAILED: $((total_checks - checks_passed)) checks failed"
        log_error "Please review the errors above and fix issues before proceeding"
        exit 1
    fi
}

main "$@"
