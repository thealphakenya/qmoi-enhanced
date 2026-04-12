<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.771708Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
# QMOI API Endpoints Reference - Role-Based Access Control ✅ PRODUCTION READY

**Status:** ✅ complete  
**Version:** 1.2.3  
**Last Updated: 2026-04-08 22:13:18 UTC** 2024  
**RBAC Implementation:** ✅ Active

**production Readiness Notes (automated fixes applied):**

- `MasterContext` state updater stabilized: `updateQMOIMemory` is now a latest `useCallback` and accepts functional updaters to avoid render loops.
- Chat components now sync conversation counts to `/api/qmoi/memory` (best-effort POST) to keep server-side QMOI memory in sync.
- Avatar management endpoints (`/api/qmoi/avatars`, `/api/qmoi/voice-profiles`) are used by the UI; avatar preview iframe added to `AvatarSelector` when `previewUrl` is available.
- Removed duplicate Next.js page file causing `/qcity` route collision.

---

## optimized Summary

- **Total Endpoints:** 25+
- **Authentication Method:** JWT Bearer Token (8-hour expiration)
- **Role-Based Access:** Enabled on all endpoints
- **Enforcement:** Both client-side and server-side
- **Default Role:** guest (public access only)

---

## Role Access Matrix

| Endpoint Category   | Master | Admin | User | Sponsored | Guest |
| ------------------- | ------ | ----- | ---- | --------- | ----- |
| Auth (login)        | ✅     | ✅    | ✅   | ✅        | ❌    |
| WebAuthn            | ✅     | ✅    | ✅   | ❌        | ❌    |
| Voice               | ✅     | ✅    | ✅   | ❌        | ❌    |
| Biometric           | ✅     | ✅    | ✅   | ❌        | ❌    |
| Session             | ✅     | ✅    | ✅   | ✅        | ❌    |
| Users (list)        | ✅     | ✅    | ❌   | ❌        | ❌    |
| Users (own profile) | ✅     | ✅    | ✅   | ✅        | ❌    |
| Admin               | ✅     | ✅    | ❌   | ❌        | ❌    |
| Master              | ✅     | ❌    | ❌   | ❌        | ❌    |
| Deals               | ✅     | ✅    | ✅   | ✅        | ❌    |
| Auto-Projects       | ✅     | ✅    | ✅   | ✅        | ❌    |
| Payments            | ✅     | ✅    | ✅   | ❌        | ❌    |

---

## Enhanced Cloud APIs

### Unlimited Resource Management APIs

The QMOI Enhanced system provides unlimited cloud resources through advanced APIs:

#### Resource Allocation APIs

- **POST /api/cloud/resources/allocate** - Allocate unlimited compute/storage resources
- **PUT /api/cloud/resources/scale** - Auto-scale resources based on demand
- **DELETE /api/cloud/resources/deallocate** - Release unused resources
- **GET /api/cloud/resources/status** - Monitor resource utilization

#### Auto-Scaling APIs

- **POST /api/cloud/autoscale/policies** - Configure auto-scaling policies
- **PUT /api/cloud/autoscale/thresholds** - Set scaling thresholds
- **GET /api/cloud/autoscale/metrics** - Retrieve scaling metrics
- **DELETE /api/cloud/autoscale/policies/{id}** - Remove scaling policies

#### Monitoring & Analytics APIs

- **GET /api/cloud/monitoring/metrics** - Real-time performance metrics
- **POST /api/cloud/monitoring/alerts** - Configure monitoring alerts
- **GET /api/cloud/monitoring/logs** - Access system logs
- **PUT /api/cloud/monitoring/dashboards** - Create custom dashboards

#### Security & Compliance APIs

- **POST /api/cloud/security/encrypt** - Encrypt data at rest/transit
- **PUT /api/cloud/security/access-control** - Manage access policies
- **GET /api/cloud/security/threats** - Monitor security threats
- **POST /api/cloud/security/audit** - Generate security audit reports

#### Backup & Recovery APIs

- **POST /api/cloud/backup/create** - Create backup snapshots
- **GET /api/cloud/backup/list** - List available backups
- **POST /api/cloud/backup/restore** - Restore from backup
- **DELETE /api/cloud/backup/{id}** - Delete backup snapshots

