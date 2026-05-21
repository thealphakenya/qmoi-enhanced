# QMOI Enhanced - Operational Runbooks

**Last Updated:** May 10, 2026  
**Purpose:** Step-by-step procedures for common operational tasks

## Table of Contents

1. [Incident Response](#incident-response)
2. [Deployment Procedures](#deployment-procedures)
3. [Database Operations](#database-operations)
4. [Scaling Operations](#scaling-operations)
5. [Security Operations](#security-operations)
6. [Backup & Recovery](#backup--recovery)

---

## Incident Response

### Runbook: Application Down

**Severity:** CRITICAL  
**ETA to Resolution:** 15 minutes

#### Detection
- Health check endpoint returns 503
- Monitoring alert: "Application Unavailable"
- Users reporting access denied

#### Immediate Actions
```bash
# 1. Check service status
curl -v http://LOAD_BALANCER/health

# 2. Check logs in real-time
kubectl logs -f deployment/qmoi-app -n qmoi

# 3. Check resource usage
kubectl top pods -n qmoi
kubectl top nodes

# 4. Verify database connectivity
kubectl exec -it deployment/qmoi-app -n qmoi -- \
  psql $DATABASE_URL -c "SELECT 1"
```

#### Remediation Options

**Option A: Restart Application**
```bash
# Kill existing pods (will auto-restart)
kubectl delete pods -l app=qmoi -n qmoi

# Wait for new pods to start
kubectl wait --for=condition=ready pod -l app=qmoi -n qmoi --timeout=60s
```

**Option B: Scale Up**
```bash
# Increase replica count
kubectl scale deployment qmoi-app --replicas=5 -n qmoi

# Verify scaling
kubectl get pods -n qmoi
```

**Option C: Rollback Deployment**
```bash
# Check recent deployments
kubectl rollout history deployment/qmoi-app -n qmoi

# Rollback to previous version
kubectl rollout undo deployment/qmoi-app -n qmoi

# Verify rollback
kubectl rollout status deployment/qmoi-app -n qmoi
```

#### Post-Incident
- [ ] Check application logs for root cause
- [ ] Document incident in status page
- [ ] Notify stakeholders
- [ ] Schedule post-mortem within 24 hours

---

### Runbook: Database Connection Errors

**Severity:** CRITICAL  
**ETA to Resolution:** 20 minutes

#### Detection
- Logs show: `Error: connect ECONNREFUSED`
- Monitoring alert: "Database Connection Failed"
- Users getting 503 errors

#### Immediate Actions
```bash
# 1. Check PostgreSQL status
kubectl get pods -n qmoi | grep postgres

# 2. Check database connectivity
kubectl port-forward postgres-0 5432:5432 &
psql -h localhost -U qmoi -d qmoi_db -c "SELECT 1"

# 3. Check connection pool
psql ... -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'qmoi_db'"

# 4. Check max connections setting
psql ... -c "SHOW max_connections;"
```

#### Remediation Options

**Option A: Restart Database**
```bash
# Scale down application (prevent reconnection storms)
kubectl scale deployment qmoi-app --replicas=0 -n qmoi

# Restart PostgreSQL
kubectl delete pod postgres-0 -n qmoi

# Wait for database to restart
sleep 30

# Scale application back up
kubectl scale deployment qmoi-app --replicas=3 -n qmoi
```

**Option B: Increase Connection Pool**
```bash
# Update PostgreSQL max_connections
psql ... -c "ALTER SYSTEM SET max_connections = 500;"

# Restart PostgreSQL
kubectl delete pod postgres-0 -n qmoi
```

**Option C: Enable Connection Pooling (PgBouncer)**
```bash
# Deploy PgBouncer
kubectl apply -f k8s/pgbouncer.yaml -n qmoi

# Update application DATABASE_URL to point to PgBouncer
kubectl set env deployment/qmoi-app \
  DATABASE_URL="postgresql://user:pass@pgbouncer:6432/qmoi_db" -n qmoi
```

---

### Runbook: High Memory Usage

**Severity:** WARNING  
**ETA to Resolution:** 30 minutes

#### Detection
- Monitoring alert: "Memory usage > 80%"
- `nodejs_memory_heap_used_bytes` > 800MB
- Intermittent slow requests

#### Immediate Actions
```bash
# 1. Check current memory usage
kubectl top pods -n qmoi
kubectl top nodes

# 2. Check memory trend over time
# Use Prometheus query: rate(nodejs_memory_heap_used_bytes[5m])

# 3. Check for memory leaks in logs
kubectl logs -l app=qmoi --all-containers=true -n qmoi | grep -i memory
```

#### Remediation Options

**Option A: Restart Pods**
```bash
# Rolling restart to refresh memory
kubectl rollout restart deployment/qmoi-app -n qmoi

# Verify new pods are healthy
kubectl wait --for=condition=ready pod -l app=qmoi -n qmoi --timeout=60s
```

**Option B: Increase Available Memory**
```bash
# Increase memory limits in deployment
kubectl set resources deployment qmoi-app \
  --limits=memory=3Gi,cpu=2 \
  -n qmoi

# Or edit directly
kubectl edit deployment qmoi-app -n qmoi
# Find containers[].resources.limits.memory and increase
```

**Option C: Enable Memory Limits Enforcement**
```bash
# Set strict memory limits
kubectl set resources deployment qmoi-app \
  --requests=memory=512Mi,cpu=250m \
  --limits=memory=2Gi,cpu=1 \
  -n qmoi
```

---

## Deployment Procedures

### Runbook: Deploy New Release

**Severity:** NORMAL  
**Duration:** 10-15 minutes

#### Pre-Deployment Checks
```bash
# 1. Verify code is tested and merged
git log --oneline -n 5

# 2. Check all tests are passing
npm run test:all

# 3. Verify no database migrations needed
npx prisma --version
git diff HEAD~1 prisma/schema.prisma

# 4. Review changelog
cat CHANGELOG.md | head -50
```

#### Deployment Steps
```bash
# 1. Build Docker image
docker build -t qmoi-enhanced:vX.Y.Z -f Dockerfile.prod .
docker tag qmoi-enhanced:vX.Y.Z your-registry/qmoi-enhanced:vX.Y.Z
docker push your-registry/qmoi-enhanced:vX.Y.Z

# 2. Update Kubernetes deployment
kubectl set image deployment/qmoi-app \
  qmoi-app=your-registry/qmoi-enhanced:vX.Y.Z \
  -n qmoi

# 3. Watch rollout progress
kubectl rollout status deployment/qmoi-app -n qmoi

# 4. Verify new version is running
kubectl get deployment qmoi-app -n qmoi
kubctl get pods -o wide -n qmoi
```

#### Post-Deployment Validation
```bash
# 1. Check health endpoint
curl https://qmoi.example.com/health

# 2. Check application logs for errors
kubectl logs -l app=qmoi -n qmoi --since=5m | grep ERROR

# 3. Run smoke tests
npm run ci:smoke

# 4. Verify metrics are being collected
curl https://qmoi.example.com/metrics | head -20
```

#### Rollback Procedure
```bash
# If something goes wrong, rollback immediately:
kubectl rollout undo deployment/qmoi-app -n qmoi

# Verify rollback
kubectl rollout status deployment/qmoi-app -n qmoi
```

---

## Database Operations

### Runbook: Create Database Backup

**Duration:** 5 minutes

```bash
# 1. Create backup directory
mkdir -p backups/$(date +%Y-%m-%d)

# 2. Create full database dump
pg_dump $DATABASE_URL | gzip > backups/$(date +%Y-%m-%d)/qmoi_db_$(date +%H-%M-%S).sql.gz

# 3. Verify backup integrity
gunzip < backups/$(date +%Y-%m-%d)/qmoi_db_*.sql.gz | head -20

# 4. Upload to S3 or cloud storage
aws s3 cp backups/$(date +%Y-%m-%d)/ s3://qmoi-backups/$(date +%Y-%m-%d)/ --recursive

# 5. Verify upload
aws s3 ls s3://qmoi-backups/$(date +%Y-%m-%d)/
```

### Runbook: Restore Database from Backup

**Duration:** 15 minutes  
**Severity:** CRITICAL

```bash
# 1. Create separate restore database
psql $DATABASE_URL -c "CREATE DATABASE qmoi_db_restore;"

# 2. Download backup from storage
aws s3 cp s3://qmoi-backups/2026-05-10/qmoi_db_20260510.sql.gz ./

# 3. Restore database
gunzip < qmoi_db_20260510.sql.gz | psql postgresql://user:pass@localhost/qmoi_db_restore

# 4. Verify data integrity
psql postgresql://user:pass@localhost/qmoi_db_restore -c "SELECT COUNT(*) FROM \"User\";"

# 5. Switch application to restored database
# Update DATABASE_URL in deployment config
kubectl set env deployment/qmoi-app \
  DATABASE_URL="postgresql://user:pass@localhost/qmoi_db_restore" \
  -n qmoi

# 6. Verify application is working
curl https://qmoi.example.com/health

# 7. If successful, drop old database and rename
# psql $DATABASE_URL -c "DROP DATABASE qmoi_db;"
# psql $DATABASE_URL -c "ALTER DATABASE qmoi_db_restore RENAME TO qmoi_db;"
```

---

## Scaling Operations

### Runbook: Horizontal Scaling (Add Instances)

**Duration:** 2-5 minutes

```bash
# 1. Check current replica count
kubectl get deployment qmoi-app -n qmoi

# 2. Check current load
kubectl top pods -n qmoi
# Look for high CPU/memory usage

# 3. Scale up replicas
kubectl scale deployment qmoi-app --replicas=5 -n qmoi

# 4. Monitor scaling progress
kubectl get pods -n qmoi
kubectl describe deployment qmoi-app -n qmoi

# 5. Verify new pods are healthy
kubectl wait --for=condition=ready pod -l app=qmoi -n qmoi --timeout=60s

# 6. Check load distribution
kubectl top pods -n qmoi
```

### Runbook: Vertical Scaling (Increase Resources)

**Duration:** 10-15 minutes

```bash
# 1. Check current resource limits
kubectl describe deployment qmoi-app -n qmoi | grep -A 5 "Limits"

# 2. Update resource requests/limits
kubectl set resources deployment qmoi-app \
  --requests=memory=1Gi,cpu=500m \
  --limits=memory=3Gi,cpu=2 \
  -n qmoi

# 3. Verify update
kubectl describe deployment qmoi-app -n qmoi | grep -A 5 "Limits"

# 4. Trigger rolling update
kubectl rollout restart deployment/qmoi-app -n qmoi

# 5. Monitor restart progress
kubectl rollout status deployment/qmoi-app -n qmoi
```

---

## Security Operations

### Runbook: Rotation of Secrets

**Duration:** 20 minutes  
**Frequency:** Quarterly or after suspected compromise

```bash
# 1. Generate new secrets
NEW_JWT_SECRET=$(openssl rand -base64 32)
NEW_ENCRYPTION_KEY=$(openssl rand -base64 32)
NEW_API_KEY_SECRET=$(openssl rand -base64 32)

# 2. Update Kubernetes secret
kubectl patch secret qmoi-secrets -n qmoi -p \
  "{\"data\": {\"JWT_SECRET\": \"$(echo -n $NEW_JWT_SECRET | base64)\"}}"

# 3. Do the same for other secrets (one at a time to avoid service interruption)

# 4. Restart application to pick up new secrets
kubectl rollout restart deployment/qmoi-app -n qmoi

# 5. Verify application is still working
curl https://qmoi.example.com/health

# 6. Document rotation in audit log
# Entry: "Secret rotation completed: JWT_SECRET, ENCRYPTION_KEY, API_KEY_SECRET"
```

### Runbook: Responding to Security Incident

**Severity:** CRITICAL  
**Duration:** Varies

```bash
# 1. Immediately isolate affected system
kubectl scale deployment qmoi-app --replicas=0 -n qmoi

# 2. Preserve evidence
# Copy all logs to secure location
kubectl logs -l app=qmoi --all-containers=true -n qmoi > /secure/incident-logs.txt

# 3. Check for unauthorized access
# Review authentication logs
psql ... -c "SELECT * FROM sessions WHERE created_at > NOW() - INTERVAL '1 hour' ORDER BY created_at DESC;"

# 4. Rotate all secrets immediately
# See: Runbook: Rotation of Secrets

# 5. Review and update security policies
# Update firewall rules, IP whitelists, API keys

# 6. Deploy patched version
# Build new image with fixes
docker build -t qmoi-enhanced:patched -f Dockerfile.prod .

# 7. Scale application back up with patched version
kubectl set image deployment/qmoi-app qmoi-app=your-registry/qmoi-enhanced:patched -n qmoi
kubectl scale deployment qmoi-app --replicas=3 -n qmoi

# 8. Activate incident response and communication plan
# Notify stakeholders, customers, regulatory bodies as required
```

---

## Backup & Recovery

### Daily Backup Schedule

```bash
# Add to crontab
0 2 * * * /usr/local/bin/backup-qmoi-database.sh >> /var/log/backups.log 2>&1
0 3 * * * aws s3 sync /var/backups/qmoi s3://qmoi-backups/ --delete

# Create backup script: /usr/local/bin/backup-qmoi-database.sh
#!/bin/bash
BACKUP_DIR="/var/backups/qmoi/$(date +\%Y-\%m-\%d)"
mkdir -p $BACKUP_DIR
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/db_$(date +\%H-%M-%S).sql.gz
find $BACKUP_DIR -mtime +7 -delete  # Delete old backups
```

### Recovery Time Objectives (RTO)

| Scenario | RTO | RPO |
|----------|-----|-----|
| Single pod failure | < 2 min | 0 (stateless) |
| Single node failure | < 5 min | 0 (stateless) |
| Database corruption | < 30 min | 1 hour |
| Complete cluster failure | < 1 hour | 1 hour |
| Regional outage | < 4 hours | 1 day |

---

## Key Contacts

- **On-Call Engineer:** [Phone/Slack]
- **Engineering Manager:** [Phone/Slack]
- **Security Team:** security@qmoi.example.com
- **Database Admin:** dba@qmoi.example.com
- **Infrastructure Team:** infrastructure@qmoi.example.com

---

## Related Documentation

- [MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md)
- [ALLSERVE.md](ALLSERVE.md)
- [PRODUCTION_AUTH_IMPLEMENTATION.md](PRODUCTION_AUTH_IMPLEMENTATION.md)
- Incident post-mortems: `/incidents/`

---

**Last Update:** May 10, 2026  
**Next Review:** June 10, 2026  
**Responsible:** Operations Team