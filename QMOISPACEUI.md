---
quantum-enabled: false
---

# QMOI Space UI Documentation

## Route
- `app/qmoi-space/page.tsx`
- `src/components/qmoi/QMOISpaceShell.tsx`
- Live UI route: `/qmoi-space`

## UI Summary
QMOI Space UI is built as a full dashboard for marketplace management, dataset collaboration, deployment monitoring, and revenue operations.

### Main UI Sections
- Hero banner with summary and action buttons
- Platform metrics grid with build and validation status
- Collaboration workspace and marketplace cards
- Dataset catalog and model deployment panels
- User and wallet management controls
- Theme customization and preview overlays

## Theme & Style System
QMOI Space should use shared theme variables and support three distinct themes across the app:
- `dark` collaboration mode for production operations
- `light` productivity mode for dataset browsing and editing
- `high-contrast` accessibility mode for review and validation workflows

Styling should leverage `styles/theme.css` and `app/components/theme/ThemeProvider.tsx`, with adaptive behavior from `src/components/shared/ui/AdaptiveTheming.tsx`.
- Theme variations should change card backgrounds, accent palettes, button styles, and data visualization tones.
- QMOI Space should use custom icons from `src/assets/icons/apps/` and have app-specific icons for projects, datasets, models, and collaboration.
- The active page uses a shared `AppShellHeader` wrapper to centralize shell iconography and app metadata across the QMOI suite.
- Accessible typography and sufficient contrast are required for all theme options.

## Theme Selection
- QMOI Space must surface the shared `ThemeSelector` for all users.
- Theme selection should persist across reloads, login state changes, and redirection through `/universal`.
- Selected themes should apply consistently to dashboards, cards, tables, and data visualizations.
- Theme colors and contrast levels must remain readable in all shell components.

## Authentication & Route Protection ✅

**Protection Method:** `UniversalRouteGuard` component in `app/qmoi-space/page.tsx`

**Authentication Flow:**
1. Unauthenticated user visits `/qmoi-space`
2. `UniversalRouteGuard` checks `useAuth()` hook status
3. If not authenticated → redirect to `/universal?redirect=/qmoi-space`
4. User logs in at universal portal
5. System auto-redirects to `/qmoi-space` with active session
6. QMOI Space shell renders with user role and permissions

**User Session Management:**
- Current user info accessed via `useAuth()` hook
- User role determines feature availability (master/sister/user/guest)
- Session tokens stored in HTTP-only cookies
- Tokens auto-refresh on expiration
- Cross-tab session sync via storage events

**Required Auth Endpoints:**
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh` - Refresh tokens

## Authentication & Parity
QMOI Space shares authentication and session flows with other canonical shells (QMOI AI, QCity, QVillage). Ensure `/api/auth/me`, `/api/auth/login`, `/api/auth/register`, and `/api/auth/logout` are available and that UI shells expose login/register/logout actions consistently. Theme and auth preferences should be persisted via the shared theme provider and auth persistence utilities.

## Universal Auth & Auto-Channel
QMOI Space is part of the universal auth layer. Unauthenticated visitors to `/qmoi-space` are redirected to `/universal?redirect=/qmoi-space`, and when validation succeeds they are immediately auto-channeled back to the QMOI Space experience.

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
- `QiSpaces`
- `LcSpaces`
- `FloatingPreviewWindow`
- `WalletPanel`
- `CollaborationHub`
- `IntegrationManager`
- `WorkflowAutomationEngine`
- `ContentManagementSystem`

## Notes
The QMOI Space route is fully wired to the repo's app architecture and reflects the current actual page implementation.
