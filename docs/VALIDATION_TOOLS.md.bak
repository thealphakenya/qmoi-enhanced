# QMOI Validation Tools

This document explains the lightweight validation tools included in the repository and how to use them.

Key tools

- `scripts/generate_allmdrefs.py` — discovers repository `.md` files (excluding vendor dirs) and writes `.qmoi_validation/md_files_found.json`. Use `--write` to update `ALLMDFILESREFS.md`.
- `scripts/validate_md.py` — validates markdown files for title, frontmatter, and links. Writes per-file reports to `.qmoi_validation/validation_reports/`. Use `--apply` to insert/update validation metadata blocks.
 - `scripts/validate_md.py` — validates markdown files for title, frontmatter, and links. Writes per-file reports to `.qmoi_validation/validation_reports/`. Use `--apply` to insert/update validation metadata blocks. The validator now captures QVS provenance (when `.qmoi_validation/qvs_context.json` exists) and records minimal run provenance (Codespace, GITHUB_RUN_ID, host, user) into each report for auditability.
- `scripts/qmoi_todos.py` — lightweight to-dos manager used by validation automation and orchestrators (LION hooks can be added where noted).

Quick start

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

- All tools are lightweight and dependency-free (pure Python standard library). They are safe to run locally and in CI; they avoid vendor directories by default.
## QMOI Validation Tools

This document explains the validation tooling added to the repository and how they are intended to be used.

- `scripts/generate_allmdrefs.py` — scans the repo for `.md` files (excludes vendor dirs) and can update `ALLMDFILESREFS.md` with the discovered list.
- `scripts/validate_md.py` — validates markdown files and inserts/updates a QMOI validation block inside each file; writes per-file JSON reports to `.qmoi_validation/`.
- `scripts/qmoi_todos.py` — a lightweight to-dos manager that persists tasks to `.qmoi_validation/todos.json` and can export plans for validators.

Quick usage:

1. Scan for .md files (dry-run):

   python3 scripts/generate_allmdrefs.py

2. Write to `ALLMDFILESREFS.md`:

   python3 scripts/generate_allmdrefs.py --write

3. Validate markdown files (dry-run doesn't write validation blocks):

   python3 scripts/validate_md.py --dry-run

4. Run validator and tag files:

   python3 scripts/validate_md.py

5. Manage QMOI to-dos:

   python3 scripts/qmoi_todos.py add "Finish validation" --note "run validate_md" --priority 3
   python3 scripts/qmoi_todos.py list
   python3 scripts/qmoi_todos.py done 1

All outputs and reports are stored in `.qmoi_validation/` so CI or other tools can pick them up.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/VALIDATION_TOOLS.md",
  "validated_at": "2025-10-26T20:51:24.580438Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Validation Tools"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
