# Production Readiness Checklist

This document summarizes the conservative checks and steps to prepare this repository for production deployment.

1. Required files and artifacts
   - CI workflows in `.github/workflows/` present and validated (e.g., `lion-den-ci.yml`)
   - `HUGGINGFACEPAYED.md` (or equivalent) present for QVillage feature mapping
   - `package.json` has `name`, `version`, `scripts.test`, and `engines.node` defined (repo-inspector can apply safe fixes)
   - `tsconfig.json` contains `compilerOptions.skipLibCheck` and `target` set (repo-inspector can apply safe fixes)
   - `.den/tracks/events.log` exists and is writable by the running user (Lion writes tracks here)
   - Secrets and signing keys are NOT stored in the repo. Use CI secrets or Vault.

2. CI and tests
   - Node-scoped tests run via `npm run test:node` and should pass.
   - Add platform-specific tests in CI for packaging/signing if you plan to build artifacts.

3. Security and secrets
   - Do not commit production secrets. Use environment variables or a secrets manager (Vault, AWS KMS, GitHub Secrets).
   - Review `env/required_envs.json` and populate CI secrets accordingly.

4. Releases and packaging
   - For portable runner binaries, use `@vercel/ncc` or `pkg` in a CI build job to produce single-file artifacts.
   - Sign installers using platform-specific signing keys stored in secret stores.

5. Rollout
   - Use a dedicated `release/` branch or protected `main` with PRs and required checks.
   - Run `scripts/repo-inspector.cjs --apply` in a gated environment to apply conservative fixes only after review.

6. Audit and monitoring
   - Ensure `.den/tracks/events.log` entries are shipped to your monitoring/observability system (qcity or other).
   - Configure retention and rotation (see `scripts/den-enhance.cjs` for a simple cache rotator).

7. Manual steps before production (recommended)
   - Provision signing keys and CI secrets.
   - Run full test matrix (unit, integration, E2E) in CI.
   - Perform a security audit for third-party dependencies.

Notes
- All automated changes are conservative and back up modified files with `.bak` or timestamped `.bak.<ms>`.
- If you want, I can wire the repo-inspector to open a PR automatically with suggested changes in CI (requires a bot token and PR policy).
