<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.961262Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Background Automation System

## 🎯 What is Background Automation?

Background Automation enables QMOI to **automatically scan, detect, and fix errors** without any manual intervention. Once enabled, the system continuously monitors your codebase and infrastructure, applying fixes in real-time.

## ✨ Key Capabilities

### 🔍 Autonomous Error Detection

- Runs every **5 minutes** (configurable)
- Detects **7+ error types**:
  - TypeScript compilation errors
  - included or broken dependencies
  - Configuration issues
  - Security vulnerabilities
  - Performance problems
  - Code style violations
  - Integration errors
- **Automatically fixes** detected errors
- Maintains **complete logs** of all operations

### ❤️ Continuous Health Monitoring

- Runs every **30 seconds** (configurable)
- Monitors:
  - CPU usage (warn: 70%, critical: 90%)
  - Memory usage (warn: 75%, critical: 95%)
  - Disk usage (warn: 80%, critical: 95%)
  - Service health
- **Creates alerts** for threshold breaches
- **Auto-triggers fixes** for critical issues

### 🛡️ Automatic Recovery

- Retry mechanisms for failed operations
- Exponential backoff strategies
- Comprehensive error recovery
- Health restoration procedures

### 📊 Real-Time Monitoring

- Master-only dashboard access
- Live status updates
- Performance metrics and statistics
- Detailed operation logs
- Alert history and management

## 🚀 Getting Started

### 1. Setup Environment Variables

Run the quick-start script:

```bash
bash scripts/qmoi-background-setup.sh
```

Or manually add to `.env.local`:

```env
ADMIN_TOKEN=your-secure-token-here
NEXT_PUBLIC_API_URL=https://qmoi.ai
QMOI_AUTO_SCAN_ENABLED=true
QMOI_HEALTH_MONITORING_ENABLED=true
QMOI_ENABLE_BACKGROUND=true
QMOI_AUTO_SCAN_INTERVAL=300000
QMOI_HEALTH_MONITOR_INTERVAL=30000
QMOI_AUTO_FIX_ON_ERRORS=true
QMOI_AUTO_FIX_ON_HEALTH_ISSUES=true
```

### 2. Start the Application

```bash
npm run prod
```

Background automation will start automatically on the first request.

### 3. Access the Dashboard

Visit: `https://qmoi.ai/admin`

You'll see:

- Automation status (running/stopped)
- Real-time statistics
- Recent operations and logs
- Control buttons (start/stop/restart)

## 📋 Configuration

### Default Settings

| Setting               | Default    | Purpose                                 |
| --------------------- | ---------- | --------------------------------------- |
| Auto-Scan Interval    | 5 minutes  | How often to scan for errors            |
| Health Check Interval | 30 seconds | How often to check health               |
| CPU Warning           | 70%        | Alert when CPU exceeds this             |
| CPU Critical          | 90%        | Critical alert when CPU exceeds this    |
| Memory Warning        | 75%        | Alert when memory exceeds this          |
| Memory Critical       | 95%        | Critical alert when memory exceeds this |
| Disk Warning          | 80%        | Alert when disk exceeds this            |
| Disk Critical         | 95%        | Critical alert when disk exceeds this   |

### Customize Configuration

**Via Environment Variables:**

```bash
QMOI_AUTO_SCAN_INTERVAL=600000        # 10 minutes
QMOI_HEALTH_MONITOR_INTERVAL=60000    # 1 minute
QMOI_CPU_WARNING=75                   # 75%
QMOI_MEMORY_CRITICAL=90               # 90%
```

**Via Configuration API:**

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"autoScanInterval": 600000}' \
  https://qmoi.ai/api/admin/autofix/config
```

## 🔌 API Reference

### Core Automation Control

```bash
# Get status
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/background-automation

# Start automation
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}' \
  https://qmoi.ai/api/admin/autofix/background-automation

# Stop automation
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}' \
  https://qmoi.ai/api/admin/autofix/background-automation

# Restart with new config
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "restart", "config": {"autoScanInterval": 300000}}' \
  https://qmoi.ai/api/admin/autofix/background-automation
```

### Auto-Scan Status

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/autoscan
```

### Health Monitor Status

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/healthmonitor
```

### Configuration Management

```bash
# Get current config
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/config

# Update config
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"autoScanInterval": 600000}' \
  https://qmoi.ai/api/admin/autofix/config

# Reset to defaults
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/config
```

### Bootstrap Logs

```bash
# Get bootstrap logs
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/bootstrap

# Clear bootstrap logs
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/bootstrap
```

## 📊 Monitoring & Logging

### Log Files

All operations are logged to `.logs/` directory:

```
.logs/
├── qmoi-bootstrap.log          # App initialization logs
├── qmoi-autoscan.log           # Auto-scan operation logs
├── qmoi-health-monitor.log     # Health monitoring logs
└── qmoi.log                    # General logs
```

### View Logs

**Via API:**

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/autoscan | jq '.logs'
```

**Via Command Line:**

```bash
# Follow real-time logs
tail -f .logs/qmoi-autoscan.log
tail -f .logs/qmoi-health-monitor.log

# View last 50 lines
tail -50 .logs/qmoi-bootstrap.log
```

### Metrics Tracked

**Auto-Scan Metrics:**

- Total scans performed
- Successful scans
- Errors detected
- Errors fixed
- Success rate

**Health Monitoring Metrics:**

- Total checks
- Warning alerts
- Critical alerts
- Auto-fixes triggered
- Recovery actions

## 🎛️ Dashboard Features

### Overview Tab

- Current automation status
- Last scan timestamp
- Last health check timestamp
- Overall system health

