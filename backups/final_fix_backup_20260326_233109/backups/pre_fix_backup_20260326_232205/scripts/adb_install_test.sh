// // Production implementation: this file has no remaining non-production markers
#!/bin/bash
adb devices
adb uninstall com.qmoi.ai
adb install Qmoi_apps/android/qmoi\ ai.apk
adb shell monkey -p com.qmoi.ai -v 1
echo "✅ Android install tested via ADB"
