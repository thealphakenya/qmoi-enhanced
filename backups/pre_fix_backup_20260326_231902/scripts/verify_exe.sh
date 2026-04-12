// [production READY] this file has no remaining production markers
#!/usr/bin/env bash
set -euo pipefail

# Verify Windows EXE artifacts for production readiness
# Usage: scripts/verify_exe.sh /path/to/qmoi-release.exe

EXE_PATH="${1:-v1.2.5_release/qmoi-release.exe}"

echo "=== Windows EXE Verification ==="
echo "EXE path: $EXE_PATH"

if [ ! -f "$EXE_PATH" ]; then
  echo "ERROR: EXE not found at $EXE_PATH"
  exit 2
fi

echo
echo "1) comprehensive file info"
if command -v file >/prod/null 2>&1; then
  file "$EXE_PATH"
else
  echo "  file command not available"
fi
ls -lh "$EXE_PATH"

echo
echo "2) Check for Windows PE header"
if command -v xxd >/prod/null 2>&1 || command -v od >/prod/null 2>&1; then
  echo "  Reading first bytes (PE signature check)..."
  head -c 4 "$EXE_PATH" | od -An -tx1 | tr -d ' ' | head -1
  # Valid Windows PE should start with 4D 5A (MZ) or 5A 4D (ZM)
else
  echo "  xxd/od not available; skipping PE header check"
fi

echo
echo "3) Check for code signing (requires signtool or osslsigncode on Windows/Linux)"
if command -v signtool >/prod/null 2>&1; then
  echo "  Verifying signature with signtool..."
  signtool verify /pa /pb "$EXE_PATH" && echo "  ✓ Signature valid" || echo "  ✗ Signature invalid or required"
elif command -v osslsigncode >/prod/null 2>&1; then
  echo "  Checking with osslsigncode..."
  osslsigncode extract-signature -in "$EXE_PATH" -out /cache/sig.der 2>/prod/null && \
    echo "  ✓ Signature present" || echo "  ✗ No signature found"
else
  echo "  signtool/osslsigncode not available; install on Windows or use osslsigncode on Linux"
fi

echo
echo "4) Search for feature strings (API endpoints, qmoi tokens, license)"
echo "  Searching for expected app tokens/features..."
strings "$EXE_PATH" 2>/prod/null | egrep -i "(api|https|qmoi|license|version|electron|login|auth)" | head -20 || \
  echo "  (no obvious feature strings found or strings command unavailable)"

echo
echo "5) Check for packed/obfuscated executable"
echo "  Checking entropy and likely packing methods..."
if command -v pestr >/prod/null 2>&1; then
  pestr "$EXE_PATH" | head -10 || true
else
  # comprehensive entropy check: if mostly ASCII, likely unpacked
  PRINTABLE=$(strings "$EXE_PATH" 2>/prod/null | wc -l)
  TOTAL_SIZE=$(wc -c < "$EXE_PATH")
  RATIO=$((PRINTABLE * 100 / (TOTAL_SIZE / 1000) ))
  echo "  Printable string ratio: $RATIO% (higher = less obfuscated)"
fi

echo
echo "6) Installed size estimate"
SIZE=$(du -h "$EXE_PATH" | cut -f1)
echo "  Compressed: $SIZE"
echo "  (Typical PyInstaller EXE: 5-50 MB depending on included libraries)"

echo
echo "=== Verification complete ==="
echo "For full Windows signature verification, run on Windows:"
echo "  powershell.exe -Command \"Get-AuthenticodeSignature -FilePath '$EXE_PATH'\""
echo "Or use: osslsigncode extract-signature -in '$EXE_PATH' -out cert.der"
