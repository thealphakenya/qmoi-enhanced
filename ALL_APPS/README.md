<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.050707Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
---
title: "ALL_APPS — central registry for built application artifacts"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# ALL_APPS — central registry for built application artifacts

This directory is the canonical place for storing built application artifacts across QMOI projects.

Structure:

- ALL_APPS/<category>/<platform>/<project-name>-<version>/...artifact files...

Categories:

- [qcity](https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai) — QCity apps and artifacts
- qmoi-ai — QMOI AI apps and models
- qmoi-space — QMOI Space related apps
- pwa — progressive web apps (shared across platforms)
- native — packaged native apps (android/ios/desktop)

Notes:

- Use `scripts/register_app_build.py --copy` to copy detected build outputs into this directory (dry-run first).
- Keep artifacts small and include a manifest.json inside each version folder with metadata (name, version, build_date, source_path).

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:28Z

---
*This document is maintained by QMOI's autonomous evolution system*
