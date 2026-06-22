---
quantum-enabled: false
---

# SRC.md - Source Inventory & App Integration

## Live Source Pages & Entry Points

### QMOI AI (`/qmoi-ai`)
- **Route File**: `app/qmoi-ai/page.tsx`
- **Entry Component**: `src/components/qmoi/QMOIAIShell.tsx` - QMOI AI route shell
- **Alias Import**: `@/components/qmoi/QMOIAIShell`
- **Primary Source Components**:
  - `src/components/qmoi/QMOIChat.tsx` - AI conversation interface
  - `src/components/qmoi/AvatarDisplay.tsx` - Avatar visualization
- **Features**: AI chat, avatar presence, real-time responses
- **Auth**: Uses `useAuth` hook, supports login/logout

### QMOI Space (`/qmoi-space`)
- **Route File**: `app/qmoi-space/page.tsx`
- **Entry Component**: `src/components/qmoi/QMOISpaceShell.tsx` - QMOI Space route shell
- **Alias Import**: `@/components/qmoi/QMOISpaceShell`
- **Primary Source Components**:
  - `src/components/qmoi/ProjectManagement.tsx` - Project planning & tracking
  - `src/components/qmoi/FriendshipUI.tsx` - Social & collaboration
  - `src/components/qmoi/AvatarDisplay.tsx` - User avatar
- **Features**: Project collaboration, social connections, team management
- **Auth**: Uses `useAuth` hook, creates persistedUser, logs events

### QCity (`/qcity`)
- **Route File**: `app/qcity/page.tsx`
- **Entry Component**: `src/components/q-city/QCityShell.tsx` - QCity route shell
- **Alias Import**: `@/components/q-city/QCityShell`
- **Primary Source Components**:
  - `src/components/q-city/QMOIDashboard.tsx` - Master dashboard
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
- **Full Component Library**: 66 specialized components in `src/components/q-city/`
- **Auth**: Role-based access (master, user, sister); master role required for full features

### QAlpha (`/qalpha`)

### Universal Portal (`/universal`)
- **Route File**: `app/universal/page.tsx`
- **Entry Component**: `app/components/auth/UniversalAuthHub.tsx`
- **Purpose**: Central authentication gateway, auto-channel redirects, privacy/parallel session controls, and cross-shell user awareness.
- **Post-signin Style Redirect**: After a successful universal signin, the portal preserves requested `app` and `mode` query params and will either:
  - Redirect directly to the targeted app root (e.g. `/qcity`) with the `qmoi_theme` applied, or
  - Redirect to the app-specific styles page (if `?goto=styles` is present) such as `/qcity/styles` to allow users to preview or adjust theme, accessibility and UI settings before continuing.
- **Features**: Universal login/register, password/email recovery, session refresh, biometric support, theme persistence, realtime visual preferences (audio/camera overlays), and app boundary redirect preservation.
- **Integration**: All canonical app shells use `app/components/auth/UniversalRouteGuard.tsx` to ensure secure access and safe redirection. The `useAuth` hook and `ThemeSelector` are used during the redirect flow to apply the persisted `qmoi_theme` and user-specific UI preferences before hydration completes.

### QVillage (`/qvillage`)
- **Route File**: `app/qvillage/page.tsx`
- **Entry Component**: `src/components/qvillage/QVillageShell.tsx` - QVillage route shell
- **Alias Import**: `@/components/qvillage/QVillageShell`
- **Status**: Source-level route shell available; role-based access enforced via `useAuth`
- **Features**: Master village (private/collaborative space)

## Shared App Integration Points
- `src/components/shared/ui/AppShellHeader.tsx` - Shared shell branding and centralized app icon wrapper used by all app shells.
- `src/assets/icons/apps/` - Centralized app icon collection for QCity, QMOI AI, QMOI Space, QVillage, and QAlpha.

### Authentication & Authorization
- `app/hooks/useAuth.ts` - Main auth hook (exports user, isAuthenticated, isLoading, login, logout, refreshUser, hasAccess)
- `app/lib/auth/persistence.ts` - User persistence (localStorage/sessionStorage)
- `app/lib/auth/memory.ts` - Auth event logging

