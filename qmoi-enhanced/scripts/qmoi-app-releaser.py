import os
import shutil
import subprocess
import time
import hashlib
import json
import sys
import io

# ✅ Enable UTF-8 output to fix emoji/log errors in Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

from qmoi_activity_logger import log_activity
from qmoi_app_builder import (
    build_app,
    test_install,
    EXTENSIONS,
    APP_NAMES,
    DEVICE_TYPES,
)

RELEASE_DIR = "qcity-artifacts/releases"
REPORT_PATH = "qcity-artifacts/qmoi_release_report.json"
os.makedirs(RELEASE_DIR, exist_ok=True)


def is_valid_binary(path, min_size_kb=100):
    return os.path.exists(path) and os.path.getsize(path) > min_size_kb * 1024


def hash_file(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def release_all():
    report = {}
    for device in DEVICE_TYPES:
        for app_name in APP_NAMES:
            ext = EXTENSIONS[device]
            binary_path = os.path.join("Qmoi_apps", device, f"{app_name}{ext}")
            platform_report = {
                "device": device,
                "status": "unknown",
                "path": binary_path,
            }

            if not is_valid_binary(binary_path):
                print(
                    f"[⚠️] {device.upper()} binary missing or invalid. Attempting rebuild..."
                )
                log_activity(
                    "Binary missing or invalid", {"device": device, "path": binary_path}
                )
                print(
                    f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [🚰️] Attempting auto-fix for: {device}"
                )
                built = build_app(device, app_name)
                if not built or not is_valid_binary(binary_path):
                    platform_report["status"] = "fail"
                    platform_report["error"] = "Rebuild failed"
                    print(f"[❌] Rebuild failed for {device}")
                    report[device] = platform_report
                    continue

            # ✅ Test binary
            if not test_install(binary_path):
                platform_report["status"] = "fail"
                platform_report["error"] = "Test install failed"
                print(f"[❌] Install test failed for {device}")
                report[device] = platform_report
                continue

            # ✅ Copy to release folder
            try:
                dest_dir = os.path.join(RELEASE_DIR, device)
                os.makedirs(dest_dir, exist_ok=True)
                shutil.copy2(binary_path, dest_dir)
                platform_report["status"] = "success"
                platform_report["size_bytes"] = os.path.getsize(binary_path)
                platform_report["sha256"] = hash_file(binary_path)
                print(f"[✅] Released for {device} → {dest_dir}")
            except Exception as e:
                platform_report["status"] = "fail"
                platform_report["error"] = str(e)
                print(f"[❌] Error releasing {device}: {e}")

            report[device] = platform_report

    # 📄 Save JSON report
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"[📦] Full release report written to '{REPORT_PATH}'")

    return report


if __name__ == "__main__":
    print("[🌍] Syncing QMOI App to all release targets...")
    release_all()
    print("[🌟] All release attempts complete.")
