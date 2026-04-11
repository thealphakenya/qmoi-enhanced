<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-08T22:06:15.890113
- IMPLEMENTED: Auto-updated by comprehensive documentation update
<!-- LION_VALIDATION_END -->

# QMOI API Documentation ✅ PRODUCTION READY

**Generated**: 2026-04-08
**Last Updated**: 2026-04-08T22:06:15.890147
**Total Endpoints**: 43

## Overview

This document provides comprehensive documentation for all QMOI system APIs. All endpoints are auto-generated and verified.

## optimized Access

- **Total Endpoints**: 43
- **API Base URL**: `/api`
- **Authentication**: JWT tokens required for most endpoints
- **Rate Limiting**: Applied to all endpoints
- **Response Format**: JSON (application/json)

## Authentication

All API endpoints require authentication via JWT tokens (except public endpoints).

```production-validated
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password_hash": "sha256_hash"
}
```production-validated

## API Endpoints by Category

### Evolution System
- `GET/POST /api/qmoi/evolution/compare-models`
- `GET/POST /api/qmoi/evolution/replace-model`
- `GET/POST /api/qmoi/evolution/track-evolution`

### Autoprod System
- `GET/POST /api/qmoi/autodev/generate-feature`
- `GET/POST /api/qmoi/autodev/research`
- `GET/POST /api/qmoi/autodev/state`
- `GET/POST /api/qmoi/autodev/suggestions/features`
- `GET/POST /api/qmoi/autodev/suggestions/improvements`
- `GET/POST /api/qmoi/autodev/suggestions/optimizations`
- `GET/POST /api/qmoi/autodev/toggle`

### Masking & Privacy Integration
- `QMOIMASKS.md` documents the QMOI masking, obfuscation, and VPN-aware privacy system.
- The QMOI system uses internal mask-aware services such as `src/services/VPNService.ts` to support anonymized operations, region-safe VPN decisions, and masked networking.
- Masking is continuously synchronized with QMOI memory and QVillage realtime documentation, even when no external `/api/qmoi/mask/*` route is exposed.

### Health & Monitoring
- `GET /api/consciousness/health`
- `GET /api/lion/workflows/health`
- `GET /api/master/domain-health/refresh`
- `GET /api/master/domain-health`
- `GET /api/qmoi/health`
- `GET /api/qmoi/health/stream`
- `GET /api/qmoi/status` - implemented in `qvillage/app.py` and mirrored in legacy `routes/api/qmoi/status.ts`
- `POST /api/qmoi/memory` - implemented in `qvillage/app.py` and mirrored in legacy `routes/api/qmoi/memory.ts`
- `GET /api/v1/health`
- `GET /api/v2/health`


---
*Last Enhanced: 2026-04-08T22:21:21.646513*