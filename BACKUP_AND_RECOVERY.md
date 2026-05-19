# QMOI Enhanced Backup and Recovery Guide

**Last Updated:** May 10, 2026  
**Status:** ✅ Backup and Recovery Guide Complete

## Overview

This guide defines backup and recovery procedures for QMOI Enhanced production systems. It ensures data safety, operational resilience, and rapid recovery from failures.

## Table of Contents

1. [Backup Strategy](#backup-strategy)
2. [Backup Targets](#backup-targets)
3. [Backup Schedule](#backup-schedule)
4. [Backup Procedures](#backup-procedures)
5. [Recovery Procedures](#recovery-procedures)
6. [Verification](#verification)
7. [Disaster Recovery Checklist](#disaster-recovery-checklist)

---

## Backup Strategy

QMOI Enhanced uses a layered backup strategy:

- **Database backups:** PostgreSQL dumps
- **Configuration backups:** Environment and Kubernetes manifests
- **Log backups:** Critical logs stored externally
- **Secrets backups:** Rotated and stored in vaults, not plaintext in repos
- **Periodic verification:** Regular restore tests

## Backup Targets

### Primary Backup Targets

- PostgreSQL data
- Redis configuration (if stateful caching required)
- Environment variables and config files
- Log and audit files
- Kubernetes manifests and deployment state

### Secondary Backup Targets

- Application source code (via Git)
- Docker images in registry
- Monitoring configuration
- Infrastructure-as-code files

## Backup Schedule

| Frequency | Target | Method |
|----------|--------|--------|
| Hourly | Critical database changes (optional) | WAL archiving / PITR |
| Daily | PostgreSQL dump | `pg_dump` + gzip + remote storage |
| Daily | Logs and audit files | rsync to S3/Cloud storage |
| Weekly | Full system config | Git + config snapshot |
| Monthly | Disaster recovery test | Full restore test |

## Backup Procedures

### Database Backup

```bash
BACKUP_DIR="/var/backups/qmoi/$(date +%F)"
mkdir -p "$BACKUP_DIR"
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/qmoi_db_$(date +%H-%M-%S).sql.gz"
```

### Upload Backup to Remote Storage

```bash
aws s3 cp "$BACKUP_DIR" s3://qmoi-backups/$(date +%F)/ --recursive
```

### Redis Backup (If Needed)

```bash
redis-cli SAVE
cp /data/dump.rdb /var/backups/qmoi/$(date +%F)/redis_dump.rdb
```

### Configuration Backup

```bash
mkdir -p /var/backups/qmoi/config/$(date +%F)
cp .env /var/backups/qmoi/config/$(date +%F)/
cp -r k8s /var/backups/qmoi/config/$(date +%F)/
cp Dockerfile.prod docker-compose.prod.yml /var/backups/qmoi/config/$(date +%F)/
```

### Log Backup

```bash
rsync -av /app/logs/ s3://qmoi-backups/logs/$(date +%F)/
```

## Recovery Procedures

### Restore Database from Backup

```bash
# Create restore database
psql "$DATABASE_URL" -c "CREATE DATABASE qmoi_restore;"

# Restore backup
gunzip < /path/to/backup/qmoi_db_2026-05-10_12-00-00.sql.gz | psql "postgresql://user:pass@localhost/qmoi_restore"
```

### Verify Restore

```bash
psql "postgresql://user:pass@localhost/qmoi_restore" -c "SELECT COUNT(*) FROM \"User\";"
```

### Switch Application to Restored Database

```bash
kubectl set env deployment/qmoi-app \
  DATABASE_URL="postgresql://user:pass@postgres:5432/qmoi_restore" \
  -n qmoi
```

### Restore Logs

```bash
aws s3 sync s3://qmoi-backups/logs/2026-05-10/ /app/logs/
```

## Verification

### Backup Verification

- Confirm backup files exist locally
- Confirm backup files are uploaded to remote storage
- Confirm backup file integrity

### Restore Verification

- Perform restore to a separate environment at least monthly
- Confirm restored database contains expected records
- Confirm application can start against restored data

## Disaster Recovery Checklist

- [ ] Backup schedule configured
- [ ] Remote backup storage configured
- [ ] Backup files encrypted at rest
- [ ] Restore procedure tested monthly
- [ ] Database point-in-time recovery configured (WAL)
- [ ] Secrets rotation policy enforced
- [ ] Runbooks updated and available

---

## Notes

- Do not store secrets in Git or public storage.
- Use vault solutions for secrets management.
- Keep at least 30 days of backups available.
- Test restores before production cutover.
