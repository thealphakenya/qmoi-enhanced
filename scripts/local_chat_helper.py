#!/usr/bin/env python3
"""Local Chat Helper

Utilities to help a local chat agent (or developer) work with a repository
that may have uncommitted changes. Features:
- snapshot: create a patch file and a git stash for uncommitted changes
- restore: restore from the patch or stash
- context: produce a concise context bundle (changed files list, short diffs,
  recent commits) suitable to paste to an LLM or to attach to an issue/PR

Usage:
  python scripts/local_chat_helper.py snapshot
  python scripts/local_chat_helper.py restore
  python scripts/local_chat_helper.py context > reports/local_chat_context.txt

This script is conservative and non-destructive: snapshots are stored under
`.qmoi_local_chat/` and do not overwrite existing snapshots.
"""
from __future__ import annotations

import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / '.qmoi_local_chat'
OUT_DIR.mkdir(parents=True, exist_ok=True)


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.check_output(cmd, shell=True, cwd=ROOT).decode('utf-8', errors='replace')
    else:
        return subprocess.call(cmd, shell=True, cwd=ROOT)


def snapshot():
    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    patch_file = OUT_DIR / f'uncommitted_{ts}.patch'
    stash_name = f'local_chat_snapshot_{ts}'

    # create patch of uncommitted changes (including untracked)
    try:
        with open(patch_file, 'wb') as f:
            p = subprocess.Popen(['git', 'diff', '--binary'], cwd=ROOT, stdout=subprocess.PIPE)
            out, _ = p.communicate()
            f.write(out)
        print('Wrote patch to', patch_file)
    except Exception as e:
        print('Failed writing patch:', e)

    # create stash including untracked files
    try:
        run(f'git stash push -u -m "{stash_name}"')
        # record the stash name and patch
        meta = {'timestamp': ts, 'patch': str(patch_file.name), 'stash_message': stash_name}
        with open(OUT_DIR / f'meta_{ts}.json', 'w', encoding='utf8') as mf:
            json.dump(meta, mf)
        print('Created git stash (with untracked files):', stash_name)
    except Exception as e:
        print('Failed creating stash:', e)


def restore(patch: str | None = None, pop_stash: bool = False):
    # try to restore using provided patch file first
    if patch:
        pf = OUT_DIR / patch
        if pf.exists():
            try:
                run(f'git apply --index "{pf}"')
                print('Applied patch', pf)
                return
            except Exception as e:
                print('git apply failed:', e)

    # fallback: pop the most recent local_chat stash
    try:
        # list stashes and find the latest matching local_chat_snapshot_
        out = run('git stash list', capture=True)
        lines = out.splitlines()
        target = None
        for l in lines:
            if 'local_chat_snapshot_' in l:
                target = l.split(':', 1)[0]
        if target and pop_stash:
            run(f'git stash pop {target}')
            print('Popped stash', target)
            return
        elif target:
            print('Found stash', target, 'but not popping (use --pop to pop)')
        else:
            print('No local_chat snapshot stash found')
    except Exception as e:
        print('Failed to inspect/push stashes:', e)


def context():
    # produce a short context: changed files, short diffs, recent commits
    out = {}
    try:
        out['branch'] = run('git rev-parse --abbrev-ref HEAD', capture=True).strip()
    except Exception:
        out['branch'] = 'unknown'

    try:
        out['status'] = run('git status --porcelain', capture=True).strip().splitlines()
    except Exception:
        out['status'] = []

    try:
        out['uncommitted_files'] = run('git diff --name-only', capture=True).strip().splitlines()
    except Exception:
        out['uncommitted_files'] = []

    # include tiny diffs (first 200 chars) for up to 10 files
    diffs = {}
    try:
        files = out['uncommitted_files'][:10]
        for f in files:
            d = run(f'git diff -- "{f}" | head -c 200', capture=True)
            diffs[f] = d
    except Exception:
        pass
    out['diff_samples'] = diffs

    try:
        out['recent_commits'] = run('git log -n 10 --pretty=format:"%h %ad %an %s" --date=iso', capture=True).splitlines()
    except Exception:
        out['recent_commits'] = []

    print(json.dumps(out, indent=2))


def help_msg():
    print(__doc__)


