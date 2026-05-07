<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-28T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# UI_COMPONENTS.md - `components/ui/` Inventory & Production Summary ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total Files:** 54
**Status:** ✅ production_IMPLEMENTED

## Purpose

This document captures the current `components/ui/` directory inventory, usage roles, and production readiness for the shared UI primitives and interface building blocks.

## Directory Summary

- `components/ui/` contains reusable UI primitives, dialog systems, navigation controls, data visualization helpers, and accessibility utilities.
- The inventory is grouped by functional role and reflects the current source tree.
- This document is maintained for architecture review, onboarding, and dependency tracing.

## Key Metrics

| Metric | Value |
| --- | --- |
| Files indexed | 54 |
| Component categories | 8 |
| Production status | ✅ production_IMPLEMENTED |
| Last refresh | 2026-04-28 |

## Component Categories

### Layout & Structure
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

### Navigation & Menus
- `navigation-menu.tsx`
- `menubar.tsx`
- `context-menu.tsx`
- `dropdown-menu.tsx`
- `command.tsx`
- `tabs.tsx`
- `pagination.tsx`

### Form Controls & Inputs
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

### Feedback & Notification
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

### Dialogs & Overlays
- `dialog.tsx`
- `drawer.tsx`
- `popover.tsx`
- `collapsible.tsx`
- `accordion.tsx`
- `sheet.tsx`
- `alert-dialog.tsx`
- `PluginHelpModal.tsx`
- `PluginNotifications.tsx`

### Visualization & Data Display
- `table.tsx`
- `chart.tsx`
- `carousel.tsx`
- `calendar.tsx`
- `recharts-shim.tsx`
- `progress.tsx`

### Accessibility & Device Helpers
- `AccessibilitySettingsPanel.tsx`
- `use-mobile.tsx`
- `skeleton.tsx`
- `aspect-ratio.tsx`
- `resizable.tsx`

### Plugin & System Enhancements
- `PluginHelpModal.tsx`
- `PluginNotifications.tsx`
- `recharts-shim.tsx`
- `AccessibilitySettingsPanel.tsx`

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

- `components/ui/` is expected to deliver reusable, themable primitives shared across dashboards and pages.
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