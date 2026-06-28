# Continue Extension Bulk Configuration for QMOI

This configuration enables Continue to work optimally in bulk with Ollama for:
- API consolidation and documentation
- Duplicate module merging
- Wallet/account inventory
- Multi-file refactoring
- Automated documentation updates
- Route and endpoint consolidation

## Continue Config Setup for Bulk Work

Save this configuration to Continue settings to enable bulk processing:

```json
{
  "models": [
    {
      "title": "Local Qwen Coder (Bulk)",
      "provider": "ollama",
      "model": "qwen2.5-coder:3b",
      "systemMessage": "You are an expert bulk code processor for QMOI. Your role is to consolidate, merge, and refactor large numbers of files while maintaining consistency. Work systematically through all backlog items without skipping any. Focus on:\n1. Consolidating duplicate code\n2. Merging similar routes and endpoints\n3. Updating documentation automatically\n4. Maintaining cross-file consistency\n5. Following the QMOI architecture patterns\nAlways preserve the original functionality while improving organization."
    }
  ],
  "tabAutocompleteModel": {
    "title": "Local Qwen Coder (Bulk)",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b"
  },
  "customCommands": [
    {
      "name": "bulk-consolidate-api",
      "prompt": "Consolidate all API files (API*.md, APIs_*.md) into canonical API.md, ENDPOINTS.md, and ROUTES.md. Merge duplicate content, preserve all unique endpoints, update cross-references.",
      "description": "Consolidate API documentation"
    },
    {
      "name": "bulk-merge-routes",
      "prompt": "Find and merge duplicate routes across app/api and src/app/api directories. For each duplicate, select the more complete version, preserve all unique logic, then delete or redirect duplicates.",
      "description": "Merge duplicate route handlers"
    },
    {
      "name": "bulk-update-docs",
      "prompt": "Update all markdown documentation files to match current code state. For each .md file, verify described endpoints/routes exist in code, update examples, fix broken links, add missing documentation.",
      "description": "Synchronize all documentation"
    },
    {
      "name": "bulk-inventory-wallets",
      "prompt": "Scan entire repository for wallet, balance, account, exchange, and platform related files and code. Create comprehensive inventory in JSON format with file paths, purposes, and cross-references.",
      "description": "Create wallet/account inventory"
    },
    {
      "name": "bulk-fix-duplicates",
      "prompt": "Find all duplicate function, route, endpoint, and type definitions. For each duplicate set, compare implementations, keep the best, merge any unique logic, then remove duplicates. Update all imports.",
      "description": "Fix duplicate definitions"
    },
    {
      "name": "bulk-trading-features",
      "prompt": "Implement trading features from 7.txt backlog in bulk: spot trading, futures, options, grid trading, arbitrage, market making, liquidity provision, copy trading, portfolio management, yield optimization, staking, lending, borrowing, funding rates, launchpool/pad, token research, on-chain analytics, sentiment analysis, news trading, risk management, tax recording, fraud detection, cross-exchange optimization, stablecoin management, auto-reinvestment, and performance analytics. Create production-ready modules with proper error handling, validation, logging, and tests.",
      "description": "Implement trading features (bulk)"
    },
    {
      "name": "bulk-universal-auth",
      "prompt": "Implement universal authentication across all QMOI apps (QMOI AI, QMOI Space, QCity, QVillage, QAlpha, Universal Portal). Create login/logout/register/forgot-password/reset-password/email-verification/session-refresh flows. Ensure consistent UI, naming, and behavior across all apps. Update UNIVERSAL.md and auth documentation.",
      "description": "Build universal auth (bulk)"
    },
    {
      "name": "bulk-continue-integration",
      "prompt": "Ensure Continue AI integration works perfectly in bulk mode. This means: context preservation across large files, bulk file editing support, multi-file refactoring, automatic testing after bulk changes, comprehensive logging of all bulk operations, ability to pause/resume bulk operations.",
      "description": "Optimize Continue integration"
    }
  ]
}
```

## Custom Commands for Bulk Operations

### 1. Run Bulk API Consolidation
In Continue chat:
```
@bulk-consolidate-api
```

This will:
- Find all API-related markdown files
- Consolidate into API.md, ENDPOINTS.md, ROUTES.md
- Merge duplicate content
- Preserve all endpoints
- Update cross-references

### 2. Run Bulk Route Merging
```
@bulk-merge-routes
```

This will:
- Identify duplicate routes
- Compare implementations
- Keep the best version
- Merge unique logic
- Delete or redirect duplicates

### 3. Run Bulk Documentation Sync
```
@bulk-update-docs
```

This will:
- Update all markdown files
- Verify endpoints exist
- Fix broken links
- Add missing documentation
- Update examples

### 4. Run Bulk Trading Features
```
@bulk-trading-features
```

This will implement comprehensive trading capabilities from 7.txt in one pass.

### 5. Run Bulk Universal Auth
```
@bulk-universal-auth
```

This will implement universal authentication across all apps.

## How to Use for Bulk Work

### Method 1: Quick Bulk Pass
```bash
# Terminal 1: Monitor daemon
tail -f $HOME/.ollama/logs/auto-continue.log

# Terminal 2: Use Continue
# In VS Code Continue panel: @bulk-consolidate-api
# Wait for completion, then: @bulk-merge-routes
# Then: @bulk-update-docs
```

