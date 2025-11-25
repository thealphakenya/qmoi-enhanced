---
title: "Issue draft for qmoi-enhanced/TROUBLESHOOTING.md"
generated: 2025-11-08T16:06:38.780222Z
---

# Review needed: qmoi-enhanced/TROUBLESHOOTING.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "TROUBLESHOOTING"
qmoi_validation_frontmatter: true
---

# TROUBLESHOOTING

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

## Automated Fixes for Dependency and Version Issues

- The system now automatically detects and fixes pip version mismatches and npm peer dependency warnings.
- If you see errors like 'requires pip', 'pip is too old', 'peer dependency', or 'no matching version found', these will be auto-fixed by the self-healing system.
- In CI/CD, the GitHub Actions autofix script will trigger the self-healing script if such errors are found in workflow logs.
- For errors that cannot be auto-fixed, a GitHub issue will be created for manual review.

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/TROUBLESHOOTING.md",
  "validated_at": "2025-10-26T20:51:24.846552Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
