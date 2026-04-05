# 🆘 DISASTER RECOVERY & BUSINESS CONTINUITY PLAN
**Version**: 1.0  
**Created**: April 4, 2026  
**Status**: Ready for Implementation  
**System**: QMOI Enhanced v2.4.0

---

## Executive Summary

This document outlines disaster recovery and business continuity procedures to minimize downtime and data loss for QMOI Enhanced in production.

---

## 🎯 RECOVERY OBJECTIVES

### RTO (Recovery Time Objective)
- **Critical Systems**: < 30 minutes
- **Core Services**: < 1 hour
- **Non-essential Services**: < 4 hours

### RPO (Recovery Point Objective)
- **Database**: < 1 hour (hourly backups)
- **Application Code**: < 1 day (daily snapshots)
- **Configuration**: < 1 day (version controlled)

---

## 📊 DISASTER SCENARIOS & RESPONSES

### Scenario 1: Application Server Crash

**Detection**: PM2 process monitor detects offline status
**Severity**: HIGH
**RTO**: 5-15 minutes

**Response Procedure**:
```bash
# Step 1: Automatic detection and restart (PM2)
pm2 restart qmoi-app  # Automatic on crash

# Step 2: Monitor recovery
pm2 logs qmoi-app --err-only

# Step 3: If restart fails:
# - Check disk space: df -h
# - Check memory: free -h
# - Check system logs: journalctl -xe

# Step 4: Manual restart if needed
pm2 stop qmoi-app
sleep 10
npm run build  # Rebuild if dependencies issue
pm2 start ecosystem.config.js

# Step 5: Verify application
curl https://yourdomain.com/api/health

# Step 6: Document incident
# Record: timestamp, cause, duration, actions taken
```

**Prevention**:
- [x] PM2 configured to auto-restart on crash
- [x] Max memory restart threshold set (500MB)
- [x] Health checks every 5 minutes (cron)
- [x] Alerting configured for process down
- [x] Load balancing across multiple instances

---

### Scenario 2: Database Server Down

**Detection**: Connection pool exhausted, query timeouts
**Severity**: CRITICAL
**RTO**: 15-30 minutes

**Preparation**:
```bash
# 1. Automated Backups (Already configured)
0 * * * * /usr/local/bin/backup-qmoi.sh

# 2. Replication Setup (Optional but recommended)
# Create standby PostgreSQL instance
# Configure streaming replication
# Test failover weekly

# 3. Database Monitoring
0 * * * * psql $DATABASE_URL -c "SELECT NOW();" || alert

# 4. Connection Pool Monitoring
# Monitor max_connections (set to 200-300)
# Monitor idle connections
```

**Response Procedure**:
```bash
# Step 1: Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Step 2: If down, check status
sudo systemctl status postgresql

# Step 3: Start if stopped
sudo systemctl start postgresql

# Step 4: If corruption detected
# a) Stop application
pm2 stop qmoi-app

# b) Run recovery
sudo -u postgres pg_dump qmoi_prod > /tmp/backup-emergency.sql
sudo -u postgres vacuumdb qmoi_prod
sudo -u postgres reindexdb qmoi_prod

# c) Restart database
sudo systemctl restart postgresql

# d) Verify integrity
psql $DATABASE_URL -c "ANALYZE; VACUUM FULL;"

# Step 5: Restore from backup if needed
gunzip -c /backups/qmoi/qmoi_prod_LATEST.sql.gz | psql qmoi_prod

# Step 6: Run migrations
cd /var/www/qmoi-app
npx prisma migrate deploy

# Step 7: Restart application
pm2 start qmoi-app

# Step 8: Verify data integrity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM transactions;"
```

**If Primary Database Lost - Failover**:
```bash
# 1. On standby server (if replication configured):
sudo -u postgres pg_ctl promote -D /var/lib/postgresql/14/main

# 2. Update applications connection string
# Edit .env.production with new database host
# Restart application

# 3. Verify standby became primary
psql -h new-db-host -U qmoi_prod_user -d qmoi_prod -c "SELECT version();"

# 4. Set up new standby (if needed)
# Create another replica from new primary
```

---

### Scenario 3: Disk Space Critical

**Detection**: Disk usage > 90%, alerts triggered
**Severity**: HIGH
**RTO**: 10-30 minutes

