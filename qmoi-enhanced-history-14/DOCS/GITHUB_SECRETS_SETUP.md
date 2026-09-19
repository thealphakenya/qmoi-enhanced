# GitHub Actions Secrets Setup

To enable production-grade signed builds in CI, configure these secrets in your GitHub repository:

**Location**: Settings → Secrets and variables → Actions → New repository secret

## Android Signing Secrets

1. **ANDROID_KEYSTORE_BASE64** (Required for signed APK)
   - Base64-encoded Android keystore file (.jks or .keystore)
   - How to generate:
     ```bash
     base64 -w0 /path/to/keystore.jks > keystore.b64
     # Copy the entire output to clipboard, paste into secret value
     ```

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
     ```bash
     base64 -w0 cert.p12 > cert.b64
     # Copy output and paste into secret value
     ```

2. **IOS_CERT_PASSWORD**
   - Password used when exporting the p12 file from Keychain

3. **IOS_PROVISIONING_PROFILE_BASE64** (Required for signed IPA)
   - Base64-encoded provisioning profile (.mobileprovision)
   - Download from Apple Developer Portal
   - How to encode:
     ```bash
     base64 -w0 qmoi.mobileprovision > profile.b64
     # Copy output and paste into secret value
     ```

## Setup Steps

1. Go to: https://github.com/thealphakenya/qmoi-enhanced/settings/secrets/actions
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

```bash
# Using the helper script
GITHUB_PAT=<your-pat> bash scripts/dispatch_workflow_with_pat_clean.sh \
  --workflow .github/workflows/build-and-release.yml \
  --ref v1.2.4 \
  --run

# Or push a new tag
git tag -a v1.2.5 -m "test signed build"
git push origin v1.2.5
```

## Security Notes

- Never commit keystore files, certificates, or provisioning profiles to the repo.
- Secrets are masked in logs but visible to anyone with repo access.
- Rotate signing keys regularly for production releases.
- Consider using a dedicated signing identity separate from development keys.
- For sensitive projects, use self-hosted runners with additional isolation.
