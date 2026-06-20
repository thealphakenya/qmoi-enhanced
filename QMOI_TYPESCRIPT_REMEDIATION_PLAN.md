---
quantum-enabled: false
---

# QMOI TypeScript Error Remediation Plan

**Generated**: 2026-06-07  
**Total Files with Errors**: 14  
**Total TypeScript Errors**: 200+  
**Estimated Fix Time**: 4-6 hours (with batch fixing)

---

## Executive Summary

The QMOI project has **200+ TypeScript errors** concentrated in **14 key component files**. The errors fall into 5 main categories:

1. **Missing framer-motion imports** (29 errors) - 2 files
2. **Missing UI component library imports** (40+ errors) - 4 files  
3. **Missing apiClient/logger/notification** (50+ errors) - 3 files
4. **Missing React context/hooks imports** (5 errors) - 1 file
5. **Type errors and logic issues** (40+ errors) - 4 files

**Remediation Strategy**: Fix by error category in groups of 2-3 files per batch for maximum efficiency.

---

## PRIORITY-RANKED FILES (Top 20)

### BATCH 1: Animation Library (HIGH IMPACT - 36 errors)
**Estimated time: 30 minutes | Impact: High | Dependencies: Low**

#### 1. **FloatingControlPanel.tsx** (29 motion errors)
**Location**: `/workspaces/qmoi-enhanced/components/FloatingControlPanel.tsx`  
**Error Count**: 29  
**Error Type**: 2 missing imports + 27 usage errors

**Missing Imports**:
```typescript
import { motion, AnimatePresence } from 'framer-motion';
```

**Affected Lines**: 58, 60, 80, 89, 97, 106, 117-118, 129, 131, 138, 141, 143, 145, 160, 166-167, 183-184, 190, 234, 243-244, 253-254, 263, 267, 274-275, 277-278, 280

**Quick Fix**:
- Add import at top: `import { motion, AnimatePresence } from 'framer-motion';`
- Ensure all `motion.*` and `AnimatePresence` components are wrapped with `"use client"`

---

#### 2. **FloatingPreviewWindow.tsx** (7 motion errors + 24 UI component errors = 31 errors)
**Location**: `/workspaces/qmoi-enhanced/components/FloatingPreviewWindow.tsx`  
**Error Count**: 31  
**Error Types**: 
- Motion imports missing (7 errors)
- UI component imports missing (24 errors)

**Missing Imports**:
```typescript
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
```

**Affected Lines**:
- Motion: 165, 170, 175, 190, 195, 198, 203-204, 206-209, 211-214, 241, 245, 257, 259, 263, 275-276
- UI Components: 190, 195, 198, 203-214, 241, 245, 257, 259, 263, 275-276

**Additional Issues**:
- Line 151: Async function return type needs `Promise<any>` instead of implicit
- Line 165: `youtubeDownload` not defined - needs implementation
- Line 170, 175: `notification` not defined - needs import

---

### BATCH 2: API Client & Logger (HIGH IMPACT - 50+ errors)
**Estimated time: 45 minutes | Impact: Very High | Dependencies: Medium**

#### 3. **MasterEmailDashboard.tsx** (37 errors total)
**Location**: `/workspaces/qmoi-enhanced/components/MasterEmailDashboard.tsx`  
**Error Count**: 37  
**Error Types**:
- apiClient missing (8 occurrences)
- logger missing (7 occurrences)
- notification missing (12 occurrences)
- setState type errors (10 errors)

**Missing Imports**:
```typescript
import apiClient from '@/api/client';
import { log as logger } from '@/lib/logger';
import { showNotification } from '@/lib/notification'; // or appropriate notification system
```

**Affected Lines**:
- apiClient: 168, 181, 192, 203, 231, 264, 302, 329
- logger: 174, 187, 198, 209, 226, 296, 323, 336
- notification: 253, 255, 258-259, 291, 293, 297, 318, 320, 324

**State Management Issues**:
- Lines 219, 673, 682, 690, 732, 741, 750, 759, 767, 809: setState callbacks returning `{ prev: {...}, field: value }` instead of full state object
  - Fix: Change `setXxx(prev => ({ prev, ...changes }))` to `setXxx(prev => ({ ...prev, ...changes }))`

---

#### 4. **FinancialManager.tsx** (14 errors)
**Location**: `/workspaces/qmoi-enhanced/components/FinancialManager.tsx`  
**Error Count**: 14  
**Error Types**:
- apiClient missing (10 occurrences)
- useAuth import error (1)
- Type annotations missing (3)

**Missing Imports**:
```typescript
import apiClient from '@/api/client';
import { useAuth } from '@/hooks/useAuth'; // Current import is destructuring from default export
```

**Required Fixes**:
- Line 3: Change `import { useAuth } from "@/hooks/useAuth"` to `import useAuth from "@/hooks/useAuth"`
- Lines 32-33, 37-39, 46, 55-57, 67, 76-83: Add parameter types to `.then(res => {...})` callbacks

