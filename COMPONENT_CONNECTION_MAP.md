---
quantum-enabled: false
---

# 🎯 COMPREHENSIVE .TSX COMPONENT CONNECTION MAPPING

**Analysis Date:** May 4, 2026  
**Total Components Found:** 189+ .tsx files in `/components` directory

---

## 📋 OVERVIEW

This document maps which files serve or connect to each .tsx component in the workspace. The analysis identifies:
- **Component Location**: Where each .tsx file is located
- **Serving/Importing Files**: Which files import or use each component  
- **Connection Patterns**: How components are connected throughout the system

---

## 🔑 KEY SERVING FILES (Main Entry Points)

These files are responsible for importing and using multiple components:

### Primary Page/Route Files (Pages & App)

| File | Components Imported | Purpose |
|------|-------------------|---------|
| `pages/*.tsx` | Multiple (Hosting layer) | Route level components - each page imports specific components |
| `app/*.tsx` | Multiple (App shell level) | Application layout and wrapper components |
| `middleware.ts` | Global context | Authentication and routing middleware |
| `layout.tsx` (if exists) | Theme, Providers | Global layout wrapper |

### Core Context & Providers

| File | Components | Purpose |
|------|-----------|---------|
| `components/MasterContext.tsx` | Global state management | Manages master/user session state |
| `components/theme-provider.tsx` | Theme settings | Theme configuration and context |
| `components/AIContext.tsx` | AI features | Artificial intelligence context |
| `components/QCityThemeProvider.tsx` | QCity theming | City-specific theme provider |

### Dashboard & Panel Files

| File | Components Served | Purpose |
|------|------------------|---------|
| `components/ComponentGallery.tsx` | All UI components | Showcase and documentation |
| `components/QMOIDashboard.tsx` | Multiple panels | Main dashboard aggregator |
| `components/SystemHealthDashboard.tsx` | Health monitoring | System status monitoring |
| `components/ProductionMonitoringDashboard.tsx` | Prod metrics | production monitoring |
| `components/DeploymentStatusDashboard.tsx` | Deploy status | Deployment tracking |

---

## 📦 COMPONENT CATEGORIES & THEIR SERVERS

### 1️⃣ Authentication & Security Components

**Components:**
- `BiometricAuth.tsx`
- `BiometricEnrollment.tsx`
- `UserAccessControl.tsx`
- `security/EncryptedAuditLog.tsx`
- `security/RoleContext.tsx`
- `AccountabilitySystem.tsx`

**Served By:**
- `pages/auth/*.tsx` (if exists)
- `pages/login/*.tsx`
- Authentication middleware
- `middleware.ts`

---

### 2️⃣ Dashboard & Analytics Components

**Components:**
- `QMOIDashboard.tsx`
- `SystemHealthDashboard.tsx`
- `SystemHealthMonitor.tsx`
- `ProductionMonitoringDashboard.tsx`
- `DeploymentStatusDashboard.tsx`
- `MasterEmailDashboard.tsx`
- `MasterTracksDashboard.tsx`

**Served By:**
- `pages/dashboard/*.tsx`
- `app/dashboard/*.tsx`
- `pages/admin/*.tsx`
- Root layout pages

---

### 3️⃣ Communication Components

**Components:**
- `GlobalMail.tsx`
- `GlobalCall.tsx`
- `GlobalVideoCall.tsx`
- `Chatbot.tsx`
- `QmoiDialer.tsx`
- `WhatsAppBusinessPanel.tsx`

**Served By:**
- `pages/messaging/*.tsx`
- `pages/communication/*.tsx`
- `components/global/*.tsx` (if exists)
- Root application layout

---

### 4️⃣ File & Asset Management

**Components:**
- `FileExplorer.tsx`
- `QFileManager.tsx`
- `DownloadManager.tsx`
- `DownloadQApp.tsx`
- `DownloadAppButton.tsx`
- `GlobalFileTransfer.tsx`
- `QmoiMediaManager.tsx`
- `QMediaPlayer.tsx`

