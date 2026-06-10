# UNIVERSAL.md — Universal Auth, Navigation, Role-Based Features, and App Flow Reference

## Purpose

This document defines the universal runtime experience for the QMOI Enhanced application family. It covers the universal authentication portal, app entry behavior, auto-channel routing, privacy controls, memory-sync awareness, security guard features, and comprehensive role-based feature access control.

## User Roles and Access Levels

QMOI supports four distinct user roles with hierarchical access levels and feature gating:

### Role Hierarchy and Permissions

| Role | Access Level | Purpose | Features |
|------|------|---------|----------|
| **master** | 100 | Full system administration | All system features, financial management, user management, AI fine-tuning, advanced controls, biometric setup |
| **sister** | 65 | Collaborative/family access | Projects, datasets, collaboration, friendship management, chat export, memory sync, personal content |
| **user** | 30 | Standard authenticated user | Chat, basic features, dataset browsing, learning paths, profile management, theme selection |
| **guest** | 10 | Limited public access | Read-only content browsing, theme selection, help/support, limited chat |

### Role-Specific Permissions

```
Master Access:
- General chat & advanced models
- System control & financial management
- User management & build control
- QCity, QVillage, QMOI Space full access
- Memory access & biometric enrollment
- Model fine-tuning & API integration

Sister Access:
- General chat & personal content
- Goals management & wallet view
- QMOI Space & collaboration
- Memory access & biometric support
- Friendship management & team features

User Access:
- General chat & basic AI features
- Help & support resources
- Profile view & wallet view
- QMOI Space browsing
- Dataset browsing (limited)

Guest Access:
- General chat (limited context)
- Help & support
- Theme selection
- Public content only
```

## Universal Entry Behavior

- The root route `/` now opens the universal auth portal by default via `app/page.tsx`.
- The universal portal endpoint is `/universal` and is implemented in `app/universal/page.tsx`.
- All canonical app shells now use a universal route guard so unauthenticated access is automatically redirected to `/universal`.
- App routes with universal auth support include:
  - `/qmoi-ai` → `app/qmoi-ai/page.tsx` (role-aware AI chat and avatar)
  - `/qmoi-space` → `app/qmoi-space/page.tsx` (collaborative projects and datasets)
  - `/qcity` → `app/qcity/page.tsx` (master-only command center)
  - `/qvillage` → `app/qvillage/page.tsx` (community datasets and models)
  - `/qalpha` → `app/qalpha/page.tsx` (research and learning paths)

## Universal Authentication Flow

The universal auth portal provides:

- `Universal Sign In`
- `Universal Register`
- `Forgot Password`
- `Forgot Email`
- `Reset Password`
- Biometric login and registration support (master & sister)
- Session refresh and persistent state across shell transitions
- Privacy mask and parallel session controls (role-gated)

### Implemented components

- `app/components/auth/UniversalAuthHub.tsx`
- `app/components/auth/LoginForm.tsx`
- `app/components/auth/RegisterForm.tsx`
- `app/components/auth/ForgotEmailForm.tsx`
- `app/components/auth/ResetPasswordForm.tsx`
- `app/components/auth/AuthStatusCard.tsx`
- `app/components/auth/UniversalRouteGuard.tsx`
- `src/components/auth/RoleGate.tsx` (role-based feature gating)
- `app/hooks/useAuth.ts`
- `app/lib/auth/persistence.ts`

## Role-Based Feature Access

Each application shell renders different features and UI elements based on the logged-in user's role. The feature matrix is defined in `lib/rbac/roleFeatures.ts` and applied via the `RoleGate` component in `src/components/auth/RoleGate.tsx`.

### QMOI AI Features (Role-Gated)

| Feature | Master | Sister | User | Guest |
|---------|--------|--------|------|-------|
| Chat access | ✅ | ✅ | ✅ | ❌ |
| Chat history | ✅ | ✅ | ✅ | ❌ |
| Chat export | ✅ | ✅ | ❌ | ❌ |
| Advanced models | ✅ | ❌ | ❌ | ❌ |
| API integration | ✅ | ❌ | ❌ | ❌ |
| Model fine-tuning | ✅ | ❌ | ❌ | ❌ |

### QMOI Space Features (Role-Gated)

| Feature | Master | Sister | User | Guest |
|---------|--------|--------|------|-------|
| View projects | ✅ | ✅ | ✅ | ❌ |
| Create project | ✅ | ✅ | ✅ | ❌ |
| Edit own project | ✅ | ✅ | ✅ | ❌ |
| Delete project | ✅ | ✅ | ❌ | ❌ |
| Upload dataset | ✅ | ✅ | ❌ | ❌ |
| Manage friendships | ✅ | ✅ | ✅ | ❌ |
| Collaborative editing | ✅ | ✅ | ✅ | ❌ |

### QCity Features (Master Only)

