# API.md - QMOI Complete API Documentation  

**Last Updated**: 2026-04-13T23:45:32.138264
**Version**: 2.0.0
**Total Endpoints**: 25+

## API Endpoints Summary

### Core QMOI APIs (8 endpoints)
- `/api/qmoi-model` - Model info & config
- `/api/qmoi/autodev` - Auto development features
- `/api/qmoi/suggestions` - QMOI recommendations
- `/api/qmoi/own-device-logs` - Device logging
- `/api/qmoi/backup` - Backup management
- `/api/reasoning/process` - Recursive reasoning (Pillar 1)
- `/api/multimodal/process` - Multimodal ingestion (Pillar 4)
- `/api/healing/analyze` - Self-healing (Pillar 3)

### Deployment APIs (2 endpoints)
- `/api/deploy` - Deploy to staging/production
- `/api/deploy/auto-redeploy` - Auto redeploy on failure

### Git Integration APIs (3 endpoints)
- `/api/git/commit` - Commit changes
- `/api/git/push` - Push to repository
- `/api/git/pr` - Create pull requests

### Health & Monitoring APIs (2 endpoints)
- `/api/health` - System health status
- `/api/qmoi/revenue-dashboard` - Financial metrics

### Financial APIs (2 endpoints)
- `/api/wallet` - Wallet operations
- `/api/production-api` - Master production API v2.0

### Admin APIs (2 endpoints)
- `/api/master/domains/emergency-takeover` - Domain failover
- `/api/master/sponsored/analytics` - Partner analytics

### QVillage APIs (3 endpoints)
- `/api/webhooks/qvillage` - Community webhooks
- `/api/benchmarking/autorate` - Auto benchmarking
- `/api/benchmarking/results` - Export results

### Specialized Routes (2+ endpoints)
- Additional AI, monitoring, and utility endpoints

## Detailed Endpoint Information

See ENDPOINTS.md for complete inventory and ROUTES.md for route patterns.

## Authentication

- Public endpoints: GET requests with no sensitive data
- Protected endpoints: Require Bearer token
- Admin endpoints: Require admin credentials
- Master endpoints: Master key only

## Rate Limiting

- Public users: 100 req/min
- Authenticated: 1,000 req/min
- Admin: 10,000 req/min
- Master: Unlimited

---

**Auto-Updated**: 2026-04-13T23:45:32.138264
**Status**: All 25+ endpoints production-ready
