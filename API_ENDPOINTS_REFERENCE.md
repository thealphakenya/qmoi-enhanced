# QMOI API Endpoints Reference - Role-Based Access Control

**Status:** ✅ Complete  
**Version:** 1.2.3  
**Last Updated:** 2024  
**RBAC Implementation:** ✅ Active

---

## Quick Summary

- **Total Endpoints:** 25+
- **Authentication Method:** JWT Bearer Token (8-hour expiration)
- **Role-Based Access:** Enabled on all endpoints
- **Enforcement:** Both client-side and server-side
- **Default Role:** guest (public access only)

---

## Role Access Matrix

| Endpoint Category | Master | Admin | User | Sponsored | Guest |
|------------------|--------|-------|------|-----------|-------|
| Auth (login) | ✅ | ✅ | ✅ | ✅ | ❌ |
| WebAuthn | ✅ | ✅ | ✅ | ❌ | ❌ |
| Voice | ✅ | ✅ | ✅ | ❌ | ❌ |
| Biometric | ✅ | ✅ | ✅ | ❌ | ❌ |
| Session | ✅ | ✅ | ✅ | ✅ | ❌ |
| Users (list) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Users (own profile) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ❌ | ❌ | ❌ |
| Master | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Biometric Endpoints](#biometric-endpoints)
3. [User Management Endpoints](#user-management-endpoints)
4. [Session Management](#session-management)
5. [Admin Endpoints](#admin-endpoints)
6. [Master-Only Endpoints](#master-only-endpoints)
7. [Role-Based Access Control](#role-based-access-control)
8. [Authentication Headers](#authentication-headers)
9. [Error Responses](#error-responses)

---

## Authentication Endpoints

### Email/Password Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user with email/password credentials

**Access:** `user`, `admin`, `master`, `sponsored`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "role": "Administrator"
  }
}
```

**Errors:**
- `400 Bad Request` - Missing username or password
- `401 Unauthorized` - Invalid credentials

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "adminpass"
  }'
```

---

## Biometric Endpoints

### Register WebAuthn Credential
**Endpoint:** `POST /api/webauthn/register`

**Description:** Register fingerprint or face biometric credential

**Access:** `user`, `admin`, `master`

**Request Body:**
```json
{
  "userId": "1",
  "username": "admin",
  "displayName": "Admin User",
  "challenge": "string",
  "credentialData": {
    "id": "string",
    "publicKey": "string",
    "counter": 0
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "WebAuthn credential registered successfully",
  "credentialId": "cred_1234567890",
  "credential": {
    "id": "string",
    "userId": "1",
    "type": "public-key",
    "transports": ["internal", "usb"]
  }
}
```

**Errors:**
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Credential already exists
- `500 Internal Server Error` - Storage error

**Example:**
```bash
curl -X POST http://localhost:3000/api/webauthn/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "1",
    "username": "admin",
    "displayName": "Admin User",
    "challenge": "mock_challenge_data",
    "credentialData": {
      "id": "mock_cred_id",
      "publicKey": "mock_public_key",
      "counter": 0
    }
  }'
```

---

### Authenticate with WebAuthn
**Endpoint:** `POST /api/webauthn/authenticate`

**Description:** Verify fingerprint or face biometric for authentication

**Access:** `user`, `admin`, `master`

**Request Body:**
```json
{
  "userId": "1",
  "challenge": "string",
  "credentialId": "string",
  "authenticatorData": "string",
  "clientDataJSON": "string",
  "signature": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "WebAuthn authentication successful",
  "confidence": 0.95,
  "authenticatedAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Credential not found

**Example:**
```bash
curl -X POST http://localhost:3000/api/webauthn/authenticate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "1",
    "challenge": "mock_challenge",
    "credentialId": "cred_1234567890",
    "authenticatorData": "mock_auth_data",
    "clientDataJSON": "mock_client_data",
    "signature": "mock_signature"
  }'
```

---

### Enroll Voice Profile
**Endpoint:** `POST /api/voice/enroll`

**Description:** Enroll voice biometric profile for voice authentication

**Access:** `user`, `admin`, `master`

**Request Body:**
```json
{
  "userId": "1",
  "username": "admin",
  "audioData": "base64_encoded_audio",
  "duration": 5000,
  "language": "en-US"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Voice profile enrolled successfully",
  "profileId": "voice_1234567890",
  "quality": 0.91,
  "enrolledAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid audio data
- `409 Conflict` - Voice profile already exists
- `500 Internal Server Error` - Processing error

---

### Verify Voice Biometric
**Endpoint:** `POST /api/voice/verify`

**Description:** Verify voice biometric during authentication

**Access:** `user`, `admin`, `master`

**Request Body:**
```json
{
  "userId": "1",
  "audioData": "base64_encoded_audio",
  "duration": 3000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Voice verification successful",
  "confidence": 0.82,
  "verifiedAt": "2024-01-15T10:35:00Z"
}
```

**Errors:**
- `400 Bad Request` - Missing audio data
- `401 Unauthorized` - Verification failed
- `404 Not Found` - Voice profile not found

---

### Store Biometric Template
**Endpoint:** `POST /api/biometric/templates`

**Description:** Store fingerprint, iris, or other biometric templates

**Access:** `user`, `admin`, `master`

**Request Body:**
```json
{
  "userId": "1",
  "type": "fingerprint",
  "finger": "right_index",
  "templateData": "base64_encoded_template",
  "quality": 0.87
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Biometric template stored successfully",
  "templateId": "tmpl_1234567890",
  "storedAt": "2024-01-15T10:30:00Z"
}
```

---

### Retrieve Biometric Templates
**Endpoint:** `GET /api/biometric/templates`

**Description:** Get user's stored biometric templates

**Access:** `user`, `admin`, `master` (personal data with appropriate role checks)

**Query Parameters:**
- `userId` (required) - User ID

**Response (200 OK):**
```json
{
  "success": true,
  "userId": "1",
  "templates": [
    {
      "id": "tmpl_1234567890",
      "type": "fingerprint",
      "finger": "right_index",
      "quality": 0.87,
      "storedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Verify Biometric Template
**Endpoint:** `POST /api/biometric/verify`

**Description:** Verify biometric data against stored template

**Access:** `user`, `admin`, `master`

**Request Body:**
```json
{
  "userId": "1",
  "type": "fingerprint",
  "data": "base64_encoded_biometric_data"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "fingerprint biometric verification successful",
  "userId": "1",
  "type": "fingerprint",
  "confidence": 0.87
}
```

**Errors:**
- `400 Bad Request` - Missing fields
- `401 Unauthorized` - Verification failed
- `404 Not Found` - No biometric template found

---

## Session Management

### Create/Validate Session
**Endpoint:** `POST /api/qmoi/session`

**Description:** Create authenticated session with QMOI memory integration

**Access:** `user`, `admin`, `master`, `sponsored`

**Request Body:**
```json
{
  "userId": "1",
  "username": "admin",
  "role": "Administrator",
  "biometricMethods": ["fingerprint", "voice"],
  "deviceId": "device_abc123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "sessionId": "sess_1234567890",
  "userId": "1",
  "expiresAt": "2024-01-15T18:30:00Z",
  "ttl": 28800
}
```

**Errors:**
- `400 Bad Request` - Missing fields
- `401 Unauthorized` - Invalid user
- `500 Internal Server Error` - Session creation failed

---

### Get Session Info
**Endpoint:** `GET /api/qmoi/session`

**Description:** Retrieve current session information

**Access:** `user`, `admin`, `master`, `sponsored` (authenticated users)

**Query Parameters:**
- `sessionId` (required) - Session ID

**Response (200 OK):**
```json
{
  "success": true,
  "sessionId": "sess_1234567890",
  "userId": "1",
  "username": "admin",
  "role": "Administrator",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-15T18:30:00Z",
  "biometricMethods": ["fingerprint", "voice"]
}
```

---

## User Management Endpoints

### List All Users
**Endpoint:** `GET /api/users/list`

**Description:** Get list of all users (admin/master only)

**Access:** `admin`, `master`

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@qmoi.com",
      "role": "Administrator",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 5
}
```

**Errors:**
- `403 Forbidden` - Insufficient permissions

---

### Get User Profile
**Endpoint:** `GET /api/users/profile`

**Description:** Get own or another user's profile

**Access:** `user`, `admin`, `master` (with role checks)

**Query Parameters:**
- `userId` (optional) - Target user ID (default: current user)

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@qmoi.com",
    "role": "Administrator",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update User Profile
**Endpoint:** `PUT /api/users/update`

**Description:** Update user profile information

**Access:** `user`, `admin`, `master` (users can only update own profile)

**Request Body:**
```json
{
  "userId": "1",
  "name": "New Name",
  "email": "newemail@qmoi.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "1",
    "name": "New Name",
    "email": "newemail@qmoi.com"
  }
}
```

---

### Delete User
**Endpoint:** `DELETE /api/users/delete`

**Description:** Delete user account (admin/master only)

**Access:** `admin`, `master`

**Query Parameters:**
- `userId` (required) - User ID to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - User not found

---

## Admin Endpoints

### Sponsored User Management
**Endpoint:** `POST /api/admin/sponsored/create`

**Description:** Create new sponsored user

**Access:** `admin`, `master`

**Request Body:**
```json
{
  "username": "sponsored_user",
  "email": "sponsored@qmoi.com",
  "sponsorId": "1",
  "programId": "prog_123",
  "features": ["chat", "trading"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sponsored user created",
  "userId": "5",
  "sponsoredUntil": "2024-12-31T23:59:59Z"
}
```

---

### List Sponsored Users
**Endpoint:** `GET /api/admin/sponsored/list`

**Description:** Get list of sponsored users

**Access:** `admin`, `master`

**Query Parameters:**
- `sponsorId` (optional) - Filter by sponsor
- `programId` (optional) - Filter by program

**Response (200 OK):**
```json
{
  "success": true,
  "sponsoredUsers": [
    {
      "id": "5",
      "username": "sponsored_user",
      "sponsorId": "1",
      "programId": "prog_123",
      "sponsoredUntil": "2024-12-31T23:59:59Z"
    }
  ],
  "count": 1
}
```

---

### Delete Sponsored User
**Endpoint:** `DELETE /api/admin/sponsored/delete`

**Description:** Remove sponsored user

**Access:** `admin`, `master`

**Query Parameters:**
- `userId` (required) - Sponsored user ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sponsored user deleted"
}
```

---

## Master-Only Endpoints

### System Configuration
**Endpoint:** `GET /api/master/system/config`

**Description:** Get system configuration

**Access:** `master`

**Response (200 OK):**
```json
{
  "version": "1.2.3",
  "environment": "production",
  "features": {
    "biometric": true,
    "voice": true,
    "trading": true
  }
}
```

---

### Audit Trail
**Endpoint:** `GET /api/master/audit/trail`

**Description:** Get system audit logs

**Access:** `master`

**Query Parameters:**
- `limit` (optional) - Maximum records to return (default: 100)
- `offset` (optional) - Start offset (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "logs": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "action": "user_login",
      "userId": "1",
      "details": "User logged in via WebAuthn"
    }
  ],
  "count": 1
}
```

---

## Authentication Headers

All authenticated endpoints require the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

**JWT Token Contents:**
```json
{
  "id": "1",
  "username": "admin",
  "role": "Administrator",
  "iat": 1234567890,
  "exp": 1234596690
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: username, password"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Biometric endpoints:** 10 requests per minute per user
- **Login endpoint:** 5 failed attempts per hour per IP
- **Admin endpoints:** 100 requests per minute per admin

---

## Testing All Endpoints

### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpass"}'
```

### 2. Register WebAuthn
```bash
curl -X POST http://localhost:3000/api/webauthn/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"userId":"2","username":"admin","displayName":"Admin User","challenge":"test","credentialData":{"id":"test","publicKey":"test","counter":0}}'
```

### 3. Create Session
```bash
curl -X POST http://localhost:3000/api/qmoi/session \
  -H "Content-Type: application/json" \
  -d '{"userId":"2","username":"admin","role":"Administrator","biometricMethods":["fingerprint"],"deviceId":"device123"}'
```

---

**Document Version:** 1.2.3  
**Author:** QMOI Development  
**Last Updated:** 2024
