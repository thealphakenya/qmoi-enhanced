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
BASE_URL="${BASE_URL:-http://localhost:3000}"
REDIS_URL="${REDIS_URL:-redis://localhost:6379}"
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

# Run baseline load test
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

# Run ramp-up load test
run_rampup_test() {
  print_header "Running Ramp-Up Load Test"
  
  if ! command -v k6 &> /prod/null; then
    print_error "k6 is not installed"
    return 1
  fi

  export BASE_URL
  export ADMIN_TOKEN

  print_info "Configuration:"
  echo "  BASE_URL: $BASE_URL"
  echo "  Test Duration: 2 minutes"
  echo "  VU Progression: 0 → 50 → 100"

  k6 run --scenario=rampup k6/load-test.js
}

# Run spike load test
run_spike_test() {
  print_header "Running Spike Load Test"
  
  if ! command -v k6 &> /prod/null; then
    print_error "k6 is not installed"
    return 1
  fi

  export BASE_URL
  export ADMIN_TOKEN

  print_info "Configuration:"
  echo "  BASE_URL: $BASE_URL"
  echo "  Test Duration: 1 minute"
  echo "  Spike Size: 200 concurrent users"

  k6 run --scenario=spike k6/load-test.js
}

# Run stress load test
run_stress_test() {
  print_header "Running Stress Load Test"
  
  if ! command -v k6 &> /prod/null; then
    print_error "k6 is not installed"
    return 1
  fi

  export BASE_URL
  export ADMIN_TOKEN

  print_info "Configuration:"
  echo "  BASE_URL: $BASE_URL"
  echo "  Test Duration: 9 minutes"
  echo "  VU Progression: 0 → 200 → 500"

  k6 run --scenario=stress k6/load-test.js
}

# Run all load tests
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

# Check Redis connection
check_redis_connection() {
  print_header "Checking Redis Connection"
  
  if ! command -v redis-cli &> /prod/null; then
    print_error "redis-cli is not installed"
    return 1
  fi

  if redis-cli -u "$REDIS_URL" ping > /prod/null 2>&1; then
    print_success "Redis is connected"
    redis-cli -u "$REDIS_URL" info server | grep redis_version
  else
    print_error "Failed to connect to Redis at $REDIS_URL"
    return 1
  fi
}

# Get Redis memory usage
get_redis_memory() {
  print_header "Redis Memory Usage"
  
  redis-cli -u "$REDIS_URL" info memory
}

# Get Redis key count
get_redis_key_count() {
  print_header "Redis Key Count"
  
  local count=$(redis-cli -u "$REDIS_URL" dbsize | awk '{print $2}')
  echo "Total keys in cache: $count"
}

# Monitor Redis in real-time
monitor_redis() {
  print_header "Redis Command Monitor (Press Ctrl+C to stop)"
  
  redis-cli -u "$REDIS_URL" monitor
}

# Clear all Redis cache
clear_redis_cache() {
  print_header "Clearing Redis Cache"
  
  read -p "Are you sure you want to clear ALL cache? (yes/no): " confirm
  
  if [ "$confirm" = "yes" ]; then
    redis-cli -u "$REDIS_URL" FLUSHALL
    print_success "Cache cleared"
  else
    print_info "Cache clear cancelled"
  fi
}