### Shared Components
- `app/components/auth/LoginForm.tsx` - User login interface
- `app/components/auth/RegisterForm.tsx` - New user registration
- `app/components/` - Legacy shared UI components (54 `.tsx` files)
- `src/app/master/domain-health/page.tsx` - Secondary source page under `src/app` for domain health monitoring (not part of the main QMOI public route surfaces)

### App Component Cleanup Candidates
- `app/components/` contains 54 files total, including 50 top-level `.tsx` files plus 4 nested auth components.
- A full scan of `app/` and `src/` confirms no source `.ts`, `.tsx`, `.js`, or `.jsx` file imports from `@/app/components/`.
- `app/components` is now a documentation/legacy surface only; remaining references are found in markdown, JSON, and report artifacts.
- This folder can be pruned once those non-code references are validated and removed.
- Candidate unused files include: `AnalyticsCenter.tsx`, `ApiManagementConsole.tsx`, `AuditLogViewer.tsx`, `BackupRestoreManager.tsx`, `CollaborationHub.tsx`, `CommunicationHub.tsx`, `ComplianceManager.tsx`, `ContentManagementSystem.tsx`, `DeploymentManager.tsx`, `FloatingPreviewWindow.tsx`, `GlobalOperationsCenter.tsx`, `HelpGuide.tsx`, `InnovationLab.tsx`, `IntegrationManager.tsx`, `KnowledgeBase.tsx`, `LcSpaces.tsx`, `Marketplace.tsx`, `MonitoringDashboard.tsx`, `NotificationCenter.tsx`, `QCityErrorManager.tsx`, `QCityThemeProvider.tsx`, `QIStateWindow.tsx`, `QVillageDatasetsPanel.tsx`, `QiSpaces.tsx`, `ResourceManager.tsx`, `SettingsPanel.tsx`, `SupportTicketSystem.tsx`, `TestingAutomationSuite.tsx`, `TrainingCenter.tsx`, `UserManagementPanel.tsx`, `WalletPanel.tsx`, `WorkflowAutomationEngine.tsx`, `auth/LoginForm.tsx`, and `auth/RegisterForm.tsx`.

### Supporting Source APIs
- `src/app/api/accountability/route.ts` - Accountability route handler
- `src/app/api/global/route.ts` - Global platform route handler
- `src/app/api/qvs/route.ts` - QVS source route handler
- `src/app/api/subscriptions/route.ts` - Subscription route handler
- `src/api/client.ts` - API client wrapper
- `src/api/revenueValidator.ts` - Revenue validation helper
- `src/api/routes/links-validation.ts` - Links validation route logic
- `src/api/routes/selfwork.ts` - Self-work route helper

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
├── qmoi-ai → src/components/qmoi/QMOIAIShell.tsx → [QMOIChat, AvatarDisplay]
├── qmoi-space → src/components/qmoi/QMOISpaceShell.tsx → [ProjectManagement, FriendshipUI, AvatarDisplay]
├── qcity → src/components/q-city/QCityShell.tsx → [QMOIDashboard + 4 panels + 60+ components]
├── qalpha → src/components/qalpha/QAlphaShell.tsx
└── qvillage → src/components/qvillage/QVillageShell.tsx

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
- **QCity** uses comprehensive source-level dashboard with 66 specialized components
- **QAlpha** now has a source-level shell entry at `src/components/qalpha/QAlphaShell.tsx`. The shell no longer imports any `app/components/*` modules, meaning the QAlpha route is fully source-wired and the former app component dependency surface has been removed.
- **QVillage** now has a source-level shell entry at `src/components/qvillage/QVillageShell.tsx`
- All routes integrate with centralized auth, persistence, and logging
- Master role enables advanced features in QCity
- Role-based access controls gate premium features

## Complete Component Inventory (124 .tsx files + 15 .ts files)

### Q-City Components - 69 Files Total (66 .tsx + 3 .ts)

