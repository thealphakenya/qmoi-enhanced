# QMOI AI UI Documentation

## Route
- `app/qmoi-ai/page.tsx`
- `src/components/qmoi/QMOIAIShell.tsx`
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

## Theme & Style System
QMOI AI supports theme-based styling and should be driven by the shared `styles/theme.css` variables, `app/components/theme/ThemeProvider.tsx`, and `src/components/shared/ui/AdaptiveTheming.tsx`.
- App themes should include at least three variations: `dark`, `light`, and `high-contrast`.
- Theme settings should be accessible through a theme customizer and preserved across sessions.
- Theme settings are implemented via the shared theme provider (`app/components/theme/ThemeProvider.tsx`) and are available to all canonical shells including QVillage; QVillage now exposes a theme selector with `dark`, `light`, and `high-contrast` modes.
- Authentication parity: All app shells (QMOI AI, QMOI Space, QCity, QVillage, QAlpha) must implement the same login/register/logout flows and use `app/hooks/useAuth.ts` for role-aware rendering. Ensure endpoints `/api/auth/me`, `/api/auth/login`, `/api/auth/register`, and `/api/auth/logout` are available and documented in `API.md`.
- QMOI AI now participates in the universal auth flow: unauthenticated visitors are redirected to `/universal`, and successful validation auto-channels them back to the QMOI AI app.
- The interface should use consistent accent colors for AI status, chat messages, and model metrics.
- App-specific branded visuals for QMOI AI should emphasize neon cyan, violet highlights, and glassmorphism-style cards.

## Theme Selection
- The QMOI AI shell must expose the shared `ThemeSelector` component so users can choose `dark`, `light`, or `high-contrast` modes.
- The theme choice should persist across page reloads and app boundary transitions.
- The theme selector must live in an accessible location near the app header or settings controls.
- When the user changes themes, the updated state should be available to the entire universal auth and app flow.
- Custom icons should be centrally referenced from `src/assets/icons/apps/` and should include `qmoi-ai.svg` plus app-specific icons for AI chat, avatar, model, and workspace states.
- The live page now uses the shared `AppShellHeader` wrapper for consistent app-brand presentation and centralized shell metadata.

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
