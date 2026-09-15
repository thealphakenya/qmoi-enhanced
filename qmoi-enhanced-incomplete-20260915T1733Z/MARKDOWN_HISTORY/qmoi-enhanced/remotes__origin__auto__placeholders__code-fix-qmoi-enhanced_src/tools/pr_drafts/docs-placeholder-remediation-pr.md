# PR Draft: Documentation Placeholder Remediation (auto/placeholders/docs-fix-3)

Summary:
- Converted doc-level (P3) placeholder tokens into clear 'PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md)' notes.
- Updated `placeholdrefs.txt` and `placeholdrefs_P{0..3}.txt` with a current scan of placeholder occurrences.
- Generated `reports/placeholders_scan.json` with a small summary showing 2677 total placeholder occurrences with P0=460, P3=2214 (P1 and P2 minimal).
- Removed large generated reports from the branch and moved them to `/tmp/qmoi_reports/` to avoid git push size limits; smaller summary reports were kept.

Files changed:
- Many docs updated under `docs/`, `README.md` and other docs files to replace placeholder tokens (1056 docs modified in the initial attempt).
- New/Updated: `placeholdrefs.txt`, `placeholdrefs_P0.txt`, `placeholdrefs_P1.txt`, `placeholdrefs_P2.txt`, `placeholdrefs_P3.txt` and `reports/placeholders_scan.json`.

Risks & Notes:
- This PR is low risk (docs-only). No code changes were applied here.
- Large reports were intentionally excluded from the commit; they are available in `/tmp/qmoi_reports/` if needed.

Suggested next steps:
1. Review and merge this docs PR to remove noise and enable easier PR review for code-level placeholder fixes.
2. Triage P0 (critical) files using `placeholdrefs_P0.txt` and the issue drafts in `tools/issue_drafts/`.
3. Create small targeted code-fix PRs for P0 files in small batches (component by component) with CI gating.

Related artifacts:
- `reports/placeholders_scanner_report_docs_branch.json`
- `reports/placeholders_suggest.json`
- `tools/issue_drafts/` (contains generated P0 issue drafts)

---

**Automated actions:** This PR was prepared by automation on branch `auto/placeholders/docs-fix-3` and should be reviewed by maintainers prior to merging.
