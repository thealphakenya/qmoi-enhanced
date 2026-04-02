<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.736200Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Enhanced - Deployment Checklist

## Pre-Deployment (On Your Machine)

### Environment Preparation

- [ ] Clone repository: `git clone https://github.com/thestablekenya/qmoi-enhanced.git`
- [ ] Copy environment standard: `cp .env.production.updated .env.production`
- [ ] Create strong JWT_SECRET (32+ chars): `openssl rand -hex 16`
- [ ] Update DATABASE_URL with PostgreSQL credentials
- [ ] Update SLACK_WEBHOOK_URL (optional)
- [ ] Verify Node.js 18+: `node --version`
- [ ] Install PM2 globally: `npm install -g pm2`

### Local Testing

- [ ] Run environment validator: `node scripts/validate-production-env.js`
- [ ] Install dependencies: `npm install --production`
- [ ] Build application: `npm run ci:build`
- [ ] Test locally: `npm start` then `curl https://qmoi.ai`

## Deployment (On production Server)

### Phase 1: Initial Setup

- [ ] SSH to production server
- [ ] Create deployment user: `sudo useradd -m deploy`
- [ ] Create application directory: `sudo mkdir -p /var/www/qmoi-enhanced`
- [ ] Set permissions: `sudo chown deploy:deploy /var/www/qmoi-enhanced`
- [ ] Clone repository as deploy user
- [ ] Copy .env.production to server (securely via SCP)

### Phase 2: Application Deployment

- [ ] Run automated deployment: `bash scripts/deploy-production.sh`
- [ ] Verify processes: `pm2 list` (should show 3 running)
- [ ] Check logs: `pm2 logs` (should show no errors)
- [ ] Test health endpoint: `curl https://qmoi.ai/api/health`

### Phase 3: Database Setup

- [ ] Ensure PostgreSQL is running
- [ ] Run database setup: `bash scripts/setup-database.sh`
- [ ] Verify migrations: Check database for tables

### Phase 4: SSL/TLS (Requires Domain + Root Access)

- [ ] Point domain DNS A record to server IP
- [ ] Wait for DNS propagation (~5 minutes): `nslookup qmoi.app`
- [ ] Run SSL setup (as root): `sudo bash scripts/setup-ssl-automated.sh qmoi.app admin@qmoi.app`
- [ ] Verify certificate: `sudo certbot certificates`

### Phase 5: Nginx Setup

- [ ] Run Nginx setup (as root): `sudo bash scripts/setup-nginx-automated.sh qmoi.app 3000`
- [ ] Test Nginx config: `sudo nginx -t`
- [ ] Verify HTTPS: `curl https://qmoi.app` (should return 200)

### Phase 6: Monitoring & Backups

- [ ] Initialize monitoring: `node scripts/init-monitoring.js`
- [ ] Setup backups (as root): `sudo bash scripts/setup-backup-system.sh /var/backups/qmoi 30`
- [ ] Test backup: `sudo qmoi-backup /var/backups/qmoi 30`
- [ ] Start monitoring dashboard: `pm2 monit`

### Phase 7: Verification

- [ ] Run verification suite: `bash scripts/verify-deployment.sh`
- [ ] Check all endpoints: `curl https://qmoi.app/api/health`
- [ ] Monitor logs for errors: `pm2 logs qmoi-app --lines 50`
- [ ] Verify processes restart on failure: `kill -9 $(pm2 pid qmoi-app)`

## Post-Deployment

### Immediate (First Hour)

- [ ] Monitor logs for any errors
- [ ] Test key application features
- [ ] Verify database connectivity
- [ ] Check SSL certificate validity

### Short Term (First Day)

- [ ] Monitor performance metrics
- [ ] Review error logs
- [ ] Test backup system
- [ ] Document any issues

### Long Term (Ongoing)

- [ ] Daily: Check PM2 logs and health endpoint
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Update SSL certificate status, security patches
- [ ] Quarterly: Full security audit, capacity planning

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs qmoi-app

# Check environment variables
cat .env.production

# Verify Node.js can start the app locally
node scripts/qmoi-production-init.js
```

### Database Connection Failed

```bash
# Verify DATABASE_URL
grep DATABASE_URL .env.production

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check migrations status
npx prisma migrate status
```

### HTTPS Not Working

```bash
# Verify certificate
sudo certbot certificates

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t
```

### PM2 Auto-startup Not Working

```bash
# Verify systemd service
sudo systemctl status pm2-node

# Re-enable auto-startup
pm2 startup systemd -u $USER --hp $HOME
pm2 save
```

## Rollback Procedure

If something goes wrong:

```bash
# 1. Stop all processes
pm2 stop all

# 2. Restore from backup
sudo tar -xzf /var/backups/qmoi-enhanced/app_backup_*.tar.gz -C /var/www

# 3. Restore database
sudo psql $DATABASE_URL < /var/backups/qmoi-enhanced/db_backup_*.sql

# 4. Start processes again
pm2 start pm2.config.cjs

# 5. Verify
pm2 logs
```

## Success Criteria

Your deployment is successful when:

- ✅ All 3 PM2 processes are running
- ✅ Health endpoint responds with 200 OK
- ✅ HTTPS connection works
- ✅ No errors in PM2 logs
- ✅ Database queries return results
- ✅ Application responds to requests in <500ms
- ✅ Auto-restart works (kill process, it restarts)
- ✅ Backups are being collected daily

---

**Need Help?**

- Check logs: `pm2 logs`
- View process status: `pm2 status`
- Monitor in real-time: `pm2 monit`
- Run verification: `bash scripts/verify-deployment.sh`

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

---
*This document is maintained by QMOI's autonomous evolution system*
