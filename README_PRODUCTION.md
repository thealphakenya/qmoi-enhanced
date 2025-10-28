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

5) Post-deployment checks
   - The healthcheck JSON should be fetched and stored by your monitoring system.
   - Ensure log rotation, alerting thresholds, and monitoring dashboards are configured.

6) Next automation steps you can enable
   - Auto-build for Top-N missing artifacts using Docker runners.
   - Auto-draft releases with artifact uploads after successful builds.
