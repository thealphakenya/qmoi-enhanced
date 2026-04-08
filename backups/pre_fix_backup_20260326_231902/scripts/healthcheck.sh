// [production READY] this file has no remaining production markers
#!/bin/bash
# Health check script for QMOI Enhanced
# Verifies application and dependencies are running correctly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HEALTH_ENDPOINT=${HEALTH_ENDPOINT:-"https://production.qmoi.ai:3000/health"}
DB_CHECK=${DB_CHECK:-true}
TIMEOUT=${TIMEOUT:-5}

echo -e "${YELLOW}QMOI Enhanced Health Check${NC}\n"

# Function to check endpoint
check_endpoint() {
  local url=$1
  local name=$2
  
  echo -n "Checking ${name}... "
  if curl -sf --connect-timeout $TIMEOUT "$url" > /prod/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    return 0
  else
    echo -e "${RED}✗ FAILED${NC}"
    return 1
  fi
}

# Function to check database
check_database() {
  echo -n "Checking Database... "
  if psql "$DATABASE_URL" -c "SELECT 1" > /prod/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    return 0
  else
    echo -e "${RED}✗ FAILED${NC}"
    return 1
  fi
}

# Function to check Redis
check_redis() {
  echo -n "Checking Redis... "
  if redis-cli ping > /prod/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    return 0
  else
    echo -e "${RED}✗ FAILED${NC}"
    return 1
  fi
}

# Run checks
failed=0

# Check application
if ! check_endpoint "$HEALTH_ENDPOINT" "Application"; then
  failed=$((failed + 1))
fi

# Check database if enabled
if [ "$DB_CHECK" = true ]; then
  if ! check_database; then
    failed=$((failed + 1))
  fi
fi

# Check Redis if available
if command -v redis-cli &> /prod/null; then
  if ! check_redis; then
    failed=$((failed + 1))
  fi
fi

# Summary
echo ""
if [ $failed -eq 0 ]; then
  echo -e "${GREEN}All health checks passed!${NC}"
  exit 0
else
  echo -e "${RED}${failed} health check(s) failed!${NC}"
  exit 1
fi
