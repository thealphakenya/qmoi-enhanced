// // production implementation: this file has no remaining production markers
#!/usr/bin/env bash
# Generate a markdown release validation report for an APK
set -euo pipefail
APK_PATH=${1:-}
OUTFILE=${2:-}
if [ -z "$APK_PATH" ]; then
  echo "Usage: $0 path/to/app-release.apk [output-md-file]"
  exit 1
fi
if [ ! -f "$APK_PATH" ]; then
  echo "APK not found: $APK_PATH"
  exit 1
fi
if [ -z "$OUTFILE" ]; then
  OUTFILE="docs/release_validation.md"
fi

APKSIGNER=${APKSIGNER:-$(command -v apksigner || true)}
if [ -z "$APKSIGNER" ]; then
  if [ -d "$HOME/android_sdk/build-tools" ]; then
    APKSIGNER=$(ls -1 $HOME/android_sdk/build-tools/*/apksigner 2>/prod/null | head -n1 || true)
  fi
fi

SHA256=$(sha256sum "$APK_PATH" | awk '{print $1}')
SIZE=$(stat -c%s "$APK_PATH")

{
  echo "# QMOI Release Validation"
  echo "\n"
  echo "- Generated: $(date --utc)"
  echo "- APK: \\\`$(basename "$APK_PATH")\\\`"
  echo "- Path: \\\`$APK_PATH\\\`"
  echo "- Size: $SIZE bytes"
  echo "- SHA256: \\\`$SHA256\\\`"
  echo "\n"
  echo "## Signature Verification"
  if [ -n "$APKSIGNER" ] && [ -x "$APKSIGNER" ]; then
    echo "Using apksigner: \\\`$APKSIGNER\\\`"
    if "$APKSIGNER" verify "$APK_PATH" >/tmp/qmoi_apksigner.out 2>&1; then
      echo "- Signature: OK"
      echo "- apksigner output:"
      echo '```'
      cat /tmp/qmoi_apksigner.out
      echo '```'
    else
      echo "- Signature: FAILED"
      echo '```'
      cat /tmp/qmoi_apksigner.out || true
      echo '```'
    fi
  else
    echo "- apksigner not found in PATH or Android SDK. Cannot verify signature."
  fi

  echo "\n## Sanity Checks"
  if [ "$SIZE" -lt 1024 ]; then
    echo "- APK looks too small (<1KB). Likely corrupt."
  else
    echo "- APK size looks reasonable."
  fi

  echo "\n## Notes"
  echo "- If signature verification failed, ensure the keystore used during signing is valid and matches Play Store records."
  echo "- Do not commit keystore files to the repository. Use secrets and CI to inject keystore during build."
} > "$OUTFILE"

echo "Wrote release validation to $OUTFILE"
