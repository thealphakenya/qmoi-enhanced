# Contributing & Developer Notes

Thanks for contributing to QMOI! This file contains quick tips for running the dev environment and tests, and troubleshooting MSW-related test issues.

## Quick dev & test commands

- Dev server: `npm run dev` (local: http://localhost:3000)
- Dev health check: `npm run dev:health`
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

Thank you — and welcome to the project! If you'd like me to add a short automation for generating a PR checklist or a PR template, I can add that next.