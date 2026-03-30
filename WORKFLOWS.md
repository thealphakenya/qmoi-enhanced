# WORKFLOWS.md - GitHub Workflows & CI/CD Pipeline

**Last Updated**: 2026-03-29T01:23:12.141330
**Total Files**: 78
**Status**: ✅ production Ready

## 📋 Document Overview

This document catalogs all GitHub Actions workflows in `.github/workflows`, including CI/CD pipelines, deployment workflows, and automation jobs.

## 📊 Directory Statistics

| Metric | Count | Details |
|--------|-------|---------|
| Total Files | 78 | All files indexed |
| Subdirectories | 1 | Organized sections |
| File Types | 21 | Multiple formats |
| production Status | ✅ | Ready |

### File Type Distribution

- `.1760307818129`: 1 files
- `.1760307818135`: 1 files
- `.1760307818140`: 1 files
- `.1760307818143`: 1 files
- `.1760307818145`: 1 files
- `.1760307818149`: 1 files
- `.1760307818153`: 1 files
- `.1760307818155`: 1 files
- `.1760307818158`: 1 files
- `.1760308915739`: 1 files
- `.1760308915786`: 1 files
- `.1760308915792`: 1 files
- `.1760308915795`: 1 files
- `.1760308915798`: 1 files
- `.1760308915800`: 1 files
- `.1760308915804`: 1 files
- `.1760308915808`: 1 files
- `.1760308915811`: 1 files
- `.1760308915812`: 1 files
- `.1760308915816`: 1 files
- `.yml`: 58 files

## 📁 Complete File Inventory

### workflows/root (78 files)

