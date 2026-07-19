---
quantum-enabled: false
---

# LANGUAGE IMPLEMENTATION PLAN

Goal: Ensure QMOI supports UI/communication in all languages, provide universal language settings in the Universal portal and per-app styles pages, and wire STT/TTS to use the selected language.

Summary of immediate changes applied:
- `app/components/language/LanguageSelector.tsx` — new LanguageSelector component, persists `qmoi_lang` and emits `qmoi:lang-changed`.
- Universal portal (`app/universal/page.tsx`) updated to surface `LanguageSelector` and to redirect apps to their `/styles` pages by default (`?goto=styles`).
- `STYLES.md`, `UNIVERSAL.md`, `GLOBAL.md`, and `GLOBALS.md` added/updated with globalization guidelines and persistence keys.
- Per-app styles pages scaffolded under `app/<app>/styles` with `StylePreviewCard` component.

Inventory — language-related components to adapt to `qmoi_lang`:
- `components/QConverse.tsx` — already contains language state; should read `qmoi_lang` and subscribe to `qmoi:lang-changed`.
- `components/QmoiKeyboard.tsx` — sets recognition language; update to read `qmoi_lang`.
- `components/QmoiBrowser.tsx` — localizes labels; should read `qmoi_lang`.
- `components/VoiceLibraryPanel.tsx` — voice selection should filter by profile language.
- `components/SettingsPanel.tsx` — already includes language controls; unify with `LanguageSelector`.
- `app/components/auth/UniversalAuthHub.tsx` — after signin, ensure it applies `qmoi_lang` and redirects to `/[app]/styles` when `goto=styles`.

Plan of work (phased):

Phase A — Integration (this sprint)
1. Replace local language state usage with `qmoi_lang` lookup and subscribe to `qmoi:lang-changed` event for the components listed above.
2. Ensure `document.documentElement.lang` is set on language change and `dir="rtl"` is applied for RTL locales.
3. Ensure STT/TTS modules read `qmoi_lang` and configure engines/voices accordingly (add mapping table in `GLOBAL.md`).
4. Add `LanguageSelector` quick access to shell headers (e.g., in `AppShellHeader.tsx` or `ThemeSelector` dropdown).

Phase B — Content & Assets
1. Add localized preview assets under `/public/style-previews/<app>/<locale>/<slug>.png` (automated snapshot job).
2. Provide translation JSON files under `i18n/<locale>.json` and a runtime loader for selected locale.
3. Instrument CI to run snapshot checks for top locales.

Phase C — E2E QA & Accessibility
1. Add E2E tests for signin->styles personalization in at least 5 locales.
2. Voice command tests for `Change language to <X>` flows.
3. Accessibility audit for RTL languages and high-contrast presets.

Phase D — Full Coverage
1. Expand locale list to cover all world languages (practical approach: tiered rollout by region).
2. Contract with TTS/STT providers for additional high-quality voices as needed.

Developer notes & small code patterns
- To read preference: `const lang = localStorage.getItem('qmoi_lang') || userProfile.language || navigator.language || 'en';`
- Dispatch on change: `window.dispatchEvent(new CustomEvent('qmoi:lang-changed', { detail: { language: code } }));`
- On component mount, subscribe:
```js
useEffect(() => {
  const handler = (e) => setLang(e.detail.language);
  window.addEventListener('qmoi:lang-changed', handler);
  return () => window.removeEventListener('qmoi:lang-changed', handler);
}, []);
```

Next steps I can take now (pick one):
- A: Implement Phase A changes for `QConverse.tsx`, `QmoiKeyboard.tsx`, and `QmoiBrowser.tsx` to read `qmoi_lang` and subscribe to events.
- B: Add `LanguageSelector` to shell headers and integrate with `ThemeSelector` quick-menu.
- C: Implement server-side profile persistence endpoint checks and ensure `PUT /api/auth/profile` accepts `language` (it already appears to in signup route).

Estimated effort per option: A: 40–90 minutes; B: 20–40 minutes; C: 20–60 minutes (depending on server API verification).

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:41.352334Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 80
- words: 558
- characters: 4346
- headings: 2
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
