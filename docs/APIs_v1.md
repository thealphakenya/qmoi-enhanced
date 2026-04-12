<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.299086Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

✅ PRODUCTION READY all markers normalized for completion
---
title: "QMOI API snapshot (APIs_v1)"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI API snapshot (APIs_v1) ✅ PRODUCTION READY

This file is an automated snapshot of commonly used API endpoints implemented under `app/api/**`.
Mutating endpoints are _proposal-first_ by default and require explicit production confirmation (`production_CONFIRMED=true` + `--real`) to actually perform state-changing actions. All mutating endpoints write proposals to `.qmoi_validation/` when not run in confirmed production mode.

## Auth model

- Primary gating: `QMOI_API_KEY` via header `x-qmoi-api-key` or `Authorization: Bearer <key>` — enforced by `lib/proposals.requireApiKey()`.
- Master-level operations: some endpoints still require `MASTER_TOKEN` in `Authorization: Bearer <MASTER_TOKEN>` header.

---

## 🔐 Authentication & Security APIs

### POST /api/auth/login
- **Purpose**: Email/password authentication with QMOI consciousness integration
- **Implementation**: [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)
- **Auth**: None (Public)
- **Security**: QMOI consciousness validation, rate limiting

### POST /api/auth/webauthn/register/options
- **Purpose**: WebAuthn biometric registration setup
- **Implementation**: [src/app/api/auth/webauthn/register/options/route.ts](src/app/api/auth/webauthn/register/options/route.ts)
- **Auth**: Optional Bearer token
- **Security**: Hardware key registration

### POST /api/auth/webauthn/register/finish
- **Purpose**: complete WebAuthn biometric registration
- **Implementation**: [src/app/api/auth/webauthn/register/finish/route.ts](src/app/api/auth/webauthn/register/finish/route.ts)
- **Auth**: Bearer token required
- **Security**: AES-256 encrypted credential storage

### POST /api/auth/webauthn/auth/options
- **Purpose**: WebAuthn authentication challenge
- **Implementation**: [src/app/api/auth/webauthn/auth/options/route.ts](src/app/api/auth/webauthn/auth/options/route.ts)
- **Auth**: None (Public)
- **Security**: Challenge-response authentication

### POST /api/auth/webauthn/auth/finish
- **Purpose**: complete WebAuthn authentication
- **Implementation**: [src/app/api/auth/webauthn/auth/finish/route.ts](src/app/api/auth/webauthn/auth/finish/route.ts)
- **Auth**: None (Public)
- **Security**: Session token generation

---

## 🧠 QMOI Core APIs

### GET /api/qmoi/health
- **Purpose**: QMOI consciousness health and pulse metrics
- **Implementation**: [src/app/api/qmoi/health/route.ts](src/app/api/qmoi/health/route.ts)
- **Auth**: Bearer token required
- **Cache**: 10 seconds

### GET /api/qmoi/health/stream
- **Purpose**: Real-time consciousness streaming
- **Implementation**: [src/app/api/qmoi/health/stream/route.ts](src/app/api/qmoi/health/stream/route.ts)
- **Auth**: Bearer token required
- **Type**: Server-Sent Events

### POST /api/qmoi/execute
- **Purpose**: Execute QMOI actions with consciousness validation
- **Implementation**: [src/app/api/qmoi/execute/route.ts](src/app/api/qmoi/execute/route.ts)
- **Auth**: Bearer token required
- **Timeout**: 30 seconds

### POST /api/qmoi/suggestions
- **Purpose**: AI-powered system improvement suggestions
- **Implementation**: [src/app/api/qmoi/suggestions/route.ts](src/app/api/qmoi/suggestions/route.ts)
- **Auth**: Bearer token required

