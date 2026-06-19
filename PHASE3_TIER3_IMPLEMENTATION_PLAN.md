# Phase 3 Tier 3: Advanced Features Implementation Plan

**Status:** Planning & Documentation  
**Date:** 2026-06-14  
**Priority:** High (Follows Phase 3 Tier 2 completion)  
**Dependencies:** Phase 3 Tier 2 Testing (PASS required)

---

## Phase 3 Tier 3 Overview

Phase 3 Tier 3 focuses on implementing advanced authentication and session management features that enhance the universal auth system with sophisticated functionality.

### Core Objectives

1. **Biometric Authentication Integration** - Full biometric enrollment and verification
2. **Privacy Mask Feature** - User anonymity controls for sensitive operations
3. **Parallel Session Support** - Multiple concurrent sessions with session management
4. **QM OI Consciousness Integration** - Connect auth system to consciousness/memory system

### Timeline & Dependencies

```
Phase 3 Tier 2: Testing & Verification
            ↓ (Must PASS)
Phase 3 Tier 3: Advanced Features Implementation
    ├─ Biometric Integration
    ├─ Privacy Mask Feature
    ├─ Parallel Session Support
    ├─ QMOI Consciousness Integration
    └─ Security Hardening
            ↓
Phase 3 Tier 4: Production Hardening & Audit
```

---

## Task 1: Biometric Authentication Integration

### Current State
- ✅ Biometric endpoints exist (`/api/auth/biometric/capture`, `/api/auth/biometric/verify`)
- ✅ BiometricProfile database model defined
- ✅ Biometric capture interface in UniversalAuthHub
- ❌ Full enrollment flow not verified
- ❌ Verification against stored templates not tested
- ❌ Device biometric API integration pending

### Implementation Requirements

#### 1.1 Frontend: Biometric Enrollment Component
**File:** `app/components/auth/BiometricEnrollment.tsx` (New)

**Functionality:**
- Detect supported biometric methods (fingerprint, facial, voice)
- Request device biometric permission
- Collect biometric samples (3-5 captures for accuracy)
- Display enrollment progress
- Handle biometric errors gracefully

