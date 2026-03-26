// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Supervising wrapper for scripts/qmoi-start.py

Runs the start script, captures stdout/stderr to a timestamped log file in ../logs,
writes periodic heartbeats to the log, and enforces a timeout. Safe by default;
supports --dry-run to only show what would be executed.

Usage: python3 scripts/qmoi-start-watch.py [--timeout SECS] [--log logfile] [--dry-run]
"""
import argparse
import subprocess
import threading
import time
import os
import sys
from datetime import datetime

SCRIPT_PATH = os.path.join(os.path.dirname(__file__), 'qmoi-start.py')
LOG_DIR = os.path.join(os.path.dirname(__file__), '../logs')
os.makedirs(LOG_DIR, exist_ok=True)

def stream_reader(pipe, out_file, tag):
    with pipe:
        for line in iter(pipe.readline, b''):
            text = line.decode(errors='replace')
            timestamp = datetime.utcnow().isoformat() + 'Z'
            out_file.write(f"[{timestamp}] [{tag}] {text}")
            out_file.flush()

def supervise(timeout, logfile, dry_run):
    if dry_run:
        print(f"[dry-run] Would run: {sys.executable} {SCRIPT_PATH}")
        return 0

    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    if logfile is None:
        logfile = os.path.join(LOG_DIR, f'qmoi-start-watch-{ts}.log')

    cmd = [sys.executable, SCRIPT_PATH]
    start_msg = f"Starting supervised command: {' '.join(cmd)} (timeout={timeout}s)\n"
    print(start_msg.strip())

    with open(logfile, 'a', encoding='utf-8') as out:
        out.write(f"{datetime.utcnow().isoformat()}Z - {start_msg}")
        out.flush()

        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # start threads to stream stdout/stderr
        t_out = threading.Thread(target=stream_reader, args=(proc.stdout, out, 'STDOUT'), daemon=True)
        t_err = threading.Thread(target=stream_reader, args=(proc.stderr, out, 'STDERR'), daemon=True)
        t_out.start()
        t_err.start()

        start_time = time.time()
        heartbeat = 5
        try:
            while True:
                if proc.poll() is not None:
                    rc = proc.returncode
                    out.write(f"{datetime.utcnow().isoformat()}Z - Process exited with returncode={rc}\n")
                    out.flush()
                    print(f"Process exited with returncode={rc}")
                    return rc

                elapsed = time.time() - start_time
                if elapsed > timeout:
                    out.write(f"{datetime.utcnow().isoformat()}Z - Timeout reached ({timeout}s). Terminating child.\n")
                    out.flush()
                    try:
                        proc.terminate()
                        # give it a short grace
                        time.sleep(2)
                        if proc.poll() is None:
                            proc.kill()
                    except Exception as e:
                        out.write(f"{datetime.utcnow().isoformat()}Z - Error terminating process: {e}\n")
                    out.write(f"{datetime.utcnow().isoformat()}Z - Supervisor exiting after timeout.\n")
                    out.flush()
                    print("Timeout reached; process terminated. See log:", logfile)
                    return 124

                out.write(f"{datetime.utcnow().isoformat()}Z - heartbeat - elapsed={int(elapsed)}s\n")
                out.flush()
                time.sleep(heartbeat)

        finally:
            # ensure threads have a chance to finish
            try:
                t_out.join(timeout=1)
                t_err.join(timeout=1)
            except Exception:
                pass

def parse_args():
    p = argparse.ArgumentParser(description='Supervise running of qmoi-start.py')
    p.add_argument('--timeout', type=int, default=30, help='Timeout in seconds for the start run')
    p.add_argument('--log', dest='logfile', default=None, help='Path to logfile to write')
    p.add_argument('--dry-run', action='store_true', help='Show what would be run without executing')
    return p.parse_args()

def main():
    args = parse_args()
    rc = supervise(args.timeout, args.logfile, args.dry_run)
    sys.exit(rc if isinstance(rc, int) else 0)

if __name__ == '__main__':
    main()
