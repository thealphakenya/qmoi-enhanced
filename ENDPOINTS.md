<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-28T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# ENDPOINTS.md - API Endpoint Inventory ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total Route Source Files:** 267
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
| `master/` | 13 | Master orchestration, coordination, high-level control routes |
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
