# 🚀 Build QMOI AI for All Platforms

## 📦 Desktop Builds
```bash
npm run electron:build:win     # For Windows (x64 & ia32)
npm run electron:build:linux   # For Linux (x64, armv7l, arm64)
npm run electron:build:mac     # For macOS (Intel & M1)
📱 Mobile Builds
Android:

Use gradlew assembleRelease inside Qmoi_apps/android

Install: adb install Qmoi_apps/android/qmoi_ai.apk

iOS:

Open Qmoi_apps/ios in Xcode

Set signing and run on device or simulator

📺 Other Platforms
Chromebook: Install Android APK via Linux subsystem

Raspberry Pi: Use Linux ARM build (--armv7l, --arm64)

Smart TV: Deploy Android APK if supported

QCity: Use custom script:

bash
Copy
Edit
python scripts/qcity-build.py
✅ Auto-Build for All
Run:

bash
Copy
Edit
npm run install-clean -- --run-builds --publish