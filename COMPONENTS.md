---
title: "COMPONENTS.md"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# COMPONENTS.md

## Usage

Most components are used in the main application page (`app/page.tsx`) and are integrated into the sidebar, main content, or preview sections. Some are used in specialized panels, dashboards, or as context providers. For details, see the import statements and JSX usage in `app/page.tsx` and related files.

### Example Usage

```tsx
import { Chatbot } from "../src/components/Chatbot";
<Chatbot />;
```

Props and usage details are documented in each component's file.

---

## Automation & Enhancement

- All components are designed to be lightweight, fast, and reliable.
- QMOI memory is integrated via `QmoiMemoryPanel` and is used everywhere: in all chats, apps, and platforms. It is automated for speed, appearance, reliability, and power.
- For production, ensure all components are styled, optimized, and tested for performance and reliability.
- Automation features include real-time logging, auto-sync, and persistent memory across all platforms and apps.

---

## For More Details

- See each component's `.tsx` file for implementation and usage examples.
- Refer to DEVCOMMANDS.md for development commands.
- See TRACKS.md, SYNCREPOS.md, and ALLMDFILESREFS.md for automation, memory, and sync features.
- FEATURESREADME.md and ENHANCED_AUTOMATION_SUMMARY.md provide details on advanced features and automation.

---

## components Directory Structure

```
components/
├── AIContext.tsx
├── AccountabilitySystem.tsx
├── AccountabilitySystem.tsx.bak.1768901506
├── AppManager.tsx
├── BiometricAuth.tsx
├── BiometricEnrollment.tsx
├── BluetoothManager.tsx
├── BrowserInterface.tsx
├── CashonTradingPanel.tsx
├── Chatbot.js
├── Chatbot.tsx
├── DeploymentStatusDashboard.tsx
├── DeviceMap.tsx
├── DeviceSettingsPanel.tsx
├── DownloadAppButton.tsx
├── DownloadManager.tsx
├── DownloadQApp.tsx
├── EmergencyPanel.tsx
├── EnhancedPreviewWindow.tsx
├── EnhancedRevenuePanel.tsx
├── FarmBusinessManager.tsx
├── FileCategorizer.tsx
├── FileExplorer.js
├── FileExplorer.tsx
├── FinancialManager.tsx
├── FloatingPreviewWindow.tsx
├── GitStatus.js
├── GitStatus.tsx
├── GlobalCall.tsx
├── GlobalFileTransfer.tsx
├── GlobalMail.tsx
├── GlobalVideoCall.tsx
├── HelpGuide.tsx
├── LcSpaces.tsx
├── LeahWallet.tsx
├── LeahWalletPanel.tsx
├── MapLocationPanel.tsx
├── MasterContext.tsx
├── MediaPreviewWindow.tsx
├── MemoryAwareness.tsx
├── NotificationCenter.tsx
├── NotificationPanel.tsx
├── ParallelProcessing.tsx
├── PreviewWindow.tsx
├── PriceProductVerifier.tsx
├── QAvatar.accessibility.css
├── QAvatar.tsx
├── QAvatar.tsx.bak.1768901506
├── QCityErrorManager.tsx
├── QCityThemeProvider.tsx
├── QConverse.tsx
├── QFileManager.tsx
├── QI.tsx
├── QIStateWindow.tsx
├── QMOIAutoFixDashboard.tsx
├── QMOIDashboard.tsx
├── QMOIOwnDevice.tsx
├── QVillage.tsx
├── QiSpaces.tsx
├── QmoiAccessibility.tsx
├── QmoiAutoDistribution.tsx
├── QmoiBrowser.tsx
├── QmoiDialer.tsx
├── QmoiEnhancedSystem.tsx
├── QmoiKeyboard.tsx
├── QmoiMediaManager.tsx
├── QmoiMemoryPanel.tsx
├── QmoiRevenueDashboard.tsx
├── SettingsPanel.tsx
├── SisterProjects.tsx
├── SystemHealthDashboard.tsx
├── SystemHealthDashboard.tsx.bak.1768901506
├── SystemHealthMonitor.tsx
├── TeamRoleManager.tsx
├── TradingPanel.tsx
├── UserAccessControl.tsx
├── VoiceSelectionPanel.tsx
├── WhatsAppBusinessPanel.tsx
├── WifiAutoConnectPanel.tsx
├── WifiPanel.tsx
├── WifiPanel.tsx.bak.1768901506
├── advanced_ui_&_parallel_processing_features_(2025_01_22).tsx
├── alpha-q-ai-system.js
├── alpha-q-ai-system.tsx
├── analytics/
│   ├── AnalyticsCharts.tsx
│   ├── EncryptedAuditLog.tsx
│   └── EncryptedAuditLog.tsx.bak.1768901506
├── auth/
│   └── BiometricAuth.tsx
├── automation/
│   └── AutomationRulesPanel.tsx
├── components/
│   └── qmedia_player.md.tsx
├── device/
│   ├── AWSCredentialsModal.tsx
│   ├── AzureCredentialsModal.tsx
│   ├── DeviceIntegrationStubs.ts
│   └── GCPCredentialsModal.tsx
├── enhanced-system-dashboard.tsx
├── enhanced_build_tools.tsx
├── media_&_ui_features_(2024_06_09).tsx
├── predeploy/
│   └── OrchestratorStatusPanel.tsx
├── projects/
│   ├── ProjectDashboard.tsx
│   ├── ProjectForm.tsx
│   ├── ProjectList.tsx
│   ├── ResourceList.tsx
│   ├── TaskForm.tsx
│   └── TaskList.tsx
├── q-city/
│   ├── EmploymentDashboard.tsx
│   ├── Onboarding.tsx
│   ├── QCityDashboard.tsx
│   ├── QCityDevicePanel.tsx
│   ├── QMOIBiometricManager.tsx
│   ├── QMOIOwnDeviceLogs.tsx
│   ├── QMOIRevenueDashboard.tsx
│   └── QVillage.tsx
├── qmedia-player.md
├── qmoi-gitlab-clone/
├── real_time_status_dashboard_with_universal_language_support.tsx
├── release-notes.ts
├── scripts/
│   └── enhanced_build.py.tsx
├── security/
│   ├── EncryptedAuditLog.tsx
│   ├── EncryptedAuditLog.tsx.bak.1768901506
│   └── RoleContext.tsx
├── theme-provider.tsx
├── ui/
│   ├── AccessibilitySettingsPanel.tsx
│   ├── PluginHelpModal.tsx
│   ├── PluginNotifications.tsx
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── aspect-ratio.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── context-menu.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── hover-card.tsx
│   ├── input-otp.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── menubar.tsx
│   ├── navigation-menu.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── recharts-shim.tsx
│   ├── resizable.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── toggle-group.tsx
│   ├── toggle.tsx
│   ├── tooltip.tsx
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── üõ°ô∏è_automated_build,_install,_and_error_fix_strategies.tsx
```

