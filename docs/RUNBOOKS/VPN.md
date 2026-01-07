# VPN Runbook

This runbook describes how to validate the VPN controller and run the guarded integration check in CI.

## Secrets

- `VPN_CONTROLLER_URL` (required for controller-based checks)
  - Example: `https://vpn-controller.example.com`
- For local client-based operations (if used): `VPN_CLIENT_CMD` (path to client binary)

## CI Workflow

A manual, gated GitHub Actions workflow exists at `.github/workflows/integration-vpn.yml`.
To run it:

1. Add `VPN_CONTROLLER_URL` to your repository `Secrets` (Actions > Secrets).
2. Go to Actions → "VPN integration (manual, gated)" and click "Run workflow".
3. Set `confirm_production` to `1` to confirm the live run.

The job only runs if the secret exists and the `confirm_production` flag is `1`.

## Local runner

You can run the TypeScript integration runner locally (requires Node.js and dependencies):

VPN_CONTROLLER_URL=https://vpn-controller.example.com PRODUCTION_CONFIRMED=1 npx ts-node ./src/scripts/integration/vpn_integration_runner.ts

This performs a non-destructive `/health` check against the controller and exits with a non-zero code on failure.

## Safety notes

- Validation checks are non-destructive (they only perform GET/health requests).
- Any provisioning or client command execution requires `PRODUCTION_CONFIRMED=1` and is gated.
- Do not commit secrets to the repository; use your CI/CD secret manager.
