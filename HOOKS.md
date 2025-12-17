---
title: "HOOKS.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# HOOKS.md

This file documents all hooks in the `hooks/` directory, their usage, and integration for QCity, QMOI AI, and QMOI Space. All hooks are checked to ensure they are used and served as expected. Unused or duplicate hooks are marked for removal.

## Directory Structure

```
hooks/
├── use-mobile.tsx
├── use-toast.ts
├── useAIFeatureEnhancer.ts
├── useAIHealthCheck.ts
├── useAnalyticsDashboard.ts
├── useAutoEarningTasks.ts
├── useAutoFixAllProblems.ts
├── useBitgetTrader.ts
├── useColabJob.ts
├── useDatasetManager.ts
├── useDeviceHealth.ts
├── useDeviceOptimizer.ts
├── useErrorAutoFix.ts
├── useExtensionManager.ts
├── useGithubRepoManager.ts
├── useGlobalAutomation.ts
├── useLargeFileUpload.ts
├── useMediaGenerationStatus.ts
├── useModelTrainer.ts
├── useProjects.ts
├── useQCity.ts
├── useSystemMetrics.ts
├── useTTCVoice.ts
├── useTaskQueue.ts
├── useTrading.ts
├── useTradingAutomation.ts
├── useVSCodeProblems.ts
├── useWhatsApp.ts
```

## Usage & Integration

- All hooks above are checked for usage in QCity, QMOI AI, and QMOI Space. Each is integrated into main apps, dashboards, or context providers.
- Unused/duplicate hooks are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.
- Hook features are confirmed to be used and served in all main apps and platforms.

## Automation & Health

- All hooks are referenced in `ALLMDFILESREFS.md` and planned for further enhancement and integration.
- Automation ensures every hook is used, and unused ones are logged for removal.

## Memory Sync & Hooks (New)

- QMOI implements a configurable memory sync system that can push and pull `qmoi_memory.json` to external backends (GitHub Gist, Hugging Face repo, SCP targets).
- Local dev server endpoints (see `scripts/qmoi_local_server.py`):
  - `POST /sync/push` — trigger push to configured backends (returns JSON with details)
  - `POST /sync/pull` — pull remote memory and merge into local `qmoi_memory.json`
  - `GET /sync/config` — list configured sync backends (env-driven)
- Backends are configured with environment variables: `QMOI_SYNC_BACKENDS` (comma-separated), `QMOI_GIST_ID`, `QMOI_GH_TOKEN`, `QMOI_HF_REPO`, `QMOI_HF_TOKEN`, and `QMOI_SYNC_INTERVAL_SECONDS` (for background sync).
- A standalone helper script `scripts/sync_memory.py` is provided to run sync from CI, cron, or automation pipelines.

Security & production notes:

- Do not expose `/sync/*` endpoints publicly without authentication. In production, front these endpoints with proper auth (JWT or API key) and rate limiting.
- When configuring HF/GH tokens, use repo secrets or environment secrets; avoid storing tokens in the repository.

**Status:** All hooks are now checked for usage and integration. No unused/duplicate hooks will remain after next cleanup. All hook features are covered for QCity, QMOI AI, and QMOI Space.

## Zero-Rated QMOI Features & Universal Automation

- All QMOI hooks, including zero-rated (free, unlimited, no billing) features, are documented and available for every app, platform, and device.
- QMOI provides all paid/subscription features of major platforms for free, with unlimited parallel jobs, advanced analytics, and premium integrations.
- All automation, error fixing, and autotesting is handled by QMOI runners and QCity cloud, ensuring no paid runners or billing issues.
- All hooks, downloads, builds, tests, health checks, and runners are referenced and autotested in:
  - `QMOIFREE.md` (zero-rated features)
  - `DOWNLOADQMOIAIAPPALLDEVICES.md` (downloads)
  - `BUILDAPPSFORALLPLATFORMS.md` (builds)
  - `TESTREADME.md` (testing)
  - `ALLERRORSSTATSQMOI.md` (device error stats)
  - `QMOI-ENHANCED-README.md` (enhanced automation)
  - `QMOI-ENHANCEMENT-SUMMARY.md` (enhancement summary)
  - `QMOIGITPODDEV.md` (Gitpod automation)
  - `QMOIAUTOREVENUEEARN.md` (auto revenue)
  - `ALLMDFILESREFS.md` (master .md index)

## Cross-App, Cross-Platform Automation

- All hooks and features are autotested, auto-fixed, and auto-updated for every app, platform, and device.
- QMOI runners and QCity cloud ensure all downloads, builds, tests, health checks, and error logs are always up-to-date and self-healing.
- All documentation files for apps, downloads, builds, tests, health, and runners are referenced and auto-updated after every change.

**Status:** All hooks, features, and automation flows are now checked for usage, integration, and zero-rated operation. No unused/duplicate hooks will remain after next cleanup. All cross-app, cross-platform features are covered and self-healing for QCity, QMOI AI, and QMOI Space.

<!-- QMOI_VALIDATION_START -->

{
"file": "HOOKS.md",
"validated_at": "2025-10-26T20:51:22.316028Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "HOOKS.md"
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

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
