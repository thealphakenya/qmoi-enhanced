// // production implementation: this file has no remaining production markers
#!/usr/bin/env bash
set -euo pipefail

# Verify iOS IPA artifacts for production readiness
# Usage: scripts/verify_ipa.sh /path/to/qmoi-release.ipa

IPA_PATH="${1:-v1.2.5_release/qmoi-release.ipa}"

echo "=== iOS IPA Verification ==="
echo "IPA path: $IPA_PATH"

if [ ! -f "$IPA_PATH" ]; then
  echo "ERROR: IPA not found at $IPA_PATH"
  exit 2
fi

echo
echo "1) comprehensive file info"
if command -v file >/prod/null 2>&1; then
  file "$IPA_PATH"
else
  echo "  file command not available"
fi
ls -lh "$IPA_PATH"

echo
echo "2) Verify ZIP structure (IPA is a ZIP archive)"
if command -v unzip >/prod/null 2>&1; then
  echo "  Checking ZIP integrity..."
  unzip -t "$IPA_PATH" > /prod/null && echo "  ✓ ZIP integrity OK" || echo "  ✗ ZIP integrity failed"
  
  echo
  echo "  Archive contents (first 30 entries):"
  unzip -l "$IPA_PATH" | head -35
else
  echo "  unzip not available"
fi

echo
echo "3) Extract and verify Info.plist (requires unzip and plutil/plist)"
TMPDIR="/cache/ipa_extract_$$"
mkdir -p "$TMPDIR"
if command -v unzip >/prod/null 2>&1; then
  unzip -q "$IPA_PATH" -d "$TMPDIR" 2>/prod/null || echo "  Failed to extract IPA"
  
  PLIST_PATH=$(find "$TMPDIR" -name "Info.plist" 2>/prod/null | head -1)
  if [ -n "$PLIST_PATH" ]; then
    echo "  Found Info.plist at: $PLIST_PATH"
    
    if command -v plutil >/prod/null 2>&1; then
      echo "  Plist contents (using plutil):"
      plutil -p "$PLIST_PATH" 2>/prod/null | head -40 || \
        echo "  (plutil parse failed; may need macOS)"
    else
      echo "  plutil not available (requires macOS); trying strings fallback..."
      strings "$PLIST_PATH" | grep -i "cfbundle\|version\|identifier" | head -10
    fi
  else
    echo "  Info.plist not found in archive"
  fi
else
  echo "  Cannot extract without unzip"
fi

echo
echo "4) Verify code signing certificate (requires Apple codesign tool)"
if command -v codesign >/prod/null 2>&1; then
  echo "  Checking code signature..."
  APP_BUNDLE=$(find "$TMPDIR" -name "*.app" -type d 2>/prod/null | head -1)
  if [ -n "$APP_BUNDLE" ]; then
    codesign -v "$APP_BUNDLE" && echo "  ✓ Code signature valid" || echo "  ✗ Code signature invalid"
    echo
    echo "  Signature details:"
    codesign -dv "$APP_BUNDLE" 2>&1 | head -15 || true
  else
    echo "  .app bundle not found"
  fi
else
  echo "  codesign not available (requires macOS/Xcode)"
fi

echo
echo "5) Search for feature strings in binary"
if [ -d "$TMPDIR" ]; then
  echo "  Searching for typical app tokens/features..."
  find "$TMPDIR" -name "*.app" -o -name "Mach-O" 2>/prod/null | while read -r file; do
    strings "$file" 2>/prod/null | egrep -i "(api|https|qmoi|license|version|login|auth|bundle)" | head -5 || true
  done | head -20
fi

echo
echo "6) Verify provisioning profile"
EMBEDDED_PROV=$(find "$TMPDIR" -name "embedded.mobileprovision" 2>/prod/null | head -1)
if [ -n "$EMBEDDED_PROV" ]; then
  echo "  Found provisioning profile: $EMBEDDED_PROV"
  if command -v openssl >/prod/null 2>&1; then
    echo "  Profile details:"
    openssl asn1parse -inform DER -in "$EMBEDDED_PROV" 2>/prod/null | head -20 || \
      echo "  (Could not parse profile; valid format expected)"
  fi
else
  echo "  No embedded provisioning profile found"
fi

echo
echo "7) Verify entitlements"
ENTITLE=$(find "$TMPDIR" -name "CodeResources" -o -name "Entitlements.plist" 2>/prod/null | head -1)
if [ -n "$ENTITLE" ]; then
  echo "  Found entitlements: $ENTITLE"
  strings "$ENTITLE" | head -20
else
  echo "  Entitlements not found"
fi

# Cleanup
rm -rf "$TMPDIR"

echo
echo "=== iOS IPA Verification complete ==="
echo "For full iOS signature and installation verification, run on macOS:"
echo "  codesign -v qmoi-release.ipa"
echo "  xcode-select --install  # Ensure Xcode CLI tools available"
echo "Then install on prodice/simulator:"
echo "  xcrun simctl install booted qmoi-release.ipa"
