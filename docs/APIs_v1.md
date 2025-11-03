# QMOI API snapshot (APIs_v1)

This file is an automated snapshot of commonly used API endpoints implemented under `app/api/**`.
Mutating endpoints are *proposal-first* by default and require explicit production confirmation (`PRODUCTION_CONFIRMED=true` + `--real`) to actually perform state-changing actions. All mutating endpoints write proposals to `.qmoi_validation/` when not run in confirmed production mode.

## Auth model
- Primary gating: `QMOI_API_KEY` via header `x-qmoi-api-key` or `Authorization: Bearer <key>` — enforced by `lib/proposals.requireApiKey()`.
- Master-level operations: some endpoints still require `MASTER_TOKEN` in `Authorization: Bearer <MASTER_TOKEN>` header.

---

## /api/qmoi/auto-fix/start  (POST)
- Purpose: Start the auto-fix process for repository (runs `scripts/qmoi_auto_fix_enhanced.py`).
- Auth: `x-qmoi-api-key` or `MASTER_TOKEN`.
- Behavior: writes proposal unless `PRODUCTION_CONFIRMED=true` and `--real` present; when allowed, spawns the auto-fix process.

## /api/qmoi/auto-fix/status  (GET)
- Purpose: Get current status and latest report for auto-fix runs.
- Auth: `x-qmoi-api-key` (gated).
- Read-only.

## /api/qmoi/auto-fix/stop  (POST)
- Purpose: Stop running auto-fix processes (kill processes matching `qmoi_auto_fix`).
- Auth: `x-qmoi-api-key` and `MASTER_TOKEN` where configured.
- Behavior: proposal-first for safety; writes proposal when not confirmed.

## /api/qmoi/auto-fix/download-report  (GET)
- Purpose: Download the latest auto-fix JSON report.
- Auth: `x-qmoi-api-key`.
- Behavior: read-only; logs access to `logs/download_fixes.log` (best-effort).

## /api/qmoi/auto-fix/github-status  (GET)
- Purpose: Inspect GitHub Actions/workflow presence and recent runs for auto-fix workflows.
- Auth: `x-qmoi-api-key`.
- Behavior: read-only.

---

## /api/cashon/*
- GET /api/cashon/balance — returns balances via `cashonWallet.getBalance()` (MASTER_TOKEN required)
- GET /api/cashon/trading-status — returns trading status
- GET /api/cashon/qmoi-status — returns trader status
- GET /api/cashon/signals — returns recent signals
- GET /api/cashon/performance — returns performance metrics

- POST /api/cashon/deposit — propose or initiate deposit
- POST /api/cashon/approve-deposit — propose or approve deposit
- POST /api/cashon/withdraw — propose or withdraw funds
- POST /api/cashon/start-trading — propose or start AI trading
- POST /api/cashon/stop-trading — propose or stop AI trading
- POST /api/cashon/trade — propose or execute trade
- POST /api/cashon/approve-trade — propose or approve trade

- Auth: Master-level operations require `MASTER_TOKEN`; all endpoints also validate `x-qmoi-api-key` if configured.
- Behavior: Mutating POSTs are proposal-first and write proposals to `.qmoi_validation/` when not confirmed.

---

## /api/qi-trading (GET, POST)
- GET /api/qi-trading?stats=1 — returns trading statistics (mocked/stubbed data)
- GET /api/qi-trading?history=1 — returns trade history (mocked)
- GET /api/qi-trading?active=1 — returns active trades (mocked)

- POST /api/qi-trading (body: { action: 'execute'|'cancel', trade }) — proposal-first for execute/cancel. Writes proposals when not confirmed.
- Auth: `x-qmoi-api-key` recommended (enforced).

---

## Autodev & Adapter endpoints (added by conservative autodev pass)

The repo includes conservative autodev and adapter endpoints under `/api/autodev/*` and `/api/adapters/*`. These endpoints follow the repository-wide policy: proposal-first / dry-run by default and explicit production gating is required to perform external or destructive actions.

- POST /api/autodev/suggest-restore
	- Request body: { path: string }
	- Returns a suggested restore candidate and snapshot id (dry-run). Writes a suggest-restore audit entry to `.qmoi_validation/autodev-audit.log`.

- POST /api/autodev/restore
	- Request body: { snapshot: string, path: string, confirm?: boolean }
	- Behavior: If `PRODUCTION_CONFIRMED=true` in the environment and `confirm=true` is passed, the endpoint will request a real restore; otherwise it performs a dry-run and logs the intent.

- POST /api/adapters/mail
	- Request body: { action: string, ... }
	- Behavior: Records the requested mail action to `.qmoi_validation/adapter-audit.log` and returns a dry-run response. If `PRODUCTION_CONFIRMED=true` and `SENDGRID_API_KEY` is present, the adapter will attempt a provider call (scaffolded; production calls are intentionally conservative).

- POST /api/adapters/telephony
	- Request body: { action: string, ... }
	- Behavior: Records the telephony action to `.qmoi_validation/adapter-audit.log`. Actual telephony calls only run when `PRODUCTION_CONFIRMED=true` and Twilio creds are configured.

Notes:
- Audit and proposal files live under `.qmoi_validation/` — review them before enabling production behavior.
- The autodev manager script lives at `scripts/autodev_manager.py` and provides CLI snapshot/list/suggest-restore/restore commands (dry-run by default).

## Notes
- Proposal files can be found in `.qmoi_validation/` (e.g., `proposal-*.json`, `placeholders_proposal_*.json`). Review them before applying.
- To apply a proposal and run a mutating action, *set* `PRODUCTION_CONFIRMED=true` in the environment and run the server with `--real` in the process arguments (or use a patched runner that forwards this flag). This gating is intentional to prevent accidental destructive actions.

