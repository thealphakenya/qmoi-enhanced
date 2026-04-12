<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.421558Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Monitoring & Admin APIs Documentation

## Overview

This document describes the monitoring, alerting, and administrative APIs for the QMOI system. All endpoints except health check are admin-only and require authentication.

## Base URL

- **production**: `https://qmoi.ai/api`
- **production**: `https://production.qmoi.app/api`
- **production**: `https://api.qmoi.app/api`

## Authentication

All endpoints except `/health` require Bearer token authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Health Check

#### GET /health

Public health check endpoint for monitoring systems and load balancers.

**Parameters**: None (optional `type` query param for detailed checks)

**Response** (200 OK):

```json
{
  "status": "healthy",
  "checks": {
    "timestamp": "2024-01-15T10:30:00Z",
    "service": {
      "status": "up",
      "version": "2.0.0"
    },
    "database": {
      "status": "connected",
      "responseTime": "5ms",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "memory": {
      "status": "healthy",
      "heapUsedMB": 245,
      "heapTotalMB": 512,
      "heapUsedPercent": 48
    },
    "uptime": 86400
  }
}
```

---

### Monitoring Dashboard

#### GET /admin/monitoring

Get comprehensive monitoring dashboard data including performance metrics, errors, and system health.

**Authorization**: Admin only

**Response** (200 OK):

```json
{
  "monitoring": {
    "timestamp": "2024-01-15T10:30:00Z",
    "system": {
      "uptime": 86400,
      "memory": {
        "heapUsed": 257949696,
        "heapTotal": 536870912,
        "external": 2097152
      },
      "noprodersion": "v18.17.0",
      "platform": "linux"
    },
    "performance": {
      "/api/auth/login": {
        "count": 245,
        "successCount": 243,
        "failureCount": 2,
        "successRate": "99.2",
        "avgDuration": "45.2",
        "minDuration": "12",
        "maxDuration": "234",
        "p95Duration": "120",
        "p99Duration": "200"
      }
    },
    "errors": {
      "DATABASE_ERROR": {
        "count": 2,
        "lastHour": 0,
        "last24h": 2
      }
    },
    "database": {
      "status": "healthy"
    },
    "application": {
      "environment": "production",
      "version": "2.0.0"
    },
    "healthScore": 95,
    "status": "healthy"
  }
}
```

---

### Alerts & Incidents

#### GET /admin/alerts

Get active alerts and incidents with severity levels.

**Authorization**: Admin only

**Query Parameters**:

- `severity` (optional): Filter by severity - `critical`, `warning`, `info`

**Response** (200 OK):

