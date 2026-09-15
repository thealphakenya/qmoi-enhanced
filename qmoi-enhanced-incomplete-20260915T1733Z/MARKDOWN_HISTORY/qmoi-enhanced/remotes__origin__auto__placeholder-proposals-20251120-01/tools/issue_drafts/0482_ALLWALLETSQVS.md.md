---
title: "Issue draft for ALLWALLETSQVS.md"
generated: 2025-11-08T16:06:38.260469Z
---

# Review needed: ALLWALLETSQVS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "ALL WALLETS QVS (Quick Verification Summary)"
qmoi_validation_frontmatter: true
---

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
- Add a
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
