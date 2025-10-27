# QMOI Documentation Remediation Plan (merged)

This plan summarizes automated and manual remediation steps for docs and placeholders. The recommended automated commands reference scripts already present in the repository.

Generated: 2025-10-25T00:00:00Z

Status update (2025-10-25): stub artifacts were created under `downloads/` for Windows/mac/linux/android/ios/chromebook/raspberrypi/smarttv and `/workspaces/qmoi-enhanced/qmoi-enhanced/qcity-artifacts/qmoi_build_report.json` was updated with concrete artifact paths, checksums and sizes. These are small stub files used to remove TBD (auto-filled) references and enable link-validation; CI should replace them with real builds in production.

This file summarizes the key remediation actions derived from the repository's automated scans:

- Primary sources:
  - `docs/link-validation-report.json` — full link/anchor validation output (large).
  - `docs/placeholders_report.json` — placeholders/TODOs found across code and docs (see `scripts/find_placeholders.py` which generates `placeholder_scan_report.json`).

Top priorities (automatable first):

1) Missing binary/artifact links referenced in docs
   - Examples: many references under `Qmoi_apps/*` (windows/mac/android/ios/linux) and `pwa_apps/*` are missing in the workspace.
   - Action: add CI builds to produce these artifacts or update docs to point to a stable external mirror (e.g. `downloads.qmoi.app`).
   - Responsibility: `ci/build-artifacts` + `docs` maintainers.

2) Broken local anchors in docs
   - Many `#anchor` targets in `.md` files are referenced but not present.
   - Action: run a targeted anchor fixer (create missing anchor headings or update links). This is low-risk and can be automated per-file with a PR for each change.

3) Tokens and TODOs
  - `docs/placeholders_report.json` contains many `TODO`/`TBD` occurrences across `components/*.tsx`, `next.config.mjs`, and `.md` files.
  - Action: Create targeted issues/PRs for high-priority UI components and apply safe automated replacements for low-risk tokens. Use `scripts/find_placeholders.py` to generate an inventory and then apply doc/config-only replacements in a branch for review. Always create backups before applying replacements.

4) Non-HTTPS links (http://)
   - The conservative fixer script can upgrade `http://` → `https://` where HEAD succeeds. This should be run with `--apply` and will create a `docs/link_report.json` with detailed results.

5) Prioritized per-area remediation plan
   - Docs & downloads (highest): fix `Qmoi_apps/*` references by adding CI artifact builds or documentation notes that these files are produced by the release pipeline.
   - UI components (high): `components/AutomationRulesPanel.tsx`, `Chatbot.tsx`, `AppManager.tsx`, `DeviceSettingsPanel.tsx`, `DownloadManager.tsx`, `enhanced-system-dashboard.tsx`, `EnhancedPreviewWindow.tsx`. These contain placeholders and require developer attention + unit/visual tests.
   - API verification: extract live endpoints from `app/api` and test against a local dev server; update `API.md` and `ENDPOINTS.md` with verified examples.

 Low-risk automated operations (recommended immediate):
  - Run: `python3 scripts/lion_scan_and_cache.py` to build a local docs cache for offline workflows and surface any missing local files.
  - Run: `python3 scripts/find_placeholders.py` (dry-run) and review `placeholder_scan_report.json` before applying replacements. For link fixes, run a link-checker and prefer upgrading `http://`→`https://` only after verifying the remote host supports HTTPS.

Notes on governance and safety
 - All automated writes must create `.bak` backups (scripts do this). Commits should be made in feature branches and opened as PRs, not pushed directly to default branch, unless explicitly approved.
 - For artifact production, prefer CI builds (GitHub Actions) that produce release artifacts and upload them to `downloads.qmoi.app` or GitHub Releases; do not add large binary blobs to this repo.

Next steps (short):
 - Confirm and run the `validate_and_fix_md.py --apply` step (low-risk).
 - Run TBD (auto-filled) scanner and decide whether to apply safe replacements repo-wide (recommend staged PRs for big files).
 - Create CI job skeletons for artifact builds and add them as draft workflows.

Reference files:
 - `docs/link-validation-report.json`
 - `docs/placeholders_report.json`

---
Auto-generated plan (QMOI Auto-Docs)

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/merged_remediation_plan.md",
  "validated_at": "2025-10-26T20:51:24.583207Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
