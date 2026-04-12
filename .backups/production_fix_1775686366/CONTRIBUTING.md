<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.770036Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Contributing & prodeloper Notes

Thanks for contributing to QMOI! This file contains quick tips for running the prod environment and tests, and troubleshooting MSW-related test issues.

## Quick prod & test commands

- prod server: `npm run prod` (local: https://qmoi.ai)
- prod health check: `npm run prod:health`
- Run tests: `npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`
- CI-style build: `npm run ci:build`

## MSW & testing guidance

- MSW is initialized at test time via `src/setupTests.ts` and exposes a readiness promise at `globalThis.__MSW_READY__`.
- Tests should await `__MSW_READY__` or install handlers deterministically per test to avoid races.
- If you encounter unhandled requests during tests, enable `SHOW_MSW_UNHANDLED=1` to surface the origin.
- Use `TEST_VERBOSE=1` for additional handler/request debug output when diagnosing request shape mismatches (path-only vs absolute URL), or to inspect whether handlers are being selected properly.

## Troubleshooting

- `UNHANDLED REQUEST: GET http://localhost/api/...` usually means handlers are registered only as path-only (`/api/...`) while the test runtime produced an absolute URL; add both path and absolute variants when necessary.
- If you see `response.headers.get is not a function`, ensure handlers return a real `Response` when not using `ctx` helpers, or use `res(ctx.status(...), ctx.json(...))` when `ctx` is available.

## Making PRs

- Open a branch, push, and create a PR targeting the default branch (`autosync-backup-20250926-232440`) or `upgrade/next-15` for this migration work.
- The `CI Build and Tests` workflow (`.github/workflows/ci.yml`) will run the build and test suite on push/PR.

### PR checklist

- Ensure tests pass locally (`npx jest --config=jest.config.cjs -i --runInBand --colors --verbose`).
- Ensure the CI build passes (`npm run ci:build`) before merging.
- The CI workflow now generates a coverage report and uploads it as an artifact; check the workflow run for `coverage-report` artifacts.
- Use the PR standard to include a summary and verify the checklist is completed.

Thank you — and welcome to the project! If you'd like me to add a short automation for generating a PR checklist or a PR standard, I can add that next.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


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

