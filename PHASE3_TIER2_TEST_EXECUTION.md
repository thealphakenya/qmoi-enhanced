# Phase 3 Tier 2: Testing & Verification - Execution Guide

**Status:** Ready for Execution
**Date:** 2026-06-14
**Priority:** High (Blocks Phase 3 Tier 3)

---

## Prerequisites

1. **Environment Setup**
   ```bash
   # Ensure Node.js 18+ and npm are installed
   node --version  # Should be v18.0.0 or higher
   npm --version   # Should be 8.0.0 or higher
   
   # Install dependencies
   cd /workspaces/qmoi-enhanced
   npm install
   ```

2. **Database Setup (Optional)**
   - SQLite: Uses default file-based database
   - PostgreSQL: Set DATABASE_URL env var
   - Fallback: In-memory auth enabled for development

3. **Environment Variables**
   ```bash
   # Create .env.local file
   JWT_SECRET=your-jwt-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:3000
   ```

---

## Test Execution Plan

### PHASE 3 TIER 2 TEST SUITE (16+ Tests)

**Estimated Duration:** 2-3 hours
**Tester:** QA Engineer or Dev
**Documentation:** All results should be recorded in Test Results section

---

## Authentication Endpoint Tests

### Test Group 1: Password Authentication (Automated with curl)

#### T1.1 - Password Login Success
```bash
# Run this curl command to test password login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "victor@kwemoi.com",
    "password": "Victor9798!"
  }' \
  -c cookies.txt \
  -v

# Expected: 200 OK with user data and tokens in Set-Cookie headers
# Verify: accessToken and refreshToken cookies present
```

**Success Criteria:**
- ✅ Status: 200 OK
- ✅ Response contains: `{ user: { id, email, name, role }, accessToken, refreshToken }`
- ✅ Set-Cookie headers: accessToken, refreshToken (both httpOnly, secure, sameSite=strict)
- ✅ Cookies saved to cookies.txt

#### T1.2 - Password Login Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "victor@kwemoi.com",
    "password": "WrongPassword123"
  }' \
  -v

# Expected: 401 Unauthorized with generic error message
```

**Success Criteria:**
- ✅ Status: 401 Unauthorized
- ✅ Error message: "Invalid credentials" (no account enumeration)
- ✅ No tokens in response
- ✅ No cookies set

#### T1.3 - Password Login Non-existent User
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "SomePassword"
  }' \
  -v

# Expected: 401 Unauthorized with same generic error as T1.2
```

**Success Criteria:**
- ✅ Status: 401 Unauthorized
- ✅ Generic error message (prevents enumeration)
- ✅ No tokens set

---

### Test Group 2: User Registration (Manual)

#### T2.1 - User Registration
```bash
# Navigate to http://localhost:3000/universal?mode=register
# Form fields to fill:
# - Email: testuser@example.com
# - Username: testuser123
# - Password: TestPassword123!
# - Confirm Password: TestPassword123!

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser123",
    "password": "TestPassword123!"
  }' \
  -c cookies.txt \
  -v

# Expected: 201 Created with user data
```

**Success Criteria:**
- ✅ Status: 201 Created
- ✅ User created with role: "user" (default)
- ✅ Tokens generated and set in cookies
- ✅ Can immediately log in

#### T2.2 - Duplicate Email Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "victor@kwemoi.com",
    "username": "newuser",
    "password": "TestPassword123!"
  }' \
  -v

# Expected: 409 Conflict with error
```

**Success Criteria:**
- ✅ Status: 409 Conflict
- ✅ Error message: "Email already registered"

---

### Test Group 3: Session Management

#### T3.1 - Get Current User
```bash
# First, login and save cookies
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "victor@kwemoi.com",
    "password": "Victor9798!"
  }' \
  -c cookies.txt

# Then get current user
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt \
  -v

# Expected: 200 OK with user profile
```

**Success Criteria:**
- ✅ Status: 200 OK
- ✅ Response: `{ id, email, name, role, createdAt, ... }`
- ✅ Role matches expected value (e.g., "master" for Victor)

#### T3.2 - Token Refresh
```bash
# Using cookies from previous login
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v

