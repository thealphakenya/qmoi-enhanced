---
quantum-enabled: false
---

# QMOI Universal Auth Integration Tests

## Test Suite Overview
Comprehensive testing plan for verifying all authentication flows and cross-app functionality.

## Test Environment Setup

### Prerequisites
- Node.js and npm installed
- Database configured (or fallback auth enabled)
- SMTP service configured for email tests (optional)
- Web browser with DevTools

### Test User Accounts

#### Master Account
- Email: `victor@kwemoi.com`
- Username: `master`
- Password: `Victor9798!`
- Role: master
- Permissions: All

#### Sister Account
- Email: `leah@chebet.com`
- Username: `sister`
- Password: `Ashlehael`
- Role: sister
- Permissions: Family, chat, goals, wallet, space, memory

---

## Manual Test Cases

### TC-001: Password-Based Login Flow

**Objective:** Verify password authentication works correctly

**Steps:**
1. Navigate to `http://localhost:3000/universal`
2. Verify "Universal Auth & App Access" page loads
3. Enter email: `victor@kwemoi.com`
4. Enter password: `Victor9798!`
5. Click "Sign In"

**Expected Result:**
- ✓ User is authenticated
- ✓ Redirected to `/qcity/styles` (or configured default app)
- ✓ User profile shows "Victor" name
- ✓ Access token stored in HTTP-only cookie
- ✓ Refresh token stored in HTTP-only cookie

**Verification:**
```javascript
// Check cookies in DevTools Console
document.cookie  // Should contain accessToken and refreshToken
```

---

### TC-002: Cross-App Navigation with Auth

**Objective:** Verify authenticated user can navigate between all apps while maintaining session

**Precondition:** User logged in as Victor (TC-001)

**Steps:**
1. From QCity app, click navigation to "QMOI AI"
2. Verify QMOIAIShell loads without login prompt
3. Navigate to "QVillage"
4. Verify QVillageShell loads without login prompt
5. Navigate back to "QCity"
6. Verify QCityShell loads with previous session intact

**Expected Result:**
- ✓ Session maintained across all apps
- ✓ No re-authentication required
- ✓ User profile consistent across apps
- ✓ Same accessToken used for all requests

---

### TC-003: Logout Flow

**Objective:** Verify logout clears session and redirects to login

**Precondition:** User logged in as Victor

**Steps:**
1. Click "Logout" button in any app
2. Verify redirect to `/universal` with mode=signin
3. Try accessing `/qcity` directly
4. Verify automatic redirect to login page

**Expected Result:**
- ✓ User redirected to `/universal`
- ✓ Cookies cleared (accessToken and refreshToken removed)
- ✓ LocalStorage user data cleared
- ✓ Protected pages redirect to login

---

### TC-004: Session Refresh Flow

**Objective:** Verify automatic token refresh when access token expires

**Steps:**
1. Login as Victor (TC-001)
2. Wait for access token to expire (1 hour or use browser DevTools to modify token)
3. Perform action requiring auth (navigate between apps, load protected content)
4. Verify request succeeds with refreshed token

**Expected Result:**
- ✓ Refresh token used to get new access token
- ✓ Access token cookie updated
- ✓ Session continues without re-login
- ✓ No interruption to user experience

**Verification:**
```javascript
// Check that refreshToken call was made
// Monitor Network tab → filter by "/api/auth/refresh"
// Verify response includes new accessToken
```

---

### TC-005: Password Reset - Email Request

**Objective:** Verify password reset email is sent correctly

**Steps:**
1. Navigate to `/universal?mode=forgotPassword`
2. Enter email: `victor@kwemoi.com`
3. Click "Send Password Reset"
4. Verify success message: "If that account exists, a password reset link has been sent."

**Expected Result:**
- ✓ Success message displayed
- ✓ Password reset email sent to inbox
- ✓ Email contains reset token link
- ✓ Token link valid for 24 hours

**In Development Mode:**
```javascript
// Check console for debug token if NODE_ENV !== 'production'
// Use token in next test
```

---

### TC-006: Password Reset - Confirm New Password

**Objective:** Verify password can be reset using token

**Precondition:** Have valid reset token from TC-005

**Steps:**
1. Navigate to `/universal?mode=resetPassword`
2. Paste reset token from email
3. Enter new password: `NewPassword123!`
4. Confirm password: `NewPassword123!`
5. Click "Reset Password"

