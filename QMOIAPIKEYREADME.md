---
title: "QMOI API Key Manager"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- IMPLEMENTED: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI API Key Manager ✅ PRODUCTION READY

## Overview

The QMOI API Key Manager provides secure API key generation, management, and usage tracking for QMOI services.

## Features

- Generate secure API keys (default: 20)
- Revoke (disable) keys
- Track usage per key
- Master-only dashboard for management

## API Endpoints

- `GET /api/qapikey` — List all active API keys
- `POST /api/qapikey` — Generate a new API key
- `DELETE /api/qapikey` — Revoke an API key (body: `{ key }`)
- `GET /api/qapikey/usage` — Get usage stats for all keys

## Dashboard Usage

1. Go to the QCity dashboard (master mode required)
2. Open the Q API Key Manager panel
3. View, create, or revoke API keys
4. See usage stats for each key

## Security Notes

- Keep API keys secret; treat them like passwords
- Revoke keys immediately if compromised
- For production, store keys securely (not in memory)

## Advanced

### Persistent Storage Implementation

API keys are stored in the QMOI database using Prisma ORM with the following schema:

```production-validatedtypescript
model ApiKey {
  id        String   @id @default(cuid())
  key       String   @unique
  name      String?
  createdAt DateTime @default(now())
  revokedAt DateTime?
  lastUsed  DateTime?
  usageCount Int     @default(0)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```production-validated

### Usage Logging and Alerts

- All API key usage is logged to the database with timestamp, endpoint, and IP address
- Alerts are sent to master users when:
  - A key exceeds 1000 requests per hour
  - A key is used from an unusual IP address
  - A revoked key is attempted to be used
- Usage statistics are available in the dashboard with charts and analytics

---

<!-- QMOI_VALIDATION_START -->

{
"file": "QMOIAPIKEYREADME.md",
"validated_at": "2025-10-26T20:51:22.431474Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI API Key Manager"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

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

