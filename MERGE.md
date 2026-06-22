# Merge and Deduplication Strategy

**Created:** 2026-06-22  
**Purpose:** Eliminate duplicate files, directories, and features while consolidating app implementations

---

## 1. Overview

The QMOI system contains multiple duplicate apps and features across different modules:
- **Apps:** qmoi-ai, qmoi-space, qcity, qvillage, qalpha (with duplicated entry points and styles)
- **Components:** Shared UI/logic in multiple places without proper sharing
- **API routes:** Duplicate endpoint handlers with similar logic
- **Styles/configs:** Repeated theme, layout, and configuration logic
- **Hardware integration:** QCamera features scattered and unoptimized

### Goals
1. **One canonical version** of each app (not duplicated entry points)
2. **Centralized components** shared across all apps via a unified library
3. **No duplicate implementations** of the same business logic
4. **Optimized QCamera** with all hardware features and permissions fully utilized
5. **Clear entry points** with complete traceability

---

## 2. Discovery Phase

### 2.1 Identify Duplicate App Entry Points

**Locations to check:**
```
/app/                  # Next.js app router pages
/app/[app-name]/page.tsx
/app/[app-name]/styles/page.tsx
/src/app/              # Alternative app pages
/public/               # Static HTML fallbacks
/app/api/[app-name]/   # App-specific APIs
```

**Current duplicates identified:**
- `app/qmoi-ai/page.tsx` + `/pwa_apps/qmoi-ai/index.html`
- `app/qmoi-space/page.tsx` + `/pwa_apps/qmoi-space/index.html`
- `app/qcity/page.tsx` + multiple qcity html files
- `app/qvillage/page.tsx`
- `app/qalpha/page.tsx`

**Action:** For each app, determine:
- Primary entry point (Next.js page component preferred)
- Secondary/fallback entry points
- Which one has the latest implementation
- Feature gap analysis between versions

### 2.2 Identify Duplicate Components

**Search patterns:**
```bash
# Find components with same name in different locations
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "export.*Component\|export default"

# Look for similar functionality across directories
grep -r "function\|const.*=" app/ src/ | grep -v node_modules
```

**Common duplicate patterns:**
- Navigation components (sidebars, headers, footers)
- Card/modal/dialog wrappers
- Form components (input, select, date picker, etc.)
- Theme providers and styling utilities
- Authentication/session handlers
- Analytics/tracking functions

**Action for each duplicate:**
1. Identify all versions
2. Compare implementations (features, bugs, optimizations)
3. Create enhanced consolidated version
4. Update all references to use consolidated version
5. Remove duplicates

### 2.3 Identify Duplicate Business Logic

**Locations:**
```
app/api/*/route.ts     # Next.js API handlers
scripts/               # Automation and utility scripts
lib/                   # Shared libraries
services/              # Service layer
utils/                 # Utility functions
hooks/                 # React hooks
```

**Action:**
1. Group by business domain (auth, payments, reports, etc.)
2. Check for overlapping endpoint logic
3. Consolidate into single source of truth
4. Create abstraction layer if multiple legitimate variants needed

---

## 3. Consolidation Phase

### 3.1 App Consolidation Strategy

**For each duplicate app (qmoi-ai, qmoi-space, qcity, qvillage, qalpha):**

1. **Audit Entry Points**
   ```
   Primary:   /app/[app-name]/page.tsx (Next.js)
   Secondary: /pwa_apps/[app-name]/index.html (PWA)
   Fallback:  /public/[app-name].html (static)
   API:       /app/api/[app-name]/* (backend)
   ```

2. **Identify All Features**
   - Components used
   - API endpoints accessed
   - Permissions required
   - Database models
   - External services
   - Custom hooks/utilities

3. **Create Consolidated Version**
   - Keep primary entry point (Next.js page)
   - Move all features into centralized component library
   - Create unified style system
   - Document all entry points

4. **Update References**
   - Import from consolidated component location
   - Update API calls to use canonical endpoints
   - Redirect old entry points to new primary

5. **Verify & Delete**
   - Test all features work from primary entry point
   - Verify no dead links to deleted entry points
   - Delete redundant files
   - Update ROUTES.md, API.md, ALLMDFILESREFS.md

### 3.2 Component Library Consolidation

**Create centralized structure:**
```
lib/components/
├── common/               # Used by all apps
│   ├── Navigation/
│   ├── Layout/
│   ├── Cards/
│   ├── Forms/
│   ├── Modals/
│   └── ...
├── [app-name]/          # App-specific components
│   ├── Dashboard/
│   ├── Sidebar/
│   └── ...
└── index.ts             # Centralized exports
```

