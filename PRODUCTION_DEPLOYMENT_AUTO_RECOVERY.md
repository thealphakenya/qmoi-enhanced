# QMOI Enhanced - Production Deployment with Auto-Recovery

**Status:** Production-Ready  
**Build Date:** January 21, 2026  
**QMOI Auto-Recovery:** Enabled ✅

---

## Overview

This guide provides step-by-step instructions to deploy QMOI Enhanced to production with:

- **Automatic environment variable configuration** (QMOI auto-setup)
- **Self-healing capabilities** with continuous health monitoring
- **Memory-based state persistence** for recovery
- **Zero-downtime deployments** with PM2
- **Real-time alerting** and monitoring

---

## Phase 1: Pre-Deployment Verification

### 1. Verify Build Status

```bash
# Check if build is successful
npm run ci:build

# Expected output:
# ✅ Build completed successfully
# 150+ API endpoints compiled
# 102 KB shared chunks
```

### 2. Verify Environment

```bash
# Check Node.js version (18+ required)
node --version

# Check npm version
npm --version

# Verify PM2 is available
pm2 --version
# If not installed: npm install -g pm2
```

### 3. Check Critical Files

```bash
# Verify configuration files exist
ls -la .env.production
ls -la ecosystem.config.production.cjs
ls -la scripts/qmoi-production-*.js
```

---

## Phase 2: Automatic Initialization

### 1. Run Auto-Initialization

```bash
# This script will automatically:
# - Setup environment variables
# - Install dependencies
# - Build the application
# - Prepare the database
# - Configure PM2
# - Verify everything

node scripts/qmoi-production-init.js
```

**What this does:**

- ✅ Loads `.env.production`
- ✅ Installs production dependencies
- ✅ Builds Next.js application
- ✅ Runs database migrations
- ✅ Configures PM2 ecosystem
- ✅ Starts health monitoring
- ✅ Verifies all systems

### 2. Review Output

The script will display:

- ✅ All systems initialized
- 📋 Next steps checklist
- 🎯 Production deployment readiness

---

## Phase 3: Production Deployment

### Option A: Traditional Server Deployment

#### 3A.1: Setup Server Environment

```bash
# SSH to production server
ssh user@your-server.com

# Create application directory
sudo mkdir -p /var/www/qmoi-enhanced
sudo chown $USER:$USER /var/www/qmoi-enhanced

# Clone repository
git clone https://github.com/thealphakenya/qmoi-enhanced.git /var/www/qmoi-enhanced
cd /var/www/qmoi-enhanced
```

#### 3A.2: Initialize Application

```bash
# Copy and configure environment
cp .env.production .env
nano .env  # Edit with your production secrets

# Run automatic initialization
node scripts/qmoi-production-init.js
```

#### 3A.3: Start Application with PM2

```bash
# Start all processes defined in ecosystem config
pm2 start ecosystem.config.production.cjs --env production

# Verify processes are running
pm2 list

# Expected output:
# Name                      Status
# qmoi-app                  online
# qmoi-health-monitor       online
# qmoi-dashboard            online
```

#### 3A.4: Enable Auto-Start on Reboot

```bash
# Save PM2 configuration
pm2 save

# Setup system startup (requires sudo)
sudo pm2 startup systemd -u $USER --hp $HOME

# Verify startup is configured
pm2 list  # Should show auto-start settings
```

### Option B: Docker Deployment

#### 3B.1: Build Docker Image

```bash
# Build the production image
docker build -t qmoi-enhanced:latest .

# Tag for your registry
docker tag qmoi-enhanced:latest your-registry/qmoi-enhanced:latest

# Push to registry
docker push your-registry/qmoi-enhanced:latest
```

#### 3B.2: Deploy with Docker Compose

```bash
# Copy compose file
cp docker-compose.yml docker-compose.production.yml

# Configure environment
cp .env.production docker.env

# Edit production settings
nano docker.env

# Start containers
docker-compose -f docker-compose.production.yml up -d

# Verify containers are running
docker-compose ps
```

### Option C: Vercel Deployment

#### 3C.1: Connect Repository

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Set production environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... add all critical variables
```

#### 3C.2: Deploy

```bash
# Deploy to production
vercel --prod

# Verify deployment
vercel deployments

# Check production domain
vercel domains ls
```

---

## Phase 4: Verification & Testing

### 4.1: Health Check Endpoint

```bash
# Test the health endpoint
curl http://your-domain/api/health

