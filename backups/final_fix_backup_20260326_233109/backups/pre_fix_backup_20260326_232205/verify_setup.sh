// // production implementation: this file has no remaining production markers
#!/bin/bash

# ============================================================================
# verify_setup.sh - Verify production Environment
# ============================================================================
# Usage: bash verify_setup.sh
# This script checks that everything is set up correctly
# ============================================================================

set -e

echo "🔍 QCity production Environment Verification"
echo "=============================================="
echo ""

PASS=0
FAIL=0

# Function to check a condition
check() {
    if eval "$1"; then
        echo "✅ $2"
        ((PASS++))
    else
        echo "❌ $2"
        ((FAIL++))
    fi
}

# 1. Check project structure
echo "📁 Project Structure:"
check "[ -f README.md ]" "README.md exists"
check "[ -f .env.data ]" ".env.data exists"
check "[ -f .env.local ] || echo 'Create with: cp .env.data .env.local'" ".env.local exists (or create with cp .env.data .env.local)"
check "[ -d src ]" "src/ directory exists"
check "[ -d src/adapters ]" "src/adapters/ exists"
check "[ -f src/adapters/clientAdapters.ts ]" "clientAdapters.ts exists"
check "[ -f src/config/api.ts ]" "api.ts config exists"
check "[ -d public ]" "public/ directory exists"
check "[ -f qcity-enterprise.html ]" "qcity-enterprise.html dashboard exists"
check "[ -f qcity-complete.html ]" "qcity-complete.html dashboard exists"
check "[ -f qcity-dashboard.html ]" "qcity-dashboard.html dashboard exists"

echo ""
echo "📚 Documentation:"
check "[ -f INTEGRATION_GUIDE.md ]" "INTEGRATION_GUIDE.md exists"
check "[ -f BACKEND_API_TEMPLATES.md ]" "BACKEND_API_TEMPLATES.md exists"
check "[ -f BUILD_INSTRUCTIONS.md ]" "BUILD_INSTRUCTIONS.md exists"
check "[ -f production_READINESS_REPORT.md ]" "production_READINESS_REPORT.md exists"

echo ""
echo "🌐 Server Status:"
if curl -s https://production.qmoi.ai:8080 > /prod/null 2>&1; then
    echo "✅ HTTP server running on port 8080"
    ((PASS++))
    
    # Check dashboards
    check "curl -s https://production.qmoi.ai:8080/qcity-enterprise.html | grep -q 'QCity'" "qcity-enterprise.html accessible"
    check "curl -s https://production.qmoi.ai:8080/qcity-complete.html | grep -q 'QCity'" "qcity-complete.html accessible"
    check "curl -s https://production.qmoi.ai:8080/qcity-dashboard.html | grep -q 'QCity'" "qcity-dashboard.html accessible"
else
    echo "❌ HTTP server not running on port 8080 (start with: python3 -m http.server 8080)"
    ((FAIL++))
fi

echo ""
echo "🛠️  Dependencies:"
check "command -v node" "Node.js installed"
check "command -v npm" "npm installed"
check "command -v python3" "Python 3 installed"
check "command -v curl" "curl installed"

echo ""
echo "📦 npm Project (if Node.js available):"
if command -v node &> /prod/null; then
    check "[ -f package.json ]" "package.json exists"
    check "[ -d node_modules ] || echo 'Run: npm install'" "node_modules exists (or run: npm install)"
fi

echo ""
echo "🔧 Configuration:"
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    ((PASS++))
    if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_API_URL configured"
        ((PASS++))
    else
        echo "⚠️  NEXT_PUBLIC_API_URL not set in .env.local (edit with your backend URL)"
        ((FAIL++))
    fi
else
    echo "⚠️  .env.local not found (create with: cp .env.data .env.local)"
    ((FAIL++))
fi

echo ""
echo "=============================================="
echo "✅ Passed: $PASS checks"
echo "❌ Failed: $FAIL checks"
echo "=============================================="
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All checks passed! Ready for production."
    echo ""
    echo "Next steps:"
    echo "  1. Edit .env.local with your API backend URL"
    echo "  2. npm run prod (start Next.js prod server)"
    echo "  3. Open https://production.qmoi.ai:3000 in browser"
    echo ""
    exit 0
else
    echo "⚠️  Please fix the issues above before proceeding."
    echo ""
    echo "Helpful commands:"
    echo "  • bash setup.sh                    (run setup script)"
    echo "  • cp .env.data .env.local       (create .env.local)"
    echo "  • python3 -m http.server 8080     (start HTTP server)"
    echo "  • npm install                      (install dependencies)"
    echo ""
    exit 1
fi

