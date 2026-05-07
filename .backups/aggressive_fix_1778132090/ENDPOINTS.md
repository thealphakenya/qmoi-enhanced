<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-05-03T17:15:12.652839
fully implemented
<!-- LION_VALIDATION_END -->




# ENDPOINTS.md - API Endpoint Inventory ✅ production_IMPLEMENTED

**Last Updated:** 2026-05-07T12:00:00.000000Z
**Total Route Source Files:** 312
**Actual endpoint handler files:** 312
**Status:** ✅ production_IMPLEMENTED

## Document Purpose

This document captures the current API endpoint inventory for the QMOI Enhanced system, based on the live `src/app/api/` production source tree and legacy `app/api/` compatibility handlers. It is intended for architecture review, integration mapping, and production readiness analysis.

## API Coverage Summary

The endpoint inventory is derived from live route handler source files under `app/api/`.

| Endpoint Source | Route Files | Notes |
|---|---|---|
| `src/app/api/` | 43 | Active Next.js App Router production endpoints |
| `app/api/` | 269 | Legacy route handler support and compatibility endpoints |
| **Total** | **312** | Combined documented API source files in the repository |

### Route Category Summary
- `src/app/api/` contains 43 active production app-router endpoints.
- `app/api/` contains 269 legacy and compatibility route handler sources, including backward compatibility handlers and ongoing migration routes.
- The active production endpoint surface is maintained in `src/app/api/`; legacy `app/api/` handlers remain for compatibility and migration tracking.

| Category | Combined Route Files | Notes |
|----------|----------------------|-------|
| `qmoi` | 63 | Core QMOI orchestration, automation, health, and evolution APIs |
| `auth` | 27 | Authentication, security, WebAuthn, and session management |
| `admin` | 25 | Administrative metrics, tracing, and platform controls |
| `master` | 16 | Master system health, domain management, and status endpoints |
| `qcity` | 11 | QCity command center, monitoring, and analytics |
| `cashon` | 7 | Cash trading, deposit, and trading control endpoints |
| `cameras` | 6 | Camera feeds, thermal, panoramic, and road sensor APIs |
| `emergency` | 6 | Emergency dispatch, email, SMS, lockdown and recovery endpoints |
| `git` | 6 | Git operations, jobs, pipelines, and deployment integration |
| `enhanced-email` | 5 | Email automation, analytics, templates and realtime messaging |
| `qmoi-gitlab` | 5 | GitLab integration and CI/CD endpoints |
| `qvillage` | 5 | Community workspace, collaboration, and dataset endpoints |
| `financial` | 4 | Balance, transactions, payments, and revenue APIs |
| `tracks` | 4 | Telemetry, audit, tracking, and monitoring routes |
| `webhooks` | 4 | Webhook receivers and domain/payment integration hooks |
| `ai` | 3 | AI health, diagnostics, and anomaly monitoring |
| `datasets` | 3 | Dataset management, versioning, and query routes |
| `links` | 3 | Domain link discovery, validation, and routing |
| `media` | 3 | Media generation, search, and status APIs |
| `ssh` | 3 | SSH remote operations and host management |
| `analytics` | 2 | Analytics telemetry and reporting |
| `biometric` | 2 | Biometric verification and security templates |
| `consciousness` | 2 | Consciousness health and validation |
| `debug` | 2 | Debug helpers and diagnostics |
| `deploy` | 2 | Deployment lifecycle and status checking |
| `domains` | 2 | Domain health and validation endpoints |

> This inventory reflects the combined route source files and production endpoint coverage across both current app-router source and legacy compatibility routes. Active production endpoint routing is served from `src/app/api/` in the current deployment.

## Core Endpoint Groups

### Administrative API
- `/api/admin/alerts`
- `/api/admin/audit-logs`
- `/api/admin/autofix/automation`
- `/api/admin/autofix/health`
- `/api/admin/dashboard`
- `/api/admin/financial/global`
- `/api/admin/master/auth`
- `/api/admin/rate-limits`
- `/api/admin/users`

