---
quantum-enabled: false
---

# 🗂️ COMPREHENSIVE .TSX COMPONENT-TO-SERVING FILE MAPPING
## Detailed Technical Reference Guide

**Generated:** May 4, 2026  
**Total .tsx Components Analyzed:** 189  
**Project Structure:** Next.js 13+ with App Router  

---

## 📍 PROJECT STRUCTURE OVERVIEW

```
/workspaces/qmoi-enhanced/
├── app/                              # Next.js App Router (primary routing)
│   ├── layout.tsx                    # Root layout wrapper
│   ├── page.tsx                      # Home page (entry point)
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   └── master/
│   ├── devices/                      # device management routes
│   ├── master/                       # Master control routes
│   ├── qcity/                        # QCity routes
│   ├── qmoi-ai/                      # AI routes
│   ├── qmoi-space/                   # Space routes
│   ├── qvillage/                     # Village routes
│   └── api/                          # API routes
│
├── components/                       # React components (189 .tsx files)
│   ├── analytics/                    # Analytics components
│   ├── auth/                         # Authentication components
│   ├── automation/                   # Automation components
│   ├── device/                       # device-related components
│   ├── global/                       # Global shared components
│   ├── projects/                     # Project components
│   ├── q-city/                       # QCity components
│   ├── security/                     # Security components
│   ├── ui/                           # UI primitives
│   ├── predeploy/                    # Pre-deployment components
│   ├── [individual components]       # Root-level components (199 total .tsx)
│
├── pages/                            # Legacy routing (pages/api only used)
│   └── api/                          # API routes
│
└── [Configuration files]             # Next.js configs, middleware, etc.
```

---

## 🔗 ROUTING HIERARCHY & COMPONENT SERVING

### Tier 1: Root Entry Points

```
┌─────────────────────────────────────┐
│  Browser requests app               │
└────────────────┬────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  app/layout.tsx      │ (Root HTML structure)
      │  app/page.tsx        │ (Home page/Hub)
      └──────┬───────────────┘
             │
      ┌──────▼────────────────────────────┐
      │  Routes to sub-routes:            │
      │  • /admin → app/admin/page.tsx    │
      │  • /devices → app/devices/        │
      │  • /master → app/master/          │
      │  • /qcity → app/qcity/            │
      │  • /qmoi-ai → app/qmoi-ai/        │
      │  • /qmoi-space → app/qmoi-space/  │
      │  • /q-alpha.html → /pwa_apps/q-alpha/ │
      │  • /qvillage → app/qvillage/      │
      └──────────────────────────────────┘
```

---

## 📦 COMPONENT CATEGORIES & SERVING FILES

### 1. AUTHENTICATION & SECURITY (5 components)

**Components:**
- `BiometricAuth.tsx`
- `BiometricEnrollment.tsx`
- `UserAccessControl.tsx`
- `AccountabilitySystem.tsx`
- `security/EncryptedAuditLog.tsx`
- `security/RoleContext.tsx`

**Primary Serving File:** `app/admin/page.tsx` or route-specific handlers

**Usage Pattern:**
```typescript
// In app/admin/page.tsx or specific auth route
import BiometricAuth from '@/components/BiometricAuth';

export default function Page() {
  return <BiometricAuth />;
}
```

---

### 2. MASTER CONTROL & PORTAL (4 components)

**Components:**
- `MasterContext.tsx` (Context Provider)
- `MasterPortal.tsx` (Portal component)
- `MasterEmailDashboard.tsx` (Email dashboard)
- `MasterTracksDashboard.tsx` (Tracks dashboard)

**Primary Serving File:** `app/master/*.tsx` routes

**Connection Flow:**
```
app/master/layout.tsx
├─ Wraps with MasterContext.tsx
└─ Routes to:
   ├─ app/master/email → MasterEmailDashboard.tsx
   ├─ app/master/tracks → MasterTracksDashboard.tsx
   └─ app/master/page → MasterPortal.tsx
```

---

### 3. DASHBOARD & MONITORING (7 components)

**Components:**
- `QMOIDashboard.tsx`
- `SystemHealthDashboard.tsx`
- `SystemHealthMonitor.tsx`
- `ProductionMonitoringDashboard.tsx`
- `DeploymentStatusDashboard.tsx`
- `QmoiRevenueDashboard.tsx`
- `enhanced-system-dashboard.tsx`

**Primary Serving Files:**
- `app/admin/page.tsx`
- `app/admin/master/page.tsx`
- Route-specific dashboard pages

