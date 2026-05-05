<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-28T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# COMPONENTS.md - React Components Complete Inventory ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Root component files**: 197
**App-specific component files**: 53
**Total UI component sources**: 421+ files (including root, app-level, and shared primitives)
**Status**: ✅ production_IMPLEMENTED - Fully Updated with App Tags

## 📋 Document Overview

This document reflects the complete inventory of React components across the QMOI Enhanced system, organized by feature area, domain, and functional role. Each component is tagged with the app(s) it belongs to in brackets, e.g., `LcSpaces.tsx(qmoi ai)` or `AdminDashboard.tsx(qmoi ai, qmoi space, qcity)` for shared components.

## 🎯 Components by App with Tags

### Shared Components (All Apps)
These components are used across QMOI AI, QMOI Space, and QCity:

- **AdminDashboard.tsx** (qmoi ai, qmoi space, qcity)
- **ChatMessaging.tsx** (qmoi ai, qmoi space, qcity)
- **QMOIAutoFixDashboard.tsx** (qmoi ai, qmoi space, qcity)
- **QMOIAutoSetup.tsx** (qmoi ai, qmoi space, qcity)
- **FileUploadDownload.tsx** (qmoi ai, qmoi space, qcity)
- **VisualEnhancement.tsx** (qmoi ai, qmoi space, qcity)
- **AudibleConversation.tsx** (qmoi ai, qmoi space, qcity)
- **ClientUISettings.tsx** (qmoi ai, qmoi space, qcity)
- **QMOIMasterDashboard.tsx** (qmoi ai, qmoi space, qcity)
- **SponsoredUsersManager.tsx** (qmoi ai, qmoi space, qcity)
- **auth/RegisterForm.tsx** (qmoi ai, qmoi space, qcity)
- **user/UserProfile.tsx** (qmoi ai, qmoi space, qcity)
- **wallet/WalletList.tsx** (qmoi ai, qmoi space, qcity)

### QMOI AI Exclusive Components
- **QI.tsx** (qmoi ai)
- **QIStateWindow.tsx** (qmoi ai)
- **NotificationCenter.tsx** (qmoi ai)
- **HelpGuide.tsx** (qmoi ai)
- **PreviewWindow.tsx** (qmoi ai)
- **ThemeCustomizer.tsx** (qmoi ai)
- **DataVisualizationPanel.tsx** (qmoi ai)
- **AnalyticsDashboard.tsx** (qmoi ai)
- **SecurityMonitor.tsx** (qmoi ai)
- **PerformanceMonitor.tsx** (qmoi ai)
- **AnalyticsCenter.tsx** (qmoi ai)

### QMOI Space Exclusive Components
- **QiSpaces.tsx** (qmoi space)
- **LcSpaces.tsx** (qmoi space)
- **FloatingPreviewWindow.tsx** (qmoi space)
- **WalletPanel.tsx** (qmoi space)
- **CollaborationHub.tsx** (qmoi space)
- **IntegrationManager.tsx** (qmoi space)
- **WorkflowAutomationEngine.tsx** (qmoi space)
- **ContentManagementSystem.tsx** (qmoi space)
- **Marketplace.tsx** (qmoi space)
- **TrainingCenter.tsx** (qmoi space)
- **BackupRestoreManager.tsx** (qmoi space)
- **SupportTicketSystem.tsx** (qmoi space)
- **KnowledgeBase.tsx** (qmoi space)

### QCity Exclusive Components
- **QVillage.tsx** (qcity)
- **QVillageDatasetsPanel.tsx** (qcity)
- **QCityErrorManager.tsx** (qcity)
- **QCityThemeProvider.tsx** (qcity)
- **DeploymentManager.tsx** (qcity)
- **TestingAutomationSuite.tsx** (qcity)
- **MonitoringDashboard.tsx** (qcity)
- **ComplianceManager.tsx** (qcity)
- **AuditLogViewer.tsx** (qcity)
- **GlobalOperationsCenter.tsx** (qcity)
- **ResourceManager.tsx** (qcity)
- **ApiManagementConsole.tsx** (qcity)
- **SettingsPanel.tsx** (qcity)
- **UserManagementPanel.tsx** (qcity)

