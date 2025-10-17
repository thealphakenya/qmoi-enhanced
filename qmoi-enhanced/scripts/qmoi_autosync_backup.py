#!/usr/bin/env python3
"""Simple autosync backup: tars project folder to .qmoi/backups/<timestamp>.tar.gz and optionally commits/pushes to remote.

Usage:
  python scripts/qmoi_autosync_backup.py [--push]

If --push is provided, this script will create a git commit with the backup added to a branch 'qmoi/backups' and push it using the qmoi git wrapper.
"""
import argparse
import tarfile
import time
from pathlib import Path
import subprocess
import os


def make_backup(root: Path) -> Path:
    now = time.strftime('%Y%m%dT%H%M%S')
    outdir = root / '.qmoi' / 'backups'
    outdir.mkdir(parents=True, exist_ok=True)
    outfile = outdir / f'backup_{now}.tar.gz'
    with tarfile.open(outfile, 'w:gz') as tar:
        # exclude .git and .qmoi/backups to avoid recursion
        def exclude(tarinfo):
            if '.git/' in tarinfo.name or '.qmoi/backups/' in tarinfo.name:
                return None
            return tarinfo

        tar.add(str(root), arcname='.', filter=exclude)
    return outfile


def git_push_backup(backup_file: Path):
    # copy backup into a tracking folder and commit
    import shutil
    repo_root = Path('.').resolve()
    track_dir = repo_root / '.qmoi' / 'backup_repo'
    track_dir.mkdir(parents=True, exist_ok=True)
    dest = track_dir / backup_file.name
    shutil.copy2(backup_file, dest)
    # initialize git if needed
    if not (track_dir / '.git').exists():
        subprocess.check_call(['git', 'init'], cwd=str(track_dir))
    subprocess.check_call(['git', 'add', '.'], cwd=str(track_dir))
    subprocess.check_call(['git', 'commit', '-m', f'QMOI backup {backup_file.name}'], cwd=str(track_dir))
    # push using qmoi git wrapper to ensure credentials
    wrapper = ['python', str(Path('scripts') / 'qmoi_git_wrapper.py'), 'push', '--set-upstream', 'origin', 'qmoi/backups']
    subprocess.check_call(wrapper, cwd=str(track_dir))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--push', action='store_true', help='Push backup to remote')
    args = p.parse_args()

    root = Path('.').resolve()
    b = make_backup(root)
    print(f'Created backup {b}')
    if args.push:
        try:
            git_push_backup(b)
        except Exception as e:
            print('Push failed:', e)


if __name__ == '__main__':
    main()
