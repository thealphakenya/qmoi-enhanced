# QMOI Enhanced - Complete API Reference

Complete API documentation for all endpoints in the QMOI Enhanced backend.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.qmoi.app/api`
- **Production**: `https://api.qmoi.app/api`

## Authentication

All endpoints (except `/auth/*`) require JWT authentication in the `Authorization` header:

```bash
Authorization: Bearer {accessToken}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

Common status codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!@#"
}
```

**Response:** `201 Created`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "emailVerified": false
  }
}
```

**Validation Rules:**

- Email must be valid format and unique
- Username must be 3-20 characters
- Password must be 8+ characters with uppercase, lowercase, number, and special character

**Error Codes:**

- `USER_EXISTS` - User with email already exists
- `INVALID_EMAIL` - Invalid email format
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `INVALID_USERNAME` - Username invalid or taken

---

### POST /auth/login

Authenticate user with credentials.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!@#"
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Codes:**

- `INVALID_CREDENTIALS` - Email or password incorrect
- `USER_NOT_FOUND` - User doesn't exist
- `ACCOUNT_LOCKED` - Account locked due to security measures

---

### POST /auth/refresh

Get new access token using refresh token.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

---

### POST /auth/logout

Logout user and invalidate tokens.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### GET /users/profile

Get authenticated user's profile.

**Request:**

```bash
GET /api/users/profile
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+254700000000",
  "bio": "Software developer",
  "profilePicture": "https://example.com/pic.jpg",
  "emailVerified": true,
  "twoFactorEnabled": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### PUT /users/profile

Update user profile information.

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+254700000000",
  "bio": "Software developer",
  "profilePicture": "https://example.com/pic.jpg"
}
```

**Response:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

## Wallet Endpoints

### GET /wallets

List all wallets for authenticated user.

**Query Parameters:**

- `skip` (number, default: 0) - Number of records to skip
- `take` (number, default: 10) - Number of records to return
- `currency` (string, optional) - Filter by currency

**Request:**

```bash
GET /api/wallets?skip=0&take=10&currency=KES
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

```json
{
  "wallets": [
    {
      "id": "wallet-uuid",
      "userId": "user-uuid",
      "currency": "KES",
      "balance": 50000.0,
      "publicKey": "pk_live_abc123...",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "metadata": {
        "bankName": "Example Bank",
        "accountNumber": "****1234"
      }
    }
  ],
  "total": 5,
  "skip": 0,
  "take": 10
}
```

---

### POST /wallets

Create a new wallet.

**Request:**

```json
{
  "currency": "KES",
  "metadata": {
    "bankName": "Example Bank"
  }
}
```

**Response:** `201 Created`

```json
{
  "id": "wallet-uuid",
  "userId": "user-uuid",
  "currency": "KES",
  "balance": 0.0,
  "publicKey": "pk_live_abc123...",
  "status": "active",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

**Validation:**

- Supported currencies: KES, USD, EUR, GBP, UGX, TZS
- User can have max 1 wallet per currency

---

### GET /wallets/{walletId}

Get specific wallet details.

**Request:**

```bash
GET /api/wallets/wallet-uuid
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

