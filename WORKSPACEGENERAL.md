# WORKSPACEGENERAL

- Audit timestamp: 2025-11-11T00:00:00Z
- Total files scanned: 18921
- Files considered done (no original placeholders): 14596
- Files with placeholders detected: 0

## Files referenced
- resumetodos.txt
- donerefs.txt
- allrefs.txt
- allrefs.md

## Automation

Workflows and scripts live under `.github/workflows` and `tools/`.

New automation added (auto-managed):
- `tools/check_links_clean.py` — link/DNS checker (generates reports in `tools/`).
- `tools/apply_link_fixes.py` — conservative http->https auto-fixer (dry-run default).
- `tools/auto_fix_build.py` — conservative build autofixer for missing deps (Node/Python).
- Scheduled link-check workflow: `.github/workflows/scheduled-link-check.yml` (daily).
- Vercel autofix workflow: `.github/workflows/vercel-autofix.yml` (runs on push/PR and will attempt safe fixes and open PRs).

Automation policy: automated changes create PRs (or branches) for review. Low-risk fixes (http->https) are applied automatically per policy; dependency fixes are attempted conservatively and offered as PRs.

Keep this file updated when automation changes.
# WORKSPACEGENERAL

- Audit timestamp: 2025-11-08T15:29:10.283537Z
- Total files scanned: 18921
- Files considered done (no original placeholders): 14596
- Files with placeholders detected: 0

## Files referenced
- resumetodos.txt
- donerefs.txt
- allrefs.txt
- allrefs.md
