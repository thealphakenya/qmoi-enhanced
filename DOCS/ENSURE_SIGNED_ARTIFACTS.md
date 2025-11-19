# Ensuring Signed Artifacts for Releases

This document explains how QMOI enforces that release assets are actual, signed production artifacts across platforms, and how to configure CI and QMOI memory to automate verification and replacement.

1) CI responsibilities
- Produce signed artifacts (Android: signed APK/AAB; iOS: signed IPA; Windows: signed EXE/MSI; Linux: AppImage/DEB with signatures).
- Upload both the artifact and its signature/sha256 file as workflow artifacts and (optionally) to the Release draft.

2) Secrets and permissions
- A short-lived GitHub PAT with `repo` and `workflow` scopes (named `GH_PAT`) must be stored as a repository secret for programmatic workflow dispatch and release uploads.
- QMOI memory API credentials (`QMOI_MEMORY_URL`, `QMOI_MEMORY_TOKEN`) must be configured as secrets for publishing verification metadata.

Note: The Actions `GITHUB_TOKEN` is available inside workflows and can be used to upload release assets when the workflow is triggered by a `release` event. For external dispatch or cross-repo workflow triggers the short-lived `GH_PAT` with `workflow` scope remains necessary.

3) How the automation works (tools/ensure_signed_artifacts.py)
- Checks `release_assets_manifest.json` for expected assets and their sha256.
- Uses GitHub API + `GH_PAT` to inspect releases, workflow runs, and artifacts.
- Downloads built artifacts from workflow runs (artifact zips), verifies sha256/signature files, and uploads signed artifacts to the GitHub Release (deleting old artifacts first).
 - If `CI_ARTIFACTS_DIR` is unset, the script can now download and extract workflow artifacts directly using `--download-artifacts` and use the extracted files as local artifacts.
- Publishes verification metadata (tag, asset name, sha256, verified_at) to QMOI memory so the system always knows which artifact is authoritative.

4) CI recommendations
- Each build workflow should produce an artifact named exactly as the GitHub Release asset (e.g. `qmoi_ai.apk`) and include `qmoi_ai.apk.sha256` and optional `qmoi_ai.apk.asc`.
- On success, the workflow should also optionally upload the artifact directly to GitHub Releases (using `actions/upload-release-asset`) and publish a verification artifact for QMOI to ingest.

5) QMOI memory and enforcement
- QMOI memory stores asset metadata and verification status. The ensure script posts to `/api/v1/release-artifact` with payload {tag, name, sha256, verified_at}.
- QMOI services consult memory before serving download links; if an expected signed artifact is missing or not verified, QMOI will mark the release unhealthy and (optionally) trigger automated rebuilds via the orchestrator.

6) Security and rotation
- Use short-lived PATs and rotate regularly. Limit tokens to the minimum required scopes.
- CI runners that sign artifacts must use secure signing keys stored in secrets (not checked into repo).

7) Running the script
```
./tools/ensure_signed_artifacts.py --repo thealphakenya/qmoi-enhanced --tag v1.2.5 --workflows build-and-release.yml --dry-run --download-artifacts
```

When `GH_PAT` and `QMOI_MEMORY_URL` are set, run without `--dry-run` to execute replacements and publish verification metadata.
