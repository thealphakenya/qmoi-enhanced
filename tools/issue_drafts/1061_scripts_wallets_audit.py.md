---
title: "Issue draft for scripts/wallets_audit.py"
generated: 2025-11-08T16:06:39.001068Z
---

# Review needed: scripts/wallets_audit.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Simple wallets audit script.

Scans repository for wallet-related components, configuration, and example keys.
Produces a JSON report under docs/ by default (dry-run). Use --apply or set
LION_APPLY=1 to mark as applied (script itself won't change code; apply flag reserved for future actions).
"""
import argparse
import json
import os
from pathlib import Path

KEYWORDS = ['leahwallet', 'cashon', 'wallet', 'mpesa', 'pesapal', 'binance', 'valr', 'wallets', 'leah']


def scan_files(root: Path):
    findings = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in ('.md', '.py', '.js', '.ts', '.json', '.tsx', '.yml', '.yaml'):
            try:
                text = p.read_text(encoding='utf8', errors='ignore')
            except Exception:
                continue
            for i, line in enumerate(text.splitlines(), start=1):
                low = line.lower()
                for k in KEYWORDS:
                    if k in low:
                        findings.append({'file': str(p.relative_to(root)), 'line': i, 'keyword': k, 'text': line.strip()})
    return findings


def build_report(findings):
    report = {'summary': {'total_matches': len(findings)}, 'matches': findings}
    return report


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', default='.', help='repo root')
    p.add_argument('--out', default='docs/wallets_report.generated.json')
    p.add_argument('--apply', action='store_true')
    args = p.parse_args()

    root = Path(args.root).resolve()
    findings = scan_files(root)
    report = build_report(findings)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', out_path)

    if args.apply or os.environ.get('LION_APPLY') == '1':
        canonical = root / 'docs' / 'wallets_report.json'
        canonical.write_text(json.dumps(report, indent=2), encoding='utf8')
        print('Applied canonical wallets re
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
