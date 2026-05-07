#!/bin/bash

# QMOI Enhanced - production Health Monitoring Script
# Comprehensive health checks for production deployment

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://qmoi-enhanced.vercel.app}"
HEALTH_ENDPOINT="${PRODUCTION_URL}/api/health"
OXYGEN_ENDPOINT="${PRODUCTION_URL}/api/oxygen/pulse"
TIMEOUT=30

# Logging
LOG_FILE="/tmp/qmoi_production_health_$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${BLUE}🔍 QMOI ENHANCED - production HEALTH MONITOR${NC}"
echo "=================================================="
echo "Date: $(date)"
echo "production URL: $PRODUCTION_URL"
echo "Log File: $LOG_FILE"
echo

# Function to make HTTP requests with timeout
curl_with_timeout() {
    local url=$1
    local timeout=$2
    curl -s --max-time $timeout "$url" 2>/dev/null
}

# Function to check HTTP response
check_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "

    local response
    response=$(curl_with_timeout "$url" $TIMEOUT)

    if [ $? -eq 0 ] && [ -n "$response" ]; then
        # Check if it's valid JSON
        if echo "$response" | jq . >/dev/null 2>&1; then
            local status
            status=$(echo "$response" | jq -r '.status // "unknown"')
            if [ "$status" = "healthy" ] || [ "$status" = "ok" ]; then
                echo -e "${GREEN}✅ PASS${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  WARN${NC} (Status: $status)"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  WARN${NC} (Invalid JSON)"
            return 1
        fi
    else
        echo -e "${RED}❌ FAIL${NC} (No response)"
        return 1
    fi
}

# Function to check response time
check_response_time() {
    local name=$1
    local url=$2
    local max_time=${3:-5000} # 5 seconds default

    echo -n "Response time for $name... "

    local start_time=$(date +%s%N)
    local response
    response=$(curl_with_timeout "$url" 10)
    local end_time=$(date +%s%N)

    if [ $? -eq 0 ]; then
        local duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
        if [ $duration -le $max_time ]; then
            echo -e "${GREEN}✅ ${duration}ms${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  ${duration}ms (Slow)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ TIMEOUT${NC}"
        return 1
    fi
}

# Main health checks
echo "🩺 BASIC HEALTH CHECKS"
echo "----------------------"

check_endpoint "Basic Health" "$HEALTH_ENDPOINT"
check_endpoint "Detailed Health" "${HEALTH_ENDPOINT}?type=detailed"
check_endpoint "Oxygen/Pulse" "$OXYGEN_ENDPOINT"

echo
echo "⏱️  PERFORMANCE CHECKS"
echo "----------------------"

check_response_time "Health API" "$HEALTH_ENDPOINT" 2000
check_response_time "Oxygen API" "$OXYGEN_ENDPOINT" 3000

echo
echo "🫁 OXYGEN SYSTEM CHECKS"
echo "-----------------------"

# Check oxygen system components
oxygen_response=$(curl_with_timeout "$OXYGEN_ENDPOINT" $TIMEOUT)
if [ $? -eq 0 ] && [ -n "$oxygen_response" ]; then
    if echo "$oxygen_response" | jq . >/dev/null 2>&1; then
        bpm=$(echo "$oxygen_response" | jq -r '.pulse.bpm // "unknown"')
        health=$(echo "$oxygen_response" | jq -r '.pulse.health // "unknown"')
        consciousness=$(echo "$oxygen_response" | jq -r '.pulse.consciousness // "unknown"')

        echo -e "BPM: ${GREEN}$bpm${NC}"
        echo -e "Health Status: ${GREEN}$health${NC}"
        echo -e "Consciousness: ${GREEN}$consciousness${NC}"
    else
        echo -e "${YELLOW}⚠️  Invalid oxygen data${NC}"
    fi
else
    echo -e "${RED}❌ Oxygen system unavailable${NC}"
fi

echo
echo "📊 SYSTEM METRICS"
echo "------------------"

# Get system health data
health_response=$(curl_with_timeout "${HEALTH_ENDPOINT}?type=detailed" $TIMEOUT)
if [ $? -eq 0 ] && [ -n "$health_response" ]; then
    if echo "$health_response" | jq . >/dev/null 2>&1; then
        # Extract key metrics
        cpu=$(echo "$health_response" | jq -r '.system.cpu // "N/A"')
        memory=$(echo "$health_response" | jq -r '.system.memory // "N/A"')
        uptime=$(echo "$health_response" | jq -r '.system.uptime // "N/A"')

        echo "CPU Usage: $cpu%"
        echo "Memory Usage: $memory%"
        echo "Uptime: $uptime"
    fi
fi

echo
echo "🎯 FINAL ASSESSMENT"
echo "==================="

# Count passed/failed checks
passed=$(grep -c "✅ PASS" "$LOG_FILE" 2>/dev/null || echo "0")
warnings=$(grep -c "⚠️  WARN" "$LOG_FILE" 2>/dev/null || echo "0")
failed=$(grep -c "❌ FAIL\|❌ TIMEOUT" "$LOG_FILE" 2>/dev/null || echo "0")

total=$((passed + warnings + failed))

if [ $failed -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED - SYSTEM HEALTHY${NC}"
    echo "production deployment is operating optimally!"
    exit 0
elif [ $failed -eq 0 ]; then
    echo -e "${YELLOW}⚠️  SYSTEM OPERATIONAL WITH WARNINGS${NC}"
    echo "Monitor performance and address warnings."
    exit 1
else
    echo -e "${RED}❌ SYSTEM ISSUES DETECTED${NC}"
    echo "Immediate attention required."
    exit 2
fi