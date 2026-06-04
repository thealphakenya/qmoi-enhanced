# QMOIAI.md - QMOI AI Documentation Alias

This file is an alias for `QMOIAIUI.md`, the main QMOI AI UI and integration documentation file.

For complete QMOI AI UI documentation, system behavior, and cross-route mappings, see:

- [QMOIAIUI.md](QMOIAIUI.md)

This alias ensures the expected documentation reference exists for tools and documentation generators.

## Notes
- `UniversalWindowManager` now uses a server-first strategy to load window state from `/api/windows` with a `localStorage` fallback.
- `app/api/windows/route.ts` is implemented to use Redis when available, with a safe file-based fallback for environments without Redis.