# Expected response:
# {
#   "status": "healthy",
#   "uptime": 1234,
#   "timestamp": "2026-01-21T..."
# }
```

### 4.2: Monitor Application

```bash
# View all running processes
pm2 list

# Monitor in real-time
pm2 monit

# View application logs
pm2 logs qmoi-app

# View health monitor logs
pm2 logs qmoi-health-monitor

# View last 100 lines
pm2 logs --lines 100
```

### 4.3: Database Connectivity

```bash
# Test database connection
curl http://your-domain/api/health | grep database

# Check database status in logs
pm2 logs | grep -i "database"
```

### 4.4: Health Monitor Status

```bash
# Check health memory
cat .qmoi_state/health_memory.json

# View health history
tail -f logs/health-check.log

# Check recovery statistics
grep "Recovery" logs/qmoi_health_monitor.log
```

---

## Phase 5: QMOI Auto-Recovery System

### How It Works

**Continuous Monitoring** (Every 30 seconds):

- ✅ API health endpoint check
- ✅ Database connectivity verification
- ✅ Memory usage monitoring
- ✅ Disk space check
- ✅ Process health verification
- ✅ File system integrity check
- ✅ External dependencies validation

**Automatic Recovery**:

- 🔧 Detects unhealthy states
- 🔄 Attempts automatic recovery
- 💾 Persists recovery attempts in memory
- 📊 Tracks success/failure metrics
- 🚨 Alerts admins on critical failures

**Memory Persistence**:

- 📝 Stores successful recoveries
- 📝 Tracks failed attempts
- 📝 Maintains issue history
- 📝 Enables intelligent recovery decisions

### 5.1: Configure Auto-Recovery

#### Set Environment Variables

```bash
# Update .env.production with:

# Alert configuration
ALERT_EMAIL=your-admin@email.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK

# Auto-recovery settings
QMOI_AUTO_FIX_ENABLED=true
QMOI_ERROR_AUTO_RECOVER=true
QMOI_MEMORY_PERSISTENCE=true
QMOI_HEALTH_CHECK_INTERVAL=30000
```

#### Restart Health Monitor

```bash
# Restart to apply new configuration
pm2 restart qmoi-health-monitor

# Verify it started
pm2 logs qmoi-health-monitor
```

### 5.2: Monitor Recovery Actions

```bash
# View health monitor logs in real-time
pm2 logs qmoi-health-monitor

# View recovery attempts
grep "Recovery" logs/qmoi_health_monitor.log

# View recovery statistics
cat .qmoi_state/health_memory.json | jq '.successfulRecoveries'
```

### 5.3: Manual Intervention

If automatic recovery reaches max attempts:

```bash
# Check what failed
cat .qmoi_state/health_memory.json | jq '.failedRecoveries'

# Restart the failing service
pm2 restart qmoi-app

# Reset recovery counters
rm .qmoi_state/health_memory.json
pm2 restart qmoi-health-monitor
```

---

## Phase 6: Monitoring & Maintenance

### 6.1: Daily Monitoring

**Morning Check:**

```bash
# SSH to server
ssh user@your-server.com
cd /var/www/qmoi-enhanced

# Check all processes
pm2 list

# Check health logs
pm2 logs qmoi-health-monitor | head -50

# Check application errors
pm2 logs qmoi-app | grep ERROR
```

**Real-time Monitoring:**

```bash
# Start monitoring dashboard
pm2 monit

# This shows:
# - CPU usage per process
# - Memory usage per process
# - Process status
# - Uptime
```

### 6.2: Log Management

```bash
# View application logs
tail -f logs/qmoi_app.log

# View health check logs
tail -f logs/health-check.log

# View error logs
tail -f logs/qmoi_app_error.log

# Archive old logs (automatic via health monitor)
# Logs older than 30 days are automatically cleaned
```

### 6.3: Performance Monitoring

```bash
# Monitor memory usage
ps aux | grep node

# Check disk usage
df -h /

# View process details
pm2 show qmoi-app

# Get ecosystem stats
pm2 info
```

### 6.4: Alerts Configuration

#### Slack Notifications

```bash
# When auto-recovery fails, alert goes to Slack
# Configure SLACK_WEBHOOK_URL in .env.production

