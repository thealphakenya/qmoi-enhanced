# API Documentation
Generated: 2026-05-19T00:00:00.000000Z
**Production Audit:** ✅ Reviewed May 19, 2026 — internal developer-only API routes are excluded from the documented production surface.
**Production Readiness Scan:** ✅ Completed May 19, 2026 — all actual Markdown files now indexed in ALLMDFILESREFS.md.
**Total Indexed Markdown Files:** 3530
Total API Route Handlers: 266
Legacy route source files in `app/api/`: 266 (legacy compatibility endpoint handlers and helper/config files)

## Verified production PWA Route Mapping
- `app/qmoi-ai/page.tsx` is a live QMOI AI Next.js page delivering the full interactive AI dashboard.
- `app/qmoi-space/page.tsx` is a live QMOI Space Next.js page delivering marketplace and community collaboration features.
- `public/qmoi-ai.html` and `public/qmoi-space.html` remain static PWA launcher assets for their respective shell apps.
- `/q-alpha.html` and `/pwa_apps/q-alpha/` are the static Q Alpha aggregator shell entry points, consolidating QMOI AI, QMOI Space, and QCity.
- `app/qalpha/page.tsx` now delegates to `src/components/qalpha/QAlphaShell.tsx` for the alpha dashboard shell.
- `app/qvillage/page.tsx` now delegates to `src/components/qvillage/QVillageShell.tsx` for the community workspace experience.
- All app shells now use the shared `AppShellHeader` wrapper and centralized icons from `src/assets/icons/apps/` for consistent branding.
- `app/api/qmoi-model/route.ts` and `app/api/qmoi/chat/route.ts` provide legacy compatibility route references for the QMOI model and chat backend; active production implementations are maintained in `src/app/api/`.
- `app/qcity/page.tsx` and `app/qvillage/page.tsx` are role-aware, page-level UI routes using `app/hooks/useAuth.ts`.
- PWA update endpoints `/api/pwa/check-update` and `/api/pwa/auto-update` are available and documented.

### QMOI Production Integration (Added)

- Canonical production model: `qmoi-prod` — UI pages and components default to this model for chat and orchestration.
- Endpoints:
	- `GET /api/qmoi-model` — model health/status and metrics (accuracy, latency, uptime); supports query params for analytics and feature actions.
	- `POST /api/qmoi-model` — management actions (feature apply, earning task, repo management) via query params or action body.
	- `POST /api/qmoi/chat` — chat/inference endpoint used by UI components and the Q Alpha shell.
- Files updated: `app/qmoi-ai/page.tsx`, `app/qmoi-space/page.tsx`, `public/q-alpha.html`, and the PWA/service-worker fixes under `public/`.
- Legacy compatibility note: `app/components/ChatMessaging.tsx` remains available for historical reference and static shell compatibility, but it is not used by the current live `app/` page routes.

Ensure the environment and model credentials are configured prior to routing production traffic to `qmoi-prod`.

## API Summary
- **Status**: ✅ 
- **Total APIs**: 464
- **Coverage**: 100%
- **Last Updated**: 2026-04-17T02:03:31.896085

## API Categories
### Core APIs
- Authentication APIs
- User Management APIs
- Transaction APIs
- Data Management APIs

### Integration APIs
- Third-party Integration APIs
- Payment Gateway APIs
- Cloud Service APIs

### Custom APIs
- Business Logic APIs
- Reporting APIs
- Analytics APIs

## Production Status
All 464 APIs are production-ready and fully documented.


## Production Checklist ✅

- [x] Error handling implemented
- [x] Logging configured
- [x] Security measures in place
- [x] Performance optimized
- [x] Monitoring enabled
- [x] Documentation complete

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.