---
title: "Issue draft for docs/LION-USAGE-PLAN.md"
generated: 2025-11-08T16:06:38.365694Z
---

# Review needed: docs/LION-USAGE-PLAN.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "LION Usage & Enhancement Plan"
qmoi_validation_frontmatter: true
---

# LION Usage & Enhancement Plan

This document outlines a safe, staged plan to enhance how LION is used across projects, documentation, automation, revenue-related systems, wallets, and APIs.

Goals
- Make LION a first-class, auditable orchestrator across the repo.
- Remove PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) content in docs and code paths relating to LION and replace with actionable commands or links to signed artifacts.
- Add validation and reporting so changes are discoverable by CI and the `scripts/run_validations.py` orchestrator.

Phased approach

1. Inventory (done)
   - We already created `docs/md_index.json` and `docs/lion_usage_report.json` (scan script).

2. Conservative remediation (low-risk)
   - Replace LION placeholders in docs only (requires `--apply`).
   - Add LION verification metadata blocks to key `.md` files using existing autotagging scripts.

3. Automation and CLI
   - Expand `tools/lionctl` with commands: verify, status, bootstrap, build, selfheal.
   - Add `lionlaunch.json` launch configs for repeatability.

4. CI and Releases
   - Add GitHub Actions workflows to build artifacts for all platforms required by docs and publish them to Releases/CDN.
   - Add `scripts/check_github_releases.py` to assert release assets match `qcity-artifacts/qmoi_build_report.json`.

5. Revenue & Wallets
   - Audit existing wallet and payment integration points.
   - Add secure credential handling and audit logs. Do not store secrets in repo.

6. Validation & Monitoring
   - Add nightly or on-push validation runs that produce machine-readable reports (`docs/*.json`) and open issues/PRs for missing artifacts.

Next steps (short term)
- Run `python3 scripts/scan_lion_usage.py` to produce `docs/lion_usage_report.json`.
- Triage the top 30 files with LION mentions and plan replacements in a PR branch.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/LION-USAGE-PLAN.md",
  "validated_at": "2025-10-26T20:51:22.693585Z",
  "validator": "QMOI Lion (automated)
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