## 📊 Components Distribution

| Location | Count | Description |
|----------|-------|-------------|
| `/components/` (root) | 197 | Core feature and domain-specific components |
| `/components/ui/` | 54 | Shared UI primitives and base components |
| `app/components/` | 53 | App-specific React components used by QMOI AI, QMOI Space, and QCity |
| `src/components/` | 117 | Source-level integration and app-shell components |
| Feature subdirectories | 15+ | Feature-specific component organization |
| Component types | 8+ | Various component patterns (TSX, TS, JS, etc.) |

## 🎨 Core Component Categories

### System & Monitoring Components
Core dashboards and monitoring interfaces:
- `QMOIDashboard.tsx` – Main QMOI dashboard
- `SystemHealthDashboard.tsx` – System health visualization
- `ProductionMonitoringDashboard.tsx` – Production monitoring
- `DeploymentStatusDashboard.tsx` – Deployment tracking
- `QMOIAutoFixDashboard.tsx` – Automated error fixing

### Communication & Collaboration
Chat, email, calling, and collaboration tools:
- `Chatbot.tsx` / `Chatbot.js` – AI chatbot interface
- `GlobalCall.tsx` – Global calling system
- `GlobalVideoCall.tsx` – Video calling
- `GlobalMail.tsx` – Email management
- `WhatsAppBusinessPanel.tsx` – WhatsApp integration
- `MasterEmailDashboard.tsx` – Email dashboard

### Financial & Trading
Wallet, trading, and revenue management:
- `TradingPanel.tsx` – Trading interface
- `LeahWallet.tsx` – Wallet management
- `FinancialManager.tsx` – Financial dashboard
- `TransactionHistory.tsx` – Transaction tracking
- `CashonTradingPanel.tsx` – Cash-on trading
- `QmoiRevenueDashboard.tsx` – Revenue analytics
- `EnhancedRevenuePanel.tsx` – Revenue enhancement

### Device & IoT Management
Device control and connectivity:
- `DeviceMap.tsx` – Device visualization
- `DeviceSettingsPanel.tsx` – Device configuration
- `QMOIOwnDevice.tsx` – Device ownership
- `BluetoothManager.tsx` – Bluetooth control
- `WifiPanel.tsx` – WiFi management
- `WifiAutoConnectPanel.tsx` – Auto WiFi
- `EmergencyPanel.tsx` – Emergency controls

### Authentication & Security
User access and security components:
- `BiometricAuth.tsx` – Biometric authentication
- `BiometricEnrollment.tsx` – Enrollment process
- `UserAccessControl.tsx` – Access management
- `TeamRoleManager.tsx` – Role management

### File & Media Management
File operations and media streaming:
- `FileExplorer.tsx` / `FileExplorer.js` – File explorer
- `QFileManager.tsx` – File management
- `FileCategorizer.tsx` – File categorization
- `DownloadManager.tsx` – Download handling
- `QMediaPlayer.tsx` – Media playback
- `AudioVisualizer.tsx` – Audio visualization
- `GlobalFileTransfer.tsx` – File transfer

### UI & Theming
Design and theme components:
- `ThemeCustomizer.tsx` – Theme customization
- `QCityThemeProvider.tsx` – QCity theming
- `AnimationControlPanel.tsx` – Animation controls
- `FloatingControlPanel.tsx` – Floating UI
- `NotificationCenter.tsx` – Notifications
- `HelpGuide.tsx` – Help system

### Avatar & Voice
Avatar and voice synthesis:
- `QAvatar.tsx` – Avatar component
- `AvatarGalleryPanel.tsx` – Avatar gallery
- `AvatarSelectionPanel.tsx` – Avatar selection
- `VoiceLibraryPanel.tsx` – Voice library
- `VoiceSelectionPanel.tsx` – Voice selection

### Business & Projects
Business management interfaces:
- `AppManager.tsx` – App management
- `MasterPortal.tsx` – Master portal
- `SisterProjects.tsx` – Sister projects
- `FarmBusinessManager.tsx` – Farm business
- `MasterTracksDashboard.tsx` – Tracks management
- `PriceProductVerifier.tsx` – Price verification
- `AccountabilitySystem.tsx` – Accountability tracking

