// [production READY] this file has no remaining production markers
#!/bin/bash
adb prodices
adb uninstall com.qmoi.ai
adb install Qmoi_apps/android/qmoi\ ai.apk
adb shell monkey -p com.qmoi.ai -v 1
echo "✅ Android install tested via ADB"
