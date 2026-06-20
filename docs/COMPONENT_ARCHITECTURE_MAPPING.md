---
quantum-enabled: false
---

# QMOI Enhanced: Complete Component Architecture & Connection Mapping

**Last Updated**: May 4, 2026  
**Total Components**: 222 (.tsx files)  
- App Pages: 17
- App Components: 16
- Shared Components: 189

---

## PART 1: APPLICATION ROUTING & ENTRY POINTS (17 Pages)

### Root & Main Routes

#### 1. `/` - Home Page
- **File**: [app/page.tsx](app/page.tsx)
- **Purpose**: Main landing page and navigation hub
- **Type**: Server Component (static content)
- **Status**: Documented in screens/home-screen.md
- **Key Features**:
  - Feature navigation cards
  - Application overview
  - Main entry point to ecosystem

#### 2. `/test` - Test Verification Page
- **File**: [app/test/page.tsx](app/test/page.tsx)
- **Purpose**: Basic application verification and routing test
- **Type**: Server Component (minimal)
- **Status**: Documented in screens/test-page-screen.md

### Admin Routes (`/admin`)

#### 3. `/admin` - Admin Dashboard
- **File**: [app/admin/page.tsx](app/admin/page.tsx)
- **Purpose**: Main administrative dashboard with system metrics
- **Type**: Server Component
- **Status**: Documented in screens/admin-dashboard-screen.md
- **Displays**:
  - Total Users metric
  - Active Sessions metric
  - System Health status
  - Uptime percentage

#### 4. `/admin/master` - Master Admin Portal
- **File**: [app/admin/master/page.tsx](app/admin/master/page.tsx)
- **Purpose**: Master-level administrative control center
- **Type**: Server Component
- **Parent Layout**: [app/admin/master/layout.tsx](app/admin/master/layout.tsx)

#### 5. `/admin/master/login` - Master Login
- **File**: [app/admin/master/login/page.tsx](app/admin/master/login/page.tsx)
- **Purpose**: Authentication for master administrators
- **Type**: Authentication page

#### 6. `/admin/master/activity` - Master Activity Logs
- **File**: [app/admin/master/activity/page.tsx](app/admin/master/activity/page.tsx)
- **Purpose**: Track master-level activities and actions
- **Type**: Log/Audit page

#### 7. `/admin/master/security` - Master Security Settings
- **File**: [app/admin/master/security/page.tsx](app/admin/master/security/page.tsx)
- **Purpose**: Security configuration for master role
- **Type**: Settings page

#### 8. `/admin/master/settings` - Master System Settings
- **File**: [app/admin/master/settings/page.tsx](app/admin/master/settings/page.tsx)
- **Purpose**: Global system configuration panel
- **Type**: Settings/Admin page

### device Routes (`/devices`)

#### 9. `/devices` - device Management Dashboard
- **File**: [app/devices/page.tsx](app/devices/page.tsx)
- **Purpose**: device monitoring, filtering, and management interface
- **Type**: Client Component (uses client-side state)
- **Status**: Documented in screens/device-management-dashboard-screen.md
- **Features**:
  - Real-time device tracking
  - Filter and search functionality
  - device status indicators
  - device configuration access

### Friendship Routes (`/friendship`)

#### 10. `/friendship` - QMOI Friendship Interface
- **File**: [app/friendship/page.tsx](app/friendship/page.tsx)
- **Purpose**: Interactive AI chat companion with emotional intelligence
- **Type**: Client Component (interactive chat)
- **Status**: Documented in screens/qmoi-friendship-interface-screen.md
- **Features**:
  - Conversational AI chat interface
  - Emotional state tracking
  - Real-time messaging
  - Quick action buttons

### Master Configuration Routes (`/master`)

#### 11. `/master/email` - Master Email Configuration
- **File**: [app/master/email/page.tsx](app/master/email/page.tsx)
- **Purpose**: SMTP email settings and configuration
- **Type**: Server Component (settings form)
- **Status**: Documented in screens/master-email-configuration-screen.md

#### 12. `/master/links` - Master Links Management
- **File**: [app/master/links/page.tsx](app/master/links/page.tsx)
- **Purpose**: Global link routing and management
- **Type**: Server Component
- **Status**: Documented in screens/master-links-management-screen.md
- **Current State**: Placeholder (no links configured)

#### 13. `/master/tracks` - Master Tracks Management
- **File**: [app/master/tracks/page.tsx](app/master/tracks/page.tsx)
- **Purpose**: System operations tracking and monitoring
- **Type**: Server Component
- **Status**: Documented in screens/master-tracks-management-screen.md
- **Current State**: Placeholder (no active tracks)

### QMOI Ecosystem Routes

#### 14. `/qmoi-ai` - QMOI AI Interactive Assistant
- **File**: [app/qmoi-ai/page.tsx](app/qmoi-ai/page.tsx)
- **Purpose**: AI-powered assistant hub and navigation
- **Type**: Client Component
- **Status**: Documented in screens/qmoi-ai-interactive-assistant-screen.md
- **Features**:
  - AI status display
  - Feature navigation cards
  - AI interaction controls