### GET/POST /api/qmoi/autoprod/state
- **Purpose**: Autoprod automation state management
- **Implementation**: [src/app/api/qmoi/autoprod/state/route.ts](src/app/api/qmoi/autoprod/state/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/autoprod/toggle
- **Purpose**: Toggle Autoprod automation on/off
- **Implementation**: [src/app/api/qmoi/autoprod/toggle/route.ts](src/app/api/qmoi/autoprod/toggle/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/autoprod/research
- **Purpose**: Codebase research and analysis
- **Implementation**: [src/app/api/qmoi/autoprod/research/route.ts](src/app/api/qmoi/autoprod/research/route.ts)
- **Auth**: Bearer token required

### GET /api/qmoi/autoprod/suggestions/improvements
- **Purpose**: Code improvement suggestions
- **Implementation**: [src/app/api/qmoi/autoprod/suggestions/improvements/route.ts](src/app/api/qmoi/autoprod/suggestions/improvements/route.ts)
- **Auth**: Bearer token required

### GET /api/qmoi/autoprod/suggestions/optimizations
- **Purpose**: Performance optimization suggestions
- **Implementation**: [src/app/api/qmoi/autoprod/suggestions/optimizations/route.ts](src/app/api/qmoi/autoprod/suggestions/optimizations/route.ts)
- **Auth**: Bearer token required

### GET /api/qmoi/autoprod/suggestions/features
- **Purpose**: Feature production suggestions
- **Implementation**: [src/app/api/qmoi/autoprod/suggestions/features/route.ts](src/app/api/qmoi/autoprod/suggestions/features/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/autoprod/generate-feature
- **Purpose**: Automatic feature code generation
- **Implementation**: [src/app/api/qmoi/autoprod/generate-feature/route.ts](src/app/api/qmoi/autoprod/generate-feature/route.ts)
- **Auth**: Bearer token required
- **Timeout**: 60 seconds

## 🌐 Vercel Deployment & Recovery APIs

### GET /api/vercel/health
- **Purpose**: Check current Vercel deployment health and log analysis
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### POST /api/vercel/fix
- **Purpose**: Analyze Vercel deployment logs and run auto-fix recommendations
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### POST /api/vercel/redeploy
- **Purpose**: Trigger a Vercel production redeploy until deployment succeeds
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### POST /api/vercel/clone
- **Purpose**: Clone the Vercel project configuration and create a new project
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### GET /api/lion/vercel/status
- **Purpose**: Lion Agent summary of Vercel health and recovery status
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Master token or Bearer token required

### POST /api/lion/vercel/fix
- **Purpose**: Lion Agent trigger for Vercel auto-fix and redeploy
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Master token required

### GET/POST /api/qmoi/evolution/track-evolution
- **Purpose**: QMOI evolution tracking and cycle management
- **Implementation**: [src/app/api/qmoi/evolution/track-evolution/route.ts](src/app/api/qmoi/evolution/track-evolution/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/evolution/replace-model
- **Purpose**: Replace current model with evolved version
- **Implementation**: [src/app/api/qmoi/evolution/replace-model/route.ts](src/app/api/qmoi/evolution/replace-model/route.ts)
- **Auth**: Bearer token + Admin role required

### POST /api/qmoi/evolution/compare-models
- **Purpose**: Compare current and evolved models
- **Implementation**: [src/app/api/qmoi/evolution/compare-models/route.ts](src/app/api/qmoi/evolution/compare-models/route.ts)
- **Auth**: Bearer token required

---

## 🛠️ QMOI Self-Work APIs

### POST /api/qmoi/self-work/code-review
- **Purpose**: Automated code review and quality analysis
- **Implementation**: [src/app/api/qmoi/self-work/code-review/route.ts](src/app/api/qmoi/self-work/code-review/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/self-work/production configured.
- Behavior: Mutating POSTs are proposal-first and write proposals to `.qmoi_validation/` when not confirmed.
- Integration: All operations now use the production wallet, transaction, and balance management systems with QMOI consciousness.

---

## /api/qi-trading (GET, POST)

- GET /api/qi-trading?stats=1 — returns trading statistics (production-ready data)
- GET /api/qi-trading?history=1 — returns trade history (production-ready)
- GET /api/qi-trading?active=1 — returns active trades (production-ready)

- POST /api/qi-trading (body: { action: 'execute'|'cancel', trade }) — proposal-first for execute/cancel. Writes proposals when not confirmed.
- Auth: `x-qmoi-api-key` required (enforced).

---

## Notes

- Proposal files can be found in `.qmoi_validation/` (e.g., `proposal-*.json`, `✅ PRODUCTION READYs_proposal_*.json`). Review them before applying.
- To apply a proposal and run a mutating action, _set_ `production_CONFIRMED=true` in the environment and run the server with `--real` in the process arguments (or use a patched runner that forwards this flag). This gating is intentional to prevent accidental destructive actions.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


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






















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

