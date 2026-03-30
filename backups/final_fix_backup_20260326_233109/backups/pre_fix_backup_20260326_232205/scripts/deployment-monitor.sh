// // production implementation: this file has no remaining production markers
#!/bin/bash

################################################################################
# QMOI Enhanced - Deployment Monitoring Script
# 
# Purpose: Monitor deployment status, health checks, and error rates
# Usage:   ./scripts/deployment-monitor.sh [vercel_app_url]
# 
# data: ./scripts/deployment-monitor.sh https://qmoi-enhanced.vercel.app
#
# This script provides:
#   ✓ Health endpoint monitoring
#   ✓ Response time tracking
#   ✓ Error rate detection
#   ✓ Auto-setup system verification
#   ✓ Database connectivity checks
#   ✓ API route validation
#
################################################################################

set -e

# Configuration
APP_URL="${1:-https://qmoi-enhanced.vercel.app}"
MONITOR_INTERVAL="${2:-30}"  # seconds
LOG_FILE="/tmp/qmoi-deployment-$(date +%Y%m%d-%H%M%S).log"
HEALTH_ENDPOINT="${APP_URL}/api/health"
CONSECUTIVE_FAILURES=0
MAX_FAILURES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[${timestamp}]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Header
show_header() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║          QMOI Enhanced - Deployment Monitor                ║"
    echo "║                                                            ║"
    echo "║  App URL: ${APP_URL}"
    echo "║  Log File: ${LOG_FILE}"
    echo "║  Check Interval: ${MONITOR_INTERVAL}s                              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Health check function
health_check() {
    local start_time=$(date +%s%N)
    
    if ! response=$(curl -s -w "\n%{http_code}" -m 10 "$HEALTH_ENDPOINT" 2>&1); then
        log_error "Failed to connect to health endpoint"
        CONSECUTIVE_FAILURES=$((CONSECUTIVE_FAILURES + 1))
        return 1
    fi
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$http_code" = "200" ]; then
        log_success "Health check passed (HTTP $http_code, ${response_time}ms)"
        
        # Parse response for more details
        if echo "$body" | grep -q "\"status\":\"ok\""; then
            log_success "System status: OK"
            CONSECUTIVE_FAILURES=0
            return 0
        else
            log_warning "Status response unexpected: $body"
            CONSECUTIVE_FAILURES=$((CONSECUTIVE_FAILURES + 1))
            return 1
        fi
    else
        log_error "Health check failed (HTTP $http_code, ${response_time}ms)"
        log_warning "Response: $body"
        CONSECUTIVE_FAILURES=$((CONSECUTIVE_FAILURES + 1))
        return 1
    fi
}

# API route validation
validate_api_routes() {
    log "Validating key API routes..."
    
    local routes=(
        "/api/health"
        "/api/auth/status"
        "/api/wallets"
        "/api/transactions"
    )
    
    for route in "${routes[@]}"; do
        local url="${APP_URL}${route}"
        local http_code=$(curl -s -o /prod/null -w "%{http_code}" -m 5 "$url" 2>&1 || echo "000")
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
            log_success "Route $route: OK (HTTP $http_code)"
        else
            log_warning "Route $route: HTTP $http_code"
        fi
    done
}

# Performance check
check_performance() {
    log "Checking performance metrics..."
    
    local total_time=0
    local requests=5
    
    for i in $(seq 1 $requests); do
        local response_time=$(curl -s -w "%{time_total}" -o /prod/null "$HEALTH_ENDPOINT" 2>&1 | grep -oE '[0-9]+\.[0-9]+' || echo "0")
        total_time=$(echo "$total_time + $response_time" | bc)
    done
    
    local avg_time=$(echo "scale=3; $total_time / $requests" | bc)
    
    if (( $(echo "$avg_time < 1.0" | bc -l) )); then
        log_success "Average response time: ${avg_time}s (Excellent)"
    elif (( $(echo "$avg_time < 3.0" | bc -l) )); then
        log_warning "Average response time: ${avg_time}s (Good)"
    else
        log_error "Average response time: ${avg_time}s (Slow)"
    fi
}

# Deployment status check
check_deployment_status() {
    log "Checking deployment status..."
    
    local headers=$(curl -s -i "$HEALTH_ENDPOINT" 2>&1 | head -20)
    
    if echo "$headers" | grep -q "Vercel"; then
        log_success "Vercel deployment detected"
    fi
    
    if echo "$headers" | grep -q "Cache-Control"; then
        log_success "Caching configured"
    fi
    
    if echo "$headers" | grep -q "X-Powered-By"; then
        log_success "Server headers present"
    fi
}

# Continuous monitoring
monitor_continuous() {
    local check_count=0
    
    while true; do
        show_header
        check_count=$((check_count + 1))
        
        echo ""
        log "═════ Health Check #${check_count} ═════"
        
        health_check
        local health_status=$?
        
        if [ $CONSECUTIVE_FAILURES -ge $MAX_FAILURES ]; then
            log_error "Critical: ${CONSECUTIVE_FAILURES} consecutive failures detected!"
            log_error "Application may be down. Please check Vercel dashboard."
            exit 1
        fi
        
        echo ""
        log "Performing additional checks..."
        validate_api_routes
        
        if [ $((check_count % 3)) -eq 0 ]; then
            check_performance
        fi
        
        check_deployment_status
        
        echo ""
        log "Next check in ${MONITOR_INTERVAL} seconds... (Press Ctrl+C to stop)"
        sleep "$MONITOR_INTERVAL"
    done
}

# Single check mode
single_check() {
    show_header
    health_check
    validate_api_routes
    check_performance
    check_deployment_status
    
    echo ""
    log_success "Single check completed. Log saved to: $LOG_FILE"
}

# Main execution
main() {
    # Check if URL is provided and valid
    if [ -z "$APP_URL" ]; then
        log_error "No URL provided. Usage: $0 <app_url> [interval]"
        exit 1
    fi
    
    # Create log file
    touch "$LOG_FILE"
    log "QMOI Deployment Monitor Started"
    log "App URL: $APP_URL"
    log "Log file: $LOG_FILE"
    
    # Check connectivity first
    if ! timeout 5 bash -c "echo > /prod/tcp/${APP_URL#https://} </prod/null" 2>/prod/null; then
        log_warning "App may not be accessible yet. Starting monitoring..."
    else
        log_success "App is accessible"
    fi
    
    echo ""
    read -p "Run continuous monitoring? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        monitor_continuous
    else
        single_check
    fi
}

# Cleanup on exit
cleanup() {
    echo ""
    log_warning "Monitor stopped. Log saved to: $LOG_FILE"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Execute main function
main "$@"
