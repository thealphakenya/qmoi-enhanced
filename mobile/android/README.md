Android CI & Signing
====================

This folder documents how to build Android artifacts and wire signing keys for CI.

Local build (debug):

```bash
cd mobile/android
./gradlew assembleDebug
```

Release build (requires signing):

1. Create a `keystore.properties` file with the following values (do NOT commit it):

```
storeFile=/path/to/keystore.jks
storePassword=your_store_password
keyAlias=your_key_alias
keyPassword=your_key_password
```

2. Reference the keystore in `app/build.gradle` using `keystore.properties`.

CI notes:
- In GitHub Actions, prefer adding keystore as a secret (base64-encoded) and write it to disk at runtime.
- Required secrets (suggested names): `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
- The `ci-verify-and-release.yml` will attempt `assembleRelease` if signing keys are present; otherwise it falls back to `assembleDebug` for testing.
