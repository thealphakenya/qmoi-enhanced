# v1.2.5 Release Publish Report

Status: PUBLISHED ✅

Release: https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.5
Release ID: 262642597
Published at: 2025-11-15T07:52:09Z

Uploaded assets (10):
- SHA256SUMS.txt
- admin.zip
- app-release.apk
- deals.zip
- q-alpha.zip
- qmoi-ai.zip
- qmoi-release.exe
- qmoi-release.ipa
- qmoi-space.zip
- qmoi.zip

Verification:
- Downloaded `SHA256SUMS.txt` from the release and matched it against the local `v1.2.5_release/SHA256SUMS.txt` (no differences found).

Local artifact directory: `/workspaces/qmoi-enhanced/v1.2.5_release/`

Next recommended actions:
1. (Optional) Add Android keystore secrets to GitHub Secrets for fully automated signed builds in CI:
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
2. (Optional) Add iOS signing credentials to enable automated iOS builds in CI (requires macOS runners).
3. Manually test-install `app-release.apk` and `qmoi-release.ipa` on devices/emulators.
4. Test PWAs by serving one of the created zips locally and checking install/offline behavior.

Audit notes:
- All uploaded artifacts have `state: uploaded` and `digest` SHA-256 values in the release metadata.
- Android APK content type: `application/vnd.android.package-archive`.

Done by automation: uploaded artifacts, created release, verified checksums.

Report generated: `/workspaces/qmoi-enhanced/RELEASE_v1.2.5_PUBLISH_REPORT.md`
