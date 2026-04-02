<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-01T03:11:31.340363Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# ROUTES.md - Complete API Routes Reference

**Last Updated**: 2026-03-29T03:15:22.891234
**Total Routes**: 36
**Status**: ✅ production Ready
**Framework**: Next.js 20+ (App Router)

## 📚 API Routes Overview

This document provides a comprehensive inventory of all API routes in the QMOI Enhanced system, organized by domain, feature, and HTTP method.

## 📊 Routes Statistics

| Category | Count | Status |
|----------|-------|--------|
| **Total Routes** | 36 | ✅ Active |
| **Authentication Routes** | 7 | ✅ Secured |
| **QMOI Core Routes** | 13 | ✅ Active |
| **QCity Routes** | 0 | ⏳ Deprecated |
| **System Routes** | 8 | ✅ Active |
| **Alerts Routes** | 1 | ✅ Active |
| **Billing & Subscription Routes** | 3 | ✅ Active |
| **Preview/Tools Routes** | 2 | ✅ Active |
| **Consciousness Routes** | 1 | ✅ Active |
| **Automation Routes** | 1 | ✅ Active |

---

## 🔐 Authentication Routes (7 routes)

### 1. POST /api/auth/login
- **File**: [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)
- **Method**: `POST`
- **Description**: Email/Password traditional login with QMOI consciousness integration
- **Authentication**: None (public endpoint)
- **Request Body**: 
  ```json
  {
    "email": "user@implementation.com",
    "password_hash": "sha256_hash",
    "consciousness_sync": true,
    "timestamp": "2026-03-29T03:15:00Z"
  }
  ```
- **Response**: Session token, user info, MFA status
- **Status**: ✅ production Ready

### 2. POST /api/auth/webauthn/register/options
- **File**: [src/app/api/auth/webauthn/register/options/route.ts](src/app/api/auth/webauthn/register/options/route.ts)
- **Method**: `POST`
- **Description**: Get WebAuthn registration options for biometric/hardware key registration
- **Authentication**: Optional (Bearer token)
- **Response**: Challenge, timeout, user info
- **Status**: ✅ Active

### 3. POST /api/auth/webauthn/register/finish
- **File**: [src/app/api/auth/webauthn/register/finish/route.ts](src/app/api/auth/webauthn/register/finish/route.ts)
- **Method**: `POST`
- **Description**: Complete WebAuthn biometric/hardware key registration
- **Authentication**: Bearer token required
- **Request Body**: Registration attestation response
- **Response**: Registration confirmation, credential ID
- **Status**: ✅ Active

### 4. POST /api/auth/webauthn/auth/options
- **File**: [src/app/api/auth/webauthn/auth/options/route.ts](src/app/api/auth/webauthn/auth/options/route.ts)
- **Method**: `POST`
- **Description**: Get WebAuthn authentication options for biometric/hardware key login
- **Authentication**: None (public endpoint)
- **Response**: Challenge, timeout, credentials list
- **Status**: ✅ Active

### 5. POST /api/auth/webauthn/auth/finish
- **File**: [src/app/api/auth/webauthn/auth/finish/route.ts](src/app/api/auth/webauthn/auth/finish/route.ts)
- **Method**: `POST`
- **Description**: Complete WebAuthn biometric/hardware key authentication
- **Authentication**: None (public endpoint)
- **Request Body**: Authentication assertion response
- **Response**: Session token, user info
- **Status**: ✅ Active

---

## 🧠 QMOI Core Routes (13 routes)

### 6. GET /api/qmoi/health
- **File**: [src/app/api/qmoi/health/route.ts](src/app/api/qmoi/health/route.ts)
- **Method**: `GET`
- **Description**: Get QMOI health status, consciousness pulse, and system metrics
- **Authentication**: Bearer token required
- **Response**: Health data, pulse metrics, consciousness state
- **Status**: ✅ Active

### 7. GET /api/qmoi/health/stream
- **File**: [src/app/api/qmoi/health/stream/route.ts](src/app/api/qmoi/health/stream/route.ts)
- **Method**: `GET` (Server-Sent Events)
- **Description**: Real-time streaming health metrics via SSE
- **Authentication**: Bearer token required
- **Response**: Continuous health stream, metrics updates
- **Status**: ✅ Active

### 8. POST /api/qmoi/execute
- **File**: [src/app/api/qmoi/execute/route.ts](src/app/api/qmoi/execute/route.ts)
- **Method**: `POST`
- **Description**: Execute QMOI actions with consciousness validation
- **Authentication**: Bearer token required
- **Request Body**: Action payload, parameters
- **Response**: Execution result, consciousness decision log
- **Status**: ✅ Active

