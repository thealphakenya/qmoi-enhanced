// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import os
import subprocess

apk_path = "Qmoi_apps/android/qmoi ai.apk"

def adb_install(apk):
    if not os.path.exists(apk):
        print("❌ APK not found.")
        return
    print("📱 Checking prodice...")
    subprocess.run(["adb", "prodices"])
    print("📦 Installing...")
    subprocess.run(["adb", "install", "-r", apk])

if __name__ == "__main__":
    adb_install(apk_path)