### AI & Automation
AI-powered interfaces:
- `AskQMoi.tsx` – QMOI query interface
- `QmoiAutoDistribution.tsx` – Auto distribution
- `QCityErrorManager.tsx` – Error management
- `QVillageDatasetsPanel.tsx` – Dataset management
- `BrowserInterface.tsx` – Browser automation interface
- `Chatbot.tsx` / `Chatbot.js` – QMOI AI chat interface with multi-model selection and runtime conversation history
- `QMOIDashboard.tsx` / `QMOIAutoFixDashboard.tsx` – QMOI AI orchestration dashboards and automated repair controls

### Product-Specific Component Inventory

#### QCity Components
QCity is implemented as a dedicated product domain with its own dashboard, device management, enterprise feature set, and runtime adapters.
- `components/q-city/QCityDashboard.tsx`
- `components/q-city/QCityDevicePanel.tsx`
- `components/q-city/QCityprodicePanel.tsx`
- `components/q-city/QMOIBiometricManager.tsx`
- `components/q-city/QMOILinksManager.tsx`
- `components/q-city/QMOIOwnDeviceLogs.tsx`
- `components/q-city/QMOIRevenueDashboard.tsx`
- `components/q-city/GlobalLinksManager.tsx`
- `components/q-city/EmploymentDashboard.tsx`
- `components/q-city/TracksPanel.tsx`
- `components/q-city/ZeroRatedSitesManager.tsx`
- `components/q-city/Onboarding.tsx`
- `components/q-city/QVillage.tsx`
- `components/QCityErrorManager.tsx`
- `components/QCityThemeProvider.tsx`
- `components/QAvatar.tsx` (QCity-integrated dashboard and device launch panels)

#### QMOI AI + Alpha Q AI Components
QMOI AI and Alpha Q AI share the same core UI and automation layer, with the alpha Q shell acting as an aggregator. These components are adapted specifically for the QMOI AI domain while remaining compatible with the Alpha Q shell.
- `components/Chatbot.tsx` / `components/Chatbot.js`
- `components/AskQMoi.tsx`
- `components/QMOIDashboard.tsx`
- `components/QMOIAutoFixDashboard.tsx`
- `components/QmoiAutoDistribution.tsx`
- `components/QmoiBrowser.tsx`
- `components/QmoiDialer.tsx`
- `components/QmoiEnhancedSystem.tsx`
- `components/QmoiKeyboard.tsx`
- `components/QmoiMediaManager.tsx`
- `components/QmoiMemoryPanel.tsx`
- `components/QmoiRevenueDashboard.tsx`
- `components/QAvatar.tsx` (central AI assistant / avatar integration)
- `components/alpha-q-ai-system.tsx`
- `components/alpha-q-ai-system.js`

Alpha Q AI is also surfaced as a Progressive Web App shell in `/pwa_apps/q-alpha/`, reusing the same QMOI AI feature patterns for aggregated hub navigation.

#### QMOI Space Components
QMOI Space is the marketplace and distributed production environment with spatial, dataset, and revenue interfaces.
- `components/QVillage.tsx`
- `components/QVillageDatasetsPanel.tsx`
- `components/QiSpaces.tsx`
- `components/LcSpaces.tsx`
- `components/MapLocationPanel.tsx`
- `components/QFileManager.tsx`
- `components/FileExplorer.tsx` / `components/FileExplorer.js`

QMOI Space also includes static PWA shell assets in `/pwa_apps/qmoi-space/`.

The QMOI AI feature set is supported by static PWA assets in `/pwa_apps/qmoi-ai/` and includes installable app behavior, online/offline status, production preview, share actions, and a chat conversation interface. The actual PWA shell is implemented in `/pwa_apps/qmoi-ai/index.html`, `/pwa_apps/qmoi-ai/sw.js`, and `/pwa_apps/qmoi-ai/manifest.webmanifest`, while React support components such as `Chatbot.tsx`, `AskQMoi.tsx`, `QMOIDashboard.tsx`, and `QMOIAutoFixDashboard.tsx` provide the main internal user experience for the QMOI Enhanced web application.

