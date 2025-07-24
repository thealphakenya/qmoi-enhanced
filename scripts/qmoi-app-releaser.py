import os, shutil, sys, time

targets = [
    ("windows", "Qmoi_apps/qmoi_ai.exe"),
    ("android", "Qmoi_apps/qmoi_ai.apk"),
    ("linux", "Qmoi_apps/qmoi_ai.AppImage"),
    ("macos", "Qmoi_apps/qmoi_ai.dmg"),
    ("qcity", "Qmoi_apps/qmoi_ai.qc"),
]

def release_all():
    base = "/qcity-artifacts/releases/"
    os.makedirs(base, exist_ok=True)
    for platform, path in targets:
        try:
            if os.path.exists(path):
                dest = os.path.join(base, platform)
                os.makedirs(dest, exist_ok=True)
                shutil.copy2(path, dest)
                print(f"[✅] Released for {platform}")
            else:
                print(f"[⚠️] Missing: {path}")
        except Exception as e:
            print(f"[❌] Error releasing to {platform}: {e}")

if __name__ == "__main__":
    print("[🌍] Syncing QMOI App to all release targets...")
    release_all()
    print("[🎯] All syncs attempted.")
