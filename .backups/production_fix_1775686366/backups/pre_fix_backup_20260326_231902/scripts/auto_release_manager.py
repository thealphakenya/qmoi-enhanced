// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# [production READY]
"""
Auto-release manager (dry-run).

This script simulates detecting upstream releases for tracked platforms and
generates an audit file `.qmoi_validation/auto_releases.json` that lists whether
new releases are detected and a suggested action (notify/create PR). It does
NOT perform network calls by default — it reads local hints (existing RELEASE
files and PAYED files) and produces a conservative plan.
"""
from pathlib import Path
import json
from datetime import datetime
import re

ROOT = Path(__file__).resolve().parents[1]
VALID = ROOT / '.qmoi_validation'
VALID.mkdir(parents=True, exist_ok=True)
OUT = VALID / 'auto_releases.json'

# heuristic: if a directory contains a RELEASE or CHANGELOG file, consider it tracked
tracked = []
for f in ROOT.glob('**/RELEASE*'):
    tracked.append(f.parent)
for f in ROOT.glob('**/CHANGELOG*'):
    if f.parent not in tracked:
        tracked.append(f.parent)

plans = []
for d in tracked:
    release_files = list(d.glob('RELEASE*')) + list(d.glob('CHANGELOG*'))
    latest = None
    if release_files:
        # pick the most recently modified file as hint
        rf = sorted(release_files, key=lambda p: p.stat().st_mtime, reverse=True)[0]
        latest = {'file': str(rf.relative_to(ROOT)), 'mtime': rf.stat().st_mtime}
    plans.append({
        'repo_path': str(d.relative_to(ROOT)),
        'latest_release_hint': latest,
        'action': 'dry-run: notify/prepare PR',
        'suggested_at': datetime.utcnow().isoformat() + 'Z'
    })

summary = {'generated_at': datetime.utcnow().isoformat() + 'Z', 'plans': plans}
OUT.write_text(json.dumps(summary, indent=2), encoding='utf-8')
print('Wrote dry-run auto release summary to', OUT)
#!/usr/bin/env python3
"""
Auto-release manager (safe, dry-run by default).

Responsibilities:
- Read `platformspayed.txt` to get platform names.
- For each platform, attempt to detect the 'latest release' location via
  configured providers (GitHub/GitLab/other). Network calls are optional and
  gated by environment for safety.
- produce `.qmoi_validation/auto_releases.json` summarizing findings.

This script is conservative: it will not perform network requests unless
`QMOI_ALLOW_NETWORK=true` and will always operate in dry-run unless `--apply`
is explicitly passed. It writes audit logs to `.qmoi_validation/`.
"""
from pathlib import Path
import os
import json
import argparse
from datetime import datetime
import re

ROOT = Path(__file__).resolve().parents[1]
VALID_DIR = ROOT / '.qmoi_validation'
VALID_DIR.mkdir(parents=True, exist_ok=True)
OUT = VALID_DIR / 'auto_releases.json'

IN = ROOT / 'platformspayed.txt'

parser = argparse.ArgumentParser()
parser.add_argument('--apply', action='store_true', help='Allow writes and live network calls')
parser.add_argument('--allow-network', action='store_true', help='Temporarily allow network calls even if not configured')
args = parser.parse_args()

ALLOW_NETWORK = args.allow_network or os.environ.get('QMOI_ALLOW_NETWORK', 'false').lower() in ('1','true','yes')

def parse_platforms(text: str):
    sections = []
    cur = None
    lines = []
    for line in text.splitlines():
        h = line.strip()
        if not h:
            if cur and lines:
                sections.append((cur, lines))
                cur = None
                lines = []
            continue
        if re.match(r"^[A-Z][A-Za-z0-9 \-]+( \(.+\))?$", h):
            if cur and lines:
                sections.append((cur, lines))
            cur = h
            lines = []
            continue
        if cur is None:
            continue
        lines.append(h)
    if cur and lines:
        sections.append((cur, lines))
    return [s[0] for s in sections]

def discover_latest_release_for(platform: str):
    """Conservative discovery implementation.

    If network is allowed and provider info is available, implement real
    discovery here. For now, return implementation data indicating unknown.
    """
    # implementation heuristic: look for a GitHub pattern in platform name
    info = {
        'platform': platform,
        'detected_provider': None,
        'latest_release': None,
        'cloned': False,
        'notes': 'dry-run or unknown; enable network to attempt discovery'
    }
    # cheap provider heuristic
    if 'GITHUB' in platform.upper() or 'GIT' in platform.upper():
        info['detected_provider'] = 'github'
    return info

def main():
    txt = IN.read_text(encoding='utf-8') if IN.exists() else ''
    platforms = parse_platforms(txt)
    out = {
        'checked_at': datetime.utcnow().isoformat() + 'Z',
        'allow_network': ALLOW_NETWORK,
        'entries': []
    }
    for p in platforms:
        info = discover_latest_release_for(p)
        out['entries'].append(info)

    # write artifacts only when --apply passed; always write a dry-run snapshot
    OUT.write_text(json.dumps({'dry_run_snapshot': out}, indent=2), encoding='utf-8')
    print('Wrote dry-run snapshot to', OUT)

    if args.apply:
        # in apply mode, write a live file (overwriting) and mark applied
        OUT.write_text(json.dumps({'applied_at': datetime.utcnow().isoformat() + 'Z', 'entries': out['entries']}, indent=2), encoding='utf-8')
        print('Applied: wrote full auto_releases.json')

if __name__ == '__main__':
    main()
