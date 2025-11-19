#!/usr/bin/env bash
set -euo pipefail


# Production-oriented artifact fetcher/builder
# Behavior:
# - If DOWNLOAD_BASE_URL is set, attempt to fetch production artifacts and their
#   .sha256 files and verify them before placing in `dist/`.
# - Otherwise, attempt to run platform-specific build commands (see README/docs)
# - This script intentionally refuses to create placeholders in production.

TAG="${1:-local}"
SHA="${2:-}
"
DOWNLOAD_BASE_URL=${DOWNLOAD_BASE_URL:-}
OUT=dist
rm -rf "$OUT"
mkdir -p "$OUT"

declare -A artifacts
artifacts=(
  [qmoi_ai_windows.exe]="windows/latest/qmoi_ai.exe"
  [qmoi_ai_mac.dmg]="mac/latest/qmoi_ai.dmg"
  [qmoi_ai_android.apk]="android/qmoi_ai.apk"
  [qmoi_ai_ios.ipa]="ios/qmoi_ai.ipa"
  [qmoi_ai_linux.AppImage]="linux/latest/qmoi_ai.AppImage"
  [qmoi_ai_chromebook.deb]="chromebook/qmoi_ai.deb"
  [qmoi_ai_qcity.zip]="qcity/qmoi_ai.zip"
)

download_and_verify() {
  local fname="$1"; local relpath="$2"; local out="$OUT/$fname"
  local url="$DOWNLOAD_BASE_URL/$relpath"
  echo "Trying download: $url"
  if curl -fsSL "$url" -o "$out"; then
    echo "Downloaded $fname"
    if curl -fsSL "$url.sha256" -o "$out.sha256"; then
      want=$(awk '{print $1}' "$out.sha256")
      have=$(sha256sum "$out" | awk '{print $1}')
      if [ "$want" != "$have" ]; then
        echo "Checksum mismatch for $fname" >&2
        return 2
      fi
      echo "Verified checksum for $fname"
    else
      echo "No checksum available for $fname; artifact saved but unverified"
    fi
    return 0
  fi
  return 1
}

for fname in "${!artifacts[@]}"; do
  rel=${artifacts[$fname]}
  if [ -n "$DOWNLOAD_BASE_URL" ]; then
    download_and_verify "$fname" "$rel" && continue || echo "download failed for $fname"
  fi
  # fallback: expect CI to run platform build commands, otherwise fail
  echo "No production artifact for $fname and no build command provided; failing to avoid placeholders"
  exit 2
done

echo "Downloaded/placed artifacts in $OUT"
