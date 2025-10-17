# Security Automation & Vulnerability Remediation

## Overview
This document describes the automated security vulnerability remediation system for QMOI.

## Features
- **GitHub Security Alerts Integration**: Automatically fetches vulnerability alerts from GitHub.
- **Automated Remediation**:
  - Runs `npm audit fix` to auto-fix vulnerabilities.
  - Runs `snyk wizard` for advanced remediation.
  - Optionally creates PRs or issues for unresolved vulnerabilities.
- **Continuous Monitoring**: Integrated into the master automation system for regular checks.
- **Reporting**: Generates security reports and logs actions taken.

## How It Works
1. **Fetch Alerts**: Uses GitHub API to fetch open security alerts.
2. **Run Fixes**: Executes `npm audit fix` and `snyk wizard`.
3. **Create PRs/Issues**: If vulnerabilities remain, creates a pull request or GitHub issue for manual review.
4. **Log & Report**: All actions are logged and summarized in `reports/security_automation_report.json`.

## Usage
- The master automation system runs security checks automatically.
- You can trigger manually:
  ```bash
  python scripts/qmoi_security_automation.py --auto-fix --report
  ```

## Configuration
- See `config/security_automation.json` for settings (e.g., GitHub token, schedule).

### GitHub token handling (QMOI secret manager)

QMOI can securely store and use a GitHub personal access token for automation tasks (creating PRs, pushing fixes, fetching alerts). The repository includes a minimal secret manager that:

- Encrypts secrets using a master key stored in the OS keyring or provided as `QMOI_MASTER_KEY` (base64 urlsafe).
- Stores encrypted secrets under `.qmoi/` (e.g. `.qmoi/github_token.enc`, `.qmoi/ngrok_token.enc`).
- Provides CLI helpers: `scripts/qmoi_bootstrap_secrets.py` to generate a master key and encrypt tokens, and `scripts/qmoi_git_wrapper.py` to run git commands using the decrypted token.

Important notes and warnings:

- Do NOT commit unencrypted tokens to the repository. If you previously committed the token, rotate it immediately.
- The scripts included are minimal helpers for convenience. For production, integrate with a managed secrets store (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) and implement proper key rotation and audit logging.

Example bootstrap (creates encrypted GH token and optional git helper):

```bash
pip install -r scripts/requirements-secrets.txt
python scripts/qmoi_bootstrap_secrets.py --github-token "<YOUR_GH_TOKEN>" --store-keyring --create-git-helper
```

This creates `.qmoi/github_token.enc` and a helper `.qmoi/git-credential-qmoi.sh` which can be configured as a git credential helper.

## Best Practices
- Review security reports regularly.
- Keep dependencies up to date.
- Address high/critical vulnerabilities promptly.

## Related
- See `TROUBLESHOOTING.md` for common issues.
- See `README.md` for automation commands. 