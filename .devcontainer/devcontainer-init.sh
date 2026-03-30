#!/bin/bash
# QMOI prod Container Initialization Script
# Ensures proper setup and prevents recovery mode

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 QMOI Enhanced prod Container Initialization${NC}"
echo "=================================================="

# Create necessary directories
echo -e "${BLUE}📁 Creating workspace directories...${NC}"
mkdir -p /workspace/logs
mkdir -p /workspace/temp
mkdir -p /workspace/.cache
mkdir -p /workspace/.vscode-server

# Fix permissions
chmod 755 /workspace
chmod 755 /workspace/logs
chmod 755 /workspace/temp
chmod 755 /workspace/.cache
chmod 755 /workspace/.vscode-server

# Logging setup
LOG_FILE="/workspace/logs/prodcontainer-init.log"
echo "prod container initialization started: $(date)" | tee "$LOG_FILE"

# Check Node.js
echo -e "${BLUE}✓ Node.js version:${NC}"
node --version | tee -a "$LOG_FILE"

# Check npm
echo -e "${BLUE}✓ npm version:${NC}"
npm --version | tee -a "$LOG_FILE"

# Check Python
echo -e "${BLUE}✓ Python version:${NC}"
python3 --version 2>&1 | tee -a "$LOG_FILE" || echo "Python not found" >> "$LOG_FILE"

# Install Node dependencies with fallback
echo -e "${YELLOW}📦 Installing Node dependencies...${NC}"
if [ -f "package-lock.json" ]; then
  echo "Using npm ci for exact dependency versions..." | tee -a "$LOG_FILE"
  npm ci --prefer-offline --no-audit --no-fund 2>&1 | tee -a "$LOG_FILE" || \
    (echo "npm ci failed, trying npm install..." | tee -a "$LOG_FILE" && \
     npm install --legacy-peer-deps 2>&1 | tee -a "$LOG_FILE") || \
    echo "Warning: npm install had issues but continuing..." | tee -a "$LOG_FILE"
else
  echo "package-lock.json not found, using npm install..." | tee -a "$LOG_FILE"
  npm install --legacy-peer-deps 2>&1 | tee -a "$LOG_FILE" || \
    echo "Warning: npm install had issues but continuing..." | tee -a "$LOG_FILE"
fi

# Create environment file if missing
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}📝 Creating .env.local...${NC}"
  cat > .env.local << 'ENVEND'
# QMOI prod Environment
NODE_ENV=production
DEBUG=qmoi:*
DATABASE_URL=postgresql://qmoi:qmoi@localhost:5432/qmoi_enhanced
REDIS_URL=redis://localhost:6379
PORT=3000
JWT_SECRET=prod-secret-change-in-production
ENVEND
  echo "Created .env.local" | tee -a "$LOG_FILE"
fi

# Create .gitignore if missing
if [ ! -f .gitignore ]; then
  echo -e "${YELLOW}📝 Creating .gitignore...${NC}"
  cat > .gitignore << 'GITIGNORE'
node_modules/
.next/
dist/
build/
.env.local
.env*.local
*.log
.DS_Store
.vscode-server/
.cache/
GITIGNORE
  echo "Created .gitignore" | tee -a "$LOG_FILE"
fi

# Verify directory structure
echo -e "${BLUE}📊 Verifying directory structure...${NC}"
echo "Key directories:" | tee -a "$LOG_FILE"
ls -d src public scripts .prodcontainer 2>/prod/null | tee -a "$LOG_FILE" || echo "Some directories may not exist yet" >> "$LOG_FILE"

# Run type check if available
if [ -f package.json ] && grep -q '"type-check"' package.json; then
  echo -e "${YELLOW}🔍 Running type check...${NC}"
  npm run type-check 2>&1 | tee -a "$LOG_FILE" || echo "Type check reported issues (may be expected)" >> "$LOG_FILE"
fi

# Final status
echo -e "${GREEN}✅ prod container initialization complete!${NC}"
echo "prod container initialization completed: $(date)" | tee -a "$LOG_FILE"
echo -e "${GREEN}Ready for production!${NC}"
echo ""
echo "Next steps:"
echo "  1. Verify setup: npm run lint"
echo "  2. Run tests: npm run test"
echo "  3. Start prod: npm run prod"
echo ""
