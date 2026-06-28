---
quantum-enabled: false
---

# QMOI Universal Authentication System

## Overview
The QMOI Universal Authentication System provides unified authentication across all QMOI apps (QMOI AI, QMOI Space, QCity, QVillage, QAlpha) through a centralized authentication portal at `/universal`.

## Architecture

### Core Components

1. **Authentication Service** (`lib/auth/service.ts`)
   - Password authentication with bcrypt hashing
   - Biometric authentication (fingerprint, facial, voice)
   - WebAuthn/FIDO2 support
   - JWT token generation and validation
   - Session management
   - Password reset token generation

2. **Auth API Routes** (`app/api/auth/*`)
   - Complete RESTful API for authentication flows
   - Session management endpoints
   - Email verification
   - Biometric enrollment and verification
   - WebAuthn registration and authentication

3. **Client-Side Hook** (`app/hooks/useAuth.ts`)
   - React hook for auth state management
   - User session persistence
   - Token refresh handling
   - Permission-based access control
   - Multi-window auth synchronization

4. **Route Protection** (`app/components/auth/UniversalRouteGuard.tsx`)
   - Protects all application pages
   - Redirects unauthenticated users to `/universal`
   - Preserves redirect path for post-login redirection
   - Manages loading states

## Authentication Flows

### 1. Password-Based Authentication

**Endpoint:** `POST /api/auth/signin`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "optional_username"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "fullName": "Full Name",
    "role": "user",
    "permissions": ["general_chat", "profile_view"]
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token",
    "expiresAt": "2026-06-14T14:30:00Z"
  }
}
```

### 2. Biometric Authentication

**Endpoint:** `POST /api/auth/signin`

**Request:**
```json
{
  "username": "username",
  "biometricMethod": "fingerprint",
  "biometricData": {
    "confidence": 0.95,
    "verified": true,
    "metadata": {
      "device": "iPhone 15",
      "scanner": "native"
    }
  }
}
```

**Response:** Same as password authentication

### 3. Password Reset Flow

#### Step 1: Request Password Reset
**Endpoint:** `POST /api/auth/reset-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If that account exists, a password reset link has been sent."
}
```

#### Step 2: Confirm Password Reset
**Endpoint:** `POST /api/auth/confirm-reset`

**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "new_secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

### 4. Email Verification

**Endpoint:** `POST /api/auth/verify-email` or `GET /api/auth/verify-email?token=...`

**Request (POST):**
```json
{
  "token": "email-verification-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email address verified successfully."
}
```

### 5. Session Refresh

**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Authorization: Bearer <refreshToken>
or Cookie: refreshToken=<refreshToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Session refreshed successfully",
  "user": { /* user object */ },
  "tokens": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-jwt-refresh-token"
  }
}
```

### 6. Logout

**Endpoint:** `POST /api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 7. Current User Info

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
or Cookie: accessToken=<accessToken>
```

**Response:**
```json
{
  "success": true,
  "user": { /* current user object */ }
}
```

## User Roles and Permissions

### Roles

1. **Master**
   - Full system access
   - Permissions: `general_chat`, `system_control`, `financial_management`, `user_management`, `qcity_access`, `qvillage_access`, `qmoi_space_access`, `pwa_install`, `memory_access`, `build_control`
   - Access Level: 100

2. **Sister**
   - Family and personal access
   - Permissions: `general_chat`, `personal_content`, `goals_management`, `wallet_view`, `qmoi_space_access`, `memory_access`
   - Access Level: 65

3. **User**
   - Standard user access
   - Permissions: `general_chat`, `help_support`, `profile_view`, `wallet_view`, `qmoi_space_access`
   - Access Level: 30

4. **Guest**
   - Limited public access
   - Permissions: `general_chat`, `help_support`
   - Access Level: 10

## Client-Side Usage

### Using the useAuth Hook

```typescript
import { useAuth } from '@/app/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout, hasAccess } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await login({
        email: 'user@example.com',
        password: 'password'
      });
      console.log('Logged in as:', user.displayName);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <button onClick={handleLogin}>Login</button>;
  }

  return (
    <>
      <p>Welcome, {user.displayName}</p>
      {hasAccess('wallet_view') && <p>You can view wallets</p>}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
```

### Protecting Routes

All app pages are automatically protected by `UniversalRouteGuard`:

```typescript
import UniversalRouteGuard from '@/app/components/auth/UniversalRouteGuard';

export default function MyAppPage() {
  return (
    <UniversalRouteGuard>
      <MyAppContent />
    </UniversalRouteGuard>
  );
}
```

