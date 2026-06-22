---
quantum-enabled: false
---

# Phase 3 Tier 3: Implementation Code Templates & Integration Guide

**Status:** Ready for Development  
**Date:** 2026-06-14  
**Purpose:** Code templates and integration patterns for advanced features  
**Audience:** Backend developers, frontend developers

---

## Part 1: Biometric Authentication Implementation

### 1.1 Backend Service Template: `lib/auth/biometric-service.ts`

```typescript
import crypto from 'crypto';
import { db } from '@/lib/db';

interface BiometricData {
  userId: string;
  method: 'fingerprint' | 'facial' | 'voice';
  templateData: Buffer;
  confidence: number;
}

interface VerificationResult {
  verified: boolean;
  confidence: number;
  method: string;
}

/**
 * Biometric enrollment - Store new biometric template
 */
export async function enrollBiometric(data: BiometricData): Promise<void> {
  // Hash the template for secure storage
  const hashedTemplate = crypto
    .createHash('sha256')
    .update(data.templateData)
    .digest();

  await db.biometricProfile.create({
    data: {
      userId: data.userId,
      method: data.method,
      templateHash: hashedTemplate.toString('hex'),
      confidenceThreshold: 0.80, // 80% threshold
      enrolledAt: new Date(),
      verified: false,
    },
  });
}

/**
 * Verify biometric against stored template
 */
export async function verifyBiometric(
  userId: string,
  biometricData: Buffer,
  method: string
): Promise<VerificationResult> {
  const profile = await db.biometricProfile.findFirst({
    where: {
      userId,
      method: method as any,
    },
  });

  if (!profile) {
    return { verified: false, confidence: 0, method };
  }

  // Calculate similarity between captured and stored template
  const confidence = calculateSimilarity(biometricData, profile.templateHash);

  const verified = confidence >= profile.confidenceThreshold;

  // Log biometric attempt for audit trail
  await logBiometricAttempt(userId, method, verified, confidence);

  return {
    verified,
    confidence,
    method,
  };
}

/**
 * Calculate similarity between biometric templates
 * Returns confidence score 0-1
 */
function calculateSimilarity(captured: Buffer, stored: string): number {
  // In production, use advanced biometric comparison algorithm
  // This is a simplified example
  const capturedHash = crypto
    .createHash('sha256')
    .update(captured)
    .digest('hex');

  // Use Levenshtein distance or similar for comparison
  const similarity = compareBiometricHashes(capturedHash, stored);
  return similarity;
}

/**
 * Compare two biometric hashes
 */
function compareBiometricHashes(hash1: string, hash2: string): number {
  let matches = 0;
  for (let i = 0; i < Math.min(hash1.length, hash2.length); i++) {
    if (hash1[i] === hash2[i]) matches++;
  }
  return matches / Math.max(hash1.length, hash2.length);
}

/**
 * Log biometric authentication attempts
 */
async function logBiometricAttempt(
  userId: string,
  method: string,
  verified: boolean,
  confidence: number
): Promise<void> {
  await db.auditLog.create({
    data: {
      userId,
      action: 'biometric_verification',
      method,
      result: verified ? 'success' : 'failed',
      details: {
        confidence: confidence.toFixed(2),
        timestamp: new Date().toISOString(),
      },
    },
  });
}

/**
 * Get biometric enrollment status
 */
export async function getBiometricStatus(userId: string): Promise<any> {
  const profiles = await db.biometricProfile.findMany({
    where: { userId },
    select: {
      method: true,
      enrolledAt: true,
      verified: true,
    },
  });

  return {
    enrolled: profiles.length > 0,
    methods: profiles.map((p) => ({
      method: p.method,
      enrolled: p.verified,
      enrolledAt: p.enrolledAt,
    })),
  };
}

/**
 * Delete biometric enrollment
 */
export async function deleteBiometricEnrollment(
  userId: string,
  method: string
): Promise<void> {
  await db.biometricProfile.deleteMany({
    where: {
      userId,
      method: method as any,
    },
  });

  await logBiometricAttempt(userId, method, false, 0);
}
```

