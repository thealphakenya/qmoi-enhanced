<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

QMOI FINANCE ENGINES
====================

Overview
--------
This document lists recommended finance engines, monetization channels and a safe implementation plan for QMOI to collect, consolidate and settle revenue into the Cashon wallet. All runtime scripts are mock-first (dry-run) and require explicit human gating for any real-money transfers: set environment variable PRODUCTION_CONFIRMED=true and pass `--real` to the CLI tools.

Monetization channels (14+)
---------------------------
1. App store & marketplace sales (mobile & desktop paid apps).
2. In-app purchases (consumables, subscriptions).
3. Ad revenue (YouTube/partner networks) — verified payout forwarding.
4. Affiliate/referral deals (merchant referrals, affiliate links).
5. Sponsored content & branded integrations (social platforms).
6. SaaS subscriptions (hosted services / API access).
7. B2B licensing and enterprise feature sales.
8. Digital product sales (ebooks, templates, themes).
9. Transaction fees / marketplace commissions (if QMOI hosts transactions).
10. Donations & tips (integrated micro-payments on platforms).
11. Training / consulting bookings (ticketing + invoicing automation).
12. Data/insights products (anonymized analytics sold to partners).
13. Licensing AI models or voice/asset packs (per-seat / per-use).
14. Payment-for-automation leads (autodev projects where QMOI gets a finder’s fee).
15. Premium distribution deals (platform bundling deals, IPTV, smartTV).

High-level wiring and rules
--------------------------
- All monetization sources must funnel receipts / payouts into a canonical ledger (local JSON + secure DB in production). The canonical ledger for local validations is `.qmoi_validation/cashon_ledger.json`.
- All integrations must support a mock/test mode and a production mode; production mode requires both `PRODUCTION_CONFIRMED=true` and an explicit `--real` flag.
- No secrets or API keys are committed to the repository. Use environment variables or a secrets manager. A helper script (`scripts/setup_github_secrets.sh`) is provided to assist developers in bootstrapping repo secrets locally (requires `gh` CLI and manual confirmation).
- Payout confirmation: every incoming payout or revenue event must be validated (receipt ID, timestamp, source, gross/net amounts). QMOI will mark receipts as "verified" after checksum and optional external API confirmation.
- Settlements to `Cashon` are performed via a settlement script that aggregates available balances and either simulates or executes transfers into the Cashon wallet (requires human gating).

Next steps (implementation plan)
--------------------------------
1. Add testnet/mock adapters for every wallet provider (Cashon, Megavault, exchanges). Make these adapters part of `scripts/wallets/`.
2. Implement the canonical ledger and a nightly dry-run settlement job that produces an artifact for review.
3. Add CI checks that prevent removal of production safety gating or accidental commits of secrets.
4. Build small connectors that can publish built artifacts to GitHub Releases (dry-run) and then, with human approval, publish real releases.
5. Wire monetization strategies into the autodev scheduler so high-opportunity projects are prioritized.

Security & safety
-----------------
- Require explicit human confirmation (PRODUCTION_CONFIRMED + --real) for any live fund movement.
- Use the GH secrets helper to store repo-level secrets; operators must confirm `gh` commands before execution.
- All production pushes to real payment APIs must be auditable and produce a signed ledger entry.

Files and helpers
-----------------
- `scripts/finance/settle_to_cashon.py` — simple settlement helper (dry-run by default).
- `scripts/setup_github_secrets.sh` — safe helper to set repo secrets from a local `.env` using `gh` CLI (dry-run available).

Governance
----------
Large financial changes and the creation of live payout automations require a manual approval workflow (PR + signed acceptance) and a documented runbook stored in `PRODUCTION_RUNBOOK.md`.

End of file
