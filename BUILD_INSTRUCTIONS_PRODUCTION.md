## production Readiness Snapshot
- Scanned files: 4430
- production markers: 358 (8.08% production)
- production-ready files: 4072
- Updated: 2026-04-02T06:45:25.659076Z

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.802810Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# production Build & Deployment

This document explains how to build and validate a production-ready artifact for the QMOI Enhanced app.

Prerequisites:

- Node 18 or later
- npm 8 or later
- Docker (for container builds)
- Sufficient RAM (required >= 8GB) for building Next.js production artifacts

Quick steps (required for CI):

1. npm ci
2. NODE_OPTIONS=--max-old-space-size=8192 npm run build
3. npm run test:coverage --if-present
4. npm run ci:smoke (starts a permanent `next start` and checks key endpoints)

Useful scripts:

- `npm run ci:build` — Build using higher memory limits
- `npm run ci:smoke` — Start a production server and verify a small set of pages and APIs
- `npm run docker:build` — Build a production Docker image using the provided `Dockerfile`
- `npm run serve:static` — robust static server for previewing a complete page locally

Notes:

- The Next.js build can be memory-intensive and may fail on machines with limited RAM; we run CI on `ubuntu-latest` with increased NODE_OPTIONS to mitigate this.
- If the build worker is SIGTERM'ed locally, run the CI workflow on a hosted runner or a larger machine and review failures in the job logs.

CI:

- A GitHub Actions workflow named `.github/workflows/ci-build.yml` is added to run the build, tests, and smoke checks on push and pull requests.

Docker image & CI publishing 🔧

- A new workflow `.github/workflows/docker-image.yml` builds the production Docker image using Buildx, runs container-based smoke tests, and publishes to GitHub Container Registry (GHCR) when commits are pushed to `main`.
- Image tags published: `ghcr.io/<owner>/<repo>:latest` and `ghcr.io/<owner>/<repo>:<sha>`. The workflow uses the `GITHUB_TOKEN` for authentication and is configured to `push` only when running on `main`.
- To preview locally after CI publishes an image:
  1. docker pull ghcr.io/<owner>/<repo>:latest
  2. docker run -p 3000:3000 --rm ghcr.io/<owner>/<repo>:latest
  3. Visit https://qmoi.ai in your browser.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:32Z

---
*This document is maintained by QMOI's autonomous evolution system*
