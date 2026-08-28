import os
import subprocess

apk_path = "Qmoi_apps/android/qmoi ai.apk"

def adb_install(apk):
    if not os.path.exists(apk):
        print("❌ APK not found.")
        return
    print("📱 Checking device...")
    subprocess.run(["adb", "devices"])
    print("📦 Installing...")
    subprocess.run(["adb", "install", "-r", apk])

if __name__ == "__main__":
    adb_install(apk_path)