**Response Procedure**:
```bash
# Step 1: Identify large files
du -sh /* | sort -rh
du -sh /var/www/qmoi-app/* | sort -rh
du -sh /backups/* | sort -rh

# Step 2: Empty logs
cd /var/www/qmoi-app/logs/
tar -czf logs-emergency-$(date +%Y%m%d).tar.gz *.log
rm *.log

# Step 3: Clean old backups
find /backups/qmoi -name "*.sql.gz" -mtime +30 -delete

# Step 4: Clear package cache
npm cache clean --force
cd /var/www/qmoi-app
rm -rf node_modules/.cache

# Step 5: Clean temporary files
rm -rf /tmp/*
rm -rf ~/.cache/*

# Step 6: Archive old PostgreSQL logs
sudo find /var/log/postgresql -name "*.log" -mtime +7 -exec gzip {} \;

# Step 7: Verify disk space
df -h

# Step 8: Monitor for recurrence
watch -n 60 'df -h /'
```

**Prevention**:
- [x] Log rotation configured (7 days)
- [x] Backup retention (30 days)
- [x] Database maintenance (weekly)
- [x] Disk usage monitoring (hourly)
- [x] Automated alerts at 75%, 85%, 90%

---

### Scenario 4: SSL Certificate Expired

**Detection**: Browser warning, health check fails
**Severity**: CRITICAL (users cannot access)
**RTO**: < 5 minutes

**Response Procedure**:
```bash
# Step 1: Check certificate status
certbot certificates

# Step 2: Immediate renewal
sudo certbot renew --force-renewal -d yourdomain.com

# Step 3: Verify new certificate
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout | grep -E "Not Before|Not After"

# Step 4: Restart Nginx
sudo systemctl restart nginx

# Step 5: Verify SSL
curl -v https://yourdomain.com | head -20

# Step 6: Test from browser
# Visit https://yourdomain.com - should show padlock

# Step 7: Schedule auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

**Prevention**:
- [x] Auto-renewal configured (certbot timer)
- [x] Email alerts 30 days before expiry
- [x] Manual verification monthly
- [x] Monitoring integration for certificate expiry

---

### Scenario 5: Security Breach / Data Compromise

**Detection**: Unusual access patterns, security alerts
**Severity**: CRITICAL
**RTO**: Immediate containment, full recovery varies

**Immediate Actions (First 30 minutes)**:
```bash
# Step 1: Isolate affected systems
sudo systemctl stop qmoi-app
sudo systemctl stop postgresql  # If data accessed

# Step 2: Preserve evidence
cd /var/www/qmoi-app
tar -czf /backups/incident-$(date +%Y%m%d-%H%M%S).tar.gz logs/
journalctl --since "30 min ago" > /backups/syslog-incident.txt

# Step 3: Reset credentials
# Change all database passwords
# Regenerate JWT secrets
# Rotate API keys

# Step 4: Notify stakeholders
# Contact security team
# Prepare incident report
# Alert users if data exposed
```

**Recovery Procedure**:
```bash
# Step 1: Deploy clean instance
# - Fresh server provisioning
# - Clean application code (from verified commit)
# - Fresh database from backup (before breach)

# Step 2: Rotate all secrets
# Generate new JWT_SECRET
# Generate new encryption keys
# Reissue new API credentials

# Step 3: Restore data from backup
git checkout SAFE_COMMIT_HASH
npm ci --production
npm run build

# Step 4: Database recovery
pg_dump -U qmoi_prod_user qmoi_prod > /tmp/compromised.sql
# Review dump for malicious changes
# Restore from clean backup instead

# Step 5: Security audit
# Review access logs
# Check for unauthorized changes
# Verify integrity

# Step 6: Restart services
pm2 start ecology.config.js

# Step 7: Notify users
# Inform affected users
# Provide guidance on password reset
# Offer credit monitoring if applicable
```

---

### Scenario 6: Ransomware / Malware Attack

**Detection**: Unusual file modifications, encryption activity
**Severity**: CRITICAL
**RTO**: Full system rebuild

**Response**:
```bash
# Step 1: IMMEDIATE - Isolate
# - Disconnect from network
# - Stop all services: sudo systemctl stop-all
# - Do NOT attempt backup over network

# Step 2: Preserve evidence
# - Keep infected system for forensics
# - Document all observations

# Step 3: Deploy clean instance
# - Provision new server
# - Fresh OS installation
# - Clean application code
# - Restore from OFFLINE backup

# Step 4: Verify clean state
# - Run antivirus scan
# - Check file integrity
# - Monitor for reinfection

# Step 5: Harden systems
# - Update all software
# - Enable firewall rules
# - Implement additional monitoring
# - Review access controls

