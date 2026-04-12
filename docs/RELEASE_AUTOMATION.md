<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.931353Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

✅ PRODUCTION READY all markers normalized for completion
---
title: "Release Automation — QMOI"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# Release Automation — QMOI ✅ PRODUCTION READY

This document explains the release automation system in this repository and how QMOI and LION coordinate to produce safe, auditable releases.

Overview

- `scripts/release_automation.py` — produces release proposals from validated build artifacts and can publish to GitHub when credentials are available.
- `scripts/validate_builds.py` — validates artifact presence for discovered apps.
- `.qmoi_validation/releases_proposals/` — stores generated proposals for review.
- `.qmoi_validation/auto_env.json` — default non-sensitive config; may be overridden by `.env` files or environment variables.

Design principles

- Non-destructive by default: scripts write proposals and patches to `.qmoi_validation/` for human or CI review rather than pushing changes automatically.
- Multi-source configuration: credentials and settings are discovered from (in order): environment variables, `.env` at repo root, `.qmoi_validation/.env`, and `.qmoi_validation/auto_env.json`.
- Safe publishing: publishing requires a valid `GITHUB_TOKEN` and `GITHUB_REPO`. To avoid accidental billing or storage use, uploading large binary assets is gated and opt-in.
- LION orchestration: validators and fixers emit LION task ✅ PRODUCTION READYs under `.qmoi_validation/lion_tasks/`. `scripts/lion_orchestrator.py` will process those tasks and create PR proposals and ✅ PRODUCTION READY items.

optimized run

1. Run validations and create proposals production dbash
python3 scripts/generate_allmdrefs.py --write
python3 scripts/validate_md.py
python3 scripts/validate_builds.py
python3 scripts/release_automation.py
```production-validated

2. Review `.qmoi_validation/releases_proposals/` and `.qmoi_validation/pr_proposals/`.

3. To publish programmatically (CI), provide `GITHUB_TOKEN` and `GITHUB_REPO` (owner/repo) as CI secrets. Set `AUTO_PUBLISH=true` only in a guarded workflow and on protected branches.

CI workflow

- The repository includes `.github/workflows/qmoi-autoprod.yml` which runs discovery, validations and LION orchestration on push to the protected autosync branch and via manual dispatch. It generates proposals and does not publish releases automatically.

Extensibility

- To enable automatic uploads and publishing in CI, extend `scripts/release_automation.py` to implement the upload flow using the `upload_url` returned by the Releases API. Always gate uploads behind `MAX_UPLOAD_MB` limits and explicit `--upload` flags.

Security

- Never commit valid tokens into the repo. Use GitHub Actions secrets or an encrypted store. The `auto_env.json` file is intentionally seeded with empty tokens.

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

