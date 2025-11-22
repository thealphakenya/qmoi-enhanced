# ALL WALLETS QVS (Quick Verification Summary)

This file documents discovered wallet-related documentation and provides instructions to run the automated wallet Quick Verification (QV) script.

Purpose
- Provide a single place listing wallet docs and guidance for running automated checks.
- Ensure wallet checks are dry-run by default and require explicit gating to run live transfers.

Discovered wallet docs (non-exhaustive)
- `CASHON.md` — Cashon system wallet and operational notes.
- `LEAHWALLET.md` — Leah/Sister wallet guide and UI notes.
- `QMOI-REVENUE-README.md`, `QMOIREVENUEGENERATION.md`, `QMOIAUTOREVENUEEARN.md` — revenue/autorevenue docs referencing Cashon and wallet flows.
- `CASHONTRADINGREADME.md`, `TRADINGREADME.md` — trading + wallet integration notes.
- Various README files reference wallets and payment providers (Mpesa, Pesapal, Binance, Bitget, CashApp). Use the repository-wide placeholder scanner to find more references.

Location of automated checks
- Script: `scripts/wallets/check_wallets.py`
- Validation output: `.qmoi_validation/all_wallets_qvs.json`

How the checks work
- Default mode: mock/dry-run. No real network transfers or money movement are performed.
- To run live operations (NOT RECOMMENDED without human review + secret manager), you must set:
  - `PRODUCTION_CONFIRMED=true` in the environment, and
  - pass the `--real` flag to the script.
- Live transfer code paths are intentionally gated and require human approval and secret provisioning.

Run (dry-run) — local dev
```bash
python3 scripts/wallets/check_wallets.py
```

Run (explicit live, only after human review)
```bash
# Only run after manual code review and secrets provisioned
export PRODUCTION_CONFIRMED=true
python3 scripts/wallets/check_wallets.py --real
```

Next steps
- Expand `scripts/wallets/` with adapters for testnets and exchanges (Binance, Bitget, Pesapal). Start with testnet-only adapters and automated unit tests.
- Add a scheduled job (daemon) to persist balance history to `.qmoi_validation/wallet_balance_history.json`.
- Prioritize adding secure secret manager integration (GH Secrets / Vault / AWS Secrets Manager) and never commit keys.

Contact / Audit
- All wallet changes must be code-reviewed and approved by the project owner. See `CASHON.md` and `MASTERREADME.md` for master-approval flows.

Generated: automatic inventory created by automation on request.
# ALL WALLETS QVS

This file lists all known wallets in the repository and provides a quick verification (QVS) plan.

IMPORTANT: All test scripts in `scripts/wallets/` run in dry-run/mock mode by default. Any operation that performs real transactions requires BOTH:

- the environment variable `PRODUCTION_CONFIRMED=true`
- the CLI flag `--real`

This is a deliberate safety gate to prevent accidental real-fund activity.

Wallet inventory (discovered):

- `MEGAVAULT.md` — QMOI Megavault System (file: `MEGAVAULT.md`)
- `CASHON.md` — Cashon wallet (file: `CASHON.md`)
- `CASHONTRADINGREADME.md` — Cashon trading system docs (file: `CASHONTRADINGREADME.md`)
- `LEAHWALLET.md` — Leah wallet (file: `LEAHWALLET.md`) — (created/updated)

Additional wallets may exist; run the check script to refresh the QV report.

How to run (dry-run / safe):

1. Dry-run (no network calls, mocked balances):

```bash
python3 scripts/wallets/check_wallets.py --report all_wallets_qvs.json
```

2. Live check (REAL calls) — MUST set `PRODUCTION_CONFIRMED=true` and understand this will attempt network calls and may use real funds where adapters support transactions/balances:

```bash
export PRODUCTION_CONFIRMED=true
python3 scripts/wallets/check_wallets.py --real --report all_wallets_qvs.json
```

Report output format (JSON):

{
  "wallet": {
    "balance": "<amount>|mock",
    "currency": "<currency>",
    "last_checked": "2025-10-28T22:00:00Z",
    "source_file": "MEGAVAULT.md",
    "status": "ok|missing_credentials|error"
  }
}

Next steps (recommended):

- Review `LEAHWALLET.md` and follow the non-dev setup guide.
- Provide credentials via secure secrets manager or environment variables — do NOT commit them to git.
- Run the dry-run first to verify adapters and configuration, then run live checks only when ready.

Generated/Updated: 2025-10-28T22:30:00Z
