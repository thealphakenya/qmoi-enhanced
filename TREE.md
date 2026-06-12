# QMOI-ENHANCED Repository App Tree
=================================

Summary
-------
This file documents canonical app entry points, directories each app uses, shared directories and files, and developer instructions for validating universal auth + theme behavior across the suite (QCity, QMOI AI, QVillage, QAlpha, QMOI Space).

Top-level apps (App Router entry pages)
--------------------------------------
- `app/qcity/page.tsx`              → wraps `QCityShell` (UniversalRouteGuard)
- `app/qvillage/page.tsx`           → wraps `QVillageShell` (UniversalRouteGuard)
- `app/qalpha/page.tsx`             → wraps `QAlphaShell` (UniversalRouteGuard)
- `app/qmoi-ai/page.tsx`            → wraps `QMOIAIShell` (UniversalRouteGuard)
- `app/qmoi-space/page.tsx`         → wraps `QMOISpaceShell` (UniversalRouteGuard)
- `app/universal/page.tsx`          → Universal authentication hub and landing
- `app/<app>/styles`               → Per-app styles and theme personalization pages (e.g. `app/qcity/styles/page.tsx`)
- `app/reset-password/page.tsx`     → Reset flow UI
- `app/verify-email/page.tsx`       → Email verification UI

Canonical source shell locations
--------------------------------
- `src/qcity/QCityShell.tsx` or `src/components/...` (QCity canonical shell)
- `src/components/qvillage/QVillageShell.tsx` (QVillage)
- `src/components/qalpha/QAlphaShell.tsx` (QAlpha)
- `src/components/qmoi/QMOIAIShell.tsx` (QMOI AI)
- `src/components/qmoi/QMOISpaceShell.tsx` (QMOI Space)

Key directories and files used by each app
-----------------------------------------
- `app/`
	- `app/layout.tsx`                     → Root layout (wraps `ThemeProvider`)
	- `app/universal/*`                    → Universal auth pages and components
	- `app/components/auth/*`              → Universal auth UI (LoginForm, RegisterForm, AuthStatusCard, UniversalAuthHub, UniversalRouteGuard)
	- `app/hooks/useAuth.ts`               → Universal auth hook (session, login/logout, refresh)
	- `app/lib/auth/persistence.ts`        → browser persistence helpers (qmoi_user, tokens, privacy, parallel sessions)
	- `app/api/auth/**`                    → canonical auth API endpoints (when present)
	- `app/api/qmoi/memory/route.ts`       → uses `qmoiMemoryService` from `lib/auth/memory`

- `src/`
	- `src/qcity/`                         → canonical QCity source (QCityShell, utilities)
	- `src/components/qvillage/`           → QVillage shell and components
	- `src/components/qalpha/`             → QAlpha shell and components
	- `src/components/qmoi/`               → QMOI AI & QMOI Space shells and shared components
	- `src/components/shared/`             → shared UI (AppShellHeader, AvatarDisplay, UISettings, etc.)

- `components/`
	- `components/theme-provider.tsx`      → shared `ThemeProvider` (next-themes)
	- `components/theme/ThemeSelector.tsx` → theme selector UI used inside shells
	- `components/QCityThemeProvider.tsx`  → QCity-specific theme control (now unified to use ThemeSelector)

- `lib/`
	- `lib/auth/memory.ts`                 → `qmoiMemoryService` (in-memory memory API used by routes)
	- `lib/logger.ts`                      → logging helpers

- `styles/`
	- `styles/theme.css`                   → global theme CSS variables and defaults
	- `app/globals.css`                    → app globals imported from layout

Shared resources and cross-app dependencies
-------------------------------------------
- `ThemeProvider` (`components/theme-provider.tsx`) is used by `app/layout.tsx` to provide `next-themes` across all shells.
- `ThemeSelector` is present in each shell to let users pick shared themes (`light`, `dark`, `high-contrast`). The theme is persisted via `next-themes` with storageKey `qmoi_theme`.
- `useAuth` (`app/hooks/useAuth.ts`) is the canonical client-side auth hook used by `UniversalRouteGuard` and all shells.
- `app/components/auth/*` contains universal auth UI and persistence helpers used across shells.
- `lib/auth/memory.ts` and `app/lib/auth/memory.ts` provide memory / logging helpers; `qmoiMemoryService` is exported from `lib/auth/memory` and re-exported where needed.
- API routes for auth and memory live under `app/api/*` (preferred) and legacy duplicates may exist under `src/app/api/*` or `app/api/*` elsewhere.