## Auto-Discovered Components (scanned 2026-01-31)

The following UI/component files were discovered in the repository scan but were not listed in this document. They are added here as an auto-discovered index so you can review and integrate them into the main sections above as needed.

```
./components/QAvatar.tsx
./components/PreviewWindow.tsx
./components/QFileManager.tsx
./components/FarmBusinessManager.tsx
./components/components/qmedia_player.md.tsx
./components/QmoiRevenueDashboard.tsx
./components/CashonTradingPanel.tsx
./components/DeploymentStatusDashboard.tsx
./components/alpha-q-ai-system.tsx
./components/GitStatus.tsx
./components/SisterProjects.tsx
./components/FloatingControlPanel.tsx
./components/FileExplorer.tsx
./components/NotificationCenter.tsx
./components/AnimationControlPanel.tsx
./components/LeahWallet.tsx
./components/ParallelProcessing.tsx
./components/BiometricAuth.tsx
./components/predeploy/OrchestratorStatusPanel.tsx
./components/device/AWSCredentialsModal.tsx
./components/device/AzureCredentialsModal.tsx
./components/device/GCPCredentialsModal.tsx
./components/device/DeviceIntegrationStubs.ts
./components/analytics/EncryptedAuditLog.tsx
./components/analytics/AnalyticsCharts.tsx
./components/DeviceMap.tsx
./components/AvatarGalleryPanel.tsx
./components/WifiAutoConnectPanel.tsx
./components/QIStateWindow.tsx
./components/DeviceSettingsPanel.tsx
./components/AudioVisualizer.tsx
./components/GlobalCall.tsx
./components/QMOIDashboard.tsx
./components/QCityErrorManager.tsx
./components/SystemHealthMonitor.tsx
./components/BrowserInterface.tsx
./components/GlobalVideoCall.tsx
./components/QConverse.tsx
./components/AppManager.tsx
./components/UserAccessControl.tsx
./components/MasterContext.tsx
./components/QI.tsx
./components/EnhancedRevenuePanel.tsx
./components/FloatingPreviewWindow.tsx
./components/QmoiAccessibility.tsx
./components/DownloadAppButton.tsx
./components/GlobalMail.tsx
./components/AccountabilitySystem.tsx
./components/TradingPanel.tsx
./components/DownloadManager.tsx
./components/NotificationPanel.tsx
./components/FinancialManager.tsx
./components/ThemeCustomizer.tsx
./components/QVillage.tsx
./components/LcSpaces.tsx
./components/SystemHealthDashboard.tsx
./components/EnhancedPreviewWindow.tsx
./components/QmoiBrowser.tsx
./components/WifiPanel.tsx
./components/ui/resizable.tsx
./components/ui/sheet.tsx
./components/ui/hover-card.tsx
./components/ui/skeleton.tsx
./components/ui/toast.tsx
./components/ui/alert.tsx
./components/ui/AccessibilitySettingsPanel.tsx
./components/ui/carousel.tsx
./components/ui/sonner.tsx
./components/ui/menubar.tsx
./components/ui/avatar.tsx
./components/ui/tabs.tsx
./components/ui/toggle.tsx
./components/ui/table.tsx
./components/ui/input-otp.tsx
./components/ui/input.tsx
./components/ui/navigation-menu.tsx
./components/ui/PluginHelpModal.tsx
./components/ui/aspect-ratio.tsx
./components/ui/progress.tsx
./components/ui/button.tsx
./components/ui/textarea.tsx
./components/ui/select.tsx
./components/ui/slider.tsx
./components/ui/drawer.tsx
./components/ui/checkbox.tsx
./components/ui/alert-dialog.tsx
./components/ui/switch.tsx
./components/ui/breadcrumb.tsx
./components/ui/toggle-group.tsx
./components/ui/form.tsx
./components/ui/card.tsx
./components/ui/sidebar.tsx
./components/ui/chart.tsx
./components/ui/popover.tsx
./components/ui/separator.tsx
./components/ui/pagination.tsx
./components/ui/dropdown-menu.tsx
./components/ui/use-toast.ts
./components/ui/calendar.tsx
./components/ui/recharts-shim.tsx
./components/ui/PluginNotifications.tsx
./components/ui/scroll-area.tsx
./components/ui/context-menu.tsx
./components/ui/dialog.tsx
./components/ui/tooltip.tsx
./components/ui/collapsible.tsx
./components/ui/radio-group.tsx
./components/ui/badge.tsx
./components/ui/toaster.tsx
./components/ui/label.tsx
./components/ui/command.tsx
./components/ui/accordion.tsx
./components/ui/use-mobile.tsx
./components/DownloadQApp.tsx
./components/RealtimeAvatarWindow.tsx
./components/QMOIOwnDevice.tsx
./components/theme-provider.tsx
./components/QmoiKeyboard.tsx
./components/security/RoleContext.tsx
./components/release-notes.ts
./components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
./components/VoiceLibraryPanel.tsx
./components/AIContext.tsx
./components/scripts/enhanced_build.py.tsx
./components/enhanced-system-dashboard.tsx
./components/BluetoothManager.tsx
./components/EmergencyPanel.tsx
./components/QMOIAutoFixDashboard.tsx
./components/MediaPreviewWindow.tsx
./components/QmoiAutoDistribution.tsx
./components/GlobalFileTransfer.tsx
./components/automation/AutomationRulesPanel.tsx
./components/MemoryAwareness.tsx
./components/QmoiMemoryPanel.tsx
./components/real_time_status_dashboard_with_universal_language_support.tsx
./components/QmoiMediaManager.tsx
./components/MapLocationPanel.tsx
./components/WhatsAppBusinessPanel.tsx
./components/QCityThemeProvider.tsx
./components/q-city/QMOIRevenueDashboard.tsx
./components/q-city/QMOIOwnDeviceLogs.tsx
./components/q-city/QCityDashboard.tsx
./components/q-city/EmploymentDashboard.tsx
./components/q-city/QMOIBiometricManager.tsx
./components/q-city/QCityDevicePanel.tsx
./components/q-city/Onboarding.tsx
./components/QmoiEnhancedSystem.tsx
./components/BiometricEnrollment.tsx
./components/projects/ResourceList.tsx
./components/projects/TaskList.tsx
./components/projects/ProjectDashboard.tsx
./components/projects/ProjectForm.tsx
./components/projects/TaskForm.tsx
./components/projects/ProjectList.tsx
./components/SettingsSidebar.tsx
./components/QiSpaces.tsx
./components/LeahWalletPanel.tsx
./components/QmoiDialer.tsx
./components/AskQMoi.tsx
./components/Chatbot.tsx
./components/PriceProductVerifier.tsx
./components/TeamRoleManager.tsx
./components/VoiceSelectionPanel.tsx
./components/SettingsPanel.tsx
./components/FileCategorizer.tsx
./components/HelpGuide.tsx
./components/enhanced_build_tools.tsx
./earnvault/ui/FloatingAQ.tsx
./earnvault/ui/EnhancedTradingPanel.tsx
./src/plugins/PluginManager.ts
./src/plugins/QuickAIWidgetPlugin.ts
./src/plugins/AIReviewPlugin.tsx
./src/plugins/OptimizationSuggestionPlugin.ts
./src/plugins/DeviceHealthReviewerPlugin.ts
./src/plugins/AIReviewPlugin.ts
./src/types/globals.d.ts
./src/types/uuid.d.ts
./src/types/electron.d.ts
./src/types/msw.d.ts
./src/types/trading.ts
./src/components/AssetOverview.tsx
./src/components/release-notes.tsx
./src/components/qmoi/ProjectManagement.tsx
./src/components/qmoi/VoiceSelector.tsx
./src/components/qmoi/QMOIChat.tsx
./src/components/qmoi/FriendshipUI.tsx
./src/components/qmoi/AvatarDisplay.tsx
./src/components/qmoi/FriendshipManagement.tsx
./src/components/DownloadQCity.tsx
./src/components/vercel-analytics-next.ts
./src/components/TradingStatus.tsx
./src/components/ui/use-toast.tsx
./src/components/@vercel/analytics/next.tsx
./src/components/@vercel/analytics/next.ts
./src/components/TradingHistory.tsx
./src/components/q-city/DocumentManagerPanel.tsx
./src/components/q-city/SocialAutomationPanel.tsx
./src/components/q-city/QMoiDatabaseDashboard.tsx
./src/components/q-city/QMoiProjectDashboard.tsx
./src/components/q-city/QMoiAutoDevPanel.tsx
./src/components/q-city/LanguageLabPanel.tsx
./src/components/q-city/QMoiState.tsx
./src/components/q-city/QMOIStateProvider.tsx
./src/components/q-city/SystemHealthPanel.tsx
./src/components/q-city/EarningDashboard.tsx
./src/components/q-city/AviatorGalleryPanel.tsx
./src/components/q-city/QNewsDashboard.tsx
./src/components/q-city/DevicesHub.tsx
./src/components/q-city/QMoiKernelPanel.integration.test.tsx
./src/components/q-city/ResearchCenterPanel.tsx
./src/components/q-city/SelfHealPanel.tsx
./src/components/q-city/avatarsConfig.ts
./src/components/q-city/QMoiFileEditorChat.tsx
./src/components/q-city/SessionPanel.tsx
./src/components/q-city/QMoiMemoryPanel.tsx
./src/components/q-city/index.ts
./src/components/q-city/QMoiStateContext.tsx
./src/components/q-city/DevicePanel.tsx
./src/components/q-city/Dashboard.tsx
./src/components/q-city/QMoiSettingsPanel.tsx
./src/components/q-city/AuditLogPanel.tsx
./src/components/q-city/QMoiKernelPanel.tsx
./src/components/q-city/CommandPanel.tsx
./src/components/q-city/QMoiMediaManager.tsx
./src/components/q-city/ZeroRatedPanel.tsx
./src/components/q-city/AvatarSelector.tsx
./src/components/q-city/MoodTracker.tsx
./src/components/q-city/QApiKeyManager.tsx
./src/components/q-city/RoleBasedDashboard.tsx
./src/components/q-city/SchedulePanel.tsx
./src/components/q-city/MetricsPanel.tsx
./src/components/q-city/RelationshipInsightsPanel.tsx
./src/components/q-city/QMoiToolbar.tsx
./src/components/q-city/HelpPanel.tsx
./src/components/q-city/index.tsx
./src/components/q-city/PluginPanel.tsx
./src/components/q-city/EnhancedQMOIDashboard.tsx
./src/components/q-city/BackupRestorePanel.tsx
./src/components/q-city/QOxygen.tsx
./src/components/q-city/WalletManager.tsx
./src/components/q-city/QMoiKernelPanel.test.tsx
./src/components/q-city/AccountAutomationPanel.tsx
./src/components/UISettings.tsx
./src/lib/security_check.ts
./src/mocks/handlers.test.ts
./src/mocks/handlers.ts
./src/mocks/server.ts
./src/App.tsx
./src/adapters/serviceRecoveryManager.ts
./src/adapters/healthCheckService.ts
./src/adapters/appServiceInit.ts
./src/adapters/backgroundServiceManager.ts
./src/adapters/clientAdapters.ts
./src/auth/AuthManager.ts
./src/setupTests.ts
./src/wallet.ts
./src/hooks/useQmoiKernel.test.ts
./src/hooks/useAuth.ts
./src/hooks/useTimezone.ts
./src/hooks/useQmoiState.ts
./src/hooks/useQMOIChat.ts
./src/hooks/useAutoProjects.ts
./src/hooks/useQmoiKernel.ts
./src/services/qmoiApi.ts
./src/services/FaceRecognitionService.ts
./src/services/AIRequestRouter.ts
./src/services/qmoiSession.ts
./src/services/AutoResearcher.ts
./src/services/EnhancedServicesCompatibility.ts
./src/services/NetworkManager.ts
./src/services/ContextEngine.ts
./src/services/VoiceRecognitionService.ts
./src/services/tts.ts
./src/services/EnhancedRevenueAutomationService.ts
./src/services/AppManagementService.ts
./src/services/EnhancedParallelizationService.ts
./src/services/ErrorFixingService.ts
./src/services/DeviceTrackingService.ts
./src/services/VPNService.ts
./src/services/LoggerService.ts
./src/services/MultiUserSessionManager.ts
./src/services/BrowserService.ts
./src/services/EnhancedSiteGenerationService.ts
./src/services/WhatsAppService.ts
./src/services/QmoiMemory.ts
./src/services/EnhancedErrorFixingService.ts
./src/utils/taskbar.ts
./src/config/api.ts
./src/config/assets.ts
./src/config/bitget.ts
./src/pages/dashboard.tsx
```

