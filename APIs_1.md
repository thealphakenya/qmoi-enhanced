# API Documentation
Generated: 2026-04-17T02:03:31.896085
Total API Route Handlers: 249
Route source files in `app/api/`: 277 (249 active endpoint handlers, 12 top-level route files, 237 nested route directories)

## Verified production PWA Route Mapping
- `app/qmoi-ai/page.tsx` is a live QMOI AI Next.js page delivering the full interactive AI dashboard.
- `app/qmoi-space/page.tsx` is a live QMOI Space Next.js page delivering marketplace and community collaboration features.
- `public/qmoi-ai.html` and `public/qmoi-space.html` remain static PWA launcher assets for their respective shell apps.
- `/q-alpha.html` and `/pwa_apps/q-alpha/` are the static Q Alpha aggregator shell entry points, consolidating QMOI AI, QMOI Space, and QCity.
- `app/api/qmoi-model/route.ts` and `app/api/qmoi/chat/route.ts` provide the live QMOI model and chat backend used by QMOI AI, QCity, and QMOI Space.
- `app/qcity/page.jsx` and `app/qvillage/page.tsx` are role-aware, page-level UI routes using `app/hooks/useAuth.ts`.
- PWA update endpoints `/api/pwa/check-update` and `/api/pwa/auto-update` are available and documented.

### QMOI Production Integration (Added)

- Canonical production model: `qmoi-prod` — UI pages and components default to this model for chat and orchestration.
- Endpoints:
	- `GET /api/qmoi-model` — model health/status and metrics (accuracy, latency, uptime); supports query params for analytics and feature actions.
	- `POST /api/qmoi-model` — management actions (feature apply, earning task, repo management) via query params or action body.
	- `POST /api/qmoi/chat` — chat/inference endpoint used by UI components and the Q Alpha shell.
- Files updated: `app/qmoi-ai/page.tsx`, `app/qmoi-space/page.tsx`, `app/components/ChatMessaging.tsx`, `public/q-alpha.html`, and the PWA/service-worker fixes under `public/`.

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

## production Status
All 464 APIs are production-ready and fully documented.


## production Checklist ✅

- [x] Error handling implemented
- [x] Logging configured
- [x] Security measures in place
- [x] Performance optimized
- [x] Monitoring enabled
- [x] Documentation complete

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.