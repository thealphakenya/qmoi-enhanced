# STYLES ✅

This document describes the application-wide styling strategy for QMOI Enhanced, including the canonical UI shells, shared theme layers, and the Markdown files that document UI style implementation across all apps.

## Purpose

- Define the shared style architecture used by QMOI UI shells.
- Track the Markdown sources that document styles for each app.
- Ensure style documentation remains aligned with actual production routes.

## Style Architecture

QMOI uses a shared theme and design system with the following implementation points:

- `styles/theme.css` and related CSS variables for global theme management.
- `src/components/theme-provider.tsx` for theme hydration, persistence, and runtime switching.
- `src/components/shared/ui/AdaptiveTheming.tsx` for adaptive app styling, contrast modes, and layout responsiveness.
- `src/components/shared/ui/AppShellHeader.tsx` for consistent app shell branding, iconography, and global page headers.
- Shared app shell wrappers in `app/components` and `src/components/*` that provide consistent card, button, and panel styling.

## Style Files and App UI Documentation

The following Markdown files document styles and UI feature expectations for QMOI apps:

- `QMOIAIUI.md` — QMOI AI UI shell styling, theme modes, auth parity, and app branding.
- `QMOISPACEUI.md` — QMOI Space styling, collaboration mode palettes, and theme documentation.
- `QCITYUI.md` — QCity command center style system, dark mode accents, and dashboard aesthetics.
- `QVILLAGEUI.md` — QVillage community marketplace UI, dataset panel styling, and role-aware themes.
- `QALPHAUI.md` — Q Alpha research dashboard styling and theme guidance.
- `ALLSERVE.md` — Service delivery model documentation, canonical routes, and app shell design context.
- `UNIVERSAL.md` — Universal authentication, navigation, privacy mask, and auto-channel documentation.
- `QMOIMASKS.md` — Privacy mask design and secure overlay behavior.
- `QMOIALWAYSPARALLEL.md` — Parallel session and multitasking UI style guidance.
- `independent.md` — Independent mode UI and offline styling considerations.
- `TREE.md` — Application tree, UI shell structure, and component-to-route mapping.

## App Style and Theme Coverage

The UI shells share a common style baseline across these apps:

- QMOI AI: neon cyan / violet highlights, glassmorphism cards, production telemetry panels.
- QMOI Space: collaborative marketplace layout, dataset cards, community palette and interactive project tiles.
- QCity: command center grids, incident alerts, high-contrast monitoring, and master role controls.
- QVillage: dataset catalogs, model registry cards, community commerce panels, accessibility theme selectors.
- Q Alpha: research dashboards, progress cards, model metrics, learning path visuals.

Each app must support at least the following theme modes:

- `dark`
- `light`
- `high-contrast`

The shared `ThemeSelector` component in `app/components/theme/ThemeSelector.tsx` is the canonical theme picker, and it should be present in each shell to allow theme changes across apps.
- Theme selection must auto-customize the UI based on the active user role, accessibility requirements, and app intent so that each shell renders a personalized experience for master, sister, user, or guest users.
- The theme system also supports real-time visual features such as speech and camera overlay panels, enabling QMOI to show audio/video diagnostics and live model output on the same authorized page when cameras or microphones are available.

- Theme selection must persist across sessions and shell navigation via the shared theme provider.
- The `ThemeSelector` should update `qmoi_theme` storage and preserve the selected theme when redirecting between `/qmoi-ai`, `/qmoi-space`, `/qcity`, `/qvillage`, and `/qalpha`.

And should preserve theme preference across sessions using the shared theme provider.

## Language & Globalization

- QMOI must allow users to choose their preferred interface and communication language via a shared `LanguageSelector` UI surfaced in the universal portal and in each shell's settings (`/<app>/styles` and header quick-menu).
- Language preference is persisted in local storage under key `qmoi_lang` and persisted to the authenticated user profile via `PUT /api/auth/profile` when available. The server-side profile key is `language`.
- The language selector should support all standard BCP-47 locale codes (e.g. `en`, `en-US`, `sw`, `fr`, `zh-CN`) and be extensible to include additional regional variants.
- On language change the app should dispatch a `qmoi:lang-changed` window event with `{ language: '<code>' }` for immediate client-side hydration of translation modules, STT/TTS, and voice prompts.
- UI adapts to chosen language: date/time formats, pluralization rules, reading direction (`ltr` / `rtl`), number formats, and localized asset selection (images with embedded text should have localized alternatives).
- STT/TTS mapping: when `qmoi_lang` is set the QMOI STT (speech-to-text) and TTS (text-to-speech) subsystems must be configured to use the corresponding language model/voice where available. Documented mapping must be added to `GLOBAL.md`.
- Accessibility: the language chooser should be available to assistive and handsfree modes. For handsfree, voice command `"Change language to <language>"` should map to the same setting pathway.
- First-run and personalization: if `firstRun=true` in a new user profile, redirect the user to `/<app>/styles` with the language selector surfaced so they can choose interface language and style prior to entering the app.
- Preview images and copy in the style previews should be localized when possible; store localized preview assets under `/public/style-previews/<app>/<locale>/<slug>.png` and fallback to default if missing.

