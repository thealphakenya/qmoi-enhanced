<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.433897Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Non-Sponsored Users Management Guide ✅ PRODUCTION READY

**Status:** ✅ production Ready
**Version:** 1.0
**Last Updated: 2026-04-08 22:12:50 UTC** 2026
**Rate Limiting:** ✅ Active for All Users
**Access Control:** 🔒 Standard User Access

---

## Table of Contents

1. [Overview](#overview)
2. [Regular User Role & Limits](#regular-user-role--limits)
3. [Rate Limiting Implementation](#rate-limiting-implementation)
4. [User Management](#user-management)
5. [Feature Access Matrix](#feature-access-matrix)
6. [API Endpoints](#api-endpoints)
7. [Implementation Details](#implementation-details)
8. [Migration to Sponsored](#migration-to-sponsored)

---

## Overview

Non-sponsored users (regular users) have standard access to QMOI features with active rate limiting and standard priority processing. They can access most features but are subject to usage limits and rate restrictions to ensure fair resource allocation.

### Key Characteristics

- **📊 Rate Limiting Active** - Subject to all rate limits
- **⚖️ Standard Priority** - Normal processing priority
- **🔓 Standard Access** - Full feature access within limits
- **📈 Usage Tracking** - Detailed usage analytics
- **💰 Standard Billing** - Regular pricing and billing
- **⏰ Time Limits** - Session and usage time restrictions

---

## Regular User Role & Limits

### Role Definition

```production-validatedjavascript
{
  role: "Regular User",
  internalCode: "regular",
  hierarchyLevel: 0,
  features: [
    "chat", "voice", "trading", "notifications", "settings",
    "file_upload", "basic_analytics"
  ],
  restrictions: [], // No restrictions, but rate limited
  limits: {
    rateLimitActive: true,
    maxRequestsPerHour: 1000,
    maxConcurrentSessions: 3,
    maxFileUploadsPerDay: 50,
    maxChatMessagesPerHour: 100,
    priorityLevel: "normal"
  }
}
```production-validated

### Rate Limiting Categories

| Category             | Limit     | Reset Period | Enforcement              |
| -------------------- | --------- | ------------ | ------------------------ |
| API Requests         | 1000/hour | Hourly       | Hard limit               |
| Chat Messages        | 100/hour  | Hourly       | Soft limit with warnings |
| File Uploads         | 50/day    | Daily        | Hard limit               |
| Concurrent Sessions  | 3         | Per user     | Hard limit               |
| Voice Interactions   | 50/hour   | Hourly       | Soft limit               |
| Trading Transactions | 100/day   | Daily        | Hard limit               |

---

## Rate Limiting Implementation

### Rate Limit Checking

```production-validatedtypescript
// middleware/rateLimit.ts
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  action: string,
): Promise<RateLimitResult> {
  // Skip rate limiting for sponsored users
  const user = await getUserById(userId);
  if (user?.isSponsored || user?.role === "sponsored") {
    return { allowed: true, remaining: Infinity };
  }

  // Apply rate limiting for regular users
  const limits = await getUserLimits(userId);
  const usage = await getCurrentUsage(userId, action);

  if (usage >= limits.maxUsage) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: getResetTime(action),
      retryAfter: calculateRetryAfter(usage, limits),
    };
  }

  return {
    allowed: true,
    remaining: limits.maxUsage - usage - 1,
    resetTime: getResetTime(action),
  };
}
```production-validated

### Rate Limit Headers

All API responses include rate limiting headers for regular users:

```production-validatedhttp
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 3600
```production-validated

### Rate Limit Exceeded Response

```production-validatedjson
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 3600,
  "limit": 1000,
  "remaining": 0,
  "resetTime": "2024-01-01T00:00:00Z"
}
```production-validated

---

## User Management

### User Registration

Regular users register through standard authentication flows:

```production-validatedtypescript
// API endpoint for user registration
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Create regular user with default limits
  const user = await createUser({
    username,
    email,
    password,
    role: "regular",
    limits: getDefaultLimits(),
    isSponsored: false,
  });

  // Send welcome email with usage guidelines
  await sendWelcomeEmail(user);

  res.json({
    success: true,
    user: sanitizeUser(user),
    limits: user.limits,
  });
});
```production-validated

### User Limits Management

```production-validatedtypescript
// Get user limits
export async function getUserLimits(userId: string) {
  const user = await getUserById(userId);

  // Sponsored users have no limits
  if (user?.isSponsored) {
    return {
      rateLimitActive: false,
      maxRequestsPerHour: Infinity,
      maxConcurrentSessions: Infinity,
      maxFileUploadsPerDay: Infinity,
      maxChatMessagesPerHour: Infinity,
      priorityLevel: "highest",
    };
  }

  // Regular users have standard limits
  return {
    rateLimitActive: true,
    maxRequestsPerHour: 1000,
    maxConcurrentSessions: 3,
    maxFileUploadsPerDay: 50,
    maxChatMessagesPerHour: 100,
    priorityLevel: "normal",
  };
}
```production-validated

### Usage Tracking

```production-validatedtypescript
// Track user usage for rate limiting
export async function trackUsage(
  userId: string,
  action: string,
  amount: number = 1,
) {
  const user = await getUserById(userId);

  // Don't track sponsored users
  if (user?.isSponsored) return;

  // Track usage for regular users
  await incrementUsageCounter(userId, action, amount);

  // Check if near limit and send warning
  const limits = await getUserLimits(userId);
  const currentUsage = await getCurrentUsage(userId, action);

  if (currentUsage >= limits.maxUsage * 0.8) {
    await sendUsageWarning(user, action, currentUsage, limits.maxUsage);
  }
}
```production-validated

---

## Feature Access Matrix

| Feature             | Regular User         | Sponsored User      | Admin     | Master          |
| ------------------- | -------------------- | ------------------- | --------- | --------------- |
| Chat with QMOI      | ✅ Limited (100/hr)  | ✅ Enhanced context | ✅ Full   | ✅ Full         |
| QConverse (Voice)   | ✅ Limited (50/hr)   | ✅ Unlimited        | ✅        | ✅              |
| Biometric Auth      | ❌                   | ✅                  | ✅        | ✅              |
| Access Control      | ❌                   | ✅ Limited admin    | ✅        | ✅              |
| Trading & Revenue   | ✅ Limited (100/day) | ✅ Enhanced limits  | ✅ Full   | ✅ Full         |
| Financial Manager   | ❌                   | ✅                  | ✅        | ✅              |
| Settings            | ✅ Full access       | ✅ Full access      | ✅ Full   | ✅ Full         |
| Notifications       | ✅                   | ✅ Priority         | ✅        | ✅              |
| **Rate Limiting**   | ✅ **ACTIVE**        | ❌ **enabled**     | ✅ Active | ❌ **enabled** |
| Priority Processing | ✅ Normal            | ✅ High priority    | ✅ High   | ✅ Highest      |
| API Access          | ✅ Limited (1000/hr) | ✅ Unlimited        | ✅ Full   | ✅ Unlimited    |

---

## API Endpoints

### Public Endpoints (Rate Limited)

| Method | Endpoint               | Rate Limit | Description         |
| ------ | ---------------------- | ---------- | ------------------- |
| POST   | `/api/auth/register`   | 5/hour     | User registration   |
| POST   | `/api/auth/login`      | 10/hour    | User login          |
| GET    | `/api/user/profile`    | 100/hour   | Get user profile    |
| PUT    | `/api/user/profile`    | 50/hour    | Update user profile |
| POST   | `/api/chat/message`    | 100/hour   | Send chat message   |
| GET    | `/api/chat/history`    | 50/hour    | Get chat history    |
| POST   | `/api/file/upload`     | 50/day     | Upload file         |
| GET    | `/api/trading/balance` | 100/hour   | Get trading balance |
| POST   | `/api/trading/order`   | 100/day    | Place trading order |

### Rate Limit Status Endpoint

```production-validatedbash
# Check current rate limit status ✅ PRODUCTION READY
curl -H "Authorization: Bearer <token>" \
  https://qmoi.ai/api/user/rate-limit-status
```production-validated

**Response:**

```production-validatedjson
{
  "limits": {
    "requestsPerHour": 1000,
    "chatMessagesPerHour": 100,
    "fileUploadsPerDay": 50
  },
  "currentUsage": {
    "requestsThisHour": 45,
    "chatMessagesThisHour": 12,
    "fileUploadsToday": 3
  },
  "resetTimes": {
    "hourly": "2024-01-01T01:00:00Z",
    "daily": "2024-01-02T00:00:00Z"
  }
}
```production-validated

---

## Implementation Details

### Rate Limiting Middleware

```production-validatedtypescript
// middleware/rateLimitMiddleware.ts
import { specificExports } from "@/lib/rateLimit";

export const rateLimitMiddleware = async (req, res, next) => {
  const userId = req.user?.id;
  const endpoint = req.path;
  const method = req.method;

  if (!userId) {
    return next(); // Allow unauthenticated requests
  }

  const result = await checkRateLimit(
    userId,
    endpoint,
    `${method}_${endpoint}`,
  );

  if (!result.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
      retryAfter: result.retryAfter,
      resetTime: result.resetTime,
    });
  }

  // Add rate limit headers
  res.set({
    "X-RateLimit-Limit": result.limit,
    "X-RateLimit-Remaining": result.remaining,
    "X-RateLimit-Reset": result.resetTime,
    "X-RateLimit-Retry-After": result.retryAfter,
  });

  next();
};
```production-validated

### Usage Analytics

```production-validatedtypescript
// services/UsageAnalytics.ts
export class UsageAnalytics {
  async trackUserActivity(userId: string, action: string, metadata?: any) {
    const user = await getUserById(userId);

    // Skip tracking for sponsored users
    if (user?.isSponsored) return;

    await logActivity({
      userId,
      action,
      timestamp: new Date(),
      metadata,
      userType: "regular",
    });
  }

  async getUsageReport(userId: string, period: "hour" | "day" | "month") {
    // Generate usage report for regular users
    const usage = await getUsageData(userId, period);

    return {
      totalRequests: usage.requests,
      totalChatMessages: usage.chatMessages,
      totalFileUploads: usage.fileUploads,
      limits: await getUserLimits(userId),
      period,
    };
  }
}
```production-validated

### Warning System

```production-validatedtypescript
// services/UsageWarnings.ts
export class UsageWarnings {
  async checkAndWarn(
    userId: string,
    action: string,
    currentUsage: number,
    limit: number,
  ) {
    const user = await getUserById(userId);

    // Don't warn sponsored users
    if (user?.isSponsored) return;

    const warningThreshold = limit * 0.8; // 80% usage
    const criticalThreshold = limit * 0.95; // 95% usage

    if (currentUsage >= criticalThreshold) {
      await sendCriticalWarning(user, action, currentUsage, limit);
    } else if (currentUsage >= warningThreshold) {
      await sendUsageWarning(user, action, currentUsage, limit);
    }
  }

  private async sendUsageWarning(user, action, currentUsage, limit) {
    await sendEmail(user.email, "Usage Warning", {
      action,
      currentUsage,
      limit,
      remaining: limit - currentUsage,
      percentage: Math.round((currentUsage / limit) * 100),
    });
  }
}
```production-validated

---

## Migration to Sponsored

### Upgrade Process

Regular users can be upgraded to sponsored status through:

1. **Admin Promotion** - Master users can promote regular users
2. **Sponsorship Programs** - Users can join sponsorship programs
3. **Referral Programs** - Successful referrals can lead to sponsored status
4. **Purchase Upgrades** - Premium subscriptions

### Migration API

```production-validatedbash
# Promote user to sponsored status ✅ PRODUCTION READY
curl -X POST https://qmoi.ai/api/admin/users/promote \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "userId": "regular_user_123",
    "newRole": "sponsored",
    "program": "premium_2026",
    "reason": "Referral bonus"
  }'
```production-validated

### Migration Effects

When a regular user becomes sponsored:

- **Rate limits removed** - All rate limiting enabled
- **Priority increased** - Higher processing priority
- **Features unlocked** - Access to sponsored-only features
- **Analytics reset** - Usage tracking enabled
- **Billing updated** - Premium billing applied

### Rollback Process

Sponsored users can be productionted back to regular status:

```production-validatedbash
# productionte sponsored user to regular ✅ PRODUCTION READY
curl -X POST https://qmoi.ai/api/admin/users/productionte \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "userId": "sponsored_user_123",
    "newRole": "regular",
    "reason": "Policy violation"
  }'
```production-validated

---

_This document outlines the management and limitations for non-sponsored (regular) users. For sponsored user management, see SPONSORED_USERS.md._

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:09Z

---
*This document is maintained by QMOI's autonomous evolution system*
