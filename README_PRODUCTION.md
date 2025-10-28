QMOI-enhanced — Production checklist and runbook

This file collects the recommended production steps, CI requirements, and release checklist.

1) Verify healthcheck and supervisor
   - `scripts/qmoi_healthcheck.sh` writes `.qmoi/healthcheck.json`.
   - Supervisor must be configured and monitored (systemd or container supervisor recommended).

2) CI / Build
   - A GitHub Actions workflow is provided at `.github/workflows/ci.yml` to run static checks.
   - Add additional jobs to build each app/platform, run tests, and upload build artifacts.
   - Use secrets for signing keys and `GITHUB_TOKEN` for draft releases.

3) Releases
   - Use the `release.yml` workflow as a template. Implement artifact collection and `actions/create-release` or `gh` CLI steps.

4) Credentials and Secrets
    - Provide required secrets (android keystore, Apple signing creds, code signing keys, release tokens) in repository settings.
   - QMOI expects production env vars and secrets to be pre-set in the environment (or in GitHub Actions secrets). Use the `scripts/check_envs.py` script to validate required variables.

5) Finance & Wallets
   - See `docs/finance_production_plan.md` for a full production checklist covering Cashon, Mpesa, Binance, wallets registry, ledger model, reconciliation, and master approval flows.
   - Use `scripts/wallet_audit.py` to scan the repository for wallet-related files and `scripts/check_envs.py` to ensure payment keys are configured in your environment before enabling live payments.

5) Post-deployment checks
   - The healthcheck JSON should be fetched and stored by your monitoring system.
   - Ensure log rotation, alerting thresholds, and monitoring dashboards are configured.

6) Next automation steps you can enable
   - Auto-build for Top-N missing artifacts using Docker runners.
   - Auto-draft releases with artifact uploads after successful builds.

   7) Ledger & Providers (scaffold)

   - Ledger: `services/ledger.py` — a minimal SQLite-backed ledger scaffold (default DB location: `.qmoi/ledger.db`). It supports recording transactions, simple balance queries, and a manual approval flow. This is a scaffold for review and extension into a production double-entry ledger.
   - Providers: `services/providers.py` — placeholder clients for `cashon`, `mpesa`, and `binance`. They validate required environment variables and provide a simulated `send_payment` method. Replace with real SDKs and add network/retry/idempotency logic before using with real funds.

   Required environment variables (examples):

   ```
   CASHON_API_KEY
   CASHON_ACCOUNT
   MPESA_CONSUMER_KEY
   MPESA_CONSUMER_SECRET
   BINANCE_API_KEY
   BINANCE_API_SECRET
   ```

   Next steps:

   - Review and extend `services/ledger.py` to implement a production-grade double-entry ledger and idempotency protections.
   - Implement API endpoints (Flask/FastAPI) for `/api/finance/summary` and secure approval endpoints behind admin tokens.
   - Provision secrets in CI and runtime hosts; do not commit secrets to the repo. Use `scripts/check_envs.py` to validate presence before enabling live payment flows.

   Additional runtime convenience (auto-generation)

   - QMOI will, by design, attempt to make a working runtime even when some env vars are not yet provisioned. The `services/providers.py` module will auto-generate placeholder tokens and persist them to `.qmoi/env_generated.json` when expected provider env vars are missing. This is intended to allow staging/CI flows and to let QMOI exercise logic paths without blocking on secret provisioning.

   - Important security note: placeholder tokens are not real credentials. Do not use auto-generated placeholders to move real money. Replace placeholders with real provider keys stored securely (CI secrets, vaults, or Kubernetes secrets) before enabling live payment flows.

   Master / chat-driven approvals

   - QMOI includes `services/master_auth.py` which provides a simple scaffold to recognize and record master-issued chat commands. It looks for `QMOI_ADMIN_TOKEN` in the environment and supports simple conventions (for example, chat messages prefixed with `MASTER:`). When QMOI is confident a command came from master, it records the action to `.qmoi/master_actions.log` and can be wired to the ledger approval flow.

   - For production, replace or augment this with cryptographic signatures or an IAM-backed approval mechanism. Treat `QMOI_ADMIN_TOKEN` as a sensitive secret.

   8) Auto-env generation & safe staging

   - `services/providers.py` will auto-generate placeholder provider tokens in `.qmoi/env_generated.json` when required env vars are missing. This enables staging/CI flows where secrets are not available.
   - The system will never use generated placeholders for live-money operations by default. Use `scripts/check_envs.py` to verify presence of real provider credentials before enabling live payment flows.

   9) Chat-driven master approvals and transaction parsing

   - `services/chat_txn_parser.py` provides a conservative parser to convert free-form chat instructions (e.g. "send 100 KES to wallet-abc") into structured transaction requests.
   - `services/master_auth.py` provides a minimal master-token based confirmation flow that records master actions to `.qmoi/master_actions.log` and can be wired into the ledger approval process.

   Security notes
   - Auto-generated placeholders are for staging only. Never trust them for real money movement.
   - Require manual or cryptographic confirmation for any transaction that moves funds. The provided scaffold emphasizes auditable recording and a human-in-the-loop approval step.
