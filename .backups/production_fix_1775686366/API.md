<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-08T22:06:15.890113
- note: Auto-updated by comprehensive documentation update
<!-- LION_VALIDATION_END -->

# QMOI API Documentation

**Generated**: 2026-04-08
**Last Updated**: 2026-04-08T22:06:15.890147
**Total Endpoints**: 43

## Overview

This document provides comprehensive documentation for all QMOI system APIs. All endpoints are auto-generated and verified.

## Quick Access

- **Total Endpoints**: 43
- **API Base URL**: `/api`
- **Authentication**: JWT tokens required for most endpoints
- **Rate Limiting**: Applied to all endpoints
- **Response Format**: JSON (application/json)

## Authentication

All API endpoints require authentication via JWT tokens (except public endpoints).

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password_hash": "sha256_hash"
}
```

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

### Health & Monitoring
- `GET /api/consciousness/health`
- `GET /api/lion/workflows/health`
- `GET /api/master/domain-health/refresh`
- `GET /api/master/domain-health`
- `GET /api/qmoi/health`
- `GET /api/qmoi/health/stream`
- `GET /api/v1/health`
- `GET /api/v2/health`

## Purpose

Describe the purpose of this document and its scope.


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

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.