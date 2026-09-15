#!/usr/bin/env python3
"""QMOI build driver: find and run platform build scripts.

This script scans common locations for build scripts (build-*.sh, build-*.py, package.json) and runs
them in dry-run mode by default. Use --apply to actually execute.
"""
import argparse
import logging
import subprocess
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger('qmoi-build')


def discover_build_scripts(root: Path):
    patterns = ['**/build-*.sh', '**/build-*.py', '**/build.sh', '**/package.json', '**/Makefile']
    found = []
    for pat in patterns:
        for p in root.glob(pat):
            found.append(p)
    return sorted(set(found))


def run_script(path: Path, apply: bool = False):
    logger.info('Found build artifact: %s', path)
    if path.name == 'package.json':
        cmd = ['bash', '-lc', f'cd "{path.parent}" && npm ci && npm run build || true']
    elif path.suffix == '.sh' or path.name == 'build.sh':
        cmd = ['bash', str(path)]
    elif path.suffix == '.py':
        cmd = ['python', str(path)]
    elif path.name == 'Makefile':
        cmd = ['bash', '-lc', f'cd "{path.parent}" && make build || true']
    else:
        logger.info('No runner for %s', path)
        return

    if not apply:
        logger.info('Dry-run: would execute: %s', ' '.join(cmd))
        return

    try:
        subprocess.check_call(cmd)
    except Exception:
        logger.exception('Build command failed for %s', path)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--apply', action='store_true', help='Actually run build commands')
    args = p.parse_args()

    root = Path('.').resolve()
    scripts = discover_build_scripts(root)
    if not scripts:
        logger.info('No build scripts discovered')
        return
    for s in scripts:
        run_script(s, apply=args.apply)


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Attempt to find and run build scripts for known platforms.

This script scans the repository for common build entrypoints (Dockerfile, package.json, build scripts)
and runs platform-specific commands in dry-run or apply mode.
"""
import argparse
import os
import subprocess
from pathlib import Path

KNOWN_BUILD_CMDS = [
    ("package.json", "npm install && npm run build"),
    ("Dockerfile", "docker build -t qmoi-app ."),
    ("setup.py", "python setup.py sdist bdist_wheel"),
    ("build-qmoi.sh", "bash build-qmoi.sh"),
]


def find_and_run(root: Path, dry_run=True):
    hits = []
    for p in root.rglob('*'):
        if p.is_file():
            name = p.name
            for marker, cmd in KNOWN_BUILD_CMDS:
                if name == marker or marker in name:
                    hits.append((p, cmd))
    for p, cmd in hits:
        print(f'Found build marker {p} -> would run: {cmd}')
        if not dry_run:
            subprocess.call(cmd, shell=True, cwd=str(p.parent))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', default=True)
    args = parser.parse_args()
    root = Path('.')
    find_and_run(root, dry_run=args.dry_run)


if __name__ == '__main__':
    main()
