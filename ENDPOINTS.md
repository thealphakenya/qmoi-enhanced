<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-06T04:51:42.376366Z
- note: Auto-updated by `scripts/comprehensive_docs_update.py`
<!-- LION_VALIDATION_END -->

# QMOI System Endpoints

**Last Updated**: 2026-04-06 (AUTO-GENERATED)
**Total Endpoints**: 264
**Last Scan**: 2026-04-06T04:51:42.376366Z

## Overview

This document catalogs all available endpoints in the QMOI system.

## Endpoint Table

| # | Method | Endpoint | File | Status |
|---|--------|----------|------|--------|
| 1 | GET | `/api/account-automation` | ['api', 'account-automation', 'route.ts'] | ✅ |
| 2 | GET | `/api/accountability` | ['api', 'accountability', 'route.ts'] | ✅ |
| 3 | GET | `/api/accountability` | ['api', 'accountability', 'route.ts'] | ✅ |
| 4 | GET | `/api/admin/alerts` | ['admin', 'alerts', 'route.ts'] | ✅ |
| 5 | GET | `/api/admin/audit-logs` | ['admin', 'audit-logs', 'route.ts'] | ✅ |
| 6 | GET | `/api/admin/autofix/automation` | ['autofix', 'automation', 'route.ts'] | ✅ |
| 7 | GET | `/api/admin/autofix/autoscan` | ['autofix', 'autoscan', 'route.ts'] | ✅ |
| 8 | GET | `/api/admin/autofix/background-automation` | ['autofix', 'background-automation', 'route.ts'] | ✅ |
| 9 | GET | `/api/admin/autofix/bootstrap` | ['autofix', 'bootstrap', 'route.ts'] | ✅ |
| 10 | GET | `/api/admin/autofix/config` | ['autofix', 'config', 'route.ts'] | ✅ |
| 11 | GET | `/api/admin/autofix/errors` | ['autofix', 'errors', 'route.ts'] | ✅ |
| 12 | GET | `/api/admin/autofix/fix-all` | ['autofix', 'fix-all', 'route.ts'] | ✅ |
| 13 | POST | `/api/admin/autofix/fix/[errorId]` | ['fix', '[errorId]', 'route.ts'] | ✅ |
| 14 | GET | `/api/admin/autofix/health` | ['autofix', 'health', 'route.ts'] | ✅ |
| 15 | GET | `/api/admin/autofix/healthmonitor` | ['autofix', 'healthmonitor', 'route.ts'] | ✅ |
| 16 | GET | `/api/admin/autofix/scan` | ['autofix', 'scan', 'route.ts'] | ✅ |
| 17 | GET | `/api/admin/autofix/stream` | ['autofix', 'stream', 'route.ts'] | ✅ |
| 18 | GET | `/api/admin/dashboard` | ['admin', 'dashboard', 'route.ts'] | ✅ |
| 19 | GET | `/api/admin/endpoints-discover` | ['admin', 'endpoints-discover', 'route.ts'] | ✅ |
| 20 | GET | `/api/admin/financial/global` | ['financial', 'global', 'route.ts'] | ✅ |
| 21 | GET | `/api/admin/financial/summary` | ['financial', 'summary', 'route.ts'] | ✅ |
| 22 | POST | `/api/admin/master/auth` | ['master', 'auth', 'route.ts'] | ✅ |
| 23 | POST | `/api/admin/master/logout` | ['master', 'logout', 'route.ts'] | ✅ |
| 24 | GET | `/api/admin/metrics` | ['admin', 'metrics', 'route.ts'] | ✅ |
| 25 | GET | `/api/admin/monitoring` | ['admin', 'monitoring', 'route.ts'] | ✅ |
| 26 | GET | `/api/admin/rate-limits` | ['admin', 'rate-limits', 'route.ts'] | ✅ |
| 27 | GET | `/api/admin/tracing` | ['admin', 'tracing', 'route.ts'] | ✅ |
| 28 | GET | `/api/admin/users` | ['admin', 'users', 'route.ts'] | ✅ |
| 29 | GET | `/api/ai` | ['api', 'ai', 'route.ts'] | ✅ |
| 30 | GET | `/api/ai-anomaly-service` | ['api', 'ai-anomaly-service', 'route.ts'] | ✅ |
| 31 | GET | `/api/ai-health` | ['api', 'ai-health', 'route.ts'] | ✅ |
| 32 | GET | `/api/ai-self-diagnostics` | ['api', 'ai-self-diagnostics', 'route.ts'] | ✅ |
| 33 | GET | `/api/ai/scan` | ['ai', 'scan', 'route.ts'] | ✅ |
| 34 | POST | `/api/alerts/webhook` | ['alerts', 'webhook', 'route.ts'] | ✅ |
| 35 | GET | `/api/analytics/transactions` | ['analytics', 'transactions', 'route.ts'] | ✅ |
| 36 | GET | `/api/analytics/wallets` | ['analytics', 'wallets', 'route.ts'] | ✅ |
| 37 | GET | `/api/auth/biometric/capture` | ['biometric', 'capture', 'route.ts'] | ✅ |
| 38 | POST | `/api/auth/login` | ['auth', 'login', 'route.ts'] | ✅ |
| 39 | POST | `/api/auth/login` | ['auth', 'login', 'route.ts'] | ✅ |
| 40 | GET | `/api/auth/oauth/[provider]` | ['oauth', '[provider]', 'route.ts'] | ✅ |
| 41 | POST | `/api/auth/profile` | ['auth', 'profile', 'route.ts'] | ✅ |
| 42 | POST | `/api/auth/refresh` | ['auth', 'refresh', 'route.ts'] | ✅ |
| 43 | POST | `/api/auth/register` | ['auth', 'register', 'route.ts'] | ✅ |
| 44 | GET | `/api/auth/settings` | ['auth', 'settings', 'route.ts'] | ✅ |
| 45 | GET | `/api/auth/signin` | ['auth', 'signin', 'route.ts'] | ✅ |
| 46 | GET | `/api/auth/signup` | ['auth', 'signup', 'route.ts'] | ✅ |
| 47 | POST | `/api/auth/verify` | ['auth', 'verify', 'route.ts'] | ✅ |
| 48 | POST | `/api/auth/verify-email` | ['auth', 'verify-email', 'route.ts'] | ✅ |
| 49 | POST | `/api/auth/webauthn/auth/finish` | ['auth', 'finish', 'route.ts'] | ✅ |
| 50 | POST | `/api/auth/webauthn/auth/options` | ['auth', 'options', 'route.ts'] | ✅ |

