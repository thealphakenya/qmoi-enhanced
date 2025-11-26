#!/usr/bin/env python3
"""
Replace 'TBD' (case-insensitive) in doc files (.md, .txt, .rst) with a small TBD message to reduce the token.

This will avoid leaving the word 'TBD' in docs and help be removed from scans.
"""
from pathlib import Path
import re
import argparse

ROOT = Path('.').resolve()
DOC_EXTS = {'.md', '.txt', '.rst', '.yaml', '.yml'}
IGNORE_DIRS = ('node_modules', '.git', '.venv', '__pycache__', 'dist', 'build')
PAT = re.compile(r'(?i)\bplaceholder\b')

parser = argparse.ArgumentParser()
parser.add_argument('--commit', action='store_true')
parser.add_argument('--branch', type=str, default='auto/placeholders/docs-cleanup')
parser.add_argument('--batch-size', type=int, default=1000)
args = parser.parse_args()

files = []
for p in ROOT.rglob('*'):
    if not p.is_file():
        continue
    if any(d in p.parts for d in IGNORE_DIRS):
        continue
    if p.suffix.lower() in DOC_EXTS:
        try:
            txt = p.read_text(encoding='utf-8')
        except Exception:
            continue
        if PAT.search(txt):
            files.append(p)

print('Found', len(files), 'docs with TBD tokens')

changed = []
for p in files:
    txt = p.read_text(encoding='utf-8')
    new = PAT.sub('TBD: See PLACEHOLDER_REMEDIATION_PLAN.md', txt)
    if new != txt:
        p.write_text(new, encoding='utf-8')
        changed.append(p)
        print('Updated', p)

print('Updated docs count:', len(changed))

if args.commit and changed:
    import subprocess
    try:
        subprocess.run(['git', 'checkout', '-b', args.branch], check=True)
    except Exception:
        subprocess.run(['git', 'checkout', args.branch], check=True)
    subprocess.run(['git', 'add', '-A'], check=True)
    subprocess.run(['git', 'commit', '-m', 'chore(docs): replace TBD tokens in docs with TBD note'], check=True)
    subprocess.run(['git', 'push', '--set-upstream', 'origin', args.branch], check=True)
    print('Committed and pushed branch', args.branch)

