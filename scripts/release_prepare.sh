#!/usr/bin/env bash
set -euo pipefail

# release_prepare.sh
# Gather built artifacts from known build output locations, compute checksums,
# and prepare a `releases/` directory ready for upload to GitHub Releases.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="$ROOT_DIR/releases/packaged_$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT_DIR"

echo "Preparing release package in: $OUT_DIR"

# Candidate build output locations to collect
declare -a LOCS=(
  "pwa_apps/*/dist"
  "qmoi-enhanced/dashboard/dist"
  "qmoi-enhanced/.next"
  "dashboard/dist"
  "mobile/build"
  "build"
)

for loc in "${LOCS[@]}"; do
  for path in $(ls -d $loc 2>/dev/null || true); do
    name=$(basename "$(dirname "$path")")
    dest="$OUT_DIR/${name}_$(basename "$path")"
    echo "Copying $path -> $dest"
    mkdir -p "$dest"
    cp -r "$path"/* "$dest/" 2>/dev/null || true
  done
done

echo "Computing checksums..."
python3 scripts/compute_checksums.py "$OUT_DIR" > "$OUT_DIR/CHECKSUMS.txt"

echo "Release package prepared: $OUT_DIR"
echo "Files:"
ls -la "$OUT_DIR"

echo "To upload assets to a release, use the GitHub CLI or API. Example with gh:"
echo "  gh release create <tag> $OUT_DIR/* --notes-file RELEASE_NOTES.md"

exit 0
