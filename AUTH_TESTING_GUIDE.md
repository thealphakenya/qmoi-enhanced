---
quantum-enabled: false
---

# Authentication Testing Guide for QMOI Enhanced

## Overview

This guide provides comprehensive testing procedures for the production authentication system implemented in QMOI Enhanced. All testing assumes the application is running and properly configured.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Basic Sign-In Testing](#basic-sign-in-testing)
3. [Biometric Testing](#biometric-testing)
4. [Session Management Testing](#session-management-testing)
5. [RBAC Testing](#rbac-testing)
6. [Security Testing](#security-testing)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before testing, ensure:

- Application is running on `http://localhost:3000`
- Database is configured and migrations completed
- Demo users have been seeded into the database
- Environment variables are properly set

**Demo Credentials:**

```
Email                Password              Role
master@qmo.ai        MasterPass123!        Master
sister@qmo.ai        SisterPass123!        Sister
demo@qmo.ai          demo                  User
user@qmo.ai          TestUser123!          User
```

## Basic Sign-In Testing

### Test 1.1: Successful Sign-In with Valid Credentials

**Endpoint:** `POST /api/auth/signin`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@qmo.ai",
    "password": "demo"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Sign-in successful",
  "user": {
    "id": "user-id",
    "email": "demo@qmo.ai",
    "username": "demo_user",
    "role": "User"
  },
  "sessionToken": "jwt-token-here"
}
```

**Verification Points:**
- ✅ Status code is 200
- ✅ Response contains `sessionToken`
- ✅ User details match database record
- ✅ HTTP-only cookie `session` is set in response headers
- ✅ No password hash is returned

### Test 1.2: Failed Sign-In with Invalid Password

**Endpoint:** `POST /api/auth/signin`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@qmo.ai",
    "password": "wrongpassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Verification Points:**
- ✅ Status code is 401
- ✅ No session token is issued
- ✅ No HTTP-only cookie is set

### Test 1.3: Failed Sign-In with Non-Existent Email

**Endpoint:** `POST /api/auth/signin`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@qmo.ai",
    "password": "anypassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Verification Points:**
- ✅ Status code is 401
- ✅ Error message doesn't reveal whether email exists (security best practice)

## Biometric Testing

### Test 2.1: Capture Biometric Data

**Endpoint:** `POST /api/auth/biometric`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/biometric \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-token" \
  -d '{
    "method": "fingerprint",
    "data": "biometric-data-blob",
    "userId": "user-id"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Biometric captured successfully",
  "biometricId": "biometric-id"
}
```

**Verification Points:**
- ✅ Status code is 200
- ✅ Biometric ID is returned
- ✅ Biometric data is stored (not returned in response)
- ✅ Requires valid session token

### Test 2.2: Biometric Verification

**Endpoint:** `POST /api/auth/biometric/verify`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/biometric/verify \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-token" \
  -d '{
    "method": "fingerprint",
    "data": "biometric-data-blob",
    "userId": "user-id"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Biometric verified successfully",
  "match": true,
  "confidence": 0.95
}
```

**Verification Points:**
- ✅ Biometric verification returns confidence score
- ✅ Match result is boolean
- ✅ Requires valid session token

## Session Management Testing

### Test 3.1: Session Validation

**Endpoint:** `GET /api/auth/session`

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: session=your-session-token"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "session": {
    "userId": "user-id",
    "email": "demo@qmo.ai",
    "role": "User",
    "createdAt": "2026-05-10T10:00:00Z",
    "expiresAt": "2026-06-09T10:00:00Z",
    "ipAddress": "127.0.0.1",
    "userAgent": "curl/7.64.0"
  }
}
```

**Verification Points:**
- ✅ Status code is 200
- ✅ Session includes user and expiration details
- ✅ Session includes IP address tracking
- ✅ Session includes User-Agent for security audits

### Test 3.2: Expired Session Handling

**Procedure:**
1. Create a session
2. Wait for session expiration (or test with mock expiration)
3. Send request with expired token

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Session expired"
}
```

**Verification Points:**
- ✅ Status code is 401
- ✅ Expired sessions are rejected
- ✅ User must re-authenticate

### Test 3.3: Session Sign-Out

**Endpoint:** `POST /api/auth/signout`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signout \
  -H "Cookie: session=your-session-token"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

**Verification Points:**
- ✅ Status code is 200
- ✅ Session cookie is cleared
- ✅ Subsequent requests with this token are rejected

## RBAC Testing

### Test 4.1: Master Role Authorization

**Endpoint:** `POST /api/admin/users` (or any Master-only endpoint)

**Request with Master Session:**
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: session=master-session-token" \
  -d '{
    "email": "newuser@qmo.ai",
    "username": "new_user",
    "role": "User"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "new-user-id",
    "email": "newuser@qmo.ai",
    "role": "User"
  }
}
```

**Verification Points:**
- ✅ Master user can access admin endpoints
- ✅ User creation is permitted
- ✅ Role is correctly assigned

### Test 4.2: Sister Role Authorization

**Endpoint:** `POST /api/admin/users` (Master-only)

**Request with Sister Session:**
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: session=sister-session-token" \
  -d '{
    "email": "newuser@qmo.ai",
    "username": "new_user",
    "role": "User"
  }'
```

**Expected Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied: insufficient permissions"
}
```

**Verification Points:**
- ✅ Status code is 403
- ✅ Sister user cannot access Master-only endpoints
- ✅ Appropriate error message is returned

### Test 4.3: User Role Authorization

**Endpoint:** `GET /api/profile` (User-accessible)

**Request with User Session:**
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Cookie: session=user-session-token"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "id": "user-id",
    "email": "demo@qmo.ai",
    "username": "demo_user",
    "role": "User"
  }
}
```

**Verification Points:**
- ✅ User can access their own profile
- ✅ User-level permissions work correctly

## Security Testing

### Test 5.1: Password Hashing Verification

**Procedure:**
1. Query the database directly
2. Check that passwords are stored as bcrypt hashes

**Expected:**
```sql
SELECT email, authProfile->>'passwordHash' FROM users WHERE email = 'demo@qmo.ai';
```

**Expected Result:**
- ✅ Password hash should start with `$2b$` or `$2y$` (bcrypt format)
- ✅ Hash should be 60 characters long
- ✅ Raw passwords should never be in logs or responses

### Test 5.2: IP Address Tracking

**Procedure:**
1. Sign in from different IP addresses
2. Query session logs

**Expected:**
```sql
SELECT "ipAddress", "userAgent", "createdAt" FROM sessions WHERE "userId" = 'user-id' ORDER BY "createdAt" DESC;
```

**Verification Points:**
- ✅ Each session logs the source IP address
- ✅ User-Agent is captured for security audits
- ✅ Suspicious login patterns can be detected

### Test 5.3: HTTP-Only Cookie Security

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -i \
  -d '{
    "email": "demo@qmo.ai",
    "password": "demo"
  }'
```

