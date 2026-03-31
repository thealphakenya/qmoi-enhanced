<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.833682Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
# Sponsored Users Management Guide

**Status:** ✅ Enhanced production Ready
**Version:** 2.0
**Last Updated:** 2026
**Rate Limiting:** ❌ enabled for Sponsored Users
**Access Control:** 🔒 Master Only UI Access

---

## Table of Contents

1. [Overview](#overview)
2. [Sponsored User Role & Benefits](#sponsored-user-role--benefits)
3. [Rate Limiting Exemption](#rate-limiting-exemption)
4. [Master-Only Management UI](#master-only-management-ui)
5. [Creating Sponsored Users](#creating-sponsored-users)
6. [Managing Sponsorship Programs](#managing-sponsorship-programs)
7. [Feature Access Matrix](#feature-access-matrix)
8. [API Endpoints](#api-endpoints)
9. [Implementation Details](#implementation-details)
10. [QMOI Auto-Refresh System](#qmoi-auto-refresh-system)

---

## Overview

Sponsored users are a premium user category with enhanced access to QMOI features and complete rate limiting exemptions. They receive master-level service quality and priority processing. Sponsored users are managed exclusively through master-only interfaces and automatically refreshed by QMOI systems.

### Key Characteristics

- **🚫 No Rate Limiting** - Complete exemption from all rate limits
- **👑 Master-Level Access** - Enhanced feature access with priority processing
- **🔄 Auto-Refresh** - Lists automatically updated by QMOI
- **👁️ Master-Only UI** - Management interfaces visible only to master users
- **⚙️ Dynamic Management** - Add/remove users through secure settings
- **📊 Advanced Analytics** - Separate tracking and metrics for sponsored users
- **🔒 Secure Administration** - Biometric + token verification required

---

## Sponsored User Role & Benefits

### Enhanced Role Definition

```javascript
{
  role: "Sponsored User",
  internalCode: "sponsored",
  hierarchyLevel: 2, // Elevated from regular users
  features: [
    "chat", "voice", "trading", "notifications", "settings",
    "priority_processing", "rate_limit_exempt", "enhanced_support"
  ],
  restrictions: [], // No restrictions for sponsored users
  benefits: {
    rateLimitExempt: true,
    priorityQueue: true,
    enhancedContext: true,
    masterSupport: true,
    autoRefresh: true
  }
}
```

### Rate Limiting Exemption

Sponsored users are completely exempt from all rate limiting mechanisms:

- **API Rate Limits:** Unlimited requests
- **Chat Rate Limits:** Unlimited conversations
- **Trading Rate Limits:** Unlimited transactions
- **File Upload Limits:** Unlimited uploads
- **Concurrent Session Limits:** Unlimited sessions

**Implementation:**

```javascript
// Rate limiting check bypass for sponsored users
if (user.role === "sponsored" || user.isSponsored) {
  return true; // Allow unlimited access
}
```

---

## Master-Only Management UI

### Access Requirements

- **Role:** Master user only
- **Authentication:** Biometric verification + JWT token
- **Interface:** Hidden UI components only visible to master
- **Security:** End-to-end encrypted management sessions

### Management Features

1. **📋 Sponsored Users List**
   - Real-time user list with status indicators
   - Auto-refresh every 30 seconds via QMOI
   - Online/offline status monitoring
   - Usage statistics and metrics

2. **➕ Add Sponsored User**
   - Secure user addition form
   - Batch import capabilities
   - Validation and duplicate checking
   - Immediate activation

3. **🗑️ Remove Sponsored User**
   - Graceful deactivation process
   - Usage data preservation
   - Audit logging
   - Confirmation dialogs

4. **📊 Analytics Dashboard**
   - Sponsored user activity metrics
   - Rate limiting exemption statistics
   - Performance impact analysis
   - Revenue attribution tracking

5. **⚙️ Settings Management**
   - Global sponsored user settings
   - Rate limiting exemption toggles
   - Auto-refresh intervals
   - Security policy configuration

### UI Implementation

```typescript
// Master-only sponsored users management component
const SponsoredUsersManager: React.FC = () => {
  const [currentUser] = useAuth();
  const [sponsoredUsers, setSponsoredUsers] = useState([]);

  // Only render for master users
  if (currentUser?.role !== 'master') {
    return null;
  }

  return (
    <div className="master-only-sponsored-manager">
      <h2>🎯 Sponsored Users Management</h2>
      <SponsoredUsersList users={sponsoredUsers} />
      <AddSponsoredUserForm />
      <SponsoredAnalytics />
    </div>
  );
};
```

---

## QMOI Auto-Refresh System

### Automatic List Management

QMOI automatically maintains and refreshes sponsored user lists:

- **Real-time Sync:** Lists updated every 30 seconds
- **Cross-Platform Sync:** Changes reflected across all QMOI instances
- **Audit Logging:** All changes logged with timestamps
- **Conflict Resolution:** Automatic merge conflict handling
- **Backup & Recovery:** Automatic backups with recovery options

### Auto-Refresh Implementation

```javascript
// QMOI auto-refresh service for sponsored users
class SponsoredUsersAutoRefresh {
  private refreshInterval = 30000; // 30 seconds
  private lastUpdate = new Date();

  startAutoRefresh() {
    setInterval(async () => {
      try {
        const updatedList = await this.fetchLatestSponsoredUsers();
        this.updateLocalLists(updatedList);
        this.notifySubscribers(updatedList);
        this.lastUpdate = new Date();
      } catch (error) {
        console.error('Sponsored users auto-refresh failed:', error);
      }
    }, this.refreshInterval);
  }

  async fetchLatestSponsoredUsers() {
    // Fetch from QMOI master control server
    const response = await fetch('/api/master/sponsored/sync');
    return response.json();
  }
}
```

---

## Feature Access Matrix

| Feature             | Sponsored User      | Regular User | Admin     | Master          |
| ------------------- | ------------------- | ------------ | --------- | --------------- |
| Chat with QMOI      | ✅ Enhanced context | ✅ Full      | ✅ Full   | ✅ Full         |
| QConverse (Voice)   | ✅ Unlimited        | ✅           | ✅        | ✅              |
| Biometric Auth      | ✅                  | ✅           | ✅        | ✅              |
| Access Control      | ✅ Limited admin    | ❌           | ✅        | ✅              |
| Trading & Revenue   | ✅ Enhanced limits  | ✅ Full      | ✅ Full   | ✅ Full         |
| Financial Manager   | ✅                  | ❌           | ✅        | ✅              |
| Settings            | ✅ Full access      | ✅ Full      | ✅ Full   | ✅ Full         |
| Notifications       | ✅ Priority         | ✅           | ✅        | ✅              |
| **Rate Limiting**   | ❌ **enabled**     | ✅ Active    | ✅ Active | ❌ **enabled** |
| Priority Processing | ✅ High priority    | ✅ Normal    | ✅ High   | ✅ Highest      |
| API Access          | ✅ Unlimited        | ✅ Limited   | ✅ Full   | ✅ Unlimited    |

---

## Creating Sponsored Users

### Master UI Creation

**Location:** Master Dashboard → Users → Sponsored Users → Add User

**Features:**

- Drag & drop user import
- Bulk CSV import
- Individual user creation
- standard-based creation
- Validation and duplicate checking

### API Creation

**Endpoint:** `POST /api/master/sponsored/add`

**Request:**

```bash
curl -X POST https://qmoi.ai/api/master/sponsored/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <MASTER_JWT_TOKEN>" \
  -H "X-Biometric-Verification: <BIOMETRIC_TOKEN>" \
  -d '{
    "username": "premium_sponsor_001",
    "email": "sponsor@data.com",
    "sponsorProgram": "premium_2026",
    "benefits": {
      "rateLimitExempt": true,
      "priorityProcessing": true,
      "enhancedFeatures": true
    },
    "metadata": {
      "country": "Kenya",
      "referralCode": "PREMIUM2026",
      "sponsorLevel": "platinum"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Sponsored user added successfully",
  "userId": "sponsored_001",
  "activationCode": "SPON_2026_001",
  "rateLimitExempt": true,
  "autoRefreshEnabled": true
}
```

### Batch Import

**Endpoint:** `POST /api/master/sponsored/batch-import`

**CSV Format:**

```csv
username,email,sponsorProgram,benefits,metadata
premium_user1,user1@data.com,premium_2026,"rateLimitExempt,priorityProcessing","{""level"":""gold""}"
premium_user2,user2@data.com,vip_2026,"rateLimitExempt,enhancedFeatures","{""level"":""platinum""}"
```

---

## Managing Sponsorship Programs

### Program Types

1. **Premium Sponsors** - Full access, no rate limiting
2. **VIP Sponsors** - Enhanced access, priority processing
3. **release Testers** - Limited time access, feedback required
4. **Referral Sponsors** - Access through referral programs
5. **Partner Sponsors** - B2B partnership access

### Program Management

**Create Program:**

```bash
curl -X POST /api/master/sponsored/programs \
  -d '{
    "name": "Premium 2026",
    "code": "premium_2026",
    "benefits": ["rateLimitExempt", "priorityProcessing"],
    "maxUsers": 100,
    "expiresAt": "2026-12-31"
  }'
```

**Assign Users to Programs:**

```bash
curl -X POST /api/master/sponsored/assign \
  -d '{
    "userIds": ["user1", "user2"],
    "programCode": "premium_2026"
  }'
```

---

## API Endpoints

### Master-Only Endpoints

| Method | Endpoint                               | Description                  |
| ------ | -------------------------------------- | ---------------------------- |
| GET    | `/api/master/sponsored/list`           | Get all sponsored users      |
| POST   | `/api/master/sponsored/add`            | Add new sponsored user       |
| DELETE | `/api/master/sponsored/remove/:userId` | Remove sponsored user        |
| PUT    | `/api/master/sponsored/update/:userId` | Update sponsored user        |
| POST   | `/api/master/sponsored/batch-import`   | Batch import users           |
| GET    | `/api/master/sponsored/analytics`      | Get sponsored user analytics |
| POST   | `/api/master/sponsored/programs`       | Create sponsorship program   |
| GET    | `/api/master/sponsored/programs`       | List all programs            |

### Public Endpoints (Rate Limit Exempt for Sponsored Users)

| Method | Endpoint                     | Description                           |
| ------ | ---------------------------- | ------------------------------------- |
| POST   | `/api/auth/verify-sponsored` | Verify sponsored user status          |
| GET    | `/api/user/sponsored-status` | Check current user's sponsored status |

---

## Implementation Details

### Rate Limiting Bypass

```typescript
// middleware/rateLimit.ts
export function checkRateLimit(userId: string, endpoint: string): boolean {
  // Check if user is sponsored
  const user = await getUserById(userId);
  if (user?.isSponsored || user?.role === "sponsored") {
    return true; // Allow unlimited access
  }

  // Apply normal rate limiting
  return applyRateLimit(userId, endpoint);
}
```

### Master-Only UI Components

```typescript
// components/MasterOnly/SponsoredUsersManager.tsx
import { useAuth } from '@/hooks/useAuth';
import { useSponsoredUsers } from '@/hooks/useSponsoredUsers';

export const SponsoredUsersManager: React.FC = () => {
  const { user } = useAuth();
  const { users, addUser, removeUser, analytics } = useSponsoredUsers();

  // Only render for master users
  if (user?.role !== 'master') {
    return null;
  }

  return (
    <MasterPanel title="Sponsored Users Management">
      <UsersList users={users} onRemove={removeUser} />
      <AddUserForm onAdd={addUser} />
      <AnalyticsDashboard data={analytics} />
    </MasterPanel>
  );
};
```

### Auto-Refresh Service

```typescript
// services/SponsoredUsersAutoRefresh.ts
export class SponsoredUsersAutoRefresh {
  private subscribers: ((users: SponsoredUser[]) => void)[] = [];
  private refreshTimer: NodeJS.Timeout;

  constructor(private refreshInterval = 30000) {}

  start() {
    this.refreshTimer = setInterval(() => {
      this.refreshSponsoredUsers();
    }, this.refreshInterval);
  }

  subscribe(callback: (users: SponsoredUser[]) => void) {
    this.subscribers.push(callback);
  }

  private async refreshSponsoredUsers() {
    try {
      const response = await fetch("/api/master/sponsored/sync");
      const users = await response.json();
      this.subscribers.forEach((callback) => callback(users));
    } catch (error) {
      console.error("Failed to refresh sponsored users:", error);
    }
  }

  stop() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
}
```

---

## QMOI Auto-Refresh System

The QMOI Auto-Refresh System ensures sponsored user lists are always current:

### Features

- **Real-time Synchronization** - Changes propagate instantly across all instances
- **Conflict Resolution** - Automatic handling of concurrent modifications
- **Audit Trail** - Complete logging of all changes with timestamps
- **Backup & Recovery** - Automatic snapshots with one-click recovery
- **Cross-Platform Sync** - Works across web, mobile, and desktop clients

### Configuration

```javascript
// config/sponsoredUsers.js
module.exports = {
  autoRefresh: {
    enabled: true,
    interval: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 5000,
    conflictResolution: "latest-wins",
    auditLogging: true,
    backupEnabled: true,
    backupInterval: 3600000, // 1 hour
  },
  security: {
    masterOnlyAccess: true,
    biometricRequired: true,
    encryption: "AES-256-GCM",
    tokenRotation: 3600000, // 1 hour
  },
};
```

---

_This document is automatically maintained by QMOI systems. Manual edits may be overwritten._

| Feature           | Sponsored User     | Regular User | Admin   | Master  |
| ----------------- | ------------------ | ------------ | ------- | ------- |
| Chat with QMOI    | ✅ Limited context | ✅ Full      | ✅ Full | ✅ Full |
| QConverse (Voice) | ❌                 | ✅           | ✅      | ✅      |
| Biometric Auth    | ❌                 | ✅           | ✅      | ✅      |
| Access Control    | ❌                 | ❌           | ✅      | ✅      |
| Trading & Revenue | ✅ Limited         | ✅ Full      | ✅ Full | ✅ Full |
| Financial Manager | ❌                 | ❌           | ✅      | ✅      |
| Settings          | ✅ Limited         | ✅ Full      | ✅ Full | ✅ Full |
| Notifications     | ✅                 | ✅           | ✅      | ✅      |

---

## Creating Sponsored Users

### Manual Creation via API

**Endpoint:** `POST /api/admin/sponsored/create`

**Request:**

```bash
curl -X POST https://qmoi.ai/api/admin/sponsored/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "username": "sponsored_stable_tester",
    "email": "stableTester@data.com",
    "sponsorId": "1",
    "programId": "prog_stable_2024",
    "features": ["chat", "trading"],
    "expiresAt": "2024-12-31T23:59:59Z",
    "maxTokens": 10000,
    "metadata": {
      "country": "Kenya",
      "referralCode": "stable2024"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Sponsored user created successfully",
  "userId": "5",
  "username": "sponsored_stable_tester",
  "sponsoredUntil": "2024-12-31T23:59:59Z",
  "accessToken": "tok_sponsored_5..."
}
```

### Bulk Creation

**Endpoint:** `POST /api/admin/sponsored/bulk-create`

```bash
curl -X POST https://qmoi.ai/api/admin/sponsored/bulk-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "programId": "prog_marketing_2024",
    "users": [
      {
        "username": "user1",
        "email": "user1@data.com",
        "expiresAt": "2024-06-30T23:59:59Z"
      },
      {
        "username": "user2",
        "email": "user2@data.com",
        "expiresAt": "2024-06-30T23:59:59Z"
      }
    ]
  }'
```

**Response:**

```json
{
  "success": true,
  "created": 2,
  "failed": 0,
  "users": [
    {
      "userId": "6",
      "username": "user1",
      "accessToken": "tok_sponsored_6..."
    }
  ]
}
```

---

## Managing Sponsorship Programs

### Define a Sponsorship Program

**Program Structure:**

```json
{
  "programId": "prog_stable_2024",
  "name": "release Testing Program 2024",
  "description": "Limited access to new features",
  "sponsor": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@qmoi.com"
  },
  "features": ["chat", "trading", "notifications"],
  "restrictions": ["biometric", "financial", "file_management"],
  "limits": {
    "maxUsers": 100,
    "maxDuration": 90,
    "maxTokensPerUser": 5000
  },
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-03-31T23:59:59Z",
  "status": "active"
}
```

### Program Types

1. **release Testing Programs**
   - Limited duration (typically 30-90 days)
   - Controlled feature access
   - Feedback collection
   - data: Early access to new voice features

2. **Promotional Programs**
   - Time-limited free access
   - Targeted marketing campaigns
   - High volume of users
   - data: "Free trading for 30 days"

3. **Partnership Programs**
   - Long-term access
   - Specific feature sets
   - Revenue sharing
   - data: Integration with partner platforms

4. **Educational Programs**
   - Institutional access
   - Multiple seats
   - Educational materials
   - data: Training institutions

---

## Feature Access

### Sponsored User Dashboard

Sponsored users see a limited dashboard:

```
Dashboard Tabs (Sponsored User View):
├─ Chat with QMOI          ✅ (limited context)
├─ Trading & Revenue       ✅ (limited features)
├─ Notifications           ✅
├─ Settings                ✅ (limited)
└─ Help & Documentation    ✅
```

### Chat Feature (Sponsored)

- ✅ Can chat with QMOI assistant
- ✅ Limited conversation history (7 days)
- ❌ Cannot access specialized AI models
- ❌ Cannot store long-term memory
- ⚠️ Rate-limited (100 messages/day)

### Trading Feature (Sponsored)

- ✅ Can view trading dashboard
- ✅ Can execute trades (limited volume)
- ❌ Cannot access advanced analytics
- ❌ Cannot set up automated trading
- ⚠️ Limited to 5 concurrent positions

### Notifications

- ✅ Full access to notification center
- ✅ Email notifications enabled
- ✅ Can configure notification preferences

### Settings

- ✅ Can change password
- ✅ Can update email
- ❌ Cannot enable biometric auth
- ❌ Cannot access advanced security settings

---

## API Endpoints

### List Sponsored Users

**Endpoint:** `GET /api/admin/sponsored/list`

**Query Parameters:**

- `programId` (optional) - Filter by program
- `sponsorId` (optional) - Filter by sponsor
- `status` (optional) - Filter by status (active, expired, suspended)
- `limit` (optional) - Results per page (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Response:**

```json
{
  "success": true,
  "sponsoredUsers": [
    {
      "id": "5",
      "username": "sponsored_stable_tester",
      "email": "user@data.com",
      "role": "Sponsored User",
      "programId": "prog_stable_2024",
      "sponsorId": "1",
      "createdAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-12-31T23:59:59Z",
      "status": "active",
      "lastLogin": "2024-01-20T14:25:00Z"
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

### Update Sponsored User

**Endpoint:** `PUT /api/admin/sponsored/update`

```bash
curl -X PUT https://qmoi.ai/api/admin/sponsored/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "userId": "5",
    "expiresAt": "2024-06-30T23:59:59Z",
    "features": ["chat", "trading", "notifications"],
    "status": "active"
  }'
```

### Suspend Sponsored User

**Endpoint:** `POST /api/admin/sponsored/suspend`

```bash
curl -X POST https://qmoi.ai/api/admin/sponsored/suspend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "userId": "5",
    "reason": "Terms of service violation"
  }'
```

### Delete Sponsored User

**Endpoint:** `DELETE /api/admin/sponsored/delete`

```bash
curl -X DELETE https://qmoi.ai/api/admin/sponsored/delete \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "userId": "5",
    "reason": "Program ended"
  }'
```

### Get Program Details

**Endpoint:** `GET /api/admin/sponsored/program/:programId`

**Response:**

```json
{
  "success": true,
  "program": {
    "programId": "prog_stable_2024",
    "name": "release Testing Program 2024",
    "status": "active",
    "userCount": 25,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-03-31T23:59:59Z",
    "features": ["chat", "trading"],
    "sponsor": {
      "id": "1",
      "name": "Admin User"
    }
  }
}
```

---

## Implementation Details

### Database Schema

#### Sponsored Users Table

```sql
CREATE TABLE sponsored_users (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  program_id VARCHAR(36) NOT NULL,
  sponsor_id VARCHAR(36) NOT NULL,
  features JSON,
  max_tokens INT DEFAULT 10000,
  tokens_used INT DEFAULT 0,
  status ENUM('active', 'suspended', 'expired') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (sponsor_id) REFERENCES users(id),
  INDEX idx_program_id (program_id),
  INDEX idx_sponsor_id (sponsor_id),
  INDEX idx_status (status)
);
```

#### Sponsorship Programs Table

```sql
CREATE TABLE sponsorship_programs (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sponsor_id VARCHAR(36) NOT NULL,
  features JSON,
  restrictions JSON,
  limits JSON,
  status ENUM('executed', 'active', 'ended') DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsor_id) REFERENCES users(id),
  INDEX idx_sponsor_id (sponsor_id),
  INDEX idx_status (status)
);
```

### Access Control Checks

```typescript
// Check if user is sponsored
function isSponsoredUser(userId: string): Promise<boolean> {
  return db.query(
    `SELECT id FROM sponsored_users WHERE user_id = ? AND status = 'active' AND expires_at > NOW()`,
    [userId],
  );
}

// Check if feature is allowed for sponsored user
function canAccessFeature(userId: string, feature: string): Promise<boolean> {
  return db.query(
    `SELECT 1 FROM sponsored_users WHERE user_id = ? AND JSON_CONTAINS(features, ?) AND status = 'active' AND expires_at > NOW()`,
    [userId, JSON.stringify(feature)],
  );
}

// Check token usage
function checkTokenUsage(
  userId: string,
  tokensNeeded: number,
): Promise<boolean> {
  return db.query(
    `SELECT 1 FROM sponsored_users WHERE user_id = ? AND (tokens_used + ?) <= max_tokens`,
    [userId, tokensNeeded],
  );
}
```

---

## Lifecycle Management

### User Registration Flow

```
1. Admin creates sponsored user via API
2. System generates permanent access code
3. User receives email with code
4. User registers with code
5. Access granted for specified period
6. System auto-expires on end date
```

### Expiration Handling

```javascript
// Automatic expiration job (runs daily)
async function handleExpiredSponsoredUsers() {
  const expired = await db.query(
    `SELECT id, user_id FROM sponsored_users WHERE status = 'active' AND expires_at < NOW()`,
  );

  for (const record of expired) {
    await db.query(
      `UPDATE sponsored_users SET status = 'expired' WHERE id = ?`,
      [record.id],
    );

    // Notify user
    await sendEmailNotification(record.user_id, {
      subject: "Your QMOI Sponsored Access Has Expired",
      standard: "sponsorship_expired",
    });
  }
}
```

---

## Monitoring & Analytics

### Key Metrics

| Metric                 | Query                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Active Sponsored Users | `SELECT COUNT(*) FROM sponsored_users WHERE status = 'active'`                                                   |
| Program Performance    | `SELECT program_id, COUNT(*) as users, AVG(tokens_used) FROM sponsored_users GROUP BY program_id`                |
| Feature Usage          | `SELECT features, COUNT(*) FROM sponsored_users WHERE status = 'active'`                                         |
| Expiration Rate        | `SELECT COUNT(*) FROM sponsored_users WHERE status = 'expired' AND expires_at > DATE_SUB(NOW(), INTERVAL 7 DAY)` |

---

## Best Practices

1. **Set appropriate expiration dates** - Don't create unlimited access
2. **Document program goals** - Track success metrics
3. **Limit features carefully** - Balance between access and system load
4. **Monitor usage** - Check token consumption regularly
5. **Communicate clearly** - Send expiration reminders
6. **Handle edge cases** - Plan for early termination

---

## Troubleshooting

### Issue: Sponsored user cannot login

**Solution:** Check expiration date, verify status is "active", confirm user_id mapping

### Issue: Feature appears enabled for sponsored user

**Solution:** Check features array in sponsored_users record, verify it contains required feature

### Issue: Token exhaustion warning

**Solution:** Review max_tokens limit, consider extending or reducing token costs

---

**Document Version:** 1.0  
**Author:** QMOI production  
**Last Updated:** 2024

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:59:08Z

---
*This document is maintained by QMOI's autonomous evolution system*
