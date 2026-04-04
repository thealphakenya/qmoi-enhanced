# 🔌 PRODUCTION MONITORING DASHBOARD SETUP
**Version**: 1.0  
**Created**: April 4, 2026  
**Status**: Ready for Implementation  

---

## Overview

Complete setup guide for production monitoring dashboards, alerting systems, and real-time metrics collection for QMOI Enhanced v2.4.0.

---

## 📊 MONITORING STACK ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                  MONITORING DASHBOARD                       │
│  (Grafana / PM2 Web / CloudWatch / DataDog)                │
└─────────────────────────────────────────────────────────────┘
                          ↑
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │Prometheus│  │  PM2     │  │  Sentry  │
    │ Metrics  │  │ Metrics  │  │  Errors  │
    └──────────┘  └──────────┘  └──────────┘
          ↑               ↑               ↑
    ┌─────────────────────────────────────────┐
    │         Application Server (Node.js)    │
    │  ├── CPU, Memory, Disk                  │
    │  ├── HTTP Requests, Response Times      │
    │  ├── Database Queries, Connection Pool  │
    │  ├── Error Rates, Exceptions            │
    │  └── Custom Business Metrics             │
    └─────────────────────────────────────────┘
```

---

## 🎯 KEY METRICS TO MONITOR

### Application Metrics

| Metric | Target | Alert Threshold | Collection |
|--------|--------|-----------------|------------|
| Response Time (p95) | < 500ms | > 1000ms | Prometheus |
| Error Rate | < 0.1% | > 1% | Sentry |
| Throughput | > 100 req/s | < 50 req/s | PM2 |
| CPU Usage | < 70% | > 90% | Node Exporter |
| Memory Usage | < 70% | > 85% | PM2 |
| Database Connections | < 80% | > 95% | Custom |

### Business Metrics

| Metric | Frequency | Method |
|--------|-----------|--------|
| Total Transactions | Daily | Database Query |
| Revenue Generated | Daily | Database Sum |
| Active Users | Hourly | Cache/Database |
| Payment Success Rate | Real-time | Event Tracking |
| Failed Payments | Real-time | Event Tracking |
| API Health Score | Continuous | Health Checks |

### Infrastructure Metrics

| Metric | Warning | Critical |
|--------|---------|----------|
| Disk Space | > 75% | > 90% |
| Memory Available | < 25% | < 10% |
| Load Average | > 4 | > 8 |
| Network I/O | > 80% | > 95% |
| Database Size | > 5GB | > 10GB |
| Log File Size | > 1GB | > 5GB |

---

## 🔧 IMPLEMENTATION OPTIONS

### Option 1: PM2 Web Dashboard (Lightweight)

**Setup**:
```bash
# Already included with PM2
pm2 web
# Access at http://localhost:9615
```

**Includes**:
- Process status
- Memory/CPU usage
- Log streaming
- Basic alerting

**Pros**: Built-in, no additional setup, lightweight
**Cons**: Limited visualizations, basic features

---

### Option 2: Prometheus + Grafana (Recommended)

**Installation**:
```bash
# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar -xzf prometheus-2.40.0.linux-amd64.tar.gz
sudo mv prometheus-2.40.0.linux-amd64 /opt/prometheus

# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get update
sudo apt-get install -y grafana-server

# Install Node Exporter
sudo useradd --no-create-home --shell /bin/false node_exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
tar -xzf node_exporter-1.5.0.linux-amd64.tar.gz
sudo cp node_exporter-1.5.0.linux-amd64/node_exporter /usr/local/bin/
```

**Configuration**:
```yaml
# /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - localhost:9093

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'Node Exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'Prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'Application'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'PostgreSQL'
    static_configs:
      - targets: ['localhost:9187']
```

**Start services**:
```bash
# Prometheus
sudo systemctl start prometheus
sudo systemctl enable prometheus

# Grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Node Exporter
sudo systemctl start node_exporter
sudo systemctl enable node_exporter