**Expected Result:**
- ✓ Success message: "Password has been reset successfully"
- ✓ Redirected to signin page
- ✓ Can login with new password
- ✓ Old password no longer works

**Verification:**
1. Try login with old password → fails
2. Try login with new password → succeeds

---

### TC-007: Invalid Reset Token

**Objective:** Verify system rejects expired or invalid reset tokens

**Steps:**
1. Navigate to `/universal?mode=resetPassword`
2. Enter invalid token: `invalid.token.here`
3. Enter new password
4. Click "Reset Password"

**Expected Result:**
- ✓ Error message: "Invalid or expired reset token"
- ✓ Reset fails, password unchanged
- ✓ User remains on reset password page

---

### TC-008: Email Verification Flow

**Objective:** Verify email verification works correctly

**Precondition:** User with unverified email (if implemented)

**Steps:**
1. Check account email verification status
2. Request email verification
3. Click verification link in email
4. Or POST to `/api/auth/verify-email?token=...`

**Expected Result:**
- ✓ Email marked as verified
- ✓ User can access features requiring verified email
- ✓ Verification token expires after use

---

### TC-009: Role-Based Access Control

**Objective:** Verify RBAC restricts access based on user role

**Test Case A - Master Access:**
1. Login as Master (Victor)
2. Verify access to:
   - QCity
   - QMOI AI
   - QVillage
   - QAlpha
   - QMOI Space
   - Admin features
   - Build control

**Test Case B - Sister Access:**
1. Login as Sister (Leah)
2. Verify access to:
   - QMOI Space
   - Personal content
   - Goals management
   - Chat features
3. Verify NO access to:
   - User management
   - Financial controls
   - System admin features

**Expected Result:**
- ✓ Master role can access all features
- ✓ Sister role has family-level access
- ✓ User role has standard access
- ✓ Guest role has minimal access

---

### TC-010: Multiple Tab Session Sync

**Objective:** Verify session state syncs across browser tabs

**Steps:**
1. Login as Victor in Tab A
2. Open same app in Tab B
3. Verify Tab B shows authenticated state immediately
4. Logout in Tab A
5. Check Tab B - should also show logged out state

**Expected Result:**
- ✓ Auth state syncs across tabs automatically
- ✓ Storage events trigger useAuth refresh
- ✓ Window event listeners work correctly
- ✓ No manual refresh needed

---

### TC-011: Registration Flow

**Objective:** Verify new user registration works

**Steps:**
1. Navigate to `/universal?mode=register`
2. Fill registration form:
   - Email: `newuser@example.com`
   - Username: `newuser`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
3. Click "Register"

**Expected Result:**
- ✓ Account created successfully
- ✓ User logged in automatically
- ✓ Redirected to target app
- ✓ Email verification sent (if enabled)

---

### TC-012: Invalid Login Attempts

**Objective:** Verify system handles invalid credentials correctly

**Test Case A - Wrong Password:**
1. Navigate to `/universal`
2. Enter email: `victor@kwemoi.com`
3. Enter wrong password: `WrongPassword`
4. Click "Sign In"

**Test Case B - Nonexistent Email:**
1. Enter email: `nonexistent@example.com`
2. Enter password: `SomePassword`
3. Click "Sign In"

**Expected Result:**
- ✓ Generic error message: "Invalid credentials"
- ✓ No account enumeration possible
- ✓ Session not created
- ✓ Login attempt can be logged/monitored

---

### TC-013: Biometric Authentication (if available)

**Objective:** Verify biometric login on supported devices

**Precondition:** Device with biometric capabilities (fingerprint/facial)

**Steps:**
1. Enroll biometric in device settings
2. Navigate to `/universal`
3. Select biometric login option
4. Use device biometric (fingerprint/face)
5. Provide biometric data

**Expected Result:**
- ✓ Biometric captured successfully
- ✓ User authenticated
- ✓ Same session tokens created
- ✓ Works across all apps

---

### TC-014: XSS Protection

**Objective:** Verify XSS attacks are prevented

**Steps:**
1. Attempt to inject script in login email field:
   `<script>alert('XSS')</script>`
2. Submit login
3. Check browser console for script execution

**Expected Result:**
- ✓ Script not executed
- ✓ Input treated as text/sanitized
- ✓ No errors in console
- ✓ Attack safely handled

---

### TC-015: CSRF Protection

**Objective:** Verify CSRF tokens prevent unauthorized requests

