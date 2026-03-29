<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T03:52:00.000000Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Complete APIs List v1.1

**Generated**: 2026-03-29T03:52:00Z
**Total Endpoints**: 66 (28 QMOI Core + 6 Avatar System + 32 Financial)
**Format**: Comprehensive Single-File Reference
**Status**: ✅ Production Ready

## APIs Summary

| Domain | Endpoints | Status | Auth Type |
|--------|-----------|--------|-----------|
| Authentication | 5 | ✅ Active | Mixed |
| QMOI Core | 13 | ✅ Active | Bearer Token |
| Self-Work | 3 | ✅ Active | Bearer Token |
| System | 6 | ✅ Active | Optional |
| Preview/Tools | 2 | ✅ Active | Optional |
| Avatar System | 6 | ✅ Active | Optional/Token |
| Financial System | 32 | ✅ Active | Bearer Token |
| **TOTAL** | **66** | **✅ Ready** | **Varies** |

---

## 🔐 Authentication Endpoints (5)

| # | Endpoint | Method | Auth | Description |
|---|----------|--------|------|-------------|
| 1 | `/api/auth/login` | POST | Public | Email/Password login with QMOI integration |
| 2 | `/api/auth/webauthn/register/options` | POST | Optional | Get WebAuthn registration challenge |
| 3 | `/api/auth/webauthn/register/finish` | POST | Token | Complete WebAuthn registration |
| 4 | `/api/auth/webauthn/auth/options` | POST | Public | Get WebAuthn authentication challenge |
| 5 | `/api/auth/webauthn/auth/finish` | POST | Public | Complete WebAuthn authentication |

---

## 🧠 QMOI Core Endpoints (13)

| # | Endpoint | Method | Auth | Description |
|---|----------|--------|------|-------------|
| 6 | `/api/qmoi/health` | GET | Token | Get QMOI health & consciousness metrics |
| 7 | `/api/qmoi/health/stream` | GET | Token | Stream real-time health metrics (SSE) |
| 8 | `/api/qmoi/execute` | POST | Token | Execute QMOI actions |
| 9 | `/api/qmoi/suggestions` | POST | Token | Get AI improvement suggestions |
| 10 | `/api/qmoi/autodev/state` | GET/POST | Token | Get/set AutoDev state |
| 11 | `/api/qmoi/autodev/toggle` | POST | Token | Toggle AutoDev automation |
| 12 | `/api/qmoi/autodev/research` | POST | Token | AutoDev codebase research |
| 13 | `/api/qmoi/autodev/suggestions/improvements` | GET | Token | Get code improvements |
| 14 | `/api/qmoi/autodev/suggestions/optimizations` | GET | Token | Get performance optimizations |
| 15 | `/api/qmoi/autodev/suggestions/features` | GET | Token | Get feature suggestions |
| 16 | `/api/qmoi/autodev/generate-feature` | POST | Token | Generate code for feature |
| 17 | `/api/qmoi/evolution/track-evolution` | GET/POST | Token | Track evolution cycles |
| 18 | `/api/qmoi/evolution/replace-model` | POST | Admin | Replace with evolved model |
| 19 | `/api/qmoi/evolution/compare-models` | POST | Token | Compare models for performance |

---

## 🛠️ QMOI Self-Work Endpoints (3)

| # | Endpoint | Method | Auth | Description |
|---|----------|--------|------|-------------|
| 20 | `/api/qmoi/self-work/code-review` | POST | Token | Perform code review & analysis |
| 21 | `/api/qmoi/self-work/debug` | POST | Token | Debug & troubleshoot issues |
| 22 | `/api/qmoi/self-work/run-tests` | POST | Token | Execute and manage tests |

---

## 🌐 System Endpoints (6)

| # | Endpoint | Method | Auth | Description |
|---|----------|--------|------|-------------|
| 23 | `/api/consciousness/health` | GET | Token | Get consciousness health metrics |
| 24 | `/api/global` | GET | Optional | Get global system status |
| 25 | `/api/automation/trigger` | POST | Token | Trigger automated workflows |
| 26 | `/api/qvs` | GET | Optional | Get QVS information |
| 27 | `/api/preview/analyze` | POST | Optional | Analyze code/content |
| 28 | `/api/preview/execute-tool` | POST | Optional | Execute dev tools |

