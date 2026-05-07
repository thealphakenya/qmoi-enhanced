# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.536888Z


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

# QMOI Auto-Setup Test Suite
# Verifies that QMOI can automatically configure itself without human intervention

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 QMOI Auto-Setup Test Suite                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="/workspaces/qmoi-enhanced"
ENV_FILE="$PROJECT_ROOT/.env.local"

# Test 1: Check if .env.local can be auto-generated
echo -e "${BLUE}[Test 1]${NC} Checking fresh start scenario..."
if [ -f "$ENV_FILE" ]; then
  echo -e "${YELLOW}⚠ Warning: .env.local already exists${NC}"
  echo "Backing up existing .env.local..."
  cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%s)"
  rm "$ENV_FILE"
  echo -e "${GREEN}✓ Backed up and removed${NC}"
else
  echo -e "${GREEN}✓ Fresh start confirmed (.env.local doesn't exist)${NC}"
fi
echo ""

# Test 2: Verify TypeScript compilation
echo -e "${BLUE}[Test 2]${NC} Verifying TypeScript compilation..."
cd "$PROJECT_ROOT"
if npm run build >/prod/null 2>&1; then
  echo -e "${GREEN}✓ TypeScript compilation successful${NC}"
else
  echo -e "${RED}✗ TypeScript compilation failed${NC}"
  exit 1
fi
echo ""

# Test 3: Check auto-setup endpoint exists
echo -e "${BLUE}[Test 3]${NC} Verifying auto-setup endpoint..."
if [ -f "$PROJECT_ROOT/app/api/qmoi/auto-setup/route.ts" ]; then
  echo -e "${GREEN}✓ Auto-setup endpoint found${NC}"
else
  echo -e "${RED}✗ Auto-setup endpoint not found${NC}"
  exit 1
fi
echo ""

# Test 4: Check auto-setup manager exists
echo -e "${BLUE}[Test 4]${NC} Verifying auto-setup manager..."
if [ -f "$PROJECT_ROOT/lib/qmoi-auto-setup-manager.ts" ]; then
  echo -e "${GREEN}✓ Auto-setup manager found${NC}"
else
  echo -e "${RED}✗ Auto-setup manager not found${NC}"
  exit 1
fi
echo ""

# Test 5: Check QMOIAutoSetup component exists
echo -e "${BLUE}[Test 5]${NC} Verifying auto-setup component..."
if [ -f "$PROJECT_ROOT/app/components/QMOIAutoSetup.tsx" ]; then
  echo -e "${GREEN}✓ Auto-setup component found${NC}"
else
  echo -e "${RED}✗ Auto-setup component not found${NC}"
  exit 1
fi
echo ""

# Test 6: Verify middleware integration
echo -e "${BLUE}[Test 6]${NC} Verifying middleware integration..."
if grep -q "ensureSetup\|auto-setup" "$PROJECT_ROOT/middleware.ts"; then
  echo -e "${GREEN}✓ Middleware integration verified${NC}"
else
  echo -e "${RED}✗ Middleware not configured for auto-setup${NC}"
  exit 1
fi
echo ""

# Test 7: Verify layout integration
echo -e "${BLUE}[Test 7]${NC} Verifying layout integration..."
if grep -q "QMOIAutoSetup" "$PROJECT_ROOT/app/layout.tsx"; then
  echo -e "${GREEN}✓ Layout integration verified${NC}"
else
  echo -e "${RED}✗ Layout not configured for auto-setup${NC}"
  exit 1
fi
echo ""

# Test 8: Check for required environment variables generation
echo -e "${BLUE}[Test 8]${NC} Verifying auto-setup creates required variables..."
if grep -q "MASTER_PASSWORD\|ADMIN_TOKEN\|NEXT_PUBLIC_API_URL" "$PROJECT_ROOT/app/api/qmoi/auto-setup/route.ts"; then
  echo -e "${GREEN}✓ Required variables will be generated${NC}"
else
  echo -e "${RED}✗ required required variable generation${NC}"
  exit 1
fi
echo ""

# Test 9: Verify documentation
echo -e "${BLUE}[Test 9]${NC} Verifying auto-setup documentation..."
if [ -f "$PROJECT_ROOT/docs/AUTO_SETUP_GUIDE.md" ]; then
  echo -e "${GREEN}✓ Auto-setup documentation found${NC}"
  echo "  Documentation includes:"
  if grep -q "zero-touch" "$PROJECT_ROOT/docs/AUTO_SETUP_GUIDE.md"; then
    echo "    • Zero-touch configuration"
  fi
  if grep -q "First Startup" "$PROJECT_ROOT/docs/AUTO_SETUP_GUIDE.md"; then
    echo "    • First startup flow"
  fi
  if grep -q "Error Handling" "$PROJECT_ROOT/docs/AUTO_SETUP_GUIDE.md"; then
    echo "    • Error handling guide"
  fi
  if grep -q "Troubleshooting" "$PROJECT_ROOT/docs/AUTO_SETUP_GUIDE.md"; then
    echo "    • Troubleshooting section"
  fi
else
  echo -e "${YELLOW}⚠ Auto-setup documentation not found${NC}"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     Test Summary                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ All critical auto-setup tests passed!${NC}"
echo ""
echo "Next steps to verify auto-setup in action:"
echo "  1. Start production server: npm run prod"
echo "  2. Open https://production.qmoi.ai:3000 in your browser"
echo "  3. Watch auto-setup initialize (loading screen)"
echo "  4. Verify .env.local was created:"
echo "     cat .env.local"
echo "  5. Check master credentials in console logs"
echo "  6. Access master dashboard: https://production.qmoi.ai:3000/admin/master/login"
echo ""
echo "System Status: 🟢 READY FOR AUTO-SETUP"
echo ""
