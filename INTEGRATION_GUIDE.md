# Integration Guide: Frontend Adapters & Backend API

**Date:** December 2, 2025  
**Version:** 1.0  
**Status:** Ready for backend integration

---

## Overview

This guide explains how to integrate the frontend adapter layer (`src/adapters/clientAdapters.ts`) with backend API endpoints. The frontend is **production-ready** and waiting for backend implementation.

**Key Points:**

- ✅ Frontend adapters ready with safe fallbacks
- ✅ Centralized API configuration (`src/config/api.ts`)
- ✅ Environment-aware endpoints (local/dev/staging/prod)
- ✅ 12 components wired to adapters (6 functions each)
- ⏳ Backend endpoints needed: 7 routes

---

## For Developers (Local Setup)

### 1. Clone the Repository

```bash
cd /path/to/qmoi-enhanced
git clone [repo-url] .
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with local API endpoints
nano .env.local
# Change NEXT_PUBLIC_API_URL to your backend (e.g., http://localhost:8000)
# Change NEXT_PUBLIC_ENV to 'local' or 'development'
```

### 3. Start HTTP Server for Dashboards

```bash
# Option A: Python (built-in, no deps needed)
python3 -m http.server 8080

# Then open in browser:
# http://localhost:8080/qcity-enterprise.html
```

### 4. Start Next.js Dev Server (if testing QMOI AI pages)

```bash
# Install dependencies (requires Node.js 18+)
npm install

# Start dev server
npm run dev

# Open http://localhost:3000 in browser
```

### 5. Test with Mock Backend (No Real API)

```bash
# Option A: Use included mock server (see Task 4 below)
python3 mock_server.py

# Option B: Use curl to test adapters
curl -X POST http://localhost:8000/api/mail \
  -H "Content-Type: application/json" \
  -d '{"to": "user@example.com", "subject": "Test", "body": "Hello"}'
```

### 6. Verify Setup

```bash
# Run verification script (see Task 7 below)
bash verify_setup.sh
```

---

## For Backend Team (API Implementation)

### 1. Required Endpoints

The frontend adapters expect these 7 routes. Implement them in your backend:

#### **POST /api/mail** — Send Email

```typescript
// Input
{
  to: string;           // recipient email
  subject: string;      // email subject
  body: string;         // email body (HTML or plain text)
  cc?: string[];        // optional CC recipients
  bcc?: string[];       // optional BCC recipients
}

// Success Response (200)
{
  success: true;
  messageId?: string;   // optional: email service message ID
}

// Error Response (400/500)
{
  error: string;        // error description
  code?: string;        // error code
}
```

#### **POST /api/files** — Upload/Transfer Files

```typescript
// Input (FormData)
{
  file: File;           // file to upload (use FormData)
  destination?: string; // optional: storage path (default: /uploads)
  metadata?: object;    // optional: custom metadata
}

// Success Response (200)
{
  success: true;
  fileId: string;       // unique file ID
  url: string;          // file access URL
  size: number;         // file size in bytes
}

// Error Response (400/500)
{
  error: string;
}
```

#### **POST /api/emergency** — SOS/Lockdown/Wipe/Alert

```typescript
// Input
{
  action: 'sos' | 'lockdown' | 'wipe' | 'alert';
  deviceId?: string;    // optional: target device
  reason?: string;      // optional: action reason
  metadata?: object;    // optional: additional data
}

// Success Response (200)
{
  success: true;
  actionId: string;     // unique action ID for tracking
  status: string;       // 'initiated' | 'pending' | 'completed'
}

// Error Response (400/500)
{
  error: string;
}
```

#### **POST /api/verify** — Product Verification

```typescript
// Input
{
  sku: string;          // product SKU/barcode
  productId?: string;   // optional: product ID
  serialNumber?: string; // optional: serial number
}

// Success Response (200)
{
  success: true;
  verified: boolean;    // true if product authentic
  details?: {
    productName: string;
    manufacturer: string;
    price: number;
    lastVerified: string; // ISO date
  };
}

// Error Response (400/500)
{
  error: string;
}
```

#### **POST /api/youtube/download** — YouTube Downloader

