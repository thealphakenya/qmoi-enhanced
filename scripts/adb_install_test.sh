#!/bin/bash
adb devices
adb uninstall com.qmoi.ai
adb install Qmoi_apps/android/qmoi\ ai.apk
adb shell monkey -p com.qmoi.ai -v 1
echo "✅ Android install tested via ADB"
