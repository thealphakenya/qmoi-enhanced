Title: TODO-PROD-REPORTS

Summary:
Large generated reports (e.g., `link_report.md`, `reports/suggestions.json`, `NONPROD_REPORT_HEAD.txt`) contain many `TODO_PROD` occurrences coming from generators or external link text. Manual curation or generator fixes are required.

Objectives:
- Identify generators that produce these reports and modify them to avoid emitting raw TODO tokens.
- Curate the content in large reports to replace `TODO_PROD` occurrences where safe and ensure external links are not corrupted.
- Add post-generation sanitization step to annotate placeholders instead of raw tokens.

Acceptance Criteria:
- `link_report.md` and key files are regenerated without raw `TODO_PROD` tokens (or have explicit `REVIEWED` annotations created by generator).
- A test (or lint rule) prevents future regression: CI job fails if `TODO_PROD` tokens remain in critical reports.
- `TODO_PROD_BATCH_PENDING.md` is resolved and empty except for newly added ambiguous cases that need human attention.