### Method 2: Automated Bulk Script
```bash
# Run Python bulk executor
python3 scripts/auto_continue_resumefromhere.py --mode full --verbose

# Monitor with dashboard
bash .devcontainer/status-dashboard.sh --watch
```

### Method 3: Manual Bulk Continuation
1. Open Continue in VS Code
2. Navigate to a backlog file (7.txt, 14.txt, etc.)
3. Select a section of tasks
4. Type custom command: `@bulk-[command-name]`
5. Continue processes in background (auto-continue daemon keeps service running)

## Bulk Work Best Practices

### 1. Work in Logical Sections
- Process one type of consolidation at a time
- API → Routes → Modules → Documentation
- Don't switch contexts mid-task

### 2. Verify After Each Bulk Operation
```bash
# After each bulk operation, run:
python3 scripts/consolidate_api_endpoints.py  # Regenerate docs
bash scripts/validate_markdown.sh              # Validate links
npm test                                        # Run tests
```

### 3. Commit Frequently
```bash
git add [specific files changed]
git commit -m "bulk: [operation type] - [description]"
git push
```

### 4. Monitor Ollama During Bulk Work
```bash
# Keep daemon running
bash .devcontainer/status-dashboard.sh --watch

# If service restarts, Continue will auto-reconnect
# (auto-continue daemon handles this automatically)
```

### 5. Use Context Windows Effectively
For large bulk tasks:
- Open source and target files side-by-side
- Use Continue's file context feature (`@file`)
- Tell Continue about the full scope upfront
- Break into smaller chunks if needed

## Multi-File Bulk Patterns

### Pattern 1: Consolidate Files
```
Continue Prompt:
"Consolidate these 5 files into one canonical version:
- FILE1: app/api/auth/login/route.ts
- FILE2: src/app/api/auth/login/route.ts
- FILE3: app/api/auth/signin/route.ts
- FILE4: src/app/api/auth/signin/route.ts
- FILE5: lib/auth/login.ts

Merge all unique logic, keep best error handling, remove duplicates."
```

### Pattern 2: Update Multiple Files
```
Continue Prompt:
"Update these 10 markdown files to reflect current code:
- API.md
- ENDPOINTS.md
- ROUTES.md
- UNIVERSAL.md
- QMOIAIUI.md
- QMOISPACEUI.md
- QCITYUI.md
- QVILLAGEUI.md
- QALPHAUI.md
- STYLES.md

Verify all described endpoints/routes exist in code, fix broken links, add missing sections."
```

### Pattern 3: Refactor Across Directory
```
Continue Prompt:
"Refactor all wallet-related files to use centralized WalletManager:
- Find: all files importing wallet functions
- Replace: individual imports with WalletManager import
- Update: all wallet operations to use WalletManager methods
- Add: WalletManager integration tests
- Document: WalletManager in API.md"
```

## Bulk Processing Workflow

```
Start Bulk Session
    ↓
Open resumefromhere.txt in Continue
    ↓
Load custom Continue config
    ↓
Run: @bulk-consolidate-api
    ↓
Verify consolidation with status-dashboard.sh
    ↓
Run: @bulk-merge-routes
    ↓
Run: @bulk-update-docs
    ↓
Commit changes
    ↓
Run tests to verify
    ↓
Update resumefromhere.txt
    ↓
Next session continues from there
```

## Troubleshooting Bulk Operations

### Ollama Service Interruption
```bash
# Auto-continue daemon restarts automatically
# Continue will auto-reconnect
# No manual intervention needed
```

### Continue Loses Context
```bash
# Re-open the target file
# Use Continue's @file command to reload context
# Restart bulk operation from last checkpoint
```

### Partial Completion
```bash
# Check progress in status-dashboard
bash .devcontainer/status-dashboard.sh

# Update resumefromhere.txt with current status
# Next bulk pass continues from checkpoint
```

### Memory Issues
```bash
# Reduce context window size
# Process fewer files per bulk operation
# Monitor with: free -h
```

## Monitoring Bulk Operations

```bash
# Terminal 1: Monitor Ollama
tail -f $HOME/.ollama/logs/auto-continue.log

# Terminal 2: Monitor Status
bash .devcontainer/status-dashboard.sh --watch

# Terminal 3: Work in Continue
# VS Code: Continue panel

# Terminal 4: Monitor Git Changes
git status --short
git diff --stat
```

## Resume From Checkpoint

If bulk operation interrupted:
```bash
# 1. Check status
bash .devcontainer/status-dashboard.sh

# 2. Verify resume file
cat resumefromhere.txt | tail -50

# 3. Continue from last checkpoint
python3 scripts/auto_continue_resumefromhere.py --mode full --verbose

# 4. Or manually in Continue with:
@bulk-[operation-name]
```

---

**Status:** Ready for Bulk Operations ✅  
**Ollama:** Continuously Running (auto-restart enabled)  
**Continue:** Optimized for Bulk  
**Monitor:** `bash .devcontainer/status-dashboard.sh --watch`

Start bulk work now! 🚀
