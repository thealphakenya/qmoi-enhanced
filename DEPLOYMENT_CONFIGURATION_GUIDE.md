---
quantum-enabled: false
---

# Deployment & Configuration Guide: Phase 3 Tier 3 Features

**Status:** Ready for Implementation  
**Date:** 2026-06-14  
**Audience:** DevOps engineers, database administrators, backend leads

---

## Database Setup & Migrations

### Prerequisites

- PostgreSQL 13+ or SQLite 3.35+
- Prisma ORM 4.0+
- Migration scripts executable

### Migration Strategy

**Phase 1: Schema Extensions** (non-breaking changes)
```sql
-- Safe to deploy during operating hours
-- No downtime required

-- Add nullable columns first
ALTER TABLE user_sessions 
  ADD COLUMN device_id VARCHAR(256),
  ADD COLUMN device_name VARCHAR(256),
  ADD COLUMN device_type VARCHAR(50),
  ADD COLUMN browser VARCHAR(50),
  ADD COLUMN os VARCHAR(50),
  ADD COLUMN privacy_mask_enabled BOOLEAN DEFAULT false,
  ADD COLUMN privacy_mask_level VARCHAR(20) DEFAULT 'none',
  ADD COLUMN privacy_mask_token VARCHAR(256);

-- Create new tables (biometric profiles)
CREATE TABLE biometric_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method VARCHAR(20) NOT NULL,
  template_hash VARCHAR(256) NOT NULL,
  confidence_threshold DECIMAL(3,2) DEFAULT 0.80,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  UNIQUE(user_id, method),
  INDEX idx_user_id (user_id),
  INDEX idx_method (method)
);
```

**Phase 2: Data Migration** (optional, for existing sessions)
```sql
-- Populate device info for existing active sessions
UPDATE user_sessions 
SET device_name = 'Unknown Device'
WHERE device_name IS NULL 
  AND is_active = true;
```

**Phase 3: Index Optimization** (improves query performance)
```sql
-- Create indexes for new queries
CREATE INDEX idx_user_sessions_device_id ON user_sessions(user_id, device_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(user_id, is_active);
CREATE INDEX idx_biometric_user_method ON biometric_profiles(user_id, method);
```

### Prisma Schema Updates

```prisma
// prisma/schema.prisma

model User {
  id                String                @id @default(cuid())
  email             String                @unique
  name              String?
  password          String
  role              String                @default("user")
  emailVerified     Boolean               @default(false)
  
  // Biometric
  biometricEnabled  Boolean               @default(false)
  biometricProfiles BiometricProfile[]
  
  // Sessions
  sessions          UserSession[]
  
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt
}

model UserSession {
  id                    String              @id @default(cuid())
  userId                String
  user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Authentication
  accessToken           String
  refreshToken          String
  
  // Device Information
  deviceId              String?
  deviceName            String?
  deviceType            String?             @default("desktop")
  browser               String?
  os                    String?
  ipAddress             String
  
  // Session Control
  isActive              Boolean             @default(true)
  lastActivity          DateTime            @default(now())
  
  // Privacy Mask
  privacyMaskEnabled    Boolean             @default(false)
  privacyMaskLevel      String              @default("none")
  privacyMaskToken      String?
  
  createdAt             DateTime            @default(now())
  expiresAt             DateTime
  
  @@index([userId])
  @@index([deviceId])
  @@index([isActive])
  @@index([userId, isActive])
}

model BiometricProfile {
  id                    String              @id @default(cuid())
  userId                String
  user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Biometric Data
  method                String              // 'fingerprint', 'facial', 'voice'
  templateHash          String
  confidenceThreshold   Decimal             @default(0.80)
  
  // Status
  verified              Boolean             @default(false)
  enrolledAt            DateTime            @default(now())
  lastVerifiedAt        DateTime?
  
  @@unique([userId, method])
  @@index([userId])
  @@index([method])
}

model AuditLog {
  id                    String              @id @default(cuid())
  userId                String?
  action                String
  method                String?
  result                String?
  details               Json?
  timestamp             DateTime            @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([timestamp])
}
```

### Migration Execution

```bash
# Step 1: Review migrations
npx prisma migrate plan --name add_tier3_features

# Step 2: Run migrations in development
npm run prisma migrate dev --name add_tier3_features

# Step 3: Verify schema (dry-run for production)
npx prisma migrate deploy --skip-generate --dry-run

# Step 4: Deploy to production
npx prisma migrate deploy

# Step 5: Verify successful migration
npx prisma db execute <<EOF
SELECT COUNT(*) as biometric_count FROM biometric_profiles;
SELECT COUNT(*) as session_count FROM user_sessions WHERE device_id IS NOT NULL;
EOF
```

---

## Environment Configuration

### Required Environment Variables

