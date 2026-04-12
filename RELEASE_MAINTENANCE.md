<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.435500Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

**Release Maintenance**

- **Purpose**: Keep GitHub release assets in sync with `release_assets_manifest.json`.

- **Workflows** (`.github/workflows/sync-releases-from-manifest.yml`):
  - **sync-final** (always runs): Regenerates manifest and syncs to a final release (safe mode).
    - On tag pushes: uses the tag name as the release tag.
    - On schedule/dispatch: uses commit hash as the final release tag.
    - final releases stay unpublished until manually published on GitHub or via `--publish` flag.
  - **sync-all-releases** (on-demand via dispatch): Syncs assets to all existing published releases (one-time/maintenance).

- **Local commands**:
  - Regenerate manifest: `python3 scripts/generate_release_manifest.py`
  - Dry-check releases: `python3 scripts/check_github_releases.py`
  - Sync to final release (safe): `python3 scripts/sync_to_draft_release.py [--tag TAG] [--publish]`
  - Sync to all published releases (one-time): `GITHUB_TOKEN="ghp_..." python3 scripts/sync_all_releases.py`
  - Backup before uploads: `gh release download <tag> --repo owner/repo --dir reports/releases_backup/<tag>`

- **Safety & Flow**:
  - Default: assets are synced to **final** releases (unpublished) for review.
  - Approve and publish via GitHub UI or pass `--publish` flag to script.
  - Existing backups are saved in `reports/releases_backup/<tag>/` before any replacements.

- **Token**: GitHub PAT maintained in `CREDENTIAL_ROTATION_PLAYBOOK.md`. Workflows use `GITHUB_TOKEN` secret.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:09Z

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