```json
{
  "alerts": [
    {
      "id": "error_DATABASE_ERROR_1705318200000",
      "type": "HIGH_ERROR_RATE",
      "severity": "warning",
      "component": "Application Errors",
      "message": "High error rate detected: DATABASE_ERROR (5 in last hour)",
      "errorType": "DATABASE_ERROR",
      "count": 5,
      "timestamp": "2024-01-15T10:30:00Z",
      "actionable": true,
      "suggestedAction": "Review error logs and escalate to engineering"
    }
  ],
  "count": 1,
  "criticalCount": 0,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

#### POST /admin/alerts

Acknowledge, dismiss, or escalate an alert.

**Authorization**: Admin only

**Request Body**:

```json
{
  "alertId": "error_DATABASE_ERROR_1705318200000",
  "action": "acknowledge"
}
```

**Actions**: `acknowledge`, `dismiss`, `escalate`

**Response** (200 OK):

```json
{
  "success": true,
  "alertId": "error_DATABASE_ERROR_1705318200000",
  "action": "acknowledge",
  "timestamp": "2024-01-15T10:30:00Z",
  "message": "Alert acknowledged successfully"
}
```

---

### Rate Limits

#### GET /admin/rate-limits

View rate limit configuration and current usage by user/endpoint.

**Authorization**: Admin only

**Query Parameters**:

- `userId` (optional): Filter by user ID

**Response** (200 OK):

```json
{
  "config": {
    "defaultLimit": 100,
    "windowSize": 60000,
    "unit": "requests per minute"
  },
  "currentUsage": [
    {
      "userId": "user_123",
      "endpoint": "/api/payments",
      "requestCount": 87,
      "limit": 100,
      "percentageUsed": 87,
      "status": "normal"
    }
  ],
  "totalTrackedUsers": 45,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### PUT /admin/rate-limits

Update rate limit for a user/endpoint or reset to default.

**Authorization**: Admin only

**Request Body**:

```json
{
  "userId": "user_123",
  "endpoint": "/api/payments",
  "newLimit": 200
}
```

Or to reset:

```json
{
  "userId": "user_123",
  "endpoint": "/api/payments",
  "action": "reset"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Rate limit updated",
  "userId": "user_123",
  "endpoint": "/api/payments",
  "newLimit": 200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Audit Logs

#### GET /admin/audit-logs

View audit logs with filtering, searching, and pagination.

**Authorization**: Admin only

**Query Parameters**:

- `action` (optional): Filter by action type - `CREATE`, `UPDATE`, `DELETE`, etc.
- `userId` (optional): Filter by user ID
- `resource` (optional): Filter by resource type - `user`, `wallet`, `transaction`, etc.
- `startDate` (optional): ISO date string for range start
- `endDate` (optional): ISO date string for range end
- `skip` (optional, default: 0): Pagination offset
- `take` (optional, default: 50, max: 100): Results per page

**data Request**:

```
GET /admin/audit-logs?action=UPDATE&resource=user&startDate=2024-01-01&skip=0&take=50
```

**Response** (200 OK):

```json
{
  "logs": [
    {
      "id": "log_123",
      "userId": "user_123",
      "action": "UPDATE",
      "resource": "user",
      "resourceId": "user_456",
      "changes": "{\"role\":\"user\",\"status\":\"active\"}",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "skip": 0,
    "take": 50,
    "total": 1234,
    "pages": 25
  },
  "filters": {
    "action": "UPDATE",
    "userId": null,
    "resource": "user",
    "startDate": "2024-01-01",
    "endDate": null
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### POST /admin/audit-logs

Export audit logs in CSV, JSON, or PDF format.

**Authorization**: Admin only

**Request Body**:

```json
{
  "format": "csv",
  "filters": {
    "action": "DELETE",
    "resource": "user"
  }
}
```

**Formats**: `csv`, `json`, `pdf`

**Response** (200 OK):

- Content-Type: `text/csv`, `application/json`, or `application/pdf`
- File attachment with timestamp

---

## Error Responses

All endpoints use consistent error formatting:

### 401 Unauthorized

```json
{
  "error": {
    "message": "included authorization token",
    "code": "NO_TOKEN"
  }
}
```

### 403 Forbidden

```json
{
  "error": {
    "message": "Insufficient permissions",
    "code": "FORBIDDEN"
  }
}
```

### 400 Bad Request

```json
{
  "error": {
    "message": "included required fields: field1, field2",
    "code": "MISSING_FIELDS"
  }
}
```

### 500 Internal Server Error

```json
{
  "error": {
    "message": "Internal server error",
    "code": "SERVER_ERROR"
  }
}
```

---

## Usage Examples

### Get Current System Health

```bash
curl https://api.qmoi.app/api/health
```

### Get Monitoring Dashboard

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.qmoi.app/api/admin/monitoring
```

### View Active Alerts

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.qmoi.app/api/admin/alerts
```

### Acknowledge an Alert

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alertId":"error_DATABASE_ERROR_1705318200000","action":"acknowledge"}' \
  https://api.qmoi.app/api/admin/alerts
```

### Get Audit Logs for User Deletions

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.qmoi.app/api/admin/audit-logs?action=DELETE&resource=user&skip=0&take=50"
```

### Export Audit Logs as CSV

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format":"csv","filters":{"action":"DELETE"}}' \
  https://api.qmoi.app/api/admin/audit-logs \
  --output audit-logs.csv
```

---

## Performance Metrics

The monitoring dashboard tracks these metrics for all endpoints:

- **count**: Total number of requests
- **successCount**: Successful requests (2xx/3xx)
- **failureCount**: Failed requests (4xx/5xx)
- **successRate**: Percentage of successful requests
- **avgDuration**: Average response time in ms
- **minDuration**: Minimum response time in ms
- **maxDuration**: Maximum response time in ms
- **p95Duration**: 95th percentile response time in ms
- **p99Duration**: 99th percentile response time in ms

---

## Alert Types

- `HIGH_ERROR_RATE`: Error rate exceeds threshold
- `PERFORMANCE_DEGRADATION`: Success rate drops below 95%
- `HIGH_MEMORY_USAGE`: Memory usage exceeds 85%
- `DATABASE_ERROR`: Database connectivity issues
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded for user/endpoint

---

## Rate Limiting

Default configuration:

- **Limit**: 100 requests per minute per user
- **Window**: 1 minute sliding window
- **Customizable**: Per-user, per-endpoint limits can be configured

Rate limit headers in responses (coming in v2.1.0):

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705318260
```

---

## Best Practices

1. **Health Checks**: Poll `/health` every 30 seconds for load balancer integration
2. **Alerts**: Set up webhooks for critical alerts (coming in v2.1.0)
3. **Audit Logs**: Review audit logs regularly for compliance
4. **Rate Limits**: Adjust for high-volume users to prevent throttling
5. **Monitoring**: Export metrics periodically for analytics and reporting

---

## Webhook Integration (executed v2.1.0)

Subscribe to alert notifications:

```bash
POST /admin/webhooks
{
  "url": "https://your-service.com/alerts",
  "events": ["CRITICAL_ALERT", "ERROR_THRESHOLD"],
  "secret": "webhook_secret"
}
```

---

## Support & Troubleshooting

- **High Error Rates**: Check `/admin/monitoring` for error types and frequency
- **Performance Issues**: Review p99Duration metrics to identify bottlenecks
- **Audit Trail**: Use `/admin/audit-logs` to track changes for debugging
- **Memory Leaks**: Monitor heapUsed trends over time in monitoring dashboard

For additional support, contact: api-support@[qmoi](https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai).app

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:06Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

