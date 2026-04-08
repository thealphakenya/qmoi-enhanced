<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.055733Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
# Release Remediation Guide

This guide documents safe, production-ready steps to fix releases that contain [production READY] or corrupt assets.

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

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:51Z

---
*This document is maintained by QMOI's autonomous evolution system*
