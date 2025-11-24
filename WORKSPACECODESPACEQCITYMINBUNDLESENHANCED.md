---
title: "Workspace / Codespace / QCity — Minimize Device Data Bundles (Enhanced)"
qmoi_validation_frontmatter: true
---

# Workspace / Codespace / QCity — Minimize Device Data Bundles (Enhanced)

This document describes practical strategies and architecture patterns to make the workspace and its apps use minimal on-device data (mobile/limited-bundle devices) while leveraging cloud/qcity resources for performance and features.

Principles
- Offline-first, delta-synced: keep a small local cache and sync only diffs. Use ETags, range requests, and compressed deltas.
- Compute-offload: prefer remote inference / heavy compute on qcity/cloud nodes and stream results.
- Compact formats: use binary/compact serialization (msgpack, protobuf) for sync payloads, gzip or brotli for transfers.
- Prioritize metadata: synchronize lightweight metadata first (indices, manifest) and lazy-load heavy assets on-demand.
- Throttling & scheduling: allow background sync over Wi‑Fi or when device is idle/plugged in; provide user-configurable low-data mode.

Recommended components
- qcity-edge-proxy: small agent that negotiates bandwidth-efficient sync with central qcity servers.
- delta-storage: store content-addressed deltas and reconstruct locally when needed.
- smart-cache: LRU cache with size/age policies adapting to device/bundle settings.

Usage guidelines
- Default to minimal datasets for on-device operations; larger datasets are fetched on-demand.
- Keep model sizes small for on-device models; prefer offloading to qcity with cached quantized weights.
- Use resumable downloads and prioritized queues to avoid re-transfers.

Implementation notes (next steps)
1. Add an agent that negotiates low-data sync settings and exposes a config file in `qc/` or `config/`.
2. Add server-side support in qcity to return compact deltas and pre-computed artifacts for low-bandwidth clients.
3. Integrate with the existing `QMOI` sync infrastructure and document the policy in `QCITYRESOURCES.md` and `QMOI-CLOUD-ENHANCED.md`.

See also: `docs/OFFLINE_FIRST_ARCHITECTURE.md`, `QCITYRESOURCES.md`, `QMOI-CLOUD-ENHANCED.md`.

Generated: tools/find_placeholders.py scan run