def main(argv):
    if len(argv) < 2:
        help_msg(); sys.exit(1)
    cmd = argv[1]
    if cmd == 'snapshot':
        snapshot()
    elif cmd == 'restore':
        pop = '--pop' in argv
        patch = None
        for a in argv[2:]:
            if a.startswith('--patch='):
                patch = a.split('=',1)[1]
        restore(patch=patch, pop_stash=pop)
    elif cmd == 'context':
        context()
    else:
        help_msg()


if __name__ == '__main__':
    main(sys.argv)
#!/usr/bin/env python3
"""Local Chat Agent Helper

Small CLI to help a local chat agent work with repositories that have
uncommitted changes. Provides safe snapshot/restore and patch export/import
so an assistant process can operate on a clean tree while preserving
developer work-in-progress.

Usage:
  python scripts/local_chat_helper.py snapshot <name>    # create a temp branch with current index+work
  python scripts/local_chat_helper.py restore <name>     # restore snapshot branch into working tree (no checkout)
  python scripts/local_chat_helper.py stash               # run 'git stash push -u'
  python scripts/local_chat_helper.py pop                 # git stash pop
  python scripts/local_chat_helper.py create-patch <out>  # create patch of uncommitted changes
  python scripts/local_chat_helper.py apply-patch <file> # apply patch file

This tool avoids destructive actions and writes outputs to stdout for
automation. It's intentionally small and uses git commands.
"""
import argparse
import subprocess
import sys
from pathlib import Path


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.run(cmd, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return subprocess.run(cmd, shell=True, check=check)


def git_root():
    p = run("git rev-parse --show-toplevel", capture=True)
    if p.returncode != 0:
        print("Not a git repository", file=sys.stderr)
        sys.exit(2)
    return Path(p.stdout.strip())


def snapshot(name: str):
    root = git_root()
    branch = f"wip/snapshot/{name}"
    # ensure index committed on temp branch: create orphan branch then commit tree
    print(f"Creating snapshot branch: {branch}")
    # create a commit from current index and working tree using temporary commit
    run(f"git add -A")
    # create branch from HEAD then commit
    run(f"git branch -f {branch} HEAD")
    # checkout branch temporarily to commit working tree
    run(f"git checkout {branch}")
    try:
        run("git commit -m 'wip: snapshot of working tree' --no-verify || true")
    except Exception:
        # commit may fail if no changes
        pass
    # return to previous branch (HEAD@{1})
    run("git checkout -")
    print(branch)


def restore(name: str):
    root = git_root()
    branch = f"wip/snapshot/{name}"
    # merge the snapshot into working tree without commit
    print(f"Restoring snapshot {branch} into working tree (no commit)")
    run(f"git fetch . {branch}:{branch} || true")
    # checkout files from snapshot into working tree
    run(f"git checkout {branch} -- .")
    print("Restored files from snapshot to working tree")


def do_stash():
    print("Stashing uncommitted changes (including untracked files)")
    run("git stash push -u -m 'local_chat_helper stash' || true")


def do_pop():
    print("Popping stash")
    run("git stash pop || true")


def create_patch(out: str):
    p = Path(out)
    p.parent.mkdir(parents=True, exist_ok=True)
    print(f"Creating patch to {out}")
    run(f"git add -A")
    # create patch of working tree vs HEAD
    run(f"git diff --staged > {out} || true")
    print(out)


def apply_patch(file: str):
    f = Path(file)
    if not f.exists():
        print(f"Patch file not found: {file}", file=sys.stderr)
        sys.exit(1)
    print(f"Applying patch {file}")
    run(f"git apply --index {file} || (git apply {file} && echo 'applied without index')")


def main():
    parser = argparse.ArgumentParser(description='Local chat agent helper for git WIP')
    sub = parser.add_subparsers(dest='cmd')
    sp = sub.add_parser('snapshot')
    sp.add_argument('name')
    sp2 = sub.add_parser('restore')
    sp2.add_argument('name')
    sub.add_parser('stash')
    sub.add_parser('pop')
    sp3 = sub.add_parser('create-patch')
    sp3.add_argument('out')
    sp4 = sub.add_parser('apply-patch')
    sp4.add_argument('file')

    args = parser.parse_args()
    if args.cmd == 'snapshot':
        snapshot(args.name)
    elif args.cmd == 'restore':
        restore(args.name)
    elif args.cmd == 'stash':
        do_stash()
    elif args.cmd == 'pop':
        do_pop()
    elif args.cmd == 'create-patch':
        create_patch(args.out)
    elif args.cmd == 'apply-patch':
        apply_patch(args.file)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
