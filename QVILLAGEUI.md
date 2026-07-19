---
quantum-enabled: false
---

# QVILLAGEUI.md — QVillage User Interface Reference

## Route
- `app/qvillage/page.tsx` → `src/components/qvillage/QVillageShell.tsx`

## Purpose
- Canonical UI shell for the QVillage community dataset marketplace and model registry.

## Key UI Sections
- Shell header: `AppShellHeader` (title, role, icon)
- Role summary and access indicators (master/sister/user/guest)
- Datasets panel: catalog, upload, publish, and marketplace actions
- Model Registry: list deployed community models, status, pricing, and View actions
- Dataset Catalog cards with download/purchase flows
- Action buttons: Browse All Datasets, Upload Dataset, Explore Models (role gated)

## Files
- Source: `src/components/qvillage/QVillageShell.tsx` ([src/components/qvillage/QVillageShell.tsx](src/components/qvillage/QVillageShell.tsx#L1))
- Exports: `src/components/qvillage/index.ts` ([src/components/qvillage/index.ts](src/components/qvillage/index.ts#L1))

## Integration Notes
- Fetches runtime data from `/api/qvillage/spaces` and expects `datasets`, `models`, and `lastUpdated` fields.
- Uses `app/hooks/useAuth.ts` for role-aware UI and features.
- Icons are sourced from `src/assets/icons/apps/qvillage.svg`.

- Themes & Styles: QVillage supports multiple themes and preserves app conventions. The canonical shell exposes at least three style modes: `dark`, `light`, and `high-contrast` (selectable via the theme control). Themes route through the shared theme provider (`app/components/theme/ThemeProvider.tsx`) and use the shared `AdaptiveTheming` utilities.
- Authentication: QVillage uses the shared auth system (`app/hooks/useAuth.ts`) and provides login/register/logout entry points. For production the UI expects `/api/auth/me`, `/api/auth/logout`, `/api/auth/login`, and `/api/auth/register` endpoints.
- QVillage is now part of the universal auth guard flow. Unauthenticated visitors to `/qvillage` are redirected to `/universal?redirect=/qvillage`, and validated users are auto-channeled back to the community shell.

## Theme Selection
- QVillage must expose the shared `ThemeSelector` so users can choose `dark`, `light`, or `high-contrast` modes.
- Theme selection should persist between sessions and across page transitions.
- The selected theme should be applied to dataset cards, model registry panels, and marketplace controls.
- Theme changes should persist even when the user is redirected through the universal auth portal.

## Authentication & Route Protection ✅

**Protection Method:** `UniversalRouteGuard` component in `app/qvillage/page.tsx`

**Authentication Flow:**
1. Unauthenticated user visits `/qvillage`
2. `UniversalRouteGuard` checks `useAuth()` hook status
3. If not authenticated → redirect to `/universal?redirect=/qvillage`
4. User logs in at universal portal
5. System auto-redirects to `/qvillage` with active session
6. QVillage shell renders with user role and permissions

**User Session Management:**
- Current user info accessed via `useAuth()` hook
- User role determines marketplace features and access level
- Master/sister can publish datasets and models
- User/guest can browse and download
- Session tokens stored in HTTP-only cookies
- Cross-tab session sync via storage events

**Required Auth Endpoints:**
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh` - Refresh tokens

**Role-Based Features:**
- Master: Publish/manage datasets, full pricing control
- Sister: Publish datasets, limited pricing
- User: Browse, download, limited publishing
- Guest: Browse and view only

## Next work
- Ensure legacy `components/QVillage.tsx` and `components/q-city/QVillage.tsx` are either delegated to the canonical shell or their unique logic is migrated into `src/components/qvillage`.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:18.808274Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 91
- words: 544
- characters: 4341
- headings: 10
- links: 2
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
