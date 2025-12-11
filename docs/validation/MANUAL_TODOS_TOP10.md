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