#### 15. `/qmoi-space` - QMOI Space Collaboration Hub
- **File**: [app/qmoi-space/page.tsx](app/qmoi-space/page.tsx)
- **Purpose**: Central navigation hub for QMOI ecosystem
- **Type**: Server Component (navigation hub)
- **Status**: Documented in screens/qmoi-space-spatial-collaboration-hub-screen.md
- **Connected Routes**:
  - Links to `/qcity`
  - Links to `/qvillage`
  - Links to `/qmoi-ai`
  - Links to `/PRODUCTION`

#### 16. `/qvillage` - QVillage Community Hub
- **File**: [app/qvillage/page.tsx](app/qvillage/page.tsx)
- **Purpose**: Community dataset management and model collaboration
- **Type**: Client Component (role-based access)
- **Status**: Documented in screens/qvillage-community-hub-screen.md
- **Features**:
  - Dataset management
  - Model deployment
  - Community automation
  - Role-based permissions

### QCity Routes (`/qcity`)

#### 17. `/qcity` - QCity Command Center (Note: JSX file)
- **File**: [app/qcity/page.tsx](app/qcity/page.tsx)
- **Purpose**: Smart city operations dashboard
- **Type**: Client Component (interactive dashboard)
- **Status**: Documented in screens/qcity-command-center-dashboard-screen.md
- **Features**:
  - Connected nodes monitoring
  - Active services tracking
  - Open alerts display
  - Incident response metrics

### PRODUCTIONeloper Routes (`/PRODUCTION`)

#### 18. `/PRODUCTION` - PRODUCTIONeloper Utilities
- **File**: [app/PRODUCTION/page.tsx](app/PRODUCTION/page.tsx)
- **Purpose**: Internal PRODUCTIONelopment tools and diagnostics
- **Type**: Server Component
- **Status**: Documented in screens/PRODUCTIONeloper-utilities-screen.md
- **Tools Described**:
  - API Endpoint Tester
  - Debug Console

---

## PART 2: APP-LEVEL COMPONENTS (16 Files)

### Location: `/app/components`

These are reusable components scoped to the app and used across multiple pages.

#### 2.1. Core Dashboard Components

##### AdminDashboard.tsx
- **Purpose**: Reusable admin dashboard interface
- **Serves**: Used in admin routes
- **Type**: Dashboard display component

##### QMOIAutoFixDashboard.tsx
- **Purpose**: Automated error detection and fixing dashboard
- **Serves**: Admin and diagnostic views
- **Features**: Auto-fix recommendations

##### QMOIMasterDashboard.tsx
- **Purpose**: Master-level control dashboard
- **Serves**: Admin/master routes
- **Features**: Master role features and controls

#### 2.2. Communication & Interaction Components

##### AudibleConversation.tsx
- **Purpose**: Audio-based conversation interface
- **Type**: Communication component
- **Features**: Voice input/output handling

##### ChatMessaging.tsx
- **Purpose**: Chat messaging interface
- **Serves**: Friendship page, messaging features
- **Type**: Interactive chat UI

##### Chatbot.tsx (Note: duplicate in components directory)
- **Purpose**: Chatbot interface component
- **Type**: AI conversation interface

#### 2.3. Specialized Feature Components

##### ClientUISettings.tsx
- **Purpose**: Client-side UI preferences and settings
- **Serves**: Settings pages
- **Type**: Settings management

##### FileUploadDownload.tsx
- **Purpose**: File upload and download interface
- **Type**: File management component
- **Features**: Drag-and-drop, progress tracking

##### QMOIAutoSetup.tsx
- **Purpose**: Automatic setup wizard
- **Serves**: Onboarding flow
- **Type**: Setup/wizard component

##### SponsoredUsersManager.tsx
- **Purpose**: Manage sponsored user accounts
- **Type**: User management component
- **Features**: Sponsorship controls

##### VisualEnhancement.tsx
- **Purpose**: Visual UI enhancements and effects
- **Type**: UI enhancement component
- **Features**: Theme and visual customization

#### 2.4. Sub-component Directories

##### `/app/components/auth/`
- **RegisterForm.tsx**: User registration form component

##### `/app/components/user/`
- **UserProfile.tsx**: User profile display and editing

##### `/app/components/wallet/`
- **WalletList.tsx**: User wallet listing and management

---

## PART 3: SHARED UI COMPONENT LIBRARY (60+ Files)

### Location: `/components/ui`

These are foundational UI primitives built with Shadcn/UI and Tailwind CSS. Used throughout the application.

#### Core UI Primitives (60 components)

