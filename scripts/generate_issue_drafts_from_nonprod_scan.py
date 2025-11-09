#!/usr/bin/env python3
"""Generate issue-draft markdown files from `.qmoi_validation/nonprod_scan_removed_second.txt`.

This is a small, robust generator that:
- reads the removed list and generates `tools/issue_drafts/NNN_<sanitized>.md` files
- includes a short excerpt from the file (first 2KB) to help reviewers
- is safe and idempotent (overwrites if present)
"""
from pathlib import Path
import re
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / '.qmoi_validation' / 'nonprod_scan_removed_second.txt'
OUT = ROOT / 'tools' / 'issue_drafts'
OUT.mkdir(parents=True, exist_ok=True)


def sanitize(s: str) -> str:
    s = s.replace('/', '_').replace(' ', '_')
    s = re.sub(r'[^A-Za-z0-9_\-\.]+', '', s)
    return s


TEMPLATE = '''---
title: "Issue draft for {file}"
generated: {ts}
---

# Review needed: {file}

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
{excerpt}
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
'''


def main():
    if not INPUT.exists():
        print(f"No input file at {INPUT}")
        return 1
    lines = [l.strip() for l in INPUT.read_text(encoding='utf-8').splitlines() if l.strip()]
    # first line may be removed_count=...
    if lines and lines[0].startswith('removed_count='):
        lines = lines[1:]
    for idx, path in enumerate(lines, start=1):
        try:
            p = ROOT / path
            excerpt = ''
            if p.exists() and p.is_file() and p.stat().st_size < 2 * 1024 * 1024:
                try:
                    excerpt = p.read_text(errors='replace')[:2048]
                except Exception:
                    excerpt = '<could not read file excerpt>'
            name = f"{idx:04d}_{sanitize(path)}.md"
            outp = OUT / name
            outp.write_text(TEMPLATE.format(file=path, ts=datetime.utcnow().isoformat() + 'Z', excerpt=excerpt), encoding='utf-8')
        except Exception as e:
            print('skipped', path, 'error', e)
    print(f'Generated {len(lines)} issue drafts to {OUT}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