| Feature | Master | Sister | User | Guest |
|---------|--------|--------|------|-------|
| View dashboard | ✅ | ❌ | ❌ | ❌ |
| View devices | ✅ | ❌ | ❌ | ❌ |
| Manage devices | ✅ | ❌ | ❌ | ❌ |
| View metrics | ✅ | ❌ | ❌ | ❌ |
| Schedule tasks | ✅ | ❌ | ❌ | ❌ |
| Master controls | ✅ | ❌ | ❌ | ❌ |

### QVillage Features (Role-Gated)

| Feature | Master | Sister | User | Guest |
|---------|--------|--------|------|-------|
| Browse datasets | ✅ | ✅ | ✅ | ❌ |
| Purchase dataset | ✅ | ✅ | ✅ | ❌ |
| Publish dataset | ✅ | ❌ | ❌ | ❌ |
| Deploy model | ✅ | ❌ | ❌ | ❌ |
| View community | ✅ | ✅ | ✅ | ✅ |
| Monetization | ✅ | ❌ | ❌ | ❌ |

## Role-Based Styling

Each app shell applies role-specific visual styling to reinforce the user's access level and features:

- **Master**: Red/crimson accents with full-featured UI (`bg-red-600`, `text-red-400`)
- **Sister**: Purple accents with collaborative features (`bg-purple-600`, `text-purple-400`)
- **User**: Blue accents with standard features (`bg-blue-600`, `text-blue-400`)
- **Guest**: Slate/grey accents with limited features (`bg-slate-600`, `text-slate-300`)

Each shell displays a role-specific welcome card on login showing:
- Current user's role with badge
- Personalized greeting based on role
- Number of available features
- Access level percentage

## Role-Aware Responses

API endpoints and UI components respond contextually to the user's role:

- Chat responses are filtered based on role permissions and access level
- Dataset results show role-appropriate sensitivity levels
- Feature availability messages explain which role is required
- Buttons and controls are styled to match the user's role color scheme

## Auto-Channeling and Redirects

- When a user opens a protected app route, the route guard captures the target path and redirects to `/universal?redirect=<target>&mode=signin`.
- After successful authentication, the universal portal automatically redirects the user back to the original target route with their role-appropriate UI.
- Theme preference is preserved during this redirect flow.

## Theme Persistence and App Awareness

- Theme state is shared across apps through the universal theme provider and persisted in `qmoi_theme` storage.
- Each role can have their own theme preference that persists across sessions.
- Theme switching updates the selected theme for the universal portal and all other shells in the same session.
- Privacy mask and parallel session state preserve the selected theme without exposing sensitive metadata.

## Privacy and Security Features

- `privacyMask` state is available in the universal portal to mark sessions as privacy-aware (sister & master only).
- `parallelMode` state allows the system to maintain multiple session contexts while preserving isolation (master only).
- `useAuth` syncs session state across browser storage events and cross-shell interactions.
- Auth state is persisted via `persistUserToStorage` and `persistAuthTokens`.
- The universal auth portal avoids revealing sensitive session details in public browser history.

## Memory Sync and Consciousness Awareness

- Universal auth acts as the centralized identity anchor for memory-aware features.
- Auth persistence is designed to keep session state consistent across QMOI shells without exposing intermediate secrets.
- Universal features are aware of current user roles, preferred theme, and session trust status.
- Role-based memory sync ensures users only access data appropriate to their access level.

## Style and UI Integration

- Universal auth pages and components use the shared QMOI theme system with role-aware styling.
- The universal portal inherits styling from the shared shell theme components and reinforces the same brand language.
- Role-specific colors and accents are applied consistently across all shells.
- Feature availability UI provides clear, role-contextual feedback.

## Implementation Components

### Role-Based Feature Gating

- `lib/rbac/roleFeatures.ts` — Defines feature access matrix for all roles
- `lib/rbac/roleStyles.ts` — Provides role-specific styling and response formatting
- `src/components/auth/RoleGate.tsx` — React component for conditionally rendering features by role
- `app/hooks/useAuth.ts` — Auth hook with `hasAccess()` permission checking method

### Usage Example

```tsx
<RoleGate
  feature="advanced_models"
  category="qmoiAI"
  role={user.role}
  fallback={<p>Advanced models available for master users only</p>}
>
  <AdvancedModelsPanel />
</RoleGate>
```

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
- `lib/rbac/roleFeatures.ts`
- `lib/rbac/roleStyles.ts`
- `src/components/auth/RoleGate.tsx`

## Change History

- 2026-06-10: Added comprehensive role-based feature access matrix and styling documentation.
- 2026-06-10: Documented role hierarchy (master/sister/user/guest) and feature gating.
- 2026-06-10: Added implementation details for RoleGate component and RBAC system.
- 2026-06-09: Created universal auth and auto-channel reference.
- 2026-06-09: Added cross-shell route guard and redirect behavior documentation.
