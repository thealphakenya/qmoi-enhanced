# QMOI AI UI Documentation

## Route
- `app/qmoi-ai/page.tsx`
- Live UI route: `/qmoi-ai`

## UI Overview
QMOI AI exposes a production-ready dashboard shell with a focus on intelligent chat, model telemetry, and workspace controls. The UI is organized into:
- header action area
- user profile and role summary
- system status cards
- chat and messaging panels
- deployment and production controls
- security and performance panels
- workspace preview and theme customization

## UI Components in Use
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

## Implementation Notes
- The page is client-side rendered with `use client`.
- It uses the shared `useAuth` hook to control access and display user information.
- The UI is built with real components imported from `app/components/*`.
- The page currently uses real API endpoints like `/api/production-api`, `/api/auth/memory`, and `/api/qmoi/chat` for live telemetry and chat.
