# MASTER INSTRUCTIONS, REQUESTS & TESTS

This file is the authoritative, human-readable master instruction and testing guide for the QMOI repository. It summarizes feature responsibilities, testing steps, autodev expectations, memory/restore behavior, release automation, and acceptance criteria.

IMPORTANT: All automation in this repository defaults to dry-run. "Dry-run" means actions are recorded in audit logs under `.qmoi_validation/` and no destructive or external side-effects occur unless the environment explicitly enables production mode via `PRODUCTION_CONFIRMED=true` and `QMOI_ALLOW_NETWORK=true` (or equivalent build-time flags). Any step that writes to external systems or restores files will require explicit gating.

---

## 1) High-level goal

QMOI (the digital assistant and developer automation) must be accountable for everything in the repository and across builds (autodev). This means:

- QMOI keeps a versioned record of files, builds, and artifacts.
- QMOI can snapshot and restore files if accidentally deleted (dry-run default).
- QMOI exposes safe, auditable endpoints that perform operations only when explicitly gated.
- QMOI maintains memory (index) of repository events and can answer queries about file contents, versions, and recent changes.
- QMOI helps prepare, package, and (when gated) publish apps across platforms. Releases are dry-run by default.

## 2) Summary of every major feature & responsibility

- Autodev Manager (scripts/autodev_manager.py, api/autodev/*)
  - Snapshots files, records file-level metadata (hash, timestamp, author), and stores snapshots under `.qmoi_snapshots/`.
  - Appends every action to `.qmoi_validation/autodev-audit.log` (append-only JSON-lines).
  - Offers dry-run restoration suggestions; real restores require `PRODUCTION_CONFIRMED` and explicit confirmation.

- Memory Index
  - Small, authoritative index (JSON) storing file metadata and notable entities (last editors, change summary, tags).
  - Provides query APIs and can be extended to sync with cloud storage when gated.

- Adapter endpoints (api/adapters/*)
  - Mail, telephony, and other provider adapters default to dry-run and log intent to `.qmoi_validation/adapter-audit.log`.
  - Production usage requires `SENDGRID_API_KEY`, `TWILIO_*` etc. and `PRODUCTION_CONFIRMED=true`.

- Release automation (scaffold)
  - Dry-run release endpoints that simulate packaging and upload. Production uploads require provider tokens and gating.

- UI integrations
  - UI shows autodev and memory status, audit viewers, and restoration suggestions. Actions in UI call adapters via dry-run endpoints.

- Tests & CI
  - Unit tests for autodev manager and adapter mocks.
  - CI jobs to run lint, typecheck and tests before PR is reviewed.

## 3) File/feature mapping (where to look)

- Autodev manager: `scripts/autodev_manager.py` (added by conservative pass)
- Adapter endpoints: `api/adapters/` (mail.js, telephony.js created already)
- Audit logs: `.qmoi_validation/adapter-audit.log`, `.qmoi_validation/autodev-audit.log`
- Memory index: `data/qmoi_memory_index.json` (not yet created by conservative pass)
- Docs: `docs/AUTODEV_OVERVIEW.md`, `FEATURESREADME.md`, `docs/PLATFORM_AUTOMATION.md`

## 4) Master instructions (what QMOI should do automatically)

- Continuously scan for regressions or critical tokens (for example 'SIMULATED' in user-visible strings) and offer dry-run patches.
- Maintain snapshots of critical directories (by default: `components/`, `src/`, `app/`, `api/`, `scripts/`) on each PR or major change.
- Provide a restore endpoint that suggests file contents to restore (dry-run) and can perform restores when production gating is present.
- Audit everything: each proposed or executed action must be appended to `.qmoi_validation/*` logs with timestamp, actor, intent, and diff summary.
- Version builds and artifacts; keep a build manifest per release in `.qmoi_builds/` with checksums and platform metadata.

## 5) Tests & acceptance criteria (sample list)

- Unit tests:
  - Autodev snapshot creator creates a snapshot manifest and stores files in `.qmoi_snapshots/<timestamp>/`.
  - Autodev's restore function returns an exact content diff in dry-run mode.
  - Adapters log dry-run actions to `.qmoi_validation/adapter-audit.log`.

- Integration tests (dry-run):
  - Start a dry-run release for an example platform and verify expected package manifest appears in `.qmoi_validation/`.
  - Simulate a missing file; autodev suggests a restore with matching checksum.

- Manual acceptance:
  - A reviewer can toggle `PRODUCTION_CONFIRMED` and run a controlled restore of a single file. The audit log must include the reviewer identity.

## 6) How to enable production behaviors (short)

1. Set `PRODUCTION_CONFIRMED=true` (build-time or environment) and `QMOI_ALLOW_NETWORK=true`.
2. Provide required provider keys (for example `SENDGRID_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `BITGET_API_KEY`, `VERCEL_TOKEN`, `AWS_*`, `AZURE_*`, `GCP_*`).
3. Ensure reviewers perform a manual verification step documented in the PR before enabling.

## 7) Suggested quick commands (dry-run checks)

```bash
# snapshot (dry-run by default)
python3 scripts/autodev_manager.py snapshot --dirs components src api

# list snapshots
python3 scripts/autodev_manager.py list

# suggest restore (dry-run)
python3 scripts/autodev_manager.py suggest-restore --path src/components/q-city/QCityDevicePanel.tsx
```

## 8) Notes and follow-ups

- The conservative pass will continue scanning and applying safe textual changes, wiring dry-run adapters and adding UI indicators. Larger provider wiring and automatic restores will be gated and documented.
- Keep `.qmoi_validation/` as the canonical audit trail. Avoid editing large generated reports unless specifically requested.

---

This file is maintained by the conservative autodev pass. When you enable production modes, verify secrets and do a staged rollout.