**Import Example:**
```typescript
import QMOIDashboard from '@/components/QMOIDashboard';
import SystemHealthDashboard from '@/components/SystemHealthDashboard';

export default function AdminPage() {
  return (
    <>
      <QMOIDashboard />
      <SystemHealthDashboard />
    </>
  );
}
```

---

### 4. COMMUNICATION SYSTEMS (6 components)

**Components:**
- `GlobalMail.tsx`
- `GlobalCall.tsx`
- `GlobalVideoCall.tsx`
- `Chatbot.tsx`
- `QmoiDialer.tsx`
- `WhatsAppBusinessPanel.tsx`

**Primary Serving Files:**
- `app/master/email/page.tsx` (for email)
- Route-specific communication pages
- Global layout overlays

**Connection Pattern:**
```typescript
// Route-specific invocation
import GlobalMail from '@/components/GlobalMail';

export default function EmailPage() {
  return <GlobalMail />;
}
```

---

### 5. FILE & DOWNLOAD MANAGEMENT (8 components)

**Components:**
- `FileExplorer.tsx`
- `QFileManager.tsx`
- `DownloadManager.tsx`
- `DownloadQApp.tsx`
- `DownloadAppButton.tsx`
- `GlobalFileTransfer.tsx`
- `QmoiMediaManager.tsx`
- `QMediaPlayer.tsx`

**Primary Serving Files:**
- `app/devices/page.tsx`
- Direct component routes
- Modal/overlay containers
- `DownloadQApp.tsx` - served from `app/page.tsx` (home page)

**Example Usage:**
```typescript
// In app/devices or file management route
import DownloadQApp from '@/components/DownloadQApp';
import QFileManager from '@/components/QFileManager';

export default function FilesPage() {
  return (
    <>
      <QFileManager />
      <DownloadQApp />
    </>
  );
}
```

---

### 6. FINANCIAL & WALLET SYSTEMS (9 components)

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

**Primary Serving Files:**
- Route-specific wallet/finance pages
- Dashboard aggregators
- Modal/panel overlays

---

### 7. PRODUCTIONICE & HARDWARE MANAGEMENT (7 components)

**Components:**
- `deviceSettingsPanel.tsx`
- `deviceMap.tsx`
- `WifiPanel.tsx`
- `WifiAutoConnectPanel.tsx`
- `BluetoothManager.tsx`
- `QMOIOwndevice.tsx`
- `QmoiAccessibility.tsx`

**Primary Serving File:** `app/devices/page.tsx`

**Connection Flow:**
```
app/devices/layout.tsx
├─ device context setup
└─ Routes to:
   ├─ app/devices/page → Multiple device panels
   └─ app/devices/[type] → Specific device components
```

---

### 8. USER & AVATAR SYSTEMS (5 components)

**Components:**
- `QAvatar.tsx`
- `AvatarSelectionPanel.tsx`
- `AvatarGalleryPanel.tsx`
- `VoiceSelectionPanel.tsx`
- `VoiceLibraryPanel.tsx`

**Primary Serving Files:**
- User profile/settings routes
- Account customization pages

---

### 9. COMMUNITY & SOCIAL (6 components)

**Components:**
- `QVillage.tsx`
- `QVillageDatasetsPanel.tsx`
- `QiSpaces.tsx`
- `LcSpaces.tsx`
- `TeamRoleManager.tsx`
- `SisterProjects.tsx`

**Primary Serving File:** `app/qvillage/page.tsx`

---

### 10. production & MEDIA WINDOWS (5 components)

**Components:**
- `PreviewWindow.tsx`
- `FloatingPreviewWindow.tsx`
- `EnhancedPreviewWindow.tsx`
- `MediaPreviewWindow.tsx`
- `RealtimeAvatarWindow.tsx`

**Serving Pattern:** Global overlays, typically imported in layout or global providers

**Implementation:**
```typescript
// Global layout or root page
import FloatingPreviewWindow from '@/components/FloatingPreviewWindow';

export default function Layout() {
  return (
    <>
      <main>{children}</main>
      <FloatingPreviewWindow /> {/* Always available */}
    </>
  );
}
```

---

### 11. SYSTEM & AUTOMATION (6 components)

**Components:**
- `QMOIAutoFixDashboard.tsx`
- `SystemHealthMonitor.tsx`
- `ParallelProcessing.tsx`
- `MemoryAwareness.tsx`
- `QmoiAutoDistribution.tsx`
- `QmoiBrowser.tsx`

