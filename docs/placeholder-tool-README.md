# Placeholder Checker & Template Applier

This tool scans for placeholders in the repository and optionally applies safe replacements using configurations.

Features
- Scans repository files for placeholders such as `{AVATAR}`, `{PLACE}`, `{FACE}`, `{RELEASE_WINDOWS_STATUS}` and more.
- Supports mapping replacements based on JSON configs under `config/`.
- Approval and denylist flows for safety and compliance.
- Notifier integration to report summaries via Slack, Email, or WhatsApp.
- CI integration: PR scanning, PR comment reporting, and push validation.

Configs
- `config/place-mappings.json` — place names to sample from.
- `config/face-mappings.json` — available face mappings/expressions.
- `config/avatar-config.json` — avatar defaults.
- `config/placeholder-config.json` — denyList, approvedList, severity config.
- `config/placeholder_approvals.json` — define tokens requiring manual approval and approved tokens.

CLI
- `node scripts/qmoi_placeholder_checker.js --scan` — scan repo and produce `reports/placeholder_scan_report.json`.
- `--apply` — apply replacements.
- `--dry-run` — show what would change without writing.
- `--force` — override apply approvals guard.
- `--fail-on-find` — exit non-zero if unknown/denied placeholders are found.
- `--no-notify` — suppress notifications.

Approval CLI
- `node scripts/approve_placeholder.js <TOKEN>` — add a token to `config/placeholder_approvals.json`.
 - `node scripts/revoke_placeholder.js <TOKEN>` — remove a token from `config/placeholder_approvals.json`.

Tests
- Unit and detection tests are under `scripts/` and configured in package.json.
- CI runs the placeholder checks and test jobs on PRs and pushes.
 - Unit and detection tests are under `tests/` and configured in package.json using Jest. Run with `npm test`.
 - CI runs the placeholder checks and test jobs on PRs and pushes via the `placeholder-ci-tests.yml` workflow.

How it works
- Scans allowed file types and finds tokens using a regex.
- Resolves tokens using mappings and the `applyMapping` function.
- Writes a JSON report and optionally replaces placeholders with backups.
- Flags denied or unapproved placeholders for review or to fail CI.

Security considerations
- Replacements are sanitized and limited to pre-approved tokens.
- All writes create `<file>.bak` backups.
- Deny list prevents accidental release/disclaimer placeholders from being leaked.

Limitations & Next steps
- Consider adding full test coverage and a `Jest` run to enforce library behavior in PRs.
- Add a small admin workflow for approvals via repository dispatch.
- Add locale-aware place lists and structured avatar mapping for deeper templating.

