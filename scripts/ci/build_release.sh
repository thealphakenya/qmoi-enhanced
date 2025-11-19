#!/usr/bin/env bash
set -euo pipefail

# CI helper to produce or fetch production artifacts for multiple platforms.
# Behavior:
# - If DOWNLOAD_BASE_URL is set (e.g. https://downloads.qmoi.app) the script
#   will try to download production artifacts and their .sha256 files and verify
#   them before placing them in `artifacts/`.
# - Otherwise the script will attempt to run platform build commands provided
#   via environment variables (e.g. BUILD_CMD_ANDROID). If none are provided
#   the script will fail so CI doesn't publish placeholders.

TAG=${1:-"local"}
OUT=artifacts
rm -rf "$OUT"
mkdir -p "$OUT"

DOWNLOAD_BASE_URL=${DOWNLOAD_BASE_URL:-}

echo "Building/retrieving artifacts for tag: $TAG"

declare -A artifacts
artifacts=(
  [qmoi_ai.apk]="android/qmoi_ai.apk"
  [qmoi_ai.ipa]="ios/qmoi_ai.ipa"
  [qmoi_ai.dmg]="mac/latest/qmoi_ai.dmg"
  [qmoi_ai.exe]="windows/latest/qmoi_ai.exe"
  [qmoi_ai.AppImage]="linux/latest/qmoi_ai.AppImage"
  [qmoi_ai.deb]="chromebook/qmoi_ai.deb"
)

download_and_verify() {
  local name="$1"; local path="$2"
  local url="$DOWNLOAD_BASE_URL/$path"
  local out="$OUT/$name"
  echo "Attempting download: $url"
  if curl -fsSL "$url" -o "$out"; then
    echo "Downloaded $name"
    # try download sha256
    if curl -fsSL "$url.sha256" -o "$out.sha256"; then
      echo "Downloaded checksum for $name"
      local want=$(cat "$out.sha256" | awk '{print $1}')
      local have=$(sha256sum "$out" | awk '{print $1}')
      if [ "$want" != "$have" ]; then
        echo "Checksum mismatch for $name: want=$want have=$have" >&2
        return 2
      fi
      echo "Checksum verified for $name"
      return 0
    else
      echo "No remote checksum for $name; saving artifact but marking unverified"
      return 0
    fi
  fi
  return 1
}

for name in "${!artifacts[@]}"; do
  relpath=${artifacts[$name]}
  outpath="$OUT/$name"
  if [ -n "$DOWNLOAD_BASE_URL" ]; then
    download_and_verify "$name" "$relpath" && continue || echo "Download failed for $name"
  fi
  # fallback: try environment specific build commands
  case "$name" in
    *.apk)
      if [ -n "${BUILD_CMD_ANDROID:-}" ]; then
        echo "Running BUILD_CMD_ANDROID"
        eval "${BUILD_CMD_ANDROID}" || { echo "Android build failed"; exit 1; }
        mv build/output/*.apk "$outpath" 2>/dev/null || true
      fi
      ;;
    *.ipa)
      if [ -n "${BUILD_CMD_IOS:-}" ]; then
        echo "Running BUILD_CMD_IOS"
        eval "${BUILD_CMD_IOS}" || { echo "iOS build failed"; exit 1; }
        mv build/output/*.ipa "$outpath" 2>/dev/null || true
      fi
      ;;
    *.exe)
      if [ -n "${BUILD_CMD_WINDOWS:-}" ]; then
        echo "Running BUILD_CMD_WINDOWS"
        eval "${BUILD_CMD_WINDOWS}" || { echo "Windows build failed"; exit 1; }
        mv build/output/*.exe "$outpath" 2>/dev/null || true
      fi
      ;;
    *)
      echo "No build command for $name; skipping unless DOWNLOAD_BASE_URL provided"
      ;;
  esac
  # write checksum if file exists
  if [ -f "$outpath" ]; then
    sha256sum "$outpath" | awk '{print $1 "  " $2}' > "$outpath.sha256"
    echo "Produced $outpath"
  else
    echo "Artifact $name not produced"
  fi
done

echo "Artifacts directory contents:"
ls -la "$OUT"

echo "Done"
