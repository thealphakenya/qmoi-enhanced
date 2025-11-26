# PR Draft: Add TBD: See PLACEHOLDER_REMEDIATION_PLAN.md check gating workflow

This PR adds a GitHub Actions workflow (proposed) to block PR merges if critical (P0) files contain TBD: See PLACEHOLDER_REMEDIATION_PLAN.md tokens. The gating logic detects placeholders in directories such as `app/api/` and `src/services/` and fails the job if matches are found. This prevents P0 placeholders from getting merged into production branches.

Files included:
- `.github/workflows/TBD: See PLACEHOLDER_REMEDIATION_PLAN.md-check.yml` (proposed) — placed under `tools/workflows_proposals/` for review.

Behavior:
- Runs on PRs and scans for TBD: See PLACEHOLDER_REMEDIATION_PLAN.md markers using the existing `tools/find_placeholders.py` script.
- If matches occur in critical paths, the job fails and a clear message about P0 placeholders is printed for triage.

Notes & Next Steps:
- This is a proposed gating action; maintainers can move it into `.github/workflows/` after review.
- The action is conservative and only checks for well-known markers but can be extended to detect more patterns.

---

Please review and consider enabling this gating workflow as part of your CI policy.
