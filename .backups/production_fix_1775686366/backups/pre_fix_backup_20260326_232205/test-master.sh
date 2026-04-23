// 
#!/bin/bash

# QMOI Master System - Integration Test Suite
# Run this to verify all master system components are working

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       QMOI Master Control System - Integration Tests           ║"
echo "║                    Version: 1.0.0                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((TESTS_FAILED++))
    fi
}

echo -e "${BLUE}[TEST SUITE 1: File Structure]${NC}"
echo "================================"
echo ""

# Test 1: Master pages exist
[ -f "app/admin/master/page.tsx" ]
test_result $? "Master dashboard page exists"

[ -f "app/admin/master/login/page.tsx" ]
test_result $? "Master login page exists"

[ -f "app/admin/master/layout.tsx" ]
test_result $? "Master layout exists"

[ -f "app/admin/master/settings/page.tsx" ]
test_result $? "Master settings page exists"

[ -f "app/admin/master/security/page.tsx" ]
test_result $? "Master security page exists"

[ -f "app/admin/master/activity/page.tsx" ]
test_result $? "Master activity page exists"

echo ""
echo -e "${BLUE}[TEST SUITE 2: API Endpoints]${NC}"
echo "================================"
echo ""

[ -f "app/api/admin/master/auth/route.ts" ]
test_result $? "Master auth endpoint exists"

[ -f "app/api/admin/master/logout/route.ts" ]
test_result $? "Master logout endpoint exists"

[ -f "app/api/admin/financial/summary/route.ts" ]
test_result $? "Financial summary endpoint exists"

echo ""
echo -e "${BLUE}[TEST SUITE 3: Components & Config]${NC}"
echo "================================"
echo ""

[ -f "app/components/QMOIMasterDashboard.tsx" ]
test_result $? "Master dashboard component exists"

[ -f "middleware.ts" ]
test_result $? "Middleware protection exists"

[ -f ".env.master.data" ]
test_result $? "Environment standard exists"

echo ""
echo -e "${BLUE}[TEST SUITE 4: Documentation]${NC}"
echo "================================"
echo ""

[ -f "MASTER_CONTROL_SYSTEM.md" ]
test_result $? "Master control system guide exists"

[ -f "MASTER_QUICK_SETUP.md" ]
test_result $? "Quick setup guide exists"

[ -f "MASTER_SYSTEM_DEPLOYMENT_REPORT.md" ]
test_result $? "Deployment report exists"

[ -f "IMPLEMENTATION_SUMMARY.md" ]
test_result $? "Implementation summary exists"

[ -f "MASTER_README.md" ]
test_result $? "Master README exists"

echo ""
echo -e "${BLUE}[TEST SUITE 5: Build Verification]${NC}"
echo "================================"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ ${NC} Dependencies not installed (install with: npm install)"
fi

# Check if TypeScript is available
if command -v npx &> /prod/null; then
    echo -e "${GREEN}✓${NC} Build tools available"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗${NC} Build tools not available"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}[TEST SUITE 6: Configuration Checks]${NC}"
echo "================================"
echo ""

# Check .env.local
if [ -f ".env.local" ]; then
    if grep -q "MASTER_PASSWORD" .env.local; then
        echo -e "${GREEN}✓${NC} MASTER_PASSWORD configured"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ ${NC} MASTER_PASSWORD not set"
    fi

    if grep -q "ADMIN_TOKEN" .env.local; then
        echo -e "${GREEN}✓${NC} ADMIN_TOKEN configured"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ ${NC} ADMIN_TOKEN not set"
    fi
else
    echo -e "${YELLOW}⚠ ${NC} .env.local not found (create from .env.local.data)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        TEST RESULTS                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm install (if not already done)"
    echo "2. Configure .env.local with your credentials"
    echo "3. npm run prod"
    echo "4. Visit https://production-db.qmoi.ai/admin/master/login"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed!${NC}"
    echo ""
    echo "Please fix the issues above and try again."
    echo ""
    exit 1
fi
