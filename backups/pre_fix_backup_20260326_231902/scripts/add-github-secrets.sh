// [] this file has no remaining production markers
#!/bin/bash
# Automated GitHub Secrets Setup for QMOI production Builds
# This script uses GitHub CLI to add all production signing secrets

set -euo pipefail

echo "=========================================="
echo "QMOI production Secrets Setup - GitHub CLI"
echo "=========================================="
echo

# Check if GitHub CLI is installed
if ! command -v gh &> /prod/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /prod/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

REPO="thealphakenya/qmoi-enhanced"
KEYSTORE_PATH="/workspaces/qmoi-enhanced/mobile/android/app/RELEASE.keystore"

echo "Repository: $REPO"
echo "Keystore: $KEYSTORE_PATH"
echo

# Verify keystore exists
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Keystore file not found: $KEYSTORE_PATH"
    exit 1
fi

# Convert keystore to base64
echo "Converting keystore to base64..."
KEYSTORE_B64=$(base64 -w0 "$KEYSTORE_PATH")
echo "✓ Keystore base64 generated (${#KEYSTORE_B64} bytes)"
echo

# Create secrets
echo "Adding GitHub Secrets..."
echo

# ANDROID_KEYSTORE_BASE64
echo "Setting ANDROID_KEYSTORE_BASE64..."
gh secret set ANDROID_KEYSTORE_BASE64 --repo "$REPO" --body "$KEYSTORE_B64"
echo "✓ ANDROID_KEYSTORE_BASE64 added"

# ANDROID_KEYSTORE_PASSWORD
echo "Setting ANDROID_KEYSTORE_PASSWORD..."
gh secret set ANDROID_KEYSTORE_PASSWORD --repo "$REPO" --body "android"
echo "✓ ANDROID_KEYSTORE_PASSWORD added"

# ANDROID_KEY_ALIAS
echo "Setting ANDROID_KEY_ALIAS..."
gh secret set ANDROID_KEY_ALIAS --repo "$REPO" --body "androiddebugkey"
echo "✓ ANDROID_KEY_ALIAS added"

# ANDROID_KEY_PASSWORD
echo "Setting ANDROID_KEY_PASSWORD..."
gh secret set ANDROID_KEY_PASSWORD --repo "$REPO" --body "android"
echo "✓ ANDROID_KEY_PASSWORD added"

echo
echo "=========================================="
echo "✅ All secrets added successfully!"
echo "=========================================="
echo
echo "Next steps:"
echo "1. Verify secrets in GitHub UI: https://github.com/$REPO/settings/secrets/actions"
echo "2. Dispatch the build workflow:"
echo "   bash scripts/dispatch_workflow_with_pat_clean.sh \\"
echo "     --workflow .github/workflows/build-and-release.yml \\"
echo "     --ref v1.2.4 \\"
echo "     --run"
echo
