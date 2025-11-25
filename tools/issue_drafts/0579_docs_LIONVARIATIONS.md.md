---
title: "Issue draft for docs/LIONVARIATIONS.md"
generated: 2025-11-08T16:06:38.368731Z
---

# Review needed: docs/LIONVARIATIONS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "LION Variations — Overview"
qmoi_validation_frontmatter: true
---

# LION Variations — Overview

This document catalogs the official LION (LION = Large Intelligent Orchestration Network) variations used across QMOI. Each variation is a focused distribution or product built from the same core orchestrator/agents, optimized for different platforms and use-cases. Variations are treated as first-class artifacts and follow an automated build/release workflow.

Core goals for variations
- Consistent naming and metadata
- Automated builds, releases and platform packaging
- Lightweight per-variation docs describing features, platforms and revenue models
- Auto-updates and continuous development (CI-driven)

Variations included in this repository (each has a dedicated spec under `docs/lion_variations/`):

1. lion-core — The canonical orchestrator and core libraries (Python). Suitable for servers and development.
2. lion-agent — Lightweight agent runtime for edge devices (Python/Node builds).
3. lion-os — A minimal operating-system-style appliance image (Docker/OCI) for deployment as a VM/container.
4. lion-plugin — Plugin SDK and curated plugin distribution (node/npm and python packages).
5. lion-extension — Browser/IDE extensions that integrate LION proposals and insights into developer tools.
6. lio (mobile) — Mobile-focused variant (Android/iOS packaging guidance, AAB/IPA artifacts) for on-device agents.
7. lion-cloud — Cloud-native orchestrator distribution with Kubernetes manifests, autoscaling and monitoring presets.

New variations can be added by creating a spec file in `docs/lion_variations/` and declaring the variation name in `scripts/release_helper.py`.

Releases and automation
- Variations are packaged and published automatically when a tag `variation/<name>/vX.Y.Z` or `variation-<name>-vX.Y.Z` is pushed.
- GitHub Actions workflow `.github/workflows/auto_release.yml` handles building artifacts, creating a GitHub Release, and uploading assets.

How variations are used in QMOI
- Each variation maps 
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
