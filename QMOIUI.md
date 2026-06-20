---
quantum-enabled: false
---

# QMOIUI.md - QMOI User Interface Documentation Alias

This file is an alias for `QMOIAIUI.md`, the main QMOI AI UI documentation file.

For the full user interface documentation, component inventory, screen analysis, and cross-route UI mappings, see:

- [QMOIAIUI.md](QMOIAIUI.md)

This alias ensures the expected file path exists and keeps UI documentation references consistent across the repository.

Note (2026-06-03): `UniversalWindowManager` now uses a server-first strategy to load window state from `/api/windows` with a `localStorage` fallback. `/api/windows` now prefers Redis for persistence with a safe file-based fallback when Redis is unavailable.