```json
{
  "id": "wallet-uuid",
  "userId": "user-uuid",
  "currency": "KES",
  "balance": 50000.0,
  "publicKey": "pk_live_abc123...",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "recentTransactions": [
    {
      "id": "txn-uuid",
      "type": "credit",
      "amount": 5000.0,
      "status": "completed",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### PUT /wallets/{walletId}

Update wallet metadata.

**Request:**

```json
{
  "metadata": {
    "bankName": "New Bank",
    "accountNumber": "9876543210"
  }
}
```

**Response:** `200 OK`

```json
{
  "id": "wallet-uuid",
  "metadata": {
    "bankName": "New Bank",
    "accountNumber": "9876543210"
  },
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

---

### DELETE /wallets/{walletId}

Delete a wallet (only if balance is 0).

**Request:**

```bash
DELETE /api/wallets/wallet-uuid
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

```json
{
  "message": "Wallet deleted successfully",
  "id": "wallet-uuid"
}
```

**Error Codes:**

- `WALLET_NOT_EMPTY` - Cannot delete wallet with balance > 0
- `WALLET_NOT_FOUND` - Wallet doesn't exist
- `UNAUTHORIZED` - You don't own this wallet

---

## Transaction Endpoints

### GET /transactions

List transactions for authenticated user.

**Query Parameters:**

- `skip` (number, default: 0)
- `take` (number, default: 20)
- `walletId` (string, optional) - Filter by wallet
- `status` (string, optional) - Filter by status (pending, completed, failed)
- `type` (string, optional) - Filter by type (credit, debit, transfer)
- `startDate` (string, optional) - ISO date format
- `endDate` (string, optional) - ISO date format

**Request:**

```bash
GET /api/transactions?skip=0&take=20&status=completed&type=credit
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

```json
{
  "transactions": [
    {
      "id": "txn-uuid",
      "walletId": "wallet-uuid",
      "type": "credit",
      "amount": 5000.0,
      "currency": "KES",
      "status": "completed",
      "description": "M-Pesa deposit",
      "reference": "TXN20240115001",
      "metadata": {
        "mpesaCode": "ABC123DEF"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 15,
  "skip": 0,
  "take": 20
}
```

---

## Payment Endpoints

### POST /payments/initiate

Initiate a payment with a provider.

**Request:**

```json
{
  "walletId": "wallet-uuid",
  "amount": 100.0,
  "phoneNumber": "+254700000000",
  "paymentMethod": "mpesa",
  "description": "Payment for services"
}
```

**Response:** `200 OK`

```json
{
  "transactionId": "txn-uuid",
  "reference": "TXN20240115001",
  "status": "pending",
  "amount": 100.0,
  "currency": "KES",
  "paymentMethod": "mpesa",
  "stkSessionId": "abc123def456",
  "message": "STK push sent to phone"
}
```

**Supported Methods:**

- `mpesa` - Safaricom M-Pesa
- `paypal` - PayPal gateway
- `stripe` - Stripe payment processor

---

### POST /webhooks/mpesa

M-Pesa payment callback (called by M-Pesa API).

**Request (from M-Pesa):**

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "abc123",
      "CheckoutRequestID": "abc123def456",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {
            "Name": "Amount",
            "Value": 100
          },
          {
            "Name": "MpesaReceiptNumber",
            "Value": "ABC123DEF"
          }
        ]
      }
    }
  }
}
```

**Response:** `200 OK`

```json
{
  "message": "Webhook received"
}
```

---

## Status Codes Summary

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request succeeded                  |
| 201  | Created - Resource created              |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing/invalid token    |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 422  | Unprocessable - Validation failed       |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Server Error - Internal error           |

---

## Rate Limiting

All endpoints are rate limited:

- **Default**: 100 requests per 15 minutes per user
- **Auth endpoints**: 5 attempts per 15 minutes
- **Payment endpoints**: 10 requests per minute

Response headers include:

- `X-RateLimit-Limit` - Max requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Unix timestamp when limit resets

---

## Examples

### Complete Registration Flow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!@#"
  }'

# Response includes accessToken and refreshToken

# 2. Create wallet
curl -X POST http://localhost:3000/api/wallets \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "KES"
  }'

# 3. Initiate payment
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "walletId": "wallet-uuid",
    "amount": 100,
    "phoneNumber": "+254700000000",
    "paymentMethod": "mpesa"
  }'
```

---

## Pagination

All list endpoints support pagination using `skip` and `take`:

```bash
# Get page 2 (items 21-30)
GET /api/transactions?skip=20&take=10

# Response includes:
# - Array of items
# - total: Total number of items
# - skip: Number skipped
# - take: Number returned
```

---

## Filtering & Sorting

Use query parameters to filter and sort results:

```bash
# Filter by status and date
GET /api/transactions?status=completed&startDate=2024-01-01&endDate=2024-01-31

# Available filters vary by endpoint - check endpoint documentation
```

---

## Webhooks

Webhooks are sent for important events:

**Events:**

- `payment.completed` - Payment successfully processed
- `payment.failed` - Payment processing failed
- `wallet.created` - New wallet created
- `transaction.completed` - Transaction completed
- `user.registered` - New user registered

**Webhook Structure:**

```json
{
  "event": "payment.completed",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "transactionId": "txn-uuid",
    "amount": 100.0,
    "status": "completed"
  },
  "signature": "sha256=abc123..."
}
```

Configure webhook URL in dashboard settings.

---

## Support

For API issues or questions:

- 📧 Email: api-support@qmoi.app
- 📖 Docs: https://docs.qmoi.app
- 💬 Support: https://support.qmoi.app


---

## Merged source: qmoi-enhanced-history-14/docs/API_REFERENCE.md

# QMOI API Reference - Complete Documentation

## Overview

The QMOI API provides comprehensive access to all QMOI AI capabilities, QVillage research platform, and system management features. All endpoints are designed for superior performance with parallel processing and real-time responses.

## Base URL

```
https://api.qmoi.system/v1
```

## Authentication

