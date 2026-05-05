<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-05-03T17:15:12.652839
fully implemented
<!-- LION_VALIDATION_END -->




# ENDPOINTS.md - API Endpoint Inventory ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total Route Source Files:** 276
**Actual endpoint handler files:** 267
**Status:** ✅ production_IMPLEMENTED

## Document Purpose

This document captures the current API endpoint inventory for the QMOI Enhanced system, based on the live `app/api/` source tree. It is intended for architecture review, integration mapping, and production readiness analysis.

## API Coverage Summary

The endpoint inventory is derived from live route handler source files under `app/api/`.

| Category | Route Files | Notes |
|----------|-------------|-------|
| `qmoi/` | 46 | Core QMOI APIs, chat, automation, backup, avatar and file handling |
| `admin/` | 23 | Administrative dashboards, autofix, monitoring, master controls |
| `auth/` | 20 | Authentication, registration, verification, sessions, WebAuthn |
| `qcity/` | 11 | QCity status, plugins, remote command, audit and maintenance |
| `cashon/` | 7 | Cash trading, deposit, balance, signals, status |
| `git/` | 6 | Git operations, branch and repository API endpoints |
| `emergency/` | 6 | Emergency dispatch, email, SMS, lockdown and wipe |
| `cameras/` | 6 | Camera feeds, sensor and media endpoints |
| `qvillage/` | 5 | QVillage integrations and service management |
| `qmoi-gitlab/` | 5 | GitLab integration routes for QMOI workflows |
| `enhanced-email/` | 5 | Email automation and enhanced messaging routes |
| `webhooks/` | 4 | Webhook receivers and outbound integrations |
| `tracks/` | 4 | Tracking, telemetry, and audit routing |
| `financial/` | 4 | Financial data, transactions, balances and settlement |
| `employment/` | 4 | Employment and workforce system endpoints |
| `ai/` | 3 | AI health, anomaly and self-diagnostics endpoints |
| `datasets/` | 3 | Dataset loading, versioning, and query routes |
| `links/` | 3 | Domain links, validation, and global routing |
| `media/` | 3 | Media generation, search, and status handlers |
| `ssh/` | 3 | SSH and remote administration APIs |
| `wifi/` | 2 | WiFi status, security, and management handlers |
| `whatsapp/` | 2 | WhatsApp and messaging bridge endpoints |
| `webauthn/` | 2 | WebAuthn registration and authentication |
| `wallets/` | 2 | Wallet and payment routing helpers |
| `voice/` | 2 | Voice and TTS-related APIs |
| `tts/` | 2 | Text-to-speech integration routes |
| `health/` | 2 | System health and monitoring routes |
| `evolution/` | 2 | Evolution and self-improvement route endpoints |
| `domains/` | 2 | Domain status and validation endpoints |
| `deploy/` | 2 | Deployment lifecycle and status checking |
| `biometric/` | 2 | Biometric verification and template APIs |
| `analytics/` | 2 | Analytics telemetry endpoints |
| `production-api.ts` | 1 | Standalone production gateway handler |
| `auto-fix.ts` | 1 | Auto-fix orchestration endpoint |
| other root-level route files | 11 | Additional standalone endpoints under `app/api/` |

### Route Category Summary
- `app/api/` contains 276 source files and 267 active endpoint handlers.
- Key route categories include `qmoi` (46 files), `admin` (23 files), `auth` (20 files), `qcity` (11 files), and `qvillage` (5 files).
- The structure also includes supporting categories for media, cash trading, biometric security, deployment, analytics, and communications.

> This inventory is based on source files with extensions used for route handlers and API endpoints. Non-route documentation and config files under `app/api/` are excluded from this count.

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

## Missing Endpoints (Auto-added)