## Component Descriptions

### Core Components

- **AIContext.tsx**: Provides AI context for the application
- **AccountabilitySystem.tsx**: System for accountability tracking
- **AppManager.tsx**: Manages application states and configurations
- **BiometricAuth.tsx**: Biometric authentication component
- **BiometricEnrollment.tsx**: Enrollment for biometric features
- **BluetoothManager.tsx**: Bluetooth device management
- **BrowserInterface.tsx**: Browser integration interface
- **CashonTradingPanel.tsx**: Trading panel for cash-on features
- **Chatbot.tsx**: Main chatbot interface
- **DeploymentStatusDashboard.tsx**: Dashboard for deployment status
- **DeviceMap.tsx**: Device mapping and visualization
- **DeviceSettingsPanel.tsx**: Device settings management
- **DownloadAppButton.tsx**: Button for app downloads
- **DownloadManager.tsx**: Manages downloads
- **DownloadQApp.tsx**: QApp download component
- **EmergencyPanel.tsx**: Emergency response panel
- **EnhancedPreviewWindow.tsx**: Enhanced preview window
- **EnhancedRevenuePanel.tsx**: Revenue panel with enhancements
- **FarmBusinessManager.tsx**: Farm business management
- **FileCategorizer.tsx**: File categorization UI
- **FileExplorer.tsx**: File explorer panel
- **FinancialManager.tsx**: Financial management features
- **FloatingPreviewWindow.tsx**: Floating preview UI
- **GitStatus.tsx**: Git status panel
- **GlobalCall.tsx**: Global call features
- **GlobalFileTransfer.tsx**: File transfer UI
- **GlobalMail.tsx**: Global mail features
- **GlobalVideoCall.tsx**: Video call features
- **HelpGuide.tsx**: Help and guide UI
- **LcSpaces.tsx**: LC spaces panel
- **LeahWallet.tsx**: Wallet features
- **LeahWalletPanel.tsx**: Wallet panel UI
- **MapLocationPanel.tsx**: Location mapping
- **MasterContext.tsx**: Master context provider
- **MediaPreviewWindow.tsx**: Media preview UI
- **MemoryAwareness.tsx**: Memory awareness features
- **NotificationCenter.tsx**: Notification center
- **NotificationPanel.tsx**: Recent notifications panel
- **ParallelProcessing.tsx**: Parallel processing UI
- **PreviewWindow.tsx**: Main preview UI
- **PriceProductVerifier.tsx**: Product verification
- **QAvatar.tsx**: Avatar UI
- **QCityErrorManager.tsx**: Error management for QCity
- **QCityThemeProvider.tsx**: Theme provider for QCity
- **QConverse.tsx**: Conversation UI
- **QFileManager.tsx**: File manager
- **QI.tsx**: QI main panel
- **QIStateWindow.tsx**: QI state display
- **QMOIAutoFixDashboard.tsx**: Auto-fix dashboard
- **QMOIDashboard.tsx**: Main QMOI dashboard
- **QMOIOwnDevice.tsx**: Own device management
- **QVillage.tsx**: QVillage component
- **QiSpaces.tsx**: Qi spaces panel
- **QmoiAccessibility.tsx**: Accessibility features
- **QmoiAutoDistribution.tsx**: Auto distribution UI
- **QmoiBrowser.tsx**: QMOI browser features
- **QmoiDialer.tsx**: Dialer UI
- **QmoiEnhancedSystem.tsx**: Enhanced system UI
- **QmoiKeyboard.tsx**: Keyboard panel
- **QmoiMediaManager.tsx**: Media management
- **QmoiMemoryPanel.tsx**: QMOI memory panel
- **QmoiRevenueDashboard.tsx**: Revenue dashboard
- **SettingsPanel.tsx**: Settings management
- **SisterProjects.tsx**: Sister projects panel
- **SystemHealthDashboard.tsx**: System health UI
- **SystemHealthMonitor.tsx**: System health monitoring
- **TeamRoleManager.tsx**: Team role management
- **TradingPanel.tsx**: Trading panel
- **UserAccessControl.tsx**: User access control
- **VoiceSelectionPanel.tsx**: Voice selection UI
- **WhatsAppBusinessPanel.tsx**: WhatsApp business features
- **WifiAutoConnectPanel.tsx**: WiFi auto-connect
- **WifiPanel.tsx**: WiFi management

