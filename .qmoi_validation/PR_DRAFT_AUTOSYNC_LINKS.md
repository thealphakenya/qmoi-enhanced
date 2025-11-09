Title: Draft PR — autosync-links-20251107 (conservative doc fixes & triage drafts)

This is a draft PR description prepared by the automation run so maintainers can review the conservative changes applied and the per-file triage drafts.

Summary of changes in branch `autosync-links-20251107`:
- Added fast scanner `scripts/nonprod_scanner.py` and generator `scripts/generate_issue_drafts_from_nonprod_scan.py`.
- Filtered `donerefs.txt` to remove files that contain obvious non-production markers (TODO, FIXME, simulated, webhook/call notes, etc.) — backups are available.
- Generated per-file triage drafts for the removed files under `tools/issue_drafts/` (1,077 files in the second pass).

Artifacts and backups (pushed to `autosync-artifacts-20251107`):
- `.qmoi_validation/nonprod_scan_report.txt`
- `.qmoi_validation/nonprod_scan_report.json`
- `.qmoi_validation/nonprod_scan_removed_second.txt`
- `donerefs.txt.nonprod_scan.bak` and `donerefs.txt.nonprod_scan2.bak`

Recommended reviewer actions:
1. Review `tools/issue_drafts/` for high-priority files (start with the top entries listed in `tools/matches_priority.md`).
2. For code files flagged as non-prod (e.g., handlers with TODOs), decide whether to fix, annotate, or keep out of `donerefs.txt`.
3. After merging fixes, run `scripts/verify_and_finalize_done.py` to re-add safe files to `donerefs.txt`.

Notes:
- This PR intentionally avoids making code changes. It focuses on detection, reporting, and conservative removal from `donerefs.txt` so maintainers can triage.
- Full logs and backups are preserved on the artifacts branch `autosync-artifacts-20251107`.

Automated by: repository automation on 2025-11-08
Title: Draft PR — autosync-links-20251107 (conservative doc fixes & triage drafts)

This is a draft PR description prepared by the automation run so maintainers can review the conservative changes applied and the per-file triage drafts.

Summary of changes in branch `autosync-links-20251107`:
- Added fast scanner `scripts/nonprod_scanner.py` and generator `scripts/generate_issue_drafts_from_nonprod_scan.py`.
- Filtered `donerefs.txt` to remove files that contain obvious non-production markers (TODO, FIXME, simulated, webhook/call notes, etc.) — backups are available.
- Generated per-file triage drafts for the removed files under `tools/issue_drafts/` (1,077 files in the second pass).

Artifacts and backups (pushed to `autosync-artifacts-20251107`):
- `.qmoi_validation/nonprod_scan_report.txt`
- `.qmoi_validation/nonprod_scan_report.json`
- `.qmoi_validation/nonprod_scan_removed_second.txt`
- `donerefs.txt.nonprod_scan.bak` and `donerefs.txt.nonprod_scan2.bak`

Recommended reviewer actions:
1. Review `tools/issue_drafts/` for high-priority files (start with the top entries listed in `tools/matches_priority.md`).
2. For code files flagged as non-prod (e.g., handlers with TODOs), decide whether to fix, annotate, or keep out of `donerefs.txt`.
3. After merging fixes, run `scripts/verify_and_finalize_done.py` to re-add safe files to `donerefs.txt`.

Notes:
- This PR intentionally avoids making code changes. It focuses on detection, reporting, and conservative removal from `donerefs.txt` so maintainers can triage.
- Full logs and backups are preserved on the artifacts branch `autosync-artifacts-20251107`.

Automated by: repository automation on 2025-11-08