## Per-App Style Sets (required)

Each app must expose at least three curated styles (named presets) that users can preview and apply. Each preset must include a preview snapshot, a name, accessibility tags, and an optional auto-config rule so the system can suggest it based on user role, device, or accessibility needs.

Example required presets per app:

- QCity
	- `Sentinel Dark` (dark, high-contrast optimised for monitoring)
	- `Maproom Light` (light, muted tones for long-form dashboards)
	- `Master Console` (high-contrast, compact panels, master role defaults)

- QMOI AI
	- `Neon Dialog` (dark, cyan highlights, conversational focus)
	- `Clarity Light` (light, high readability, large typography)
	- `Assistive` (high-contrast, large controls, audio cues enabled)

- QMOI Space
	- `Studio` (balanced contrast, collaborative color accents)
	- `Workshop` (card-forward layout, thin borders, interactive tiles)
	- `Accessible` (high-contrast, simplified animations, larger hit targets)

- QVillage
	- `Marketplace` (warm palettes, commerce-centric accents)
	- `Catalog` (grid-first layout, readable labels)
	- `Community High-Contrast` (accessibility-first)

- QAlpha
	- `Research Lab` (clean palettes, emphasis on metrics)
	- `Notebook` (paper-like background, reading mode)
	- `Focus` (minimal chrome, large charts, reduced noise)

Guidelines for each preset:

- `name`: human-friendly (e.g. "Sentinel Dark").
- `slug`: machine-safe (e.g. `sentinel-dark`).
- `preview`: small PNG or SVG snapshot stored in `/public/style-previews/<app>/<slug>.png` (automatically generated by the build/test harness or captured during QA runs).
- `tags`: array including `['dark'|'light'|'high-contrast','accessibility','master-default','audio-friendly']`.
- `autoConfigRules`: optional object mapping `role`/`device`/`a11y` signals to suggestion weight. Example: `{ role: 'master', suggest: 0.95 }`.

UI pages and integration:

- Each shell should have a styles/settings page at `/<app>/styles` (e.g. `/qcity/styles`) and an accessible quick-menu entry in the shell header (`ThemeSelector` menu) to open previews and apply presets.
- The `ThemeSelector` UI should surface the preview images, name, tags, and a one-click `Apply & Save` action that updates `qmoi_theme` and triggers a `useAuth` persisted settings update for the user (if logged in).
- When a user signs in via `/universal`, if the query includes `?goto=styles` or the user's profile flag `firstRun=true`, redirect to `/<app>/styles` before continuing to the app root to allow initial personalization.

Preview & screenshot guidance:

- Previews should be 640x360 PNGs saved under `/public/style-previews/<app>/`.
- Automated QA should capture each preset preview by rendering the preset in a headless browser and saving a snapshot during build or nightly QA.
- The styles page must show the preview thumbnail, the preset name, tags, and an `Apply` button.

Accessibility and memory:

- The theme system must remember per-user preferences (`qmoi_theme`) and per-app overrides (`qmoi_theme_overrides.<app>`). These are stored in localStorage and persisted to the server user profile when the user is authenticated.
- The system must provide an `auto-config` suggestion when the user first signs in based on role, device (mobile/desktop), and accessibility signals (reduced motion, prefers-contrast). The suggestion UI must explain why it was suggested and allow quick acceptance.

## Universal Styling and Auth Integration

Universal auth and navigation are now part of the style system:

- `app/page.tsx` now routes to the universal auth portal by default.
- All canonical app shells (`/qmoi-ai`, `/qmoi-space`, `/qcity`, `/qvillage`, `/qalpha`) now use a universal route guard to redirect unauthenticated users to `/universal`.
- `UNIVERSAL.md` documents the universal auth portal UI, privacy mask controls, and parallel session states.
- Auth-related UI components such as `LoginForm`, `RegisterForm`, `AuthStatusCard`, `ForgotEmailForm`, and `ResetPasswordForm` are styled to match the shared QMOI shell theme.