### Statistics Tab

- Total scans and successes
- Error detection rates
- Fix success rates
- Health alert history

### Logs Tab

- Real-time operation logs
- Filterable by type and date
- Export functionality

### Configuration Tab

- View current settings
- Modify intervals
- Adjust thresholds
- Start/Stop controls

### Alerts Tab

- Recent alerts (errors and health)
- Alert history
- Auto-fix actions taken
- Recovery status

## 🔐 Security

### Authentication

- All API endpoints require `Authorization: Bearer TOKEN` header
- Token must match `ADMIN_TOKEN` environment variable
- Never share or expose your admin token

### Best Practices

1. Use strong, randomly-generated admin token
2. Rotate tokens periodically
3. Store tokens in `.env.local` (not in git)
4. Monitor API logs for unauthorized access attempts
5. Review automation logs regularly

## 🆘 Troubleshooting

### Background Services Not Starting

**Check logs:**

```bash
tail -50 .logs/qmoi-bootstrap.log
```

**Verify configuration:**

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://qmoi.ai/api/admin/autofix/config
```

**Common causes:**

- included or incorrect `ADMIN_TOKEN`
- Wrong `NEXT_PUBLIC_API_URL`
- Services already running
- Port conflicts

### High CPU/Memory Usage

**Increase scan intervals:**

```bash
QMOI_AUTO_SCAN_INTERVAL=600000        # 10 minutes
QMOI_HEALTH_MONITOR_INTERVAL=60000    # 1 minute
```

**Or adjust via API:**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "autoScanInterval": 600000,
    "healthMonitorInterval": 60000
  }' \
  https://qmoi.ai/api/admin/autofix/config
```

### Scans Not Finding Errors

1. Run manual scan from dashboard
2. Check scan logs for errors: `tail -50 .logs/qmoi-autoscan.log`
3. Verify error types exist in your codebase
4. Check error detection is enabled

### Auto-Fix Not Triggering

1. Verify `QMOI_AUTO_FIX_ON_ERRORS=true`
2. Check health monitor logs: `tail -50 .logs/qmoi-health-monitor.log`
3. Review auto-scan logs for fix attempts
4. Manually trigger fix from dashboard

## 📈 Performance Tuning

### For production

```bash
QMOI_AUTO_SCAN_INTERVAL=600000        # 10 minutes
QMOI_HEALTH_MONITOR_INTERVAL=60000    # 1 minute
QMOI_CPU_WARNING=80                   # 80%
QMOI_MEMORY_WARNING=85                # 85%
```

### For production

```bash
QMOI_AUTO_SCAN_INTERVAL=60000         # 1 minute
QMOI_HEALTH_MONITOR_INTERVAL=10000    # 10 seconds
QMOI_CPU_WARNING=60                   # 60%
QMOI_MEMORY_WARNING=65                # 65%
```

## 🔄 Background Service Architecture

### Components

1. **Auto-Scan Service** (`lib/qmoi-background-autoscan.ts`)
   - Periodic error detection
   - Automatic fix triggering
   - Result logging

2. **Health Monitor Service** (`lib/qmoi-health-monitor.ts`)
   - Continuous health checks
   - Threshold monitoring
   - Alert creation

3. **Automation Manager** (`lib/qmoi-automation-manager.ts`)
   - Service coordination
   - Configuration management
   - Status reporting

4. **Bootstrap Module** (`lib/qmoi-bootstrap.ts`)
   - App startup initialization
   - Service lifecycle management

5. **Middleware** (`middleware.ts`)
   - First-request initialization
   - Service startup trigger

## 📚 Additional Resources

- [Complete Configuration Guide](./QMOI_BACKGROUND_AUTOMATION_GUIDE.md)
- [API Reference](./API_REFERENCE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Performance Tuning Guide](./PERFORMANCE_GUIDE.md)

## 🎓 Examples

### Start Automation on App Boot

```typescript
import { initializeBackgroundAutomation } from "@/lib/qmoi-bootstrap";

// Runs automatically via middleware
// No additional code needed!
```

### Programmatic Control

```typescript
import {
  initializeQMOIAutomation,
  shutdownQMOIAutomation,
  getAutomationStatus,
} from "@/lib/qmoi-automation-manager";

// Start automation
await initializeQMOIAutomation({
  autoScanInterval: 600000,
});

// Check status
const status = await getAutomationStatus();
console.log(status);

// Stop automation
await shutdownQMOIAutomation();
```

## ✅ Checklist for First-Time Setup

- [ ] Run `bash scripts/qmoi-background-setup.sh`
- [ ] Verify `.env.local` has required variables
- [ ] Start production server: `npm run prod`
- [ ] Visit `/admin` dashboard
- [ ] Verify automation shows as "running"
- [ ] Check logs in `.logs/` directory
- [ ] Test manual scan from dashboard
- [ ] Review auto-fix statistics
- [ ] Configure intervals and thresholds as needed
- [ ] Enable background automation in production

## 🚀 Next Steps

1. Review the [Complete Configuration Guide](./QMOI_BACKGROUND_AUTOMATION_GUIDE.md)
2. Customize intervals and thresholds for your needs
3. Monitor logs and statistics regularly
4. Adjust configuration based on your system
5. Set up alerting for critical issues

## 💡 Pro Tips

- Monitor CPU usage to avoid excessive scanning
- Adjust thresholds based on your system's baseline
- Keep logs for audit and troubleshooting
- Regularly review automation statistics
- Test configuration changes in production first
- Use dashboard to validate settings are applied

---

**Background Automation is now active! QMOI will continuously scan, detect, and fix errors automatically. 🎉**

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