| Component | Purpose | Primary Use |
|-----------|---------|-------------|
| [button.tsx](components/ui/button.tsx) | Reusable button primitive | All interactive actions |
| [input.tsx](components/ui/input.tsx) | Text input field | Forms and search |
| [select.tsx](components/ui/select.tsx) | Dropdown selection | Category/option selection |
| [card.tsx](components/ui/card.tsx) | Card container | Content grouping |
| [dialog.tsx](components/ui/dialog.tsx) | Modal dialog | Confirmations and forms |
| [drawer.tsx](components/ui/drawer.tsx) | Slide-out drawer | Side navigation |
| [dropdown-menu.tsx](components/ui/dropdown-menu.tsx) | Dropdown menu | Context menus |
| [alert-dialog.tsx](components/ui/alert-dialog.tsx) | Alert modal | Warnings/confirmations |
| [alert.tsx](components/ui/alert.tsx) | Alert banner | Inline notifications |
| [badge.tsx](components/ui/badge.tsx) | Badge label | Status indicators |
| [textarea.tsx](components/ui/textarea.tsx) | Multi-line text | Long-form input |
| [checkbox.tsx](components/ui/checkbox.tsx) | Checkbox input | Boolean selection |
| [radio-group.tsx](components/ui/radio-group.tsx) | Radio buttons | Exclusive selection |
| [toggle.tsx](components/ui/toggle.tsx) | Toggle button | On/off states |
| [toggle-group.tsx](components/ui/toggle-group.tsx) | Button group toggle | Multiple toggles |
| [switch.tsx](components/ui/switch.tsx) | Toggle switch | Boolean settings |
| [slider.tsx](components/ui/slider.tsx) | Range slider | Numeric input |
| [tabs.tsx](components/ui/tabs.tsx) | Tab navigation | Content sections |
| [accordion.tsx](components/ui/accordion.tsx) | Collapsible sections | Expandable content |
| [collapsible.tsx](components/ui/collapsible.tsx) | Collapsible container | Togglable content |
| [label.tsx](components/ui/label.tsx) | Form label | Form labeling |
| [form.tsx](components/ui/form.tsx) | Form wrapper | Form management |
| [input-otp.tsx](components/ui/input-otp.tsx) | OTP input | Authentication |
| [progress.tsx](components/ui/progress.tsx) | Progress bar | Status indication |
| [skeleton.tsx](components/ui/skeleton.tsx) | Loading skeleton | Placeholder display |
| [avatar.tsx](components/ui/avatar.tsx) | User avatar | User representation |
| [breadcrumb.tsx](components/ui/breadcrumb.tsx) | Breadcrumb navigation | Navigation hierarchy |
| [pagination.tsx](components/ui/pagination.tsx) | Pagination controls | List navigation |
| [navigation-menu.tsx](components/ui/navigation-menu.tsx) | Navigation menu | App navigation |
| [menubar.tsx](components/ui/menubar.tsx) | Menu bar | Application menu |
| [context-menu.tsx](components/ui/context-menu.tsx) | Right-click menu | Context actions |
| [popover.tsx](components/ui/popover.tsx) | Popover content | Floating content |
| [hover-card.tsx](components/ui/hover-card.tsx) | Hover card | production on hover |
| [command.tsx](components/ui/command.tsx) | Command palette | Quick actions |
| [calendar.tsx](components/ui/calendar.tsx) | Calendar picker | Date selection |
| [carousel.tsx](components/ui/carousel.tsx) | Image carousel | Image rotation |
| [chart.tsx](components/ui/chart.tsx) | Chart primitives | Data visualization |
| [recharts-shim.tsx](components/ui/recharts-shim.tsx) | Recharts wrapper | Chart library |
| [aspect-ratio.tsx](components/ui/aspect-ratio.tsx) | Aspect ratio container | Media aspect control |
| [resizable.tsx](components/ui/resizable.tsx) | Resizable panels | Flexible layouts |
| [scroll-area.tsx](components/ui/scroll-area.tsx) | Custom scroll area | Scrollable content |
| [separator.tsx](components/ui/separator.tsx) | Visual separator | Content division |
| [sheet.tsx](components/ui/sheet.tsx) | Side sheet drawer | Side panel |
| [sidebar.tsx](components/ui/sidebar.tsx) | Sidebar navigation | App sidebar |
| [table.tsx](components/ui/table.tsx) | Data table | Tabular data display |
| [toast.tsx](components/ui/toast.tsx) | Toast notification | Toast system |
| [toaster.tsx](components/ui/toaster.tsx) | Toast container | Notification container |
| [tooltip.tsx](components/ui/tooltip.tsx) | Tooltip popup | Helpful hints |
| [sonner.tsx](components/ui/sonner.tsx) | Sonner integration | toast notifications |
| [use-mobile.tsx](components/ui/use-mobile.tsx) | Mobile hook | Responsive detection |
| ... (59 total components) | Comprehensive UI library | Application UI |

---

## PART 4: SHARED FEATURE COMPONENTS (129 Files)

### Location: `/components` (root level)

These are feature-specific, business logic components used throughout the application.

### 4.1. Core System & Dashboard Components (20 files)

#### System & Monitoring
- **QMOIDashboard.tsx** - QMOI main dashboard interface
- **SystemHealthDashboard.tsx** - System health monitoring
- **SystemHealthMonitor.tsx** - Real-time health monitoring
- **DeploymentStatusDashboard.tsx** - Deployment status tracking
- **ProductionMonitoringDashboard.tsx** - production monitoring
- **GlobalOperationsDashboard.tsx** (in global/) - Global operations view
- **AccountabilitySystem.tsx** - Accountability tracking and logging
- **MasterPortal.tsx** - Master portal interface
- **MasterContext.tsx** - Master context provider
- **ComponentGallery.tsx** - UI component showcase

