# Platform Automation & Safety Guidelines

This document explains how QMOI should interact with external platforms in production. It also
documents the safe, dry-run-first behavior used across the repository and the environment
variables and steps required to enable production connectors.

Summary
- QMOI may prepare and suggest account creation steps, but automatic creation of accounts
  on external platforms MUST be implemented per-platform with legal review, human approval,
  and secure API adapters.
- Handling real funds requires industry-standard safeguards: KYC/AML, PCI-DSS for card processing,
  use of approved payment processors (Stripe Connect, PayPal, Adyen), escrow for marketplace
  transactions, and comprehensive auditing.

Account lifecycle (recommended)
1. Prepare: QMOI prepares an account creation plan using `services/platformManager.prepareAccountCreation`.
2. Review: A human master reviews plan and approves (manual or automated workflow in the platform adapter).
3. Create: PlatformAdapter (per-platform implementation) performs creation using official APIs.
4. Verify: Perform email/phone verification and KYC where applicable.
5. Store: Securely store credentials in a secrets manager (Vault, AWS KMS/SecretsManager). NEVER store secrets in plaintext in repo.
6. Audit: All actions logged and signed; master must be able to revoke access.

Payments & Real Funds
- Default: All modules operate in a dry-run mode unless explicitly enabled for production. Tests,
  demos, and local executions use dry-run artifacts and logs; no live funds or account creations
  are performed without explicit gating.
- Use PCI-compliant payment processors. Do not implement direct card handling unless certified.
- Keep strict limits and require multi-party approval for transfers above configurable thresholds.
- Add an escrow layer for marketplace/deals where QMOI acts as an agent.

Legal & TOS
- Automatic account creation may violate platform Terms of Service. Implementers must obtain legal review and platform-specific API agreements before enabling automation.

Security Checklist (minimum)
- Secrets: Move all secrets to an external secrets manager.
- Audit logs: Immutable, retained for minimum 365 days.
- Limits: Per-platform rate limits with exponential backoff and circuit breakers.
- Master controls: Human-in-the-loop approvals for account creation, payments, and high-risk operations.

Notes
- The included `services/platformManager.ts` is a safe scaffolding and DOES NOT contact external APIs.
- For production, implement PlatformAdapters in `services/adapters/<platform>.ts` with rate-limiting, retries, error handling and master approval flows.

How to enable production connectors (high level)

- Required environment variables (examples):
  - `QMOI_ALLOW_NETWORK=true` — global opt-in for network operations
  - `PRODUCTION_CONFIRMED=true` — explicit human confirmation
  - `MASTER_TOKEN` — secure token that authorizes master-only operations
  - Provider credentials (for example `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `SENDGRID_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFLARE_API_TOKEN`, `ROUTE53_*` etc.) are required per-adapter and must be supplied via a secrets manager (Vault, AWS Secrets Manager, etc.)

- Procedure to enable production:
  1. Store provider credentials in a secrets manager and grant read-only access to the runner.
  2. Set `QMOI_ALLOW_NETWORK=true` and `PRODUCTION_CONFIRMED=true` in a controlled environment (CI/CD or secure host).
  3. Ensure `MASTER_TOKEN` is present and matches the master auth token held by the operator.
  4. Run smaller smoke tests (read-only checks) and ensure audit logs are written to `.qmoi_validation/`.
  5. Only after manual review flip specific adapter flags (for example `TWILIO_ENABLED=true`) to enable writes/calls.

NOTE: This is intentionally conservative. Enabling any connector that moves money, creates accounts, or performs destructive actions requires legal review, rate limits, and multi-party approval.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/PLATFORM_AUTOMATION.md",
  "validated_at": "2025-10-26T20:51:22.705060Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
