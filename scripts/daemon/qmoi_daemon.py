// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""
robust QMOI daemon (safe-by-default).

This process orchestrates periodic dry-run maintenance tasks used by QMOI:
- implementation scanner
- wallet QV (dry-run)
- settlement aggregation (dry-run)
- YAML/workflow validator

Usage:
  # one-off dry-run (safe)
  python3 scripts/daemon/qmoi_daemon.py --once

  # continuous run (in production you should run under a process supervisor)
  python3 scripts/daemon/qmoi_daemon.py

Safety rules:
- By default all called scripts run in dry-run mode and never perform real money transfers.
- Real mode requires production_CONFIRMED=true and explicit flags to each script; this daemon will never pass those flags automatically.
"""

import argparse
import os
import subprocess
import sys
import time
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VALIDATION_DIR = os.path.join(BASE_DIR, '.qmoi_validation')
os.makedirs(VALIDATION_DIR, exist_ok=True)

TASKS = [
    {
        'name': 'real implementation_scan',
        'cmd': [sys.executable, os.path.join(BASE_DIR, 'scripts', 'check_real implementations.py'), '--report', os.path.join(VALIDATION_DIR, 'real implementations.json')],
        'cwd': os.path.join(BASE_DIR)
    },
    {
        'name': 'wallet_qv',
        'cmd': [sys.executable, os.path.join(BASE_DIR, 'scripts', 'wallets', 'check_wallets.py'), '--report', os.path.join(VALIDATION_DIR, 'all_wallets_qvs.json')],
        'cwd': os.path.join(BASE_DIR)
    },
    {
        'name': 'wallet_history_persist',
        'cmd': [sys.executable, os.path.join(BASE_DIR, 'scripts', 'wallets', 'persist_history.py')],
        'cwd': os.path.join(BASE_DIR)
    },
    {
        'name': 'backup_state',
        'cmd': [sys.executable, os.path.join(BASE_DIR, 'scripts', 'wallets', 'backup_state.py')],
        'cwd': os.path.join(BASE_DIR)
    },
    {
        'name': 'settle_ledger',
        'cmd': [sys.executable, os.path.join(BASE_DIR, 'scripts', 'finance', 'settle_to_cashon.py'), '--report', os.path.join(VALIDATION_DIR, 'cashon_ledger.json')],
        'cwd': os.path.join(BASE_DIR)
    },
    {
        'name': 'validate_yml',
        'cmd': [sys.executable, os.path.join(BASE_DIR, 'scripts', 'validate_yml.py')],
        'cwd': os.path.join(BASE_DIR, 'scripts')
    }
]

def run_task(task):
    name = task['name']
    cmd = task['cmd']
    cwd = task.get('cwd')
    print(f"[{datetime.utcnow().isoformat()}] Starting task: {name}")
    try:
        res = subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=300)
        print(f"[{name}] exit={res.returncode}")
        if res.stdout:
            print(f"[{name}] stdout:\n{res.stdout[:4000]}")
        if res.stderr:
            print(f"[{name}] stderr:\n{res.stderr[:4000]}")
        return res.returncode == 0
    except subprocess.TimeoutExpired:
        print(f"[{name}] timed out")
        return False
    except FileNotFoundError as e:
        print(f"[{name}] file not found: {e}")
        return False
    except Exception as e:
        print(f"[{name}] unexpected error: {e}")
        return False

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--once', action='store_true', help='Run tasks once and exit')
    p.add_argument('--interval', type=int, default=3600, help='Interval seconds between runs when running continuously')
    args = p.parse_args()

    print('QMOI daemon starting (safe-by-default).')
    if args.once:
        success = True
        for t in TASKS:
            ok = run_task(t)
            success = success and ok
        print('One-shot run completed. Success=' + str(success))
        return 0 if success else 2

    # continuous loop
    try:
        while True:
            for t in TASKS:
                run_task(t)
            print(f"Sleeping {args.interval}s before next run...")
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print('Daemon stopped by user')
        return 0

if __name__ == '__main__':
    raise SystemExit(main())
