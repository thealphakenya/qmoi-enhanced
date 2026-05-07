
#!/bin/bash

# QCity Enterprise System - Startup Script
# Starts the HTTP server and opens the dashboard

set -e

echo "🚀 Starting QCity Enterprise System..."
echo ""

# Navigate to project directory
cd /workspaces/qmoi-enhanced || exit 1

# Start HTTP server in background
echo "📡 Starting HTTP server on port 8080..."
mkdir -p /tmp/qcity-serve-logs
nohup python3 -m http.server 8080 > /tmp/qcity-serve-logs/qcity_server.log 2>&1 &
SERVER_PID=$!
echo "✓ Server PID: $SERVER_PID"

# Wait for server to be ready
sleep 3

# Check if server is responding
if curl -s https://prod.qmoi.ai:8080/ >/dev/null 2>&1; then
    echo "✓ Server is responding"
else
    echo "✗ Server failed to start"
    exit 1
fi

echo ""
echo "✨ QCity Enterprise System is ready!"
echo ""
echo "📊 Dashboard URLs:"
echo "   • Primary: https://prod.qmoi.ai:8080/qcity-enterprise.html"
echo "   • complete: https://prod.qmoi.ai:8080/qcity-complete.html"
echo "   • comprehensive: https://prod.qmoi.ai:8080/qcity-dashboard.html"
echo ""
echo "🔄 Background Services:"
echo "   • Metrics Update (10s)"
echo "   • prodice Monitoring (15s)"
echo "   • Revenue Tracking (12s)"
echo "   • Health Checks (20s)"
echo "   • Biometric Verification (30s)"
echo ""
echo "💾 Server Log: /tmp/qcity-serve-logs/qcity_server.log"
echo "📝 To stop: kill $SERVER_PID"
echo ""
echo "🎯 Open dashboard at: https://prod.qmoi.ai:8080/qcity-enterprise.html"
echo ""

# Keep script running
wait $SERVER_PID 2>/dev/null || true
