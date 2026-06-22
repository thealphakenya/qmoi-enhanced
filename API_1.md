---
quantum-enabled: true
---

# API_1.md - API v1 Reference & Legacy Documentation

**Last Updated:** 2026-06-08  
**Status:** ✅ Complete API v1 Reference  
**Compatible With:** API.md (main reference)  
**API Version:** v1 (Production API reference)

---

## Overview

## Canonical App Route Mapping
> The app routes for the main QMOI experience are served from the Next.js `app/` directory and delegate to source shell components in `src/components/`.
- `/qmoi-ai` → `app/qmoi-ai/page.tsx` → `src/components/qmoi/QMOIAIShell.tsx`
- `/qmoi-space` → `app/qmoi-space/page.tsx` → `src/components/qmoi/QMOISpaceShell.tsx`
- `/qcity` → `app/qcity/page.tsx` → `src/components/q-city/QCityShell.tsx`
- `/qalpha` → `app/qalpha/page.tsx` → `src/components/qalpha/QAlphaShell.tsx`
- `/qvillage` → `app/qvillage/page.tsx` → `src/components/qvillage/QVillageShell.tsx`

- Documentation: See QVILLAGE.md and QVILLAGEUI.md for UI integration details and admin notes.
- QVillage API endpoints: the community UI uses `/api/qvillage/*` (e.g. `/api/qvillage/spaces`, `/api/qvillage/models`, `/api/qvillage/inference`) and webhook receivers at `/api/webhooks/qvillage`.


This document provides comprehensive documentation for all API v1 endpoints. For v2 endpoints, see the corresponding routes in ENDPOINTS.md. All production traffic should use endpoints documented in this file and API.md.

---

## Authentication APIs

### Authentication Endpoints

