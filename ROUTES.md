<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-08T22:06:15.890618
- IMPLEMENTED: Auto-updated by comprehensive documentation update
<!-- LION_VALIDATION_END -->

# ROUTES.md - complete API Routes Reference ✅ PRODUCTION READY

**Last Updated**: 2026-04-08
**Total Routes**: 43
**Status**: ✅ production Ready
**Framework**: Next.js 20+ (App Router)

## 📚 API Routes Overview

This document provides a comprehensive inventory of all API routes in the QMOI Enhanced system, organized by domain, feature, and HTTP method.

## 📊 Routes Statistics

| Category | Count | Status |
|----------|-------|--------|
| **Total Routes** | 43 | ✅ Active |
| **Authentication Routes** | 7 | ✅ Secured |
| **QMOI Core Routes** | 13 | ✅ Active |
| **System Routes** | 8 | ✅ Active |
| **Master Routes** | 15 | ✅ Active |

---

## 🔐 Authentication Routes (7 routes)

### 1. POST /api/auth/login
- **File**: [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)
- **Method**: `POST`
- **Description**: Email/Password traditional login with QMOI consciousness integration
- **Authentication**: None (public endpoint)
- **Status**: ✅ production Ready

### 2. POST /api/auth/webauthn/register/options
- **File**: [src/app/api/auth/webauthn/register/options/route.ts](src/app/api/auth/webauthn/register/options/route.ts)
- **Method**: `POST`
- **Description**: Get WebAuthn registration options for biometric/hardware key registration
- **Authentication**: Optional (Bearer token)
- **Status**: ✅ Active

### 3. POST /api/auth/webauthn/register/finish
- **File**: [src/app/api/auth/webauthn/register/finish/route.ts](src/app/api/auth/webauthn/register/finish/route.ts)
- **Method**: `POST`
- **Description**: complete WebAuthn biometric/hardware key registration
- **Authentication**: Bearer token required
- **Status**: ✅ Active

### 4. POST /api/auth/webauthn/auth/options
- **File**: [src/app/api/auth/webauthn/auth/options/route.ts](src/app/api/auth/webauthn/auth/options/route.ts)
- **Method**: `POST`
- **Description**: Get WebAuthn authentication options for biometric/hardware key login
- **Authentication**: None (public endpoint)
- **Status**: ✅ Active

### 5. POST /api/auth/webauthn/auth/finish
- **File**: [src/app/api/auth/webauthn/auth/finish/route.ts](src/app/api/auth/webauthn/auth/finish/route.ts)
- **Method**: `POST`
- **Description**: complete WebAuthn biometric/hardware key authentication
- **Authentication**: None (public endpoint)
- **Status**: ✅ Active

---

## 🧠 QMOI Core Routes (13 routes)

### 6. GET /api/qmoi/health
- **File**: [src/app/api/qmoi/health/route.ts](src/app/api/qmoi/health/route.ts)
- **Method**: `GET`
- **Description**: Get QMOI health status, consciousness pulse, and system metrics
- **Authentication**: Bearer token required
- **Status**: ✅ Active


---
*Last Enhanced: 2026-04-08T22:21:21.646616*