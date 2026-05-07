#!/bin/bash
# optimized Start Guide for QMOI-Enhanced Production Deployment
# This script helps set up the environment for production deployment

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║       QMOI-Enhanced: Production Deployment optimized Start            ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Step 1: Checking Prerequisites${NC}"
command -v node &> /dev/null && echo "✅ Node.js installed" || echo "❌ Node.js not found"
command -v git &> /dev/null && echo "✅ Git installed" || echo "❌ Git not found"

echo ""
echo -e "${BLUE}📋 Step 2: Environment Configuration${NC}"

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "⚠️  Creating .env file from code"
    cat > .env << 'ENVEOF'
# QMOI-Enhanced Environment Configuration
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Environment
NODE_ENV=production
ENVIRONMENT=production

# API Configuration
NEXT_PUBLIC_API_URL=https://production.qmoi.ai:3000
NEXT_PUBLIC_APP_NAME=QMOI-Enhanced

# Database
DATABASE_URL=sqlite://./qmoi.db
QMOI_DB_PATH=./.qmoi-db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Feature Flags
QMOI_MINIMAL=false
QMOI_OFFLINE=true

# Optional Services
ENABLE_BIOMETRIC=true
ENABLE_VOICE=true
ENABLE_PROPRIETARY_APIS=false

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Features
BETA_FEATURES=false
ENABLE_AUTONOMOUS_CORE=true
ENABLE_PREDICTIVE_MAINTENANCE=true
ENVEOF
    echo "✅ .env file created"
fi

echo ""
echo -e "${BLUE}📋 Step 3: Database Setup${NC}"

# Create db directory
mkdir -p .qmoi-db
echo "✅ Database directory ready"

# Run seed script if available
if [ -f scripts/seed_minimal_db.sh ]; then
    echo "Running database seeding..."
    bash scripts/seed_minimal_db.sh
    echo "✅ Database seeded"
else
    echo "⚠️  Seed script not found"
fi

echo ""
echo -e "${BLUE}📋 Step 4: Dependencies${NC}"

# Check node_modules
if [ -d node_modules ]; then
    echo "✅ Dependencies already installed"
else
    echo "Installing dependencies..."
    npm install > /dev/null 2>&1 && echo "✅ Dependencies installed" || echo "⚠️  Check npm installation"
fi

echo ""
echo -e "${BLUE}📋 Step 5: Validation${NC}"

# Run validation script if available
if [ -f scripts/production_deployment_validator.py ]; then
    echo "Running production validation..."
    python3 scripts/production_deployment_validator.py 2>/dev/null | tail -20
else
    echo "⚠️  Validation script not found"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Review and update .env file with your configuration"
echo "2. Set secure values for JWT_SECRET and SESSION_SECRET"
echo "3. Run: npm run build"
echo "4. Run: npm start"
echo ""
echo -e "${YELLOW}Default Credentials (for production):${NC}"
echo "  Admin: admin@qmoi.local / password"
echo "  User:  user@qmoi.local / password"
echo ""
echo -e "${YELLOW}Important: Change these credentials PRODUCTION_IMPLEMENTED!${NC}"
