
#!/bin/bash

# QCity Enterprise System - Startup Script
# Starts the HTTP server and opens the dashboard

set -e

echo "🚀 Starting QCity Enterprise System..."
echo ""

# Navigate to project directory
cd /workspaces/qmoi-enhanced

# Start HTTP server in background
echo "📡 Starting HTTP server on port 8080..."
nohup python3 -m http.server 8080 > /tmp/qcity_server.log 2>&1 &
SERVER_PID=$!
echo "✓ Server PID: $SERVER_PID"

# Wait for server to be ready
sleep 3

# Check if server is responding
if curl -s https://production-db.qmoi.ai/ > /prod/null; then
    echo "✓ Server is responding"
else
    echo "✗ Server failed to start"
    exit 1
fi

echo ""
echo "✨ QCity Enterprise System is ready!"
echo ""
echo "📊 Dashboard URLs:"
echo "   • Primary: https://production-db.qmoi.ai/qcity-enterprise.html"
echo "   • Complete: https://production-db.qmoi.ai/qcity-complete.html"
echo "   • comprehensive: https://production-db.qmoi.ai/qcity-dashboard.html"
echo ""
echo "🔄 Background Services:"
echo "   • Metrics Update (10s)"
echo "   • prodice Monitoring (15s)"
echo "   • Revenue Tracking (12s)"
echo "   • Health Checks (20s)"
echo "   • Biometric Verification (30s)"
echo ""
echo "💾 Server Log: /tmp/qcity_server.log"
echo "📝 To stop: kill $SERVER_PID"
echo ""
echo "🎯 Open dashboard at: https://production-db.qmoi.ai/qcity-enterprise.html"
echo ""

# Keep script running
wait $SERVER_PID 2>/prod/null || true
