<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T03:54:00.000000Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Complete Endpoints Reference v1.1

**Last Updated**: 2026-03-29T03:54:00Z
**Total Endpoints**: 66
**Status**: All Endpoints Production Ready
**Framework**: Next.js 20+ (App Router)

---

## Endpoints Index

### By Domain

#### AUTHENTICATION (5)
- POST /api/auth/login
- POST /api/auth/webauthn/register/options
- POST /api/auth/webauthn/register/finish
- POST /api/auth/webauthn/auth/options
- POST /api/auth/webauthn/auth/finish

#### QMOI CORE (13)
- GET /api/qmoi/health
- GET /api/qmoi/health/stream
- POST /api/qmoi/execute
- POST /api/qmoi/suggestions
- GET/POST /api/qmoi/autodev/state
- POST /api/qmoi/autodev/toggle
- POST /api/qmoi/autodev/research
- GET /api/qmoi/autodev/suggestions/improvements
- GET /api/qmoi/autodev/suggestions/optimizations
- GET /api/qmoi/autodev/suggestions/features
- POST /api/qmoi/autodev/generate-feature
- GET/POST /api/qmoi/evolution/track-evolution
- POST /api/qmoi/evolution/replace-model
- POST /api/qmoi/evolution/compare-models

#### SELF-WORK (3)
- POST /api/qmoi/self-work/code-review
- POST /api/qmoi/self-work/debug
- POST /api/qmoi/self-work/run-tests

#### SYSTEM (6)
- GET /api/consciousness/health
- GET /api/global
- POST /api/automation/trigger
- GET /api/qvs
- POST /api/preview/analyze
- POST /api/preview/execute-tool

#### AVATAR SYSTEM (6) - NEW
- GET /api/avatars/:userId
- POST /api/avatars/generate
- PUT /api/avatars/:userId/customize
- DELETE /api/avatars/:userId
- HEAD /api/avatars/:userId
- OPTIONS /api/avatars/:userId

---

### By Type

#### Authentication Endpoints (5)
- POST /api/auth/login
- POST /api/auth/webauthn/register/options
- POST /api/auth/webauthn/register/finish
- POST /api/auth/webauthn/auth/options
- POST /api/auth/webauthn/auth/finish

#### QMOI Core Endpoints (13)
- GET /api/qmoi/health
- GET /api/qmoi/health/stream
- POST /api/qmoi/execute
- POST /api/qmoi/suggestions
- GET/POST /api/qmoi/autodev/state
- POST /api/qmoi/autodev/toggle
- POST /api/qmoi/autodev/research
- GET /api/qmoi/autodev/suggestions/improvements
- GET /api/qmoi/autodev/suggestions/optimizations
- GET /api/qmoi/autodev/suggestions/features
- POST /api/qmoi/autodev/generate-feature
- GET/POST /api/qmoi/evolution/track-evolution
- POST /api/qmoi/evolution/replace-model
- POST /api/qmoi/evolution/compare-models

#### Development Endpoints (3)
- POST /api/qmoi/self-work/code-review
- POST /api/qmoi/self-work/debug
- POST /api/qmoi/self-work/run-tests

#### System Endpoints (6)
- GET /api/consciousness/health
- GET /api/global
- POST /api/automation/trigger
- GET /api/qvs
- POST /api/preview/analyze
- POST /api/preview/execute-tool

#### Avatar System Endpoints (6) - NEW
- GET /api/avatars/:userId
- POST /api/avatars/generate
- PUT /api/avatars/:userId/customize
- DELETE /api/avatars/:userId
- HEAD /api/avatars/:userId
- OPTIONS /api/avatars/:userId

---

## API Methods Reference

| # | Endpoint | Methods | Authentication | Description |
|---|----------|---------|---|---|
| 1 | `/api/auth/login` | POST | Public | Email/password login |
| 2 | `/api/auth/webauthn/register/options` | POST | Optional | WebAuthn registration setup |
| 3 | `/api/auth/webauthn/register/finish` | POST | Token | Complete WebAuthn registration |
| 4 | `/api/auth/webauthn/auth/options` | POST | Public | WebAuthn auth setup |
| 5 | `/api/auth/webauthn/auth/finish` | POST | Public | Complete WebAuthn authentication |
| 6 | `/api/qmoi/health` | GET | Token | System health check |
| 7 | `/api/qmoi/health/stream` | GET | Token | Real-time health stream (SSE) |
| 8 | `/api/qmoi/execute` | POST | Token | Execute QMOI action |
| 9 | `/api/qmoi/suggestions` | POST | Token | Get AI suggestions |
| 10 | `/api/qmoi/autodev/state` | GET, POST | Token | Get/set AutoDev state |
| 11 | `/api/qmoi/autodev/toggle` | POST | Token | Toggle AutoDev |
| 12 | `/api/qmoi/autodev/research` | POST | Token | Codebase research |
| 13 | `/api/qmoi/autodev/suggestions/improvements` | GET | Token | Code improvements |
| 14 | `/api/qmoi/autodev/suggestions/optimizations` | GET | Token | Performance optimizations |
| 15 | `/api/qmoi/autodev/suggestions/features` | GET | Token | Feature suggestions |
| 16 | `/api/qmoi/autodev/generate-feature` | POST | Token | Generate feature code |
| 17 | `/api/qmoi/evolution/track-evolution` | GET, POST | Token | Track evolution |
| 18 | `/api/qmoi/evolution/replace-model` | POST | Admin | Replace model |
| 19 | `/api/qmoi/evolution/compare-models` | POST | Token | Compare models |
| 20 | `/api/qmoi/self-work/code-review` | POST | Token | Code review |
| 21 | `/api/qmoi/self-work/debug` | POST | Token | Debug issues |
| 22 | `/api/qmoi/self-work/run-tests` | POST | Token | Run tests |
| 23 | `/api/consciousness/health` | GET | Token | Consciousness metrics |
| 24 | `/api/global` | GET | Optional | Global system status |
| 25 | `/api/automation/trigger` | POST | Token | Trigger automation |
| 26 | `/api/qvs` | GET | Optional | QVS info |
| 27 | `/api/preview/analyze` | POST | Optional | Analyze content |
| 28 | `/api/preview/execute-tool` | POST | Optional | Execute dev tool |
| 29 | `/api/avatars/:userId` | GET | Optional | Get avatar |
| 30 | `/api/avatars/generate` | POST | Optional | Generate avatar |
| 31 | `/api/avatars/:userId/customize` | PUT | Token | Customize avatar |
| 32 | `/api/avatars/:userId` | DELETE | Token | Delete avatar |
| 33 | `/api/avatars/:userId` | HEAD | Optional | Check cache |
| 34 | `/api/avatars/:userId` | OPTIONS | Public | Method availability |

