---
quantum-enabled: false
---

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

## Theme Selection
- QAlpha must expose the shared `ThemeSelector` component in the shell so users can select `dark`, `light`, or `high-contrast` themes.
- Theme preference should persist across sessions, browser reloads, and app boundary navigation.
- Theme changes should be preserved by the universal auth portal when redirecting back to `/qalpha`.
- The theme selector should apply to all research visuals, progress panels, and model metric cards.

## Authentication & Route Protection ✅

**Protection Method:** `UniversalRouteGuard` component in `app/qalpha/page.tsx`

**Authentication Flow:**
1. Unauthenticated user visits `/qalpha`
2. `UniversalRouteGuard` checks `useAuth()` hook status
3. If not authenticated → redirect to `/universal?redirect=/qalpha`
4. User logs in at universal portal
5. System auto-redirects to `/qalpha` with active session
6. QAlpha shell renders with user role and permissions

**User Session Management:**
- Current user info accessed via `useAuth()` hook
- User role determines research path access and feature availability
- Master has full research controls and data export
- Sister/user have exploration and learning access
- Guest has read-only access to public paths
- Session tokens stored in HTTP-only cookies
- Cross-tab session sync via storage events

**Required Auth Endpoints:**
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh` - Refresh tokens

**Role-Based Features:**
- Master: All research paths, data export, advanced analytics
- Sister: Research exploration, data collaboration
- User: Learning paths, public research access
- Guest: Public research only

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

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:27.976653Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 116
- words: 599
- characters: 4296
- headings: 10
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
