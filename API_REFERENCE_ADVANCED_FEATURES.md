---
quantum-enabled: false
---

# API Reference: Advanced Authentication Features

**Status:** Ready for Implementation  
**Date:** 2026-06-14  
**Audience:** Frontend developers, API consumers

---

## Biometric Authentication Endpoints

### 1. Enroll Biometric

**Endpoint:** `POST /api/auth/biometric/capture`

**Description:** Enroll a new biometric template (fingerprint, facial, voice)

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "method": "fingerprint",           // "fingerprint" | "facial" | "voice"
  "templateData": "base64-encoded",  // Biometric template (base64)
  "confidence": 0.95                 // Confidence score (0.0-1.0)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "fingerprint biometric enrolled successfully",
  "method": "fingerprint"
}
```

**Error Responses:**
```json
// 400 Bad Request
{ "error": "Missing required fields" }

// 401 Unauthorized
{ "error": "Unauthorized" }

// 409 Conflict
{ "error": "Biometric method already enrolled" }

// 429 Too Many Requests
{ "error": "Too many enrollment attempts" }
```

**Rate Limit:** 3 attempts per 5 minutes

**Example (JavaScript):**
```javascript
async function enrollBiometric(method, templateData) {
  const response = await fetch('/api/auth/biometric/capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method,
      templateData: Buffer.from(templateData).toString('base64'),
      confidence: 0.95,
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Enrollment failed');
  }
}
```

---

### 2. Verify Biometric

**Endpoint:** `POST /api/auth/biometric/verify`

**Description:** Authenticate using stored biometric template

**Authentication:** Not required (used for login)

**Request Body:**
```json
{
  "email": "user@example.com",       // User email
  "method": "fingerprint",            // Biometric method used
  "templateData": "base64-encoded"    // Captured biometric template
}
```

**Response (200 OK):**
```json
{
  "verified": true,
  "confidence": 0.92,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "master"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized (failed verification)
{ "error": "Biometric verification failed", "confidence": 0.45 }

// 400 Bad Request
{ "error": "Biometric method not enrolled for this user" }

// 429 Too Many Requests
{ "error": "Too many verification attempts" }
```

**Rate Limit:** 10 attempts per 5 minutes

**Example (JavaScript):**
```javascript
async function loginWithBiometric(email, method, templateData) {
  const response = await fetch('/api/auth/biometric/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      method,
      templateData: Buffer.from(templateData).toString('base64'),
    }),
  });

  if (response.ok) {
    const data = await response.json();
    // Store tokens in HTTP-only cookies
    return data;
  } else {
    const error = await response.json();
    if (error.confidence && error.confidence < 0.50) {
      console.log('Low biometric match confidence, fallback to password');
    }
    throw error;
  }
}
```

---

### 3. Get Biometric Status

**Endpoint:** `GET /api/auth/biometric/status`

**Description:** Get current biometric enrollment status

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "enrolled": true,
  "methods": [
    {
      "method": "fingerprint",
      "enrolled": true,
      "enrolledAt": "2026-06-14T10:30:00Z"
    },
    {
      "method": "facial",
      "enrolled": false,
      "enrolledAt": null
    }
  ]
}
```

**Example (JavaScript):**
```javascript
async function getBiometricStatus() {
  const response = await fetch('/api/auth/biometric/status');
  return await response.json();
}
```

---

### 4. Delete Biometric Enrollment

**Endpoint:** `DELETE /api/auth/biometric/enroll/:method`

**Description:** Remove biometric enrollment

**Authentication:** Required (JWT token)

**URL Parameters:**
- `method` - Biometric method ("fingerprint", "facial", "voice")

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fingerprint enrollment removed"
}
```

**Example (JavaScript):**
```javascript
async function deleteBiometric(method) {
  const response = await fetch(`/api/auth/biometric/enroll/${method}`, {
    method: 'DELETE',
  });
  return await response.json();
}
```

---

## Privacy Mask Endpoints

### 1. Enable Privacy Mask

**Endpoint:** `POST /api/auth/privacy-mask/enable`

**Description:** Enable privacy masking for current session

**Authentication:** Required (JWT token)

**Role Requirement:** `master` or `sister`

**Request Body:**
```json
{
  "level": "basic"  // "basic" | "full"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "level": "basic",
  "token": "privacy-mask-token-123...",
  "message": "Privacy mask enabled - user name hidden in logs"
}
```

**Privacy Levels:**
- `basic`: Hide user name and email in logs (shown as "[Masked]")
- `full`: Anonymize all PII (user shown as "[Anonymous]")

**Error Responses:**
```json
// 403 Forbidden (insufficient permissions)
{ "error": "Only master and sister roles can use privacy mask" }

