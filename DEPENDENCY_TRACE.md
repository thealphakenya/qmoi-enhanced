---
quantum-enabled: false
---

=== DEPENDENCY TREE ANALYSIS FOR QMOI ENTRY COMPONENTS ===

Generated: Mon Jun  8 00:41:47 UTC 2026

## QMOIChat Entry Component
```
File: src/components/qmoi/QMOIChat.tsx
```
├─ react (module/external)

## AvatarDisplay Entry Component
```
File: src/components/qmoi/AvatarDisplay.tsx
```
├─ react (module/external)

## QMOIDashboard Entry Component
```
File: src/components/q-city/QMOIDashboard.tsx
```
├─ react (module/external)
├─ @/app/lib/auth/persistence
├─ @/components/ui/card
│  ├─ @/components/ErrorBoundary
│  │  ├─ react (module/external)
│  │  ├─ @/lib/logger
│  │  │  ├─ winston (module/external)
│  │  │  ├─ @/lib/logger
│  │  │  │  ⟳ (circular - /workspaces/qmoi-enhanced/lib/logger.ts)
│  ├─ react (module/external)
│  ├─ @/lib/utils
│  │  ├─ clsx (module/external)
│  │  ├─ tailwind-merge (module/external)
├─ @/components/ui/badge
│  ├─ @/components/ErrorBoundary
│  │  ├─ react (module/external)
│  │  ├─ @/lib/logger
│  │  │  ├─ winston (module/external)
│  │  │  ├─ @/lib/logger
│  │  │  │  ⟳ (circular - /workspaces/qmoi-enhanced/lib/logger.ts)
│  ├─ react (module/external)
│  ├─ class-variance-authority (module/external)
│  ├─ @/lib/utils
│  │  ├─ clsx (module/external)
│  │  ├─ tailwind-merge (module/external)
│  ├─ @/lib/logger
│  │  ├─ winston (module/external)
│  │  ├─ @/lib/logger
│  │  │  ⟳ (circular - /workspaces/qmoi-enhanced/lib/logger.ts)
├─ @/lib/logger
│  ├─ winston (module/external)
│  ├─ @/lib/logger
│  │  ⟳ (circular - /workspaces/qmoi-enhanced/lib/logger.ts)