**Serving Pattern:** System-level monitoring and automation pages

---

### 12. ADVANCED AI & ANALYTICS (5 components)

**Components:**
- `alpha-q-ai-system.tsx`
- `enhanced-system-dashboard.tsx`
- `QConverse.tsx`
- `AskQMoi.tsx`

**Primary Serving File:** `app/qmoi-ai/page.tsx`

---

### 13. UI & UTILITY COMPONENTS (8 components)

**Components:**
- `ThemeCustomizer.tsx`
- `SettingsPanel.tsx`
- `SettingsSidebar.tsx`
- `NotificationPanel.tsx`
- `NotificationCenter.tsx`
- `HelpGuide.tsx`
- `ComponentGallery.tsx`
- `EmergencyPanel.tsx`

**Serving Pattern:** Global/universal components used across all pages

---

## 🎯 KEY SERVING FILES BY RESPONSIBILITY

### Routes That Import Components

```
app/layout.tsx
├─ Global providers
├─ Root styles
└─ Children render point

app/page.tsx (HOME)
├─ Feature hub/navigation
└─ DownloadQApp.tsx (optional)

app/admin/page.tsx
├─ SystemHealthDashboard.tsx
├─ ProductionMonitoringDashboard.tsx
├─ DeploymentStatusDashboard.tsx
└─ QMOIDashboard.tsx

app/devices/page.tsx
├─ deviceSettingsPanel.tsx
├─ deviceMap.tsx
├─ WifiPanel.tsx
├─ BluetoothManager.tsx
└─ QMOIOwndevice.tsx

app/master/layout.tsx
├─ MasterContext.tsx (provider)
├─ MasterPortal.tsx
└─ Routes to sub-pages

app/master/email/page.tsx
├─ MasterEmailDashboard.tsx
└─ GlobalMail.tsx

app/qcity/page.tsx
├─ Multiple QCity-specific components

app/qmoi-ai/page.tsx
├─ alpha-q-ai-system.tsx
├─ AskQMoi.tsx
└─ enhanced-system-dashboard.tsx

app/qmoi-space/page.tsx
├─ QVillage.tsx (or space components)

app/qvillage/page.tsx
├─ QVillageDatasetsPanel.tsx
├─ QionSpaces.tsx
└─ Community components
```

---

## 🔄 COMPONENT DEPENDENCY FLOWS

### Flow 1: Simple Page Import
```
User navigates to /admin
  ↓
app/admin/page.tsx loads
  ↓
imports SystemHealthDashboard.tsx
  ↓
Component renders with props/hooks
```

### Flow 2: Context-Based Serving
```
User navigates to /master/*
  ↓
app/master/layout.tsx loads
  ↓
Wraps children with <MasterContext>
  ↓
Child route (e.g., app/master/email/page.tsx) loads
  ↓
imports MasterEmailDashboard.tsx
  ↓
Component accesses context from parent
```

### Flow 3: Global Overlay Pattern
```
app/layout.tsx (root)
  ↓
imports FloatingPreviewWindow.tsx globally
  ↓
renders <FloatingPreviewWindow /> in all pages
  ↓
Available on every route
```

### Flow 4: Dynamic Import Pattern
```
Route page component
  ↓
Uses React.lazy() or dynamic import
  ↓
import(ComponentPath).tsx
  ↓
Code-split component loads on demand
```

---

## 📋 COMPLETE COMPONENT INVENTORY BY SERVING METHOD

### Components Served via Route Pages (Primary)

| Component | Served By | Route |
|-----------|-----------|-------|
| SystemHealthDashboard | app/admin/page.tsx | /admin |
| ProductionMonitoringDashboard | app/admin/page.tsx | /admin |
| deviceSettingsPanel | app/devices/page.tsx | /devices |
| QFileManager | app/devices/page.tsx | /devices |
| MasterEmailDashboard | app/master/email/page.tsx | /master/email |
| GlobalMail | app/master/email/page.tsx | /master/email |
| QMOIDashboard | App-wide or admin | /admin |
| QAvatar | Profile pages | /profile |
| QVillageDatasetsPanel | app/qvillage/page.tsx | /qvillage |
| AskQMoi | app/qmoi-ai/page.tsx | /qmoi-ai |

### Components Served via Providers/Wrapping

