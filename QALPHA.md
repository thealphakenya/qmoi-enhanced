---
quantum-enabled: false
---

# Q Alpha - Live Aggregator and Learning Shell

## Route
- `app/qalpha/page.tsx`
- `src/components/qalpha/QAlphaShell.tsx`
- Live URL: `/qalpha`

## Purpose
Q Alpha is the actual QMOI aggregator and learning shell route. It provides user onboarding, research progress, model metrics, and app navigation while integrating with shared QMOI components.

## Features
- Learning path dashboard and progress tracking
- Model performance metrics and research projects
- Role-aware user status and access indicators
- Real-time status polling from `/api/qalpha/*`
- Navigation to QMOI AI, QMOI Space, QCity, and QVillage
- Theme and preview controls
- Authentication through `useAuth`

## Actual Components
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
This document is now aligned to the actual Q Alpha page implementation in the repo. Q Alpha is a live, real route, not a static shell stub.
