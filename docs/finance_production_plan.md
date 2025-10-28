# Finance & Wallets — Production plan

Generated: 2025-10-28

This document describes the recommended production setup, controls, and enhancements for all revenue-generation and wallet-related features in QMOI.

Principles
- Safety first: never expose secret material in repo or logs. All keys must live in secret stores.
- Full auditability: every transaction must be logged to an append-only ledger (immutable file or DB) with cryptographic hashes.
- Master approval and accountability: all outgoing payments and withdrawals require Master approval. Use multi-sig or an approval workflow.
- Double-entry accounting: record credits and debits for every transaction to keep ledger balanced.
- Reconciliation: automated daily reconciliation between external provider reports and internal ledger.

Required secrets / env vars (examples)
- ADMIN_TOKEN (master token — rotate regularly)
- GITHUB_TOKEN (CI release automation)
- CASHON_API_KEY / CASHON_API_SECRET
- MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET
- BINANCE_API_KEY / BINANCE_API_SECRET
- ANDROID_KEYSTORE_BASE64 / ANDROID_KEYSTORE_PASSWORD
- APPLE_CERT_P12_BASE64 / APPLE_CERT_PASSWORD

Data model (minimal)
- transactions table (or JSON ledger):
  - id, timestamp, from_wallet, to_wallet, amount, currency, provider, provider_txn_id, status, meta, approved_by
- wallets registry:
  - wallet_id, type (custodial/non-custodial), provider, credentials_ref, balance_cached, last_checked

Transaction flow (production)
1. Project / revenue action generates an invoice or revenue event.
2. Event is recorded as a pending transaction in the ledger.
3. System attempts to settle via provider (e.g., Cashon, Mpesa, Binance). Provider response is recorded.
4. If outgoing payment, require master approval step (signed API call or manual UI approval). Only then release funds.
5. After settlement, mark transaction as settled and update balances (double-entry entries written).

Realtime FX and multi-currency
- Use a reliable FX feed (ExchangeRatesAPI, OpenExchangeRates, or paid provider). Cache rates and refresh every 30s–5m depending on needs.
- Each transaction stores amount_in_base_currency and fx_rate_at_time. Provide UI to show live converted balances.

Wallet usage & Cashon
- Treat Cashon as a primary on-ramp/off-ramp. Use its production API keys stored in secrets.
- Implement idempotency keys for every payment attempt.
- For Cashon payouts ensure KYC checks are performed before large transfers; log KYC outcome in transaction meta.

Accountability & Master controls
- UI flows for Withdraw/Send must show: amount, fees, exchange rate, destination, and require Master confirmation (2FA or signed token).
- All approvals are auditable: store approver id, timestamp, and signature hash of the payload.

Autoprojects & revenue generation
- Autoproject scoring: each auto-project is scored by expected-revenue, cost-to-complete, risk, and time-to-value.
- Project selection policy: choose top-N by expected ROI subject to budget and concurrency limits.
- Each project must produce a revenue event with estimated revenue and post-completion reconciliation.
- Allow the master to tag projects as high-priority or restricted.

Financial UI enhancements (everywhere showing balances)
- All wallet/balance UI components must fetch a single source-of-truth endpoint: /api/finance/summary which returns per-wallet and total balances (with base-currency conversion).
- UI must show pending and available balances distinctively.
- Provide per-transaction drill-down with proof (provider tx id, receipt, wallet signature).

Monitoring & alerts
- Alert on:
  - sudden balance drops
  - mismatched reconciliation (provider vs internal)
  - failed settlement attempts > N
  - FX rate spikes beyond threshold

CI & release notes
- Ensure release workflows only publish signed artifacts and that publishing jobs reference secrets via GitHub Actions secrets.

Next steps I can implement now
1. Add an append-only ledger writer (script) to record transactions.
2. Add a /api/finance/summary endpoint scaffold (backend) that aggregates wallet balances from registry.
3. Add sample unit tests for ledger and reconciliation.

Limitations
- I cannot enable production API keys or perform real payments from this environment. I will scaffold the code and add operators' instructions to provision secrets and enable the jobs.
