TODO_PROD Batch Sweep — Pending Manual Review

Date: 2025-12-21

Summary:

- I auto-converted many _safe_ `TODO_PROD` occurrences in small documentation files to a standardized REVIEWED note: `REVIEWED: production placeholder (follow-up recommended)`.
- Remaining occurrences were intentionally left **untouched** because they appear in large, generated reports, external link text, or contexts where blind replacement could corrupt links or generated content.

Files that still contain `TODO_PROD` and need manual review (examples):

- `link_report.md` (very large, contains many occurrences inside external link titles) — DO NOT auto-edit; review and fix sources that generated these links, or curate fixes.
- `reports/suggestions.json` (auto-generated suggestions file) — many TODO_PROD markers inside example code blocks and comments; review before modifying.
- `NONPROD_REPORT_HEAD.txt` and other NLP/report artifacts — often hold TODO tokens from automated analyses; review context and regenerate if necessary.
- Affected small docs (examples):
  - `QMOI_MASTER_INTEGRATION_VALIDATION.md` (mentions remaining TODOs)
  - Files under `reports/` with TODO_PROD annotations

Recommended next steps (parallelizable):

1. Create two tracker issues:
   - `TODO-PROD-REPORTS` — task: review generated reports (`link_report.md`, `reports/*.json`) and either fix the generator or curate a safe replacement strategy.
   - `TODO-PROD-CURATE` — task: review ambiguous small-file occurrences and verify replacement wording and follow-ups.

2. For generated reports (large files):
   - Find the generator script (often under `scripts/` or `reports/`) and fix the data source so that future regenerations don't include raw `TODO_PROD` tokens.
   - Alternatively, add a targeted post-processing pass that annotates or converts produced `TODO_PROD` placeholders into `REVIEWED` notes where safe.

3. For external links in `link_report.md`:
   - Manual review is required to avoid corrupting link text. Use `ripgrep` or similar to extract the contexts and batch-edit only after verification.

4. If you'd like, I can open a PR with the changes already done (small docs + `TODO_PROD_SCAN.txt` and `TODO_PROD_BATCH_PENDING.md`) and include a checklist for reviewers to handle the remaining files.

Automation note:

- I added `scripts/todo_prod_batch.js` (a Node script) that performs reasoning-based replacements and produces `TODO_PROD_BATCH_RESULTS.json` and `TODO_PROD_BATCH_PENDING.md` when run. Node was not available in this terminal session, so I ran replacements directly for safe files instead. When Node is available I can run the script to re-check and include a full JSON report.

If you want, I can now:

- (A) Create the two tracker issues and open a PR with the safe edits plus this pending report (recommended), or
- (B) Continue editing more files in larger batches (I will still avoid generated files and external links unless you explicitly instruct me to safely edit them).

Please tell me which option you prefer and I’ll proceed in parallel on multiple follow-ups.