## Endpoint Details

### By Category

#### Evolution System (5)
- `GET` `/api/evolution/autoclone-evolution`
- `POST` `/api/evolution/autoclone-evolution`
- `GET` `/api/evolution/platform-evolution`
- `POST` `/api/evolution/platform-evolution`
- `GET` `/api/qmoi/evolution/compare-models`
- `POST` `/api/qmoi/evolution/compare-models`
- `GET` `/api/qmoi/evolution/replace-model`
- `POST` `/api/qmoi/evolution/replace-model`
- `GET` `/api/qmoi/evolution/track-evolution`
- `POST` `/api/qmoi/evolution/track-evolution`

#### Autoprod System (0)


#### Health & Monitoring (12)
- `GET` `/api/admin/autofix/health`
- `GET` `/api/admin/autofix/healthmonitor`
- `GET` `/api/ai-health`
- `POST` `/api/ai-health`
- `GET` `/api/consciousness/health`
- `GET` `/api/domains/health`
- `GET` `/api/health`
- `POST` `/api/health`
- `GET` `/api/health/data`
- `POST` `/api/health/data`
- `GET` `/api/lion/workflows/health`
- `PUT` `/api/lion/workflows/health`
- `GET` `/api/qmoi/health`
- `POST` `/api/qmoi/health`
- `GET` `/api/qmoi/health/stream`
- `GET` `/api/v1/health`
- `GET` `/api/v2/health`

