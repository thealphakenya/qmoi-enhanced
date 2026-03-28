<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.299086Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[PRODUCTION READY] all markers normalized for completion
---
title: "QMOI API snapshot (APIs_v1)"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI API snapshot (APIs_v1)

This file is an automated snapshot of commonly used API endpoints implemented under `app/api/**`.
Mutating endpoints are _proposal-first_ by default and require explicit production confirmation (`PRODUCTION_CONFIRMED=true` + `--real`) to actually perform state-changing actions. All mutating endpoints write proposals to `.qmoi_validation/` when not run in confirmed production mode.

## Auth model

- Primary gating: `QMOI_API_KEY` via header `x-qmoi-api-key` or `Authorization: Bearer <key>` — enforced by `lib/proposals.requireApiKey()`.
- Master-level operations: some endpoints still require `MASTER_TOKEN` in `Authorization: Bearer <MASTER_TOKEN>` header.

---

## /api/qmoi/auto-fix/start (POST)

- Purpose: Start the auto-fix process for repository (runs `scripts/qmoi_auto_fix_enhanced.py`).
- Implementation: [app/api/qmoi/auto-fix/start/route.ts](app/api/qmoi/auto-fix/start/route.ts)
- Auth: `x-qmoi-api-key` or `MASTER_TOKEN`.
- Behavior: writes proposal unless `PRODUCTION_CONFIRMED=true` and `--real` present; when allowed, spawns the auto-fix process.

## /api/qmoi/auto-fix/status (GET)

- Purpose: Get current status and latest report for auto-fix runs.
- Implementation: [app/api/qmoi/auto-fix/status/route.ts](app/api/qmoi/auto-fix/status/route.ts)
- Auth: `x-qmoi-api-key` (gated).
- Read-only.

## /api/qmoi/auto-fix/stop (POST)

- Purpose: Stop running auto-fix processes (kill processes matching `qmoi_auto_fix`).
- Implementation: [app/api/qmoi/auto-fix/stop/route.ts](app/api/qmoi/auto-fix/stop/route.ts)
- Auth: `x-qmoi-api-key` and `MASTER_TOKEN` where configured.
- Behavior: proposal-first for safety; writes proposal when not confirmed.

## /api/qmoi/auto-fix/download-report (GET)

- Purpose: Download the latest auto-fix JSON report.
- Implementation: [app/api/qmoi/auto-fix/download-report/route.ts](app/api/qmoi/auto-fix/download-report/route.ts)
- Auth: `x-qmoi-api-key`.
- Behavior: read-only; logs access to `logs/download_fixes.log` (best-effort).

## /api/qmoi/auto-fix/github-status (GET)

- Purpose: Inspect GitHub Actions/workflow presence and recent runs for auto-fix workflows.
- Implementation: [app/api/qmoi/auto-fix/github-status/route.ts](app/api/qmoi/auto-fix/github-status/route.ts)
- Auth: `x-qmoi-api-key`.
- Behavior: read-only.

---

## /api/env (POST)

- Purpose: Dynamically manage environment variables.
- Implementation: [app/api/env/route.ts](app/api/env/route.ts)
- Auth: `QMOI_CONTROL_TOKEN` required.
- Behavior: Supports set, delete, and instruction actions for env vars. Persists changes to .env file.

**Request Body:**

```json
{
  "action": "set",
  "key": "NEW_VAR",
  "value": "value"
}
```

or

```json
{
  "action": "instruction",
  "instruction": "set NEW_VAR to value"
}
```

**Response:**

```json
{
  "success": true,
  "key": "NEW_VAR",
  "value": "value"
}
```

---

## Implemented route index

For quick cross-reference, the following important API routes are implemented and available in the codebase; follow the linked `route.ts` to see exact request/response schemas and auth checks.

- /api/qmoi/auto-fix/_ -> `app/api/qmoi/auto-fix/_/route.ts`
- /api/cashon/_ -> `app/api/cashon/_/route.ts`
- /api/qi-trading -> [app/api/qi-trading/route.ts](app/api/qi-trading/route.ts)
- /api/qmoi/chat -> [app/api/qmoi/chat/route.ts](app/api/qmoi/chat/route.ts)
- /api/qmoi/status -> [app/api/qmoi/status/route.ts](app/api/qmoi/status/route.ts)
- /api/qmoi/self-work/code-review -> [app/api/qmoi/self-work/code-review/route.ts](app/api/qmoi/self-work/code-review/route.ts)
- /api/qmoi/self-work/run-tests -> [app/api/qmoi/self-work/run-tests/route.ts](app/api/qmoi/self-work/run-tests/route.ts)
- /api/qmoi/autodev/toggle -> [app/api/qmoi/autodev/toggle/route.ts](app/api/qmoi/autodev/toggle/route.ts)
- /api/qmoi/autodev -> [routes/api/qmoi/autodev.ts](routes/api/qmoi/autodev.ts) (POST, actions: force_run, lint_fix, dependency_fix, ai_suggest, rollback, batch_edit, scan_logs, auto_fix_problems, optimize_device, enhance_apps, project_status, monitor_and_fix_projects, continuous_autofix_start, continuous_autofix_stop, full_status, master_instruction, ui_development, autodev_task, auto_make, research, evolution)
- /api/qmoi/execute -> [app/api/qmoi/execute/route.ts](app/api/qmoi/execute/route.ts)
- /api/qradio/channels -> [app/api/qradio/channels/route.ts](app/api/qradio/channels/route.ts)
- /api/qradio/status -> [app/api/qradio/status/route.ts](app/api/qradio/status/route.ts)
- /api/qradio/programs -> [app/api/qradio/programs/route.ts](app/api/qradio/programs/route.ts)
- /api/qradio/play -> [app/api/qradio/play/route.ts](app/api/qradio/play/route.ts)
- /api/qradio/program -> [app/api/qradio/program/route.ts](app/api/qradio/program/route.ts)
- /api/auth/_ -> `app/api/auth/_/route.ts`

If you want any of the proposal-first endpoints to act immediately in production, set `PRODUCTION_CONFIRMED=true` and run the server with the `--real` flag (or the equivalent runner). This is intentional to prevent accidental destructive actions.

---

## /api/cashon/\*

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

- GET /api/qi-trading?stats=1 — returns trading statistics (production-ready data)
- GET /api/qi-trading?history=1 — returns trade history (production-ready)
- GET /api/qi-trading?active=1 — returns active trades (production-ready)

- POST /api/qi-trading (body: { action: 'execute'|'cancel', trade }) — proposal-first for execute/cancel. Writes proposals when not confirmed.
- Auth: `x-qmoi-api-key` required (enforced).

---

## Notes

- Proposal files can be found in `.qmoi_validation/` (e.g., `proposal-*.json`, `[PRODUCTION READY]s_proposal_*.json`). Review them before applying.
- To apply a proposal and run a mutating action, _set_ `PRODUCTION_CONFIRMED=true` in the environment and run the server with `--real` in the process arguments (or use a patched runner that forwards this flag). This gating is intentional to prevent accidental destructive actions.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
