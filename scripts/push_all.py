#!/usr/bin/env python3
"""
scripts/push_all.py

Snapshot workspace, stage all changes, create a numbered commit for each successful push,
and push to the current branch on origin. Creates a backup tarball under .push_backups/.

Usage:
  python scripts/push_all.py [--skip-backup] [--force] [--message "optional message"]

Behavior:
  - Creates a backup of the workspace (except .git) under .push_backups/YYYYMMDD_HHMMSS.tar.gz
  - Stages all changes (git add -A), tries to commit with message 'push N: <message>' where N is
    the next push number (counts only successful push commits recorded in .push_counter)
  - Pushes to origin on the current branch
  - On success increments the counter and writes to .push_counter

This script is conservative: it will not force-overwrite remote branches unless --force is given.
"""
import argparse
import os
import subprocess
import sys
import tarfile
from datetime import datetime
from pathlib import Path

ROOT = Path.cwd()
BACKUP_DIR = ROOT / '.push_backups'
COUNTER_FILE = ROOT / '.push_counter'


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.run(cmd, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    else:
        return subprocess.run(cmd, shell=True, check=check)


def create_backup(skip_backup: bool):
    if skip_backup:
        print('Skipping backup as requested')
        return None
    BACKUP_DIR.mkdir(exist_ok=True)
    ts = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    archive = BACKUP_DIR / f'workspace_backup_{ts}.tar.gz'
    print(f'Creating backup {archive} (this may take a moment)')
    with tarfile.open(archive, 'w:gz') as tar:
        # exclude .git and .push_backups
        def exclude(tarinfo):
            p = Path(tarinfo.name)
            if str(p).startswith('.git') or str(p).startswith('.push_backups'):
                return None
            return tarinfo

        for p in ROOT.iterdir():
            if p.name in ['.git', '.push_backups']:
                continue
            tar.add(p, arcname=p.name, filter=exclude)
    print('Backup complete:', archive)
    return archive


def get_current_branch():
    res = run('git rev-parse --abbrev-ref HEAD', capture=True)
    return res.stdout.strip()


def read_counter():
    if COUNTER_FILE.exists():
        try:
            return int(COUNTER_FILE.read_text().strip())
        except Exception:
            return 0
    return 0


def write_counter(n: int):
    COUNTER_FILE.write_text(str(n))


def next_commit_message(base_msg: str):
    n = read_counter() + 1
    return f'push {n}: {base_msg}', n


def stage_all():
    run('git add -A')


def has_changes():
    res = run('git status --porcelain', capture=True)
    return bool(res.stdout.strip())


def commit_and_push(message: str, force: bool):
    try:
        run(f'git commit -m "{message}"')
    except subprocess.CalledProcessError:
        print('No commit created (no staged changes).')
        return False

    branch = get_current_branch()
    push_cmd = f'git push origin HEAD:{branch}'
    if force:
        push_cmd += ' --force'
    print('Pushing with:', push_cmd)
    try:
        run(push_cmd)
        return True
    except subprocess.CalledProcessError as e:
        print('Push failed:', e)
        return False


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--skip-backup', action='store_true')
    p.add_argument('--force', action='store_true')
    p.add_argument('--message', default='workspace sync')
    args = p.parse_args()

    # create backup
    archive = create_backup(args.skip_backup)

    # ensure git repo
    if not (ROOT / '.git').exists():
        print('No .git found in the current directory. Aborting.')
        sys.exit(1)

    # stage all
    stage_all()

    if not has_changes():
        print('No changes to commit.')
        sys.exit(0)

    msg, n = next_commit_message(args.message)
    ok = commit_and_push(msg, args.force)
    if ok:
        write_counter(n)
        print(f'Push succeeded and counter updated to {n}')
    else:
        print('Push failed. Counter not updated.')


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""scripts/push_all.py

Snapshot workspace, create backup, stage all changes, commit with incremental numbering
for successful pushes, and push to the current branch on origin.

Behavior:
- Creates a timestamped tar.gz backup in .push_backups/ unless --skip-backup is used.
- Stages all changes (git add -A).
- Commits with message "auto-push N: <short-summary>" where N is the next sequential successful push number.
- Pushes to origin on the current branch.
- On success, records the push number in .push_backups/last_push_number and prints summary.

Usage:
    python scripts/push_all.py [--skip-backup] [--force] [--message "summary message"]

Note: This script expects git to be configured and the current directory to be inside a git repo.
"""
import argparse
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
import tarfile


ROOT = Path.cwd()
BACKUP_DIR = ROOT / '.push_backups'
LAST_PUSH_FILE = BACKUP_DIR / 'last_push_number'


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.run(cmd, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    else:
        return subprocess.run(cmd, shell=True, check=check)


def create_backup(skip=False):
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    if skip:
        print('Skipping backup as requested')
        return None
    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    archive = BACKUP_DIR / f'workspace_backup_{ts}.tar.gz'
    print(f'Creating backup at {archive} ...')
    with tarfile.open(archive, 'w:gz') as tf:
        # exclude .git and .push_backups
        def tar_filter(tarinfo):
            if tarinfo.name.startswith('.git') or tarinfo.name.startswith('.push_backups'):
                return None
            return tarinfo

        for p in ROOT.iterdir():
            if p.name in ['.git', '.push_backups']:
                continue
            tf.add(p, arcname=p.name, filter=tar_filter)
    print('Backup completed')
    return archive


def get_current_branch():
    res = run('git rev-parse --abbrev-ref HEAD', capture=True)
    if res.returncode != 0:
        raise RuntimeError('Failed to get current git branch: ' + res.stderr)
    return res.stdout.strip()


def read_last_push_number():
    try:
        return int(LAST_PUSH_FILE.read_text().strip())
    except Exception:
        return 0


def write_last_push_number(n: int):
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    LAST_PUSH_FILE.write_text(str(n))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--skip-backup', action='store_true')
    p.add_argument('--force', action='store_true', help='force push (use git push --force)')
    p.add_argument('--message', default='', help='optional short summary to include in commit message')
    args = p.parse_args()

    try:
        branch = get_current_branch()
    except Exception as e:
        print('Error determining git branch:', e)
        sys.exit(1)

    # Create backup
    try:
        archive = create_backup(skip=args.skip_backup)
    except Exception as e:
        print('Backup failed:', e)
        sys.exit(1)

    # Stage all changes
    print('Staging all changes...')
    try:
        run('git add -A')
    except subprocess.CalledProcessError as e:
        print('git add failed:', e)
        sys.exit(1)

    # Check if there is anything to commit
    status = run('git status --porcelain', capture=True)
    if status.stdout.strip() == '':
        print('No changes to commit. Exiting.')
        sys.exit(0)

    # Compute next push number (based on last successful push)
    last = read_last_push_number()
    next_num = last + 1

    # Build commit message
    short = args.message.strip() or 'auto-push'
    commit_msg = f'push {next_num}: {short}'

    try:
        run(f'git commit -m "{commit_msg}"')
    except subprocess.CalledProcessError as e:
        print('git commit failed:', e)
        sys.exit(1)

    # Push
    push_cmd = f'git push origin HEAD:{branch}'
    if args.force:
        push_cmd += ' --force'
    print('Pushing to origin...')
    try:
        run(push_cmd)
    except subprocess.CalledProcessError as e:
        print('git push failed:', e)
        # Try to roll back the commit if push failed
        print('Attempting to reset last commit to avoid duplicated local commits...')
        try:
            run('git reset --soft HEAD~1')
        except Exception:
            pass
        sys.exit(1)

    # On success, record push number
    write_last_push_number(next_num)

    print(f'Successfully pushed as "{commit_msg}" to branch {branch}')
    if archive:
        print(f'Backup stored at {archive}')


if __name__ == '__main__':
    main()