#### Master Operations (16)
- `POST` `/api/admin/master/auth`
- `POST` `/api/admin/master/logout`
- `GET` `/api/master/domains`
- `POST` `/api/master/domains`
- `POST` `/api/master/domains/approve/[domain]`
- `POST` `/api/master/domains/emergency-takeover`
- `POST` `/api/master/domains/force-refresh`
- `DELETE` `/api/master/domains/remove/[domain]`
- `GET` `/api/master/domains/status`
- `GET` `/api/master/links`
- `POST` `/api/master/sponsored/add`
- `GET` `/api/master/sponsored/analytics`
- `GET` `/api/master/sponsored/list`
- `DELETE` `/api/master/sponsored/remove/[userId]`
- `GET` `/api/master/sponsored/sync`
- `GET` `/api/master/tracks`
- `POST` `/api/master/tracks`
- `GET` `/api/qmoi/master-mode`
- `POST` `/api/qmoi/master-mode`

#### Global APIs (5)
- `GET` `/api/admin/financial/global`
- `POST` `/api/admin/financial/global`
- `GET` `/api/global`
- `POST` `/api/global`
- `PUT` `/api/global`
- `DELETE` `/api/global`
- `GET` `/api/global-links`
- `POST` `/api/global-links`
- `GET` `/api/global-news`
- `POST` `/api/global-news`
- `GET` `/api/qvs`
- `POST` `/api/qvs`

#### Integration APIs (23)
- `POST` `/api/cashon/start-trading`
- `POST` `/api/cashon/stop-trading`
- `GET` `/api/cashon/trading-status`
- `GET` `/api/datasets`
- `POST` `/api/datasets`
- `GET` `/api/datasets/[id]`
- `POST` `/api/datasets/[id]`
- `PUT` `/api/datasets/[id]`
- `DELETE` `/api/datasets/[id]`
- `POST` `/api/datasets/settings`
- `GET` `/api/global-links`
- `POST` `/api/global-links`
- `GET` `/api/links`
- `POST` `/api/links`
- `PATCH` `/api/links/[id]/zero-rated`
- `GET` `/api/links/validate`
- `POST` `/api/links/validate`
- `GET` `/api/master/links`
- `GET` `/api/media/generate`
- `POST` `/api/media/generate`
- `GET` `/api/media/search`
- `POST` `/api/media/search`
- `GET` `/api/media/status`
- `GET` `/api/qi-trading`
- `POST` `/api/qi-trading`
- `GET` `/api/qstore`
- `GET` `/api/qvillage`
- `POST` `/api/qvillage`
- `GET` `/api/qvillage/inference`
- `GET` `/api/qvillage/model-card`
- `POST` `/api/qvillage/model-card`
- `GET` `/api/qvillage/models`
- `GET` `/api/qvillage/spaces`
- `GET` `/api/trading/status`
- `POST` `/api/trading/status`
- `POST` `/api/webhooks/qvillage`

## Statistics

- **Total Endpoints**: 264
- **Evolution Endpoints**: 5
- **Autoprod Endpoints**: 0
- **Health Endpoints**: 12
- **Master Endpoints**: 16
- **Global Endpoints**: 5
- **Integration Endpoints**: 23

## HTTP Methods

- **GET**: 182 endpoints
- **POST**: 191 endpoints
- **PUT**: 18 endpoints
- **DELETE**: 17 endpoints
- **PATCH**: 3 endpoints

## Rate Limiting

- Public: 100 req/min
- Auth: 1000 req/min
- Master: 10000 req/min

---

Generated by QMOI Continuous Documentation System
Auto-updated at 2026-04-06T04:51:42.376366Z
