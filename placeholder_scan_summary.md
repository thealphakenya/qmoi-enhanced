---
title: "Placeholder Scan Summary"
qmoi_validation_frontmatter: true
---

# Placeholder Scan Summary

Created by running `tools/find_placeholders.py`.

- Total matches found: 27736
- Files with matches: 1264

Top sample files with high counts (first entries from `allrefs.txt`):

1. .qmoi_validation/placeholder_suggestions.json — 8593 matches
2. .qmoi_validation/placeholders.json — 3166 matches
3. .qmoi_validation/placeholder_report.json — 408 matches
4. .qmoi_validation/links_report.json — 98 matches
5. .qmoi_validation/link_update_plan.json — 54 matches
6. qmoi-enhanced/app/api/qmoi-model.ts — 36 matches
7. docs/\* and many `qmoi` docs — multiple matches across many files

Notes & next actions

- Run `tools/auto_fix_placeholders.py` (dry-run) to generate `placeholder_fixes.patch` for conservative fixes.
- Review high-volume generated JSON validation files in `.qmoi_validation/` — many matches are probably auto-generated and need targeted filtering (these files may be validation artifacts rather than source code).
- Use `tools/update_all_md_refs.py` to regenerate `ALLMDFILESREFS.md` after new .md files are added.

Location of detail outputs:

- `matches.json` — per-match detailed records
- `allrefs.txt` — list of file paths and counts

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