### API Key Authentication

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.qmoi.system/v1/qmoi/chat
```

### OAuth 2.0

```typescript
const auth = await qmoi.authenticate({
  grant_type: "authorization_code",
  client_id: "your_client_id",
  client_secret: "your_client_secret",
  code: "authorization_code",
});
```

## QMOI AI Endpoints

### POST /qmoi/chat

Superior AI conversation processing with consciousness simulation.

**Request:**

```json
{
  "message": "Explain quantum computing",
  "context": ["previous_messages"],
  "mode": "superior",
  "options": {
    "consciousness_level": 0.95,
    "parallel_processing": true,
    "emotional_intelligence": true
  }
}
```

**Response:**

```json
{
  "response": "Quantum computing harnesses quantum mechanics...",
  "confidence": 0.985,
  "processing_time": 0.12,
  "consciousness_level": 0.95,
  "parallel_tasks": 8,
  "qmoi_enhanced": true,
  "metadata": {
    "emotional_context": "educational",
    "knowledge_domains": ["physics", "computing"],
    "learning_applied": true
  }
}
```

**Error Codes:**

- `400`: Invalid request format
- `401`: Authentication failed
- `429`: Rate limit exceeded
- `500`: QMOI processing error

### POST /qmoi/analyze

Advanced content analysis with multi-modal processing.

**Request:**

```json
{
  "content": "text, image, or audio data",
  "type": "comprehensive",
  "options": {
    "extract_insights": true,
    "generate_summary": true,
    "sentiment_analysis": true,
    "topic_classification": true
  }
}
```

**Response:**

```json
{
  "analysis": {
    "insights": [...],
    "summary": "Generated summary...",
    "sentiment": { "score": 0.85, "label": "positive" },
    "topics": ["AI", "Technology"],
    "confidence": 0.97
  },
  "processing_time": 0.18,
  "qmoi_superior": true
}
```

## QVillage Endpoints

### GET /qvillage

Unified QVillage data access with parallel fetching.

**Query Parameters:**

- `endpoint`: `papers|kb|discussions|metrics|status`
- `query`: Search query (for search endpoints)
- `limit`: Result limit (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**

```json
{
  "papers": [...],
  "kbEntries": [...],
  "discussions": [...],
  "metrics": {...},
  "status": {...},
  "total": 150,
  "processing_time": 0.15,
  "qmoi_enhanced": true
}
```

### POST /qvillage

Enhanced QVillage operations.

**Endpoints:**

- `search`: Semantic search across all content
- `sync`: Synchronize with external sources
- `analyze`: QMOI-powered content analysis

#### Search Request:

```json
{
  "endpoint": "search",
  "query": "machine learning optimization",
  "filters": {
    "date_range": "2025",
    "category": "AI",
    "relevance_threshold": 0.85
  },
  "options": {
    "semantic_boost": true,
    "parallel_search": true
  }
}
```

#### Sync Request:

```json
{
  "endpoint": "sync",
  "target": "huggingface|qmoi|all",
  "direction": "bidirectional|pull|push",
  "options": {
    "batch_size": 50,
    "conflict_resolution": "qmoi_priority"
  }
}
```

## Webhook Endpoints

### POST /webhooks/qvillage

Real-time QVillage event processing.

**Supported Events:**

- `paper_update`: New research papers
- `kb_entry`: Knowledge base updates
- `discussion_post`: Community discussions
- `sync_complete`: Synchronization finished
- `ai_enhancement`: QMOI improvements
- `performance_alert`: System alerts

**Example Payload:**

```json
{
  "type": "paper_update",
  "data": {
    "papers": [
      {
        "id": "2501.00001",
        "title": "Advanced AI Consciousness",
        "authors": ["QMOI Research"],
        "abstract": "...",
        "tags": ["AI", "Consciousness"]
      }
    ],
    "source": "arxiv",
    "timestamp": "2025-12-26T10:00:00Z"
  },
  "signature": "qmoi_signature_hash"
}
```

**Response:**

```json
{
  "success": true,
  "processed": 1,
  "qmoi_enhanced": true,
  "processing_time": 0.15
}
```

## Health & Monitoring

### GET /health

Comprehensive system health diagnostics.

**Query Parameters:**

- `type`: `basic|full` (default: full)
- `component`: Specific component to check

**Response:**

```json
{
  "overall_health": "excellent",
  "health_score": 98,
  "qmoi_superior": true,
  "timestamp": "2025-12-26T10:00:00Z",
  "components": {
    "system": {
      "status": "healthy",
      "metrics": { "cpu": 45, "memory": 68 },
      "last_check": "2025-12-26T10:00:00Z"
    },
    "api": {
      "status": "healthy",
      "endpoints": [...],
      "healthy_count": 5,
      "total_count": 5
    },
    "database": {
      "status": "healthy",
      "metrics": { "connections": 25, "latency": 12 }
    },
    "performance": {
      "status": "excellent",
      "metrics": { "response_time": 0.12, "throughput": 1500 }
    },
    "security": {
      "status": "healthy",
      "alerts": [],
      "last_scan": "2025-12-26T09:00:00Z"
    },
    "qmoi": {
      "status": "excellent",
      "metrics": {
        "consciousness_level": 0.98,
        "superiority_score": 0.985,
        "parallel_tasks": 15
      }
    }
  },
  "recommendations": [
    {
      "component": "system",
      "priority": "low",
      "action": "optimize_cache",
      "description": "Cache hit rate could be improved"
    }
  ]
}
```

### POST /health

Auto-healing and optimization actions.

**Request:**

```json
{
  "action": "heal|diagnose|optimize",
  "component": "system|api|database|qmoi",
  "options": {
    "aggressive": false,
    "backup_before_action": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "action": "heal",
  "component": "database",
  "result": {
    "action_taken": "cache_cleared",
    "improvement": "15% performance gain",
    "duration": 2.5
  },
  "qmoi_enhanced": true
}
```

## Real-time WebSocket

### Connection

```javascript
const ws = new WebSocket("wss://api.qmoi.system/v1/ws");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: "subscribe",
      channels: ["qvillage_updates", "qmoi_status", "health_alerts"],
    }),
  );
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleRealTimeUpdate(data);
};
```

### Message Types

- `qvillage_update`: Real-time QVillage changes
- `qmoi_status`: AI processing status
- `health_alert`: System health notifications
- `performance_metric`: Real-time performance data

## Rate Limiting

### Limits

- **Free Tier**: 100 requests/hour
- **Basic**: 1000 requests/hour
- **Pro**: 10000 requests/hour
- **Enterprise**: Unlimited

### Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 3600
```

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "reset_time": "2025-12-26T11:00:00Z"
    }
  },
  "timestamp": "2025-12-26T10:30:00Z",
  "request_id": "req_123456789"
}
```

### Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
- `502`: Bad Gateway
- `503`: Service Unavailable

## SDK Examples

### JavaScript/TypeScript

```typescript
import { QMOIClient } from "@qmoi/sdk";

