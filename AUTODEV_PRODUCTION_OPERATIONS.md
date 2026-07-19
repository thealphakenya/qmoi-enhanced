---
quantum-enabled: true
---

# QMOI Enhanced - AutoPRODUCTION production Operations Guide

**Version:** 2.0 - production Enhanced
**Last Updated:** 2026-04-24
**Status:** ✅ production Migration Complete

## Overview

QMOI's AutoPRODUCTION system now provides comprehensive automated production operations for enterprise-grade financial management. This guide explains how to enable and execute bulk production commands to manage QMOI  state.

## Quick Start - production Commands

### 1. Complete production Migration
```bash
python3 scripts/production_migration_complete.py
```
✅ Migrates mock implementations to live production code
✅ Creates CashOn production module
✅ Creates financial statistics module
✅ Updates 40+ files with production patterns

### 2. production Validation
```bash
# Verify production readiness
python3 scripts/validate_production_state.py

# Test CashOn API integration
python3 scripts/wallets/wallets_api.py --mode=production --test

# Validate financial data queries
python3 scripts/financial_verification.py --production

# Run security audit
npm run security-audit
```

### 3. Deploy to production
```bash
# Pre-deployment checks
npm run pre-deploy-checks

# Database migrations
npm run db:migrate:production

# Deploy application
npm run deploy:production

# Post-deployment verification
npm run post-deploy-verify
```

## AutoPRODUCTION Bulk Operations

### Wallet Management (Bulk)
```bash
# Verify all wallets 
python3 scripts/wallets/check_wallets.py --production --bulk

# Audit wallet transactions
python3 scripts/wallets_audit.py --user-id=all --export-csv

# Query wallet data by multiple IDs
python3 scripts/wallets/query_wallet.py --batch-file=wallet_ids.txt
```

### Financial Statistics (Bulk)
```bash
# Update financial stats for all users (background job)
python3 scripts/qmoi_financial_integration_bulk_updater.py --mode=production

# Generate financial reports
python3 scripts/qmoi_financial_integration_bulk_updater.py --report=monthly

# Validate financial data integrity
python3 scripts/financial_verification.py --full-audit
```

### Transaction Processing (Bulk)
```bash
# Process pending transactions
node scripts/cashon/process_transactions.js --mode=production --batch-size=100

# Reconcile transaction history
node scripts/cashon/reconcile_transactions.js

# Generate transaction reports
node scripts/cashon/transaction_reports.js --period=monthly
```

## Advanced Configuration

### CashOn production Configuration

**Environment Variables Required:**
```bash
# CashOn API
export CASHON_BASE_URL="https://api.cashon.io/v1"
export CASHON_API_KEY="sk_live_xxxxxxxxxxxxxxxx"
export CASHON_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxx"

# Database
export FINANCIAL_DB_URL="postgres://user:pass@host:5432/qmoi_prod"
export DATABASE_HOST="prod.db.internal"

# Security
export JWT_SECRET="production_jwt_secret"
export WEBHOOK_SIGNING_SECRET="whsec_production"

# Features
export ENABLE_PRODUCTION_MODE="true"
export ENABLE_REAL_TRANSACTIONS="true"
export ENABLE_WEBHOOK_VERIFICATION="true"
```

### Financial Statistics Configuration

**Database Connection:**
```typescript
// services/financial-stats-production.ts
const pool = new Pool({
  connectionString: process.env.FINANCIAL_DB_URL,
  max: 20,                    // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Zero-State Logic:**
```typescript
// Returns proper zero state for users with no transactions
{
  totalTransactions: 0,
  totalAmount: 0.00,
  averageAmount: 0.00,
  lastTransactionTime: null,
  message: 'No transactions yet'
}
```

## Monitoring & Observability

### Real-time Monitoring
```bash
# Start production monitoring dashboard
npm run monitor:production

# View transaction metrics
npm run metrics:transactions

# Check API health
npm run health:check

# Monitor webhook deliveries
npm run monitor:webhooks
```

### Logging Setup
```typescript
// production logging with Sentry integration
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### Alert Thresholds
```yaml
alerts:
  transaction_failure_rate:
    threshold: 1%
    action: page_oncall
  
  api_latency:
    threshold: 1000ms
    action: alert
  
  webhook_failures:
    threshold: 0.1%
    action: page_oncall
  
  db_connection_errors:
    threshold: 5 per minute
    action: alert
```

## Security & Compliance

### API Security
```bash
# Enable CORS with production domain
CORS_ORIGIN="https://qmoi.ai"

# Rate limiting
RATE_LIMIT_REQUESTS="100"
RATE_LIMIT_WINDOW="60"

# HTTPS enforcement
FORCE_HTTPS="true"
```

### Webhook Security
```typescript
// Mandatory signature verification 
const isValid = cashOnProduction.verifyWebhookSignature(
  payload,
  request.headers['x-cashon-signature']
);

if (!isValid) {
  throw new Error('Webhook signature verification failed');
}
```

### Database Security
```bash
# SSL connection required
DATABASE_SSL="require"

# Connection pooling with timeouts
DATABASE_POOL_SIZE="20"
DATABASE_IDLE_TIMEOUT="30000"
DATABASE_CONNECT_TIMEOUT="2000"
```