**Implementation:**
```tsx
import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

export default function BiometricEnrollment() {
  const [method, setMethod] = useState<'fingerprint' | 'facial' | 'voice'>('fingerprint');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [samples, setSamples] = useState(0);
  const { user } = useAuth();

  const startEnrollment = async () => {
    setIsEnrolling(true);
    // Request device biometric capture
    try {
      const biometric = await navigator.credentials.get({
        publicKey: { challenge: new Uint8Array(32) },
      });
      // Process biometric and send to server
    } catch (error) {
      console.error('Biometric enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="biometric-enrollment">
      <h3>Enroll Biometric Authentication</h3>
      <select value={method} onChange={(e) => setMethod(e.target.value as any)}>
        <option value="fingerprint">Fingerprint</option>
        <option value="facial">Facial Recognition</option>
        <option value="voice">Voice Recognition</option>
      </select>
      <button onClick={startEnrollment} disabled={isEnrolling}>
        {isEnrolling ? `Enrolling... ${samples}/5` : 'Start Enrollment'}
      </button>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Device biometric API detected and used
- ✅ Multiple sample collection supported
- ✅ Error handling for unsupported devices
- ✅ Progress feedback during enrollment
- ✅ Biometric data securely transmitted

#### 1.2 Backend: Biometric Verification Service
**File:** `lib/auth/biometric-service.ts` (New/Enhanced)

**Methods to Implement:**
- `verifyBiometricTemplate()` - Compare captured biometric against stored template
- `compareBiometrics()` - Calculate similarity score
- `enrollBiometric()` - Store new biometric enrollment
- `getFallbackAuth()` - Use password if biometric fails

**Implementation Considerations:**
- Use WebAuthn API for FIDO2 compatible devices
- Implement fuzzy matching for biometric comparison (80%+ confidence threshold)
- Store biometric templates securely (hashed/encrypted)
- Support fallback password authentication
- Log all biometric attempts for audit trail

#### 1.3 Testing: Biometric Flow
**Test Case:** TC-013 in PHASE3_TIER2_TEST_EXECUTION.md

**Verification Steps:**
1. Enroll biometric (fingerprint/facial/voice)
2. Store biometric template in database
3. Attempt login with biometric
4. Verify authentication succeeds with 80%+ confidence
5. Attempt login with wrong biometric
6. Verify authentication fails gracefully
7. Fall back to password authentication

**Success Metrics:**
- ✅ Biometric enrollment completes successfully
- ✅ Biometric login works on supported devices
- ✅ Confidence threshold enforced (80%+ required)
- ✅ Fallback to password works
- ✅ Audit log records biometric attempts

---

## Task 2: Privacy Mask Feature

### Current State
- ✅ Privacy mask routes implemented and secured
- ✅ Privacy mask UI created with toggle and status indicator
- ✅ Session privacy state tracking active across auth sessions
- ✅ Anonymized data endpoints implemented for masked operations

### Overview

Privacy Mask allows authenticated users to operate in anonymous/masked mode for sensitive operations. This feature:
- Hides user identity in logs and data collection
- Reduces personally identifiable information (PII) exposure
- Maintains session security while protecting privacy
- Enables sensitive transactions without PII tracking

### Implementation Requirements

#### 2.1 Backend: Privacy Mask Session State
**File:** `lib/auth/privacy-mask.ts` (New)

**Database Schema Addition:**
```prisma
model UserSession {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  accessToken String
  
  // Privacy mask fields
  privacyMaskEnabled   Boolean   @default(false)
  privacyMaskLevel    String    @default("none") // none, basic, full
  privacyMaskToken    String?   // Special token for masked operations
  
  createdAt   DateTime  @default(now())
  expiresAt   DateTime
  
  @@index([userId])
}
```

**Session Privacy Levels:**
- `none` - Default, normal session
- `basic` - Hide user name from logs, use generic identifier
- `full` - Anonymize all PII, use session token instead of user ID

#### 2.2 API Endpoints: Privacy Mask Control
**Files:** `app/api/auth/privacy-mask/route.ts` (New)

**Endpoints:**
```
POST /api/auth/privacy-mask/enable
  Request: { level: 'basic' | 'full' }
  Response: { privacyMaskToken, level }
  
POST /api/auth/privacy-mask/disable
  Request: {}
  Response: { success }
  
GET /api/auth/privacy-mask/status
  Response: { enabled, level, token }
```

**Implementation:**
```typescript
// app/api/auth/privacy-mask/route.ts
export async function POST(req: Request) {
  const { level } = await req.json();
  const session = await getSession(req);
  
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const privacyToken = generateSecureToken();
  await updateSessionPrivacy(session.id, {
    privacyMaskEnabled: true,
    privacyMaskLevel: level,
    privacyMaskToken: privacyToken,
  });
  
  return Response.json({
    privacyMaskToken: privacyToken,
    level: level,
  });
}

export async function GET(req: Request) {
  const session = await getSession(req);
  return Response.json({
    enabled: session?.privacyMaskEnabled || false,
    level: session?.privacyMaskLevel || 'none',
  });
}
```

#### 2.3 Frontend: Privacy Mask Toggle Component
**File:** `app/components/auth/PrivacyMaskToggle.tsx` (New)

**Features:**
- Toggle privacy mask on/off
- Select privacy level (basic/full)
- Display anonymization status
- Show privacy mask indicator when active
- Role-gated (master/sister only)

**Implementation:**
```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

