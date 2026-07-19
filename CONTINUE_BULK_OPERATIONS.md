# Continue Integration Guide for QMOI Bulk Operations

## How Continue Works with Ollama in Bulk Mode

### Architecture

```
VS Code IDE
    ↓
Continue Extension (Custom Commands)
    ↓
Ollama API (localhost:11434)
    ↓
qwen2.5-coder:3b Model (3B parameters)
    ↓
Auto-Continue Daemon (Health Monitoring)
    ↓
Processing Results → Back to Continue
```

### Key Integration Points

1. **Continue Configuration** (`.continue/config.json`)
   - Model provider: `ollama`
   - API endpoint: `localhost:11434`
   - System message: Specialized for bulk operations
   - Custom commands: 8 bulk operations configured

2. **Ollama Service** (`localhost:11434`)
   - Installed automatically
   - Health checked every 10 seconds
   - Auto-restarts on failure
   - Model loaded in persistent volume

3. **Auto-Continue Daemon** (`.devcontainer/auto-continue-daemon.sh`)
   - Monitors health 24/7
   - Restarts on failure
   - Logs all events
   - Transparent to user

---

## Continue Custom Commands Reference

### 1. @bulk-consolidate-api

**Purpose:** Consolidate all API documentation files

**What It Does:**
```
INPUT:  API*.md, APIs_*.md, ENDPOINT*.md, ROUTE*.md (scattered files)
         ↓
PROCESS: 1. Find all API documentation files
         2. Read current canonical files (API.md, ENDPOINTS.md, ROUTES.md)
         3. Merge all unique endpoints
         4. Remove duplicates
         5. Update cross-references
         ↓
OUTPUT: Updated API.md, ENDPOINTS.md, ROUTES.md
        All endpoints consolidated
        Cross-references updated
```

**Usage in Continue:**
```
You: @bulk-consolidate-api

Continue processes and consolidates all API documentation.
Output shows:
- Files merged
- Endpoints consolidated
- Cross-references updated
- Summary of changes
```

**Time:** 5-10 minutes
**Files Changed:** 3+ files
**Risk Level:** Low (consolidation only)

---

### 2. @bulk-merge-routes

**Purpose:** Merge duplicate route handlers

**What It Does:**
```
INPUT:  app/api/route.ts + src/app/api/route.ts (duplicates)
         ↓
PROCESS: 1. Find duplicate route patterns
         2. Compare implementations
         3. Select best version
         4. Merge unique logic
         5. Delete duplicates
         6. Update all imports
         ↓
OUTPUT: Single canonical route
        All logic preserved
        No duplicates
```

**Usage:**
```
You: @bulk-merge-routes

Continue identifies duplicates and consolidates.
Output shows:
- Duplicate pairs found
- Merges completed
- Files deleted
- Import updates
```

**Time:** 10-15 minutes
**Files Changed:** 10-50 files
**Risk Level:** Medium (test after)

---

### 3. @bulk-update-docs

**Purpose:** Synchronize all markdown documentation

**What It Does:**
```
INPUT:  All .md files vs. current code
         ↓
PROCESS: 1. Verify each described endpoint exists
         2. Check ROUTES.md against app routes
         3. Fix broken links
         4. Add missing documentation
         5. Update examples
         ↓
OUTPUT: Consistent documentation
        All links working
        Current with code
```

**Usage:**
```
You: @bulk-update-docs

Continue syncs all documentation with code.
Output shows:
- Files updated
- Links fixed
- Missing sections added
- Summary of changes
```

**Time:** 10-15 minutes
**Files Changed:** 5-10 markdown files
**Risk Level:** Very Low (documentation only)

---

### 4. @bulk-inventory-wallets

**Purpose:** Create comprehensive wallet/account inventory

**What It Does:**
```
INPUT:  *wallet*.md, *account*.md, *balance*.md, etc. (scattered files)
         ↓
PROCESS: 1. Find all wallet-related files
         2. Find all account-related files
         3. Find all balance-related files
         4. Map relationships
         5. Create inventory JSON
         ↓
OUTPUT: WALLET_INVENTORY.md
        inventory.json
        Complete mapping
```