## Deployment Scenarios

### Blue-Green Deployment
```bash
# Deploy new version to blue environment
npm run deploy:blue --version=v2.0.0

# Run smoke tests
npm run test:smoke:blue

# Switch traffic to blue
npm run switch:green->blue

# Monitor for issues
npm run monitor:production --environment=blue

# Rollback if needed
npm run switch:blue->green
```

### Canary Deployment
```bash
# Deploy to 5% of traffic
npm run deploy:canary --percentage=5 --version=v2.0.0

# Monitor metrics
npm run monitor:canary --interval=60s

# Gradually increase percentage
npm run canary:increase-traffic --percentage=25
npm run canary:increase-traffic --percentage=50
npm run canary:increase-traffic --percentage=100

# Complete rollout
npm run canary:promote-to-stable
```

### Rollback Procedures
```bash
# Quick rollback to previous version
npm run rollback --to=v1.9.8

# Full database rollback
npm run db:rollback --snapshot=latest

# Verify successful rollback
npm run health:check --critical
```

## Performance Optimization

### Database Query Optimization
```sql
-- Create indexes for common queries
CREATE INDEX idx_transactions_user_id_created 
ON transactions(user_id, created_at DESC);

CREATE INDEX idx_wallets_user_id 
ON wallets(user_id);

-- Connection pooling
VACUUM ANALYZE;
REINDEX;
```

### Caching Strategy
```typescript
// production caching for financial stats
const stats = await cache.get(
  `user-stats:${userId}:${date}`,
  async () => await financialStats.getUserTransactionStats(userId),
  { ttl: 300 } // 5 minute cache
);
```

## Troubleshooting

### production Issues

**CashOn API Connection Fails**
```bash
# Verify API credentials
echo $CASHON_API_KEY

# Test API endpoint
curl -H "Authorization: Bearer $CASHON_API_KEY" \
  https://api.cashon.io/v1/health

# Check network connectivity
nc -zv api.cashon.io 443
```

**Financial Data Not Updating**
```bash
# Check database connection
node -e "require('./db').pool.query('SELECT NOW()')"

# Verify database permissions
psql -c "SELECT * FROM information_schema.table_privileges WHERE grantee='qmoi_prod_user'"

# Run financial stats update manually
python3 scripts/qmoi_financial_integration_bulk_updater.py --force-update
```

**Webhook Delivery Failures**
```bash
# Check webhook endpoint
curl -X POST https://qmoi.ai/api/webhooks/cashon \
  -H "Content-Type: application/json" \
  -H "X-CashOn-Signature: $(echo 'test' | openssl dgst -sha256 -hmac $CASHON_WEBHOOK_SECRET -binary | base64)" \
  -d '{"event":"test"}'

# Review webhook logs
npm run logs:webhooks --tail=100

# Retry failed webhooks
npm run webhooks:retry --failed-since=1h
```

## Maintenance Tasks

### Daily Tasks
```bash
# Monitor transaction volume
npm run metrics:transactions --period=24h

# Check system health
npm run health:check

# Review error logs
npm run logs:errors --tail=1000
```

### Weekly Tasks
```bash
# Financial data reconciliation
python3 scripts/financial_verification.py --full-audit

# Database optimization
npm run db:optimize

# Security audit
npm run security-audit
```

### Monthly Tasks
```bash
# Generate financial reports
python3 scripts/qmoi_financial_integration_bulk_updater.py --report=monthly

# Performance analysis
npm run performance:analyze --period=30d

# Compliance audit
npm run audit:compliance
```

## Support & Escalation

### Level 1 - Automated Recovery
- Health check failures → Automatic restart
- API latency spike → Clear cache, increase connections
- DB connection error → Reconnect and retry

### Level 2 - Manual Investigation
```bash
# Enable debug logging
export DEBUG="qmoi:*"
npm start

# Detailed metrics dump
npm run metrics:dump > metrics_$(date +%s).json

# Database diagnostic
npm run db:diagnostic > db_diagnostic_$(date +%s).log
```

### Level 3 - Emergency Response
```bash
# Enable maintenance mode
touch .maintenance

# Graceful shutdown
npm run shutdown:graceful

# Database emergency backup
pg_dump $FINANCIAL_DB_URL > emergency_backup_$(date +%s).sql

# Escalate to team lead
npm run alert:escalate --severity=critical
```

## Still Need Help?

- Review PRODUCTION_DEPLOYMENT_CHECKLIST.md for setup steps
- Check PRODUCTION_MIGRATION_REPORT.json for migration details
- See services/cashon-production.ts for CashOn integration
- See services/financial-stats-production.ts for financial queries
- Contact: operations-team@qmoi.ai

---

**Last Updated:** 2026-04-24T12:00:00Z
**Next Review:** After production deployment
**Maintained By:** QMOI Enhanced Operations Team

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:40.525458Z
- production status: ⚠️ mixed production markers
- status tags: mixed, nonproduction, production, review
- lines: 454
- words: 1130
- characters: 10093
- headings: 107
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
