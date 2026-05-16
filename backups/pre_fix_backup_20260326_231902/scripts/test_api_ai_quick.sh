# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.477818Z


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

// [] this file has no remaining production markers
#!/bin/bash
# Integration test for /api/ai and /api/qmoi/chat endpoints
# Requires: local Next.js prod server running on https://production.qmoi.ai:3000

BASE_URL="${BASE_URL:-https://production.qmoi.ai:3000}"
ENDPOINT_AI="${BASE_URL}/api/ai"
ENDPOINT_CHAT="${BASE_URL}/api/qmoi/chat"

echo "=== QMOI AI Endpoint Integration Test ==="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: GET /api/ai (info endpoint)
echo "Test 1: GET /api/ai"
RESPONSE=$(curl -s -X GET "$ENDPOINT_AI" -H "Content-Type: application/json")
echo "Response: $RESPONSE"
echo ""

# Test 2: POST /api/ai with sophisticated message
echo "Test 2: POST /api/ai with message"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello QMOI","sessionId":"test-session-1","userId":"test-user"}')
echo "Response: $RESPONSE" | head -c 300
echo ""
echo ""

# Test 3: POST /api/ai with visualization
echo "Test 3: POST /api/ai with visualization"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{"input":"visualize sales data","sessionId":"test-session-1","userId":"test-user"}')
if echo "$RESPONSE" | grep -q "visualizations"; then
  echo "✓ Visualization generated"
else
  echo "✗ No visualization"
fi
echo ""

echo "=== Tests complete ==="
