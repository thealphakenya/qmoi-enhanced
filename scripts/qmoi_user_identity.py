#!/usr/bin/env python3
"""QMOI User Identity Detection

Conservative utility to infer who is using the repository (local operator)
and assign a role if possible (master, sister, leah, developer, unknown).

It collects:
- `USER` / `LOGNAME` / `GIT_AUTHOR_NAME` / git config user.name
- environment hints from `.env` or repository files
- the current git user/email and recent commit authors

Outputs a JSON file at `.qmoi_state/user_identity.json` with detected
fields and confidence hints. Non-destructive.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / '.qmoi_state'
OUT_DIR.mkdir(parents=True, exist_ok=True)


def run(cmd):
    try:
        out = subprocess.check_output(cmd, shell=True, cwd=ROOT, stderr=subprocess.DEVNULL)
        return out.decode('utf8', errors='replace').strip()
    except Exception:
        return ''


def detect_from_env():
    candidates = {}
    for k in ('USER', 'LOGNAME', 'GIT_AUTHOR_NAME', 'GIT_COMMITTER_NAME'):
        v = os.environ.get(k)
        if v:
            candidates[k] = v
    # scan .env and .env.* files for common identity vars
    for p in ROOT.glob('.env*'):
        try:
            txt = p.read_text(encoding='utf8', errors='replace')
            for m in re.findall(r'(^|\n)\s*(?:USER|USERNAME|GIT_USER|MASTER|QMOI_MASTER)\s*=\s*(.+)', txt, re.I):
                candidates[f'env:{p.name}:{m[0]}'] = m[1].strip()
        except Exception:
            pass
    return candidates


def detect_from_git():
    info = {}
    name = run('git config user.name')
    email = run('git config user.email')
    info['git_user_name'] = name
    info['git_user_email'] = email
    # recent commit authors
    log = run('git log -n 20 --pretty=format:"%an|%ae"')
    authors = []
    for line in log.splitlines():
        if '|' in line:
            an, ae = line.split('|', 1)
            authors.append({'name': an.strip(), 'email': ae.strip()})
    info['recent_authors'] = authors
    return info


def choose_role(name_candidates):
    # naive heuristics: master names -> 'master', sister/leah -> 'sister'
    if not name_candidates:
        return {'role': 'unknown', 'why': 'no_candidates'}
    lowered = [n.lower() for n in name_candidates if n]
    for n in lowered:
        if any(k in n for k in ('master', 'themaster', 'qmoi master', 'alpha', 'thealphakenya', 'thealpha')):
            return {'role': 'master', 'why': f'name-match:{n}'}
    for n in lowered:
        if any(k in n for k in ('sister', 'leah', 'leahwallet', 'leah')):
            return {'role': 'sister', 'why': f'name-match:{n}'}
    # if a git user exists and email domain is personal, classify as developer
    for n in lowered:
        if re.search(r'\b(dev|devops|developer|victor|kwemoi|thevictor|vic)\b', n):
            return {'role': 'developer', 'why': f'name-match:{n}'}
    # fallback to first candidate
    return {'role': 'unknown', 'why': f'fallback:{lowered[0]}'}


def main():
    out = {'detected_at': datetime.utcnow().isoformat() + 'Z', 'candidates': {}, 'git': {}, 'role': {}}
    env = detect_from_env()
    out['candidates']['env'] = env
    git = detect_from_git()
    out['git'] = git

    name_list = []
    if env:
        for v in env.values():
            name_list.append(v)
    if git.get('git_user_name'):
        name_list.append(git.get('git_user_name'))
    for a in git.get('recent_authors', []):
        if a.get('name'):
            name_list.append(a.get('name'))

    role = choose_role(name_list)
    out['role'] = role

    out_path = OUT_DIR / 'user_identity.json'
    with out_path.open('w', encoding='utf8') as f:
        json.dump(out, f, indent=2)
    print('Wrote', out_path)


if __name__ == '__main__':
    main()
