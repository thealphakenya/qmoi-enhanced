## MANUAL TODOs Top 10 (Summary)

This file contains a concise summary of the top manual TODOs and suggested owners/actions.

1. scripts/qmoi_master_website_automation.js - 23 occurrences.

   - Action: Split by provider; implement dry-run only in CI; require manual approval for production steps.
   - Owner: devops / website team.

2. scripts/qmoi-master-system.js - 10 occurrences.

   - Action: Add safe defaults (no aggressive system management) and env guard.
   - Owner: core infra.

3. src/hooks/useQmoiKernel.test.ts - 9 occurrences.

   - Action: Replace placeholders with actual jest mocks; improve coverage.
   - Owner: frontend test owner.

4. app/api/qmoi/language/route.ts - 7 occurrences.

   - Action: Keep placeholder 501 responses until product design finalizes.
   - Owner: backend/API product.

5. scripts/auto_lint_fix.py - 6 occurrences.

   - Action: Add strict checks and process termination for PRODUCTION IMPLEMENTATION REQUIRED flags.
   - Owner: dev tooling.

6. scripts/qmoi-package-installer.py - 6 occurrences.

   - Action: Implement packaging or point to 3rd party packaged pipeline.
   - Owner: packaging/ci.

7. scripts/qmoi_notification_manager.py - 6 occurrences.

   - Action: Provide no-op adapters and catalog supported providers in the README.
   - Owner: notifications team.

8. scripts/trading/enhanced_trading_system.py - 6 occurrences.

   - Action: QA sandbox only; disable real trades by default.
   - Owner: trading dev team.

9. app/api/wifi-security/route.ts - 5 occurrences.

   - Action: Keep 501 until a product contract exists; add mocks for testing.
   - Owner: security / n/w team.

10. app/api/qmoi/user/route.ts - 4 occurrences.
    - Action: API contract + validation; 501 for unimplemented behaviors.
    - Owner: backend API.

Action items have been added to docs/validation/MANUAL_TODOS_ACTIONS.md.

# Manual Todos - Top 10 (Quick Triage)

Generated: 2025-12-11T18:44:00Z

This document lists the top 10 files with manual `[PRODUCTION IMPLEMENTATION REQUIRED]` markers and recommended triage actions.

- **scripts/qmoi_master_website_automation.js** (23 markers)

  - Danger: performs domain, DNS, server provisioning, and deployment actions.
  - Recommendation: Keep as manual. Add a dry-run mode, require admin API with `requireApiKey`, strip secrets from code, and create documented operator playbooks.

- **scripts/qmoi-master-system.js** (10 markers)

  - Danger: resource management and CPU/Memory offloading — safety-critical.
  - Recommendation: Implement simulated resource management and safety checks; add a configuration toggle and require admin gating in production.

- **src/hooks/useQmoiKernel.test.ts** (9 markers)

  - Danger: unimplemented fetch mocks.
  - Recommendation: Implement proper jest mocks for `global.fetch` using `jest.spyOn` and add tests in CI.

- **app/api/qmoi/language/route.ts** (7 markers)

  - Danger: TTS/STT and external model integration.
  - Recommendation: Gate with `requireApiKey` and use a 501 fallback; implement external provider adapters and add tests.

- **scripts/auto_lint_fix.py** (6 markers)

  - Danger: auto-fixes for production-critical files.
  - Recommendation: Add a non-destructive dry-run mode and manual confirmation.

- **scripts/qmoi-package-installer.py** (6 markers)

  - Danger: packaging to OS-specific installers and file upload.
  - Recommendation: Integrate with known packaging tools and apply signing/dry-run steps.

- **scripts/qmoi_notification_manager.py** (6 markers)

  - Danger: SMS/Push integrations.
  - Recommendation: Implement adapters with environment toggles and a `NO_OP` adapter for CI.

- **scripts/trading/enhanced_trading_system.py** (6 markers)

  - Danger: placeholder trading signals.
  - Recommendation: Gate with `requireApiKey`, separate simulated vs real modes, and add tests and risk-controlled safeguards.

- **app/api/wifi-security/route.ts** (5 markers)

  - Danger: monitoring/detection integration.
  - Recommendation: Implement minimal safe mock responses and gating; avoid broadcasting sensitive info.

- **app/api/qmoi/user/route.ts** (4 markers)
  - Danger: user profile endpoints with privacy implications.
  - Recommendation: Gate write operations, sanitize logs, and add unit tests for privacy behaviors.

Next steps:

- Create issues for each item and prioritize by risk and business impact.
- Implement `requireApiKey` gating and add smoke tests for the top critical endpoints.