Developer instructions
----------------------
1) Run type-check and build checks
	 - Type-check the repo (note: legacy files may produce noise). To validate app-level stability run:

		 npm run type-check

	 - If you want app-only checks, run `npx tsc --noEmit --project tsconfig.json` after ensuring `include` focuses on `app/**/*` (not recommended globally unless you scope tsconfig).

2) Validate universal auth + redirect flow
	 - Open the universal portal to target a specific app:
		 - `/universal?app=qcity&mode=signin` → will open the portal and on successful login redirect to `/qcity`.
		 - `/universal?app=qmoi-ai&mode=signin` → redirect to `/qmoi-ai` after auth.
	 - Quick local verification sequence:
		 - Start dev server: `npm run dev` (or `next dev`)
		 - Visit `http://localhost:3000/universal?app=qvillage&mode=signin`
		 - Complete login; the portal should redirect to `/qvillage` and the shell should apply the theme selected in `ThemeSelector`.

3) Theme handling notes
	 - `components/theme-provider.tsx` wraps the app via `app/layout.tsx`; it uses `next-themes` with storageKey `qmoi_theme` and supports `light`, `dark`, `high-contrast`.
	 - Shells use `useTheme()` to get `theme` and `resolvedTheme`, then compute `shellBackgroundClass` (e.g., 'min-h-screen bg-slate-100 text-slate-950' for light).
	 - To change default theme in code, update `components/theme-provider.tsx` defaultTheme or set from the UI via `ThemeSelector`.

4) Fixing import / path issues
	 - `tsconfig.json` defines alias `@/*` mapped to `./app/*`, `./src/*`, `./*`. When adding or fixing imports prefer `@/qcity/QCityShell` to target `src/qcity/QCityShell.tsx` or `app/qcity/...` depending on priority.
	 - Prefer canonical `src/*` shells as primary implementation; update `app/*` entry pages to import canonical shells via aliases (already present in many entry pages).

5) Memory & logging
	 - `lib/auth/memory.ts` exports `qmoiMemoryService` used by API route `app/api/qmoi/memory/route.ts` and `app/api/auth/memory/route.ts`.
	 - Client-side logging convenience `app/lib/auth/memory.ts` re-exports `qmoiMemoryService` where necessary and provides `logAuthEvent` which posts to `/api/auth/memory`.

6) Consolidation checklist (recommended next steps)
	 - Audit duplicate entry points and remove legacy directories only after feature parity and tests:
		 - `qmoi-space/` (legacy) → migrate features into `src/components/qmoi/` then delete
		 - `pwa_apps/` duplicates → keep only canonical public assets
		 - `qcity/`, `qvillage/` legacy duplicates → merge into `src/*` and remove
	 - Ensure `tsconfig` `paths` order favors `app/*` then `src/*` where appropriate to reduce ambiguous resolution.

7) Quick troubleshooting
	 - If a shell shows an empty page or 404, check `app/<shell>/page.tsx` imports and ensure they use `UniversalRouteGuard` and canonical shell components.
	 - If theme changes do not apply, verify `components/theme-provider.tsx` is used in `app/layout.tsx` and that `ThemeSelector` calls `setTheme()` from `useTheme()`.

References (key files)
---------------------
- `app/layout.tsx`
- `components/theme-provider.tsx`
- `components/theme/ThemeSelector.tsx`
- `app/hooks/useAuth.ts`
- `app/components/auth/UniversalAuthHub.tsx`
- `app/components/auth/UniversalRouteGuard.tsx`
- `lib/auth/memory.ts`
- `app/lib/auth/memory.ts` (re-export + client logger)
- `app/api/qmoi/memory/route.ts`
- `app/api/auth/memory/route.ts`
- `src/qcity/QCityShell.tsx`
- `src/components/qmoi/QMOIAIShell.tsx`
- `src/components/qvillage/QVillageShell.tsx`
- `src/components/qalpha/QAlphaShell.tsx`
- `src/components/qmoi/QMOISpaceShell.tsx`

Notes
-----
- This document is a snapshot. Because the repository has many legacy duplicates, run `npm run type-check` and inspect `app/`-prefixed errors first to ensure the canonical app is stable.
- Use this file as the base for a fuller `MERGE_PLAN_YYYYMMDD.md` when you begin automated consolidation.

Created by automation: June 11, 2026
