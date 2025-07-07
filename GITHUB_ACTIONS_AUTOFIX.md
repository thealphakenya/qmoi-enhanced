# GitHub Actions AutoFix System

## Overview
This document describes the automated system for detecting and fixing GitHub Actions workflow issues.

## Features
- **Workflow Scanning**: Analyzes all workflow YAML files for common errors.
- **Auto-Fix**: Automatically fixes missing permissions, deprecated actions, missing triggers, and more.
- **Security Checks**: Detects and remediates dangerous commands and missing secrets.
- **Performance Optimization**: Suggests and adds caching for faster CI/CD runs.
- **Issue Creation**: Opens GitHub issues for unfixable or high-severity problems.
- **Comprehensive Reporting**: Generates detailed reports and logs for all actions.

## Usage
```bash
python scripts/github_actions_autofix.py
```
- Scans, fixes, and reports on all workflow issues.

## Troubleshooting
- See `logs/github_actions_autofix.log` and `reports/github_actions_autofix_report.json` for details.
- For persistent or unfixable issues, review the created GitHub issues and follow recommendations.

## Best Practices
- Run the autofix script after any workflow changes.
- Integrate into your CI/CD pipeline for continuous workflow health.
- Review reports and logs regularly.

## Related
- See `QCITY_DEVICE_MANAGEMENT.md` for device and install automation.
- See `SELF_EVOLUTION.md` for self-healing and continuous improvement. 

## Enhanced Dependency Error Handling

- The autofix system now scans workflow logs for pip version mismatches and npm peer dependency warnings.
- If such errors are detected, the self-healing script (`scripts/qmoi_self_healing_enhanced.py`) is triggered automatically.
- Types of errors handled include:
  - pip version errors (e.g., 'requires pip', 'pip is too old')
  - npm peer dependency warnings (e.g., 'peer dependency', 'no matching version found')
  - General dependency and version resolution errors
- All actions are logged for traceability.

## Integration with Self-Healing
- The self-healing script will attempt to auto-fix detected issues and log/report the results.
- If an error cannot be auto-fixed, a GitHub issue may be created for manual intervention. 