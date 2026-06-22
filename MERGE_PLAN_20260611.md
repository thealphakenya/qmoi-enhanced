---
quantum-enabled: false
---

# QMOI App Consolidation Merge Plan - 2026-06-11

## Executive Summary
Consolidate 5 fragmented app shells (QCity, QAlpha, QVillage, QMOI Space, QMOI AI) and universal auth into single production-ready implementations with unified API routing, platform-specific features, and clean directory structure.

---

## Current Directory Duplication Analysis

### QCity
- **Canonical**: `app/qcity/page.tsx` → `src/qcity/QCityShell.tsx`
- **Legacy**: `qcity/` (3), `routes/qcity/` (5), `public/qcity/` (3)
- **Total Components in src/qcity**: 72 files
- **Status**: Heavily fragmented; ~100+ features across multiple files

### QAlpha  
- **Canonical**: `app/qalpha/page.tsx` → `src/components/qalpha/QAlphaShell.tsx`
- **Legacy**: None identified (minimal duplication)
- **Total Components**: 3 files
- **Status**: Cleanest; minimal duplication

### QVillage
- **Canonical**: `app/qvillage/page.tsx` → `src/components/qvillage/QVillageShell.tsx`
- **Legacy**: `qvillage/` (45 files with Python backend + Venv)
- **Total Components**: Mixed (Venv, models, test files)
- **Status**: Has standalone Python FastAPI backend; needs selective migration

### QMOI Space
- **Canonical**: `app/qmoi-space/page.tsx` → `src/components/qmoi/QMOISpaceShell.tsx`
- **Legacy**: `qmoi-space/` (4631 files - MASSIVE duplicate), `pwa_apps/qmoi-space/` (4)
- **Status**: Critical duplication; `qmoi-space/` appears to be pre-migration full app

### QMOI AI
- **Canonical**: `app/qmoi-ai/page.tsx` → `src/components/qmoi/QMOIAIShell.tsx`
- **Legacy**: `pwa_apps/qmoi-ai/` (8), `public/pwa_apps/qmoi-ai/` (8)
- **Status**: Legacy PWA duplicate; migration mostly complete

### API Routes
- **Production**: `src/app/api/` (43 active endpoints)
- **Legacy**: `app/api/` (266 handlers - backward compatibility)
- **Legacy**: `routes/api/qcity/` (8 endpoints)
- **Status**: Multiple implementations; unified routing needed

### Auth System
- **Unified**: `app/api/auth/*` + `src/app/api/auth/*` (11+ endpoint types)
- **Components**: `app/components/auth/*` + `src/components/auth/*` 
- **Status**: Mostly merged; minor path inconsistencies

---

## Merge Strategy

### Phase 1: Safe Inventory (No Deletion)
1. Audit all 14.txt tasks completion status
2. Extract unique features from legacy qmoi-space/ Python backend
3. Document all platform-specific code (Android, iOS, Windows, macOS, Linux)
4. Catalog all duplicated API endpoints

### Phase 2: Feature Consolidation
1. **QCity**: Merge `src/qcity/*` (72 files) into 1 cohesive shell + dashboard registry
2. **QAlpha**: No changes (already consolidated)
3. **QVillage**: Extract Python API if needed; keep `src/components/qvillage/` canonical
4. **QMOI Space**: Extract features from `qmoi-space/` → `src/components/qmoi/`
5. **QMOI AI**: Keep `src/components/qmoi/QMOIAIShell.tsx`; deprecate PWA duplicates

### Phase 3: API Route Consolidation
1. **Unify auth**: Consolidate `app/api/auth/` + `src/app/api/auth/` → single canonical set
2. **Unify QCity routes**: Consolidate `app/api/qcity/` + `routes/api/qcity/` → `src/app/api/qcity/`
3. **Unify QVillage routes**: Consolidate `app/api/qvillage/` + any in `routes/` → `src/app/api/qvillage/`
4. **Remove duplicates**: Eliminate overlapping endpoints (e.g., login, register, me)

