# QMOI Endpoint Inventory

This file lists the canonical HTTP endpoints implemented (or proxied) by the QMOI project. Use this as the single-source reference for API surface used by PWAs, supervisors and automation scripts.

Notes:
- Authentication: endpoints noted with (auth) expect a user JWT in `Authorization: Bearer <token>` unless otherwise stated. Admin endpoints require the `QMOI_CONTROL_TOKEN` via `Authorization: Bearer <token>` or `X-API-KEY` header.

## Control Server (`qmoi_control_server.py`)

- POST /control — (admin) issue commands for PWAs and orchestrator (navigate, download, voice)
- POST /ai — (auth) AI assistant endpoint (simulated)
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

- GET /mirror/app/<appname>/* — serve local PWA files (rewrites asset paths) or fallback to GitHub raw
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

If you add or change endpoints, please update this file and `docs/API.md`.
QMOI Control Server - Endpoints

This file enumerates the endpoints implemented by `qmoi_control_server.py` and related services.

Authentication: many endpoints require a JWT bearer token (created by `/login`) or the CONTROL_TOKEN for admin operations.

Public / unauthenticated:
- GET /health -> basic health check
- GET /mirror/raw/<path> -> serve repository files or redirect to GitHub raw
- GET /mirror/app/<appname>/[<path>] -> serve PWA app files or redirect to GitHub raw

Auth (user JWT required):
- POST /signup {username,password} -> create user (rate-limited)
- POST /login {username,password} -> returns JWT
- POST /logout -> revokes token (persists jti when available)
- POST /webauthn/register/options -> begin WebAuthn registration (CBOR)
- POST /webauthn/register/complete -> complete WebAuthn registration (CBOR)
- POST /webauthn/authenticate/options -> begin WebAuthn auth (CBOR)
- POST /webauthn/authenticate/complete -> complete WebAuthn auth (CBOR) -> returns JWT
- POST /ai {prompt} -> user AI endpoint (requires JWT)
- POST /ai/tts {prompt/text,voice?} -> prototype SSML response (requires JWT)
- POST /sync-memory {memories: [...]} -> merge memories for user (requires JWT)
- GET /memories -> list memories for user (requires JWT)
- POST /attachments {attachments:[{name,size,mime,dataUrlPreview,...}]} -> store light metadata (requires JWT)
- GET /attachments -> list attachments metadata for user (requires JWT)
- GET /attachments/<id>/download -> return dataUrl or base64 data for attachment (requires JWT)

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
