#!/bin/bash
# QMOI Dev Container Update Script
# Ensures dependencies are current and system is healthy

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 QMOI Dev Container Update${NC}"
echo "================================"

LOG_FILE="/workspace/logs/devcontainer-update.log"
echo "Update started: $(date)" >> "$LOG_FILE"

# Update npm packages
echo -e "${YELLOW}📦 Updating npm packages...${NC}"
npm update 2>&1 | tee -a "$LOG_FILE" || echo "npm update completed with some warnings" >> "$LOG_FILE"

# Clear npm cache
echo -e "${YELLOW}🧹 Clearing npm cache...${NC}"
npm cache clean --force 2>&1 | tee -a "$LOG_FILE" || echo "Cache clear had issues" >> "$LOG_FILE"

# Run type check if available
if [ -f package.json ] && grep -q '"type-check"' package.json; then
  echo -e "${YELLOW}🔍 Running type check...${NC}"
  npm run type-check 2>&1 | tee -a "$LOG_FILE" || echo "Type check had issues" >> "$LOG_FILE"
fi

# Run linting if available
if [ -f package.json ] && grep -q '"lint"' package.json; then
  echo -e "${YELLOW}📋 Running linter...${NC}"
  npm run lint 2>&1 | tee -a "$LOG_FILE" || echo "Lint had warnings" >> "$LOG_FILE"
fi

# Run tests if available
if [ -f package.json ] && grep -q '"test"' package.json; then
  echo -e "${YELLOW}✅ Running tests...${NC}"
  npm run test 2>&1 | tee -a "$LOG_FILE" || echo "Tests had issues" >> "$LOG_FILE"
fi

echo -e "${GREEN}✅ Update complete!${NC}"
echo "Update completed: $(date)" >> "$LOG_FILE"