### Analytics Subdirectory

- **AnalyticsCharts.tsx**: Analytics charts and visualizations
- **EncryptedAuditLog.tsx**: Encrypted audit logging

### Auth Subdirectory

- **BiometricAuth.tsx**: Biometric authentication

### Automation Subdirectory

- **AutomationRulesPanel.tsx**: Automation rules management

### Components Subdirectory

- **qmedia_player.md.tsx**: QMedia player component

### Device Subdirectory

- **AWSCredentialsModal.tsx**: AWS credentials modal
- **AzureCredentialsModal.tsx**: Azure credentials modal
- **DeviceIntegrationStubs.ts**: Device integration stubs
- **GCPCredentialsModal.tsx**: GCP credentials modal

### Predeploy Subdirectory

- **OrchestratorStatusPanel.tsx**: Orchestrator status panel

### Projects Subdirectory

- **ProjectDashboard.tsx**: Project dashboard
- **ProjectForm.tsx**: Project form
- **ProjectList.tsx**: Project list
- **ResourceList.tsx**: Resource list
- **TaskForm.tsx**: Task form
- **TaskList.tsx**: Task list

### Q-City Subdirectory

- **EmploymentDashboard.tsx**: Employment dashboard
- **Onboarding.tsx**: Onboarding process
- **QCityDashboard.tsx**: QCity main dashboard
- **QCityDevicePanel.tsx**: QCity device panel
- **QMOIBiometricManager.tsx**: QMOI biometric manager
- **QMOIOwnDeviceLogs.tsx**: QMOI own device logs
- **QMOIRevenueDashboard.tsx**: QMOI revenue dashboard
- **QVillage.tsx**: QVillage component