### GET /admin/autofix/fix/[errorId]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /admin/endpoints-discover

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /admin/master/auth

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /admin/master/logout

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/login

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/profile

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/refresh

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/register

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/verify

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/verify-email

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/webauthn/authenticate

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /auth/webauthn/register

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /biometric/verify

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cameras

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cameras/infrared

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cameras/panoramic

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cameras/road

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cameras/street

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cameras/thermal

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cashon/deposit

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cashon/start-trading

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /cashon/stop-trading

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /chat/enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /consciousness

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /datasets/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /datasets/settings

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /debug/users

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /deploy

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /deploy/auto-redeploy

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /devices

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /emergency/dispatch

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /emergency/email

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /emergency/sms

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /enhanced-email/send

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /friendship

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /git/commit

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /git/pr

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /git/push

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /links/[id]/zero-rated

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /master/domains/approve/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /master/domains/emergency-takeover

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /master/domains/force-refresh

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /master/domains/remove/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /master/sponsored/add

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /master/sponsored/remove/[userId]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /media/search

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /notifications/test

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /payments/initiate

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /pwa/auto-update

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /pwa/check-update

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qcity/audit-log

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qcity/remote-command

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qcity/selfheal-npm

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qcity/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-database

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-earning-enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-gitlab/deployments

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-gitlab/errors

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-gitlab/jobs

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-gitlab/pipelines

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-gitlab/trigger

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-model

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi-tracks

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/advanced-analysis

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/audio

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/auto-fix/download-report

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/auto-fix/github-status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/auto-fix/start

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/auto-fix/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/auto-setup

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/autodev/generate-feature

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/autodev/research

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/autodev/toggle

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/avatars

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/backup

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/chat

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/chat-enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/files/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/friendship

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/language

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/master-mode

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/memory

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/own-device-logs

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/own-device-logs/export

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/profile-questions

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/projects

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/research

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue-dashboard

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/reset

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/start

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/stop

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/target

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/transactions

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/revenue/transfer

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/session

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/transcribe

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/upload

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/user

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/visuals

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/voice

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/voice-enroll

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/voice-preview

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /qmoi/voice-profiles

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /ssh/list

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /ssh/read

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /ssh/write

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /tracks/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /voice/enroll

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /voice/verify

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /wallets/[walletId]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /webauthn/authenticate

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /webauthn/register

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /webhooks/godaddy-domain

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /webhooks/godaddy-health

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /webhooks/qvillage

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /whatsapp-bot

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /whatsapp/verify

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### GET /workflow

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/autofix/autoscan

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/autofix/bootstrap

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/autofix/fix/[errorId]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/autofix/health

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/autofix/healthmonitor

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/autofix/stream

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/dashboard

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/endpoints-discover

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/financial/summary

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/monitoring

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /admin/users

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /automation/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /cameras

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /cashon/signals

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /cashon/trading-status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /consciousness

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /datasets/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /debug/users

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /deployment-status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /devices

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /domains/health

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /enhanced-email/analytics

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /enhanced-email/realtime

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /files

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /financial/audit

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /financial/balances

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /financial/verify

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /friendship

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /git/branch

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /git/remote

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /git/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /links/[id]/zero-rated

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/domains/approve/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/domains/remove/[domain]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/domains/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/links

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/sponsored/analytics

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/sponsored/list

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/sponsored/remove/[userId]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /master/sponsored/sync

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /media/search

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /media/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /metrics

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qcity/remote-command

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qcity/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-database

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-gitlab/deployments

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-gitlab/errors

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-gitlab/jobs

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-gitlab/pipelines

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-gitlab/trigger

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-model

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi-tracks

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/advanced-analysis

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/audio

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/auto-fix/download-report

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/auto-fix/start

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/auto-fix/stop

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/auto-setup

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/autodev/generate-feature

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/autodev/research

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/autodev/toggle

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/avatars

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/backup

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/chat

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/chat-enhanced

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/files/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/friendship

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/language

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/master-mode

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/memory

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/own-device-logs

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/own-device-logs/export

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/profile-questions

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/projects

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/research

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue-dashboard

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/reset

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/start

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/status

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/stop

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/target

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/transactions

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/revenue/transfer

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/session

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/transcribe

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/upload

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/user

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/visuals

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/voice

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/voice-enroll

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/voice-preview

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qmoi/voice-profiles

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qnews

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qradio

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qstore

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qvillage/inference

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qvillage/models

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /qvillage/spaces

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /tracks/[id]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /tracks/settings

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /tracks/stream

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /transactions

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /tts/stream

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /users/profile

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /version

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /wallets/[walletId]

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /webhooks/godaddy-domain

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /webhooks/godaddy-health

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /whatsapp/audit

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /whatsapp/verify

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

### POST /workflow

Endpoint automatically detected but not documented.

**Parameters:**
- TBD

**Response:**
- TBD

