---
title: "Wallets — security, testnet usage, and operational guidance"
qmoi_validation_frontmatter: true
---

# Wallets — security, testnet usage, and operational guidance

This document explains how the QMOI wallet tooling is intended to be used safely in development and production.

Key principles
- Safety-first: every adapter is mock-first. Real network calls require `PRODUCTION_CONFIRMED=true` and explicit `--real` flags.
- Secrets out of code: do NOT store API keys in the repo. Use environment variables or a secret manager (GitHub Secrets, Vault, AWS Secrets Manager).
- Audit trail: all wallet QV runs write validation artifacts under `.qmoi_validation/` and history under `.qmoi_validation/wallet_balance_history.json`.

Running checks
- Dry-run (safe, recommended):
```
python3 scripts/wallets/check_wallets.py --report ./.qmoi_validation/all_wallets_qvs.json
```

- Live mode (REQUIRES HUMAN REVIEW & SECRETS):
```
# export required env vars (example)
export CASHON_API_KEY=... CASHON_API_URL=...
export PRODUCTION_CONFIRMED=true
python3 scripts/wallets/check_wallets.py --report ./.qmoi_validation/all_wallets_qvs.json --real
```

Offline and testnet
- To avoid external rate queries, set `DISABLE_EXTERNAL_RATES=true` to use mocked conversion rates.
- Testnet adapters (e.g., `binance_testnet`, `mpesa_sandbox`, `leahwallet`) are available for dry-run and simulation.

Aliases & memory
- The small state store (`.qmoi_state/wallets.json`) maps aliases like `leah` to canonical wallet ids (e.g., `leahwallet`).
- Use `scripts/wallets/state_store.py` to bootstrap or inspect the state store.

API and dashboards
- A simple local API is provided at `scripts/wallets/wallets_api.py` (Flask). Run locally only and secure with `QMOI_API_TOKEN`.

Security checklist before enabling live operations
1. Ensure all adapters you intend to use have been code-reviewed.
2. Store credentials in a secrets manager; never commit them.
3. Run in a controlled environment (server/container) with monitored audit logs.
4. Require at least one human reviewer to approve `PRODUCTION_CONFIRMED=true` before running with `--real`.
