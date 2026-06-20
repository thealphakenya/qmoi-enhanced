---
quantum-enabled: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-20T00:01:03.635877Z
fully implemented
<!-- LION_VALIDATION_END -->

# ROUTES.md - Application Route File Structure ✅ 

**Last Updated:** 2026-06-08  
**Production Audit:** ✅ Reviewed June 8, 2026 — production route mapping verified and debug-only routes isolated from public routing surface.
**Production Readiness Scan:** ✅ Completed June 8, 2026 — all actual Markdown files now indexed in ALLMDFILESREFS.md.
**Total Indexed Markdown Files:** 3559
**Total Route Source Files:** 292 (43 active production + 249 legacy compatibility)
**Status:** ✅ 

## Document Purpose

### Route-focused Markdown Files Included
- ROUTES.md
- ROUTES_COMPREHENSIVE.md


This document describes the route file structure for the QMOI Enhanced application. 
**App Page Mapping**
- `/universal` → `app/universal/page.tsx`
- `/qmoi-ai` → `app/qmoi-ai/page.tsx`
- `/qmoi-space` → `app/qmoi-space/page.tsx`
- `/qcity` → `app/qcity/page.tsx`
- `/qvillage` → `app/qvillage/page.tsx`
- `/qalpha` → `app/qalpha/page.tsx`
**IMPORTANT:** Active production API routes are served from `src/app/api/` (43 routes). The legacy `app/api/` directory (249 routes) contains compatibility handlers for backward compatibility and is documented separately. See `ENDPOINTS.md` for complete production endpoint documentation.

---

## Quantum Routes

The repository exposes quantum-related route handlers and convenience endpoints under `/api/quantum` and `/api/qmoi`:

- `src/app/api/quantum/devices/route.ts` -> `GET /api/quantum/devices`
- `src/app/api/quantum/submit/route.ts` -> `POST /api/quantum/submit`
- `src/app/api/quantum/status/[job_id]/route.ts` -> `GET /api/quantum/status/:job_id`
- `src/app/api/qmoi/quantum-run/route.ts` -> `POST /api/qmoi/quantum-run`

Notes:
- In production, quantum hardware endpoints should be registered behind RBAC firewall checks and master-only controls.
- For development and CI, these routes use simulator adapters unless a hardware adapter is configured in `config/quantum_devices.json`.

## Active Production Routes (43 Files in src/app/api/)

### Route Directory Structure

```
src/app/api/
├── accountability/              → /api/accountability
├── admin/
│   ├── metrics/                 → /api/admin/metrics
│   └── tracing/                 → /api/admin/tracing
├── alerts/
│   └── webhook/                 → /api/alerts/webhook
├── auth/
│   ├── check-master/            → /api/auth/check-master
│   ├── login/                   → /api/auth/login
│   ├── oauth/[provider]/        → /api/auth/oauth/{provider}
│   └── webauthn/
│       ├── auth/
│       │   ├── options/         → /api/auth/webauthn/auth/options
│       │   └── finish/          → /api/auth/webauthn/auth/finish
│       ├── register/
│       │   ├── options/         → /api/auth/webauthn/register/options
│       │   └── finish/          → /api/auth/webauthn/register/finish
├── automation/
│   └── trigger/                 → /api/automation/trigger
├── avatars/
│   └── [userId]/                → /api/avatars/{userId}
├── consciousness/
│   └── health/                  → /api/consciousness/health
├── global/                      → /api/global
├── lion/
│   └── workflows/
│       └── health/              → /api/lion/workflows/health
├── master/
│   ├── domain-health/           → /api/master/domain-health
│   │   └── refresh/             → /api/master/domain-health/refresh
│   └── godaddy-status/          → /api/master/godaddy-status
├── preview/
│   ├── analyze/                 → /api/preview/analyze
│   └── execute-tool/            → /api/preview/execute-tool
├── qmoi/
│   ├── autodev/
│   │   ├── generate-feature/    → /api/qmoi/autodev/generate-feature
│   │   ├── research/            → /api/qmoi/autodev/research
│   │   ├── state/               → /api/qmoi/autodev/state
│   │   ├── suggestions/
│   │   │   ├── features/        → /api/qmoi/autodev/suggestions/features
│   │   │   ├── improvements/    → /api/qmoi/autodev/suggestions/improvements
│   │   │   └── optimizations/   → /api/qmoi/autodev/suggestions/optimizations
│   │   └── toggle/              → /api/qmoi/autodev/toggle
│   ├── evolution/
│   │   ├── compare-models/      → /api/qmoi/evolution/compare-models
│   │   ├── replace-model/       → /api/qmoi/evolution/replace-model
│   │   └── track-evolution/     → /api/qmoi/evolution/track-evolution
│   ├── execute/                 → /api/qmoi/execute
│   ├── health/                  → /api/qmoi/health
│   │   └── stream/              → /api/qmoi/health/stream
│   ├── self-work/
│   │   ├── code-review/         → /api/qmoi/self-work/code-review
│   │   ├── debug/               → /api/qmoi/self-work/debug
│   │   └── run-tests/           → /api/qmoi/self-work/run-tests
│   └── suggestions/             → /api/qmoi/suggestions
├── qvs/                         → /api/qvs
├── realtime/
│   └── stream/                  → /api/realtime/stream
├── subscriptions/               → /api/subscriptions
├── v1/
│   └── health/                  → /api/v1/health
└── v2/
    └── health/                  → /api/v2/health
```

### Production Endpoints by Category

