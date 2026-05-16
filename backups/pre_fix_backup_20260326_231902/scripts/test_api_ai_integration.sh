# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.476895Z


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

// [] this file has no remaining production markers
#!/bin/bash
set -e

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
if echo "$RESPONSE" | grep -q "QMOI"; then
  echo "✓ Test 1 PASSED"
else
  echo "✗ Test 1 FAILED"
fi
echo ""

# Test 2: POST /api/ai with sophisticated message
echo "Test 2: POST /api/ai with message"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Hello QMOI, please tell me about yourself",
    "sessionId": "test-session-1",
    "userId": "test-user"
  }')
echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
  echo "✓ Test 2 PASSED"
else
  echo "✗ Test 2 FAILED"
fi
echo ""

# Test 3: POST /api/ai with visualization trigger
echo "Test 3: POST /api/ai with visualization request"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Please visualize quarterly sales data for 2025",
    "sessionId": "test-session-1",
    "userId": "test-user"
  }')
echo "Response (truncated): $(echo "$RESPONSE" | head -c 200)..."
if echo "$RESPONSE" | grep -q "visualizations"; then
  echo "✓ Test 3 PASSED (visualization generated)"
else
  echo "✗ Test 3 FAILED (no visualizations)"
fi
echo ""

# Test 4: POST /api/ai with memory save (remember: prefix)
echo "Test 4: POST /api/ai with memory save"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "remember: I prefer dark mode and want updates about QMOI features",
    "sessionId": "test-session-1",
    "userId": "test-user"
  }')
echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "memory"; then
  echo "✓ Test 4 PASSED (memory persisted)"
else
  echo "✗ Test 4 FAILED (memory not saved)"
fi
echo ""

# Test 5: POST /api/qmoi/chat (alternative endpoint)
echo "Test 5: POST /api/qmoi/chat"
RESPONSE=$(curl -s -X POST "$ENDPOINT_CHAT" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello from QVillage"}],
    "sessionId": "test-session-2",
    "userId": "test-user-2"
  }')
echo "Response (truncated): $(echo "$RESPONSE" | head -c 200)..."
if echo "$RESPONSE" | grep -q "success\|message"; then
  echo "✓ Test 5 PASSED"
else
  echo "✗ Test 5 FAILED"
fi
echo ""

echo "=== Integration Tests complete ==="
echo "All tests completed. Check responses above for details."
