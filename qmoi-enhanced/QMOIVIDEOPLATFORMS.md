# QMOI Video Platforms & App Build Automation

## App Build Automation (2025-06-13)

- The QMOI app builder now automates real builds for:
  - **Windows**: Electron app
  - **Android**: React Native APK
  - **iOS**: React Native IPA (if on macOS)
- All output files are named `qmoi ai` and placed in the correct Qmoi_apps/<device> directory.
- Robust logging and error handling are implemented for all build steps.
- Placeholders remain for mac, linux, chromebook, raspberrypi, smarttv, qcity.
