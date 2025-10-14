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

## Best Practices

- Review security reports regularly.
- Keep dependencies up to date.
- Address high/critical vulnerabilities promptly.

## Related

- See `TROUBLESHOOTING.md` for common issues.
- See `README.md` for automation commands.