```typescript
// Input
{
  url: string;          // YouTube video URL
  format?: 'mp3' | 'mp4'; // optional: output format (default: mp4)
  quality?: string;     // optional: video quality (e.g., '720p', '1080p')
}

// Success Response (200)
{
  success: true;
  downloadId: string;   // unique download ID
  url: string;          // download link (temporary)
  expiresIn: number;    // seconds until link expires
}

// Error Response (400/500)
{
  error: string;
}
```

#### **GET /api/media** — List Media Items

```typescript
// Query Parameters
{
  limit?: number;       // default: 20
  offset?: number;      // default: 0
  type?: string;        // filter: 'image' | 'video' | 'audio'
  search?: string;      // search term
}

// Success Response (200)
{
  success: true;
  items: Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio';
    url: string;
    size: number;        // bytes
    createdAt: string;   // ISO date
  }>;
  total: number;        // total items (for pagination)
}

// Error Response (400/500)
{
  error: string;
}
```

#### **GET /api/health** — Health Check

```typescript
// No input required

// Success Response (200)
{
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;    // ISO date
  version: string;      // API version
  uptime: number;       // seconds since startup
  checks?: {
    database?: 'ok' | 'error';
    mail?: 'ok' | 'error';
    storage?: 'ok' | 'error';
  };
}
```

### 2. Common Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: * (or specific origin)
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 3. Error Handling

All endpoints should return appropriate HTTP status codes:

