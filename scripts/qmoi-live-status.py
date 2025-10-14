#!/usr/bin/env python3
"""
QMOI Live Status & Report Streamer
Streams and summarizes QMOI automation results, logs, and reports in real time.
Cloud-offload ready: can run in Colab, DagsHub, or any cloud environment.
Auto-restarts if killed (when running in cloud).
"""
import os
import sys
import time
import json
import threading
from pathlib import Path
import signal

LOG_FILE = Path(__file__).parent.parent / "logs" / "qmoi-master-automation.log"
REPORT_FILE = Path(__file__).parent.parent / "logs" / "master-automation-report.json"

should_run = True


def tail_file(filepath, callback, sleep=1):
    """Tail a file and call callback(line) for each new line."""
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        f.seek(0, os.SEEK_END)
        while should_run:
            line = f.readline()
            if not line:
                time.sleep(sleep)
                continue
            callback(line)


def print_log_summary():
    print("\n--- QMOI Live Log ---")

    def handle_line(line):
        print(line, end="")

    tail_file(LOG_FILE, handle_line)


def print_report_summary():
    print("\n--- QMOI Automation Report (Live) ---")
    last_summary = None
    while should_run:
        if REPORT_FILE.exists():
            try:
                with open(REPORT_FILE, "r", encoding="utf-8", errors="replace") as f:
                    report = json.load(f)
                summary = f"Success: {report.get('successful_fixes', 0)}/{report.get('total_platforms', 0)} | Duration: {report.get('duration_seconds', 0):.1f}s | Cloud: {report.get('cloud_optimized', False)}"
                if summary != last_summary:
                    print(f"[REPORT] {summary}")
                    last_summary = summary
            except Exception as e:
                print(f"[REPORT] Error reading report: {e}")
        time.sleep(5)


def handle_exit(signum, frame):
    global should_run
    should_run = False
    print("\n[QMOI Live Status] Exiting and printing final summary...")
    if REPORT_FILE.exists():
        with open(REPORT_FILE, "r", encoding="utf-8", errors="replace") as f:
            report = json.load(f)
        print("\nFinal Automation Report:")
        print(json.dumps(report, indent=2))
    sys.exit(0)


signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)


def main():
    print("QMOI Live Status & Report Streamer (cloud-offload ready)")
    print(f"Tailing log: {LOG_FILE}")
    print(f"Tailing report: {REPORT_FILE}")
    # Start log and report threads
    log_thread = threading.Thread(target=print_log_summary, daemon=True)
    report_thread = threading.Thread(target=print_report_summary, daemon=True)
    log_thread.start()
    report_thread.start()
    while should_run:
        time.sleep(1)


if __name__ == "__main__":
    main()
