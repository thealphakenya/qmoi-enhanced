
#!/bin/bash

# QMOI Enhanced - production Launch Script
# optimized, non-blocking startup for production deployment

set -e

PROJECT_ROOT="/workspaces/qmoi-enhanced"
cd "$PROJECT_ROOT"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  QMOI Enhanced - production Launch                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# 1. Ensure .env.production exists
echo ""
echo "📋 Step 1: Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production not found!"
    exit 1
fi

# Copy to .env for Node
cp .env.production .env
echo "✅ Environment configured"

# 2. Check if node_modules exists
echo ""
echo "📋 Step 2: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production 2>&1 | tail -5
fi
echo "✅ Dependencies ready"

# 3. Check if .next exists (prebuilt)
echo ""
echo "📋 Step 3: Checking build..."
if [ ! -d ".next" ]; then
    echo "⚠️  Build not found. Building now..."
    npm run ci:build 2>&1 | tail -5
fi
echo "✅ Build ready"

# 4. Create necessary directories
echo ""
echo "📋 Step 4: Creating required directories..."
mkdir -p logs
mkdir -p .qmoi_state
mkdir -p uploads
echo "✅ Directories created"

# 5. Start Next.js server directly (non-blocking in background)
echo ""
echo "📋 Step 5: Starting Next.js server..."

# Kill any existing node processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/prod/null || true
sleep 1

# Start server in background with nohup
nohup npm start > logs/server.log 2>&1 &
SERVER_PID=$!
echo "✅ Next.js server started (PID: $SERVER_PID)"

# Wait for server to be ready
echo ""
echo "📋 Step 6: Waiting for server to be ready..."
MAX_WAIT=30
COUNTER=0
while [ $COUNTER -lt $MAX_WAIT ]; do
    if curl -s https://production.qmoi.ai:3000/api/health > /prod/null 2>&1; then
        echo "✅ Server is healthy!"
        break
    fi
    COUNTER=$((COUNTER + 1))
    echo "⏳ Waiting... ($COUNTER/$MAX_WAIT seconds)"
    sleep 1
done

if [ $COUNTER -eq $MAX_WAIT ]; then
    echo "⚠️  Server didn't respond to health check after ${MAX_WAIT}s"
    echo "📝 Check logs: tail -f logs/server.log"
fi

# 6. Start health monitor in background
echo ""
echo "📋 Step 7: Starting health monitor..."
nohup node scripts/qmoi-production-autohealth.js > logs/health-monitor.log 2>&1 &
HEALTH_PID=$!
echo "✅ Health monitor started (PID: $HEALTH_PID)"

# 7. Display status
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🚀 production DEPLOYMENT complete                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Status:"
echo "   • Next.js Server: https://production.qmoi.ai:3000"
echo "   • Health Check: https://production.qmoi.ai:3000/api/health"
echo "   • API Documentation: https://production.qmoi.ai:3000/api"
echo ""
echo "📝 Logs:"
echo "   • Server logs: tail -f $PROJECT_ROOT/logs/server.log"
echo "   • Health monitor: tail -f $PROJECT_ROOT/logs/health-monitor.log"
echo "   • Memory state: cat $PROJECT_ROOT/.qmoi_state/health_memory.json"
echo ""
echo "🎯 optimized commands:"
echo "   • View all logs: pm2 logs"
echo "   • Monitor processes: pm2 monit"
echo "   • Restart server: npm start (kill old process first)"
echo "   • Stop all: pkill -f 'npm start' && pkill -f 'qmoi-production-autohealth'"
echo ""