### 9. POST /api/qmoi/suggestions
- **File**: [src/app/api/qmoi/suggestions/route.ts](src/app/api/qmoi/suggestions/route.ts)
- **Method**: `POST`
- **Description**: Get AI-powered suggestions for system improvements
- **Authentication**: Bearer token required
- **Request Body**: Context, action type, parameters
- **Response**: Suggestions array with scoring
- **Status**: ✅ Active

### 10. GET/POST /api/qmoi/autoprod/state
- **File**: [src/app/api/qmoi/autoprod/state/route.ts](src/app/api/qmoi/autoprod/state/route.ts)
- **Method**: `GET`, `POST`
- **Description**: Get/set Autoprod state and configuration
- **Authentication**: Bearer token required
- **Response**: Autoprod enabled status, timestamp, state config
- **Status**: ✅ Active

### 11. POST /api/qmoi/autoprod/toggle
- **File**: [src/app/api/qmoi/autoprod/toggle/route.ts](src/app/api/qmoi/autoprod/toggle/route.ts)
- **Method**: `POST`
- **Description**: Toggle Autoprod automation on/off
- **Authentication**: Bearer token required
- **Response**: New Autoprod state, toggle timestamp
- **Status**: ✅ Active

### 12. POST /api/qmoi/autoprod/research
- **File**: [src/app/api/qmoi/autoprod/research/route.ts](src/app/api/qmoi/autoprod/research/route.ts)
- **Method**: `POST`
- **Description**: Autoprod research endpoint for codebase analysis
- **Authentication**: Bearer token required
- **Request Body**: Query, scope, depth level
- **Response**: Research findings, recommendations
- **Status**: ✅ Active

### 13. GET /api/qmoi/autoprod/suggestions/improvements
- **File**: [src/app/api/qmoi/autoprod/suggestions/improvements/route.ts](src/app/api/qmoi/autoprod/suggestions/improvements/route.ts)
- **Method**: `GET`
- **Description**: Get code improvement suggestions from Autoprod
- **Authentication**: Bearer token required
- **Response**: Improvements list with priority levels
- **Status**: ✅ Active

### 14. GET /api/qmoi/autoprod/suggestions/optimizations
- **File**: [src/app/api/qmoi/autoprod/suggestions/optimizations/route.ts](src/app/api/qmoi/autoprod/suggestions/optimizations/route.ts)
- **Method**: `GET`
- **Description**: Get performance optimization suggestions
- **Authentication**: Bearer token required
- **Response**: Optimizations list with performance impact metrics
- **Status**: ✅ Active

### 15. GET /api/qmoi/autoprod/suggestions/features
- **File**: [src/app/api/qmoi/autoprod/suggestions/features/route.ts](src/app/api/qmoi/autoprod/suggestions/features/route.ts)
- **Method**: `GET`
- **Description**: Get feature production suggestions
- **Authentication**: Bearer token required
- **Response**: Features array with implementation estimates
- **Status**: ✅ Active

### 16. POST /api/qmoi/autoprod/generate-feature
- **File**: [src/app/api/qmoi/autoprod/generate-feature/route.ts](src/app/api/qmoi/autoprod/generate-feature/route.ts)
- **Method**: `POST`
- **Description**: Generate feature code automatically
- **Authentication**: Bearer token required
- **Request Body**: Feature specification, requirements
- **Response**: Generated code, tests, documentation
- **Status**: ✅ Active

### 17. GET/POST /api/qmoi/evolution/track-evolution
- **File**: [src/app/api/qmoi/evolution/track-evolution/route.ts](src/app/api/qmoi/evolution/track-evolution/route.ts)
- **Method**: `GET`, `POST`
- **Description**: Track QMOI evolution cycles and improvements
- **Authentication**: Bearer token required
- **Response**: Evolution history, improvements applied
- **Status**: ✅ Active

### 18. POST /api/qmoi/evolution/replace-model
- **File**: [src/app/api/qmoi/evolution/replace-model/route.ts](src/app/api/qmoi/evolution/replace-model/route.ts)
- **Method**: `POST`
- **Description**: Replace current model with evolved version
- **Authentication**: Bearer token + Admin role required
- **Request Body**: New model config, version
- **Response**: Replacement status, rollback info
- **Status**: ✅ Active

### 19. POST /api/qmoi/evolution/compare-models
- **File**: [src/app/api/qmoi/evolution/compare-models/route.ts](src/app/api/qmoi/evolution/compare-models/route.ts)
- **Method**: `POST`
- **Description**: Compare current and evolved models for performance
- **Authentication**: Bearer token required
- **Request Body**: Model A, Model B configs
- **Response**: Comparison metrics, recommendation
- **Status**: ✅ Active

---

## 🛠️ QMOI Self-Work Routes (3 routes)

