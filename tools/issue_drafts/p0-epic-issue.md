Title: P0 TBD: See PLACEHOLDER_REMEDIATION_PLAN.md Remediation – Critical files (Epic)

Body:
This epic collects all critical (P0) files containing `TBD: See PLACEHOLDER_REMEDIATION_PLAN.md` tokens. These are usually backend APIs, critical services, or test suites that can impact production behavior.

Summary:
- Total P0 files: 460 (see `placeholdrefs_P0.txt`)
- This epic aims to triage and assign owners for P0 TBD: See PLACEHOLDER_REMEDIATION_PLAN.md fixes. Each P0 file should have a follow-up issue (or be added to this epic) and prioritized for implementation.

What to do:
1. Review `tools/issue_drafts/` for drafts of individual P0 issues (one file per critical item) and refine/assign owners.
2. For each P0 file, create a small PR implementing: a) an explicit `raise NotImplementedError` or `501 Not Implemented` response for API endpoints, or b) a minimal safe implementation with unit tests if trivial.
3. Merge PRs into master only after passing CI and manual verification for critical routes.

Resources:
- `placeholdrefs_P0.txt` — list of P0 files.
- `tools/issue_drafts/` — individual issue drafts for each P0 file (use as a starting point).
- `tools/code_fixes/` — per-component ISSUE.md skeletons to guide development.

Priority:
- Start with endpoints that expose write operations or payments (payment/revenue, backups, master controls) and API routes visible to users.
- Next, cover core services and scheduled scripts.

---
Please refine and create the issues in GitHub using the content above.