**Usage:**
```
You: @bulk-inventory-wallets

Continue creates comprehensive inventory.
Output shows:
- Files discovered
- Relationships mapped
- Inventory saved
- Summary with counts
```

**Time:** 5 minutes
**Files Created:** 2 files
**Risk Level:** Very Low

---

### 5. @bulk-universal-auth

**Purpose:** Implement universal authentication

**What It Does:**
```
INPUT:  Auth requirements from 14.txt
         ↓
PROCESS: 1. Create login/logout endpoints
         2. Create register endpoint
         3. Create password recovery
         4. Create email verification
         5. Create session refresh
         6. Create biometric auth
         7. Ensure consistency across all apps
         8. Update documentation
         ↓
OUTPUT: Complete auth system
        All apps use same auth
        All flows implemented
        Full documentation
```

**Usage:**
```
You: @bulk-universal-auth

Continue implements universal auth across all apps.
Output shows:
- Endpoints created
- Apps updated
- Documentation generated
- Implementation summary
```

**Time:** 20-30 minutes
**Files Changed:** 15-30 files
**Risk Level:** High (test thoroughly)

---

### 6. @bulk-trading-features

**Purpose:** Implement 30 trading features

**What It Does:**
```
INPUT:  Trading features list from 7.txt
         ↓
PROCESS: 1. Spot Trading module
         2. Futures Trading module
         3. Options Trading module
         4. Grid Trading module
         5. Arbitrage module
         6. Market Making module
         7. ... [24 more modules]
         30. AI Self-Improvement module
         
         For each: Error handling, logging, tests, docs
         ↓
OUTPUT: 30 production-ready modules
        All with tests
        Complete documentation
        API endpoints
```

**Usage:**
```
You: @bulk-trading-features

Continue implements all 30 trading features.
Output shows (in order):
- Feature implemented
- Tests written
- Documentation added
- [Repeat for all 30]
```

**Time:** 30-60 minutes
**Files Changed:** 50-100 files
**Risk Level:** Very High (comprehensive testing needed)

---

### 7. @bulk-theme-integration

**Purpose:** Verify theme system works

**What It Does:**
```
INPUT:  All app shells and theme components
         ↓
PROCESS: 1. Verify ThemeSelector in all shells
         2. Test dark/light/high-contrast themes
         3. Verify persistence
         4. Test navigation consistency
         5. Test all UI components
         ↓
OUTPUT: Verified theme system
        Working across all apps
        Persistent settings
```

**Usage:**
```
You: @bulk-theme-integration

Continue verifies theme system.
Output shows:
- Theme in [App 1]
- Theme in [App 2]
- ... [All apps]
- Persistence verified
- All tests passed
```

**Time:** 5-10 minutes
**Files Changed:** 0 (verification only)
**Risk Level:** Very Low

---

### 8. @bulk-continue-optimization

**Purpose:** Optimize Continue integration

**What It Does:**
```
INPUT:  Current Continue setup
         ↓
PROCESS: 1. Ensure context preservation
         2. Enable multi-file refactoring
         3. Add bulk operation logging
         4. Create pause/resume capability
         5. Optimize token usage
         6. Add auto-testing
         7. Document best practices
         ↓
OUTPUT: Optimized Continue setup
        Better performance
        Complete documentation
```

**Usage:**
```
You: @bulk-continue-optimization

Continue optimizes its own integration.
Output shows:
- Optimizations applied
- Performance improvements
- Documentation updated
- Summary of enhancements
```

**Time:** 5 minutes
**Files Changed:** 2-3 files
**Risk Level:** Low

---

## Step-by-Step Bulk Workflow

### Workflow 1: Complete Full Pass (120-180 min)

