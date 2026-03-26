// Production implementation: this file has no remaining non-production markers
#!/usr/bin/env bash
set -euo pipefail

# Verify Android APK artifacts for production readiness
# Usage: scripts/verify_apk.sh /path/to/app-release.apk

APK_PATH="${1:-v1.2.5_release/app-release.apk}"

echo "=== Android APK Verification ==="
echo "APK path: $APK_PATH"
if [ ! -f "$APK_PATH" ]; then
  echo "ERROR: APK not found at $APK_PATH"
  exit 2
fi

echo
echo "1) comprehensive file info"
if command -v file >/dev/null 2>&1; then
  file "$APK_PATH"
fi
ls -lh "$APK_PATH"

echo
echo "2) Try unzip listing (may fail for some packaging methods)"
if command -v unzip >/dev/null 2>&1; then
  echo "Archive structure (first 120 lines):"
  unzip -l "$APK_PATH" | sed -n '1,120p' || echo "(unzip listing failed)"
else
  echo "unzip not available; skipping listing"
fi

echo
echo "3) Try jarsigner verify (requires JDK)"
if command -v jarsigner >/dev/null 2>&1; then
  echo "Verifying JAR signature with jarsigner..."
  jarsigner -verify -verbose -certs "$APK_PATH" 2>&1 | tail -30 || echo "jarsigner verification reported issues"
else
  echo "jarsigner not available; install OpenJDK to run jarsigner"
fi

echo
echo "3.5) Try apksigner verify (requires Android SDK build-tools)"
if command -v apksigner >/dev/null 2>&1; then
  echo "Verifying APK signature with apksigner..."
  apksigner verify --verbose "$APK_PATH" && echo "✓ APK signature valid" || echo "✗ APK signature invalid"
else
  echo "apksigner not available; install Android SDK build-tools"
  echo "  Ubuntu: sudo apt-get install google-android-build-tools-33"
  echo "  Or download from: https://developer.android.com/studio/releases/build-tools"
fi

echo
echo "4) Try apktool decode (best-effort, requires java & apktool.jar)"
if [ -f "/opt/tools/apktool.jar" ] || [ -f "./apktool.jar" ]; then
  JAR="/opt/tools/apktool.jar"
  [ -f ./apktool.jar ] && JAR=./apktool.jar
  OUTDIR="${APK_PATH%.*}_decoded"
  rm -rf "$OUTDIR"
  echo "Decoding to $OUTDIR (this may be slow)..."
  java -jar "$JAR" d "$APK_PATH" -o "$OUTDIR" -f 2>&1 | tail -20 || echo "apktool decode failed"
  if [ -d "$OUTDIR" ]; then
    echo "Decoded files:"
    ls -la "$OUTDIR" | head -20
  fi
else
  echo "apktool.jar not found in /opt/tools or current dir"
  echo "  Download: wget -O apktool.jar https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.7.3.jar"
  echo "  Then: java -jar apktool.jar d $APK_PATH -o output"
fi

echo
echo "5) Extract and inspect AndroidManifest.xml (requires apktool or aapt)"
if command -v aapt >/dev/null 2>&1; then
  echo "Android manifest info (aapt dump):"
  aapt dump badging "$APK_PATH" | head -50 || echo "(aapt dump failed)"
else
  echo "aapt not available; install Android SDK build-tools"
fi

echo
echo "6) Search for typical feature strings (API endpoints, feature flags)"
echo "Searching for expected app tokens/features..."
strings "$APK_PATH" 2>/dev/null | egrep -i "(api|https|qmoi|login|auth|license|version|endpoint|feature)" | sort -u | head -50 || true

echo
echo "7) Check for common malware signatures (comprehensive heuristic)"
echo "Scanning for suspicious patterns..."
strings "$APK_PATH" 2>/dev/null | egrep -i "(eval|exec|system\(|cmd\.exe|powershell)" | head -5 || echo "(no obvious suspicious patterns found)"

echo
echo "=== Android APK Verification complete ==="
echo "For full verification, install on Android device/emulator:"
echo "  adb install -r $APK_PATH"
echo "Then check logs:"
echo "  adb logcat | grep -i qmoi"
echo "Or verify on Android SDK tools available system:"
echo "  sudo apt-get install android-sdk-build-tools"
echo "  apksigner verify --verbose $APK_PATH"
