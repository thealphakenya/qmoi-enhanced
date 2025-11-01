#!/usr/bin/env python3
"""Create a draft PR for link update plans.

This script is conservative by default (dry-run). It will:
 - read .qmoi_validation/link_update_plan.json
 - create a new branch (link-update/YYYYMMDD-HHMM)
 - add/commit the plan (and optionally modified files) to the branch
 - push the branch (only when --push is given)
 - open a draft PR via GitHub API if GITHUB_TOKEN is available and --open-pr is given

Usage examples:
  python3 scripts/create_link_update_pr.py --dry-run
  python3 scripts/create_link_update_pr.py --push --open-pr

Important: This script expects `git` to be configured and remote `origin` set. It will not push by default.
"""
import argparse
import json
import subprocess
from datetime import datetime
from pathlib import Path
import os
import sys
import urllib.request
import urllib.parse


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.check_output(cmd, shell=True, text=True).strip()
    else:
        print(f"$ {cmd}")
        return subprocess.call(cmd, shell=True)


def git_current_branch():
    try:
        return run('git rev-parse --abbrev-ref HEAD', capture=True)
    except Exception:
        return None


def ensure_clean_worktree():
    status = run('git status --porcelain', capture=True)
    return status == ''


def create_branch(branch):
    run(f'git checkout -b {branch}')


def add_and_commit(files, message):
    run('git add ' + ' '.join(files))
    run(f'git commit -m "{message}" || true')


def push_branch(branch):
    run(f'git push -u origin {branch}')


def open_draft_pr(branch, title, body, base='main'):
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    if not token:
        print('No GITHUB_TOKEN found in environment; cannot open PR')
        return None
    # discover repo from git remote
    remote = run('git remote get-url origin', capture=True)
    # support ssh and https
    if remote.startswith('git@'):
        # git@github.com:owner/repo.git
        remote = remote.split(':', 1)[1]
    if remote.endswith('.git'):
        remote = remote[:-4]
    owner_repo = remote.strip()
    api_url = f'https://api.github.com/repos/{owner_repo}/pulls'
    data = json.dumps({
        'title': title,
        'head': branch,
        'base': base,
        'body': body,
        'draft': True
    }).encode('utf-8')
    req = urllib.request.Request(api_url, data=data, method='POST')
    req.add_header('Authorization', f'token {token}')
    req.add_header('Accept', 'application/vnd.github+json')
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp_data = json.load(resp)
            print('Opened draft PR:', resp_data.get('html_url'))
            return resp_data
    except Exception as e:
        print('Failed to open PR:', e)
        return None


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dry-run', action='store_true', default=False)
    p.add_argument('--push', action='store_true', help='push branch to origin')
    p.add_argument('--open-pr', action='store_true', help='open draft PR using GITHUB_TOKEN')
    p.add_argument('--base', default='main')
    args = p.parse_args()

    plan_path = Path('.qmoi_validation') / 'link_update_plan.json'
    if not plan_path.exists():
        print('No plan found at', plan_path)
        sys.exit(1)

    plan = json.loads(plan_path.read_text(encoding='utf-8'))
    if not plan.get('plan'):
        print('Plan empty; nothing to propose')
        sys.exit(0)

    now = datetime.utcnow().strftime('%Y%m%d-%H%M')
    branch = f'link-update/{now}'
    title = f'Link update plan — {now}'
    body = 'Automated draft PR containing proposed link updates. Please review the plan in `.qmoi_validation/link_update_plan.json`.'

    if args.dry_run:
        print('DRY-RUN: would create branch', branch)
        print('DRY-RUN: plan summary:', len(plan['plan']), 'files')
        if args.open_pr:
            print('DRY-RUN: would open draft PR (requires GITHUB_TOKEN)')
        if args.push:
            print('DRY-RUN: would push branch to origin')
        return 0

    # real run
    if not ensure_clean_worktree():
        print('Worktree not clean; please commit or stash changes first')
        sys.exit(2)

    current = git_current_branch()
    create_branch(branch)
    # commit the plan file (it already exists). We include it explicitly to ensure it's in the branch
    add_and_commit([str(plan_path)], title)
    if args.push:
        push_branch(branch)
    if args.open_pr:
        open_draft_pr(branch, title, body, base=args.base)

    # checkout back to original branch
    if current:
        run(f'git checkout {current}')

    print('Done')


if __name__ == '__main__':
    main()