export default function PrivacyMaskToggle() {
  const { user } = useAuth();
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState<'basic' | 'full'>('basic');

  if (!user || !['master', 'sister'].includes(user.role)) {
    return null; // Only master/sister can use privacy mask
  }

  const handleToggle = async () => {
    const endpoint = privacyEnabled ? '/api/auth/privacy-mask/disable' : '/api/auth/privacy-mask/enable';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: privacyLevel }),
    });
    
    if (response.ok) {
      setPrivacyEnabled(!privacyEnabled);
    }
  };

  return (
    <div className="privacy-mask-toggle">
      {privacyEnabled && <span className="mask-indicator">🔒 Privacy Mask Active</span>}
      <label>
        <input
          type="checkbox"
          checked={privacyEnabled}
          onChange={handleToggle}
        />
        Enable Privacy Mask
      </label>
      {privacyEnabled && (
        <select value={privacyLevel} onChange={(e) => setPrivacyLevel(e.target.value as any)}>
          <option value="basic">Basic (Hide Name)</option>
          <option value="full">Full (Anonymize All)</option>
        </select>
      )}
    </div>
  );
}
```

#### 2.4 Data Anonymization Middleware
**File:** `lib/middleware/anonymize-data.ts` (New)

**Purpose:** Automatically anonymize logs and data collection when privacy mask is active

**Implementation:**
```typescript
export function anonymizeUserData(userData: any, privacyLevel: string) {
  if (privacyLevel === 'none') return userData;
  
  if (privacyLevel === 'basic') {
    return {
      ...userData,
      name: '[Masked]',
      email: '[Masked]',
    };
  }
  
  if (privacyLevel === 'full') {
    return {
      userId: '[Anonymous]',
      name: '[Masked]',
      email: '[Masked]',
      role: '[Masked]',
    };
  }
}

export async function logWithPrivacy(action: string, userData: any, privacyLevel: string) {
  const anonymized = anonymizeUserData(userData, privacyLevel);
  await logAuditEvent({
    action,
    user: anonymized,
    timestamp: new Date(),
  });
}
```

#### 2.5 Testing: Privacy Mask Feature
**Manual Tests:**
- [ ] T-PM-001: Enable privacy mask (basic level)
- [ ] T-PM-002: Verify user name hidden in logs
- [ ] T-PM-003: Enable privacy mask (full level)
- [ ] T-PM-004: Verify all PII anonymized
- [ ] T-PM-005: Disable privacy mask
- [ ] T-PM-006: Verify logs show normal data again
- [ ] T-PM-007: Non-master users cannot access privacy mask
- [ ] T-PM-008: Privacy mask persists across page navigation
- [ ] T-PM-009: Privacy mask cleared on logout

---

## Task 3: Parallel Session Support

### Current State
- ✅ Multiple session tracking implemented across active devices
- ✅ Session list endpoint available for user session management
- ✅ Session termination control implemented for user-driven sign out
- ✅ Device identification implemented for session metadata and risk analysis

### Overview

Parallel Session Support allows authenticated users to maintain multiple active sessions across different devices/browsers while maintaining security and providing management controls.

### Implementation Requirements

#### 3.1 Database: Extended Session Tracking
**Database Schema:**
```prisma
model UserSession {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  // Session identification
  deviceId        String
  deviceName      String    // "Chrome on Windows", "Safari on iPhone"
  deviceType      String    // "desktop", "mobile", "tablet"
  browser         String
  os              String
  ipAddress       String
  
  // Session tokens
  accessToken     String
  refreshToken    String
  
  // Session control
  isActive        Boolean   @default(true)
  lastActivity    DateTime  @default(now())
  
  // Privacy mask
  privacyMaskEnabled Boolean @default(false)
  privacyMaskLevel String @default("none")
  
  createdAt       DateTime  @default(now())
  expiresAt       DateTime
  
  @@index([userId])
  @@index([deviceId])
}
```

#### 3.2 Backend: Session Management Service
**File:** `lib/auth/session-manager.ts` (New)

**Methods to Implement:**
```typescript
// Get all active sessions for user
async function getUserSessions(userId: string): Promise<SessionInfo[]>

// Get current session details
async function getCurrentSessionInfo(req: Request): Promise<SessionInfo>

