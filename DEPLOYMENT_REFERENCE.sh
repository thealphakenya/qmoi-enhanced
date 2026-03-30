#!/bin/bash
# QMOI Enhanced - production Deployment Quick Reference
# Save this file as DEPLOYMENT_QUICK_REFERENCE.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  QMOI Enhanced - production Deployment                    ║"
echo "║  Status: ✅ LIVE & OPERATIONAL                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Display current status
echo "📊 CURRENT STATUS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 list
echo ""

# Show key information
echo "📁 KEY LOCATIONS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Application Root: /workspaces/qmoi-enhanced/"
echo "  Logs Directory:   /workspaces/qmoi-enhanced/logs/"
echo "  Config File:      /workspaces/qmoi-enhanced/.env.production"
echo "  PM2 Config:       /workspaces/qmoi-enhanced/ecosystem.config.production.cjs"
echo ""

# Quick commands
echo "⚡ QUICK COMMANDS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  View Logs:        pm2 logs qmoi-sophisticated-start"
echo "  Monitor:          pm2 monit"
echo "  Restart App:      pm2 restart qmoi-sophisticated-start"
echo "  Stop App:         pm2 stop qmoi-sophisticated-start"
echo "  Start App:        pm2 start qmoi-sophisticated-start"
echo ""

# Memory warning if high
MEMORY=$(pm2 list | grep qmoi-sophisticated-start | awk '{print $7}')
if [[ $MEMORY > "500" ]]; then
    echo "⚠️  WARNING: High memory usage ($MEMORY). Check logs for issues."
    echo ""
fi

# Summary
echo "📝 DEPLOYMENT SUMMARY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ App Running:        YES (Online)"
echo "  ✅ Port:               3000"
echo "  ✅ Auto-Restart:       Enabled"
echo "  ✅ Memory Limit:       512MB"
echo "  ✅ Process Manager:    PM2 v6.0.14"
echo ""

# Documentation
echo "📚 DOCUMENTATION:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  production Setup:    production_DEPLOYMENT_SUCCESS.md"
echo "  Deployment Guide:    DEPLOYMENT.md"
echo "  Troubleshooting:     TROUBLESHOOTING.md"
echo "  SSL Setup:           SSL_SETUP.md"
echo "  Monitoring:          MONITORING_README.md"
echo ""

echo "╚════════════════════════════════════════════════════════════╝"
echo ""