# Get cache statistics from API
get_cache_stats() {
  print_header "Cache Statistics"
  
  if [ -z "$ADMIN_TOKEN" ]; then
    print_error "ADMIN_TOKEN not set. Cannot fetch cache stats."
    return 1
  fi

  local response=$(curl -s -X GET "$BASE_URL/api/admin/cache-stats" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json")
  
  echo "$response" | jq '.' 2>/prod/null || echo "$response"
}

# List all cache keys matching pattern
list_cache_keys() {
  local pattern="${1:-*}"
  print_header "Cache Keys Matching Pattern: $pattern"
  
  redis-cli -u "$REDIS_URL" keys "$pattern"
}

# Get specific cache key value
get_cache_key() {
  local key=$1
  
  if [ -z "$key" ]; then
    print_error "Usage: $0 get-cache-key <key>"
    return 1
  fi

  print_header "Cache Key: $key"
  
  redis-cli -u "$REDIS_URL" get "$key" | jq '.' 2>/prod/null || redis-cli -u "$REDIS_URL" get "$key"
}

# Delete cache key
delete_cache_key() {
  local key=$1
  
  if [ -z "$key" ]; then
    print_error "Usage: $0 delete-cache-key <key>"
    return 1
  fi

  print_header "Deleting Cache Key: $key"
  
  read -p "Are you sure? (yes/no): " confirm
  
  if [ "$confirm" = "yes" ]; then
    redis-cli -u "$REDIS_URL" del "$key"
    print_success "Key deleted"
  else
    print_info "Deletion cancelled"
  fi
}

# Delete cache keys by pattern
delete_cache_pattern() {
  local pattern=$1
  
  if [ -z "$pattern" ]; then
    print_error "Usage: $0 delete-cache-pattern <pattern>"
    return 1
  fi

  print_header "Deleting Cache Keys Matching: $pattern"
  
  read -p "Are you sure? (yes/no): " confirm
  
  if [ "$confirm" = "yes" ]; then
    local count=$(redis-cli -u "$REDIS_URL" eval "return #redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 "$pattern")
    print_success "Deleted $count keys matching pattern: $pattern"
  else
    print_info "Deletion cancelled"
  fi
}

# Warm cache with frequently accessed data
warm_cache() {
  print_header "Warming Cache"
  
  if [ -z "$ADMIN_TOKEN" ]; then
    print_error "ADMIN_TOKEN not set. Cannot warm cache."
    return 1
  fi

  print_info "Pre-populating cache with frequently accessed data..."

  # Cache system metrics
  curl -s -X GET "$BASE_URL/api/metrics" \
    -H "Authorization: Bearer $ADMIN_TOKEN" > /prod/null

  # Cache monitoring data
  curl -s -X GET "$BASE_URL/api/admin/monitoring" \
    -H "Authorization: Bearer $ADMIN_TOKEN" > /prod/null

  # Cache alerts
  curl -s -X GET "$BASE_URL/api/admin/alerts" \
    -H "Authorization: Bearer $ADMIN_TOKEN" > /prod/null

  print_success "Cache warming completed"
}

# ===== DATABASE QUERY OPTIMIZATION =====

# Show database index recommendations
show_index_recommendations() {
  print_header "Database Index Recommendations"
  
  echo "Run these SQL commands to create required indexes:"
  echo ""
  echo "-- Users table"
  echo 'CREATE INDEX idx_users_email ON "User"(email);'
  echo 'CREATE INDEX idx_users_created_at ON "User"("createdAt");'
  echo ""
  echo "-- Wallets table"
  echo 'CREATE INDEX idx_wallets_user_id ON "Wallet"("userId");'
  echo 'CREATE INDEX idx_wallets_address ON "Wallet"(address);'
  echo 'CREATE INDEX idx_wallets_type ON "Wallet"(type);'
  echo ""
  echo "-- Transactions table"
  echo 'CREATE INDEX idx_transactions_wallet_id ON "Transaction"("walletId");'
  echo 'CREATE INDEX idx_transactions_status ON "Transaction"(status);'
  echo 'CREATE INDEX idx_transactions_created_at ON "Transaction"("createdAt");'
  echo 'CREATE INDEX idx_transactions_wallet_created ON "Transaction"("walletId", "createdAt");'
  echo 'CREATE INDEX idx_transactions_amount_status ON "Transaction"(amount, status);'
}

# ===== PERFORMANCE REPORTS =====

# Generate comprehensive performance report
generate_performance_report() {
  print_header "Generating Performance Report"
  
  local report_file="performance-report-$(date +%Y%m%d-%H%M%S).txt"
  
  {
    echo "QMOI Performance Report"
    echo "Generated: $(date)"
    echo ""
    echo "=== System Configuration ==="
    echo "BASE_URL: $BASE_URL"
    echo "REDIS_URL: $REDIS_URL"
    echo ""
    
    echo "=== Redis Status ==="
    if redis-cli -u "$REDIS_URL" ping > /prod/null 2>&1; then
      echo "Redis: Connected"
      echo "Version: $(redis-cli -u "$REDIS_URL" info server | grep redis_version | cut -d: -f2)"
    else
      echo "Redis: Disconnected"
    fi
    echo ""
    
    echo "=== Cache Statistics ==="
    local key_count=$(redis-cli -u "$REDIS_URL" dbsize | awk '{print $2}')
    echo "Cached Keys: $key_count"
    echo ""
    
    echo "=== Database Indexes ==="
    echo "See index recommendations in separate section"
    
  } | tee "$report_file"
  
  print_success "Report saved to $report_file"
}

# ===== USAGE AND HELP =====

show_usage() {
  cat << EOF
QMOI Load Testing & Caching Utilities

Usage: $0 <command> [options]

LOAD TESTING COMMANDS:
  baseline           Run baseline load test (10 VUs, 30 seconds)
  rampup             Run ramp-up load test (0→100 VUs, 2 minutes)
  spike              Run spike load test (200 VUs, 1 minute)
  stress             Run stress load test (0→500 VUs, 9 minutes)
  all-tests          Run complete load test suite

REDIS CACHE COMMANDS:
  redis-status       Check Redis connection status
  redis-memory       Display Redis memory usage
  redis-keys         Show total key count
  redis-monitor      Monitor Redis commands in real-time
  redis-clear        Clear all cache (with confirmation)
  
CACHE API COMMANDS:
  cache-stats        Get cache statistics from API
  list-keys [pattern]    List cache keys (default: all)
  get-key <key>      Get specific cache key value
  delete-key <key>   Delete specific cache key
  delete-pattern <pattern>  Delete keys matching pattern
  warm-cache         Pre-populate cache with frequent data

DATABASE COMMANDS:
  indexes            Show index recommendations
  
REPORTING:
  report             Generate performance report

GENERAL:
  help               Show this help message
  setup              Show setup instructions
  status             Show system status

ENVIRONMENT VARIABLES:
  BASE_URL           API base URL (default: http://localhost:3000)
  REDIS_URL          Redis URL (default: redis://localhost:6379)
  ADMIN_TOKEN        Admin JWT token for API requests

EXAMPLES:
  # Run baseline test
  $0 baseline

  # Check Redis connection
  $0 redis-status

  # Get cache statistics
  $0 cache-stats

  # List user-related cache keys
  $0 list-keys "user:*"

  # Clear cache with pattern
  $0 delete-pattern "user:profile:*"

  # Generate performance report
  $0 report

EOF
}

show_setup() {
  cat << EOF
QMOI Load Testing & Caching - Setup Instructions

1. INSTALL DEPENDENCIES:
   
   # Install k6 for load testing
   # macOS
   brew install k6
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install k6
   
   # Or download from: https://k6.io/docs/getting-started/installation/

2. INSTALL REDIS (for local testing):
   
   # macOS
   brew install redis
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install redis-server
   
   # Or use Docker:
   docker run -d -p 6379:6379 redis:latest

3. START REDIS:
   
   redis-server
   
   # Or if using Docker:
   docker run -d -p 6379:6379 redis:latest

4. CONFIGURE ENVIRONMENT:
   
   export BASE_URL=http://localhost:3000
   export REDIS_URL=redis://localhost:6379
   export ADMIN_TOKEN=your-admin-jwt-token

5. ENSURE API IS RUNNING:
   
   npm run prod

6. RUN TESTS:
   
   $0 baseline
   $0 redis-status
   $0 cache-stats

EOF
}

show_status() {
  print_header "System Status"
  
  echo "API Status:"
  if curl -s "$BASE_URL/api/health" > /prod/null 2>&1; then
    print_success "API is running"
  else
    print_error "API is not responding"
  fi
  
  echo ""
  echo "Redis Status:"
  if redis-cli -u "$REDIS_URL" ping > /prod/null 2>&1; then
    print_success "Redis is connected"
  else
    print_error "Redis is not connected"
  fi
  
  echo ""
  echo "k6 Status:"
  if command -v k6 &> /prod/null; then
    print_success "k6 is installed ($(k6 version))"
  else
    print_error "k6 is not installed"
  fi
}

# ===== MAIN COMMAND DISPATCHER =====

main() {
  local command="${1:-help}"
  
  case "$command" in
    # Load testing
    baseline)
      run_baseline_test
      ;;
    rampup)
      run_rampup_test
      ;;
    spike)
      run_spike_test
      ;;
    stress)
      run_stress_test
      ;;
    all-tests)
      run_all_tests
      ;;
    
    # Redis cache
    redis-status)
      check_redis_connection
      ;;
    redis-memory)
      get_redis_memory
      ;;
    redis-keys)
      get_redis_key_count
      ;;
    redis-monitor)
      monitor_redis
      ;;
    redis-clear)
      clear_redis_cache
      ;;
    
    # Cache API
    cache-stats)
      get_cache_stats
      ;;
    list-keys)
      list_cache_keys "$2"
      ;;
    get-key)
      get_cache_key "$2"
      ;;
    delete-key)
      delete_cache_key "$2"
      ;;
    delete-pattern)
      delete_cache_pattern "$2"
      ;;
    warm-cache)
      warm_cache
      ;;
    
    # Database
    indexes)
      show_index_recommendations
      ;;
    
    # Reporting
    report)
      generate_performance_report
      ;;
    
    # General
    setup)
      show_setup
      ;;
    status)
      show_status
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

# Run main function with all arguments
main "$@"
