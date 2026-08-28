# QMOI Background Automation - Quick Reference

## 🚀 Quick Start (30 seconds)

```bash
# 1. Setup environment
bash scripts/qmoi-background-setup.sh

# 2. Start app
npm run dev

# 3. Visit dashboard
# http://localhost:3000/admin
```

## 🔑 Key Concepts

| Concept            | What It Does                           |
| ------------------ | -------------------------------------- |
| **Auto-Scan**      | Periodically detects errors (7+ types) |
| **Health Monitor** | Continuously checks CPU/Memory/Disk    |
| **Auto-Fix**       | Automatically fixes detected errors    |
| **Alerts**         | Notifies of threshold breaches         |
| **Recovery**       | Auto-fixes critical health issues      |

## 📋 Configuration

### Via Environment

```bash
# Timing (in milliseconds)
QMOI_AUTO_SCAN_INTERVAL=300000           # 5 min (default)
QMOI_HEALTH_MONITOR_INTERVAL=30000       # 30 sec (default)

# Thresholds (0-100%)
QMOI_CPU_WARNING=70
QMOI_CPU_CRITICAL=90
QMOI_MEMORY_WARNING=75
QMOI_MEMORY_CRITICAL=95
QMOI_DISK_WARNING=80
QMOI_DISK_CRITICAL=95

# Flags
QMOI_AUTO_FIX_ON_ERRORS=true
QMOI_AUTO_FIX_ON_HEALTH_ISSUES=true
```

### Via API

```bash
# Get config
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/config

# Update config
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"autoScanInterval": 600000}' \
  http://localhost:3000/api/admin/autofix/config

# Reset to defaults
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/config
```

## 🎛️ Control Commands

```bash
# Get status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/background-automation

# Start automation
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}' \
  http://localhost:3000/api/admin/autofix/background-automation

# Stop automation
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}' \
  http://localhost:3000/api/admin/autofix/background-automation

# Restart automation
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "restart"}' \
  http://localhost:3000/api/admin/autofix/background-automation
```

## 📊 Status Endpoints

```bash
# Auto-scan status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/autoscan

# Health monitor status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/healthmonitor

# Bootstrap logs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/bootstrap
```

## 📁 Log Files

```
.logs/
├── qmoi-bootstrap.log          # App startup logs
├── qmoi-autoscan.log           # Error scanning logs
└── qmoi-health-monitor.log     # Health checking logs
```

**View logs:**

```bash
tail -f .logs/qmoi-autoscan.log
tail -f .logs/qmoi-health-monitor.log
tail -50 .logs/qmoi-bootstrap.log
```

## 🔐 Authentication

All APIs require Bearer token:

```bash
Authorization: Bearer YOUR_ADMIN_TOKEN
```

Set `ADMIN_TOKEN` in `.env.local`:

```bash
ADMIN_TOKEN=your-secure-token-here
```

## 💡 Common Tasks

### Check if automation is running

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/background-automation | jq '.status'
```

### Get latest statistics

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/autoscan | jq '.statistics'
```

### View last 20 logs

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/autoscan | jq '.logs[-20:]'
```

### Increase scan interval (10 minutes)

```bash
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"autoScanInterval": 600000}' \
  http://localhost:3000/api/admin/autofix/config
```

### Adjust CPU threshold (80%)

```bash
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cpuThresholdWarning": 80}' \
  http://localhost:3000/api/admin/autofix/config
```

### View recent alerts

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/autofix/healthmonitor | jq '.alerts[-10:]'
```

## 🆘 Quick Troubleshooting

| Problem               | Solution                                         |
| --------------------- | ------------------------------------------------ |
| Services not starting | Check `.logs/qmoi-bootstrap.log`                 |
| No errors detected    | Run manual scan, check `.logs/qmoi-autoscan.log` |
| High CPU usage        | Increase `QMOI_AUTO_SCAN_INTERVAL`               |
| No health alerts      | Verify thresholds aren't too high                |
| API returns 403       | Check `ADMIN_TOKEN` is correct                   |

## ⚙️ Performance Tuning

### For Production (Less Frequent)

```bash
QMOI_AUTO_SCAN_INTERVAL=600000         # 10 min
QMOI_HEALTH_MONITOR_INTERVAL=60000     # 1 min
```

### For Development (More Frequent)

```bash
QMOI_AUTO_SCAN_INTERVAL=60000          # 1 min
QMOI_HEALTH_MONITOR_INTERVAL=10000     # 10 sec
```

## 🔍 Default Thresholds

| Metric | Warning | Critical |
| ------ | ------- | -------- |
| CPU    | 70%     | 90%      |
| Memory | 75%     | 95%      |
| Disk   | 80%     | 95%      |

## 📚 File Locations

| Purpose           | Location                                    |
| ----------------- | ------------------------------------------- |
| Configuration     | `lib/qmoi-automation-config.ts`             |
| Bootstrap         | `lib/qmoi-bootstrap.ts`                     |
| Auto-Scan Service | `lib/qmoi-background-autoscan.ts`           |
| Health Monitor    | `lib/qmoi-health-monitor.ts`                |
| Manager           | `lib/qmoi-automation-manager.ts`            |
| Middleware        | `middleware.ts`                             |
| APIs              | `app/api/admin/autofix/*/route.ts`          |
| Setup Script      | `scripts/qmoi-background-setup.sh`          |
| Quick Start       | `docs/QMOI_BACKGROUND_AUTOMATION_README.md` |
| Full Guide        | `docs/QMOI_BACKGROUND_AUTOMATION_GUIDE.md`  |
| Summary           | `docs/IMPLEMENTATION_SUMMARY.md`            |

## 🎯 Endpoint Summary

| Method | Endpoint                                   | Purpose                      |
| ------ | ------------------------------------------ | ---------------------------- |
| GET    | `/api/admin/autofix/background-automation` | Get status                   |
| POST   | `/api/admin/autofix/background-automation` | Control (start/stop/restart) |
| GET    | `/api/admin/autofix/autoscan`              | Auto-scan status             |
| GET    | `/api/admin/autofix/healthmonitor`         | Health monitor status        |
| GET    | `/api/admin/autofix/config`                | Get configuration            |
| POST   | `/api/admin/autofix/config`                | Update configuration         |
| PUT    | `/api/admin/autofix/config`                | Update configuration         |
| DELETE | `/api/admin/autofix/config`                | Reset to defaults            |
| GET    | `/api/admin/autofix/bootstrap`             | Get bootstrap logs           |
| DELETE | `/api/admin/autofix/bootstrap`             | Clear bootstrap logs         |

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] App starts without errors
- [ ] Dashboard shows "Running" status
- [ ] Auto-scan logs in `.logs/qmoi-autoscan.log`
- [ ] Health monitor logs in `.logs/qmoi-health-monitor.log`
- [ ] API endpoints respond (200 status)
- [ ] Statistics updating in real-time
- [ ] No authorization errors (403)

## 🚀 Next Steps

1. Setup: `bash scripts/qmoi-background-setup.sh`
2. Start: `npm run dev`
3. Dashboard: `http://localhost:3000/admin`
4. Monitor: Check `.logs/` directory
5. Configure: Adjust intervals and thresholds
6. Deploy: Move to production when ready

---

**Quick Reference v1.0 | QMOI Background Automation System**
