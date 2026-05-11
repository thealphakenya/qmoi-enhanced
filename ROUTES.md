<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-28T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# ROUTES.md - Application Route File Structure ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total Route Source Files:** 267
**Status:** ✅ production_IMPLEMENTED

## Document Purpose

This document describes the route file structure for the QMOI Enhanced application, mapping the `app/api/` source tree to the available endpoint route handlers.

## Route File Inventory Summary

### Total Route Files
- `app/api/` route handler source files: 267
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
- `analytics/` — 2 files
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

## PWA and Public Route Mapping
- `app/qmoi-ai/page.tsx` redirects to the actual PWA asset at `/pwa_apps/qmoi-ai/index.html`.
- `app/qmoi-space/page.tsx` redirects to the actual PWA asset at `/pwa_apps/qmoi-space/index.html`.
- `public/qmoi-ai.html` and `public/qmoi-space.html` are redirect landing pages for the real PWA apps.
- `app/qcity/page.jsx` and `app/qvillage/page.tsx` are served as active role-aware UI pages using `app/hooks/useAuth.ts`.

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
- `PRODUCTIONices.ts`
- `status/route.ts`
- `plugins.ts`
- `remote-command/route.ts`
- `selfheal-npm/route.ts`

### `cashon/`
- `balance/route.ts`
- `deposit/route.ts`
- `signals/route.ts`
- `start-trading/route.ts`
- `stop-trading/route.ts`
- `trading-status/route.ts`

## Route Management Notes

- Route file names under `app/api/` map directly to deployed URL paths.
- Nested folders and dynamic segments such as `[id]` define parameterized route behavior.
- When adding or removing API routes, update both this document and `ENDPOINTS.md`.

## Related Documentation
- `ENDPOINTS.md` — API endpoint inventory
- `API.md` — API function and action inventory
- `PRODUCTION_DEPLOYMENT_GUIDE.md` — Deployment procedures
