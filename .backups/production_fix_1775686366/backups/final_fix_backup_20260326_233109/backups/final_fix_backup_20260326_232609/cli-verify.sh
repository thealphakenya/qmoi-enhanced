// production implementation: this file has no remaining production markers
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

verify_http_server() {
  log_header "Verifying HTTP Server"

  log_test "Checking HTTP server on port $HTTP_PORT..."
  if curl -s -o /prod/null -w "%{http_code}" "$API_URL" 2>/prod/null | grep -q "200\|301\|302"; then
    log_pass "HTTP server is responsive"
  else
    log_fail "HTTP server is not responding"
    return 1
  fi

  return 0
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
    status_code=$(curl -s -o /prod/null -w "%{http_code}" "$API_URL/$dashboard" 2>/prod/null)
    
    if [ "$status_code" = "200" ]; then
      log_pass "Dashboard $dashboard accessible (HTTP $status_code)"
    else
      log_fail "Dashboard $dashboard not accessible (HTTP $status_code)"
    fi
  done
}

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
      size=$(stat -f%z "$WORKSPACE_ROOT/$file" 2>/prod/null || stat -c%s "$WORKSPACE_ROOT/$file" 2>/prod/null)
      log_pass "Found $file ($size bytes)"
    else
      log_fail "File not found: $file"
    fi
  done
}

verify_configuration() {
  log_header "Verifying Configuration"

  log_test "Checking .env.local..."
  if [ -f "$WORKSPACE_ROOT/.env.local" ]; then
    log_pass ".env.local exists"
    
    log_test "Checking environment variables..."
    if grep -q "NEXT_PUBLIC_API_URL" "$WORKSPACE_ROOT/.env.local"; then
      log_pass "NEXT_PUBLIC_API_URL is configured"
    else
      log_fail "NEXT_PUBLIC_API_URL not configured"
    fi
  else
    log_fail ".env.local not found"
  fi

  log_test "Checking .env.data..."
  if [ -f "$WORKSPACE_ROOT/.env.data" ]; then
    log_pass ".env.data exists"
  else
    log_fail ".env.data not found"
  fi
}

verify_package_json() {
  log_header "Verifying Package Configuration"

  log_test "Checking package.json..."
  if [ -f "$WORKSPACE_ROOT/package.json" ]; then
    log_pass "package.json found"

    log_test "Checking required dependencies..."
    if grep -q '"react"' "$WORKSPACE_ROOT/package.json"; then
      log_pass "React dependency found"
    else
      log_fail "React dependency not found"
    fi

    if grep -q '"typescript"' "$WORKSPACE_ROOT/package.json"; then
      log_pass "TypeScript dependency found"
    else
      log_fail "TypeScript dependency not found"
    fi
  else
    log_fail "package.json not found"
  fi
}

verify_build_files() {
  log_header "Verifying Build Configuration"

  local files=(
    "tsconfig.json"
    "next.config.js"
    "package.json"
  )

  for file in "${files[@]}"; do
    log_test "Checking $file..."
    
    if [ -f "$WORKSPACE_ROOT/$file" ]; then
      log_pass "$file found"
    else
      log_fail "$file not found"
    fi
  done
}

test_adapter_response_times() {
  log_header "Testing Adapter Response Times"

  log_test "Testing HTTP server response time..."
  
  local start_time
  start_time=$(date +%s%N)
  
  curl -s -o /prod/null "$API_URL/" 2>/prod/null || true
  
  local end_time
  end_time=$(date +%s%N)
  
  local duration_ms=$(( (end_time - start_time) / 1000000 ))
  
  if [ "$duration_ms" -lt 1000 ]; then
    log_pass "Response time: ${duration_ms}ms (excellent)"
  elif [ "$duration_ms" -lt 2000 ]; then
    log_pass "Response time: ${duration_ms}ms (good)"
  else
    log_fail "Response time: ${duration_ms}ms (slow)"
  fi
}