**For each component:**
1. Find all locations where similar component exists
2. Analyze differences and enhancements
3. Create consolidated version with ALL features
4. Update all imports across codebase
5. Delete old component files

### 3.3 API Route Consolidation

**Identify duplicate endpoints:**
```bash
# Find all route.ts files with similar patterns
find app/api src/app/api -name "route.ts" -exec grep -l "GET\|POST\|PUT\|DELETE" {} \;
```

**For each endpoint domain:**
1. Find all implementations (app/api/X, src/app/api/X, legacy handlers)
2. Compare logic and features
3. Create canonical version with all features merged
4. Create middleware/utils for shared business logic
5. Update references and delete duplicates

### 3.4 Configuration and Utils Consolidation

**Centralize:**
- Environment variables and config (one source)
- Theme/styling system (one theme provider)
- Utility functions (deduplicate helper functions)
- Constants and enums (centralized enum library)
- Hooks (custom React hooks library)

---

## 4. QCamera Enhancement

### 4.1 Current State Audit
```bash
# Find all qcamera references
grep -r "qcamera\|QCamera\|camera" --include="*.ts" --include="*.tsx" --include="*.md" | head -100
```

### 4.2 Hardware Feature Audit

**Verify all hardware features are implemented:**
- [ ] Video capture (multiple resolutions)
- [ ] Photo capture
- [ ] Night mode / IR camera support
- [ ] Zoom (digital and optical)
- [ ] HDR mode
- [ ] Motion detection
- [ ] Face detection/recognition
- [ ] QR code scanning
- [ ] AR overlay
- [ ] Real-time streaming
- [ ] Recording with audio
- [ ] Gallery integration
- [ ] Filter/effects
- [ ] Segmentation/object detection

### 4.3 Permissions Enhancement

**Ensure comprehensive permission handling:**
- [ ] Camera permission (iOS & Android)
- [ ] Microphone permission (for video)
- [ ] Storage read/write permission
- [ ] Location permission (metadata)
- [ ] Accessibility features
- [ ] Background execution permissions
- [ ] Privacy mask / obfuscation modes
- [ ] Biometric authentication for sensitive features

### 4.4 UI/UX Improvements

**Create cohesive camera interface:**
1. **Primary Controls**
   - Capture button (large, clear)
   - Mode switcher (photo/video)
   - Flash control
   - Camera flip (front/rear)
   - Settings access

2. **Secondary Controls**
   - Zoom slider
   - Filter picker
   - Timer/countdown
   - Batch mode (multiple captures)
   - Preview and edit

3. **Information Display**
   - Real-time metrics (FPS, resolution)
   - Battery status
   - Storage space
   - Permission status
   - Connection status (if streaming)

4. **Advanced Features**
   - History/gallery view
   - Export options
   - Sharing integration
   - Cloud sync status

### 4.5 Integration Points

**Ensure QCamera is accessible from:**
- [ ] Main dashboard
- [ ] Device management page
- [ ] Qcity monitoring interface
- [ ] Qvillage analytics
- [ ] Qmoi-space media section
- [ ] Emergency lockdown features
- [ ] Biometric enrollment

---

## 5. File Type Specific Handling

### TypeScript/JavaScript Files (.ts, .tsx, .js, .jsx)
```bash
# Find duplicates by content hash
find . -name "*.ts" -o -name "*.tsx" | xargs md5sum | sort | uniq -d -w32

# Look for similar structure
grep -r "export\|import\|interface\|type" app/ src/
```

**Action:** Consolidate to lib/, update imports, verify tests pass

### JSON Configuration Files (.json)
```bash
# Find config duplicates
find . -name "*.json" | xargs grep -l "config\|settings"
```

**Consolidate:** Use environment-specific config files, no duplication

### YAML Files (.yml, .yaml)
```bash
# Find deployment/workflow duplicates
find . -name "*.yml" -o -name "*.yaml"
```

**Action:** Centralize in one deploy configuration, reference everywhere

### Python Files (.py)
```bash
# Find duplicate automation/script logic
find scripts/ -name "*.py" | xargs grep -l "def\|class"
```

**Action:** Create shared utility module, refactor scripts

### Markdown Files (.md)
```bash
# Find content duplication
find . -name "*.md" -type f | xargs wc -l | sort -n
```

**Action:** Consolidate documentation, use cross-references

---

## 6. Merge Workflow Checklist

### Phase 1: Discovery & Cataloging
- [ ] Generate complete file tree with hashes
- [ ] Identify all duplicate sets
- [ ] Document entry points for each component
- [ ] Create duplicate matrix (which files duplicate which)
- [ ] Audit feature parity between versions

