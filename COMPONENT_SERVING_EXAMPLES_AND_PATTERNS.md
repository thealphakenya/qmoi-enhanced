---
quantum-enabled: false
---

# 🔗 COMPONENT SERVING EXAMPLES & IMPORT PATTERNS

**Purpose:** Specific code examples showing HOW each component category is served  
**Generated:** May 4, 2026

---

## 📋 TABLE OF CONTENTS

1. [Route-Based Serving](#route-based-serving)
2. [Context Provider Pattern](#context-provider-pattern)
3. [Global Overlay Pattern](#global-overlay-pattern)
4. [Modal/Portal Pattern](#modalportal-pattern)
5. [Lazy Loading Pattern](#lazy-loading-pattern)
6. [Component Tree Pattern](#component-tree-pattern)

---

## 1️⃣ ROUTE-BASED SERVING

Most components are served directly from route page files. This is the most common pattern.

### Example 1: Simple Dashboard Component

**Component:** `SystemHealthDashboard.tsx`  
**Location:** `/components/SystemHealthDashboard.tsx`  
**Serving File:** `app/admin/page.tsx`

```typescript
// app/admin/page.tsx
import React from "react";
import SystemHealthDashboard from "@/components/SystemHealthDashboard";
import ProductionMonitoringDashboard from "@/components/ProductionMonitoringDashboard";
import DeploymentStatusDashboard from "@/components/DeploymentStatusDashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Multiple dashboard components served on same page */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SystemHealthDashboard />
          <ProductionMonitoringDashboard />
          <DeploymentStatusDashboard />
        </div>
      </div>
    </main>
  );
}
```

**Import Chain:**
```
Browser visits: /admin
  ↓
Next.js router matches: app/admin/page.tsx
  ↓
Imports: SystemHealthDashboard.tsx
  ↓
Returns: <SystemHealthDashboard />
  ↓
Browser displays: Component UI
```

---

### Example 2: device Management Components

**Components:** 
- `WifiPanel.tsx`
- `BluetoothManager.tsx`
- `deviceSettingsPanel.tsx`

**Serving File:** `app/devices/page.tsx`

```typescript
// app/devices/page.tsx
import { useState } from "react";
import WifiPanel from "@/components/WifiPanel";
import BluetoothManager from "@/components/BluetoothManager";
import deviceSettingsPanel from "@/components/deviceSettingsPanel";
import QMOIOwndevice from "@/components/QMOIOwndevice";

export default function devicesPage() {
  const [selecteddevice, setSelecteddevice] = useState(null);

  return (
    <div className="devices-container p-8">
      <h1>device Management</h1>
      
      <section className="device-controls">
        <WifiPanel 
          onConnect={(device) => setSelecteddevice(device)} 
        />
        <BluetoothManager 
          selecteddevice={selecteddevice}
        />
      </section>

      <section className="device-settings">
        <deviceSettingsPanel 
          device={selecteddevice}
        />
        <QMOIOwndevice />
      </section>
    </div>
  );
}
```

**Serving Diagram:**
```
app/devices/page.tsx
├─ Imports: WifiPanel
├─ Imports: BluetoothManager
├─ Imports: deviceSettingsPanel
└─ Imports: QMOIOwndevice
     ↓
     Renders all on /devices route
```

---

### Example 3: Communication Components

**Components:**
- `GlobalMail.tsx`
- `MasterEmailDashboard.tsx`

**Serving File:** `app/master/email/page.tsx`

```typescript
// app/master/email/page.tsx
import React, { useContext } from "react";
import MasterEmailDashboard from "@/components/MasterEmailDashboard";
import GlobalMail from "@/components/GlobalMail";
import { MasterContext } from "@/components/MasterContext";

export default function EmailPage() {
  const { userRole, masterSettings } = useContext(MasterContext);

  // Only show to master users
  if (userRole !== "master") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="email-container">
      <MasterEmailDashboard 
        role={userRole}
        settings={masterSettings}
      />
      <GlobalMail />
    </div>
  );
}
```

**Serving Diagram:**
```
Browser: /master/email
  ↓
Matches: app/master/email/page.tsx
  ↓
Checks: MasterContext (from parent layout)
  ↓
Renders: MasterEmailDashboard + GlobalMail
```

---

## 2️⃣ CONTEXT PROVIDER PATTERN

Components wrapped as providers at the layout level to make context available to all child routes.

### Example 1: Master Control Context

**Provider Component:** `MasterContext.tsx`  
**Layout File:** `app/master/layout.tsx`

```typescript
// app/master/layout.tsx
import React from "react";
import MasterContext from "@/components/MasterContext";
import MasterPortal from "@/components/MasterPortal";

export default function MasterLayout({ children }) {
  return (
    <MasterContext>
      {/* All routes under /master/* get MasterContext */}
      <div className="master-layout">
        <MasterPortal /> {/* Navigation/sidebar */}
        <main className="master-content">
          {children}
        </main>
      </div>
    </MasterContext>
  );
}
```

**Usage in Child Route:**

```typescript
// app/master/email/page.tsx
import { useContext } from "react";
import { MasterContext } from "@/components/MasterContext";

export default function EmailPage() {
  // Access context from parent layout
  const { masterSettings, userId } = useContext(MasterContext);
  
  return (
    <div>
      Master ID: {userId}
      Settings: {JSON.stringify(masterSettings)}
    </div>
  );
}
```

**Serving Diagram:**
```
Browser: /master/email
  ↓
Matches: app/master/layout.tsx (parent)
  ↓
Wraps with: <MasterContext>
  ↓
Then renders: app/master/email/page.tsx
  ↓
Child can access: useContext(MasterContext)
```

---

### Example 2: AI Context Provider

**Provider Component:** `AIContext.tsx`  
**Layout File:** `app/layout.tsx` (global)

```typescript
// app/layout.tsx
import AIContext from "@/components/AIContext";
import ThemeProvider from "@/app/components/theme/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <AIContext>
            {/* All routes have access to AIContext */}
            {children}
          </AIContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Any route can access AI context:**

```typescript
// Any page.tsx or component
import { useContext } from "react";
import { AIContext } from "@/components/AIContext";

export default function AnyPage() {
  const { aiModel, query } = useContext(AIContext);
  
  return (
    <div>
      AI Model: {aiModel}
    </div>
  );
}
```

---

## 3️⃣ GLOBAL OVERLAY PATTERN

Components rendered at the root layout level to be available on ALL routes simultaneously.

### Example: Floating production Window

**Component:** `FloatingPreviewWindow.tsx`  
**Location:** `app/layout.tsx`

```typescript
// app/layout.tsx
import React from "react";
import FloatingPreviewWindow from "@/components/FloatingPreviewWindow";
import NotificationPanel from "@/components/NotificationPanel";
import HelpGuide from "@/components/HelpGuide";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Main route content */}
        {children}

        {/* Global overlays available on ALL routes */}
        <FloatingPreviewWindow /> {/* Always visible */}
        <NotificationPanel />     {/* Always visible */}
        <HelpGuide />             {/* Always visible */}
      </body>
    </html>
  );
}
```

**Availability:**
```
Any route (/, /admin, /devices, /master/email, etc.)
  ↓
Renders: root layout.tsx
  ↓
Which includes:
  ├─ {children} (route-specific content)
  ├─ FloatingPreviewWindow (global)
  ├─ NotificationPanel (global)
  └─ HelpGuide (global)
     ↓
     User sees: Route content + Global overlays
```

---

## 4️⃣ MODAL/PORTAL PATTERN

Components that render in a portal (outside the main DOM tree, usually for modals/popups).

### Example: DealsPopup Component

**Component:** `DealsPopup.tsx`  
**Server:** Route page or global handler

```typescript
// components/DealsPopup.tsx
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function DealsPopup({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Portal can only render on client
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Available Deals</h2>
        <ul>
          <li>Deal 1</li>
          <li>Deal 2</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body // Renders at document.body level
  );
}
```

**Usage:**

```typescript
// app/deals/page.tsx
import { useState } from "react";
import DealsPopup from "@/components/DealsPopup";
import DealsList from "@/components/DealsList";

export default function DealsPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>
        Show Deals
      </button>
      <DealsList />
      
      {/* Portal renders at document.body, not here */}
      <DealsPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
    </div>
  );
}
```

---

## 5️⃣ LAZY LOADING PATTERN

Components loaded on-demand for code splitting and performance.

### Example: Lazy-loaded AI System

**Component:** `alpha-q-ai-system.tsx`  
**Serving File:** `app/qmoi-ai/page.tsx`

```typescript
// app/qmoi-ai/page.tsx
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy-load the AI system (code-split)
const AISystem = dynamic(
  () => import("@/components/alpha-q-ai-system"),
  { 
    loading: () => <div>Loading AI System...</div>,
    ssr: false // Don't server-side render
  }
);

export default function AIPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1>QMOI AI System</h1>
      <AISystem /> {/* Loads on demand */}
    </Suspense>
  );
}
```

**Loading Diagram:**
```
User navigates to: /qmoi-ai
  ↓