## Token Management

### Access Tokens
- **Type:** JWT
- **Expiration:** 1 hour
- **Storage:** HTTP-only cookie (secure, same-site)
- **Contains:** userId, email, role, permissions, sessionId

### Refresh Tokens
- **Type:** JWT
- **Expiration:** 7 days
- **Storage:** HTTP-only cookie (secure, same-site)
- **Type Field:** `refresh`

### Automatic Refresh
The `useAuth` hook automatically refreshes tokens when:
- Access token expires
- User returns after period of inactivity
- Refresh is explicitly called via `refreshUser()`

## Cross-App Authentication

### Unified Entry Point
Users access `/universal` which provides:
- Sign-in interface
- Registration form
- Password recovery
- Language/theme selection
- Links to all app shells

### Post-Authentication Redirect
After successful authentication, users are redirected to their target app:

```
/universal?app=qcity&mode=signin&goto=styles
→ (user authenticates) →
→ /qcity/styles (with active session)
```

### Session Persistence
- Sessions are stored in HTTP-only cookies
- Automatically validated on app entry
- Session state synced across browser tabs
- Auto-logout on token expiration

## Biometric Authentication

### Supported Methods
- Fingerprint
- Facial recognition
- Voice recognition

### Biometric Enrollment
**Endpoint:** `POST /api/auth/biometric/capture`

**Request:**
```json
{
  "userId": "user-id",
  "biometricMethod": "fingerprint",
  "confidence": 0.95,
  "verified": true,
  "metadata": {
    "device": "iPhone 15",
    "quality": "high"
  }
}
```

### Biometric Authentication
Users can authenticate using enrolled biometric data via the `/api/auth/signin` endpoint with biometric parameters.

## Security Considerations

1. **Password Storage:** Passwords are hashed using bcrypt (12 rounds)
2. **Token Security:** Tokens are stored in HTTP-only, secure, same-site cookies
3. **HTTPS Only:** All auth endpoints should run over HTTPS in production
4. **CSRF Protection:** Same-site cookie attribute prevents CSRF attacks
5. **Session Validation:** Sessions are validated against database
6. **Token Expiration:** Automatic token expiration after configured timeout
7. **Audit Logging:** All auth events logged to QMOI memory for compliance

## Environment Variables

```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
SESSION_TIMEOUT=3600000  # 1 hour in milliseconds
DATABASE_URL=your-database-url
NODE_ENV=production
```

## Testing

### Manual Testing Flows

1. **Password Auth**
   - Navigate to `/universal`
   - Enter credentials
   - Verify redirect to target app
   - Verify session persists

2. **Password Recovery**
   - Click "Forgot Password"
   - Enter email
   - Check email for reset link
   - Click link and reset password
   - Login with new password

3. **Cross-Tab Session Sync**
   - Open app in two tabs
   - Logout from one tab
   - Verify other tab shows logout

4. **Session Refresh**
   - Let access token expire
   - Perform action requiring auth
   - Verify automatic token refresh
   - Verify continued access

## Integration Checklist

- [x] Auth service implemented
- [x] API routes created
- [x] useAuth hook implemented
- [x] UniversalRouteGuard implemented
- [x] Password reset flow implemented
- [x] Email verification implemented
- [x] Biometric authentication implemented
- [x] Session refresh implemented
- [x] All apps protected with UniversalRouteGuard
- [x] Theme/language persistence
- [x] Cross-tab session sync
- [ ] Production testing (pending)
- [ ] Load testing (pending)
- [ ] Security audit (pending)

## Next Steps

1. Verify all app-specific auth implementations
2. Run comprehensive integration tests
3. Conduct security audit
4. Perform load testing
5. Document app-specific auth requirements
6. Deploy to production environment

## Support & Documentation

For detailed API documentation, see:
- `API.md` - Complete API reference
- `ENDPOINTS.md` - All endpoints list
- `ROUTES.md` - Routing information

For app-specific information, see:
- `QMOIAIUI.md` - QMOI AI app documentation
- `QMOISPACEUI.md` - QMOI Space app documentation
- `QCITYUI.md` - QCity app documentation
- `QVILLAGEUI.md` - QVillage app documentation
- `QALPHAUI.md` - QAlpha app documentation

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-28T19:36:42.103084Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 470
- words: 1290
- characters: 10675
- headings: 39
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
