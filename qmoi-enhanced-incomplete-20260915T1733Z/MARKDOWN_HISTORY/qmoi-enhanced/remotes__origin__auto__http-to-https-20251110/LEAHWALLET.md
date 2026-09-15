---
title: "Leah Wallet — Setup & Autotest (SISTER-assisted)"
qmoi_validation_frontmatter: true
---

# Leah Wallet — Setup & Autotest (SISTER-assisted)

This guide is written for Leah (SISTER) — minimal developer knowledge required. It explains how to set up the Leah wallet and run the verification autotest.

1) Purpose

- Provide Leah with a secure wallet for receiving QMOI funds and interacting with services (Cashon, Megavault).
- Provide a one-click autotest that verifies credentials and shows balances (dry-run by default).

2) Secure credential storage

- Do NOT store keys in repo. Use environment variables or a secure secrets manager (e.g., HashiCorp Vault, GitHub Secrets).
- Required env variables (examples):
  - LEAH_WALLET_PROVIDER (e.g., cashon)
  - LEAH_WALLET_API_KEY
  - LEAH_WALLET_API_URL

3) One-click (non-dev) instructions

- Open the LC Hub (or send instructions to Leah via WhatsApp using the `notify_on_whatsapp.py` flow).
- Leah pastes her API key and provider into the secure UI field or shares with Master via secure channel.

4) Run autotest (developer / Master)

Dry-run (safe):

```bash
python3 scripts/wallets/check_wallets.py --wallet leah --report leah_wallet_qv.json
```

Live (REAL) — only when approved by Master and `PRODUCTION_CONFIRMED=true`:

```bash
export PRODUCTION_CONFIRMED=true
python3 scripts/wallets/check_wallets.py --wallet leah --real --report leah_wallet_qv.json
```

5) Expected results

- `leah_wallet_qv.json` — contains `balance`, `currency`, `last_checked` timestamp, and `status`.

6) Troubleshooting

- If `missing_credentials`, follow step (2) and re-run.
- If `error`, read the `error` field in the JSON report and share with Master for escalation.

7) Safety & production notes

- All real-fund operations require `PRODUCTION_CONFIRMED=true` to run.
- Master must ensure testnet vs mainnet configuration is correct for each provider.

Generated: 2025-10-28T22:30:00Z
