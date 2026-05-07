<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-04-28T12:00:00.000000Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# UI.md - QMOI Enhanced UI Inventory & Architecture ✅ production_IMPLEMENTED

**Last Updated:** 2026-04-28T12:00:00.000000Z
**Total UI Files Detected:** 324
**Status:** ✅ production_IMPLEMENTED

## 📋 Document Overview

This document captures the current UI component landscape across QMOI Enhanced, including core React components, shared UI primitives, source-level component libraries, and the integrated dashboard application.

## 📊 UI Architecture Summary

| Location | Component Count | Description |
|----------|-----------------|-------------|
| `app/components/` | 53 | App-specific React components used by QMOI AI, QMOI Space, and QCity |
| `components/` | 197 | Root-level feature and domain components for QMOI core and shared functionality |
| `components/ui/` | 54 | Base UI primitives, form controls, overlays, and accessibility components |
| `src/components/` | 117 | Source-level integration and app-shell components used by the main app and services |
| `/dashboard/` | 5 | Dashboard application assets and frontend entry points |
| Total unique UI-related files | 421+ | Current inventory of distinct UI artifacts across the codebase |

## 🎨 Core Component Inventory

The UI stack is organized into three main layers:

1. **Core application components** (`components/` and `app/components/`): domain-specific dashboards, automation interfaces, collaboration systems, communication tools, financial and device management panels, and QMOI integration surfaces.
2. **Base UI primitives** (`components/ui/`): reusable form fields, dialog systems, navigation components, data display widgets, and accessibility helpers.
3. **Source-level UI integration** (`src/components/`): app shell components, adaptive theming, collaborative services, global UI utilities, and embedding logic.

## 🎯 UI Features by App with Tags

### Shared UI Features (All Apps)
These UI components and features are available across QMOI AI, QMOI Space, and QCity:

- **AdminDashboard.tsx** (qmoi ai, qmoi space, qcity) - Administrative control panel
- **ChatMessaging.tsx** (qmoi ai, qmoi space, qcity) - Real-time messaging interface
- **QMOIAutoFixDashboard.tsx** (qmoi ai, qmoi space, qcity) - Automated error resolution
- **QMOIAutoSetup.tsx** (qmoi ai, qmoi space, qcity) - Automated system configuration
- **FileUploadDownload.tsx** (qmoi ai, qmoi space, qcity) - File management interface
- **VisualEnhancement.tsx** (qmoi ai, qmoi space, qcity) - Visual processing tools
- **AudibleConversation.tsx** (qmoi ai, qmoi space, qcity) - Voice communication
- **ClientUISettings.tsx** (qmoi ai, qmoi space, qcity) - User interface preferences
- **QMOIMasterDashboard.tsx** (qmoi ai, qmoi space, qcity) - Master system dashboard
- **SponsoredUsersManager.tsx** (qmoi ai, qmoi space, qcity) - User sponsorship management
- **auth/RegisterForm.tsx** (qmoi ai, qmoi space, qcity) - User registration
- **user/UserProfile.tsx** (qmoi ai, qmoi space, qcity) - User profile management
- **wallet/WalletList.tsx** (qmoi ai, qmoi space, qcity) - Cryptocurrency wallet interface

### QMOI AI Exclusive UI Features
- **QI.tsx** (qmoi ai) - QI Intelligence System interface
- **QIStateWindow.tsx** (qmoi ai) - QI State management window
- **NotificationCenter.tsx** (qmoi ai) - System notifications and alerts
- **HelpGuide.tsx** (qmoi ai) - Comprehensive help and guidance system
- **PreviewWindow.tsx** (qmoi ai) - Preview content in dynamic overlay
- **ThemeCustomizer.tsx** (qmoi ai) - UI personalization and theme customization
- **DataVisualizationPanel.tsx** (qmoi ai) - Interactive charts and data visualization
- **AnalyticsDashboard.tsx** (qmoi ai) - Analytics reporting interface
- **SecurityMonitor.tsx** (qmoi ai) - Real-time security monitoring
- **PerformanceMonitor.tsx** (qmoi ai) - System performance metrics
- **AnalyticsCenter.tsx** (qmoi ai) - Advanced analytics and business intelligence

