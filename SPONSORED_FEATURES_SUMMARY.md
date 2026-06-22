---
quantum-enabled: false
---

# Sponsored Features Summary

This document collects the sponsored feature documentation, routes, UI components, and access controls currently present in the repository.

## Core sponsored docs

- `SPONSORED.md`
  - Lists users treated as sponsored (master, sister)
  - Describes control server endpoints `/sponsored/add` and `/sponsored/list`
  - Explains master-level exemptions and sponsored access management

- `SPONSORED_USERS.md`
  - Primary sponsored user management guide
  - Documents sponsored user benefits, rate limiting exemptions, and advanced analytics
  - Includes master-only sponsored user APIs and UI flow examples
  - Lists endpoints like `/api/master/sponsored/add`, `/api/master/sponsored/list`, `/api/master/sponsored/remove/:userId`, `/api/master/sponsored/programs`, and `/api/master/sponsored/analytics`
  - Describes sponsored user dashboard and feature table

- `NOTSPONSORED.md`
  - Inverse documentation for regular non-sponsored users
  - Defines standard access, rate limits, and feature differences from sponsored users

- `ROLES_AND_PERMISSIONS.md`
  - Defines the `sponsored` role in the RBAC system
  - Includes a role matrix and API endpoint access control table
  - Lists sponsored-specific routes and permissions

- `POLITICALQMOI.md`
  - Documents political project features restricted to `master`, `sister`, and sponsored users
  - Includes access control, premium/sponsored capabilities, and sponsor list management
  - Mentions political-sponsor endpoints such as `POST /api/political/access/sponsor`

## Sponsored route documentation

- `VERCEL_QMOI_AUTOFEATURES_MASTER.md`
  - Mentions `GET /api/admin/sponsored/list` and `POST /api/admin/sponsored/create`

- `ROUTES_COMPREHENSIVE.md`
  - Includes `/api/master/sponsored/analytics`

- `API_COMPREHENSIVE.md`
  - Documents master sponsored analytics endpoint and file mapping

- `QMOISERVERS.md`
  - Lists `/sponsored/*` under QMOI server key endpoints

- `QCITYUI.md` and `COMPONENTS.md`
  - Reference `SponsoredUsersManager` as part of the shared UI component set

## Actual sponsored implementation files

- `app/components/SponsoredUsersManager.tsx`
  - UI component stub for sponsored account management and privileges

- `app/api/master/sponsored/add/route.ts`
- `app/api/master/sponsored/list/route.ts`
- `app/api/master/sponsored/remove/[userId]/route.ts`
- `app/api/master/sponsored/analytics/route.ts`
- `app/api/master/sponsored/sync/route.ts`

These routes exist as stubs and are documented in the repository.

## Sponsor-related role and feature notes

- The `sponsored` role is defined as a low-level role with premium support and limited feature access.
- Sponsored users are explicitly granted higher priority, rate limit exemptions, and master-level access in sponsored programs.
- Political project access is intentionally restricted to `master`, `sister`, and sponsored users.
- The repository includes both sponsored and non-sponsored user guidance to distinguish feature behavior.

## Recommended next sync points

- Verify `SPONSORED_USERS.md` endpoint list against actual implemented route files.
- Ensure `ROLES_AND_PERMISSIONS.md` remains aligned with `app/api/master/sponsored/*` route availability.
- If new sponsor-related routes are implemented, update `SPONSORED_FEATURES_SUMMARY.md` and `ALLMDFILESREFS.md`.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:32.624854Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 96
- words: 448
- characters: 3848
- headings: 7
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