```bash
# .env.production

# === AUTHENTICATION ===
JWT_SECRET=<64+ character random string>
JWT_REFRESH_SECRET=<64+ character random string>

# === BIOMETRIC AUTHENTICATION ===
BIOMETRIC_ENABLED=true
BIOMETRIC_CONFIDENCE_THRESHOLD=0.80
BIOMETRIC_MAX_ENROLLMENTS=3
BIOMETRIC_TIMEOUT_MS=5000
BIOMETRIC_LOG_ATTEMPTS=true

# === PRIVACY MASK ===
PRIVACY_MASK_ENABLED=true
PRIVACY_MASK_ALLOWED_ROLES=master,sister
PRIVACY_MASK_LOG_ANONYMIZED=true
PRIVACY_MASK_DEFAULT_LEVEL=none

# === SESSION MANAGEMENT ===
SESSION_MAX_ACTIVE_PER_USER=5
SESSION_INACTIVITY_TIMEOUT=3600
SESSION_TRACK_DEVICES=true
SESSION_REQUIRE_IP_MATCH=false
SESSION_TRACK_USER_AGENT=true

# === RATE LIMITING ===
RATE_LIMIT_AUTH_ATTEMPTS=5/5m
RATE_LIMIT_BIOMETRIC_ENROLL=3/5m
RATE_LIMIT_PASSWORD_RESET=3/1h
RATE_LIMIT_PRIVACY_MASK=10/1h

# === LOGGING & AUDIT ===
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=90
AUDIT_LOG_SENSITIVE_FIELDS_MASKED=true

# === DATABASE ===
DATABASE_URL="postgresql://user:password@localhost:5432/qmoi_production"
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# === MONITORING ===
SENTRY_DSN=<your-sentry-dsn>
LOG_LEVEL=info
METRICS_ENABLED=true
```

### Validation Script

```bash
#!/bin/bash
# scripts/validate-env.sh

# Check required variables
required_vars=(
  "JWT_SECRET"
  "JWT_REFRESH_SECRET"
  "DATABASE_URL"
  "BIOMETRIC_CONFIDENCE_THRESHOLD"
  "SESSION_MAX_ACTIVE_PER_USER"
)

echo "Validating environment variables..."

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required variable: $var"
    exit 1
  else
    echo "✓ $var configured"
  fi
done

# Validate threshold value
if ! (( $(echo "$BIOMETRIC_CONFIDENCE_THRESHOLD >= 0.0 && $BIOMETRIC_CONFIDENCE_THRESHOLD <= 1.0" | bc -l) )); then
  echo "❌ BIOMETRIC_CONFIDENCE_THRESHOLD must be between 0.0 and 1.0"
  exit 1
fi

# Validate session limit
if ! [[ "$SESSION_MAX_ACTIVE_PER_USER" =~ ^[0-9]+$ ]] || [ "$SESSION_MAX_ACTIVE_PER_USER" -lt 1 ]; then
  echo "❌ SESSION_MAX_ACTIVE_PER_USER must be a positive integer"
  exit 1
fi

echo "✅ All environment variables valid"
```

---

## Deployment Checklist

### Pre-Deployment (48 hours before)

- [ ] Create database backup
- [ ] Review all migration scripts
- [ ] Test migrations in staging environment
- [ ] Review new API endpoints
- [ ] Verify rate limiting configuration
- [ ] Check monitoring alerts are active
- [ ] Prepare rollback plan
- [ ] Notify team of deployment window

### Deployment Day (Planned maintenance window)

**Phase 1: Database Migrations** (15 min, no downtime)
```bash
# Run in order
npx prisma migrate deploy
# Wait for migration to complete
npx prisma db validate
```

**Phase 2: Application Deployment** (10 min, rolling)
```bash
# Deploy new code with feature flags disabled initially
npm run build
docker build -t qmoi-enhanced:v3.3.0 .
docker push qmoi-enhanced:v3.3.0

# Update deployments (rolling update)
kubectl set image deployment/qmoi-api \
  qmoi-api=qmoi-enhanced:v3.3.0 --record

# Wait for rollout
kubectl rollout status deployment/qmoi-api
```

**Phase 3: Feature Activation** (5 min)
```bash
# Once deployment verified, enable features
export BIOMETRIC_ENABLED=true
export PRIVACY_MASK_ENABLED=true
export SESSION_TRACK_DEVICES=true

# Restart pods to pick up env changes
kubectl rollout restart deployment/qmoi-api
kubectl rollout status deployment/qmoi-api
```

**Phase 4: Verification** (15 min)
```bash
# Run smoke tests
npm run test:smoke

# Check health endpoints
curl https://api.qmoi.local/health
curl https://api.qmoi.local/api/auth/me

# Monitor logs
kubectl logs -f deployment/qmoi-api --tail=100
```

### Post-Deployment (30 min monitoring)

- [ ] All health checks passing
- [ ] Error rate normal (< 0.1%)
- [ ] Response times normal (< 200ms p95)
- [ ] No spike in authentication failures
- [ ] Database queries performing well
- [ ] Monitoring alerts all green
- [ ] Team notified of successful deployment

### Rollback Plan (if needed)

