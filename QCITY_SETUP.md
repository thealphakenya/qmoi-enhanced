---
quantum-enabled: false
---

# QCity Command Center Setup & Documentation

## Overview
QCity is the unified master control hub for QMOI ecosystem operations. It provides comprehensive access to all system features, device management, metrics, automation, and plugins.

## Architecture

### Entry Point
- **Route**: `/qcity`
- **File**: [app/qcity/page.tsx](app/qcity/page.tsx)
- **Type**: Client component (`"use client"`)

### Core Components
The QCity page integrates multiple specialized panels from `src/components/q-city/`:

#### 1. Dashboard Tab
- **Component**: [QMOIDashboard](src/components/q-city/QMOIDashboard.tsx)
- **Purpose**: Master-level system overview
- **Features**:
  - Current system status
  - Health indicators
  - QMOI mind state
  - Project overview

#### 2. Devices Tab
- **Component**: [DevicesHub](src/components/q-city/DevicesHub.tsx)
- **Purpose**: Connected device management
- **Features**:
  - Device discovery
  - Connection status
  - Device configuration
  - Hardware monitoring

#### 3. Metrics Tab
- **Component**: [MetricsPanel](src/components/q-city/MetricsPanel.tsx)
- **Purpose**: Real-time system metrics
- **Features**:
  - Performance statistics
  - Resource usage
  - API metrics
  - Custom dashboards

#### 4. Schedule Tab
- **Component**: [SchedulePanel](src/components/q-city/SchedulePanel.tsx)
- **Purpose**: Task scheduling & automation
- **Features**:
  - Schedule creation
  - Automated workflows
  - Cron job management
  - Trigger configuration

#### 5. Plugins Tab
- **Component**: [PluginPanel](src/components/q-city/PluginPanel.tsx)
- **Purpose**: Plugin & extension management
- **Features**:
  - Plugin marketplace
  - Install/uninstall
  - Configuration
  - Version management

## Full Component Library

QCity has access to 60+ specialized components in `src/components/q-city/`:

### Core Dashboards
- `QMOIDashboard` - Master control dashboard
- `EnhancedQMOIDashboard` - Advanced dashboard features
- `QMoiDatabaseDashboard` - Database operations
- `QMoiProjectDashboard` - Project tracking
- `EarningDashboard` - Revenue & earnings
- `ProductionRevenueDashboard` - Production metrics
- `QNewsDashboard` - News & alerts
- `RoleBasedDashboard` - Role-specific views

### Control Panels
- `QMoiKernelPanel` - Core system control
- `QMoiMemoryPanel` - Memory management
- `QMoiToolbar` - Quick access toolbar
- `QMoiFileEditorChat` - File editing interface
- `QMoiMediaManager` - Media file management
- `QMoiSettingsPanel` - System configuration
- `QMoiAutoDevPanel` - Automated development

### System & Automation
- `AccountAutomationPanel` - User account automation
- `SocialAutomationPanel` - Social interactions
- `DevicesHub` - Device management hub
- `DevicePanel` - Individual device control
- `SystemHealthPanel` - System health monitoring
- `SelfTrainingEcosystem` - Self-learning systems
- `SelfHealPanel` - Auto-healing features

### Management & Tools
- `MetricsPanel` - Real-time metrics
- `SchedulePanel` - Task scheduling
- `PluginPanel` - Plugin management
- `SessionPanel` - Session tracking
- `HelpPanel` - Help & documentation
- `QApiKeyManager` - API key management
- `DocumentManagerPanel` - Document management
- `QFileManager` - File management
- `WalletManager` - Wallet & payment management

### AI & Intelligence
- `AIEconomySystem` - AI economic model
- `AIAgentSystem` - AI agent management
- `AutoMLEngine` - Automated ML pipeline
- `KnowledgeEngine` - Knowledge base
- `GlobalAIKnowledgeGraph` - Global knowledge graph
- `AutonomousDevelopmentPipeline` - Self-developing systems

### UI & Experience
- `AvatarSelector` - Avatar customization
- `VoiceSelector` - Voice preferences
- `MoodTracker` - Mood & sentiment
- `CommandPanel` - Command interface
- `Onboarding` - Onboarding wizard

### Specialized Features
- `UnifiedAPI` - Unified API interface
- `AutoHealingPlatform` - Self-healing systems
- `RelationshipInsightsPanel` - Relationship analytics
- `ResearchCenterPanel` - Research tools
- `LanguageLabPanel` - Language experiments
- `BackupRestorePanel` - Data backup/restore
- `AuditLogPanel` - Audit logging

