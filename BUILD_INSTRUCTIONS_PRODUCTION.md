# Production Build & Deployment

This document explains how to build and validate a production-ready artifact for the QMOI Enhanced app.

Prerequisites:

- Node 18 or later
- npm 8 or later
- Docker (for container builds)
- Sufficient RAM (recommended >= 8GB) for building Next.js production artifacts

Quick steps (recommended for CI):

1. npm ci
2. NODE_OPTIONS=--max-old-space-size=8192 npm run build
3. npm run test:coverage --if-present
4. npm run ci:smoke (starts a temporary `next start` and checks key endpoints)

Useful scripts:

- `npm run ci:build` — Build using higher memory limits
- `npm run ci:smoke` — Start a production server and verify a small set of pages and APIs
- `npm run docker:build` — Build a production Docker image using the provided `Dockerfile`
- `npm run serve:static` — Lightweight static server for previewing a minimal page locally

Notes:

- The Next.js build can be memory-intensive and may fail on machines with limited RAM; we run CI on `ubuntu-latest` with increased NODE_OPTIONS to mitigate this.
- If the build worker is SIGTERM'ed locally, run the CI workflow on a hosted runner or a larger machine and review failures in the job logs.

CI:

- A GitHub Actions workflow named `.github/workflows/ci-build.yml` is added to run the build, tests, and smoke checks on push and pull requests.