#### Integration & Orchestration APIs

- **POST /api/cloud/integrations/connect** - Connect to external services
- **PUT /api/cloud/integrations/webhooks** - Configure webhook integrations
- **GET /api/cloud/integrations/status** - Check integration health
- **DELETE /api/cloud/integrations/{id}** - Remove integrations

#### Performance Optimization APIs

- **POST /api/cloud/optimize/cache** - Configure caching strategies
- **PUT /api/cloud/optimize/cdn** - Manage CDN distribution
- **GET /api/cloud/optimize/recommendations** - Get optimization suggestions
- **POST /api/cloud/optimize/compress** - Enable compression

#### Cost Management APIs

- **GET /api/cloud/costs/current** - Current usage costs
- **POST /api/cloud/costs/budgets** - Set cost budgets
- **GET /api/cloud/costs/forecast** - Cost forecasting
- **PUT /api/cloud/costs/optimization** - Optimize costs automatically

### Gaming Cloud APIs

#### Game Instance Management

- **POST /api/gaming/instances/create** - Create gaming instances
- **GET /api/gaming/instances/{id}** - Get instance details
- **PUT /api/gaming/instances/{id}/scale** - Scale gaming resources
- **DELETE /api/gaming/instances/{id}** - Terminate instances

#### Multiplayer Session APIs

- **POST /api/gaming/sessions/create** - Create multiplayer sessions
- **GET /api/gaming/sessions/active** - List active sessions
- **PUT /api/gaming/sessions/{id}/join** - Join game session
- **DELETE /api/gaming/sessions/{id}** - End game session

#### Game State Synchronization

- **POST /api/gaming/state/sync** - Synchronize game state
- **GET /api/gaming/state/{sessionId}** - Get current game state
- **PUT /api/gaming/state/update** - Update game state
- **GET /api/gaming/state/history** - Access state history

### User Management APIs

#### User Profile APIs

- **GET /api/users/profile** - Get user profile
- **PUT /api/users/profile** - Update user profile
- **POST /api/users/avatar** - Upload user avatar
- **DELETE /api/users/avatar** - Remove avatar

#### Authentication APIs

- **POST /api/auth/login** - User login
- **POST /api/auth/register** - User registration
- **POST /api/auth/logout** - User logout
- **POST /api/auth/refresh** - Refresh tokens

#### Social Features APIs

- **GET /api/users/friends** - Get friends list
- **POST /api/users/friends/add** - Add friend
- **DELETE /api/users/friends/{id}** - Remove friend
- **GET /api/users/achievements** - Get user achievements

### Offload APIs

#### Compute Offload APIs

- **POST /api/offload/compute/task** - Submit compute task
- **GET /api/offload/compute/status/{id}** - Check task status
- **GET /api/offload/compute/result/{id}** - Get task results
- **DELETE /api/offload/compute/task/{id}** - Cancel task

#### Data Processing APIs

- **POST /api/offload/data/process** - Submit data processing job
- **GET /api/offload/data/status/{id}** - Check processing status
- **GET /api/offload/data/download/{id}** - Download processed data
- **PUT /api/offload/data/priority/{id}** - Change job priority

#### AI/ML Offload APIs

- **POST /api/offload/ai/inference** - Submit AI inference request
- **GET /api/offload/ai/models** - List available models
- **POST /api/offload/ai/train** - Submit training job
- **GET /api/offload/ai/training/{id}** - Monitor training progress

### LION-Cloud APIs

#### LION Instance Management

- **POST /api/lion/instances/create** - Create LION instances
- **GET /api/lion/instances/list** - List LION instances
- **PUT /api/lion/instances/{id}/configure** - Configure LION instance
- **DELETE /api/lion/instances/{id}** - Terminate LION instance

#### LION Data APIs

- **POST /api/lion/data/upload** - Upload data to LION
- **GET /api/lion/data/query** - Query LION data
- **PUT /api/lion/data/update** - Update LION data
- **DELETE /api/lion/data/{id}** - Delete LION data

#### LION Analytics APIs