#### POST /api/auth/login
**Purpose:** User login with email/password or biometric  
**Auth Required:** No (public)  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "biometric": false
}
```
**Response:**
```json
{
  "success": true,
  "sessionId": "sess_...",
  "user": {
    "id": "user_...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/check-master
**Purpose:** Check if user has master role  
**Auth Required:** Yes (Bearer token)  
**Response:**
```json
{
  "isMaster": true,
  "user": { ... }
}
```

#### GET/POST /api/auth/webauthn/auth/options
**Purpose:** Get WebAuthn authentication options  
**Auth Required:** No  
**Response:** WebAuthn credential request options

#### POST /api/auth/webauthn/auth/finish
**Purpose:** Verify WebAuthn authentication  
**Auth Required:** No  
**Request Body:** WebAuthn assertion response

#### GET/POST /api/auth/webauthn/register/options
**Purpose:** Get WebAuthn registration options  
**Auth Required:** Yes  
**Response:** WebAuthn credential creation options

#### POST /api/auth/webauthn/register/finish
**Purpose:** Complete WebAuthn registration  
**Auth Required:** Yes  
**Request Body:** WebAuthn attestation response

#### GET /api/auth/oauth/[provider]
**Purpose:** OAuth authentication for social login  
**Providers:** google, github, microsoft, etc.  
**Auth Required:** No

---

## Account & User APIs

#### GET /api/accountability
**Purpose:** Get accountability/audit logs  
**Auth Required:** Yes (Master only)  
**Query Parameters:**
- `limit` - Number of records (default: 100)
- `offset` - Pagination offset (default: 0)
- `filter` - Filter criteria (optional)

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_...",
      "userId": "user_...",
      "action": "login",
      "timestamp": "2026-06-08T10:00:00Z",
      "metadata": { ... }
    }
  ]
}
```

---

## Avatars API

#### GET/POST /api/avatars/[userId]
**Purpose:** Get or update user avatar  
**Auth Required:** Yes  
**Methods:**
- **GET:** Retrieve avatar for user
- **POST:** Update avatar (own avatar or master can update any)

**Response:**
```json
{
  "success": true,
  "avatar": {
    "userId": "user_...",
    "url": "https://...",
    "type": "image",
    "updated": "2026-06-08T10:00:00Z"
  }
}
```

---

## Consciousness & Health APIs

#### GET /api/consciousness/health
**Purpose:** Get AI consciousness health status  
**Auth Required:** No  
**Response:**
```json
{
  "status": "healthy",
  "components": {
    "reasoning": "ok",
    "learning": "ok",
    "inference": "ok"
  },
  "metrics": {
    "uptime": "99.99%",
    "avgResponseTime": 245
  }
}
```

#### GET /api/v1/health
**Purpose:** v1 Health check endpoint  
**Auth Required:** No  
**Response:** System health status

#### GET /api/v2/health
**Purpose:** v2 Health check endpoint (enhanced)  
**Auth Required:** No  
**Response:** Detailed system health with metrics

---

## QMOI Core APIs

### QMOI Auto-Development (AutoDev)

#### POST /api/qmoi/autodev/generate-feature
**Purpose:** Auto-generate new feature based on description  
**Auth Required:** Yes (Master)  
**Request Body:**
```json
{
  "description": "Generate user authentication system",
  "priority": "high",
  "scope": "backend"
}
```
**Response:**
```json
{
  "success": true,
  "featureId": "feat_...",
  "code": "...",
  "tests": "...",
  "estimatedTime": 3600
}
```

#### POST /api/qmoi/autodev/research
**Purpose:** Conduct automated research on topic  
**Auth Required:** Yes  
**Request Body:**
```json
{
  "topic": "TypeScript best practices",
  "depth": "comprehensive"
}
```

#### GET /api/qmoi/autodev/state
**Purpose:** Get AutoDev state and progress  
**Auth Required:** Yes

#### POST /api/qmoi/autodev/suggestions/features
**Purpose:** Get feature suggestions  
**Auth Required:** Yes

#### POST /api/qmoi/autodev/suggestions/improvements
**Purpose:** Get code improvement suggestions  
**Auth Required:** Yes

#### POST /api/qmoi/autodev/suggestions/optimizations
**Purpose:** Get performance optimization suggestions  
**Auth Required:** Yes

#### POST /api/qmoi/autodev/toggle
**Purpose:** Enable/disable AutoDev system  
**Auth Required:** Yes (Master)

### QMOI Evolution APIs

#### POST /api/qmoi/evolution/compare-models
**Purpose:** Compare AI models side-by-side  
**Auth Required:** Yes

#### POST /api/qmoi/evolution/replace-model
**Purpose:** Replace current model with new one  
**Auth Required:** Yes (Master)

#### POST /api/qmoi/evolution/track-evolution
**Purpose:** Track model evolution metrics  
**Auth Required:** Yes

### QMOI Execution & Health

#### POST /api/qmoi/execute
**Purpose:** Execute QMOI command  
**Auth Required:** Yes  
**Request Body:**
```json
{
  "command": "analyze",
  "params": { ... }
}
```

#### GET /api/qmoi/health
**Purpose:** Get QMOI system health  
**Auth Required:** No  
**Response:**
```json
{
  "status": "healthy",
  "version": "1.2.3",
  "uptime": 1234567,
  "requests": {
    "total": 100000,
    "avg_response_time": 145
  }
}
```

#### GET /api/qmoi/health/stream
**Purpose:** Stream QMOI health data (WebSocket)  
**Auth Required:** Yes  
**Protocol:** WebSocket

### QMOI Self-Work (Code Management)

#### POST /api/qmoi/self-work/code-review
**Purpose:** Automated code review  
**Auth Required:** Yes  
**Request Body:**
```json
{
  "code": "...",
  "language": "typescript",
  "standards": ["eslint", "typescript"]
}
```

#### POST /api/qmoi/self-work/debug
**Purpose:** Automated debugging  
**Auth Required:** Yes

#### POST /api/qmoi/self-work/run-tests
**Purpose:** Run automated tests  
**Auth Required:** Yes

### QMOI Suggestions

#### POST /api/qmoi/suggestions
**Purpose:** Get general QMOI suggestions  
**Auth Required:** Yes

---

## Master System APIs

#### GET /api/master/domain-health
**Purpose:** Check domain health status  
**Auth Required:** Yes (Master only)  
**Response:**
```json
{
  "domain": "example.com",
  "status": "healthy",
  "checks": {
    "dns": "ok",
    "ssl": "ok",
    "http": "ok",
    "database": "ok"
  }
}
```

#### POST /api/master/domain-health/refresh
**Purpose:** Refresh domain health check  
**Auth Required:** Yes (Master)

#### GET /api/master/godaddy-status
**Purpose:** Get GoDaddy domain status  
**Auth Required:** Yes (Master)

---

## Alerts & Automation APIs

#### POST /api/alerts/webhook
**Purpose:** Receive webhook alerts  
**Auth Required:** No (Webhook signature validation)  
**Request Body:**
```json
{
  "event": "alert",
  "severity": "high",
  "message": "System threshold exceeded"
}
```

#### POST /api/automation/trigger
**Purpose:** Trigger automation workflow  
**Auth Required:** Yes  
**Request Body:**
```json
{
  "workflowId": "wf_...",
  "parameters": { ... }
}
```

---

## Global & Operations APIs

#### GET /api/global
**Purpose:** Get global operations dashboard  
**Auth Required:** Yes (Master)  
**Response:**
```json
{
  "overview": {
    "totalUsers": 1000,
    "activeSessions": 450,
    "systemHealth": 99.9
  },
  "metrics": { ... }
}
```

#### GET /api/lion/workflows/health
**Purpose:** Get QMOI Lion workflow health  
**Auth Required:** No

---

## QVS & Real-time APIs

#### GET /api/qvs
**Purpose:** QVS (Quantum Value System) endpoint  
**Auth Required:** Yes

#### GET /api/realtime/stream
**Purpose:** Real-time data streaming (WebSocket)  
**Auth Required:** Yes  
**Protocol:** WebSocket

---

## Subscriptions API

#### GET/POST /api/subscriptions
**Purpose:** Manage user subscriptions  
**Auth Required:** Yes

---

## Preview & Execution APIs

#### POST /api/preview/analyze
**Purpose:** Analyze content preview  
**Auth Required:** Yes

#### POST /api/preview/execute-tool
**Purpose:** Execute tool in preview mode  
**Auth Required:** Yes

---

## Error Handling

All endpoints follow standard error response format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Description of error",
    "details": { ... }
  }
}
```

