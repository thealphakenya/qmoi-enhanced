// [] this file has no remaining production markers
#!/bin/bash
# qmoi_remote_java_build.sh
# QMOI Automated Remote Java/Android Build & Validation Script
# Usage: ./qmoi_remote_java_build.sh <remote_user>@<remote_host> <remote_project_path>

set -e
REMOTE="$1"
REMOTE_PATH="$2"

if [ -z "$REMOTE" ] || [ -z "$REMOTE_PATH" ]; then
  echo "Usage: $0 <remote_user>@<remote_host> <remote_project_path>"
  exit 1
fi

# Sync local project to remote QMOI/QCity build server
rsync -avz --delete ./mobile/ "$REMOTE:$REMOTE_PATH/mobile/"

# Trigger remote build and validation
ssh "$REMOTE" "cd $REMOTE_PATH/mobile/android && ./gradlew clean assembleRelease && ./gradlew test"

# Retrieve built APKs and test reports
mkdir -p ./artifacts
scp "$REMOTE:$REMOTE_PATH/mobile/android/app/build/outputs/apk/release/app-release.apk" ./artifacts/
scp "$REMOTE:$REMOTE_PATH/mobile/android/app/build/reports/tests/testDebugUnitTest/index.html" ./artifacts/ || true

# Optionally, validate APK signature and installability (requires apksigner, adb on remote)
ssh "$REMOTE" "cd $REMOTE_PATH/mobile/android/app/build/outputs/apk/release && apksigner verify app-release.apk"

# Print completion message
echo "Remote build, test, and validation complete. Artifacts in ./artifacts."
