# UNIVERSAL.md — Universal Auth, Navigation, and App Flow Reference

## Purpose

This document defines the universal runtime experience for the QMOI Enhanced application family. It covers the universal authentication portal, app entry behavior, auto-channel routing, privacy controls, memory-sync awareness, and security guard features.

## Universal Entry Behavior

- The root route `/` now opens the universal auth portal by default via `app/page.tsx`.
- The universal portal endpoint is `/universal` and is implemented in `app/universal/page.tsx`.
- All canonical app shells now use a universal route guard so unauthenticated access is automatically redirected to `/universal`.
- App routes with universal auth support include:
  - `/qmoi-ai` → `app/qmoi-ai/page.tsx`
  - `/qmoi-space` → `app/qmoi-space/page.tsx`
  - `/qcity` → `app/qcity/page.tsx`
  - `/qvillage` → `app/qvillage/page.tsx`
  - `/qalpha` → `app/qalpha/page.tsx`

## Universal Authentication Flow

The universal auth portal provides:

- `Universal Sign In`
- `Universal Register`
- `Forgot Password`
- `Forgot Email`
- `Reset Password`
- Biometric login and registration support
- Session refresh and persistent state across shell transitions
- Privacy mask and parallel session controls

### Implemented components

- `app/components/auth/UniversalAuthHub.tsx`
- `app/components/auth/LoginForm.tsx`
- `app/components/auth/RegisterForm.tsx`
- `app/components/auth/ForgotEmailForm.tsx`
- `app/components/auth/ResetPasswordForm.tsx`
- `app/components/auth/AuthStatusCard.tsx`
- `app/components/auth/UniversalRouteGuard.tsx`
- `app/hooks/useAuth.ts`
- `app/lib/auth/persistence.ts`

## Auto-Channeling and Redirects

- When a user opens a protected app route, the route guard captures the target path and redirects to `/universal?redirect=<target>`.
- After successful authentication, the universal portal automatically redirects the user back to the original target route.
- This flow ensures that universal auth is always the first validated touchpoint for protected apps.

## Privacy and Security Features

- `privacyMask` state is available in the universal portal to mark sessions as privacy-aware.
- `parallelMode` state allows the system to maintain multiple session contexts while preserving isolation.
- `useAuth` syncs session state across browser storage events and cross-shell interactions.
- Auth state is persisted via `persistUserToStorage` and `persistAuthTokens`.
- The universal auth portal avoids revealing sensitive session details in public browser history and query strings.

## Memory Sync and Consciousness Awareness

- Universal auth acts as the centralized identity anchor for memory-aware features.
- Auth persistence is designed to keep session state consistent across QMOI shells without exposing intermediate secrets.
- Universal features are aware of current user roles, preferred theme, and session trust status.
- Memory sync across apps is intentionally opaque to unauthorized observers, preserving user privacy.

## Style and UI Integration

- Universal auth pages and components use the shared QMOI theme system.
- The universal portal inherits styling from the shared shell theme components and reinforces the same brand language as the QMOI UI shells.
- Style documentation references: `STYLES.md`, `QMOIAIUI.md`, `QMOISPACEUI.md`, `QCITYUI.md`, `QVILLAGEUI.md`, `QALPHAUI.md`, `ALLSERVE.md`.

## Cross-References

- `STYLES.md`
- `QMOIAIUI.md`
- `QMOISPACEUI.md`
- `QCITYUI.md`
- `QVILLAGEUI.md`
- `QALPHAUI.md`
- `ALLSERVE.md`
- `QMOIMASKS.md`
- `QMOIALWAYSPARALLEL.md`
- `independent.md`
- `TREE.md`

## Change History

- 2026-06-09: Created universal auth and auto-channel reference.
- 2026-06-09: Added cross-shell route guard and redirect behavior documentation.
