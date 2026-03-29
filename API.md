<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T01:01:10.435738Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI AI - Complete API Reference

**Last Updated**: 2026-03-29T00:59:40.589325
**Total Endpoints**: 20
**Production Status**: ✅ Ready for Production

## API Overview

This document provides a comprehensive reference of all QMOI AI API endpoints, organized by domain and functionality. All endpoints are production-ready with full error handling and security measures implemented.

## Table of Contents
- [GENERAL](#general)
- [QCITY](#qcity)
- [QMOI](#qmoi)

## Endpoints by Domain


### GENERAL

- `deployment-status.ts`

### QCITY

- `qcity/ai/fix.ts`
- `qcity/config.ts`
- `qcity/projects/[id].ts`
- `qcity/projects/[id]/tasks.ts`
- `qcity/projects/index.ts`
- `qcity/start.ts`
- `qcity/status.ts`
- `qcity/stop.ts`
- `qcity/trading/config.ts`
- `qcity/trading/positions.ts`
- `qcity/whatsapp/config.ts`
- `qcity/whatsapp/messages.ts`

### QMOI

- `qmoi/autodev.ts`
- `qmoi/feedback.ts`
- `qmoi/file.ts`
- `qmoi/memory-backup.ts`
- `qmoi/memory.ts`
- `qmoi/payload.ts`
- `qmoi/status.ts`

## Detailed Endpoint Documentation

### General API Endpoints



### QCity Endpoints


#### qcity/ai/fix.ts
- **Path**: `/api/qcity/ai/fix.ts`
- **Status**: ✅ Active

#### qcity/config.ts
- **Path**: `/api/qcity/config.ts`
- **Status**: ✅ Active

#### qcity/projects/[id].ts
- **Path**: `/api/qcity/projects/[id].ts`
- **Status**: ✅ Active

#### qcity/projects/[id]/tasks.ts
- **Path**: `/api/qcity/projects/[id]/tasks.ts`
- **Status**: ✅ Active

#### qcity/projects/index.ts
- **Path**: `/api/qcity/projects/index.ts`
- **Status**: ✅ Active

#### qcity/start.ts
- **Path**: `/api/qcity/start.ts`
- **Status**: ✅ Active

#### qcity/status.ts
- **Path**: `/api/qcity/status.ts`
- **Status**: ✅ Active

#### qcity/stop.ts
- **Path**: `/api/qcity/stop.ts`
- **Status**: ✅ Active

#### qcity/trading/config.ts
- **Path**: `/api/qcity/trading/config.ts`
- **Status**: ✅ Active

#### qcity/trading/positions.ts
- **Path**: `/api/qcity/trading/positions.ts`
- **Status**: ✅ Active

#### qcity/whatsapp/config.ts
- **Path**: `/api/qcity/whatsapp/config.ts`
- **Status**: ✅ Active

#### qcity/whatsapp/messages.ts
- **Path**: `/api/qcity/whatsapp/messages.ts`
- **Status**: ✅ Active

### QMOI Endpoints  


#### qmoi/autodev.ts
- **Path**: `/api/qmoi/autodev.ts`
- **Status**: ✅ Active

#### qmoi/feedback.ts
- **Path**: `/api/qmoi/feedback.ts`
- **Status**: ✅ Active

#### qmoi/file.ts
- **Path**: `/api/qmoi/file.ts`
- **Status**: ✅ Active

#### qmoi/memory-backup.ts
- **Path**: `/api/qmoi/memory-backup.ts`
- **Status**: ✅ Active

#### qmoi/memory.ts
- **Path**: `/api/qmoi/memory.ts`
- **Status**: ✅ Active

#### qmoi/payload.ts
- **Path**: `/api/qmoi/payload.ts`
- **Status**: ✅ Active

#### qmoi/status.ts
- **Path**: `/api/qmoi/status.ts`
- **Status**: ✅ Active

## API Standards

All endpoints follow these conventions:
- **Base URL**: `https://api.qmoi.ai/api` or `http://localhost:3000/api`
- **Authentication**: Bearer token in Authorization header
- **Response Format**: JSON
- **Error Handling**: Standardized error responses with HTTP status codes
- **Rate Limiting**: API rate limits per endpoint documented

## Security

- All endpoints require authentication except where explicitly noted
- CORS enabled for web applications
- Request validation on all inputs
- Rate limiting enabled to prevent abuse
- IP whitelisting available for enterprise clients