**Steps:**
1. Logout (clear cookies)
2. Try direct API call to protected endpoint from different origin
3. Monitor request in Network tab

**Expected Result:**
- ✓ Request blocked or rejected
- ✓ Same-site cookie prevents CSRF
- ✓ 401 or 403 response
- ✓ No unauthorized action performed

---

### TC-016: Redirect Preservation

**Objective:** Verify redirect path preserved through login

**Steps:**
1. Try to access `/qmoi-ai/page-that-doesnt-exist`
2. System redirects to `/universal?redirect=/qmoi-ai/page-that-doesnt-exist`
3. Login as Victor
4. After login, attempt redirect to original path
5. Handle gracefully (404 or fallback)

**Expected Result:**
- ✓ Redirect parameter preserved
- ✓ Post-login attempt to access original URL
- ✓ Graceful handling of invalid paths

---

## Automated Test Cases

### API Endpoint Tests

```bash
# Test password login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "victor@kwemoi.com",
    "password": "Victor9798!"
  }' \
  -c cookies.txt

# Test refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -H "Content-Type: application/json"

# Test logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt

# Test get current user
curl http://localhost:3000/api/auth/me \
  -b cookies.txt

# Test password reset request
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "victor@kwemoi.com"}'

# Test biometric capture
curl -X POST http://localhost:3000/api/auth/biometric/capture \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "biometricMethod": "fingerprint",
    "confidence": 0.95,
    "verified": true
  }'
```

---

## Test Results Template

| TC # | Test Name | Status | Date | Notes |
|------|-----------|--------|------|-------|
| 001 | Password Login | ✓ PASS | 2026-06-14 | Works correctly |
| 002 | Cross-App Navigation | ✓ PASS | 2026-06-14 | Session maintained |
| 003 | Logout Flow | ✓ PASS | 2026-06-14 | Session cleared |
| 004 | Session Refresh | ⏳ PENDING | | To be tested |
| 005 | Password Reset Email | ⏳ PENDING | | To be tested |
| 006 | Reset Confirmation | ⏳ PENDING | | To be tested |
| 007 | Invalid Token | ⏳ PENDING | | To be tested |
| 008 | Email Verification | ⏳ PENDING | | To be tested |
| 009 | RBAC | ⏳ PENDING | | To be tested |
| 010 | Multi-Tab Sync | ⏳ PENDING | | To be tested |
| 011 | Registration | ⏳ PENDING | | To be tested |
| 012 | Invalid Login | ⏳ PENDING | | To be tested |
| 013 | Biometric | ⏳ PENDING | | To be tested |
| 014 | XSS Protection | ⏳ PENDING | | To be tested |
| 015 | CSRF Protection | ⏳ PENDING | | To be tested |
| 016 | Redirect Preservation | ⏳ PENDING | | To be tested |

---

## Performance Tests

### Load Testing Objectives
- Verify system handles 100+ concurrent login attempts
- Verify token refresh performs under load
- Verify session management scales

### Monitoring
- Monitor `/api/auth/*` endpoint response times
- Monitor database query performance
- Monitor memory usage during load tests

---

## Security Tests Checklist

- [ ] SQL injection prevention in login
- [ ] Password stored securely (bcrypt verified)
- [ ] Tokens stored securely (HTTP-only cookies)
- [ ] HTTPS enforced in production
- [ ] CORS headers configured correctly
- [ ] Rate limiting on auth endpoints
- [ ] Session timeout enforcement
- [ ] Invalid token handling
- [ ] Audit logging of auth events
- [ ] No sensitive data in logs

---

## Documentation & Compliance

- [x] Authentication flows documented in UNIVERSAL_AUTH.md
- [x] API endpoints documented in API.md
- [x] Security considerations documented
- [x] Configuration requirements documented
- [ ] Production deployment checklist completed
- [ ] Security audit completed
- [ ] Compliance review completed

---

## Sign-Off

**Test Suite Created:** 2026-06-14
**Last Updated:** 2026-06-14
**Status:** Ready for execution

**Next Steps:**
1. Execute all manual test cases
2. Fix any issues found
3. Run automated tests
4. Conduct security audit
5. Performance testing
6. Production deployment readiness review

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:15.919232Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 527
- words: 2029
- characters: 13367
- headings: 40
- links: 0
- images: 0
- tables: 18
- lion validation block: present
<!-- LION_VALIDATION_END -->
