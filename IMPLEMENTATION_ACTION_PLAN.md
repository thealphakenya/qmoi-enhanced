<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.616352Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# IMPLEMENTATION ACTION PLAN - Links & Domains Enhancement (Next Steps)

## Overview
This document provides step-by-step instructions for completing the Links & Domains enhancement project. Work can start immediately on Phases 1-4 while DNS fix happens in parallel.

---

## CRITICAL PATH (Must Do First)

### ✅ DONE (Foundation Complete)
- ✅ Link validation system built
- ✅ Domain health checker built & executed
- ✅ Domain registry initialized
- ✅ Documentation audit complete
- ✅ API endpoints created
- ✅ Fallback chains configured

### 🚨 IMMEDIATE (Parallel tasks - start now)

#### TASK 1: Fix DNS Zone Configuration (Parallel - 1-2 hours)
**Status**: BLOCKING but can work on other tasks simultaneously  
**Responsible**: Manual (requires registrar access)

**Steps**:
1. Log into domain registrar account for `qmoi.ai`
2. Go to DNS Zone Management / Records section
3. Verify these A records exist (should point to your server IP):
   - qmoi.ai
   - *.qmoi.ai (wildcard for all subdomains)
   - qshare.qvillage.com (explicit, if not covered by wildcard)
   - qstore.qvillage.com (explicit)
   - qcity.qmoi.ai
   - qmoi-space.qmoi.ai
   - yap.qmoi.ai
   - q-stable.qmoi.ai

4. If missing, add A records pointing to your server's IP address
5. Wait for DNS propagation (usually 5-15 minutes)
6. Test using terminal:
   ```bash
   nslookup qmoi.ai
   nslookup qshare.qvillage.com
   nslookup qstore.qvillage.com
   # Should show IP address, not NXDOMAIN or ERR_NAME_NOT_RESOLVED
   ```

7. Once resolved, run health checker to verify:
   ```bash
   python3 scripts/domain_health_check_advanced.py
   # Should show all .qmoi.ai domains in HEALTHY status
   ```

**Fallback while waiting**: Work on Phases 1-4 below. Fallback chains are active.

---

## IMPLEMENTATION PHASES (Start now, parallel to DNS fix)

### PHASE 1: Fix Domain Reference Links (1 hour)

**Objective**: Replace bare domain references with full URLs using fallback chains

**Problem Links** (examples):
- "qcity" → should be "qcity.qmoi.ai" (or fallback)
- "qmoi-space" → should be "qmoi-space.qmoi.ai" (or fallback)
- "yap" → should be "yap.qmoi.ai" (or fallback)
- "q-stable" → should be "q-stable.qmoi.ai" (or fallback)

**Count**: ~200 links to fix (119 qcity + 61 qmoi-space + others)

**Execution**:
```bash
# Run the fix script with domain reference focus
python3 scripts/validate_and_sync_links.py --action fix-domains --domain qcity <br/>
python3 scripts/validate_and_sync_links.py --action fix-domains --domain qmoi-space
python3 scripts/validate_and_sync_links.py --action fix-domains --domain yap
python3 scripts/validate_and_sync_links.py --action fix-domains --domain q-stable
```

**Verification**:
```bash
# Run audit to check progress
python3 scripts/documentation_audit_and_fix.py --action audit --output phase1_results.json
# Should show reduction in qcity, qmoi-space, yap, q-stable broken links
```

**Expected Result**: 200 links fixed ✅

---

### PHASE 2: Fix Invalid Internal References (2-3 hours)

**Objective**: Map non-existent internal references to actual file paths or provide alternatives

#### Task 2A: Fix "qmoi_validation" references (1,078 links)
**Problem**: References to "qmoi_validation" but file/path doesn't exist clearly

**Steps**:
1. Search for all files with "validation" in workspace:
   ```bash
   find /workspaces/qmoi-enhanced -type f -name "*validation*" | head -20
   ```

2. Identify the correct file/directory:
   ```bash
   ls -la | grep -i validation
   ```

3. Create mapping file `fix_mappings.json`:
   ```json
   {
     "qmoi_validation": "path/to/actual/validation/file",
     "[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)": "path/to/validation/frontmatter"
   }
   ```

4. Run replacement script:
   ```bash
   python3 -c "
   import json
   import os
   import glob
   
   # Load mappings
   mappings = json.load(open('fix_mappings.json'))
   
   # Find and replace in all .md files
   for md_file in glob.glob('**/*.md', recursive=True):
       with open(md_file, 'r') as f:
           content = f.read()
       
       for old, new in mappings.items():
           content = content.replace(old, new)
       
       with open(md_file, 'w') as f:
           f.write(content)
   
   print(f'Updated mappings in files')
   "
   ```

