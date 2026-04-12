<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-12T03:00:50.019214Z
- IMPLEMENTED: Auto-updated by scripts/qmoi_md_autoupdater.py
<!-- LION_VALIDATION_END -->

## production Readiness Snapshot
- Scanned files: 4430
- production markers: 358 (8.08% production)
- production-ready files: 4072
- Updated: 2026-04-02T07:44:48.159427Z


## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.619537Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Enhanced - production Deployment Playbook

## Pre-Deployment Checklist

- [ ] Domain registered and DNS configured
- [ ] Server provisioned (2GB+ RAM, 2+ CPU cores)
- [ ] PostgreSQL database configured
- [ ] Nginx installed and configured
- [ ] SSL/TLS certificate obtained
- [ ] Monitoring service account created
- [ ] Backup system configured

## Deployment Steps

### Phase 1: Environment Setup

```bash
# 1. Clone repository
git clone https://github.com/thestablekenya/qmoi-enhanced.git
cd qmoi-enhanced

# 2. Configure environment
cp .env.production.updated .env.production

# 3. Update DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# 4. Install dependencies
npm install --production
npm run ci:build
```

### Phase 2: Database Setup

```bash
# 1. Create database
createdb qmoi_production

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed initial data (if needed)
npm run seed
```

### Phase 3: Process Management

```bash
# 1. Start with PM2
pm2 start pm2.config.cjs

# 2. Save PM2 configuration
pm2 save

# 3. Setup auto-startup
pm2 startup systemd -u node --hp /home/node
```

### Phase 4: Web Server Configuration

```bash
# 1. Setup Nginx
sudo cp nginx.conf.standard /etc/nginx/sites-available/qmoi.app
sudo ln -s /etc/nginx/sites-available/qmoi.app /etc/nginx/sites-enabled/

# 2. Configure SSL
sudo certbot certonly --nginx -d qmoi.app

# 3. Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Phase 5: Monitoring & Alerts

```bash
# 1. Configure alerts
export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."
pm2 restart qmoi-health

# 2. Start monitoring
pm2 monit

# 3. Verify health endpoint
curl https://qmoi.app/api/health
```

## Post-Deployment Verification

```bash
# Check all processes running
pm2 status

# Verify HTTPS
curl -I https://qmoi.app

# Test API endpoints
curl https://qmoi.app/api/health
curl https://qmoi.app/api/status

# Monitor resources
pm2 monit

# View logs
pm2 logs
```

## Scaling (Horizontal)

### Add Additional Instances

```bash
# Switch to cluster mode
pm2 stop pm2.config.cjs
pm2 start pm2-cluster.config.cjs

# Verify load distribution
pm2 status
```

### Load Balancing

- Nginx distributes traffic across instances
- PM2 manages process restarts
- Health monitoring ensures uptime
- Automatic failover on process crash

## Maintenance Schedule

### Daily

- Check PM2 logs for errors
- Monitor CPU/Memory usage
- Verify health endpoint

### Weekly

- Review error patterns
- Check disk space
- Verify backup completion

### Monthly

- Update dependencies
- Review performance metrics
- Update SSL certificate (if needed)

### Quarterly

- Security audit
- Performance optimization
- Disaster recovery drill

## Troubleshooting

### App not responding

```bash
pm2 logs qmoi-app
pm2 restart qmoi-app
```

### High memory usage

```bash
pm2 monit
pm2 kill
pm2 start pm2.config.cjs
```

### SSL certificate issues

```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Database connection failing

```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

## Rollback Procedure

```bash
# If issues occur after deployment
git checkout previous-version
npm run ci:build
pm2 restart all
```

## Success Indicators

✅ All 3 PM2 processes online
✅ HTTPS working (no warnings)
✅ API health endpoint responding
✅ Zero request errors in monitoring
✅ CPU usage < 80%
✅ Memory usage < 80%
✅ Response time < 500ms

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:10Z

---
*This document is maintained by QMOI's autonomous evolution system*