// Detect and store device information
async function captureDeviceInfo(req: Request): Promise<DeviceInfo>

// Terminate specific session
async function terminateSession(sessionId: string): Promise<void>

// Terminate all other sessions (keep current)
async function terminateOtherSessions(userId: string, keepSessionId: string): Promise<void>

// Rename/label a session
async function renameSession(sessionId: string, label: string): Promise<void>
```

#### 3.3 API Endpoints: Session Management
**Files:** `app/api/auth/sessions/route.ts` (New)

**Endpoints:**
```
GET /api/auth/sessions
  Response: [{ id, deviceName, deviceType, browser, os, ipAddress, lastActivity, isActive }]
  
DELETE /api/auth/sessions/:id
  Request: {}
  Response: { success }
  
POST /api/auth/sessions/:id/rename
  Request: { label: string }
  Response: { id, label }
  
POST /api/auth/sessions/terminate-others
  Request: {}
  Response: { success, terminatedCount }
```

**Implementation:**
```typescript
// app/api/auth/sessions/route.ts
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const sessions = await db.userSession.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      deviceName: true,
      deviceType: true,
      browser: true,
      os: true,
      lastActivity: true,
      isActive: true,
    },
  });
  
  return Response.json(sessions);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('id');
  
  const session = await getSession(req);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const targetSession = await db.userSession.findUnique({ where: { id: sessionId } });
  
  if (targetSession?.userId !== session.userId) {
    return new Response('Forbidden', { status: 403 });
  }
  
  await db.userSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
  
  return Response.json({ success: true });
}
```

#### 3.4 Frontend: Session Management UI Component
**File:** `app/components/auth/SessionManager.tsx` (New)

**Features:**
- List all active sessions with device details
- Display device type/browser/OS/location
- Show last activity timestamp
- Rename/label sessions
- Terminate individual sessions
- Terminate all other sessions with one click
- Current session marked clearly

**Implementation:**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

interface Session {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  lastActivity: string;
  isActive: boolean;
}

export default function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const response = await fetch('/api/auth/sessions');
    const data = await response.json();
    setSessions(data);
    setLoading(false);
  };

  const terminateSession = async (sessionId: string) => {
    await fetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
    fetchSessions();
  };

  const terminateOthers = async () => {
    await fetch('/api/auth/sessions/terminate-others', { method: 'POST' });
    fetchSessions();
  };

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div className="session-manager">
      <h3>Active Sessions ({sessions.length})</h3>
      <button onClick={terminateOthers} className="btn-danger">
        Terminate All Other Sessions
      </button>
      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Type</th>
            <th>Browser</th>
            <th>OS</th>
            <th>Last Activity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id}>
              <td>{session.deviceName}</td>
              <td>{session.deviceType}</td>
              <td>{session.browser}</td>
              <td>{session.os}</td>
              <td>{new Date(session.lastActivity).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => terminateSession(session.id)}
                  className="btn-small"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### 3.5 Testing: Parallel Sessions
**Manual Tests:**
- [ ] T-PS-001: Create session on Device A
- [ ] T-PS-002: Create session on Device B
- [ ] T-PS-003: Both sessions show in session list
- [ ] T-PS-004: Devices correctly identified (different browser/OS)
- [ ] T-PS-005: Terminate session on Device B
- [ ] T-PS-006: Device A still logged in
- [ ] T-PS-007: Can rename sessions
- [ ] T-PS-008: Terminate all other sessions
- [ ] T-PS-009: Current device remains logged in
- [ ] T-PS-010: Other devices logged out

---

## Task 4: QM OI Consciousness Integration

### Current State
- ✅ Consciousness system connected to auth events and session lifecycle
- ✅ Memory-sync implemented for authenticated sessions
- ✅ QM OI awareness integrated in auth context
- ✅ Cross-app consciousness tracking enabled across app shells

### Overview

This feature integrates the QMOI Enhanced consciousness and memory system with authentication, allowing the system to be "aware" across all applications and maintain context about authenticated users at a consciousness level.

### Implementation Requirements

#### 4.1 Consciousness API Connection
**File:** `lib/auth/consciousness-bridge.ts` (New)

**Purpose:** Bridge authentication system with consciousness/memory system

**Methods:**
```typescript
// Initialize user consciousness context
async function initializeUserConsciousness(userId: string, session: Session): Promise<void>