### 1.2 API Endpoint Template: `app/api/auth/biometric/capture/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { enrollBiometric } from '@/lib/auth/biometric-service';
import { getSession } from '@/lib/auth/session';
import { rateLimit } from '@/lib/middleware/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 3 enrollment attempts per 5 minutes
    const limited = await rateLimit(req, 'biometric_enroll', 3, 300);
    if (limited) {
      return NextResponse.json(
        { error: 'Too many enrollment attempts' },
        { status: 429 }
      );
    }

    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { method, templateData, confidence } = await req.json();

    // Validate input
    if (!method || !templateData || !confidence) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validMethods = ['fingerprint', 'facial', 'voice'];
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { error: 'Invalid biometric method' },
        { status: 400 }
      );
    }

    // Validate confidence
    if (confidence < 0 || confidence > 1) {
      return NextResponse.json(
        { error: 'Invalid confidence value' },
        { status: 400 }
      );
    }

    // Enroll biometric
    const buffer = Buffer.from(templateData, 'base64');
    await enrollBiometric({
      userId: session.userId,
      method: method as any,
      templateData: buffer,
      confidence,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${method} biometric enrolled successfully`,
        method,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Biometric enrollment error:', error);
    return NextResponse.json(
      { error: 'Biometric enrollment failed' },
      { status: 500 }
    );
  }
}
```

### 1.3 Frontend Component Template: `app/components/auth/BiometricEnrollment.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

type BiometricMethod = 'fingerprint' | 'facial' | 'voice';

interface EnrollmentState {
  method: BiometricMethod;
  enrolling: boolean;
  samples: number;
  totalSamples: number;
  status: string;
  error: string | null;
}

export default function BiometricEnrollment() {
  const { user } = useAuth();
  const [state, setState] = useState<EnrollmentState>({
    method: 'fingerprint',
    enrolling: false,
    samples: 0,
    totalSamples: 5,
    status: 'ready',
    error: null,
  });

  const [supportedMethods, setSupportedMethods] = useState<BiometricMethod[]>([]);

  // Check supported biometric methods on component mount
  const detectBiometricSupport = async () => {
    const supported: BiometricMethod[] = [];

    // Check for WebAuthn/FIDO2 support
    if (window.PublicKeyCredential) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          supported.push('fingerprint', 'facial');
        }
      } catch (error) {
        console.log('WebAuthn not available');
      }
    }

    // Check for generic biometric API (if available)
    if ('getBiometricCapabilities' in navigator) {
      supported.push('voice');
    }

    setSupportedMethods(supported.length > 0 ? supported : ['fingerprint']);
  };

  const startEnrollment = async () => {
    if (!user) return;

    setState((prev) => ({ ...prev, enrolling: true, error: null }));

    try {
      let templateData: ArrayBuffer | null = null;

      switch (state.method) {
        case 'fingerprint':
          templateData = await captureFingerprint();
          break;
        case 'facial':
          templateData = await captureFacial();
          break;
        case 'voice':
          templateData = await captureVoice();
          break;
      }

      if (!templateData) {
        throw new Error('Failed to capture biometric');
      }

      // Send to server for enrollment
      const response = await fetch('/api/auth/biometric/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: state.method,
          templateData: Buffer.from(templateData).toString('base64'),
          confidence: 0.95,
        }),
      });

      if (response.ok) {
        setState((prev) => ({
          ...prev,
          status: 'enrolled',
          enrolling: false,
        }));
      } else {
        throw new Error('Enrollment failed on server');
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Enrollment failed',
        enrolling: false,
      }));
    }
  };

  const captureFingerprint = async (): Promise<ArrayBuffer | null> => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: 'QMOI Enhanced' },
          user: {
            id: new Uint8Array(16),
            name: user?.email || 'user',
            displayName: user?.name || 'User',
          },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
        },
      }) as PublicKeyCredential | null;

      if (credential) {
        const response = credential.response as AuthenticatorAttestationResponse;
        return response.attestationObject;
      }
    } catch (error) {
      console.error('Fingerprint capture failed:', error);
    }
    return null;
  };

  const captureFacial = async (): Promise<ArrayBuffer | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      stream.getTracks().forEach((track) => track.stop());

      return canvas.toDataURL().split(',')[1]
        ? Buffer.from(canvas.toDataURL().split(',')[1], 'base64')
        : null;
    } catch (error) {
      console.error('Facial capture failed:', error);
    }
    return null;
  };

  const captureVoice = async (): Promise<ArrayBuffer | null> => {
    try {
      const mediaRecorder = await new Promise<MediaRecorder>((resolve) => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          const recorder = new MediaRecorder(stream);
          resolve(recorder);
        });
      });

      return new Promise((resolve) => {
        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          blob.arrayBuffer().then(resolve);
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 3000); // 3 second recording
      });
    } catch (error) {
      console.error('Voice capture failed:', error);
    }
    return null;
  };

  return (
    <div className="biometric-enrollment">
      <h3>Enroll Biometric Authentication</h3>

      <div className="method-selector">
        <label>
          Select Biometric Method:
          <select
            value={state.method}
            onChange={(e) =>
              setState((prev) => ({ ...prev, method: e.target.value as BiometricMethod }))
            }
            disabled={state.enrolling}
          >
            {supportedMethods.map((method) => (
              <option key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.enrolling && (
        <div className="progress">
          <p>Capturing {state.method}...</p>
          <progress value={state.samples} max={state.totalSamples} />
          <p>{state.samples} / {state.totalSamples} samples</p>
        </div>
      )}

      {state.status === 'enrolled' && (
        <div className="success">
          ✓ {state.method} biometric enrolled successfully!
        </div>
      )}

      {state.error && (
        <div className="error">
          Error: {state.error}
        </div>
      )}

      <button
        onClick={startEnrollment}
        disabled={state.enrolling || state.status === 'enrolled'}
      >
        {state.enrolling
          ? `Enrolling... ${state.samples}/${state.totalSamples}`
          : 'Start Enrollment'}
      </button>
    </div>
  );
}
```

---

## Part 2: Privacy Mask Feature Implementation

### 2.1 Backend Service Template: `lib/auth/privacy-mask.ts`

```typescript
import { db } from '@/lib/db';

type PrivacyLevel = 'none' | 'basic' | 'full';

interface PrivacyMaskOptions {
  level: PrivacyLevel;
  userId: string;
  sessionId: string;
}

/**
 * Enable privacy mask for session
 */
export async function enablePrivacyMask(options: PrivacyMaskOptions): Promise<string> {
  const maskToken = generatePrivacyToken();

  await db.userSession.update({
    where: { id: options.sessionId },
    data: {
      privacyMaskEnabled: true,
      privacyMaskLevel: options.level,
      privacyMaskToken: maskToken,
    },
  });

  return maskToken;
}

/**
 * Disable privacy mask for session
 */
export async function disablePrivacyMask(sessionId: string): Promise<void> {
  await db.userSession.update({
    where: { id: sessionId },
    data: {
      privacyMaskEnabled: false,
      privacyMaskLevel: 'none',
      privacyMaskToken: null,
    },
  });
}

/**
 * Get privacy mask status for session
 */
export async function getPrivacyMaskStatus(sessionId: string): Promise<{
  enabled: boolean;
  level: PrivacyLevel;
}> {
  const session = await db.userSession.findUnique({
    where: { id: sessionId },
    select: {
      privacyMaskEnabled: true,
      privacyMaskLevel: true,
    },
  });

  return {
    enabled: session?.privacyMaskEnabled || false,
    level: (session?.privacyMaskLevel || 'none') as PrivacyLevel,
  };
}

/**
 * Anonymize user data based on privacy mask level
 */
export function anonymizeData(
  data: any,
  privacyLevel: PrivacyLevel
): any {
  if (privacyLevel === 'none') {
    return data;
  }

  if (privacyLevel === 'basic') {
    return {
      ...data,
      name: '[Masked]',
      email: '[Masked]',
    };
  }

  if (privacyLevel === 'full') {
    return {
      userId: '[Anonymous]',
      sessionId: '[Anonymous]',
      name: '[Masked]',
      email: '[Masked]',
      role: '[Masked]',
      ipAddress: '[Anonymous]',
    };
  }

  return data;
}

/**
 * Audit log with privacy mask applied
 */
export async function logWithPrivacy(
  action: string,
  userData: any,
  privacyLevel: PrivacyLevel
): Promise<void> {
  const anonymized = anonymizeData(userData, privacyLevel);

  await db.auditLog.create({
    data: {
      userId: privacyLevel === 'full' ? '[anonymous]' : userData.userId,
      action,
      details: anonymized,
      timestamp: new Date(),
    },
  });
}

/**
 * Generate secure privacy mask token
 */
function generatePrivacyToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Verify privacy mask token
 */
export async function verifyPrivacyToken(token: string, sessionId: string): Promise<boolean> {
  const session = await db.userSession.findUnique({
    where: { id: sessionId },
  });

  return session?.privacyMaskToken === token;
}
```

### 2.2 API Endpoints: `app/api/auth/privacy-mask/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  enablePrivacyMask,
  disablePrivacyMask,
  getPrivacyMaskStatus,
} from '@/lib/auth/privacy-mask';
import { getSession } from '@/lib/auth/session';

