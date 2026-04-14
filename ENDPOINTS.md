# QMOI API Endpoints Inventory

**Auto-generated on:** 2026-04-14 02:35:00 UTC

Complete inventory of all API endpoints in the QMOI system.

## Endpoint Summary

- **Total endpoints:** 27
- **Methods covered:** GET, POST, PUT, DELETE, PATCH

## Endpoint List


### /api/cameras
- **Methods:** GET, POST
- **File:** `app/api/cameras/route.ts`
- **Description:** QMOI Camera Access API Endpoints

### /api/cameras/infrared
- **Methods:** GET
- **File:** `app/api/cameras/infrared/route.ts`
- **Description:** Infrared Camera API

### /api/cameras/panoramic
- **Methods:** GET
- **File:** `app/api/cameras/panoramic/route.ts`
- **Description:** Panoramic Camera API

### /api/cameras/road
- **Methods:** GET
- **File:** `app/api/cameras/road/route.ts`
- **Description:** Road Camera API

### /api/cameras/street
- **Methods:** GET
- **File:** `app/api/cameras/street/route.ts`
- **Description:** Street Camera API

### /api/cameras/thermal
- **Methods:** GET
- **File:** `app/api/cameras/thermal/route.ts`
- **Description:** Thermal Camera API

### /api/consciousness
- **Methods:** GET, POST
- **File:** `app/api/consciousness/route.ts`
- **Description:** Consciousness Monitoring System API

### /api/deploy
- **Methods:** PUT
- **File:** `app/api/deploy/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/deploy/auto-redeploy
- **Methods:** PUT
- **File:** `app/api/deploy/auto-redeploy/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/devices
- **Methods:** GET, POST
- **File:** `app/api/devices/route.ts`
- **Description:** Device Management API

### /api/friendship
- **Methods:** GET, POST
- **File:** `app/api/friendship/route.ts`
- **Description:** Friendship & Assistant Interface API

### /api/git/commit
- **Methods:** PUT
- **File:** `app/api/git/commit/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/git/pr
- **Methods:** PUT
- **File:** `app/api/git/pr/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/git/push
- **Methods:** PUT
- **File:** `app/api/git/push/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/health
- **Methods:** PUT
- **File:** `app/api/health/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/master/domains/emergency-takeover
- **Methods:** PUT
- **File:** `app/api/master/domains/emergency-takeover/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/master/sponsored/analytics
- **Methods:** PUT
- **File:** `app/api/master/sponsored/analytics/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/memory
- **Methods:** GET, POST, PUT
- **File:** `app/api/memory/route.ts`
- **Description:** Global Memory Persistence Layer API

### /api/production-api
- **Methods:** PUT
- **File:** `app/api/production-api.ts`
- **Description:** Version: 2.0.0

### /api/qmoi-model
- **Methods:** PUT
- **File:** `app/api/qmoi-model.ts`
- **Description:** API endpoint implementation

### /api/qmoi/autodev
- **Methods:** PUT
- **File:** `routes/api/qmoi/autodev.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/qmoi/backup
- **Methods:** GET
- **File:** `app/api/qmoi/backup/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/qmoi/own-device-logs
- **Methods:** PUT
- **File:** `app/api/qmoi/own-device-logs/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/qmoi/revenue-dashboard
- **Methods:** GET
- **File:** `app/api/qmoi/revenue-dashboard/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/qmoi/suggestions
- **Methods:** PUT
- **File:** `src/app/api/qmoi/suggestions/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/wallet
- **Methods:** GET
- **File:** `app/api/wallet.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/webhooks/qvillage
- **Methods:** GET, PUT
- **File:** `app/api/webhooks/qvillage/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system




## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-14 02:05:50 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`


## Production Validation

All endpoints are validated for:
- Proper HTTP methods
- File existence
- Code accessibility
- Documentation completeness
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