```
Step 1: API & Route Consolidation (30 min)
┌─────────────────────────────────────────┐
│ You: @bulk-consolidate-api              │
│ Continue consolidates API documentation │
│ Wait for: ✓ Complete                    │
│ Verify: git diff API*.md                │
│ Commit: git commit -m "bulk: api cons"  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ You: @bulk-merge-routes                 │
│ Continue merges duplicate routes        │
│ Wait for: ✓ Complete                    │
│ Verify: npm test                        │
│ Commit: git commit -m "bulk: route merge"
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ You: @bulk-update-docs                  │
│ Continue syncs documentation            │
│ Wait for: ✓ Complete                    │
│ Verify: Check *.md files                │
│ Commit: git commit -m "bulk: doc sync"  │
└─────────────────────────────────────────┘

Step 2: Feature Implementation (60-90 min)
┌─────────────────────────────────────────┐
│ You: @bulk-universal-auth               │
│ Continue implements auth across all apps│
│ Wait for: ✓ Complete                    │
│ Verify: npm test                        │
│ Commit: git commit -m "bulk: auth impl" │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ You: @bulk-trading-features             │
│ Continue implements 30 trading features │
│ Wait for: ✓ Complete                    │
│ Verify: npm test                        │
│ Commit: git commit -m "bulk: trading"   │
└─────────────────────────────────────────┘

Step 3: Verification (15 min)
┌─────────────────────────────────────────┐
│ You: @bulk-inventory-wallets            │
│ Continue creates inventory              │
│ Wait for: ✓ Complete                    │
│ Verify: Check WALLET_INVENTORY.md       │
│ Commit: git commit -m "bulk: inventory" │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ You: @bulk-continue-optimization       │
│ Continue optimizes its own setup        │
│ Wait for: ✓ Complete                    │
│ Commit: git commit -m "bulk: optimize"  │
└─────────────────────────────────────────┘

Final: Update Progress
┌─────────────────────────────────────────┐
│ Update resumefromhere.txt with status   │
│ Run: python3 scripts/auto_continue...   │
│ Push: git push                          │
└─────────────────────────────────────────┘
```

### Workflow 2: Quick Pass (30 min)

```
Just consolidate and sync:
@bulk-consolidate-api
@bulk-merge-routes
@bulk-update-docs
```

### Workflow 3: Feature Pass (60 min)

```
Just implement features:
@bulk-universal-auth
@bulk-trading-features
```

---

## Continue Best Practices

### 1. Provide Full Context
```
Good:
"Consolidate these API files:
- FILE1: app/api/auth/route.ts
- FILE2: src/app/api/auth/route.ts
Merge all unique logic, keep best error handling."

Bad:
"Consolidate API files"
```

### 2. Use File Context
```
In Continue chat:
@file path/to/file1.ts
@file path/to/file2.ts
@bulk-merge-routes

# Now Continue has full context of both files
```

### 3. Monitor Progress
```
Continue chat shows:
✓ Task 1 complete
✓ Task 2 complete
...
✓ All tasks complete

Check status dashboard in parallel:
bash .devcontainer/status-dashboard.sh --watch
```

### 4. Verify After Each Command
```
@bulk-consolidate-api
[Wait for completion]
git diff --stat
npm test
git commit -m "bulk: api consolidation"

@bulk-merge-routes
[Wait for completion]
git diff --stat
npm test
git commit -m "bulk: route merge"
```

### 5. Handle Large Bulk Operations
For very large operations (like @bulk-trading-features):

```
Option 1: Full Pass
@bulk-trading-features
Wait 30-60 minutes for all 30 features

Option 2: Chunked Pass
@bulk-trading-features (for features 1-15)
git commit
@bulk-trading-features (for features 16-30)
git commit
```

---

## Troubleshooting

### Continue Won't Connect to Ollama
```
Check:
1. Is Ollama running?
   bash .devcontainer/status-dashboard.sh
   
2. Is port 11434 open?
   netstat -an | grep 11434
   
3. Is Continue config correct?
   cat ~/.continue/config.json | grep ollama
   
4. Restart Continue:
   - Close VS Code
   - Wait 5 seconds
   - Open VS Code
   - Try again
```

### Bulk Operation Hangs
```
Monitor:
1. Check Ollama health
   curl http://localhost:11434/api/tags
   
2. Check daemon logs
   tail -f $HOME/.ollama/logs/auto-continue.log
   
3. Check system resources
   free -h
   top
   
4. If no response after 10 min:
   - Press Ctrl+C in Continue
   - Daemon will auto-restart Ollama
   - Try again
```

