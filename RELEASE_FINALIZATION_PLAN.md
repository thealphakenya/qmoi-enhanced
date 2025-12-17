# Release v1.2.4 Finalization Plan

## Completed Tasks ✅

### 1. Audit & Remediation

- Identified 5 corrupted placeholder assets (repeating garbage byte pattern)
- Created valid stub replacements for all 5 corrupted platforms:
  - Android APK (Qmoi_downloaded_apps/android/latest/qmoi_ai.apk)
  - iOS IPA (Qmoi_downloaded_apps/ios/latest/qmoi_ai.ipa)
  - Smart TV APK (Qmoi_downloaded_apps/smarttv/latest/qmoi_ai_smarttv.apk)
  - Chromebook ZIP (Qmoi_downloaded_apps/chromebook/latest/qmoi_ai_chromebook.zip)
  - QCity ZIP (Qmoi_downloaded_apps/qcity/latest/qcity_package.zip)

### 2. Release Publication

- Created GitHub Release v1.2.4 via REST API
- **Successfully uploaded all 5 replacement assets to the release** (HTTP 201)
  - Download URLs: https://github.com/thealphakenya/qmoi-enhanced/releases/download/v1.2.4/{filename}

### 3. CI Workflow Enhancements

- Updated `.github/workflows/build-and-release.yml` with:
  - **Android signing support**: Keystore restoration, gradlew signing parameters
  - **iOS signing support**: Certificate import, provisioning profile setup
  - Fallback to debug/unsigned builds if secrets are not configured
  - Automatic manifest regeneration on builds
  - Asset upload to GitHub Release on tag pushes

### 4. Documentation

- Added `DOCS/GITHUB_WORKFLOW_DISPATCH.md` - How to dispatch workflows with PAT
- Added `DOCS/CI_SIGNING_SETUP.md` - Example signing configurations
- Added `DOCS/GITHUB_SECRETS_SETUP.md` - Step-by-step secrets configuration guide
- Added `scripts/dispatch_workflow_with_pat_clean.sh` - Safe helper to dispatch workflows

### 5. Code Hardening

- Updated `routes/api/qmoi/file.ts` with token auth, safe-path checks, audit logging
- Updated `routes/api/qmoi/payload.ts` with job queueing and admin token support
- Updated `routes/api/qmoi/status.ts` to read dynamic status from manifest and verification reports

---

## Next Steps 📋

### Step 1: Configure GitHub Actions Secrets (Optional, for Signed Builds)

If you want to produce **production-signed APKs and IPAs**, follow `DOCS/GITHUB_SECRETS_SETUP.md`:

**Required secrets** (7 total):

- `ANDROID_KEYSTORE_BASE64` - Base64-encoded keystore file
- `ANDROID_KEYSTORE_PASSWORD` - Keystore password
- `ANDROID_KEY_ALIAS` - Key alias inside keystore
- `ANDROID_KEY_PASSWORD` - Key password
- `IOS_CERT_BASE64` - Base64-encoded p12 certificate
- `IOS_CERT_PASSWORD` - Certificate password
- `IOS_PROVISIONING_PROFILE_BASE64` - Base64-encoded provisioning profile

**Configure via**: https://github.com/thealphakenya/qmoi-enhanced/settings/secrets/actions

### Step 2: Dispatch the Workflow (Option A or B)

**Option A - Using PAT (Recommended for automation):**

```bash
export GITHUB_PAT=ghp_xxxxxxxxxxxx  # Your PAT with repo + workflow scopes
bash scripts/dispatch_workflow_with_pat_clean.sh \
  --workflow .github/workflows/build-and-release.yml \
  --ref v1.2.4 \
  --run
```

**Option B - Manual via GitHub UI:**

1. Go to: https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/build-and-release.yml
2. Click "Run workflow" → select branch/tag → "Run workflow"

### Step 3: Monitor & Verify the Build

Once the workflow runs:

1. Check the **Actions** tab for job status
2. Review logs to confirm:
   - ✅ Android build (with or without signing)
   - ✅ PWA builds (all 7 apps)
   - ✅ iOS build placeholder
   - ✅ Manifest regeneration
   - ✅ Asset uploads to release

### Step 4: Verify Signed Artifacts (if applicable)

After successful build with signing secrets:

```bash
# Run verification script
python3 scripts/verify_apps.py

# Expected output for signed builds:
# ✅ APK signature valid
# ✅ IPA code-signed
# etc.
```

### Step 5: Replace Stub Assets (if CI produced signed builds)

If the workflow produced signed artifacts:

```bash
# Download built artifacts from Actions
# Replace stubs in Qmoi_downloaded_apps/*/latest/
# Re-upload to release
python3 scripts/verify_apps.py --upload-to-release v1.2.4
```

---

## Release v1.2.4 Current Status 📦

- **GitHub Release**: Created ✅
- **Stub assets uploaded**: ✅ (5 files)
- **API endpoints hardened**: ✅
- **CI workflow enhanced**: ✅
- **Signing secrets configured**: ⏳ (awaiting user action)
- **Signed builds produced**: ⏳ (depends on secrets + workflow dispatch)
- **Manual device testing**: ⏳ (optional QA step)

---

## Quick Reference

| Task                        | Tool / Command                                                                                                                          | Status       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Workflow dispatch (dry-run) | `bash scripts/dispatch_workflow_with_pat_clean.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4`                      | Ready        |
| Workflow dispatch (execute) | `GITHUB_PAT=xxx bash scripts/dispatch_workflow_with_pat_clean.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4 --run` | Awaiting PAT |
| View release                | https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.4                                                                      | Live         |
| Configure secrets           | https://github.com/thealphakenya/qmoi-enhanced/settings/secrets/actions                                                                 | Optional     |
| Monitor builds              | https://github.com/thealphakenya/qmoi-enhanced/actions                                                                                  | Ready        |
| Verify apps locally         | `python3 scripts/verify_apps.py`                                                                                                        | Ready        |

---

## What the Current Release Contains

**v1.2.4 - Current State:**

- ✅ 5 valid application stubs (minimal but verifiable ZIP/APK/IPA packages)
- ✅ GitHub Release created with all 5 assets attached
- ✅ Regenerated `release_assets_manifest.json` (16 assets tracked)
- ✅ Enhanced API endpoints for file operations and status reporting
- ✅ CI/CD pipeline ready for signed builds (awaiting secrets)

**Next Release (v1.2.5 or later):**

- Optional: Production-signed APKs (requires Android signing secrets)
- Optional: Production-signed IPAs (requires iOS signing secrets)
- Automatic upload to release on tag push

---

## For Questions or Issues

1. Check `DOCS/` folder for detailed setup guides
2. Review `.github/workflows/build-and-release.yml` for build logic
3. Run `python3 scripts/verify_apps.py` to validate local packages
4. View GitHub Actions logs for detailed build output
