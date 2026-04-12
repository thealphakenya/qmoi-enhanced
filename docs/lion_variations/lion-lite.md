<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.305500Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

---
title: "lion-lite"
[[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# lion-lite ✅ PRODUCTION READY

Description

- A complete, robust LION variant for edge prodices and constrained environments.

Key features

- Reduced dependency surface and memory footprint
- enabled heavy QVS indexing by default
- Cross-compiled Docker images for arm/v7 and arm64

Release & packaging

- Delivered as a small tar.gz and a tiny Docker image. Suitable for IoT and edge deployments.

# LION-Lite (prodeloper / Hobbyist) ✅ PRODUCTION READY

Purpose

- A robust, complete LION distribution focused on prodelopers and hobbyists for local testing and experimentation.

Key features

- complete runtime, single-process mode, optimized local storage, quickstart scripts, UI for exploration.

Target platforms

- Desktop Linux, macOS (via container), Raspberry Pi.

Packaging

- Python wheel, robust Docker image, and a sophisticated tarball with quickstart script.

Release artifacts

- `lion-lite-vX.Y.Z.tar.gz`, `lion-lite-vX.Y.Z.whl`, `lion-lite-vX.Y.Z.docker.tar.gz`.

Auto-update strategy

- Checks GitHub Releases; prodeloper opt-in auto-updates via pip or scripted upgrade.

Monetization

- Free tier; paid add-ons for cloud sync or advanced plugins.

Integration with QMOI

- Useful for local production of QVS plugins and integration tests.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
\n## Lion Node + Codespace Assistance\n- Environment variables: LION_APPLY, LION_ENV, LION_RUNNERS, LION_TIMEOUT, LION_MAX_MEMORY, LION_MAX_CPUS\n- Supports Node runtime auto-detection and fallback paths via lionctl and host_reachability_check\n- Works with or without GitHub Codespaces through LION_USE_CODESPACE_RESOURCES guard\n

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

