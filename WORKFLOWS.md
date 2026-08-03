# WORKFLOWS.md

This document records the repository's GitHub Actions workflow inventory and canonical workflow file state.

## Workflow inventory

The canonical branch for every workflow file in this repository is main. The autosync backup branch is autosync-backup-20250926-232440 and is retained only for legacy/backup compatibility and manual recovery runs.

| Workflow                                          | Purpose                                           | Canonical branch | Backup / legacy branch          |
| ------------------------------------------------- | ------------------------------------------------- | ---------------- | ------------------------------- |
| .github/workflows/all-links.yml                   | Regenerate ALLLINKS                               | main             | none                            |
| .github/workflows/alllinks-autoupdate.yml         | ALLLINKS autoupdate                               | main             | none                            |
| .github/workflows/android-build.yml               | Android CI (QMOI)                                 | main             | none                            |
| .github/workflows/apply-on-label.yml              | Apply ALLLINKS on label                           | main             | none                            |
| .github/workflows/auto-merge-automated-pr.yml     | Auto-merge automated proposals                    | main             | none                            |
| .github/workflows/auto_release_variations.yml     | Auto Release LION Variations                      | main             | none                            |
| .github/workflows/build-and-release.yml           | Build and release                                 | main             | autosync-backup-20250926-232440 |
| .github/workflows/build-android-replace.yml       | Build Android & SmartTV and replace release asset | main             | none                            |
| .github/workflows/build-missing-platforms.yml     | Build missing platforms                           | main             | none                            |
| .github/workflows/build.yml                       | Build QMOI AI                                     | main             | autosync-backup-20250926-232440 |
| .github/workflows/ci-build-upload.yml             | CI build & release                                | main             | none                            |
| .github/workflows/ci-build.yml                    | CI build trigger workflow                         | main             | none                            |
| .github/workflows/ci-cd.yml                       | CI/CD pipeline                                    | main             | none                            |
| .github/workflows/ci-debug.yml                    | CI debug and log capture                          | main             | none                            |
| .github/workflows/ci-monitor.yml                  | CI monitor                                        | main             | none                            |
| .github/workflows/ci.yml                          | Consolidated CI workflow                          | main             | none                            |
| .github/workflows/code-quality.yml                | Code quality checks                               | main             | none                            |
| .github/workflows/deploy.yml                      | Production deployment                             | main             | autosync-backup-20250926-232440 |
| .github/workflows/docker-build-push.yml           | Build and push Docker image (GHCR)                | main             | none                            |
| .github/workflows/docker-image.yml                | Docker build and smoke test                       | main             | none                            |
| .github/workflows/dry-run-tests.yml               | Dry-run test workflow                             | main             | none                            |
| .github/workflows/enhancer-report.yml             | Enhancement report workflow                       | main             | none                            |
| .github/workflows/full-start-smoke.yml            | Full start smoke test                             | main             | none                            |
| .github/workflows/github-actions-qmoi-build.yml   | QMOI multi-platform build & publish               | main             | none                            |
| .github/workflows/install-requirements.yml        | Install and verify Python dependencies            | main             | autosync-backup-20250926-232440 |
| .github/workflows/jest-ci.yml                     | Autotest and Jest CI                              | main             | none                            |
| .github/workflows/link-cache-maintenance.yml      | Link cache maintenance                            | main             | none                            |
| .github/workflows/link-check-schedule.yml         | Scheduled link and DNS check                      | main             | none                            |
| .github/workflows/link-check.yml                  | Consolidated link validation                      | main             | none                            |
| .github/workflows/link-validation.yml             | Link validation                                   | main             | none                            |
| .github/workflows/master-pipeline.yml             | Master orchestrator workflow                      | main             | none                            |
| .github/workflows/nightly.yml                     | Nightly automation                                | main             | none                            |
| .github/workflows/npm.yml                         | Node package CI                                   | main             | none                            |
| .github/workflows/ollama-autonomous-agent.yml     | Ollama autonomous agent                           | main             | none                            |
| .github/workflows/ollamatrigger.yml               | Ollama trigger workflow                           | main             | none                            |
| .github/workflows/payed-validation.yml            | Paid validation                                   | main             | none                            |
| .github/workflows/publish-q-alpha.yml             | Publish Q Alpha PWA                               | main             | none                            |
| .github/workflows/publish-releases-realtime.yml   | Real-time release publishing                      | main             | none                            |
| .github/workflows/q.yml                           | QMOI Enhanced CI/CD                               | main             | none                            |
| .github/workflows/qmoi-app-build.yml              | QMOI app build                                    | main             | none                            |
| .github/workflows/qmoi-autodev.yml                | QMOI autodev pipeline                             | main             | none                            |
| .github/workflows/qmoi-ci.yml                     | QMOI AI build & release                           | main             | none                            |
| .github/workflows/qmoi-sync-memory.yml            | QMOI memory sync                                  | main             | none                            |
| .github/workflows/qmoi-tests.yml                  | QMOI tests                                        | main             | none                            |
| .github/workflows/qvillage-sync.yml               | QVillage sync                                     | main             | none                            |
| .github/workflows/rebuild-deb-verify-release.yml  | Rebuild and verify release assets                 | main             | none                            |
| .github/workflows/release-compliance-check.yml    | Release compliance checks                         | main             | none                            |
| .github/workflows/release.yml                     | LION variations release                           | main             | none                            |
| .github/workflows/repo-sync-alpha-q.yml           | Repo sync Alpha Q                                 | main             | none                            |
| .github/workflows/run-startup.yml                 | Startup verification                              | main             | none                            |
| .github/workflows/scheduled-link-check.yml        | Scheduled link check                              | main             | none                            |
| .github/workflows/security-checks.yml             | Security checks (pre-merge)                       | main             | none                            |
| .github/workflows/security.yml                    | Security audit                                    | main             | none                            |
| .github/workflows/sync-memory.yml                 | Memory sync                                       | main             | autosync-backup-20250926-232440 |
| .github/workflows/sync-notify.yml                 | Sync notification                                 | main             | none                            |
| .github/workflows/sync-releases-from-manifest.yml | Sync releases from manifest                       | main             | none                            |
| .github/workflows/update-readme-cli.yml           | Update README CLI usage                           | main             | none                            |
| .github/workflows/validate-and-tag-md.yml         | Validate and tag Markdown                         | main             | none                            |
| .github/workflows/vercel-autofix.yml              | Vercel autofix workflow                           | main             | none                            |
| .github/workflows/verify-release-assets.yml       | Verify release assets                             | main             | none                            |
| .github/workflows/wallet-tests.yml                | Wallet unit tests                                 | main             | none                            |

## Notes

- Keep WORKFLOWS.md synchronized with .github/workflows and ALLAUTO.md.
- Merge or remove redundant workflow definitions before applying workflow fixes.
- Successful workflow update 1: all workflow YAML files were normalized to use standard GitHub Actions trigger syntax and re-validated successfully.

## Autonomous workflow integration

- This directory document is maintained by the Ollama autonomous agent and synchronized with the GitHub workflow triggers.
- It tracks WiFi/captive-portal automation, component gallery migration, universal styles, and self-healing run expectations.
- Keep this file aligned with API.md, ENDPOINTS.md, ROUTES.md, ALLPORTS.md, STYLES.md, UNIVERSALS.md, and WORKFLOWS.md.
- Ensure every run records resume state in resumefromhere.txt and preserves processed work between local and workflow executions.
