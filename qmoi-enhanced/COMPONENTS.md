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
- FarmBusinessManager.tsx: Farm business management
- FileCategorizer.tsx: File categorization UI
- FileExplorer.tsx: File explorer panel
- FinancialManager.tsx: Financial management features
- FloatingPreviewWindow.tsx: Floating preview UI
- GitStatus.tsx: Git status panel
- GlobalCall.tsx: Global call features
- GlobalFileTransfer.tsx: File transfer UI
- GlobalMail.tsx: Global mail features
- GlobalVideoCall.tsx: Video call features
- HelpGuide.tsx: Help and guide UI
- LcSpaces.tsx: LC spaces panel
- LeahWallet.tsx: Wallet features
- LeahWalletPanel.tsx: Wallet panel UI
- MapLocationPanel.tsx: Location mapping
- MasterContext.tsx: Master context provider
- MediaPreviewWindow.tsx: Media preview UI
- NotificationCenter.tsx: Notification center
- NotificationPanel.tsx: Recent notifications panel
- PreviewWindow.tsx: Main preview UI
- PriceProductVerifier.tsx: Product verification
- QAvatar.tsx: Avatar UI
- QCityErrorManager.tsx: Error management for QCity
- QCityThemeProvider.tsx: Theme provider for QCity
- QConverse.tsx: Conversation UI
- QFileManager.tsx: File manager
- QI.tsx: QI main panel
- QIStateWindow.tsx: QI state display
- QMOIAutoFixDashboard.tsx: Auto-fix dashboard
- QMOIOwnDevice.tsx: Own device management
- QiSpaces.tsx: Qi spaces panel
- QmoiAccessibility.tsx: Accessibility features
- QmoiAutoDistribution.tsx: Auto distribution UI
- QmoiBrowser.tsx: QMOI browser features
- QmoiDialer.tsx: Dialer UI
- QmoiEnhancedSystem.tsx: Enhanced system UI
- QmoiKeyboard.tsx: Keyboard panel
- QmoiMediaManager.tsx: Media management
- QmoiMemoryPanel.tsx: QMOI memory panel
- QmoiRevenueDashboard.tsx: Revenue dashboard
- SettingsPanel.tsx: Settings management
- SisterProjects.tsx: Sister projects panel
- SystemHealthDashboard.tsx: System health UI
- TeamRoleManager.tsx: Team role management
- TradingPanel.tsx: Trading panel
- VoiceSelectionPanel.tsx: Voice selection UI
- WhatsAppBusinessPanel.tsx: WhatsApp business features
- WifiAutoConnectPanel.tsx: WiFi auto-connect
- WifiPanel.tsx: WiFi management

---

## src/components Directory

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
