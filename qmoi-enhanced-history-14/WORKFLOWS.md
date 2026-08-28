# WORKFLOWS.md

This document records the repository's GitHub Actions workflow inventory and canonical workflow file state.

## Workflow inventory
- .github/workflows/all-links.yml — Regenerate ALLLINKS
- .github/workflows/alllinks-autoupdate.yml — ALLLINKS Autoupdate
- .github/workflows/android-build.yml — Android CI (QMOI)
- .github/workflows/apply-on-label.yml — Apply ALLLINKS on label
- .github/workflows/auto-merge-automated-pr.yml — Auto-merge automated proposals
- .github/workflows/auto_release_variations.yml — Auto Release LION Variations
- .github/workflows/build-and-release.yml — Build and Release
- .github/workflows/build-android-replace.yml — Build Android & SmartTV and Replace Release Asset
- .github/workflows/build-missing-platforms.yml — Build Missing Platforms
- .github/workflows/build.yml — Build QMOI AI
- .github/workflows/ci-build-upload.yml — CI Build & Release
- .github/workflows/ci-build.yml — CI Build & Smoke
- .github/workflows/ci-cd.yml — CI/CD Pipeline
- .github/workflows/ci-debug.yml — CI Debug (test logs)
- .github/workflows/ci-monitor.yml — CI Monitor
- .github/workflows/ci.yml — CI Build & Test
- .github/workflows/code-quality.yml — Code Quality
- .github/workflows/deploy.yml — Production Deployment
- .github/workflows/docker-build-push.yml — Build and Push Docker image (GHCR)
- .github/workflows/docker-image.yml — Docker Build & Container Smoke
- .github/workflows/dry-run-tests.yml — CI - Dry-run Tests
- .github/workflows/enhancer-report.yml — Enhancement Report
- .github/workflows/full-start-smoke.yml — Full Start Smoke Test
- .github/workflows/github-actions-qmoi-build.yml — QMOI Multi-Platform Build & Publish
- .github/workflows/install-requirements.yml — Install and verify Python dependencies
- .github/workflows/jest-ci.yml — CI - Autotest & Jest
- .github/workflows/link-cache-maintenance.yml — Link Cache Maintenance
- .github/workflows/link-check-schedule.yml — Link & DNS checker (daily)
- .github/workflows/link-check.yml — Link & DNS check
- .github/workflows/link-validation.yml — Link Validation (dry-run)
- .github/workflows/nightly.yml — Nightly
- .github/workflows/npm.yml — CI
- .github/workflows/ollama-autonomous-agent.yml — Ollama autonomous agent
- .github/workflows/ollamatrigger.yml — Ollama trigger workflow
- .github/workflows/payed-validation.yml — Payed Validation
- .github/workflows/publish-q-alpha.yml — Publish Q Alpha PWA
- .github/workflows/publish-releases-realtime.yml — 🚀 QMOI Real-time Multi-Platform Release Publisher
- .github/workflows/q.yml — QMOI Enhanced CI/CD
- .github/workflows/qmoi-app-build.yml — QMOI App Build
- .github/workflows/qmoi-autodev.yml — QMOI Autodev Pipeline
- .github/workflows/qmoi-ci.yml — QMOI AI Build & Release
- .github/workflows/qmoi-sync-memory.yml — qmoi-memory-sync
- .github/workflows/qmoi-tests.yml — QMOI Tests
- .github/workflows/qvillage-sync.yml — QVillage Sync - QMOI Memory ↔ HF Spaces
- .github/workflows/rebuild-deb-verify-release.yml — Rebuild and Replace corrupted .deb
- .github/workflows/release-compliance-check.yml — Release Compliance Check
- .github/workflows/release.yml — LION Variations Release
- .github/workflows/run-startup.yml — Run Startup & Verification (CI)
- .github/workflows/scheduled-link-check.yml — Scheduled Link Check
- .github/workflows/security-checks.yml — Security Checks (Pre-Merge)
- .github/workflows/security.yml — Security Audit
- .github/workflows/sync-memory.yml — QM OI Memory Sync
- .github/workflows/sync-notify.yml — Sync Notify
- .github/workflows/sync-releases-from-manifest.yml — Sync Releases From Manifest
- .github/workflows/update-readme-cli.yml — Update README CLI Usage
- .github/workflows/validate-and-tag-md.yml — Validate and Tag Markdown
- .github/workflows/vercel-autofix.yml — Vercel build + autofix
- .github/workflows/verify-release-assets.yml — Verify Release Assets
- .github/workflows/wallet-tests.yml — Wallet unit tests

## Notes
- Keep WORKFLOWS.md synchronized with .github/workflows and ALLAUTO.md.
- Merge or remove redundant workflow definitions before applying workflow fixes.
