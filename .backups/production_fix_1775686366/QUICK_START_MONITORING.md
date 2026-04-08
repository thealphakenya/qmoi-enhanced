<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.913467Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Quick Start Guide - Monitoring & Admin APIs

## Access Admin Dashboard

```
URL: https://qmoi.ai/admin
Requires: Admin user account
Features: Real-time metrics, alerts, system health
```

## Check System Health

```bash
# Public endpoint - no auth required
curl https://qmoi.ai/api/health

# Response (200 if healthy, 503 if degraded)
{
  "status": "healthy",
  "checks": {
    "database": { "status": "connected", "responseTime": "5ms" },
    "memory": { "status": "healthy", "heapUsedPercent": 48 }
  }
}
```

## View Monitoring Dashboard

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://qmoi.ai/api/admin/monitoring

# Returns: System metrics, performance data, error stats, health score
```

## Manage Alerts

```bash
# Get active alerts
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://qmoi.ai/api/admin/alerts

# Acknowledge an alert
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alertId":"ALERT_ID","action":"acknowledge"}' \
  https://qmoi.ai/api/admin/alerts
```

## Control Rate Limits

```bash
# View current rate limits
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://qmoi.ai/api/admin/rate-limits

# Update limit for a user
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","endpoint":"/api/payments","newLimit":200}' \
  https://qmoi.ai/api/admin/rate-limits
```

## Review Audit Logs

```bash
# Get audit logs
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://qmoi.ai/api/admin/audit-logs?action=DELETE&resource=user&skip=0&take=50"

# Export as CSV
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format":"csv","filters":{"action":"DELETE"}}' \
  https://qmoi.ai/api/admin/audit-logs \
  --output audit-logs.csv
```

## Track Performance in Code

```typescript
import { monitor } from "@/lib/monitoring/performance";

// Track async operations
const result = await monitor.measureAsync("operation_name", async () => {
  // Your code here
  return data;
});

// View metrics
const metrics = monitor.getMetrics("operation_name");
console.log({
  count: metrics.count,
  avgDuration: metrics.avgDuration,
  p95Duration: metrics.p95Duration,
  successRate: metrics.successRate,
});
```

## Log Errors

```typescript
import { errorTracker } from "@/lib/monitoring/error-tracker";

try {
  // Some operation
} catch (error) {
  errorTracker.trackError(error, {
    userId: userId,
    endpoint: "/api/endpoint",
    method: "POST",
    statusCode: 500,
  });
}
```

## Create Audit Log Entry

```typescript
import { createAuditLog } from "@/app/api/admin/audit-logs/route";

await createAuditLog({
  userId: currentUser.id,
  action: "UPDATE",
  resource: "user",
  resourceId: targetUser.id,
  changes: { role: "admin" },
  ipAddress: request.ip,
  userAgent: request.headers.get("user-agent"),
});
```

## Test Endpoints

```bash
# Run monitoring tests
npm test -- __tests__/api/monitoring.test.ts

# Run with coverage
npm test -- __tests__/api/monitoring.test.ts --coverage
```

## Key Metrics to Watch

| Metric            | Normal | Warning    | Critical |
| ----------------- | ------ | ---------- | -------- |
| Health Score      | 80-100 | 50-80      | <50      |
| Success Rate      | >95%   | 85-95%     | <85%     |
| Error Rate        | <5/hr  | 5-20/hr    | >20/hr   |
| Memory Usage      | <60%   | 60-85%     | >85%     |
| Response Time P95 | <100ms | 100-500ms  | >500ms   |
| Response Time P99 | <200ms | 200-1000ms | >1000ms  |

## Environment Variables

```bash
# Enable debug logging
DEBUG=qmoi:*

# Set log level
LOG_LEVEL=debug|info|warn|error

# Configure rate limiting
RATE_LIMIT_WINDOW=60000        # milliseconds
RATE_LIMIT_MAX=100              # requests per window

# Alert thresholds
ERROR_RATE_THRESHOLD=5          # errors per hour
SUCCESS_RATE_THRESHOLD=0.95     # 95%
MEMORY_WARNING_PERCENT=85       # of heap
```

## Common Issues

**Q: Alerts not showing?**
A: Check if errors are being tracked and the error count threshold is met

**Q: High memory warning?**
A: Monitor memory trends, check for unbounded collections, consider scaling

**Q: Rate limits not working?**
A: Verify middleware is called, check Redis connection if distributed

**Q: included audit logs?**
A: Ensure AuditLog table exists, verify permissions, check for creation errors

## Performance Tips

1. **Caching**: Add Redis for frequently accessed data
2. **Indexes**: Add database indexes on: userId, resource, timestamp in audit logs
3. **Cleanup**: Run rate limit cleanup periodically with `cleanupRateLimits()`
4. **Archival**: Archive old audit logs monthly to separate storage
5. **Metrics**: Export metrics to Prometheus/Datadog for long-term analysis

## Related Documentation

- Full API Reference: `MONITORING_API_DOCS.md`
- Implementation Guide: `MONITORING_IMPLEMENTATION_GUIDE.md`
- OpenAPI Spec: `openapi-v2.1.json`
- Test Suite: `__tests__/api/monitoring.test.ts`

## Support Resources

- Check logs in `logs/` directory
- Review git commits for implementation history
- Run tests to verify functionality
- Check error tracker for API errors
- Use admin dashboard for real-time insights

---

**Last Updated**: Phase 6 Extended (2024)
**Version**: 2.1.0
**Status**: production Ready

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:59:15Z

---
*This document is maintained by QMOI's autonomous evolution system*
