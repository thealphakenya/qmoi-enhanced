#!/usr/bin/env python3
"""scripts/push_all_changes.py

Safe workspace snapshot + git commit/push helper.

Usage:
    python scripts/push_all_changes.py [--branch BRANCH] [--force] [--message MSG] [--no-backup]

Features:
- Creates a timestamped tar.gz backup in .push_backups/ unless --no-backup is specified.
- Stages all changes, including untracked files.
- Creates a commit with a default message containing the timestamp and diff summary.
- Pushes to the provided branch (defaults to current branch) to origin.
- Can force push if necessary (--force). Use force with caution.

This script is conservative: it will not delete uncommitted changes, and it will stop if git reports merge conflicts during commit.
"""
import argparse
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
import tarfile

ROOT = Path.cwd()
BACKUP_DIR = ROOT / '.push_backups'


def run(cmd, **kwargs):
    print(f"$ {' '.join(cmd)}")
    return subprocess.run(cmd, check=False, text=True, capture_output=True, **kwargs)


def create_backup(dest_dir: Path):
    dest_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    tar_path = dest_dir / f'workspace_backup_{ts}.tar.gz'
    with tarfile.open(tar_path, 'w:gz') as tar:
        # Exclude .git to keep backup size manageable
        def filter_fn(tarinfo):
            if tarinfo.name.startswith('.git'):
                return None
            return tarinfo
        tar.add('.', arcname='workspace', filter=filter_fn)
    print(f'Created backup: {tar_path}')
    return tar_path


def get_current_branch():
    r = run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'])
    if r.returncode != 0:
        print('Error: not a git repository or HEAD unavailable')
        sys.exit(1)
    return r.stdout.strip()


def git_add_all():
    r = run(['git', 'add', '--all'])
    if r.returncode != 0:
        print('git add failed:', r.stderr)
        sys.exit(1)


def git_status_short():
    r = run(['git', 'status', '--porcelain'])
    return r.stdout


def git_commit(message: str):
    r = run(['git', 'commit', '-m', message])
    if r.returncode != 0:
        # If nothing to commit, that's fine
        if 'nothing to commit' in (r.stderr or '') or 'nothing to commit' in (r.stdout or ''):
            print('Nothing to commit')
            return False
        print('git commit failed:', r.stderr)
        # show git status for context
        print(run(['git', 'status']).stdout)
        sys.exit(1)
    return True


def git_push(branch: str, force: bool = False):
    cmd = ['git', 'push', 'origin', f'HEAD:{branch}']
    if force:
        cmd.insert(2, '--force')
    r = run(cmd)
    if r.returncode != 0:
        print('git push failed:', r.stderr)
        sys.exit(1)
    print(r.stdout)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--branch', help='Remote branch to push to (defaults to current branch)')
    p.add_argument('--force', action='store_true', help='Force push')
    p.add_argument('--message', help='Commit message (defaults to auto message)')
    p.add_argument('--no-backup', action='store_true', help='Skip creating a tarball backup')
    args = p.parse_args()

    branch = args.branch or get_current_branch()

    if not args.no_backup:
        backup = create_backup(BACKUP_DIR)
    else:
        backup = None

    status = git_status_short()
    print('Working tree status:\n', status)

    # Stage everything
    git_add_all()

    # If there are changes, commit
    auto_message = args.message or f'checkpoint: autosync snapshot {datetime.utcnow().isoformat()}'
    committed = git_commit(auto_message)

    # push
    git_push(branch, force=args.force)

    print('\nPush complete.')
    if backup:
        print(f'Backup saved at: {backup}')


if __name__ == '__main__':
    main()
