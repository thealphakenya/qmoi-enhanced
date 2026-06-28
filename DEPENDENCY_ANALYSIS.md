---
quantum-enabled: false
---

# QMOI Enhanced - Dependency Analysis & Component Tree

## Generated: 2026-06-08

This document provides a comprehensive analysis of component dependencies across the QMOI application routes and their entry points.

---

## Route Entry Points Summary

| Route | Main Entry Component | Location | Auth Pattern | Status |
|-------|---|---|---|---|
| `/qmoi-ai` | QMOIChat + AvatarDisplay | `src/components/qmoi/` | ✅ useAuth + persistence | ✅ Consolidated |
| `/qmoi-space` | ProjectManagement + FriendshipUI | `src/components/qmoi/` | ✅ useAuth + persistence + logging | ✅ Consolidated |
| `/qcity` | QMOIDashboard + 4 panels | `src/components/q-city/` | ✅ useAuth + persistence + logging | ✅ Full Hub |
| `/qalpha` | AdminDashboard + 20+ app components | `app/components/` | ⚠️ Mixed (useAuth) | 🔄 Pending Consolidation |

---

## Component Dependency Analysis

### 1. QMOI AI Route (`/qmoi-ai`)

**File**: `app/qmoi-ai/page.tsx`

**Direct Imports**:
```typescript
- @/app/hooks/useAuth
- @/app/lib/auth/persistence (persistUserToStorage)
- @/app/lib/logger
- @/src/components/qmoi/QMOIChat
- @/src/components/qmoi/AvatarDisplay
```

**QMOIChat Component** (`src/components/qmoi/QMOIChat.tsx`)
- **Props**: `onMessageReceived?: (message: string) => void`
- **Dependencies**: React, useState (internal state only)
- **External Dependencies**: None
- **Leaf Node**: ✅ (minimal dependencies)

**AvatarDisplay Component** (`src/components/qmoi/AvatarDisplay.tsx`)
- **Props**: `name?: string`, `quality?: string`, `isActive?: boolean`
- **Dependencies**: React
- **External Dependencies**: None
- **Leaf Node**: ✅ (minimal dependencies)

**Dependency Chain**:
```
app/qmoi-ai/page.tsx
├── @/app/hooks/useAuth
│   └── @/app/lib/auth/memory
│       └── localStorage/sessionStorage
├── @/app/lib/auth/persistence
│   └── localStorage/sessionStorage
├── @/lib/logger
│   └── winston
├── QMOIChat (leaf)
└── AvatarDisplay (leaf)
```

**Total Dependency Depth**: 3 levels
**External Modules**: 1 (winston)

---

### 2. QMOI Space Route (`/qmoi-space`)

**File**: `app/qmoi-space/page.tsx`

**Direct Imports**:
```typescript
- @/app/hooks/useAuth
- @/app/lib/auth/persistence (persistUserToStorage)
- @/app/lib/auth/memory (logAuthEvent)
- @/src/components/qmoi/ProjectManagement
- @/src/components/qmoi/FriendshipUI
- @/src/components/qmoi/AvatarDisplay
- @/lib/logger
```

**ProjectManagement & FriendshipUI**: Similar leaf components

**Dependency Chain**:
```
app/qmoi-space/page.tsx
├── @/app/hooks/useAuth (auth system)
├── @/app/lib/auth/persistence (storage)
├── @/app/lib/auth/memory (logging)
├── @/lib/logger (structured logging)
├── ProjectManagement (leaf)
├── FriendshipUI (leaf)
└── AvatarDisplay (leaf)
```

**Total Dependency Depth**: 3 levels
**External Modules**: 1 (winston)

---

### 3. QCity Route (`/qcity`) - Master Control Hub

**File**: `app/qcity/page.tsx`

**Direct Imports** (Primary Panels):
```typescript
- @/src/components/q-city/QMOIDashboard
- @/src/components/q-city/DevicesHub
- @/src/components/q-city/MetricsPanel
- @/src/components/q-city/SchedulePanel
- @/src/components/q-city/PluginPanel
```

**Secondary Imports** (Auth + Logging):
```typescript
- @/app/hooks/useAuth
- @/app/lib/auth/persistence
- @/app/lib/auth/memory
- @/app/components/auth/LoginForm
- @/app/components/auth/RegisterForm
- @/lib/logger
- @/lib/utils (cn classname merger)
```

**Available Component Library** (60+ exports from `src/components/q-city/index.ts`):

**Core Dashboards** (8):
- QMOIDashboard
- EnhancedQMOIDashboard
- QMoiDatabaseDashboard
- QMoiProjectDashboard
- EarningDashboard
- ProductionRevenueDashboard
- QNewsDashboard
- RoleBasedDashboard

**Control Panels** (7):
- QMoiKernelPanel
- QMoiMemoryPanel
- QMoiToolbar
- QMoiFileEditorChat
- QMoiMediaManager
- QMoiSettingsPanel
- QMoiAutoDevPanel

**System & Automation** (7):
- AccountAutomationPanel
- SocialAutomationPanel
- DevicesHub
- DevicePanel
- SystemHealthPanel
- SelfTrainingEcosystem
- SelfHealPanel

**Management & Tools** (8):
- MetricsPanel
- SchedulePanel
- PluginPanel
- SessionPanel
- HelpPanel
- QApiKeyManager
- DocumentManagerPanel
- QFileManager
- WalletManager

**AI & Intelligence** (6):
- AIEconomySystem
- AIAgentSystem
- AutoMLEngine
- KnowledgeEngine
- GlobalAIKnowledgeGraph
- AutonomousDevelopmentPipeline