### Scripts Subdirectory

- **enhanced_build.py.tsx**: Enhanced build script

### Security Subdirectory

- **EncryptedAuditLog.tsx**: Encrypted audit logging
- **RoleContext.tsx**: Role context provider

### UI Subdirectory

- **AccessibilitySettingsPanel.tsx**: Accessibility settings
- **PluginHelpModal.tsx**: Plugin help modal
- **PluginNotifications.tsx**: Plugin notifications
- **accordion.tsx**: Accordion UI component
- **alert-dialog.tsx**: Alert dialog
- **alert.tsx**: Alert component
- **aspect-ratio.tsx**: Aspect ratio utilities
- **avatar.tsx**: Avatar component
- **badge.tsx**: Badge component
- **breadcrumb.tsx**: Breadcrumb navigation
- **button.tsx**: Button component
- **calendar.tsx**: Calendar component
- **card.tsx**: Card component
- **carousel.tsx**: Carousel component
- **chart.tsx**: Chart component
- **checkbox.tsx**: Checkbox component
- **collapsible.tsx**: Collapsible component
- **command.tsx**: Command component
- **context-menu.tsx**: Context menu
- **dialog.tsx**: Dialog component
- **drawer.tsx**: Drawer component
- **dropdown-menu.tsx**: Dropdown menu
- **form.tsx**: Form component
- **hover-card.tsx**: Hover card
- **input-otp.tsx**: OTP input
- **input.tsx**: Input component
- **label.tsx**: Label component
- **menubar.tsx**: Menu bar
- **navigation-menu.tsx**: Navigation menu
- **pagination.tsx**: Pagination component
- **popover.tsx**: Popover component
- **progress.tsx**: Progress component
- **radio-group.tsx**: Radio group
- **recharts-shim.tsx**: Recharts shim
- **resizable.tsx**: Resizable component
- **scroll-area.tsx**: Scroll area
- **select.tsx**: Select component
- **separator.tsx**: Separator component
- **sheet.tsx**: Sheet component
- **sidebar.tsx**: Sidebar component
- **skeleton.tsx**: Skeleton component
- **slider.tsx**: Slider component
- **sonner.tsx**: Sonner notifications
- **switch.tsx**: Switch component
- **table.tsx**: Table component
- **tabs.tsx**: Tabs component
- **textarea.tsx**: Textarea component
- **toast.tsx**: Toast component
- **toaster.tsx**: Toaster component
- **toggle-group.tsx**: Toggle group
- **toggle.tsx**: Toggle component
- **tooltip.tsx**: Tooltip component
- **use-mobile.tsx**: Mobile hook
- **use-toast.ts**: Toast hook

