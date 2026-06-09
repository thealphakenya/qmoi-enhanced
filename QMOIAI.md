# QMOI AI - Live Application Documentation

## Route
- `app/qmoi-ai/page.tsx`
- `src/components/qmoi/QMOIAIShell.tsx`
- Live URL: `/qmoi-ai`

## Purpose
QMOI AI is the main intelligent assistant dashboard for the QMOI enhanced suite. It is implemented as a real Next.js page route and serves as the primary AI workflow for chat, system monitoring, and production orchestration.

## Key Features
- Interactive AI chat and analysis
- Real-time system and production metrics
- Access control via `app/hooks/useAuth`
- Model status and health panels
- Navigation to QMOI Space, QCity, and QVillage

## Actual UI Components
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
- `QVillage`
- `QVillageDatasetsPanel`
- `PreviewWindow`
- `ThemeCustomizer`
- `DataVisualizationPanel`
- `AnalyticsDashboard`
- `SecurityMonitor`
- `PerformanceMonitor`

## Notes
This page is a real feature entrypoint, and its documentation is aligned with the current implementation in `app/qmoi-ai/page.tsx`. The app is not a placeholder; it loads actual status endpoints, uses shared hooks, and renders live feature panels.