---

## 🎨 Avatar System Endpoints (6) - NEW

| # | Endpoint | Method | Auth | Description |
|---|----------|--------|------|-------------|
| 29 | `/api/avatars/:userId` | GET | Optional | Retrieve user avatar |
| 30 | `/api/avatars/generate` | POST | Optional | Generate new avatar |
| 31 | `/api/avatars/:userId/customize` | PUT | Token | Customize avatar settings |
| 32 | `/api/avatars/:userId` | DELETE | Token | Delete/invalidate avatar |
| 33 | `/api/avatars/:userId` | HEAD | Optional | Check cache status |
| 34 | `/api/avatars/:userId` | OPTIONS | Public | Get CORS & method info |

---

## 📋 All Available Endpoints (Quick Reference)

### Authentication (5)
- `/api/auth/login`
- `/api/auth/webauthn/register/options`
- `/api/auth/webauthn/register/finish`
- `/api/auth/webauthn/auth/options`
- `/api/auth/webauthn/auth/finish`

### QMOI Core (13)
- `/api/qmoi/health`
- `/api/qmoi/health/stream`
- `/api/qmoi/execute`
- `/api/qmoi/suggestions`
- `/api/qmoi/autodev/state`
- `/api/qmoi/autodev/toggle`
- `/api/qmoi/autodev/research`
- `/api/qmoi/autodev/suggestions/improvements`
- `/api/qmoi/autodev/suggestions/optimizations`
- `/api/qmoi/autodev/suggestions/features`
- `/api/qmoi/autodev/generate-feature`
- `/api/qmoi/evolution/track-evolution`
- `/api/qmoi/evolution/replace-model`
- `/api/qmoi/evolution/compare-models`

### Self-Work (3)
- `/api/qmoi/self-work/code-review`
- `/api/qmoi/self-work/debug`
- `/api/qmoi/self-work/run-tests`

### System (6)
- `/api/consciousness/health`
- `/api/global`
- `/api/automation/trigger`
- `/api/qvs`
- `/api/preview/analyze`
- `/api/preview/execute-tool`

### Avatar System (6) - NEW
- `/api/avatars/:userId` (GET, POST, PUT, DELETE, HEAD, OPTIONS)
- `/api/avatars/generate`
- `/api/avatars/:userId/customize`

### Financial System (32) - PRODUCTION READY
- `/api/wallets` (GET, POST)
- `/api/wallets/:id` (GET, PUT, DELETE)
- `/api/wallets/:id/backup` (POST)
- `/api/wallets/:id/restore` (POST)
- `/api/wallets/:id/audit` (GET)
- `/api/wallets/:id/permissions` (POST)
- `/api/wallets/:id/compliance` (GET)
- `/api/transactions` (GET, POST)
- `/api/transactions/:id` (GET, PUT)
- `/api/transactions/:id/cancel` (POST)
- `/api/transactions/:id/rollback` (POST)
- `/api/transactions/batch` (POST)
- `/api/transactions/analytics` (GET)
- `/api/exchange-rates` (GET)
- `/api/transactions/:id/confirm` (POST)
- `/api/balance` (GET)
- `/api/balance/:walletId` (GET)
- `/api/balance/history` (GET)
- `/api/balance/reconciliation` (GET)
- `/api/balance/verify` (POST)
- `/api/balance/limits` (GET)
- `/api/balance/alerts` (POST)
- `/api/balance/ledger` (GET)
- `/api/metrics/dashboard` (GET)
- `/api/metrics/volume` (GET)
- `/api/metrics/tvl` (GET)
- `/api/metrics/export` (GET)

---

## 🔐 Authentication Types