# Expected: 200 OK with new accessToken
```

**Success Criteria:**
- ✅ Status: 200 OK
- ✅ New accessToken cookie set
- ✅ refreshToken unchanged
- ✅ Can use new token for subsequent requests

#### T3.3 - Logout
```bash
# Using cookies from login
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v

# Expected: 200 OK with session cleared
```

**Success Criteria:**
- ✅ Status: 200 OK
- ✅ Success message returned
- ✅ Cookies cleared on client (Set-Cookie with expires=past)
- ✅ Can verify: accessing /api/auth/me returns 401

#### T3.4 - Access Protected Endpoint Without Auth
```bash
# Try accessing protected endpoint without cookies
curl -X GET http://localhost:3000/api/auth/me \
  -v

# Expected: 401 Unauthorized
```

**Success Criteria:**
- ✅ Status: 401 Unauthorized
- ✅ Error message: "Not authenticated"
- ✅ No user data returned

---

### Test Group 4: Password Reset Flow

#### T4.1 - Request Password Reset
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "victor@kwemoi.com"}' \
  -v

# Expected: 200 OK (always returns success for security)
```

**Success Criteria:**
- ✅ Status: 200 OK
- ✅ Message: "If that account exists, a password reset link has been sent"
- ✅ Email sent (check email inbox or server logs for token)

#### T4.2 - Confirm Password Reset
```bash
# Get reset token from email (or server logs in dev mode)
RESET_TOKEN="token-from-email-here"

curl -X POST http://localhost:3000/api/auth/confirm-reset \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$RESET_TOKEN\",
    \"newPassword\": \"NewPassword456!\"
  }" \
  -v

# Expected: 200 OK with success message
```

**Success Criteria:**
- ✅ Status: 200 OK
- ✅ Message: "Password reset successfully"
- ✅ Old password no longer works
- ✅ New password works for login

#### T4.3 - Invalid Reset Token
```bash
curl -X POST http://localhost:3000/api/auth/confirm-reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid-or-expired-token",
    "newPassword": "NewPassword456!"
  }' \
  -v

# Expected: 400 Bad Request
```

**Success Criteria:**
- ✅ Status: 400 Bad Request
- ✅ Error: "Invalid or expired reset token"
- ✅ Password unchanged

---

## Browser-Based Tests (Manual)

### Test Group 5: User Interface Authentication

#### T5.1 - Login Page Load
**Steps:**
1. Navigate to `http://localhost:3000/universal`
2. Verify page loads with:
   - Email/password input fields
   - "Sign In" button
   - "Register" link
   - Language selector
   - Theme selector

**Success Criteria:**
- ✅ All UI elements render correctly
- ✅ Theme selector shows: dark, light, high-contrast options
- ✅ Language selector populated
- ✅ Form fields accessible and functional

#### T5.2 - Theme Selection & Persistence
**Steps:**
1. On `/universal` page
2. Click Theme Selector
3. Select "light" theme
4. Verify page changes to light theme
5. Refresh page
6. Verify theme persists as "light"
7. Change to "high-contrast"
8. Verify page changes immediately
9. Refresh again
10. Verify "high-contrast" persists

**Success Criteria:**
- ✅ Theme changes apply immediately
- ✅ CSS variables update (background, text colors)
- ✅ localStorage contains `qmoi_theme=light` (or selected theme)
- ✅ Theme persists after page refresh
- ✅ All three themes work correctly

#### T5.3 - Login Flow
**Steps:**
1. On `/universal` page (signin mode)
2. Enter email: `victor@kwemoi.com`
3. Enter password: `Victor9798!`
4. Click "Sign In"
5. Verify redirect to `/qcity` (or configured default)
6. Verify user name displayed in header
7. Verify cannot access `/qmoi-ai` before login shows protected message

**Success Criteria:**
- ✅ Form submits successfully
- ✅ Loading state shows during auth
- ✅ Redirect happens to correct app
- ✅ User profile visible in shell
- ✅ Cookies set (DevTools → Application → Cookies)

