#!/usr/bin/env python3
"""QMOI execution orchestration utility."""
import argparse
import logging
import shlex
import subprocess
import sys
from pathlib import Path
from typing import Any, List, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


def execute_command(command: str, cwd: Optional[Path] = None) -> int:
    try:
        args = shlex.split(command)
        completed = subprocess.run(args, cwd=cwd or Path('.'), capture_output=True, text=True, check=True)
        logger.info('Command completed: %s', command)
        logger.debug('stdout: %s', completed.stdout)
        logger.debug('stderr: %s', completed.stderr)
        return completed.returncode
    except subprocess.CalledProcessError as exc:
        logger.error('Command failed (%s): %s', exc.returncode, exc.stderr.strip())
        return exc.returncode
    except OSError as exc:
        logger.error('Execution error: %s', exc)
        return 1


def run_task(task_name: str, args: Optional[List[str]] = None) -> int:
    args = args or []
    command = f'{task_name} ' + ' '.join(shlex.quote(arg) for arg in args)
    return execute_command(command)


def main() -> int:
    parser = argparse.ArgumentParser(description='QMOI execution helper')
    parser.add_argument('--command', help='Shell command to execute')
    parser.add_argument('--task', help='Named task to run')
    parser.add_argument('--workdir', default='.', help='Working directory for task execution')
    parser.add_argument('--args', nargs='*', default=[], help='Arguments for the named task')
    parsed = parser.parse_args()

    workdir = Path(parsed.workdir).resolve()
    if parsed.command:
        return execute_command(parsed.command, cwd=workdir)
    if parsed.task:
        return run_task(parsed.task, parsed.args)

    parser.print_help()
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        logger.info('Execution interrupted by user')
        sys.exit(0)
    except Exception as exc:
        logger.exception('Execution helper failed: %s', exc)
        sys.exit(1)
