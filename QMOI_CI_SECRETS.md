<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.664120Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
# QMOI CI Secrets and Keystore Setup

This document explains which GitHub Actions secrets are required for the Android CI workflow and how to add them in your repository settings.

Required secrets (Repository -> Settings -> Secrets -> Actions):

- `KEYSTORE_BASE64` : Base64-encoded keystore file (JKS). Encode locally with:

```bash
base64 -w0 my-release-keystore.jks > keystore.b64
# then copy the content and paste into GitHub secret KEYSTORE_BASE64
```

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
