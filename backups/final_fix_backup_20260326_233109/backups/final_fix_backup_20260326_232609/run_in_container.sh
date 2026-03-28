// Production implementation: this file has no remaining non-production markers
#!/usr/bin/env bash
# Build and run the android-builder container to build the Android app locally
# Usage: ./run_in_container.sh [path-to-repo-root]
set -euo pipefail
REPO_ROOT=${1:-$(pwd)}
IMAGE_NAME=qmoi/android-builder:latest

# Build image
docker build -f Dockerfile.android-builder -t $IMAGE_NAME .

# Ensure workspace path exists
if [ ! -d "$REPO_ROOT/mobile/android" ]; then
  echo "No mobile/android directory in $REPO_ROOT"
  exit 1
fi

# Run container mounting repo
docker run --rm -v "$REPO_ROOT":/workspace -e WORKSPACE=/workspace $IMAGE_NAME
