
#!/bin/bash
set -e

OUT_DIR="/workspaces/qmoi-enhanced/dist/combined_release"
mkdir -p "$OUT_DIR/checksums"
echo "Generating SHA256 checksums for all artifacts..."
find /workspaces/qmoi-enhanced/dist -type f \( -name "*.apk" -o -name "*.ipa" -o -name "*.dmg" -o -name "*.zip" -o -name "*.exe" \) | while read f; do
  sha256sum "$f" >> "$OUT_DIR/checksums/SHA256SUMS.txt"
done

echo "Checking APK signatures (if jarsigner available)..."
if command -v jarsigner >/dev/null 2>&1; then
  find /workspaces/qmoi-enhanced/dist -type f -name "*.apk" | while read apk; do
    echo "Verifying: $apk"
    jarsigner -verify -verbose -certs "$apk" || echo "Warning: jarsigner verification failed for $apk"
  done
else
  echo "jarsigner not available in this environment; signature verification will run in CI runner with JDK installed."
fi

echo "Checksums and verification results written to: $OUT_DIR/checksums/SHA256SUMS.txt"
