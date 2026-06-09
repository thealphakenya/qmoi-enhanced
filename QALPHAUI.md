# Q Alpha UI Documentation

## Route
- `app/qalpha/page.tsx`
- `src/components/qalpha/QAlphaShell.tsx`
- Live UI route: `/qalpha`

## UI Overview
Q Alpha UI is a production learning and aggregation dashboard that displays research progress, model metrics, and a role-aware user shell.

### Main UI Sections
- Hero and status summary
- Learning paths and research project progress
- Model performance cards
- User role and access summary
- Navigation shortcuts to QMOI AI and QMOI Space
- Security, performance, and analytics overview

## Theme & Style System
Q Alpha should support three distinct visual themes:
- `dark scholar` for focused research sessions
- `light lab` for collaborative learning and exploration
- `high-contrast` for accessibility and analytics review

Theme states should map to `styles/theme.css` variables and the shared `ThemeProvider`.
- Use consistent card styling, progress bars, and accent gradients for each theme.
- Highlight model metrics and research progress with clear visual hierarchy.
- Centralize app icons under `src/assets/icons/apps/` and use dedicated QAlpha icons for research, learning, and model metrics.
- The live route now uses the shared `AppShellHeader` wrapper to unify shell branding across all app shells.
- Ensure accessible labels, keyboard focus states, and contrast ratios across all theme variations.
- QAlpha participates in the universal auth flow: if a user is not validated, `/qalpha` redirects to `/universal?redirect=/qalpha` and returns them after verification.

## Active UI Components
- `AdminDashboard`
- `ChatMessaging`
- `QMOIAutoFixDashboard`
- `QMOIAutoSetup`
- `FileUploadDownload`
- `VisualEnhancement`
- `AudibleConversation`
- `ClientUISettings`
- `QMOIMasterDashboard`
- `SponsoredUsersManager`
- `UserProfile`
- `WalletList`
- `RegisterForm`
- `PreviewWindow`
- `ThemeCustomizer`
- `DataVisualizationPanel`
- `AnalyticsDashboard`
- `SecurityMonitor`
- `PerformanceMonitor`

## Notes
This UI documentation reflects the actual app implementation and route wiring present in `app/qalpha/page.tsx`.