| Component | Provider | Usage |
|-----------|----------|-------|
| MasterContext | app/master/layout.tsx | Wraps all /master/* routes |
| theme-provider | app/layout.tsx (likely) | Global theme |
| AIContext | Global layout | AI features across app |

### Components Served as Global/Overlay

| Component | Location | Availability |
|-----------|----------|---------------|
| FloatingPreviewWindow | app/layout.tsx | All routes |
| NotificationPanel | app/layout.tsx | All routes |
| EmergencyPanel | app/layout.tsx | All routes |
| PreviewWindow | Global container | Modal overlay |

### Components Without Direct Page (Likely Internal Use)

- `QmoiAccessibility.tsx` - Likely utility/context provider
- `WrappedComponent.tsx` - Higher-order component wrapper
- `ComponentGallery.tsx` - PRODUCTIONeloper/documentation component
- Many sub-components used within other components

---

## 🔍 FINDING WHERE A COMPONENT IS USED

### Method 1: Search Import Statements
```bash
grep -r "import.*DownloadQApp\|from.*DownloadQApp" .
grep -r "<DownloadQApp" .
```

### Method 2: Check Specific Routes
```bash
# Check what a route imports
grep -n "import" app/admin/page.tsx
grep -n "import" app/devices/page.tsx
grep -n "import" app/master/layout.tsx
```

### Method 3: Use React PRODUCTIONTools
- Open app in browser
- Inspect component in React PRODUCTIONTools
- Trace parent components up to route handler

---

## 🏗️ SERVING ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────┐
│           Browser / User Navigation                 │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────▼──────────────┐
        │   Next.js App Router     │
        │   (Route Resolution)     │
        └───────────┬──────────────┘
                    │
        ┌───────────▼────────────────────────────┐
        │   Matching Route File                  │
        │   (e.g., app/admin/page.tsx)           │
        │   (e.g., app/devices/page.tsx)         │
        │   (e.g., app/master/layout.tsx)        │
        └───────────┬────────────────────────────┘
                    │
        ┌───────────▼──────────────────────┐
        │   Component Import & Render      │
        │   from /components directory     │
        └───────────┬──────────────────────┘
                    │
        ┌───────────▼──────────────────────┐
        │   Component Lifecycle            │
        │   (useState, useEffect, etc.)     │
        │   Displays to User                │
        └───────────────────────────────────┘
```

---

## 📊 COMPONENT STATISTICS

- **Total Components:** 189 .tsx files
- **Root-level Components:** ~120
- **Subdirectory Components:**
  - `analytics/`: ~5-10
  - `auth/`: ~5-10
  - `automation/`: ~5-10
  - `device/`: ~5-10
  - `global/`: ~10-15
  - `projects/`: ~5-10
  - `q-city/`: ~5-10
  - `security/`: ~5-10
  - `ui/`: ~10-20
  - `predeploy/`: ~3-5

- **Typical Import Pattern:**
  - ~40% served directly from route pages
  - ~30% used as child components within other components
  - ~20% providers/context wrappers
  - ~10% utilities/helpers

---

## 🎯 HOW TO ADD A NEW COMPONENT TO THE SERVING SYSTEM

1. **Create component in `/components`:**
   ```tsx
   // components/MyNewComponent.tsx
   export default function MyNewComponent() {
     return <div>My Content</div>;
   }
   ```

2. **Import in desired route:**
   ```tsx
   // app/admin/page.tsx
   import MyNewComponent from '@/components/MyNewComponent';
   
   export default function AdminPage() {
     return <MyNewComponent />;
   }
   ```

3. **Alternative: Add to layout for global availability:**
   ```tsx
   // app/layout.tsx
   import MyNewComponent from '@/components/MyNewComponent';
   
   export default function RootLayout() {
     return (
       <html>
         <body>
           {children}
           <MyNewComponent /> {/* Always renders */}
         </body>
       </html>
     );
   }
   ```

---

## 🔗 REFERENCES

- **Next.js App Router Docs:** https://nextjs.org/docs/app
- **Component Directory:** `/workspaces/qmoi-enhanced/components/`
- **App Routes:** `/workspaces/qmoi-enhanced/app/`
- **Main Entry:** `/workspaces/qmoi-enhanced/app/page.tsx`

---

**Last Updated:** May 4, 2026  
**Analysis Scope:** All 189 .tsx components in `/components` directory  
**Project Framework:** Next.js 13+ with App Router

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:16.151268Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 668
- words: 1786
- characters: 16271
- headings: 41
- links: 0
- images: 0
- tables: 23
- lion validation block: present
<!-- LION_VALIDATION_END -->
