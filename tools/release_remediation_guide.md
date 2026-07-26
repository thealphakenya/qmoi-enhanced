# Release Remediation Guide

This guide documents safe, production-ready steps to fix releases that contain [AUTOFIXED by Ollama at 2026-07-26T18:54:45.618177Z] or corrupt assets.

Steps for maintainers
1. Identify flagged releases: `tools/releases_audit.md` lists releases flagged by automated heuristics.
2. For each flagged release tag (e.g., `v1.2.5`):
   - Build or locate the correct binary/artifact per platform (Windows `.exe`, macOS `.dmg`/`.zip`, Linux `.deb`/`.AppImage`, Android `.apk`, iOS `.ipa`).
   - Ensure binaries are signed/reproducible where applicable.
   - Prepare checksums (SHA256) for each artifact.
   - Include proper icons for apps (favicon, platform-specific icons) and a `release_notes.md` describing changes.
3. Upload artifacts to the GitHub release via web UI or the `gh` CLI: `gh release upload <tag> <files...>`.
4. Attach autoupdate metadata where applicable:
   - AppImage: include `update.json` with `version` and `files` entries.
   - Sparkle (macOS): include `.zip` and Sparkle appcast metadata.
   - Windows: include NSIS or Squirrel/WinSparkle metadata if used.
5. Validate release by downloading assets and verifying checksums.
6. Update `tools/releases_audit.md` and close the corresponding issue once remediated.

Automation helpers included in this repo:
- `scripts/audit_releases.py` — flags problematic releases based on heuristics.
- `scripts/create_issues_from_audit.py` — creates GitHub issues (stdlib variant exists as `create_issues_from_audit.py`).

Templates and examples are in `tools/release_templates/`.
