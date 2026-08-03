Title: [AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]-PROD-REPORTS

Summary:
Large generated reports (e.g., `link_report.md`, `reports/suggestions.json`, `NONPROD_REPORT_HEAD.txt`) contain many `[AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]_PROD` occurrences coming from generators or external link text. Manual curation or generator fixes are required.

Objectives:

- Identify generators that produce these reports and modify them to avoid emitting raw [AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review] tokens.
- Curate the content in large reports to replace `[AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]_PROD` occurrences where safe and ensure external links are not corrupted.
- Add post-generation sanitization step to annotate [AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]s instead of raw tokens.

Acceptance Criteria:

- `link_report.md` and key files are regenerated without raw `[AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]_PROD` tokens (or have explicit `REVIEWED` annotations created by generator).
- A test (or lint rule) prevents future regression: CI job fails if `[AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]_PROD` tokens remain in critical reports.
- `[AUTOFIXED by Ollama at 2026-07-20T01:19:39.568268Z: please review]_PROD_BATCH_PENDING.md` is resolved and empty except for newly added ambiguous cases that need human attention.


---
Automated update by Ollama agent at 2026-07-20T01:19:39.568268Z. Please review changes above.