#### Task 2B: Fix "qmoi-enhanced" references (796 links)
**Problem**: Incomplete path references to qmoi-enhanced directory

**Steps**:
1. These likely should reference specific files in qmoi-enhanced, not bare directory name
2. Analyze usage context (check a few examples):
   ```bash
   grep -r "qmoi-enhanced" --include="*.md" | head -5
   ```

3. Based on context, replace with appropriate paths:
   ```bash
   # Likely need to specify the actual resource:
   # qmoi-enhanced → /qmoi-enhanced/README.md
   # qmoi-enhanced → qmoi-enhanced project reference link
   ```

4. Run contextual replacement (may need manual review)

#### Task 2C: Fix ambiguous "qmoi" references (251 links)
**Problem**: Plain "qmoi" reference is ambiguous - could be qmoi.ai, qvillage.com, or internal reference

**Steps**:
1. Manual spot-check each occurrence (251 is manageable):
   ```bash
   grep -rn "\\bqmoi\\b" --include="*.md" | head -20
   ```

2. For each type, create standardized replacement:
   - If referring to the application: "QMOI application" or "qmoi.ai"
   - If referring to website: "qmoi.ai" or "qvillage.com"
   - If referring to the vault: "QMOI Vault" or specific reference

3. Execute replacements with context awareness

**Expected Result**: 2,554 links fixed (1,078 + 796 + 680) ✅

---

### PHASE 3: Fix App Download Links (30 minutes)

**Objective**: Replace broken .exe/.apk references with working QStore URLs

**Problem Links** (examples):
- "qmoi_ai.exe" → should link to QStore download page
- "qmoi_ai.apk" → should link to Android app store page

**Count**: ~80 links (42 .exe + 38 .apk)

**Execution**:
```bash
# Create download link mapping
python3 -c "
import glob

exe_url = 'qstore.qvillage.com
apk_url = 'qstore.qvillage.com'

for md_file in glob.glob('**/*.md', recursive=True):
    with open(md_file, 'r') as f:
        content = f.read()
    
    # Replace download references
    content = content.replace('qmoi_ai.exe', exe_url)
    content = content.replace('qmoi_ai.apk', apk_url)
    
    with open(md_file, 'w') as f:
        f.write(content)

print('Updated app download links')
"
```

**Verification**:
```bash
# Check that old references are gone
grep -r "qmoi_ai.exe" --include="*.md" | wc -l  # Should be 0
grep -r "qmoi_ai.apk" --include="*.md" | wc -l  # Should be 0
```

**Expected Result**: All .exe/.apk refs pointing to QStore ✅

---

### PHASE 4: Remove production URLs (30 minutes)

**Objective**: Replace localhost references with production domains

**Problem Links** (examples):
- "https://qmoi.ai" → should be production URL
- "localhost:8000" → should be production URL

**Count**: ~58 links

**Execution**:
```bash
# Replace localhost references
python3 -c "
import glob

for md_file in glob.glob('**/*.md', recursive=True):
    with open(md_file, 'r') as f:
        content = f.read()
    
    # Replace localhost references with production domain
    content = content.replace('https://qmoi.ai', 'https://qvillage.com')
    content = content.replace('http://localhost:8000', 'https://qvillage.com/api')
    content = content.replace('qmoi.ai', 'qvillage.com')
    content = content.replace('localhost:8000', 'qvillage.com/api')
    
    with open(md_file, 'w') as f:
        f.write(content)

print('Removed localhost references')
"
```

**Verification**:
```bash
# Check for remaining localhost refs
grep -r "localhost" --include="*.md" | wc -l  # Should be 0
```

**Expected Result**: No localhost refs in production docs ✅

---

### PHASE 5: Enhance QMOIMasterDashboard.tsx (2-3 hours)

**Objective**: Add Link Management and Domain Health visual tabs to dashboard

**Location**: `components/QMOIMasterDashboard.tsx`

**New Tabs to Add**:
1. **Link Management Tab**
   - Show total links: 31,061
   - Show valid/broken ratio
   - Show top broken link patterns
   - Button to run link audit
   - Manual link fix controls

2. **Domain Health Tab**
   - Show all 13 domains with status indicators
   - Display response times
   - Show regional health (US/EU/ASIA/AU)
   - Active fallback chains
   - Manual failover controls
   - Fallback chain visualization

**Implementation Steps**:

1. **Import new components**:
   ```typescript
   import { CentralLinkValidator } from '@/lib/qmoi/central-link-validator';
   import { DOMAIN_REGISTRY } from '@/lib/qmoi/domain_registry';
   ```

2. **Add state for link/domain data**:
   ```typescript
   const [linkStatus, setLinkStatus] = useState(null);
   const [domainHealth, setDomainHealth] = useState(null);
   ```

