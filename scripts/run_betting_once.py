#!/usr/bin/env python3
"""
Run the QMOI betting system for a short duration and then stop it.
"""
import subprocess
import time
import signal
import sys
import os

SCRIPT = 'scripts/qmoi_automated_betting_system.py'

# For quick dev runs, set short intervals and keep simulated mode by default
env_updates = {
    'QMOI_BETTING_INTERVAL': os.getenv('QMOI_BETTING_INTERVAL', '3'),
    'QMOI_ANALYSIS_INTERVAL': os.getenv('QMOI_ANALYSIS_INTERVAL', '3'),
    # By default, do not use real funds unless explicitly enabled by env vars
    'QMOI_USE_REAL_FUNDS': os.getenv('QMOI_USE_REAL_FUNDS', 'false'),
}

if __name__ == '__main__':
    print('Starting betting system (short run)...')
    proc = subprocess.Popen([sys.executable, SCRIPT], env={**os.environ, **env_updates})
    try:
        # Let it run for a short period to perform one or two cycles
        time.sleep(12)
    except KeyboardInterrupt:
        print('Interrupted by user, terminating..')
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
        print('Betting system run complete')
