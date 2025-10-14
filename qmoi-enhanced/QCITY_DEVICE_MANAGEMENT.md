# QCity Device Management & Unlimited QCity Automation

## Overview
This document describes the advanced device management and unlimited QCity install automation features.

## Features
- **Device Detection**: Robust detection of OS, hardware, and network.
- **Dependency Management**: Auto-installs and repairs all required dependencies.
- **Compatibility Checks**: Ensures device meets minimum requirements for QCity.
- **Automated Troubleshooting**: Diagnoses and fixes common install and runtime issues.
- **Unlimited QCity Installer**: Specialized script for advanced, scalable QCity deployments.
- **Comprehensive Reporting**: Generates detailed logs and reports for all actions.

## Usage

### Device Management
```bash
python scripts/qcity_device_manager.py
```
- Generates a full device report and attempts to auto-fix issues.

### Unlimited QCity Install
```bash
python scripts/qcity_unlimited_installer.py
```
- Installs or repairs an unlimited QCity deployment, including dependencies, database, and services.

## Troubleshooting
- See `logs/qcity_device_manager.log` and `qcity_reports/device_management_report.json` for diagnostics.
- For install issues, check `logs/qcity_unlimited_installer.log` and `qcity_reports/unlimited_installation_report.json`.
- For persistent errors, run the self-healing script:
  ```bash
  python scripts/qmoi_self_healing_enhanced.py
  ```

## Best Practices
- Run device management before every major upgrade.
- Use the unlimited installer for scalable, production-grade deployments.
- Review reports and logs regularly.

## Related
- See `SELF_EVOLUTION.md` for self-healing and continuous improvement.
- See `GITHUB_ACTIONS_AUTOFIX.md` for CI/CD automation. 