### Continue Loses Context
```
Solution:
1. Re-open Continue panel
2. Use @file to reload files
3. Restart bulk command
4. progress saved in resumefromhere.txt
```

### Files Not Updated
```
Check:
1. Is git clean?
   git status
   
2. Are file permissions correct?
   ls -la [file]
   
3. Did bulk command complete?
   Check Continue output for ✓ Complete
   
4. Manual verification:
   git diff [file]
```

---

## Integration with Auto-Continue Daemon

The daemon works **transparently** during bulk operations:

```
You: @bulk-consolidate-api
     ↓
Continue → Ollama
     ↓
[If Ollama crashes]
     ↓
Daemon detects failure
     ↓
Daemon restarts Ollama
     ↓
Continue auto-reconnects
     ↓
Bulk operation continues
     ↓
No manual intervention needed
```

### What Happens If Ollama Crashes During Bulk Work

```
1. Auto-detect (< 10 seconds)
2. Daemon restarts Ollama (< 5 seconds)
3. Model loads from cache (< 3 seconds)
4. Ollama ready again (< 2 seconds)
5. Continue auto-reconnects
6. Bulk operation resumes

Total recovery time: < 20 seconds
Your work: Uninterrupted ✓
```

---

## Performance Tips

### 1. Keep Dashboard Running
```bash
# Terminal 1
bash .devcontainer/status-dashboard.sh --watch

Shows real-time status, resources, Ollama health
```

### 2. Monitor Git Changes
```bash
# Terminal 2
watch -n 1 'git status --short | wc -l'

Shows how many files being modified
```

### 3. Commit Frequently
```bash
# After each bulk command
git add .
git commit -m "bulk: [operation] - [description]"
git push

Keeps history clean, enables easy rollback
```

### 4. Use Separate Terminals
```bash
# Terminal 1: Dashboard
bash .devcontainer/status-dashboard.sh --watch

# Terminal 2: VS Code (Continue)
code .

# Terminal 3: Monitoring
tail -f $HOME/.ollama/logs/auto-continue.log

# Terminal 4: Git operations
git status
git diff
```

### 5. Take Breaks Between Large Operations
```
@bulk-consolidate-api (30 min) → Commit
[5 min break]
@bulk-merge-routes (15 min) → Commit
[5 min break]
@bulk-universal-auth (30 min) → Commit
[longer break]
@bulk-trading-features (60 min) → Commit
```

---

## Complete Integration Checklist

Before starting bulk work:

- [ ] Ollama installed and running (`bash .devcontainer/status-dashboard.sh`)
- [ ] Auto-continue daemon active (`pgrep -f auto-continue-daemon`)
- [ ] Continue extension installed (Check VS Code extensions)
- [ ] `.continue/config.json` properly configured
- [ ] All custom bulk commands available in Continue
- [ ] resumefromhere.txt accessible
- [ ] Git repository clean (`git status`)
- [ ] 7.txt and 14.txt ready for reference
- [ ] Dashboard running in separate terminal
- [ ] Test suite available (`npm test`)

---

## Ready to Start Bulk Work!

```
1. Open Continue in VS Code
2. Type: @bulk-consolidate-api
3. Let bulk processing begin
4. Monitor with dashboard
5. Commit when complete
6. Repeat with next command

Total time for complete bulk pass: 2-3 hours
Effort required: Minimal
Results: Production-ready system ✓
```

🚀 **Start bulk continuation now!**

---

**Next Steps:**
1. Read BULK_CONTINUATION_COMPLETE.md for workflow overview
2. Check CONTINUE_BULK_GUIDE.md for detailed guide
3. Start with: `@bulk-consolidate-api`
4. Monitor with: `bash .devcontainer/status-dashboard.sh --watch`

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:40.758176Z
- production status: ✅ production-ready
- status tags: production, production-ready
- lines: 733
- words: 2051
- characters: 15996
- headings: 47
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