**Expected Headers:**
```
Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000
```

**Verification Points:**
- ✅ `HttpOnly` flag prevents JavaScript access
- ✅ `Secure` flag ensures HTTPS-only transmission
- ✅ `SameSite=Strict` prevents CSRF attacks
- ✅ `Max-Age=2592000` sets 30-day expiration

### Test 5.4: Audit Logging

**Procedure:**
1. Perform multiple auth operations
2. Check logs

**Expected Log Entries:**
```
[AUTH] User signin event: demo@qmo.ai, IP: 127.0.0.1, Status: success
[AUTH] Biometric capture event: user-id, method: fingerprint, Status: success
[AUTH] Session validation: Valid session for user-id
[ERROR] Failed signin attempt: demo@qmo.ai, Invalid password
```

**Verification Points:**
- ✅ All auth events are logged
- ✅ Logs include user email, IP, and result
- ✅ Failed attempts are logged separately

## Troubleshooting

### Issue: 400 Bad Request on Sign-In

**Possible Causes:**
- Missing required fields (email, password)
- Invalid JSON format
- Field names misspelled

**Solution:**
```bash
# Verify request format
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@qmo.ai",
    "password": "demo"
  }'
```

### Issue: 500 Internal Server Error

**Possible Causes:**
- Database connection failed
- Missing environment variables
- Prisma client not generated

**Solution:**
```bash
# Run startup verification
bash scripts/verify-startup.sh

# Generate Prisma client
npx prisma generate

# Check logs for details
npm run dev  # View full error logs
```

### Issue: Database Migration Errors

**Possible Causes:**
- Database already has conflicting schema
- PostgreSQL is not running
- Incorrect DATABASE_URL

**Solution:**
```bash
# Verify database connection
echo $DATABASE_URL

# Check if PostgreSQL is running
psql $DATABASE_URL -c "SELECT version();"

# Reset database (development only!)
npx prisma db push --skip-generate --force-reset
```

### Issue: Biometric Verification Always Fails

**Possible Causes:**
- Biometric data format mismatch
- No captured biometric in database
- Biometric algorithm mismatch

**Solution:**
- Ensure biometric capture succeeds first
- Verify biometric data is stored in database
- Check biometric method matches (fingerprint/facial/voice)

## Performance Benchmarks

**Expected Performance:**

| Operation | Target Time | Typical Time |
|-----------|------------|--------------|
| Sign-In | < 500ms | 200-400ms |
| Biometric Capture | < 1s | 500-800ms |
| Session Validation | < 100ms | 50-100ms |
| RBAC Check | < 50ms | 10-50ms |
| Database Write | < 100ms | 50-100ms |

## Next Steps

1. **Automated Testing:** Create Jest/Mocha test suites
2. **Load Testing:** Use Artillery or k6 for load tests
3. **Security Audit:** Conduct penetration testing
4. **Monitoring:** Set up real-time auth monitoring
5. **Documentation:** Create API documentation with Swagger/OpenAPI

## Support

For issues or questions about authentication testing:

- Check [PRODUCTION_AUTH_IMPLEMENTATION.md](PRODUCTION_AUTH_IMPLEMENTATION.md)
- Review [lib/auth-service.ts](lib/auth-service.ts)
- Run startup verification: `bash scripts/verify-startup.sh`
- Check logs: `npm run dev` and look for `[AUTH]` entries

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:25.951250Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 555
- words: 1585
- characters: 12541
- headings: 40
- links: 9
- images: 0
- tables: 7
- lion validation block: present
<!-- LION_VALIDATION_END -->
