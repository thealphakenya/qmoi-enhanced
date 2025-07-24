import os

targets = {
    "qmoi_ai.exe": 10_000_000,
    "qmoi_ai.apk": 5_000_000,
    "qmoi_ai.AppImage": 8_000_000,
    "qmoi_ai.dmg": 9_000_000
}

def validate():
    print("[🧪] Validating release binaries...")
    folder = "Qmoi_apps"
    errors = 0
    for file, min_size in targets.items():
        path = os.path.join(folder, file)
        if os.path.exists(path):
            size = os.path.getsize(path)
            if size < min_size:
                print(f"[⚠️] {file} too small: {size} bytes")
                errors += 1
            else:
                print(f"[✅] {file} OK")
        else:
            print(f"[❌] Missing {file}")
            errors += 1
    if errors > 0:
        print(f"[❌] Validation failed with {errors} issues.")
        exit(1)
    print("[🎉] All binaries passed validation.")

if __name__ == "__main__":
    validate()
