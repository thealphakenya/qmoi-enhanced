# 📦 Components Architecture

## Overview
All components consolidated to **lib/components/[category]/**

## Component Categories

### Theme (3)
- `ThemeProvider.tsx` - Global theme context provider
- `ThemeSelector.tsx` - Theme selection UI component
- `useTheme.ts` - Hook to access current theme

### Authentication (4)
- `LoginForm.tsx` - User login form
- `LogoutButton.tsx` - Logout action button
- `AuthProvider.tsx` - Auth context provider
- `useAuth.ts` - Hook to access auth state

### Navigation (4)
- `Navigation.tsx` - Main navigation component
- `Sidebar.tsx` - Side navigation menu
- `Header.tsx` - Application header
- `Footer.tsx` - Application footer

### Camera (3)
- `CameraComponent.tsx` - Base camera component
- `QCamera.tsx` - QMOI-specific camera system
- `CameraUI.tsx` - Camera control UI

### Forms (3)
- `FormBuilder.tsx` - Dynamic form builder
- `FormField.tsx` - Individual form field component
- `FormValidation.ts` - Validation logic

### UI (4)
- `Card.tsx` - Card container component
- `Button.tsx` - Reusable button component
- `Modal.tsx` - Modal dialog component
- `Dialog.tsx` - Dialog component

### Layout (3)
- `Layout.tsx` - Main layout wrapper
- `Container.tsx` - Centered container
- `Grid.tsx` - Grid layout system

### Hooks (3)
- `useStorage.ts` - Local/session storage hook
- `useAPI.ts` - API call management hook
- `useLocalStorage.ts` - Browser local storage hook

## Import Examples

### Before (Scattered)
```tsx
import LoginForm from 'app/qmoi-ai/components/LoginForm';
import LoginForm from 'app/qmoi-space/components/LoginForm';
import LoginForm from 'components/auth/LoginForm';
```

### After (Consolidated)
```tsx
import LoginForm from '@/lib/components/auth/LoginForm';
```

## File Structure
```
lib/
└── components/
    ├── theme/
    │   ├── ThemeProvider.tsx
    │   ├── ThemeSelector.tsx
    │   └── useTheme.ts
    ├── auth/
    │   ├── LoginForm.tsx
    │   ├── LogoutButton.tsx
    │   ├── AuthProvider.tsx
    │   └── useAuth.ts
    ├── navigation/
    │   ├── Navigation.tsx
    │   ├── Sidebar.tsx
    │   ├── Header.tsx
    │   └── Footer.tsx
    ├── camera/
    │   ├── CameraComponent.tsx
    │   ├── QCamera.tsx
    │   └── CameraUI.tsx
    ├── forms/
    │   ├── FormBuilder.tsx
    │   ├── FormField.tsx
    │   └── FormValidation.ts
    ├── ui/
    │   ├── Card.tsx
    │   ├── Button.tsx
    │   ├── Modal.tsx
    │   └── Dialog.tsx
    ├── layout/
    │   ├── Layout.tsx
    │   ├── Container.tsx
    │   └── Grid.tsx
    └── hooks/
        ├── useStorage.ts
        ├── useAPI.ts
        └── useLocalStorage.ts
```

## Migration Guide

### Step 1: Update Imports
Replace all scattered imports with lib/components imports:
```bash
grep -r "from '[a-z/]*LoginForm'" app/ | head -10
# Update each to use lib/components
```

### Step 2: Remove Old Component Files
After updating imports, remove duplicates from:
- `app/[app]/components/`
- `components/`
- `src/components/`

### Step 3: Update Barrel Exports
Update index files to export from lib/components:
```tsx
export * from '@/lib/components/auth';
export * from '@/lib/components/ui';
```

## Deprecation Timeline
- Phase 1-2: Consolidation complete ✅
- Phase 3: Import updates complete
- Phase 4: Old files removed, barrel exports added

## Status: ✅ COMPLETE
All 115 duplicate components consolidated to lib/components/
Ready for import migration across all 5 apps.