#### T5.4 - Cross-App Navigation with Auth
**Steps:**
1. Logged in as Victor on `/qcity`
2. Navigate to `/qmoi-ai`
3. Verify loads without asking for login
4. Check DevTools → Network: authorization header or cookies present
5. Navigate to `/qvillage`
6. Verify same session (same user name)
7. Navigate to `/qmoi-space`
8. Verify same session maintained

**Success Criteria:**
- ✅ No login prompt on navigation
- ✅ Same user displayed across all apps
- ✅ Same accessToken used (or auto-refreshed)
- ✅ Session state consistent

#### T5.5 - Logout Flow
**Steps:**
1. Logged in on any app
2. Click "Logout" button
3. Verify redirect to `/universal`
4. Try accessing `/qcity` directly
5. Verify redirect to `/universal?redirect=/qcity`

**Success Criteria:**
- ✅ Logout clears cookies (DevTools → Application)
- ✅ localStorage auth data cleared
- ✅ Protected routes redirect to login
- ✅ No sensitive data in console errors

#### T5.6 - Registration Flow
**Steps:**
1. Navigate to `/universal?mode=register`
2. Fill form:
   - Email: `newuser2026@example.com`
   - Username: `newuser2026`
   - Password: `SecurePassword123!`
   - Confirm: `SecurePassword123!`
3. Click "Register"
4. Verify redirected to app
5. Verify logged in as new user

**Success Criteria:**
- ✅ Account created successfully
- ✅ Auto-logged in after registration
- ✅ Default role is "user"
- ✅ Redirected to correct app

#### T5.7 - Password Reset Flow
**Steps:**
1. Navigate to `/universal?mode=forgotPassword`
2. Enter email: `victor@kwemoi.com`
3. Click "Send Reset Link"
4. Verify success message
5. Check email for reset link
6. Click reset link (or navigate to `/universal?mode=resetPassword&token=...`)
7. Enter new password: `NewPassword789!`
8. Confirm: `NewPassword789!`
9. Click "Reset Password"
10. Try logging in with new password

**Success Criteria:**
- ✅ Reset email sent
- ✅ Token in reset link is valid
- ✅ New password works
- ✅ Old password doesn't work

---

## Cross-Tab Synchronization Tests

### Test Group 6: Multi-Tab Session Sync

#### T6.1 - Login Sync Across Tabs
**Steps:**
1. Open Tab A: `http://localhost:3000/universal`
2. Open Tab B: same URL
3. In Tab A: Login as Victor
4. In Tab B: Observe auth state changes without refreshing
5. Verify Tab B now shows authenticated state

**Success Criteria:**
- ✅ Storage event triggers in Tab B
- ✅ Tab B updates to show logged-in state
- ✅ No manual refresh needed
- ✅ Both tabs show same user profile

#### T6.2 - Logout Sync Across Tabs
**Steps:**
1. Both tabs logged in as Victor
2. In Tab A: Click Logout
3. In Tab B: Observe logout immediately (or on next action)
4. Verify Tab B also shows logged-out state

**Success Criteria:**
- ✅ Logout syncs to other tabs
- ✅ Protected routes on Tab B redirect to login
- ✅ Cookies cleared on both tabs

#### T6.3 - Theme Change Sync Across Tabs
**Steps:**
1. Tab A: On `/universal`
2. Tab B: Same URL
3. In Tab A: Change theme to "light"
4. In Tab B: Observe theme changes automatically
5. Change to "high-contrast" in Tab A
6. Tab B should update immediately

**Success Criteria:**
- ✅ Theme persists to localStorage
- ✅ Storage event triggers theme update
- ✅ Both tabs show same theme
- ✅ No page refresh needed

---

## Theme Verification Tests

### Test Group 7: Theme Application in All Shells

#### T7.1 - QMOI AI Theme Test
**Steps:**
1. Login as Victor
2. Navigate to `/qmoi-ai`
3. In header/menu, find theme selector
4. Change theme to "dark"
5. Verify all UI changes:
   - Background: slate-950
   - Text: slate-100
   - Cards: dark with subtle borders