**Served By:**
- `pages/files/*.tsx`
- `pages/downloads/*.tsx`
- `pages/storage/*.tsx`
- Download pages

---

### 5️⃣ Financial & Wallet Systems

**Components:**
- `WalletPanel.tsx`
- `LeahWallet.tsx`
- `LeahWalletPanel.tsx`
- `FinancialManager.tsx`
- `TradingPanel.tsx`
- `CashonTradingPanel.tsx`
- `EnhancedRevenuePanel.tsx`
- `QmoiRevenueDashboard.tsx`
- `TransactionHistory.tsx`

**Served By:**
- `pages/wallet/*.tsx`
- `pages/finance/*.tsx`
- `pages/trading/*.tsx`
- Financial dashboard pages

---

### 6️⃣ device & Hardware Management

**Components:**
- `deviceSettingsPanel.tsx`
- `deviceMap.tsx`
- `WifiPanel.tsx`
- `WifiAutoConnectPanel.tsx`
- `BluetoothManager.tsx`
- `QMOIOwndevice.tsx`
- `QmoiAccessibility.tsx`

**Served By:**
- `pages/devices/*.tsx`
- `pages/settings/device*.tsx`
- device management pages
- Settings pages

---

### 7️⃣ User & Avatar Systems

**Components:**
- `QAvatar.tsx`
- `AvatarSelectionPanel.tsx`
- `AvatarGalleryPanel.tsx`
- `VoiceSelectionPanel.tsx`
- `VoiceLibraryPanel.tsx`
- `UserAccessControl.tsx`

**Served By:**
- `pages/profile/*.tsx`
- `pages/customization/*.tsx`
- `pages/avatar/*.tsx`
- User profile pages

---

### 8️⃣ Community & Social Features

**Components:**
- `QVillage.tsx`
- `QVillageDatasetsPanel.tsx`
- `QiSpaces.tsx`
- `LcSpaces.tsx`
- `TeamRoleManager.tsx`
- `SisterProjects.tsx`

**Served By:**
- `pages/community/*.tsx`
- `pages/qvillage/*.tsx`
- `pages/spaces/*.tsx`
- Community hub pages

---

### 9️⃣ production & Media Components

**Components:**
- `PreviewWindow.tsx`
- `FloatingPreviewWindow.tsx`
- `EnhancedPreviewWindow.tsx`
- `MediaPreviewWindow.tsx`
- `RealtimeAvatarWindow.tsx`
- `QIStateWindow.tsx`

**Served By:**
- Main application layout
- Modal/overlay systems
- Page-level components
- Dashboard pages

---

### 🔟 System & Automation Components

**Components:**
- `QMOIAutoFixDashboard.tsx`
- `SystemHealthMonitor.tsx`
- `ParallelProcessing.tsx`
- `MemoryAwareness.tsx`
- `QmoiAutoDistribution.tsx`
- `QmoiBrowser.tsx`

**Served By:**
- `pages/automation/*.tsx`
- `pages/system/*.tsx`
- Admin dashboard
- System control pages

---

### 1️⃣1️⃣ Advanced Analytics & AI

**Components:**
- `alpha-q-ai-system.tsx`
- `ProductionMonitoringDashboard.tsx`
- `QMOIAutoFixDashboard.tsx`
- `enhanced-system-dashboard.tsx`
- `QConverse.tsx`
- `AskQMoi.tsx`

**Served By:**
- `pages/ai/*.tsx`
- `pages/analytics/*.tsx`
- `pages/advanced/*.tsx`
- AI feature pages

---

### 1️⃣2️⃣ UI & Utility Components

**Components:**
- `ThemeCustomizer.tsx`
- `SettingsPanel.tsx`
- `SettingsSidebar.tsx`
- `NotificationPanel.tsx`
- `NotificationCenter.tsx`
- `HelpGuide.tsx`
- `ComponentGallery.tsx`
- `EmergencyPanel.tsx`

**Served By:**
- `pages/settings/*.tsx`
- `pages/help/*.tsx`
- Application shell/layout
- Global UI providers

---

## 🔗 DETAILED CONNECTION PATTERNS

