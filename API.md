<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T03:50:00.000000Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Complete API Reference

**Last Updated**: 2026-03-29T03:50:00Z
**Total Endpoints**: 34 (28 QMOI + 6 Avatar System)
**Production Status**: ✅ Ready for Production
**Framework**: Next.js 20+ (App Router)

## API Overview

Complete reference of all QMOI AI API endpoints, organized by domain and functionality. All endpoints are production-ready with full error handling, authentication verification, and security measures.

## Table of Contents

1. [Authentication Routes](#authentication-routes) (5)
2. [QMOI Core Routes](#qmoi-core-routes) (13)
3. [QMOI Self-Work Routes](#qmoi-self-work-routes) (3)
4. [System Routes](#system-routes) (6)
5. [Preview & Tools Routes](#preview--tools-routes) (2)
6. [Avatar System Routes](#avatar-system-routes-new) (6)
7. [Authentication Levels](#authentication-levels)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication Routes (5 endpoints)

### 1. POST /api/auth/login
- **Description**: Email/Password traditional login with QMOI consciousness integration
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password_hash": "sha256_hash",
    "consciousness_sync": true,
    "timestamp": "2026-03-29T03:15:00Z"
  }
  ```
- **Response**: Session token, user info, MFA status
- **Status Code**: 200 OK / 401 Unauthorized / 429 Too Many Requests
- **File**: [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)

### 2. POST /api/auth/webauthn/register/options
- **Description**: Get WebAuthn registration options for biometric/hardware key registration
- **Authentication**: Optional (Bearer token)
- **Response**: Challenge, timeout, user info for WebAuthn flow
- **Status Code**: 200 OK / 401 Unauthorized
- **File**: [src/app/api/auth/webauthn/register/options/route.ts](src/app/api/auth/webauthn/register/options/route.ts)

### 3. POST /api/auth/webauthn/register/finish
- **Description**: Complete WebAuthn biometric/hardware key registration
- **Authentication**: Bearer token required
- **Request Body**: Registration attestation response from authenticator
- **Response**: Registration confirmation, credential ID
- **Status Code**: 200 OK / 400 Bad Request / 401 Unauthorized
- **File**: [src/app/api/auth/webauthn/register/finish/route.ts](src/app/api/auth/webauthn/register/finish/route.ts)

### 4. POST /api/auth/webauthn/auth/options
- **Description**: Get WebAuthn authentication options for biometric/hardware key login
- **Authentication**: None (Public)
- **Response**: Challenge, timeout, credentials list available
- **Status Code**: 200 OK / 429 Too Many Requests
- **File**: [src/app/api/auth/webauthn/auth/options/route.ts](src/app/api/auth/webauthn/auth/options/route.ts)

### 5. POST /api/auth/webauthn/auth/finish
- **Description**: Complete WebAuthn biometric/hardware key authentication
- **Authentication**: None (Public)
- **Request Body**: Authentication assertion response from authenticator
- **Response**: Session token, user info
- **Status Code**: 200 OK / 400 Bad Request / 401 Unauthorized
- **File**: [src/app/api/auth/webauthn/auth/finish/route.ts](src/app/api/auth/webauthn/auth/finish/route.ts)

---

## 🧠 QMOI Core Routes (13 endpoints)

### 6. GET /api/qmoi/health
- **Description**: Get QMOI health status, consciousness pulse, and system metrics
- **Authentication**: Bearer token required
- **Response**: Health data, pulse metrics, consciousness state
- **Cache**: 10 seconds
- **File**: [src/app/api/qmoi/health/route.ts](src/app/api/qmoi/health/route.ts)

### 7. GET /api/qmoi/health/stream
- **Description**: Real-time streaming health metrics via Server-Sent Events
- **Authentication**: Bearer token required
- **Response**: Continuous health stream, metrics updates
- **Type**: Server-Sent Events (text/event-stream)
- **File**: [src/app/api/qmoi/health/stream/route.ts](src/app/api/qmoi/health/stream/route.ts)

### 8. POST /api/qmoi/execute
- **Description**: Execute QMOI actions with consciousness validation
- **Authentication**: Bearer token required
- **Request Body**: Action payload, parameters, execution context
- **Response**: Execution result, consciousness decision log
- **Timeout**: 30 seconds
- **File**: [src/app/api/qmoi/execute/route.ts](src/app/api/qmoi/execute/route.ts)

### 9. POST /api/qmoi/suggestions
- **Description**: Get AI-powered suggestions for system improvements
- **Authentication**: Bearer token required
- **Request Body**: Context, action type, parameters
- **Response**: Suggestions array with scoring and priority
- **File**: [src/app/api/qmoi/suggestions/route.ts](src/app/api/qmoi/suggestions/route.ts)

### 10. GET/POST /api/qmoi/autodev/state
- **Description**: Get/set AutoDev state and configuration
- **Authentication**: Bearer token required
- **Methods**: GET (retrieve), POST (set)
- **Response**: AutoDev enabled status, timestamp, state config
- **File**: [src/app/api/qmoi/autodev/state/route.ts](src/app/api/qmoi/autodev/state/route.ts)

### 11. POST /api/qmoi/autodev/toggle
- **Description**: Toggle AutoDev automation on/off
- **Authentication**: Bearer token required
- **Request Body**: Toggle state (true/false)
- **Response**: New AutoDev state, toggle timestamp
- **File**: [src/app/api/qmoi/autodev/toggle/route.ts](src/app/api/qmoi/autodev/toggle/route.ts)

### 12. POST /api/qmoi/autodev/research
- **Description**: AutoDev research endpoint for codebase analysis
- **Authentication**: Bearer token required
- **Request Body**: Query, scope, depth level
- **Response**: Research findings, recommendations, code snippets
- **File**: [src/app/api/qmoi/autodev/research/route.ts](src/app/api/qmoi/autodev/research/route.ts)

### 13. GET /api/qmoi/autodev/suggestions/improvements
- **Description**: Get code improvement suggestions from AutoDev
- **Authentication**: Bearer token required
- **Query Params**: `category`, `priority`, `limit`
- **Response**: Improvements list with priority levels and metrics
- **File**: [src/app/api/qmoi/autodev/suggestions/improvements/route.ts](src/app/api/qmoi/autodev/suggestions/improvements/route.ts)

### 14. GET /api/qmoi/autodev/suggestions/optimizations
- **Description**: Get performance optimization suggestions
- **Authentication**: Bearer token required
- **Query Params**: `threshold`, `limit`
- **Response**: Optimizations list with performance impact metrics
- **File**: [src/app/api/qmoi/autodev/suggestions/optimizations/route.ts](src/app/api/qmoi/autodev/suggestions/optimizations/route.ts)

### 15. GET /api/qmoi/autodev/suggestions/features
- **Description**: Get feature development suggestions
- **Authentication**: Bearer token required
- **Query Params**: `type`, `limit`
- **Response**: Features array with implementation estimates
- **File**: [src/app/api/qmoi/autodev/suggestions/features/route.ts](src/app/api/qmoi/autodev/suggestions/features/route.ts)

### 16. POST /api/qmoi/autodev/generate-feature
- **Description**: Generate feature code automatically
- **Authentication**: Bearer token required
- **Request Body**: Feature specification, requirements, constraints
- **Response**: Generated code, tests, documentation
- **Timeout**: 60 seconds
- **File**: [src/app/api/qmoi/autodev/generate-feature/route.ts](src/app/api/qmoi/autodev/generate-feature/route.ts)

### 17. GET/POST /api/qmoi/evolution/track-evolution
- **Description**: Track QMOI evolution cycles and improvements
- **Authentication**: Bearer token required
- **Methods**: GET (retrieve history), POST (start new cycle)
- **Response**: Evolution history, improvements applied, metrics
- **File**: [src/app/api/qmoi/evolution/track-evolution/route.ts](src/app/api/qmoi/evolution/track-evolution/route.ts)

### 18. POST /api/qmoi/evolution/replace-model
- **Description**: Replace current model with evolved version
- **Authentication**: Bearer token + Admin role required
- **Request Body**: New model config, version, rollback strategy
- **Response**: Replacement status, rollback info, timeline
- **File**: [src/app/api/qmoi/evolution/replace-model/route.ts](src/app/api/qmoi/evolution/replace-model/route.ts)

### 19. POST /api/qmoi/evolution/compare-models
- **Description**: Compare current and evolved models for performance
- **Authentication**: Bearer token required
- **Request Body**: Model A, Model B configs, test scenarios
- **Response**: Comparison metrics, recommendation, detailed analysis
- **File**: [src/app/api/qmoi/evolution/compare-models/route.ts](src/app/api/qmoi/evolution/compare-models/route.ts)

---

## 🛠️ QMOI Self-Work Routes (3 endpoints)

### 20. POST /api/qmoi/self-work/code-review
- **Description**: Perform code review and quality analysis
- **Authentication**: Bearer token required
- **Request Body**: Code, files, scope, review level
- **Response**: Review findings, suggestions, quality score
- **File**: [src/app/api/qmoi/self-work/code-review/route.ts](src/app/api/qmoi/self-work/code-review/route.ts)

### 21. POST /api/qmoi/self-work/debug
- **Description**: Debug and troubleshoot issues
- **Authentication**: Bearer token required
- **Request Body**: Error stack, logs, context, expected behavior
- **Response**: Root cause analysis, fixes, recommendations
- **File**: [src/app/api/qmoi/self-work/debug/route.ts](src/app/api/qmoi/self-work/debug/route.ts)

### 22. POST /api/qmoi/self-work/run-tests
- **Description**: Execute and manage tests
- **Authentication**: Bearer token required
- **Request Body**: Test files, test config, coverage requirements
- **Response**: Test results, coverage report, failures details
- **File**: [src/app/api/qmoi/self-work/run-tests/route.ts](src/app/api/qmoi/self-work/run-tests/route.ts)

---

## 🌐 System Routes (6 endpoints)

### 23. GET /api/consciousness/health
- **Description**: Get QMOI consciousness health and awareness metrics
- **Authentication**: Bearer token required
- **Response**: Consciousness state, awareness level, sync status
- **File**: [src/app/api/consciousness/health/route.ts](src/app/api/consciousness/health/route.ts)

### 24. GET /api/global
- **Description**: Get global system status and configuration
- **Authentication**: Optional (Bearer token)
- **Response**: System info, versions, config summary, uptime
- **Cache**: 30 seconds
- **File**: [src/app/api/global/route.ts](src/app/api/global/route.ts)

### 25. POST /api/automation/trigger
- **Description**: Trigger automated workflows and actions
- **Authentication**: Bearer token required
- **Request Body**: Workflow name, parameters, triggers, schedule
- **Response**: Automation execution status, job ID
- **File**: [src/app/api/automation/trigger/route.ts](src/app/api/automation/trigger/route.ts)

### 26. GET /api/qvs
- **Description**: Get Quantum Vue System (QVS) information
- **Authentication**: Optional
- **Query Params**: `detail`, `modules`
- **Response**: QVS version, modules, configuration, status
- **File**: [src/app/api/qvs/route.ts](src/app/api/qvs/route.ts)

---

## 🔍 Preview & Tools Routes (2 endpoints)

### 27. POST /api/preview/analyze
- **Description**: Analyze code/content for preview
- **Authentication**: Bearer token optional
- **Request Body**: Content to analyze, analysis type, depth
- **Response**: Analysis results, metrics, recommendations
- **File**: [src/app/api/preview/analyze/route.ts](src/app/api/preview/analyze/route.ts)

### 28. POST /api/preview/execute-tool
- **Description**: Execute development tools for preview
- **Authentication**: Bearer token optional
- **Request Body**: Tool name, parameters, constraints
- **Response**: Tool output, results, execution stats
- **File**: [src/app/api/preview/execute-tool/route.ts](src/app/api/preview/execute-tool/route.ts)

---

## 🎨 Avatar System Routes (NEW - 6 endpoints)

### 29. GET /api/avatars/:userId  
- **Description**: Retrieve user avatar with customizable size and style
- **Authentication**: Optional (Bearer token)
- **Query Parameters**:
  - `size`: Avatar size - 'sm' (48), 'md' (128), 'lg' (256), 'xl' (512)
  - `style`: Avatar style - 'professional', 'creative', 'minimal', 'tech'
  - `name`: Optional user name for initials display
  - `email`: Optional email for gravatar fallback
- **Response**: Avatar SVG data, cache metadata, format info
- **Status Codes**: 200 OK / 404 Not Found / 400 Bad Request
- **Cache-Control**: public, max-age=31536000 (1 year)
- **File**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)

### 30. POST /api/avatars/generate
- **Description**: Generate new avatar with custom configuration
- **Authentication**: Bearer token optional
- **Request Body**:
  ```json
  {
    "userId": "user-123",
    "name": "John Doe",
    "style": "professional",
    "colors": ["#667eea", "#764ba2"],
    "size": "lg"
  }
  ```
- **Response**: Generated avatar SVG, URL, metadata
- **Status Codes**: 201 Created / 400 Bad Request
- **Timeout**: 5 seconds
- **File**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)

### 31. PUT /api/avatars/:userId/customize
- **Description**: Customize existing avatar settings
- **Authentication**: Bearer token required
- **Request Body**: Style preferences, colors, display options
- **Response**: Updated avatar configuration, preview
- **Status Codes**: 200 OK / 404 Not Found / 400 Bad Request
- **File**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)

### 32. DELETE /api/avatars/:userId
- **Description**: Remove/invalidate avatar cache
- **Authentication**: Bearer token required  
- **Response**: Deletion confirmation, cache cleared
- **Status Codes**: 204 No Content / 404 Not Found / 403 Forbidden
- **File**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)

### 33. HEAD /api/avatars/:userId
- **Description**: Check avatar cache status without downloading content
- **Authentication**: Optional (Bearer token)
- **Response**: Cache headers, ETag, Last-Modified
- **Status Codes**: 200 OK / 404 Not Found
- **Cache-Control**: public, max-age=31536000
- **File**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)

### 34. OPTIONS /api/avatars/:userId
- **Description**: Retrieve CORS and method availability information
- **Authentication**: None (Public)
- **Response**: Allowed methods, CORS headers, capability info
- **Status Codes**: 200 OK
- **File**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)

---

## 🔐 Authentication Levels

### Public Endpoints (No Authentication Required)
| Endpoint | Count |
|----------|-------|
| WebAuthn register/auth options & finish | 4 |
| Avatar OPTIONS, retrieve (public) | 2 |
| **Total** | **6** |

### Authenticated Endpoints (Bearer Token Required)
| Category | Count |
|----------|-------|
| Authentication | 1 |
| QMOI Core | 13 |
| Self-Work | 3 |
| System | 5+ |
| Avatar System (private) | 3 |
| **Total** | **25+** |

### Admin-Only Endpoints
- POST /api/qmoi/evolution/replace-model

### Optional Authentication
- GET /api/auth/webauthn/register/options
- GET /api/global
- GET /api/preview/analyze, /api/preview/execute-tool
- Avatar endpoints (public read, authenticated write)

---

## 📊 Authentication Header Format

All authenticated endpoints require:

```
Authorization: Bearer <jwt_token>
```

Token payload includes:
- User ID
- Role (user, admin)
- Permissions
- Issue timestamp
- Expiration (24 hours default)

---

## ❌ Error Handling

### Standard Error Response Format

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2026-03-29T03:50:00Z",
  "path": "/api/endpoint",
  "details": {
    "field": "error details"
  }
}
```

### Common Error Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid parameters or request body |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side issue |
| 503 | Service Unavailable | Maintenance or downtime |

---

## ⏱️ Rate Limiting

All endpoints implement rate limiting:

| User Type | Limit | Window |
|-----------|-------|--------|
| Authenticated | 100 requests | Per minute |
| Public | 10 requests | Per minute |
| Admin | 1000 requests | Per minute |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1648555800
```

---

## 🔄 Common Query Parameters

### Pagination (where applicable)
- `limit`: Items per page (default: 20, max: 100)
- `offset`: Starting position (default: 0)
- `page`: Page number (alternative to offset)

### Filtering
- `filter`: JSON filter object
- `search`: Free-text search
- `sort`: Sort field and direction (e.g., '-date', '+name')

### Timestamps
- `dateFrom`: ISO 8601 start date
- `dateTo`: ISO 8601 end date
- `relative`: Relative time (e.g., '24h', '7d', '30d')

---

## 📋 Response Headers

All API responses include:

```
Content-Type: application/json
Cache-Control: <caching directive>
ETag: <response hash>
Last-Modified: <last update timestamp>
X-Request-ID: <unique request identifier>
X-Response-Time: <milliseconds>
```

---

## ✅ Endpoint Status Summary

| Category | Total | Public | Authenticated | Admin |
|----------|-------|--------|---|---|
| Authentication | 5 | 2 | 3 | 0 |
| QMOI Core | 13 | 0 | 13 | 0 |
| Self-Work | 3 | 0 | 3 | 0 |
| System | 6 | 1 | 4 | 1 |
| Preview/Tools | 2 | 1 | 1 | 0 |
| Avatar System | 6 | 2 | 3 | 0 |
| **TOTAL** | **34** | **6** | **27** | **1** |

---

## 🚀 Production Deployment Checklist

- ✅ All endpoints implement error handling
- ✅ Authentication verified on protected routes
- ✅ Rate limiting and throttling enabled
- ✅ CORS configured for multi-domain access
- ✅ Request/response validation active
- ✅ Real-time monitoring operational
- ✅ Logging and audit trail enabled
- ✅ Security headers implemented
- ✅ Caching strategy optimized
- ✅ Load testing completed

---

**Production Ready**: ✅ March 29, 2026
**Framework**: Next.js 20+ (App Router)
**Total Endpoints**: 34
**Coverage**: 100% documented
- **Path**: `/api/qmoi/payload.ts`
- **Status**: ✅ Active

#### qmoi/status.ts
- **Path**: `/api/qmoi/status.ts`
- **Status**: ✅ Active

## API Standards

All endpoints follow these conventions:
- **Base URL**: `https://api.qmoi.ai/api` or `http://localhost:3000/api`
- **Authentication**: Bearer token in Authorization header
- **Response Format**: JSON
- **Error Handling**: Standardized error responses with HTTP status codes
- **Rate Limiting**: API rate limits per endpoint documented

## Security

- All endpoints require authentication except where explicitly noted
- CORS enabled for web applications
- Request validation on all inputs
- Rate limiting enabled to prevent abuse
- IP whitelisting available for enterprise clients