### QMOI Space Exclusive UI Features
- **QiSpaces.tsx** (qmoi space) - QI Spaces collaborative environment
- **LcSpaces.tsx** (qmoi space) - LC Spaces management interface
- **FloatingPreviewWindow.tsx** (qmoi space) - Dynamic preview overlay
- **WalletPanel.tsx** (qmoi space) - Cryptocurrency wallet management
- **CollaborationHub.tsx** (qmoi space) - Team collaboration and communication tools
- **IntegrationManager.tsx** (qmoi space) - Third-party service integrations
- **WorkflowAutomationEngine.tsx** (qmoi space) - Workflow automation tools
- **ContentManagementSystem.tsx** (qmoi space) - Content creation and publishing
- **Marketplace.tsx** (qmoi space) - Digital marketplace for plugins/templates
- **TrainingCenter.tsx** (qmoi space) - Educational resources and training
- **BackupRestoreManager.tsx** (qmoi space) - Data backup and restoration
- **SupportTicketSystem.tsx** (qmoi space) - Customer support management
- **KnowledgeBase.tsx** (qmoi space) - Documentation and knowledge management

### QCity Exclusive UI Features
- **QVillage.tsx** (qcity) - QVillage community hub
- **QVillageDatasetsPanel.tsx** (qcity) - Dataset management interface
- **QCityErrorManager.tsx** (qcity) - Error handling and management
- **QCityThemeProvider.tsx** (qcity) - Theme configuration and application
- **DeploymentManager.tsx** (qcity) - Application deployment and release management
- **TestingAutomationSuite.tsx** (qcity) - Automated testing framework
- **MonitoringDashboard.tsx** (qcity) - Real-time system monitoring
- **ComplianceManager.tsx** (qcity) - Regulatory compliance monitoring
- **AuditLogViewer.tsx** (qcity) - System activity audit logs
- **GlobalOperationsCenter.tsx** (qcity) - Worldwide operations management
- **ResourceManager.tsx** (qcity) - System resource management
- **ApiManagementConsole.tsx** (qcity) - API endpoint management
- **SettingsPanel.tsx** (qcity) - System configuration and preferences
- **UserManagementPanel.tsx** (qcity) - User account management

## 🔧 UI Directory Breakdown

### Core React Components (`/components/`)

The main `components/` directory includes feature-specific UI artifacts such as:

- AI and automation dashboards
- communication and chat interfaces
- wallet and financial management panels
- device integration and connectivity components
- project and business management UIs
- system health, monitoring, and production controls
- QMOI-specific interfaces and intelligence visualizers

### Shared UI Primitives (`/components/ui/`)

The shared UI primitive library provides the building blocks for interactive UX patterns:

- Buttons, inputs, checkboxes, radios, selects, switches, sliders
- Dialogs, drawers, popovers, tooltips, alerts, notifications
- Tables, charts, calendars, progress indicators, badges
- Layout primitives like cards, sheets, sidebars, separators, scroll areas
- Accessibility utilities, mobile helpers, skeleton loaders, and responsive systems

### Source-Level Components (`/src/components/`)

Source-level UI files focus on application integration, utilities, and advanced interface orchestration:

- App shell and entry components
- Adaptive theming and customization
- Global notifications and hotkeys
- Offline cache and telemetry panels
- Collaboration and feedback overlays
### Progressive Web Apps (`/pwa_apps/`)