```bash
# Immediate rollback (< 2 min)

# 1. Disable new features
export BIOMETRIC_ENABLED=false
export PRIVACY_MASK_ENABLED=false
export SESSION_TRACK_DEVICES=false

# 2. Restart pods
kubectl rollout restart deployment/qmoi-api

# 3. If still having issues, roll back deployment
kubectl rollout undo deployment/qmoi-api

# 4. If database changes caused issues
npx prisma migrate resolve --rolled-back "migration_name"
```

---

## Monitoring Setup

### Key Metrics to Monitor

```typescript
// Configure monitoring dashboard
const metricsConfig = {
  'auth.biometric.enrollment': {
    type: 'counter',
    description: 'Biometric enrollment attempts',
    alert: { threshold: 100, window: '1h' },
  },
  'auth.biometric.verification': {
    type: 'counter',
    description: 'Biometric verification attempts',
    alert: { threshold: 500, window: '1h' },
  },
  'auth.privacy_mask.enable': {
    type: 'counter',
    description: 'Privacy mask activations',
    alert: { threshold: 50, window: '1h' },
  },
  'session.active_count': {
    type: 'gauge',
    description: 'Active sessions per user',
    alert: { threshold: 10, window: 'instant' },
  },
  'session.device_detection': {
    type: 'histogram',
    description: 'Time to detect device',
    alert: { percentile_95: 100 },
  },
  'auth.endpoint_latency': {
    type: 'histogram',
    description: 'Auth endpoint response time',
    alert: { percentile_95: 200 },
  },
};
```

### Alert Rules

```yaml
# prometheus-rules.yml
groups:
  - name: auth_alerts
    interval: 30s
    rules:
      - alert: BiometricEnrollmentFailureRate
        expr: |
          (
            increase(auth_biometric_enrollment_failures[5m])
            /
            increase(auth_biometric_enrollment_total[5m])
          ) > 0.1
        for: 5m
        annotations:
          summary: "High biometric enrollment failure rate"

      - alert: SessionManagementFailure
        expr: |
          increase(session_management_errors[5m]) > 5
        for: 5m
        annotations:
          summary: "Session management errors detected"

      - alert: PrivacyMaskDisabled
        expr: |
          privacy_mask_enabled == 0
        for: 1m
        annotations:
          summary: "Privacy mask feature disabled"
```

---

## Performance Optimization

### Database Query Optimization

```sql
-- Run to verify index usage
EXPLAIN ANALYZE
SELECT * FROM user_sessions 
WHERE user_id = 'user-123' AND is_active = true;

-- Should use index: idx_user_sessions_user_id_is_active

-- Monitor slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements
WHERE query LIKE '%user_session%'
ORDER BY total_time DESC;
```

### Connection Pool Configuration

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Configure connection pool
const pool = prisma.$extends({
  engine: {
    config: {
      pool: {
        min: parseInt(process.env.DATABASE_POOL_MIN || '5'),
        max: parseInt(process.env.DATABASE_POOL_MAX || '20'),
        connection_lifetime_seconds: 1800,
        connection_idle_seconds: 600,
      },
    },
  },
});
```

### Cache Strategy

```typescript
// lib/cache/session-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache session data (5 min TTL)
export async function cacheSession(sessionId: string, data: any): Promise<void> {
  await redis.setex(
    `session:${sessionId}`,
    300, // 5 minutes
    JSON.stringify(data)
  );
}

// Cache device info (24 hour TTL)
export async function cacheDeviceInfo(deviceId: string, data: any): Promise<void> {
  await redis.setex(
    `device:${deviceId}`,
    86400, // 24 hours
    JSON.stringify(data)
  );
}

// Invalidate cache on changes
export async function invalidateSessionCache(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}
```

---

## Backup & Disaster Recovery

### Backup Strategy

```bash
# Daily automated backup
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/qmoi_$(date +\%Y\%m\%d).sql.gz

# Weekly encrypted backup (offsite)
0 3 * * 0 pg_dump $DATABASE_URL | gzip | gpg --encrypt --recipient $GPG_KEY | \
  aws s3 cp - s3://backups/qmoi/weekly_$(date +\%Y\%m\%d).sql.gz.gpg

# Retention: 30 days local, 1 year offsite
find /backups -name "qmoi_*.sql.gz" -mtime +30 -delete
```

### Recovery Procedure

```bash
#!/bin/bash
# scripts/restore-from-backup.sh

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "Restoring from backup: $BACKUP_FILE"

# Create temporary database
createdb qmoi_restore_temp

# Restore
gunzip -c "$BACKUP_FILE" | psql qmoi_restore_temp

# Verify restore
psql qmoi_restore_temp -c "SELECT COUNT(*) FROM users;"

# Swap databases
psql -c "DROP DATABASE qmoi_production WITH (FORCE);"
psql -c "ALTER DATABASE qmoi_restore_temp RENAME TO qmoi_production;"

echo "✅ Restore complete"
```

---

**Document Status:** Deployment Ready  
**Last Updated:** 2026-06-14  
**Next Step:** Execute Phase 3 Tier 2 tests → Begin deployment preparation

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-28T19:36:37.188868Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 603
- words: 1644
- characters: 14938
- headings: 67
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