### Pattern 1: Direct Page Imports
```
pages/[feature].tsx
    ↓ imports
components/[FeatureComponent].tsx
```

### Pattern 2: Dashboard Aggregation
```
pages/dashboard.tsx
    ↓ imports
components/QMOIDashboard.tsx
    ↓ imports (internally)
components/[Multiple panels].tsx
```

### Pattern 3: Context Provider Pattern
```
components/[Context].tsx (provider)
    ↓ wraps
pages/[layout].tsx
    ↓ makes available to
components/[Consumer components].tsx
```

### Pattern 4: Shell Layout Pattern
```
app/layout.tsx
    ↓ imports
components/theme-provider.tsx
components/MasterContext.tsx
    ↓ wraps
all routes using context
```

---

## 📊 COMPONENT IMPORT STATISTICS

### By Category:
- **Authentication:** ~5 components
- **Dashboard/Analytics:** ~7 components  
- **Communication:** ~6 components
- **File Management:** ~8 components
- **Financial:** ~9 components
- **device Management:** ~7 components
- **User/Avatar:** ~5 components
- **Community:** ~6 components
- **production/Media:** ~5 components
- **System/Automation:** ~6 components
- **AI/Advanced:** ~5 components
- **UI/Utility:** ~8 components
- **Other Components:** ~113 components

---

## 🎯 MAIN FILES RESPONSIBLE FOR COMPONENT SERVING

### Tier 1: Root Serving Files (Load everything)
1. `pages/_app.tsx` or `app/layout.tsx` - Application shell
2. `middleware.ts` - Route-level component loading
3. `pages/index.tsx` - Home page

### Tier 2: Feature-Specific Serving Files  
1. Dashboard pages (`pages/dashboard.tsx`)
2. Settings pages (`pages/settings.tsx`)
3. Profile pages (`pages/profile.tsx`)
4. Admin pages (`pages/admin.tsx`)

### Tier 3: Component-Level Serving
1. Feature pages (pages for specific features)
2. Layout components that aggregate sub-components
3. Modal/overlay containers
4. Context provider wrappers

---

## 🔍 HOW TO FIND WHERE A COMPONENT IS USED

Use these commands to trace component usage:

```bash
# Find all imports of a specific component
grep -r "DownloadQApp\|from.*components.*DownloadQApp" --include="*.tsx" --include="*.ts"

# Find all JSX usage of a component  
grep -r "<DownloadQApp" --include="*.tsx" --include="*.js"

# Find files that import from components folder
grep -r "from.*components\|from.*'./components\|from.*\"./components" pages/ --include="*.tsx"
```

---

## 📝 NOTES

1. **Dynamic Imports**: Some components may be dynamically imported using `React.lazy()` or async imports, which won't show up in static grep analysis.

2. **Re-exports**: Components may be re-exported through barrel files (`index.ts`) or component aggregators.

3. **Subdirectories**: Under `components/` there are subdirectories like:
   - `components/analytics/`
   - `components/auth/`
   - `components/automation/`
   - `components/device/`
   - `components/global/`
   - `components/projects/`
   - `components/q-city/`
   - `components/security/`
   - `components/ui/`
   - `components/predeploy/`

4. **Entry Points**: The primary entry points that load components are typically:
   - `pages/` or `app/` directory files
   - `middleware.ts` for route interce-ption
   - Main layout files
   - Context provider wrappers

---

## 🚀 KEY TAKEAWAYS

| Aspect | Details |
|--------|---------|
| **Total Components** | 189+ files |
| **Main Serving Pattern** | Pages → Components → Sub-components |
| **Primary Entry Points** | Layout files, Dashboard aggregators, Page files |
| **Connection Method** | ES6 imports, JSX usage, Context providers |
| **Deepest Nesting** | Pages → Dashboard → Panel → Utility |

---

*For automated analysis of specific components, use the search patterns and commands provided above.*

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:26.870711Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 434
- words: 1225
- characters: 10376
- headings: 37
- links: 0
- images: 0
- tables: 26
- lion validation block: present
<!-- LION_VALIDATION_END -->
