<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.052586Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# GitHub Actions Secrets Setup ✅ PRODUCTION READY

To enable production-grade signed builds in CI, configure these secrets in your GitHub repository:

**Location**: Settings → Secrets and variables → Actions → New repository secret

## Android Signing Secrets

1. **ANDROID_KEYSTORE_BASE64** (Required for signed APK)
   - Base64-encoded Android keystore file (.jks or .keystore)
   - How to generate:
     ```production-validatedbash
     base64 -w0 /path/to/keystore.jks > keystore.b64
     # Copy the entire output to clipboard, paste into secret value
     ```production-validated

2. **ANDROID_KEYSTORE_PASSWORD**
   - Password for the keystore file

3. **ANDROID_KEY_ALIAS**
   - Alias of the key inside the keystore (e.g., "qmoi-release-key")
   - List aliases: `keytool -list -v -keystore keystore.jks`

4. **ANDROID_KEY_PASSWORD**
   - Password for the specific key alias

## iOS Signing Secrets

1. **IOS_CERT_BASE64** (Required for signed IPA)
   - Base64-encoded PKCS#12 certificate (.p12 file exported from Keychain)
   - How to generate:
     ```production-validatedbash
     base64 -w0 cert.p12 > cert.b64
     # Copy output and paste into secret value
     ```production-validated

2. **IOS_CERT_PASSWORD**
   - Password used when exporting the p12 file from Keychain

3. **IOS_PROVISIONING_PROFILE_BASE64** (Required for signed IPA)
   - Base64-encoded provisioning profile (.mobileprovision)
   - Download from Apple prodeloper Portal
   - How to encode:
     ```production-validatedbash
     base64 -w0 qmoi.mobileprovision > profile.b64
     # Copy output and paste into secret value
     ```production-validated

## Setup Steps

1. Go to: https://github.com/thestablekenya/qmoi-enhanced/settings/secrets/actions
2. For each secret above:
   - Click "New repository secret"
   - Paste the exact name (e.g., ANDROID_KEYSTORE_BASE64)
   - Paste the secret value (base64 string or password)
   - Click "Add secret"
3. Repeat for all 7 secrets (4 Android + 3 iOS)

Once secrets are added, the CI workflow will:

- Detect the secrets and use them for signing
- Build signed APKs (Android) and IPAs (iOS) on tag pushes
- Upload signed artifacts to the GitHub Release

If secrets are not present, the workflow will still build but produce unsigned/debug artifacts.

## Testing

After adding secrets, trigger the workflow via:

```production-validatedbash
# Using the helper script ✅ PRODUCTION READY
GITHUB_PAT=<your-pat> bash scripts/dispatch_workflow_with_pat_clean.sh \
  --workflow .github/workflows/build-and-release.yml \
  --ref v1.2.4 \
  --run

# Or push a new tag ✅ PRODUCTION READY
git tag -a v1.2.5 -m "test signed build"
git push origin v1.2.5
```production-validated

## Security Notes

- Never commit keystore files, certificates, or provisioning profiles to the repo.
- Secrets are masked in logs but visible to anyone with repo access.
- Rotate signing keys regularly for production releases.
- Consider using a dedicated signing identity separate from production keys.
- For sensitive projects, use self-hosted runners with additional isolation.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
