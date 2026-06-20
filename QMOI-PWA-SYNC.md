---
quantum-enabled: false
---

# QMOI-PWA-SYNC.md - PWA Synchronization and production Restore

## Overview
This document describes the restored QMOI PWA sync behavior for QMOI AI and QMOI Space.
It also explains the role of `public/qmoi-pwa-manager.js` and the updated static app shells.

## Restored PWA Architecture
- `public/qmoi-ai.html` and `public/qmoi-space.html` are production-ready PWA landing shells.
- `public/qmoi-pwa-manager.js` manages install prompts, service worker registration, and update flows.
- `public/manifest-qmoi-ai.json` and `public/manifest-qmoi-space.json` define install metadata and shortcuts.
- `/q-alpha.html` and `/pwa_apps/q-alpha/` provide a static Q Alpha aggregator shell that unifies QMOI AI, QMOI Space, and QCity install flows.
- `/api/pwa/check-update` and `/api/pwa/auto-update` support runtime update checks used by the service worker and install manager.

## Features
- Install prompt with fallback UI
- Service worker registration and update detection
- Auto-update prompt and in-place refresh
- Role-aware navigation between QMOI AI, QMOI Space, QCity, and QVillage
- Offline support and app shell caching for production use

## Implementation Notes
- PWA manager registers `/service-worker.js` and listens for `beforeinstallprompt` and `appinstalled` events.
- `qmoi-ai.html` and `qmoi-space.html` surface install actions and app status.
- The PWA manager exposes `window.qmoiPWAManager` for runtime diagnostics and manual install commands.
- Backend endpoints at `/api/pwa/check-update` and `/api/pwa/auto-update` provide version metadata, release notes, and update orchestration for the PWA runtime.
- `app/qmoi-space/page.tsx` now maintains the route-to-shell redirect for QMOI Space, matching the existing QMOI AI routing pattern.

## production Validation
- Verified QMOI AI PWA shell is active with updated install and status UI.
- Verified QMOI Space shell is restored and integrated with QMOI ecosystem navigation.
- Verified the PWA manifest definitions are production-ready with update URLs and app shortcuts.

---