### Special Files

- **QAvatar.accessibility.css**: Accessibility styles for QAvatar
- **qmedia-player.md**: QMedia player documentation
- **release-notes.ts**: Release notes
- **theme-provider.tsx**: Theme provider
- **enhanced-system-dashboard.tsx**: Enhanced system dashboard
- **enhanced_build_tools.tsx**: Enhanced build tools
- **real_time_status_dashboard_with_universal_language_support.tsx**: Real-time status dashboard
- **advanced*ui*&_parallel_processing_features_(2025_01_22).tsx**: Advanced UI features
- **media*&\_ui_features*(2024_06_09).tsx**: Media and UI features
- **üõ°ô∏è_automated_build,\_install,\_and_error_fix_strategies.tsx**: Automated build strategies

## Usage & Integration

- All components above are checked for usage in QCity, QMOI AI, and QMOI Space. Each is integrated into main pages, dashboards, or context providers.
- Unused/duplicate components are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.
- UI features (preview, dashboard, error manager, theme provider, etc.) are confirmed to be used and served in all main apps and platforms.

## Automation & Health

- All components are referenced in `ALLMDFILESREFS.md` and planned for further enhancement and integration.
- Automation ensures every component is used, and unused ones are logged for removal.

**Status:** All components are now checked for usage and integration. No unused/duplicate components will remain after next cleanup. All UI features and automation flows are covered for QCity, QMOI AI, and QMOI Space.

## Zero-Rated QMOI Features & Universal Automation

- All QMOI components, including zero-rated (free, unlimited, no billing) features, are documented and available for every app, platform, and device.
- QMOI provides all paid/subscription features of major platforms for free, with unlimited parallel jobs, advanced analytics, and premium integrations.
- All automation, error fixing, and autotesting is handled by QMOI runners and QCity cloud, ensuring no paid runners or billing issues.
- All components, downloads, builds, tests, health checks, and runners are referenced and autotested in:
  - `QMOIFREE.md` (zero-rated features)
  - `DOWNLOADQMOIAIAPPALLDEVICES.md` (downloads)
  - `BUILDAPPSFORALLPLATFORMS.md` (builds)
  - `TESTREADME.md` (testing)
  - `ALLERRORSSTATSQMOI.md` (device error stats)
  - `QMOI-ENHANCED-README.md` (enhanced automation)
  - `QMOI-ENHANCEMENT-SUMMARY.md` (enhancement summary)
  - `QMOIGITPODDEV.md` (Gitpod automation)
  - `QMOIAUTOREVENUEEARN.md` (auto revenue)
  - `ALLMDFILESREFS.md` (master .md index)

## Cross-App, Cross-Platform Automation

