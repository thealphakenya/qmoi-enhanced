---
title: "QMOI Memory Manager"
qmoi_validation_frontmatter: true
---

# QMOI Memory Manager

This document describes `scripts/qmoi_memory.py`, a lightweight layered cache used by validators and the LION orchestrator to improve performance and reduce repeated I/O.

Design

- In-memory LRU cache for hot items.
- SQLite-backed persistent store for durability between runs.
- Optional Redis adapter may be added later (not included to keep dependencies minimal).

API

- `get(key)` -> returns stored value or None.
- `set(key, value, ttl=None)` -> stores JSON-serializable value. ttl in seconds.
- `delete(key)` -> removes an entry from both layers.
- `pin(key)` -> mark a key as pinned to avoid eviction (informational).
- `snapshot(path)` -> write a snapshot of in-memory cache to a file for debugging.

Usage

- The validator (`scripts/validate_md.py`) caches file texts under keys like `file_text:docs/FILE.md` for 5 minutes.
- The orchestrator (`scripts/lion_orchestrator.py`) caches `qvs_context` to avoid repeated disk reads.

Notes for production

- The sqlite store file lives under `.qmoi_validation/qmoi_memory.db` and survives restarts.
- For high-throughput production deployments consider adding a Redis adapter and configuring Redis via environment variables. Be cautious with secrets and network security.
