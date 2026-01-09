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
- `pesapal` - Pesapal gateway
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
