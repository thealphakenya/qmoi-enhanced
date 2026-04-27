<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-27T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# UI_COMPONENTS.md - `components/ui/` Inventory & Production Summary ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-27T12:00:00.000000
**Total Files:** 55
**Status:** ✅ production_IMPLEMENTED

## Purpose

This document captures the current `components/ui/` directory inventory, usage roles, and production readiness for the UI primitives and interface building blocks used throughout QMOI-enhanced.

## Directory Summary

- `components/ui/` contains the primary UI primitives, navigation controls, dialog systems, data visualization widgets, and accessibility helpers used by the frontend.
- Inventory reflects the current source tree and is grouped by functional role.
- This document is maintained for architecture review, onboarding, and dependency tracing.

## Key Metrics

| Metric | Value |
| --- | --- |
| Files indexed | 55 |
| Component categories | 8 |
| Production status | ✅ production_IMPLEMENTED |
| Last refresh | 2026-04-27 |

## Component Categories

### 1. Layout & Structure
- `card.tsx`
- `sidebar.tsx`
- `sheet.tsx`
- `scroll-area.tsx`
- `separator.tsx`
- `button.tsx`
- `badge.tsx`
- `breadcrumb.tsx`
- `avatar.tsx`
- `label.tsx`
- `layout` primitives support consistent page structure and spacing.

### 2. Navigation & Menu Systems
- `navigation-menu.tsx`
- `menubar.tsx`
- `context-menu.tsx`
- `dropdown-menu.tsx`
- `command.tsx`
- `tabs.tsx`
- `pagination.tsx`
- `sidebar.tsx`
- These components manage navigation, command palettes, and user workflow entry points.

### 3. Form Controls & Inputs
- `input.tsx`
- `input-otp.tsx`
- `textarea.tsx`
- `checkbox.tsx`
- `radio-group.tsx`
- `select.tsx`
- `slider.tsx`
- `toggle.tsx`
- `toggle-group.tsx`
- `form.tsx`
- `label.tsx`
- `field` components provide data entry, validation, and interaction patterns.

### 4. Feedback & Notifications
- `alert.tsx`
- `alert-dialog.tsx`
- `toast.tsx`
- `toaster.tsx`
- `tooltip.tsx`
- `progress.tsx`
- `hover-card.tsx`
- `sonner.tsx`
- `use-toast.tsx`
- `use-toast.ts`
- These elements handle user feedback, status messages, countdowns, and transient alerts.

### 5. Dialogs, Panels & Overlays
- `dialog.tsx`
- `drawer.tsx`
- `popover.tsx`
- `collapsible.tsx`
- `accordion.tsx`
- `sheet.tsx`
- `drawer.tsx`
- `alert-dialog.tsx`
- `PluginHelpModal.tsx`
- `PluginNotifications.tsx`
- Modal and overlay components enforce consistent dialog flows and plugin interaction semantics.

### 6. Data Display & Visualization
- `table.tsx`
- `chart.tsx`
- `carousel.tsx`
- `calendar.tsx`
- `recharts-shim.tsx`
- `progress.tsx`
- UI visualization components used for dashboards, reports, and data summaries.

### 7. Accessibility & Device Helpers
- `AccessibilitySettingsPanel.tsx`
- `use-mobile.tsx`
- `skeleton.tsx`
- `aspect-ratio.tsx`
- `resizable.tsx`
- These utilities support accessibility settings, mobile layout, skeleton states, and responsive behavior.

### 8. Plugin & System Enhancement Components
- `PluginHelpModal.tsx`
- `PluginNotifications.tsx`
- `recharts-shim.tsx`
- `AccessibilitySettingsPanel.tsx`
- These files support the plugin ecosystem, extension points, and compatibility shims.

## Full `components/ui/` Inventory

- `AccessibilitySettingsPanel.tsx`
- `PluginHelpModal.tsx`
- `PluginNotifications.tsx`
- `accordion.tsx`
- `alert-dialog.tsx`
- `alert.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `badge.tsx`
- `breadcrumb.tsx`
- `button.tsx`
- `calendar.tsx`
- `card.tsx`
- `carousel.tsx`
- `chart.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input-otp.tsx`
- `input.tsx`
- `label.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `progress.tsx`
- `radio-group.tsx`
- `recharts-shim.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `toast.tsx`
- `toaster.tsx`
- `toggle-group.tsx`
- `toggle.tsx`
- `tooltip.tsx`
- `use-mobile.tsx`
- `use-toast.tsx`
- `use-toast.ts`

## Production Readiness Notes

- `components/ui/` is expected to deliver reusable, themable primitives that can be shared across dashboards and pages.
- All listed files are present in the repository and should be reviewed before production deployment.
- Prefer consistent theming, accessibility labels, and keyboard navigation in future UI updates.
- Maintain the directory inventory whenever new UI primitives are added or deprecated.

## Validation & Ownership

- Validation: QMOI Lion metadata is inserted automatically during documentation refresh.
- Ownership: Frontend architecture team / UI component owners.
- Recommended refresh cadence: each sprint or after major UI refactor.

## Related Documentation

- `UI.md` — UI design and interface inventory
- `ALLUI.md` — comprehensive UI feature inventory and usage guide
- `DASHBOARD.md` — dashboard directory documentation
- `COMPONENTS.md` — overall React component inventory