- `400` — Bad request (invalid input)
- `401` — Unauthorized (missing/invalid auth)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found (resource doesn't exist)
- `500` — Server error (unhandled exception)

### 4. Implementation Reference

See `BACKEND_API_TEMPLATES.md` for complete code examples in:

- Node.js + Express
- Python + Flask
- Python + FastAPI
- Go + Gin

---

## For QA (Testing)

### 1. Test Components Locally

**Test 1: Email Component**

```bash
1. Open http://localhost:8080/qcity-enterprise.html
2. Navigate to GlobalMail component (if visible)
3. Fill in: to, subject, body
4. Click "Send Mail"
5. Expected: "Mail sent successfully" or error message
6. Check browser console (F12) for adapter logs
```

**Test 2: File Transfer**

```bash
1. Open http://localhost:8080/qcity-enterprise.html
2. Find GlobalFileTransfer component
3. Select a file and click "Upload"
4. Expected: File uploaded message (check Network tab in DevTools)
5. Check backend logs for POST /api/files request
```

**Test 3: Emergency Actions**

```bash
1. Open http://localhost:8080/qcity-enterprise.html
2. Find EmergencyPanel component
3. Click SOS/Lockdown/Wipe/Alert button
4. Verify modal confirms action
5. Check Network tab for POST /api/emergency request
```

**Test 4: Media Manager**

```bash
1. Open http://localhost:8080/qcity-enterprise.html
2. Find QmoiMediaManager component
3. Click "Fetch Media" button
4. Expected: Media list loads (or mock data if backend unavailable)
5. Check console for adapter debug logs
```

### 2. Test with Mock Backend

```bash
# Start mock server (Task 4)
python3 mock_server.py

# Update .env.local to use mock backend:
NEXT_PUBLIC_API_URL=http://localhost:5000

# Open dashboard and test all components
# All requests go to mock server, safe to test
```

### 3. Manual Testing Checklist

- [ ] All dashboards load without errors (HTTP 200)
- [ ] API config respects `NEXT_PUBLIC_API_URL` env var
- [ ] API config respects `NEXT_PUBLIC_ENV` env var
- [ ] Adapter functions log to console (`console.warn`)
- [ ] Fallback messages display when backend unavailable
- [ ] Network tab shows correct API calls
- [ ] Error messages are user-friendly (no raw JSON)
- [ ] Components don't crash when API returns error

### 4. Automated Testing

```bash
# Run Jest tests (once implemented)
npm test

# Run E2E tests (Playwright)
npm run test:e2e

# Check lint
npm run lint
```

---

## Common Integration Issues & Fixes

### Issue 1: CORS Errors

**Error:** `Access to XMLHttpRequest at 'http://localhost:8000/api/mail' from origin 'http://localhost:8080' has been blocked by CORS policy`

**Fix:**

```javascript
// Backend: Add CORS headers to all endpoints
response.headers["Access-Control-Allow-Origin"] = "*";
response.headers["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE, OPTIONS";
response.headers["Access-Control-Allow-Headers"] =
  "Content-Type, Authorization";
```

### Issue 2: API Endpoint Not Found

**Error:** `404 Not Found` when calling `/api/mail`

**Fix:**

1. Verify endpoint path matches exactly (case-sensitive)
2. Check backend is running: `curl http://localhost:8000/api/health`
3. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
4. Restart Next.js dev server: `npm run dev`

### Issue 3: Timeout Errors

**Error:** `Adapter timeout after 30 seconds`

**Fix:**

1. Check backend is responding: `curl -v http://localhost:8000/api/health`
2. Increase timeout in `src/config/api.ts` if needed
3. Check network latency: `ping localhost:8000`
4. Check backend logs for slow queries

### Issue 4: Environment Variables Not Loading

**Error:** API calls go to wrong URL (not respecting `NEXT_PUBLIC_API_URL`)

**Fix:**

1. Verify `.env.local` exists: `ls -la .env.local`
2. Verify format: `NEXT_PUBLIC_API_URL=http://localhost:8000` (no quotes)
3. Restart dev server: `npm run dev`
4. Check loaded value: `console.log(process.env.NEXT_PUBLIC_API_URL)`

### Issue 5: Mock Data Still Showing After Backend Started

**Error:** Component shows mock/fallback data even though backend is running

**Fix:**

1. Check Network tab: Are requests hitting backend?
2. Check browser console: Any adapter errors logged?
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Verify backend endpoint returns valid JSON
5. Check adapter function for early return condition

---

## Testing with Mock Backend

### Option A: Use Included Mock Server

```bash
# See Task 4 below for setup
python3 mock_server.py

# Server runs on http://localhost:5000
# All endpoints return sample responses
```

### Option B: Use curl (Manual Testing)

```bash
# Test mail endpoint
curl -X POST http://localhost:8000/api/mail \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Test","body":"Hello"}'

# Test files endpoint
curl -X POST http://localhost:8000/api/files \
  -F "file=@/path/to/file.txt"

# Test health check
curl http://localhost:8000/api/health

# Test media list
curl http://localhost:8000/api/media?limit=10
```

### Option C: Use Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import collection (if provided)
3. Set environment: `base_url = http://localhost:8000`
4. Run requests and inspect responses

---

## Deployment Steps

### Local Development

1. `cp .env.example .env.local`
2. Update `NEXT_PUBLIC_API_URL` to your backend
3. `npm install && npm run dev`
4. Open `http://localhost:3000`

### Staging

1. Set `NEXT_PUBLIC_ENV=staging`
2. Set `NEXT_PUBLIC_API_URL=https://staging-api.example.com`
3. `npm run build`
4. Deploy to staging server
5. Run smoke tests

### Production

1. Set `NEXT_PUBLIC_ENV=production`
2. Set `NEXT_PUBLIC_API_URL=https://api.example.com`
3. `npm run build`
4. Run full test suite
5. Deploy to CDN/server
6. Monitor error logs

---

## Next Steps

### Week 1

- [ ] Backend team implements 7 API endpoints (see `BACKEND_API_TEMPLATES.md`)
- [ ] Developer runs `npm install && npm run build`
- [ ] QA starts testing with mock backend (Task 4)

### Week 2

- [ ] Integrate with real backend services (mail, storage, etc.)
- [ ] Run full integration tests
- [ ] Security audit (see `SECURITY_CHECKLIST.md`)

### Week 3

- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Performance optimization
- [ ] Final QA sign-off

### Week 4

- [ ] Deploy to production
- [ ] Monitor adapter errors
- [ ] Gather user feedback

---

## Reference Documents

- **PRODUCTION_READINESS_REPORT.md** — Full status and remaining tasks
- **BACKEND_API_TEMPLATES.md** — Code examples for all endpoints
- **BUILD_INSTRUCTIONS.md** — How to build locally
- **SECURITY_CHECKLIST.md** — Auth, CORS, rate limiting, logging
- **CONSOLIDATION_ANALYSIS.md** — Plan to consolidate 154 duplicates

---

**Questions?** Check the troubleshooting section above or contact the backend/DevOps team.