# Test Slack integration
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  -d '{"text":"QMOI Production Test Alert"}'
```

#### Email Alerts

```bash
# Configure ALERT_EMAIL in .env.production
# Health monitor will send emails on critical failures

# Supported critical issues:
# - API service down (3 consecutive failures)
# - Database connection lost (5 consecutive failures)
# - Memory usage >90% (2 consecutive checks)
# - Disk usage >90%
```

---

## Phase 7: Troubleshooting

### Issue: Processes Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check for port conflicts
netstat -tulpn | grep 3000

# Try restarting PM2
pm2 kill
pm2 start ecosystem.config.production.cjs --env production
```

### Issue: High Memory Usage

```bash
# Check memory-heavy processes
pm2 monit

# Restart the process
pm2 restart qmoi-app

# Enable garbage collection
pm2 start ecosystem.config.production.cjs --node-args="--max-old-space-size=1024"
```

### Issue: Database Connection Errors

```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection directly
psql $DATABASE_URL

# Check if migrations ran
npx prisma migrate status

# Run migrations manually if needed
npx prisma migrate deploy
```

### Issue: Health Monitor Not Running

```bash
# Check if process exists
pm2 list | grep health-monitor

# Restart health monitor
pm2 restart qmoi-health-monitor

# Check logs for errors
pm2 logs qmoi-health-monitor --lines 50

# Verify the script exists
ls -la scripts/qmoi-production-autohealth.js
```

---

## Phase 8: Scaling & Performance

### 8.1: Multi-Core Deployment

Enable cluster mode in `ecosystem.config.production.cjs`:

```javascript
{
  name: "qmoi-app",
  script: "npm",
  args: "start",
  instances: "max",  // Use all CPU cores
  exec_mode: "cluster",
  // ... rest of config
}
```

Then restart:

```bash
pm2 delete ecosystem.config.production.cjs
pm2 start ecosystem.config.production.cjs --env production
```

### 8.2: Load Balancing

Use nginx as reverse proxy:

```nginx
upstream qmoi_backend {
  server localhost:3000;
  server localhost:3001;  # If using cluster mode with multiple instances
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://qmoi_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### 8.3: Caching Configuration

```bash
# Enable Redis caching (update .env)
REDIS_URL=redis://localhost:6379

# Add to .env.production
CACHE_STRATEGY=redis
CACHE_TTL=3600  # 1 hour
```

---

## Maintenance Checklist

### Weekly

- [ ] Check PM2 process status: `pm2 list`
- [ ] Review application logs for errors
- [ ] Verify health monitor is active
- [ ] Check disk space usage
- [ ] Review recovery statistics

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review and archive logs
- [ ] Test backup procedures
- [ ] Performance review

### Quarterly

- [ ] Security penetration testing
- [ ] Load testing with production data
- [ ] Database optimization
- [ ] Review and update monitoring alerts
- [ ] Plan scaling if needed

---

## Disaster Recovery

### Database Backup

```bash
# Automated daily backups (setup cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/qmoi_db_$(date +\%Y\%m\%d).sql
```

### Restore from Backup

```bash
# Stop application
pm2 stop qmoi-app

# Restore database
psql $DATABASE_URL < /backups/qmoi_db_20260121.sql

# Run migrations
npx prisma migrate deploy

# Restart
pm2 start qmoi-app
```

### Rollback Deployment

```bash
# If deployment causes issues, rollback:
git revert HEAD
npm install
npm run ci:build
pm2 restart all
```

---

## Success Indicators

✅ **System is Production-Ready when:**

- [ ] All PM2 processes online (`pm2 list` shows all green)
- [ ] Health endpoint returns 200: `curl /api/health`
- [ ] No errors in logs from last 24 hours
- [ ] Database migrations completed
- [ ] Health monitor active and monitoring
- [ ] Alerts configured and tested
- [ ] Backup strategy in place
- [ ] Performance baseline established
- [ ] Team trained on monitoring/recovery

---

## Support Resources

- **Documentation:** See PRODUCTION_SETUP_COMPLETE.md
- **API Reference:** See API_REFERENCE.md
- **Health Monitoring:** Logs in `logs/` directory
- **State Persistence:** `.qmoi_state/health_memory.json`
- **PM2 Management:** `pm2 help`

---

**Ready to deploy!** 🚀

Follow these phases in order for a smooth production deployment with full auto-recovery capabilities.
