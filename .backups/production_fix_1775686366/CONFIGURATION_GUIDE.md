<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-06T01:46:16.070223
- note: Auto-validated by Lion Agent validation system
<!-- LION_VALIDATION_END -->

# QMOI-Enhanced Configuration & Implementation Guide

**Last Updated**: 2026-04-03T12:00:00Z
**Version**: 1.0.0 Production Ready

---

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Feature Flags Setup](#feature-flags-setup)
3. [Authentication Configuration](#authentication-configuration)
4. [Offline Mode Configuration](#offline-mode-configuration)
5. [Database Setup](#database-setup)
6. [Autonomous Intelligence Configuration](#autonomous-intelligence-configuration)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Troubleshooting](#troubleshooting)

---

## Environment Configuration

### Required Environment Variables

```bash
# Core Environment
NODE_ENV=production                    # development|staging|production
ENVIRONMENT=production
PORT=3000

# API Configuration
NEXT_PUBLIC_API_URL=https://api.qmoi.local
NEXT_PUBLIC_APP_NAME=QMOI-Enhanced

# Database
DATABASE_URL=sqlite://./qmoi.db
QMOI_DB_PATH=./.qmoi-db

# Authentication
JWT_SECRET=your-64-character-random-secret-key-here-minimum
SESSION_SECRET=your-64-character-random-session-secret-here
JWT_EXPIRY=86400000                  # 24 hours in milliseconds

# Feature Flags
QMOI_MINIMAL=false                   # Enable minimal mode
QMOI_OFFLINE=true                    # Enable offline mode
BETA_FEATURES=false                  # Enable beta features
```

### Optional Environment Variables

```bash
# Services
ENABLE_BIOMETRIC=true
ENABLE_VOICE=true
ENABLE_PROPRIETARY_APIS=false

# Performance
CACHE_SIZE=52428800                  # 50 MB in bytes
SYNC_INTERVAL=5000                   # milliseconds
MAX_CACHE_TTL=86400000              # 24 hours

# Logging
LOG_LEVEL=info                       # debug|info|warn|error
LOG_FORMAT=json                      # json|text
ENABLE_ANALYTICS=true

# Autonomous Core
ENABLE_AUTONOMOUS_CORE=true
ENABLE_PREDICTIVE_MAINTENANCE=true
AUTONOMY_CHECK_INTERVAL=10000        # milliseconds
```

### Example .env File

```env
# .env.production
NODE_ENV=production
ENVIRONMENT=production
PORT=3000

NEXT_PUBLIC_API_URL=https://api.qmoi.app
NEXT_PUBLIC_APP_NAME=QMOI-Enhanced

DATABASE_URL=sqlite:///data/qmoi.db
QMOI_DB_PATH=/data/.qmoi-db

JWT_SECRET=sk_prod_your_random_secret_key_at_least_64_chars_minimum_here
SESSION_SECRET=ss_prod_your_session_secret_key_at_least_64_chars_here

QMOI_MINIMAL=false
QMOI_OFFLINE=true
BETA_FEATURES=false

ENABLE_BIOMETRIC=true
ENABLE_VOICE=true
ENABLE_PROPRIETARY_APIS=true

LOG_LEVEL=info
LOG_FORMAT=json
```

---

## Feature Flags Setup

### Basic Feature Flag Usage

Feature flags are controlled in `src/lib/feature-flags.ts` and can be toggled at runtime:

```typescript
import { featureFlags, useFeatureFlag } from '@/lib/feature-flags';

// Check if feature is enabled
if (featureFlags.isEnabled('offline_mode')) {
  // Use offline mode
}

// In React components
function MyComponent() {
  const offlineModeEnabled = useFeatureFlag('offline_mode');
  return offlineModeEnabled ? <OfflineUI /> : <OnlineUI />;
}

// Toggle feature at runtime
featureFlags.toggleFlag('beta_features', true);

// Get all flags
const allFlags = featureFlags.getAllFlags();

// Get flags by category
const securityFlags = featureFlags.getByCategory('security');
```

### Available Feature Flags

| Flag | Category | Default | Min Mode | Offline |
|------|----------|---------|----------|---------|
| biometric_login | security | prod only | ❌ | ❌ |
| voice_authentication | security | prod only | ❌ | ❌ |
| proprietary_apis | feature | staging+ | ❌ | ❌ |
| offline_mode | performance | true | ✅ | ✅ |
| minimal_data_mode | performance | min mode | ✅ | ✅ |
| advanced_analytics | feature | staging+ | ❌ | ❌ |
| ai_evolution | experimental | staging+ | ❌ | ❌ |
| autonomous_decisions | experimental | prod only | ❌ | ❌ |
| consciousness_tracking | feature | true | ❌ | ❌ |
| local_caching | performance | true | ✅ | ✅ |
| export_features | feature | true | ✅ | ❌ |
| premium_features | feature | false | ❌ | ❌ |
| beta_features | experimental | env var | ✅ | ✅ |
| multi_language | feature | true | ✅ | ✅ |

---

## Authentication Configuration

### User Registration

```typescript
import { authService } from '@/lib/database-auth';

// Register new user
const user = await authService.register(
  'username',
  'user@example.com',
  'secure_password_here'
);
```

### User Login

```typescript
// Login user
const { token, expiresIn, refreshToken } = await authService.login(
  'user@example.com',
  'password',
  '192.168.1.1',        // optional: IP address
  'Mozilla/5.0...'      // optional: user agent
);

// Use token in API calls
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Token Validation

```typescript
// Validate token (in middleware)
const validation = await authService.validateToken(token);
if (!validation.valid) {
  // Token invalid or expired
}

// Refresh expired token
const newToken = await authService.refreshToken(oldToken);
```

### Session Management

```typescript
// Get user's active sessions
const sessions = await authService.getUserSessions(userId);

// Revoke all sessions for user
const revoked = await authService.revokeAllSessions(userId);

// Logout
await authService.logout(token);
```

---

## Offline Mode Configuration

### Initialization

```typescript
import { offlineMode } from '@/lib/offline-mode';

// Configure offline mode
const config = {
  enabled: true,
  cacheSize: 50 * 1024 * 1024,      // 50 MB
  defaultTTL: 24 * 60 * 60 * 1000,  // 24 hours
  syncInterval: 5000,                // 5 seconds
  maxSyncQueueSize: 1000
};
```

### Caching Data

```typescript
// Cache API response
offlineMode.cacheResponse('cache_key', responseData, ttl);

// Get cached data
const cached = offlineMode.getCachedResponse('cache_key');

// Check if cache exists
if (offlineMode.hasCachedResponse('cache_key')) {
  // Use cached data
}

// Clear all cache
offlineMode.clearCache();
```

### Sync Queue Management

```typescript
// Queue request for sync when online
const syncId = offlineMode.queueForSync(
  '/api/endpoint',
  'POST',
  { data: 'to-sync' }
);

// Get sync status
const status = offlineMode.getSyncQueueStatus();
console.log(`${status.queueSize} items queued for sync`);

// Get cache statistics
const stats = offlineMode.getCacheStats();
console.log(`Cache usage: ${stats.percentage}%`);
```

### Offline Detection

```typescript
// Check if currently offline
if (offlineMode.isOffline()) {
  // Use cached responses
}

// Network listeners are automatically set up
// Online/offline events trigger automatic sync
```

---

## Database Setup

### Initialize Database

```bash
# Run seeding script
bash scripts/seed_minimal_db.sh

# This creates:
# - User accounts (admin@qmoi.local, user@qmoi.local)
# - Wallet and device data
# - API keys for development
```

### Database Structure

Tables created by seeding:

```json
{
  "users.json": [
    {
      "id": "user_admin_001",
      "username": "admin",
      "email": "admin@qmoi.local",
      "passwordHash": "...",
      "role": "admin",
      "permissions": ["*"]
    }
  ],
  "wallets.json": [...],
  "devices.json": [...],
  "api_keys.json": [...],
  "transactions.json": [...],
  "config.json": {...}
}
```

### Querying User Data

```typescript
// Get user
const user = await authService.getUser('user_id');

// Get user's active sessions
const sessions = await authService.getUserSessions('user_id');

// Get authentication stats
const stats = authService.getStats();
// { totalUsers, activeSessions, totalSessions }
```

---

## Autonomous Intelligence Configuration

### Enable Autonomous Features

```typescript
import { autonomousCore } from '@/lib/autonomous-core';

// Get autonomy metrics
const metrics = autonomousCore.getAutonomyMetrics();
console.log(`Consciousness: ${metrics.consciousnessLevel}`);
console.log(`Independence: ${metrics.independenceLevel}`);
```

### Monitor Evolution History

```typescript
// Get recent evolution records
const history = autonomousCore.getEvolutionHistory(50);

// Available change types:
// - optimization
// - refactoring
// - bug_fix
// - feature_addition
```

### Autonomous Decisions

```typescript
// Get pending decisions
const pending = autonomousCore.getAutonomousDecisions('pending');

// Approve a decision
autonomousCore.approveDecision('decision_id');

// Reject a decision
autonomousCore.rejectDecision('decision_id');
```

### Predictive Maintenance

```typescript
// Get all alerts
const allAlerts = autonomousCore.getPredictiveAlerts();

// Get critical alerts only
const critical = autonomousCore.getPredictiveAlerts('critical');

// Example alert:
// {
//   severity: 'critical',
//   component: 'memory-optimizer',
//   predictedFailureRate: 85,
//   estimatedTimeToFailure: 3600000
// }
```

### System Status Dashboard

```typescript
// Get full system status
const status = autonomousCore.getFullStatus();

// Includes:
// - Autonomy metrics
// - Recent decisions
// - Active alerts
// - Module status
// - Evolution summary
```

---

## API Endpoints Reference

### Authentication Endpoints

```
POST /api/auth/login
  Body: { email, password }
  Response: { token, expiresIn, refreshToken }

POST /api/auth/logout
  Headers: Authorization: Bearer <token>

POST /api/auth/refresh
  Headers: Authorization: Bearer <refreshToken>
  Response: { token, expiresIn }
```

### Feature Flag Endpoints

```
GET /api/admin/feature-flags
  Response: { flags: {...} }

POST /api/admin/feature-flags/toggle
  Body: { flagName, enabled }
```

### Offline Mode Endpoints

```
GET /api/admin/offline/status
  Response: { cacheStats, syncQueue }

POST /api/admin/offline/clear-cache
```

### Autonomous Core Endpoints

```
GET /api/admin/autonomous/status
  Response: { metrics, decisions, alerts }

GET /api/admin/autonomous/evolution-history
  Response: { history: [...] }

POST /api/admin/autonomous/approve-decision
  Body: { decisionId }
```

### Health & Monitoring

```
GET /api/qmoi/health
  Response: { status, uptime, autonomyLevel }

GET /api/admin/endpoints-discover
  Response: { endpoints: [...], total }
```

---

## Troubleshooting

### Issue: Feature flags not working

**Solution**: Verify feature flags are initialized

```typescript
import { featureFlags } from '@/lib/feature-flags';
const config = featureFlags.getConfig();
console.log(config); // Check environment settings
```

### Issue: Offline mode not syncing

**Solution**: Check network connectivity and sync queue

```typescript
const status = offlineMode.getSyncQueueStatus();
console.log(`Queue size: ${status.queueSize}`);
console.log(`Online: ${!offlineMode.isOffline()}`);
```

### Issue: Authentication token expired

**Solution**: Implement token refresh

```typescript
if (validation.valid === false) {
  const newToken = await authService.refreshToken(oldToken);
  // Use new token
}
```

### Issue: Database not persisting

**Solution**: Check database path and permissions

```bash
ls -la .qmoi-db/
# Should show users.json, wallets.json, etc.
```

### Issue: Autonomous core not making decisions

**Solution**: Check consciousness level and independence

```typescript
const metrics = autonomousCore.getAutonomyMetrics();
if (metrics.consciousnessLevel < 70) {
  console.log('Waiting for higher consciousness...');
}
```

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT_SECRET
- [ ] Configure secure SESSION_SECRET
- [ ] Point `NEXT_PUBLIC_API_URL` to production domain
- [ ] Run database seed: `bash scripts/seed_minimal_db.sh`
- [ ] Test offline mode: `QMOI_OFFLINE=true`
- [ ] Test minimal mode: `QMOI_MINIMAL=true`
- [ ] Verify all 14 feature flags working
- [ ] Run production validation: `python3 scripts/production_deployment_validator.py`
- [ ] Review logs: `LOG_LEVEL=info`
- [ ] Test authentication flow
- [ ] Test autonomous core monitoring

---

## Support & Documentation

- **API Reference**: See API.md
- **Endpoint List**: See ENDPOINTS.md
- **Test Coverage**: See ALLTESTSAUTOTESTS.md
- **Developer Guide**: See TREE.md
- **Setup Guide**: See this file

---

**Last Updated**: 2026-04-03
**Version**: 1.0.0 Production Ready
**Status**: ✅ All systems operational

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