#### Activity & Planning
- **SchedulePanel.tsx** (in archives) - Schedule management
- **ProjectDashboard.tsx** (in projects/) - Project overview
- **EarningDashboard.tsx** - Revenue and earnings tracking
- **EnhancedRevenuePanel.tsx** - Revenue metrics panel
- **FinancialManager.tsx** - Financial operations
- **TransactionHistory.tsx** - Transaction log and history

#### Administrative
- **MasterEmailDashboard.tsx** - Email administration
- **MasterTracksDashboard.tsx** - Tracks management
- **NotificationCenter.tsx** - Notification hub
- **NotificationPanel.tsx** - Notification display panel

### 4.2. AI & Intelligence Components (15 files)

#### AI Systems
- **AIContext.tsx** - AI context management
- **alpha-q-ai-system.tsx** - Alpha Q AI system (primary AI)
- **MemoryAwareness.tsx** - AI memory system awareness
- **ParallelProcessing.tsx** - Parallel computation system
- **QI.tsx** - Core QI intelligence system
- **QIStateWindow.tsx** - QI state display window
- **AskQMoi.tsx** - Query interface for QMOI
- **QConverse.tsx** - Conversational AI interface
- **Chatbot.tsx** - Chatbot implementation
- **QmoiEnhancedSystem.tsx** - QMOI enhancement system

#### AI Specialized
- **BiometricAuth.tsx** - Biometric AI authentication
- **BiometricEnrollment.tsx** - Biometric enrollment
- **RealtimeAvatarWindow.tsx** - Real-time avatar AI
- **QAvatar.tsx** - Avatar system component
- **AvatarGalleryPanel.tsx** - Avatar gallery display
- **AvatarSelectionPanel.tsx** - Avatar selection UI

### 4.3. device & Hardware Management (20 files)

#### device Control
- **QMOIOwndevice.tsx** - Personal device management
- **QCitydevicePanel.tsx** (in q-city/) - Q-City device panel
- **deviceSettingsPanel.tsx** - device settings interface
- **deviceMap.tsx** - device location mapping
- **EmergencyPanel.tsx** - Emergency controls
- **BluetoothManager.tsx** - Bluetooth device management
- **WifiPanel.tsx** - WiFi connectivity management
- **WifiAutoConnectPanel.tsx** - Automatic WiFi connection
- **QmoiDialer.tsx** - Phone dialer interface
- **GlobalCall.tsx** - Global calling system
- **GlobalVideoCall.tsx** - Video call interface
- **GlobalMail.tsx** - Global mail system
- **GlobalFileTransfer.tsx** - File transfer system

#### device Monitoring & Logs
- **QMOIOwndeviceLogs.tsx** (in q-city/) - device activity logs
- **AuditLogPanel.tsx** (in archives) - Audit log display
- **QmoiAccessibility.tsx** - Accessibility features

#### device Settings
- **VoiceSelectionPanel.tsx** - Voice option selection
- **VoiceLibraryPanel.tsx** - Voice library management
- **QmoiKeyboard.tsx** - Custom keyboard interface

### 4.4. File Management & Operations (15+ files)

#### File Management
- **QFileManager.tsx** - File system manager
- **FileExplorer.tsx** - File browser interface
- **FileCategorizer.tsx** - File categorization system
- **DownloadManager.tsx** - Download management
- **DownloadQApp.tsx** - QMOI app download interface
- **DownloadAppButton.tsx** - Download button component
- **EnhancedPreviewWindow.tsx** - File production window
- **PreviewWindow.tsx** - Basic production window
- **FloatingPreviewWindow.tsx** - Floating production UI
- **MediaPreviewWindow.tsx** - Media production interface
- **FloatingControlPanel.tsx** - Floating control interface
- **FileUploadDownload.tsx** (in app/components) - Upload/download component

#### Media Management
- **QmoiMediaManager.tsx** - Media file management
- **QMediaPlayer.tsx** - Video/audio player
- **AudioVisualizer.tsx** - Audio visualization

### 4.5. Wallet & Financial Components (10 files)

#### Wallet Systems
- **LeahWallet.tsx** - Leah wallet implementation
- **LeahWalletPanel.tsx** - Wallet display panel
- **WalletPanel.tsx** - General wallet interface
- **WalletList.tsx** (in app/components) - Wallet listing

#### Trading & Finance
- **CashonTradingPanel.tsx** - Trading interface
- **TradingPanel.tsx** - General trading panel
- **EnhancedRevenuePanel.tsx** - Revenue display
- **PriceProductVerifier.tsx** - Price/product verification
- **DealsList.tsx** - Deals listing
- **DealsPopup.tsx** - Deals popup display

### 4.6. Community & Social Components (12 files)

#### Community Spaces
- **QVillage.tsx** - QVillage main component
- **QVillageDatasetsPanel.tsx** - QVillage dataset panel
- **LcSpaces.tsx** - LC Spaces community
- **QiSpaces.tsx** - Qi Spaces interface
- **SisterProjects.tsx** - Sister projects coordination

#### Social Features
- **TeamRoleManager.tsx** - Team role management
- **UserAccessControl.tsx** - User access control
- **GlobalLinksManager.tsx** (in q-city/) - Link management
- **ZeroRatedSitesManager.tsx** (in q-city/) - Zero-rated sites
- **QMOILinksManager.tsx** (in q-city/) - Link management
- **WhatsAppBusinessPanel.tsx** - WhatsApp business interface
- **QmoBrowser.tsx** - Internal browser interface