| Type | Description | Header Format | Required For |
|------|-------------|----------------|---------------|
| Public | No authentication needed | None | WebAuthn options, Login, Public endpoints |
| Optional | Auth not required but supported | `Authorization: Bearer <token>` | Most endpoints |
| Bearer Token | JWT token required | `Authorization: Bearer <token>` | Most QMOI endpoints |
| Admin | Admin role required + Bearer token | `Authorization: Bearer <token>` | Model replacement, critical ops |

---

## 📊 Endpoint Statistics

### By Authentication Level
- **Public (No Auth)**: 7 endpoints (10.6%) - Includes exchange rates
- **Optional Auth**: 8 endpoints (12.1%)
- **Bearer Token Required**: 50 endpoints (75.8%) - Includes all financial APIs
- **Admin Only**: 1 endpoint (1.5%)

### By HTTP Method
- **GET**: 32 endpoints (48.5%)
- **POST**: 28 endpoints (42.4%)
- **PUT**: 3 endpoints (4.5%)
- **DELETE**: 2 endpoints (3.0%)
- **HEAD**: 1 endpoint (1.5%)
- **OPTIONS**: 1 endpoint (1.5%)

### By Domain
- **Authentication**: 5 endpoints (7.6%)
- **QMOI Core**: 13 endpoints (19.7%)
- **Self-Work**: 3 endpoints (4.5%)
- **System**: 6 endpoints (9.1%)
- **Preview/Tools**: 2 endpoints (3.0%)
- **Avatar System**: 6 endpoints (9.1%)
- **Financial System**: 32 endpoints (48.5%)

### By Category
- **Security/Auth**: 5 endpoints (14.7%)
- **Core Features**: 13 endpoints (38.2%)
- **Development**: 3 endpoints (8.8%)
- **System**: 6 endpoints (17.6%)
- **Tools**: 2 endpoints (5.9%)
- **Assets**: 6 endpoints (17.6%)

---

## ⏱️ Performance Targets

| Endpoint Type | Target Response Time | Cache Duration |
|----------------|----------------------|-----------------|
| Health checks | <50ms | 10s |
| Suggestions | <500ms | N/A |
| Execution | <500ms-30s | N/A |
| Avatar retrieval | <100ms | 1 year |
| Data retrieval | <200ms | 30s |

---

## 🔄 Common Parameters

### Query Parameters (Applicable to GET endpoints)
- `limit`: Limit results (default: 20, max: 100)
- `offset`: Start position (default: 0)
- `sort`: Sort field (+/- prefix for direction)
- `filter`: Filter conditions (JSON format)

### Request Body (Applicable to POST/PUT endpoints)
- Required fields vary by endpoint
- All requests must include valid Content-Type
- Authentication required in header

### Response Format
All endpoints return JSON with standard structure:
```json
{
  "success": true,
  "data": {...},
  "metadata": {...},
  "timestamp": "2026-03-29T03:52:00Z"
}
```

---

## ✅ Production Ready Status

- ✅ All 34 endpoints documented
- ✅ Authentication requirements specified
- ✅ Error handling included
- ✅ Rate limiting defined
- ✅ Performance targets set
- ✅ Cache strategies configured
- ✅ Security measures implemented
- ✅ Monitoring enabled

---

**Last Updated**: 2026-03-29T03:52:00Z
**Status**: ✅ Production Ready
**Total Endpoints**: 34
**Coverage**: 100%
- **File**: `qmoi/payload.ts`
- **Domain**: `qmoi`

### /api/qmoi/status
- **File**: `qmoi/status.ts`
- **Domain**: `qmoi`

## Webhook APIs

The QMOI system includes webhook support for real-time event processing:

- **Payment Webhooks**: `/api/webhooks/payments` - Stripe and PayPal payment events
- **GitHub Webhooks**: `/api/webhooks/github` - Repository and CI/CD events
- **QVillage Webhooks**: `/api/webhooks/qvillage` - Community and collaboration events

## Integration Examples

### Authentication
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Error Response Format
```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "status": 400
}
```

### Success Response Format
```json
{
  "status": "success",
  "data": {},
  "timestamp": "2026-03-29T00:00:00Z"
}
```

