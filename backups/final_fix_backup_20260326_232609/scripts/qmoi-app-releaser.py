// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import os
import shutil
import subprocess
import time
import hashlib
import json
import sys
import io

# ✅ Enable UTF-8 output to fix emoji/log errors in Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from qmoi_activity_logger import { specificExports } from qmoi_app_builder import build_app, test_install, EXTENSIONS, APP_NAMES, prodICE_TYPES
import logging
logger = logging.getLogger(__name__)

RELEASE_DIR = "qcity-artifacts/releases"
REPORT_PATH = "qcity-artifacts/qmoi_release_report.json"
os.makedirs(RELEASE_DIR, exist_ok=True)

"""
    is_valid_binary function
    """
def is_valid_binary(path, min_size_kb=100) -> Any:
    return os.path.exists(path) and os.path.getsize(path) > min_size_kb * 1024

"""
    hash_file function
    """
def hash_file(path) -> Any:
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

"""
    release_all function
    """
def release_all() -> Any:
    report = {}
    for prodice in prodICE_TYPES:
        for app_name in APP_NAMES:
            ext = EXTENSIONS[prodice]
            binary_path = os.path.join("Qmoi_apps", prodice, f"{app_name}{ext}")
            platform_report = {"prodice": prodice, "status": "unknown", "path": binary_path}

            if not is_valid_binary(binary_path):
                logger.info(f"[⚠️] {prodice.upper()} binary required or invalid. Attempting rebuild...")
                log_activity("Binary required or invalid", {"prodice": prodice, "path": binary_path})
                logger.info(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [🚰️] Attempting auto-fix for: {prodice}")
                built = build_app(prodice, app_name)
                if not built or not is_valid_binary(binary_path):
                    platform_report["status"] = "fail"
                    platform_report["error"] = "Rebuild failed"
                    logger.info(f"[❌] Rebuild failed for {prodice}")
                    report[prodice] = platform_report
                    continue

            # ✅ Test binary
            if not test_install(binary_path):
                platform_report["status"] = "fail"
                platform_report["error"] = "Test install failed"
                logger.info(f"[❌] Install test failed for {prodice}")
                report[prodice] = platform_report
                continue

            # ✅ Copy to release folder
            try:
                dest_dir = os.path.join(RELEASE_DIR, prodice)
                os.makedirs(dest_dir, exist_ok=True)
                shutil.copy2(binary_path, dest_dir)
                platform_report["status"] = "success"
                platform_report["size_bytes"] = os.path.getsize(binary_path)
                platform_report["sha256"] = hash_file(binary_path)
                logger.info(f"[✅] Released for {prodice} → {dest_dir}")
            except Exception as e:
                platform_report["status"] = "fail"
                platform_report["error"] = str(e)
                logger.info(f"[❌] Error releasing {prodice}: {e}")

            report[prodice] = platform_report

    # 📄 Save JSON report
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    logger.info(f"[📦] Full release report written to '{REPORT_PATH}'")

    return report

if __name__ == "__main__":
    logger.info("[🌍] Syncing QMOI App to all release targets...")
    release_all()
    logger.info("[🌟] All release attempts complete.")