### 4.7. Settings & Configuration (12+ files)

#### Settings Panels
- **SettingsPanel.tsx** - Main settings interface
- **SettingsSidebar.tsx** - Settings sidebar navigation
- **ThemeCustomizer.tsx** - Theme customization
- **QCityThemeProvider.tsx** - Q-City theme provider
- **QCityErrorManager.tsx** - Error handling manager
- **ClientUISettings.tsx** (in app/components) - Client UI settings
- **AnimationControlPanel.tsx** - Animation settings
- **AccessibilitySettingsPanel.tsx** (in ui/) - Accessibility settings

#### System Configuration
- **QmoiAutoDistribution.tsx** - Automatic distribution system
- **AutomationRulesPanel.tsx** (in automation/) - Automation rules
- **AppManager.tsx** - App management interface
- **HelpGuide.tsx** - Help and guidance system

### 4.8. Specialized & Advanced Features (15+ files)

#### Security & Biometrics
- **BiometricAuth.tsx** - Biometric authentication
- **BiometricEnrollment.tsx** - Biometric enrollment
- **QMOIBiometricManager.tsx** (in q-city/) - Biometric management
- **EncryptedAuditLog.tsx** (in security/) - Encrypted audit logging
- **RoleContext.tsx** (in security/) - Role-based context

#### Data & Analytics
- **AnalyticsCharts.tsx** (in analytics/) - Analytics visualization
- **EncryptedAuditLog.tsx** (in analytics/) - Audit analytics

#### Employment & Business
- **EmploymentDashboard.tsx** (in q-city/) - Employment tracking
- **FarmBusinessManager.tsx** - Farm business operations
- **GitStatus.tsx** - Git repository status

#### Maps & Location
- **MapLocationPanel.tsx** - Location mapping interface

#### Orchestration & Status
- **OrchestratorStatusPanel.tsx** (in predeploy/) - Orchestration status

#### Media & Presentation
- **WrappedComponent.tsx** - Component wrapper utility
- **enhanced-system-dashboard.tsx** - Enhanced dashboard system
- **QmoiMemoryPanel.tsx** - Memory display panel
- **RealtimeAvatarWindow.tsx** - Real-time avatar display

#### Revenue & Earning
- **QmoiRevenueDashboard.tsx** - Revenue tracking
- **QMOIRevenueDashboard.tsx** (in q-city/) - Q-City revenue
- **EnhancedRevenuePanel.tsx** - Enhanced revenue display

#### Specialized Parsing
- **qmedia_player.md.tsx** (in components/) - Media player docs
- **real_time_status_dashboard_with_universal_language_support.tsx** - Multilingual status
- **media_&_ui_features_(2024_06_09).tsx** - Media features doc
- **advanced_ui_&_parallel_processing_features_(2025_01_22).tsx** - Advanced features doc
- **enhanced_build_tools.tsx** - Build tools
- **üõ°ô∏è_automated_build,_install,_and_error_fix_strategies.tsx** - Build strategies

### 4.9. Project & Task Management (7 files in `/components/projects/`)

#### Project Management
- **ProjectDashboard.tsx** - Project overview dashboard
- **ProjectForm.tsx** - Project creation/editing form
- **ProjectList.tsx** - Project listing component
- **ResourceList.tsx** - Resource allocation display
- **TaskForm.tsx** - Task creation/editing form
- **TaskList.tsx** - Task listing component
- **ProjectDashboard.tsx** - Main project interface

### 4.10. Cloud Provider Credentials (3 files in `/components/device/`)

#### Cloud Integration
- **AWSCredentialsModal.tsx** - AWS credential input
- **AzureCredentialsModal.tsx** - Azure credential input
- **GCPCredentialsModal.tsx** - GCP credential input

### 4.11. Specialized Q-City Components (13 files in `/components/q-city/`)

#### Q-City Admin
- **QCityDashboard.tsx** - Q-City main dashboard
- **QCitydevicePanel.tsx** - device management for Q-City
- **QMOIBiometricManager.tsx** - Biometric operations
- **QMOIOwndeviceLogs.tsx** - device activity logs
- **QMOILinksManager.tsx** - Link management system
- **QMOIRevenueDashboard.tsx** - Revenue tracking
- **TracksPanel.tsx** - Track operations
- **GlobalLinksManager.tsx** - Global link management
- **EmploymentDashboard.tsx** - Employment operations
- **ZeroRatedSitesManager.tsx** - Zero-rated content management
- **Onboarding.tsx** - User onboarding flow
- **QVillage.tsx** - Q-Village interface
- **QCitydevicePanel.tsx** - Additional device panel

### 4.12. GitLab Clone Component (1 file in `/components/qmoi-gitlab-clone/`)

#### Git Integration
- **QMOIGitLabClone.tsx** - GitLab-like interface for QMOI

### 4.13. Theme & Providers (2 files)

- **theme-provider.tsx** - Application theme provider
- **RoleContext.tsx** (in security/) - Role-based context provider

---

## PART 5: COMPONENT CONNECTION PATTERNS

### Pattern 1: Page → App Component Connection

