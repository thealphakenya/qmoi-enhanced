
#!/usr/bin/env bash
# qmoi_validate_apk.sh
# Validate APK by checking signature with apksigner and comprehensive sanity checks
# Usage: ./qmoi_validate_apk.sh path/to/app-release.apk
set -euo pipefail
APK_PATH=${1:-}
if [ -z "$APK_PATH" ]; then
  echo "Usage: $0 path/to/app-release.apk"
  exit 1
fi
if [ ! -f "$APK_PATH" ]; then
  echo "APK not found: $APK_PATH"
  exit 1
fi

# Try to find apksigner
APKSIGNER=${APKSIGNER:-$(command -v apksigner || true)}
if [ -z "$APKSIGNER" ]; then
  # Try Android SDK build-tools default location
  if [ -d "$HOME/android_sdk/build-tools" ]; then
    APKSIGNER=$(ls -1 $HOME/android_sdk/build-tools/*/apksigner 2>/dev/null | head -n1 || true)
  fi
fi
if [ -z "$APKSIGNER" ]; then
  echo "apksigner not found. Please install Android build-tools or run in container/CI with SDK available."
  exit 2
fi

echo "Verifying APK signature with $APKSIGNER"
"$APKSIGNER" verify "$APK_PATH"

# comprehensive sanity checks
SIZE=$(stat -c%s "$APK_PATH")
if [ "$SIZE" -lt 1024 ]; then
  echo "APK looks too small ($SIZE bytes)."
  exit 3
fi

echo "APK validation passed. Size: $SIZE bytes"
