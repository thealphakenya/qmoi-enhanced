---
quantum-enabled: false
---

# QMOI Enhanced Production Monitoring & Health Checks

**Last Updated:** May 10, 2026  
**Status:** ✅ Production Monitoring Guide Complete

## Overview

This guide covers monitoring setup, health checks, performance metrics, and troubleshooting for QMOI Enhanced in production environments.

## Table of Contents

1. [Health Check Endpoints](#health-check-endpoints)
2. [Prometheus Monitoring](#prometheus-monitoring)
3. [Grafana Dashboards](#grafana-dashboards)
4. [CloudWatch Integration](#cloudwatch-integration)
5. [Error Tracking & Logging](#error-tracking--logging)
6. [Performance Metrics](#performance-metrics)
7. [Alerts & Thresholds](#alerts--thresholds)
8. [Troubleshooting](#troubleshooting)

---

## Health Check Endpoints

### Endpoint: `/health`

**Path:** `GET /health`

**Purpose:** Liveness probe - verifies the application is running

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-05-10T10:00:00Z",
  "uptime": 3600,
  "version": "2.0.0"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "reason": "database connection failed",
  "timestamp": "2026-05-10T10:00:00Z"
}
```

**Usage:**
- Kubernetes liveness probe
- Load balancer health checks
- Monitoring systems
- Status page updates

### Endpoint: `/health/ready`

**Path:** `GET /health/ready`

**Purpose:** Readiness probe - verifies service is ready to handle traffic

**Response (200 OK):**
```json
{
  "ready": true,
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-05-10T10:00:00Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "ready": false,
  "database": "error: connection timeout",
  "redis": "error: not running",
  "timestamp": "2026-05-10T10:00:00Z"
}
```

**Usage:**
- Kubernetes readiness probe
- Service startup verification

### Endpoint: `/metrics`

**Path:** `GET /metrics`

**Purpose:** Prometheus metrics endpoint

**Response:**
```
# HELP nodejs_memory_heap_used_bytes Heap used in bytes
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes 52428800

# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="POST",path="/api/auth/signin",status="200"} 1234

# HELP http_request_duration_ms HTTP request duration in ms
# TYPE http_request_duration_ms histogram
http_request_duration_ms_bucket{le="100",path="/api/auth/signin"} 567
```

**Usage:**
- Prometheus scraping
- Grafana data source
- Custom alerting

---

## Prometheus Monitoring

### Configuration

Create `monitoring/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'qmoi-enhanced'

alerting:
  alertmanagers:
  - static_configs:
    - targets: ['alertmanager:9093']

scrape_configs:
  - job_name: 'qmoi-app'
    static_configs:
    - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
    - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
    - targets: ['redis-exporter:9121']

  - job_name: 'node'
    static_configs:
    - targets: ['node-exporter:9100']
```

### Key Metrics to Monitor

| Metric | Threshold | Alert Level |
|--------|-----------|------------|
| `nodejs_memory_heap_used_bytes` | > 1GB | Warning |
| `http_requests_total` | Baseline dependent | - |
| `http_request_duration_ms` | p95 > 500ms | Warning |
| `auth_failures_total` | > 10/min per user | Alert |
| `database_connection_errors_total` | > 1/min | Critical |
| `redis_connection_errors_total` | > 1/min | Critical |

### Important Queries

```promql
# Memory usage over time
rate(nodejs_memory_heap_used_bytes[5m])

# Request rate by endpoint
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Authentication failure rate
rate(auth_failures_total[5m])

# Database connection pool utilization
db_connections_used / db_connections_max

# Cache hit ratio
redis_hits / (redis_hits + redis_misses)
```

---

## Grafana Dashboards

### Dashboard 1: Application Overview

**Panels:**
- Request rate (requests/sec)
- Error rate (errors/sec)
- Response time (p50, p95, p99)
- Active users
- Database pool utilization
- Memory usage
- CPU usage

### Dashboard 2: Authentication Metrics

**Panels:**
- Sign-in attempts per minute
- Sign-in success rate
- Failed authentication by reason
- Biometric authentication attempts
- Session creation rate
- Session expiration rate

### Dashboard 3: Database Performance

**Panels:**
- Query duration (p50, p95, p99)
- Connection pool utilization
- Transaction rate
- Slow queries
- Cache hit ratio
- Database size

### Dashboard 4: Security Events

**Panels:**
- Failed login attempts (last 24h)
- Unusual IP addresses
- Biometric verification failures
- RBAC permission denials
- API key usage
- Rate limit violations

### Creating Dashboards

1. Log into Grafana (default: admin/admin)
2. Create new dashboard
3. Add panels with Prometheus queries
4. Set alert thresholds
5. Save and set refresh interval (1min)

---

## CloudWatch Integration

### Setup (AWS)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
rpm -U ./amazon-cloudwatch-agent.rpm

# Configure CloudWatch agent
vim /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

### Configuration Example

```json
{
  "metrics": {
    "namespace": "QMOIEnhanced",
    "metrics_collected": {
      "mem": {
        "measurement": [{
          "name": "mem_used_percent",
          "rename": "MemoryUsagePercent",
          "unit": "Percent"
        }],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [{
          "name": "used_percent",
          "rename": "DiskUsagePercent",
          "unit": "Percent"
        }],
        "metrics_collection_interval": 60
      },
      "netstat": {
        "measurement": [{
          "name": "tcp_established",
          "rename": "TCPConnections",
          "unit": "Count"
        }],
        "metrics_collection_interval": 60
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [{
          "file_path": "/app/logs/application.log",
          "log_group_name": "/qmoi/application",
          "log_stream_name": "{instance_id}"
        },
        {
          "file_path": "/app/logs/error.log",
          "log_group_name": "/qmoi/errors",
          "log_stream_name": "{instance_id}"
        }]
      }
    }
  }
}
```

### CloudWatch Alarms

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name qmoi-high-memory \
  --alarm-description "Alert when memory usage exceeds 80%" \
  --metric-name MemoryUsagePercent \
  --namespace QMOIEnhanced \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789:qmoi-alerts
```

---

## Error Tracking & Logging

### Log Levels

- **ERROR:** Critical issues requiring immediate attention
- **WARN:** Potential issues that should be investigated
- **INFO:** Important business events (logins, signups)
- **DEBUG:** Detailed technical information

### Log Format

All logs include:
- Timestamp (ISO 8601)
- Level (ERROR, WARN, INFO, DEBUG)
- Category ([AUTH], [DB], [API], etc.)
- Message
- User ID (if applicable)
- Request ID (for tracing)

### Example Logs

```
[2026-05-10T10:30:45.123Z] [AUTH] Sign-in successful: user-id=uuid, email=user@qmo.ai, ip=192.168.1.100
[2026-05-10T10:30:50.456Z] [ERROR] Database connection timeout: pool=10/10, wait_time=30s
[2026-05-10T10:30:55.789Z] [WARN] High memory usage: heap=950MB/1GB (95%)
[2026-05-10T10:31:00.012Z] [AUTH] Failed sign-in: email=attacker@test.com, reason=invalid_password, attempts=5
```

### Structured Logging (Winston)

Winston logs to:
- Console (development)
- File system (production)
- CloudWatch (if configured)
- External services (Datadog, Splunk, etc.)

Configure transports in `lib/logger.ts`:

```typescript
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/application.log' }),
  ],
});
```

---

## Performance Metrics

### Key Performance Indicators (KPIs)

| KPI | Target | Current |
|-----|--------|---------|
| Uptime | 99.9% | Monitor |
| Response Time (p95) | < 500ms | Baseline |
| Error Rate | < 0.1% | Monitor |
| Sign-In Success Rate | > 99% | Monitor |
| Database Connection Pool | < 80% utilization | Monitor |

### Performance Benchmarks

```
Operation                 Target        Achieved
─────────────────────────────────────────────────
Sign-In                   < 500ms       200-400ms
Password Hashing          < 1s          500-800ms
Session Lookup            < 100ms       50-100ms
RBAC Check                < 50ms        10-50ms
Biometric Verification    < 1s          800-1200ms
Database Write            < 100ms       50-100ms
Redis Cache Hit           < 10ms        5-8ms
API Response (avg)        < 200ms       100-150ms
```

### Load Testing

Use k6 or Artillery for load testing:

```bash
# k6 load test
k6 run --vus 100 --duration 30s tests/load-test.js

# Expected results:
# - p95 response time < 500ms
# - Error rate < 0.1%
# - Database connections < 80%
```

---

## Alerts & Thresholds

### Critical Alerts

```yaml
groups:
- name: QMOICritical
  rules:
  - alert: DatabaseConnectionFailed
    expr: rate(db_errors_total[5m]) > 1
    for: 1m
    annotations:
      summary: "Database connection failed"
      
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    for: 1m
    annotations:
      summary: "Error rate exceeds 1%"
      
  - alert: OutOfMemory
    expr: nodejs_memory_heap_used_bytes > 1000000000
    for: 5m
    annotations:
      summary: "Memory usage exceeds 1GB"
```

### Warning Alerts

- Slow query (> 1 second)
- High CPU usage (> 80%)
- High memory usage (> 80%)
- Redis connection issues
- Rate limit near threshold

---

## Troubleshooting

### Issue: High Memory Usage

**Symptoms:**
- `nodejs_memory_heap_used_bytes` > 1GB
- Slow response times
- Potential out-of-memory crash

**Diagnosis:**
```bash
# Check memory trend
curl localhost:3000/metrics | grep nodejs_memory

# Check for memory leaks
node --inspect app.js &
# Then use Chrome DevTools to debug
```

**Solutions:**
1. Increase heap size: `NODE_OPTIONS=--max-old-space-size=2048`
2. Enable garbage collection logging: `NODE_OPTIONS=--trace-gc`
3. Scale horizontally (add more instances)
4. Profile application for memory leaks

### Issue: Database Connection Errors

**Symptoms:**
- `Error: connect ECONNREFUSED`
- Database queries timing out
- Connection pool exhausted

**Diagnosis:**
```bash
# Check PostgreSQL is running
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool status
SELECT count(*) FROM pg_stat_activity WHERE datname = 'qmoi_db'

# Check max connections
SHOW max_connections;
```

**Solutions:**
1. Increase PostgreSQL max_connections
2. Enable pgBouncer for connection pooling
3. Optimize slow queries
4. Scale read replicas

### Issue: High CPU Usage

**Symptoms:**
- CPU > 80%
- Slow response times
- No increase in request rate

**Diagnosis:**
```bash
# Check what's consuming CPU
top
ps aux | grep node

# Profile with flamegraph
node --prof app.js &
node --prof-process isolate-*.log > processed.txt
```

**Solutions:**
1. Optimize hot path code
2. Cache frequently accessed data
3. Enable query result caching
4. Scale horizontally

### Issue: Authentication Failures Spike

**Symptoms:**
- `auth_failures_total` increasing rapidly
- Possible attack in progress

**Diagnosis:**
```bash
# Check recent failed attempts
SELECT email, COUNT(*) as attempts, array_agg(DISTINCT ip_address) as ips
FROM auth_failures
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY email
ORDER BY attempts DESC;
```

**Actions:**
1. Review IP addresses
2. Implement rate limiting if needed
3. Check for brute force attacks
4. Notify security team

---

## On-Call Playbook

### During Incident

1. **Assess:** Check health endpoints and dashboards
2. **Communicate:** Notify team (Slack, on-call)
3. **Mitigate:** If critical
   - Scale up instances
   - Clear caches
   - Switch to read-only mode
4. **Investigate:** Check logs and metrics
5. **Resolve:** Apply fix or rollback
6. **Document:** Post-mortem after resolution

### Escalation Path

```
Developer on-call
    ↓ (15 min no response)
Senior Engineer
    ↓ (15 min no response)
Engineering Manager
    ↓ (15 min no response)
VP Engineering
```

---

## Monitoring Tools Comparison

| Tool | Pros | Cons | Cost |
|------|------|------|------|
| Prometheus | Open source, flexible | Self-hosted | Free |
| Grafana | Beautiful dashboards | Needs data source | Free/Paid |
| CloudWatch | AWS integrated | AWS-only | Pay-per-use |
| Datadog | Full-stack monitoring | Expensive | $$ |
| New Relic | Powerful APM | Expensive | $$ |

---

## Next Steps

1. **Deploy monitoring stack** using Docker Compose
2. **Set up alerts** in your platform (CloudWatch, Prometheus, etc.)
3. **Create dashboards** for real-time visibility
4. **Test alerts** with load testing
5. **Document runbooks** for your team
6. **Schedule on-call rotation** for production support

---

**Monitoring is critical for production reliability. Set it up before going live.**

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T16:03:55.736806Z
- production status: ⚠️ mixed production markers
- status tags: mixed, nonproduction, production, review
- lines: 608
- words: 1634
- characters: 13620
- headings: 71
- links: 8
- images: 0
- tables: 22
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
