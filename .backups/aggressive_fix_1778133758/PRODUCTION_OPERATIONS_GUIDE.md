# QMOI Enhanced - production Operations Guide

**Status:** ✅ FULLY OPERATIONAL  
**Last Updated:** May 2, 2026  
**Version:** 2.0.0

---

## Quick Reference

### Current production State
- **Server:** Running (`next-server`, PID: 15123)
- **Port:** 3001
- **Status:** Healthy and Responding
- **Process:** Active as background service

### Start production Server
```bash
cd /workspaces/qmoi-enhanced
bash ./scripts/prod-start.sh
```
This command:
1. Builds optimized production artifacts (`npm run ci:build`)
2. Starts Next.js server on port 3001 (`npm start`)
3. Logs to `.qmoi_prod.log`
4. PID saved to `.qmoi_prod.pid`

### Stop production Server
```bash
# Kill process
kill $(cat .qmoi_prod.pid)

# Or directly
pkill -f "next-server"
```

### View production Logs
```bash
# Real-time
tail -f .qmoi_prod.log

# Last 100 lines
tail -100 .qmoi_prod.log

# Search for errors
grep -i error .qmoi_prod.log
```

### Check Server Health
```bash
# Basic health check
curl https://api.qmoi-enhanced.com:3001/api/health | jq .

# Dashboard health (comprehensive metrics)
curl https://api.qmoi-enhanced.com:3001/api/dashboard/health | jq .

# Memory status
curl https://api.qmoi-enhanced.com:3001/api/memory | jq .

# Homepage
curl https://api.qmoi-enhanced.com:3001/
```

### Monitor Process
```bash
# Check if running
ps aux | grep next-server | grep -v grep

# Check port
lsof -i :3001

# Get process info
cat .qmoi_prod.pid

# Memory usage
ps -p $(cat .qmoi_prod.pid) -o pid,rss,vsz
```

---

## production Checklist

### Before Starting
- [ ] Node.js v24+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Dependencies installed: `npm install`
- [ ] .env.production configured
- [ ] Port 3001 available: `lsof -i :3001` (should be empty)

### Start Process
```bash
bash ./scripts/prod-start.sh
```
- [ ] Check `.qmoi_prod.log` for startup messages
- [ ] Verify PID in `.qmoi_prod.pid`
- [ ] Wait 30 seconds for full initialization

### Verify Deployment
```bash
# Test endpoints
curl https://api.qmoi-enhanced.com:3001/api/health
curl https://api.qmoi-enhanced.com:3001/api/dashboard/health
```
- [ ] `/api/health` returns: `{"status":"healthy",...}`
- [ ] `/api/dashboard/health` returns complete metrics
- [ ] All services show as "active"

### Monitor Health
```bash
# Continuous monitoring
watch -n 5 'curl -s https://api.qmoi-enhanced.com:3001/api/health | jq .'
```
- [ ] Status remains "healthy"
- [ ] Uptime increases
- [ ] Memory stable

---

## Common Tasks

### Restart Server
```bash
# Kill existing process
kill $(cat .qmoi_prod.pid)

# Wait 5 seconds
sleep 5

# Start new process
bash ./scripts/prod-start.sh
```

### Scale Memory for Large Deployments
Edit `scripts/prod-start.sh`:
```bash
# Change this line:
NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=1024}

# To:
NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=2048}  # for 2GB
NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=4096}  # for 4GB
```

### Enable PM2 Management (Optional)
```bash
# Install PM2 globally (requires sudo)
sudo npm install -g pm2

# Start with PM2
npx pm2 start ecosystem.config.cjs --only qmoi-next --env production

# Monitor
npx pm2 monit
npx pm2 logs qmoi-next

# Auto-restart on reboot
npx pm2 startup
npx pm2 save
```

### Debug Issues
```bash
# Check for errors
grep -i error .qmoi_prod.log | tail -20

# Check process status
ps aux | grep next

# Check port availability
ss -tuln | grep 3001

# Check CPU/Memory
top -p $(pgrep -f next-server)

# Full process info
ps -p $(cat .qmoi_prod.pid) -o pid,cmd,rss,vsz,cpu,etime
```

