#!/usr/bin/env python3
"""Generate reports/placeholders_remaining.json listing remaining placeholder hits.
"""
import json,os,re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
P = ROOT / 'placeholder_scan_report.json'
OUTDIR = ROOT / 'reports'
OUTDIR.mkdir(exist_ok=True)
OUT = OUTDIR / 'placeholders_remaining.json'

if not P.exists():
    print('no scan report')
    raise SystemExit(1)

j = json.load(open(P, 'r', encoding='utf-8'))
remaining = []
PAT = re.compile(r"\b(TODO|FIXME|PLACEHOLDER|REPLACEME)\b", re.I)

for r in j.get('results', []):
    hits = r.get('hits', [])
    for h in hits:
        pat = h.get('pattern', '')
        # normalize pattern by stripping regex escapes and check for our tokens
        if PAT.search(pat):
            remaining.append(r)
            break

out_data = {
    'generated_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
    'count': len(remaining),
    'results': remaining,
}

open(OUT, 'w', encoding='utf-8').write(json.dumps(out_data, indent=2))
print('Wrote', OUT, 'count=', len(remaining))
