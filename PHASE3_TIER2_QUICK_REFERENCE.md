---
quantum-enabled: false
---

# Phase 3 Tier 2 Quick Reference - Testing Checklist

**Status:** Ready to Execute
**Duration:** 2-3 hours for complete test suite
**Priority:** High (Blocks Phase 3 Tier 3)

---

## Quick Start Testing

### 1. Environment Setup (5 min)
```bash
cd /workspaces/qmoi-enhanced
npm install
npm run dev  # Starts on http://localhost:3000
```

### 2. Verify Theme Implementation (10 min)
```bash
# Run automated verification script
node scripts/verify-themes.js

# Expected output: All checks pass or only warnings (no critical failures)
```

### 3. Execute API Tests (30 min)

**Test 1: Password Login**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"victor@kwemoi.com","password":"Victor9798!"}' \
  -c cookies.txt
# Expected: 200 OK with tokens
```

**Test 2: Get Current User**
```bash
curl http://localhost:3000/api/auth/me -b cookies.txt
# Expected: 200 OK with user profile
```

**Test 3: Logout**
```bash
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
# Expected: 200 OK, cookies cleared
```

**Test 4: Refresh Token**
```bash
curl -X POST http://localhost:3000/api/auth/refresh -b cookies.txt
# Expected: 200 OK with new token
```

### 4. Browser Testing (60 min)

**Login & Theme Selection:**
1. Go to http://localhost:3000/universal
2. Change theme to "light" → observe CSS changes
3. Refresh page → verify theme persists
4. Change to "high-contrast" → verify pure black/white
5. Login: victor@kwemoi.com / Victor9798!
6. Navigate to /qcity, /qmoi-ai, /qvillage
7. Verify theme persists across apps

**Cross-Tab Sync:**
1. Open two tabs: Tab A and Tab B at /universal
2. In Tab A: Login as Victor
3. In Tab B: Verify logged in automatically (no refresh)
4. In Tab A: Change theme
5. In Tab B: Verify theme changes (no refresh)
6. In Tab A: Logout
7. In Tab B: Verify logged out (no refresh)

**Password Reset:**
1. Go to /universal?mode=forgotPassword
2. Enter: victor@kwemoi.com
3. Check email/logs for reset token
4. Go to /universal?mode=resetPassword
5. Enter token and new password
6. Verify can login with new password

---

## Priority Test Cases (Do These First)

| Priority | Test | Time | Pass/Fail |
|----------|------|------|-----------|
| 🔴 HIGH | T1.1: Login Success | 5min | [ ] |
| 🔴 HIGH | T5.2: Theme Persistence | 10min | [ ] |
| 🔴 HIGH | T5.4: Cross-App Navigation | 10min | [ ] |
| 🔴 HIGH | T6.1: Login Sync (Multi-Tab) | 10min | [ ] |
| 🟠 MED | T7.1-T7.5: Theme in All Shells | 30min | [ ] |
| 🟠 MED | T3.2: Token Refresh | 5min | [ ] |
| 🟠 MED | T8.1: Master RBAC | 10min | [ ] |
| 🟡 LOW | T4.1: Password Reset | 15min | [ ] |
| 🟡 LOW | T5.6: Registration | 10min | [ ] |
| 🟡 LOW | T9.3: Cookie Security | 5min | [ ] |

---

## Expected Results

### Successful Test Indicators
- ✅ All auth endpoints return 200 for valid requests, 401 for invalid
- ✅ Theme changes apply immediately (dark/light/high-contrast)
- ✅ Theme persists after page reload
- ✅ Auth state syncs across tabs without refresh
- ✅ Can navigate between all 5 apps without re-login
- ✅ Logout clears cookies and redirects to login
- ✅ Password reset email received with valid token
- ✅ Role-based features visible/hidden based on role
- ✅ No console errors during normal operation
- ✅ No sensitive data in error messages

### Common Issues & Solutions

**Issue: "npm: command not found"**
→ Solution: Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

**Issue: "http://localhost:3000 refused to connect"**
→ Solution: Ensure dev server is running: `npm run dev` (should see "ready on" message)

**Issue: Login fails with "Invalid credentials"**
→ Solution: Verify email/password are correct (case-sensitive): victor@kwemoi.com / Victor9798!

**Issue: Theme doesn't persist**
→ Solution: Check localStorage: Open DevTools → Application → localStorage → qmoi_theme should exist

**Issue: CORS errors in console**
→ Solution: Ensure requests use same origin: http://localhost:3000

---

## Test Document References

- **Full Test Suite:** PHASE3_TIER2_TEST_EXECUTION.md
- **Auth Tests:** AUTH_INTEGRATION_TESTS.md
- **API Documentation:** UNIVERSAL_AUTH.md, ENDPOINTS.md
- **Verification Script:** scripts/verify-themes.js

---

## Sign-Off

Once all HIGH priority tests pass:

```
Tester Name: ___________________
Date: ___________________
Status: ☐ PASS ☐ FAIL
Notes: ___________________
```

---

## Next Phase

After Phase 3 Tier 2 passes:
- Phase 3 Tier 3: Advanced features (QM OI awareness, privacy mask, parallel sessions)
- Phase 3 Tier 4: Production hardening and security audit

---

**Last Updated:** 2026-06-14
**Ready for:** Manual Execution

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:28.533771Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 188
- words: 818
- characters: 5205
- headings: 20
- links: 0
- images: 0
- tables: 12
- lion validation block: present
<!-- LION_VALIDATION_END -->