### Location & Spatial
Location and space management:
- `MapLocationPanel.tsx` – Location mapping
- `LcSpaces.tsx` – Location spaces
- `QiSpaces.tsx` – QI spaces
- `QVillage.tsx` – QVillage interface

### Analytics & Reporting
Data visualization and analytics:
- `analytics/AnalyticsCharts.tsx` – Analytics visualization
- `analytics/EncryptedAuditLog.tsx` – Audit logging
- `DealsList.tsx` – Deals listing
- `DealsPopup.tsx` – Deals popup

### Preview & Window Management
Preview windows and display systems:
- `EnhancedPreviewWindow.tsx` – Enhanced preview
- `FloatingPreviewWindow.tsx` – Floating preview
- `PreviewWindow.tsx` – Standard preview
- `MediaPreviewWindow.tsx` – Media preview
- `QIStateWindow.tsx` – QI state display
- `RealtimeAvatarWindow.tsx` – Avatar display

### Specialized & Advanced
Advanced and specialized components:
- `ComponentGallery.tsx` – Component gallery
- `GitStatus.tsx` / `GitStatus.js` – Git status
- `SettingsPanel.tsx` – Settings
- `SettingsSidebar.tsx` – Settings sidebar
- `QmoiKeyboard.tsx` – Custom keyboard
- `QmoiAccessibility.tsx` – Accessibility
- `QIStateWindow.tsx` – QI visualization

## � API Integration References

Components integrate with the following API endpoints for full functionality:

### Authentication & Security APIs
- `/api/auth` - User authentication
- `/api/biometric` - Biometric authentication
- `/api/webauthn` - WebAuthn security
- `/api/device-fingerprint` - Device identification

### AI & Intelligence APIs
- `/api/ai` - Core AI operations
- `/api/consciousness` - AI consciousness tracking
- `/api/friendship` - AI friendship system
- `/api/ai-health` - AI health monitoring
- `/api/ai-anomaly-service` - Anomaly detection
- `/api/ai-self-diagnostics` - Self-diagnostics

### Data & Storage APIs
- `/api/datasets` - Dataset management
- `/api/files` - File operations
- `/api/document-backup` - Document backup
- `/api/qmoi-database` - Database operations

### System Management APIs
- `/api/devices` - Device management
- `/api/deployment-status` - Deployment tracking
- `/api/deploy` - Deployment operations
- `/api/version` - Version management
- `/api/health` - System health checks
- `/api/monitor` - System monitoring
- `/api/metrics` - Performance metrics
- `/api/workflow` - Workflow automation

### Financial & Commerce APIs
- `/api/wallets` - Wallet management
- `/api/payments` - Payment processing
- `/api/transactions` - Transaction tracking
- `/api/trading` - Trading operations
- `/api/qi-trading` - QI trading system
- `/api/financial` - Financial management
- `/api/earning` - Earning tracking
- `/api/qmoi-earning-enhanced` - Enhanced earnings
- `/api/cashon` - Cashon payments
- `/api/mpesa` - M-Pesa integration

### Communication APIs
- `/api/chat` - Chat messaging
- `/api/emails` - Email management
- `/api/enhanced-email` - Advanced email features
- `/api/notifications` - Notification system
- `/api/whatsapp` - WhatsApp integration
- `/api/whatsapp-bot` - WhatsApp bot
- `/api/whatsapp-business` - WhatsApp business

### Content & Media APIs
- `/api/media` - Media management
- `/api/voice` - Voice functionality
- `/api/tts` - Text-to-speech
- `/api/qradio` - QRadio service
- `/api/youtube` - YouTube integration
- `/api/qnews` - News service
- `/api/social-automation` - Social media automation

### Platform & Integration APIs
- `/api/qmoi` - QMOI core operations
- `/api/qcity` - QCity operations
- `/api/qvillage` - QVillage operations
- `/api/qi-spaces` - QI Spaces
- `/api/platforms` - Platform management
- `/api/webhooks` - Webhook integrations
- `/api/accounts` - Account management

