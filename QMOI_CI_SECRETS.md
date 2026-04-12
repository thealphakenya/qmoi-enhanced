<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.664120Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI CI Secrets and Keystore Setup ✅ PRODUCTION READY

This document explains which GitHub Actions secrets are required for the Android CI workflow and how to add them in your repository settings.

Required secrets (Repository -> Settings -> Secrets -> Actions):

- `KEYSTORE_BASE64` : Base64-encoded keystore file (JKS). Encode locally with:

```production-validatedbash
base64 -w0 my-release-keystore.jks > keystore.b64
# then copy the content and paste into GitHub secret KEYSTORE_BASE64 ✅ PRODUCTION READY
```production-validated

- `KEYSTORE_PASSWORD` : Keystore password (string)
- `KEYSTORE_ALIAS` : Key alias within the keystore (string)
- `KEY_PASSWORD` : (optional) key password if different from keystore password

Optional secrets:

- `FIREBASE_TOKEN` : for distribution to Firebase App Distribution
- `PLAY_STORE_JSON` : Service account JSON for Google Play uploads (store in Secrets and mount as file in workflow)

How the workflow uses the secrets:

- `KEYSTORE_BASE64` is decoded in the workflow into `mobile/android/app/keystore.jks`
- `keystore.properties` is created dynamically in the repo for Gradle signing using the provided passwords and alias
- Do NOT commit the keystore or passwords to the repo; always use secrets

Security notes:

- Rotate keystore passwords and service account credentials regularly
- Limit repository admin access to trusted users
- Use organization-level secrets for multi-repo workflows if needed

_Last updated: 2025-11-24_

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:26Z

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