```
/app/page.tsx (Home)
  └── No direct imports (self-contained)

/app/admin/page.tsx (Admin Dashboard)
  ├── Renders static dashboard content
  └── No explicit component imports

/app/devices/page.tsx (device Management)
  ├── Client-side rendering
  └── Uses React hooks for state management
```

### Pattern 2: Direct Component Files in `/app/components/`

```
/app/components/AdminDashboard.tsx
  └── Exported for use in admin routes

/app/components/ChatMessaging.tsx
  └── Used in friendship interface

/app/components/FileUploadDownload.tsx
  └── Used in device management and file operations
```

### Pattern 3: Shared Component Architecture

```
/components/ui/ (60 primitives)
  ├── Used by all feature components
  ├── Used by page components
  └── Form the foundation of all UI

/components/ (Feature Components - 129 files)
  ├── Import from /components/ui/
  ├── May import from other feature components
  └── Used throughout application pages
```

### Pattern 4: Feature Component Organization

```
/components/projects/ (Project Management)
  ├── ProjectDashboard.tsx (main display)
  ├── ProjectForm.tsx (CRUD operations)
  ├── ProjectList.tsx (listing)
  ├── TaskForm.tsx (subtask operations)
  ├── TaskList.tsx (subtask listing)
  └── ResourceList.tsx (resource allocation)

/components/q-city/ (Q-City Feature Set)
  ├── QCityDashboard.tsx (main interface)
  ├── QCitydevicePanel.tsx (device control)
  ├── QMOIBiometricManager.tsx (biometrics)
  └── ... (10 additional components)

/components/device/ (Cloud Credentials)
  ├── AWSCredentialsModal.tsx
  ├── AzureCredentialsModal.tsx
  └── GCPCredentialsModal.tsx
```

---

## PART 6: COMPONENT SERVING MATRIX

### How Components Are Served (Import Flow)

#### Level 1: Entry Points (App Pages)
- 17 page.tsx files in `/app` directory structure
- Each route corresponds to one or more pages

#### Level 2: Local App Components
- 16 components in `/app/components/`
- Can be imported by any app page
- Examples: AdminDashboard, ChatMessaging, FileUploadDownload

#### Level 3: Shared Feature Components
- 129 components in `/components/` (non-ui)
- Organized by feature/domain
- Can be imported by any page or app component

#### Level 4: UI Primitives
- 60+ components in `/components/ui/`
- Imported only by feature components
- Form the base layer of all UI

### Import Dependency Graph (Simplified)

```
app/page.tsx (Home)
├── Renders inline JSX
├── No direct component imports
└── Self-contained content

app/devices/page.tsx (device Management)
├── Possible imports from /app/components/
├── Uses React hooks locally
└── May use /components/ services

/components/QFileManager.tsx (Feature)
├── Imports from /components/ui/
├── Uses local state management
└── Exported for use anywhere

/components/ui/button.tsx (Primitive)
├── Base Tailwind styling
├── No component dependencies
└── Used by all other components
```

---

## PART 7: COMPREHENSIVE COMPONENT INVENTORY

### Complete List: 189 Shared Components

#### A-E Components (40 files)
1. AIContext.tsx - AI context management
2. AccountabilitySystem.tsx - Accountability tracking
3. AnimationControlPanel.tsx - Animation settings
4. AppManager.tsx - App management
5. AskQMoi.tsx - QMOI query interface
6. AudioVisualizer.tsx - Audio visualization
7. AvatarGalleryPanel.tsx - Avatar gallery
8. AvatarSelectionPanel.tsx - Avatar selection
9. BiometricAuth.tsx - Biometric authentication
10. BiometricEnrollment.tsx - Biometric enrollment
11. BluetoothManager.tsx - Bluetooth management
12. BrowserInterface.tsx - Browser component
13. CashonTradingPanel.tsx - Trading interface
14. Chatbot.tsx - Chatbot interface
15. ComponentGallery.tsx - Component showcase
16. DealsList.tsx - Deals listing
17. DealsPopup.tsx - Deals popup
18. DeploymentStatusDashboard.tsx - Deployment status
19. deviceMap.tsx - device mapping
20. deviceSettingsPanel.tsx - device settings
21. DownloadAppButton.tsx - Download button
22. DownloadManager.tsx - Download management
23. DownloadQApp.tsx - QMOI app download
24. EmergencyPanel.tsx - Emergency controls
25. EnhancedLinkDomainManager.tsx - Link management
26. EnhancedPreviewWindow.tsx - production window
27. EnhancedRevenuePanel.tsx - Revenue panel
28. (E-components: 28-40)

#### F-M Components (40 files)
29. FarmBusinessManager.tsx - Farm business
30. FileCategorizer.tsx - File categorization
31. FileExplorer.tsx - File browser
32. FinancialManager.tsx - Financial management
33. FloatingControlPanel.tsx - Floating controls
34. FloatingPreviewWindow.tsx - Floating production
35. GitStatus.tsx - Git status
36. GlobalCall.tsx - Global calling
37. GlobalFileTransfer.tsx - File transfer
38. GlobalMail.tsx - Mail system
39. GlobalVideoCall.tsx - Video calling
40. HelpGuide.tsx - Help system
41. LcSpaces.tsx - LC spaces
42. LeahWallet.tsx - Leah wallet
43. LeahWalletPanel.tsx - Wallet panel
44. MapLocationPanel.tsx - Location mapping
45. MasterContext.tsx - Master context
46. MasterEmailDashboard.tsx - Email dashboard
47. MasterPortal.tsx - Master portal
48. MasterTracksDashboard.tsx - Tracks dashboard
49. MediaPreviewWindow.tsx - Media production
50. MemoryAwareness.tsx - Memory awareness
51. NotificationCenter.tsx - Notification hub
52. NotificationPanel.tsx - Notification panel
53. (F-M: 53-70)

