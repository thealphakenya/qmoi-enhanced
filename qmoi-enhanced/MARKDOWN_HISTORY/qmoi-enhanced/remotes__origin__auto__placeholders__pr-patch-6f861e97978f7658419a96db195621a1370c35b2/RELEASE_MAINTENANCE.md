**Release Maintenance**
- **Purpose**: Keep GitHub release assets in sync with `release_assets_manifest.json`.

- **Workflows** (`.github/workflows/sync-releases-from-manifest.yml`):
  - **sync-draft** (always runs): Regenerates manifest and syncs to a draft release (safe mode).
    - On tag pushes: uses the tag name as the release tag.
    - On schedule/dispatch: uses commit hash as the draft release tag.
    - Draft releases stay unpublished until manually published on GitHub or via `--publish` flag.
  - **sync-all-releases** (on-demand via dispatch): Syncs assets to all existing published releases (one-time/maintenance).

- **Local commands**:
  - Regenerate manifest: `python3 scripts/generate_release_manifest.py`
  - Dry-check releases: `python3 scripts/check_github_releases.py`
  - Sync to draft release (safe): `python3 scripts/sync_to_draft_release.py [--tag TAG] [--publish]`
  - Sync to all published releases (one-time): `GITHUB_TOKEN="ghp_..." python3 scripts/sync_all_releases.py`
  - Backup before uploads: `gh release download <tag> --repo owner/repo --dir reports/releases_backup/<tag>`

- **Safety & Flow**:
  - Default: assets are synced to **draft** releases (unpublished) for review.
  - Approve and publish via GitHub UI or pass `--publish` flag to script.
  - Existing backups are saved in `reports/releases_backup/<tag>/` before any replacements.

- **Token**: GitHub PAT maintained in `CREDENTIAL_ROTATION_PLAYBOOK.md`. Workflows use `GITHUB_TOKEN` secret.
