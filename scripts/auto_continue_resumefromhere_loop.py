#!/usr/bin/env python3
"""
Continuous auto-update monitor for resumefromhere.txt.

This script runs `scripts/auto_continue_resumefromhere.py` repeatedly until the
repository is production-clean. It only pauses when all nonproduction markers
are cleared and the scan reports a clean state.
"""

import argparse
import os
import re
import signal
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTINUE_SCRIPT = ROOT / "scripts" / "auto_continue_resumefromhere.py"
RESUME_FILE = ROOT / "resumefromhere.txt"
DEFAULT_INTERVAL = int(os.getenv("RESUME_MONITOR_INTERVAL", "60"))
DEFAULT_MAX_RETRIES = int(os.getenv("RESUME_MONITOR_RETRIES", "2"))

running = True


def handle_signal(signum, frame):
    global running
    print(f"Received signal {signum}; stopping continuous bulk resume monitor...")
    running = False


def parse_args():
    parser = argparse.ArgumentParser(description="Continuous bulk resume monitor")
    parser.add_argument("--interval", type=int, default=DEFAULT_INTERVAL, help="Seconds between bulk auto-continue runs")
    parser.add_argument("--max-retries", type=int, default=DEFAULT_MAX_RETRIES, help="Retry count for the auto-continue script")
    parser.add_argument("--max-iterations", type=int, default=0, help="Stop after this many iterations (0 = unlimited)")
    parser.add_argument("--until-clean", action="store_true", default=True, help="Continue until the resume tracker reports a clean scan")
    parser.add_argument("--no-until-clean", action="store_false", dest="until_clean", help="Do not stop automatically when the scan is clean")
    parser.add_argument("--once", action="store_true", help="Run only one iteration and exit")
    return parser.parse_args()


def get_marker_count() -> int:
    if not RESUME_FILE.exists():
        return -1
    try:
        text = RESUME_FILE.read_text(encoding="utf-8", errors="ignore")
        match = re.search(r"Files with nonproduction markers:\s*(\d+)", text)
        if match:
            return int(match.group(1))
        if re.search(r"Status:\s*✅ production-ready", text):
            return 0
    except Exception:
        pass
    return -1


def run_continue_script(max_retries: int) -> bool:
    if not CONTINUE_SCRIPT.exists():
        print(f"Error: {CONTINUE_SCRIPT} does not exist.")
        return False

    for attempt in range(1, max_retries + 1):
        try:
            print(f"[{datetime.now().isoformat()}] Running auto-continue script (attempt {attempt}/{max_retries})...")
            # Refresh resumefromhere header before invoking the continue script
            AUTUPDATE = ROOT / 'scripts' / 'autoupdate_resume.py'
            if AUTUPDATE.exists():
                try:
                    subprocess.run([sys.executable, str(AUTUPDATE)], cwd=ROOT, check=True)
                except Exception:
                    print('Warning: autoupdate_resume.py failed; proceeding to continue script')

            subprocess.run([sys.executable, str(CONTINUE_SCRIPT)], cwd=ROOT, check=True)
            return True
        except subprocess.CalledProcessError as exc:
            print(f"Auto-continue failed on attempt {attempt}: {exc}")
            if attempt < max_retries:
                time.sleep(5)
    return False


def main() -> int:
    args = parse_args()
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    iteration = 0
    print("Starting continuous bulk resume monitor...")
    print(f"Interval: {args.interval}s")
    print("Mode: continue until clean" if args.until_clean else "Mode: run continuously")

    while running:
        iteration += 1
        print(f"\n[{datetime.now().isoformat()}] Bulk iteration {iteration} starting...")
        success = run_continue_script(args.max_retries)

        marker_count = get_marker_count()
        if success:
            if marker_count == 0:
                print("✅ Repository is clean: no nonproduction markers found.")
                if args.until_clean or args.once:
                    print("Stopping continuous monitor because work is complete.")
                    return 0
                print("Continuing because monitor is configured to run continuously.")
            elif marker_count > 0:
                print(f"⚠️  Bulk scan reports {marker_count} nonproduction marker(s) remaining.")
        else:
            print("⚠️  Auto-continue failed; retrying on next interval.")

        if args.once:
            print("--once requested; exiting after a single iteration.")
            return 0

        if args.max_iterations and iteration >= args.max_iterations:
            print(f"Reached max iterations ({args.max_iterations}); exiting.")
            return 0

        print(f"Sleeping for {args.interval}s before the next bulk iteration...")
        time.sleep(args.interval)

    print("Continuous bulk resume monitor stopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
