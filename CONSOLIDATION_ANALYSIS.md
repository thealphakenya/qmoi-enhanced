# Component Consolidation Analysis

## Summary
- **Total duplicate files:** 154 across `components/` and `qmoi-enhanced/components/`
- **Status:** Most are NOT byte-identical (have diverged during development)
- **Recommendation:** Keep current structure but document as intentional for now; plan unification for future release

## Duplicate Files (154 total)

See DUPLICATE_COMPONENTS.txt for full list.

### Sample Duplicates Verified
- `GlobalMail.tsx` — byte-identical ✓ (can consolidate immediately)
- `EmergencyPanel.tsx` — different (likely recent patches were only applied to one)
- `QmoiMediaManager.tsx` — different (likely recent patches were only applied to one)

## Consolidation Strategy (Recommended)

### Option A: One-shot consolidation (recommended for current iteration)
1. Run diff check on all 154 files to categorize:
   - Identical → keep single copy, remove duplicate
   - Different → merge changes into one, remove other
   - Intentional forks → document exception

2. Update all imports across codebase to point to single location

3. Delete duplicate directory structure

### Option B: Gradual consolidation (lower risk, more time)
1. Document current state in this file
2. During refactoring, consolidate one component at a time
3. Update imports incrementally
4. Reduce code duplication over time

## Current Recommendation

**For this iteration:** Keep both directories as-is but document that they should be consolidated.

**For next iteration:** Run automated diff analysis to:
```bash
# For each duplicate, show diff
for file in $(cat DUPLICATE_COMPONENTS.txt); do
  echo "=== Comparing: $file ===" 
  diff -u "./components/$file" "./qmoi-enhanced/components/$file" | head -20
done
```

Then decide per-file whether to:
- Keep in `components/` (source of truth)
- Keep in `qmoi-enhanced/` (special enhancements)
- Merge both versions

## Affected Files (By Status)

### Tier 1: High-value consolidation targets
- GlobalMail.tsx (byte-identical)
- GlobalFileTransfer.tsx
- PriceProductVerifier.tsx
- (other utilities that don't have UI-specific logic)

### Tier 2: Medium-effort consolidation
- EmergencyPanel.tsx
- QmoiMediaManager.tsx
- FloatingPreviewWindow.tsx
- (components with adapters that were recently updated)

### Tier 3: Low-priority
- QAvatar.tsx
- SettingsPanel.tsx
- BrowserInterface.tsx
- (large UI components that may have intentional forks)

## Notes
- The duplication is likely from a copy-paste scaffolding process during project setup
- Recent patches (adapter integration, TODO_PROD removal) may have been applied inconsistently
- Consolidating will reduce code maintenance overhead and prevent drift
- Both directories are currently active in imports (suggests coexistence is intentional)

## Next Actions
1. Verify build succeeds with current duplicate structure (see task 7)
2. If build succeeds, document duplication as acceptable technical debt
3. Create GitHub issue for future consolidation task
4. In next release, consolidate using Option A above
