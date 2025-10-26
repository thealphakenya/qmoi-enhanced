# Link Validation

Purpose

Ensure that all links referenced in documentation and code are reachable and correct. This includes:
- External HTTP(S) links (validate HEAD/GET responses and TLS certificates)
- Local file links (ensure target file exists)
- Intra-doc anchors (ensure heading anchors exist)

Features

- Auto-upgrade `http://` → `https://` where `https://` responds successfully (configurable and safe-first).
- Report unreachable links separately from likely intentional offline references (e.g., private S3 links require credentials).
- Provide actionable output `docs/link_report.json` and a human-friendly summary `docs/link_report.md`.

Usage

The existing script `scripts/validate_and_fix_md.py` implements conservative link fixes. Use the orchestrator (`scripts/run_validations.py`) to run link checks as part of the full pipeline.

