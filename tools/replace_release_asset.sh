#!/usr/bin/env bash
# Replace a GitHub release asset by deleting the old asset and uploading a new file.
# Usage: ./tools/replace_release_asset.sh <release_id> <old_asset_id> <file_path> <asset_name>

set -euo pipefail

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <release_id> <old_asset_id> <file_path> <asset_name>"
  exit 2
fi

RELEASE_ID=$1
OLD_ASSET_ID=$2
FILE_PATH=$3
ASSET_NAME=$4

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN must be set in environment to run this script"
  exit 1
fi

echo "Deleting old asset id: $OLD_ASSET_ID"
curl -sS -X DELETE -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/thealphakenya/qmoi-enhanced/releases/assets/$OLD_ASSET_ID"

echo "Uploading new asset: $ASSET_NAME"
UPLOAD_URL="https://uploads.github.com/repos/thealphakenya/qmoi-enhanced/releases/$RELEASE_ID/assets?name=$(basename $ASSET_NAME)"
curl -sS -X POST -H "Authorization: Bearer $GITHUB_TOKEN" -H "Content-Type: application/octet-stream" --data-binary @"$FILE_PATH" "$UPLOAD_URL"

echo "Done. Recompute checksums locally and update checksums.txt in the release if needed."