#### Core/Shell Components (3)
- `QCityShell.tsx` - Main entry point and app container
- `QMOIStateProvider.tsx` - State management provider
- `index.tsx` - Barrel export file

#### Dashboard Components (8) - REQUIRES CONSOLIDATION
- `QMOIDashboard.tsx` - Main dashboard display
- `Dashboard.tsx` - Secondary dashboard interface
- `EnhancedQMOIDashboard.tsx` - Enhanced dashboard with advanced features
- `QMoiDatabaseDashboard.tsx` - Database-centric dashboard
- `QMoiProjectDashboard.tsx` - Project-focused dashboard
- `ProductionRevenueDashboard.tsx` - Revenue tracking dashboard
- `EarningDashboard.tsx` - Earnings analytics dashboard
- `QNewsDashboard.tsx` - News aggregation dashboard

#### Control Panels (18)
- `QMoiKernelPanel.tsx` - Core kernel management + test file
- `QMoiMemoryPanel.tsx` - Memory management interface
- `AccountAutomationPanel.tsx` - Account automation controls
- `AuditLogPanel.tsx` - Audit logging interface
- `BackupRestorePanel.tsx` - Backup/restore operations
- `CommandPanel.tsx` - Command execution interface
- `DevicePanel.tsx` - Device management
- `DocumentManagerPanel.tsx` - Document management
- `HelpPanel.tsx` - Help system
- `LanguageLabPanel.tsx` - Language lab interface
- `MetricsPanel.tsx` - System metrics display
- `PluginPanel.tsx` - Plugin management
- `RelationshipInsightsPanel.tsx` - Relationship analytics
- `ResearchCenterPanel.tsx` - Research tools
- `SchedulePanel.tsx` - Task scheduling
- `SelfHealPanel.tsx` - Auto-healing controls
- `SessionPanel.tsx` - Session management
- `SettingsPanel.tsx` - Settings interface

#### Management Components (6)
- `DevicesHub.tsx` - Device management hub
- `AvatarSelector.tsx` - Avatar selection UI
- `QAvatar.tsx` - Avatar display component
- `MoodTracker.tsx` - Mood tracking interface
- `WalletManager.tsx` - Wallet management
- `QApiKeyManager.tsx` - API key management

#### AI/Automation/Core Systems (16)
- `AIAgentSystem.tsx` - AI agent orchestration
- `AIEconomySystem.tsx` - AI-driven economy
- `AutoHealingPlatform.tsx` - Automatic healing system
- `AutoMLEngine.tsx` - AutoML engine component
- `AutonomousDevelopmentPipeline.tsx` - Autonomous development
- `DistributedCompute.tsx` - Distributed computing
- `GlobalAIKnowledgeGraph.tsx` - Global knowledge graph
- `KnowledgeEngine.tsx` - Knowledge engine
- `ModelRegistry.tsx` - Model management registry
- `QMOIAutoFixDashboard.tsx` - Auto-fix dashboard
- `SelfTrainingEcosystem.tsx` - Self-training system
- `UnifiedAPI.tsx` - Unified API interface
- `SocialAutomationPanel.tsx` - Social automation
- `SystemHealthPanel.tsx` - System health monitoring
- `ZeroRatedPanel.tsx` - Zero-rate configuration
- `VoiceSelector.tsx` - Voice selection UI

#### File Management & Media (4)
- `QMoiFileEditorChat.tsx` - File editor with chat
- `QFileManager.tsx` - File management interface
- `QMoiMediaManager.tsx` - Media management
- `QOxygen.tsx` - Oxygen system interface

#### Additional Features (8)
- `QMoiState.tsx` - State management
- `QMoiToolbar.tsx` - Main toolbar
- `Onboarding.tsx` - Onboarding flow
- `AviatorGalleryPanel.tsx` - Avatar gallery
- `RoleBasedDashboard.tsx` - Role-based dashboard
- `QMoiStateContext.tsx` - Context provider
- `SocialAutomationPanel.tsx` - Social automation
- `ZeroRatedPanel.tsx` - Zero-rate panel