- [`all-links.yml`](.github/workflows/all-links.yml) - `.yml`
- [`alllinks-autoupdate.yml`](.github/workflows/alllinks-autoupdate.yml) - `.yml`
- [`android-build.yml`](.github/workflows/android-build.yml) - `.yml`
- [`apply-on-label.yml`](.github/workflows/apply-on-label.yml) - `.yml`
- [`auto-merge-automated-pr.yml`](.github/workflows/auto-merge-automated-pr.yml) - `.yml`
- [`auto_release_variations.yml`](.github/workflows/auto_release_variations.yml) - `.yml`
- [`build-and-release.yml`](.github/workflows/build-and-release.yml) - `.yml`
- [`build-android-replace.yml`](.github/workflows/build-android-replace.yml) - `.yml`
- [`build-missing-platforms.yml`](.github/workflows/build-missing-platforms.yml) - `.yml`
- [`build.yml`](.github/workflows/build.yml) - `.yml`
- [`build.yml.backup.1760307818129`](.github/workflows/build.yml.backup.1760307818129) - `.1760307818129`
- [`build.yml.backup.1760308915739`](.github/workflows/build.yml.backup.1760308915739) - `.1760308915739`
- [`ci-build-upload.yml`](.github/workflows/ci-build-upload.yml) - `.yml`
- [`ci-build.yml`](.github/workflows/ci-build.yml) - `.yml`
- [`ci-cd.yml`](.github/workflows/ci-cd.yml) - `.yml`
- [`ci-debug.yml`](.github/workflows/ci-debug.yml) - `.yml`
- [`ci-monitor.yml`](.github/workflows/ci-monitor.yml) - `.yml`
- [`ci.yml`](.github/workflows/ci.yml) - `.yml`
- [`ci.yml.backup.1760308915786`](.github/workflows/ci.yml.backup.1760308915786) - `.1760308915786`
- [`code-quality.yml`](.github/workflows/code-quality.yml) - `.yml`
- [`deploy.yml`](.github/workflows/deploy.yml) - `.yml`
- [`docker-build-push.yml`](.github/workflows/docker-build-push.yml) - `.yml`
- [`docker-image.yml`](.github/workflows/docker-image.yml) - `.yml`
- [`dry-run-tests.yml`](.github/workflows/dry-run-tests.yml) - `.yml`
- [`enhancer-report.yml`](.github/workflows/enhancer-report.yml) - `.yml`
- [`full-start-smoke.yml`](.github/workflows/full-start-smoke.yml) - `.yml`
- [`github-actions-qmoi-build.yml`](.github/workflows/github-actions-qmoi-build.yml) - `.yml`
- [`github-actions-qmoi-build.yml.backup.1760307818135`](.github/workflows/github-actions-qmoi-build.yml.backup.1760307818135) - `.1760307818135`
- [`github-actions-qmoi-build.yml.backup.1760308915792`](.github/workflows/github-actions-qmoi-build.yml.backup.1760308915792) - `.1760308915792`
- [`install-requirements.yml`](.github/workflows/install-requirements.yml) - `.yml`
- [`jest-ci.yml`](.github/workflows/jest-ci.yml) - `.yml`
- [`link-cache-maintenance.yml`](.github/workflows/link-cache-maintenance.yml) - `.yml`
- [`link-check-schedule.yml`](.github/workflows/link-check-schedule.yml) - `.yml`
- [`link-check.yml`](.github/workflows/link-check.yml) - `.yml`
- [`link-validation.yml`](.github/workflows/link-validation.yml) - `.yml`
- [`nightly.yml`](.github/workflows/nightly.yml) - `.yml`
- [`nightly.yml.backup.1760307818140`](.github/workflows/nightly.yml.backup.1760307818140) - `.1760307818140`
- [`nightly.yml.backup.1760308915795`](.github/workflows/nightly.yml.backup.1760308915795) - `.1760308915795`
- [`npm.yml`](.github/workflows/npm.yml) - `.yml`
- [`npm.yml.backup.1760307818143`](.github/workflows/npm.yml.backup.1760307818143) - `.1760307818143`
- [`npm.yml.backup.1760308915798`](.github/workflows/npm.yml.backup.1760308915798) - `.1760308915798`
- [`payed-validation.yml`](.github/workflows/payed-validation.yml) - `.yml`
- [`publish-q-alpha.yml`](.github/workflows/publish-q-alpha.yml) - `.yml`
- [`publish-releases-realtime.yml`](.github/workflows/publish-releases-realtime.yml) - `.yml`
- [`python-automation-tests.yml`](.github/workflows/python-automation-tests.yml) - `.yml`
- [`q.yml`](.github/workflows/q.yml) - `.yml`
- [`q.yml.backup.1760307818145`](.github/workflows/q.yml.backup.1760307818145) - `.1760307818145`
- [`q.yml.backup.1760308915800`](.github/workflows/q.yml.backup.1760308915800) - `.1760308915800`
- [`qmoi-app-build.yml`](.github/workflows/qmoi-app-build.yml) - `.yml`
- [`qmoi-app-build.yml.backup.1760308915804`](.github/workflows/qmoi-app-build.yml.backup.1760308915804) - `.1760308915804`
- [`qmoi-autoprod.yml`](.github/workflows/qmoi-autoprod.yml) - `.yml`
- [`qmoi-ci.yml`](.github/workflows/qmoi-ci.yml) - `.yml`
- [`qmoi-ci.yml.backup.1760307818149`](.github/workflows/qmoi-ci.yml.backup.1760307818149) - `.1760307818149`
- [`qmoi-ci.yml.backup.1760308915808`](.github/workflows/qmoi-ci.yml.backup.1760308915808) - `.1760308915808`
- [`qmoi-sync-memory.yml`](.github/workflows/qmoi-sync-memory.yml) - `.yml`
- [`qmoi-tests.yml`](.github/workflows/qmoi-tests.yml) - `.yml`
- [`qvillage-sync.yml`](.github/workflows/qvillage-sync.yml) - `.yml`
- [`rebuild-deb-verify-release.yml`](.github/workflows/rebuild-deb-verify-release.yml) - `.yml`
- [`release-compliance-check.yml`](.github/workflows/release-compliance-check.yml) - `.yml`
- [`release.yml`](.github/workflows/release.yml) - `.yml`
- [`release.yml.backup.1760307818153`](.github/workflows/release.yml.backup.1760307818153) - `.1760307818153`
- [`release.yml.backup.1760308915811`](.github/workflows/release.yml.backup.1760308915811) - `.1760308915811`
- [`run-startup.yml`](.github/workflows/run-startup.yml) - `.yml`
- [`scheduled-link-check.yml`](.github/workflows/scheduled-link-check.yml) - `.yml`
- [`security-checks.yml`](.github/workflows/security-checks.yml) - `.yml`
- [`security.yml`](.github/workflows/security.yml) - `.yml`
- [`sync-memory.yml`](.github/workflows/sync-memory.yml) - `.yml`
- [`sync-notify.yml`](.github/workflows/sync-notify.yml) - `.yml`
- [`sync-notify.yml.backup.1760307818155`](.github/workflows/sync-notify.yml.backup.1760307818155) - `.1760307818155`
- [`sync-notify.yml.backup.1760308915812`](.github/workflows/sync-notify.yml.backup.1760308915812) - `.1760308915812`
- [`sync-releases-from-manifest.yml`](.github/workflows/sync-releases-from-manifest.yml) - `.yml`
- [`update-readme-cli.yml`](.github/workflows/update-readme-cli.yml) - `.yml`
- [`update-readme-cli.yml.backup.1760307818158`](.github/workflows/update-readme-cli.yml.backup.1760307818158) - `.1760307818158`
- [`update-readme-cli.yml.backup.1760308915816`](.github/workflows/update-readme-cli.yml.backup.1760308915816) - `.1760308915816`
- [`validate-and-tag-md.yml`](.github/workflows/validate-and-tag-md.yml) - `.yml`
- [`vercel-autofix.yml`](.github/workflows/vercel-autofix.yml) - `.yml`
- [`verify-release-assets.yml`](.github/workflows/verify-release-assets.yml) - `.yml`
- [`wallet-tests.yml`](.github/workflows/wallet-tests.yml) - `.yml`


## 🔄 Integration Points

This directory is integrated with:
- Main application architecture
- Build and deployment pipelines
- Testing and validation frameworks
- Documentation system

## 📝 Guidelines

- All files follow project standards
- Code is production-ready
- Documentation is comprehensive
- Testing is implemented where applicable

## 🛠️ Maintenance

This file is automatically generated and updated.

---
*Last generated: 2026-03-29T01:23:12.141806*
*Maintained by QMOI Enhancement System*