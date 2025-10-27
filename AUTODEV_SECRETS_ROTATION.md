# AUTODEV Secrets Rotation & Remediation

This document describes safe steps to remove tracked secrets, rotate them, and update CI/deployment pipelines.

Recommended immediate steps

1. Backup original tracked `.env` locally (already done as `.env.bak`). Do NOT commit `.env.bak`.
2. Remove secrets from repository (redacted `.env`), and ensure `.gitignore` contains `.env` (already present).
3. Rotate secrets in all providers (GitHub, Stripe, Twilio, MPESA, etc.):
   - Generate new secrets from provider UIs.
   - Revoke old keys where supported.
4. Add new secrets to your repository's CI/CD secret store (GitHub Actions Secrets, GitLab CI variables, etc.).
5. Update deployment manifests / environment configs to reference the CI secret variables.
6. Run integration smoke tests in a staging environment with new secrets.
7. Audit logs and alert if any old credentials are used after rotation.

Notes and safe practices

- Never commit plaintext secrets. Use `environment` variables in CI or a secret manager (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
- If you accidentally committed secrets, rotate them immediately and consider invalidating any tokens/keys.
- Keep a local off-repo backup only while rotating. Remove it afterwards.

Commands (example)

```bash
# Create a backup and redact tracked .env locally (already applied):
cp .env .env.bak
# After rotating provider keys, set new secrets in GitHub Actions secrets (example):
# (run on your workstation, using gh CLI or GitHub web UI)
# gh secret set QMOI_JWT_SECRET --body "$(openssl rand -hex 32)"
# gh secret set QMOI_CONTROL_TOKEN --body "$(openssl rand -hex 48)"

# For Stripe, generate a new key in the dashboard and update STRIPE_API_KEY and STRIPE_WEBHOOK_SECRET in CI.
```

If you want, I can produce a step-by-step rotation PR with exact commands for each provider (GitHub/Stripe/Twilio/MPESA) based on detected usages in the repo.