**UI & Experience** (5):
- AvatarSelector
- VoiceSelector
- MoodTracker
- CommandPanel
- Onboarding

**Specialized Features** (7):
- UnifiedAPI
- AutoHealingPlatform
- RelationshipInsightsPanel
- ResearchCenterPanel
- LanguageLabPanel
- BackupRestorePanel
- AuditLogPanel

**State Management** (3):
- QMoiState
- QMoiStateProvider
- QMoiStateContext

**Dependency Chain** (Primary Panels):
```
app/qcity/page.tsx
├── @/app/hooks/useAuth
│   └── @/app/lib/auth/memory
├── @/app/lib/auth/persistence
├── @/lib/logger
│   └── winston
├── QMOIDashboard
├── DevicesHub
├── MetricsPanel
├── SchedulePanel
├── PluginPanel
├── LoginForm (conditional)
└── RegisterForm (conditional)
```

**Total Dependency Depth**: 3 levels
**External Modules**: 1 (winston)
**Available Extensions**: 60+ components in library

---

### 4. QAlpha Route (`/qalpha`) - Status: Consolidation Pending

**File**: `app/qalpha/page.tsx`

**Current Import Pattern** (20+ components from `app/components/`):
```typescript
- AdminDashboard
- ChatMessaging
- QMOIAutoFixDashboard
- QMOIAutoSetup
- FileUploadDownload
- VisualEnhancement
- AudibleConversation
- ClientUISettings
- QMOIMasterDashboard
- SponsoredUsersManager
- UserProfile
- WalletList
- RegisterForm (from app/components/auth/)
- PreviewWindow
- ThemeCustomizer
- DataVisualizationPanel
- AnalyticsDashboard
- SecurityMonitor
- PerformanceMonitor
```

**Auth Pattern**: Uses `useAuth` from `app/hooks/` ✅

**Available Components in src**:
- `src/components/alpha-q-ai-system.tsx` (1 specialized component)

**Current Status**:
- ⚠️ Mixes `app/components/` imports with auth from `app/hooks/`
- ⚠️ No structured logging integration
- ⚠️ No persistence layer integration
- 🔄 Pending consolidation to follow `/qmoi-ai` and `/qmoi-space` patterns

**Consolidation Plan**:
1. Create `src/components/qalpha/` directory for dedicated QAlpha components
2. Migrate core QAlpha entry components (AdminDashboard, ChatMessaging, etc.) to src if they don't exist
3. Update imports to use `@/src/components/qalpha/*` pattern
4. Add logging integration using `@/lib/logger`
5. Ensure auth persistence with `@/app/lib/auth/persistence`
6. Follow optional invocation pattern for auth methods
7. Create `src/components/qalpha/index.ts` export hub

---

## Shared Infrastructure

All routes leverage these shared systems:

### Authentication System
```
@/app/hooks/useAuth
├── user: QmoiUser (with id, name, email, role)
├── isAuthenticated: boolean
├── isLoading: boolean
├── login(role?: string): Promise<void>
├── logout(): Promise<void>
├── refreshUser(): Promise<void>
└── hasAccess(feature: string): boolean
```

### Persistence Layer
```
@/app/lib/auth/persistence
├── persistUserToStorage(user): void
├── readPersistedUser(): QmoiUser | null
└── clearPersistedUser(): void
```

### Logging System
```
@/lib/logger
├── log.info(message, metadata)
├── log.warn(message, metadata)
├── log.error(message, metadata)
├── log.debug(message, metadata)
├── logApiRequest(endpoint, params)
└── logApiError(endpoint, error)
```

### API Client
```
@/src/api/client.ts
├── Timeout: 25 seconds default
├── Methods: GET, POST, PUT, PATCH, DELETE
├── Retry logic: Built-in
└── Base URL resolution: Automatic
```

---

## Import Path Aliases

| Alias | Resolves To | Used For |
|-------|---|---|
| `@/app` | `app/` | App-level hooks, auth, forms |
| `@/src` | `src/` | Reusable components |
| `@/lib` | `lib/` | Utilities, logger, API client |
| `@/components` | `src/components/` | Component library (fallback) |

---

## Consolidation Status

### ✅ Completed
- `/qmoi-ai` - Thin wrapper with src entry components
- `/qmoi-space` - Standardized src imports + auth integration
- `/qcity` - Full master control hub with 60+ component library

### 🔄 In Progress
- TypeScript validation (errors being resolved)
- Component prop validation

### ⏳ Pending
- `/qalpha` - Full consolidation to src components
- Recursive dependency tree documentation
- Build-time dependency optimization

---

## Statistics

| Metric | Count |
|--------|-------|
| Active Routes | 4 |
| Consolidated Routes | 3 |
| Total Components in Library | 70+ |
| Shared Auth Integration Points | 3 |
| Logging Integration Points | 2 |
| External Dependencies | 1 (winston) |
| Average Dependency Depth | 3 levels |

---

## Recommendations

1. **QAlpha Consolidation**: Move all QAlpha components to `src/components/qalpha/` and update imports
2. **Circular Dependency Check**: Run build-time circular dependency analyzer
3. **Lazy Loading**: Consider lazy-loading QAlpha panel components for performance
4. **Tree-shaking**: Ensure unused components don't bloat bundle
5. **Component Colocations**: Group related components by feature (devices, metrics, scheduling)

---

## Related Documents

- [QCITY_SETUP.md](QCITY_SETUP.md) - QCity-specific configuration and features
- [SRC.md](SRC.md) - Source component inventory for all routes

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-28T19:36:37.158336Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 390
- words: 1164
- characters: 9733
- headings: 22
- links: 2
- images: 0
- tables: 21
- lion validation block: present
<!-- LION_VALIDATION_END -->
