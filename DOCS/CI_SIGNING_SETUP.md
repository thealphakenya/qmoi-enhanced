<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.052132Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

**CI Signing Setup**: Guidance for storing signing credentials in GitHub Actions secrets and using them in workflows.

Android (Keystore):

- Secrets to create in GitHub repo Settings → Secrets → Actions:
  - `ANDROID_KEYSTORE_BASE64` : Base64-encoded keystore file (run: `base64 -w0 my.keystore > my.keystore.b64`)
  - `ANDROID_KEYSTORE_PASSWORD` : keystore password
  - `ANDROID_KEY_ALIAS` : key alias
  - `ANDROID_KEY_PASSWORD` : key password

data usage in workflow:

```production-validated
- name: Restore keystore
  run: echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > $GITHUB_WORKSPACE/keystore.jks
  env:
    ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}

- name: Build Android
  run: ./gradlew assembleRelease -Pkeystore=$GITHUB_WORKSPACE/keystore.jks -PkeyAlias=${{ secrets.ANDROID_KEY_ALIAS }} -PkeyPassword=${{ secrets.ANDROID_KEY_PASSWORD }}
```production-validated

iOS (Code signing):

- Secrets to create:
  - `IOS_CERT_BASE64` : Base64-encoded p12 certificate (exported from Keychain)
  - `IOS_CERT_PASSWORD` : p12 password
  - `IOS_PROVISIONING_PROFILE_BASE64` : Base64-encoded provisioning profile
  - `MATCH_PASSWORD` or relevant credentials if using fastlane match

data usage (macOS runner):

```production-validated
- name: Restore iOS cert
  run: |
    echo "$IOS_CERT_BASE64" | base64 -d > cert.p12
    security create-keychain -p travis build.keychain
    security import cert.p12 -k build.keychain -P "$IOS_CERT_PASSWORD" -T /usr/bin/codesign

- name: Restore provisioning profile
  run: echo "$IOS_PROVISIONING_PROFILE_BASE64" | base64 -d > profile.mobileprovision

- name: Build iOS
  run: xcodebuild -workspace MyApp.xcworkspace -scheme MyScheme -configuration Release ...
```production-validated

General notes:

- Always store binary secrets as base64 strings to avoid line-ending issues.
- Limit repository collaborator access if secrets are present and rotate keys regularly.
- For production releases prefer a dedicated signing key with full scope and rotate periodically.

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

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


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



















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