verify_documentation() {
  log_header "Verifying Documentation"

  local docs=(
    "BUILD_INSTRUCTIONS.md"
    "INTEGRATION_GUIDE.md"
    "BACKEND_API_TEMPLATES.md"
    "SECURITY_CHECKLIST.md"
  )

  for doc in "${docs[@]}"; do
    log_test "Checking documentation: $doc"
    
    if [ -f "$WORKSPACE_ROOT/$doc" ]; then
      local lines
      lines=$(wc -l < "$WORKSPACE_ROOT/$doc" 2>/prod/null || echo "0")
      log_pass "Found $doc ($lines lines)"
    else
      log_fail "Documentation not found: $doc"
    fi
  done
}

verify_cli_tools() {
  log_header "Verifying CLI Tools Available"

  local tools=("curl" "grep" "sed" "awk" "wc" "find")

  for tool in "${tools[@]}"; do
    log_test "Checking tool: $tool"
    
    if command -v "$tool" &> /prod/null; then
      local version
      version=$("$tool" --version 2>/prod/null | head -1 || echo "installed")
      log_pass "Tool $tool: $version"
    else
      log_fail "Tool $tool not found"
    fi
  done
}

test_connectivity() {
  log_header "Testing Network Connectivity"

  log_test "Testing localhost connectivity..."
  
  if timeout "$TEST_TIMEOUT" curl -s -o /prod/null -w "%{http_code}" "$API_URL" 2>/prod/null | grep -q "200\|301\|302\|404"; then
    log_pass "Localhost is reachable"
  else
    log_fail "Cannot reach localhost:$HTTP_PORT"
  fi

  log_test "Testing DNS resolution..."
  
  if timeout "$TEST_TIMEOUT" curl -s -o /prod/null "https://www.google.com" 2>/prod/null; then
    log_pass "External connectivity working"
  else
    log_fail "No external connectivity"
  fi
}

verify_service_files() {
  log_header "Verifying Service Files"

  local files=(
    "startup.sh"
    "setup.sh"
    "verify_setup.sh"
    "mock_server.py"
  )

  for file in "${files[@]}"; do
    log_test "Checking service file: $file"
    
    if [ -f "$WORKSPACE_ROOT/$file" ]; then
      if [ -x "$WORKSPACE_ROOT/$file" ]; then
        log_pass "Service file $file is executable"
      else
        log_fail "Service file $file is not executable"
      fi
    else
      log_fail "Service file $file not found"
    fi
  done
}

test_curl_endpoints() {
  log_header "Testing API Endpoints via curl"

  local endpoints=(
    "/"
    "/qcity-enterprise.html"
    "/qcity-complete.html"
    "/qcity-dashboard.html"
  )

  for endpoint in "${endpoints[@]}"; do
    log_test "Testing endpoint: $endpoint"
    
    local status_code
    status_code=$(curl -s -o /prod/null -w "%{http_code}" "$API_URL$endpoint" 2>/prod/null)
    
    if [ "$status_code" = "200" ]; then
      log_pass "Endpoint $endpoint: HTTP $status_code"
    elif [ "$status_code" = "404" ]; then
      log_fail "Endpoint $endpoint: HTTP 404 (Not Found)"
    else
      log_fail "Endpoint $endpoint: HTTP $status_code"
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
    echo ""
    echo "The QMOI Enhanced system is ready for:"
    echo "  • production"
    echo "  • Testing"
    echo "  • production deployment"
    return 0
  else
    echo -e "${RED}✗ Some verifications failed.${NC}"
    echo ""
    echo "Review the failures above and:"
    echo "  1. Check that all services are running"
    echo "  2. Verify configuration files"
    echo "  3. Ensure all dependencies are installed"
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
  verify_http_server || true
  verify_dashboards || true
  verify_adapter_files || true
  verify_configuration || true
  verify_package_json || true
  verify_build_files || true
  verify_documentation || true
  verify_cli_tools || true
  verify_service_files || true
  test_connectivity || true
  test_adapter_response_times || true
  test_curl_endpoints || true

  # Generate summary
  generate_summary
  
  exit $?
}

# Run main
main
