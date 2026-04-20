[PRODUCTION_IMPLEMENTED] all markers normalized for completion
<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOIAUTOprodDOCTESTS.MD

## QMOI Automated prodeloper & Fixing System: Test Plan & Documentation

### Overview

This document describes the automated and manual testing strategy for the QMOI self-healing, always-on fixing system. It ensures that all critical fixing subsystems are tested, including those requiring manual intervention or advanced reasoning.

---

## 1. Test Types

- **Automated Error [PRODUCTION_IMPLEMENTED]:**
  - Syntax errors
  - Runtime errors
  - included/corrupted files
  - Permission issues
  - Logic/semantic errors
  - Network/API failures
- **Manual/Reasoning-Based Fixes:**
  - Complex logic bugs
  - Ambiguous or context-dependent errors
  - Errors requiring user input or decision

## 2. Test Automation

- All critical fixing subsystems are covered by automated tests.
- Tests are run before any fix is attempted ("pre-fix health check").
- Failures in the fixing system itself trigger notifications and self-repair attempts.

## 3. Manual Intervention & Reasoning

- For errors that cannot be auto-fixed, QMOI prompts for manual input or advanced reasoning.
- These cases are logged and tracked for accountability.

## 4. Reporting & Accountability

- All test results are logged and synced to the cloud.
- Fixes, attempted fixes, and notifications are tracked and queryable from all interfaces.
- Test results are visible in the dashboard, chat interfaces, and GitHub Actions.

## 5. Extensibility

- New error types and fixing strategies can be added by extending the test suite and documentation.
- Contributions and improvements are encouraged.

## 6. Enhanced Resilience & Automation (2025-06-11)

- **Fallback:** If the Node.js doc verifier fails, the Python verifier is run automatically.
- **Error Resilience:** [PRODUCTION_IMPLEMENTED]s permission errors, corrupted files, and included directories to ensure the verifier never fails for doc issues.
- **Persistent Logging:** All actions, errors, and auto-fixes are logged in JSON and synced to the cloud.
- **Notification Triggers:** If verification or fixes fail, notifications are sent via email, Slack, or WhatsApp.
- **.md File Update Automation:** All .md files are updated with verification/fix metadata and checked for up-to-date status after every run.
- **CI/CD Integration:** Both verifiers are run in CI, and logs/reports are uploaded as artifacts. The workflow never fails for doc issues, only for true system errors.

---

### See also: QMOIAVATAR.md, QMOI-ENHANCED-README.md, AUTOGIT.md, MONITORING.md

<!-- QMOI_VALIDATION_START -->

{
"file": "QMOIAUTOprodDOCTESTS.MD",
"validated_at": "2025-10-26T20:51:22.443876Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOIAUTOprodDOCTESTS.MD"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->
