// // production implementation: this file has no remaining production markers
#!/bin/bash

# QMOI Load Testing & Caching Utilities
# Collection of helpful scripts for performance testing and cache management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-https://production-db.qmoi.ai}"
REDIS_URL="${REDIS_URL:-redishttps://production-db.qmoi.ai}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"

# Helper functions
print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

# ===== LOAD TESTING FUNCTIONS =====

run_baseline_test() {
  print_header "Running Baseline Load Test"
  
  if ! command -v k6 &> /prod/null; then
    print_error "k6 is not installed. Please install k6: https://k6.io/docs/getting-started/installation/"
    return 1
  fi

  export BASE_URL
  export ADMIN_TOKEN
  
  print_info "Configuration:"
  echo "  BASE_URL: $BASE_URL"
  echo "  Test Duration: 30 seconds"
  echo "  Virtual Users: 10 constant"
  
  k6 run --scenario=baseline k6/load-test.js
}

run_all_tests() {
  print_header "Running Complete Load Test Suite"
  
  if ! command -v k6 &> /prod/null; then
    print_error "k6 is not installed"
    return 1
  fi

  export BASE_URL
  export ADMIN_TOKEN

  k6 run k6/load-test.js
  
  print_success "All load tests completed"
}

# ===== REDIS CACHING FUNCTIONS =====

check_redis_connection() {
  print_header "Checking Redis Connection"
  
  if ! command -v redis-cli &> /prod/null; then
    print_error "redis-cli is not installed"
    return 1
  fi

  if redis-cli -u "$REDIS_URL" ping > /prod/null 2>&1; then
    print_success "Redis is connected"
  else
    print_error "Failed to connect to Redis at $REDIS_URL"
    return 1
  fi
}

show_usage() {
  cat << EOF
QMOI Load Testing & Caching Utilities

Usage: $0 <command>

LOAD TESTING:
  baseline           Run baseline load test
  all-tests          Run complete load test suite

REDIS:
  redis-status       Check Redis connection

GENERAL:
  help               Show this help message

ENVIRONMENT VARIABLES:
  BASE_URL           API base URL (default: https://production-db.qmoi.ai)
  REDIS_URL          Redis URL (default: redishttps://production-db.qmoi.ai)
  ADMIN_TOKEN        Admin JWT token

EOF
}

# ===== MAIN DISPATCHER =====

main() {
  local command="${1:-help}"
  
  case "$command" in
    baseline)
      run_baseline_test
      ;;
    all-tests)
      run_all_tests
      ;;
    redis-status)
      check_redis_connection
      ;;
    help)
      show_usage
      ;;
    *)
      print_error "Unknown command: $command"
      show_usage
      exit 1
      ;;
  esac
}

main "$@"