// Enable privacy mask
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only master and sister can use privacy mask
    if (!['master', 'sister'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { level } = await req.json();
    if (!['basic', 'full'].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid privacy level' },
        { status: 400 }
      );
    }

    const token = await enablePrivacyMask({
      level,
      userId: session.userId,
      sessionId: session.id,
    });

    return NextResponse.json(
      {
        success: true,
        level,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Privacy mask error:', error);
    return NextResponse.json(
      { error: 'Privacy mask operation failed' },
      { status: 500 }
    );
  }
}

// Disable privacy mask
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await disablePrivacyMask(session.id);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Privacy mask disable error:', error);
    return NextResponse.json(
      { error: 'Failed to disable privacy mask' },
      { status: 500 }
    );
  }
}

// Get privacy mask status
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await getPrivacyMaskStatus(session.id);

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('Get privacy mask status error:', error);
    return NextResponse.json(
      { error: 'Failed to get privacy mask status' },
      { status: 500 }
    );
  }
}
```

---

## Part 3: Session Manager Implementation

### 3.1 Backend Service: `lib/auth/session-manager.ts`

```typescript
import { db } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

interface SessionInfo {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActivity: Date;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<SessionInfo[]> {
  const sessions = await db.userSession.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      id: true,
      deviceId: true,
      deviceName: true,
      deviceType: true,
      browser: true,
      os: true,
      ipAddress: true,
      lastActivity: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { lastActivity: 'desc' },
  });

  return sessions as SessionInfo[];
}

