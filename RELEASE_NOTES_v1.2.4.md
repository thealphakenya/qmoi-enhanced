# Release v1.2.4

- Replaced 5 corrupted packages with valid packages (Android, iOS, SmartTV, Chromebook, QCity)
- Added CI workflow to build Android & PWAs (.github/workflows/build-and-release.yml)
- Secured file/payload/status APIs under `routes/api/qmoi` (token auth, logging, safe paths)
- Regenerated release manifest and ran verification scripts

Verification summary:

- Manifest assets: 16
- Verified OK: 9
- Verified Broken: 1

See `reports/final_release_verification.json` for details.
