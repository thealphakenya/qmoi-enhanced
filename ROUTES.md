# ROUTES.md - Complete API Routes Reference

**Last Updated**: 2026-03-29T01:27:48.111238
**Total Routes**: 23
**Status**: ✅ Production Ready

## 📚 API Routes Overview

This document provides a comprehensive inventory of all API routes in the QMOI system, organized by domain and endpoint.

## 📊 Routes Statistics

| Metric | Count | Status |
|--------|-------|--------|
| Total Routes | 23 | ✅ Active |
| Domains | 3 | ✅ Organized |
| Production Status | ✅ | Ready |

### Routes by Domain

- **deployment-status.ts**: 1 routes
- **qcity**: 15 routes
- **qmoi**: 7 routes

## 🗂️ Complete Routes Inventory

### DEPLOYMENT-STATUS.TS Domain (1 routes)

#### /api/api/deployment-status

- **File**: [`api/deployment-status.ts`](routes/api/deployment-status.ts)
- **Domain**: `deployment-status.ts`
- **Type**: API Route
- **Status**: ✅ Active

### QCITY Domain (15 routes)

#### /api/api/qcity/ai/fix

- **File**: [`api/qcity/ai/fix.ts`](routes/api/qcity/ai/fix.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/config

- **File**: [`api/qcity/config.ts`](routes/api/qcity/config.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/projects/[id]

- **File**: [`api/qcity/projects/[id].ts`](routes/api/qcity/projects/[id].ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/projects/[id]/tasks

- **File**: [`api/qcity/projects/[id]/tasks.ts`](routes/api/qcity/projects/[id]/tasks.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/projects/index

- **File**: [`api/qcity/projects/index.ts`](routes/api/qcity/projects/index.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/start

- **File**: [`api/qcity/start.ts`](routes/api/qcity/start.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/status

- **File**: [`api/qcity/status.ts`](routes/api/qcity/status.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/stop

- **File**: [`api/qcity/stop.ts`](routes/api/qcity/stop.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/trading/config

- **File**: [`api/qcity/trading/config.ts`](routes/api/qcity/trading/config.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/trading/positions

- **File**: [`api/qcity/trading/positions.ts`](routes/api/qcity/trading/positions.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/whatsapp/config

- **File**: [`api/qcity/whatsapp/config.ts`](routes/api/qcity/whatsapp/config.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qcity/whatsapp/messages

- **File**: [`api/qcity/whatsapp/messages.ts`](routes/api/qcity/whatsapp/messages.ts)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/qcity/projects/[id]x

- **File**: [`qcity/projects/[id].tsx`](routes/qcity/projects/[id].tsx)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/qcity/projects/configx

- **File**: [`qcity/projects/config.tsx`](routes/qcity/projects/config.tsx)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/qcity/projects/indexx

- **File**: [`qcity/projects/index.tsx`](routes/qcity/projects/index.tsx)
- **Domain**: `qcity`
- **Type**: API Route
- **Status**: ✅ Active

### QMOI Domain (7 routes)

#### /api/api/qmoi/autodev

- **File**: [`api/qmoi/autodev.ts`](routes/api/qmoi/autodev.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qmoi/feedback

- **File**: [`api/qmoi/feedback.ts`](routes/api/qmoi/feedback.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qmoi/file

- **File**: [`api/qmoi/file.ts`](routes/api/qmoi/file.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qmoi/memory

- **File**: [`api/qmoi/memory.ts`](routes/api/qmoi/memory.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qmoi/memory-backup

- **File**: [`api/qmoi/memory-backup.ts`](routes/api/qmoi/memory-backup.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qmoi/payload

- **File**: [`api/qmoi/payload.ts`](routes/api/qmoi/payload.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active

#### /api/api/qmoi/status

- **File**: [`api/qmoi/status.ts`](routes/api/qmoi/status.ts)
- **Domain**: `qmoi`
- **Type**: API Route
- **Status**: ✅ Active


## 🔄 Route Organization

Routes are organized by:
1. **Domain**: QCity, QMOI, General, etc.
2. **Feature**: Payment, Auth, Projects, Trading, etc.
3. **Method**: GET, POST, PUT, DELETE, PATCH, etc.

## 📋 Route Patterns

Common route patterns in QMOI:

- `/api/qmoi/*` - QMOI specific endpoints
- `/api/qcity/*` - QCity platform endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/payments/*` - Payment processing
- `/api/webhooks/*` - Webhook receivers
- `/api/health/*` - Health check endpoints

## 🔐 Security

All routes implement:
- Authentication verification
- Authorization checks
- Input validation
- Rate limiting
- Error handling

## 📝 Integration

Routes are integrated with:
- Next.js API routes
- Express middleware
- Authentication system
- Payment processors
- External webhooks

---
*Last generated: 2026-03-29T01:27:48.112803*
*Maintained by QMOI Enhancement System*
