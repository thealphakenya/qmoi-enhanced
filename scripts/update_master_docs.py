#!/usr/bin/env python3
"""Update Master/Sister related Markdown files

This script searches the repository for Markdown files that mention roles
like 'master', 'sister', 'leah', 'thealpha' and creates a safe, reversible
update:

- By default runs in dry-run mode and writes a report to
  `reports/master_docs_update_report.json`.
- With `--apply` it updates files by adding or updating a YAML-like
  metadata block at the top containing `qmo i_owner` and `qmo i_role`.

All changes are backed up as `*.bak` files before modification.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'reports'
REPORTS.mkdir(parents=True, exist_ok=True)

KEYWORDS = ['master', 'sister', 'leah', 'thealpha', 'thealphakenya', 'qmoi', 'alpha']


def scan_md_files():
    found = []
    for p in ROOT.rglob('*.md'):
        try:
            txt = p.read_text(encoding='utf8', errors='replace')
        except Exception:
            continue
        low = txt.lower()
        if any(k in low for k in KEYWORDS):
            found.append(p)
    return sorted(found)


def make_frontmatter(owner, role):
    return f"""<!-- QMOI_OWNER_START -->
owner: {owner}
role: {role}
updated_at: {datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}
<!-- QMOI_OWNER_END -->\n\n"""


def detect_owner_role(text):
    t = text.lower()
    if 'master' in t or 'thealpha' in t or 'thealphakenya' in t:
        return ('master', 'master')
    if 'sister' in t or 'leah' in t:
        return ('leah', 'sister')
    # fallback
    return ('unknown', 'unknown')


def update_file(path: Path, frontmatter: str):
    bak = path.with_suffix(path.suffix + '.bak')
    if not bak.exists():
        path.replace(path)  # noop to ensure readability
    txt = path.read_text(encoding='utf8', errors='replace')
    # remove existing QMOI_OWNER blocks
    newtxt = re.sub(r'<!-- QMOI_OWNER_START -->.*?<!-- QMOI_OWNER_END -->\n\n', '', txt, flags=re.S)
    newtxt = frontmatter + newtxt
    # backup original
    path.with_suffix(path.suffix + '.bak').write_text(txt, encoding='utf8')
    path.write_text(newtxt, encoding='utf8')


def main(apply: bool):
    files = scan_md_files()
    report = {'scanned_at': datetime.utcnow().isoformat() + 'Z', 'files': []}
    for p in files:
        txt = p.read_text(encoding='utf8', errors='replace')
        owner, role = detect_owner_role(txt)
        entry = {'path': str(p.relative_to(ROOT)), 'owner': owner, 'role': role}
        if apply:
            fm = make_frontmatter(owner, role)
            try:
                update_file(p, fm)
                entry['updated'] = True
            except Exception as e:
                entry['updated'] = False
                entry['error'] = str(e)
        report['files'].append(entry)

    out = REPORTS / 'master_docs_update_report.json'
    out.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote report', out)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true', help='Apply changes (writes backups *.bak)')
    args = ap.parse_args()
    main(args.apply)