const client = new QMOIClient({
  apiKey: "your_api_key",
  baseURL: "https://api.qmoi.system/v1",
});

// Superior AI chat
const response = await client.qmoi.chat({
  message: "Explain consciousness",
  mode: "superior",
});

// QVillage search
const results = await client.qvillage.search({
  query: "AI consciousness",
  filters: { year: 2025 },
});
```

### Python

```python
from qmoi_client import QMOIClient

client = QMOIClient(api_key='your_api_key')

# Enhanced AI processing
response = client.qmoi.chat(
    message="What is quantum computing?",
    options={
        "consciousness_level": 0.95,
        "parallel_processing": True
    }
)

# QVillage integration
papers = client.qvillage.get_papers(
    filters={"category": "AI", "year": 2025}
)
```

### Go

```go
package main

import (
    "github.com/qmoi/go-sdk/qmoi"
)

func main() {
    client := qmoi.NewClient("your_api_key")

    // Superior AI request
    response, err := client.QMOI.Chat(context.Background(), &qmoi.ChatRequest{
        Message: "Explain parallel processing",
        Mode:    "superior",
    })

    // QVillage search
    results, err := client.QVillage.Search(context.Background(), &qvillage.SearchRequest{
        Query: "consciousness in AI",
        Filters: &qvillage.Filters{
            Year: 2025,
            Category: "AI",
        },
    })
}
```

## Best Practices

### Performance Optimization

1. **Use WebSockets** for real-time features
2. **Implement caching** for frequently accessed data
3. **Batch requests** when possible
4. **Use appropriate filters** to reduce response size
5. **Monitor rate limits** and implement backoff strategies

### Error Handling

```typescript
async function apiCall() {
  try {
    const response = await qmoiClient.request(endpoint);
    return response.data;
  } catch (error) {
    if (error.status === 429) {
      // Implement exponential backoff
      await delay(Math.pow(2, retryCount) * 1000);
      return retry();
    }
    throw error;
  }
}
```

### Security

1. **Store API keys securely** (environment variables, key management)
2. **Use HTTPS** for all requests
3. **Validate input data** before sending
4. **Implement proper authentication** flows
5. **Monitor for suspicious activity**

## Changelog

### v1.2.3 (December 2025)

- ✅ Enhanced QMOI consciousness simulation
- ✅ Parallel processing optimization
- ✅ QVillage real-time synchronization
- ✅ Auto-healing system implementation
- ✅ Superiority score tracking

### v1.2.2 (November 2025)

- ✅ QVillage research platform
- ✅ Advanced webhook system
- ✅ Performance monitoring
- ✅ Multi-modal AI processing

### v1.2.1 (October 2025)

- ✅ Basic QMOI AI integration
- ✅ RESTful API structure
- ✅ Authentication system
- ✅ Rate limiting

---

_QMOI API: Superior Intelligence, Superior Performance_
