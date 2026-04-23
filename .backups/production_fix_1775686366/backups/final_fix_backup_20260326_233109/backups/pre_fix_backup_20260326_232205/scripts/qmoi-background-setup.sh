// // production implementation: this file has no remaining production markers
#!/bin/bash

# QMOI Background Automation - Quick Start Script
# This script sets up environment variables for background automation

echo "🚀 QMOI Background Automation - Quick Start"
echo "==========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  touch .env.local
fi

# Set default values if not already set
echo "Configuring background automation..."

# API Configuration
if ! grep -q "NEXT_PUBLIC_API_URL" .env.local; then
  echo "NEXT_PUBLIC_API_URL=https://production-db.qmoi.ai" >> .env.local
  echo "✓ Set API URL"
fi

# Admin Token
if ! grep -q "ADMIN_TOKEN" .env.local; then
  # Generate a random token
  ADMIN_TOKEN=$(openssl rand -hex 32)
  echo "ADMIN_TOKEN=$ADMIN_TOKEN" >> .env.local
  echo "✓ Generated admin token: $ADMIN_TOKEN"
fi

# Enable/Disable Services
if ! grep -q "QMOI_AUTO_SCAN_ENABLED" .env.local; then
  echo "QMOI_AUTO_SCAN_ENABLED=true" >> .env.local
  echo "✓ Enabled auto-scanning"
fi

if ! grep -q "QMOI_HEALTH_MONITORING_ENABLED" .env.local; then
  echo "QMOI_HEALTH_MONITORING_ENABLED=true" >> .env.local
  echo "✓ Enabled health monitoring"
fi

if ! grep -q "QMOI_ENABLE_BACKGROUND" .env.local; then
  echo "QMOI_ENABLE_BACKGROUND=true" >> .env.local
  echo "✓ Enabled background automation"
fi

# Timing Configuration
if ! grep -q "QMOI_AUTO_SCAN_INTERVAL" .env.local; then
  echo "QMOI_AUTO_SCAN_INTERVAL=300000" >> .env.local
  echo "✓ Set auto-scan interval: 5 minutes"
fi

if ! grep -q "QMOI_HEALTH_MONITOR_INTERVAL" .env.local; then
  echo "QMOI_HEALTH_MONITOR_INTERVAL=30000" >> .env.local
  echo "✓ Set health monitor interval: 30 seconds"
fi

# Auto-Fix Configuration
if ! grep -q "QMOI_AUTO_FIX_ON_ERRORS" .env.local; then
  echo "QMOI_AUTO_FIX_ON_ERRORS=true" >> .env.local
  echo "✓ Enabled auto-fix on errors"
fi

if ! grep -q "QMOI_AUTO_FIX_ON_HEALTH_ISSUES" .env.local; then
  echo "QMOI_AUTO_FIX_ON_HEALTH_ISSUES=true" >> .env.local
  echo "✓ Enabled auto-fix on health issues"
fi

# Health Thresholds
if ! grep -q "QMOI_CPU_WARNING" .env.local; then
  echo "QMOI_CPU_WARNING=70" >> .env.local
  echo "✓ Set CPU warning threshold: 70%"
fi

if ! grep -q "QMOI_CPU_CRITICAL" .env.local; then
  echo "QMOI_CPU_CRITICAL=90" >> .env.local
  echo "✓ Set CPU critical threshold: 90%"
fi

if ! grep -q "QMOI_MEMORY_WARNING" .env.local; then
  echo "QMOI_MEMORY_WARNING=75" >> .env.local
  echo "✓ Set memory warning threshold: 75%"
fi

if ! grep -q "QMOI_MEMORY_CRITICAL" .env.local; then
  echo "QMOI_MEMORY_CRITICAL=95" >> .env.local
  echo "✓ Set memory critical threshold: 95%"
fi

if ! grep -q "QMOI_DISK_WARNING" .env.local; then
  echo "QMOI_DISK_WARNING=80" >> .env.local
  echo "✓ Set disk warning threshold: 80%"
fi

if ! grep -q "QMOI_DISK_CRITICAL" .env.local; then
  echo "QMOI_DISK_CRITICAL=95" >> .env.local
  echo "✓ Set disk critical threshold: 95%"
fi

echo ""
echo "✅ Background automation configured successfully!"
echo ""
echo "Configuration Summary:"
echo "====================="
echo "📊 Auto-Scan: Enabled (every 5 minutes)"
echo "❤️  Health Monitor: Enabled (every 30 seconds)"
echo "🔧 Auto-Fix: Enabled for errors and health issues"
echo "📈 CPU Warning: 70% | Critical: 90%"
echo "📈 Memory Warning: 75% | Critical: 95%"
echo "📈 Disk Warning: 80% | Critical: 95%"
echo ""
echo "🚀 Next Steps:"
echo "1. Start the production server: npm run prod"
echo "2. Visit https://production-db.qmoi.ai/admin to view the dashboard"
echo "3. Check the automation status in the dashboard"
echo "4. Review logs in .logs/ directory"
echo ""
echo "📖 For more information, see: docs/QMOI_BACKGROUND_AUTOMATION_GUIDE.md"
echo ""
echo "💡 Tips:"
echo "   - Admin Token: $(grep ADMIN_TOKEN .env.local | cut -d= -f2)"
echo "   - Store this token securely!"
echo "   - Use it for all API requests: Authorization: Bearer <token>"
echo ""