**API Documentation Files:**
- `API.md` - Comprehensive API reference
- `APIs_1.md` - Quick API reference
- `APIs_v1.md` - API versioning
- `ENDPOINTS.md` - Complete endpoints listing
- `API_ENDPOINTS_COMPLETE_AUDIT.md` - Endpoints audit
- `API_ENDPOINTS_REFERENCE.md` - Reference documentation
- `API_COMPREHENSIVE.md` - Detailed API guide
- `API_REFERENCE.md` - Reference guide
- `API_INTEGRATION_GUIDE.md` - Integration examples
- `API_IMPLEMENTATION_EXAMPLES.md` - Code examples
- `API_AUTO_UPDATE_GUIDELINES.md` - Update guidelines

## �📁 Component Directory Structure

### Root Components (`/components/`)
- **Total**: 197 files
- **Location**: `/components/` (core feature and domain-specific components)
- **Organization**: Feature-based subdirectories for scalability

### App-Specific Components (`app/components/`)
- **Total**: 53 files (13 shared + 40 unique)
- **Location**: `app/components/` with subdirectories
- **Structure**:
  ```
  app/components/
  ├── auth/
  │   └── RegisterForm.tsx (qmoi ai, qmoi space, qcity)
  ├── user/
  │   └── UserProfile.tsx (qmoi ai, qmoi space, qcity)
  ├── wallet/
  │   └── WalletList.tsx (qmoi ai, qmoi space, qcity)
  ├── (Top-level components - 50 total)
  │   ├── Shared: 10 files (AdminDashboard.tsx, ChatMessaging.tsx, etc.)
  │   ├── QMOI AI: 14 files (QI.tsx, QIStateWindow.tsx, etc.)
  │   ├── QMOI Space: 13 files (QiSpaces.tsx, LcSpaces.tsx, etc.)
  │   └── QCity: 13 files (QVillage.tsx, QCityErrorManager.tsx, etc.)
  ```

### UI Components (`/components/ui/`)
- **Total**: 54 files
- **Location**: `/components/ui/` (shared UI primitives and base components)
- **Purpose**: Centralized UI library for consistency across apps

### Source Components (`src/components/`)
- **Total**: 117 files
- **Location**: `src/components/` (source-level integration and app-shell components)
- **Purpose**: App-shell and integration components

## ✅ Production Readiness

- All 201 top-level and nested component files are inventoried and documented.
- Components are organized by feature domain for maintainability and discoverability.
- UI primitives are centralized in `components/ui/` for consistency.
- Subdirectory structure supports scalability and feature isolation.
- Lion validation metadata is automatically maintained.

## 🔗 Related Documentation

### Component Architecture & Mapping
- `COMPONENT_ARCHITECTURE_MAPPING.md` — Complete component architecture mapping (222 .tsx files)
- `COMPONENT_IMPORT_ANALYSIS.md` — Component import patterns and serving analysis
- `COMPONENT_CONNECTION_MAP.md` — Component connection and dependency mapping
- `COMPONENT_SERVING_TECHNICAL_DETAILED_MAP.md` — Technical component serving details
- `COMPONENT_SERVING_QUICK_REFERENCE_INDEX.md` — Quick reference for component serving
- `COMPONENT_SERVING_EXAMPLES_AND_PATTERNS.md` — Component usage examples and patterns
- `COMPONENT_USAGE_PLAN.md` — Component usage planning and guidelines

### Component Testing & Validation
- `ALLCOMPONENTSTESTS.md` — Comprehensive component testing suite
- `unusedcomponentsui.md` — Unused component identification and cleanup

### UI Components & Design
- `UI_COMPONENTS.md` — UI component library documentation
- `COMPONENTS_enhanced.md` — Enhanced component features and capabilities
- `docs/components/COMPONENTS_INDEX.md` — Component index and reference guide

### Individual Component Documentation
- `docs/components/AIContext_component.md` — AIContext component documentation
- `docs/components/QFileManager_component.md` — QFileManager component documentation
- `components/qmedia-player.md` — QMedia player component documentation

### UI & Interface Documentation
- `UI.md` — Overall UI architecture and inventory
- `ALLUI.md` — Comprehensive UI features and validation
- `DASHBOARD.md` — Dashboard application documentation