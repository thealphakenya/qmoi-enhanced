---
title: "QMOI Wallets — Production Runbook (High-level)"
qmoi_validation_frontmatter: true
---

# QMOI Wallets — Production Runbook (High-level)

This runbook documents the safe, auditable steps to enable live wallet checks and transactions.

1) Code review & approvals
- Ensure all adapter code that touches real providers has been reviewed and unit-tested.
- Confirm there are no hard-coded secrets in the repo (scan with `scripts/ci/scan_workflows.py` and `git grep`).

2) Secrets & credential management
- Use a secrets manager (GitHub Actions Secrets, Vault, AWS Secrets Manager). Do not store keys in repo.
- Use `scripts/wallets/setup_secrets.sh --env .env` to preview `gh secret set` commands. Run with `--apply` only after manual verification.

3) Staging & testnet
- Deploy the wallet API and daemon to a staging environment.
- Use sandbox/testnet accounts and verify flows (no real money moving).
- Run the `scripts/wallets/run_wallet_tests.py` test runner in CI against staging adapters.

4) Human approval for production
- To enable production, an operator must:
  - Confirm secrets are provisioned in the production secret store.
  - Set `PRODUCTION_CONFIRMED=true` in the production environment (never commit this in code).
  - Start the daemon with explicit flags that pass `--real` to scripts that support real mode. The daemon will never auto-enable real mode.

5) Auditing & monitoring
- Enable centralized logging/alerting for the host running the daemon (syslog/ELK/CloudWatch).
- Configure alerts for: missing credentials, blocked_no_production_confirm, adapter errors, large balance changes.
- Keep backups of `.qmoi_state/wallets.json` in `.qmoi_state/backups` (daemon automates snapshots).

6) Rollback
- If unexpected behavior occurs, stop the daemon and revoke production keys from the secret manager immediately.

7) Post-deployment verification
- Run a manual QV (quiet) and verify balances with the platform dashboards. Cross-check currency conversions.

Security note: Always follow least-privilege and rotate production keys regularly.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
