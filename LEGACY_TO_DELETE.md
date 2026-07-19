---
quantum-enabled: false
---

Legacy directories/files identified as candidates for removal after feature extraction and verification
=================================================================================

WARNING: Do NOT delete these files until features are extracted, tests pass, and E2E flows are validated.

Candidates (review + extract before deleting):

- qmoi-space/                → large legacy directory (many files). Extract needed features into `src/components/qmoi/` before deletion.
- pwa_apps/                  → duplicate static PWA shells; keep `public/pwa_apps/` if required, remove `pwa_apps/*` after migration.
- routes/qcity/              → legacy route layer; consolidate into `app/api/qcity/` or `src/app/api/qcity/`.
- qcity/                     → top-level legacy QCity directory (merge into `src/qcity/` then delete).
- src/app/api/auth/          → duplicate API routes; migrate into `app/api/auth/` and validate.
- src/components/auth/       → duplicate client auth components; prefer `app/components/auth/` or canonical `src/components/...`.
- pwa_apps/qmoi-ai/          → PWA duplicate for QMOI AI; prefer canonical `app/qmoi-ai/`.
- pwa_apps/qmoi-space/       → PWA duplicate for QMOI Space; prefer canonical `app/qmoi-space/`.
- qvillage/.venv             → Python virtualenv; remove and document runtime Python deps.
- public/pwa_apps/* (verify) → keep if used as fallback static shells, otherwise remove duplicates.

Verification checklist before deletion:
- [ ] All routes referenced by `app/` and `src/` have been migrated and point to canonical endpoints.
- [ ] `npm run type-check` on `app/` + `src/` passes with no new errors.
- [ ] E2E auth flow (universal portal → redirect → shell) passes manually or via tests.
- [ ] WebAuthn (biometric) registration and authentication verified in staging.
- [ ] Backups of deleted directories created (archive tarball) and referenced in release notes.

Process recommendation:
1. Create `MERGE_PLAN_<date>.md` and record exact files to move.
2. Add adapter re-exports in `app/lib/` to bridge imports during migration.
3. Run `npx tsc --project tsconfig.json --noEmit` scoped to `app/` and `src/` to validate.
4. Delete legacy directories in small batches, run tests and type-check after each batch.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:41.355303Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 52
- words: 363
- characters: 2771
- headings: 1
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
