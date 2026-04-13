# APIs_1.md - QMOI API Reference v1.0

**Last Updated**: 2026-04-13T23:45:32.138264
**Version**: 1.0.0
**Stable**: Yes - This is the stable API reference

## Stable API Endpoints

### Core QMOI System APIs
1. **GET/PUT /api/qmoi-model** - QMOI model operations
2. **POST/PUT /api/qmoi/autodev** - Automatic development
3. **POST/PUT /api/qmoi/suggestions** - AI suggestions
4. **GET/PUT/POST /api/qmoi/own-device-logs** - Device logging
5. **GET /api/qmoi/backup** - Backup operations

### AI Processing APIs
6. **POST /api/reasoning/process** - Recursive reasoning
7. **POST /api/multimodal/process** - Multimodal processing
8. **POST /api/healing/analyze** - Error analysis & healing

### Deployment APIs
9. **PUT/GET /api/deploy** - Deployment management
10. **PUT /api/deploy/auto-redeploy** - Auto redeploy

### Git APIs
11. **PUT /api/git/commit** - Git commits
12. **PUT /api/git/push** - Push to repository
13. **POST /api/git/pr** - Pull requests

### Health & Financial APIs
14. **GET/PUT /api/health** - Health status
15. **GET /api/qmoi/revenue-dashboard** - Revenue metrics
16. **GET/POST/PUT /api/wallet** - Wallet operations
17. **PUT/GET /api/production-api** - Production API v2.0

### Admin & QVillage APIs
18. **PUT /api/master/domains/emergency-takeover** - Domain failover
19. **GET/PUT /api/master/sponsored/analytics** - Partner analytics
20. **GET/POST/PUT /api/webhooks/qvillage** - Community webhooks
21. **GET/POST /api/benchmarking/autorate** - Benchmarking
22. **POST /api/benchmarking/results** - Export benchmark results

## Versioning

- Current Stable: v1.0.0
- Previous: N/A (initial release)
- Deprecation Policy: Minimum 6 months notice

## Breaking Changes

None - First stable release maintains full backward compatibility.

## Rate Limits

| User Type | Limit |
|-----------|-------|
| Public | 100 req/min |
| Authenticated | 1,000 req/min |
| Admin | 10,000 req/min |
| Master | Unlimited |

---

**Stable Reference**: v1.0.0
**Last Modified**: 2026-04-13T23:45:32.138264
