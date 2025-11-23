#!/usr/bin/env bash
set -euo pipefail
# Stub script to upload assets to a GitHub release using `gh` or the API.
# This script does not run automatically in this environment; it is a helper
# for operators to run locally where `gh` is configured or where a GITHUB_TOKEN
# is available.

if [ "$#" -lt 2 ]; then
  cat <<'USAGE'
Usage: upload_release_stub.sh <tag> <assets-dir> [--notes-file <notes>]

Example:
  ./scripts/upload_release_stub.sh v1.2.3 releases/packaged_20251123T... --notes-file RELEASE_NOTES.md
USAGE
  exit 2
fi

TAG="$1"
ASSETS_DIR="$2"
shift 2

NOTES_ARG=()
if [ "$#" -ge 2 ] && [ "$1" = "--notes-file" ]; then
  NOTES_ARG=(--notes-file "$2")
fi

if command -v gh >/dev/null 2>&1; then
  echo "Using gh to create release $TAG and upload assets from $ASSETS_DIR"
  gh release create "$TAG" "$ASSETS_DIR"/* "${NOTES_ARG[@]}"
  exit 0
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "gh not found; but GITHUB_TOKEN is set. Using curl to call releases API is possible but not implemented in this stub."
  echo "Please run this script on a machine with 'gh' configured, or implement the API upload portion here."
  exit 1
fi

echo "Neither 'gh' is installed nor GITHUB_TOKEN found in environment. Please run locally with either 'gh' configured or set GITHUB_TOKEN."
exit 2