### QMOI Components - 8 Files (+ 1 .ts index)

#### Main Shells (2)
- `QMOIAIShell.tsx` - QMOI AI app entry point
- `QMOISpaceShell.tsx` - QMOI Space app entry point

#### Chat & Avatar (3)
- `QMOIChat.tsx` - AI chat interface
- `AvatarDisplay.tsx` - Avatar display
- `VoiceSelector.tsx` - Voice selection UI

#### Collaboration & Social (3)
- `ProjectManagement.tsx` - Project management system
- `FriendshipManagement.tsx` - Friendship system logic
- `FriendshipUI.tsx` - Friendship UI components

#### Config (1)
- `index.ts` - Barrel exports

### QAlpha Components - 2 Files Total (1 .tsx + 1 .ts)

- `QAlphaShell.tsx` - Alpha app entry point
- `index.ts` - Exports
- **Note:** QAlpha now uses a self-contained source shell with no live imports from `app/components/`.

### QVillage Components - 2 Files Total (1 .tsx + 1 .ts)

- `QVillageShell.tsx` - Village app entry point
- `index.ts` - Exports
- **Note:** Currently minimal; provides role-based access to village space

### Shared/Root Components (54 .tsx files)

**Dashboard & Analytics (4)**
- `GlobalOperationsDashboard.tsx`
- `RevenueAnalyticsDashboard.tsx`
- `UsageAnalytics.tsx`
- `TradingHistory.tsx`

**AI & Automation (6)**
- `ChatbotEnhanced.tsx`
- `Chatbot.tsx`
- `AutomationEngine.tsx`
- `FederatedLearningService.tsx`
- `PredictiveToolRecommender.tsx`
- `alpha-q-ai-system.tsx` - *LEGACY: Review for consolidation*

**System Management (5)**
- `ConsciousnessMonitoring.tsx`
- `GlobalHotkeyService.tsx`
- `VoiceGestureHooks.tsx`
- `GlobalNotificationCenter.tsx`
- `WindowTelemetryPanel.tsx`

**UI & Theme (5)**
- `AccessibilityAdjuster.tsx`
- `AdaptiveTheming.tsx`
- `theme-provider.tsx`
- `UISettings.tsx`
- `PrivacyModeToggle.tsx`

**Tools & Utilities (6)**
- `FileExplorer.tsx`
- `PluginRegistry.tsx`
- `DownloadQCity.tsx`
- `GitStatus.tsx`
- `AssetOverview.tsx`
- `release-notes.tsx`

**System Features (6)**
- `UniversalWindowManager.tsx`
- `SelfHealingWindows.tsx`
- `CollaborationLayer.tsx`
- `OfflineCacheService.tsx`
- `GlobalNotificationCenter.tsx`
- `WindowTelemetryPanel.tsx`

**Legacy/Deprecated Components (3) - REVIEW FOR REMOVAL**
- `QI.tsx`
- `QI_Enhanced.tsx`
- `FloatingAQ.tsx`

**Legacy Spaces (2) - REVIEW FOR CONSOLIDATION**
- `LcSpaces.tsx`
- `QiSpaces.tsx`

**Other (2)**
- `ComponentGallery.tsx`
- `FeedbackLoop.tsx`

**Styling (3)**
- `ChatbotEnhanced.css`
- `QI.css`
- `PreviewWindow.css`

### Master Components (2)
- `DomainStats.tsx` - Domain statistics display
- `DomainHealthTable.tsx` - Domain health check table

### Financial Components (1)
- `ProtectedFinancialFeatures.tsx` - Protected financial features

### UI Utilities (1)
- `use-toast.tsx` - Toast notification hook

---

## Component Statistics

| Category | Count | Notes |
|----------|-------|-------|
| **Q-City** | 63 | Largest system; contains dashboards, panels, AI systems, management tools |
| **QMOI** | 8 | AI chat + Space collaboration |
| **QAlpha** | 2 | Entry shell + minimal config |
| **QVillage** | 2 | Entry shell + exports |
| **Shared/Root** | 40+ | Dashboards, AI, system, UI, tools |
| **Master** | 2 | Domain monitoring |
| **Financial** | 1 | Protected trading features |
| **UI Utils** | 1 | Toast notifications |
| **TOTAL** | **131** | .tsx files across all directories |