3. **Create Link Management Tab**:
   ```typescript
   <Tab label="Link Management">
     <LinkManagementPanel 
       totalLinks={31061}
       validLinks={18271}
       onRunAudit={handleAuditLinks}
     />
   </Tab>
   ```

4. **Create Domain Health Tab**:
   ```typescript
   <Tab label="Domain Health">
     <DomainHealthPanel 
       domains={DOMAIN_REGISTRY}
       onRefresh={handleRefreshHealth}
     />
   </Tab>
   ```

5. **Add API calls to fetch real-time data**:
   ```typescript
   useEffect(() => {
     fetchDomainHealth();
     fetchLinkStatus();
   }, []);

   const fetchDomainHealth = async () => {
     const response = await fetch('/api/domains/health?action=critical');
     setDomainHealth(await response.json());
   };

   const fetchLinkStatus = async () => {
     const response = await fetch('/api/links/validate?action=status');
     setLinkStatus(await response.json());
   };
   ```

6. **Add refresh/manual controls**:
   - Run link audit button → calls `/api/links/validate?action=audit`
   - Refresh health button → calls `/api/domains/health?action=critical`
   - Manual failover selector → calls `/api/domains/health?action=failover`

**Expected Result**: Full visual dashboard for link/domain management ✅

---

## VERIFICATION & TESTING

### After Each Phase, Run:
```bash
# Re-scan documentation to verify progress
python3 scripts/documentation_audit_and_fix.py --action audit

# Check specific broken link counts
python3 -c "
import json
with open('documentation_audit_report.json') as f:
    report = json.load(f)
    print(f'Broken links: {report[\"broken_links_count\"]}')
    print(f'Valid links: {report[\"valid_links_count\"]}')
    print(f'Broken percentage: {report[\"broken_percentage\"]}%')
"
```

### Expected Progress:
- Phase 1: 12,790 → 12,590 (200 fixed)
- Phase 2: 12,590 → 10,036 (2,554 fixed)
- Phase 3: 10,036 → 9,956 (80 fixed)
- Phase 4: 9,956 → 9,898 (58 fixed)
- **Final**: 9,898 broken (68% reduction, from 41% to ~32%)

### Health Check After DNS Fix:
```bash
python3 scripts/domain_health_check_advanced.py
# Expected: All 13 domains HEALTHY ✅
```

---

## API Integration Testing

Once implementation phases are complete, test the new API endpoints:

```bash
# Test link validation endpoint
curl -X POST https://qmoi.ai/api/links/validate \
  -H "Content-Type: application/json" \
  -d '{
    "links": ["https://qvillage.com", "https://qmoi.ai"],
    "action": "validate"
  }'

# Test domain health endpoint
curl "https://qmoi.ai/api/domains/health?action=critical"

# Expected responses: Full health/validation data
```

---

## TIMELINE & MILESTONES

| Task | Duration | Blocker | Dependency |
|------|----------|---------|------------|
| DNS Fix (parallel) | 1-2 hours | YES | None |
| Phase 1 (domains) | 1 hour | NO | None |
| Phase 2 (internal) | 2-3 hours | NO | Phase 1 |
| Phase 3 (downloads) | 30 min | NO | Phase 1 |
| Phase 4 (localhost) | 30 min | NO | Phases 1-3 |
| Phase 5 (dashboard) | 2-3 hours | NO | Phases 1-4 + API working |
| **Total** | **8-10 hours** | | |

**Recommended Order**:
1. Start DNS fix (manual, time-consuming, can parallelize)
2. Execute Phases 1-4 (automation scripts, can run quickly)
3. Test and verify all links fixed
4. Enhance dashboard once links/domains stable
5. Deploy to production

---

## ROLLBACK PROCEDURES

If errors occur during execution:

```bash
# Restore from git before running fixes
git status  # Check what changed
git diff --stat  # See changed files
git checkout -- <filename>  # Restore single file
git checkout -- .  # Restore all files

# Never run without verification first
```

---

## SUCCESS CRITERIA

✅ **Project Complete When**:
- All 13 domains resolving correctly (9/13 → 13/13)
- Broken links <5% (<1,550 of 31,061)
- All internal references fixed
- No localhost URLs in docs
- Dashboard showing real-time health and link status
- All APIs operational and tested
- production deployment ready

---

## Sign-Off

**Created**: 2026-03-21  
**Status**: Ready for implementation  
**Next Session Action**: Execute DNS fix + Phase 1 link repairs  
**Estimated Completion**: 8-10 hours from start of implementation  

**All tools, code, and strategies are ready. Begin Phase 1 when ready! 🚀**

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:10Z

---
*This document is maintained by QMOI's autonomous evolution system*
