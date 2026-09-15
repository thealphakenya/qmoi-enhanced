## QMOI Tools & QTools — Overview

This document describes the enhanced toolchain (QTOOLS) used across the repository and how QMOI + LION orchestrate validation, builds, and releases.

Key improvements implemented:

- Auto env loading: tools now load non-sensitive defaults from `.qmoi_validation/auto_env.json` when environment variables are not provided. This allows the automation to propose, run and annotate flows even when CI secrets aren't set. Sensitive values (tokens) are intentionally left empty in the template and must be provided for publishing.
- Richer LION task stubs: validation and build tools now write LION task/event stubs with unique IDs, priority, recommended actions and `qcity_hints` to help orchestrators route remediation to QCity resources.
- Conservative publish: release automation will only create release proposals by default. Publishing requires `GITHUB_TOKEN` or an explicit configuration in `.qmoi_validation/auto_env.json` and remains opt-in.

Files of interest

- `scripts/validate_md.py` — markdown validation, history, LION stubs.
- `scripts/validate_builds.py` — artifact checks and remediation tasks.
- `scripts/release_automation.py` — proposal generation and optional publish.
- `.qmoi_validation/auto_env.json` — defaults and non-sensitive configuration.

Autodev behavior (how QMOI operates automatically)

- Discovery: runs `generate_allmdrefs.py` to keep `ALLMDFILESREFS.md` current.
- Validation: runs `validate_md.py` (dry-run), produces per-file reports and LION tasks for failures.
- Build checks: runs `validate_builds.py`, produces build reports and remediation tasks.
- Release: runs `release_automation.py` to create proposals; will only publish when authorized.

Safety and billing

- QMOI will not create cloud resources or enable billable services automatically. Any cloud-specific provisioning is recorded in `qcity_hints` and left for a human or a guarded CI workflow with explicit credentials.
- Uploading large binaries to third-party services is always gated behind explicit `--upload` flags and available credentials. This avoids accidental GitHub storage/bandwidth costs.

Extending QTOOLS

- To add a new validator, create a script under `scripts/` that follows the pattern: write JSON reports into `.qmoi_validation/`, and emit LION stubs into `.qmoi_validation/lion_tasks/`.
- Use `AUTO_ENV` values in scripts to pick reasonable defaults.

---

Add this file to `ALLMDFILESREFS.md` via generator.
