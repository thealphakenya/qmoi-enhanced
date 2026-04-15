# WEBHOOKS.md - Webhook Integration Guide

**Auto-generated on:** 2026-04-15 19:30:36 UTC

This document lists all webhook-related API endpoints in the QMOI system.

## Summary

- **Total webhook endpoints:** 5

## Webhook Endpoints

### /api/alerts/webhook
- **Methods:** DELETE, GET, PATCH, POST, PUT
- **File:** `src/app/api/alerts/webhook/route.ts`
- **Description:** jsonResponse function

### /api/webhooks/godaddy-domain
- **Methods:** DELETE, GET, PATCH, POST, PUT
- **File:** `app/api/webhooks/godaddy-domain/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: GoDaddy domain management webhook

### /api/webhooks/godaddy-health
- **Methods:** DELETE, GET, PATCH, POST, PUT
- **File:** `app/api/webhooks/godaddy-health/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: GoDaddy health webhook endpoint

### /api/webhooks/payments
- **Methods:** DELETE, GET, PATCH, POST, PUT
- **File:** `app/api/webhooks/payments/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system

### /api/webhooks/qvillage
- **Methods:** GET, PUT
- **File:** `app/api/webhooks/qvillage/route.ts`
- **Description:** QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system




## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-15 19:30:42 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`


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

