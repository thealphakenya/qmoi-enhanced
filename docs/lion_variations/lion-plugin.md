---
title: "lion-plugin"
qmoi_validation_frontmatter: true
---

# lion-plugin

Description

- A developer-focused distribution that provides plugin SDKs and scaffolding for writing LION handlers.

Key features

- Plugin templates, linters, and test harnesses
- Local dev server for quick iteration

Release & packaging

- Distributed as a Python package and a ZIP containing templates. Published to GitHub releases and PyPI.

# LION-Plugin (Extensibility SDK)

Purpose

- A plugin/SDK distribution enabling third-parties to write plugins and handlers that run inside the LION orchestrator.

Key features

- Stable plugin API, versioned SDK, examples, templates, secure sandboxing recommendations.

Target platforms

- Python packages for plugin authors; optionally npm bindings for UI plugins.

Packaging

- Python package `lion-plugin-sdk` with typed stubs and examples; templates to scaffold new handlers.

Release artifacts

- `lion-plugin-sdk-vX.Y.Z.tar.gz` and PyPI package.

Auto-update strategy

- Plugin authors publish to PyPI/npm; LION-Cloud/LION-OS can fetch and validate plugin signatures.

Monetization

- Marketplace for paid plugins, revenue share with plugin authors.

Integration with QMOI

- Plugins gain access to QVS read-only APIs and core orchestrator hooks through an explicit capability grant.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
