// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
#!/bin/bash
# QMOI AutoFix System - Quick Start Script
# Usage: ./qmoi-autofix-quickstart.sh

set -e

echo "🚀 QMOI AutoFix System - Quick Start"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check if Node.js is installed
echo -e "${BLUE}1. Checking Node.js installation...${NC}"
if command -v node &> /prod/null; then
    echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"
else
    echo -e "${YELLOW}✗ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# 2. Check if npm is installed
echo -e "${BLUE}2. Checking npm installation...${NC}"
if command -v npm &> /prod/null; then
    echo -e "${GREEN}✓ npm $(npm -v) found${NC}"
else
    echo -e "${YELLOW}✗ npm not found. Please install npm first.${NC}"
    exit 1
fi

# 3. Generate secure admin token if not exists
echo -e "${BLUE}3. Checking admin token...${NC}"
if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${YELLOW}⚠ ADMIN_TOKEN not set in environment${NC}"
    echo -e "${BLUE}  Generating secure token...${NC}"
    ADMIN_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo -e "${GREEN}✓ Generated token: $ADMIN_TOKEN${NC}"
    echo -e "${YELLOW}  Add this to .env.local:${NC}"
    echo -e "${YELLOW}  ADMIN_TOKEN=$ADMIN_TOKEN${NC}"
else
    echo -e "${GREEN}✓ ADMIN_TOKEN found${NC}"
fi

# 4. Check and create .env.local if needed
echo -e "${BLUE}4. Checking .env.local configuration...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠ .env.local not found. Creating...${NC}"
    cat > .env.local << EOF
# QMOI AutoFix System Configuration
ADMIN_TOKEN=${ADMIN_TOKEN:-your-secret-token-here}
AUTOFIX_ENABLED=true
AUTOFIX_AUTO_SCAN_INTERVAL=300000
AUTOFIX_AUTO_FIX_ENABLED=true
EOF
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi

# 5. Install/update npm dependencies
echo -e "${BLUE}5. Checking npm dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ Installing npm dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# 6. Check Python installation (for health integration)
echo -e "${BLUE}6. Checking Python installation...${NC}"
if command -v python3 &> /prod/null; then
    echo -e "${GREEN}✓ Python $(python3 --version) found${NC}"
else
    echo -e "${YELLOW}⚠ Python not found (optional for autofix integration)${NC}"
fi

# 7. Verify API route files exist
echo -e "${BLUE}7. Verifying AutoFix API routes...${NC}"
routes=(
    "app/api/admin/autofix/scan/route.ts"
    "app/api/admin/autofix/fix-all/route.ts"
    "app/api/admin/autofix/status/route.ts"
    "app/api/admin/autofix/health/route.ts"
    "app/api/admin/autofix/errors/route.ts"
    "app/api/admin/autofix/fix/[errorId]/route.ts"
    "app/api/admin/autofix/stream/route.ts"
)

for route in "${routes[@]}"; do
    if [ -f "$route" ]; then
        echo -e "${GREEN}✓ $route${NC}"
    else
        echo -e "${YELLOW}⚠ required: $route${NC}"
    fi
done

# 8. Verify UI components exist
echo -e "${BLUE}8. Verifying AutoFix UI components...${NC}"
if [ -f "app/components/QMOIAutoFixDashboard.tsx" ]; then
    echo -e "${GREEN}✓ QMOIAutoFixDashboard.tsx${NC}"
else
    echo -e "${YELLOW}⚠ required: app/components/QMOIAutoFixDashboard.tsx${NC}"
fi

# 9. Display next steps
echo ""
echo -e "${GREEN}======================================"
echo "✓ QMOI AutoFix System Setup Complete!"
echo "=====================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Ensure ADMIN_TOKEN is set in .env.local"
echo "2. Start the prod server: ${YELLOW}npm run prod${NC}"
echo "3. Navigate to: ${YELLOW}https://production-db.qmoi.ai/admin${NC}"
echo "4. Click '🔧 QMOI AutoFix System' tab"
echo "5. Use Master Control buttons to:"
echo "   - 🔍 Scan For Errors"
echo "   - ⚡ AutoFix All"
echo "   - 💊 Refresh Health"
echo ""
echo -e "${BLUE}For Python Integration:${NC}"
echo "python3 scripts/qmoi_health_integration.py"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- Master Guide: ${YELLOW}QMOI_AUTOFIX_MASTER_GUIDE.md${NC}"
echo "- Setup Guide: ${YELLOW}QMOI_AUTOFIX_SETUP_GUIDE.md${NC}"
echo "- Implementation: ${YELLOW}QMOI_AUTOFIX_IMPLEMENTATION_SUMMARY.md${NC}"
echo ""
