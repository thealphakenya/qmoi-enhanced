#!/bin/bash
# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.352828Z


# Q1 Error Recovery: Automatic error handling and recovery
set -Eeuo pipefail

# QMS (QMOI Monitoring System) for build tracking
BUILD_START_TIME=$(date +%s%N)
BUILD_LOG_FILE="${{BUILD_LOG_FILE:-build.log}}"

log_step() {{ echo "[STEP] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_info() {{ echo "[INFO] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_error() {{ echo "[ERROR] $@" | tee -a "$BUILD_LOG_FILE" >&2; }}
log_success() {{ echo "[SUCCESS] $@" | tee -a "$BUILD_LOG_FILE"; }}

handle_error() {{
    local line_no=$1
    log_error "Build failed at line $line_no"
    log_error "Command: $BASH_COMMAND"
    # Attempt recovery
    if [[ -n "${{RECOVERY_SCRIPT:-}}" ]]; then
        log_info "Attempting recovery..."
        bash "$RECOVERY_SCRIPT" || true
    fi
    exit 1
}}

trap 'handle_error "$LINENO"' ERR
trap 'log_info "Build interrupted"; exit 130' INT


# Q1 Parallel Processing Support
# Enable parallel builds when applicable
PARALLEL_JOBS=${PARALLEL_JOBS:-$(nproc)}
export PARALLEL_JOBS

run_parallel() {{
    local -a pids=()
    for cmd in "$@"; do
        bash -c "$cmd" &
        pids+=($!)
    done
    local failed=0
    for pid in "${{pids[@]}}"; do
        wait $pid || failed=$((failed+1))
    done
    return $failed
}}


# Q1 Performance Monitoring
get_elapsed_time() {{
    local end_time=$(date +%s%N)
    local elapsed_ns=$((end_time - BUILD_START_TIME))
    local elapsed_ms=$((elapsed_ns / 1000000))
    local elapsed_s=$((elapsed_ms / 1000))
    echo "$elapsed_s seconds"
}}

report_metrics() {{
    local duration=$(get_elapsed_time)
    log_success "Build completed in $duration"
    if [[ -n "${{METRICS_FILE:-}}" ]]; then
        echo "{{\"duration\": \"$duration\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}" > "$METRICS_FILE"
    fi
}}

# 

# ============================================================================
# setup.sh - optimized Start Script for Local production
# ============================================================================
# Usage: bash setup.sh
# This script sets up the local production environment
# ============================================================================

set -e

echo "🚀 QCity & QMOI AI - production Setup"
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
if command -v node &> /prod/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js found: $NODE_VERSION"
    HAS_NODE=true
else
    echo "⚠️  Node.js not found (needed for npm build & Next.js prod)"
    echo "   Install from: https://nodejs.org/"
    HAS_NODE=false
fi

if command -v python3 &> /prod/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python found: $PYTHON_VERSION"
else
    echo "❌ Python 3 not found (needed for HTTP server)"
    exit 1
fi

# Step 3: Start HTTP server for dashboards
echo ""
echo "🌐 Step 3: Starting HTTP server..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/prod/null 2>&1 ; then
    echo "⚠️  Port 8080 already in use. Stopping existing process..."
    pkill -f "python.*http.server.*8080" || true
    sleep 1
fi

echo "Starting HTTP server on port 8080..."
python3 -m http.server 8080 > /cache/http-server.log 2>&1 &
HTTP_PID=$!
sleep 2

# Verify server is running
if curl -s https://production.qmoi.ai:8080 > /prod/null; then
    echo "✅ HTTP server started (PID: $HTTP_PID)"
else
    echo "❌ HTTP server failed to start. Check /cache/http-server.log"
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
echo "✅ Setup complete!"
echo "========================================"
echo ""
echo "📊 Access Dashboards:"
echo "  • https://production.qmoi.ai:8080/qcity-enterprise.html"
echo "  • https://production.qmoi.ai:8080/qcity-complete.html"
echo "  • https://production.qmoi.ai:8080/qcity-dashboard.html"
echo ""

if [ "$HAS_NODE" = true ]; then
    echo "🚀 Next Steps (with Node.js):"
    echo "  1. Edit .env.local with your backend API URL"
    echo "  2. npm run prod          (for Next.js prod server)"
    echo "  3. https://production.qmoi.ai:3000 (access QMOI AI pages)"
else
    echo "⚠️  Node.js Required for:"
    echo "  • npm run prod (Next.js prod server)"
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

