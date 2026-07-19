# Quick Reference: Bulk Continuation Commands

## When to Use Each Command

### Phase 1: Foundation (Foundation work first!)
```
→ Start here!

1. @bulk-consolidate-api
   Use when: Starting fresh or API docs are scattered
   Result: API.md, ENDPOINTS.md, ROUTES.md consolidated
   Time: 5-10 minutes
   Git: git commit -m "bulk: api consolidation"

2. @bulk-merge-routes
   Use when: Duplicate route handlers exist
   Result: Routes consolidated, duplicates removed
   Time: 10-15 minutes
   Git: git commit -m "bulk: route merge"

3. @bulk-update-docs
   Use when: Markdown out of sync with code
   Result: All docs updated, links fixed
   Time: 10-15 minutes
   Git: git commit -m "bulk: doc sync"
```

### Phase 2: Features (After foundation complete!)
```
→ Then do features

4. @bulk-universal-auth
   Use when: Implementing authentication
   Result: Auth across all apps, all flows
   Time: 20-30 minutes
   Git: git commit -m "bulk: universal auth"

5. @bulk-trading-features
   Use when: Implementing trading/finance
   Result: 30 complete trading modules
   Time: 30-60 minutes
   Git: git commit -m "bulk: trading features"
```

### Phase 3: Verification (After features complete!)
```
→ Then verify everything

6. @bulk-inventory-wallets
   Use when: Need complete inventory
   Result: Wallet/account/balance inventory
   Time: 5 minutes
   Git: git commit -m "bulk: inventory"

7. @bulk-theme-integration
   Use when: Verifying themes work
   Result: Confirmed themes work everywhere
   Time: 5-10 minutes
   Git: git commit -m "bulk: theme verification"

8. @bulk-continue-optimization
   Use when: Optimizing bulk capabilities
   Result: Optimized Continue setup
   Time: 5 minutes
   Git: git commit -m "bulk: continue optimization"
```

---

## Complete Workflow Summary

```
Session 1 (90 min): Foundation
├─ @bulk-consolidate-api (10 min) → Commit
├─ @bulk-merge-routes (15 min) → Commit
├─ @bulk-update-docs (15 min) → Commit
└─ Test & verify (10 min)

Session 2 (90 min): Auth
├─ @bulk-universal-auth (30 min) → Commit
├─ Test (20 min)
└─ Next session continues...

Session 3 (120 min): Trading
├─ @bulk-trading-features (60 min) → Commit
├─ Test (20 min)
└─ Next session continues...

Session 4 (30 min): Complete
├─ @bulk-inventory-wallets (5 min) → Commit
├─ @bulk-theme-integration (10 min) → Commit
├─ @bulk-continue-optimization (5 min) → Commit
└─ Final test & push
```

---

## Terminal Commands to Keep Running

### Terminal 1: Monitoring (Required during all work!)
```bash
bash .devcontainer/status-dashboard.sh --watch
```
Shows: Daemon status, Ollama health, model availability, resources, logs

### Terminal 2: VS Code + Continue
```bash
code .
```
Paste bulk commands in Continue panel

### Terminal 3: Verification (Optional, after each phase)
```bash
# Check what files changed
git status --short

# See diffs
git diff --stat

# View logs
tail -f $HOME/.ollama/logs/auto-continue.log

# Test code
npm test
```

---

## Decision Tree: Which Command to Use?

```
Do you have scattered API/endpoint/route docs?
├─ YES → @bulk-consolidate-api
└─ NO → Next

Do you have duplicate route handlers?
├─ YES → @bulk-merge-routes
└─ NO → Next

Are markdown files out of date?
├─ YES → @bulk-update-docs
└─ NO → Next

Do you need wallet/account inventory?
├─ YES → @bulk-inventory-wallets
└─ NO → Next

Need to implement authentication?
├─ YES → @bulk-universal-auth
└─ NO → Next

Need to implement trading features?
├─ YES → @bulk-trading-features
└─ NO → Next

Need to verify themes?
├─ YES → @bulk-theme-integration
└─ NO → Next

Need to optimize Continue?
├─ YES → @bulk-continue-optimization
└─ NO → Done!
```

---

## Troubleshooting Quick Fixes

### Ollama Stopped/Restarted
```
✓ Automatic - daemon restarts it
✓ Continue auto-reconnects
✓ Bulk operation resumes
✓ No action needed

Monitor: bash .devcontainer/status-dashboard.sh --watch
```

### Continue Lost Context
```
1. Re-open file
2. Use @file command in Continue to reload
3. Restart bulk command
4. Progress saved in resumefromhere.txt
```

### Bulk Operation Hangs
```
1. Check: curl http://localhost:11434/api/tags
2. Wait: Usually completes in < 5 minutes
3. If > 10 min: Press Ctrl+C and restart
4. Update: resumefromhere.txt with progress
```

### Need to Pause
```
1. Press Ctrl+C in Continue
2. Daemon auto-restarts Ollama if needed
3. Update resumefromhere.txt
4. Next session resumes from checkpoint
```

---

## Files to Track During Work

| File | Purpose | Check Frequency |
|------|---------|-----------------|
| `git status --short` | See changed files | After each command |
| `git diff --stat` | See changes summary | After each command |
| `$HOME/.ollama/logs/auto-continue.log` | Daemon logs | Continuously (in Terminal 1) |
| `resumefromhere.txt` | Progress tracking | After each phase |
| `npm test` output | Code validation | After each phase |

---

## Commit Message Template

```bash
# After each bulk operation:

git add .
git commit -m "bulk: [operation] - [description]

[Optional: What was changed, why, any notes]"

git push

# Examples:
# git commit -m "bulk: api consolidation - merged 5 API*.md files into API.md"
# git commit -m "bulk: route merge - consolidated duplicate auth routes"
# git commit -m "bulk: doc sync - updated 8 markdown files with current endpoints"
# git commit -m "bulk: universal auth - implemented login/logout/register across all apps"
# git commit -m "bulk: trading features - implemented 30 trading modules with tests"
```

---

## Progress Tracking

Every time you complete a bulk operation:

1. **Test** - Run tests to verify
2. **Commit** - Git commit with clear message
3. **Push** - Push to GitHub
4. **Update** - Update resumefromhere.txt
5. **Next** - Move to next command

---

## Remember

- Always start with Foundation phase (commands 1-3)
- Always do features after foundation (commands 4-5)
- Always verify at end (commands 6-8)
- Monitor dashboard continuously
- Commit frequently
- Test after each phase
- Don't skip any commands

---

## Summary

```
Quick Order:
1. @bulk-consolidate-api
2. @bulk-merge-routes
3. @bulk-update-docs
4. @bulk-universal-auth
5. @bulk-trading-features
6. @bulk-inventory-wallets
7. @bulk-theme-integration
8. @bulk-continue-optimization

Total Time: 2-3 hours
Cost: $0.00
Effort: Minimal
Result: Production-ready system
```

---

**Ready? Start with: `@bulk-consolidate-api`** 🚀

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:40.636828Z
- production status: ✅ production-ready
- status tags: production, production-ready
- lines: 302
- words: 1014
- characters: 6845
- headings: 33
- links: 0
- images: 0
- tables: 7
- lion validation block: present
<!-- LION_VALIDATION_END -->