### Phase 2: Consolidation Prep
- [ ] Create consolidated component library structure
- [ ] Consolidate all shared utilities
- [ ] Create canonical versions of duplicate files
- [ ] Write migration guides for all consolidated pieces
- [ ] Update all import paths in test files

### Phase 3: Implementation
- [ ] Update components to import from consolidated lib/
- [ ] Update API routes to use canonical endpoints
- [ ] Test all functionality end-to-end
- [ ] Verify no broken links or dead code paths
- [ ] QCamera UI enhancement and full feature implementation

### Phase 4: Cleanup
- [ ] Remove all duplicate files (with backup)
- [ ] Remove now-unused directories
- [ ] Update ROUTES.md with final canonical routes
- [ ] Update API.md with consolidated endpoints
- [ ] Update ALLMDFILESREFS.md
- [ ] Run full test suite

### Phase 5: Verification
- [ ] All apps load without errors
- [ ] All features work from primary entry point
- [ ] No console errors/warnings about missing modules
- [ ] Performance metrics unchanged or improved
- [ ] Documentation is current and accurate

---

## 7. Safety Checks

### Before Deletion
1. **Search all references:**
   ```bash
   grep -r "filename" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json"
   ```

2. **Check git history:**
   ```bash
   git log --all --full-history -- path/to/file
   ```

3. **Verify in tests:**
   ```bash
   grep -r "filename" --include="*.test.ts" --include="*.spec.ts"
   ```

4. **Check dynamic imports:**
   ```bash
   grep -r "require(\|import(\|dynamicImport"
   ```

### Backup Strategy
1. Create branch: `merge/consolidation-[date]`
2. Make all changes on this branch
3. Test thoroughly
4. Create detailed commit messages
5. Only merge after full verification

---

## 8. Integration with Bulk Automation

**Add to bulk workflow (`resumefromhere.txt`):**
```
[MERGE PHASE]
1. Discovery: Scan duplicates (hourly stats)
2. Audit: Feature parity analysis
3. Consolidate: Merge into canonical versions
4. QCamera: Enhance UI and hardware features
5. Cleanup: Remove duplicates (with verification)
6. Verify: Full system test
7. Docs: Update all documentation
```

**Automation script tracks:**
- Duplicate file sets identified
- Merge candidates prioritized by impact
- Consolidation progress per component type
- QCamera enhancement checklist status
- Safety verification results

---

## 9. Success Criteria

- [ ] 0 duplicate app entry points (1 canonical per app)
- [ ] 0 duplicate components (centralized in lib/)
- [ ] 0 duplicate API endpoints (canonical routes only)
- [ ] 0 duplicate utility/helper functions
- [ ] QCamera fully featured and optimized
- [ ] All apps fully functional with new structure
- [ ] Test coverage maintained or improved
- [ ] Performance metrics stable or improved
- [ ] Documentation complete and current

---

## 10. Quick Reference Commands

```bash
# Find duplicate files by content
find . -type f -name "*.ts" -o -name "*.tsx" | xargs md5sum | sort | uniq -d -w32

# Find similarly named files
find . -type f \( -name "*component*" -o -name "*utils*" -o -name "*hooks*" \) | sort

# Search for import pattern
grep -r "from.*components\|from.*utils" --include="*.ts" --include="*.tsx" | sort | uniq -c | sort -rn

# List all app entry points
find app -name "page.tsx" | sort

# Find all API routes
find app/api src/app/api -name "route.ts" | sort

# QCamera references
grep -r "qcamera\|camera\|Camera" --include="*.ts" --include="*.tsx" --include="*.md" | grep -v node_modules

# Get file statistics
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | wc -l

# Create file inventory
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.json" | xargs ls -lh | awk '{print $5, $9}' | sort -k2
```

---

## 11. Monitoring & Reporting

**Track in `resumefromhere.txt`:**
```
MERGE STATS:
- Duplicates found: N
- Duplicates consolidated: N
- Files deleted: N
- Size saved: XMB
- Apps consolidated: N/5
- Components unified: N
- QCamera features: N/15
- Permissions: N/8
```

Update hourly during merge phase.

---

## 12. Post-Merge Tasks

1. **Update all documentation**
   - ROUTES.md: List all canonical routes
   - API.md: List all consolidated endpoints
   - ALLMDFILESREFS.md: Reflect new structure
   - App-specific guides: Point to primary entry points

2. **Update CI/CD**
   - Tests reflect new file structure
   - Build scripts use canonical paths
   - Deployment includes all consolidated features

3. **Update development guides**
   - Where to add new components
   - How to extend existing features
   - Contribution guidelines

---

Generated by bulk automation. Last updated: 2026-06-22
