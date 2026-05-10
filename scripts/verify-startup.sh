#!/bin/bash

# QMOI Enhanced - Startup Verification Script
# This script verifies that the environment is properly configured before startup

set -e

echo ""
echo "🔍 QMOI Enhanced - Startup Verification"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FAILED=0

# Check required files
check_files() {
  echo -e "${BLUE}📋 Checking required files...${NC}"
  
  local files=(".env" "package.json" "prisma/schema.prisma" "lib/auth-service.ts" "app/api/auth/signin/route.ts")
  
  for file in "${files[@]}"; do
    if [ -f "$file" ]; then
      echo -e "${GREEN}✅ Found: $file${NC}"
    else
      echo -e "${RED}❌ Missing: $file${NC}"
      FAILED=$((FAILED + 1))
    fi
  done
  echo ""
}

# Check environment variables
check_env_vars() {
  echo -e "${BLUE}📋 Checking environment variables...${NC}"
  
  local vars=("DATABASE_URL" "JWT_SECRET" "ENCRYPTION_KEY")
  
  for var in "${vars[@]}"; do
    if [ -z "${!var}" ]; then
      echo -e "${RED}❌ Missing: $var${NC}"
      FAILED=$((FAILED + 1))
    else
      echo -e "${GREEN}✅ Set: $var${NC}"
    fi
  done
  echo ""
}

# Check Node.js and npm
check_tools() {
  echo -e "${BLUE}📋 Checking tools...${NC}"
  
  if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"
  else
    echo -e "${RED}❌ Node.js not found${NC}"
    FAILED=$((FAILED + 1))
  fi
  
  if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm: ${NPM_VERSION}${NC}"
  else
    echo -e "${RED}❌ npm not found${NC}"
    FAILED=$((FAILED + 1))
  fi
  echo ""
}

# Check dependencies
check_dependencies() {
  echo -e "${BLUE}📋 Checking installed dependencies...${NC}"
  
  if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules directory exists${NC}"
    
    local deps=("bcrypt" "@prisma/client" "winston" "next" "react")
    for dep in "${deps[@]}"; do
      if [ -d "node_modules/$dep" ]; then
        echo -e "${GREEN}   ✓ $dep${NC}"
      else
        echo -e "${YELLOW}   ⚠️  $dep (not found)${NC}"
      fi
    done
  else
    echo -e "${RED}❌ node_modules not found - run: npm install${NC}"
    FAILED=$((FAILED + 1))
  fi
  echo ""
}

# Check database connectivity
check_database() {
  echo -e "${BLUE}📋 Checking database connectivity...${NC}"
  
  if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not configured${NC}"
    FAILED=$((FAILED + 1))
    echo ""
    return
  fi
  
  # Try to check with Prisma client
  if npx prisma db execute --stdin --file /dev/null 2>/dev/null || timeout 3 npx prisma client validate 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection established${NC}"
  else
    echo -e "${YELLOW}⚠️  Cannot verify database connection${NC}"
    echo "   Make sure PostgreSQL is running and DATABASE_URL is correct"
  fi
  echo ""
}

# Check auth system files
check_auth_system() {
  echo -e "${BLUE}📋 Checking authentication system...${NC}"
  
  local auth_files=("lib/auth-service.ts" "lib/rbac.ts" "app/api/auth/signin/route.ts" "app/api/auth/signup/route.ts" "prisma/schema.prisma")
  
  for file in "${auth_files[@]}"; do
    if [ -f "$file" ]; then
      echo -e "${GREEN}✅ Auth file: $file${NC}"
    else
      echo -e "${YELLOW}⚠️  Auth file missing: $file${NC}"
    fi
  done
  echo ""
}

# Display summary
display_summary() {
  echo -e "${BLUE}════════════════════════════════════════════${NC}"
  
  if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo -e "${BLUE}Ready to start with:${NC}"
    echo -e "  Development:  ${YELLOW}npm run dev${NC}"
    echo -e "  Production:   ${YELLOW}npm run prod:start${NC}"
  else
    echo -e "${RED}❌ $FAILED issue(s) found${NC}"
    echo ""
    echo -e "${BLUE}Please fix the issues above before starting${NC}"
    exit 1
  fi
  echo ""
}

# Main flow
echo -e "${BLUE}🎯 Running startup verification...${NC}"
echo ""

check_files
check_env_vars
check_tools
check_dependencies
check_database
check_auth_system
display_summary

echo -e "${BLUE}════════════════════════════════════════════${NC}"