---

## Consolidation Status & Recommendations

### ✅ COMPLETED (Phase 1)
- Removed `DevicePanel.tsx.ultra_backup` backup file
- Removed duplicate `production_STATUS.md` (kept proper casing)
- Removed legacy `src/pages/dashboard.tsx` (page router deprecated)

### ⏳ PENDING (Phase 2) - Consolidation
- **Dashboard Components**: 8 different dashboard implementations should be consolidated into `DashboardRegistry.tsx`
- **VoiceSelector**: 2 instances (q-city + qmoi) - should consolidate to shared version
- **Root Components**: 40+ root-level components need organizational restructure

### 🔴 REVIEW FOR DELETION (Phase 1+)
- `QI.tsx`, `QI_Enhanced.tsx` - Legacy AI systems
- `FloatingAQ.tsx` - Orphaned UI component
- `LcSpaces.tsx`, `QiSpaces.tsx` - Legacy space components
- `alpha-q-ai-system.tsx` - Orphaned AI system

---

## Core Services & Infrastructure (24 services)

| Service | File | Purpose |
|---------|------|---------|
| AI Request Router | `AIRequestRouter.ts` | Route AI requests |
| Auto Researcher | `AutoResearcher.ts` | Automated research |
| Consciousness Engine | `ConsciousnessIntegrationEngine.ts` | AI consciousness |
| Multi-User Session | `MultiUserSessionManager.ts` | Session management |
| Voice Recognition | `VoiceRecognitionService.ts` | Voice input |
| Face Recognition | `FaceRecognitionService.ts` | Facial recognition |
| Device Tracking | `DeviceTrackingService.ts` | Device management |
| Error Fixing | `EnhancedErrorFixingService.ts` | Auto error fixes |
| Parallelization | `EnhancedParallelizationService.ts` | Performance optimization |
| Memory Sync | `MemorySynchronizationEngine.ts` | Memory management |
| Revenue Automation | `EnhancedRevenueAutomationService.ts` | Revenue tracking |

---

## Core Libraries (55+)

**Key Libraries:**
- QMOI Core: qmoi-service.ts, qmoi-bootstrap.ts, qmoi-chat-service.ts, qmoi-user-system.ts
- Database: database.ts, database-auth.ts
- Auth: auth.ts, auth-middleware.ts, webauthn.ts
- Services: email-service.ts, domain-service.ts, voice-service.ts
- Real-time: realtime-system.ts, websocket support
- Cache: redis.ts, middleware support
- Storage: storage-adapter.ts, dataset-store.ts
- See ENDPOINTS.md for complete API route mapping

---

## API Routes (43 Active + 266 Legacy)

**Active Production Routes (src/app/api/):** 43 endpoint files
- Authentication: /api/auth/*
- QMOI Core: /api/qmoi/*
- QCity: /api/qcity/*
- QVillage: /api/qvillage/*
- Analytics: /api/analytics/*
- Master: /api/master/*

**See ENDPOINTS.md for complete endpoint documentation**

---

## Documentation References

- [QCITY_SETUP.md](QCITY_SETUP.md) - Comprehensive QCity documentation
- [ENDPOINTS.md](ENDPOINTS.md) - Complete API endpoint mapping
- [ROUTES.md](ROUTES.md) - Route file structure documentation
- [API.md](API.md) - API documentation and specifications
- [COMPREHENSIVE_IMPLEMENTATION_PLAN.md](COMPREHENSIVE_IMPLEMENTATION_PLAN.md) - Implementation roadmap
- No active route-specific backups remain for the app pages; canonical live pages are served from `app/`.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:30.126310Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 493
- words: 2440
- characters: 20418
- headings: 53
- links: 5
- images: 0
- tables: 24
- lion validation block: present
<!-- LION_VALIDATION_END -->