---

## Authentication Matrix

| Endpoint | Public | Optional Auth | Bearer Token | Admin |
|----------|--------|---|---|---|
| `/api/auth/login` | ✅ | | | |
| `/api/auth/webauthn/*` | ✅✅ | ✅ | ✅ | |
| `/api/qmoi/health*` | | | ✅ | |
| `/api/qmoi/execute` | | | ✅ | |
| `/api/qmoi/suggestions` | | | ✅ | |
| `/api/qmoi/autodev/*` | | | ✅ | |
| `/api/qmoi/evolution/*` | | | ✅ | ✅ |
| `/api/qmoi/self-work/*` | | | ✅ | |
| `/api/consciousness/health` | | | ✅ | |
| `/api/global` | | ✅ | | |
| `/api/automation/trigger` | | | ✅ | |
| `/api/qvs` | | ✅ | | |
| `/api/preview/*` | | ✅ | | |
| `/api/avatars/*` | ✅ | ✅ | ✅ | |

---

## HTTP Methods Summary

### GET Endpoints (11)
- `/api/qmoi/health`
- `/api/qmoi/health/stream`
- `/api/qmoi/autodev/state`
- `/api/qmoi/autodev/suggestions/improvements`
- `/api/qmoi/autodev/suggestions/optimizations`
- `/api/qmoi/autodev/suggestions/features`
- `/api/qmoi/evolution/track-evolution`
- `/api/consciousness/health`
- `/api/global`
- `/api/qvs`
- `/api/avatars/:userId` (GET)

### POST Endpoints (18)
- `/api/auth/login`
- `/api/auth/webauthn/register/options`
- `/api/auth/webauthn/register/finish`
- `/api/auth/webauthn/auth/options`
- `/api/auth/webauthn/auth/finish`
- `/api/qmoi/execute`
- `/api/qmoi/suggestions`
- `/api/qmoi/autodev/state`
- `/api/qmoi/autodev/toggle`
- `/api/qmoi/autodev/research`
- `/api/qmoi/autodev/generate-feature`
- `/api/qmoi/evolution/track-evolution`
- `/api/qmoi/evolution/replace-model`
- `/api/qmoi/evolution/compare-models`
- `/api/qmoi/self-work/code-review`
- `/api/qmoi/self-work/debug`
- `/api/qmoi/self-work/run-tests`
- `/api/automation/trigger`
- `/api/preview/analyze`
- `/api/preview/execute-tool`
- `/api/avatars/generate`
- `/api/avatars/:userId` (POST)

### PUT Endpoints (1)
- `/api/avatars/:userId/customize`

### DELETE Endpoints (1)
- `/api/avatars/:userId`

### HEAD Endpoints (1)
- `/api/avatars/:userId`

### OPTIONS Endpoints (1)
- `/api/avatars/:userId`

---

## Response Status Codes

| Code | Meaning | Common Causes |
|------|---------|---|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server issue |
| 503 | Unavailable | Service maintenance |

---

## Rate Limiting

| User Type | Limit | Window | Headers |
|---|---|---|---|
| Authenticated Users | 100 req | Per minute | X-RateLimit-* |
| Public Users | 10 req | Per minute | X-RateLimit-* |
| Admin Users | 1000 req | Per minute | X-RateLimit-* |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total Endpoints** | **34** |
| **Authentication Routes** | 5 |
| **QMOI Core Routes** | 13 |
| **Self-Work Routes** | 3 |
| **System Routes** | 6 |
| **Avatar System Routes** | 6 |
| **GET Endpoints** | 11 |
| **POST Endpoints** | 18 |
| **PUT Endpoints** | 1 |
| **DELETE Endpoints** | 1 |
| **HEAD Endpoints** | 1 |
| **OPTIONS Endpoints** | 1 |
| **Public Endpoints** | 6 |
| **Optional Auth Endpoints** | 8 |
| **Bearer Token Endpoints** | 19 |
| **Admin Endpoints** | 1 |

---

**Status**: ✅ All 34 Endpoints Production Ready
**Last Updated**: 2026-03-29T03:54:00Z
**Framework**: Next.js 20+
**Coverage**: 100%

