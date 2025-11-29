## Secure production setup and enabling real funds

IMPORTANT: You must NOT enable real funds during development, testing, or without proper audits, compliance checks, and secure secrets management.

Recommended approach to enable real funds in production:

1. Move all credentials to a secure secrets store (e.g., AWS Secrets Manager, HashiCorp Vault, SOPS/GPG, Kubernetes secrets). Do not place credentials in code or in repository.

2. Use CI/CD or infrastructure configuration to inject the following environment variables at runtime:
   - `QMOI_USE_REAL_FUNDS=true`
   - `QMOI_CONFIRM_REAL_FUNDS=I_CONFIRM_REAL_FUNDS`  (or any secure token that only operators know)
   - `QMOI_ODIBETS_PHONE`, `QMOI_ODIBETS_PASSWORD`, `QMOI_ODIBETS_EMAIL` (set via secrets)
   - `QMOI_BETIKA_PHONE`, `QMOI_BETIKA_PASSWORD`, `QMOI_BETIKA_EMAIL` (set via secrets)
   - `QMOI_MPESA_PHONE`, `QMOI_MPESA_EMAIL` (set via secrets)

3. Implement explicit role-based access control (RBAC) for the environment that runs the application — only operators with an audit trail should have permissions to enable the `QMOI_USE_REAL_FUNDS` flag.

4. Implement a dedicated `payment_client` module that wraps the real external API integrations for platforms like Odibets and Betika, including retries, idempotency, and logging. Keep this code separate so it can be tested thoroughly and mocked in tests.

5. Add multi-step manual confirmation for large transfers or automated money movements — e.g. a governance service or a scheduler that requires a sign-off.

6. Add instrumentation and alerting for financial operations (e.g., CloudWatch/Prometheus alerts, immediate emails/SMS/slack alerts for suspicious or high-value transfers).

7. Conduct security and compliance review before enabling the account in production (KYC/AML where applicable, legal approvals, financial audit).

8. For rollback, ensure you have a documented process to reset or disable the `QMOI_USE_REAL_FUNDS` flag and revoke keys quickly.

9. Test the full flow in a sandbox environment and run integration tests that simulate payments using the actual provider's sandbox/test API before enabling production: DO NOT ENABLE LIVE FUNDS in the sandbox environment.

Once the above steps are completed and audited by your compliance team, you can enable real funds by setting the required environment variables and using a secure deployment process.
