#!/usr/bin/env python3
"""
QMOI Automation Autotest: Tests all automation, dashboard, notification, and QCity features.
"""
import requests
import subprocess
import logging
import time
from pathlib import Path


def test_endpoint(url):
    try:
        r = requests.get(url)
        return r.status_code == 200, r.text
    except Exception as e:
        return False, str(e)


def test_script(cmd):
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=120
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)


def main():
    log_file = Path("logs/qmoi_automation_autotest.log")
    log_file.parent.mkdir(exist_ok=True)
    logging.basicConfig(filename=log_file, level=logging.INFO)
    results = []
    # Test dashboard endpoints
    endpoints = [
        "http://localhost:3010/api/stats",
        "http://localhost:3010/api/update-history",
        "http://localhost:3010/api/app-version",
        "http://localhost:3010/api/changelog",
    ]
    for url in endpoints:
        ok, out = test_endpoint(url)
        results.append((url, ok, out))
        logging.info(f"Endpoint {url}: {ok}\n{out}")
    # Test notification manager
    ok, out = test_script(
        'python scripts/qmoi_notification_manager.py "Autotest" "QMOI autotest notification"'
    )
    results.append(("notification_manager", ok, out))
    logging.info(f"Notification manager: {ok}\n{out}")
    # Test QCity automation
    ok, out = test_script("python scripts/qmoi-qcity-automatic.py")
    results.append(("qcity_automation", ok, out))
    logging.info(f"QCity automation: {ok}\n{out}")
    # Test auto-push
    ok, out = test_script("node scripts/qmoi-auto-push.js")
    results.append(("auto_push", ok, out))
    logging.info(f"Auto-push: {ok}\n{out}")
    # Test auto-git-update
    ok, out = test_script("node scripts/auto-git-update.js")
    results.append(("auto_git_update", ok, out))
    logging.info(f"Auto-git-update: {ok}\n{out}")
    # Send summary notification
    summary = "\n".join([f"{name}: {ok}" for name, ok, _ in results])
    subprocess.run(
        f'python scripts/qmoi_notification_manager.py "QMOI Automation Autotest Summary" "{summary}"',
        shell=True,
    )


if __name__ == "__main__":
    main()
