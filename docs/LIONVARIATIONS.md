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
- Each variation maps to runtime components and packaging steps used by orchestrator, agents and UIs.
- Variations are referenced in orchestrator metadata and included in QVS provenance records for reproducibility.
- Revenue & distribution: variations support different monetization paths — paid enterprise images, managed cloud offering, plugin marketplace, mobile marketplace, and consulting/licensing.

See `docs/lion_variations/` for per-variation specifications and platform packaging instructions.
# LION Variations — overview

This document catalogues the official LION product family variations, their purpose, target platforms, packaging and release strategy, and how they are used and monetized across QMOI.

Core goals for LION variations
- Provide clear, named variations of the LION platform that target different audiences and platforms (edge, desktop, cloud, embedded, plugin/extension ecosystems).
- Ensure each variation is built, packaged and released automatically into GitHub Releases and the relevant platform stores (Docker Hub, npm, PyPI, app stores) when a release tag is pushed.
- Make each variation discoverable and downloadable, with per-variation docs and release notes.
- Support auto-update strategies per platform and continuous development via CI/CD.

Included variations (high level)
- LION-OS — a minimal Linux-based appliance image with LION services pre-installed (container or image distribution).
- LION-Cloud — cloud-native LION distribution (k8s helm chart, Docker images, cloud automation).
- LION-Enterprise — full-featured LION distribution with enterprise features: RBAC, clustering, SSO connectors, audit logs.
- LION-Lite — lightweight developer edition for local dev and edge devices (small footprint, fast feedback loop).
- LION-Plugin — the plugin packaging format and runtime for LION extensions; distributed via npm/registry or GitHub Releases.
- LION-Extension — UI/Browser extension variant that integrates LION capabilities into web UIs (Chrome/Edge/Firefox packaging notes).
- LION-Embedded — build and packaging targets for constrained devices (ARM, Yocto, cross-compile details).
- LION-AI — opinionated AI-first LION, packaged with model serving, inference optimizations and GPU-aware images.

Each variation has a dedicated spec file under `docs/lion_variations/` which enumerates features, packaging, CI artifacts, and recommended monetization and distribution channels.

Release & automation high-level
- Releases are driven by Git tags (vX.Y.Z). On tag push, the release workflow assembles variation-specific artifacts, creates a GitHub Release, and uploads assets.
- For containerized variants the workflow also builds and pushes container images to Docker Hub / GHCR when registry credentials are configured.
- For language-specific packages (npm, PyPI) the workflow prepares packages and publishes them when credentials are present.
- Auto-update strategies:
  - For containers: use image tags and k8s Deployment rolling updates or image digest-based updates.
  - For desktop or OS images: publish checksums and signed images; provide delta update hints where possible.
  - For extensions/plugins: use registry-based updates or browser store publishing hooks.

Monetization and usage
- Each variation includes guidance for revenue generation (subscription tiers, enterprise licensing, managed hosting), employment (integrators, support engineers, developers), and platform distribution.

Next steps
- Use the per-variation spec files in `docs/lion_variations/` to drive build and release automation and to generate release notes automatically.
- Wire CI to build and publish the artifacts described in each variation spec.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
