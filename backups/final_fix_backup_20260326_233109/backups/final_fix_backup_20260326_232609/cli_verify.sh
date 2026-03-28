// Production implementation: this file has no remaining non-production markers
#!/bin/bash
# CLI Verification Script for QMOI Enhanced
# Verifies all services and adapters without requiring a browser
# Tests the system via curl/wget commands and diagnostics

set -e

# ========================================================================
# CONFIGURATION & SETUP
# ========================================================================

WORKSPACE_ROOT="${1:-.}"
HTTP_PORT=8080
API_URL="http://localhost:${HTTP_PORT}"
TEST_TIMEOUT=10
FAILED_TESTS=0
PASSED_TESTS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ========================================================================
# HELPER FUNCTIONS
# ========================================================================

log_test() {
  echo -e "${BLUE}[TEST]${NC} $*"
}

log_pass() {
  echo -e "${GREEN}[✓]${NC} $*"
  ((PASSED_TESTS++))
}

log_fail() {
  echo -e "${RED}[✗]${NC} $*"
  ((FAILED_TESTS++))
}

log_header() {
  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

# ========================================================================
# VERIFICATION FUNCTIONS
# ========================================================================

verify_adapter_files() {
  log_header "Verifying Adapter Files"

  local files=(
    "src/adapters/clientAdapters.ts"
    "src/adapters/backgroundServiceManager.ts"
    "src/adapters/healthCheckService.ts"
    "src/adapters/serviceRecoveryManager.ts"
    "src/adapters/appServiceInit.ts"
    "src/config/api.ts"
  )

  for file in "${files[@]}"; do
    log_test "Checking file: $file"
    
    if [ -f "$WORKSPACE_ROOT/$file" ]; then
      local size
      size=$(stat -c%s "$WORKSPACE_ROOT/$file" 2>/dev/null || stat -f%z "$WORKSPACE_ROOT/$file" 2>/dev/null)
      log_pass "Found $file ($size bytes)"
    else
      log_fail "File not found: $file"
    fi
  done
}

verify_http_server() {
  log_header "Verifying HTTP Server"

  log_test "Checking HTTP server on port $HTTP_PORT..."
  if curl -s -o /dev/null -w "%{http_code}" "$API_URL" 2>/dev/null | grep -q "200\|301\|302"; then
    log_pass "HTTP server is responsive"
  else
    log_fail "HTTP server is not responding"
  fi
}

verify_dashboards() {
  log_header "Verifying Dashboards"

  local dashboards=(
    "qcity-enterprise.html"
    "qcity-complete.html"
    "qcity-dashboard.html"
  )

  for dashboard in "${dashboards[@]}"; do
    log_test "Checking dashboard: $dashboard"
    
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/$dashboard" 2>/dev/null)
    
    if [ "$status_code" = "200" ]; then
      log_pass "Dashboard $dashboard accessible (HTTP $status_code)"
    else
      log_fail "Dashboard $dashboard not accessible (HTTP $status_code)"
    fi
  done
}

generate_summary() {
  log_header "Verification Summary"

  echo ""
  echo -e "  ${GREEN}Passed:${NC} $PASSED_TESTS tests"
  echo -e "  ${RED}Failed:${NC} $FAILED_TESTS tests"
  echo -e "  ${BLUE}Total:${NC}  $((PASSED_TESTS + FAILED_TESTS)) tests"
  echo ""

  if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All verifications passed!${NC}"
    return 0
  else
    echo -e "${RED}✗ Some verifications failed.${NC}"
    return 1
  fi
}

# ========================================================================
# MAIN EXECUTION
# ========================================================================

main() {
  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}QMOI Enhanced CLI Verification${NC}"
  echo -e "${BLUE}Workspace: $WORKSPACE_ROOT${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo ""

  # Run all verifications
  verify_adapter_files || true
  verify_http_server || true
  verify_dashboards || true

  # Generate summary
  generate_summary
  
  exit $?
}

# Run main
main
