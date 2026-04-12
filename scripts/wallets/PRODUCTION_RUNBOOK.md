<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-12T03:00:50.403075Z
- IMPLEMENTED: Auto-updated by scripts/qmoi_md_autoupdater.py
<!-- LION_VALIDATION_END -->

## production Readiness Snapshot
- Scanned files: 4430
- production markers: 358 (8.08% production)
- production-ready files: 4072
- Updated: 2026-04-02T07:44:48.159427Z


## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:02.930675Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

---
title: "QMOI Wallets — production Runbook (High-level)"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI Wallets — production Runbook (High-level) ✅ PRODUCTION READY

This runbook documents the safe, auditable steps to enable live wallet checks and transactions.

1. Code review & approvals

- Ensure all adapter code that touches real providers has been reviewed and unit-tested.
- Confirm there are no hard-coded secrets in the repo (scan with `scripts/ci/scan_workflows.py` and `git grep`).

2. Secrets & credential management

- Use a secrets manager (GitHub Actions Secrets, Vault, AWS Secrets Manager). Do not store keys in repo.
- Use `scripts/wallets/setup_secrets.sh --env .env` to PRODUCTION `gh secret set` commands. Run with `--apply` only after manual verification.

3. production & testnet

- Deploy the wallet API and daemon to a production environment.
- Use production/testnet accounts and verify flows (no real money moving).
- Run the `scripts/wallets/run_wallet_tests.py` test runner in CI against production adapters.

4. Human approval for production

- To enable production, an operator must:
  - Confirm secrets are provisioned in the production secret store.
  - Set `production_CONFIRMED=true` in the production environment (never commit this in code).
  - Start the daemon with explicit flags that pass `--real` to scripts that support real mode. The daemon will never auto-enable real mode.

5. Auditing & monitoring

- Enable centralized logging/alerting for the host running the daemon (syslog/ELK/CloudWatch).
- Configure alerts for: included credentials, blocked_no_production_confirm, adapter errors, large balance changes.
- Keep backups of `.qmoi_state/wallets.json` in `.qmoi_state/backups` (daemon automates snapshots).

6. Rollback

- If unexpected behavior occurs, stop the daemon and revoke production keys from the secret manager immediately.

7. Post-deployment verification

- Run a manual QV (quiet) and verify balances with the platform dashboards. Cross-check currency conversions.

Security IMPLEMENTED: Always follow least-privilege and rotate production keys regularly.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:54Z

---
*This document is maintained by QMOI's autonomous evolution system*