### Phase 4: Platform-Specific Features
1. Identify all device-specific code: Android, iOS, Windows, macOS, Linux
2. Create platform-aware feature flags in auth/state
3. Apply to each shell with conditional rendering
4. Test theme + auth in all platform contexts

### Phase 5: Cleanup & Deletion
1. After features extracted, delete legacy directories:
   - `qcity/` (legacy)
   - `routes/qcity/` (legacy)
   - `public/qcity/` (keep minimal static assets)
   - `qmoi-space/` (4631 files - CRITICAL)
   - `pwa_apps/qmoi-ai/` (legacy)
   - `pwa_apps/qmoi-space/` (legacy)
   - `qvillage/` if Python backend extracted
2. Keep canonical directories only

---

## 14.txt Task Status & Action Items

### Completed (✅)
- [x] QAlpha Shell ThemeSelector import verified
- [x] Theme Provider configuration with 3 modes
- [x] UniversalRouteGuard implementation
- [x] QMoiMemoryPanel.tsx repair
- [x] Node/npm installation

### In Progress / Pending
- [ ] Update API.md with universal auth endpoints
- [ ] Update APIs_1.md with complete auth flow
- [ ] Update ENDPOINTS.md with merged route list
- [ ] Update ROUTES.md with consolidated routing
- [ ] Update STYLES.md with theme architecture
- [ ] Update UNIVERSAL.md with cross-app awareness
- [ ] Update QMOIAIUI.md, QMOISPACEUI.md, QCITYUI.md, QVILLAGEUI.md, QALPHAUI.md
- [ ] Verify theme in all shells (dark/light/high-contrast)
- [ ] Complete auth endpoint testing (login, register, logout, refresh, verify-email, etc.)
- [ ] Implement biometric auth endpoints
- [ ] Implement privacy mask support
- [ ] Implement parallel session support
- [ ] Implement QM OI memory-sync

---

## File Deletion Candidates (Safe to Remove After Merge)

**Critical Size (Delete First)**
- `qmoi-space/` - 4631 files (must extract features first)

**High Priority (Legacy)**
- `routes/api/qcity/` - 8 endpoints (duplicate)
- `routes/qcity/` - legacy route handlers
- `qcity/` - 3 files (legacy)
- `qvillage/.venv/` - Python venv (4000+ files)

**Medium Priority (PWA Duplicates)**
- `pwa_apps/qmoi-ai/` - 8 files
- `pwa_apps/qmoi-space/` - 4 files
- `public/pwa_apps/qmoi-ai/` - 8 files (keep 1 copy only)
- `public/pwa_apps/qmoi-space/` - 4 files (keep 1 copy only)

**Low Priority (Static Assets - Keep)**
- `public/qcity/` - minimal JS/CSS assets

---

## Next Steps (Execution Order)

1. ✅ Repair broken components (QMoiMemoryPanel.tsx)
2. ✅ Install Node/npm
3. **→ Update resumefromhere.txt with this plan**
4. **→ Complete all 14.txt documentation updates**
5. **→ Run comprehensive type-check**
6. **→ Extract features from legacy qmoi-space/**
7. **→ Consolidate QCity components**
8. **→ Merge API routes (app/api/ → src/app/api/)**
9. **→ Implement platform-specific features**
10. **→ Delete legacy directories** (qmoi-space/, routes/qcity/, etc.)
11. **→ Final validation and build**

---

## Risk Mitigation

- **Backup before merge**: All deletions happen AFTER feature extraction
- **Git tracking**: Each major consolidation should be a separate commit
- **Type safety**: Run `npm run type-check` after each merge phase
- **Production readiness**: Tag as production-ready only after full test suite passes

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T16:03:55.720749Z
- production status: ⚠️ mixed production markers
- status tags: mixed, nonproduction, production, review
- lines: 164
- words: 842
- characters: 6431
- headings: 22
- links: 0
- images: 0
- tables: 0
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
