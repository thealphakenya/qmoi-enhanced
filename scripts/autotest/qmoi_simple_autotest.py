#!/usr/bin/env python3
"""
Minimal QMOI autotest runner for repository validation.
This script is designed to run with a simple environment and provide a pass/fail signal.
"""

import os
import sys
import shutil
import logging
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
LOG_FILE = Path(__file__).resolve().parent / 'qmoi_simple_autotest.log'

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger('qmoi_simple_autotest')


def log_result(message: str) -> None:
    logger.info(message)
    try:
        with LOG_FILE.open('a', encoding='utf-8') as f:
            f.write(f'[{datetime.now().isoformat()}] {message}\n')
    except OSError:
        pass


def check_python_version() -> bool:
    version = sys.version_info
    log_result(f'Python version: {version.major}.{version.minor}.{version.micro}')
    return version >= (3, 8)


def check_repository_root() -> bool:
    exists = ROOT.exists()
    log_result(f'Repository root exists: {exists}')
    return exists


def check_package_json() -> bool:
    pkg = ROOT / 'package.json'
    exists = pkg.exists()
    log_result(f'package.json present: {exists}')
    return exists


def check_command_available(command: str) -> bool:
    available = shutil.which(command) is not None
    log_result(f'Command {command} available: {available}')
    return available


def run_command(command: list[str]) -> bool:
    try:
        completed = subprocess.run(
            command,
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            timeout=60,
        )
        log_result(f'Ran command: {" ".join(command)} (exit {completed.returncode})')
        if completed.stdout:
            log_result(f'stdout: {completed.stdout.strip()}')
        if completed.stderr:
            log_result(f'stderr: {completed.stderr.strip()}')
        return completed.returncode == 0
    except Exception as exc:
        log_result(f'Command failed: {command} ({exc})')
        return False


def main() -> int:
    all_ok = True

    if not check_repository_root():
        return 1

    all_ok &= check_python_version()

    if check_package_json() and check_command_available('npm'):
        all_ok &= run_command(['npm', '--version'])
    else:
        log_result('Skipping npm checks because npm is not available.')

    return 0 if all_ok else 1


if __name__ == '__main__':
    sys.exit(main())
