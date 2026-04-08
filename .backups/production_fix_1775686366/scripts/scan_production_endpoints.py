#!/usr/bin/env python3
"""Wrapper for the existing production marker scanner.

This script exists to preserve older entry points that refer to
scripts/scan_production_endpoints.py.
"""

import sys
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
TARGET_SCRIPT = SCRIPT_DIR / 'scan_nonproduction_endpoints.py'

if not TARGET_SCRIPT.exists():
    print(f"Error: missing required helper script: {TARGET_SCRIPT}", file=sys.stderr)
    sys.exit(1)

args = []
for arg in sys.argv[1:]:
    if arg in ('--aggressive', '--all-files'):
        continue
    if arg == '--verify':
        continue
    args.append(arg)

# map legacy aggressive mode to include whitelist
if '--aggressive' in sys.argv or '--all-files' in sys.argv:
    if '--include-whitelist' not in args:
        args.append('--include-whitelist')

cmd = [sys.executable, str(TARGET_SCRIPT)] + args
exit_code = subprocess.call(cmd)
sys.exit(exit_code)