app/qmoi-ai/page.tsx loads immediately
  ↓
Renders loading message
  ↓
<AISystem /> component chunks download
  ↓
Alpha-q-ai-system.tsx code loaded
  ↓
Component renders
```

---

## 6️⃣ COMPONENT TREE PATTERN

Components used within other components (nested/internal use).

### Example: Dashboard with Nested Components

**Parent:** `QMOIDashboard.tsx`  
**Children:** Multiple internal components

```typescript
// components/QMOIDashboard.tsx
import React from "react";
import QmoiRevenueDashboard from "./QmoiRevenueDashboard";
import SystemHealthMonitor from "./SystemHealthMonitor";
import MasterTracksDashboard from "./MasterTracksDashboard";

export default function QMOIDashboard() {
  return (
    <div className="qmoi-dashboard">
      <h1>QMOI Dashboard</h1>
      
      <div className="grid">
        {/* These components are served by QMOIDashboard */}
        <QmoiRevenueDashboard />
        <SystemHealthMonitor />
        <MasterTracksDashboard />
      </div>
    </div>
  );
}
```

**Serving Chain:**
```
app/admin/page.tsx
  ↓ imports
<QMOIDashboard />
  ↓ which imports and renders
<QmoiRevenueDashboard />
<SystemHealthMonitor />
<MasterTracksDashboard />
     ↓
     All render on /admin page
