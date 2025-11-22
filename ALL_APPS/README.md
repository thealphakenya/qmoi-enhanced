<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

# ALL_APPS — central registry for built application artifacts

This directory is the canonical place for storing built application artifacts across QMOI projects.

Structure:

- ALL_APPS/<category>/<platform>/<project-name>-<version>/...artifact files...

Categories:
- qcity — QCity apps and artifacts
- qmoi-ai — QMOI AI apps and models
- qmoi-space — QMOI Space related apps
- pwa — progressive web apps (shared across platforms)
- native — packaged native apps (android/ios/desktop)

Notes:
- Use `scripts/register_app_build.py --copy` to copy detected build outputs into this directory (dry-run first).
- Keep artifacts small and include a manifest.json inside each version folder with metadata (name, version, build_date, source_path).
