#!/usr/bin/env python3
"""
Simple watcher wrapper around generate_project_manifests.py to run as a lightweight daemon.

Usage:
  python3 scripts/project_manifests_watcher.py

The watcher will call the generator every 30 seconds by default.
"""
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEN = ROOT / "scripts" / "generate_project_manifests.py"

if __name__ == '__main__':
    print("Starting project manifests watcher...")
    try:
        while True:
            subprocess.run(["python3", str(GEN), "--force"], check=False)
            time.sleep(30)
    except KeyboardInterrupt:
        print("Stopping watcher")
