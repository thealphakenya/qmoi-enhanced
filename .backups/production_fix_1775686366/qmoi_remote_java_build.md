<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.728225Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

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

- data: `./qmoi_remote_java_build.sh user@qmoibuild.data.com /srv/qmoi`

## Requirements

- SSH access to a remote server with Java, Android SDK, and build tools
- `rsync`, `ssh`, and `scp` installed locally
- Remote server must have `gradlew`, `apksigner`, and (optionally) `adb` for full validation

## Integration

- Add this script to your CI/CD pipeline or use it manually for production releases
- Artifacts and test reports are saved in `./artifacts/`

---

_Last updated: 2025-11-23_

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