The repository also includes static Progressive Web App entrypoints for QMOI:
- `/pwa_apps/qmoi-ai/` — QMOI AI PWA shell implemented in static HTML with `manifest.webmanifest`, `sw.js`, install prompt hooks, online/offline status, chat interface, production preview workflow, and runtime share actions.
- `/pwa_apps/qmoi-space/` — QMOI Space PWA with platform statistics, production/gaming/revenue actions, install support, and cloud integration hints.
- `/pwa_apps/q-alpha/` — Alpha Q aggregator shell that unifies QMOI AI, QMOI Space, and QCity into a single installable hub experience.

### Product UI Features

#### QCity UI
QCity is the enterprise management interface for device orchestration, unlimited build/test workflows, networked resource control, and global QMOI integration.
- Enterprise dashboard and device management UI
- QCity service panel with unlimited resources and QCity command launches
- Onboarding flow for QCity device setup and mastery
- QCity theme provider and error management overlays
- Tracks, employment, and zero-rated site controls
- Root entrypoints: `/qcity-dashboard.html`, `/qcity-enterprise.html`, `/qcity-complete.html`, `/public/manifest-qcity.json`

#### QMOI AI UI
QMOI AI is the intelligent assistant layer, including chat, auto-fix workflows, remote AI orchestration, and installable web app behavior. QMOI AI and QMOI Space share the same underlying UI feature set, but each product adapts those features to its own domain and workflows.
- Chatbot interface with multi-model selection and conversation history
- Ask QMOI query flows and AI knowledge navigation
- Auto-fix and production monitoring dashboards
- Avatar-assisted task launcher and system health overlays
- Shared UI primitives for theme control, notifications, dialogs, and offline detection
- Root entrypoints: `/qmoi-ai.html`, `/qmoi-ai-live.html`, `/public/manifest-qmoi-ai.json`

#### Alpha Q AI UI
Alpha Q AI is the aggregator shell that reuses the QMOI AI component stack while exposing multi-app navigation for QCity and QMOI Space.
- Hub navigation between QMOI AI, QMOI Space, and QCity
- Unified install prompt and PWA experience
- Shared UI features identical to QMOI AI
- Shell: `/pwa_apps/q-alpha/index.html`, `/public/manifest-q-alpha.json`

#### QMOI Space UI
QMOI Space is the distributed marketplace and production environment with spatial, financial, and cloud-integrated interfaces. QMOI Space shares the same core UI features as QMOI AI, but adapts the experience for marketplace, revenue, and spatial workflows.
- Marketplace browsing, sales, and revenue management UI
- Production/gaming feature cards and revenue generation actions
- Spatial dashboards and distributed memory sync
- Installable PWA shell with web manifest and service worker support
- Entrypoint: `/qmoi-space.html`, `/public/manifest-qmoi-space.json`

The QMOI AI UI is backed by React components in `/components/` such as `Chatbot.tsx`, `AskQMoi.tsx`, `QMOIDashboard.tsx`, and `QMOIAutoFixDashboard.tsx`, while the PWA shell provides the installable web app entrypoint.

## 🔌 API Integration References

UI components integrate with the following API endpoints for full functionality:

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

## 📁 Dashboard Application (`/dashboard/`) 

The dashboard application is a separate package contained in `/dashboard/` and includes the following structure:

- `package.json` — dashboard app dependencies and scripts
- `vite.config.js` — build configuration
- `server.js` — app server entry point
- `src/App.jsx` — dashboard React root component
- `src/index.js` — dashboard app bootstrap

This app supports a lightweight frontend experience for the QMOI dashboard and can be run independently.

## ✅ Production Readiness

- The UI inventory is synchronized with the current source directories.
- All shared UI primitives and component sets are documented for architecture review.
- Future updates should refresh counts when new UI files are added or legacy components are removed.
- Maintain consistent theming, accessibility support, and keyboard navigation across the UI layer.

## 🔗 Related Documentation

- `UI_COMPONENTS.md` — component-level inventory for `/components/ui/`
- `ALLUI.md` — comprehensive UI features, roles, and validation summary
- `DASHBOARD.md` — dashboard application directory documentation
- `COMPONENTS.md` — overall React components inventory