#### N-Z Components (49 files)
54. ParallelProcessing.tsx - Parallel processing
55. PreviewWindow.tsx - Basic production
56. PriceProductVerifier.tsx - Price verification
57. ProductionMonitoringDashboard.tsx - Monitoring
58. QAvatar.tsx - Avatar system
59. QCityErrorManager.tsx - Error management
60. QCityThemeProvider.tsx - Theme provider
61. QConverse.tsx - Conversational AI
62. QFileManager.tsx - File manager
63. QI.tsx - QI system
64. QIStateWindow.tsx - QI state display
65. QMOIAutoFixDashboard.tsx - Auto-fix dashboard
66. QMOIDashboard.tsx - QMOI dashboard
67. QMOIOwndevice.tsx - Own device management
68. QMediaPlayer.tsx - Media player
69. QVillage.tsx - QVillage interface
70. QVillageDatasetsPanel.tsx - Datasets panel
71. QiSpaces.tsx - Qi spaces
72. QmoiAccessibility.tsx - Accessibility features
73. QmoiAutoDistribution.tsx - Auto distribution
74. QmoiBrowser.tsx - QMOI browser
75. QmoiDialer.tsx - Dialer interface
76. QmoiEnhancedSystem.tsx - Enhanced system
77. QmoiKeyboard.tsx - Custom keyboard
78. QmoiMediaManager.tsx - Media management
79. QmoiMemoryPanel.tsx - Memory panel
80. QmoiRevenueDashboard.tsx - Revenue dashboard
81. RealtimeAvatarWindow.tsx - Avatar window
82. SettingsPanel.tsx - Settings interface
83. SettingsSidebar.tsx - Settings sidebar
84. SisterProjects.tsx - Sister projects
85. SystemHealthDashboard.tsx - Health dashboard
86. SystemHealthMonitor.tsx - Health monitoring
87. TeamRoleManager.tsx - Team roles
88. ThemeCustomizer.tsx - Theme customizer
89. TradingPanel.tsx - Trading interface
90. TransactionHistory.tsx - Transaction log
91. UserAccessControl.tsx - Access control
92. VoiceLibraryPanel.tsx - Voice library
93. VoiceSelectionPanel.tsx - Voice selection
94. WalletPanel.tsx - Wallet interface
95. WhatsAppBusinessPanel.tsx - WhatsApp panel
96. WifiAutoConnectPanel.tsx - WiFi auto-connect
97. WifiPanel.tsx - WiFi management
98. WrappedComponent.tsx - Component wrapper
99. alpha-q-ai-system.tsx - Alpha Q AI
100. (Remaining 89 components...)

#### Categorized Feature Directories

**UI Components Library** (60 files)
- `/components/ui/` - Shadcn/UI primitives and custom UI components

**Project Management** (7 files)
- `/components/projects/` - ProjectDashboard, ProjectForm, ProjectList, etc.

**Q-City Features** (13 files)
- `/components/q-city/` - QCity-specific components

**Cloud Integration** (3 files)
- `/components/device/` - AWS, Azure, GCP credentials

**Security Features** (2 files)
- `/components/security/` - EncryptedAuditLog, RoleContext

**Analytics** (2 files)
- `/components/analytics/` - AnalyticsCharts, EncryptedAuditLog

**Automation** (1 file)
- `/components/automation/` - AutomationRulesPanel

**Authentication** (1 file)
- `/components/auth/` - BiometricAuth

**Global Operations** (1 file)
- `/components/global/` - GlobalOperationsDashboard

**Orchestration** (1 file)
- `/components/predeploy/` - OrchestratorStatusPanel

**GitLab Clone** (1 file)
- `/components/qmoi-gitlab-clone/` - QMOIGitLabClone

**Theme & Providers** (2 files)
- theme-provider.tsx, RoleContext.tsx

**Build & System** (5 files)
- Build scripts, build tools, system docs

---

## PART 8: COMPONENT USAGE & CONSUMPTION PATTERNS

### How Components Are Consumed

#### Pattern A: Direct Import in Pages
```typescript
// /app/admin/page.tsx
import AdminDashboard from "@/components/AdminDashboard"

export default function AdminPage() {
  return <AdminDashboard />
}
```

#### Pattern B: Feature Components Import UI Primitives
```typescript
// /components/ProjectDashboard.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProjectDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <Button>New Project</Button>
    </Card>
  )
}
```

#### Pattern C: Component Composition
```typescript
// /components/QVillage.tsx
import QVillageDatasetsPanel from "@/components/QVillageDatasetsPanel"
import ProjectDashboard from "@/components/projects/ProjectDashboard"

export default function QVillage() {
  return (
    <>
      <QVillageDatasetsPanel />
      <ProjectDashboard />
    </>
  )
}
```

