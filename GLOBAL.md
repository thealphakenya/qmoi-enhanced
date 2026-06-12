# GLOBAL.md — Globalization & i18n Guidelines

This document captures the globalization strategy for QMOI Enhanced: how the system supports multiple languages, localized assets, STT/TTS mapping, and developer guidelines for adding locale support.

## Core principles

- Support BCP-47 locale codes and region variants (e.g., `en`, `en-US`, `en-GB`, `sw`, `sw-KE`).
- UI must be fully localizable: strings, date/time formats, pluralization rules, number formatting, and imagery containing text.
- Right-to-left (RTL) support required for languages such as Arabic and Hebrew; ensure CSS and layout adapt accordingly.

## Storage & Preference

- Client preference key: `qmoi_lang` (localStorage).
- Authenticated profile field: `language` under user profile returned by `/api/auth/me` and set via `PUT /api/auth/profile`.
- Per-app overrides: `qmoi_lang_overrides.<app>` (localStorage) for app-specific preferences.

## STT / ASR and TTS mapping

- When `qmoi_lang` is set, configure the STT (speech-to-text) model and TTS voice to match the language and regional variant where available.
- Use high-quality TTS voices where supported; fall back to closely related variants (e.g., `en-GB` -> `en`) if exact match is unavailable.
- For ASR, set language hint/locale on the recognition engine to improve accuracy.

## Assets & previews

- Localized style preview assets path: `/public/style-previews/<app>/<locale>/<slug>.png`.
- Fallback to `/public/style-previews/<app>/<slug>.png` if localized image missing.

## Translation process

- Keep translations in JSON files under `i18n/<locale>.json` or use a runtime translation service.
- Provide developers with a `t()` translation helper that reads loaded locale dictionaries.

## Handsfree & Accessibility

- Voice commands must be routed to language-aware parsers. If the spoken language differs from `qmoi_lang`, the system should suggest language switching.
- Provide audio feedback in the selected language by default.

## Developer notes

- Always use translation keys rather than inline strings in components.
- Add `dir="rtl"` attribute at the top-level document when using RTL languages.
- Expose a `qmoi:lang-changed` window event for runtime updates.

## QA

- Add a CI job that runs headless snapshots for UI in top N user locales to verify layout and text clipping.

