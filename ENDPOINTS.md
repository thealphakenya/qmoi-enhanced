---
title: "QMOI Endpoint Inventory"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Endpoint Inventory

This file lists the canonical HTTP endpoints implemented (or proxied) by the QMOI project. Use this as the single-source reference for API surface used by PWAs, supervisors and automation scripts.

Notes:

- Authentication: endpoints noted with (auth) expect a user JWT in `Authorization: Bearer <token>` unless otherwise stated. Admin endpoints require the `QMOI_CONTROL_TOKEN` via `Authorization: Bearer <token>` or `X-API-KEY` header.

## Control Server (`qmoi_control_server.py`)

- POST /control — (admin) issue commands for PWAs and orchestrator (navigate, download, voice)
- POST /ai — (auth) AI assistant endpoint — [app/api/ai/route.ts](app/api/ai/route.ts) (production-ready)
- POST /ai/tts — (auth) Prototype TTS/SSML generator (returns SSML hint)
- POST /signup — create a user
- POST /login — login, returns JWT
- POST /logout — revoke current JWT
- GET /health — simple L7 health check
- GET /ready — readiness probe (DB checks)
- GET /metrics — lightweight metrics (users, memories, attachments)

- POST /sync-memory — (auth) push client memories (autosync)
- GET /memories — (auth) list user memories

- POST /attachments — (auth) accept attachment metadata/preview
- GET /attachments — (auth) list attachments for user
- GET /attachments/<id>/download — (auth) retrieve attachment preview or data URL

- GET /mirror/app/<appname>/\* — serve local PWA files (rewrites asset paths) or fallback to GitHub raw
- GET /mirror/raw/<path> — serve local file or redirect to GitHub raw

- POST /admin/backup-db — (admin) create a DB backup copy in `downloads/`
- POST /admin/update-ngrok — (admin) run the ngrok update script (dry-run or apply)

## Admin user & pricing endpoints

- GET /admin/users — (master) list all registered users with pricing metadata
- POST /admin/set-pricing — (master) set pricing for a user {username, price_cents, tier, expires_at}
- GET /admin/check-access/<username>/<feature> — (master) check whether a user has access to a feature

## Sponsored user endpoints

- POST /sponsored/add — (admin/master) add a user to the sponsored list
- GET /sponsored/list — (auth) list sponsored users

## Wallets (CashOn)

- GET /wallet — (auth) get your wallet balance
- POST /wallet/credit — (master) credit a user's wallet {username, amount_cents}
- POST /wallet/debit — (master) debit a user's wallet {username, amount_cents}

## WebAuthn endpoints

- POST /webauthn/register/options — begin registration (CBOR)
- POST /webauthn/register/complete — finish registration (CBOR)
- POST /webauthn/authenticate/options — begin authentication (CBOR)
- POST /webauthn/authenticate/complete — finish authentication (CBOR)

## Notes for other services

- QMOI integrates with auxiliary services and scripts present in the repo (see `scripts/` and `pwa_apps/`):
  - `scripts/update_ngrok_links.py` — repo-wide ngrok URL updater used by `/admin/update-ngrok`
  - `scripts/ensure_qmoi_servers.sh` — lightweight supervisor for dev
  - PWAs under `pwa_apps/` consume `/control`, `/ai`, `/sync-memory` and attachments endpoints for autosync and UI features

If you add or change endpoints, please update this file and `docs/API.md`. For local dev/testing notes see `docs/LOCAL_QMOI_DEVELOPMENT.md`.
QMOI Control Server - Endpoints

This file enumerates the endpoints implemented by `qmoi_control_server.py` and related services.

Authentication: many endpoints require a JWT bearer token (created by `/login`) or the CONTROL_TOKEN for admin operations.

Public / unauthenticated:

- GET /health -> basic health check
- GET /mirror/raw/<path> -> serve repository files or redirect to GitHub raw
- GET /mirror/app/<appname>/[<path>] -> serve PWA app files or redirect to GitHub raw

---

NOTE: endpoint inventory was created from a repository scan. For a machine-readable report of where placeholder tokens or missing docs were found, see `docs/placeholders_report.json`. For the canonical test matrix that exercises these endpoints see `docs/ALLTESTSAUTOTESTS.md`.

To request an automated verification run (extract runtime route signatures and run integration tests against a local server), say: "verify endpoints now" and I'll run the harness and update this document with test results.

