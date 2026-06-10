#!/usr/bin/env python3
"""
Always-on bulk resume automation for qmoi-enhanced.

This script keeps `resumefromhere.txt` auto-updated, synchronizes tasks from
`14.txt`, runs the bulk production fixer, refreshes the resume tracker, and
repeats continuously until the repository is clean.
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
AUTO_CONTINUE_SCRIPT = ROOT / "scripts" / "auto_continue_resumefromhere.py"
AUTO_UPDATE_SCRIPT = ROOT / "scripts" / "autoupdate_resume.py"
RESUME_FILE = ROOT / "resumefromhere.txt"
DEFAULT_INTERVAL = int(os.getenv("RESUME_AUTO_INTERVAL", "60"))
DEFAULT_MAX_RETRIES = int(os.getenv("RESUME_AUTO_RETRIES", "3"))

running = True


def handle_signal(signum, frame):
    global running
    print(f"Received signal {signum}; stopping always-on resume automation...")
    running = False


def parse_args():
    parser = argparse.ArgumentParser(description="Always-on resume automation loop")
    parser.add_argument("--interval", type=int, default=DEFAULT_INTERVAL, help="Seconds between automation cycles")
    parser.add_argument("--max-retries", type=int, default=DEFAULT_MAX_RETRIES, help="Retry count for the auto-continue script")
    parser.add_argument("--max-iterations", type=int, default=0, help="Number of iterations to run before exiting (0 = unlimited)")
    parser.add_argument("--until-clean", action="store_true", default=True, help="Stop automatically when repo becomes clean")
    parser.add_argument("--no-until-clean", action="store_false", dest="until_clean", help="Do not stop when repo becomes clean")
    parser.add_argument("--once", action="store_true", help="Run a single iteration and exit")
    parser.add_argument("--dry-run", action="store_true", help="Show the automation steps without executing them")
    return parser.parse_args()


def run_command(command: list[str], dry_run: bool = False) -> bool:
    print(f"Executing: {' '.join(command)}")
    if dry_run:
        return True
    try:
        subprocess.run(command, cwd=ROOT, check=True)
        return True
    except subprocess.CalledProcessError as exc:
        print(f"Command failed: {exc}")
        return False


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


def update_resume_header(dry_run: bool = False) -> bool:
    if not AUTO_UPDATE_SCRIPT.exists():
        print(f"Warning: {AUTO_UPDATE_SCRIPT} not found; resume header will not be refreshed.")
        return False
    return run_command([sys.executable, str(AUTO_UPDATE_SCRIPT)], dry_run=dry_run)


def run_auto_continue(max_retries: int, dry_run: bool = False) -> bool:
    if not AUTO_CONTINUE_SCRIPT.exists():
        print(f"Error: {AUTO_CONTINUE_SCRIPT} does not exist.")
        return False

    for attempt in range(1, max_retries + 1):
        print(f"[{datetime.now().isoformat()}] Running auto-continue cycle (attempt {attempt}/{max_retries})...")
        if run_command([sys.executable, str(AUTO_CONTINUE_SCRIPT)], dry_run=dry_run):
            return True
        if attempt < max_retries:
            time.sleep(5)
    return False


def summarize_state():
    marker_count = get_marker_count()
    if marker_count == 0:
        print("✅ resumefromhere.txt indicates a clean repository. No nonproduction markers remain.")
    elif marker_count > 0:
        print(f"⚠️  resumefromhere.txt reports {marker_count} nonproduction marker(s) remaining.")
    else:
        print("⚠️  resumefromhere.txt could not be parsed for marker count.")


def main() -> int:
    args = parse_args()
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    iteration = 0
    print("Starting always-on resume automation...")
    print(f"Interval: {args.interval}s")
    print(f"Max retries: {args.max_retries}")
    print("Mode: until clean" if args.until_clean else "Mode: continuous")

    while running:
        iteration += 1
        print(f"\n[{datetime.now().isoformat()}] Automation iteration {iteration} starting...")

        if not update_resume_header(dry_run=args.dry_run):
            print("Failed to refresh resumefromhere header before the cycle.")

        cycle_success = run_auto_continue(args.max_retries, dry_run=args.dry_run)
        update_resume_header(dry_run=args.dry_run)
        summarize_state()

        if args.once:
            print("--once requested; exiting after one automation cycle.")
            return 0

        marker_count = get_marker_count()
        if marker_count == 0 and args.until_clean:
            print("✅ Clean state achieved. Stopping always-on automation.")
            return 0

        if args.max_iterations and iteration >= args.max_iterations:
            print(f"Reached max iterations ({args.max_iterations}); exiting.")
            return 0

        if not running:
            break

        print(f"Sleeping for {args.interval}s before the next cycle...")
        time.sleep(args.interval)

    print("Always-on resume automation stopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
