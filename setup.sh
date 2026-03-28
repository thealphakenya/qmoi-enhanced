#!/bin/bash

# ============================================================================
# setup.sh - Quick Start Script for Local Development
# ============================================================================
# Usage: bash setup.sh
# This script sets up the local development environment
# ============================================================================

set -e

echo "🚀 QCity & QMOI AI - Development Setup"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: README.md not found. Run this script from the project root."
    exit 1
fi

# Step 1: Copy environment standard
echo "📋 Step 1: Setting up environment variables..."
if [ ! -f ".env.local" ]; then
    cp .env.data .env.local
    echo "✅ Created .env.local (edit with your API endpoints)"
else
    echo "⏭️  .env.local already exists (skipping)"
fi

# Step 2: Check if Node.js is available
echo ""
echo "🔍 Step 2: Checking dependencies..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js found: $NODE_VERSION"
    HAS_NODE=true
else
    echo "⚠️  Node.js not found (needed for npm build & Next.js dev)"
    echo "   Install from: https://nodejs.org/"
    HAS_NODE=false
fi

if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python found: $PYTHON_VERSION"
else
    echo "❌ Python 3 not found (needed for HTTP server)"
    exit 1
fi

# Step 3: Start HTTP server for dashboards
echo ""
echo "🌐 Step 3: Starting HTTP server..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8080 already in use. Stopping existing process..."
    pkill -f "python.*http.server.*8080" || true
    sleep 1
fi

echo "Starting HTTP server on port 8080..."
python3 -m http.server 8080 > /tmp/http-server.log 2>&1 &
HTTP_PID=$!
sleep 2

# Verify server is running
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ HTTP server started (PID: $HTTP_PID)"
else
    echo "❌ HTTP server failed to start. Check /tmp/http-server.log"
    exit 1
fi

# Step 4: Optional - npm install (if Node.js available)
if [ "$HAS_NODE" = true ]; then
    echo ""
    echo "📦 Step 4: Installing npm dependencies..."
    if [ ! -d "node_modules" ]; then
        npm install
        echo "✅ Dependencies installed"
    else
        echo "⏭️  node_modules already exists (skipping npm install)"
    fi
fi

# Step 5: Display access instructions
echo ""
echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "📊 Access Dashboards:"
echo "  • http://localhost:8080/qcity-enterprise.html"
echo "  • http://localhost:8080/qcity-complete.html"
echo "  • http://localhost:8080/qcity-dashboard.html"
echo ""

if [ "$HAS_NODE" = true ]; then
    echo "🚀 Next Steps (with Node.js):"
    echo "  1. Edit .env.local with your backend API URL"
    echo "  2. npm run dev          (for Next.js dev server)"
    echo "  3. http://localhost:3000 (access QMOI AI pages)"
else
    echo "⚠️  Node.js Required for:"
    echo "  • npm run dev (Next.js dev server)"
    echo "  • npm run build (production build)"
    echo "  • npm test (run tests)"
    echo ""
    echo "💡 Install Node.js from: https://nodejs.org/"
fi

echo ""
echo "🧪 Testing:"
echo "  • bash verify_setup.sh  (verify everything is working)"
echo "  • python3 mock_server.py (test with real backend)"
echo ""
echo "📚 Documentation:"
echo "  • INTEGRATION_GUIDE.md (step-by-step integration)"
echo "  • BACKEND_API_TEMPLATES.md (API endpoint examples)"
echo "  • BUILD_INSTRUCTIONS.md (build & troubleshooting)"
echo ""

