# Sponsored Users Management Guide

**Status:** ✅ Complete  
**Version:** 1.0  
**Last Updated:** 2024

---

## Table of Contents
1. [Overview](#overview)
2. [Sponsored User Role](#sponsored-user-role)
3. [Creating Sponsored Users](#creating-sponsored-users)
4. [Managing Sponsorship Programs](#managing-sponsorship-programs)
5. [Feature Access](#feature-access)
6. [API Endpoints](#api-endpoints)
7. [Implementation Details](#implementation-details)

---

## Overview

Sponsored users are a special user category with limited access to specific QMOI features. They're typically created through sponsorship programs, promotional campaigns, or beta testing initiatives. Sponsored users have reduced functionality compared to regular users but can still utilize core chat and trading features.

### Key Characteristics
- **Limited feature access** - Only specific features available
- **Time-limited access** - Can have expiration dates
- **Program-specific features** - Access controlled by sponsorship program
- **Admin-managed** - Only admins and masters can create/manage
- **Separate billing/metrics** - Tracked independently from regular users

---

## Sponsored User Role

### Role Definition
```javascript
{
  role: "Sponsored User",
  internalCode: "sponsored",
  hierarchyLevel: 1,
  features: ["chat", "trading", "notifications", "settings"],
  restrictions: ["biometric", "file_management", "financial", "admin"]
}
```

### Permissions
| Feature | Sponsored User | Regular User | Admin | Master |
|---------|---|---|---|---|
| Chat with QMOI | ✅ Limited context | ✅ Full | ✅ Full | ✅ Full |
| QConverse (Voice) | ❌ | ✅ | ✅ | ✅ |
| Biometric Auth | ❌ | ✅ | ✅ | ✅ |
| Access Control | ❌ | ❌ | ✅ | ✅ |
| Trading & Revenue | ✅ Limited | ✅ Full | ✅ Full | ✅ Full |
| Financial Manager | ❌ | ❌ | ✅ | ✅ |
| Settings | ✅ Limited | ✅ Full | ✅ Full | ✅ Full |
| Notifications | ✅ | ✅ | ✅ | ✅ |

---

## Creating Sponsored Users

### Manual Creation via API

**Endpoint:** `POST /api/admin/sponsored/create`

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/sponsored/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "username": "sponsored_beta_tester",
    "email": "betaTester@example.com",
    "sponsorId": "1",
    "programId": "prog_beta_2024",
    "features": ["chat", "trading"],
    "expiresAt": "2024-12-31T23:59:59Z",
    "maxTokens": 10000,
    "metadata": {
      "country": "Kenya",
      "referralCode": "BETA2024"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Sponsored user created successfully",
  "userId": "5",
  "username": "sponsored_beta_tester",
  "sponsoredUntil": "2024-12-31T23:59:59Z",
  "accessToken": "tok_sponsored_5..."
}
```

### Bulk Creation

**Endpoint:** `POST /api/admin/sponsored/bulk-create`

```bash
curl -X POST http://localhost:3000/api/admin/sponsored/bulk-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "programId": "prog_marketing_2024",
    "users": [
      {
        "username": "user1",
        "email": "user1@example.com",
        "expiresAt": "2024-06-30T23:59:59Z"
      },
      {
        "username": "user2",
        "email": "user2@example.com",
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
  "programId": "prog_beta_2024",
  "name": "Beta Testing Program 2024",
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

1. **Beta Testing Programs**
   - Limited duration (typically 30-90 days)
   - Controlled feature access
   - Feedback collection
   - Example: Early access to new voice features

2. **Promotional Programs**
   - Time-limited free access
   - Targeted marketing campaigns
   - High volume of users
   - Example: "Free trading for 30 days"

3. **Partnership Programs**
   - Long-term access
   - Specific feature sets
   - Revenue sharing
   - Example: Integration with partner platforms

4. **Educational Programs**
   - Institutional access
   - Multiple seats
   - Educational materials
   - Example: Training institutions

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
      "username": "sponsored_beta_tester",
      "email": "user@example.com",
      "role": "Sponsored User",
      "programId": "prog_beta_2024",
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
curl -X PUT http://localhost:3000/api/admin/sponsored/update \
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
curl -X POST http://localhost:3000/api/admin/sponsored/suspend \
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
curl -X DELETE http://localhost:3000/api/admin/sponsored/delete \
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
    "programId": "prog_beta_2024",
    "name": "Beta Testing Program 2024",
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
  status ENUM('planned', 'active', 'ended') DEFAULT 'active',
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
    [userId]
  );
}

// Check if feature is allowed for sponsored user
function canAccessFeature(userId: string, feature: string): Promise<boolean> {
  return db.query(
    `SELECT 1 FROM sponsored_users WHERE user_id = ? AND JSON_CONTAINS(features, ?) AND status = 'active' AND expires_at > NOW()`,
    [userId, JSON.stringify(feature)]
  );
}

// Check token usage
function checkTokenUsage(userId: string, tokensNeeded: number): Promise<boolean> {
  return db.query(
    `SELECT 1 FROM sponsored_users WHERE user_id = ? AND (tokens_used + ?) <= max_tokens`,
    [userId, tokensNeeded]
  );
}
```

---

## Lifecycle Management

### User Registration Flow

```
1. Admin creates sponsored user via API
2. System generates temporary access code
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
    `SELECT id, user_id FROM sponsored_users WHERE status = 'active' AND expires_at < NOW()`
  );
  
  for (const record of expired) {
    await db.query(
      `UPDATE sponsored_users SET status = 'expired' WHERE id = ?`,
      [record.id]
    );
    
    // Notify user
    await sendEmailNotification(record.user_id, {
      subject: "Your QMOI Sponsored Access Has Expired",
      template: "sponsorship_expired"
    });
  }
}
```

---

## Monitoring & Analytics

### Key Metrics

| Metric | Query |
|--------|-------|
| Active Sponsored Users | `SELECT COUNT(*) FROM sponsored_users WHERE status = 'active'` |
| Program Performance | `SELECT program_id, COUNT(*) as users, AVG(tokens_used) FROM sponsored_users GROUP BY program_id` |
| Feature Usage | `SELECT features, COUNT(*) FROM sponsored_users WHERE status = 'active'` |
| Expiration Rate | `SELECT COUNT(*) FROM sponsored_users WHERE status = 'expired' AND expires_at > DATE_SUB(NOW(), INTERVAL 7 DAY)` |

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

### Issue: Feature appears disabled for sponsored user
**Solution:** Check features array in sponsored_users record, verify it contains required feature

### Issue: Token exhaustion warning
**Solution:** Review max_tokens limit, consider extending or reducing token costs

---

**Document Version:** 1.0  
**Author:** QMOI Development  
**Last Updated:** 2024