# Step 6: Restore services gradually
# - Start with database on isolated network
# - Run integrity checks
# - Bring application online
# - Monitor closely
```

---

## 🔄 BACKUP & RECOVERY DETAILS

### Backup Schedule

| Component | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| Database | Hourly | 30 days | /backups/qmoi/ |
| Database | Daily | 90 days | /backups/qmoi/ |
| Application Code | Daily | 30 days | Git repository |
| System Config | Weekly | 90 days | /backups/config/ |
| VM Snapshot | Weekly | 30 days | Cloud provider |

### Backup Verification

```bash
#!/bin/bash
# Save as: /usr/local/bin/verify-backups.sh

echo "=== Backup Verification Report ===" 
DATE=$(date)

# 1. Database backups exist and can be restored to test database
echo "✓ Database backups:"
ls -lh /backups/qmoi/*.sql.gz | tail -5

# 2. Test restore (weekly)
if [ $(date +%u) -eq 3 ]; then  # Wednesday
  echo "Performing test restore..."
  gunzip -c /backups/qmoi/qmoi_prod_LATEST.sql.gz | \
    createdb -U postgres qmoi_test && \
    psql -U postgres qmoi_test -c "SELECT COUNT(*) FROM transactions;" && \
    dropdb -U postgres qmoi_test && \
    echo "✓ Test restore successful"
fi

# 3. Backup age check
LATEST_BACKUP=$(ls -t /backups/qmoi/*.sql.gz | head -1)
BACKUP_AGE=$(($(date +%s) - $(stat -c %Y $LATEST_BACKUP)))
if [ $BACKUP_AGE -gt 3600 ]; then
  echo "⚠ WARNING: Latest backup is older than 1 hour"
else
  echo "✓ Latest backup is recent"
fi

# 4. Backup size check
BACKUP_SIZE=$(du -sh /backups/qmoi | awk '{print $1}')
echo "Total backups: $BACKUP_SIZE"

# 5. Generate report
echo "Report generated: $DATE" >> /var/log/backup-verification.log
```

### Recovery Testing Schedule

```bash
# Quarterly full recovery test (non-production environment)
# 1. Provision test server
# 2. Restore database from production backup
# 3. Deploy latest application version
# 4. Verify all API endpoints work
# 5. Verify data integrity
# 6. Document recovery time
# 7. Update runbook with findings
```

---

## 🏢 BUSINESS CONTINUITY PROCEDURES

### Failover Sequence

**Tier 1 (Active-Passive)**: Single server with automated backups
```
Production Server Down
        ↓
Alert triggered (PM2 / Monitoring)
        ↓
Manual provision new server
        ↓
Restore from latest backup
        ↓
Verify health checks pass
        ↓
Point DNS to new server
        ↓
Service restored (15-30 min)
```

**Tier 2 (Active-Active)**: Load balanced across multiple servers
```
Production Server 1 Down
        ↓
Load balancer detects failure
        ↓
Auto-routes traffic to Server 2
        ↓
Alert monitoring team
        ↓
Provision new Server 1
        ↓
Sync data from Server 2
        ↓
Add back to load balancer
        ↓
Service remains online (minimal disruption)
```

### Communication Procedures

**During Outage**:
1. Immediate internal notification (Slack #incidents channel)
2. Customer status page update (https://status.yourdomain.com)
3. Customer email notification (if > 15 minutes downtime)
4. Executive briefing (if > 1 hour downtime)

**Post-Incident**:
1. Root cause analysis (within 24 hours)
2. Incident report (within 48 hours)
3. Prevention measures (within 1 week)
4. Process improvements (ongoing)

### Documentation Updates

```
Incident → Investigation → Fix Implemented → Runbook Updated
                  ↓
            Prevention Measures Added
                ↓
         Team Training Scheduled
```

---

## 📋 DISASTER RECOVERY CHECKLIST

### Pre-Incident (Preparation)

- [ ] Backups tested and verified
- [ ] Recovery procedures documented
- [ ] Team trained on incident response
- [ ] Communication plan established
- [ ] Failover infrastructure ready
- [ ] DNS failover configuration prepared
- [ ] Emergency contact list updated
- [ ] Insurance coverage verified

### During Incident

- [ ] Incident logger created
- [ ] Stakeholders notified
- [ ] Response team assembled
- [ ] Recovery procedures initiated
- [ ] Progress updates every 15 minutes
- [ ] Status page updated
- [ ] Customer support briefed

### Post-Incident

- [ ] Service verified operational
- [ ] Data integrity confirmed
- [ ] All systems performing normally
- [ ] Incident log completed
- [ ] Root cause analysis scheduled
- [ ] Prevention measures identified
- [ ] Team debriefing scheduled
- [ ] Customers notified recovery complete

---

## 🎓 TEAM TRAINING & DRILLS

### Quarterly Disaster Recovery Drill

**Schedule**: First Wednesday of each quarter
**Duration**: 4-8 hours
**Scenario**: Rotate between different disaster scenarios

```
09:00 - Scenario briefing
09:15 - Detection and alert phase
09:30 - Team assembly
10:00 - Recovery procedures begin
11:00 - Verification phase
11:30 - Lessons learned discussion
12:00 - Runbook updates
13:00 - Drill complete
```

### Annual Full DR Test

- **Duration**: Full day (6-8 hours)
- **Scope**: Real failover to backup infrastructure
- **Location**: Separate datacenter/region
- **Participants**: Full team + stakeholders
- **Measurement**: Actual RTO/RPO achieved

### Documentation

```bash
# Create incident response runbook
/usr/local/bin/incident-response-template.md

# Track drill results
incidents/drill-2026-Q2.md
incidents/drill-2026-Q3.md
incidents/drill-2026-Q4.md

# Update based on results
- What worked well
- What needs improvement
- Changes to procedures
- Training gaps identified
```

---

## 🔐 SECURITY DURING RECOVERY

### Data Protection

- [x] Backups encrypted at rest (AES-256)
- [x] Backup storage access restricted to authorized personnel
- [x] Backup transfers occur over VPN only
- [x] Test recoveries on isolated network
- [x] Production data sanitized before testing

### Access Control

- [x] Recovery procedures documented in private wiki
- [x] Credentials stored in secure vault (HashiCorp Vault, AWS Secrets Manager)
- [x] Two-person rule for critical procedures
- [x] Audit logging of all recovery actions
- [x] Post-incident access review

---

## 📊 RECOVERY METRICS TRACKING

### Track for Each Incident

```
Incident ID: INC-2026-001
Start Time: 2026-04-04 14:30 UTC
Detection Time: 14:32 UTC (2 min)
Recovery Start: 14:35 UTC (5 min)
Service Restored: 14:57 UTC (27 min)

Actual RTO: 27 minutes (Target: < 30 min) ✓
Actual RPO: 15 minutes (Target: < 1 hour) ✓
Data Loss: None
Customer Impact: 2,500 users × 27 min
Revenue Impact: $XXXX
Cost of Recovery: $XXXX
```

---

## 🛠️ TOOLS & INFRASTRUCTURE

### Required Tools

```bash
# Backup tools
- mysqldump / pg_dump (database)
- tar / rsync (file backup)
- AWS S3 CLI (cloud storage)

# Monitoring and alerting
- PM2 monitoring
- Prometheus / Grafana
- Sentry error tracking
- Nagios / Icinga

# Incident management
- PagerDuty or Opsgenie
- Slack for team communication
- Incident tracking system

# Recovery infrastructure
- Standby server(s)
- Load balancer
- DNS failover capability
- VM snapshots / images
```

### Infrastructure Redundancy

```
┌─────────────────────────────┐
│  Primary Datacenter         │
│  ├── Application Server     │
│  ├── Database Server        │
│  └── Backup Storage         │
└─────────────────────────────┘
          ↔
          ↑ Replication
          ↓
┌─────────────────────────────┐
│  Secondary Datacenter       │
│  ├── Standby Server         │
│  ├── Database Replica       │
│  └── Backup Storage Replica │
└─────────────────────────────┘
```

---

## 📞 CONTACTS & ESCALATION

| Role | Name | Email | Phone | Notes |
|------|------|-------|-------|-------|
| Incident Commander | TBD | commander@yourdomain.com | +254-XXX | On-call rotation |
| Database Lead | TBD | dba@yourdomain.com | +254-XXX | 24/7 availability |
| DevOps Lead | TBD | devops@yourdomain.com | +254-XXX | Primary responder |
| CTO | TBD | cto@yourdomain.com | +254-XXX | Escalation |
| CEO | TBD | ceo@yourdomain.com | +254-XXX | Critical incidents |

---

## 📚 RELATED DOCUMENTS

- [PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- [PRODUCTION_OPERATIONS_GUIDE.md](PRODUCTION_OPERATIONS_GUIDE.md)
- [PRODUCTION_MONITORING_SETUP.md](PRODUCTION_MONITORING_SETUP.md)
- [resumefromhere.txt](resumefromhere.txt)

---

**Status**: Ready for Implementation  
**Last Updated**: April 4, 2026  
**Next Review**: April 11, 2026 (After 1st Week of Production)
