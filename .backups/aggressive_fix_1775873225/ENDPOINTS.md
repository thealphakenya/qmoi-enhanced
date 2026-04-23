<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-08T22:06:15.895774
- IMPLEMENTED: Auto-updated by comprehensive documentation update
<!-- LION_VALIDATION_END -->

# QMOI System Endpoints ✅ PRODUCTION_IMPLEMENTED

**Last Updated**: 2026-04-08 (AUTO-GENERATED)
**Total Endpoints**: 43
**Last Scan**: 2026-04-08T22:06:15.895807

## Overview

This document catalogs all available endpoints in the QMOI system.

## Endpoint Table

| # | Method | Endpoint | File | Status |
|---|--------|----------|------|--------|
| 1 | GET/POST | `/api/accountability` | ['api', 'accountability', '', 'route.ts'] | ✅ |
| 2 | GET/POST | `/api/admin/metrics` | ['api', 'admin', 'metrics', 'route.ts'] | ✅ |
| 3 | GET/POST | `/api/admin/tracing` | ['api', 'admin', 'tracing', 'route.ts'] | ✅ |

## Masking & Privacy Endpoints

- QMOI masking is implemented as an internal service (`src/services/VPNService.ts`) with secure VPN decision-making and mask-aware system operations.
- The `QMOIMASKS.md` document provides the canonical specification for masking, obfuscation, and anonymized networking.
- Masking behavior is surfaced through QVillage realtime status and live model card documentation rather than a public `/api/qmoi/mask` endpoint.
| 4 | GET/POST | `/api/alerts/webhook` | ['api', 'alerts', 'webhook', 'route.ts'] | ✅ |
| 5 | GET/POST | `/api/auth/check-master` | ['api', 'auth', 'check-master', 'route.ts'] | ✅ |
| 6 | GET/POST | `/api/auth/login` | ['api', 'auth', 'login', 'route.ts'] | ✅ |
| 7 | GET/POST | `/api/auth/oauth/[provider]` | ['api', 'auth', 'oauth', 'route.ts'] | ✅ |
| 8 | GET/POST | `/api/auth/webauthn/auth/finish` | ['api', 'auth', 'webauthn', 'route.ts'] | ✅ |
| 9 | GET/POST | `/api/auth/webauthn/auth/options` | ['api', 'auth', 'webauthn', 'route.ts'] | ✅ |
| 10 | GET/POST | `/api/auth/webauthn/register/finish` | ['api', 'auth', 'webauthn', 'route.ts'] | ✅ |
| 11 | GET/POST | `/api/auth/webauthn/register/options` | ['api', 'auth', 'webauthn', 'route.ts'] | ✅ |
| 12 | GET/POST | `/api/automation/trigger` | ['api', 'automation', 'trigger', 'route.ts'] | ✅ |
| 13 | GET/POST | `/api/avatars/[userId]` | ['api', 'avatars', '[userId]', 'route.ts'] | ✅ |
| 14 | GET/POST | `/api/consciousness/health` | ['api', 'consciousness', 'health', 'route.ts'] | ✅ |
| 15 | GET/POST | `/api/global` | ['api', 'global', '', 'route.ts'] | ✅ |
| 16 | GET/POST | `/api/lion/workflows/health` | ['api', 'lion', 'workflows', 'route.ts'] | ✅ |
| 17 | GET/POST | `/api/master/domain-health` | ['api', 'master', 'domain-health', 'route.ts'] | ✅ |
| 18 | GET/POST | `/api/master/domain-health/refresh` | ['api', 'master', 'domain-health', 'route.ts'] | ✅ |
| 19 | GET/POST | `/api/master/godaddy-status` | ['api', 'master', 'godaddy-status', 'route.ts'] | ✅ |
| 20 | GET/POST | `/api/preview/analyze` | ['api', 'preview', 'analyze', 'route.ts'] | ✅ |
| 21 | GET/POST | `/api/preview/execute-tool` | ['api', 'preview', 'execute-tool', 'route.ts'] | ✅ |
| 22 | GET/POST | `/api/qmoi/autodev/generate-feature` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 23 | GET/POST | `/api/qmoi/autodev/research` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 24 | GET/POST | `/api/qmoi/autodev/state` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 25 | GET/POST | `/api/qmoi/autodev/suggestions/features` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 26 | GET/POST | `/api/qmoi/autodev/suggestions/improvements` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 27 | GET/POST | `/api/qmoi/autodev/suggestions/optimizations` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 28 | GET/POST | `/api/qmoi/autodev/toggle` | ['api', 'qmoi', 'autodev', 'route.ts'] | ✅ |
| 29 | GET/POST | `/api/qmoi/evolution/compare-models` | ['api', 'qmoi', 'evolution', 'route.ts'] | ✅ |
| 30 | GET/POST | `/api/qmoi/evolution/replace-model` | ['api', 'qmoi', 'evolution', 'route.ts'] | ✅ |
| 31 | GET/POST | `/api/qmoi/evolution/track-evolution` | ['api', 'qmoi', 'evolution', 'route.ts'] | ✅ |
| 32 | GET/POST | `/api/qmoi/execute` | ['api', 'qmoi', 'execute', 'route.ts'] | ✅ |
| 33 | GET/POST | `/api/qmoi/health` | ['api', 'qmoi', 'health', 'route.ts'] | ✅ |
| 34 | GET/POST | `/api/qmoi/health/stream` | ['api', 'qmoi', 'health', 'route.ts'] | ✅ |
| 35 | GET/POST | `/api/qmoi/self-work/code-review` | ['api', 'qmoi', 'self-work', 'route.ts'] | ✅ |
| 36 | GET/POST | `/api/qmoi/self-work/RELEASE` | ['api', 'qmoi', 'self-work', 'route.ts'] | ✅ |
| 37 | GET/POST | `/api/qmoi/self-work/run-tests` | ['api', 'qmoi', 'self-work', 'route.ts'] | ✅ |
| 38 | GET/POST | `/api/qmoi/suggestions` | ['api', 'qmoi', 'suggestions', 'route.ts'] | ✅ |
| 39 | GET/POST | `/api/qvs` | ['api', 'qvs', '', 'route.ts'] | ✅ |
| 40 | GET/POST | `/api/realtime/stream` | ['api', 'realtime', 'stream', 'route.ts'] | ✅ |
| 41 | GET/POST | `/api/subscriptions` | ['api', 'subscriptions', '', 'route.ts'] | ✅ |
| 42 | GET/POST | `/api/v1/health` | ['api', 'v1', 'health', 'route.ts'] | ✅ |
| 43 | GET/POST | `/api/v2/health` | ['api', 'v2', 'health', 'route.ts'] | ✅ |
| 44 | GET/POST | `/api/qmoi/status` | ['qvillage', 'app.py'] | ✅ |
| 45 | GET/POST | `/api/qmoi/memory` | ['qvillage', 'app.py'] | ✅ |


---
*Last Enhanced: 2026-04-08T22:21:21.646716*
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