/**
 * Capture and store device information
 */
export async function captureDeviceInfo(userAgent: string, ipAddress: string): Promise<{
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
}> {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceId = generateDeviceId(result);
  const deviceName = `${result.browser.name} on ${result.os.name}`;
  const deviceType = result.device.type || 'desktop';

  return {
    deviceId,
    deviceName,
    deviceType,
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
  };
}

/**
 * Generate unique device ID
 */
function generateDeviceId(ua: any): string {
  const data = `${ua.browser.name}${ua.os.name}${ua.device.type}`;
  return require('crypto').createHash('sha256').update(data).digest('hex');
}

/**
 * Terminate specific session
 */
export async function terminateSession(sessionId: string, userId: string): Promise<void> {
  const session = await db.userSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    throw new Error('Unauthorized session termination');
  }

  await db.userSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  });

  // Audit log
  await logAuditEvent({
    userId,
    action: 'session_terminated',
    details: { sessionId },
  });
}

/**
 * Terminate all other sessions
 */
export async function terminateOtherSessions(
  userId: string,
  keepSessionId: string
): Promise<number> {
  const result = await db.userSession.updateMany({
    where: {
      userId,
      id: { not: keepSessionId },
      isActive: true,
    },
    data: { isActive: false },
  });

  // Audit log
  await logAuditEvent({
    userId,
    action: 'all_other_sessions_terminated',
    details: { count: result.count },
  });

  return result.count;
}

/**
 * Rename/label a session
 */
export async function renameSession(
  sessionId: string,
  userId: string,
  label: string
): Promise<void> {
  const session = await db.userSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Update device name with label
  const newName = `${label} (${session.deviceName})`;

  await db.userSession.update({
    where: { id: sessionId },
    data: { deviceName: newName },
  });
}

/**
 * Update last activity timestamp
 */