```

---

## 🔄 COMPLETE IMPORT CHAIN EXAMPLES

### Example 1: Single Component Route

```
User navigates to: https://app.com/devices
  ↓
Next.js router matches: app/devices/page.tsx
  ↓
app/devices/page.tsx contains:
  import WifiPanel from "@/components/WifiPanel";
  export default function Page() {
    return <WifiPanel />;
  }
  ↓
Browser loads: components/WifiPanel.tsx
  ↓
Browser renders: WifiPanel UI
```

### Example 2: Multiple Component Route with Context

```
User navigates to: https://app.com/master/email
  ↓
Next.js router matches: app/master/layout.tsx (parent)
  ↓
app/master/layout.tsx wraps with:
  <MasterContext>
    <MasterPortal />
    {children}
  </MasterContext>
  ↓
Then renders: app/master/email/page.tsx
  ↓
app/master/email/page.tsx contains:
  import MasterEmailDashboard from "@/components/MasterEmailDashboard";
  export default function EmailPage() {
    return <MasterEmailDashboard />;
  }
  ↓
Browser loads:
  • components/MasterContext.tsx
  • components/MasterPortal.tsx
  • components/MasterEmailDashboard.tsx
  ↓
Browser renders: All three components with context
```

### Example 3: Global + Route Components

```
User navigates to: https://app.com/admin
  ↓
Next.js loads: app/layout.tsx (root)
  ↓
app/layout.tsx renders:
  <html>
    <body>
      <FloatingPreviewWindow /> {/* global */}
      <NotificationPanel />      {/* global */}
      {children}
    </body>
  </html>
  ↓
Then renders: app/admin/page.tsx
  ↓
app/admin/page.tsx renders:
  <SystemHealthDashboard />
  <ProductionMonitoringDashboard />
  ↓
Browser loads:
  • FloatingPreviewWindow (global)
  • NotificationPanel (global)
  • SystemHealthDashboard (route-specific)
  • ProductionMonitoringDashboard (route-specific)
  ↓
Browser renders: All components on /admin page
```

---

## 📝 IMPORT SYNTAX VARIATIONS

### Standard ES6 Import

```typescript
import ComponentName from "@/components/ComponentName";
```

### Import from Subdirectory

```typescript
import EncryptedAuditLog from "@/components/security/EncryptedAuditLog";
```

### Named Imports

```typescript
import { MasterContext } from "@/components/MasterContext";
```

### Dynamic/Lazy Imports

```typescript
import dynamic from "next/dynamic";

const AISystem = dynamic(
  () => import("@/components/alpha-q-ai-system")
);
```

### Conditional Imports

```typescript
if (typeof window !== "undefined") {
  import("@/components/ClientOnlyComponent");
}
```

---

## 🔍 HOW TO FIND SERVING FILES FOR ANY COMPONENT

### Method 1: Search in App Directory

```bash
# Search for imports in all app route files
grep -r "import.*DownloadQApp\|from.*DownloadQApp" app/

# Result shows which route files import it
```

### Method 2: Search Component Name

```bash
# Find anywhere component is imported
grep -r "DownloadQApp\|<DownloadQApp" --include="*.tsx" --include="*.ts"

# Shows all serving locations
```

### Method 3: Use IDE Features

- Open component file
- Right-click → "Go to References"
- IDE shows all places it's imported/used

### Method 4: React PRODUCTIONTools

- Open app in browser with React PRODUCTIONTools
- Navigate to component's likely page
- Search for component in PRODUCTIONTools
- Trace parent component chain back to route

---

## ✅ VERIFICATION CHECKLIST

When adding/modifying components:

- [ ] Component created in `/components/`
- [ ] Imported in appropriate route file
- [ ] Props defined with TypeScript interface
- [ ] Component renders without errors
- [ ] Available at expected route when running app
- [ ] No TypeScript compilation errors
- [ ] Component visible in React PRODUCTIONTools

---

## 🎯 SUMMARY

| Pattern | Usage | Example |
|---------|-------|---------|
| Route-Based | Direct import in page.tsx | SystemHealthDashboard in /admin |
| Context Provider | Wraps child routes | MasterContext in /master/layout |
| Global Overlay | Renders in root layout | FloatingPreviewWindow in root |
| Modal/Portal | Renders at document.body | DealsPopup modal |
| Lazy Loading | On-demand code split | AISystem with dynamic() |
| Component Tree | Child of another component | QmoiRevenueDashboard in QMOIDashboard |

---

**Created:** May 4, 2026  
**Reference:** COMPONENT_CONNECTION_MAP.md, COMPONENT_SERVING_TECHNICAL_DETAILED_MAP.md
