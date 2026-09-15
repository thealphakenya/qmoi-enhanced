#!/usr/bin/env bash
# container_build_entrypoint.sh
# Usage inside container: mount repo at /workspace and run this script
set -euo pipefail
WORKSPACE=${WORKSPACE:-/workspace}
cd "$WORKSPACE"

# Default: build Android if path exists
if [ -d mobile/android ]; then
  echo "Building Android project in $WORKSPACE/mobile/android"
  cd mobile/android
  chmod +x ./gradlew
  ./gradlew clean assembleRelease --no-daemon
  echo "Build finished. Artifacts located in app/build/outputs/apk/"
else
  echo "No mobile/android directory found in workspace: $WORKSPACE"
  exec "$@"
fi