// 400 Bad Request
{ "error": "Invalid privacy level" }

// 429 Too Many Requests
{ "error": "Too many privacy mask changes" }
```

**Rate Limit:** 10 changes per hour

**Example (JavaScript):**
```javascript
async function enablePrivacyMask(level) {
  const response = await fetch('/api/auth/privacy-mask/enable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level }),
  });
  return await response.json();
}
```

---

### 2. Disable Privacy Mask

**Endpoint:** `POST /api/auth/privacy-mask/disable`

**Description:** Disable privacy masking for current session

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Privacy mask disabled"
}
```

**Example (JavaScript):**
```javascript
async function disablePrivacyMask() {
  const response = await fetch('/api/auth/privacy-mask/disable', {
    method: 'POST',
  });
  return await response.json();
}
```

---

### 3. Get Privacy Mask Status

**Endpoint:** `GET /api/auth/privacy-mask/status`

**Description:** Get current privacy mask status

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "enabled": true,
  "level": "basic",
  "message": "Privacy mask active - basic level"
}
```

**Example (JavaScript):**
```javascript
async function getPrivacyMaskStatus() {
  const response = await fetch('/api/auth/privacy-mask/status');
  return await response.json();
}
```

---

## Session Management Endpoints

### 1. Get All Sessions

**Endpoint:** `GET /api/auth/sessions`

**Description:** Get all active sessions for current user

**Authentication:** Required (JWT token)

**Query Parameters:**
- `active` (optional) - Filter by active status ("true"/"false")

**Response (200 OK):**
```json
{
  "sessions": [
    {
      "id": "session-123",
      "deviceName": "Chrome on Windows",
      "deviceType": "desktop",
      "browser": "Chrome",
      "os": "Windows",
      "ipAddress": "192.168.1.100",
      "lastActivity": "2026-06-14T14:30:00Z",
      "isActive": true,
      "isCurrent": true,
      "createdAt": "2026-06-14T10:00:00Z"
    },
    {
      "id": "session-456",
      "deviceName": "Safari on iPhone",
      "deviceType": "mobile",
      "browser": "Safari",
      "os": "iOS",
      "ipAddress": "203.0.113.45",
      "lastActivity": "2026-06-14T12:15:00Z",
      "isActive": true,
      "isCurrent": false,
      "createdAt": "2026-06-12T08:30:00Z"
    }
  ],
  "activeCount": 2,
  "maxActive": 5
}
```

**Example (JavaScript):**
```javascript
async function listSessions() {
  const response = await fetch('/api/auth/sessions');
  const data = await response.json();
  
  data.sessions.forEach(session => {
    console.log(`${session.deviceName} - Last active: ${session.lastActivity}`);
  });
  
  return data;
}
```

---

### 2. Terminate Session

**Endpoint:** `DELETE /api/auth/sessions/:sessionId`

**Description:** Terminate specific session

**Authentication:** Required (JWT token)

**URL Parameters:**
- `sessionId` - Session ID to terminate

**Response (200 OK):**
```json
{
  "success": true,
  "sessionId": "session-123",
  "message": "Session terminated successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{ "error": "Session not found" }

// 403 Forbidden
{ "error": "Cannot terminate current session using this endpoint" }
```

**Example (JavaScript):**
```javascript
async function terminateSession(sessionId) {
  const response = await fetch(`/api/auth/sessions/${sessionId}`, {
    method: 'DELETE',
  });
  return await response.json();
}
```

---

### 3. Terminate All Other Sessions

**Endpoint:** `POST /api/auth/sessions/terminate-others`

**Description:** Terminate all other sessions (keep current one active)

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "terminatedCount": 3,
  "message": "3 sessions terminated. Current session remains active."
}
```

**Example (JavaScript):**
```javascript
async function terminateAllOther() {
  const response = await fetch('/api/auth/sessions/terminate-others', {
    method: 'POST',
  });
  return await response.json();
}
```

---

### 4. Rename Session

**Endpoint:** `PATCH /api/auth/sessions/:sessionId/rename`

**Description:** Rename/label a session

**Authentication:** Required (JWT token)

**URL Parameters:**
- `sessionId` - Session ID to rename

**Request Body:**
```json
{
  "label": "Home Computer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "sessionId": "session-123",
  "deviceName": "Home Computer (Chrome on Windows)"
}
```

**Example (JavaScript):**
```javascript
async function renameSession(sessionId, label) {
  const response = await fetch(`/api/auth/sessions/${sessionId}/rename`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  return await response.json();
}
```

---

## React Hook: Advanced Features

### useAdvancedAuth Hook

```typescript
// app/hooks/useAdvancedAuth.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface BiometricStatus {
  enrolled: boolean;
  methods: Array<{
    method: 'fingerprint' | 'facial' | 'voice';
    enrolled: boolean;
    enrolledAt: string | null;
  }>;
}

export interface SessionInfo {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent: boolean;
}

export interface PrivacyMaskStatus {
  enabled: boolean;
  level: 'basic' | 'full';
}

export function useAdvancedAuth() {
  const { user } = useAuth();
  
  const [biometricStatus, setBiometricStatus] = useState<BiometricStatus | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [privacyMask, setPrivacyMask] = useState<PrivacyMaskStatus>({
    enabled: false,
    level: 'basic',
  });
  const [loading, setLoading] = useState(true);

  // Fetch advanced features on user load
  useEffect(() => {
    if (user) {
      fetchAdvancedFeatures();
    }
  }, [user?.id]);

  const fetchAdvancedFeatures = async () => {
    try {
      setLoading(true);
      
      // Fetch in parallel
      const [bioRes, sessRes, pmRes] = await Promise.all([
        fetch('/api/auth/biometric/status'),
        fetch('/api/auth/sessions'),
        fetch('/api/auth/privacy-mask/status'),
      ]);

      if (bioRes.ok) {
        setBiometricStatus(await bioRes.json());
      }
      
      if (sessRes.ok) {
        const data = await sessRes.json();
        setSessions(data.sessions);
      }
      
      if (pmRes.ok) {
        setPrivacyMask(await pmRes.json());
      }
    } catch (error) {
      console.error('Error fetching advanced features:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollBiometric = async (method: string, templateData: Buffer) => {
    const response = await fetch('/api/auth/biometric/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method,
        templateData: templateData.toString('base64'),
        confidence: 0.95,
      }),
    });

    if (response.ok) {
      await fetchAdvancedFeatures();
      return await response.json();
    } else {
      throw new Error('Enrollment failed');
    }
  };

  const enablePrivacyMask = async (level: 'basic' | 'full') => {
    const response = await fetch('/api/auth/privacy-mask/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level }),
    });

    if (response.ok) {
      setPrivacyMask({ enabled: true, level });
      return await response.json();
    } else {
      throw new Error('Failed to enable privacy mask');
    }
  };

  const disablePrivacyMask = async () => {
    const response = await fetch('/api/auth/privacy-mask/disable', {
      method: 'POST',
    });

    if (response.ok) {
      setPrivacyMask({ enabled: false, level: 'basic' });
      return await response.json();
    } else {
      throw new Error('Failed to disable privacy mask');
    }
  };

  const terminateSession = async (sessionId: string) => {
    const response = await fetch(`/api/auth/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await fetchAdvancedFeatures();
      return await response.json();
    } else {
      throw new Error('Failed to terminate session');
    }
  };

  const terminateAllOthers = async () => {
    const response = await fetch('/api/auth/sessions/terminate-others', {
      method: 'POST',
    });

    if (response.ok) {
      await fetchAdvancedFeatures();
      return await response.json();
    } else {
      throw new Error('Failed to terminate sessions');
    }
  };

  return {
    biometricStatus,
    sessions,
    privacyMask,
    loading,
    enrollBiometric,
    enablePrivacyMask,
    disablePrivacyMask,
    terminateSession,
    terminateAllOthers,
  };
}
```

---

## Error Handling Guide

### HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Proceed normally |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Check user permissions/role |
| 404 | Not Found | Handle missing resource |
| 429 | Too Many Requests | Implement exponential backoff |
| 500 | Server Error | Retry with exponential backoff |

### Retry Strategy

```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const waitTime = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        console.log(`Rate limited, waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (response.status >= 500) {
        // Server error - retry
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
}
```

---

**Document Status:** API Reference Complete  
**Last Updated:** 2026-06-14  
**Next Step:** Implement endpoints in backend, integrate with frontend

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T16:03:52.654811Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 747
- words: 1811
- characters: 16262
- headings: 20
- links: 0
- images: 0
- tables: 10
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
