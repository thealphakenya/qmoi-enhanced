#!/bin/bash

# QMOI Enhanced - Post-Deployment Verification Script
# Comprehensive validation of production deployment

set -e

# Configuration
DEPLOYMENT_URL="${DEPLOYMENT_URL:-https://qmoi-enhanced.vercel.app}"
TIMEOUT=30
RETRIES=3

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Results tracking
CHECKS_PASSED=0
CHECKS_FAILED=0
TOTAL_CHECKS=0

echo -e "${BLUE}🚀 QMOI ENHANCED - POST-DEPLOYMENT VERIFICATION${NC}"
echo "======================================================"
echo "Deployment URL: $DEPLOYMENT_URL"
echo "Date: $(date)"
echo

# Function to log results
log_result() {
    local check_name=$1
    local result=$2
    local details=$3

    ((TOTAL_CHECKS++))
    if [ "$result" = "PASS" ]; then
        ((CHECKS_PASSED++))
        echo -e "${GREEN}✅ $check_name: PASS${NC}"
        [ -n "$details" ] && echo -e "   $details"
    else
        ((CHECKS_FAILED++))
        echo -e "${RED}❌ $check_name: FAIL${NC}"
        [ -n "$details" ] && echo -e "   $details"
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}

    for attempt in $(seq 1 $RETRIES); do
        echo -n "Testing $name (attempt $attempt/$RETRIES)... "

        local response
        local http_code
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null)
        http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

        if [ "$http_code" = "$expected_code" ]; then
            # Check if response contains expected content
            local body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
            if echo "$body" | jq . >/dev/null 2>&1; then
                log_result "$name" "PASS" "HTTP $http_code, Valid JSON response"
                return 0
            else
                log_result "$name" "PASS" "HTTP $http_code, Response received"
                return 0
            fi
        elif [ $attempt -eq $RETRIES ]; then
            log_result "$name" "FAIL" "HTTP $http_code (expected $expected_code)"
            return 1
        fi

        sleep 2
    done
}

# Function to test response time
test_response_time() {
    local name=$1
    local url=$2
    local max_time=${3:-3000}

    echo -n "Testing response time for $name... "

    local start_time=$(date +%s%N)
    local response
    response=$(curl -s --max-time 10 "$url" 2>/dev/null)
    local end_time=$(date +%s%N)

    if [ $? -eq 0 ]; then
        local duration=$(( (end_time - start_time) / 1000000 ))
        if [ $duration -le $max_time ]; then
            log_result "${name} Response Time" "PASS" "${duration}ms (max ${max_time}ms)"
            return 0
        else
            log_result "${name} Response Time" "FAIL" "${duration}ms (exceeds ${max_time}ms)"
            return 1
        fi
    else
        log_result "${name} Response Time" "FAIL" "Request failed"
        return 1
    fi
}

# Function to validate JSON structure
validate_json_structure() {
    local name=$1
    local url=$2
    local required_fields=$3

    echo -n "Validating JSON structure for $name... "

    local response
    response=$(curl -s --max-time $TIMEOUT "$url" 2>/dev/null)

    if [ $? -eq 0 ] && echo "$response" | jq . >/dev/null 2>&1; then
        # Check required fields
        local missing_fields=""
        for field in $required_fields; do
            if ! echo "$response" | jq -e ".$field" >/dev/null 2>&1; then
                missing_fields="$missing_fields $field"
            fi
        done

        if [ -z "$missing_fields" ]; then
            log_result "$name JSON Structure" "PASS" "All required fields present"
            return 0
        else
            log_result "$name JSON Structure" "FAIL" "Missing fields:$missing_fields"
            return 1
        fi
    else
        log_result "$name JSON Structure" "FAIL" "Invalid or no JSON response"
        return 1
    fi
}

echo "🩺 BASIC ENDPOINT CHECKS"
echo "------------------------"

# Basic health check
test_endpoint "Basic Health" "$DEPLOYMENT_URL/api/health"

# Detailed health check
test_endpoint "Detailed Health" "$DEPLOYMENT_URL/api/health?type=detailed"

# Oxygen/Pulse endpoint
test_endpoint "Oxygen/Pulse" "$DEPLOYMENT_URL/api/oxygen/pulse"

# Dashboard endpoint
test_endpoint "Dashboard Health" "$DEPLOYMENT_URL/api/dashboard/health"

echo
echo "⏱️  PERFORMANCE CHECKS"
echo "----------------------"

# Response time checks
test_response_time "Health API" "$DEPLOYMENT_URL/api/health" 2000
test_response_time "Oxygen API" "$DEPLOYMENT_URL/api/oxygen/pulse" 3000
test_response_time "Dashboard API" "$DEPLOYMENT_URL/api/dashboard/health" 3000

echo
echo "📋 JSON STRUCTURE VALIDATION"
echo "-----------------------------"

# Validate JSON responses have required structure
validate_json_structure "Health API" "$DEPLOYMENT_URL/api/health" "status timestamp"
validate_json_structure "Oxygen API" "$DEPLOYMENT_URL/api/oxygen/pulse" "pulse consciousness health"
validate_json_structure "Dashboard API" "$DEPLOYMENT_URL/api/dashboard/health" "status"

echo
echo "🌐 STATIC ASSET CHECKS"
echo "-----------------------"

# Check if static assets are accessible
test_endpoint "Main Page" "$DEPLOYMENT_URL" 200
test_endpoint "Favicon" "$DEPLOYMENT_URL/favicon.ico" 200

echo
echo "🔒 SECURITY CHECKS"
echo "------------------"

# Check security headers (basic check)
echo -n "Checking security headers... "
security_headers=$(curl -s -I --max-time 10 "$DEPLOYMENT_URL" 2>/dev/null | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)" | wc -l)
if [ $security_headers -ge 2 ]; then
    log_result "Security Headers" "PASS" "$security_headers security headers found"
else
    log_result "Security Headers" "FAIL" "Only $security_headers security headers found"
fi

echo
echo "📊 FINAL VERIFICATION RESULTS"
echo "============================="

echo "Total Checks: $TOTAL_CHECKS"
echo "Passed: $CHECKS_PASSED"
echo "Failed: $CHECKS_FAILED"

success_rate=$(( (CHECKS_PASSED * 100) / TOTAL_CHECKS ))

echo "Success Rate: ${success_rate}%"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED - DEPLOYMENT SUCCESSFUL!${NC}"
    echo
    echo "✅ Production deployment is fully operational"
    echo "✅ All endpoints responding correctly"
    echo "✅ Performance within acceptable limits"
    echo "✅ JSON responses properly structured"
    echo "✅ Security measures in place"
    echo
    echo "🚀 QMOI Enhanced is live and healthy!"
    exit 0
elif [ $success_rate -ge 80 ]; then
    echo -e "${YELLOW}⚠️  DEPLOYMENT PARTIALLY SUCCESSFUL${NC}"
    echo "Most systems are operational, but some issues need attention."
    exit 1
else
    echo -e "${RED}❌ DEPLOYMENT ISSUES DETECTED${NC}"
    echo "Critical issues found. Manual intervention required."
    exit 2
fi