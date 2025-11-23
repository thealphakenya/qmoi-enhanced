# QMOI Automated Java/Android Build & Validation

This script (`qmoi_remote_java_build.sh`) automates the process of building and validating Android APKs and Java projects on a remote QMOI/QCity server with Java installed.

## Features
- Syncs your local project to a remote server
- Triggers a clean build and runs all tests remotely
- Retrieves built APKs and test reports
- Verifies APK signature and installability
- Works with any QMOI/QCity server or CI/CD runner with Java/Android tools

## Usage
```sh
chmod +x qmoi_remote_java_build.sh
./qmoi_remote_java_build.sh <remote_user>@<remote_host> <remote_project_path>
```
- Example: `./qmoi_remote_java_build.sh user@qmoibuild.example.com /srv/qmoi`

## Requirements
- SSH access to a remote server with Java, Android SDK, and build tools
- `rsync`, `ssh`, and `scp` installed locally
- Remote server must have `gradlew`, `apksigner`, and (optionally) `adb` for full validation

## Integration
- Add this script to your CI/CD pipeline or use it manually for production releases
- Artifacts and test reports are saved in `./artifacts/`

---

*Last updated: 2025-11-23*
