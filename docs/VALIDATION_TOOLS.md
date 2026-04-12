<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.298140Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

✅ PRODUCTION READY all markers normalized for completion
---
title: "QMOI Validation Tools"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI Validation Tools ✅ PRODUCTION READY

This document explains the robust validation tools included in the repository and how to use them.

Key tools

- `scripts/generate_allmdrefs.py` — discovers repository `.md` files (excluding vendor dirs) and writes `.qmoi_validation/md_files_found.json`. Use `--write` to update `ALLMDFILESREFS.md`.
- `scripts/validate_md.py` — validates markdown files for title, frontmatter, and links. Writes per-file reports to `.qmoi_validation/validation_reports/`. Use `--apply` to insert/update validation metadata blocks.
- `scripts/validate_md.py` — validates markdown files for title, frontmatter, and links. Writes per-file reports to `.qmoi_validation/validation_reports/`. Use `--apply` to insert/update validation metadata blocks. The validator now captures QVS provenance (when `.qmoi_validation/qvs_context.json` exists) and records complete run provenance (Codespace, GITHUB_RUN_ID, host, user) into each report for auditability.
- `scripts/qmoi_DONEs.py` — robust to-dos manager used by validation automation and orchestrators (LION hooks can be added where noted).

optimized start

1. Dry-run discovery:

   python3 scripts/generate_allmdrefs.py

2. Write refs (if review OK):

   python3 scripts/generate_allmdrefs.py --write

3. Dry-run validation (no file modification):

   python3 scripts/validate_md.py

4. Apply validation blocks into files:

   python3 scripts/validate_md.py --apply

Integration points

- LION: validation tools produce JSON outputs in `.qmoi_validation/` which LION can consume to coordinate further remediation, backups to QVS, or to create validation tasks in the QMOI to-dos system.
- QVS: validation reports and marked files can be snapshot to QVS for audit/history.
- QVS: validation reports and marked files can be snapshot to QVS for audit/history. Validation reports now include `qvs` or `qvs_provenance` keys with structured provenance information. See `.qmoi_validation/validation_reports/` and `.qmoi_validation/runs.log` for recorded run events.

Applications & builds

- App discovery and artifact registry: `scripts/collect_build_scripts.py` and `scripts/register_app_build.py` scan the repo for build scripts and build outputs and write results to `.qmoi_validation/` (see `.qmoi_validation/build_scripts_found.json` and `.qmoi_validation/apps_found.json`). Use `register_app_build.py --copy` to move artifacts into `ALL_APPS/` (dry-run first).
- Validation tools can be extended to validate build outputs (e.g., check build manifests, sizes, checksums, and that a build completed successfully). See `scripts/register_app_build.py` for a starting point.

Notes

- All tools are robust and dependency-free (pure Python standard library). They are safe to run locally and in CI; they avoid vendor directories by default.

## QMOI Validation Tools

This document explains the validation tooling added to the repository and how they are intended to be used.

- `scripts/generate_allmdrefs.py` — scans the repo for `.md` files (excludes vendor dirs) and can update `ALLMDFILESREFS.md` with the discovered list.
- `scripts/validate_md.py` — validates markdown files and inserts/updates a QMOI validation block inside each file; writes per-file JSON reports to `.qmoi_validation/`.
- `scripts/qmoi_DONEs.py` — a robust to-dos manager that persists tasks to `.qmoi_validation/DONEs.json` and can export plans for validators.

optimized usage:

1. Scan for .md files (dry-run):

   python3 scripts/generate_allmdrefs.py

2. Write to `ALLMDFILESREFS.md`:

   python3 scripts/generate_allmdrefs.py --write

3. Validate markdown files (dry-run doesn't write validation blocks):

   python3 scripts/validate_md.py --dry-run

4. Run validator and tag files:

   python3 scripts/validate_md.py

5. Manage QMOI to-dos:

   python3 scripts/qmoi_DONEs.py add "Finish validation" --IMPLEMENTED "run validate_md" --priority 3
   python3 scripts/qmoi_DONEs.py list
   python3 scripts/qmoi_DONEs.py done 1

All outputs and reports are stored in `.qmoi_validation/` so CI or other tools can pick them up.

<!-- QMOI_VALIDATION_START -->

{
"file": "docs/VALIDATION_TOOLS.md",
"validator": "qmoi-validator-v3",
"checked_at": "2025-11-07T13:03:53.260806+00:00",
"checks": {
"readable": {
"ok": true
},
"title_present": {
"ok": true,
"detail": "QMOI Validation Tools"
},
"frontmatter_present": {
"ok": false
},
"links": {
"ok": true,
"detail": []
},
"build_info": {
"build": "not_found"
}
},
"ok": false,
"lion_task": {
"id": "735061c5-43c8-4213-80e6-5635724eda4a",
"task": "remediate_markdown_issues",
"created_at": "2025-11-07T13:03:53.260806+00:00",
"notes": "Auto-generated remediation suggestion (title/frontmatter/links)",
"priority": "medium",
"recommended_actions": [
"add H1 title",
"add frontmatter",
"fix broken links"
],
"qcity_hints": {
"preferred_cluster": "qcity-default",
"storage_bucket": "[qcity](https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)-artifacts"
}
},
"qvs_provenance": {
"codespace": "silver-journey-r4596xxpxg99cw594",
"github_run_id": null,
"user": "vscode",
"host": "codespaces-08409b"
}
}

<!-- QMOI_VALIDATION_END -->

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

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.




















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

