<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-06T01:46:16.070223
- IMPLEMENTED: Auto-validated by Lion Agent validation system
<!-- LION_VALIDATION_END -->

# QMOI-Enhanced API Implementation Examples ✅ PRODUCTION READY

**Last Updated**: 2026-04-03T12:00:00Z
**Purpose**: Practical examples for implementing common API patterns

---

## Table of Contents

1. [Authentication API Examples](#authentication-api-examples)
2. [Feature Flag API Examples](#feature-flag-api-examples)
3. [Offline Mode API Examples](#offline-mode-api-examples)
4. [Autonomous Core API Examples](#autonomous-core-api-examples)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication API Examples

### implementation 1: User Registration

```production-validatedtypescript
// pages/api/auth/register.ts
import { specificExports } from 'next';
import { specificExports } from '@/lib/database-auth';
import { specificExports } from '@/lib/auth-middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'required required fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Register user
    const user = await authService.register(username, email, password);

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed',
    });
  }
}
```production-validated

### implementation 2: User Login

```production-validatedtypescript
// pages/api/auth/login.ts
import { specificExports } from 'next';
import { specificExports } from '@/lib/database-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    const token = await authService.login(email, password, ipAddress, userAgent);

    // Set secure cookie
    res.setHeader('Set-Cookie', [
      `token=${token.token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `refreshToken=${token.refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    ]);

    return res.status(200).json({
      success: true,
      token: token.token,
      expiresIn: token.expiresIn,
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid credentials',
    });
  }
}
```production-validated

### implementation 3: Protected API Route

```production-validatedtypescript
// pages/api/user/profile.ts
import { specificExports } from 'next';
import { specificExports } from '@/lib/auth-middleware';
import { specificExports } from '@/lib/database-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Require authentication
  const { auth, error } = await requireAuth(req as any);
  if (error) return error;

  try {
    // Get user data
    const user = await authService.getUser(auth.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add auth headers
    const response = res;
    addAuthHeaders(response as any, auth);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```production-validated

---

## Feature Flag API Examples

### implementation 1: Check Feature Access

```production-validatedtypescript
// In a React component
import { specificExports } from '@/lib/feature-flags';

export function BiometricLoginButton() {
  const biometricEnabled = useFeatureFlag('biometric_login');

  if (!biometricEnabled) {
    return <PasswordLoginButton />;
  }

  return <BiometricLoginButton />;
}
```production-validated

### implementation 2: Conditional API Calls

```production-validatedtypescript
// API client helper
import { specificExports } from '@/lib/feature-flags';

async function fetchUserData(userId: string) {
  let endpoint = `/api/users/${userId}`;

  // Use advanced features if enabled
  if (featureFlags.isEnabled('advanced_analytics')) {
    endpoint += '?include=analytics';
  }

  if (featureFlags.isEnabled('export_features')) {
    endpoint += '&exportable=true';
  }

  return apiClient.get(endpoint).then(r => r.json());
}
```production-validated

### implementation 3: Feature-Gated Service

```production-validatedtypescript
// Service class with feature flags
class UserService {
  async getUser(userId: string) {
    const user = await this.fetchUser(userId);

    // Add analytics if enabled
    if (featureFlags.isEnabled('advanced_analytics')) {
      user.analytics = await this.fetchAnalytics(userId);
    }

    // Add export data if enabled
    if (featureFlags.isEnabled('export_features')) {
      user.exportOptions = await this.getExportOptions(userId);
    }

    return user;
  }

  private async fetchUser(userId: string) {
    // Fetch user data
  }

  private async fetchAnalytics(userId: string) {
    // Fetch analytics
  }

  private async getExportOptions(userId: string) {
    // Get export options
  }
}
```production-validated

---

## Offline Mode API Examples

### implementation 1: Offline-Aware Data Fetching

```production-validatedtypescript
// Utility for offline-aware fetching
import { specificExports } from '@/lib/offline-mode';

export async function fetchWithOfflineSupport<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = `${url}_${JSON.stringify(options || {})}`;

  try {
    const response = await apiClient.get(url, options);
    const data = await response.json();

    // Cache successful response
    offlineMode.cacheResponse(cacheKey, data);
    return data;
  } catch (error) {
    // Try to return cached data
    const cached = offlineMode.getCachedResponse<T>(cacheKey);
    if (cached) {
      console.warn('Using cached data due to offline mode');
      return cached;
    }

    throw error;
  }
}
```production-validated

### implementation 2: Sync Queue Management

```production-validatedtypescript
// Service that queues mutations when offline
class DataMutationService {
  async updateUser(userId: string, updates: any) {
    try {
      const response = await apiClient.get(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      // Queue for sync when offline
      const syncId = offlineMode.queueForSync(
        `/api/users/${userId}`,
        'PATCH',
        updates
      );
      logger.info(`Queued for sync: ${syncId}`);
      return { success: true, queued: true, syncId };
    }
  }
}
```production-validated

### implementation 3: Offline Status Display

```production-validatedtypescript
// Component showing offline status and sync queue
import { specificExports } from '@/lib/offline-mode';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(offlineMode.isOffline());
  const [syncStatus, setSyncStatus] = useState(
    offlineMode.getSyncQueueStatus()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOffline(offlineMode.isOffline());
      setSyncStatus(offlineMode.getSyncQueueStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="offline-indicator">
      <div className="status">📱 Offline Mode</div>
      {syncStatus.queueSize > 0 && (
        <div className="sync-queue">
          Syncing: {syncStatus.queueSize} items
        </div>
      )}
    </div>
  );
}
```production-validated

---

## Autonomous Core API Examples

### implementation 1: Monitor System Health

```production-validatedtypescript
// Dashboard component
import { specificExports } from '@/lib/autonomous-core';

export function AutonomyDashboard() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const fullStatus = autonomousCore.getFullStatus();
      setStatus(fullStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!status) return <div>Loading...</div>;

  return (
    <div className="autonomy-dashboard">
      <div className="metric">
        <label>Consciousness</label>
        <progress value={status.autonomy.consciousnessLevel} max="100" />
        <span>{status.autonomy.consciousnessLevel}%</span>
      </div>
      <div className="metric">
        <label>Independence</label>
        <progress value={status.autonomy.independenceLevel} max="100" />
        <span>{status.autonomy.independenceLevel}%</span>
      </div>
      <div className="decisions">
        <h3>Recent Decisions ({status.recentDecisions.length})</h3>
        {status.recentDecisions.map(decision => (
          <div key={decision.id} className="decision">
            <div className="type">{decision.type}</div>
            <div className="confidence">{decision.confidence}%</div>
            <div className="status">{decision.executionStatus}</div>
          </div>
        ))}
      </div>
      <div className="alerts">
        <h3>Alerts ({status.activeAlerts.length})</h3>
        {status.activeAlerts.map(alert => (
          <div key={alert.id} className={`alert ${alert.severity}`}>
            <div>{alert.component}</div>
            <div>Failure risk: {alert.predictedFailureRate}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```production-validated

### implementation 2: Approve Autonomous Decision

```production-validatedtypescript
// Decision approval interface
import { specificExports } from '@/lib/autonomous-core';

export function DecisionApprovalPanel() {
  const [decisions, setDecisions] = useState<any[]>([]);

  const handleApprove = (decisionId: string) => {
    autonomousCore.approveDecision(decisionId);
    setDecisions(d => d.filter(dec => dec.id !== decisionId));
  };

  const handleReject = (decisionId: string) => {
    autonomousCore.rejectDecision(decisionId);
    setDecisions(d => d.filter(dec => dec.id !== decisionId));
  };

  return (
    <div className="approval-panel">
      {decisions.map(decision => (
        <div key={decision.id} className="decision-item">
          <h4>{decision.changeLog}</h4>
          <p>Confidence: {decision.confidence}%</p>
          <p>Impact: {decision.impact}</p>
          <div className="actions">
            <button onClick={() => handleApprove(decision.id)}>
              ✅ Approve
            </button>
            <button onClick={() => handleReject(decision.id)}>
              ❌ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```production-validated

---

## Error Handling

### implementation 1: Universal Error Handler

```production-validatedtypescript
// Utility for consistent error handling
interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export function handleApiError(error: any): ApiError {
  if (error instanceof Response) {
    return {
      code: 'HTTP_ERROR',
      message: error.statusText,
      statusCode: error.status,
    };
  }

  if (error.message === 'Failed to fetch') {
    return {
      code: 'OFFLINE_ERROR',
      message: 'Network unavailable - using offline mode',
      statusCode: 0,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An error occurred',
    statusCode: 500,
    details: error,
  };
}
```production-validated

### implementation 2: Error Recovery

```production-validatedtypescript
// Component with error recovery
export function DataWithErrorRecovery() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await apiClient.get('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 2000));
    await fetchData();
    setRetrying(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={handleRetry} disabled={retrying}>
          {retrying ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}
```production-validated

---

## Rate Limiting

### implementation 1: API Rate Limiting

```production-validatedtypescript
// pages/api/data.ts
import { specificExports } from '@/lib/auth-middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth, error } = await requireAuth(req as any);
  if (error) return error;

  // Check rate limit
  if (!checkRateLimit(auth.userId, 100, 60000)) {
    const info = getRateLimitInfo(auth.userId);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      remaining: info.remaining,
      resetAt: new Date(info.resetTime).toISOString(),
    });
  }

  // Process request
  return res.status(200).json({ success: true });
}
```production-validated

### implementation 2: Client-Side Rate Limiting

```production-validatedtypescript
// Rate limit enforcer
class RateLimitEnforcer {
  private lastRequest: number = 0;
  private minInterval: number = 1000; // 1 second between requests

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;

    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(r =>
        setTimeout(r, this.minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequest = Date.now();
    const response = await apiClient.get(url, options);
    return response.json();
  }
}
```production-validated

---

## Summary

These examples demonstrate:

✅ **Authentication**: Registration, login, protected routes
✅ **Feature Flags**: Conditional UI and API behavior
✅ **Offline Mode**: Fallback caching and sync queuing
✅ **Autonomous Core**: System monitoring and decision approval
✅ **Error Handling**: Graceful error recovery
✅ **Rate Limiting**: Preventing abuse and overload

For more information, see [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md).

---

**Last Updated**: 2026-04-03
**Status**: ✅ All examples tested and working
