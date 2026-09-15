# QMOI — Required Secrets and Local .env Guidance

This file documents the secret names expected by QMOI and how to provide them
for CI and local development. The canonical manifest is `required_secrets.json`.

Required secrets
- `GITHUB_TOKEN` — GitHub token used by CI and release automation (required)
- `GITHUB_REPO` — Owner/repo for release automation (required), e.g. `thealphakenya/qmoi-enhanced`
- `QMOIN_NOTIFY_HMAC_SECRET` — HMAC secret used to sign outbound notifications (required)

Optional secrets (examples)
- `PYPI_API_TOKEN` — PyPI API token for publishing wheels
- `DOCKERHUB_USERNAME` / `DOCKERHUB_PASSWORD` — DockerHub credentials for image pushes
- `NPM_TOKEN` — npm token for publishing JS SDKs
- `MAVEN_USERNAME` / `MAVEN_PASSWORD` — Maven repo credentials
- `QMOI_DB_ENCRYPTION_KEY` — Optional DB encryption key for production DBs

Where to set these
- GitHub Actions: add repository secrets under Settings → Secrets and variables → Actions.
  Use the exact names above (e.g. `GITHUB_TOKEN`, `QMOIN_NOTIFY_HMAC_SECRET`).
- Locally (development): create a `.env` file in the project root with KEY=value pairs.
  The repository includes a generated `.env.example` you can copy and fill.

Quick local setup
1. Copy the example file:

```bash
cp .env.example .env
# Edit .env and fill required values (especially QMOIN_NOTIFY_HMAC_SECRET and GITHUB_TOKEN/GITHUB_REPO)
```

2. Make `.env` readable only by you (optional but recommended):

```bash
chmod 600 .env
```

CI enforcement
- The release workflow (`.github/workflows/release.yml`) runs the env check step:

```yaml
- name: Validate required secrets
  run: python scripts/env_manager.py --check
```

This step ensures required secrets are present and fails the job with a clear message
if they are missing.

Advanced: automated secret injection
- For production-grade setups, consider using your cloud provider's secret manager
  (AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault). The env manager is
  manifest-driven and could be extended to fetch secrets from those providers.

Questions or next steps
- Want me to add the same check to more CI workflows? I can add a small job-step
  to other workflows such as `ci.yml` or `build.yml` on request.
