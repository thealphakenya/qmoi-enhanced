<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-28T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# UI.md - QMOI Enhanced UI Inventory & Architecture ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total UI Files Detected:** 324
**Status:** ✅ production_IMPLEMENTED

## 📋 Document Overview

This document captures the current UI component landscape across QMOI Enhanced, including core React components, shared UI primitives, source-level component libraries, and the integrated dashboard application.

## 📊 UI Architecture Summary

| Location | Component Count | Description |
|----------|-----------------|-------------|
| `/components/` | 201 | Main React component tree, including domain, automation, and feature components |
| `/src/components/` | 123 | Source-level UI and integration components used by the app shell and shared libraries |
| `/components/ui/` | 54 | Base UI primitives, form controls, overlays, and accessibility components |
| `/dashboard/` | 5 | Dashboard application assets and frontend entry points |
| Total unique UI-related files | 324 | Current inventory of UI artifacts across the codebase |

## 🎨 Core Component Inventory

The UI stack is organized into three main layers:

1. **Core application components** (`/components/`): domain-specific dashboards, automation interfaces, collaboration systems, communication tools, financial and device management panels, and QMOI integration surfaces.
2. **Base UI primitives** (`/components/ui/`): reusable form fields, dialog systems, navigation components, data display widgets, and accessibility helpers.
3. **Source-level UI integration** (`/src/components/`): app shell components, adaptive theming, collaborative services, global UI utilities, and embedding logic.

## 🔧 UI Directory Breakdown

### Core React Components (`/components/`)

The main `components/` directory includes feature-specific UI artifacts such as:

- AI and automation dashboards
- communication and chat interfaces
- wallet and financial management panels
- device integration and connectivity components
- project and business management UIs
- system health, monitoring, and production controls
- QMOI-specific interfaces and intelligence visualizers

### Shared UI Primitives (`/components/ui/`)

The shared UI primitive library provides the building blocks for interactive UX patterns:

- Buttons, inputs, checkboxes, radios, selects, switches, sliders
- Dialogs, drawers, popovers, tooltips, alerts, notifications
- Tables, charts, calendars, progress indicators, badges
- Layout primitives like cards, sheets, sidebars, separators, scroll areas
- Accessibility utilities, mobile helpers, skeleton loaders, and responsive systems

### Source-Level Components (`/src/components/`)

Source-level UI files focus on application integration, utilities, and advanced interface orchestration:

- App shell and entry components
- Adaptive theming and customization
- Global notifications and hotkeys
- Offline cache and telemetry panels
- Collaboration and feedback overlays
### Progressive Web Apps (`/pwa_apps/`)

The repository also includes static Progressive Web App entrypoints for QMOI:
- `/pwa_apps/qmoi-ai/` — QMOI AI PWA shell implemented in static HTML with `manifest.webmanifest`, `sw.js`, install prompt hooks, online/offline status, chat interface, production preview workflow, and runtime share actions.
- `/pwa_apps/qmoi-space/` — QMOI Space PWA with platform statistics, production/gaming/revenue actions, install support, and cloud integration hints.
- `/pwa_apps/q-alpha/` — Alpha Q aggregator shell that unifies QMOI AI, QMOI Space, and QCity into a single installable hub experience.

### Product UI Features

#### QCity UI
QCity is the enterprise management interface for device orchestration, unlimited build/test workflows, networked resource control, and global QMOI integration.
- Enterprise dashboard and device management UI
- QCity service panel with unlimited resources and QCity command launches
- Onboarding flow for QCity device setup and mastery
- QCity theme provider and error management overlays
- Tracks, employment, and zero-rated site controls
- Root entrypoints: `/qcity-dashboard.html`, `/qcity-enterprise.html`, `/qcity-complete.html`, `/public/manifest-qcity.json`

#### QMOI AI UI
QMOI AI is the intelligent assistant layer, including chat, auto-fix workflows, remote AI orchestration, and installable web app behavior. QMOI AI and QMOI Space share the same underlying UI feature set, but each product adapts those features to its own domain and workflows.
- Chatbot interface with multi-model selection and conversation history
- Ask QMOI query flows and AI knowledge navigation
- Auto-fix and production monitoring dashboards
- Avatar-assisted task launcher and system health overlays
- Shared UI primitives for theme control, notifications, dialogs, and offline detection
- Root entrypoints: `/qmoi-ai.html`, `/qmoi-ai-live.html`, `/public/manifest-qmoi-ai.json`

#### Alpha Q AI UI
Alpha Q AI is the aggregator shell that reuses the QMOI AI component stack while exposing multi-app navigation for QCity and QMOI Space.
- Hub navigation between QMOI AI, QMOI Space, and QCity
- Unified install prompt and PWA experience
- Shared UI features identical to QMOI AI
- Shell: `/pwa_apps/q-alpha/index.html`, `/public/manifest-q-alpha.json`

#### QMOI Space UI
QMOI Space is the distributed marketplace and production environment with spatial, financial, and cloud-integrated interfaces. QMOI Space shares the same core UI features as QMOI AI, but adapts the experience for marketplace, revenue, and spatial workflows.
- Marketplace browsing, sales, and revenue management UI
- Production/gaming feature cards and revenue generation actions
- Spatial dashboards and distributed memory sync
- Installable PWA shell with web manifest and service worker support
- Entrypoint: `/qmoi-space.html`, `/public/manifest-qmoi-space.json`

The QMOI AI UI is backed by React components in `/components/` such as `Chatbot.tsx`, `AskQMoi.tsx`, `QMOIDashboard.tsx`, and `QMOIAutoFixDashboard.tsx`, while the PWA shell provides the installable web app entrypoint.
## 📁 Dashboard Application (`/dashboard/`) 

The dashboard application is a separate package contained in `/dashboard/` and includes the following structure:

- `package.json` — dashboard app dependencies and scripts
- `vite.config.js` — build configuration
- `server.js` — app server entry point
- `src/App.jsx` — dashboard React root component
- `src/index.js` — dashboard app bootstrap

This app supports a lightweight frontend experience for the QMOI dashboard and can be run independently.

## ✅ Production Readiness

- The UI inventory is synchronized with the current source directories.
- All shared UI primitives and component sets are documented for architecture review.
- Future updates should refresh counts when new UI files are added or legacy components are removed.
- Maintain consistent theming, accessibility support, and keyboard navigation across the UI layer.

## 🔗 Related Documentation

- `UI_COMPONENTS.md` — component-level inventory for `/components/ui/`
- `ALLUI.md` — comprehensive UI features, roles, and validation summary
- `DASHBOARD.md` — dashboard application directory documentation
- `COMPONENTS.md` — overall React components inventory