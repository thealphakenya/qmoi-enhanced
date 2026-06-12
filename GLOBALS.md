# GLOBALS.md — Global Settings & Internationalization Registry

This file lists canonical global settings and how they are represented in the system.

- `qmoi_theme` : string — current theme/preset slug persisted via `next-themes` storageKey.
- `qmoi_lang` : string — current language / locale BCP-47 code (e.g., `en`, `sw-KE`).
- `qmoi_user` : object — persisted minimal user context in localStorage/sessionStorage.
- `qmoi_theme_overrides.<app>` : object — optional per-app theme override persisted locally and optionally on profile.
- `qmoi_lang_overrides.<app>` : string — optional per-app language override.
- `qmoi_privacy_mask` : boolean — privacy mask toggle persisted per session and optionally to profile.
- `qmoi_parallel_mode` : boolean — parallel session mode flag.

Persistence order for preference lookups:
1. Per-app override in localStorage (e.g., `qmoi_lang_overrides.qcity`).
2. Authenticated user profile value (server-side) — `user.profile.language`.
3. Global localStorage value (e.g., `qmoi_lang`).
4. System default (browser `navigator.language` or `en`).

Event hooks:
- `window` event `qmoi:lang-changed` — dispatched with `{ language: '<code>' }`.
- `window` event `qmoi:theme-changed` — dispatched with `{ theme: '<slug>' }`.

