---
title: "Issue draft for HOOKS.md"
generated: 2025-11-08T16:06:38.280119Z
---

# Review needed: HOOKS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:41.724996Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:41.724996Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:41.724996Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
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

**Status:** All hooks are now checked for usage and integration. No unused/duplicate hooks will remain after next cleanup. All hook features are covered for QCity, QMOI AI, and QMOI Space.

## Zero-
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