# Access Grafana at http://localhost:3000
# Default credentials: admin / admin
```

**Grafana Dashboard Setup**:
1. Add Prometheus as data source
2. Import community dashboards:
   - Node Exporter Full (ID: 1860)
   - PostgreSQL (ID: 9628)
   - Node.js Application (ID: 11074)
3. Create custom dashboards for business metrics

---

### Option 3: DataDog (Cloud-Based)

**Setup**:
```bash
# Install DataDog Agent
DD_AGENT_MAJOR_VERSION=7 \
DD_API_KEY=YOUR_API_KEY \
DD_SITE="datadoghq.com" \
bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_agent.sh)"

# Configure for Node.js
npm install dd-trace --save

# Enable in application
# node -r dd-trace/init app.js
```

**Metrics collected**:
- System metrics (CPU, memory, disk, network)
- Logs from application
- APM (application performance monitoring)
- Custom metrics

**Access**: https://app.datadoghq.com/

---

### Option 4: Sentry Error Tracking

**Setup**:
```bash
# Install Sentry SDK
npm install @sentry/node --save

# Configure in application
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});
```

**Captures**:
- Unhandled exceptions
- Promise rejections
- API errors
- Performance metrics

**Access**: https://sentry.io/

---

## 📱 ALERT CONFIGURATION

### Alert Rules (prometheus alert_rules.yml)

```yaml
groups:
  - name: application_alerts
    interval: 30s
    rules:
      # Application Health
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: LowAvailability
        expr: up{job="Application"} == 0
        for: 1m
        annotations:
          summary: "Application is down"

      # System Resources
      - alert: HighMemoryUsage
        expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.15
        for: 5m
        annotations:
          summary: "Memory usage > 85%"

      - alert: HighDiskUsage
        expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 90
        for: 5m
        annotations:
          summary: "Disk usage > 90%"

      - alert: HighCPUUsage
        expr: rate(node_cpu_seconds_total[5m]) > 0.9
        for: 5m
        annotations:
          summary: "CPU usage > 90%"

      # Database
      - alert: HighDatabaseConnections
        expr: pg_stat_activity_count > 80
        for: 5m
        annotations:
          summary: "Database connections > 80"

      - alert: SlowQueries
        expr: pg_stat_statements_mean_exec_time > 1000
        for: 5m
        annotations:
          summary: "Slow database queries detected"

      # SSL Certificate
      - alert: SSLCertificateExpiring
        expr: ssl_cert_days_to_expiry < 30
        for: 1h
        annotations:
          summary: "SSL certificate expiring in < 30 days"
```

### Email Alert Setup

```bash
# Create AlertManager configuration
sudo tee /etc/alertmanager/alertmanager.yml << EOF
global:
  resolve_timeout: 5m
  slack_api_url: 'YOUR_SLACK_WEBHOOK'
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'
  smtp_from: 'alerts@yourdomain.com'

route:
  receiver: 'default'
  group_by:
    - alertname
    - cluster
    - service
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
      continue: true
    - match:
        severity: warning
      receiver: 'email'

receivers:
  - name: 'default'
    email_configs:
      - to: 'ops@yourdomain.com'
        headers:
          Subject: '{{ .GroupLabels.alertname }}'
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
  - name: 'slack'
    slack_configs:
      - channel: '#alerts'
        title: 'Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
EOF

# Start AlertManager
sudo systemctl start alertmanager
sudo systemctl enable alertmanager
```

---

## 📈 CUSTOM METRICS

### Application Instrumentation

```javascript
// Add to your Node.js application
const client = require('prom-client');

// Default metrics
client.collectDefaultMetrics();

// Custom metrics
const transactionsCounter = new client.Counter({
  name: 'transactions_total',
  help: 'Total transactions processed',
  labelNames: ['status', 'payment_processor']
});

const revenueGauge = new client.Gauge({
  name: 'revenue_generated',
  help: 'Total revenue generated in KES',
  labelNames: ['processor']
});

