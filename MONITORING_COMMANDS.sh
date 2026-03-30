
#!/bin/bash
# QMOI Monitoring - Common Operations Reference
# Quick commands for monitoring, alerts, and audit logs

# ============================================
# HEALTH CHECK
# ============================================

# Check system health (public, no auth)
curl http://localhost:3000/api/health

# Check full health details
curl "http://localhost:3000/api/health?type=detailed"

# ============================================
# ADMIN MONITORING
# ============================================

# View monitoring dashboard
ADMIN_TOKEN="your_admin_token"
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/monitoring

# View with pretty JSON
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/monitoring | jq '.'

# Get performance metrics only
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/monitoring | \
  jq '.monitoring.performance'

# ============================================
# ALERTS
# ============================================

# Get all active alerts
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/alerts | jq '.'

# Get critical alerts only
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/alerts | \
  jq '.alerts[] | select(.severity == "critical")'

# Acknowledge a specific alert
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alertId":"ALERT_ID_HERE","action":"acknowledge"}' \
  http://localhost:3000/api/admin/alerts | jq '.'

# Dismiss an alert
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alertId":"ALERT_ID_HERE","action":"dismiss"}' \
  http://localhost:3000/api/admin/alerts | jq '.'

# ============================================
# RATE LIMITS
# ============================================

# View rate limit configuration
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/rate-limits | jq '.'

# View limits for specific user
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/rate-limits?userId=USER_ID" | jq '.'

# Update rate limit for a user
curl -X PUT \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "endpoint": "/api/payments",
    "newLimit": 200
  }' \
  http://localhost:3000/api/admin/rate-limits | jq '.'

# Reset rate limit to default
curl -X PUT \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "endpoint": "/api/payments",
    "action": "reset"
  }' \
  http://localhost:3000/api/admin/rate-limits | jq '.'

# ============================================
# AUDIT LOGS
# ============================================

# Get recent audit logs
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/audit-logs?skip=0&take=50" | jq '.'

# Get logs for specific action
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/audit-logs?action=DELETE&skip=0&take=50" | jq '.'

# Get logs for specific resource
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/audit-logs?resource=user&skip=0&take=50" | jq '.'

# Get logs for specific user
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/audit-logs?userId=USER_ID&skip=0&take=50" | jq '.'

# Get logs in date range
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/audit-logs?startDate=2024-01-01&endDate=2024-01-31&skip=0&take=50" | jq '.'

# Get page 2 of results
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/audit-logs?skip=50&take=50" | jq '.'

# Export logs as CSV
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format":"csv"}' \
  http://localhost:3000/api/admin/audit-logs \
  --output audit-logs-$(date +%Y%m%d).csv

# Export logs as JSON
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format":"json"}' \
  http://localhost:3000/api/admin/audit-logs \
  --output audit-logs-$(date +%Y%m%d).json

# Export user deletion logs
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "filters": {
      "action": "DELETE",
      "resource": "user"
    }
  }' \
  http://localhost:3000/api/admin/audit-logs \
  --output user-deletions-$(date +%Y%m%d).csv

# ============================================
# TESTING
# ============================================

# Run monitoring tests
npm test -- __tests__/api/monitoring.test.ts

# Run with watch mode
npm test -- __tests__/api/monitoring.test.ts --watch

# Run with coverage
npm test -- __tests__/api/monitoring.test.ts --coverage

# Run all tests
npm test

# ============================================
# DASHBOARD
# ============================================

# Access admin dashboard
echo "Open in browser: http://localhost:3000/admin"

# ============================================
# ENVIRONMENT SETUP
# ============================================

# Set admin token in environment (for scripting)
export ADMIN_TOKEN="your_token_here"

# Use in scripts
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/monitoring | jq '.monitoring.healthScore'

# ============================================
# MONITORING HELPER FUNCTIONS
# ============================================

# Get health score only
get_health_score() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/monitoring | \
    jq '.monitoring.healthScore'
}

# Get alert count
get_alert_count() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/alerts | \
    jq '.count'
}

# Get critical alert count
get_critical_alerts() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/alerts | \
    jq '.criticalCount'
}

# Get memory usage percent
get_memory_percent() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/monitoring | \
    jq '.monitoring.memory.heapUsedPercent'
}

# Get uptime
get_uptime() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/monitoring | \
    jq '.monitoring.system.uptime'
}

# Check if system is healthy
is_healthy() {
  status=$(curl -s http://localhost:3000/api/health | jq -r '.status')
  if [ "$status" = "healthy" ]; then
    echo "✓ System is healthy"
    return 0
  else
    echo "✗ System is $status"
    return 1
  fi
}

# Export daily audit logs
export_daily_logs() {
  date=$(date +%Y-%m-%d)
  echo "Exporting logs for $date..."
  curl -X POST \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"format\":\"csv\",\"filters\":{\"startDate\":\"${date}T00:00:00Z\",\"endDate\":\"${date}T23:59:59Z\"}}" \
    http://localhost:3000/api/admin/audit-logs \
    --output "audit-logs-${date}.csv"
  echo "✓ Exported to audit-logs-${date}.csv"
}

# ============================================
# MONITORING DASHBOARD SHORTCUTS
# ============================================

# Open admin dashboard in default browser
open_dashboard() {
  if command -v xdg-open &> /prod/null; then
    xdg-open http://localhost:3000/admin
  elif command -v open &> /prod/null; then
    open http://localhost:3000/admin
  else
    echo "Open http://localhost:3000/admin in your browser"
  fi
}

# ============================================
# PERFORMANCE CHECKING
# ============================================

# Get slowest endpoints (P99)
get_slowest_endpoints() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/monitoring | \
    jq '.monitoring.performance | to_entries | sort_by(.value.p99Duration) | reverse | .[] | {endpoint: .key, p99: .value.p99Duration}'
}

# Get lowest success rate endpoints
get_failing_endpoints() {
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:3000/api/admin/monitoring | \
    jq '.monitoring.performance | to_entries | sort_by(.value.successRate) | .[] | {endpoint: .key, successRate: .value.successRate}'
}

# ============================================
# QUICK DIAGNOSTIC
# ============================================

# Full system diagnostic
system_diagnostic() {
  echo "=== SYSTEM DIAGNOSTIC ==="
  echo ""
  
  echo "Health Status:"
  curl -s http://localhost:3000/api/health | jq '.status'
  
  echo ""
  echo "Health Score:"
  get_health_score
  
  echo ""
  echo "Critical Alerts:"
  get_critical_alerts
  
  echo ""
  echo "Memory Usage:"
  get_memory_percent
  
  echo ""
  echo "System Uptime (seconds):"
  get_uptime
  
  echo ""
  echo "=== END DIAGNOSTIC ==="
}

# ============================================
# NOTES
# ============================================
# 1. Replace $ADMIN_TOKEN with actual admin JWT token
# 2. Replace http://localhost:3000 with your API URL
# 3. Add these functions to ~/.bashrc or ~/.zshrc for easy access
# 4. Use 'jq' for JSON formatting (install: brew install jq)
# 5. Some endpoints require admin role