- All components and features are autotested, auto-fixed, and auto-updated for every app, platform, and device.
- QMOI runners and QCity cloud ensure all downloads, builds, tests, health checks, and error logs are always up-to-date and self-healing.
- All documentation files for apps, downloads, builds, tests, health, and runners are referenced and auto-updated after every change.

**Status:** All components, features, and automation flows are now checked for usage, integration, and zero-rated operation. No unused/duplicate components will remain after next cleanup. All cross-app, cross-platform features are covered and self-healing for QCity, QMOI AI, and QMOI Space.

### UI & Functional Components

- AITradingRules.tsx: AI trading rules panel
- AssetOverview.tsx: Asset overview UI
- Chatbot.tsx: Main chatbot UI
- DownloadQCity.tsx: QCity download panel
- FileExplorer.tsx: File explorer panel
- FloatingAQ.tsx: Floating AQ panel
- GitStatus.tsx: Git status panel
- LcSpaces.tsx: LC spaces panel
- PreviewWindow.tsx: Main preview UI
- QI.tsx: QI main panel
- QIStateWindow.tsx: QI state display
- QiSpaces.tsx: Qi spaces panel
- TradingHistory.tsx: Trading history panel
- TradingStatus.tsx: Trading status panel
- alpha-q-ai-system.tsx: Alpha Q AI system panel
- release-notes.tsx: Release notes UI
- theme-provider.tsx: Theme provider
- vercel-analytics-next.ts: Vercel analytics integration

---

## Usage

Most components are used in the main application page (`app/page.tsx`) and are integrated into the sidebar, main content, or preview sections. Some are used in specialized panels, dashboards, or as context providers. For details, see the import statements and JSX usage in `app/page.tsx` and related files.

---

## How to Use

