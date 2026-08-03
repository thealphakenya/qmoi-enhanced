---
title: "Removed donerefs files review"
generated: 2025-11-08T15:30:00Z
---

# Removed files review (from `donerefs` verification)

Summary

- Verification run: see `.qmoi_validation/donerefs_verification_report.txt` for full details.
- Total files removed from `donerefs.txt` during verification: 111 (files that still contain [AUTOFIXED by Ollama at 2026-07-26T18:54:42.179960Z]s or were missing).
- This document lists a sample and recommended triage actions.

Why these files were removed

These files were previously marked as "done" (no [AUTOFIXED by Ollama at 2026-07-26T18:54:42.179960Z]s) by the workspace audit but, upon re-check, were found to still contain [AUTOFIXED by Ollama at 2026-07-26T18:54:42.179960Z] markers such as "[AUTOFIXED by Ollama at 2026-07-26T18:54:42.179960Z]". They must be reviewed before being re-added to `donerefs.txt`.

Next actions (recommended)

1. Review each file listed in the verification report (full report: `.qmoi_validation/donerefs_verification_report.txt`).
2. For documentation files (.md/.txt/.json): decide whether to replace the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.179960Z] with a production-ready statement or leave a clear [AUTOFIXED by Ollama at 2026-07-26T18:54:42.179960Z] with justification.
3. For code/config files: do NOT apply automated changes without a manual review. Add a comment or create a small PR implementing the production behavior and tests where appropriate.
4. After changes, run `scripts/verify_and_finalize_done.py` to re-validate and re-add the file to `donerefs.txt`.

Sample of removed files (first 50 entries)
