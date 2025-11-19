#!/usr/bin/env bash
set -euo pipefail

# Simple CI helper to produce placeholder artifacts for multiple platforms.
# In production replace these steps with real build + signing steps. The script
# creates files in `artifacts/` and writes SHA256 checksums alongside.

TAG=${1:-"local"}
OUT=artifacts
rm -rf "$OUT"
mkdir -p "$OUT"

echo "Building placeholder artifacts for tag: $TAG"

make_artifact() {
  local name="$1"
  local path="$OUT/$name"
  echo "QMOI placeholder for $name ($TAG)" > "$path"
  echo "tag:$TAG" >> "$path"
  du -h "$path" || true
  sha256sum "$path" | awk '{print $1 "  " $2}' > "$path.sha256"
}

# Platforms - create small placeholder files. Replace with real builds.
make_artifact "qmoi_ai.apk"
make_artifact "qmoi_ai.ipa"
make_artifact "qmoi_ai.dmg"
make_artifact "qmoi_ai.exe"
make_artifact "qmoi_ai.AppImage"
make_artifact "qmoi_ai.deb"

echo "Artifacts created:" && ls -la "$OUT"

echo "Done"