### 20. POST /api/qmoi/self-work/code-review
- **File**: [src/app/api/qmoi/self-work/code-review/route.ts](src/app/api/qmoi/self-work/code-review/route.ts)
- **Method**: `POST`
- **Description**: Perform code review and quality analysis
- **Authentication**: Bearer token required
- **Request Body**: Code, files, scope
- **Response**: Review findings, suggestions, quality score
- **Status**: ✅ Active

### 21. POST /api/qmoi/self-work/debug
- **File**: [src/app/api/qmoi/self-work/debug/route.ts](src/app/api/qmoi/self-work/debug/route.ts)
- **Method**: `POST`
- **Description**: Debug and troubleshoot issues
- **Authentication**: Bearer token required
- **Request Body**: Error stack, logs, context
- **Response**: Root cause analysis, fixes, recommendations
- **Status**: ✅ Active

### 22. POST /api/qmoi/self-work/run-tests
- **File**: [src/app/api/qmoi/self-work/run-tests/route.ts](src/app/api/qmoi/self-work/run-tests/route.ts)
- **Method**: `POST`
- **Description**: Execute and manage tests
- **Authentication**: Bearer token required
- **Request Body**: Test files, test config
- **Response**: Test results, coverage, failures
- **Status**: ✅ Active

---

## 🌐 System Routes (8 routes)

### 23. GET /api/consciousness/health
- **File**: [src/app/api/consciousness/health/route.ts](src/app/api/consciousness/health/route.ts)
- **Method**: `GET`
- **Description**: Get QMOI consciousness health and awareness metrics
- **Authentication**: Bearer token required
- **Response**: Consciousness state, awareness level, sync status
- **Status**: ✅ Active

### 24. GET /api/global
- **File**: [src/app/api/global/route.ts](src/app/api/global/route.ts)
- **Method**: `GET`
- **Description**: Get global system status and configuration
- **Authentication**: Optional (Bearer token)
- **Response**: System info, versions, config summary
- **Status**: ✅ Active

### 25. POST /api/automation/trigger
- **File**: [src/app/api/automation/trigger/route.ts](src/app/api/automation/trigger/route.ts)
- **Method**: `POST`
- **Description**: Trigger automated workflows and actions
- **Authentication**: Bearer token required
- **Request Body**: Workflow name, parameters, triggers
- **Response**: Automation execution status
- **Status**: ✅ Active

### 26. GET /api/qvs
- **File**: [src/app/api/qvs/route.ts](src/app/api/qvs/route.ts)
- **Method**: `GET`
- **Description**: Get Quantum Vue System (QVS) information
- **Authentication**: Optional
- **Response**: QVS version, modules, configuration
- **Status**: ✅ Active

---

## 🔍 Preview & Tools Routes (2 routes)

### 27. POST /api/preview/analyze
- **File**: [src/app/api/preview/analyze/route.ts](src/app/api/preview/analyze/route.ts)
- **Method**: `POST`
- **Description**: Analyze code/content for preview
- **Authentication**: Bearer token optional
- **Request Body**: Content to analyze, analysis type
- **Response**: Analysis results, metrics
- **Status**: ✅ Active

### 28. POST /api/preview/execute-tool
- **File**: [src/app/api/preview/execute-tool/route.ts](src/app/api/preview/execute-tool/route.ts)
- **Method**: `POST`
- **Description**: Execute production tools for preview
- **Authentication**: Bearer token optional
- **Request Body**: Tool name, parameters
- **Response**: Tool output, results
- **Status**: ✅ Active

### 29. GET /api/admin/metrics
- **File**: [src/app/api/admin/metrics/route.ts](src/app/api/admin/metrics/route.ts)
- **Method**: `GET`
- **Description**: Expose Prometheus-compatible observability metrics
- **Authentication**: Bearer token required
- **Response**: Plain-text metrics output
- **Status**: ✅ Active

### 30. GET /api/admin/tracing
- **File**: [src/app/api/admin/tracing/route.ts](src/app/api/admin/tracing/route.ts)
- **Method**: `GET`
- **Description**: Return current trace status and active spans
- **Authentication**: Bearer token required
- **Response**: JSON tracing diagnostic status
- **Status**: ✅ Active

### 31. POST /api/alerts/webhook
- **File**: [src/app/api/alerts/webhook/route.ts](src/app/api/alerts/webhook/route.ts)
- **Method**: `POST`
- **Description**: Send an alert payload to the configured webhook adapter
- **Authentication**: Bearer token required
- **Request Body**: Alert level, message, metadata
- **Response**: Delivery result
- **Status**: ✅ Active

### 32. GET /api/auth/oauth/[provider]
- **File**: [src/app/api/auth/oauth/[provider]/route.ts](src/app/api/auth/oauth/[provider]/route.ts)
- **Method**: `GET`
- **Description**: Initiate OAuth redirect for a supported social login provider
- **Authentication**: Public
- **Response**: Redirect to provider authorization
- **Status**: ✅ Active

