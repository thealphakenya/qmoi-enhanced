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