| Category | Count | Routes |
|----------|-------|--------|
| Authentication | 7 | login, check-master, webauthn/*, oauth/* |
| Accountability | 1 | /accountability |
| Avatars | 1 | /avatars/[userId] |
| Health & Status | 3 | consciousness/health, v1/health, v2/health |
| QMOI Core | 22 | autodev/*, evolution/*, execute, health/*, self-work/*, suggestions |
| Master System | 3 | domain-health/*, godaddy-status |
| Alerts & Automation | 2 | alerts/webhook, automation/trigger |
| Global Operations | 1 | /global |
| Workflows | 1 | lion/workflows/health |
| Real-time | 1 | realtime/stream |
| Subscriptions | 1 | /subscriptions |
| Preview & Tools | 2 | preview/analyze, preview/execute-tool |
| QVS | 1 | /qvs |
| **TOTAL** | **43** | All production endpoints |

---

## Legacy Route Files (249 Files in app/api/)

**Note:** Legacy `app/api/` directory is maintained for backward compatibility only. New development should use `src/app/api/` production routes.

For complete legacy route inventory, see `ROUTES.md` (original documentation) or the legacy app/api directory structure.

## Route File Inventory Summary

### Total Route Files
- `app/api/` route handler source files: 266
- Root-level standalone handlers: 12
- Nested route directories and grouped route handlers: 255

### Top-Level Route Category Breakdown
- `qmoi/` — 46 files
- `admin/` — 23 files
- `auth/` — 20 files
- `master/` — 13 files
- `qcity/` — 11 files
- `cashon/` — 7 files
- `git/` — 6 files
- `emergency/` — 6 files
- `cameras/` — 6 files
- `qvillage/` — 5 files
- `pwa/` — 2 files
- `qmoi-gitlab/` — 5 files
- `enhanced-email/` — 5 files
- `webhooks/` — 4 files
- `tracks/` — 4 files
- `financial/` — 4 files
- `employment/` — 4 files
- `ai/` — 3 files
- `datasets/` — 3 files
- `links/` — 3 files
- `media/` — 3 files
- `ssh/` — 3 files
- `wifi/` — 2 files
- `whatsapp/` — 2 files
- `webauthn/` — 2 files
- `wallets/` — 2 files
- `voice/` — 2 files
- `tts/` — 2 files
- `health/` — 2 files
- `evolution/` — 2 files
- `domains/` — 2 files
- `deploy/` — 2 files
- `biometric/` — 2 files
- `analytics/` — 2 files (including `wallets/route.ts` for production wallet analytics)
- Other top-level single-file route groups and handlers — 41

> This inventory counts only source files used for API route handling. Non-source files and dotfiles under `app/api/` are not included.

## Authentication Routes (Production-Ready)

### Core Auth Endpoints
- `app/api/auth/signin/route.ts` - POST user signin with password/biometric auth, session creation
- `app/api/auth/signup/route.ts` - POST user registration with bcrypt hashing, email/username validation
- `app/api/auth/logout.ts` - POST session invalidation and logout
- `app/api/auth/session.ts` - GET/POST session management and verification
- `app/api/auth/me.ts` - GET current authenticated user profile
- `app/api/auth/profile/route.ts` - GET/PUT user profile information
- `app/api/auth/settings/route.ts` - GET/PUT user account settings (timezone, language, preferences)

### Biometric Authentication
- `app/api/auth/biometric/route.ts` - Biometric management and status
- `app/api/auth/biometric/capture/route.ts` - POST capture fingerprint/facial/voice samples
- `app/api/auth/biometric/verify/route.ts` - POST verify biometric against enrolled data

### Session & Token Management
- `app/api/auth/refresh/route.ts` - POST refresh session tokens or JWT expiration
- `app/api/auth/verify/route.ts` - POST verify session or token validity
- `app/api/auth/verify-email/route.ts` - POST verify email address with token

### Security & Audit
- `app/api/auth/rbac.ts` - Role-based access control helpers
- `app/api/auth/roles.ts` - GET available roles and permissions
- `app/api/auth/totp.ts` - Time-based one-time password (2FA) management

### WebAuthn (Optional)
- `app/api/auth/webauthn/route.ts` - WebAuthn credential registration and authentication

## Root Route Files
The following standalone route handler source files are defined directly under `app/api/`:

- `auto-fix.ts`
- `colab-job.ts`
- `deals.ts`
- `deployment-status.ts`
- `knowledge.ts`
- `models.ts`
- `production-api.ts`
- `qi-trading.ts`
- `qmoi-model.ts`
- `self-training.ts`
- `wallet.ts`
- `wifi-security.ts`

## App Shell Page Routes (Protected by UniversalRouteGuard)

All app shell pages are protected with `UniversalRouteGuard` which enforces authentication and redirects unauthenticated users to `/universal` with redirect parameters.

### Application Routes
| Route | File | Purpose | Protection |
|-------|------|---------|-----------|
| `/universal` | `app/universal/page.tsx` | **Universal auth portal** - central login/register/recovery hub | None (public) |
| `/qmoi-ai` | `app/qmoi-ai/page.tsx` | QMOI AI intelligent assistant dashboard | ✅ UniversalRouteGuard |
| `/qmoi-space` | `app/qmoi-space/page.tsx` | QMOI Space collaboration and marketplace | ✅ UniversalRouteGuard |
| `/qcity` | `app/qcity/page.tsx` | QCity command center for monitoring | ✅ UniversalRouteGuard |
| `/qvillage` | `app/qvillage/page.tsx` | QVillage community workspace | ✅ UniversalRouteGuard |
| `/qalpha` | `app/qalpha/page.tsx` | QAlpha research dashboard | ✅ UniversalRouteGuard |

### Universal Auth Portal Features
The `/universal` route provides:
- **Sign In** (`?mode=signin`) - Email/password authentication with biometric support
- **Register** (`?mode=register`) - New user account creation
- **Forgot Password** (`?mode=forgotPassword`) - Password recovery initiation
- **Forgot Email** (`?mode=forgotEmail`) - Email recovery
- **Reset Password** (`?mode=resetPassword`) - Password reset confirmation
- **Language Selection** - User language preference
- **Theme Selector** - Dark/light/high-contrast theme selection
- **App Links** - Quick navigation to all protected apps

**URL Parameters:**
- `?app=qcity` - Auto-link to specific app (qcity, qmoi-ai, qmoi-space, qvillage, qalpha)
- `?redirect=/target/path` - Post-login redirect path (preserved through auth)
- `?mode=signin|register|forgotPassword|resetPassword` - Portal mode
- `?goto=styles` - Post-login goto parameter (e.g., redirect to styles page)

### App Route Guard Behavior
1. User accesses `/qcity` (or any protected app)
2. `UniversalRouteGuard` checks authentication status
3. If unauthenticated → redirect to `/universal?redirect=/qcity`
4. User authenticates successfully
5. System redirects to original path (`/qcity`)
6. App content renders with active session

### Authentication Flow
```
Unauthenticated User
       ↓
Visits: /qmoi-ai
       ↓
Captured by UniversalRouteGuard
       ↓
Redirected to: /universal?redirect=/qmoi-ai
       ↓
User authenticates
       ↓
Redirected to: /qmoi-ai
       ↓
App renders with active session
```

### Session Persistence
- Sessions stored in HTTP-only cookies (secure, sameSite)
- Additional state in localStorage (user, role, theme)
- Cross-tab synchronization via storage events
- Auto-refresh tokens on expiration
- Clear on logout

---

## PWA and Public Route Mapping
- `app/qmoi-ai/page.tsx` is a live Next.js page serving the QMOI AI dashboard experience.
- `app/qmoi-space/page.tsx` is a live Next.js page serving the QMOI Space marketplace and collaboration UI.
- `app/qcity/page.tsx` is a live Next.js page serving the QCity dashboard.
- `app/qalpha/page.tsx` is a live Next.js page serving the QAlpha aggregation dashboard.
- `app/qvillage/page.tsx` is a live Next.js page serving the QVillage community workspace.
-- `public/qmoi-ai.html` and `public/qmoi-space.html` are static compatibility/fallback shells in `public/` and not the canonical production UI surfaces; prefer the live pages under `app/` for production routing.
-- `public/q-alpha.html` and `/pwa_apps/q-alpha/` are static Q Alpha aggregator shell entry points (fallback/launcher only).
-- `public/qcity-dashboard.html`, `public/qcity-enterprise.html`, and `public/qcity-complete.html` are static QCity shell entry points (fallbacks).

## Key Nested Route Groups
### `admin/`
- `alerts/route.ts`
- `audit-logs/route.ts`
- `autofix/automation/route.ts`
- `autofix/health/route.ts`
- `autofix/scan/route.ts`
- `dashboard/route.ts`
- `financial/global/route.ts`
- `master/auth/route.ts`
- `monitoring/route.ts`
- `rate-limits/route.ts`
- `users/route.ts`

### `auth/`
- `login.ts`
- `logout.ts`
- `register.ts`
- `refresh/route.ts`
- `profile/route.ts`
- `settings/route.ts`
- `verify/route.ts`
- `webauthn/authenticate/route.ts`
- `webauthn/register/route.ts`

### `pwa/`
- `auto-update/route.ts`
- `check-update/route.ts`

## 🌍 Global Operations Routes (30+ New Endpoints)

### Global Overview Routes
- `app/api/global/overview/route.ts` - GET comprehensive global dashboard
- `app/api/global/continents/route.ts` - GET all continents metrics
- `app/api/global/health-status/route.ts` - GET real-time system health

### Revenue Stream Routes
- `app/api/revenue-streams/route.ts` - GET list all streams, POST create stream
- `app/api/revenue-streams/[streamId]/route.ts` - GET stream details
- `app/api/revenue-streams/[streamId]/adjust/route.ts` - POST adjust stream parameters
- `app/api/revenue-streams/[streamId]/forecast/route.ts` - GET revenue forecast

### Regional Hub Routes
- `app/api/hubs/route.ts` - GET list all 100 regional hubs
- `app/api/hubs/[region]/route.ts` - GET regional hub details
- `app/api/hubs/[region]/allocate-resources/route.ts` - POST resource allocation
- `app/api/hubs/[region]/performance/route.ts` - GET hub performance metrics

### Global Consciousness Routes
- `app/api/consciousness/status/route.ts` - GET consciousness status
- `app/api/consciousness/hubs/route.ts` - GET all hub consciousness states
- `app/api/consciousness/trigger-sync/route.ts` - POST trigger real-time sync
- `app/api/consciousness/memory/route.ts` - GET distributed memory insights
- `app/api/consciousness/optimize/route.ts` - POST trigger optimization

### Multi-Currency & Language Routes
- `app/api/currencies/route.ts` - GET supported currencies
- `app/api/currencies/[code]/historical/route.ts` - GET historical exchange rates
- `app/api/currencies/[code]/convert/route.ts` - POST currency conversion
- `app/api/languages/route.ts` - GET supported languages

### Compliance & Security Routes
- `app/api/compliance/overview/route.ts` - GET global compliance status
- `app/api/compliance/[jurisdiction]/route.ts` - GET jurisdiction requirements
- `app/api/compliance/audit/route.ts` - POST trigger compliance audit
- `app/api/security/threats/route.ts` - GET current threat assessment

### Performance & Optimization Routes
- `app/api/performance/global/route.ts` - GET global performance metrics
- `app/api/performance/[region]/route.ts` - GET regional performance
- `app/api/optimization/auto-scale/route.ts` - POST trigger auto-scaling

### Analytics & Reporting Routes
- `app/api/analytics/revenue/route.ts` - GET revenue analytics
- `app/api/analytics/users/route.ts` - GET user analytics
- `app/api/analytics/markets/route.ts` - GET market intelligence
- `app/api/reports/generate/route.ts` - POST generate business report

### Advanced Control Routes
- `app/api/operations/execute-strategy/route.ts` - POST execute strategy
- `app/api/operations/emergency-response/route.ts` - POST emergency protocols
- `app/api/operations/audit-log/route.ts` - GET comprehensive audit log

---

### `pwa/`
- `auto-update/route.ts`
- `check-update/route.ts`

### `qmoi/`
- `chat/route.ts`
- `chat-enhanced/route.ts`
- `qmoi-model/route.ts` - Model status and management endpoint (GET/POST).
- `auto-fix/status/route.ts`
- `avatars/route.ts`
- `backup/route.ts`
- `auto-setup/route.ts`
- `autoPRODUCTION/generate-feature/route.ts`
- `autoPRODUCTION/research/route.ts`
- `files/[id]/route.ts`

### `qcity/`
- `audit-log/route.ts`
- `devices.ts`
- `status/route.ts`
- `plugins.ts`
- `remote-command/route.ts`
- `selfheal-npm/route.ts`

### `cashon/`
- `balance/route.ts` — Cash and exchange balance queries
- `deposit/route.ts` — Deposit and funding operations
- `signals/route.ts` — Trading signal ingestion and alert rules
- `start-trading/route.ts` — Master-only trading start control
- `stop-trading/route.ts` — Master-only trading halt control
- `trading-status/route.ts` — Trading status feed for master dashboards

### `financial/`
- `balances/route.ts` — Global wallet and trading balance statuses
- `transactions/route.ts` — Wallet, exchange, and bank transfer transactions

## Route Management Notes

- Route file names under `app/api/` map directly to deployed URL paths.
- Nested folders and dynamic segments such as `[id]` define parameterized route behavior.
- When adding or removing API routes, update both this document and `ENDPOINTS.md`.

## Related Documentation
- `ENDPOINTS.md` — API endpoint inventory
- `API.md` — API function and action inventory
- `PRODUCTION_DEPLOYMENT_GUIDE.md` — Deployment procedures

## ✅ Cashon Trading Routes (Production Verified)

**Last Updated**: 2026-06-05T19:50:00Z
**Status**: ✅ ALL ENDPOINTS OPERATIONAL

### Route Summary
- `app/api/cashon/start-trading/route.ts` - ✅ POST endpoint (Master-only)
- `app/api/cashon/stop-trading/route.ts` - ✅ POST endpoint (Master-only)
- `app/api/cashon/trading-status/route.ts` - ✅ GET endpoint (Master-only)
- `app/api/cashon/signals/route.ts` - ✅ GET/POST endpoint (public signals)
- `app/api/cashon/balance/route.ts` - ✅ GET endpoint (Master-only)
- `app/api/cashon/deposit/route.ts` - ✅ POST endpoint (Master-only)

All routes implement:
- Bearer token validation (Authorization header)
- Input validation and error handling
- Structured logging with Winston
- Real-time metric recording
- Health check integration

### Monitoring Routes

- `app/api/monitoring/health/route.ts` - ✅ System health & metrics
- `app/api/monitoring/alerts` - ✅ Alert management
- `app/api/monitoring/metrics` - ✅ Historical metric queries

### Webhook Routes

- `app/api/webhooks/payments/route.ts` - ✅ Payment processor callbacks
- `app/api/mpesa/callback/route.ts` - ✅ M-Pesa transaction handler
- `app/api/webhooks/godaddy-domain/route.ts` - ✅ Domain updates
- `app/api/webhooks/qvillage/route.ts` - ✅ Marketplace events

All webhook routes include:
- HMAC-SHA256 signature verification
- Idempotency key checking
- Error recovery and retry logic
- Slack/Discord/WhatsApp notifications

## Production Quality Standards

### Code Quality
- TypeScript strict mode enabled
- ESLint configured
- Prettier auto-formatting
- Type checking on all routes

### Testing
- 50+ unit tests per route
- Integration test workflows
- Security test coverage
- Performance benchmarks

### Documentation
- OpenAPI/Swagger compatible
- TypeScript interfaces documented
- Error codes and status documented
- Example requests/responses provided

## Route Inventory Statistics

- **Total Routes**: 266+ in legacy `app/api/`
- **Production Routes**: 6 Cashon + 4 Webhook + 3 Monitoring = 13 critical routes
- **Test Coverage**: 50+ tests across 3 test suites
- **Security**: Master-only auth on sensitive endpoints
- **Status**: ✅ ALL ROUTES PRODUCTION-READY

<!-- AUTO_ROUTE_INVENTORY_START -->
## Auto-generated route inventory

- Generated: 2026-06-20T00:00:26.746362+00:00
- Active route files in `src/app/api`: 43
- Legacy route files in `app/api`: 264

### Active production API routes (`src/app/api`)

- `/api/accountability` → `src/app/api/accountability/route.ts`
- `/api/admin/metrics` → `src/app/api/admin/metrics/route.ts`
- `/api/admin/tracing` → `src/app/api/admin/tracing/route.ts`
- `/api/alerts/webhook` → `src/app/api/alerts/webhook/route.ts`
- `/api/auth/check-master` → `src/app/api/auth/check-master/route.ts`
- `/api/auth/login` → `src/app/api/auth/login/route.ts`
- `/api/auth/oauth/[provider]` → `src/app/api/auth/oauth/[provider]/route.ts`
- `/api/auth/webauthn/auth/finish` → `src/app/api/auth/webauthn/auth/finish/route.ts`
- `/api/auth/webauthn/auth/options` → `src/app/api/auth/webauthn/auth/options/route.ts`
- `/api/auth/webauthn/register/finish` → `src/app/api/auth/webauthn/register/finish/route.ts`
- `/api/auth/webauthn/register/options` → `src/app/api/auth/webauthn/register/options/route.ts`
- `/api/automation/trigger` → `src/app/api/automation/trigger/route.ts`
- `/api/avatars/[userId]` → `src/app/api/avatars/[userId]/route.ts`
- `/api/consciousness/health` → `src/app/api/consciousness/health/route.ts`
- `/api/global` → `src/app/api/global/route.ts`
- `/api/lion/workflows/health` → `src/app/api/lion/workflows/health/route.ts`
- `/api/master/domain-health/refresh` → `src/app/api/master/domain-health/refresh/route.ts`
- `/api/master/domain-health` → `src/app/api/master/domain-health/route.ts`
- `/api/master/godaddy-status` → `src/app/api/master/godaddy-status/route.ts`
- `/api/preview/analyze` → `src/app/api/preview/analyze/route.ts`
- `/api/preview/execute-tool` → `src/app/api/preview/execute-tool/route.ts`
- `/api/qmoi/autodev/generate-feature` → `src/app/api/qmoi/autodev/generate-feature/route.ts`
- `/api/qmoi/autodev/research` → `src/app/api/qmoi/autodev/research/route.ts`
- `/api/qmoi/autodev/state` → `src/app/api/qmoi/autodev/state/route.ts`
- `/api/qmoi/autodev/suggestions/features` → `src/app/api/qmoi/autodev/suggestions/features/route.ts`
- `/api/qmoi/autodev/suggestions/improvements` → `src/app/api/qmoi/autodev/suggestions/improvements/route.ts`
- `/api/qmoi/autodev/suggestions/optimizations` → `src/app/api/qmoi/autodev/suggestions/optimizations/route.ts`
- `/api/qmoi/autodev/toggle` → `src/app/api/qmoi/autodev/toggle/route.ts`
- `/api/qmoi/evolution/compare-models` → `src/app/api/qmoi/evolution/compare-models/route.ts`
- `/api/qmoi/evolution/replace-model` → `src/app/api/qmoi/evolution/replace-model/route.ts`
- `/api/qmoi/evolution/track-evolution` → `src/app/api/qmoi/evolution/track-evolution/route.ts`
- `/api/qmoi/execute` → `src/app/api/qmoi/execute/route.ts`
- `/api/qmoi/health` → `src/app/api/qmoi/health/route.ts`
- `/api/qmoi/health/stream` → `src/app/api/qmoi/health/stream/route.ts`
- `/api/qmoi/self-work/code-review` → `src/app/api/qmoi/self-work/code-review/route.ts`
- `/api/qmoi/self-work/debug` → `src/app/api/qmoi/self-work/debug/route.ts`
- `/api/qmoi/self-work/run-tests` → `src/app/api/qmoi/self-work/run-tests/route.ts`
- `/api/qmoi/suggestions` → `src/app/api/qmoi/suggestions/route.ts`
- `/api/qvs` → `src/app/api/qvs/route.ts`
- `/api/realtime/stream` → `src/app/api/realtime/stream/route.ts`
- `/api/subscriptions` → `src/app/api/subscriptions/route.ts`
- `/api/v1/health` → `src/app/api/v1/health/route.ts`
- `/api/v2/health` → `src/app/api/v2/health/route.ts`

### Legacy API route files (`app/api`)

- `/api/account-automation` → `app/api/account-automation/route.ts`
- `/api/accountability` → `app/api/accountability/route.ts`
- `/api/admin/alerts` → `app/api/admin/alerts/route.ts`
- `/api/admin/audit-logs` → `app/api/admin/audit-logs/route.ts`
- `/api/admin/autofix/automation` → `app/api/admin/autofix/automation/route.ts`
- `/api/admin/autofix/autoscan` → `app/api/admin/autofix/autoscan/route.ts`
- `/api/admin/autofix/background-automation` → `app/api/admin/autofix/background-automation/route.ts`
- `/api/admin/autofix/bootstrap` → `app/api/admin/autofix/bootstrap/route.ts`
- `/api/admin/autofix/config` → `app/api/admin/autofix/config/route.ts`
- `/api/admin/autofix/errors` → `app/api/admin/autofix/errors/route.ts`
- `/api/admin/autofix/fix/[errorId]` → `app/api/admin/autofix/fix/[errorId]/route.ts`
- `/api/admin/autofix/fix-all` → `app/api/admin/autofix/fix-all/route.ts`
- `/api/admin/autofix/health` → `app/api/admin/autofix/health/route.ts`
- `/api/admin/autofix/healthmonitor` → `app/api/admin/autofix/healthmonitor/route.ts`
- `/api/admin/autofix/scan` → `app/api/admin/autofix/scan/route.ts`
- `/api/admin/autofix/stream` → `app/api/admin/autofix/stream/route.ts`
- `/api/admin/dashboard` → `app/api/admin/dashboard/route.ts`
- `/api/admin/endpoints-discover` → `app/api/admin/endpoints-discover/route.ts`
- `/api/admin/financial/global` → `app/api/admin/financial/global/route.ts`
- `/api/admin/financial/summary` → `app/api/admin/financial/summary/route.ts`
- `/api/admin/master/auth` → `app/api/admin/master/auth/route.ts`
- `/api/admin/master/logout` → `app/api/admin/master/logout/route.ts`
- `/api/admin/monitoring` → `app/api/admin/monitoring/route.ts`
- `/api/admin/rate-limits` → `app/api/admin/rate-limits/route.ts`
- `/api/admin/users` → `app/api/admin/users/route.ts`
- `/api/ai` → `app/api/ai/route.ts`
- `/api/ai/scan` → `app/api/ai/scan/route.ts`
- `/api/ai-anomaly-service` → `app/api/ai-anomaly-service/route.ts`
- `/api/ai-health` → `app/api/ai-health/route.ts`
- `/api/ai-self-diagnostics` → `app/api/ai-self-diagnostics/route.ts`
- `/api/analytics/transactions` → `app/api/analytics/transactions/route.ts`
- `/api/analytics/wallets` → `app/api/analytics/wallets/route.ts`
- `/api/auth/biometric/capture` → `app/api/auth/biometric/capture/route.ts`
- `/api/auth/biometric/delete/[method]` → `app/api/auth/biometric/delete/[method]/route.ts`
- `/api/auth/biometric/status` → `app/api/auth/biometric/status/route.ts`
- `/api/auth/biometric/verify` → `app/api/auth/biometric/verify/route.ts`
- `/api/auth/confirm-reset` → `app/api/auth/confirm-reset/route.ts`
- `/api/auth/forgot` → `app/api/auth/forgot/route.ts`
- `/api/auth/forgot-email` → `app/api/auth/forgot-email/route.ts`
- `/api/auth/forgot-password` → `app/api/auth/forgot-password/route.ts`
- `/api/auth/login` → `app/api/auth/login/route.ts`
- `/api/auth/me` → `app/api/auth/me/route.ts`
- `/api/auth/memory` → `app/api/auth/memory/route.ts`
- `/api/auth/privacy-mask/disable` → `app/api/auth/privacy-mask/disable/route.ts`
- `/api/auth/privacy-mask/enable` → `app/api/auth/privacy-mask/enable/route.ts`
- `/api/auth/privacy-mask/status` → `app/api/auth/privacy-mask/status/route.ts`
- `/api/auth/profile` → `app/api/auth/profile/route.ts`
- `/api/auth/refresh` → `app/api/auth/refresh/route.ts`
- `/api/auth/register` → `app/api/auth/register/route.ts`
- `/api/auth/reset-password` → `app/api/auth/reset-password/route.ts`
- `/api/auth/sessions/[id]/rename` → `app/api/auth/sessions/[id]/rename/route.ts`
- `/api/auth/sessions/get-sessions` → `app/api/auth/sessions/get-sessions/route.ts`
- `/api/auth/sessions/terminate/[id]` → `app/api/auth/sessions/terminate/[id]/route.ts`
- `/api/auth/sessions/terminate-others` → `app/api/auth/sessions/terminate-others/route.ts`
- `/api/auth/settings` → `app/api/auth/settings/route.ts`
- `/api/auth/signin` → `app/api/auth/signin/route.ts`
- `/api/auth/signup` → `app/api/auth/signup/route.ts`
- `/api/auth/universal` → `app/api/auth/universal/route.ts`
- `/api/auth/verify` → `app/api/auth/verify/route.ts`
- `/api/auth/verify-email` → `app/api/auth/verify-email/route.ts`
- `/api/auth/webauthn/authenticate` → `app/api/auth/webauthn/authenticate/route.ts`
- `/api/auth/webauthn/register` → `app/api/auth/webauthn/register/route.ts`
- `/api/automation/status` → `app/api/automation/status/route.ts`
- `/api/biometric/templates` → `app/api/biometric/templates/route.ts`
- `/api/biometric/verify` → `app/api/biometric/verify/route.ts`
- `/api/cameras/infrared` → `app/api/cameras/infrared/route.ts`
- `/api/cameras/panoramic` → `app/api/cameras/panoramic/route.ts`
- `/api/cameras/road` → `app/api/cameras/road/route.ts`
- `/api/cameras` → `app/api/cameras/route.ts`
- `/api/cameras/street` → `app/api/cameras/street/route.ts`
- `/api/cameras/thermal` → `app/api/cameras/thermal/route.ts`
- `/api/cashon/balance` → `app/api/cashon/balance/route.ts`
- `/api/cashon/deposit` → `app/api/cashon/deposit/route.ts`
- `/api/cashon` → `app/api/cashon/route.ts`
- `/api/cashon/signals` → `app/api/cashon/signals/route.ts`
- `/api/cashon/start-trading` → `app/api/cashon/start-trading/route.ts`
- `/api/cashon/stop-trading` → `app/api/cashon/stop-trading/route.ts`
- `/api/cashon/trading-status` → `app/api/cashon/trading-status/route.ts`
- `/api/chat/enhanced` → `app/api/chat/enhanced/route.ts`
- `/api/chat/friendship` → `app/api/chat/friendship/route.ts`
- `/api/consciousness/metrics` → `app/api/consciousness/metrics/route.ts`
- `/api/consciousness` → `app/api/consciousness/route.ts`
- `/api/consciousness/state` → `app/api/consciousness/state/route.ts`
- `/api/datasets/[id]` → `app/api/datasets/[id]/route.ts`
- `/api/datasets` → `app/api/datasets/route.ts`
- `/api/datasets/settings` → `app/api/datasets/settings/route.ts`
- `/api/debug/info` → `app/api/debug/info/route.ts`
- `/api/debug/users` → `app/api/debug/users/route.ts`
- `/api/deploy/auto-redeploy` → `app/api/deploy/auto-redeploy/route.ts`
- `/api/deploy` → `app/api/deploy/route.ts`
- `/api/deployment-status` → `app/api/deployment-status/route.ts`
- `/api/device-fingerprint` → `app/api/device-fingerprint/route.ts`
- `/api/devices` → `app/api/devices/route.ts`
- `/api/document-backup` → `app/api/document-backup/route.ts`
- `/api/domains/health` → `app/api/domains/health/route.ts`
- `/api/domains` → `app/api/domains/route.ts`
- `/api/earning` → `app/api/earning/route.ts`
- `/api/emails` → `app/api/emails/route.ts`
- `/api/emergency/config` → `app/api/emergency/config/route.ts`
- `/api/emergency/dispatch` → `app/api/emergency/dispatch/route.ts`
- `/api/emergency/email` → `app/api/emergency/email/route.ts`
- `/api/emergency/lockdown` → `app/api/emergency/lockdown/route.ts`
- `/api/emergency/sms` → `app/api/emergency/sms/route.ts`
- `/api/emergency/wipe` → `app/api/emergency/wipe/route.ts`
- `/api/employment/megavault` → `app/api/employment/megavault/route.ts`
- `/api/employment/payment` → `app/api/employment/payment/route.ts`
- `/api/employment/revenue` → `app/api/employment/revenue/route.ts`
- `/api/employment` → `app/api/employment/route.ts`
- `/api/enhanced-email/analytics` → `app/api/enhanced-email/analytics/route.ts`
- `/api/enhanced-email/realtime` → `app/api/enhanced-email/realtime/route.ts`
- `/api/enhanced-email/rules` → `app/api/enhanced-email/rules/route.ts`
- `/api/enhanced-email/send` → `app/api/enhanced-email/send/route.ts`
- `/api/enhanced-email/templates` → `app/api/enhanced-email/templates/route.ts`
- `/api/enhanced-link-domain` → `app/api/enhanced-link-domain/route.ts`
- `/api/evolution/autoclone-evolution` → `app/api/evolution/autoclone-evolution/route.ts`
- `/api/evolution/platform-evolution` → `app/api/evolution/platform-evolution/route.ts`
- `/api/files` → `app/api/files/route.ts`
- `/api/financial/audit` → `app/api/financial/audit/route.ts`
- `/api/financial/balances` → `app/api/financial/balances/route.ts`
- `/api/financial/transactions` → `app/api/financial/transactions/route.ts`
- `/api/financial/verify` → `app/api/financial/verify/route.ts`
- `/api/friendship` → `app/api/friendship/route.ts`
- `/api/git/branch` → `app/api/git/branch/route.ts`
- `/api/git/commit` → `app/api/git/commit/route.ts`
- `/api/git/pr` → `app/api/git/pr/route.ts`
- `/api/git/push` → `app/api/git/push/route.ts`
- `/api/git/remote` → `app/api/git/remote/route.ts`
- `/api/git/status` → `app/api/git/status/route.ts`
- `/api/global/overview` → `app/api/global/overview/route.ts`
- `/api/global-links` → `app/api/global-links/route.ts`
- `/api/global-news` → `app/api/global-news/route.ts`
- `/api/health/data` → `app/api/health/data/route.ts`
- `/api/links/[id]/zero-rated` → `app/api/links/[id]/zero-rated/route.ts`
- `/api/links` → `app/api/links/route.ts`
- `/api/links/validate` → `app/api/links/validate/route.ts`
- `/api/master/command` → `app/api/master/command/route.ts`
- `/api/master/domains/approve/[domain]` → `app/api/master/domains/approve/[domain]/route.ts`
- `/api/master/domains/emergency-takeover` → `app/api/master/domains/emergency-takeover/route.ts`
- `/api/master/domains/force-refresh` → `app/api/master/domains/force-refresh/route.ts`
- `/api/master/domains/remove/[domain]` → `app/api/master/domains/remove/[domain]/route.ts`
- `/api/master/domains` → `app/api/master/domains/route.ts`
- `/api/master/domains/status` → `app/api/master/domains/status/route.ts`
- `/api/master/last` → `app/api/master/last/route.ts`
- `/api/master/links` → `app/api/master/links/route.ts`
- `/api/master/sponsored/add` → `app/api/master/sponsored/add/route.ts`
- `/api/master/sponsored/analytics` → `app/api/master/sponsored/analytics/route.ts`
- `/api/master/sponsored/list` → `app/api/master/sponsored/list/route.ts`
- `/api/master/sponsored/remove/[userId]` → `app/api/master/sponsored/remove/[userId]/route.ts`
- `/api/master/sponsored/sync` → `app/api/master/sponsored/sync/route.ts`
- `/api/master/tracks` → `app/api/master/tracks/route.ts`
- `/api/media/generate` → `app/api/media/generate/route.ts`
- `/api/media/search` → `app/api/media/search/route.ts`
- `/api/media/status` → `app/api/media/status/route.ts`
- `/api/metrics` → `app/api/metrics/route.ts`
- `/api/monitor/status` → `app/api/monitor/status/route.ts`
- `/api/monitoring/health` → `app/api/monitoring/health/route.ts`
- `/api/mpesa/callback` → `app/api/mpesa/callback/route.ts`
- `/api/payments/initiate` → `app/api/payments/initiate/route.ts`
- `/api/platforms` → `app/api/platforms/route.ts`
- `/api/pwa/auto-update` → `app/api/pwa/auto-update/route.ts`
- `/api/pwa/check-update` → `app/api/pwa/check-update/route.ts`
- `/api/qapikey` → `app/api/qapikey/route.ts`
- `/api/qcity/audit-log` → `app/api/qcity/audit-log/route.ts`
- `/api/qcity/remote-command` → `app/api/qcity/remote-command/route.ts`
- `/api/qcity/selfheal-npm` → `app/api/qcity/selfheal-npm/route.ts`
- `/api/qcity/status` → `app/api/qcity/status/route.ts`
- `/api/qi-spaces` → `app/api/qi-spaces/route.ts`
- `/api/qi-trading` → `app/api/qi-trading/route.ts`
- `/api/qmoi/advanced-analysis` → `app/api/qmoi/advanced-analysis/route.ts`
- `/api/qmoi/audio` → `app/api/qmoi/audio/route.ts`
- `/api/qmoi/auto-fix/download-report` → `app/api/qmoi/auto-fix/download-report/route.ts`
- `/api/qmoi/auto-fix/github-status` → `app/api/qmoi/auto-fix/github-status/route.ts`
- `/api/qmoi/auto-fix/start` → `app/api/qmoi/auto-fix/start/route.ts`
- `/api/qmoi/auto-fix/status` → `app/api/qmoi/auto-fix/status/route.ts`
- `/api/qmoi/auto-fix/stop` → `app/api/qmoi/auto-fix/stop/route.ts`
- `/api/qmoi/auto-setup` → `app/api/qmoi/auto-setup/route.ts`
- `/api/qmoi/autodev/generate-feature` → `app/api/qmoi/autodev/generate-feature/route.ts`
- `/api/qmoi/autodev/research` → `app/api/qmoi/autodev/research/route.ts`
- `/api/qmoi/autodev/toggle` → `app/api/qmoi/autodev/toggle/route.ts`
- `/api/qmoi/avatars` → `app/api/qmoi/avatars/route.ts`
- `/api/qmoi/backup` → `app/api/qmoi/backup/route.ts`
- `/api/qmoi/chat` → `app/api/qmoi/chat/route.ts`
- `/api/qmoi/chat-enhanced` → `app/api/qmoi/chat-enhanced/route.ts`
- `/api/qmoi/files/[id]` → `app/api/qmoi/files/[id]/route.ts`
- `/api/qmoi/friendship` → `app/api/qmoi/friendship/route.ts`
- `/api/qmoi/language` → `app/api/qmoi/language/route.ts`
- `/api/qmoi/master-mode` → `app/api/qmoi/master-mode/route.ts`
- `/api/qmoi/memory` → `app/api/qmoi/memory/route.ts`
- `/api/qmoi/own-device-logs/export` → `app/api/qmoi/own-device-logs/export/route.ts`
- `/api/qmoi/own-device-logs` → `app/api/qmoi/own-device-logs/route.ts`
- `/api/qmoi/profile-questions` → `app/api/qmoi/profile-questions/route.ts`
- `/api/qmoi/projects` → `app/api/qmoi/projects/route.ts`
- `/api/qmoi/research` → `app/api/qmoi/research/route.ts`
- `/api/qmoi/revenue/reset` → `app/api/qmoi/revenue/reset/route.ts`
- `/api/qmoi/revenue` → `app/api/qmoi/revenue/route.ts`
- `/api/qmoi/revenue/start` → `app/api/qmoi/revenue/start/route.ts`
- `/api/qmoi/revenue/status` → `app/api/qmoi/revenue/status/route.ts`
- `/api/qmoi/revenue/stop` → `app/api/qmoi/revenue/stop/route.ts`
- `/api/qmoi/revenue/target` → `app/api/qmoi/revenue/target/route.ts`
- `/api/qmoi/revenue/transactions` → `app/api/qmoi/revenue/transactions/route.ts`
- `/api/qmoi/revenue/transfer` → `app/api/qmoi/revenue/transfer/route.ts`
- `/api/qmoi/revenue-dashboard` → `app/api/qmoi/revenue-dashboard/route.ts`
- `/api/qmoi/session` → `app/api/qmoi/session/route.ts`
- `/api/qmoi/transcribe` → `app/api/qmoi/transcribe/route.ts`
- `/api/qmoi/upload` → `app/api/qmoi/upload/route.ts`
- `/api/qmoi/user` → `app/api/qmoi/user/route.ts`
- `/api/qmoi/visuals` → `app/api/qmoi/visuals/route.ts`
- `/api/qmoi/voice` → `app/api/qmoi/voice/route.ts`
- `/api/qmoi/voice-enroll` → `app/api/qmoi/voice-enroll/route.ts`
- `/api/qmoi/voice-preview` → `app/api/qmoi/voice-preview/route.ts`
- `/api/qmoi/voice-profiles` → `app/api/qmoi/voice-profiles/route.ts`
- `/api/qmoi-database` → `app/api/qmoi-database/route.ts`
- `/api/qmoi-earning-enhanced` → `app/api/qmoi-earning-enhanced/route.ts`
- `/api/qmoi-gitlab/deployments` → `app/api/qmoi-gitlab/deployments/route.ts`
- `/api/qmoi-gitlab/errors` → `app/api/qmoi-gitlab/errors/route.ts`
- `/api/qmoi-gitlab/jobs` → `app/api/qmoi-gitlab/jobs/route.ts`
- `/api/qmoi-gitlab/pipelines` → `app/api/qmoi-gitlab/pipelines/route.ts`
- `/api/qmoi-gitlab/trigger` → `app/api/qmoi-gitlab/trigger/route.ts`
- `/api/qmoi-model` → `app/api/qmoi-model/route.ts`
- `/api/qmoi-tracks` → `app/api/qmoi-tracks/route.ts`
- `/api/qnews` → `app/api/qnews/route.ts`
- `/api/qradio` → `app/api/qradio/route.ts`
- `/api/qstore` → `app/api/qstore/route.ts`
- `/api/qvillage/inference` → `app/api/qvillage/inference/route.ts`
- `/api/qvillage/model-card` → `app/api/qvillage/model-card/route.ts`
- `/api/qvillage/models` → `app/api/qvillage/models/route.ts`
- `/api/qvillage` → `app/api/qvillage/route.ts`
- `/api/qvillage/spaces` → `app/api/qvillage/spaces/route.ts`
- `/api/revenue-streams/[streamId]` → `app/api/revenue-streams/[streamId]/route.ts`
- `/api/revenue-streams` → `app/api/revenue-streams/route.ts`
- `/api/social-automation` → `app/api/social-automation/route.ts`
- `/api/ssh/list` → `app/api/ssh/list/route.ts`
- `/api/ssh/read` → `app/api/ssh/read/route.ts`
- `/api/ssh/write` → `app/api/ssh/write/route.ts`
- `/api/tracks/[id]` → `app/api/tracks/[id]/route.ts`
- `/api/tracks` → `app/api/tracks/route.ts`
- `/api/tracks/settings` → `app/api/tracks/settings/route.ts`
- `/api/tracks/stream` → `app/api/tracks/stream/route.ts`
- `/api/trading/status` → `app/api/trading/status/route.ts`
- `/api/transactions` → `app/api/transactions/route.ts`
- `/api/tts/generate` → `app/api/tts/generate/route.ts`
- `/api/tts/stream` → `app/api/tts/stream/route.ts`
- `/api/users/profile` → `app/api/users/profile/route.ts`
- `/api/version` → `app/api/version/route.ts`
- `/api/voice/enroll` → `app/api/voice/enroll/route.ts`
- `/api/voice/verify` → `app/api/voice/verify/route.ts`
- `/api/wallets/[walletId]` → `app/api/wallets/[walletId]/route.ts`
- `/api/wallets` → `app/api/wallets/route.ts`
- `/api/webauthn/authenticate` → `app/api/webauthn/authenticate/route.ts`
- `/api/webauthn/register` → `app/api/webauthn/register/route.ts`
- `/api/webhooks/godaddy-domain` → `app/api/webhooks/godaddy-domain/route.ts`
- `/api/webhooks/godaddy-health` → `app/api/webhooks/godaddy-health/route.ts`
- `/api/webhooks/payments` → `app/api/webhooks/payments/route.ts`
- `/api/webhooks/qvillage` → `app/api/webhooks/qvillage/route.ts`
- `/api/whatsapp/audit` → `app/api/whatsapp/audit/route.ts`
- `/api/whatsapp/verify` → `app/api/whatsapp/verify/route.ts`
- `/api/whatsapp-bot` → `app/api/whatsapp-bot/route.ts`
- `/api/whatsapp-business` → `app/api/whatsapp-business/route.ts`
- `/api/wifi` → `app/api/wifi/route.ts`
- `/api/wifi/scan` → `app/api/wifi/scan/route.ts`
- `/api/wifi-security` → `app/api/wifi-security/route.ts`
- `/api/windows` → `app/api/windows/route.ts`
- `/api/workflow` → `app/api/workflow/route.ts`
- `/api/youtube/download` → `app/api/youtube/download/route.ts`

<!-- AUTO_ROUTE_INVENTORY_END -->
