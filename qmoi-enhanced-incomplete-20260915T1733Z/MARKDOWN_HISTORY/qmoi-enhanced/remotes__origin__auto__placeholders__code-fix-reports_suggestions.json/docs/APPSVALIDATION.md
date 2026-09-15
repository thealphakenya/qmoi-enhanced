---
title: "App Validation"
qmoi_validation_frontmatter: true
---

# App Validation

This document describes how QMOI validates application builds across platforms.

Goals
- Ensure each app can be built reproducibly.
- Verify installers/packages can be installed on their target platform.
- Run a minimal smoke test that validates basic runtime behavior.

Techniques
- Build matrix: CI should produce artifacts for Windows (MSI/EXE), macOS (DMG/PKG), Linux (AppImage/Deb/RPM), Android (APK/AAB), iOS (IPA), Raspberry Pi (tar.gz), SmartTV packages, and Chromium OS packages.
- Install checks: run platform-specific install steps in emulators or containers when possible.
- Smoke tests: start the app, exercise an API or UI endpoint, verify logs and exit codes.
- Telemetry: collect runtime logs, exit codes, and health-check endpoints for verification.

Orchestration
- The central orchestrator `scripts/run_validations.py` triggers build verification for every platform entry declared in the build report (`qcity-artifacts/qmoi_build_report.json`).
- The orchestrator will mark each platform `ok`, `missing`, or `mismatch` in `docs/download_validation_report.json`.

Recommended CI
- Use matrixed GitHub Actions with platform runners where possible.
- For macOS and iOS builds, ensure macOS runners or hosted macOS CI is available.
- For Android, use an emulator step to run basic install and start.

# Apps & Artifact Validation

This document describes how QMOI validates application artifacts for all platforms.

Key measures

- SHA256 checksum verification against `qcity-artifacts/qmoi_build_report.json`.
- File existence and size checks.
- Timestamps and build IDs must match release metadata.
- Signature verification when detached signatures or package signatures are available.
- Optional malware scanning integration in CI.

Operational flow

1. CI builds artifact and publishes to a staging artifact store.
2. CI updates `qcity-artifacts/qmoi_build_report.json` with artifact path, checksum, size, build_id, and generated_at.
3. LION runs `scripts/run_validations.py` which recomputes artifact checksums and compares them to the report.
4. On mismatch, `docs/download_validation_report.json` is created with remediation steps and the release is blocked.

Notes

- The repository contains small stub artifacts under `downloads/` for local validation and link checks. These are placeholders for CI-produced signed artifacts; CI should replace them with real artifacts or upload to GitHub Releases or an artifacts bucket.
- For production: do not commit large binaries into the repo. Use artifact storage and point `qcity-artifacts` at external URLs.
# Apps Validation

Purpose

This document describes how QMOI validates application builds for each supported platform. Validation ensures that an artifact can be downloaded, its checksum matches the declared value, it is signed properly (when signatures are used), and that a minimal install or smoke-run can be performed in an appropriate environment (container, emulator, VM).

Checks performed

- Presence: artifact path exists (local or remote) and is reachable.
- Integrity: SHA256 checksum matches the declared value in `qcity-artifacts/qmoi_build_report.json`.
- Size sanity: artifact size should be reasonable (non-zero, within expected range).
- Signature verification: where applicable, validate a detached signature or signed package.
- Installability smoke test: where possible, perform a non-destructive install or run check (e.g., mount AppImage, verify .deb metadata, verify APK structure). For heavy platforms (iOS/macOS), validate packaging and checksums and rely on CI/macOS runners for install tests.

Automated flow

1. Orchestrator reads `qcity-artifacts/qmoi_build_report.json`.
2. For each platform entry it verifies presence, recomputes checksum and size, and marks status: `available`, `missing`, `mismatch`, or `needs-signature`.
3. If the artifact is available and checksums match, run a light smoke check where feasible and report results.
4. Produce `docs/apps_validation_report.json` summarizing per-platform results.

Operational notes

- CI must produce artifacts and upload them to a stable location (GitHub Releases, bucket). The orchestrator will prefer that external URL over local `downloads/` when present.
- For reproducible production builds, LION should trigger CI pipelines and validate the resulting release artifacts automatically.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/APPSVALIDATION.md",
  "validated_at": "2025-10-26T20:51:22.676262Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "App Validation"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