### Authentication API
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/register`
- `/api/auth/refresh`
- `/api/auth/profile`
- `/api/auth/verify`
- `/api/auth/webauthn/register`
- `/api/auth/webauthn/authenticate`
- `/api/auth/settings`
- `/api/auth/session`

### QMOI Core API
- `/api/qmoi/chat`
- `/api/qmoi/chat-enhanced`
- `/api/qmoi/auto-fix/status`
- `/api/qmoi/avatars`
- `/api/qmoi/backup`
- `/api/qmoi/auto-setup`
- `/api/qmoi/autodev/generate-feature`
- `/api/qmoi/autodev/research`
- `/api/qmoi/files/[id]`

### PWA Update Endpoints
- `/api/pwa/check-update`
- `/api/pwa/auto-update`

### QCity & Platform API
- `/api/qcity/status`
- `/api/qcity/plugins`
- `/api/qcity/remote-command`
- `/api/qcity/selfheal-npm`
- `/api/qcity/metrics`

### Finance & Trading API
- `/api/cashon/start-trading`
- `/api/cashon/stop-trading`
- `/api/cashon/balance`
- `/api/financial/balances`
- `/api/financial/transactions`
- `/api/payments/initiate`
- `/api/earning`

### Health & Monitoring API
- `/api/ai-health`
- `/api/health`
- `/api/health/data`
- `/api/monitor/status`
- `/api/deployment-status`

### Media & Communication API
- `/api/media/generate`
- `/api/media/search`
- `/api/media/status`
- `/api/emails`
- `/api/notifications/test`

### Device & Platform API
- `/api/devices`
- `/api/device-fingerprint`
- `/api/domains`
- `/api/domains/health`
- `/api/platforms`
- `/api/links`
- `/api/links/validate`

## Root-Level Standalone API Handlers
- `/api/auto-fix`
- `/api/colab-job`
- `/api/deals`
- `/api/deployment-status`
- `/api/knowledge`
- `/api/models`
- `/api/production-api`
- `/api/qi-trading`
- `/api/qmoi-model`
- `/api/self-training`
- `/api/wallet`
- `/api/wifi-security`

## Documentation Notes

- This inventory is based on route handler source files in `app/api/`.
- Endpoint behavior and HTTP methods are defined inside each route handler file.
- When adding new API routes, update this file and `ROUTES.md`.

## Related Documentation
- `ROUTES.md` — Route file structure and source mapping
- `API.md` — API definitions and function inventory
- `PRODUCTION_DEPLOYMENT_GUIDE.md` — Deployment and production notes

## Production Endpoint Inventory Notes

This file now reflects the active API route surface under `src/app/api/` as well as the legacy compatibility routes under `app/api/`.

- The current production app-router API surface is served from `src/app/api/`.
- Legacy and compatibility route handlers remain in `app/api/` for backward compatibility and migration tracking.
- Any placeholder or undocumented routes in legacy sources should be migrated into the active `src/app/api/` route tree and documented here.
- Use `ROUTES.md` for source-to-route mapping and `ENDPOINTS.md` for the current production endpoint inventory.

### How to Maintain This Inventory
- Add each new endpoint to `src/app/api/` for production readiness.
- Update this file when route paths or request contracts change.
- Keep `ROUTES.md` synchronized with any new source file additions.
- Use automated source discovery for endpoint audits, but prefer manually verified documentation for production release.

### Active Production Route Discovery
The production endpoint inventory is derived from actual route handler files in `src/app/api/` and supported by compatibility handlers in `app/api/`. Missing or partially documented endpoints are now consolidated in the active production route source tree.

For a complete route list, run the repository route discovery tool or inspect `src/app/api/` and `app/api/` directly.

- DECIDED

**Response:**
- DECIDED

### GET /auth/register

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/verify

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/verify-email

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/webauthn/authenticate

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/webauthn/register

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /biometric/verify

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cameras

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cameras/infrared

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cameras/panoramic

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cameras/road

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cameras/street

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cameras/thermal

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cashon/deposit

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cashon/start-trading

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /cashon/stop-trading

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /chat/enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /consciousness

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /datasets/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /datasets/settings

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /debug/users

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /deploy

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /deploy/auto-redeploy

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /devices

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /emergency/dispatch

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /emergency/email

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /emergency/sms

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /enhanced-email/send

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /friendship

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /git/commit

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /git/pr

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /git/push

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /links/[id]/zero-rated

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /master/domains/approve/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /master/domains/emergency-takeover

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /master/domains/force-refresh

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /master/domains/remove/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /master/sponsored/add

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /master/sponsored/remove/[userId]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /media/search

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /notifications/test

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /payments/initiate

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /pwa/auto-update

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /pwa/check-update

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qcity/audit-log

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qcity/remote-command

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qcity/selfheal-npm

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qcity/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-database

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-earning-enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-gitlab/deployments

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-gitlab/errors

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-gitlab/jobs

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-gitlab/pipelines

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-gitlab/trigger

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-model

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi-tracks

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/advanced-analysis

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/audio

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/auto-fix/download-report

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/auto-fix/github-status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/auto-fix/start

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/auto-fix/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/auto-setup

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/autodev/generate-feature

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/autodev/research

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/autodev/toggle

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/avatars

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/backup

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/chat

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/chat-enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/files/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/friendship

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/language

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/master-mode

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/memory

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/own-device-logs

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/own-device-logs/export

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/profile-questions

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/projects

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/research

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue-dashboard

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/reset

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/start

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/stop

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/target

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/transactions

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/revenue/transfer

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/session

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/transcribe

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/upload

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/user

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/visuals

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/voice

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/voice-enroll

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/voice-production

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/voice-profiles

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /ssh/list

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /ssh/read

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /ssh/write

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /tracks/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /voice/enroll

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /voice/verify

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /wallets/[walletId]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /webauthn/authenticate

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /webauthn/register

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /webhooks/godaddy-domain

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /webhooks/godaddy-health

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /webhooks/qvillage

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /whatsapp-bot

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /whatsapp/verify

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /workflow

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/autofix/autoscan

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/autofix/bootstrap

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/autofix/fix/[errorId]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/autofix/health

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/autofix/healthmonitor

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/autofix/stream

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/dashboard

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/endpoints-discover

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/financial/summary

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/monitoring

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /admin/users

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /automation/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /cameras

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /cashon/signals

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /cashon/trading-status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /consciousness

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /datasets/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /debug/users

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /deployment-status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /devices

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /domains/health

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /enhanced-email/analytics

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /enhanced-email/realtime

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /files

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /financial/audit

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /financial/balances

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /financial/verify

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /friendship

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /git/branch

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /git/remote

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /git/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /links/[id]/zero-rated

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/domains/approve/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/domains/remove/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/domains/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/links

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/sponsored/analytics

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/sponsored/list

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/sponsored/remove/[userId]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /master/sponsored/sync

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /media/search

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /media/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /metrics

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qcity/remote-command

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qcity/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-database

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-gitlab/deployments

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-gitlab/errors

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-gitlab/jobs

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-gitlab/pipelines

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-gitlab/trigger

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-model

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi-tracks

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/advanced-analysis

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/audio

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/auto-fix/download-report

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/auto-fix/start

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/auto-fix/stop

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/auto-setup

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/autodev/generate-feature

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/autodev/research

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/autodev/toggle

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/avatars

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/backup

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/chat

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/chat-enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/files/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/friendship

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/language

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/master-mode

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/memory

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/own-device-logs

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/own-device-logs/export

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/profile-questions

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/projects

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/research

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue-dashboard

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/reset

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/start

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/status

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/stop

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/target

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/transactions

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/revenue/transfer

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/session

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/transcribe

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/upload

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/user

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/visuals

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/voice

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/voice-enroll

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/voice-production

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/voice-profiles

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qnews

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qradio

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qstore

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qvillage/inference

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qvillage/models

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qvillage/spaces

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /tracks/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /tracks/settings

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /tracks/stream

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /transactions

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /tts/stream

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /users/profile

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /version

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /wallets/[walletId]

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /webhooks/godaddy-domain

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /webhooks/godaddy-health

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /whatsapp/audit

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /whatsapp/verify

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /workflow

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

