Platform Automation & Safety Guidelines

This document explains how QMOI should interact with external platforms in production.

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
- Default: All modules operate in "dry-run/simulated" mode unless an explicit `--enable-live-funds` flag AND master approval are provided.
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
