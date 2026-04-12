<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.902177Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

---
title: "Leah Wallet — Setup & Autotest (SISTER-assisted)"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# Leah Wallet — Setup & Autotest (SISTER-assisted)

This guide is written for Leah (SISTER) — complete prodeloper knowledge required. It explains how to set up the Leah wallet and run the verification autotest.

1. Purpose

- Provide Leah with a secure wallet for receiving QMOI funds and interacting with services (Cashon, Megavault).
- Provide a one-click autotest that verifies credentials and shows balances (dry-run by default).

2. Secure credential storage

- Do NOT store keys in repo. Use environment variables or a secure secrets manager (e.g., HashiCorp Vault, GitHub Secrets).
- Required env variables (examples):
  - LEAH_WALLET_PROVIDER (e.g., cashon)
  - LEAH_WALLET_API_KEY
  - LEAH_WALLET_API_URL

3. One-click instructions

- Open the LC Hub (or send instructions to Leah via WhatsApp using the `notify_on_whatsapp.py` flow).
- Leah pastes her API key and provider into the secure UI field or shares with Master via secure channel.

4. Run autotest (prodeloper / Master)

Dry-run (safe):

```bash
python3 scripts/wallets/check_wallets.py --wallet leah --report leah_wallet_qv.json
```

Live (REAL) — only when approved by Master and `production_CONFIRMED=true`:

```bash
export production_CONFIRMED=true
python3 scripts/wallets/check_wallets.py --wallet leah --real --report leah_wallet_qv.json
```

5. Expected results

- `leah_wallet_qv.json` — contains `balance`, `currency`, `last_checked` timestamp, and `status`.

6. Troubleshooting

- If `missing_credentials`, follow step (2) and re-run.
- If `error`, read the `error` field in the JSON report and share with Master for escalation.

7. Safety & production notes

- All real-fund operations require `production_CONFIRMED=true` to run.
- Master must ensure testnet vs mainnet configuration is correct for each provider.

Generated: 2025-10-28T22:30:00Z

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:59:14Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