**Affected Lines**: 32, 33, 34, 37, 38, 39, 46, 55, 56, 57, 67, 76, 77, 78, 81, 82, 83

---

### BATCH 3: UI Components (HIGH IMPACT - 40+ errors)
**Estimated time: 1 hour | Impact: Very High | Dependencies: High (requires UI library)**

#### 5. **HelpGuide.tsx** (24+ UI component errors)
**Location**: `/workspaces/qmoi-enhanced/components/HelpGuide.tsx`  
**Error Count**: 24  
**Error Type**: Missing shadcn/ui component imports

**Missing Imports**:
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SisterProjects from './SisterProjects'; // Component import
import DownloadAppButton from './DownloadAppButton'; // Component import
```

**Affected Components**: Card, CardHeader, CardTitle, CardContent (4), Tabs, TabsList, TabsTrigger, TabsContent (10), SisterProjects, DownloadAppButton

**Affected Lines**: 51-53, 80-87, 96-97, 126-128, 139-143

---

#### 6. **LeahWalletPanel.tsx** (12+ UI component errors)
**Location**: `/workspaces/qmoi-enhanced/components/LeahWalletPanel.tsx`  
**Error Count**: 12  
**Error Types**:
- UI component imports missing (10)
- useState type error (2)

**Missing Imports**:
```typescript
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
```

**Affected Components**: Card, CardContent, Button (6)

**State Management Fix**:
- Lines 34, 47: State update function returning wrong type
  - Change: `setTransactions(t => ({ ...t, [...rest] }))` to maintain array type

**Affected Lines**: 34, 47, 55, 56, 76, 78, 79, 86, 104, 105

---

#### 7. **EnhancedRevenuePanel.tsx** (7 errors)
**Location**: `/workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx`  
**Error Count**: 7  
**Error Types**:
- Switch component missing (2)
- Separator component missing (1)
- Function return type (1)
- Parameter type missing (1)
- setState type error (1)

**Missing Imports**:
```typescript
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
```

**Function Fixes**:
- Line 93: Add return statement or type annotation to `loadRevenueData()` async function
- Line 599: Add type annotation: `(checked: boolean) => {`
- Line 600: Fix setState: Change from `{ prev: {...}, ...changes }` to `{ ...prev, ...changes }`

**Affected Lines**: 93, 515, 597, 599, 600, 611

---

### BATCH 4: Context & Type Issues (MEDIUM IMPACT - 5+ errors)
**Estimated time: 20 minutes | Impact: Medium | Dependencies: None**

#### 8. **MasterContext.tsx** (5+ errors)
**Location**: `/workspaces/qmoi-enhanced/components/MasterContext.tsx`  
**Error Count**: 5+  
**Error Types**:
- Missing React imports (3)
- Logic error (2)

**Missing Imports**:
```typescript
import React, { createContext, useContext, ReactNode } from 'react';
```

**Logic Fixes**:
- Line 34: Type check error - `"guest" !== "master"` should be one of the actual role types
- Line 37: Type check error - comparing wrong role type

**Affected Lines**: 17, 21, 34, 37, 53

---

### BATCH 5: Component-Specific Issues (MEDIUM IMPACT - 10+ errors)
**Estimated time: 30 minutes | Impact: Medium | Dependencies: Low**

#### 9. **app/qcity/page.tsx** (1 error)
**Location**: `/workspaces/qmoi-enhanced/app/qcity/page.tsx`  
**Error**: Line 129 - `console.error` is possibly undefined

**Fix**: Add optional chaining or null check:
```typescript
console.error?.("Failed to load QCity status:", error);
```

---

#### 10. **DealsList.tsx** (1 type error)
**Location**: `/workspaces/qmoi-enhanced/components/DealsList.tsx`  
**Error**: Cannot find name 'Deal'

**Fix**: Add type definition or import:
```typescript
interface Deal {
  id: string;
  name: string;
  // ... other fields
}
```

---

#### 11. **BiometricEnrollment.tsx** (1 prop error)
**Location**: `/workspaces/qmoi-enhanced/components/BiometricEnrollment.tsx`  
**Error**: Line 159 - Button component doesn't accept `enabled` prop (should be `disabled`)

**Fix**: Change `enabled={...}` to `disabled={!...}` or similar

---

#### 12. **GlobalFileTransfer.tsx** (1 error)
**Location**: `/workspaces/qmoi-enhanced/components/GlobalFileTransfer.tsx`  
**Error**: Line 23 - `uploadFile` not defined

**Fix**: Import or implement `uploadFile` function:
```typescript
import { uploadFile } from '@/lib/file-upload'; // or appropriate path
```

---

#### 13. **GlobalMail.tsx** (1 error)
**Location**: `/workspaces/qmoi-enhanced/components/GlobalMail.tsx`  
**Error**: Line 15 - `sendMail` not defined

**Fix**: Import or implement `sendMail` function:
```typescript
import { sendMail } from '@/lib/email'; // or appropriate path
```

---

#### 14. **GitStatus.tsx** (1 JSX namespace error)
**Location**: `/workspaces/qmoi-enhanced/components/GitStatus.tsx`  
**Error**: Line 24 - Cannot find namespace 'JSX'

**Fix**: Add JSX import at top of file or ensure it's a client component:
```typescript
"use client";
import React, { JSX } from 'react';
```

---

## BATCH FIXING STRATEGY (By Efficiency)

### Phase 1: Low-Dependency Fixes (30 minutes)
**Files**: FloatingControlPanel, QCity page, DealsList, BiometricEnrollment, GlobalFileTransfer, GlobalMail, GitStatus, MasterContext

**Operations**:
1. Add missing imports to FloatingControlPanel
2. Fix console.error in qcity/page.tsx
3. Add Deal type to DealsList
4. Fix Button props in BiometricEnrollment
5. Add uploadFile/sendMail functions/imports
6. Fix GitStatus JSX namespace
7. Fix MasterContext React imports

**Expected Result**: 15 errors fixed

---

### Phase 2: Animation/Preview Fixes (45 minutes)
**File**: FloatingPreviewWindow

**Operations**:
1. Add framer-motion import
2. Add all shadcn/ui component imports (Button, Card, Progress)
3. Fix async return type annotation
4. Implement/import youtubeDownload
5. Implement/import notification system

**Expected Result**: 31 errors fixed

---

### Phase 3: API/Logger Integration (1 hour)
**Files**: FinancialManager, MasterEmailDashboard

**Operations**:
1. Fix useAuth import in FinancialManager
2. Add apiClient import to both files
3. Add logger import to MasterEmailDashboard
4. Implement notification system import
5. Fix all setState callbacks to return full state objects
6. Add parameter type annotations to callbacks

**Expected Result**: 51 errors fixed

---

### Phase 4: UI Components (1 hour)
**Files**: HelpGuide, LeahWalletPanel, EnhancedRevenuePanel

**Operations**:
1. Add all shadcn/ui imports (Card, Button, Tabs, Switch, Separator)
2. Import SisterProjects and DownloadAppButton
3. Fix setState callbacks
4. Add Switch/Separator imports to EnhancedRevenuePanel
5. Fix async return types

**Expected Result**: 43 errors fixed

---

## IMPORT CHECKLIST

### Required Libraries

- [ ] **framer-motion** - `npm install framer-motion`
- [ ] **shadcn/ui** - `npm install next-themes class-variance-authority clsx tailwind-merge`
- [ ] **shadcn/ui components** - Run `npx shadcn-ui@latest add button card tabs switch separator progress`

### Required Files to Check/Create

- [ ] `/workspaces/qmoi-enhanced/app/api/client.ts` - API client export
- [ ] `/workspaces/qmoi-enhanced/lib/logger.ts` - Logger export
- [ ] `/workspaces/qmoi-enhanced/lib/notification.ts` - Notification system
- [ ] `/workspaces/qmoi-enhanced/hooks/useAuth.ts` - useAuth hook export
- [ ] `/workspaces/qmoi-enhanced/lib/file-upload.ts` - uploadFile function
- [ ] `/workspaces/qmoi-enhanced/lib/email.ts` - sendMail function

---

## ESTIMATED IMPACT

| Metric | Value |
|--------|-------|
| Total Errors Fixed | 200+ |
| Files Processed | 14 |
| Error Density Reduction | 95%+ |
| Build Success Rate Target | 100% |
| Estimated Compile Time | < 3 seconds (post-fix) |

---

## VALIDATION STEPS

1. **Phase 1 Validation** (5 min):
   ```bash
   npm run type-check 2>&1 | grep -c "error TS"
   ```
   Expected: ~140 errors remaining

2. **Phase 2 Validation** (5 min):
   ```bash
   npm run type-check 2>&1 | grep -c "error TS"
   ```
   Expected: ~110 errors remaining

3. **Phase 3 Validation** (5 min):
   ```bash
   npm run type-check 2>&1 | grep -c "error TS"
   ```
   Expected: ~60 errors remaining

4. **Phase 4 Validation** (5 min):
   ```bash
   npm run type-check 2>&1 | grep -c "error TS"
   ```
   Expected: < 10 errors remaining

5. **Final Build Test**:
   ```bash
   npm run build && npm run type-check
   ```
   Expected: Zero errors

---

## NEXT STEPS

1. Run diagnostics on UI library installation status
2. Verify all import paths are correct
3. Begin Phase 1 fixes (low-dependency batch)
4. Progress through phases sequentially
5. Test each phase with `npm run type-check`

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-07  
**Status**: Ready for Implementation