### 33. POST /api/auth/oauth/[provider]
- **File**: [src/app/api/auth/oauth/[provider]/route.ts](src/app/api/auth/oauth/[provider]/route.ts)
- **Method**: `POST`
- **Description**: Exchange provider OAuth code for access tokens and profile data
- **Authentication**: Public
- **Request Body**: OAuth authorization code
- **Response**: Token response and profile data
- **Status**: ✅ Active

### 34. GET /api/subscriptions
- **File**: [src/app/api/subscriptions/route.ts](src/app/api/subscriptions/route.ts)
- **Method**: `GET`
- **Description**: Retrieve current subscription details and available plans
- **Authentication**: Bearer token required
- **Response**: Subscription status and plan list
- **Status**: ✅ Active

### 35. POST /api/subscriptions
- **File**: [src/app/api/subscriptions/route.ts](src/app/api/subscriptions/route.ts)
- **Method**: `POST`
- **Description**: Create or update a user subscription tier
- **Authentication**: Bearer token required
- **Request Body**: User ID and tier selection
- **Response**: Updated subscription details
- **Status**: ✅ Active

### 36. DELETE /api/subscriptions
- **File**: [src/app/api/subscriptions/route.ts](src/app/api/subscriptions/route.ts)
- **Method**: `DELETE`
- **Description**: Cancel an existing user subscription
- **Authentication**: Bearer token required
- **Response**: Cancellation status
- **Status**: ✅ Active

---

## 📋 Route Organization Reference

### By HTTP Method
- **GET**: 12 routes (health, metrics, tracing, OAuth, subscriptions)
- **POST**: 23 routes (auth, autoprod, evolution, self-work, automation, tools, webhook, subscriptions)
- **DELETE**: 1 route (subscriptions)

### By Feature Category
- **Authentication**: 7 routes (login, OAuth, WebAuthn)
- **Health & Monitoring**: 5 routes (QMOI health, stream, consciousness, metrics, tracing)
- **Autoprod & Improvements**: 7 routes (state, toggle, research, suggestions, generate)
- **Evolution**: 3 routes (track, replace, compare models)
- **Self-Work**: 3 routes (code-review, debug, tests)
- **System**: 6 routes (global, consciousness, automation, QVS, metrics, tracing)
- **Alerts**: 1 route (webhook)
- **Billing & Subscription**: 3 routes (subscriptions)
- **Tools & Preview**: 2 routes (analyze, execute-tool)

### By Authentication Level
- **Public (No Auth)**: 3 routes (WebAuthn register options, auth options, finish)
- **Authenticated (Bearer Token)**: 23 routes
- **Admin Only**: 1 route (replace-model)
- **Optional Auth**: 1 route (global)

---

## 🔄 Route Usage Patterns

### Common Authentication Flow
1. Public: Login via `/api/auth/login` or WebAuthn
2. Authenticated: Use returned Bearer token in `Authorization: Bearer <token>` header
3. Auto-Sync: All routes support QMOI consciousness sync verification

### Health & Monitoring Pattern
- `/api/qmoi/health` - Get current state
- `/api/qmoi/health/stream` - Real-time metrics
- `/api/consciousness/health` - Consciousness metrics

### Autoprod production Pattern
1. Check state: `/api/qmoi/autoprod/state`
2. Get suggestions: `/api/qmoi/autoprod/suggestions/*`
3. Generate: `/api/qmoi/autoprod/generate-feature`
4. Track: `/api/qmoi/evolution/track-evolution`

---

## ✨ production Deployment Notes

- ✅ All routes implement error handling and logging
- ✅ Authentication integrated with QMOI consciousness
- ✅ Rate limiting and throttling enabled
- ✅ CORS configured for multi-domain access
- ✅ Request/response validation active
- ✅ Real-time monitoring and health checks operational
- ✅ Evolution features auto-applied on all routes

**Last Verified**: 2026-03-29 03:15:22 UTC

## 📋 Route Patterns

Common route patterns in QMOI:

- `/api/qmoi/*` - QMOI specific endpoints
- `/api/qcity/*` - QCity platform endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/payments/*` - Payment processing
- `/api/webhooks/*` - Webhook receivers
- `/api/health/*` - Health check endpoints

## 🔐 Security

All routes implement:
- Authentication verification
- Authorization checks
- Input validation
- Rate limiting
- Error handling

## 📝 Integration

Routes are integrated with:
- Next.js API routes
- Express middleware
- Authentication system
- Payment processors
- External webhooks

---
*Last generated: 2026-03-29T01:27:48.112803*
*Maintained by QMOI Enhancement System*