Auth (user JWT required):

The following API routes are implemented under `app/api/*/route.ts`. Each bullet below shows the production route path (prefixed with `/api`) and a link to the handler implementation so you can inspect exact method signatures, request/response shapes and auth requirements.

Note: many routes require a user JWT in `Authorization: Bearer <token>`; some are admin-only. See each linked `route.ts` for exact checks and role requirements.

Implemented API routes (auto-synced with code):

- /api/auth/signup — [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)
- /api/auth/signin — [app/api/auth/signin/route.ts](app/api/auth/signin/route.ts)
- /api/auth/login — [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
- /api/auth/register — [app/api/auth/register/route.ts](app/api/auth/register/route.ts)
- /api/auth/profile — [app/api/auth/profile/route.ts](app/api/auth/profile/route.ts)
- /api/auth/settings — [app/api/auth/settings/route.ts](app/api/auth/settings/route.ts)
- /api/auth/biometric/capture — [app/api/auth/biometric/capture/route.ts](app/api/auth/biometric/capture/route.ts)
- /api/auth/webauthn/register — [app/api/auth/webauthn/register/route.ts](app/api/auth/webauthn/register/route.ts)
- /api/auth/webauthn/authenticate — [app/api/auth/webauthn/authenticate/route.ts](app/api/auth/webauthn/authenticate/route.ts)

- /api/qmoi/chat — [app/api/qmoi/chat/route.ts](app/api/qmoi/chat/route.ts)
- /api/qmoi/memory — [app/api/qmoi/memory/route.ts](app/api/qmoi/memory/route.ts)
- /api/qmoi/session — [app/api/qmoi/session/route.ts](app/api/qmoi/session/route.ts)
- /api/qmoi/user — [app/api/qmoi/user/route.ts](app/api/qmoi/user/route.ts)
- /api/qmoi/model — [app/api/qmoi-model/route.ts](app/api/qmoi-model/route.ts)
- /api/qmoi/language — [app/api/qmoi/language/route.ts](app/api/qmoi/language/route.ts)

- /api/qvillage — [app/api/qvillage/route.ts](app/api/qvillage/route.ts)
- /api/qvillage/communities — (see `app/api/qvillage/route.ts`)

- /api/qmoi/voice-enroll — [app/api/qmoi/voice-enroll/route.ts](app/api/qmoi/voice-enroll/route.ts)
- /api/qmoi/voice-profiles — [app/api/qmoi/voice-profiles/route.ts](app/api/qmoi/voice-profiles/route.ts)
- /api/qmoi/voice-preview — [app/api/qmoi/voice-preview/route.ts](app/api/qmoi/voice-preview/route.ts)

- /api/webauthn/register — [app/api/webauthn/register/route.ts](app/api/webauthn/register/route.ts)
- /api/webauthn/authenticate — [app/api/webauthn/authenticate/route.ts](app/api/webauthn/authenticate/route.ts)

- /api/health — [app/api/health/route.ts](app/api/health/route.ts)
- /api/version — [app/api/version/route.ts](app/api/version/route.ts)

- /api/wallets — [app/api/wallets/route.ts](app/api/wallets/route.ts)
- /api/wallets/{walletId} — [app/api/wallets/[walletId]/route.ts](app/api/wallets/[walletId]/route.ts)

- /api/transactions — [app/api/transactions/route.ts](app/api/transactions/route.ts)

- /api/media/generate — [app/api/media/generate/route.ts](app/api/media/generate/route.ts)
- /api/media/status — [app/api/media/status/route.ts](app/api/media/status/route.ts)

- /api/admin/users — [app/api/admin/users/route.ts](app/api/admin/users/route.ts)
- /api/admin/alerts — [app/api/admin/alerts/route.ts](app/api/admin/alerts/route.ts)
- /api/admin/audit-logs — [app/api/admin/audit-logs/route.ts](app/api/admin/audit-logs/route.ts)
- /api/admin/monitoring — [app/api/admin/monitoring/route.ts](app/api/admin/monitoring/route.ts)
- /api/admin/rate-limits — [app/api/admin/rate-limits/route.ts](app/api/admin/rate-limits/route.ts)

- /api/deploy — [app/api/deploy/route.ts](app/api/deploy/route.ts)
- /api/deploy/auto-redeploy — [app/api/deploy/auto-redeploy/route.ts](app/api/deploy/auto-redeploy/route.ts)
- /api/deployment-status — [app/api/deployment-status/route.ts](app/api/deployment-status/route.ts)

- /api/git/branch — [app/api/git/branch/route.ts](app/api/git/branch/route.ts)
- /api/git/commit — [app/api/git/commit/route.ts](app/api/git/commit/route.ts)
- /api/git/pr — [app/api/git/pr/route.ts](app/api/git/pr/route.ts)
- /api/git/push — [app/api/git/push/route.ts](app/api/git/push/route.ts)
- /api/git/status — [app/api/git/status/route.ts](app/api/git/status/route.ts)

- /api/qmoi/auto-fix/start — [app/api/qmoi/auto-fix/start/route.ts](app/api/qmoi/auto-fix/start/route.ts)
- /api/qmoi/auto-fix/stop — [app/api/qmoi/auto-fix/stop/route.ts](app/api/qmoi/auto-fix/stop/route.ts)
- /api/qmoi/auto-fix/status — [app/api/qmoi/auto-fix/status/route.ts](app/api/qmoi/auto-fix/status/route.ts)
- /api/qmoi/auto-fix/download-report — [app/api/qmoi/auto-fix/download-report/route.ts](app/api/qmoi/auto-fix/download-report/route.ts)

- /api/whatsapp-bot — [app/api/whatsapp-bot/route.ts](app/api/whatsapp-bot/route.ts)
- /api/whatsapp/business — [app/api/whatsapp-business/route.ts](app/api/whatsapp-business/route.ts)
- /api/whatsapp/verify — [app/api/whatsapp/verify/route.ts](app/api/whatsapp/verify/route.ts)

- /api/qnews — [app/api/qnews/route.ts](app/api/qnews/route.ts)
- /api/qradio — [app/api/qradio/route.ts](app/api/qradio/route.ts)

- /api/metrics — [app/api/metrics/route.ts](app/api/metrics/route.ts)
- /api/monitor/status — [app/api/monitor/status/route.ts](app/api/monitor/status/route.ts)

- /api/mpesa/callback — [app/api/mpesa/callback/route.ts](app/api/mpesa/callback/route.ts)
- /api/payments/initiate — [app/api/payments/initiate/route.ts](app/api/payments/initiate/route.ts)
- /api/webhooks/payments — [app/api/webhooks/payments/route.ts](app/api/webhooks/payments/route.ts)

- /api/qapikey — [app/api/qapikey/route.ts](app/api/qapikey/route.ts)

- /api/ssh/list — [app/api/ssh/list/route.ts](app/api/ssh/list/route.ts)
- /api/ssh/read — [app/api/ssh/read/route.ts](app/api/ssh/read/route.ts)
- /api/ssh/write — [app/api/ssh/write/route.ts](app/api/ssh/write/route.ts)

- /api/wifi — [app/api/wifi/route.ts](app/api/wifi/route.ts)
- /api/wifi/scan — [app/api/wifi/scan/route.ts](app/api/wifi/scan/route.ts)
- /api/wifi-security — [app/api/wifi-security/route.ts](app/api/wifi-security/route.ts)

- /api/voice/enroll — [app/api/voice/enroll/route.ts](app/api/voice/enroll/route.ts)
- /api/voice/verify — [app/api/voice/verify/route.ts](app/api/voice/verify/route.ts)

- (and many more — inspect `app/api/` for a complete list)

If you need method/param/response details for any route, open the linked `route.ts` file and the corresponding service in `lib/` (for example, `lib/auth-service.ts`, `lib/qmoi-service.ts`).

Admin / control (CONTROL_TOKEN required as Authorization: Bearer <token> or X-API-KEY):

- POST /control {command,target,...} -> control actions (navigate, download, voice)
- POST /admin/backup-db -> create local DB backup
- POST /admin/update-ngrok {apply:bool?} -> run local update_ngrok_links.py (dry-run by default)

Orchestration / observability (for supervisors):

- GET /ready -> readiness probe (DB accessible)
- GET /metrics -> lightweight counts of users, memories, attachments

Notes:

- All endpoints are implemented in `qmoi_control_server.py` and persist to `qmoi.db` by default.
- Attachment downloads are prototype only; production should use signed object storage.

<!-- QMOI_VALIDATION_START -->

{
"file": "ENDPOINTS.md",
"validated_at": "2025-10-26T20:51:22.297416Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Endpoint Inventory"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
