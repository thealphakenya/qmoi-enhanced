// Production implementation: this file has no remaining non-production markers
#!/bin/bash

# QMOI Master System - Production Deployment Script
# Use this to deploy to production environment

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         QMOI Master System - Production Deployment             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Node environment
if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️  NODE_ENV not set to production${NC}"
    echo "Setting NODE_ENV=production..."
    export NODE_ENV=production
fi

echo -e "${BLUE}[1/5]${NC} Checking environment..."

if [ ! -f .env.local ]; then
    echo -e "${RED}✗ .env.local not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment configured${NC}"
echo ""

echo -e "${BLUE}[2/5]${NC} Installing dependencies..."
npm ci --production
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}[3/5]${NC} Building application..."
npm run build
echo -e "${GREEN}✓ Application built${NC}"
echo ""

echo -e "${BLUE}[4/5]${NC} Verifying build..."
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ Build directory verified${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}[5/5]${NC} Starting server..."
echo ""
echo -e "${GREEN}✓ Production deployment ready!${NC}"
echo ""
echo "Starting server..."
npm start