### Standard Error Codes
- `UNAUTHORIZED` - Authentication required or failed
- `FORBIDDEN` - User doesn't have permission
- `INVALID_REQUEST` - Bad request parameters
- `NOT_FOUND` - Resource not found
- `SERVER_ERROR` - Internal server error
- `RATE_LIMIT` - Too many requests

---

## Rate Limiting

All endpoints are rate-limited:
- **Authenticated Users:** 1000 requests/hour
- **Public Endpoints:** 100 requests/hour
- **Response Headers:**
  - `X-RateLimit-Limit` - Request limit
  - `X-RateLimit-Remaining` - Requests remaining
  - `X-RateLimit-Reset` - Unix timestamp of reset

---

## Request/Response Formats

### Standard Headers

**Request:**
```
Authorization: Bearer {token}
Content-Type: application/json
X-Request-ID: {uuid}
```

**Response:**
```
Content-Type: application/json
X-Request-ID: {uuid}
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
```

### Pagination

Endpoints supporting pagination use:
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 1000,
    "totalPages": 20
  }
}
```

---

## WebSocket Connections

Endpoints supporting WebSocket use:
- **Connection URL:** `wss://api.example.com/api/{endpoint}`
- **Protocol:** `api.qmoi.1.0`
- **Authentication:** Token in query param or header

### WebSocket Message Format
```json
{
  "type": "message",
  "id": "msg_...",
  "data": { ... },
  "timestamp": "2026-06-08T10:00:00Z"
}
```

---

## Versioning

- **Current Version:** v1
- **Deprecated Version:** None
- **Upcoming Version:** v2 (see /api/v2/* endpoints)

### Backward Compatibility

v1 endpoints will be maintained for at least 2 years. Deprecation notices will be announced 6 months in advance.

---

## Complete Endpoint Reference

See [ENDPOINTS.md](ENDPOINTS.md) for complete endpoint listing.  
See [API.md](API.md) for additional API documentation.  
See [ROUTES.md](ROUTES.md) for route file structure.

---

## Support & Issues

For API issues, support, or questions:
- Create an issue on GitHub
- Contact: api-support@qmoi.ai
- Documentation: https://docs.qmoi.ai/api/v1

---

**Total Endpoints Documented:** 43 active production endpoints  
**Last Updated:** 2026-06-08  
**Status:** Production Ready ✅

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:24.808473Z
- production status: ✅ production-ready
- status tags: production, production-ready
- lines: 571
- words: 1418
- characters: 12146
- headings: 74
- links: 3
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