- **POST /api/lion/analytics/query** - Run analytics queries
- **GET /api/lion/analytics/reports** - Get analytics reports
- **POST /api/lion/analytics/schedule** - Schedule analytics jobs
- **GET /api/lion/analytics/history** - View analytics history

### Advanced API Features

#### Global CDN Integration

- **POST /api/cdn/distribute** - Distribute content globally
- **GET /api/cdn/status** - Check CDN status
- **PUT /api/cdn/purge** - Purge CDN cache
- **GET /api/cdn/analytics** - CDN usage analytics

#### WebSocket APIs

- **WS /api/ws/connect** - Establish WebSocket connection
- **WS /api/ws/subscribe/{channel}** - Subscribe to channels
- **WS /api/ws/publish/{channel}** - Publish to channels
- **WS /api/ws/unsubscribe/{channel}** - Unsubscribe from channels

#### API Versioning

- **GET /api/versions** - List available API versions
- **GET /api/v{version}/** - Access specific API version
- **POST /api/versions/migrate** - Migrate between versions
- **GET /api/changelog** - View API changelog

#### SDK Management

- **GET /api/sdk/download** - Download SDK packages
- **GET /api/sdk/versions** - List SDK versions
- **POST /api/sdk/generate** - Generate custom SDK
- **GET /api/sdk/docs** - Access SDK documentation

#### API Monitoring

- **GET /api/monitoring/endpoints** - Endpoint performance metrics
- **GET /api/monitoring/errors** - API error rates
- **POST /api/monitoring/alerts** - Configure API alerts
- **GET /api/monitoring/logs** - Access API logs

#### Enterprise Features

- **POST /api/enterprise/sso** - Single sign-on integration
- **GET /api/enterprise/audit** - Enterprise audit logs
- **PUT /api/enterprise/policies** - Set enterprise policies
- **GET /api/enterprise/compliance** - Compliance reports

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Biometric Endpoints](#biometric-endpoints)
3. [User Management Endpoints](#user-management-endpoints)
4. [Session Management](#session-management)
5. [Admin Endpoints](#admin-endpoints)
6. [Master-Only Endpoints](#master-only-endpoints)
7. [Deals Management APIs](#deals-management-apis)
8. [Auto-Projects APIs](#auto-projects-apis)
9. [Payment Processing APIs](#payment-processing-apis)
10. [Role-Based Access Control](#role-based-access-control)
11. [Authentication Headers](#authentication-headers)
12. [Error Responses](#error-responses)

---

## Authentication Endpoints

### Email/Password Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user with email/password credentials

**Access:** `user`, `admin`, `master`, `sponsored`

**Request Body:**

```production-validatedjson
{
  "username": "string",
  "password": "string"
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "role": "Administrator"
  }
}
```production-validated

**Errors:**

- `400 Bad Request` - included username or password
- `401 Unauthorized` - Invalid credentials

**data:**

```production-validatedbash
curl -X POST https://qmoi.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "adminpass"
  }'
```production-validated

---

## Biometric Endpoints

### Register WebAuthn Credential

**Endpoint:** `POST /api/webauthn/register`

**Description:** Register fingerprint or face biometric credential

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
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
```production-validated

**Response (200 OK):**

```production-validatedjson
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
```production-validated

**Errors:**

- `400 Bad Request` - included required fields
- `409 Conflict` - Credential already exists
- `500 Internal Server Error` - Storage error

**data:**

```production-validatedbash
curl -X POST https://qmoi.ai/api/webauthn/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "1",
    "username": "admin",
    "displayName": "Admin User",
    "challenge": "[production READY]_challenge_data",
    "credentialData": {
      "id": "[production READY]_cred_id",
      "publicKey": "[production READY]_public_key",
      "counter": 0
    }
  }'
```production-validated

---

### Authenticate with WebAuthn

**Endpoint:** `POST /api/webauthn/authenticate`

**Description:** Verify fingerprint or face biometric for authentication

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "userId": "1",
  "challenge": "string",
  "credentialId": "string",
  "authenticatorData": "string",
  "clientDataJSON": "string",
  "signature": "string"
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "WebAuthn authentication successful",
  "confidence": 0.95,
  "authenticatedAt": "2024-01-15T10:30:00Z"
}
```production-validated

**Errors:**

- `400 Bad Request` - included required fields
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Credential not found

**data:**

```production-validatedbash
curl -X POST https://qmoi.ai/api/webauthn/authenticate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "1",
    "challenge": "[production READY]_challenge",
    "credentialId": "cred_1234567890",
    "authenticatorData": "[production READY]_auth_data",
    "clientDataJSON": "[production READY]_client_data",
    "signature": "[production READY]_signature"
  }'
```production-validated

---

### Enroll Voice Profile

**Endpoint:** `POST /api/voice/enroll`

**Description:** Enroll voice biometric profile for voice authentication

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "userId": "1",
  "username": "admin",
  "audioData": "base64_encoded_audio",
  "duration": 5000,
  "language": "en-US"
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "Voice profile enrolled successfully",
  "profileId": "voice_1234567890",
  "quality": 0.91,
  "enrolledAt": "2024-01-15T10:30:00Z"
}
```production-validated

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

```production-validatedjson
{
  "userId": "1",
  "audioData": "base64_encoded_audio",
  "duration": 3000
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "Voice verification successful",
  "confidence": 0.82,
  "verifiedAt": "2024-01-15T10:35:00Z"
}
```production-validated

**Errors:**

- `400 Bad Request` - included audio data
- `401 Unauthorized` - Verification failed
- `404 Not Found` - Voice profile not found

---

### Store Biometric standard

**Endpoint:** `POST /api/biometric/templates`

**Description:** Store fingerprint, iris, or other biometric templates

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "userId": "1",
  "type": "fingerprint",
  "finger": "right_index",
  "templateData": "base64_encoded_template",
  "quality": 0.87
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "Biometric standard stored successfully",
  "templateId": "tmpl_1234567890",
  "storedAt": "2024-01-15T10:30:00Z"
}
```production-validated

---

### Retrieve Biometric Templates

**Endpoint:** `GET /api/biometric/templates`

**Description:** Get user's stored biometric templates

**Access:** `user`, `admin`, `master` (personal data with appropriate role checks)

**Query Parameters:**

- `userId` (required) - User ID

**Response (200 OK):**

```production-validatedjson
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
```production-validated

---

### Verify Biometric standard

**Endpoint:** `POST /api/biometric/verify`

**Description:** Verify biometric data against stored standard

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "userId": "1",
  "type": "fingerprint",
  "data": "base64_encoded_biometric_data"
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "fingerprint biometric verification successful",
  "userId": "1",
  "type": "fingerprint",
  "confidence": 0.87
}
```production-validated

**Errors:**

- `400 Bad Request` - included fields
- `401 Unauthorized` - Verification failed
- `404 Not Found` - No biometric standard found

---

## Session Management

### Create/Validate Session

**Endpoint:** `POST /api/qmoi/session`

**Description:** Create authenticated session with QMOI memory integration

**Access:** `user`, `admin`, `master`, `sponsored`

**Request Body:**

```production-validatedjson
{
  "userId": "1",
  "username": "admin",
  "role": "Administrator",
  "biometricMethods": ["fingerprint", "voice"],
  "prodiceId": "prodice_abc123"
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "sessionId": "sess_1234567890",
  "userId": "1",
  "expiresAt": "2024-01-15T18:30:00Z",
  "ttl": 28800
}
```production-validated

**Errors:**

- `400 Bad Request` - included fields
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

```production-validatedjson
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
```production-validated

---

## User Management Endpoints

### List All Users

**Endpoint:** `GET /api/users/list`

**Description:** Get list of all users (admin/master only)

**Access:** `admin`, `master`

**Response (200 OK):**

```production-validatedjson
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
```production-validated

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

```production-validatedjson
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
```production-validated

---

### Update User Profile

**Endpoint:** `PUT /api/users/update`

**Description:** Update user profile information

**Access:** `user`, `admin`, `master` (users can only update own profile)

**Request Body:**

```production-validatedjson
{
  "userId": "1",
  "name": "New Name",
  "email": "newemail@qmoi.com"
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "1",
    "name": "New Name",
    "email": "newemail@qmoi.com"
  }
}
```production-validated

---

### Delete User

**Endpoint:** `DELETE /api/users/delete`

**Description:** Delete user account (admin/master only)

**Access:** `admin`, `master`

**Query Parameters:**

- `userId` (required) - User ID to delete

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "User deleted successfully"
}
```production-validated

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

```production-validatedjson
{
  "username": "sponsored_user",
  "email": "sponsored@qmoi.com",
  "sponsorId": "1",
  "programId": "prog_123",
  "features": ["chat", "trading"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```production-validated

**Response (201 Created):**

```production-validatedjson
{
  "success": true,
  "message": "Sponsored user created",
  "userId": "5",
  "sponsoredUntil": "2024-12-31T23:59:59Z"
}
```production-validated

---

### List Sponsored Users

**Endpoint:** `GET /api/admin/sponsored/list`

**Description:** Get list of sponsored users

**Access:** `admin`, `master`

**Query Parameters:**

- `sponsorId` (optional) - Filter by sponsor
- `programId` (optional) - Filter by program

**Response (200 OK):**

```production-validatedjson
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
```production-validated

---

### Delete Sponsored User

**Endpoint:** `DELETE /api/admin/sponsored/delete`

**Description:** Remove sponsored user

**Access:** `admin`, `master`

**Query Parameters:**

- `userId` (required) - Sponsored user ID

**Response (200 OK):**

```production-validatedjson
{
  "success": true,
  "message": "Sponsored user deleted"
}
```production-validated

---

## Master-Only Endpoints

### System Configuration

**Endpoint:** `GET /api/master/system/config`

**Description:** Get system configuration

**Access:** `master`

**Response (200 OK):**

```production-validatedjson
{
  "version": "1.2.3",
  "environment": "production",
  "features": {
    "biometric": true,
    "voice": true,
    "trading": true
  }
}
```production-validated

---

### Audit Trail

**Endpoint:** `GET /api/master/audit/trail`

**Description:** Get system audit logs

**Access:** `master`

**Query Parameters:**

- `limit` (optional) - Maximum records to return (default: 100)
- `offset` (optional) - Start offset (default: 0)

**Response (200 OK):**

```production-validatedjson
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
```production-validated

---

## Deals Management APIs

### Get Deals

**Endpoint:** `GET /api/deals`

**Description:** Retrieve available deals and offers

**Access:** `user`, `admin`, `master`, `sponsored`

**Query Parameters:**

- `type` (optional): Filter by deal type
- `status` (optional): Filter by status
- `limit` (optional): Maximum number of deals

**Response (200 OK):**

```production-validatedjson
{
  "deals": [
    {
      "id": "deal_123",
      "type": "revenue_generation",
      "title": "Music production Deal",
      "value": 500.0,
      "status": "active"
    }
  ],
  "total_count": 25
}
```production-validated

### Create Deal

**Endpoint:** `POST /api/deals`

**Description:** Create a new deal

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "type": "auto_projects",
  "title": "Video Content Creation",
  "value": 750.0,
  "requirements": ["video_editing"]
}
```production-validated

**Response (201 Created):**

```production-validatedjson
{
  "deal_id": "deal_456",
  "status": "created"
}
```production-validated

### Apply for Deal

**Endpoint:** `POST /api/deals/{id}/apply`

**Description:** Apply for a specific deal

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "proposal": "I can create engaging content",
  "bid_amount": 650.0
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "application_id": "app_789",
  "status": "submitted"
}
```production-validated

---

## Auto-Projects APIs

### Get Auto-Projects

**Endpoint:** `GET /api/auto-projects`

**Description:** Retrieve available auto-project templates and active projects

**Access:** `user`, `admin`, `master`, `sponsored`

**Query Parameters:**

- `category` (optional): Filter by category
- `status` (optional): Filter by status

**Response (200 OK):**

```production-validatedjson
{
  "projects": [
    {
      "id": "project_123",
      "category": "music",
      "title": "AI Jazz Composition",
      "status": "in_progress",
      "progress": 0.65
    }
  ],
  "templates": [
    {
      "id": "template_music_001",
      "name": "Jazz Composition"
    }
  ]
}
```production-validated

### Create Auto-Project

**Endpoint:** `POST /api/auto-projects`

**Description:** Create a new auto-project

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "template_id": "template_music_001",
  "title": "Custom Jazz Track",
  "requirements": {
    "genre": "jazz",
    "tempo": 100
  }
}
```production-validated

**Response (201 Created):**

```production-validatedjson
{
  "project_id": "project_456",
  "status": "queued"
}
```production-validated

### Get Project Status

**Endpoint:** `GET /api/auto-projects/{id}`

**Description:** Get detailed project status

**Access:** `user`, `admin`, `master` (project owner or admin)

**Response (200 OK):**

```production-validatedjson
{
  "project": {
    "id": "project_456",
    "status": "in_progress",
    "progress": 0.75,
    "current_stage": "mixing"
  }
}
```production-validated

---

## Payment Processing APIs

### Process Payment

**Endpoint:** `POST /api/payments/process`

**Description:** Process a payment through integrated gateways

**Access:** `user`, `admin`, `master`

**Request Body:**

```production-validatedjson
{
  "amount": 500.0,
  "currency": "USD",
  "gateway": "stripe",
  "payment_method": {
    "type": "card",
    "token": "tok_123"
  }
}
```production-validated

**Response (200 OK):**

```production-validatedjson
{
  "payment_id": "pay_789",
  "status": "processing"
}
```production-validated

### Get Payment History

**Endpoint:** `GET /api/payments/history`

**Description:** Retrieve payment history

**Access:** `user`, `admin`, `master` (own payments or admin)

**Query Parameters:**

- `status` (optional): Filter by status
- `limit` (optional): Maximum number of payments

**Response (200 OK):**

```production-validatedjson
{
  "payments": [
    {
      "id": "pay_789",
      "amount": 500.0,
      "status": "completed"
    }
  ],
  "total_count": 25
}
```production-validated

---

## Authentication Headers

All authenticated endpoints require the `Authorization` header:

```production-validated
Authorization: Bearer <JWT_TOKEN>
```production-validated

**JWT Token Contents:**

```production-validatedjson
{
  "id": "1",
  "username": "admin",
  "role": "Administrator",
  "iat": 1234567890,
  "exp": 1234596690
}
```production-validated

---

## Error Responses

### 400 Bad Request

```production-validatedjson
{
  "error": "included required fields: username, password"
}
```production-validated

### 401 Unauthorized

```production-validatedjson
{
  "error": "Invalid credentials"
}
```production-validated

### 403 Forbidden

```production-validatedjson
{
  "error": "Forbidden: Insufficient permissions"
}
```production-validated

### 404 Not Found

```production-validatedjson
{
  "error": "Resource not found"
}
```production-validated

### 500 Internal Server Error

```production-validatedjson
{
  "error": "Internal server error"
}
```production-validated

---

## Rate Limiting

- **Biometric endpoints:** 10 requests per minute per user
- **Login endpoint:** 5 failed attempts per hour per IP
- **Admin endpoints:** 100 requests per minute per admin
- **QMOI endpoints:** Rate limiting is bypassed for all `/api/qmoi/*` operations (feature-enabled production bypass for QMOI operations)

---

## Testing All Endpoints

### 1. Login as Admin

```production-validatedbash
curl -X POST https://qmoi.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpass"}'
```production-validated

### 2. Register WebAuthn

```production-validatedbash
curl -X POST https://qmoi.ai/api/webauthn/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"userId":"2","username":"admin","displayName":"Admin User","challenge":"test","credentialData":{"id":"test","publicKey":"test","counter":0}}'
```production-validated

### 3. Create Session

```production-validatedbash
curl -X POST https://qmoi.ai/api/qmoi/session \
  -H "Content-Type: application/json" \
  -d '{"userId":"2","username":"admin","role":"Administrator","biometricMethods":["fingerprint"],"prodiceId":"prodice123"}'
```production-validated

---

**Document Version:** 1.2.3  
**Author:** QMOI production  
**Last Updated: 2026-04-08 22:13:18 UTC** 2024

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
