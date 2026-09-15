---
title: "Issue draft for scripts/scan_lion_usage.py"
generated: 2025-11-08T16:06:38.987330Z
---

# Review needed: scripts/scan_lion_usage.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Scan the repository for LION usage and related artifacts.

Produces `docs/lion_usage_report.json` with occurrences for quick triage.

This is conservative: read-only and safe to run in CI or locally.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'lion_usage_report.json'

PATTERNS = [
    r'\bLION\b',
    r'\blion\b',
    r'lionctl',
    r'lionlaunch',
    r'LIONOPERAT',
    r'LionOperating',
]

def scan_root(root: Path):
    report = {'root': str(root), 'checked_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'matches': {}}
    for p in PATTERNS:
        report['matches'][p] = []

    for path in root.rglob('*'):
        if path.is_file():
            try:
                text = path.read_text(encoding='utf8', errors='ignore')
            except Exception:
                continue
            for pat in PATTERNS:
                if re.search(pat, text):
                    report['matches'][pat].append({'path': str(path), 'snippet': _grab_snippet(text, pat)})
    return report

def _grab_snippet(text, pat, max_len=160):
    m = re.search(pat, text)
    if not m:
        return ''
    start = max(0, m.start() - 40)
    end = min(len(text), m.end() + 40)
    return text[start:end].replace('\n', ' ')[:max_len]

def main():
    report = scan_root(ROOT)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', OUT)

if __name__ == '__main__':
    main()

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
