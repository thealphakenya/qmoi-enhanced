---
title: "Issue draft for tools/allrefs_summary.md"
generated: 2025-11-08T16:06:39.009082Z
---

# Review needed: tools/allrefs_summary.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "allrefs summary"
qmoi_validation_frontmatter: true
---

# allrefs summary

Counts:

- auto: 5
- manual: 205
- missing: 3
- skip: 1039

Top 20 auto (with patch if available):

- tools/auto_fix_placeholders.py (patch: tools/patches/74ddf5a1585e1c97907f5e3b70c046a8f629ad2e.patch)
- ALLERRORS.md
- ALLERRORS.txt
- QMOIDATABASE.md
- qmoi-enhanced/QMOIDATABASE.md

Top 20 manual:

- ai_self_update.py
- app/api/account-automation/route.ts
- app/api/cashon/balance/route.ts
- app/api/colab-job.ts
- app/api/document-backup/route.ts
- app/api/earning/route.ts
- app/api/media/generate/route.ts
- app/api/mpesa/callback/route.ts
- app/api/qapikey/route.ts
- app/api/qmoi-database/route.ts
- app/api/qmoi-model.ts
- app/api/qmoi/auto-fix/download-report/route.ts
- app/api/qnews/route.ts
- app/api/qradio/route.ts
- app/api/social-automation/route.ts
- app/api/wifi/scan/route.ts
- components/BrowserInterface.tsx
- components/QmoiMediaManager.tsx
- docs/placeholders_report.json
- hooks/useExtensionManager.ts

Missing files:

- All
- Generated
- downloads/qmoi

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