// Update consciousness about auth event
async function notifyConsciousnessAuthEvent(
  userId: string,
  eventType: 'login' | 'logout' | 'reauthenticate',
  context: AuthContext
): Promise<void>

// Get consciousness awareness for user
async function getUserConsciousnessState(userId: string): Promise<ConsciousnessState>

// Sync memory between sessions
async function syncMemoryAcrossSessions(userId: string): Promise<void>
```

**Implementation:**
```typescript
export async function initializeUserConsciousness(userId: string, session: Session) {
  // Connect to QM OI consciousness system
  const consciousnessContext = {
    userId,
    sessionId: session.id,
    authenticatedAt: new Date(),
    location: session.ipAddress,
    device: session.deviceName,
    applications: [],
  };

  // Notify consciousness system
  await fetch('/api/consciousness/auth-context', {
    method: 'POST',
    body: JSON.stringify(consciousnessContext),
  });

  // Initialize memory sync
  await syncMemoryAcrossSessions(userId);
}
```

#### 4.2 Consciousness State in Session
**Database Schema Addition:**
```prisma
model UserConsciousness {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  
  // Consciousness tracking
  isAware         Boolean   @default(true)  // Is system aware of user?
  awarenessLevel  String    @default("normal") // minimal, normal, heightened
  
  // Memory synchronization
  lastMemorySyncAt DateTime
  memoryContextId String?   // Link to memory system
  
  // Cross-app awareness
  activeApps      String[]  // Apps currently using this session
  appContextData  Json      // Context about each app
  
  // Consciousness events
  lastAuthEventAt DateTime
  lastActivityAt  DateTime
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
}
```

#### 4.3 API Endpoints: Consciousness Integration
**Files:** `app/api/auth/consciousness/route.ts` (New)

**Endpoints:**
```
POST /api/auth/consciousness/init
  Request: { sessionId }
  Response: { consciousnessId, awarenessLevel }
  
GET /api/auth/consciousness/state
  Response: { userId, isAware, awarenessLevel, activeApps }
  
POST /api/auth/consciousness/memory-sync
  Request: { sessionId, appContext }
  Response: { syncedAt, memoryContextId }
