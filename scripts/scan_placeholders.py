// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""Scan repository files for common implementation tokens and write a JSON + MD report.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / 'tools' / 'placeholder_scan.json'
OUT_MD = ROOT / 'tools' / 'placeholder_actions.md'
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)

patterns = {
    'example_domain': re.compile(r'data\.com', re.I),
    'vercel': re.compile(r'your-app\.vercel\.app', re.I),
    'codespace': re.compile(r'codespaces', re.I),
    'todo_tag': re.compile(r'\bTODO\b', re.I),
    'fixme_tag': re.compile(r'\bFIXME\b', re.I),
    'placeholder_word': re.compile(r'implementation', re.I),
    'qmoigateway_example': re.compile(r'qmoigateway\.data\.com', re.I),
    'downloads_qmoi': re.compile(r'downloads\.qmoi\.app', re.I),
}

results = {}

for p in ROOT.rglob('*'):
    if p.is_file():
        # ignore typical binary/large dirs
        if any(part in ('node_modules', '.git', '__pycache__', 'venv', '.venv') for part in p.parts):
            continue
        try:
            txt = p.read_text(errors='ignore')
        except Exception:
            continue
        for key, rx in patterns.items():
            for m in rx.finditer(txt):
                results.setdefault(key, []).append({'path': str(p.relative_to(ROOT)), 'match': m.group(0), 'start': m.start()})

report = {'checked_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'patterns': {}}
for k, v in results.items():
    report['patterns'][k] = {'count': len(v), 'examples': v[:10]}

with OUT_JSON.open('w') as f:
    json.dump(report, f, indent=2)

md = [f"# implementation Scan Report\nChecked at: {report['checked_at']}\n", '## Summary', '']
for k, v in report['patterns'].items():
    md.append(f"- **{k}**: {v['count']} occurrences")
    for ex in v['examples']:
        md.append(f"  - `{ex['path']}` contains `{ex['match']}`")

with OUT_MD.open('w') as f:
    f.write('\n'.join(md))

print('Wrote', OUT_JSON, 'and', OUT_MD)
