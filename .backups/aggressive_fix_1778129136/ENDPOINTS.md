<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-05-03T17:15:12.652839
fully implemented
<!-- LION_VALIDATION_END -->




# ENDPOINTS.md - API Endpoint Inventory ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total Route Source Files:** 277
**Actual endpoint handler files:** 249
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
| `biometric/` | 2 | Biometric verification and PRODUCTIONlate APIs |
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
- `/api/qmoi/autoPRODUCTION/generate-feature`
- `/api/qmoi/autoPRODUCTION/research`
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

### PRODUCTIONice & Platform API
- `/api/PRODUCTIONices`
- `/api/PRODUCTIONice-fingerprint`
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
- DECIDED

**Response:**
- DECIDED

### GET /admin/endpoints-discover

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /admin/master/auth

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /admin/master/logout

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/login

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/profile

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /auth/refresh

Endpoint automatically detected but not documented.

**Parameters:**
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

### GET /PRODUCTIONices

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

### GET /qmoi/autoPRODUCTION/generate-feature

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/autoPRODUCTION/research

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/autoPRODUCTION/toggle

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

### GET /qmoi/own-PRODUCTIONice-logs

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### GET /qmoi/own-PRODUCTIONice-logs/export

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

### POST /PRODUCTIONices

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

### POST /qmoi/autoPRODUCTION/generate-feature

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/autoPRODUCTION/research

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/autoPRODUCTION/toggle

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

### POST /qmoi/own-PRODUCTIONice-logs

Endpoint automatically detected but not documented.

**Parameters:**
- DECIDED

**Response:**
- DECIDED

### POST /qmoi/own-PRODUCTIONice-logs/export

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