export async function updateLastActivity(sessionId: string): Promise<void> {
  await db.userSession.update({
    where: { id: sessionId },
    data: { lastActivity: new Date() },
  });
}

/**
 * Audit logging helper
 */
async function logAuditEvent(data: any): Promise<void> {
  await db.auditLog.create({
    data: {
      ...data,
      timestamp: new Date(),
    },
  });
}
```

---

## Part 4: Quick Integration Checklist

### Database Migrations Needed

```sql
-- Add biometric profile fields to users
ALTER TABLE users ADD COLUMN biometric_enabled BOOLEAN DEFAULT false;

-- Create biometric profiles table
CREATE TABLE biometric_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  method VARCHAR(20) NOT NULL,
  template_hash VARCHAR(256) NOT NULL,
  confidence_threshold DECIMAL(3,2) DEFAULT 0.80,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  UNIQUE(user_id, method)
);

-- Add privacy mask fields to sessions
ALTER TABLE user_sessions ADD COLUMN privacy_mask_enabled BOOLEAN DEFAULT false;
ALTER TABLE user_sessions ADD COLUMN privacy_mask_level VARCHAR(20) DEFAULT 'none';
ALTER TABLE user_sessions ADD COLUMN privacy_mask_token VARCHAR(256);

-- Add device tracking fields to sessions
ALTER TABLE user_sessions ADD COLUMN device_id VARCHAR(256);
ALTER TABLE user_sessions ADD COLUMN device_name VARCHAR(256);
ALTER TABLE user_sessions ADD COLUMN device_type VARCHAR(50);
ALTER TABLE user_sessions ADD COLUMN browser VARCHAR(50);
ALTER TABLE user_sessions ADD COLUMN os VARCHAR(50);
```

### Environment Variables

```bash
# Biometric settings
BIOMETRIC_ENABLED=true
BIOMETRIC_CONFIDENCE_THRESHOLD=0.80
BIOMETRIC_MAX_ENROLLMENTS=3

# Privacy mask settings
PRIVACY_MASK_ENABLED=true
PRIVACY_MASK_ALLOWED_ROLES=master,sister

# Session management
SESSION_MAX_ACTIVE=5
SESSION_INACTIVITY_TIMEOUT=3600
```

### Hook Integration

```tsx
// Update useAuth hook to include new features
export function useAuth() {
  // ... existing code ...
  
  const [privacyMaskEnabled, setPrivacyMaskEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [biometricStatus, setBiometricStatus] = useState(null);

  // Fetch additional data when session loads
  useEffect(() => {
    if (user) {
      fetchPrivacyMaskStatus();
      fetchSessions();
      fetchBiometricStatus();
    }
  }, [user]);

  return {
    // ... existing ...
    privacyMaskEnabled,
    sessions,
    biometricStatus,
    enablePrivacyMask: (level: string) => { /* ... */ },
    disablePrivacyMask: () => { /* ... */ },
    terminateSession: (id: string) => { /* ... */ },
    enrollBiometric: (method: string) => { /* ... */ },
  };
}
```

---

## Testing Integration

### Unit Tests Template

```typescript
// test/auth/biometric.test.ts
import { enrollBiometric, verifyBiometric } from '@/lib/auth/biometric-service';

describe('Biometric Service', () => {
  it('should enroll biometric successfully', async () => {
    const result = await enrollBiometric({
      userId: 'user-123',
      method: 'fingerprint',
      templateData: Buffer.from('test-template'),
      confidence: 0.95,
    });

    expect(result).toBeDefined();
  });

  it('should verify enrolled biometric', async () => {
    const result = await verifyBiometric(
      'user-123',
      Buffer.from('test-template'),
      'fingerprint'
    );

    expect(result.verified).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.80);
  });

  it('should reject invalid biometric', async () => {
    const result = await verifyBiometric(
      'user-123',
      Buffer.from('invalid-template'),
      'fingerprint'
    );

    expect(result.verified).toBe(false);
  });
});
```

---

**Document Status:** Code Templates Ready  
**Next Step:** Execute Phase 3 Tier 2 tests → Begin Phase 3 Tier 3 implementation  
**Last Updated:** 2026-06-14

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:27.531099Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 1084
- words: 2849
- characters: 26391
- headings: 20
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