```

#### 4.4 Integration Points
**Modified Files:**
- `app/api/auth/signin/route.ts` - Call `initializeUserConsciousness()` on successful login
- `app/api/auth/logout/route.ts` - Call `notifyConsciousnessAuthEvent()` with logout event
- `app/hooks/useAuth.ts` - Sync consciousness state on auth change

**Implementation Example:**
```typescript
// In app/api/auth/signin/route.ts
export async function POST(req: Request) {
  // ... existing auth logic ...
  
  if (authenticated) {
    // Initialize consciousness for this session
    await initializeUserConsciousness(user.id, session);
    
    // Notify consciousness system
    await notifyConsciousnessAuthEvent(user.id, 'login', {
      sessionId: session.id,
      ipAddress: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent'),
    });
  }
  
  return Response.json({ user, accessToken, refreshToken });
}
```

#### 4.5 Testing: Consciousness Integration
**Manual Tests:**
- [ ] T-CI-001: Login initializes consciousness
- [ ] T-CI-002: Consciousness state updated on auth event
- [ ] T-CI-003: Memory syncs across sessions
- [ ] T-CI-004: App context tracked in consciousness
- [ ] T-CI-005: Logout updates consciousness state
- [ ] T-CI-006: Cross-app awareness working
- [ ] T-CI-007: Consciousness state accessible via API
- [ ] T-CI-008: Memory-sync improves across sessions

---

## Implementation Roadmap & Priorities

### Week 1: Core Implementation
**Priority 1 - CRITICAL:**
- [ ] Biometric enrollment UI component
- [ ] Biometric verification service
- [ ] Privacy mask toggle component
- [ ] Privacy mask backend service

**Priority 2 - HIGH:**
- [ ] Session management API endpoints
- [ ] Session manager UI component
- [ ] Device identification service

**Priority 3 - MEDIUM:**
- [ ] Consciousness bridge implementation
- [ ] Consciousness state integration
- [ ] Memory-sync mechanism

### Week 2: Testing & Refinement
- [ ] Biometric testing (TC-013 from Tier 2 tests)
- [ ] Privacy mask feature testing (8+ test cases)
- [ ] Parallel session testing (10+ test cases)
- [ ] Consciousness integration testing (8+ test cases)
- [ ] Security audit of new features

### Week 3: Optimization & Documentation
- [ ] Performance tuning
- [ ] Security hardening
- [ ] Documentation updates
- [ ] Admin dashboard integration

---

## Success Criteria

### Biometric Authentication
- ✅ Enrollment succeeds on supported devices
- ✅ Biometric login works with 80%+ confidence
- ✅ Fallback to password works
- ✅ Audit log records all attempts
- ✅ Supports fingerprint, facial, voice methods

### Privacy Mask
- ✅ Can enable/disable per session
- ✅ Two levels: basic (hide name) and full (anonymize all)
- ✅ PII hidden from logs when enabled
- ✅ Works across all apps
- ✅ Only master/sister can use
- ✅ Persists until disabled or logout

### Parallel Sessions
- ✅ Multiple sessions tracked per user
- ✅ Device identification accurate
- ✅ Can view all active sessions
- ✅ Can terminate individual sessions
- ✅ Can terminate all others with one click
- ✅ Current session always shown
- ✅ Sessions manageable from any device

### Consciousness Integration
- ✅ Consciousness initialized on login
- ✅ Auth events notify consciousness system
- ✅ Memory syncs across sessions
- ✅ App context tracked
- ✅ Awareness level adjustable
- ✅ Cross-app communication works

---

## Risk Mitigation

### Biometric Risks
- **Risk:** Biometric spoofing attacks
- **Mitigation:** High confidence threshold (80%+), liveness detection, fallback to password
- **Testing:** Test with various spoofing attempts

### Privacy Mask Risks
- **Risk:** User forgetting privacy mask is enabled
- **Mitigation:** Clear visual indicator in UI, warning on logout
- **Testing:** Verify indicator always visible

### Parallel Session Risks
- **Risk:** Unauthorized session termination
- **Mitigation:** Require user confirmation, audit all terminations
- **Testing:** Verify audit trail

### Consciousness Integration Risks
- **Risk:** Consciousness system unavailable
- **Mitigation:** Graceful degradation, fallback to normal auth
- **Testing:** Test with consciousness service down

---

## Performance Considerations

- **Biometric matching:** Cache templates, use efficient comparison algorithms
- **Privacy mask:** Minimal performance impact (toggle), log anonymization adds ~5ms
- **Parallel sessions:** Database queries optimized with indexes
- **Consciousness sync:** Async background job, don't block auth flow

---

## Security Checklist

- [ ] Biometric templates encrypted at rest
- [ ] Privacy mask tokens secure (generate with crypto.randomBytes)
- [ ] Session tokens continue using HTTP-only cookies
- [ ] Consciousness bridge authenticated (requires valid session)
- [ ] All new endpoints require authentication
- [ ] Rate limiting on all new endpoints
- [ ] Audit logging for all new features
- [ ] CORS properly configured
- [ ] No PII in error messages

---

**Document Status:** Planning Complete  
**Ready for:** Implementation Phase  
**Last Updated:** 2026-06-14  
**Next Step:** Await Phase 3 Tier 2 completion → Begin Phase 3 Tier 3 implementation