const apiLatency = new client.Histogram({
  name: 'api_request_duration_ms',
  help: 'API request latency',
  buckets: [100, 250, 500, 1000, 2500, 5000],
  labelNames: ['endpoint']
});

// Expose metrics endpoint
const express = require('express');
const app = express();

app.get('/metrics', (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
});

// Track transactions
app.post('/api/transaction', (req, res) => {
  const start = Date.now();
  
  // ... process transaction ...
  
  transactionsCounter.labels(status, processor).inc();
  apiLatency.labels('/api/transaction').observe(Date.now() - start);
  revenueGauge.labels(processor).set(totalRevenue);
  
  res.json(result);
});

module.exports = app;
```

---

## 🎯 DASHBOARD TEMPLATES

### System Overview Dashboard

**Panels**:
```
┌──────────────────────────────────────┐
│ CPU Usage (%)    │ Memory Usage (%)  │
├──────────────────────────────────────┤
│ Disk Space (%)   │ Network I/O (MB/s)│
├──────────────────────────────────────┤
│  Load Average (1m, 5m, 15m)          │
├──────────────────────────────────────┤
│ Process Count    │ Open Connections │
└──────────────────────────────────────┘
```

### Application Performance Dashboard

**Panels**:
```
┌──────────────────────────────────────┐
│ Requests/sec   │ Error Rate (%)      │
├──────────────────────────────────────┤
│ Response Time p95  │ Response Time p99│
├──────────────────────────────────────┤
│ Uptime (%)     │ Health Score       │
├──────────────────────────────────────┤
│ Memory Usage   │ CPU Usage          │
└──────────────────────────────────────┘
```

### Database Dashboard

**Panels**:
```
┌──────────────────────────────────────┐
│ Active Connections │ Database Size   │
├──────────────────────────────────────┤
│ Query Time (ms)    │ Slow Queries    │
├──────────────────────────────────────┤
│ Transaction Rate   │ Replication Lag │
├──────────────────────────────────────┤
│ Cache Hit Ratio    │ Disk Usage      │
└──────────────────────────────────────┘
```

### Business Metrics Dashboard

**Panels**:
```
┌──────────────────────────────────────┐
│ Revenue Today  │ Revenue This Week   │
├──────────────────────────────────────┤
│ Active Users   │ New Users (Today)   │
├──────────────────────────────────────┤
│ Transaction Success Rate (%)         │
├──────────────────────────────────────┤
│ Payment Processor Performance        │
├──────────────────────────────────────┤
│ Top Revenue Sources                  │
└──────────────────────────────────────┘
```

---

## 📞 NOTIFICATION CHANNELS

### Email Notifications

```bash
# Configure in AlertManager or monitoring tool
- Type: Email
- Recipients: ops@yourdomain.com, oncall@yourdomain.com
- Frequency: Immediate for Critical, 15min for Warning
```

### Slack Notifications

```bash
# Create Slack webhook
# In AlertManager config:
slack_configs:
  - channel: '#alerts'
    api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
    icon_emoji: ':warning:'
    title: '{{ .GroupLabels.alertname }}'
```

### PagerDuty Integration

```bash
# For on-call incident response
# Configure routing rules:
- Critical Alerts → Immediate PagerDuty trigger
- Warning Alerts → Email notification
- Info Alerts → Slack channel
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Prometheus scraping metrics from all targets
- [ ] Grafana dashboards created and displaying data
- [ ] AlertManager receiving alerts from Prometheus
- [ ] Email notifications working
- [ ] Slack integration working (if configured)
- [ ] PagerDuty integration working (if configured)
- [ ] Custom application metrics exposed
- [ ] Database metrics being collected
- [ ] System metrics being collected
- [ ] Alert thresholds properly calibrated
- [ ] Dashboards displaying real-time data
- [ ] Historical data being retained
- [ ] Retention policies configured

---

## 📚 RESOURCES

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [DataDog Documentation](https://docs.datadoghq.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**Status**: Ready for Implementation  
**Last Updated**: April 4, 2026  
**Next Review**: April 11, 2026