## Authentication & Access Control

### Auth Integration
- Uses `@/app/hooks/useAuth` hook
- Supports role-based access (user, master, sister)
- Integrates with `@/app/lib/auth/persistence` for user storage
- Logs auth events via `@/app/lib/auth/memory`

### Login & Registration
- `LoginForm` - User login interface
- `RegisterForm` - New user registration
- Master role upgrade available
- QVillage access for authorized users

### Permissions
- Master-only features indicated with 🔐 icon
- Master upgrade button available for regular users
- QVillage link only shows with proper access
- QMOI Space link for collaborative features

## Navigation & Quick Links

### Header Navigation
```
QCity Hub (Master Control Center)
├── 🔐 Upgrade to Master (if not master role)
├── 🏘️ Open QVillage (if qvillage_access granted)
├── 🚀 QMOI Space (if qmoi_space_access granted)
└── 🤖 QMOI AI (always available)
```

### Tab Navigation
- Dashboard (default)
- Devices
- Metrics
- Schedule
- Plugins

## Logging & Monitoring

### Log Integration
- Uses `@/lib/logger` for all operations
- Logs login/logout events with source tracking
- Error logging for failed operations
- Auth event tracking for audit trail

## Dependencies

### Core Dependencies
- React 18+
- Next.js 14+ (App Router)
- @/app/hooks/useAuth
- @/app/lib/auth/persistence
- @/app/lib/auth/memory
- @/lib/logger

### Component Dependencies
- src/components/q-city/* (60+ components)
- components/auth/LoginForm
- components/auth/RegisterForm

### UI Dependencies
- @/components/ui/* (card, badge, etc.)
- Tailwind CSS
- Slate color scheme (slate-950, slate-900, etc.)

## Features Enabled by QCity

### Master-Only Features
1. QCity Hub access (role: master)
2. Full system control
3. Device management
4. Automation configuration
5. Plugin management
6. QVillage access (with special access flag)

### User Features
1. Dashboard view (read-only)
2. Basic metrics viewing
3. Account automation
4. Social features
5. Profile customization

## Quick Setup Checklist

- [x] App route configured: `/qcity` → `app/qcity/page.tsx`
- [x] Authentication integration (useAuth hook)
- [x] Core components imported & available
- [x] Tabbed interface with 5 major sections
- [x] Navigation to sibling routes (QMOI AI, QMOI Space, QVillage)
- [x] Master role detection & upgrade
- [x] Logging & event tracking
- [x] Responsive design (mobile-friendly)
- [x] Dark theme (slate-950/slate-900)

## File Structure

```
app/
└── qcity/
    ├── page.tsx          (Main entry point)
    ├── page.tsx.bak      (Backup)
    └── layout.tsx        (Optional - inherits from app layout)

src/components/q-city/
├── QMOIDashboard.tsx     (Master dashboard)
├── DevicesHub.tsx        (Device management)
├── MetricsPanel.tsx      (System metrics)
├── SchedulePanel.tsx     (Automation)
├── PluginPanel.tsx       (Plugin management)
├── ... (55+ additional components)
└── index.ts              (Comprehensive exports)
```

## Related Routes

- `/qmoi-ai` - AI Assistant & Chat
- `/qmoi-space` - Collaborative workspace
- `/qvillage` - Master village (master-only)
- `/qalpha` - Advanced learning platform

## Future Enhancements

Potential additions for QCity:
- Custom dashboard layouts
- Widget reordering
- Real-time notifications
- Advanced search
- Custom reporting
- Integration marketplace
- Mobile app sync
- Dark mode toggle (currently dark)

## Troubleshooting

### Login Issues
- Ensure `useAuth` hook is properly initialized
- Check auth persistence in localStorage/sessionStorage
- Verify user role in browser DevTools

### Component Not Rendering
- Check if component exists in `src/components/q-city/`
- Verify component is exported in `index.ts`
- Check console for import errors

### Permission Denied
- Verify user role (check DevTools → localStorage)
- Request master upgrade for master-only features
- Check if special access flags are set (qvillage_access, qmoi_space_access)

## Support

For issues or questions about QCity setup, refer to:
- Component documentation in individual files
- Auth documentation in `app/lib/auth/`
- Logger documentation in `lib/logger.ts`

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-28T19:36:38.934463Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 305
- words: 1150
- characters: 8702
- headings: 44
- links: 6
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
