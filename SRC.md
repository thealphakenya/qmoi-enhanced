# SRC.md - Source Inventory & App Integration

## Live Source Pages & Entry Points

### QMOI AI (`/qmoi-ai`)
- **Route File**: `app/qmoi-ai/page.tsx`
- **Entry Components**: 
  - `src/components/qmoi/QMOIChat.tsx` - AI conversation interface
  - `src/components/qmoi/AvatarDisplay.tsx` - Avatar visualization
- **Features**: AI chat, avatar presence, real-time responses
- **Auth**: Uses `useAuth` hook, supports login/logout
- **Backup**: `app/qmoi-ai/page.tsx.bak`

### QMOI Space (`/qmoi-space`)
- **Route File**: `app/qmoi-space/page.tsx`
- **Entry Components**:
  - `src/components/qmoi/ProjectManagement.tsx` - Project planning & tracking
  - `src/components/qmoi/FriendshipUI.tsx` - Social & collaboration
  - `src/components/qmoi/AvatarDisplay.tsx` - User avatar
- **Features**: Project collaboration, social connections, team management
- **Auth**: Uses `useAuth` hook, creates persistedUser, logs events
- **Backup**: `app/qmoi-space/page.tsx.bak`

### QCity (`/qcity`)
- **Route File**: `app/qcity/page.tsx`
- **Primary Entry Component**: `src/components/q-city/QMOIDashboard.tsx` - Master dashboard
- **Additional Panel Components**:
  - `src/components/q-city/DevicesHub.tsx` - Connected device management
  - `src/components/q-city/MetricsPanel.tsx` - System metrics & analytics
  - `src/components/q-city/SchedulePanel.tsx` - Task scheduling & automation
  - `src/components/q-city/PluginPanel.tsx` - Plugin & extension management
- **Features**: 
  - Tabbed interface (Dashboard, Devices, Metrics, Schedule, Plugins)
  - Master-only features with role upgrade
  - QVillage access for authorized users
  - Device management & monitoring
  - Automation & scheduling
  - Plugin marketplace
- **Full Component Library**: 60+ specialized components in `src/components/q-city/`
- **Auth**: Role-based access (master, user, sister); master role required for full features
- **Backup**: `app/qcity/page.tsx.bak`

### QAlpha (`/qalpha`)
- **Route File**: `app/qalpha/page.tsx`
- **Entry Components**: Multiple app-level components
  - Core: `AdminDashboard`, `QMOIMasterDashboard`
  - Support: `ChatMessaging`, `QMOIAutoFixDashboard`, `FileUploadDownload`
- **Features**: Advanced learning, research, model development, analytics
- **Status**: Aggregator shell (app-level components, not yet consolidated to src/)

### QVillage (`/qvillage`)
- **Route File**: `app/qvillage/page.tsx`
- **Status**: Referenced in routes; requires master-only access flag
- **Features**: Master village (private/collaborative space)

## Shared App Integration Points

### Authentication & Authorization
- `app/hooks/useAuth.ts` - Main auth hook (exports user, isAuthenticated, isLoading, login, logout, refreshUser, hasAccess)
- `app/lib/auth/persistence.ts` - User persistence (localStorage/sessionStorage)
- `app/lib/auth/memory.ts` - Auth event logging

### Shared Components
- `app/components/auth/LoginForm.tsx` - User login interface
- `app/components/auth/RegisterForm.tsx` - New user registration
- `app/components/` - Additional shared UI components

### Source-Level Components
- `src/components/qmoi/` - QMOI AI & Space components
  - `QMOIChat.tsx` - AI chat interface
  - `AvatarDisplay.tsx` - Avatar display
  - `ProjectManagement.tsx` - Project tracking
  - `FriendshipUI.tsx` - Social interface
  - `FriendshipManagement.tsx` - Friendship logic

- `src/components/q-city/` - QCity components (60+ total)
  - Core dashboards (QMOIDashboard, EnhancedQMOIDashboard, etc.)
  - Control panels (QMoiKernelPanel, QMoiMemoryPanel, etc.)
  - Management tools (DevicesHub, MetricsPanel, SchedulePanel, etc.)
  - AI systems (AIEconomySystem, AutoMLEngine, KnowledgeEngine, etc.)
  - Specialized features (UnifiedAPI, AutoHealingPlatform, etc.)

### Utilities & Services
- `app/lib/auth/` - Authentication utilities
- `src/api/client.ts` - API client wrapper
- `lib/logger.ts` - Logging service
- `lib/utils.ts` - Utility functions (cn, etc.)
- `src/services/` - AI and automation services

### UI Primitives
- `components/ui/card.tsx` - Card component
- `components/ui/badge.tsx` - Badge component
- `components/ui/use-toast.ts` - Toast notifications
- ErrorBoundary error handling

## Architecture Overview

```
Routes (app/)
├── qmoi-ai → src/components/qmoi/[QMOIChat, AvatarDisplay]
├── qmoi-space → src/components/qmoi/[ProjectManagement, FriendshipUI, AvatarDisplay]
├── qcity → src/components/q-city/[QMOIDashboard + 4 panels + 60+ components]
├── qalpha → app/components/[multiple aggregator components]
└── qvillage → app/qvillage/page.tsx

Auth Layer
├── useAuth hook
├── persistence layer
└── event logging

Shared Utilities
├── Logger
├── API Client
├── UI Primitives
└── Utilities
```

## Entry Points & Features

### QMOI AI Entry Features
- Real-time AI chat
- Avatar presence
- Message history
- User authentication
- Navigation to Space & QCity

### QMOI Space Entry Features
- Project creation & management
- Task tracking with priorities
- Friend connections & collaboration
- Social profiles
- Statistics dashboard
- Navigation to AI & QCity

### QCity Entry Features
- **Dashboard**: System overview, health, pulse, projects
- **Devices**: Connected device management & monitoring
- **Metrics**: Real-time performance & resource metrics
- **Schedule**: Task scheduling & automation workflows
- **Plugins**: Plugin discovery, installation, configuration
- **Master Controls**: Role upgrade, system-wide automation
- **Navigation**: Links to QVillage, QMOI Space, QMOI AI

### QAlpha Entry Features
- Advanced learning paths
- Model development & training
- Research collaboration
- Community contributions
- Analytics dashboard
- Multiple sub-dashboards

## Notes

The public routes now reflect actual source channel wiring:

- **QMOI AI** uses source-level chat and avatar components
- **QMOI Space** uses source-level collaboration modules (projects, friends, avatars)
- **QCity** uses comprehensive source-level dashboard with 60+ specialized components
- **QAlpha** remains an app-level aggregator (future consolidation possible)
- All routes integrate with centralized auth, persistence, and logging
- Master role enables advanced features in QCity
- Role-based access controls gate premium features

## Documentation References

- [QCITY_SETUP.md](QCITY_SETUP.md) - Comprehensive QCity documentation
- [SRC_INVENTORY.md](SRC_INVENTORY.md) - Detailed component inventory (if exists)
- Route-specific backups: `app/[route]/page.tsx.bak`
