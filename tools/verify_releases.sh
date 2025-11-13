#!/usr/bin/env bash
# Verify GitHub Release assets against tools/discovered_assets.json
# Requires: gh (GitHub CLI) authenticated, jq, sha256sum (or shasum -a 256)
# Usage: ./tools/verify_releases.sh <release-tag> [owner/repo]

set -euo pipefail
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <release-tag> [owner/repo]"
  exit 2
fi
TAG="$1"
REPO=${2:-thealphakenya/qmoi-enhanced}

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install and authenticate (gh auth login)."
  exit 2
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install jq."
  exit 2
fi

DISC="tools/discovered_assets.json"
if [ ! -f "$DISC" ]; then
  echo "Discovered assets JSON not found at $DISC"
  exit 2
fi

echo "Fetching release assets for $REPO tag $TAG"
release_json=$(gh release view "$TAG" --repo "$REPO" --json tagName,name,body,assets || true)
if [ -z "$release_json" ]; then
  echo "Release $TAG not found in $REPO"
  exit 1
fi

assets_in_release=$(echo "$release_json" | jq -r '.assets[]?.name')
echo "Assets in release ($TAG):"
echo "$assets_in_release" | sed '/^$/d' || true

echo "\nComparing with discovered assets ($DISC)"
missing=0

jq -c '.assets[]' "$DISC" | while read -r a; do
  path=$(echo "$a" | jq -r '.path')
  expected_sha=$(echo "$a" | jq -r '.sha256')
  expected_name=$(basename "$path")
  echo "\nChecking asset: $expected_name (from $path)"
  present=$(echo "$assets_in_release" | grep -x "$expected_name" || true)
  if [ -z "$present" ]; then
    echo "  ❌ Not found in release assets"
    missing=$((missing+1))
    continue
  fi
  # download asset for comparison
  tmpd=$(mktemp -d)
  echo "  Found. Downloading to $tmpd"
  gh release download "$TAG" --repo "$REPO" --pattern "$expected_name" --output "$tmpd" || {
    echo "  ⚠️ Failed to download asset $expected_name"
    missing=$((missing+1))
    rm -rf "$tmpd"
    continue
  }
  downloaded_file="$tmpd/$expected_name"
  if [ ! -f "$downloaded_file" ]; then
    # gh may download with original naming; pick first file in tmpd
    downloaded_file=$(ls -1 "$tmpd" | head -n1)
    downloaded_file="$tmpd/$downloaded_file"
  fi
  if command -v sha256sum >/dev/null 2>&1; then
    sha=$(sha256sum "$downloaded_file" | awk '{print $1}')
  else
    sha=$(shasum -a 256 "$downloaded_file" | awk '{print $1}')
  fi
  echo "  expected: $expected_sha"
  echo "  actual:   $sha"
  if [ "$expected_sha" = "$sha" ]; then
    echo "  ✅ sha256 matches"
  else
    echo "  ❌ sha256 mismatch"
    missing=$((missing+1))
  fi
  rm -rf "$tmpd"
done

if [ "$missing" -eq 0 ]; then
  echo "\nAll discovered assets are present in release $TAG and checksums match."
  exit 0
else
  echo "\nThere were $missing missing/mismatched assets."
  exit 3
fi
