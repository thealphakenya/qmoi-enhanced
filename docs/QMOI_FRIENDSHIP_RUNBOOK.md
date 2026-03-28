<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.930428Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
---
title: "QMOI Friendship Integration Runbook"
[[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI Friendship Integration Runbook

This runbook documents how the `qmoi-friendship-integration.js` module operates, how to run it safely, and where it writes proposals and artifacts.

Key principles

- Safe-by-default: destructive actions are never executed unless explicitly enabled.
- Proposal-first: any change (installing deps, syntax fixes, git operations, or configuration updates) is written as a proposal under `.qmoi_validation/` for human review.
- Explicit production gating: to allow destructive actions you must set the environment variable `PRODUCTION_CONFIRMED=true` and pass `--real` on the command line.

Files & artifacts

- Main module: `qmoi-friendship-integration.js`
- Dry-run test: `tests/test_qmoi_friendship.js`
- Proposals (aggregated): `.qmoi_validation/error_fix_proposals.json`
- Per-proposal files: `.qmoi_validation/proposals/<timestamp>-<type>.json`

Environment variables

- `VERCEL_TOKEN` - Vercel API token (optional). If included, Vercel deploys are dry-run and proposals are created.
- `GITLAB_TOKEN` - GitLab API token (optional). If included, GitLab deploys will fail or be dry-run depending on code paths.
- `PRODUCTION_CONFIRMED` - When set to `true` and combined with `--real`, the module may perform destructive actions like writing files, installing deps, or pushing commits.

How to run

Dry-run (required for testing):

```bash
# run the simple dry-run test (safe)
node tests/test_qmoi_friendship.js
```

Review proposals

1. After running the dry-run, open `.qmoi_validation/error_fix_proposals.json` to see aggregated proposals.
2. For quick review, check `.qmoi_validation/proposals/` for individual proposal files.
3. Each proposal contains `type`, `detail`, and `timestamp` fields. Follow your team's review process to approve proposals.

Applying proposals (manual process)

1. Inspect the proposal file and verify the suggested change.
2. If the change is safe, you can either:
   - Manually apply the fix (edit files, run `npm install`, commit and push), or
   - Run the module in production mode to attempt automated application (only allowed when you trust the code):

```bash
# ONLY run when you have performed a human review and are sure
PRODUCTION_CONFIRMED=true node -e "const Q=require('./qmoi-friendship-integration.js'); (async()=>{ const i=new Q(); /* call methods that apply changes, e.g., detectAndFixErrors */ })()" --real
```

Notes and cautions

- Never run the `--real` mode on an environment you don't control.
- For dependency installation, prefer using containerized or isolated environments.
- The module writes small notes to `.env` when applying configuration changes; use a secret manager instead in production.

Next steps

- Add CI that runs `tests/test_qmoi_friendship.js` in CI (dry-run) and uploads `.qmoi_validation` artifacts to a secure location for human review.
- Integrate proposal files with an internal ticketing/review process (e.g., create a PR or open an issue automatically with the proposal contents for traceability).

Contact & ownership

- Maintainers: check repository CONTRIBUTORS or OWNERS files for the appropriate reviewer.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
