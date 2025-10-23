PAYMENTS.md

This file documents the payment integration plan for QMOI.

Overview
--------
QMOI currently uses a local SQLite-backed `wallets` table to simulate balances
(`balance_cents` stored as integers). Deals purchase flow debits the user's
wallet and credits the `cashon` system wallet. To handle "real actual cash"
we must integrate with one or more payment providers and implement webhooks,
settlements, and reconciliation.

Recommended next steps
----------------------
1. Provider selection
   - For card-based payments and global support: Stripe (recommended)
   - For mobile-money in East Africa: M-Pesa (Safaricom) or local provider
   - For bank transfers: integrate a local bank API or a payments aggregator

2. Credentials & secrets
   - Store provider keys in environment variables (e.g., STRIPE_API_KEY)
   - Ensure production uses a secrets manager and TLS for webhooks

3. Adapter pattern
   - Implement a payments adapter per provider (see `payments/provider_stub.py`)
   - Adapters must implement create_charge(username, amount_cents, currency)
   - Add webhook endpoints to receive provider events and mark transactions
     settled/failed

4. Ledger & reconciliation
   - Add a `transactions` table (done) to track provider status and refs
   - Implement periodic reconciliation job to re-query provider for unsettled
     transactions

5. Production durability
   - Move from SQLite to PostgreSQL for transactional integrity under load
   - Add idempotency keys for charge creation
   - Add audit logging and receipts

Testing
-------
- `scripts/test_payments.py` demonstrates a simulated charge using the
  provider stub and verifies a transaction is created and marked settled.

Security
--------
- Do not commit provider secrets. Use environment variables and a secrets
  manager. Verify webhook signatures before accepting events.

Notes
-----
The current implementation auto-settles transactions when no external provider
is configured (useful for offline/testing)."}