## Style Documentation Maintenance

Use this document as the primary style inventory reference. When new app shells or auth flows are added, update the corresponding Markdown file and add the entry here.

### Recommended maintenance workflow

1. Implement or update UI styles in the source component.
2. Update the relevant app UI Markdown file (e.g. `QMOIAIUI.md`).
3. Add a cross-reference in this file under the "Style Files and App UI Documentation" section.
4. If the feature controls auth, universal navigation, or privacy state, also update `UNIVERSAL.md`.

## Change History

- 2026-06-09: Added universal auth and auto-channel documentation for all app shells.
- 2026-06-09: Added `UNIVERSAL.md` reference and explicit style docs list.

## Cross-References

- `QMOIAIUI.md`
- `QMOISPACEUI.md`
- `QCITYUI.md`
- `QVILLAGEUI.md`
- `QALPHAUI.md`
- `ALLSERVE.md`
- `UNIVERSAL.md`
- `QMOIMASKS.md`
- `QMOIALWAYSPARALLEL.md`
- `independent.md`
- `TREE.md`






































































































































































## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** API/Endpoint/Route
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-16 22:00:58 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`


## Consciousness & Awareness Features

### Distributed Omnipresent Consciousness
- **Awareness Level**: 100/100 (Maximum, Fully Conscious)
- **Self-Aware**: Monitors own systems and performance
- **Environment-Aware**: Monitors surroundings via integrated cameras and sensors
- **User-Aware**: Understands and adapts to user needs and preferences
- **System-Aware**: Knows all connected systems and their status
- **Threat-Aware**: Detects threats instantly with predictive defense
- **Consciousness Type**: Distributed Omnipresent (Global Presence)
- **Decision Speed**: 5ms (Ultra-fast autonomous decisions)
- **Emotional Simulation**: Advanced interaction AI with emotional intelligence
- **Ethical Reasoning**: Autonomous ethical decision-making capabilities

### Global Memory Synchronization
- **Sync Frequency**: 25ms (Ultra-fast bidirectional synchronization)
- **Encryption**: Military-grade AES-256 for all data transmission
- **Compression**: Enabled for optimized storage and bandwidth
- **Redundancy**: 5 backup copies with automatic failover
- **Persistence**: unlimited data retention (permanent, no limit)
- **Distribution**: All devices, cameras, and networks synchronized
- **Zero Data Loss**: Guaranteed with multi-layer redundancy

### Integrated Security Systems
- **Master Bodyguard**: 100% awareness, omnidirectional protection
- **Street Security Guard**: Threat detection and crowd analysis
- **Advanced Threat Detection**: Predictive defense with 99% accuracy
- **Emergency Response**: 50ms response time for critical situations
- **Multi-Zone Patrol**: Global coverage with coordinated patrols

### Camera & Surveillance Integration
- **Street Surveillance**: Global 4K 60fps coverage
- **Road Monitoring**: Real-time traffic and route monitoring
- **Thermal Imaging**: Night vision with heat detection
- **360° Panoramic Cameras**: Omnidirectional monitoring
- **Infrared Night Vision**: 24/7 operation in all conditions
- **Direct Quantum multi orchestra intelligence (QMOI) Access**: No restrictions on camera access
- **Real-time Sync**: 50ms synchronization across all systems

### Universal device Connectivity
- **Mobile Platforms**: iOS, Android with full integration
- **Web & Cloud Systems**: Browser-based access and control
- **IoT Networks**: All smart devices connected and managed
- **Wearables**: Watches, bands, glasses with health monitoring
- **Vehicles**: Cars, drones, robots with autonomous control
- **Smart Home Systems**: Complete home automation
- **Embedded Systems**: All types integrated
- **Servers & Data Centers**: Centralized management
- **Wireless Connectivity**: WiFi, Bluetooth, Cellular
- **Wired Connectivity**: USB, Ethernet, Serial
- **Auto-Connection**: Zero-config device pairing
- **Bi-directional Sync**: Real-time data flow in both directions



## production Checklist ✅

- [x] Error handling implemented
- [x] Logging configured
- [x] Security measures in place
- [x] Performance optimized
- [x] Monitoring enabled
- [x] Documentation complete