---

## Troubleshooting

### Server Won't Start

**Problem:** "Address already in use"
```bash
# Solution: Kill existing process
lsof -i :3001 | awk 'NR!=1 {print $2}' | xargs kill -9
sleep 2
bash ./scripts/prod-start.sh
```

**Problem:** "Out of memory"
```bash
# Solution: Check system memory
free -h

# Increase Node.js heap
NODE_OPTIONS="--max-old-space-size=2048" bash ./scripts/prod-start.sh
```

**Problem:** "Cannot find module"
```bash
# Solution: Reinstall dependencies
npm install --legacy-peer-deps

# Clear cache
npm cache clean --force

# Rebuild
npm run build
bash ./scripts/prod-start.sh
```

### Health Endpoint Returns Error

**Problem:** `/api/health` returns 503 or error
```bash
# Wait for server to fully initialize
sleep 30
curl https://api.qmoi-enhanced.com:3001/api/health

# Check logs
tail -50 .qmoi_prod.log
```

**Problem:** Services not active in dashboard
```bash
# Restart server
kill $(cat .qmoi_prod.pid)
sleep 5
bash ./scripts/prod-start.sh

# Monitor startup
tail -f .qmoi_prod.log
```

---

## Performance Tuning

### Optimize for High Traffic
```bash
# Increase memory allocation
NODE_OPTIONS="--max-old-space-size=4096" PORT=3001 bash ./scripts/prod-start.sh

# Or edit scripts/prod-start.sh
NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=4096}
```

### Optimize for Low Resource Systems
```bash
# Decrease memory allocation
NODE_OPTIONS="--max-old-space-size=512" bash ./scripts/prod-start.sh
```

### Enable Clustering (via PM2)
```bash
# Start with multiple instances
npx pm2 start ecosystem.config.cjs -i max

# Monitor
npx pm2 monit
```

---

## Security Notes

### API Key Management
All protected routes require API key authentication:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.qmoi-enhanced.com:3001/api/protected-endpoint
```

### Environment Variables
production variables are in `.env.production`:
- **Do NOT** commit API keys or secrets to git
- **Use** environment variable files for sensitive data
- **Rotate** keys regularly

### Port Security
- Default port: 3001
- Use reverse proxy (nginx, haproxy) for external access
- Enable SSL/TLS termination at proxy level

---

## Monitoring & Alerts

### Health Check Interval
```bash
# Check every 5 seconds
watch -n 5 'curl -s https://api.qmoi-enhanced.com:3001/api/health | jq ".status, .services"'
```

### Setup Monitoring (Example: Cron)
```bash
# Add to crontab
*/5 * * * * curl -s https://api.qmoi-enhanced.com:3001/api/health > /PRODUCTION/null 2>&1 || /usr/bin/restart-qmoi.sh
```

### Memory Monitoring
```bash
# Check memory usage
ps -p $(pgrep -f next-server) -o rss,vsz --no-headers | awk '{print "Memory: " $1/1024 "MB"}'
```

---

## Rollback Procedure

### If Deployment Fails
```bash
# Kill current process
kill $(cat .qmoi_prod.pid)

# Check git status
git status

# Rollback if needed
git reset --hard HEAD~1

# Restart
bash ./scripts/prod-start.sh
```

---

## Support Resources

### Key Files
- **Logs:** `.qmoi_prod.log`
- **Config:** `.env.production`
- **PID:** `.qmoi_prod.pid`
- **Build:** `.next/` (optimized artifacts)

### Useful Commands
- `npm run build` - Build production assets
- `npm run lint` - Check code quality
- `npm test` - Run test suite
- `npm start` - Start server (manual)

### API Documentation
- Health Check: `GET /api/health`
- Dashboard: `GET /api/dashboard/health`
- Memory: `GET /api/memory`
- Zero-Rated: `GET /api/zero-rated-sites`

---

**For additional support, check logs in `.qmoi_prod.log` and ensure all health endpoints return positive responses.**

