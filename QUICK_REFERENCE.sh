#!/bin/bash
# Quick Reference Card for QMOI Session

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                    QMOI SESSION QUICK REFERENCE CARD                        ║
║                           Status: READY FOR REBUILD                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

🎯 NEXT STEPS (In Order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  REBUILD CONTAINER (User Action - 3-5 min)
    ├─ Option A: Right-click Codespaces container → "Rebuild Container"
    ├─ Option B: Ctrl+Shift+P → "Codespaces: Rebuild Container"
    └─ See: REBUILD_GUIDE.md

2️⃣  VERIFY REBUILD SUCCESS (Auto + Manual - 10 min)
    ├─ Wait for restart
    ├─ Run: bash .devcontainer/rebuild-and-verify.sh
    └─ See: POST_REBUILD_CHECKLIST.md

3️⃣  REGENERATE DOCUMENTATION (Automated - 5 min)
    ├─ Run: python3 scripts/consolidate_api_endpoints.py
    └─ Run: python3 scripts/merge_executor.py (if available)

4️⃣  UPDATE STATUS (Manual - 1 min)
    ├─ Run: bash .devcontainer/update-resume.sh "Post-rebuild complete"
    └─ Commit to Git

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION CREATED THIS SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEW DOCUMENTS:
  ✅ REBUILD_GUIDE.md ..................... How to rebuild container
  ✅ POST_REBUILD_CHECKLIST.md ........... Verification checklist (6 phases)
  ✅ SESSION_SUMMARY.md .................. Complete session overview

UPDATED DOCUMENTS:
  ✅ API.md ............................. Added auth endpoints section (+80 lines)
  ✅ ROUTES.md .......................... Organized with universal portal routes
  ✅ STYLES.md .......................... Added universal theme system docs
  ✅ UNIVERSAL.md ....................... Added theme/auth flow docs
  ✅ resumefromhere.txt ................. Session progress tracking
  ✅ All app UI docs .................... Verified theme selection present

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 QUICK VERIFICATION COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AFTER REBUILD, TEST WITH:

  # Check environment
  ldd --version | head -1

  # Check Ollama
  ps aux | grep ollama | grep -v grep
  curl -s http://127.0.0.1:11434/api/tags | jq '.models[0].name'

  # Check Continue
  code --list-extensions | grep continue
  # Then press Ctrl+I in VS Code

  # Check docs were regenerated
  grep -q "Last Generated:" API.md && echo "API.md is fresh"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  CURRENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BLOCKING ISSUE:
  Container is Alpine (musl) - needs Debian (glibc) for Ollama
  Error: "Error relocating /usr/local/bin/ollama: fcntl64: symbol not found"

  SOLUTION:
  Rebuild devcontainer → switches to bullseye (glibc) → Ollama works

  DEVCONTAINER.JSON:
  ✅ Already configured for bullseye (glibc)
  ✅ Just needs rebuild to apply

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 THEME SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  IMPLEMENTED IN ALL SHELLS:
  ✅ QMOI AI - ThemeSelector + dark/light/high-contrast
  ✅ QMOI Space - ThemeSelector + theme persistence
  ✅ QCity - ThemeSelector + master controls
  ✅ QVillage - ThemeSelector + marketplace styling
  ✅ QAlpha - ThemeSelector + research dashboard

  PERSISTENCE:
  ✅ localStorage key: "qmoi_theme"
  ✅ Saved to user profile on auth
  ✅ Synced across app boundaries
  ✅ No Flash of Unstyled Content (FOUC)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 AUTH SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  UNIVERSAL PORTAL:
  ✅ Endpoint: /universal
  ✅ Modes: signin, register, forgotPassword, resetPassword
  ✅ Theme selection in portal
  ✅ Language selection in portal

  AUTHENTICATION METHODS:
  ✅ Email/password (traditional)
  ✅ Biometric (fingerprint, face, voice)
  ✅ WebAuthn/FIDO2 (hardware keys)
  ✅ OAuth providers (social login)

  AUTO-CHANNEL ROUTING:
  ✅ Unauthenticated → /universal?redirect=<app>
  ✅ After auth → auto-redirect to original app
  ✅ Theme preserved during redirect

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 FILES & LOCATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  GUIDES:
  📖 REBUILD_GUIDE.md .............. Step-by-step rebuild instructions
  📖 POST_REBUILD_CHECKLIST.md .... 6-phase verification checklist
  📖 SESSION_SUMMARY.md ........... Complete session overview

  COMPONENT FILES:
  🎨 app/components/theme/ThemeSelector.tsx ... Theme picker component
  🔐 app/hooks/useAuth.ts ......................... Auth hook
  🛡️ app/components/auth/UniversalRouteGuard.tsx  Route protection

  CONFIGURATION:
  ⚙️ .devcontainer/devcontainer.json .......... Container config (bullseye)
  ⚙️ ~/.continue/config.json .................. Continue config (auto-created)
  ⚙️ styles/theme.css ......................... Global theme variables

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆘 TROUBLESHOOTING QUICK REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ISSUE: Rebuild doesn't start
  FIX: Check Codespaces quota, try again in 5 minutes

  ISSUE: Ollama still fails after rebuild
  FIX: Verify libc: ldd --version (should show glibc)
       Check logs: tail ~/.ollama/logs/*.log
       Restart: pkill ollama; sleep 2; ollama serve &

  ISSUE: Continue can't connect
  FIX: Verify Ollama running: curl http://127.0.0.1:11434/api/tags
       Restart Continue: Close/reopen VS Code

  ISSUE: Theme not persisting
  FIX: Check localStorage: console.log(localStorage.getItem('qmoi_theme'))
       Clear cache: localStorage.clear(); location.reload()

  ISSUE: Auto-routing not working
  FIX: Check auth hook: useAuth() should return user object
       Verify route guard: UniversalRouteGuard in app page.tsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ SUCCESS CRITERIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  After rebuild and verification:

  ☑ ldd --version shows "GNU libc"
  ☑ ps aux | grep ollama shows running process
  ☑ curl returns 200 from http://127.0.0.1:11434/api/tags
  ☑ code --list-extensions shows continue.continue
  ☑ Ctrl+I opens Continue in VS Code
  ☑ Continue can send prompts to Ollama
  ☑ Model responds within 5 seconds
  ☑ Theme persists across app switches
  ☑ Auth redirects work smoothly
  ☑ All shells have ThemeSelector

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  ESTIMATED TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Container rebuild: ............... 3-5 min
  Post-rebuild verification: ....... 10 min
  Documentation regeneration: ...... 5-10 min
  Status update: ................... 1 min
  ─────────────────────────────────────────
  TOTAL: ....................... ~25-30 min

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 FIRST ACTION: Read REBUILD_GUIDE.md then rebuild container
   → Rebuild Guide: REBUILD_GUIDE.md
   → Start rebuild now!

EOF