6. Change to "light":
   - Background: slate-100
   - Text: slate-950
   - Cards: light with dark borders
7. Change to "high-contrast":
   - Background: pure black (#000000)
   - Text: pure white (#FFFFFF)
   - All text must be readable
8. Refresh page
9. Verify theme persists

**Success Criteria:**
- ✅ All three themes render correctly
- ✅ CSS variables apply to entire shell
- ✅ No visual glitches
- ✅ Theme persists after navigation
- ✅ Accessibility: high-contrast has sufficient contrast ratio (4.5:1 minimum)

#### T7.2 - QMOI Space Theme Test
**Steps:** Same as T7.1 but with `/qmoi-space`

#### T7.3 - QCity Theme Test
**Steps:** Same as T7.1 but with `/qcity`

#### T7.4 - QVillage Theme Test
**Steps:** Same as T7.1 but with `/qvillage`

#### T7.5 - QAlpha Theme Test
**Steps:** Same as T7.1 but with `/qalpha`

**Success Criteria (All shells):**
- ✅ Theme selector present and functional
- ✅ All three themes render without errors
- ✅ No console errors during theme changes
- ✅ Theme CSS variables respond to `data-theme` attribute
- ✅ Theme persists across navigation
- ✅ Theme persists across login/logout

---

## Role-Based Access Control Tests

### Test Group 8: RBAC Verification

#### T8.1 - Master Role Access
**Steps:**
1. Login as Victor (master)
2. Verify access to:
   - ✅ `/qcity` - Full command center
   - ✅ `/qmoi-ai` - AI shell with all features
   - ✅ `/qmoi-space` - Full marketplace
   - ✅ `/qvillage` - Full dataset management
   - ✅ `/qalpha` - Full research access
3. Verify can see admin/master-only features

**Success Criteria:**
- ✅ All apps accessible
- ✅ Master-only buttons/features visible
- ✅ No access denied messages

#### T8.2 - Sister Role Access
**Steps:**
1. Login as Leah (sister)
2. Verify access to:
   - ✅ `/qmoi-space`
   - ✅ `/qvillage`
   - ✅ `/qalpha`
3. Verify limited/no access to:
   - `/qcity` - May show limited command center or access denied
4. Verify sister-only features visible

**Success Criteria:**
- ✅ Expected apps accessible
- ✅ Appropriate features visible for sister role
- ✅ Access control applied correctly

#### T8.3 - User Role Access
**Steps:**
1. Login as regular user (if available, or create test user)
2. Verify access to:
   - ✅ `/qmoi-ai` - with user features
   - ✅ Limited content in other apps
3. Verify cannot access:
   - Master/sister only features

**Success Criteria:**
- ✅ Limited feature set visible
- ✅ No access to administrative controls
- ✅ User-level features functional

---

## Security Tests

### Test Group 9: Security & XSS/CSRF

#### T9.1 - XSS Prevention
**Steps:**
1. Navigate to `/universal`
2. In email field, enter: `<script>alert('XSS')</script>`
3. Try submitting form
4. Open DevTools console
5. Verify no alert appears

**Success Criteria:**
- ✅ No script execution
- ✅ No console errors
- ✅ Input treated as text (sanitized)

#### T9.2 - CSRF Protection
**Steps:**
1. Logout (clear all cookies)
2. Open browser console on different site
3. Try making CORS request to `/api/auth/logout`
4. Verify request blocked

**Success Criteria:**
- ✅ Request blocked by browser CORS policy
- ✅ Or server rejects request (401/403)

#### T9.3 - Cookie Security
**Steps:**
1. Login as Victor
2. Open DevTools → Application → Cookies
3. Click on accessToken cookie
4. Verify properties:
   - ✅ HttpOnly: checked
   - ✅ Secure: checked
   - ✅ SameSite: Strict or Lax
5. Verify from JavaScript (console):
   ```javascript
   document.cookie  // Should be empty or not include tokens
   ```

**Success Criteria:**
- ✅ HttpOnly flag prevents JS access
- ✅ Secure flag forces HTTPS
- ✅ SameSite prevents CSRF
- ✅ Cannot access token via `document.cookie`

---

## Test Results

### Automated Test Results

| Test ID | Test Name | Expected | Actual | Status | Notes |
|---------|-----------|----------|--------|--------|-------|
| T1.1 | Login Success | 200 OK | | ⏳ | Run curl command |
| T1.2 | Invalid Password | 401 Unauth | | ⏳ | Generic error |
| T1.3 | Non-existent User | 401 Unauth | | ⏳ | Generic error |
| T2.1 | Registration | 201 Created | | ⏳ | User role assigned |
| T2.2 | Duplicate Email | 409 Conflict | | ⏳ | Error message |
| T3.1 | Get Current User | 200 OK | | ⏳ | User profile |
| T3.2 | Refresh Token | 200 OK | | ⏳ | New token issued |
| T3.3 | Logout | 200 OK | | ⏳ | Session cleared |
| T3.4 | No Auth Access | 401 Unauth | | ⏳ | Protected endpoint |
| T4.1 | Reset Request | 200 OK | | ⏳ | Always success |
| T4.2 | Reset Confirm | 200 OK | | ⏳ | Token validated |
| T4.3 | Invalid Token | 400 Error | | ⏳ | Token rejected |

### Manual Test Results

| Test ID | Test Name | Status | Date | Notes |
|---------|-----------|--------|------|-------|
| T5.1 | Login Page | ⏳ | | Theme/lang selectors |
| T5.2 | Theme Persist | ⏳ | | Refresh verification |
| T5.3 | Login Flow | ⏳ | | Redirect verification |
| T5.4 | Cross-App Nav | ⏳ | | Session maintained |
| T5.5 | Logout Flow | ⏳ | | Redirect to login |
| T5.6 | Register Flow | ⏳ | | Auto-login |
| T5.7 | Password Reset | ⏳ | | Email + confirm |
| T6.1 | Login Sync | ⏳ | | Multi-tab sync |
| T6.2 | Logout Sync | ⏳ | | Multi-tab logout |
| T6.3 | Theme Sync | ⏳ | | Storage events |
| T7.1 | QMOI AI Theme | ⏳ | | All 3 themes |
| T7.2 | QMOI Space Theme | ⏳ | | All 3 themes |
| T7.3 | QCity Theme | ⏳ | | All 3 themes |
| T7.4 | QVillage Theme | ⏳ | | All 3 themes |
| T7.5 | QAlpha Theme | ⏳ | | All 3 themes |
| T8.1 | Master RBAC | ⏳ | | All apps accessible |
| T8.2 | Sister RBAC | ⏳ | | Limited access |
| T8.3 | User RBAC | ⏳ | | User features only |
| T9.1 | XSS Prevention | ⏳ | | No script execution |
| T9.2 | CSRF Protection | ⏳ | | Request blocked |
| T9.3 | Cookie Security | ⏳ | | HttpOnly/Secure flags |

---

## Next Steps

1. **Setup Environment** - Install Node.js, npm dependencies
2. **Start Dev Server** - Run `npm run dev`
3. **Execute Tests** - Run curl commands or manual tests
4. **Document Results** - Fill in Test Results table above
5. **Fix Issues** - If tests fail, debug and fix
6. **Phase 3 Tier 3** - Once all tests pass, proceed to advanced features

---

## Testing Best Practices

- **Order Matters** - Run tests in order (auth before app navigation)
- **Save Artifacts** - Keep cookies.txt and test responses for debugging
- **Monitor Network** - Use DevTools Network tab to observe requests
- **Check Logs** - Server logs show detailed auth flow
- **Browser Console** - Watch for errors during tests
- **Clear State** - Logout and clear cookies between test groups

---

**Document Status:** Ready for Execution
**Last Updated:** 2026-06-14
**Tester Assigned:** [TBD]