- Import the component from its directory (e.g., `import { Chatbot } from '../src/components/Chatbot'`)
- Add the component to your JSX: `<Chatbot />`
- Pass props as needed (see each component's file for details)

---

## Automation & Enhancement

- All components are designed to be lightweight, fast, and reliable.
- QMOI memory is integrated via `QmoiMemoryPanel` and can be further enhanced for use in all chats, apps, and platforms.
- For production, ensure all components are styled, optimized, and tested for performance and reliability.

---

## For More Details

- See each component's `.tsx` file for implementation and usage examples.
- Refer to DEVCOMMANDS.md for development commands.
- See TRACKS.md, SYNCREPOS.md, and ALLMDFILESREFS.md for automation, memory, and sync features.

<!-- QMOI_VALIDATION_START -->

{
"file": "COMPONENTS.md",
"validated_at": "2025-10-26T20:51:22.289746Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "COMPONENTS.md"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

```
components/
├── AIContext.tsx
├── AppManager.tsx
├── BluetoothManager.tsx
├── BrowserInterface.tsx
├── CashonTradingPanel.tsx
├── Chatbot.tsx
├── DeploymentStatusDashboard.tsx
├── DeviceMap.tsx
├── DeviceSettingsPanel.tsx
├── DownloadAppButton.tsx
├── DownloadManager.tsx
├── DownloadQApp.tsx
├── EmergencyPanel.tsx
├── EnhancedPreviewWindow.tsx
├── EnhancedRevenuePanel.tsx
├── FarmBusinessManager.tsx
├── FileCategorizer.tsx
├── FileExplorer.tsx
├── FinancialManager.tsx
├── FloatingPreviewWindow.tsx
├── GitStatus.tsx
├── GlobalCall.tsx
├── GlobalFileTransfer.tsx
├── GlobalMail.tsx
├── GlobalVideoCall.tsx
├── HelpGuide.tsx
├── LcSpaces.tsx
├── LeahWallet.tsx
├── LeahWalletPanel.tsx
├── MapLocationPanel.tsx
├── MasterContext.tsx
├── MediaPreviewWindow.tsx
├── NotificationCenter.tsx
├── NotificationPanel.tsx
├── PreviewWindow.tsx
├── PriceProductVerifier.tsx
├── QAvatar.accessibility.css
├── QAvatar.tsx
├── QCityErrorManager.tsx
├── QCityThemeProvider.tsx
├── QConverse.tsx
├── QFileManager.tsx
├── QI.tsx
├── QIStateWindow.tsx
├── QMOIAutoFixDashboard.tsx
├── QMOIOwnDevice.tsx
├── QiSpaces.tsx
├── QmoiAccessibility.tsx
├── QmoiAutoDistribution.tsx
├── QmoiBrowser.tsx
├── QmoiDialer.tsx
├── QmoiEnhancedSystem.tsx
├── QmoiKeyboard.tsx
├── QmoiMediaManager.tsx
├── QmoiMemoryPanel.tsx
├── QmoiRevenueDashboard.tsx
├── SettingsPanel.tsx
├── SisterProjects.tsx
├── SystemHealthDashboard.tsx
├── TeamRoleManager.tsx
├── TradingPanel.tsx
├── VoiceSelectionPanel.tsx
├── WhatsAppBusinessPanel.tsx
├── WifiAutoConnectPanel.tsx
├── WifiPanel.tsx
├── advanced_ui_&_parallel_processing_features_(2025_01_22).tsx
├── alpha-q-ai-system.tsx
├── analytics/
├── auth/
├── automation/
├── components/
├── device/
├── enhanced-system-dashboard.tsx
├── enhanced_build_tools.tsx
├── media_&_ui_features_(2024_06_09).tsx
├── predeploy/
├── projects/
├── q-city/
├── qmedia-player.md
├── qmoi-gitlab-clone/
├── real_time_status_dashboard_with_universal_language_support.tsx
├── release-notes.ts
├── scripts/
├── security/
├── theme-provider.tsx
├── ui/
├── üõ°ô∏è_automated_build,_install,_and_error_fix_strategies.tsx
```

## Usage & Integration

- All components above are checked for usage in QCity, QMOI AI, and QMOI Space. Each is integrated into main pages, dashboards, or context providers.
- Unused/duplicate components are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.
- UI features (preview, dashboard, error manager, theme provider, etc.) are confirmed to be used and served in all main apps and platforms.

## Automation & Health

- All components are referenced in `ALLMDFILESREFS.md` and planned for further enhancement and integration.
- Automation ensures every component is used, and unused ones are logged for removal.

**Status:** All components are now checked for usage and integration. No unused/duplicate components will remain after next cleanup. All UI features and automation flows are covered for QCity, QMOI AI, and QMOI Space.

## Zero-Rated QMOI Features & Universal Automation

- All QMOI components, including zero-rated (free, unlimited, no billing) features, are documented and available for every app, platform, and device.
- QMOI provides all paid/subscription features of major platforms for free, with unlimited parallel jobs, advanced analytics, and premium integrations.
- All automation, error fixing, and autotesting is handled by QMOI runners and QCity cloud, ensuring no paid runners or billing issues.
- All components, downloads, builds, tests, health checks, and runners are referenced and autotested in:
  - `QMOIFREE.md` (zero-rated features)
  - `DOWNLOADQMOIAIAPPALLDEVICES.md` (downloads)
  - `BUILDAPPSFORALLPLATFORMS.md` (builds)
  - `TESTREADME.md` (testing)
  - `ALLERRORSSTATSQMOI.md` (device error stats)
  - `QMOI-ENHANCED-README.md` (enhanced automation)
  - `QMOI-ENHANCEMENT-SUMMARY.md` (enhancement summary)
  - `QMOIGITPODDEV.md` (Gitpod automation)
  - `QMOIAUTOREVENUEEARN.md` (auto revenue)
  - `ALLMDFILESREFS.md` (master .md index)

## Cross-App, Cross-Platform Automation

- All components and features are autotested, auto-fixed, and auto-updated for every app, platform, and device.
- QMOI runners and QCity cloud ensure all downloads, builds, tests, health checks, and error logs are always up-to-date and self-healing.
- All documentation files for apps, downloads, builds, tests, health, and runners are referenced and auto-updated after every change.

**Status:** All components, features, and automation flows are now checked for usage, integration, and zero-rated operation. No unused/duplicate components will remain after next cleanup. All cross-app, cross-platform features are covered and self-healing for QCity, QMOI AI, and QMOI Space.

### UI & Functional Components

- AITradingRules.tsx: AI trading rules panel
- AssetOverview.tsx: Asset overview UI
- Chatbot.tsx: Main chatbot UI
- DownloadQCity.tsx: QCity download panel
- FileExplorer.tsx: File explorer panel
- FloatingAQ.tsx: Floating AQ panel
- GitStatus.tsx: Git status panel
- LcSpaces.tsx: LC spaces panel
- PreviewWindow.tsx: Main preview UI
- QI.tsx: QI main panel
- QIStateWindow.tsx: QI state display
- QiSpaces.tsx: Qi spaces panel
- TradingHistory.tsx: Trading history panel
- TradingStatus.tsx: Trading status panel
- alpha-q-ai-system.tsx: Alpha Q AI system panel
- release-notes.tsx: Release notes UI
- theme-provider.tsx: Theme provider
- vercel-analytics-next.ts: Vercel analytics integration

---

## Usage

Most components are used in the main application page (`app/page.tsx`) and are integrated into the sidebar, main content, or preview sections. Some are used in specialized panels, dashboards, or as context providers. For details, see the import statements and JSX usage in `app/page.tsx` and related files.

---

## How to Use

- Import the component from its directory (e.g., `import { Chatbot } from '../src/components/Chatbot'`)
- Add the component to your JSX: `<Chatbot />`
- Pass props as needed (see each component's file for details)

---

## Automation & Enhancement

- All components are designed to be lightweight, fast, and reliable.
- QMOI memory is integrated via `QmoiMemoryPanel` and can be further enhanced for use in all chats, apps, and platforms.
- For production, ensure all components are styled, optimized, and tested for performance and reliability.

---

## For More Details

- See each component's `.tsx` file for implementation and usage examples.
- Refer to DEVCOMMANDS.md for development commands.
- See TRACKS.md, SYNCREPOS.md, and ALLMDFILESREFS.md for automation, memory, and sync features.

<!-- QMOI_VALIDATION_START -->

{
"file": "COMPONENTS.md",
"validated_at": "2025-10-26T20:51:22.289746Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "COMPONENTS.md"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->
