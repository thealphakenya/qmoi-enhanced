---
quantum-enabled: false
---

# QMOI Enhanced - production Quick Reference

**Version:** 1.0  
**Last Updated:** 2026-04-24  
**For:** Operations & Deployment Teams  

---

## 🚀 5-Minute Startup Guide

### 1. Environment Setup
```bash
# Copy and configure environment file
cp .env.production.PRODUCTIONlate .env.production

# Edit and add credentials
vim .env.production
# Required fields:
#   CASHON_API_KEY
#   CASHON_WEBHOOK_SECRET
#   FINANCIAL_DB_URL
#   JWT_SECRET
```

### 2. Database Connection
```bash
# Test connection
psql $FINANCIAL_DB_URL -c "SELECT NOW()"

# Run migrations
npm run db:migrate:production

# Verify tables
psql $FINANCIAL_DB_URL -c "SELECT table_name FROM information_schema.tables"
```

### 3. Start production Server
```bash
# Build application
npm run build

# Start with production configuration
NODE_ENV=production npm start

# Verify running
curl https://production-api.qmoi-enhanced.com:3000/health
```

### 4. Validate Everything
```bash
# Run full validation
python3 scripts/validate_production_state.py

# Should output: ✅ production VALIDATION: READY FOR DEPLOYMENT
```

---

## 📊 Key Commands

| Task | Command |
|------|---------|
| **Health Check** | `npm run health:check` |
| **View Metrics** | `npm run metrics:transactions` |
| **Check Logs** | `npm run logs:errors --tail=100` |
| **Test CashOn** | `python3 scripts/wallets/wallets_api.py --test` |
| **Validate Data** | `python3 scripts/financial_verification.py` |
| **Start Monitor** | `npm run monitor:production` |

---

## ⚠️ Emergency Procedures

### Transaction Failures Spike
```bash
# 1. Check API status
curl -H "Authorization: Bearer $CASHON_API_KEY" \
  https://api.cashon.io/v1/health

# 2. Check database
psql $FINANCIAL_DB_URL -c "SELECT COUNT(*) FROM transactions WHERE status='failed'"

# 3. View recent errors
npm run logs:errors --tail=50

# 4. If needed, enable circuit breaker
export CIRCUIT_BREAKER_ENABLED=true
```

### Database Connection Lost
```bash
# 1. Check connection
psql $FINANCIAL_DB_URL -c "SELECT 1"

# 2. Restart connection pool
npm run db:restart-pool

# 3. Verify recovery
npm run health:check

# 4. If still failing, trigger failover
npm run db:failover --to=replica
```

### Webhook Not Receiving
```bash
# 1. Verify endpoint is live
curl -X GET https://qmoi.ai/api/webhooks/cashon/status

# 2. Check logs for webhook events
npm run logs:webhooks --tail=50

# 3. Resync CashOn webhook configuration
node scripts/cashon/sync-webhooks.js

# 4. Retry failed webhooks
npm run webhooks:retry --failed-since=1h
```

---

## 📈 Monitoring 

### Real-time Dashboard
```bash
npm run monitor:production
```

### Key Metrics
- **Throughput:** Transactions per second
- **Latency:** Average response time (target: <300ms)
- **Error Rate:** Failed transactions (target: <0.1%)
- **Availability:** Uptime percentage (target: 99.9%)

### Alert Response
```bash
# High error rate alert
npm run logs:errors --since=5m | tail -20

# High latency alert
npm run metrics:latency:percentiles

# Database connection alert
psql $FINANCIAL_DB_URL -c "SELECT count(*) FROM pg_stat_activity"
```

---

## 🔐 Security Checklist

- [ ] All secrets in .env.production, never in code
- [ ] HTTPS enabled on all endpoints
- [ ] Webhook signature verification active
- [ ] Rate limiting configured
- [ ] Database SSL connections enabled
- [ ] Access logs being collected
- [ ] Error logs don't expose secrets

---

## 📋 Pre-Deployment Verification

Run this before every deployment:
```bash
#!/bin/bash
echo "🚀 Pre-Deployment Checklist"

# 1. Validate configuration
python3 scripts/validate_production_state.py || exit 1

# 2. Test API connectivity
node -e "const c = require('./services/cashon-production'); \
  c.cashOnProduction.getWalletBalance('test').then(() => logger.info('✅ API OK'))" || exit 1

# 3. Verify database
psql $FINANCIAL_DB_URL -c "SELECT COUNT(*) FROM transactions" || exit 1

# 4. Build check
npm run build || exit 1

# 5. Run tests
npm test || exit 1

echo "✅ All checks passed - Ready to deploy"
```

---

## 🛠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Transactions failing | CashOn API down | Wait for recovery, check status at cash-on.io |
| No wallet data | DB connection lost | Run `npm run db:restart-pool` |
| Webhooks not received | Endpoint not registered | Run `node scripts/cashon/sync-webhooks.js` |
| High latency | DB under load | Check `npm run metrics:db-queries` |
| Auth failing | JWT secret wrong | Verify `JWT_SECRET` env const |

---

## 📞 Escalation Path

**Level 1 - Automated Recovery (5 min)**
- Health checks running
- Auto-restart on failure
- Circuit breaker engaged

**Level 2 - Manual Intervention (15 min)**
- Review error logs: `npm run logs:errors`
- Check metrics: `npm run metrics:dump`
- Validate configuration: `python3 scripts/validate_production_state.py`

**Level 3 - Escalation (30 min)**
- Contact: ops-team@qmoi.ai
- Prepare: logs, metrics, recent changes
- Status page update

**Level 4 - Emergency⚠ (Immediate)**
- Trigger rollback: `npm run rollback --to=v1.9.8`
- Notify: all stakeholders
- Post-incident review

---

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| PRODUCTION_DEPLOYMENT_CHECKLIST.md | Full deployment steps |
| AUTOPRODUCTION_PRODUCTION_OPERATIONS.md | Complete ops guide |
| PRODUCTION_MIGRATION_SUMMARY.md | Migration details |
| PRODUCTION_VALIDATION_REPORT.json | Validation results |

---

## ✅ Success Criteria (24h Post-Launch)

- [ ] 0 transaction failures
- [ ] All webhooks delivered successfully  
- [ ] Average latency <250ms
- [ ] 99.9%+ uptime
- [ ] No unhandled errors in logs
- [ ] Financial data accurate
- [ ] Team comfortable with operations
- [ ] Monitoring dashboards active

---

## 🎯 30-Day production Goals

1. **Stability** - Zero service disruptions
2. **Performance** - Latency <200ms (p99)
3. **Reliability** - 99.95% uptime
4. **Security** - Zero security incidents
5. **Operations** - Team trained on all procedures
6. **Data Quality** - 100% transaction accuracy
7. **Compliance** - All audits passing

---

**Quick Help?** 
- Check implementation: `services/cashon-production.ts`
- See database setup: `services/financial-stats-production.ts`  
- Deployment guide: `PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- Full ops manual: `AUTOPRODUCTION_PRODUCTION_OPERATIONS.md`

**Questions?** Contact: operations-team@qmoi.ai

✅ **YOU ARE READY TO DEPLOY QMOI TO production**

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:17.389446Z
- production status: ⚠️ mixed production markers
- status tags: mixed, nonproduction, production, review
- lines: 291
- words: 977
- characters: 6934
- headings: 58
- links: 0
- images: 0
- tables: 21
- lion validation block: present
<!-- LION_VALIDATION_END -->