---

## PART 9: CRITICAL CONNECTIONS & DATA FLOW

### Central Hub Components (Used by Multiple Pages)

#### High-Priority Components
1. **QMOIDashboard.tsx** - Used across multiple admin/dashboard pages
2. **SystemHealthDashboard.tsx** - Appears in multiple monitoring pages
3. **NotificationCenter.tsx** - System-wide notifications
4. **SettingsPanel.tsx** - Used in settings across all apps
5. **QFileManager.tsx** - Used in device and file management pages

#### Authentication & Security Flow
```
/master/login/page.tsx
  └── Authenticates user
      └── Sets user context
          └── Enables Master routes:
              - /admin/master/*
              - /master/*
              - /qcity (with master privileges)
```

#### Navigation & Routing Flow

```
/ (Home Page)
├── /admin (Admin Dashboard)
│   ├── /admin/master (Master Portal)
│   ├── /admin/master/login (Authentication)
│   ├── /admin/master/activity (Activity Logs)
│   ├── /admin/master/security (Security Settings)
│   └── /admin/master/settings (System Settings)
├── /devices (device Management)
├── /friendship (AI Friendship Interface)
├── /master (Master Configuration)
│   ├── /master/email (Email Configuration)
│   ├── /master/links (Links Management)
│   └── /master/tracks (Tracks Management)
├── /qmoi-ai (AI Assistant)
├── /qmoi-space (Space Hub)
│   ├── Links to /qcity
│   ├── Links to /qvillage
│   ├── Links to /qmoi-ai
│   └── Links to /PRODUCTION
├── /qvillage (Community Hub)
├── /qcity (City Command)
└── /PRODUCTION (PRODUCTIONeloper Utilities)
```

---

## PART 10: MASTER COMPONENT REFERENCE MATRIX

| Component Filename | Location | Type | Used By | Purpose | Status |
|-------------------|----------|------|---------|---------|--------|
| QFileManager.tsx | /components | Feature | /devices, /qcity | File system operations | Core |
| QMOIDashboard.tsx | /components | Feature | Admin routes | Main dashboard | Core |
| ChatMessaging.tsx | /app/components | App | /friendship | Chat interface | Active |
| AdminDashboard.tsx | /app/components | App | /admin | Admin board | Active |
| ProjectDashboard.tsx | /components/projects | Feature | /qvillage | Project view | Feature |
| Button.tsx | /components/ui | UI | All components | Button primitive | Library |
| Card.tsx | /components/ui | UI | All components | Card primitive | Library |
| QVillage.tsx | /components | Feature | /qvillage | Community interface | Active |
| alpha-q-ai-system.tsx | /components | AI | /qmoi-ai, /friendship | AI engine | Core |
| SystemHealthDashboard.tsx | /components | Feature | /admin, /PRODUCTION | System health | Monitor |

---

## PART 11: IMPLEMENTATION GUIDE

### Adding a New Component

1. **For shared UI components**:
   ```
   /components/ui/new-component.tsx
   → Used by: /components/feature-components/
   → Exported to: All feature components
   ```

2. **For feature components**:
   ```
   /components/NewFeatureComponent.tsx
   → Imports from: /components/ui/
   → Used in: Any app page or other feature
   → Exported to: App pages or other features
   ```

3. **For app-scoped components**:
   ```
   /app/components/NewAppComponent.tsx
   → Imports from: /components/ui/ or /components/
   → Used in: Related app routes
   → Scoped to: App directory only
   ```

### Adding a New Page

1. Create new route:
   ```
   /app/new-route/page.tsx
   ```

2. Import components as needed:
   ```typescript
   import SharedComponent from "@/components/SharedComponent"
   import AppComponent from "./components/AppComponent"
   ```

3. Link from navigation:
   ```typescript
   // Update navigation in relevant pages
   <Link href="/new-route">New Route</Link>
   ```

---

## PART 12: CRITICAL MISSING CONNECTIONS

### Components Not Yet Imported in Pages
```
- QmoiBrowser.tsx (unused)
- QmoiEnhancedSystem.tsx (unused)
- SisterProjects.tsx (likely unused)
- Several archive components (inactive)
```

### Routes Without Serving Components
```
/admin/master/* routes
  - Use page.tsx directly
  - No dedicated component imports
```

### Incomplete Integration
```
- GitLab clone not integrated
- Cloud credential modals available but usage unclear
- Several orchestration components not connected
```

---

## SUMMARY STATISTICS

- **Total .tsx Files**: 222
- **App Pages**: 17
- **App Components**: 16
- **Shared Components**: 189
  - UI Primitives: 60+
  - Feature Components: 129
- **Feature Categories**: 15+
- **Import Dependencies**: Multi-layered (UI → Feature → App Page)

---

## NEXT STEPS FOR COMPLETE MAPPING

1. **Trace each component's dependencies** - See which import which
2. **Map component usage** - Track where each is imported
3. **Identify unused components** - Find dead code
4. **Create dependency graphs** - Visualize connections
5. **Document data flow** - Show how data moves through components
6. **Generate component catalog** - Create searchable index
